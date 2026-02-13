/**
 * useGraphFrameIO Hook
 * Orchestrates Graph Enterprise workflow submission and Frame.io asset retrieval
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { createGraphEnterpriseService } from '../services/graph/GraphEnterpriseService';
import { createFrameIOService } from '../services/frameio/FrameIOService';
import { useAuthStore, ensureAuthenticated, selectToken } from '../store/authStore';
import type { GraphWorkflowRequest, GraphJobStatusResponse } from '../services/graph/types';
import type { FrameIOProject, FrameIOAsset } from '../services/frameio/types';

export interface GraphFrameIOState {
  // Frame.io state
  projects: FrameIOProject[];
  selectedProject: FrameIOProject | null;
  selectedFolderId: string | null;
  assets: FrameIOAsset[];
  
  // Job state
  jobId: string | null;
  jobStatus: string | null;
  progress: number;
  logs: string[];
  error: string | null;
  
  // Loading states
  isLoadingProjects: boolean;
  isLoadingAssets: boolean;
  isGenerating: boolean;
}

export interface GraphFrameIOActions {
  loadProjects: () => Promise<void>;
  selectProject: (project: FrameIOProject) => void;
  selectFolder: (folderId: string) => void;
  loadAssets: (folderId?: string) => Promise<void>;
  handleGenerate: (curlOrRequest: string | GraphWorkflowRequest) => Promise<void>;
  refreshResults: () => Promise<void>;
  cancelGeneration: () => void;
  clearLogs: () => void;
}

export const DEFAULT_CURL_EXAMPLE = `curl --location 'http://localhost:7071/execute' \\
  --header 'Content-Type: application/json' \\
  --header 'Accept: application/json' \\
  --header 'Authorization: Bearer <TOKEN>' \\
  --header 'x-gw-ims-org-id: 90FC331D59DBA35E0A494204@AdobeOrg' \\
  --header 'x-gw-ims-user-id: 2E441D69686227520A494212@c62f24cc5b5b7e0e0a494004' \\
  --header 'x-api-key: bulk-automation-web' \\
  --data '{
    "workflow": {
      "workflowId": "a1c13339-6c22-4462-80fd-7663ccc97622",
      "inputs": [
        [
          {
            "node_id": "node_1770939134578_57fxlnh98_0_1qndme",
            "content": "{text}"
          }
        ]
      ]
    }
  }'`;

export function useGraphFrameIO(): GraphFrameIOState & { actions: GraphFrameIOActions } {
  // State
  const [accountId, setAccountId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [projects, setProjects] = useState<FrameIOProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<FrameIOProject | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [assets, setAssets] = useState<FrameIOAsset[]>([]);
  
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Refs for services and abort controller
  const graphServiceRef = useRef(createGraphEnterpriseService());
  const frameioServiceRef = useRef(createFrameIOService());
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Auth - use selector to get access token
  const accessToken = useAuthStore(selectToken);

  // Add log helper
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  // Load Frame.io projects (v4 API requires account → workspace → projects hierarchy)
  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setError(null);
    
    try {
      addLog('Loading Frame.io projects...');
      
      // Ensure authenticated
      await ensureAuthenticated();
      
      if (accessToken) {
        frameioServiceRef.current.setApiToken(accessToken);
      }
      
      // Step 1: Load accounts
      addLog('Fetching accounts...');
      const accounts = await frameioServiceRef.current.listAccounts();
      if (accounts.length === 0) {
        throw new Error('No Frame.io accounts found');
      }
      
      // Auto-select first account (POC simplicity)
      const selectedAccountId = accounts[0].id;
      setAccountId(selectedAccountId);
      addLog(`Using account: ${accounts[0].display_name || accounts[0].id} (${selectedAccountId})`);
      
      // Step 2: Load workspaces for selected account
      addLog('Fetching workspaces...');
      const workspaces = await frameioServiceRef.current.listWorkspaces(selectedAccountId);
      if (workspaces.length === 0) {
        throw new Error('No workspaces found in account');
      }
      
      // Auto-select first workspace (POC simplicity)
      const selectedWorkspaceId = workspaces[0].id;
      setWorkspaceId(selectedWorkspaceId);
      addLog(`Using workspace: ${workspaces[0].name} (${selectedWorkspaceId})`);
      
      // Step 3: Load projects for selected workspace
      addLog('Fetching projects...');
      const projectsList = await frameioServiceRef.current.listProjects(selectedAccountId, selectedWorkspaceId);
      setProjects(projectsList);
      addLog(`Loaded ${projectsList.length} projects`);
      
      // Auto-select first project if available
      if (projectsList.length > 0 && !selectedProject) {
        setSelectedProject(projectsList[0]);
        setSelectedFolderId(projectsList[0].root_folder_id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [selectedProject, accessToken, addLog]);

  // Select a project
  const selectProject = useCallback((project: FrameIOProject) => {
    setSelectedProject(project);
    setSelectedFolderId(project.root_folder_id);
    setAssets([]);
    addLog(`Selected project: ${project.name}`);
  }, [addLog]);

  // Select a folder
  const selectFolder = useCallback((folderId: string) => {
    setSelectedFolderId(folderId);
    addLog(`Selected folder ID: ${folderId}`);
  }, [addLog]);

  // Load assets from selected folder (v4 API requires accountId)
  const loadAssets = useCallback(async (folderId?: string) => {
    const targetFolderId = folderId || selectedFolderId;
    if (!targetFolderId) {
      addLog('No folder selected');
      return;
    }
    
    if (!accountId) {
      addLog('Error: No account selected. Load projects first.');
      return;
    }
    
    setIsLoadingAssets(true);
    setError(null);
    
    try {
      addLog(`Loading assets from folder: ${targetFolderId}`);
      
      if (accessToken) {
        frameioServiceRef.current.setApiToken(accessToken);
      }
      
      const assetsList = await frameioServiceRef.current.listAssets(accountId, targetFolderId);
      setAssets(assetsList);
      addLog(`Loaded ${assetsList.length} assets`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load assets';
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    } finally {
      setIsLoadingAssets(false);
    }
  }, [selectedFolderId, accountId, accessToken, addLog]);

  // Handle generation
  const handleGenerate = useCallback(async (curlOrRequest: string | GraphWorkflowRequest) => {
    setIsGenerating(true);
    setError(null);
    setJobId(null);
    setJobStatus(null);
    setProgress(0);
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      // Ensure authenticated
      await ensureAuthenticated();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      // Parse curl or use request directly
      let request: GraphWorkflowRequest;
      if (typeof curlOrRequest === 'string') {
        addLog('Parsing curl command...');
        const parsed = graphServiceRef.current.parseCurlCommand(curlOrRequest);
        request = parsed.body;
      } else {
        request = curlOrRequest;
      }
      
      // Submit job
      addLog('Submitting Graph Enterprise job...');
      const submitResponse = await graphServiceRef.current.submitJob(request, accessToken);
      
      setJobId(submitResponse.jobId);
      addLog(`Job submitted: ${submitResponse.jobId}`);
      
      if (submitResponse.message) {
        addLog(submitResponse.message);
      }
      
      // Poll for completion
      addLog('Polling for job completion...');
      setJobStatus('running');
      
      const result = await graphServiceRef.current.pollUntilComplete(
        submitResponse.jobId,
        accessToken,
        {
          pollInterval: 2000,
          maxPollTime: 300000, // 5 minutes
          abortSignal: abortControllerRef.current.signal,
          onProgress: (status: GraphJobStatusResponse) => {
            setJobStatus(status.status);
            setProgress(status.progress || 0);
            addLog(`Status: ${status.status}${status.progress ? ` (${status.progress}%)` : ''}`);
          },
        }
      );
      
      setJobStatus('completed');
      setProgress(100);
      addLog(`Job completed! ${result.outputs?.length || 0} outputs`);
      
      // Refresh Frame.io assets to pick up new outputs
      if (selectedFolderId) {
        addLog('Refreshing Frame.io assets...');
        await loadAssets(selectedFolderId);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      setJobStatus('failed');
      addLog(`Error: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [selectedFolderId, loadAssets, addLog, accessToken]);

  // Refresh results
  const refreshResults = useCallback(async () => {
    if (selectedFolderId) {
      await loadAssets(selectedFolderId);
    }
  }, [selectedFolderId, loadAssets]);

  // Cancel generation
  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      addLog('Generation cancelled by user');
      setIsGenerating(false);
      setJobStatus('cancelled');
    }
  }, [addLog]);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Auto-load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    // State
    projects,
    selectedProject,
    selectedFolderId,
    assets,
    jobId,
    jobStatus,
    progress,
    logs,
    error,
    isLoadingProjects,
    isLoadingAssets,
    isGenerating,
    
    // Actions
    actions: {
      loadProjects,
      selectProject,
      selectFolder,
      loadAssets,
      handleGenerate,
      refreshResults,
      cancelGeneration,
      clearLogs,
    },
  };
}
