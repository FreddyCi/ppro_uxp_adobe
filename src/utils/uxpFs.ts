import { storage } from 'uxp';

/**
 * Convert a folder token and relative path to a temporary UXP URL that can be used in <img src="">
 * This is necessary for local files to be renderable in the Gallery component.
 * Since UXP doesn't have createTemporaryUrl, we read the file and create a blob URL.
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

    // Read the file content
    const arrayBuffer = await file.read();
    if (!arrayBuffer) {
      throw new Error('Failed to read file content');
    }

    // Create a blob and blob URL
    const blob = new Blob([arrayBuffer]);
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  } catch (error) {
    console.error('UXP filesystem navigation failed:', error);
    throw new Error('UXP filesystem API not available or token invalid: ' + error);
  }
}