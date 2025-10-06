import axios from 'axios';
import { createSASTokenService } from '../services/blob/SASTokenService';

/**
 * Upload a blob to Azure Storage using SAS token authentication
 * Bypasses Azure SDK issues by using direct HTTP PUT with SAS token
 * 
 * @param sasService - SAS token service instance
 * @param accountName - Azure storage account name
 * @param containerName - Container name
 * @param blobName - Blob name/path
 * @param file - File data (File, Blob, Uint8Array, or ArrayBuffer)
 * @param cacheControl - Optional cache control header
 * @returns Public URL and signed URL for the uploaded blob
 */
export async function uploadBlobWithSAS(
  sasService: ReturnType<typeof createSASTokenService>,
  accountName: string,
  containerName: string,
  blobName: string,
  file: File | Blob | Uint8Array | ArrayBuffer,
  cacheControl?: string
): Promise<{ publicUrl: string; signedUrl: string }> {
  // Request upload SAS token from backend
  const sasResponse = await sasService.requestUploadToken(containerName, blobName, 15); // 15 minutes

  // Build the PUT URL
  const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobName)}`;
  const sasToken = sasResponse.sasToken.startsWith('?') ? sasResponse.sasToken.slice(1) : sasResponse.sasToken;
  const putUrl = `${baseUrl}?${sasToken}`;

  // Prepare file data
  let arrayBuffer: ArrayBuffer;
  if (file instanceof ArrayBuffer) {
    arrayBuffer = file;
  } else if (file instanceof Uint8Array) {
    arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
  } else if (file instanceof Blob) {
    arrayBuffer = await file.arrayBuffer();
  } else if (typeof file === 'object' && 'arrayBuffer' in file && typeof (file as any).arrayBuffer === 'function') {
    // Handle File objects (which extend Blob but TypeScript doesn't know that)
    arrayBuffer = await (file as any).arrayBuffer();
  } else {
    throw new Error('Unsupported file type for upload');
  }

  // Infer content type
  const contentType = file instanceof Blob && file.type ? file.type :
    blobName.toLowerCase().endsWith('.jpg') || blobName.toLowerCase().endsWith('.jpeg') ? 'image/jpeg' :
    blobName.toLowerCase().endsWith('.png') ? 'image/png' :
    'application/octet-stream';

  // Upload with axios
  const headers: Record<string, string> = {
    'x-ms-blob-type': 'BlockBlob',
    'Content-Type': contentType,
    'x-ms-version': '2021-08-06',
  };
  if (cacheControl) headers['x-ms-blob-cache-control'] = cacheControl;

  const response = await axios.put(putUrl, arrayBuffer, { headers });

  if (response.status >= 200 && response.status < 300) {
    return {
      publicUrl: baseUrl,
      signedUrl: sasResponse.sasUrl || putUrl
    };
  } else {
    throw new Error(`Upload failed with status ${response.status}: ${response.statusText}`);
  }
}
