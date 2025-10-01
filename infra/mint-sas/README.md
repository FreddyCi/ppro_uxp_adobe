# Azure Function: SAS Token Minting Service

This Azure Function provides dynamic SAS token generation for secure blob uploads without exposing storage account keys to client-side code.

## 🎯 Purpose

**Option 2** for production deployment - replaces pre-generated SAS tokens with dynamic, short-lived tokens.

## 📦 Prerequisites

- Azure Functions Core Tools v4
- Node.js 18 or 20
- Azure Storage Account
- Azure Function App (Consumption or Premium plan)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd infra/mint-sas
npm init -y
npm install @azure/storage-blob @azure/functions
npm install -D @types/node typescript
```

### 2. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2021",
    "outDir": "../dist/mint-sas",
    "rootDir": ".",
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. Build

```bash
npm run build
# or
tsc
```

### 4. Test Locally

```bash
# Set environment variables
export AZURE_STORAGE_ACCOUNT=your_account_name
export AZURE_STORAGE_KEY=your_account_key

# Start function
func start
```

Test request:

```bash
curl -X POST http://localhost:7071/api/mint-sas \
  -H "Content-Type: application/json" \
  -d '{
    "container": "my-container",
    "blobName": "luma/test-video.mp4",
    "perms": "cw",
    "ttlMinutes": 15
  }'
```

## 🌐 Deploy to Azure

### Option A: Azure CLI

```bash
# Login
az login

# Create Function App (if not exists)
az functionapp create \
  --resource-group my-resource-group \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name my-sas-minting-service \
  --storage-account mystorage

# Configure app settings
az functionapp config appsettings set \
  --name my-sas-minting-service \
  --resource-group my-resource-group \
  --settings \
    AZURE_STORAGE_ACCOUNT=your_account_name \
    AZURE_STORAGE_KEY=your_account_key

# Deploy
func azure functionapp publish my-sas-minting-service
```

### Option B: VS Code

1. Install Azure Functions extension
2. Click "Deploy to Function App" in Azure panel
3. Set app settings in Azure Portal

## 🔧 Client Integration

Update your UXP panel to use the minting service:

### 1. Add Environment Variable

```env
VITE_SAS_MINT_ENDPOINT=https://my-sas-minting-service.azurewebsites.net/api/mint-sas?code=<function-key>
```

### 2. Update Upload Helper

Create `src/services/dynamicSasUpload.ts`:

```typescript
import { BlockBlobClient } from '@azure/storage-blob'

async function mintSas(
  container: string,
  blobName: string,
  ttlMinutes = 15
): Promise<string> {
  const endpoint = import.meta.env.VITE_SAS_MINT_ENDPOINT

  if (!endpoint) {
    throw new Error('VITE_SAS_MINT_ENDPOINT not configured')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      container,
      blobName,
      perms: 'cw',
      ttlMinutes,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Mint SAS failed: ${error.error}`)
  }

  const { url } = await response.json()
  return url
}

export async function uploadBytesWithDynamicSAS(
  container: string,
  blobName: string,
  data: ArrayBuffer | Uint8Array,
  contentType?: string
): Promise<string> {
  // Get fresh SAS URL for this upload
  const sasUrl = await mintSas(container, blobName, 15)

  // Upload directly
  const client = new BlockBlobClient(sasUrl)
  await client.uploadData(data, {
    blobHTTPHeaders: {
      blobContentType: contentType ?? 'application/octet-stream',
    },
  })

  return client.url
}
```

### 3. Update prepareKeyframeUrl

```typescript
// Use dynamic SAS if endpoint is configured, else fall back to pre-generated
const sasEndpoint = import.meta.env.VITE_SAS_MINT_ENDPOINT

if (sasEndpoint) {
  const uploadedUrl = await uploadBytesWithDynamicSAS(
    containerName,
    blobName,
    fileData,
    contentType
  )
} else {
  // Fallback to pre-generated SAS from env
  const uploadedUrl = await uploadBytes(blobName, fileData, contentType)
}
```

## 🔐 Security

### Function Key Protection

Get the function key:

```bash
az functionapp keys list \
  --name my-sas-minting-service \
  --resource-group my-resource-group
```

Use the key in requests:

```
https://my-sas-minting-service.azurewebsites.net/api/mint-sas?code=<function-key>
```

### CORS Configuration

If calling from browser:

```bash
az functionapp cors add \
  --name my-sas-minting-service \
  --resource-group my-resource-group \
  --allowed-origins "https://yourdomain.com"
```

### Rate Limiting

Configure in `host.json`:

```json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "routePrefix": "api",
      "maxConcurrentRequests": 100,
      "maxOutstandingRequests": 200
    }
  },
  "functionTimeout": "00:00:30"
}
```

## 📊 Monitoring

### View Logs

```bash
az functionapp log tail \
  --name my-sas-minting-service \
  --resource-group my-resource-group
```

### Application Insights

Enable in Azure Portal → Function App → Application Insights → Enable

Track metrics:
- Request rate
- Success/failure ratio
- Response time
- Error rate

## 🧪 Testing

Test the deployed function:

```bash
curl -X POST "https://my-sas-minting-service.azurewebsites.net/api/mint-sas?code=<function-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "container": "luma-keyframes",
    "blobName": "test/image-123.jpg",
    "perms": "cw",
    "ttlMinutes": 15
  }'
```

Expected response:

```json
{
  "url": "https://account.blob.core.windows.net/container/blob?sv=...&sig=...",
  "expiresOn": "2025-10-01T03:15:00.000Z"
}
```

## 💰 Cost Optimization

**Consumption Plan:**
- First 1M executions/month: Free
- Additional: $0.20 per million executions
- ~$0.000016 per GB-second

**Typical costs for 10,000 uploads/month:**
- Executions: Free (under 1M)
- Compute: ~$0.50
- **Total: < $1/month**

## 🔄 Migration Path

1. **Phase 1:** Deploy function, keep using pre-generated SAS
2. **Phase 2:** Add `VITE_SAS_MINT_ENDPOINT` to .env
3. **Phase 3:** Update code to try minting first, fall back to pre-generated
4. **Phase 4:** Remove pre-generated SAS once minting is stable
5. **Phase 5:** Remove SASTokenService.ts completely

## 📚 References

- [Azure Functions TypeScript Guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node)
- [Azure Storage SAS Documentation](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)
- [Blob SAS Permissions](https://learn.microsoft.com/en-us/rest/api/storageservices/create-service-sas#permissions-for-a-blob)
