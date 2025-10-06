import { createIMSService } from '../services/ims/IMSService';
import { FireflyService } from '../services/firefly';

interface ToastHelpers {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
}

interface FireflyGenerationParams {
  prompt: string;
  stylePreset: string;
  contentType: string;
  aspectRatio: string;
  seedValue: number;
  imsToken: string | null;
  setIsGenerating: (value: boolean) => void;
  addGeneration: (result: any) => void;
  toastHelpers: ToastHelpers;
}

export function useFireflyGeneration(params: FireflyGenerationParams) {
  const {
    prompt,
    stylePreset,
    contentType,
    aspectRatio,
    seedValue,
    imsToken,
    setIsGenerating,
    addGeneration,
    toastHelpers
  } = params;

  const { showSuccess, showError, showWarning, showInfo } = toastHelpers;

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

  return { handleGenerateImage };
}
