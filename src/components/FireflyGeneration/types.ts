export interface FireflyGenerationFormProps {
  // Prompt
  prompt: string;
  setPrompt: (value: string) => void;
  
  // Style
  stylePreset: string;
  setStylePreset: (value: string) => void;
  
  // Content type
  contentType: 'art' | 'photo';
  setContentType: (value: 'art' | 'photo') => void;
  
  // Aspect ratio
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  
  // Seed
  seedValue: number;
  setSeedValue: (value: number) => void;
  
  // Generation state
  isGenerating: boolean;
  handleGenerateImage: () => void;
}
