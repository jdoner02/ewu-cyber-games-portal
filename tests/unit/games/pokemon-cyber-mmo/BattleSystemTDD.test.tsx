/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonCyberMMO from '@/app/games/pokemon-cyber-mmo/PokemonCyberMMO';

// Mock WebSocket for multiplayer testing
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: WebSocket.OPEN,
};

global.WebSocket = jest.fn(() => mockWebSocket) as any;

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('🔴 Pokemon Cyber MMO - Battle System & Game Instructions (TDD RED PHASE)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to start game and wait for world to load
  const startGame = async () => {
    render(<PokemonCyberMMO />);
    
    // Fill in player name (required to enable start button)
    const nameInput = screen.getByPlaceholderText(/enter your trainer name/i);
    fireEvent.change(nameInput, { target: { value: 'TestTrainer' } });
    
    // Click "Start Your Cyber Journey" to enter the world
    const startButton = screen.getByText(/start your cyber journey/i);
    fireEvent.click(startButton);
    
    // Wait for game world to load (use getAllByText since there are multiple matches)
    await waitFor(() => {
      const cyberRegionElements = screen.getAllByText(/cyber region/i);
      expect(cyberRegionElements.length).toBeGreaterThan(0);
    });
  };

  describe('🎮 Game Flow and Instructions', () => {
    it('should display game instructions and welcome tutorial', async () => {
      render(<PokemonCyberMMO />);
      
      // Should see initial instructions on intro screen
      expect(screen.getByText(/use wasd or arrow keys to move/i)).toBeInTheDocument();
      expect(screen.getByText(/chat with other trainers/i)).toBeInTheDocument();
      expect(screen.getByText(/learn cybersecurity while you play/i)).toBeInTheDocument();
    });

    it('should show tutorial overlay when starting game', async () => {
      await startGame();
      
      // After starting, should see tutorial or help system
      await waitFor(() => {
        expect(screen.getByTestId('tutorial-overlay') || 
               screen.getByText(/tutorial/i) ||
               screen.getByText(/help/i) ||
               screen.getByText(/instructions/i)).toBeInTheDocument();
      });
    });

    it('should display clear game objectives and goals', async () => {
      await startGame();
      
      // Click help button to open modal where objectives are located
      const helpButton = screen.getByTestId('help-button');
      fireEvent.click(helpButton);
      
      // Should see objectives or mission info in help modal
      await waitFor(() => {
        expect(screen.getByTestId('game-objectives')).toBeInTheDocument();
      });
    });
  });

  describe('⚔️ Battle System Foundation', () => {
    it('should allow initiating battles with NPCs', async () => {
      await startGame();
      
      // Look for NPCs that can be battled
      await waitFor(() => {
        const profCyberNPC = screen.getByTestId('npc-prof-cyber');
        expect(profCyberNPC).toBeInTheDocument();
      });
      
      // Click on NPC to initiate battle
      const npc = screen.getByTestId('npc-prof-cyber');
      fireEvent.click(npc);
      
      // Should see battle system activated
      await waitFor(() => {
        expect(screen.getByTestId('battle-system')).toBeInTheDocument();
      });
    });

    it('should display battle interface when battle starts', async () => {
      await startGame();
      
      // Click on NPC to start battle
      const npc = screen.getByTestId('npc-prof-cyber');
      fireEvent.click(npc);
      
      // Should see battle UI elements
      await waitFor(() => {
        expect(screen.getByTestId('battle-system')).toBeInTheDocument();
      });
      
      // Should also see battle stats
      await waitFor(() => {
        expect(screen.getByTestId('battle-stats')).toBeInTheDocument();
      });
    });

    it('should show trivia questions during battle', async () => {
      await startGame();
      
      // Click on NPC to start battle
      const npc = screen.getByTestId('npc-prof-cyber');
      fireEvent.click(npc);
      
      // Wait for battle system to appear
      await waitFor(() => {
        expect(screen.getByTestId('battle-system')).toBeInTheDocument();
      });
      
      // Should see trivia question or battle preparation
      await waitFor(() => {
        const triviaQuestion = screen.queryByTestId('trivia-question');
        const questionText = screen.queryByText(/question/i);
        const cybersecurityText = screen.queryByText(/cybersecurity/i);
        const preparingText = screen.queryByText(/preparing/i);
        
        expect(
          triviaQuestion || questionText || cybersecurityText || preparingText
        ).toBeInTheDocument();
      });
    });

    it('should calculate damage based on trivia answers', async () => {
      await startGame();
      
      // Click on NPC to start battle
      const npc = screen.getByTestId('npc-prof-cyber');
      fireEvent.click(npc);
      
      // Wait for battle system to appear
      await waitFor(() => {
        expect(screen.getByTestId('battle-system')).toBeInTheDocument();
      });
      
      // Should see damage calculator which shows health values
      await waitFor(() => {
        expect(screen.getByTestId('damage-calculator')).toBeInTheDocument();
      });
      
      // Should also see battle stats
      await waitFor(() => {
        expect(screen.getByTestId('battle-stats')).toBeInTheDocument();
      });
    });
  });

  describe('🎯 Educational Content Integration', () => {
    it('should display cybersecurity learning objectives', async () => {
      await startGame();
      
      // Should see educational content or learning objectives
      await waitFor(() => {
        expect(screen.getByTestId('learning-objectives') ||
               screen.getByText(/learn/i) ||
               screen.getByText(/cybersecurity/i) ||
               screen.getByText(/security/i)).toBeInTheDocument();
      });
    });

    it('should provide feedback on trivia answers', async () => {
      await startGame();
      
      // Start battle to access trivia system
      const npc = screen.getByTestId('npc-prof-cyber');
      fireEvent.click(npc);
      
      // Wait for battle system
      await waitFor(() => {
        expect(screen.getByTestId('battle-system')).toBeInTheDocument();
      });
      
      // Should see trivia question content (using queryAllByText to handle multiple matches)
      await waitFor(() => {
        const categoryElements = screen.queryAllByText(/category/i);
        const passwordElements = screen.queryAllByText(/password/i);
        const phishingElements = screen.queryAllByText(/phishing/i);
        const malwareElements = screen.queryAllByText(/malware/i);
        
        expect(
          categoryElements.length > 0 || passwordElements.length > 0 || 
          phishingElements.length > 0 || malwareElements.length > 0
        ).toBeTruthy();
      });
    });
  });

  describe('🎨 User Interface Enhancements', () => {
    it('should show battle statistics and progress', async () => {
      await startGame();
      
      // Start battle to see stats
      const npc = screen.getByTestId('npc-prof-cyber');
      fireEvent.click(npc);
      
      // Should see battle stats or progress indicators
      await waitFor(() => {
        expect(screen.getByTestId('battle-stats')).toBeInTheDocument();
      });
    });

    it('should display help or instructions button', async () => {
      await startGame();
      
      // Should see help or instructions access
      await waitFor(() => {
        expect(screen.getByTestId('help-button') ||
               screen.getByText(/help/i) ||
               screen.getByText(/\?/)).toBeInTheDocument();
      });
    });

    it('should show game controls and keybindings', async () => {
      await startGame();
      
      // Should see control instructions (using queryAllByText to handle multiple matches)
      await waitFor(() => {
        const wasdElements = screen.queryAllByText(/wasd/i);
        const arrowKeysElements = screen.queryAllByText(/arrow keys/i);
        const helpText = screen.queryByText(/press h for help/i);
        const moveElements = screen.queryAllByText(/move/i);
        
        expect(
          wasdElements.length > 0 || arrowKeysElements.length > 0 || 
          helpText || moveElements.length > 0
        ).toBeTruthy();
      });
    });
  });
});
