// @ts-ignore
import React, { useState, useEffect } from "react";

import { uxp, premierepro } from "./globals";
import { api } from "./api/api";
import { createIMSService } from "./services/ims/IMSService";
import { FireflyService } from "./services/firefly";
import { useGenerationStore } from "./store/generationStore";
import { MoonIcon, RefreshIcon, SunIcon, ToastProvider, useToastHelpers, Gallery } from "./components";
import "./layout.scss";
import { v4 as uuidv4 } from 'uuid';
import { saveGenerationLocally } from './services/local/localBoltStorage';
import { LtxVideoService } from './services/ltx';
import { LumaVideoService } from './services/luma';
import type { LumaGenerationRequest, LumaVideoModel } from './types/luma';

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
  
  // Generation mode state
  const [generationMode, setGenerationMode] = useState<'firefly' | 'ltx' | 'luma'>('firefly');
  
  // LTX video generation form state
  const [ltxPrompt, setLtxPrompt] = useState<string>('');
  const [ltxDuration, setLtxDuration] = useState<number>(6);
  const [ltxFps, setLtxFps] = useState<number>(24);
  const [ltxWidth, setLtxWidth] = useState<number>(1280);
  const [ltxHeight, setLtxHeight] = useState<number>(720);
  const [ltxSeed, setLtxSeed] = useState<number>(0);
  const [isGeneratingLtx, setIsGeneratingLtx] = useState<boolean>(false);

  // Luma Dream Machine generation form state
  const [lumaPrompt, setLumaPrompt] = useState<string>('');
  const [lumaModel, setLumaModel] = useState<string>('ray-2');
  const [lumaAspectRatio, setLumaAspectRatio] = useState<string>('16:9');
  const [lumaDuration, setLumaDuration] = useState<string>('5s');
  const [lumaResolution, setLumaResolution] = useState<string>('1080p');
  const [lumaLoop, setLumaLoop] = useState<boolean>(false);
  const [isGeneratingLuma, setIsGeneratingLuma] = useState<boolean>(false);
  
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

  // Handle LTX video generation
  const handleGenerateLtxVideo = async () => {
    if (!ltxPrompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for your video.');
      return;
    }

    setIsGeneratingLtx(true);

    try {
      showInfo('Generating Video', `Creating "${ltxPrompt.substring(0, 50)}${ltxPrompt.length > 50 ? '...' : ''}"`);
      
      console.log('🎬 Starting LTX video generation...');
      console.log('📝 LTX generation parameters:', {
        prompt: ltxPrompt,
        duration_seconds: ltxDuration,
        fps: ltxFps,
        width: ltxWidth,
        height: ltxHeight,
        seed: ltxSeed > 0 ? ltxSeed : undefined
      });
      
      // Import LTX service
      // const { LtxVideoService } = await import('./services/ltx');
      
      // Create LTX service instance
      const ltxService = new LtxVideoService({
        timeout: 240_000, // 4 minutes for video generation
      });
      
      // Build LTX request
      const ltxRequest = {
        prompt: ltxPrompt,
        duration_seconds: ltxDuration,
        fps: ltxFps,
        width: ltxWidth,
        height: ltxHeight,
        seed: ltxSeed > 0 ? ltxSeed : undefined
      };
      
      console.log('🚀 Sending LTX generation request:', ltxRequest);
      
      // Call LTX API
      const result = await ltxService.generateVideo(ltxRequest);
      console.log('✅ LTX video generation completed:', result);
      
      // Save video to local storage
      console.log('💾 Saving LTX video to local storage...');
      const localSaveResult = await saveGenerationLocally({
        blob: result.blob,
        metadata: {
          prompt: ltxPrompt,
          seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
          jobId: result.metadata.requestId,
          model: 'LTX Video',
          version: '1.0',
          timestamp: Date.now(),
          filename: result.filename,
          contentType: result.contentType,
          fileSize: result.blob.size,
          duration: ltxDuration,
          fps: ltxFps,
          resolution: { width: ltxWidth, height: ltxHeight },
          persistenceMethod: 'local' as const,
          storageMode: 'local' as const,
        },
        filename: result.filename,
      });
      
      if (!localSaveResult) {
        console.warn('⚠️ Local save failed, falling back to data URL');
        // Fallback to data URL if local save fails
        const arrayBuffer = await result.blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const base64 = btoa(String.fromCharCode(...bytes));
        const videoUrl = `data:${result.contentType};base64,${base64}`;
        
        // Create generation result for the video
        const videoGenerationResult = {
          id: uuidv4(),
          imageUrl: videoUrl,
          videoUrl: videoUrl,
          videoBlob: result.blob,
          seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
          contentType: 'video' as const,
          duration: ltxDuration,
          fps: ltxFps,
          resolution: { width: ltxWidth, height: ltxHeight },
          metadata: {
            prompt: ltxPrompt,
            seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
            jobId: result.metadata.requestId,
            model: 'LTX Video',
            version: '1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: ltxDuration,
            fps: ltxFps,
            resolution: { width: ltxWidth, height: ltxHeight },
            persistenceMethod: 'dataUrl' as const,
            storageMode: 'local' as const,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          blobUrl: videoUrl,
          localPath: result.filename,
        };
        
        // Add video to generation store
        addGeneration(videoGenerationResult);
        
        showSuccess('Video Generated', `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved in memory only`);
        
        console.log('🎥 Video added to gallery store (data URL fallback):', {
          id: videoGenerationResult.id,
          videoUrl,
          filename: result.filename,
          size: result.blob.size
        });
      } else {
        console.log('✅ LTX video saved locally:', localSaveResult);
        
        // Create generation result for the video with local file reference
        const videoGenerationResult = {
          id: uuidv4(),
          imageUrl: '', // Will be set by toTempUrl in gallery
          videoUrl: '', // Will be set by toTempUrl in gallery
          videoBlob: result.blob,
          seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
          contentType: 'video' as const,
          duration: ltxDuration,
          fps: ltxFps,
          resolution: { width: ltxWidth, height: ltxHeight },
          metadata: {
            prompt: ltxPrompt,
            seed: ltxSeed > 0 ? ltxSeed : Math.floor(Math.random() * 999999),
            jobId: result.metadata.requestId,
            model: 'LTX Video',
            version: '1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: ltxDuration,
            fps: ltxFps,
            resolution: { width: ltxWidth, height: ltxHeight },
            persistenceMethod: 'local' as const,
            storageMode: 'local' as const,
            folderToken: localSaveResult.folderToken,
            relativePath: localSaveResult.relativePath,
            localFilePath: localSaveResult.filePath,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          localPath: localSaveResult.filePath,
        };
        
        // Add video to generation store
        addGeneration(videoGenerationResult);
        
        showSuccess('Video Generated', `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved to ${localSaveResult.displayPath || localSaveResult.filePath}`);
        
        console.log('🎥 Video added to gallery store (local file):', {
          id: videoGenerationResult.id,
          localPath: localSaveResult.filePath,
          relativePath: localSaveResult.relativePath,
          filename: result.filename,
          size: result.blob.size
        });
      }
      
    } catch (error: any) {
      console.error('❌ LTX video generation failed:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.status,
        stack: error.stack
      });
      showError('Video Generation Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingLtx(false);
    }
  };

  const handleGenerateLumaVideo = async () => {
    if (!lumaPrompt.trim()) {
      showWarning('Missing Prompt', 'Please enter a description for your video.');
      return;
    }

    setIsGeneratingLuma(true);

    const resolutionLookup: Record<string, { width: number; height: number }> = {
      '540p': { width: 960, height: 540 },
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '1440p': { width: 2560, height: 1440 },
      '4k': { width: 3840, height: 2160 },
    }

    try {
      showInfo('Generating Video', `Dreaming up "${lumaPrompt.substring(0, 50)}${lumaPrompt.length > 50 ? '...' : ''}"`);

      console.log('🎞️ Starting Luma Dream Machine video generation...');
      console.log('📝 Luma generation parameters:', {
        prompt: lumaPrompt,
        model: lumaModel,
        aspect_ratio: lumaAspectRatio,
        duration: lumaDuration,
        resolution: lumaResolution,
        loop: lumaLoop,
      });

      const lumaService = new LumaVideoService({
        pollIntervalMs: 5_000,
        maxPollAttempts: 120,
      });

      const lumaRequest: LumaGenerationRequest = {
        prompt: lumaPrompt,
        model: lumaModel as LumaVideoModel,
        aspect_ratio: lumaAspectRatio,
        duration: lumaDuration,
        resolution: lumaResolution,
        loop: lumaLoop,
      };

      console.log('🚀 Sending Luma Dream Machine request:', lumaRequest);

      const result = await lumaService.generateVideo(lumaRequest);
      console.log('✅ Luma Dream Machine generation completed:', result);

      const durationSeconds = parseInt(lumaDuration.replace(/[^0-9]/g, ''), 10) || undefined;
      const computedSeed = Math.floor(Math.random() * 999999);
      const resolutionKey = typeof lumaResolution === 'string' ? lumaResolution.toLowerCase() : '';
      const resolutionSize = resolutionLookup[resolutionKey] ?? undefined;

      console.log('💾 Saving Luma Dream Machine video to local storage...');
      const localSaveResult = await saveGenerationLocally({
        blob: result.blob,
        metadata: {
          prompt: result.metadata.prompt || lumaPrompt,
          seed: computedSeed,
          jobId: result.metadata.id,
          model: result.metadata.model || lumaModel,
          version: 'Dream Machine 1.1.0',
          timestamp: Date.now(),
          filename: result.filename,
          contentType: result.contentType,
          fileSize: result.blob.size,
          duration: durationSeconds,
          fps: undefined,
          resolution: resolutionSize,
          persistenceMethod: 'local' as const,
          storageMode: 'local' as const,
        },
        filename: result.filename,
      });

      if (!localSaveResult) {
        console.warn('⚠️ Local save failed, falling back to data URL');

        const arrayBuffer = await result.blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const base64 = btoa(String.fromCharCode(...bytes));
        const videoUrl = `data:${result.contentType};base64,${base64}`;

        const videoGenerationResult = {
          id: uuidv4(),
          imageUrl: '',
          videoUrl,
          videoBlob: result.blob,
          seed: computedSeed,
          contentType: 'video' as const,
          duration: durationSeconds,
          fps: undefined,
          resolution: resolutionSize,
          metadata: {
            prompt: result.metadata.prompt || lumaPrompt,
            seed: computedSeed,
            jobId: result.metadata.id,
            model: result.metadata.model || lumaModel,
            version: 'Dream Machine 1.1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: durationSeconds,
            fps: undefined,
            resolution: resolutionSize,
            persistenceMethod: 'dataUrl' as const,
            storageMode: 'local' as const,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          blobUrl: videoUrl,
          localPath: result.filename,
        };

        addGeneration(videoGenerationResult);

        showSuccess(
          'Video Generated',
          `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved in memory only`
        );

        console.log('🎥 Video added to gallery store (data URL fallback):', {
          id: videoGenerationResult.id,
          videoUrl,
          filename: result.filename,
          size: result.blob.size,
        });
      } else {
        console.log('✅ Luma Dream Machine video saved locally:', localSaveResult);

        const videoGenerationResult = {
          id: uuidv4(),
          imageUrl: '',
          videoUrl: '',
          videoBlob: result.blob,
          seed: computedSeed,
          contentType: 'video' as const,
          duration: durationSeconds,
          fps: undefined,
          resolution: resolutionSize,
          metadata: {
            prompt: result.metadata.prompt || lumaPrompt,
            seed: computedSeed,
            jobId: result.metadata.id,
            model: result.metadata.model || lumaModel,
            version: 'Dream Machine 1.1.0',
            timestamp: Date.now(),
            filename: result.filename,
            contentType: result.contentType,
            fileSize: result.blob.size,
            duration: durationSeconds,
            fps: undefined,
            resolution: resolutionSize,
            persistenceMethod: 'local' as const,
            storageMode: 'local' as const,
            folderToken: localSaveResult.folderToken ?? null,
            localFilePath: localSaveResult.filePath,
            localMetadataPath: localSaveResult.metadataPath,
            savedAt: new Date().toISOString(),
            localPersistenceProvider: localSaveResult.provider,
            localBaseFolder: localSaveResult.baseFolder,
            relativePath: localSaveResult.relativePath,
          },
          timestamp: Date.now(),
          status: 'generated' as const,
          localPath: localSaveResult.filePath,
        };

        addGeneration(videoGenerationResult);

        showSuccess(
          'Video Generated',
          `Generated "${result.filename}" (${(result.blob.size / 1024 / 1024).toFixed(2)} MB) - saved to ${localSaveResult.displayPath || localSaveResult.filePath}`
        );

        console.log('🎥 Video added to gallery store (local file):', {
          id: videoGenerationResult.id,
          localPath: localSaveResult.filePath,
          relativePath: localSaveResult.relativePath,
          filename: result.filename,
          size: result.blob.size,
        });
      }

    } catch (error: any) {
      console.error('❌ Luma Dream Machine video generation failed:', error);
      showError('Video Generation Failed', error?.message || 'An unexpected error occurred.');
    } finally {
      setIsGeneratingLuma(false);
    }
  };
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
                    <h2 className="card-title">Generate Content</h2>
                    <div className="text-detail">Create images with Adobe Firefly AI or videos with LTX and Luma Dream Machine</div>
                    
                    {/* Generation Mode Toggle */}
                    <div className="generation-mode-toggle">
                      {/* @ts-ignore */}
                      <sp-button-group>
                        {/* @ts-ignore */}
                        <sp-button
                          variant={generationMode === 'firefly' ? 'primary' : 'secondary'}
                          size="s"
                          onClick={() => setGenerationMode('firefly')}
                        >
                          Firefly Image Gen
                        {/* @ts-ignore */}
                        </sp-button>
                        {/* @ts-ignore */}
                        <sp-button
                          variant={generationMode === 'ltx' ? 'primary' : 'secondary'}
                          size="s"
                          onClick={() => setGenerationMode('ltx')}
                        >
                          LTX Video
                        {/* @ts-ignore */}
                        </sp-button>
                          {/* @ts-ignore */}
                          <sp-button
                            variant={generationMode === 'luma' ? 'primary' : 'secondary'}
                            size="s"
                            onClick={() => setGenerationMode('luma')}
                          >
                            Luma Dream Machine
                          {/* @ts-ignore */}
                          </sp-button>
                      {/* @ts-ignore */}
                      </sp-button-group>
                    </div>
                  </header>
                  <div className="card-body">
                    {!imsToken ? (
                      <div className="auth-required">
                        <div className="text-detail" style={{ color: 'var(--theme-warning)' }}>
                          Please authenticate to generate content
                        </div>

                        {/* @ts-ignore */}
                        <sp-button variant="accent" onClick={testIMSAuthentication} style={{ marginLeft: '12px' }}>
                          Login
                        {/* @ts-ignore */}
                        </sp-button>
                      </div>
                    ) : generationMode === 'firefly' ? (
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
                            {isGenerating ? 'Generating...' : 'Generate Image'}
                          {/* @ts-ignore */}
                          </sp-button>
                        </div>
                      </div>
                    ) : generationMode === 'ltx' ? (
                      <div className="generation-form">
                        {/* LTX Video Prompt Input */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Video Prompt *</sp-label>
                          {/* @ts-ignore */}
                          <sp-textarea 
                            id="ltx-prompt-input"
                            placeholder="A cinematic shot of a futuristic city skyline at sunset, camera slowly dolly-in with warm golden light..."
                            className="prompt-input"
                            multiline
                            rows={3}
                            maxlength={1000}
                            value={ltxPrompt}
                            onInput={(e: any) => setLtxPrompt(e.target.value)}
                          >
                          {/* @ts-ignore */}
                          </sp-textarea>
                          <div className="character-counter text-detail">
                            {ltxPrompt.length}/1000 characters
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Duration</sp-label>
                          <div className="text-detail mb-sm">Video length in seconds</div>
                          {/* @ts-ignore */}
                          <sp-slider 
                            min={1} 
                            max={10} 
                            value={ltxDuration}
                            step={1}
                            className="duration-slider"
                            onInput={(e: any) => setLtxDuration(parseInt(e.target.value) || 6)}
                          >
                          {/* @ts-ignore */}
                          </sp-slider>
                          <div className="text-detail mt-sm">{ltxDuration} seconds</div>
                        </div>

                        {/* FPS */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Frame Rate</sp-label>
                          <div className="text-detail mb-sm">Frames per second</div>
                          {/* @ts-ignore */}
                          <sp-radio-group 
                            value={ltxFps.toString()} 
                            className="fps-group"
                            onChange={(e: any) => setLtxFps(parseInt(e.target.value))}
                          >
                            {/* @ts-ignore */}
                            <sp-radio value="16">
                              <span className="radio-label">16 FPS</span>
                              <div className="radio-description text-detail">Smooth, cinematic</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="24">
                              <span className="radio-label">24 FPS</span>
                              <div className="radio-description text-detail">Film standard</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                          {/* @ts-ignore */}
                          </sp-radio-group>
                        </div>

                        {/* Resolution */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Resolution</sp-label>
                          <div className="text-detail mb-sm">Video dimensions</div>
                          {/* @ts-ignore */}
                          <sp-radio-group 
                            value={`${ltxWidth}x${ltxHeight}`} 
                            className="resolution-group"
                            onChange={(e: any) => {
                              const [width, height] = e.target.value.split('x').map(Number);
                              setLtxWidth(width);
                              setLtxHeight(height);
                            }}
                          >
                            {/* @ts-ignore */}
                            <sp-radio value="1024x576">
                              <span className="radio-label">1024×576</span>
                              <div className="radio-description text-detail">16:9 SD</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="1280x720">
                              <span className="radio-label">1280×720</span>
                              <div className="radio-description text-detail">16:9 HD</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="1920x1080">
                              <span className="radio-label">1920×1080</span>
                              <div className="radio-description text-detail">16:9 Full HD</div>
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
                            value={ltxSeed}
                            step={1}
                            className="seed-slider"
                            onInput={(e: any) => setLtxSeed(parseInt(e.target.value) || 0)}
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
                            onClick={handleGenerateLtxVideo}
                            disabled={isGeneratingLtx || !ltxPrompt.trim()}
                          >
                            {isGeneratingLtx ? 'Generating...' : 'Generate Video'}
                          {/* @ts-ignore */}
                          </sp-button>
                        </div>
                      </div>
                    ) : (
                      <div className="generation-form">
                        {/* Luma Video Prompt */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Video Prompt *</sp-label>
                          {/* @ts-ignore */}
                          <sp-textarea 
                            id="luma-prompt-input"
                            placeholder="A sweeping drone shot over bioluminescent waves crashing on a night beach..."
                            className="prompt-input"
                            multiline
                            rows={3}
                            maxlength={1000}
                            value={lumaPrompt}
                            onInput={(e: any) => setLumaPrompt(e.target.value)}
                          >
                          {/* @ts-ignore */}
                          </sp-textarea>
                          <div className="character-counter text-detail">
                            {lumaPrompt.length}/1000 characters
                          </div>
                        </div>

                        {/* Model */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Model</sp-label>
                          <div className="text-detail mb-sm">Choose the Dream Machine model</div>
                          {/* @ts-ignore */}
                          <sp-picker 
                            placeholder="Select model"
                            className="style-dropdown"
                            value={lumaModel}
                            onChange={(e: any) => setLumaModel(e.target.value)}
                          >
                            {/* @ts-ignore */}
                            <sp-menu slot="options">
                              {/* @ts-ignore */}
                              <sp-menu-item value="ray-2">Ray 2</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="ray-flash-2">Ray Flash 2</sp-menu-item>
                              {/* @ts-ignore */}
                              <sp-menu-item value="ray-1-6">Ray 1.6</sp-menu-item>
                            {/* @ts-ignore */}
                            </sp-menu>
                          {/* @ts-ignore */}
                          </sp-picker>
                        </div>

                        {/* Aspect Ratio */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Aspect Ratio</sp-label>
                          <div className="text-detail mb-sm">Select the composition</div>
                          {/* @ts-ignore */}
                          <sp-radio-group 
                            value={lumaAspectRatio}
                            className="content-type-group"
                            onChange={(e: any) => setLumaAspectRatio(e.target.value)}
                          >
                            {/* @ts-ignore */}
                            <sp-radio value="16:9">
                              <span className="radio-label">16:9</span>
                              <div className="radio-description text-detail">Widescreen</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="9:16">
                              <span className="radio-label">9:16</span>
                              <div className="radio-description text-detail">Vertical</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="1:1">
                              <span className="radio-label">1:1</span>
                              <div className="radio-description text-detail">Square</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="21:9">
                              <span className="radio-label">21:9</span>
                              <div className="radio-description text-detail">Ultra-wide</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                          {/* @ts-ignore */}
                          </sp-radio-group>
                        </div>

                        {/* Duration */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Duration</sp-label>
                          <div className="text-detail mb-sm">Clip length</div>
                          {/* @ts-ignore */}
                          <sp-radio-group 
                            value={lumaDuration}
                            className="fps-group"
                            onChange={(e: any) => setLumaDuration(e.target.value)}
                          >
                            {/* @ts-ignore */}
                            <sp-radio value="5s">
                              <span className="radio-label">5 seconds</span>
                              <div className="radio-description text-detail">Quick loop</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="9s">
                              <span className="radio-label">9 seconds</span>
                              <div className="radio-description text-detail">Longer motion</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                          {/* @ts-ignore */}
                          </sp-radio-group>
                        </div>

                        {/* Resolution */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-label className="form-label">Resolution</sp-label>
                          <div className="text-detail mb-sm">Output size</div>
                          {/* @ts-ignore */}
                          <sp-radio-group 
                            value={lumaResolution}
                            className="resolution-group"
                            onChange={(e: any) => setLumaResolution(e.target.value)}
                          >
                            {/* @ts-ignore */}
                            <sp-radio value="540p">
                              <span className="radio-label">540p</span>
                              <div className="radio-description text-detail">Lightweight preview</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="720p">
                              <span className="radio-label">720p</span>
                              <div className="radio-description text-detail">HD</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="1080p">
                              <span className="radio-label">1080p</span>
                              <div className="radio-description text-detail">Full HD</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                            {/* @ts-ignore */}
                            <sp-radio value="4k">
                              <span className="radio-label">4K</span>
                              <div className="radio-description text-detail">Ultra HD</div>
                            {/* @ts-ignore */}
                            </sp-radio>
                          {/* @ts-ignore */}
                          </sp-radio-group>
                        </div>

                        {/* Loop */}
                        <div className="form-group">
                          {/* @ts-ignore */}
                          <sp-checkbox 
                            checked={lumaLoop}
                            onChange={(e: any) => setLumaLoop(Boolean(e.target.checked))}
                          >
                            Loop video when playing
                          {/* @ts-ignore */}
                          </sp-checkbox>
                        </div>

                        {/* Generate Button */}
                        <div className="form-actions">
                          {/* @ts-ignore */}
                          <sp-button 
                            variant="accent" 
                            size="m"
                            className="generate-button"
                            onClick={handleGenerateLumaVideo}
                            disabled={isGeneratingLuma || !lumaPrompt.trim()}
                          >
                            {isGeneratingLuma ? 'Generating...' : 'Generate Video'}
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
              imsToken ? (
                <Gallery />
              ) : (
                <article className="card">
                  <header className="card-header">
                    <h2 className="card-title">Sign in to view your gallery</h2>
                    <div className="text-detail">Authenticate to browse saved generations.</div>
                  </header>
                  <div className="card-body">
                    <div className="auth-required" style={{ margin: 0 }}>
                      <div className="text-detail" style={{ color: 'var(--theme-warning)' }}>
                        Please authenticate to access the gallery
                      </div>

                      {/* @ts-ignore */}
                      <sp-button
                        variant="accent"
                        onClick={testIMSAuthentication}
                        style={{ marginLeft: '12px' }}
                      >
                        Login
                      {/* @ts-ignore */}
                      </sp-button>
                    </div>
                  </div>
                </article>
              )
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
            {isDarkMode ? <MoonIcon className="theme-icon" /> : <SunIcon className="theme-icon" />}
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
