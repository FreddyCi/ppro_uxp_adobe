/**
 * Base64 encoding utilities for UXP environment
 * Provides browser-compatible base64 encoding with fallback implementation
 */

/**
 * Encode a Uint8Array to base64 string
 * Uses native btoa if available, otherwise falls back to manual implementation
 * 
 * @param bytes - Byte array to encode
 * @returns Base64 encoded string
 */
export function encodeBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += Array.from(chunk, byte => String.fromCharCode(byte)).join('');
    }
    return btoa(binary);
  }

  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;

  for (; i + 3 <= bytes.length; i += 3) {
    const triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    result += base64Chars[(triplet >> 18) & 63];
    result += base64Chars[(triplet >> 12) & 63];
    result += base64Chars[(triplet >> 6) & 63];
    result += base64Chars[triplet & 63];
  }

  if (i < bytes.length) {
    const remaining = bytes.length - i;
    const chunk = bytes[i] << 16 | (remaining > 1 ? bytes[i + 1] << 8 : 0);
    result += base64Chars[(chunk >> 18) & 63];
    result += base64Chars[(chunk >> 12) & 63];
    if (remaining > 1) {
      result += base64Chars[(chunk >> 6) & 63];
      result += '=';
    } else {
      result += '==';
    }
  }

  return result;
}

/**
 * Convert a Blob to a data URL string
 * Reads the blob as an ArrayBuffer, encodes to base64, and wraps in data URL format
 * 
 * @param blob - Blob to convert
 * @returns Data URL string (data:mime/type;base64,...)
 */
export async function convertBlobToDataUrl(blob: Blob): Promise<string> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const base64 = encodeBase64(bytes);
    const mimeType = blob.type || 'application/octet-stream';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Failed to convert blob to data URL:', error);
    throw error;
  }
}
