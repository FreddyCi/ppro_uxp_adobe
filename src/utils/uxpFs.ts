import { storage } from 'uxp';

/**
 * Convert an absolute file path to a temporary UXP URL that can be used in <img src="">
 * This is necessary for local files to be renderable in the Gallery component.
 */
export async function toTempUrl(absPath: string): Promise<string> {
  const fs = storage.localFileSystem;

  // For UXP, we need to get the entry using the stored folder token and relative path
  // But since we only have the absolute path, we'll try to use getEntryForPath if available
  // If not, we'll need to modify the calling code to pass folder token and relative path

  // Try the direct approach first
  try {
    const entry = await (fs as any).getEntryForPath(absPath);
    if (!entry || entry.isFolder) {
      throw new Error('Not a file: ' + absPath);
    }
    return entry.createTemporaryUrl();
  } catch (error) {
    // If getEntryForPath doesn't exist, we'll need a different approach
    console.warn('getEntryForPath not available, need to implement token-based approach');
    throw new Error('UXP filesystem API not fully supported: ' + error);
  }
}