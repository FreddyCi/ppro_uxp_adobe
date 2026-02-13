/**
 * Frame.io API Types
 * Based on Frame.io API v4 documentation
 */

export interface FrameIOConfig {
  baseUrl: string;
  apiToken?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface FrameIOAccount {
  id: string;
  display_name: string;
  image?: string | null;
  storage_limit?: number | null;
  storage_usage: number;
  roles: ('admin' | 'member' | 'owner')[];
  created_at: string;
  updated_at: string;
  v4_migrated_at?: string | null;
}

export interface FrameIOWorkspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface FrameIOProject {
  id: string;
  name: string;
  description?: string | null;
  workspace_id: string;
  root_folder_id: string;
  restricted: boolean;
  status: 'active' | 'inactive';
  storage: number;
  view_url: string;
  created_at: string;
  updated_at: string;
}

export interface FrameIOFolder {
  id: string;
  name: string;
  type: 'folder';
  parent_id: string | null;
  project_id: string;
  created_at: string;
  updated_at: string;
  item_count: number;
}

export interface FrameIOAsset {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'version_stack';
  parent_id: string | null;
  project_id?: string;
  filesize?: number | null;
  filetype?: string | null;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string | null;
  download_url?: string | null;
  original_url?: string | null;
  original_name?: string;
  duration?: number | null;
  fps?: number | null;
  width?: number | null;
  height?: number | null;
  status?: 'uploaded' | 'transcoded' | 'error';
  item_count?: number;
  media_links?: {
    original?: string | null;
    thumbnail?: string | null;
    thumbnail_high_quality?: string | null;
    video_h264_180?: string | null;
    high_quality?: string | null;
  };
}

export interface FrameIOListProjectsResponse {
  data: FrameIOProject[];
  links: {
    next: string | null;
  };
  total_count?: number | null;
}

export interface FrameIOListAccountsResponse {
  data: FrameIOAccount[];
  links: {
    next: string | null;
  };
  total_count?: number | null;
}

export interface FrameIOListWorkspacesResponse {
  data: FrameIOWorkspace[];
  links: {
    next: string | null;
  };
  total_count?: number | null;
}

export interface FrameIOListAssetsResponse {
  data: FrameIOAsset[];
  links: {
    next: string | null;
  };
  total_count?: number | null;
}

export interface FrameIOUploadRequest {
  name: string;
  filesize: number;
  filetype: string;
  parent_id: string;
}

export interface FrameIOUploadResponse {
  id: string;
  name: string;
  upload_urls: string[];
  upload_completed_url: string;
}

export interface FrameIOError {
  message: string;
  code?: string;
  status?: number;
}

export class FrameIOServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'FrameIOServiceError';
  }
}

export interface FrameIOListOptions {
  // v4 API pagination (cursor-based)
  after?: string;
  page_size?: number;
  include_total_count?: boolean;
  
  // v4 API include params (e.g., 'media_links.original', 'media_links.thumbnail', 'creator', 'project', 'metadata')
  include?: string[];
  
  // Filter by type
  type?: 'file' | 'folder';
}

