// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { AudioPlayerBar } from '../visitor/components/AudioPlayerBar';
import { usePlayerStore } from '../shared/stores/playerStore';
import museumData from '../../public/mock/museum_data.json';
import '../locales/i18n';

describe('AudioPlayerBar', () => {
  it('renders without crashing when playArtifact is called', () => {
    const artifact = museumData.artifacts[0] as any;
    usePlayerStore.getState().playArtifact(artifact);

    const { container } = render(React.createElement(AudioPlayerBar));
    expect(container).toBeDefined();
  });
});
