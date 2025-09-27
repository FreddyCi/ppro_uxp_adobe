// @ts-ignore
import React, { useState } from "react";

import { uxp, premierepro } from "./globals";
import { api } from "./api/api";
import { createIMSService } from "./services/ims/IMSService";

export const App = () => {
  const [count, setCount] = useState(0);
  const [imsToken, setImsToken] = useState<string | null>(null);
  const [imsStatus, setImsStatus] = useState<string>('Not authenticated');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const increment = () => setCount((prev: number) => prev + 1);

  const hostName = (uxp.host.name as string).toLowerCase();

  //* Call Functions Conditionally by App
  if (hostName === "premierepro") {
    console.log("Hello from Premiere Pro", premierepro);
  }
  
  //* Or call the unified API object directly and the correct app function will be used
  const helloWorld = () => {
    api.notify("Hello World");
  };
  const hybridTest = async () => {
    try {
      let hybridModule: {
        execSync: (cmd: string) => string;
      } = await require("bolt-uxp-hybrid.uxpaddon");
      let execSyncRes = hybridModule.execSync("echo test");
      console.log(`execSyncRes = `, execSyncRes);
      api.notify(`execSyncRes = ${execSyncRes}`);
    } catch (err) {
      console.log("Execute as execSync command failed", err);
    }
  };

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
    <>
      <main>
        <div className="button-group">
          {/* @ts-ignore */}
          <sp-button onClick={increment}>count is {count}</sp-button>
          {/* @ts-ignore */}
          <sp-button onClick={helloWorld}>Hello World</sp-button>
          {/* @ts-ignore */}
          <sp-button onClick={hybridTest}>Hybrid</sp-button>
          {/* @ts-ignore */}
          <sp-button 
            onClick={testIMSAuthentication} 
            disabled={isAuthenticating}
          >
            {isAuthenticating ? 'Authenticating...' : 'Test IMS Auth'}
            {/* @ts-ignore */}
          </sp-button>
        </div>
        
        <div className="status-section" style={{ marginTop: '20px', padding: '10px', background: '#333', borderRadius: '4px' }}>
          <h3>IMS Authentication Status:</h3>
          <p style={{ color: imsToken ? '#4CAF50' : '#FFA726', margin: '5px 0' }}>
            {imsStatus}
          </p>
          {imsToken && (
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', color: '#81C784' }}>Show Full Token</summary>
              <pre style={{ 
                background: '#1e1e1e', 
                padding: '10px', 
                borderRadius: '4px', 
                fontSize: '12px',
                wordBreak: 'break-all',
                marginTop: '5px'
              }}>
                {imsToken}
              </pre>
            </details>
          )}
        </div>
      </main>
    </>
  );
};
