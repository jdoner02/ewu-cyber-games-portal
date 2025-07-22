import { render, screen, fireEvent } from '@testing-library/react';
import CyberKnowledgeSnakeGame from '../../src/app/games/cyber-knowledge-snake/CyberKnowledgeSnakeGame';

describe('CyberKnowledgeSnakeGame', () => {
  it('renders the game canvas and HUD', () => {
    render(<CyberKnowledgeSnakeGame />);
    expect(screen.getByTestId('snake-game-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('snake-position')).toBeInTheDocument();
    expect(screen.getByTestId('snake-length')).toBeInTheDocument();
    expect(screen.getByTestId('snake-direction')).toBeInTheDocument();
    expect(screen.getByTestId('current-region')).toBeInTheDocument();
    expect(screen.getByTestId('explored-percentage')).toBeInTheDocument();
    expect(screen.getByTestId('performance-metrics')).toBeInTheDocument();
  });

  it('collects a knowledge orb and shows concept toast', () => {
    render(<CyberKnowledgeSnakeGame />);
    const collectBtn = screen.getByTestId('collect-orb-confidentiality');
    fireEvent.click(collectBtn);
    expect(screen.getByTestId('concept-toast')).toBeInTheDocument();
    expect(screen.getByText(/Collected: Confidentiality/)).toBeInTheDocument();
  });

  it('triggers game over and shows preserved knowledge', () => {
    render(<CyberKnowledgeSnakeGame />);
    fireEvent.click(screen.getByTestId('collect-orb-confidentiality'));
    fireEvent.click(screen.getByTestId('trigger-boundary-collision'));
    expect(screen.getByTestId('game-over-screen')).toBeInTheDocument();
    expect(screen.getByTestId('preserved-knowledge')).toBeInTheDocument();
    expect(screen.getByText(/Confidentiality/)).toBeInTheDocument();
  });

  it('shows and interacts with the knowledge map modal', () => {
    render(<CyberKnowledgeSnakeGame />);
    fireEvent.click(screen.getByText('Knowledge Map'));
    expect(screen.getByTestId('knowledge-map')).toBeInTheDocument();
    expect(screen.getByTestId('knowledge-cluster-cia-triad')).toBeInTheDocument();
    expect(screen.getByTestId('knowledge-node-confidentiality')).toBeInTheDocument();
    // Simulate clicking a node for info
    fireEvent.click(screen.getByTestId('knowledge-node-confidentiality'));
    expect(screen.getAllByTestId('learning-objectives').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('career-connections').length).toBeGreaterThan(0);
  });

  it('unlocks CIA Triad badge after collecting all orbs', () => {
    render(<CyberKnowledgeSnakeGame />);
    fireEvent.click(screen.getByTestId('collect-orb-confidentiality'));
    fireEvent.click(screen.getByTestId('collect-orb-integrity'));
    fireEvent.click(screen.getByTestId('collect-orb-availability'));
    expect(screen.getByTestId('badge-cia-triad-mastery')).toBeInTheDocument();
  });

  it('switches regions using the region selector', () => {
    render(<CyberKnowledgeSnakeGame />);
    // Collect all orbs to unlock new regions
    fireEvent.click(screen.getByTestId('collect-orb-confidentiality'));
    fireEvent.click(screen.getByTestId('collect-orb-integrity'));
    fireEvent.click(screen.getByTestId('collect-orb-availability'));
    // Region selector should appear
    const selector = screen.getByTestId('region-selector');
    expect(selector).toBeInTheDocument();
    fireEvent.change(selector.querySelector('select')!, { target: { value: 'Hardware Haven' } });
    expect(screen.getByTestId('current-region').textContent).toContain('Hardware Haven');
  });

  // Pan and zoom test placeholder (to be implemented with pan/zoom feature)
  it('allows pan and zoom on the knowledge map (pending feature)', () => {
    // This test will fail until pan/zoom is implemented
    render(<CyberKnowledgeSnakeGame />);
    fireEvent.click(screen.getByText('Knowledge Map'));
    // Simulate pan/zoom events (to be implemented)
    expect(false).toBe(true); // Failing test for TDD
  });
});
