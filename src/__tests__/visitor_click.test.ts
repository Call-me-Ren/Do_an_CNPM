// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '../locales/i18n';

// Mock museumApi
vi.mock('../shared/services/api', async () => {
  const data = (await import('../../public/mock/museum_data.json')).default;
  return {
    museumApi: {
      getMuseumData: vi.fn().mockResolvedValue(data)
    }
  };
});

import { VisitorLayout } from '../visitor/VisitorLayout';

describe('VisitorLayout integration test', () => {
  it('clicks the speaker button without crashing', async () => {
    const { container } = render(React.createElement(VisitorLayout));
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getAllByText(/Trống đồng Đông Sơn/i).length).toBeGreaterThan(0);
    });

    // Find speaker button
    const speakerButtons = container.querySelectorAll('button[title*="Nghe thuyết minh"], button[title*="Listen"]');
    expect(speakerButtons.length).toBeGreaterThan(0);

    // Click the first speaker button
    fireEvent.click(speakerButtons[0]);

    // Check if AudioPlayerBar rendered
    await waitFor(() => {
      expect(container.querySelector('audio')).toBeDefined();
    });
  });
});
