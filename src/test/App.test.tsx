// @ts-ignore
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from '../main';

// Mock the API module
vi.mock('../api/api', () => ({
  api: {
    notify: vi.fn(),
  },
}));

// Mock IMS service to avoid real network calls
const mockIMSInstance = {
  getAccessToken: vi.fn(),
  validateToken: vi.fn(),
  refreshToken: vi.fn(),
  clearTokenCache: vi.fn(),
  getTokenInfo: vi.fn(() => ({
    hasToken: false,
    expiresAt: null,
    isExpired: true,
    secondsUntilExpiry: 0,
  })),
};

vi.mock('../services/ims/IMSService', () => ({
  createIMSService: vi.fn(() => mockIMSInstance),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main layout with generate tab active', () => {
    render(<App />);

  expect(screen.getByRole('heading', { name: /adobe uxp panel/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /generate images/i })).toBeInTheDocument();
    expect(screen.getByText(/please authenticate to generate images/i)).toBeInTheDocument();
  expect(screen.getAllByText(/login/i)[0]).toBeInTheDocument();
  });

  it('allows switching to the gallery tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText(/gallery/i));

  expect(screen.getByRole('heading', { level: 2, name: /sign in to view your gallery/i })).toBeInTheDocument();
  expect(screen.getAllByText(/login/i)[0]).toBeInTheDocument();
  });
});