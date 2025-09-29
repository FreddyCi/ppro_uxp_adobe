// Mock for UXP module used in Vitest tests
import { vi } from 'vitest';

export const storage = {
  localFileSystem: {
    getEntryWithUrl: vi.fn(),
    getFolder: vi.fn(),
    getFileForSaving: vi.fn(),
    getFileForOpening: vi.fn(),
  },
  formats: {
    utf8: 'utf8',
  },
  secureStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
};

// Add other UXP exports as needed
export const host = {
  version: '1.0.0',
};

export const shell = {
  openExternal: vi.fn(),
};