/**
 * Graph Generations Panel
 * Dev-only UI for Graph Enterprise + Frame.io integration
 * Three-column layout: Input | Status | Results
 */

import React, { useState, useEffect } from 'react';
import { useGraphFrameIO, DEFAULT_CURL_EXAMPLE } from '../../hooks/useGraphFrameIO';
import { useToastHelpers } from '../../hooks/useToast';
import './GraphGenerationsPanel.scss';

export const GraphGenerationsPanel: React.FC = () => {
  const {
    projects,
    selectedProject,
    assets,
    jobId,
    jobStatus,
    progress,
    logs,
    error,
    isLoadingProjects,
    isLoadingAssets,
    isGenerating,
    actions,
  } = useGraphFrameIO();

  const { showError } = useToastHelpers();
  const [curlInput, setCurlInput] = useState(DEFAULT_CURL_EXAMPLE);

  // Show toast on error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  // Debug logging
  useEffect(() => {
    console.log('GraphGenerationsPanel mounted');
    console.log('Projects:', projects);
    console.log('Logs:', logs);
    console.log('Error:', error);
  }, [projects, logs, error]);

  const handleProjectChange = (e: any) => {
    const selectedIndex = e.target.selectedIndex;
    const project = projects[selectedIndex];
    if (project) {
      actions.selectProject(project);
      // Auto-load assets from root folder
      actions.loadAssets(project.root_folder_id);
    }
  };

  const handleGenerate = () => {
    if (!curlInput.trim()) return;
    actions.handleGenerate(curlInput);
  };

  const handleRefresh = () => {
    actions.refreshResults();
  };

  console.log('GraphGenerationsPanel render - projects:', projects.length, 'logs:', logs.length);

  return (
    <div className="graph-generations-panel" style={{ background: '#2a2a2a', minHeight: '400px' }}>
      <div className="panel-header">
        <h2 className="panel-title">Graph Generations</h2>
        <span className="badge badge--info">DEV ONLY</span>
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#888' }}>
          Projects: {projects.length} | Logs: {logs.length} | {error ? `Error: ${error}` : 'OK'}
        </div>
      </div>

      <div className="panel-grid">
        {/* Left Column: Input */}
        <div className="panel-column input-column">
          <div className="column-header">
            <h3>Input</h3>
          </div>

          <div className="column-content">
            {/* Frame.io Project Selector */}
            <div className="form-group">
              <sp-label className="form-label">Frame.io Project</sp-label>
              <sp-picker
                placeholder={isLoadingProjects ? 'Loading...' : 'Select project'}
                className="project-dropdown"
                onChange={handleProjectChange}
                disabled={isLoadingProjects}
                style={{ width: '100%' }}
              >
                <sp-menu slot="options">
                  {projects.map((project, index) => (
                    <sp-menu-item key={project.id}>
                      {project.name}
                    </sp-menu-item>
                  ))}
                </sp-menu>
              </sp-picker>
              {selectedProject && (
                <div className="text-detail mt-xs">
                  Root folder: {selectedProject.root_folder_id}
                </div>
              )}
            </div>

            {/* Curl Input */}
            <div className="form-group">
              <sp-label className="form-label">Graph Curl Request</sp-label>
              <div className="text-detail mb-sm">
                Paste curl command or modify the example below
              </div>
              <sp-textarea
                id="curl-input"
                placeholder="Paste curl command here..."
                className="curl-input"
                rows={12}
                value={curlInput}
                onInput={(e: any) => setCurlInput(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <div className="form-actions">
              <sp-button
                variant="accent"
                size="m"
                className="generate-button"
                onClick={handleGenerate}
                disabled={isGenerating || !curlInput.trim() || !selectedProject}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </sp-button>
              {isGenerating && (
                <sp-button
                  variant="secondary"
                  size="m"
                  className="cancel-button ml-sm"
                  onClick={actions.cancelGeneration}
                >
                  Cancel
                </sp-button>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Status */}
        <div className="panel-column status-column">
          <div className="column-header">
            <h3>Status</h3>
            {/* @ts-ignore - UXP Spectrum component with size prop */}
            <sp-action-button size="s" quiet={true} onClick={actions.clearLogs} disabled={logs.length === 0}>
              Clear
            </sp-action-button>
          </div>

          <div className="column-content">
            {/* Job Info */}
            {jobId && (
              <div className="job-info">
                <div className="info-row">
                  <span className="info-label">Job ID:</span>
                  <span className="info-value monospace">{jobId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span
                    className={`badge badge--${
                      jobStatus === 'completed' ? 'positive' :
                      jobStatus === 'failed' ? 'negative' :
                      jobStatus === 'cancelled' ? 'neutral' :
                      'info'
                    }`}
                  >
                    {jobStatus || 'pending'}
                  </span>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {isGenerating && (
              <div className="progress-section">
                {/* @ts-ignore - UXP Spectrum component */}
                <sp-progressbar
                  value={progress}
                  indeterminate={progress === 0}
                />
                <div className="text-detail text-center mt-xs">
                  {progress > 0 ? `${Math.round(progress)}%` : 'Processing...'}
                </div>
              </div>
            )}

            {/* Logs */}
            <div className="logs-section">
              <sp-label className="form-label">Logs</sp-label>
              <div className="logs-container">
                {logs.length === 0 ? (
                  <div className="text-detail empty-state">
                    No logs yet. Click Generate to start.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="log-entry">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="panel-column results-column">
          <div className="column-header">
            <h3>Results</h3>
            {/* @ts-ignore - UXP Spectrum component with size prop */}
            <sp-action-button size="s" quiet={true} onClick={handleRefresh} disabled={isLoadingAssets || !selectedProject}>
              Refresh
            </sp-action-button>
          </div>

          <div className="column-content">
            {isLoadingAssets ? (
              <div className="loading-state">
                {/* @ts-ignore - UXP Spectrum component */}
                <sp-progressbar indeterminate />
              </div>
            ) : assets.length === 0 ? (
              <div className="empty-state text-detail">
                {selectedProject
                  ? 'No assets found in this folder yet.'
                  : 'Select a project to view results.'}
              </div>
            ) : (
              <div className="assets-grid">
                {assets.map(asset => (
                  <div key={asset.id} className="asset-card">
                    {asset.thumbnail_url ? (
                      <img
                        src={asset.thumbnail_url}
                        alt={asset.name}
                        className="asset-thumbnail"
                      />
                    ) : (
                      <div className="asset-placeholder">
                        <sp-icon name="TvFile" size="l" />
                      </div>
                    )}
                    <div className="asset-info">
                      <div className="asset-name" title={asset.name}>
                        {asset.name}
                      </div>
                      <div className="asset-meta text-detail">
                        {asset.filetype && <span>{asset.filetype}</span>}
                        {asset.filesize && (
                          <span> • {(asset.filesize / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
