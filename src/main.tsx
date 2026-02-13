// must be the first import
import "./shims/domparser";

import React, { useState, useEffect, useRef } from "react";
import { useGalleryStore } from './store';
import { ContentItem } from './types/content';
import { uxp, premierepro } from "./globals";
import { createIMSService } from "./services/ims/IMSService";
import { useGenerationStore } from "./store/generationStore";
import { useAuthStore } from "./store/authStore";
import { getSharedIMSService, ensureAuthenticated, setAuthFromToken, selectStatus, selectIsAuthed, selectHydrated } from './store/authStore';
import { createAzureSDKBlobService } from './services/blob/AzureSDKBlobService';
import { refreshContentItemUrls } from './utils/blobUrlLifecycle';
import "./layout.scss";

// Import components
import { MoonIcon, SunIcon, ToastProvider, useToastHelpers, Gallery, LocalIngestPanel, LumaGeneration, FireflyGenerationForm, LtxGenerationForm, GalleryPicker } from "./components";
import { GraphGenerationsPanel } from "./components/Generations/GraphGenerationsPanel";

// Import custom hooks
import { useFireflyGeneration } from './hooks/useFireflyGeneration';
import { useLtxGeneration } from './hooks/useLtxGeneration';
import { useLumaGeneration } from './hooks/useLumaGeneration';

