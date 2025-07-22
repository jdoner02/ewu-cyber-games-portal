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
      
      // Should see objectives or mission info
      await waitFor(() => {
        expect(screen.getByTestId('game-objectives') || 
               screen.getByText(/objective/i) ||
               screen.getByText(/mission/i) ||
               screen.getByText(/goal/i)).toBeInTheDocument();
      });
    });
  });

  describe('⚔️ Battle System Foundation', () => {
    it('should allow initiating battles with NPCs', async () => {
      await startGame();
      
      // Look for NPCs that can be battled
      await waitFor(() => {
        const npc = screen.getByTestId('npc-prof-cyber') || 
                   screen.getByText(/prof.*cyber/i);
        expect(npc).toBeInTheDocument();
      });
      
      // Click on NPC to initiate battle
      const npc = screen.getByTestId('npc-prof-cyber') || 
                 screen.getByText(/prof.*cyber/i);
      fireEvent.click(npc);
      
      // Should see battle option or battle start
      await waitFor(() => {
        expect(screen.getByTestId('battle-option') ||
               screen.getByText(/battle/i) ||
               screen.getByText(/challenge/i) ||
               screen.getByText(/fight/i)).toBeInTheDocument();
      });
    });

    it('should display battle interface when battle starts', async () => {
      await startGame();
      
      // Find and click battle trigger
      await waitFor(() => {
        const battleTrigger = screen.getByTestId('start-battle') ||
                             screen.getByText(/battle/i);
        fireEvent.click(battleTrigger);
      });
      
      // Should see battle UI elements
      await waitFor(() => {
        expect(screen.getByTestId('battle-interface') ||
               screen.getByTestId('battle-screen') ||
               screen.getByText(/battle.*started/i)).toBeInTheDocument();
      });
    });

    it('should show trivia questions during battle', async () => {
      await startGame();
      
      // Simulate battle start
      const battleButton = screen.queryByTestId('start-battle') ||
                          screen.queryByText(/battle/i);
      
      if (battleButton) {
        fireEvent.click(battleButton);
        
        // Should see trivia question
        await waitFor(() => {
          expect(screen.getByTestId('trivia-question') ||
                 screen.getByText(/question/i) ||
                 screen.getByText(/cybersecurity/i) ||
                 screen.getByRole('radiogroup')).toBeInTheDocument();
        });
      } else {
        // If no battle button, test should create one
        expect(screen.getByTestId('battle-system')).toBeInTheDocument();
      }
    });

    it('should calculate damage based on trivia answers', async () => {
      await startGame();
      
      // Start battle and answer question
      const battleTrigger = screen.queryByTestId('start-battle');
      if (battleTrigger) {
        fireEvent.click(battleTrigger);
        
        // Answer trivia question
        await waitFor(() => {
          const answerOption = screen.getByTestId('answer-option-0') ||
                              screen.getByRole('radio');
          fireEvent.click(answerOption);
        });
        
        // Should see damage calculation or battle result
        await waitFor(() => {
          expect(screen.getByTestId('damage-display') ||
                 screen.getByText(/damage/i) ||
                 screen.getByText(/points/i)).toBeInTheDocument();
        });
      } else {
        // Test expects battle system to exist
        expect(screen.getByTestId('damage-calculator')).toBeInTheDocument();
      }
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
      
      // Mock answering a trivia question
      const triviaSystem = screen.queryByTestId('trivia-system');
      
      if (triviaSystem) {
        // Simulate answering question incorrectly
        const wrongAnswer = screen.getByTestId('wrong-answer') ||
                           screen.getByText(/false/i);
        fireEvent.click(wrongAnswer);
        
        // Should see educational feedback
        await waitFor(() => {
          expect(screen.getByTestId('answer-feedback') ||
                 screen.getByText(/incorrect/i) ||
                 screen.getByText(/explanation/i)).toBeInTheDocument();
        });
      } else {
        // Test expects feedback system to exist
        expect(screen.getByTestId('feedback-system')).toBeInTheDocument();
      }
    });
  });

  describe('🎨 User Interface Enhancements', () => {
    it('should show battle statistics and progress', async () => {
      await startGame();
      
      // Should see battle stats or progress indicators
      await waitFor(() => {
        expect(screen.getByTestId('battle-stats') ||
               screen.getByTestId('progress-bar') ||
               screen.getByText(/score/i) ||
               screen.getByText(/level/i)).toBeInTheDocument();
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
      
      // Should see control instructions
      await waitFor(() => {
        expect(screen.getByTestId('game-controls') ||
               screen.getByText(/wasd/i) ||
               screen.getByText(/controls/i) ||
               screen.getByText(/arrow keys/i)).toBeInTheDocument();
      });
    });
  });
});
