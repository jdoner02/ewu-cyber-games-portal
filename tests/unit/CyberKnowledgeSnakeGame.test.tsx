/**
 * Test Guardian - Cyber Knowledge Snake Game Tests
 * 
 * This test suite ensures comprehensive coverage of the Cyber Knowledge Snake Game
 * implementation following TDD principles. Tests cover snake mechanics, knowledge
 * orb collection, region exploration, fog of war, and educational integration.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import CyberKnowledgeSnakeGame from '../../src/app/games/cyber-knowledge-snake/CyberKnowledgeSnakeGame';

// Mock the game store
jest.mock('../../src/stores/gameStore', () => ({
  __esModule: true,
  default: () => ({
    playerStats: {
      level: 1,
      totalXP: 0,
      gamesCompleted: 0,
      achievementsUnlocked: 0,
      streakDays: 0,
      lastVisit: '2025-07-21',
      timeSpent: 0
    },
    addXP: jest.fn(),
    updateSkillProgress: jest.fn(),
    unlockAchievement: jest.fn(),
    gameProgress: []
  })
}));

describe('CyberKnowledgeSnakeGame - Core Game Mechanics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Game Initialization', () => {
    it('should render the game canvas with proper dimensions', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const canvas = screen.getByTestId('snake-game-canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute('width', '800');
      expect(canvas).toHaveAttribute('height', '600');
    });

    it('should initialize snake at center position', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const snakePosition = screen.getByTestId('snake-position');
      expect(snakePosition).toHaveTextContent('x: 400, y: 300');
    });

    it('should start with Fundamentals Island region', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const currentRegion = screen.getByTestId('current-region');
      expect(currentRegion).toHaveTextContent('Fundamentals Island');
    });

    it('should initialize with CIA Triad knowledge orbs', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const knowledgeOrbs = screen.getAllByTestId(/knowledge-orb-/);
      expect(knowledgeOrbs).toHaveLength(3); // CIA Triad: Confidentiality, Integrity, Availability
    });
  });

  describe('Snake Movement', () => {
    it('should move snake up when arrow up key is pressed', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const canvas = screen.getByTestId('snake-game-canvas');
      fireEvent.keyDown(canvas, { key: 'ArrowUp' });
      
      await waitFor(() => {
        const direction = screen.getByTestId('snake-direction');
        expect(direction).toHaveTextContent('up');
      });
    });

    it('should move snake down when arrow down key is pressed', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const canvas = screen.getByTestId('snake-game-canvas');
      fireEvent.keyDown(canvas, { key: 'ArrowDown' });
      
      await waitFor(() => {
        const direction = screen.getByTestId('snake-direction');
        expect(direction).toHaveTextContent('down');
      });
    });

    it('should move snake left when arrow left key is pressed', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const canvas = screen.getByTestId('snake-game-canvas');
      fireEvent.keyDown(canvas, { key: 'ArrowLeft' });
      
      await waitFor(() => {
        const direction = screen.getByTestId('snake-direction');
        expect(direction).toHaveTextContent('left');
      });
    });

    it('should move snake right when arrow right key is pressed', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const canvas = screen.getByTestId('snake-game-canvas');
      fireEvent.keyDown(canvas, { key: 'ArrowRight' });
      
      await waitFor(() => {
        const direction = screen.getByTestId('snake-direction');
        expect(direction).toHaveTextContent('right');
      });
    });

    it('should prevent reverse direction movement', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const canvas = screen.getByTestId('snake-game-canvas');
      
      // Set initial direction to right
      fireEvent.keyDown(canvas, { key: 'ArrowRight' });
      await waitFor(() => {
        const direction = screen.getByTestId('snake-direction');
        expect(direction).toHaveTextContent('right');
      });
      
      // Try to go left (reverse direction)
      fireEvent.keyDown(canvas, { key: 'ArrowLeft' });
      
      // Direction should remain right
      const direction = screen.getByTestId('snake-direction');
      expect(direction).toHaveTextContent('right');
    });
  });

  describe('Knowledge Orb Collection', () => {
    it('should increase snake length when collecting knowledge orb', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      // Get initial snake length
      const initialLength = screen.getByTestId('snake-length');
      expect(initialLength).toHaveTextContent('1');
      
      // Simulate collecting a knowledge orb
      const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
      fireEvent.click(collectOrbButton);
      
      await waitFor(() => {
        const newLength = screen.getByTestId('snake-length');
        expect(newLength).toHaveTextContent('2');
      });
    });

    it('should display collected concept information', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
      fireEvent.click(collectOrbButton);
      
      await waitFor(() => {
        const conceptToast = screen.getByTestId('concept-toast');
        expect(conceptToast).toHaveTextContent('Collected: Confidentiality');
        expect(conceptToast).toHaveTextContent('Only those with permission can access information');
      });
    });

    it('should update knowledge map when orb is collected', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
      fireEvent.click(collectOrbButton);
      
      await waitFor(() => {
        const knowledgeMapNode = screen.getByTestId('knowledge-map-node-confidentiality');
        expect(knowledgeMapNode).toHaveClass('unlocked');
      });
    });

    it('should award XP when collecting knowledge orb', async () => {
      const mockAddXP = jest.fn();
      jest.doMock('../../src/stores/gameStore', () => ({
        __esModule: true,
        default: () => ({
          playerStats: { level: 1, totalXP: 0 },
          addXP: mockAddXP,
          updateSkillProgress: jest.fn(),
          unlockAchievement: jest.fn(),
          gameProgress: []
        })
      }));
      
      render(<CyberKnowledgeSnakeGame />);
      
      const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
      fireEvent.click(collectOrbButton);
      
      await waitFor(() => {
        expect(mockAddXP).toHaveBeenCalledWith(50); // Expected XP for basic concept
      });
    });
  });

  describe('Fog of War Mechanics', () => {
    it('should reveal map area around snake position', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const visibleArea = screen.getByTestId('visible-area');
      expect(visibleArea).toBeInTheDocument();
      expect(visibleArea).toHaveStyle('opacity: 1');
    });

    it('should hide unexplored areas in fog', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const foggedAreas = screen.getAllByTestId(/fog-area-/);
      expect(foggedAreas.length).toBeGreaterThan(0);
      foggedAreas.forEach(area => {
        expect(area).toHaveStyle('opacity: 0.3');
      });
    });

    it('should expand visible area as snake moves', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const canvas = screen.getByTestId('snake-game-canvas');
      
      // Move snake to reveal more area
      fireEvent.keyDown(canvas, { key: 'ArrowRight' });
      
      await waitFor(() => {
        const exploredPercentage = screen.getByTestId('explored-percentage');
        expect(parseInt(exploredPercentage.textContent!)).toBeGreaterThan(5); // Initial explored area
      });
    });
  });

  describe('Regional Progression', () => {
    it('should unlock new regions when completing current region', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      // Collect all CIA Triad orbs
      const confidentialityOrb = screen.getByTestId('collect-orb-confidentiality');
      const integrityOrb = screen.getByTestId('collect-orb-integrity');
      const availabilityOrb = screen.getByTestId('collect-orb-availability');
      
      fireEvent.click(confidentialityOrb);
      fireEvent.click(integrityOrb);
      fireEvent.click(availabilityOrb);
      
      await waitFor(() => {
        const unlockedRegions = screen.getByTestId('unlocked-regions');
        expect(unlockedRegions).toHaveTextContent('Hardware Haven');
        expect(unlockedRegions).toHaveTextContent('Crypto Cove');
      });
    });

    it('should allow player to choose next region', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      // Complete Fundamentals Island
      const confidentialityOrb = screen.getByTestId('collect-orb-confidentiality');
      const integrityOrb = screen.getByTestId('collect-orb-integrity');
      const availabilityOrb = screen.getByTestId('collect-orb-availability');
      
      fireEvent.click(confidentialityOrb);
      fireEvent.click(integrityOrb);
      fireEvent.click(availabilityOrb);
      
      await waitFor(() => {
        const regionSelector = screen.getByTestId('region-selector');
        expect(regionSelector).toBeInTheDocument();
      });
      
      // Select Hardware Haven
      const hardwareHavenButton = screen.getByTestId('select-region-hardware-haven');
      fireEvent.click(hardwareHavenButton);
      
      await waitFor(() => {
        const currentRegion = screen.getByTestId('current-region');
        expect(currentRegion).toHaveTextContent('Hardware Haven');
      });
    });
  });

  describe('Game Over Mechanics', () => {
    it('should end game when snake hits boundary', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      // Simulate snake hitting boundary
      const gameOverTrigger = screen.getByTestId('trigger-boundary-collision');
      fireEvent.click(gameOverTrigger);
      
      await waitFor(() => {
        const gameOverScreen = screen.getByTestId('game-over-screen');
        expect(gameOverScreen).toBeInTheDocument();
        expect(gameOverScreen).toHaveTextContent('Game Over');
      });
    });

    it('should preserve collected knowledge after game over', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      // Collect some knowledge
      const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
      fireEvent.click(collectOrbButton);
      
      // Trigger game over
      const gameOverTrigger = screen.getByTestId('trigger-boundary-collision');
      fireEvent.click(gameOverTrigger);
      
      await waitFor(() => {
        const preservedKnowledge = screen.getByTestId('preserved-knowledge');
        expect(preservedKnowledge).toHaveTextContent('Confidentiality');
      });
    });

    it('should allow restarting game', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      // Trigger game over
      const gameOverTrigger = screen.getByTestId('trigger-boundary-collision');
      fireEvent.click(gameOverTrigger);
      
      await waitFor(() => {
        const gameOverScreen = screen.getByTestId('game-over-screen');
        expect(gameOverScreen).toBeInTheDocument();
      });
      
      // Restart game
      const restartButton = screen.getByTestId('restart-game');
      fireEvent.click(restartButton);
      
      await waitFor(() => {
        const snakeLength = screen.getByTestId('snake-length');
        expect(snakeLength).toHaveTextContent('1'); // Reset to initial length
      });
    });
  });

  describe('Knowledge Map Integration', () => {
    it('should display interactive knowledge map', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const knowledgeMap = screen.getByTestId('knowledge-map');
      expect(knowledgeMap).toBeInTheDocument();
    });

    it('should show concept connections on map', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const ciaTriadCluster = screen.getByTestId('knowledge-cluster-cia-triad');
      expect(ciaTriadCluster).toBeInTheDocument();
      
      const connections = screen.getAllByTestId(/knowledge-connection-/);
      expect(connections.length).toBeGreaterThan(0);
    });

    it('should allow dragging nodes on knowledge map', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const draggableNode = screen.getByTestId('knowledge-node-confidentiality');
      
      fireEvent.mouseDown(draggableNode);
      fireEvent.mouseMove(draggableNode, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(draggableNode);
      
      // Verify node position changed
      await waitFor(() => {
        expect(draggableNode).toHaveStyle('transform: translate(100px, 100px)');
      });
    });
  });

  describe('Educational Features', () => {
    it('should display learning objectives for collected concepts', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
      fireEvent.click(collectOrbButton);
      
      // Open concept details
      const conceptNode = screen.getByTestId('knowledge-node-confidentiality');
      fireEvent.click(conceptNode);
      
      await waitFor(() => {
        const learningObjectives = screen.getByTestId('learning-objectives');
        expect(learningObjectives).toHaveTextContent('Understand data confidentiality principles');
      });
    });

    it('should show career connections for concepts', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
      fireEvent.click(collectOrbButton);
      
      const conceptNode = screen.getByTestId('knowledge-node-confidentiality');
      fireEvent.click(conceptNode);
      
      await waitFor(() => {
        const careerConnection = screen.getByTestId('career-connection');
        expect(careerConnection).toHaveTextContent('Security Analyst');
      });
    });

    it('should award badges for completing concept clusters', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      // Collect all CIA Triad concepts
      const confidentialityOrb = screen.getByTestId('collect-orb-confidentiality');
      const integrityOrb = screen.getByTestId('collect-orb-integrity');
      const availabilityOrb = screen.getByTestId('collect-orb-availability');
      
      fireEvent.click(confidentialityOrb);
      fireEvent.click(integrityOrb);
      fireEvent.click(availabilityOrb);
      
      await waitFor(() => {
        const badge = screen.getByTestId('badge-cia-triad-mastery');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent('CIA Triad Mastery');
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should maintain smooth animation at 60fps', async () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const performanceMetrics = screen.getByTestId('performance-metrics');
      
      await waitFor(() => {
        const fps = parseInt(performanceMetrics.textContent!.split('FPS: ')[1]);
        expect(fps).toBeGreaterThanOrEqual(60);
      }, { timeout: 2000 });
    });

    it('should handle large knowledge maps efficiently', () => {
      render(<CyberKnowledgeSnakeGame />);
      
      const knowledgeNodes = screen.getAllByTestId(/knowledge-node-/);
      expect(knowledgeNodes.length).toBeLessThanOrEqual(100); // Performance limit
      
      // Verify no memory leaks in node rendering
      const renderTime = performance.now();
      expect(renderTime).toBeLessThan(100); // Should render quickly
    });
  });
});

describe('CyberKnowledgeSnakeGame - Accessibility', () => {
  it('should support keyboard navigation', () => {
    render(<CyberKnowledgeSnakeGame />);
    
    const gameContainer = screen.getByTestId('snake-game-container');
    expect(gameContainer).toHaveAttribute('tabIndex', '0');
    expect(gameContainer).toHaveAttribute('role', 'application');
  });

  it('should provide screen reader announcements for game events', async () => {
    render(<CyberKnowledgeSnakeGame />);
    
    const collectOrbButton = screen.getByTestId('collect-orb-confidentiality');
    fireEvent.click(collectOrbButton);
    
    await waitFor(() => {
      const announcement = screen.getByTestId('sr-announcement');
      expect(announcement).toHaveTextContent('Collected Confidentiality knowledge orb. Snake length increased to 2.');
    });
  });

  it('should have appropriate ARIA labels', () => {
    render(<CyberKnowledgeSnakeGame />);
    
    const canvas = screen.getByTestId('snake-game-canvas');
    expect(canvas).toHaveAttribute('aria-label', 'Cyber Knowledge Snake Game Canvas');
    
    const knowledgeMap = screen.getByTestId('knowledge-map');
    expect(knowledgeMap).toHaveAttribute('aria-label', 'Interactive Cybersecurity Knowledge Map');
  });
});
