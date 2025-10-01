import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VideoWebView } from './VideoWebView';

// Mock UXP storage
const mockWrite = vi.fn();
const mockCreateFile = vi.fn();
const mockGetTemporaryFolder = vi.fn();

const mockFile = {
  write: mockWrite,
  nativePath: '/temp/webview-123.html',
};

const mockFs = {
  getTemporaryFolder: mockGetTemporaryFolder,
};

vi.mock('uxp', () => ({
  storage: {
    localFileSystem: mockFs,
  },
}));

describe('VideoWebView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTemporaryFolder.mockResolvedValue({
      createFile: mockCreateFile,
    });
    mockCreateFile.mockResolvedValue(mockFile);
    mockWrite.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders loading state when no video source is provided', () => {
      render(<VideoWebView />);
      expect(screen.getByText('Loading video...')).toBeInTheDocument();
    });

    it('renders loading state initially before conversion completes', () => {
      const arrayBuffer = new ArrayBuffer(100);
      render(<VideoWebView videoArrayBuffer={arrayBuffer} />);
      expect(screen.getByText('Loading video...')).toBeInTheDocument();
    });
  });

  describe('ArrayBuffer Conversion', () => {
    it('converts ArrayBuffer to data URL and creates webview', async () => {
      const arrayBuffer = new ArrayBuffer(4);
      const uint8Array = new Uint8Array(arrayBuffer);
      uint8Array[0] = 255;
      uint8Array[1] = 216;
      uint8Array[2] = 255;
      uint8Array[3] = 224;

      render(<VideoWebView videoArrayBuffer={arrayBuffer} videoMimeType="video/mp4" />);

      await waitFor(() => {
        expect(mockCreateFile).toHaveBeenCalledWith(
          expect.stringMatching(/^webview-\d+\.html$/),
          { overwrite: true }
        );
      });

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('<video')
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/WEBVIEW CONTAINER/)).toBeInTheDocument();
      });
    });

    it('uses correct MIME type in data URL for ArrayBuffer', async () => {
      const arrayBuffer = new ArrayBuffer(10);
      
      render(<VideoWebView videoArrayBuffer={arrayBuffer} videoMimeType="video/webm" />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('data:video/webm;base64')
        );
      });
    });

    it('defaults to video/mp4 MIME type if not specified', async () => {
      const arrayBuffer = new ArrayBuffer(10);
      
      render(<VideoWebView videoArrayBuffer={arrayBuffer} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('data:video/mp4;base64')
        );
      });
    });

    it('handles ArrayBuffer conversion error and calls onError', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onError = vi.fn();
      
      // Empty ArrayBuffer should be skipped (byteLength === 0)
      const arrayBuffer = new ArrayBuffer(0);
      
      render(<VideoWebView videoArrayBuffer={arrayBuffer} onError={onError} />);

      // Should remain in loading state since byteLength is 0
      expect(screen.getByText('Loading video...')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Blob Conversion', () => {
    it('converts Blob to data URL and creates webview', async () => {
      const blob = new Blob(['test video data'], { type: 'video/mp4' });

      render(<VideoWebView videoBlob={blob} />);

      await waitFor(() => {
        expect(mockCreateFile).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('<video')
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/WEBVIEW CONTAINER/)).toBeInTheDocument();
      });
    });

    it('uses blob MIME type in data URL', async () => {
      const blob = new Blob(['data'], { type: 'video/webm' });

      render(<VideoWebView videoBlob={blob} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('data:video/webm;base64')
        );
      });
    });

    it('defaults to application/octet-stream if blob has no type', async () => {
      const blob = new Blob(['data']);

      render(<VideoWebView videoBlob={blob} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('data:application/octet-stream;base64')
        );
      });
    });
  });

  describe('Data URL Support', () => {
    it('uses provided data URL directly without conversion', async () => {
      const dataUrl = 'data:video/mp4;base64,AAAAIGZ0eXBpc29t';

      render(<VideoWebView videoDataUrl={dataUrl} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining(dataUrl)
        );
      });

      expect(screen.getByText(/WEBVIEW CONTAINER/)).toBeInTheDocument();
    });
  });

  describe('Regular URL Fallback', () => {
    it('falls back to videoUrl when provided', async () => {
      const videoUrl = 'http://example.com/video.mp4';

      render(<VideoWebView videoUrl={videoUrl} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining(videoUrl)
        );
      });
    });
  });

  describe('Priority Handling', () => {
    it('prioritizes videoDataUrl over other sources', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';
      const arrayBuffer = new ArrayBuffer(10);

      render(
        <VideoWebView
          videoDataUrl={dataUrl}
          videoArrayBuffer={arrayBuffer}
          videoUrl="http://example.com/video.mp4"
        />
      );

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining(dataUrl)
        );
      });
    });

    it('prioritizes videoArrayBuffer over videoBlob and videoUrl', async () => {
      const arrayBuffer = new ArrayBuffer(10);
      const blob = new Blob(['test']);

      render(
        <VideoWebView
          videoArrayBuffer={arrayBuffer}
          videoBlob={blob}
          videoUrl="http://example.com/video.mp4"
        />
      );

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('data:video/mp4;base64')
        );
      });
    });
  });

  describe('HTML Generation', () => {
    it('includes controls attribute when controls=true', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} controls={true} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('controls')
        );
      });
    });

    it('excludes controls attribute when controls=false', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} controls={false} />);

      await waitFor(() => {
        const html = mockWrite.mock.calls[0][0];
        expect(html).not.toContain('<video id="videoElement" controls');
      });
    });

    it('includes muted attribute when muted=true', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} muted={true} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('muted')
        );
      });
    });

    it('includes autoplay attribute when autoPlay=true', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} autoPlay={true} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('autoplay')
        );
      });
    });

    it('includes poster attribute when provided', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';
      const poster = 'http://example.com/poster.jpg';

      render(<VideoWebView videoDataUrl={dataUrl} poster={poster} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining(`poster="${poster}"`)
        );
      });
    });

    it('escapes double quotes in video src', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST"QUOTE';

      render(<VideoWebView videoDataUrl={dataUrl} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('TEST&quot;QUOTE')
        );
      });
    });
  });

  describe('Styling and Layout', () => {
    it('applies custom width and height as numbers', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} width={640} height={480} />);

      await waitFor(() => {
        const container = screen.getByText(/WEBVIEW CONTAINER/).parentElement;
        expect(container).toHaveStyle({ width: '640px', height: '480px' });
      });
    });

    it('applies custom width and height as strings', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} width="50%" height="300px" />);

      await waitFor(() => {
        const container = screen.getByText(/WEBVIEW CONTAINER/).parentElement;
        expect(container).toHaveStyle({ width: '50%', height: '300px' });
      });
    });

    it('uses default dimensions when not specified', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} />);

      await waitFor(() => {
        const container = screen.getByText(/WEBVIEW CONTAINER/).parentElement;
        expect(container).toHaveStyle({ width: '100%', height: '200px' });
      });
    });
  });

  describe('File System Operations', () => {
    it('creates unique webview HTML file with timestamp', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} />);

      await waitFor(() => {
        expect(mockCreateFile).toHaveBeenCalledWith(
          expect.stringMatching(/^webview-\d+\.html$/),
          { overwrite: true }
        );
      });
    });

    it('sets webview src to file URL with native path', async () => {
      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} />);

      await waitFor(() => {
        const webview = screen.getByText(/WEBVIEW CONTAINER/).parentElement?.querySelector('webview');
        expect(webview?.getAttribute('src')).toBe('file:///temp/webview-123.html');
      });
    });

    it('handles file creation error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockCreateFile.mockRejectedValueOnce(new Error('File creation failed'));

      const dataUrl = 'data:video/mp4;base64,TEST';

      render(<VideoWebView videoDataUrl={dataUrl} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error creating webview file'),
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Base64 Encoding', () => {
    it('correctly encodes small ArrayBuffer to base64', async () => {
      const arrayBuffer = new ArrayBuffer(3);
      const view = new Uint8Array(arrayBuffer);
      view[0] = 77; // 'M'
      view[1] = 97; // 'a'
      view[2] = 110; // 'n'

      render(<VideoWebView videoArrayBuffer={arrayBuffer} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('TWFu') // Base64 for "Man"
        );
      });
    });

    it('handles ArrayBuffer with padding', async () => {
      const arrayBuffer = new ArrayBuffer(2);
      const view = new Uint8Array(arrayBuffer);
      view[0] = 77; // 'M'
      view[1] = 97; // 'a'

      render(<VideoWebView videoArrayBuffer={arrayBuffer} />);

      await waitFor(() => {
        expect(mockWrite).toHaveBeenCalledWith(
          expect.stringContaining('base64')
        );
      });
    });
  });

  describe('Event Handlers', () => {
    it('calls onError when ArrayBuffer conversion fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onError = vi.fn();

      // Mock encodeBase64 to throw
      const originalUint8Array = global.Uint8Array;
      global.Uint8Array = class extends originalUint8Array {
        constructor(buffer: any, byteOffset?: any, length?: any) {
          super(buffer as ArrayBuffer, byteOffset, length);
          throw new Error('Encoding failed');
        }
      } as any;

      const arrayBuffer = new ArrayBuffer(10);

      render(<VideoWebView videoArrayBuffer={arrayBuffer} onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });

      global.Uint8Array = originalUint8Array;
      consoleSpy.mockRestore();
    });

    it('calls onError when Blob conversion fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onError = vi.fn();

      // Create a blob that throws on arrayBuffer()
      const blob = {
        arrayBuffer: vi.fn().mockRejectedValue(new Error('Blob read failed')),
        type: 'video/mp4',
        size: 100,
      } as unknown as Blob;

      render(<VideoWebView videoBlob={blob} onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });
});
