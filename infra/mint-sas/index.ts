/**
 * Azure Function: Mint SAS Token
 * 
 * Generates short-lived SAS tokens for blob uploads without exposing storage account keys
 * to client-side code. This is the production-ready solution (Option 2).
 * 
 * Environment Variables Required:
 * - AZURE_STORAGE_ACCOUNT: Storage account name
 * - AZURE_STORAGE_KEY: Storage account access key
 * 
 * Request Body:
 * {
 *   "container": "my-container",
 *   "blobName": "path/to/blob.jpg",
 *   "perms": "cw",           // Optional: default "cw" (create+write)
 *   "ttlMinutes": 15         // Optional: default 15 minutes
 * }
 * 
 * Response:
 * {
 *   "url": "https://account.blob.core.windows.net/container/blob?sv=...&sig=...",
 *   "expiresOn": "2025-10-01T03:00:00.000Z"
 * }
 */

import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from '@azure/storage-blob'
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

const accountName = process.env.AZURE_STORAGE_ACCOUNT!
const accountKey = process.env.AZURE_STORAGE_KEY!

if (!accountName || !accountKey) {
  throw new Error(
    'Missing required environment variables: AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_KEY'
  )
}

interface MintSASRequest {
  container: string
  blobName: string
  perms?: string
  ttlMinutes?: number
}

interface MintSASResponse {
  url: string
  expiresOn: string
}

interface MintSASError {
  error: string
  details?: string
}

export default async function (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // Parse and validate request
    const body = (await request.json()) as MintSASRequest

    if (!body.container || !body.blobName) {
      return {
        status: 400,
        jsonBody: {
          error: 'Missing required fields: container and blobName',
        } as MintSASError,
      }
    }

    // Validate container name (Azure naming rules)
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(body.container)) {
      return {
        status: 400,
        jsonBody: {
          error: 'Invalid container name',
          details:
            'Container names must be lowercase alphanumeric with hyphens, 3-63 characters',
        } as MintSASError,
      }
    }

    // Parse permissions (default to create+write for uploads)
    const perms = body.perms || 'cw'
    const ttlMinutes = Math.min(body.ttlMinutes || 15, 60) // Max 1 hour

    // Calculate start and expiry times
    const startsOn = new Date(Date.now() - 60_000) // 1 minute ago to account for clock skew
    const expiresOn = new Date(Date.now() + ttlMinutes * 60_000)

    // Create shared key credential
    const credential = new StorageSharedKeyCredential(accountName, accountKey)

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: body.container,
        blobName: body.blobName,
        permissions: BlobSASPermissions.parse(perms),
        startsOn,
        expiresOn,
        protocol: SASProtocol.Https,
      },
      credential
    ).toString()

    // Construct full URL
    const url = `https://${accountName}.blob.core.windows.net/${body.container}/${encodeURIComponent(body.blobName)}?${sasToken}`

    context.log(
      `✅ Generated SAS token for ${body.container}/${body.blobName} (expires: ${expiresOn.toISOString()})`
    )

    return {
      status: 200,
      jsonBody: {
        url,
        expiresOn: expiresOn.toISOString(),
      } as MintSASResponse,
    }
  } catch (e: any) {
    context.error('❌ Failed to generate SAS token:', e)

    return {
      status: 500,
      jsonBody: {
        error: 'Failed to generate SAS token',
        details: e?.message ?? 'Unknown error',
      } as MintSASError,
    }
  }
}
