// @ts-ignore
import React, { useState } from "react";

import { uxp, premierepro } from "./globals";
import { api } from "./api/api";
import { createIMSService } from "./services/ims/IMSService";
import "./layout.scss";

export const App = () => {
  const [imsToken, setImsToken] = useState<string | null>(null);
  const [imsStatus, setImsStatus] = useState<string>('Not authenticated');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const hostName = (uxp.host.name as string).toLowerCase();

  //* Call Functions Conditionally by App
  if (hostName === "premierepro") {
    console.log("Hello from Premiere Pro", premierepro);
  }

  const testIMSAuthentication = async () => {
    setIsAuthenticating(true);
    setImsStatus('Authenticating...');
    
    try {
      console.log('🔐 Starting IMS authentication test...');
      
      // Create IMS service instance
      const imsService = createIMSService();
      
      // Test token info first
      const tokenInfo = imsService.getTokenInfo();
      console.log('📊 Current token info:', tokenInfo);
      
      // Get access token
      const accessToken = await imsService.getAccessToken();
      
      console.log('✅ IMS authentication successful!');
      console.log('🎟️ Token received:', accessToken.substring(0, 20) + '...');
      
      setImsToken(accessToken);
      setImsStatus(`✅ Authenticated! Token: ${accessToken.substring(0, 20)}...`);
      api.notify('🎉 IMS Authentication Successful!');
      
      // Optional: Try to validate the token (non-critical)
      try {
        const validation = await imsService.validateToken(accessToken);
        console.log('🔍 Token validation:', validation);
        
        if (validation.valid) {
          setImsStatus(`✅ Valid token! User: ${validation.user_id || 'Unknown'}`);
        }
      } catch (validationError) {
        console.warn('⚠️ Token validation failed (non-critical):', validationError);
        // Don't change success status - token acquisition is what matters
      }
      
    } catch (error) {
      console.error('❌ IMS authentication failed:', error);
      setImsStatus(`Error: ${error instanceof Error ? error.message : 'Authentication failed'}`);
      api.notify(`IMS Error: ${error instanceof Error ? error.message : 'Authentication failed'}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="uxp-app">
      {/* Header */}
      <header className="uxp-header">
        <h1 className="text-heading-medium">Adobe UXP Panel</h1>
        <div className="text-detail">Premiere Pro</div>
      </header>

      {/* Main Content Area */}
      <main className="uxp-main">
        {/* Sidebar Navigation */}
        <aside className="uxp-sidebar">
          <div className="content-area">
            <h2 className="text-heading-small mb-md">Tools</h2>
            {/* @ts-ignore */}
            <sp-divider size="small"></sp-divider>
            <nav style={{ marginTop: '16px' }}>
              <div className="text-body mb-sm text-active">• Authentication</div>
              <div className="text-body mb-sm text-muted">• Media Export</div>
              <div className="text-body mb-sm text-muted">• Timeline Tools</div>
              <div className="text-body mb-sm text-muted">• Asset Manager</div>
            </nav>
          </div>
        </aside>

        {/* Primary Content */}
        <section className="uxp-content">
          <div className="content-area">
            {/* Authentication Card */}
            <article className="card">
              <header className="card-header">
                <h2 className="card-title">IMS Authentication</h2>
                <div className="text-detail">Adobe Identity Management</div>
              </header>
              
              <div className="card-body">
                <p className="mb-md">Test your connection to Adobe's Identity Management System.</p>
                
                <div className="button-group mb-md">
                  {/* @ts-ignore */}
                  <sp-action-button 
                    onClick={testIMSAuthentication} 
                    disabled={isAuthenticating}
                  >
                    {/* @ts-ignore */}
                    <sp-icon name="ui:CheckmarkMedium" size="s" slot="icon"></sp-icon>
                    {isAuthenticating ? 'Authenticating...' : 'Authentication'}
                     {/* @ts-ignore */}
                     </sp-action-button>
                </div>

                {/* Status Section */}
                <div className="status-section">
                  <h3>Connection Status</h3>
                  <p className={
                    imsStatus.includes('✅') ? 'text-success' :
                    imsStatus.includes('Error') ? 'text-error' :
                    imsStatus.includes('Authenticating') ? 'text-warning' :
                    'text-muted'
                  }>
                    {imsStatus}
                  </p>
                  
                  {imsToken && (
                    <div style={{ marginTop: '16px' }}>
                      <h4 className="text-heading-small mb-sm">Authentication Details</h4>
                      <details style={{ cursor: 'pointer' }}>
                        <summary className="text-detail" style={{ cursor: 'pointer', marginBottom: '8px' }}>
                          Show Full Token
                        </summary>
                        <div className="text-code" style={{ 
                          wordBreak: 'break-all',
                          whiteSpace: 'pre-wrap',
                          maxHeight: '200px',
                          overflow: 'auto',
                          marginTop: '8px'
                        }}>
                          {imsToken}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Panel Information Card */}
            <article className="card">
              <header className="card-header">
                <h2 className="card-title">Panel Information</h2>
              </header>
              <div className="card-body">
                <p className="mb-sm">This UXP panel is built with:</p>
                <ul className="text-body" style={{ paddingLeft: '20px', margin: '8px 0' }}>
                  <li>React 19.1.1</li>
                  <li>TypeScript</li>
                  <li>Spectrum Design System</li>
                  <li>Adobe UXP APIs</li>
                  <li>IMS Authentication</li>
                </ul>
                <div className="text-detail">
                  Host: {hostName || 'Unknown'}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="uxp-footer">
        <div className="text-detail">UXP Panel v1.0.0</div>
        <div className="text-detail">
          {isAuthenticating ? 'Authenticating...' : imsToken ? 'Authenticated' : 'Ready'}
        </div>
      </footer>
    </div>
  );
};
