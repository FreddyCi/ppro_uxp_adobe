/**
 * Graph Enterprise Service
 * Client for Graph Enterprise workflow generation and execution
 * Implements async job submission with polling pattern (submit → poll → result)
 */

import type {
  GraphConfig,
  GraphWorkflowRequest,
  GraphJobSubmitResponse,
  GraphJobStatusResponse,
  GraphJobResult,
  GraphPollOptions,
  ParsedCurlCommand,
} from './types';
import { GraphEnterpriseServiceError } from './types';

/**
 * Delay helper for polling
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class GraphEnterpriseService {
  private endpoint: string;
  private imsOrgId?: string;
  private imsUserId?: string;
  private apiKey?: string;
  private fetchImpl: typeof fetch;

  constructor(
    config: GraphConfig,
    fetchImpl: typeof fetch = fetch
  ) {
    this.endpoint = config.endpoint || import.meta.env.VITE_GRAPH_ENTERPRISE_ENDPOINT || 'http://localhost:7071/execute';
    this.imsOrgId = config.imsOrgId || import.meta.env.VITE_GRAPH_IMS_ORG_ID;
    this.imsUserId = config.imsUserId || import.meta.env.VITE_GRAPH_IMS_USER_ID;
    this.apiKey = config.apiKey || import.meta.env.VITE_GRAPH_API_KEY;
    this.fetchImpl = fetchImpl;
  }

  /**
   * Parse a curl command string into structured request
   */
  parseCurlCommand(curlString: string): ParsedCurlCommand {
    const lines = curlString.split('\n').map(l => l.trim()).filter(Boolean);
    
    let url = '';
    let method = 'POST';
    const headers: Record<string, string> = {};
    let bodyString = '';

    for (const line of lines) {
      if (line.startsWith('curl')) {
        const urlMatch = line.match(/curl\s+(?:--location\s+)?['"]?([^'"]+)['"]?/);
        if (urlMatch) url = urlMatch[1];
      } else if (line.includes('--header') || line.includes('-H')) {
        const headerMatch = line.match(/--header\s+['"]([^:]+):\s*([^'"]+)['"]/);
        if (headerMatch) {
          headers[headerMatch[1]] = headerMatch[2];
        }
      } else if (line.includes('--data')) {
        const dataMatch = line.match(/--data\s+['"](.+)['"]/s);
        if (dataMatch) {
          bodyString = dataMatch[1];
        }
      }
    }

    // Try to parse body as JSON
    let body: GraphWorkflowRequest;
    try {
      body = JSON.parse(bodyString);
    } catch (error) {
      throw new GraphEnterpriseServiceError(
        'Failed to parse curl body as JSON',
        'PARSE_ERROR'
      );
    }

    return { url, method, headers, body };
  }

  /**
   * Submit a workflow job to Graph Enterprise
   */
  async submitJob(
    request: GraphWorkflowRequest,
    accessToken?: string
  ): Promise<GraphJobSubmitResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (this.imsOrgId) {
      headers['x-gw-ims-org-id'] = this.imsOrgId;
    }

    if (this.imsUserId) {
      headers['x-gw-ims-user-id'] = this.imsUserId;
    }

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Graph Enterprise API error: ${response.status} ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          // Use default error message
        }
        throw new GraphEnterpriseServiceError(errorMessage, 'API_ERROR', response.status);
      }

      const result = await response.json();
      
      // Normalize response format
      return {
        jobId: result.jobId || result.id || result.executionId || 'unknown',
        statusUrl: result.statusUrl || result.status_url,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof GraphEnterpriseServiceError) {
        throw error;
      }
      throw new GraphEnterpriseServiceError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NETWORK_ERROR',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(
    jobId: string,
    accessToken?: string
  ): Promise<GraphJobStatusResponse> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    // Construct status endpoint (adjust based on actual API)
    const statusUrl = `${this.endpoint.replace('/execute', '')}/status/${jobId}`;

    try {
      const response = await this.fetchImpl(statusUrl, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new GraphEnterpriseServiceError(
          `Failed to get job status: ${response.status} ${response.statusText}`,
          'STATUS_ERROR',
          response.status
        );
      }

      const result = await response.json();

      // Normalize status response
      return {
        jobId: result.jobId || result.id || jobId,
        status: result.status || 'pending',
        progress: result.progress,
        message: result.message,
        createdAt: result.createdAt || result.created_at,
        updatedAt: result.updatedAt || result.updated_at,
        completedAt: result.completedAt || result.completed_at,
        outputs: result.outputs,
        error: result.error,
      };
    } catch (error) {
      if (error instanceof GraphEnterpriseServiceError) {
        throw error;
      }
      throw new GraphEnterpriseServiceError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NETWORK_ERROR',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Poll job until completion with exponential backoff
   * Based on LumaVideoService.waitForCompletion pattern
   */
  async pollUntilComplete(
    jobId: string,
    accessToken?: string,
    options: GraphPollOptions = {}
  ): Promise<GraphJobResult> {
    const {
      pollInterval = 2000,
      maxPollTime = 300000, // 5 minutes default
      onProgress,
      abortSignal,
    } = options;

    const startTime = Date.now();
    let currentInterval = pollInterval;
    const maxInterval = 30000; // 30 seconds max

    while (true) {
      // Check abort signal
      if (abortSignal?.aborted) {
        throw new GraphEnterpriseServiceError('Polling aborted by user', 'ABORTED');
      }

      // Check timeout
      if (Date.now() - startTime > maxPollTime) {
        throw new GraphEnterpriseServiceError(
          `Job polling timed out after ${maxPollTime}ms`,
          'TIMEOUT'
        );
      }

      try {
        const status = await this.getJobStatus(jobId, accessToken);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(status);
        }

        // Check terminal states
        if (status.status === 'completed') {
          return {
            jobId: status.jobId,
            status: status.status,
            outputs: status.outputs,
          };
        }

        if (status.status === 'failed' || status.status === 'cancelled') {
          throw new GraphEnterpriseServiceError(
            status.error?.message || `Job ${status.status}`,
            status.error?.code || status.status.toUpperCase(),
            undefined
          );
        }

        // Wait before next poll with exponential backoff
        await delay(currentInterval);
        currentInterval = Math.min(currentInterval * 1.5, maxInterval);

      } catch (error) {
        if (error instanceof GraphEnterpriseServiceError) {
          throw error;
        }
        // Log but continue polling on transient errors
        console.warn('Error polling job status:', error);
        await delay(currentInterval);
      }
    }
  }

  /**
   * Submit and poll (convenience method)
   */
  async submitAndPoll(
    request: GraphWorkflowRequest,
    accessToken?: string,
    pollOptions?: GraphPollOptions
  ): Promise<GraphJobResult> {
    const { jobId } = await this.submitJob(request, accessToken);
    return await this.pollUntilComplete(jobId, accessToken, pollOptions);
  }
}

/**
 * Factory function to create a GraphEnterpriseService instance
 */
export function createGraphEnterpriseService(
  config?: Partial<GraphConfig>,
  fetchImpl?: typeof fetch
): GraphEnterpriseService {
  const fullConfig: GraphConfig = {
    endpoint: config?.endpoint || import.meta.env.VITE_GRAPH_ENTERPRISE_ENDPOINT || 'http://localhost:7071/execute',
    imsOrgId: config?.imsOrgId || import.meta.env.VITE_GRAPH_IMS_ORG_ID,
    imsUserId: config?.imsUserId || import.meta.env.VITE_GRAPH_IMS_USER_ID,
    apiKey: config?.apiKey || import.meta.env.VITE_GRAPH_API_KEY,
  };

  return new GraphEnterpriseService(fullConfig, fetchImpl);
}
