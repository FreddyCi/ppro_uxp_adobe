/**
 * Graph Enterprise and Frame.io Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GraphEnterpriseService } from '../services/graph/GraphEnterpriseService';
import { FrameIOService } from '../services/frameio/FrameIOService';
import type { GraphWorkflowRequest } from '../services/graph/types';
import type { FrameIOProject, FrameIOAsset } from '../services/frameio/types';

describe('GraphEnterpriseService', () => {
  let service: GraphEnterpriseService;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    service = new GraphEnterpriseService(
      {
        endpoint: 'http://localhost:7071/execute',
        imsOrgId: 'test-org-id@AdobeOrg',
        imsUserId: 'test-user-id@techacct.adobe.com',
        apiKey: 'test-api-key',
      },
      mockFetch as unknown as typeof fetch
    );
  });

  describe('parseCurlCommand', () => {
    it('should parse a curl command string correctly', () => {
      const curlString = `curl --location 'http://localhost:7071/execute' \\
  --header 'Content-Type: application/json' \\
  --header 'Authorization: Bearer test-token' \\
  --data '{
    "workflow": {
      "workflowId": "test-workflow-id",
      "inputs": [[{"node_id": "node-1", "content": "test"}]]
    }
  }'`;

      const parsed = service.parseCurlCommand(curlString);

      expect(parsed.url).toBe('http://localhost:7071/execute');
      expect(parsed.method).toBe('POST');
      expect(parsed.headers['Content-Type']).toBe('application/json');
      expect(parsed.headers['Authorization']).toBe('Bearer test-token');
      expect(parsed.body.workflow.workflowId).toBe('test-workflow-id');
    });

    it('should throw error for invalid JSON in curl body', () => {
      const curlString = `curl --location 'http://localhost:7071/execute' \\
  --data 'invalid json'`;

      expect(() => service.parseCurlCommand(curlString)).toThrow();
    });
  });

  describe('submitJob', () => {
    it('should submit a job and return jobId', async () => {
      const mockResponse = {
        jobId: 'test-job-123',
        statusUrl: 'http://localhost:7071/status/test-job-123',
        message: 'Job submitted successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: GraphWorkflowRequest = {
        workflow: {
          workflowId: 'test-workflow',
          inputs: [[{ node_id: 'node-1', content: 'test content' }]],
        },
      };

      const result = await service.submitJob(request, 'test-access-token');

      expect(result.jobId).toBe('test-job-123');
      expect(result.statusUrl).toBe('http://localhost:7071/status/test-job-123');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:7071/execute',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-access-token',
            'x-gw-ims-org-id': 'test-org-id@AdobeOrg',
            'x-gw-ims-user-id': 'test-user-id@techacct.adobe.com',
            'x-api-key': 'test-api-key',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => JSON.stringify({ message: 'Invalid workflow' }),
      });

      const request: GraphWorkflowRequest = {
        workflow: {
          workflowId: 'invalid',
          inputs: [],
        },
      };

      await expect(service.submitJob(request, 'test-token')).rejects.toThrow(
        'Invalid workflow'
      );
    });
  });

  describe('getJobStatus', () => {
    it('should retrieve job status', async () => {
      const mockStatus = {
        jobId: 'test-job-123',
        status: 'running',
        progress: 45,
        message: 'Processing workflow',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
      });

      const result = await service.getJobStatus('test-job-123', 'test-token');

      expect(result.jobId).toBe('test-job-123');
      expect(result.status).toBe('running');
      expect(result.progress).toBe(45);
    });
  });

  describe('pollUntilComplete', () => {
    it('should poll until job completes', async () => {
      // Mock sequence: pending → running → completed
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jobId: 'test-job-123',
            status: 'pending',
            progress: 0,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jobId: 'test-job-123',
            status: 'running',
            progress: 50,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jobId: 'test-job-123',
            status: 'completed',
            outputs: [
              {
                assetId: 'asset-1',
                name: 'output.mp4',
                type: 'video',
                url: 'https://example.com/output.mp4',
              },
            ],
          }),
        });

      const onProgress = vi.fn();

      const result = await service.pollUntilComplete('test-job-123', 'test-token', {
        pollInterval: 10, // Fast polling for tests
        maxPollTime: 5000,
        onProgress,
      });

      expect(result.status).toBe('completed');
      expect(result.outputs).toHaveLength(1);
      expect(onProgress).toHaveBeenCalledTimes(3);
    });

    it('should abort polling when abort signal triggered', async () => {
      const abortController = new AbortController();

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          jobId: 'test-job-123',
          status: 'running',
        }),
      });

      const pollPromise = service.pollUntilComplete('test-job-123', 'test-token', {
        pollInterval: 100,
        abortSignal: abortController.signal,
      });

      // Abort after a short delay
      setTimeout(() => abortController.abort(), 50);

      await expect(pollPromise).rejects.toThrow('aborted');
    });
  });
});

describe('FrameIOService', () => {
  let service: FrameIOService;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    service = new FrameIOService(
      {
        baseUrl: 'https://api.frame.io',
        apiToken: 'test-frame-io-token',
      },
      mockFetch as unknown as typeof fetch
    );
  });

  describe('listProjects', () => {
    it('should list Frame.io projects', async () => {
      const mockProjects: FrameIOProject[] = [
        {
          id: 'project-1',
          name: 'Test Project 1',
          description: 'Test description',
          workspace_id: 'workspace-1',
          root_folder_id: 'root-1',
          restricted: false,
          status: 'active',
          storage: 1024000,
          view_url: 'https://app.frame.io/project/project-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
        {
          id: 'project-2',
          name: 'Test Project 2',
          description: 'Test description 2',
          workspace_id: 'workspace-1',
          root_folder_id: 'root-2',
          restricted: true,
          status: 'active',
          storage: 2048000,
          view_url: 'https://app.frame.io/project/project-2',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      });

      const result = await service.listProjects('account-1', 'workspace-1');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Test Project 1');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.frame.io/v4/accounts/account-1/workspaces/workspace-1/projects',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-frame-io-token',
          }),
        })
      );
    });
  });

  describe('listAssets', () => {
    it('should list assets from a folder', async () => {
      const mockAssets: FrameIOAsset[] = [
        {
          id: 'asset-1',
          name: 'video.mp4',
          type: 'file',
          parent_id: 'folder-1',
          project_id: 'project-1',
          filesize: 1024000,
          filetype: 'video/mp4',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          thumbnail_url: 'https://example.com/thumb.jpg',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssets }),
      });

      const result = await service.listAssets('account-1', 'folder-1');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('video.mp4');
      expect(result[0].filetype).toBe('video/mp4');
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Folder not found',
      });

      await expect(service.listAssets('account-1', 'invalid-folder')).rejects.toThrow();
    });
  });

  describe('getAssetDownloadUrl', () => {
    it('should return download URL for an asset', async () => {
      const mockAsset: FrameIOAsset = {
        id: 'asset-1',
        name: 'video.mp4',
        type: 'file',
        parent_id: 'folder-1',
        project_id: 'project-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        download_url: 'https://example.com/download/video.mp4',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAsset }),
      });

      const result = await service.getAssetDownloadUrl('account-1', 'asset-1');

      expect(result.url).toBe('https://example.com/download/video.mp4');
    });
  });

  describe('Authentication', () => {
    it('should throw error when API token is missing', async () => {
      const unauthenticatedService = new FrameIOService(
        { baseUrl: 'https://api.frame.io' },
        mockFetch as unknown as typeof fetch
      );

      await expect(unauthenticatedService.listProjects('account-1', 'workspace-1')).rejects.toThrow(
        'Frame.io API token not configured'
      );
    });

    it('should allow setting token dynamically', () => {
      service.setApiToken('new-token');
      // Token setter should not throw
      expect(true).toBe(true);
    });
  });
});
