/**
 * Graph Enterprise API Types
 * For workflow generation and execution via Graph Enterprise Agent
 */

export interface GraphConfig {
  endpoint: string;
  imsOrgId?: string;
  imsUserId?: string;
  apiKey?: string;
}

export interface GraphWorkflowInput {
  node_id: string;
  content: string;
}

export interface GraphWorkflowRequest {
  workflow: {
    workflowId: string;
    inputs: GraphWorkflowInput[][];
  };
}

export interface GraphJobSubmitResponse {
  jobId: string;
  statusUrl?: string;
  message?: string;
}

export type GraphJobStatus = 
  | 'pending' 
  | 'queued'
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface GraphJobOutputAsset {
  assetId: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url?: string;
  thumbnailUrl?: string;
  frameioAssetId?: string;
}

export interface GraphJobStatusResponse {
  jobId: string;
  status: GraphJobStatus;
  progress?: number;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  outputs?: GraphJobOutputAsset[];
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface GraphJobResult {
  jobId: string;
  status: GraphJobStatus;
  outputs?: GraphJobOutputAsset[];
  error?: {
    code: string;
    message: string;
  };
}

export interface GraphPollOptions {
  pollInterval?: number; // milliseconds
  maxPollTime?: number; // milliseconds
  onProgress?: (status: GraphJobStatusResponse) => void;
  abortSignal?: AbortSignal;
}

export class GraphEnterpriseServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'GraphEnterpriseServiceError';
  }
}

/**
 * Parsed curl command structure
 */
export interface ParsedCurlCommand {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: GraphWorkflowRequest;
}
