// @ts-ignore
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { App } from '../main';

// Mock the API module
vi.mock('../api/api', () => ({
  api: {
    notify: vi.fn(),
  },
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/count is 0/i)).toBeInTheDocument();
  });

  it('increments counter when button is clicked', () => {
    render(<App />);
    const incrementButton = screen.getByText(/count is 0/i);
    fireEvent.click(incrementButton);
    expect(screen.getByText(/count is 1/i)).toBeInTheDocument();
  });

  it('renders Hello World button', () => {
    render(<App />);
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });

  it('renders Hybrid button', () => {
    render(<App />);
    expect(screen.getByText(/Hybrid/i)).toBeInTheDocument();
  });
});