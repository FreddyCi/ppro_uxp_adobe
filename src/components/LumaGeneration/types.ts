import type { ContentItem } from '../../types/content';

// Common props shared between video and image forms
export interface LumaGenerationBaseProps {
  lumaPrompt: string;
  setLumaPrompt: (value: string) => void;
  lumaModel: string;
  setLumaModel: (value: string) => void;
  isGeneratingLuma: boolean;
  isAuthed: boolean;
}

// Video generation specific props
export interface LumaVideoFormProps extends LumaGenerationBaseProps {
  lumaAspectRatio: string;
  setLumaAspectRatio: (value: string) => void;
  lumaDuration: string;
  setLumaDuration: (value: string) => void;
  lumaResolution: string;
  setLumaResolution: (value: string) => void;
  lumaLoop: boolean;
  setLumaLoop: (value: boolean) => void;
  lumaMode: 'keyframes' | 'reframe';
  setLumaMode: (value: 'keyframes' | 'reframe') => void;
  lumaFirstFrameItem: ContentItem | null;
  setLumaFirstFrameItem: (value: ContentItem | null) => void;
  lumaLastFrameItem: ContentItem | null;
  setLumaLastFrameItem: (value: ContentItem | null) => void;
  lumaReframeVideoItem: ContentItem | null;
  setLumaReframeVideoItem: (value: ContentItem | null) => void;
  showGalleryPicker: boolean;
  setShowGalleryPicker: (value: boolean) => void;
  galleryPickerTarget: 'first' | 'last' | 'both' | 'reframe-video' | null;
  setGalleryPickerTarget: (value: 'first' | 'last' | 'both' | 'reframe-video' | null) => void;
  handleGenerateLumaVideo: () => void;
  handleReframeLumaVideo: () => void;
}

// Image generation specific props
export interface LumaImageFormProps extends LumaGenerationBaseProps {
  lumaAspectRatio: string;
  setLumaAspectRatio: (value: string) => void;
  
  // Image References
  lumaImageReferences: Array<{file: File | null, weight: number}>;
  setLumaImageReferences: (value: Array<{file: File | null, weight: number}>) => void;
  useImageReferences: boolean;
  setUseImageReferences: (value: boolean) => void;
  
  // Style Reference
  lumaStyleReference: {file: any | null, weight: number};
  setLumaStyleReference: (value: {file: any | null, weight: number}) => void;
  useStyleReference: boolean;
  setUseStyleReference: (value: boolean) => void;
  
  // Character Consistency
  lumaCharacterReferences: Array<Array<File | ContentItem | null>>;
  setLumaCharacterReferences: (value: Array<Array<File | ContentItem | null>>) => void;
  selectedCharacterIdentity: number;
  setSelectedCharacterIdentity: (value: number) => void;
  useCharacterReference: boolean;
  setUseCharacterReference: (value: boolean) => void;
  
  // Modify Image
  lumaModifyImage: {file: File | ContentItem | null, weight: number};
  setLumaModifyImage: (value: {file: File | ContentItem | null, weight: number}) => void;
  useModifyImage: boolean;
  setUseModifyImage: (value: boolean) => void;
  
  handleGenerateLumaImage: () => void;
}

// Header props
export interface LumaGenerationHeaderProps {
  lumaGenerationType: 'video' | 'image';
  setLumaGenerationType: (value: 'video' | 'image') => void;
  lumaModel: string;
  setLumaModel: (value: string) => void;
}

// Main component props
export interface LumaGenerationProps {
  lumaGenerationType: 'video' | 'image';
  setLumaGenerationType: (value: 'video' | 'image') => void;
  videoFormProps: LumaVideoFormProps;
  imageFormProps: LumaImageFormProps;
}
