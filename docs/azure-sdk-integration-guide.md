# Azure SDK Blob Service - Integration Guide

## 🎯 **T023.5: Complete Implementation**

The Azure SDK Blob Service is now **fully implemented** and integrated into the UXP panel codebase with IMS authentication.

## 📦 **Available Exports**

### **Services:**
```typescript
import {
  AzureSDKBlobService,
  createAzureSDKBlobService
} from '@/services/blob'
```

### **Types:**
```typescript
import type {
  AzureSDKBlobConfig,
  AzureBlobUploadResponse,
  AzureBlobDownloadResponse,
  AzureBlobInfo,
  AzureBlobError,
  StorageAccountStats
} from '@/types'
```

## 🚀 **Quick Start**

### **1. Basic Setup:**
```typescript
import { createAzureSDKBlobService } from '@/services/blob'
import { imsService } from '@/services/ims'

// Create service instance
const azureBlobService = createAzureSDKBlobService(imsService)
```

### **2. Upload with Resilience:**
```typescript
const file = new File([buffer], 'user-image.jpg', { type: 'image/jpeg' })

try {
  const result = await azureBlobService.uploadBlobWithResilience(
    file,
    'uxp-images',
    'user-generated-content.jpg',
    { author: 'user-123', project: 'uxp-panel' }
  )

  console.log('Upload successful:', result.blobName)
} catch (error) {
  console.error('Upload failed:', error.message)
}
```

### **3. Generate SAS URL:**
```typescript
const sasUrl = await azureBlobService.generateBlobSASUrl(
  'uxp-images',
  'user-generated-content.jpg',
  new Date(Date.now() + 3600000), // 1 hour
  'r' // read permission
)
```

### **4. Batch Operations:**
```typescript
const files = [
  { file: file1, containerName: 'uxp-images', blobName: 'image1.jpg' },
  { file: file2, containerName: 'uxp-images', blobName: 'image2.jpg' }
]

const result = await azureBlobService.batchUploadWithResilience(files, {
  concurrency: 3,
  continueOnError: true
})

console.log(`${result.successful.length} uploaded, ${result.failed.length} failed`)
```

## 🏗 **Architecture Overview**

### **Service Stack:**
```
UXP Panel Component
       ↓
Azure SDK Blob Service (Production)
       ↓
IMS Authentication + Azure Storage Account Key
       ↓
Azure Blob Storage
```

### **Key Features:**
- ✅ **IMS Authentication**: Adobe user context
- ✅ **Environment Aware**: Development ↔ Production Azure storage
- ✅ **Error Resilience**: Retry + Circuit breaker
- ✅ **Batch Operations**: Concurrent processing
- ✅ **SAS Token Generation**: Secure URL sharing
- ✅ **Health Monitoring**: Service status checks

## 🔧 **Configuration**

### **Required Environment Variables:**
```bash
# Azure Storage
VITE_AZURE_STORAGE_ACCOUNT_NAME=uxppanelstorage
VITE_AZURE_STORAGE_ACCOUNT_KEY=your-account-key

# Adobe IMS (already configured)
VITE_IMS_CLIENT_ID=f39e1cd1c58f4989908590855698236f
VITE_IMS_SCOPES=openid,AdobeID,firefly_api,ff_apis,firefly_enterprise

# Environment
VITE_ENVIRONMENT=development|production
```

### **Container Structure:**
- `uxp-images`: User-generated images
- `uxp-videos`: User-generated videos
- `uxp-temp`: Temporary processing files
- `uxp-exports`: Final export files

## 📈 **Performance & Limits**

### **Default Configuration:**
- **Max File Size**: 500MB
- **Chunk Size**: 4MB (for large uploads)
- **Parallel Uploads**: 4 concurrent
- **Retry Attempts**: 3 with exponential backoff
- **SAS Token TTL**: 1 hour (max 24 hours)

### **Supported File Types:**
- **Images**: JPEG, PNG, WebP, GIF
- **Videos**: MP4, MOV, WebM
- **Documents**: PDF

## 🔍 **Error Handling**

### **Common Error Codes:**
```typescript
try {
  await azureBlobService.uploadBlob(...)
} catch (error) {
  switch (error.code) {
    case 'CLIENT_INIT_FAILED':
      // Configuration issue
      break
    case 'AUTH_REFRESH_FAILED':
      // IMS authentication problem
      break
    case 'CIRCUIT_BREAKER_OPEN':
      // Service temporarily unavailable
      break
    case 'AZURE_OPERATION_FAILED':
      // Azure Storage operation error
      break
  }
}
```

## 🧪 **Testing**

### **Development Testing:**
```typescript
// Uses Azure Storage for development testing
const testService = createAzureSDKBlobService()
await testService.checkStorageHealth() // Verify connectivity
```

### **Production Validation:**
```typescript
// Requires real Azure Storage credentials
const health = await azureBlobService.checkStorageHealth()
console.log('Service healthy:', health.healthy)
console.log('Issues:', health.issues)
```

## 🔄 **Migration from Legacy BlobService**

### **Before (Legacy):**
```typescript
import { createBlobService } from '@/services/blob'
const blobService = createBlobService()
```

### **After (Azure SDK):**
```typescript
import { createAzureSDKBlobService } from '@/services/blob'
const azureBlobService = createAzureSDKBlobService(imsService)
```

### **Benefits of Migration:**
- **Production Ready**: Real Azure SDK integration
- **Better Performance**: Native Azure SDK optimizations
- **Enhanced Security**: IMS authentication integration
- **Error Resilience**: Comprehensive retry and circuit breaker
- **Monitoring**: Built-in health checks and metrics

## 📚 **Additional Resources**

- **[IMS Authentication Guide](./azure-ims-authentication.md)**: Detailed authentication flow
- **[Azure SDK Documentation](https://docs.microsoft.com/en-us/javascript/api/@azure/storage-blob/)**: Official Azure SDK reference
- **[UXP Development Guide](./uxp_demo_docs-output.md)**: UXP panel development patterns

---

🎉 **T023.5 Complete**: Azure SDK Blob Service is production-ready with IMS authentication!
