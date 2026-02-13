/**
 * Frame.io API Service
 * Client for Frame.io v4 API with Adobe I/O Runtime S2S authentication
 */

import type {
  FrameIOConfig,
  FrameIOAccount,
  FrameIOWorkspace,
  FrameIOProject,
  FrameIOFolder,
  FrameIOAsset,
  FrameIOListAssetsResponse,
  FrameIOListProjectsResponse,
  FrameIOListAccountsResponse,
  FrameIOListWorkspacesResponse,
  FrameIOListOptions,
  FrameIOServiceError,
} from './types';
import { FrameIOServiceError as FrameIOError } from './types';

export class FrameIOService {
  private baseUrl: string;
  private apiToken?: string;
  private fetchImpl: typeof fetch;

  constructor(
    config: FrameIOConfig,
    fetchImpl: typeof fetch = fetch
  ) {
    this.baseUrl = config.baseUrl || import.meta.env.VITE_FRAMEIO_API_BASE || 'https://api.frame.io';
    this.apiToken = config.apiToken || import.meta.env.VITE_FRAMEIO_API_TOKEN;
    this.fetchImpl = fetchImpl;
  }

  /**
   * Set the API token (useful for dynamic token refresh)
   */
  setApiToken(token: string): void {
    this.apiToken = token;
  }

  /**
   * Internal fetch wrapper with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiToken) {
      throw new FrameIOError('Frame.io API token not configured', 'AUTH_MISSING', 401);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await this.fetchImpl(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Frame.io API error: ${response.status} ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          // Use default error message
        }
        throw new FrameIOError(errorMessage, 'API_ERROR', response.status);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof FrameIOError) {
        throw error;
      }
      throw new FrameIOError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NETWORK_ERROR',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * List accounts accessible by the current user
   */
  async listAccounts(): Promise<FrameIOAccount[]> {
    const response = await this.request<FrameIOListAccountsResponse>('/v4/accounts');
    return response.data || [];
  }

  /**
   * List workspaces in an account
   */
  async listWorkspaces(accountId: string): Promise<FrameIOWorkspace[]> {
    const response = await this.request<FrameIOListWorkspacesResponse>(
      `/v4/accounts/${accountId}/workspaces`
    );
    return response.data || [];
  }

  /**
   * List projects in a workspace
   */
  async listProjects(accountId: string, workspaceId: string): Promise<FrameIOProject[]> {
    const response = await this.request<FrameIOListProjectsResponse>(
      `/v4/accounts/${accountId}/workspaces/${workspaceId}/projects`
    );
    return response.data || [];
  }

  /**
   * Get a specific project by ID
   */
  async getProject(accountId: string, projectId: string): Promise<FrameIOProject> {
    const response = await this.request<{ data: FrameIOProject }>(
      `/v4/accounts/${accountId}/projects/${projectId}`
    );
    return response.data;
  }

  /**
   * List assets in a folder (folder children)
   * @param accountId - Account ID
   * @param folderId - Folder ID (use project's root_folder_id for top-level)
   */
  async listAssets(
    accountId: string,
    folderId: string,
    options: FrameIOListOptions = {}
  ): Promise<FrameIOAsset[]> {
    const params = new URLSearchParams();
    if (options.after) params.append('after', options.after);
    if (options.page_size) params.append('page_size', options.page_size.toString());
    if (options.include_total_count) params.append('include_total_count', 'true');
    if (options.include && options.include.length > 0) params.append('include', options.include.join(','));
    if (options.type) params.append('type', options.type);

    const queryString = params.toString();
    const endpoint = `/v4/accounts/${accountId}/folders/${folderId}/children${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<FrameIOListAssetsResponse>(endpoint);
    return response.data || [];
  }

  /**
   * Get a specific file by ID
   */
  async getAsset(accountId: string, fileId: string): Promise<FrameIOAsset> {
    const response = await this.request<{ data: FrameIOAsset }>(
      `/v4/accounts/${accountId}/files/${fileId}`
    );
    return response.data;
  }

  /**
   * Get thumbnail URL for an asset
   */
  async getAssetThumbnailUrl(accountId: string, fileId: string): Promise<string | null> {
    const asset = await this.getAsset(accountId, fileId);
    return asset.thumbnail_url || asset.media_links?.thumbnail || null;
  }

  /**
   * Get download URL for an asset
   */
  async getAssetDownloadUrl(accountId: string, fileId: string): Promise<{ url: string; expiresAt?: string }> {
    const asset = await this.getAsset(accountId, fileId);
    
    const downloadUrl = asset.download_url || asset.media_links?.original || asset.original_url;
    
    if (!downloadUrl) {
      throw new FrameIOError('Asset does not have a download URL', 'NO_DOWNLOAD_URL');
    }

    return {
      url: downloadUrl,
      // Frame.io URLs typically expire after a certain time (not always provided)
      expiresAt: undefined,
    };
  }

  /**
   * Download an asset as a Blob
   */
  async downloadAsset(accountId: string, fileId: string): Promise<Blob> {
    const { url } = await this.getAssetDownloadUrl(accountId, fileId);
    
    const response = await this.fetchImpl(url);
    if (!response.ok) {
      throw new FrameIOError(
        `Failed to download asset: ${response.status} ${response.statusText}`,
        'DOWNLOAD_ERROR',
        response.status
      );
    }

    return await response.blob();
  }

  /**
   * Search assets by name
   */
  async searchAssets(
    accountId: string,
    folderId: string,
    query: string,
    options: FrameIOListOptions = {}
  ): Promise<FrameIOAsset[]> {
    const assets = await this.listAssets(accountId, folderId, options);
    const lowerQuery = query.toLowerCase();
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * List folders (convenience method filtering assets by type)
   */
  async listFolders(accountId: string, parentFolderId: string): Promise<FrameIOFolder[]> {
    const assets = await this.listAssets(accountId, parentFolderId, { type: 'folder' });
    return assets as FrameIOFolder[];
  }
}

/**
 * Factory function to create a FrameIOService instance
 */
export function createFrameIOService(
  config?: Partial<FrameIOConfig>,
  fetchImpl?: typeof fetch
): FrameIOService {
  const fullConfig: FrameIOConfig = {
    baseUrl: config?.baseUrl || import.meta.env.VITE_FRAMEIO_API_BASE || 'https://api.frame.io',
    apiToken: config?.apiToken || import.meta.env.VITE_FRAMEIO_API_TOKEN,
    clientId: config?.clientId || import.meta.env.VITE_FRAMEIO_CLIENT_ID,
    clientSecret: config?.clientSecret || import.meta.env.VITE_FRAMEIO_CLIENT_SECRET,
  };

  return new FrameIOService(fullConfig, fetchImpl);
}