const AppContent = () => {
  const [imsToken, setImsToken] = useState<string | null>(null);
  const [imsStatus, setImsStatus] = useState<string>('Not authenticated');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'ingest' | 'graph'>('generate');
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
  const [lumaGenerationType, setLumaGenerationType] = useState<'video' | 'image'>('video');
  const [lumaPrompt, setLumaPrompt] = useState<string>('');
  const [lumaModel, setLumaModel] = useState<string>('ray-2');
  const [lumaAspectRatio, setLumaAspectRatio] = useState<string>('16:9');
  const [lumaDuration, setLumaDuration] = useState<string>('5s');
  const [lumaResolution, setLumaResolution] = useState<string>('1080p');
  const [lumaLoop, setLumaLoop] = useState<boolean>(false);
  const [lumaFirstFrameItem, setLumaFirstFrameItem] = useState<ContentItem | null>(null);
  const [lumaLastFrameItem, setLumaLastFrameItem] = useState<ContentItem | null>(null);
  const [lumaMode, setLumaMode] = useState<'keyframes' | 'reframe'>('keyframes');
  const [lumaReframeVideoItem, setLumaReframeVideoItem] = useState<ContentItem | null>(null);
  const [showGalleryPicker, setShowGalleryPicker] = useState<boolean>(false);
  const [galleryPickerTarget, setGalleryPickerTarget] = useState<'first' | 'last' | 'both' | 'reframe-video' | null>(null);
  const [isGeneratingLuma, setIsGeneratingLuma] = useState<boolean>(false);
  
  // Luma image reference state (up to 4 references)
  const [lumaImageReferences, setLumaImageReferences] = useState<Array<{file: File | null, weight: number}>>([
    { file: null, weight: 0.5 },
    { file: null, weight: 0.5 },
    { file: null, weight: 0.5 },
    { file: null, weight: 0.5 },
  ]);
  const [useImageReferences, setUseImageReferences] = useState<boolean>(false);
  const [lumaStyleReference, setLumaStyleReference] = useState<{file: any | null, weight: number}>({ file: null, weight: 0.5 });
  const [useStyleReference, setUseStyleReference] = useState<boolean>(false);
  
  // Character Consistency: 4 identities, each can have up to 4 images (File or ContentItem before upload)
  const [lumaCharacterReferences, setLumaCharacterReferences] = useState<Array<Array<File | ContentItem | null>>>([
    [null, null, null, null], // Identity A
    [null, null, null, null], // Identity B
    [null, null, null, null], // Identity C
    [null, null, null, null], // Identity D
  ]);
  const [selectedCharacterIdentity, setSelectedCharacterIdentity] = useState<number>(0); // 0=A, 1=B, 2=C, 3=D
  const [useCharacterReference, setUseCharacterReference] = useState<boolean>(false);
  
  // Modify Image: modify existing image with prompt and weight
  const [lumaModifyImage, setLumaModifyImage] = useState<{file: File | ContentItem | null, weight: number}>({ file: null, weight: 0.5 });
  const [useModifyImage, setUseModifyImage] = useState<boolean>(false);
  
  // Get toast helpers
  const { showSuccess, showError, showInfo, showWarning } = useToastHelpers();
  
  // Get generation store actions
  const { actions: { addGeneration } } = useGenerationStore();

  // Get authentication status using selectors
  const authStatus = useAuthStore(selectStatus);
  const isAuthed = useAuthStore(selectIsAuthed);
  const isHydrated = useAuthStore(selectHydrated);

  
  // Initialize generation hooks (must be after addGeneration and isAuthed are declared)
  const { handleGenerateImage } = useFireflyGeneration({
    prompt,
    stylePreset,
    contentType,
    aspectRatio,
    seedValue,
    imsToken,
    setIsGenerating,
    addGeneration,
    toastHelpers: { showSuccess, showError, showInfo, showWarning }
  });

  const { handleGenerateLtxVideo } = useLtxGeneration({
    ltxPrompt,
    ltxDuration,
    ltxFps,
    ltxWidth,
    ltxHeight,
    ltxSeed,
    setIsGeneratingLtx,
    addGeneration,
    toastHelpers: { showSuccess, showError, showInfo, showWarning }
  });

  const { 
    handleGenerateLumaVideo,
    handleReframeLumaVideo,
    handleGenerateLumaImage
  } = useLumaGeneration({
    lumaPrompt,
    lumaModel,
    lumaAspectRatio,
    lumaDuration,
    lumaResolution,
    lumaLoop,
    lumaFirstFrameItem,
    lumaLastFrameItem,
    lumaMode,
    lumaReframeVideoItem,
    lumaImageReferences,
    lumaStyleReference,
    lumaCharacterReferences,
    lumaModifyImage,
    isAuthed,
    setIsGeneratingLuma,
    addGeneration,
    toastHelpers: { showSuccess, showError, showInfo, showWarning }
  });

  const azureBlobServiceRef = useRef<ReturnType<typeof createAzureSDKBlobService> | null>(null);
  const azureContainerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME || 'uxp-images';

  const getAzureBlobService = () => {
    if (!azureBlobServiceRef.current) {
      const imsService = getSharedIMSService();
      azureBlobServiceRef.current = createAzureSDKBlobService(imsService);
    }
    return azureBlobServiceRef.current;
  };

  useEffect(() => {
    const checkAuthAndClearService = async () => {
      await ensureAuthenticated();
      if (!isAuthed) {
        azureBlobServiceRef.current = null;
      }
    };
    checkAuthAndClearService();
  }, []);

  useEffect(() => {
    const checkAuthAndCreateService = async () => {
      await ensureAuthenticated();
      if (isAuthed && !azureBlobServiceRef.current) {
        // Recreate Azure service with authenticated IMS service
        azureBlobServiceRef.current = createAzureSDKBlobService(getSharedIMSService());
      }
    };
    checkAuthAndCreateService();
  }, []);

  const hostName = (uxp.host.name as string).toLowerCase();

  //* Call Functions Conditionally by App
  useEffect(() => {
    if (hostName === "premierepro") {
      console.log("Hello from Premiere Pro", premierepro);
    }
  }, [hostName]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to the root element
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Log available videos when reframe mode is selected and sync if needed
  useEffect(() => {
    if (lumaMode === 'reframe') {
      const syncAndLogVideos = async () => {
        console.log('🔄 Auto-syncing local files for reframe mode...');
        await useGalleryStore.getState().actions.syncLocalFiles();
        
        // Wait a bit for the sync to complete, then log results
        setTimeout(() => {
          const { contentItems } = useGalleryStore.getState();
          const videos = contentItems.filter(item => ['video', 'uploaded-video'].includes(item.contentType));
          console.log('🎥 Available videos for reframing after sync:', videos.length);
          videos.forEach((video, index) => {
            console.log(`  ${index + 1}. ${video.filename} (${video.contentType}) - Display URL: ${video.displayUrl ? 'YES' : 'NO'}`);
          });
          
          // Also log the local storage directory info
          const folderToken = localStorage.getItem('boltuxp.localFolderToken');
          const folderPath = localStorage.getItem('boltuxp.localFolderPath');
          console.log('🎥 Local storage directory for videos:', { folderToken, folderPath });
        }, 1000); // Wait 1 second for sync to complete
      };
      
      syncAndLogVideos();
    }
  }, [lumaMode]);

  // Blob URL rehydration on app startup and gallery tab switch
  useEffect(() => {
    // Only run rehydration if store is hydrated AND user is authenticated
    if (!isHydrated || !isAuthed) {
      console.log('🔄 Skipping blob URL rehydration - store not hydrated or user not authenticated', { isHydrated, isAuthed });
      return;
    }

    const rehydrateBlobUrls = async () => {
      console.log('🔄 Starting blob URL rehydration...');
      const { contentItems, actions } = useGalleryStore.getState();

      // Find items that need blob URL rehydration (have relativePath and folderToken but no displayUrl)
      const itemsNeedingRehydration = contentItems.filter(item =>
        item.relativePath &&
        item.folderToken &&
        !item.displayUrl
      );

      if (itemsNeedingRehydration.length === 0) {
        console.log('✅ No items need blob URL rehydration');
        return;
      }

      console.log(`🔄 Rehydrating blob URLs for ${itemsNeedingRehydration.length} items...`);

      for (const item of itemsNeedingRehydration) {
        try {
          // Use refreshContentItemUrls to recreate the display URL
          const refreshedUrls = await refreshContentItemUrls({
            displayUrl: item.displayUrl,
            thumbnailUrl: item.thumbnailUrl,
            blobUrl: item.blobUrl,
            folderToken: item.folderToken,
            relativePath: item.relativePath,
            localPath: item.localPath,
            mimeType: item.mimeType
          });

          if (refreshedUrls.displayUrl && refreshedUrls.displayUrl !== item.displayUrl) {
            // Update the item with the refreshed URL
            actions.updateContentItem(item.id, {
              displayUrl: refreshedUrls.displayUrl,
              thumbnailUrl: refreshedUrls.thumbnailUrl || item.thumbnailUrl
            });
            console.log(`✅ Rehydrated blob URL for ${item.filename}: ${refreshedUrls.displayUrl.substring(0, 50)}...`);
          } else {
            console.warn(`⚠️ Failed to rehydrate blob URL for ${item.filename}`);
          }
        } catch (error) {
          console.error(`❌ Error rehydrating blob URL for ${item.filename}:`, error);
        }
      }

      console.log('✅ Blob URL rehydration complete');
    };

    rehydrateBlobUrls();
  }, [isHydrated, isAuthed]); // Re-run when hydration or auth status changes

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
      
      // Set authentication state in auth store
      setAuthFromToken(accessToken);
      
      setImsToken(accessToken);
      setImsStatus(`✅ Authenticated! Token: ${accessToken.substring(0, 20)}...`);
      
      // Show success toast
      showSuccess('Authentication Successful', 'Connected to Adobe Identity Management System');
      
      // Log token storage
      console.log('🔍 Token storage:', { accessToken: accessToken.substring(0, 20) + '...', imsToken: accessToken });
      
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
          <div 
            className={`uxp-tab ${activeTab === 'ingest' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingest')}
          >
            Premiere Ingest
          </div>
          {import.meta.env.DEV && (
            <div 
              className={`uxp-tab ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              Graph Generations
            </div>
          )}
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
                    <div className="text-detail-description">Use Adobe Firefly, LTX and Luma Dream Machine</div>
                    
                    {/* Generation Mode Toggle */}
                    <div className="generation-mode-toggle">
                      <sp-button-group>
                        <sp-button
                          variant={generationMode === 'firefly' ? 'primary' : 'secondary'}
                          size="s"
                          onClick={() => setGenerationMode('firefly')}
                        >
                          Firefly
                        </sp-button>
                        <sp-button
                          variant={generationMode === 'ltx' ? 'primary' : 'secondary'}
                          size="s"
                          onClick={() => setGenerationMode('ltx')}
                        >
                          LTX
                        </sp-button>
                          <sp-button
                            variant={generationMode === 'luma' ? 'primary' : 'secondary'}
                            size="s"
                            onClick={() => {
                              console.log('🎯 Switching to Luma generation mode');
                              setGenerationMode('luma');
                            }}
                          >
                            Luma
                          </sp-button>
                      </sp-button-group>
                    </div>
                  </header>
                  <div className="card-body">
                    {!imsToken ? (
                      <div className="auth-required">
                        <div className="text-detail" style={{ color: 'var(--theme-warning)' }}>
                          Please authenticate to generate content
                        </div>

                        <sp-button variant="accent" onClick={testIMSAuthentication} style={{ marginLeft: '12px' }}>
                          Login
                        </sp-button>
                      </div>
                    ) : generationMode === 'firefly' ? (
                      <FireflyGenerationForm
                        prompt={prompt}
                        setPrompt={setPrompt}
                        stylePreset={stylePreset}
                        setStylePreset={setStylePreset}
                        contentType={contentType}
                        setContentType={setContentType}
                        aspectRatio={aspectRatio}
                        setAspectRatio={setAspectRatio}
                        seedValue={seedValue}
                        setSeedValue={setSeedValue}
                        isGenerating={isGenerating}
                        handleGenerateImage={handleGenerateImage}
                      />
                    ) : generationMode === 'ltx' ? (
                      <LtxGenerationForm
                        ltxPrompt={ltxPrompt}
                        setLtxPrompt={setLtxPrompt}
                        ltxDuration={ltxDuration}
                        setLtxDuration={setLtxDuration}
                        ltxFps={ltxFps}
                        setLtxFps={setLtxFps}
                        ltxWidth={ltxWidth}
                        setLtxWidth={setLtxWidth}
                        ltxHeight={ltxHeight}
                        setLtxHeight={setLtxHeight}
                        ltxSeed={ltxSeed}
                        setLtxSeed={setLtxSeed}
                        isGeneratingLtx={isGeneratingLtx}
                        handleGenerateLtxVideo={handleGenerateLtxVideo}
                      />
                    ) : (
                      <LumaGeneration
                        lumaGenerationType={lumaGenerationType}
                        setLumaGenerationType={setLumaGenerationType}
                        videoFormProps={{
                          lumaPrompt,
                          setLumaPrompt,
                          lumaModel,
                          setLumaModel,
                          lumaAspectRatio,
                          setLumaAspectRatio,
                          isGeneratingLuma,
                          isAuthed: !!imsToken,
                          lumaMode,
                          setLumaMode,
                          lumaDuration,
                          setLumaDuration,
                          lumaResolution,
                          setLumaResolution,
                          lumaFirstFrameItem,
                          setLumaFirstFrameItem,
                          lumaLastFrameItem,
                          setLumaLastFrameItem,
                          lumaReframeVideoItem,
                          setLumaReframeVideoItem,
                          setGalleryPickerTarget,
                          setShowGalleryPicker,
                          handleGenerateLumaVideo,
                          handleReframeLumaVideo,
                          useGalleryStore,
                          showInfo,
                          showError,
                          uxp,
                        }}
                        imageFormProps={{
                          lumaPrompt,
                          setLumaPrompt,
                          lumaModel,
                          setLumaModel,
                          lumaAspectRatio,
                          setLumaAspectRatio,
                          isGeneratingLuma,
                          isAuthed: !!imsToken,
                          lumaImageReferences,
                          setLumaImageReferences,
                          useImageReferences,
                          setUseImageReferences,
                          lumaStyleReference,
                          setLumaStyleReference,
                          useStyleReference,
                          setUseStyleReference,
                          lumaCharacterReferences,
                          setLumaCharacterReferences,
                          selectedCharacterIdentity,
                          setSelectedCharacterIdentity,
                          useCharacterReference,
                          setUseCharacterReference,
                          lumaModifyImage,
                          setLumaModifyImage,
                          useModifyImage,
                          setUseModifyImage,
                          handleGenerateLumaImage,
                          showError,
                          uxp
                        }}
                      />
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

            {activeTab === 'ingest' && (
              imsToken ? (
                <LocalIngestPanel />
              ) : (
                <article className="card">
                  <header className="card-header">
                    <h2 className="card-title">Sign in to use Local Ingest</h2>
                    <div className="text-detail">Authenticate to import MP4s into Premiere Pro.</div>
                  </header>
                  <div className="card-body">
                    <div className="auth-required" style={{ margin: 0 }}>
                      <div className="text-detail" style={{ color: 'var(--theme-warning)' }}>
                        Please authenticate to access local ingest
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

            {activeTab === 'graph' && import.meta.env.DEV && (
              <GraphGenerationsPanel />
            )}
          </div>
        </section>
      </main>

      {/* Gallery Picker Modal */}
      {showGalleryPicker && (
        <div className="gallery-picker-modal">
          <div className="gallery-picker-overlay" onClick={() => {
            setShowGalleryPicker(false);
            setGalleryPickerTarget(null);
          }} />
          <div className="gallery-picker-dialog">
            <div className="gallery-picker-header">
              <h3>
                {galleryPickerTarget === 'both' 
                  ? `Select ${!lumaFirstFrameItem ? 'First' : 'Last'} Frame Image`
                  : galleryPickerTarget === 'reframe-video'
                  ? 'Select Video to Reframe'
                  : 'Select Image from Gallery'
                }
              </h3>
              {/* @ts-ignore */}
              <sp-button
                variant="secondary"
                size="s"
                onClick={() => {
                  setShowGalleryPicker(false);
                  setGalleryPickerTarget(null);
                }}
              >
                ✕
              {/* @ts-ignore */}
              </sp-button>
            </div>
            <div className="gallery-picker-content">
              <GalleryPicker
                target={galleryPickerTarget}
                onSelect={(item: ContentItem) => {
                  if (galleryPickerTarget === 'first') {
                    setLumaFirstFrameItem(item);
                  } else if (galleryPickerTarget === 'last') {
                    setLumaLastFrameItem(item);
                  } else if (galleryPickerTarget === 'reframe-video') {
                    setLumaReframeVideoItem(item);
                  } else if (galleryPickerTarget === 'both') {
                    // For 'both' selection, alternate between first and last
                    if (!lumaFirstFrameItem) {
                      setLumaFirstFrameItem(item);
                      // If last frame is also not set, keep picker open for second selection
                      if (!lumaLastFrameItem) {
                        showInfo('First Frame Selected', 'Now select the last frame image');
                        return; // Keep picker open
                      }
                    } else if (!lumaLastFrameItem) {
                      setLumaLastFrameItem(item);
                    }
                  }
                  setShowGalleryPicker(false);
                  setGalleryPickerTarget(null);
                }}
                onCancel={() => {
                  setShowGalleryPicker(false);
                  setGalleryPickerTarget(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

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
