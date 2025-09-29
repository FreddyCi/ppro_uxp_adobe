// @ts-ignore
import React, { useState, useEffect } from "react";

import { uxp, premierepro } from "./globals";
import { api } from "./api/api";
import { createIMSService } from "./services/ims/IMSService";
import { FireflyService } from "./services/firefly";
import { useGenerationStore } from "./store/generationStore";
import { RefreshIcon, ToastProvider, useToastHelpers, Gallery } from "./components";
import "./layout.scss";

const AppContent = () => {
  const [imsToken, setImsToken] = useState<string | null>(null);
  const [imsStatus, setImsStatus] = useState<string>('Not authenticated');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery'>('generate');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to dark mode for UXP
  
  // Image generation form state
  const [prompt, setPrompt] = useState<string>('');
  const [stylePreset, setStylePreset] = useState<string>('art');
  const [contentType, setContentType] = useState<'art' | 'photo'>('art');
  const [aspectRatio, setAspectRatio] = useState<string>('square');
  const [seedValue, setSeedValue] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Get toast helpers
  const { showSuccess, showError, showInfo, showWarning } = useToastHelpers();
  
  // Get generation store actions
  const { actions: { addGeneration } } = useGenerationStore();

  const hostName = (uxp.host.name as string).toLowerCase();

  //* Call Functions Conditionally by App
  if (hostName === "premierepro") {
    console.log("Hello from Premiere Pro", premierepro);
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to the root element
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };



  // Handle image generation
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for your image.');
      return;
    }

    if (!imsToken) {
      showError('Authentication Required', 'Please log in first to generate images.');
      return;
    }

    setIsGenerating(true);

    try {
      showInfo('Generating Image', `Creating "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);
      
      console.log('🎨 Starting Firefly image generation...');
      console.log('📝 Generation parameters:', {
        prompt: prompt,
        stylePreset: stylePreset,
        contentType: contentType,
        aspectRatio: aspectRatio,
        seed: seedValue > 0 ? seedValue : undefined
      });
      
      // Create Firefly service with IMS token
      const imsService = createIMSService();
      const fireflyService = new FireflyService(imsService);
      
      // Build generation request
      const generationRequest = {
        prompt: prompt,
        contentClass: contentType as 'photo' | 'art',
        size: aspectRatio === '1:1' ? { width: 1024, height: 1024 } :
              aspectRatio === '16:9' ? { width: 1920, height: 1080 } :
              aspectRatio === '9:16' ? { width: 1080, height: 1920 } :
              { width: 1024, height: 1024 }, // default to square
        numVariations: 1,
        seeds: seedValue > 0 ? [seedValue] : undefined
      };
      
      console.log('🚀 Sending generation request:', generationRequest);
      
      // Call Firefly API
      const response = await fireflyService.generateImage(generationRequest);
      console.log('✅ Firefly API response received:', response);
      
      // Poll for completion
      const completedJob = await fireflyService.pollUntilComplete(response.data.jobId);
      console.log('🎉 Generation completed:', completedJob);
      
      if (completedJob.outputs && completedJob.outputs.length > 0) {
        const generationResult = completedJob.outputs[0];
        console.log('🖼️ Generated image result:', generationResult);
        
        // Add to generation store
        addGeneration(generationResult);
        
        showSuccess('Image Generated', 'Your image has been created successfully!');
      } else {
        throw new Error('No images were generated');
      }
      
    } catch (error: any) {
      console.error('❌ Image generation failed:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack
      });
      showError('Generation Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize theme on component mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Clear any lingering auth dialogs and reset state
  const clearAuthState = () => {
    console.log('🔄 Clearing authentication state and dialogs...');
    setImsToken(null);
    setImsStatus('Not authenticated');
    setIsAuthenticating(false);
    
    // Clear any cached IMS data
    try {
      const imsService = createIMSService();
      imsService.clearTokenCache();
      showInfo('Auth Cleared', 'Authentication state has been reset');
    } catch (error) {
      console.warn('Failed to clear IMS cache:', error);
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
      
      // Show success toast
      showSuccess('Authentication Successful', 'Connected to Adobe Identity Management System');
      
      // Optional: Try to validate the token (non-critical)
      try {
        const validation = await imsService.validateToken(accessToken);
        console.log('🔍 Token validation:', validation);
        
        if (validation.valid) {
          setImsStatus(`✅ Valid token! User: ${validation.user_id || 'Unknown'}`);
          showInfo('Token Validated', `User: ${validation.user_id || 'Unknown'}`);
        }
      } catch (validationError) {
        console.warn('⚠️ Token validation failed (non-critical):', validationError);
        // Don't change success status - token acquisition is what matters
      }
      
    } catch (error) {
      console.error('❌ IMS authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setImsStatus(`Error: ${errorMessage}`);
      
      // Show error toast
      showError('Authentication Failed', errorMessage);
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
        {/* Tab Navigation */}
        <div className="uxp-tabs">
          <div 
            className={`uxp-tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate
          </div>
          <div 
            className={`uxp-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </div>
        </div>

        {/* Primary Content */}
        <section className="uxp-content">
          <div className="content-area">
            {activeTab === 'generate' && (
              <>


                {/* Image Generation Card */}
                <article className="card">
                  <header className="card-header">
                    <h2 className="card-title">Generate Images</h2>
                    <div className="text-detail">Create images using Adobe Firefly AI</div>
                  </header>
                  <div className="card-body">
                    {!imsToken ? (
                      <div className="auth-required">
                        <div className="text-detail" style={{ color: 'var(--theme-warning)' }}>
                          Please authenticate to generate images
                        </div>

                        {/* @ts-ignore */}
                        <sp-button variant="accent" size="s" onClick={testIMSAuthentication} style={{ marginLeft: '12px' }}>
                          Login
                        {/* @ts-ignore */}
                        </sp-button>
                      </div>
                    ) : (
                      <div className="generation-form">
                        {/* Prompt Input */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Prompt *</sp-label>
                          {/* @ts-ignore */}
                          <sp-textarea 
                            id="prompt-input"
                            placeholder="A majestic mountain landscape at sunset with purple clouds..."
                            className="prompt-input"
                            multiline
                            rows={3}
                            maxlength={1000}
                            value={prompt}
                            onInput={(e: any) => setPrompt(e.target.value)}
                          >
                          {/* @ts-ignore */}
                          </sp-textarea>
                          <div className="character-counter text-detail">
                            {prompt.length}/1000 characters
                          </div>
                        </div>

                        {/* Style Preset */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Style Preset</sp-label>
                          <div className="text-detail mb-sm">Choose a visual style for your image</div>
                          {/* @ts-ignore */}
                          <sp-picker 
                            placeholder="No Style" 
                            className="style-dropdown"
                            value={stylePreset}
                            onChange={(e: any) => setStylePreset(e.target.value)}
                          >
                            {/* @ts-ignore */}
                            <sp-menu slot="options">
                              {/* @ts-ignore */}
                              <sp-menu-item value="">No Style</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="photographic">Photographic</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="digital-art">Digital Art</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="graphic-design">Graphic Design</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="3d">3D</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="painting">Painting</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="sketch">Sketch</sp-menu-item>
                            {/* @ts-ignore */}
                            </sp-menu>
                          {/* @ts-ignore */}
                          </sp-picker>
                        </div>

                        {/* Content Type */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Content Type</sp-label>
                          <div className="text-detail mb-sm">Choose between artistic or photorealistic content</div>
                          {/* @ts-ignore */}
                          <sp-radio-group 
                            value={contentType} 
                            className="content-type-group"
                            onChange={(e: any) => setContentType(e.target.value)}
                          >
                            {/* @ts-ignore */}
                            <sp-radio value="art">
                              <span className="radio-label">Art</span>
                              <div className="radio-description text-detail">Creative, artistic content</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="photo">
                              <span className="radio-label">Photo</span>
                              <div className="radio-description text-detail">Photorealistic content</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                          {/* @ts-ignore */}
                          </sp-radio-group>
                        </div>

                        {/* Aspect Ratio */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Aspect Ratio</sp-label>
                          <div className="text-detail mb-sm">Choose image dimensions</div>
                          {/* @ts-ignore */}
                          <sp-radio-group 
                            value={aspectRatio} 
                            className="content-type-group"
                            onChange={(e: any) => setAspectRatio(e.target.value)}
                          >
                            {/* @ts-ignore */}
                            <sp-radio value="square">
                              <span className="radio-label">Square</span>
                              <div className="radio-description text-detail">1024×1024</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="landscape">
                              <span className="radio-label">Landscape</span>
                              <div className="radio-description text-detail">1792×1024</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="portrait">
                              <span className="radio-label">Portrait</span>
                              <div className="radio-description text-detail">1024×1792</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="ultrawide">
                              <span className="radio-label">Ultrawide</span>
                              <div className="radio-description text-detail">2048×896</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                          {/* @ts-ignore */}
                          </sp-radio-group>
                        </div>

                        {/* Standard, Portrait, Ultrawide sizes */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-radio-group className="size-presets">
                            {/* @ts-ignore */}
                            <sp-radio value="standard">
                              <span>Standard</span>
                              <div className="text-detail">1408×1024</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="portrait">
                              <span>Portrait</span>
                              <div className="text-detail">1024×1408</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="ultrawide">
                              <span>Ultrawide</span>
                              <div className="text-detail">2048×896</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                          {/* @ts-ignore */}
                          </sp-radio-group>
                        </div>

                        {/* Seed (Optional) */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Seed (Optional)</sp-label>
                          {/* @ts-ignore */}
                          <sp-slider 
                            min={0} 
                            max={999999} 
                            value={seedValue}
                            step={1}
                            className="seed-slider"
                            onInput={(e: any) => setSeedValue(parseInt(e.target.value) || 0)}
                          >
                          {/* @ts-ignore */}
                          </sp-slider>
                        </div>

                        {/* Generate Button */}
                        <div className="form-actions">
                          {/* @ts-ignore */}
                          <sp-button 
                            variant="accent" 
                            size="m"
                            className="generate-button"
                            onClick={handleGenerateImage}
                            disabled={isGenerating || !prompt.trim()}
                          >
                            {isGenerating ? (
                              /* @ts-ignore */
                              <sp-icon name="ui:Clock" size="s" slot="icon"></sp-icon>
                            ) : (
                              <RefreshIcon size={14} className="theme-icon" />
                            )}
                            {isGenerating ? 'Generating...' : 'Generate'}
                          {/* @ts-ignore */}
                          </sp-button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </>
            )}

            {activeTab === 'gallery' && (
              <Gallery />
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="uxp-footer">
        <div className="text-detail">UXP Panel v1.0.0</div>
        <div className="footer-controls">
          <div className="text-detail">
            {isAuthenticating ? 'Authenticating...' : imsToken ? 'Authenticated' : 'Ready'}
          </div>

          {/* Theme Toggle */}
          {/* @ts-ignore */}
          <sp-action-button 
            quiet 
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="theme-toggle"
          >
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          {/* @ts-ignore */}
          </sp-action-button>

          {/* Logout Button */}
          {imsToken && (
            /* @ts-ignore */
            <sp-action-button 
              quiet 
              onClick={clearAuthState}
              title="Logout"
              className="logout-button"
            >
              <span>Logout</span>
            {/* @ts-ignore */}
            </sp-action-button>
          )}
        </div>
      </footer>
    </div>
  );
};

// Main App component with ToastProvider
export const App = () => {
  return (
    <ToastProvider maxToasts={5} defaultDuration={5000}>
      <AppContent />
    </ToastProvider>
  );
};
