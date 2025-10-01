/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Adobe IMS Authentication
  readonly VITE_IMS_CLIENT_ID: string
  readonly VITE_IMS_CLIENT_SECRET: string
  readonly VITE_IMS_ORG_ID: string
  readonly VITE_IMS_SCOPE: string

  // Azure Storage - Option 1: Full container SAS URL (easiest)
  readonly VITE_AZURE_CONTAINER_SAS_URL?: string

  // Azure Storage - Option 2: Parts-based SAS configuration
  readonly VITE_AZURE_ACCOUNT_NAME?: string
  readonly VITE_AZURE_CONTAINER_NAME?: string
  readonly VITE_AZURE_SAS_TOKEN?: string

  // Azure Storage - Legacy (deprecated)
  readonly VITE_AZURE_STORAGE_ACCOUNT_NAME?: string
  readonly VITE_AZURE_STORAGE_ACCOUNT_KEY?: string

  // SAS Token Service (deprecated - use pre-generated SAS instead)
  readonly VITE_SAS_DEFAULT_EXPIRATION_MINUTES?: string
  readonly VITE_SAS_MAX_EXPIRATION_MINUTES?: string
  readonly VITE_SAS_REQUEST_TIMEOUT?: string

  // Future: SAS Minting Backend (Option 2)
  readonly VITE_SAS_MINT_ENDPOINT?: string

  // Firefly API
  readonly VITE_FIREFLY_API_URL: string

  // Luma API
  readonly VITE_LUMA_API_URL: string
  readonly VITE_LUMA_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
