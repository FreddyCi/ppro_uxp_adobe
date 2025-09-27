import { create } from 'zustand';

interface PluginState {
  // File management
  lastSavedFile: string | null;
  recentFiles: string[];
  
  // UI state
  activeTab: string;
  isDarkMode: boolean;
  isModalOpen: boolean;
  modalTitle: string;
  modalBody: string;
  showModalUnderlay: boolean;
  
  // User preferences
  autoSave: boolean;
  fileFormat: 'txt' | 'json' | 'md';
  
  // Radio component state (for Features tab demos)
  radioPreferences: {
    basicOption: string;
    sizeSmall: string;
    sizeMedium: string;
    sizeLarge: string;
    horizontalAlignment: string;
    disabledExample: string;
  };
  
  // Stepper component state (for Features tab demos)
  stepperPreferences: {
    sizeXL: number;
  };

  // Steplist component state (for About tab demo)
  steplist: {
    steps: {
      id: string;
      label: string;
      description?: string;
    }[];
    currentStep: number;
  };
  
  // Actions
  setLastSavedFile: (path: string) => void;
  addRecentFile: (path: string) => void;
  setActiveTab: (tab: string) => void;
  toggleDarkMode: () => void;
  openModal: (options?: Partial<Pick<PluginState, 'modalTitle' | 'modalBody' | 'showModalUnderlay'>>) => void;
  closeModal: () => void;
  toggleAutoSave: () => void;
  setFileFormat: (format: 'txt' | 'json' | 'md') => void;
  clearRecentFiles: () => void;
  
  // Radio actions
  setRadioPreference: (key: keyof PluginState['radioPreferences'], value: string) => void;
  
  // Stepper actions
  setStepperPreference: (key: keyof PluginState['stepperPreferences'], value: number) => void;
  incrementStepper: (key: keyof PluginState['stepperPreferences'], step?: number) => void;
  decrementStepper: (key: keyof PluginState['stepperPreferences'], step?: number) => void;

  // Steplist actions
  setSteplistCurrentStep: (index: number) => void;
  goToNextSteplistStep: () => void;
  goToPreviousSteplistStep: () => void;
}

export const usePluginStore = create<PluginState>((set, get) => ({
  // Initial state
  lastSavedFile: null,
  recentFiles: [],
  activeTab: 'files',
  isDarkMode: true,
  isModalOpen: false,
  modalTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  modalBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor augue mauris augue neque gravida. Libero volutpat sed ornare arcu. Quisque egestas diam in arcu cursus euismod quis viverra. Posuere ac ut consequat semper viverra nam libero justo laoreet. Enim ut tellus elementum sagittis vitae et leo duis ut. Neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Diam volutpat commodo sed egestas egestas. Dolor magna eget est lorem ipsum dolor. Vitae suscipit tellus mauris a diam maecenas sed. Turpis in eu mi bibendum neque egestas congue. Rhoncus est pellentesque elit ullamcorper dignissim cras lobortis.',
  showModalUnderlay: true,
  autoSave: false,
  fileFormat: 'txt',
  
  // Radio preferences initial state
  radioPreferences: {
    basicOption: 'option2',
    sizeSmall: 'small1',
    sizeMedium: 'medium1',
    sizeLarge: 'large1',
    horizontalAlignment: 'center',
    disabledExample: 'disabled2',
  },
  
  // Stepper preferences initial state
  stepperPreferences: {
    sizeXL: 1000,
  },

  // Steplist initial state
  steplist: {
    steps: [
      { id: 'discover', label: 'Discovery' },
      { id: 'design', label: 'Design' },
      { id: 'develop', label: 'Development' },
      { id: 'deliver', label: 'Delivery' },
    ],
    currentStep: 2,
  },
  
  // Actions
  setLastSavedFile: (path: string) => {
    set({ lastSavedFile: path });
    // Auto-add to recent files
    get().addRecentFile(path);
  },
  
  addRecentFile: (path: string) => {
    set((state) => {
      const newRecent = [path, ...state.recentFiles.filter(f => f !== path)].slice(0, 10);
      return { recentFiles: newRecent };
    });
  },
  
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  openModal: (options) => set((state) => ({
    isModalOpen: true,
    modalTitle: options?.modalTitle ?? state.modalTitle,
    modalBody: options?.modalBody ?? state.modalBody,
    showModalUnderlay: options?.showModalUnderlay ?? state.showModalUnderlay,
  })),

  closeModal: () => set({ isModalOpen: false }),
  
  toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),
  
  setFileFormat: (format: 'txt' | 'json' | 'md') => set({ fileFormat: format }),
  
  clearRecentFiles: () => set({ recentFiles: [] }),
  
  // Radio actions
  setRadioPreference: (key: keyof PluginState['radioPreferences'], value: string) => {
    set((state) => ({
      radioPreferences: {
        ...state.radioPreferences,
        [key]: value
      }
    }));
  },
  
  // Stepper actions
  setStepperPreference: (key: keyof PluginState['stepperPreferences'], value: number) => {
    set((state) => ({
      stepperPreferences: {
        ...state.stepperPreferences,
        [key]: value
      }
    }));
  },
  
  incrementStepper: (key: keyof PluginState['stepperPreferences'], step: number = 1) => {
    set((state) => ({
      stepperPreferences: {
        ...state.stepperPreferences,
        [key]: state.stepperPreferences[key] + step
      }
    }));
  },
  
  decrementStepper: (key: keyof PluginState['stepperPreferences'], step: number = 1) => {
    set((state) => ({
      stepperPreferences: {
        ...state.stepperPreferences,
        [key]: state.stepperPreferences[key] - step
      }
    }));
  },

  // Steplist actions
  setSteplistCurrentStep: (index: number) => {
    set((state) => {
      const maxIndex = state.steplist.steps.length - 1;
      const clampedIndex = Math.max(0, Math.min(index, maxIndex));
      return {
        steplist: {
          ...state.steplist,
          currentStep: clampedIndex,
        },
      };
    });
  },

  goToNextSteplistStep: () => {
    set((state) => {
      const maxIndex = state.steplist.steps.length - 1;
      const nextIndex = Math.min(state.steplist.currentStep + 1, maxIndex);
      return {
        steplist: {
          ...state.steplist,
          currentStep: nextIndex,
        },
      };
    });
  },

  goToPreviousSteplistStep: () => {
    set((state) => ({
      steplist: {
        ...state.steplist,
        currentStep: Math.max(state.steplist.currentStep - 1, 0),
      },
    }));
  },
}));