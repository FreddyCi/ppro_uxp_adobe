export type StorageMode = 'azure' | 'local'

const RAW_STORAGE_MODE = (import.meta.env.VITE_STORAGE_MODE || 'azure').toLowerCase()

function normalizeMode(raw: string): StorageMode {
  return raw === 'local' ? 'local' : 'azure'
}

const STORAGE_MODE: StorageMode = normalizeMode(RAW_STORAGE_MODE)

export function getStorageMode(): StorageMode {
  return STORAGE_MODE
}

export function isLocalMode(): boolean {
  return STORAGE_MODE === 'local'
}

export function isAzureEnabled(): boolean {
  return STORAGE_MODE !== 'local'
}
