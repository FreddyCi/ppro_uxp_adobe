# Azure Storage Authentication Limitations in Browser/UXP

## Problem Summary

When trying to generate SAS tokens client-side using the Azure Storage SDK for JavaScript, we discovered critical limitations in the **browser build** of `@azure/storage-blob`.

## Authentication Error

```
RestError: AuthenticationFailed
Message: Server failed to authenticate the request. Make sure the value of Authorization header is formed correctly including the signature.
AuthenticationErrorDetail: Only authentication scheme Bearer is supported
```

## Root Cause

### 1. **Adobe IMS ≠ Azure AD**
- The UXP panel uses **Adobe IMS** (Identity Management System) for Adobe services authentication
- Azure Storage user delegation keys require **Azure AD** (Azure Active Directory) Bearer tokens
- These are two completely separate authentication systems
- An Adobe IMS token cannot be used to authenticate with Azure Storage

### 2. **Browser Build Limitations**
The browser build of `@azure/storage-blob` does **NOT** export:
- `StorageSharedKeyCredential` - Cannot use account keys client-side
- `BlobSASPermissions` - Cannot parse permission objects
- `ContainerSASPermissions` - Cannot parse permission objects  
- `SASProtocol` - Cannot specify https/http
- `generateBlobSASQueryParameters` - Cannot generate SAS tokens from account keys

These are only available in the **Node.js build**.

## Available Options

### Option 1: Pre-generated Container SAS Tokens ⭐ **RECOMMENDED FOR NOW**
**Pros:**
- Simple to implement
- No backend service needed
- Works in browser/UXP

**Cons:**
- Must manually rotate tokens
- Single token for entire container (less granular control)
- Security risk if token is compromised

**Implementation:**
1. Generate container-level SAS token in Azure Portal
2. Add to `.env` as `VITE_AZURE_CONTAINER_SAS_TOKEN`
3. Append SAS token to blob URLs for upload

### Option 2: Backend Service for SAS Generation
**Pros:**
- Dynamic token generation
- Granular blob-level permissions
- Can rotate tokens automatically
- Better security

**Cons:**
- Requires deploying/maintaining backend
- Additional infrastructure cost
- Network latency for token requests

**Implementation:**
- Azure Function
- AWS Lambda
- Node.js Express server
- Hosted on Azure App Service, Vercel, etc.

### Option 3: Azure AD + MSAL.js (Complex)
**Pros:**
- Proper Azure AD authentication
- User delegation keys
- Enterprise-grade security

**Cons:**
- Requires separate Azure AD login flow
- Complex implementation
- Users need Azure AD accounts
- Confusing UX (two separate logins: Adobe IMS + Azure AD)

## Recommended Solution

**For immediate use:** Option 1 (Pre-generated SAS tokens)
**For production:** Option 2 (Backend service)

### Quick Fix: Pre-generated SAS Tokens

1. **Generate SAS token in Azure Portal:**
   ```
   Storage Account → Containers → Select Container → Shared access tokens
   - Permissions: Read, Write, Delete, List
   - Expiry: 30-90 days
   - Generate SAS token
   ```

2. **Add to `.env`:**
   ```env
   VITE_AZURE_CONTAINER_SAS_TOKEN=sv=2022-11-02&ss=b&srt=sco&sp=rwdlac&se=2025-12-31T23:59:59Z&st=2025-01-01T00:00:00Z&spr=https&sig=...
   ```

3. **Update `AzureSDKBlobService.ts`:**
   ```typescript
   const sasToken = import.meta.env.VITE_AZURE_CONTAINER_SAS_TOKEN
   const blobUrl = `${accountUrl}/${containerName}/${blobName}?${sasToken}`
   
   // Upload using fetch with SAS URL
   await fetch(blobUrl, {
     method: 'PUT',
     headers: { 'x-ms-blob-type': 'BlockBlob' },
     body: data
   })
   ```

### Better Solution: Deploy Backend Service

**Azure Function (TypeScript):**
```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";

export async function generateSasToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const { containerName, blobName, permissions, expirationMinutes } = await request.json();
    
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    
    const sasOptions = {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse(permissions),
        expiresOn: new Date(Date.now() + expirationMinutes * 60 * 1000)
    };
    
    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    
    return {
        jsonBody: {
            sasUrl: `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`,
            sasToken,
            expiresAt: sasOptions.expiresOn.toISOString()
        }
    };
}

app.http('generateSasToken', {
    methods: ['POST'],
    authLevel: 'function',
    handler: generateSasToken
});
```

## Security Considerations

1. **Never commit SAS tokens or account keys to git**
2. **Use environment variables for all secrets**
3. **Rotate SAS tokens regularly (every 30-90 days)**
4. **Use HTTPS only**
5. **Implement rate limiting if using backend service**
6. **Set minimum required permissions**
7. **Monitor Azure Storage access logs**

## Next Steps

1. ✅ Document the browser SDK limitations
2. ⏳ Choose authentication approach (pre-generated SAS vs backend service)
3. ⏳ Implement chosen solution
4. ⏳ Test with real Azure uploads
5. ⏳ Set up token rotation schedule
6. ⏳ Add monitoring/logging
