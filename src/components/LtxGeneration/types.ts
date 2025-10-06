export interface LtxGenerationFormProps {
  // Prompt
  ltxPrompt: string;
  setLtxPrompt: (value: string) => void;
  
  // Duration
  ltxDuration: number;
  setLtxDuration: (value: number) => void;
  
  // Frame rate
  ltxFps: number;
  setLtxFps: (value: number) => void;
  
  // Resolution
  ltxWidth: number;
  setLtxWidth: (value: number) => void;
  ltxHeight: number;
  setLtxHeight: (value: number) => void;
  
  // Seed
  ltxSeed: number;
  setLtxSeed: (value: number) => void;
  
  // Generation state
  isGeneratingLtx: boolean;
  handleGenerateLtxVideo: () => void;
}
