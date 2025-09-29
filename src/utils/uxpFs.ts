import { storage } from 'uxp';

/**
 * Convert a folder token and relative path to a temporary UXP URL that can be used in <img src="">
 * This is necessary for local files to be renderable in the Gallery component.
 */
export async function toTempUrl(folderToken: string | null | undefined, relativePath: string | undefined): Promise<string> {
  const fs = storage.localFileSystem;

  if (!folderToken || !relativePath) {
    throw new Error('Folder token and relative path are required for UXP temporary URL generation');
  }

  try {
    // Get the folder entry using the token
    const folder = await fs.getEntryForPersistentToken(folderToken);
    if (!folder || !folder.isFolder) {
      throw new Error('Invalid folder token or folder not found');
    }

    // Navigate to the file using the relative path
    const file = await folder.getEntry(relativePath);
    if (!file || file.isFolder) {
      throw new Error('File not found: ' + relativePath);
    }

    return file.createTemporaryUrl();
  } catch (error) {
    console.error('UXP filesystem navigation failed:', error);
    throw new Error('UXP filesystem API not available or token invalid: ' + error);
  }
}