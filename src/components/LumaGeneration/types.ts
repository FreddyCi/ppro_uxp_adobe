import type { Dispatch, SetStateAction } from 'react';
import type { ContentItem } from '../../types/content';

// Common props shared between video and image forms
export interface LumaGenerationBaseProps {
  lumaPrompt: string;
  setLumaPrompt: (value: string) => void;
  lumaModel: string;
  setLumaModel: (value: string) => void;
  lumaAspectRatio: string;
  setLumaAspectRatio: (value: string) => void;
  isGeneratingLuma: boolean;
  isAuthed: boolean;
}

// Video generation specific props
export interface LumaVideoFormProps extends LumaGenerationBaseProps {
  lumaMode: string;
  setLumaMode: Dispatch<SetStateAction<'keyframes' | 'reframe'>>;
  lumaDuration: string;
  setLumaDuration: (duration: string) => void;
  lumaResolution: string;
  setLumaResolution: (resolution: string) => void;
  lumaFirstFrameItem: ContentItem | null;
  setLumaFirstFrameItem: (item: ContentItem | null) => void;
  lumaLastFrameItem: ContentItem | null;
  setLumaLastFrameItem: (item: ContentItem | null) => void;
  lumaReframeVideoItem: ContentItem | null;
  setLumaReframeVideoItem: (item: ContentItem | null) => void;
  setGalleryPickerTarget: Dispatch<SetStateAction<'first' | 'last' | 'both' | 'reframe-video' | null>>;
  setShowGalleryPicker: (show: boolean) => void;
  handleGenerateLumaVideo: () => void;
  handleReframeLumaVideo: () => void;
  useGalleryStore: any;
  showInfo: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  uxp: any;
}

// Image generation specific props
export interface LumaImageFormProps extends LumaGenerationBaseProps {
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
  showError: (title: string, message: string) => void;
  uxp: any;
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
