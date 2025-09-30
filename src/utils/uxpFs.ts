import { uxp } from '../globals';

/**
 * Convert a folder token and relative path to a temporary UXP URL that can be used in <img src="">
 * This is necessary for local files to be renderable in the Gallery component.
 * Since UXP doesn't have createTemporaryUrl, we read the file and create a blob URL.
 * Can also accept a full localFilePath and will parse it using stored folder information.
 */
export async function toTempUrl(folderToken?: string | null, relativePath?: string, mimeType?: string, localFilePath?: string): Promise<string> {
  const fs = uxp.storage.localFileSystem;

  let actualFolderToken = folderToken;
  let actualRelativePath = relativePath;

  // If localFilePath is provided, try to parse it using stored folder information
  if (localFilePath && (!folderToken || !relativePath)) {
    try {
      // Get stored folder information
      const FOLDER_TOKEN_STORAGE_KEY = 'boltuxp.localFolderToken';
      const FOLDER_PATH_STORAGE_KEY = 'boltuxp.localFolderPath';
      const storedToken = typeof window !== 'undefined' && window.localStorage 
        ? window.localStorage.getItem(FOLDER_TOKEN_STORAGE_KEY) 
        : null;
      const storedFolderPath = typeof window !== 'undefined' && window.localStorage
        ? window.localStorage.getItem(FOLDER_PATH_STORAGE_KEY)
        : null;
      
      if (storedToken && storedFolderPath && localFilePath.startsWith(storedFolderPath)) {
        actualFolderToken = storedToken;
        actualRelativePath = localFilePath.slice(storedFolderPath.length).replace(/^[/\\]+/, '');
      }
    } catch (parseError) {
      console.warn('Failed to parse localFilePath for toTempUrl:', parseError);
    }
  }

  if (!actualFolderToken || !actualRelativePath) {
    throw new Error('Folder token and relative path are required for UXP temporary URL generation');
  }

  try {
    // Get the folder entry using the token
    const folder = await fs.getEntryForPersistentToken(actualFolderToken);
    if (!folder || !folder.isFolder) {
      throw new Error('Invalid folder token or folder not found');
    }

    // Navigate to the file using the relative path
    const file = await folder.getEntry(actualRelativePath);
    if (!file || file.isFolder) {
      throw new Error('File not found: ' + actualRelativePath);
    }

    // Read the file content as binary data
    const binaryFormat = uxp.storage.formats?.binary;
    const readOptions = binaryFormat ? { format: binaryFormat } : undefined;
    const arrayBuffer = await file.read(readOptions);

    if (!arrayBuffer) {
      throw new Error('Failed to read file content');
    }

    // Create a blob and blob URL with proper MIME type
    const blob = new Blob([arrayBuffer], mimeType ? { type: mimeType } : undefined);
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  } catch (error) {
    console.error('UXP filesystem navigation failed:', error);
    throw new Error('UXP filesystem API not available or token invalid: ' + error);
  }
}