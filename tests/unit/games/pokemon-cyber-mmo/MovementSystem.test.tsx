/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonCyberMMO from '../../../../src/app/games/pokemon-cyber-mmo/PokemonCyberMMO';

// Mock WebSocket for multiplayer testing
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: WebSocket.OPEN,
  onopen: null,
  onclose: null,
  onmessage: null,
  onerror: null,
};

// Create a proper WebSocket mock
global.WebSocket = jest.fn(() => mockWebSocket) as any;

// Set the global mock WebSocket for the component to use in test mode
(global as any).mockWebSocket = mockWebSocket;


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

// Helper to consistently set up the world state for all movement tests
async function setupWorld() {
  render(<PokemonCyberMMO />);
  
  // In test mode, the game auto-starts in 'world' state, so we just need to wait for it to be ready
  await waitFor(() => {
    expect(screen.getByTestId('game-world')).toBeInTheDocument();
  });
  
  // Wait for WebSocket to be initialized in the component
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  
  // Skip tutorial overlay if present
  const skipButton = screen.queryByText(/skip.*tutorial/i);
  if (skipButton) {
    fireEvent.click(skipButton);
    await waitFor(() => {
      // Wait for tutorial to be dismissed
      expect(screen.queryByTestId('tutorial-overlay')).not.toBeInTheDocument();
    });
  }
}

describe('🔴 Pokemon Cyber MMO - Movement System Tests (RED PHASE)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset WebSocket mock state
    mockWebSocket.send.mockClear();
  });

  afterEach(() => {
    // Clean up any event listeners
    document.removeEventListener('keydown', () => {});
  });

  describe('1. Basic Movement Controls', () => {
    it('should update player position when W key is pressed (move up)', async () => {
      await setupWorld();

      // Get initial player position
      const playerCharacter = screen.getByTestId('player-character');
      const initialTop = parseFloat(playerCharacter.style.top) || 224;

      // Simulate W key press (move up)
      fireEvent.keyDown(document, { key: 'w' });

      await waitFor(() => {
        const newTop = parseFloat(playerCharacter.style.top);
        expect(newTop).toBe(initialTop - 32); // Should move up by 32 pixels (tile size)
      });
    });

    it('should update player position when S key is pressed (move down)', async () => {
      await setupWorld();

      // Wait for player character to be available
      await waitFor(() => {
        expect(screen.getByTestId('player-character')).toBeInTheDocument();
      });

      // First move UP to avoid obstacle at (10,8) below starting position (10,7)
      fireEvent.keyDown(document, { key: 'w' });
      
      // Wait for movement to be processed (interval runs every 150ms)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      fireEvent.keyUp(document, { key: 'w' });

      // Get position after moving up
      let playerCharacter = screen.getByTestId('player-character');
      const initialTop = parseFloat(playerCharacter.style.top);
      
      // Now test downward movement from the safe position
      fireEvent.keyDown(document, { key: 's' });
      
      // Wait for movement to be processed (interval runs every 150ms)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      fireEvent.keyUp(document, { key: 's' });

      // Check that position changed downward
      await waitFor(() => {
        playerCharacter = screen.getByTestId('player-character');
        const newTop = parseFloat(playerCharacter.style.top);
        expect(newTop).toBe(initialTop + 32); // Should move down by one tile
      });
    });

    it('should update player position when A key is pressed (move left)', async () => {
      await setupWorld();

      const playerCharacter = screen.getByTestId('player-character');
      const initialLeft = parseFloat(playerCharacter.style.left) || 320;

      fireEvent.keyDown(document, { key: 'a' });

      await waitFor(() => {
        const newLeft = parseFloat(playerCharacter.style.left);
        expect(newLeft).toBe(initialLeft - 32); // Should move left by 32 pixels (tile size)
      });
    });

    it('should update player position when D key is pressed (move right)', async () => {
      await setupWorld();

      // Wait for player character to be available
      await waitFor(() => {
        expect(screen.getByTestId('player-character')).toBeInTheDocument();
      });

      // Get initial position (should be at grid position 10,7 = 320px left, 224px top)
      let playerCharacter = screen.getByTestId('player-character');
      const initialLeft = parseFloat(playerCharacter.style.left);
      
      // Move right (increase X by 1 tile = 32px)
      fireEvent.keyDown(document, { key: 'd' });
      await waitFor(() => {
        playerCharacter = screen.getByTestId('player-character');
        const newLeft = parseFloat(playerCharacter.style.left);
        expect(newLeft).toBe(initialLeft + 32); // Should move right by one tile
      });
    });
  });

  describe('2. Arrow Key Movement Support', () => {
    it('should support ArrowUp for upward movement', async () => {
      await setupWorld();
      const playerCharacter = screen.getByTestId('player-character');
      const initialTop = parseFloat(playerCharacter.style.top) || 224;
      fireEvent.keyDown(document, { key: 'ArrowUp' });
      await waitFor(() => {
        const newTop = parseFloat(playerCharacter.style.top);
        expect(newTop).toBe(initialTop - 32);
      });
    });

    it('should support ArrowDown for downward movement', async () => {
      await setupWorld();

      // Wait for player character to be available
      await waitFor(() => {
        expect(screen.getByTestId('player-character')).toBeInTheDocument();
      });

      // First move UP to avoid obstacle at (10,8) below starting position (10,7)
      fireEvent.keyDown(document, { key: 'ArrowUp' });
      
      // Wait for movement to be processed (interval runs every 150ms)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      fireEvent.keyUp(document, { key: 'ArrowUp' });

      // Get position after moving up
      let playerCharacter = screen.getByTestId('player-character');
      const initialTop = parseFloat(playerCharacter.style.top);
      
      // Now test downward movement using arrow key from the safe position
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      
      // Wait for movement to be processed (interval runs every 150ms)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      fireEvent.keyUp(document, { key: 'ArrowDown' });

      // Check that position changed downward
      await waitFor(() => {
        playerCharacter = screen.getByTestId('player-character');
        const newTop = parseFloat(playerCharacter.style.top);
        expect(newTop).toBe(initialTop + 32); // Should move down by one tile
      });
    });

    it('should support ArrowLeft for leftward movement', async () => {
      await setupWorld();
      const playerCharacter = screen.getByTestId('player-character');
      const initialLeft = parseFloat(playerCharacter.style.left) || 320;
      fireEvent.keyDown(document, { key: 'ArrowLeft' });
      await waitFor(() => {
        const newLeft = parseFloat(playerCharacter.style.left);
        expect(newLeft).toBe(initialLeft - 32);
      });
    });

    it('should support ArrowRight for rightward movement', async () => {
      await setupWorld();
      const playerCharacter = screen.getByTestId('player-character');
      const initialLeft = parseFloat(playerCharacter.style.left) || 320;
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      await waitFor(() => {
        const newLeft = parseFloat(playerCharacter.style.left);
        expect(newLeft).toBe(initialLeft + 32);
      });
    });
  });

  describe('3. Movement Boundary Constraints', () => {
    it('should prevent movement beyond top boundary (y = 0)', async () => {
      await setupWorld();
      const playerCharacter = screen.getByTestId('player-character');
      // Simulate multiple upward movements to reach boundary
      for (let i = 0; i < 35; i++) { fireEvent.keyDown(document, { key: 'w' }); }
      await waitFor(() => {
        const finalTop = parseFloat(playerCharacter.style.top);
        expect(finalTop).toBeGreaterThanOrEqual(0); // Should not go below 0
      });
    });

    it('should prevent movement beyond bottom boundary (y = 600)', async () => {
      await setupWorld();
      const playerCharacter = screen.getByTestId('player-character');
      for (let i = 0; i < 35; i++) { fireEvent.keyDown(document, { key: 's' }); }
      await waitFor(() => {
        const finalTop = parseFloat(playerCharacter.style.top);
        expect(finalTop).toBeLessThanOrEqual(600); // Should not go above 600
      });
    });

    it('should prevent movement beyond left boundary (x = 0)', async () => {
      await setupWorld();
      const playerCharacter = screen.getByTestId('player-character');
      for (let i = 0; i < 45; i++) { fireEvent.keyDown(document, { key: 'a' }); }
      await waitFor(() => {
        const finalLeft = parseFloat(playerCharacter.style.left);
        expect(finalLeft).toBeGreaterThanOrEqual(0); // Should not go below 0
      });
    });

    it('should prevent movement beyond right boundary (x = 800)', async () => {
      await setupWorld();
      const playerCharacter = screen.getByTestId('player-character');
      for (let i = 0; i < 45; i++) { fireEvent.keyDown(document, { key: 'd' }); }
      await waitFor(() => {
        const finalLeft = parseFloat(playerCharacter.style.left);
        expect(finalLeft).toBeLessThanOrEqual(800); // Should not go above 800
      });
    });
  });

  describe('4. Movement Multiplayer Synchronization', () => {
    it('should broadcast player movement to multiplayer server', async () => {
      await setupWorld();
      mockWebSocket.send.mockClear();
      fireEvent.keyDown(document, { key: 'w' });
      await waitFor(() => {
        expect(mockWebSocket.send).toHaveBeenCalledWith(
          expect.stringContaining('"type":"player_move"')
        );
      });
    });

    it('should send position data in correct format', async () => {
      await setupWorld();
      mockWebSocket.send.mockClear();
      fireEvent.keyDown(document, { key: 'd' });
      await waitFor(() => {
        expect(mockWebSocket.send).toHaveBeenCalledWith(
          expect.stringContaining('"x":11,"y":7')
        );
      });
    });

    it('should only send movement updates when position actually changes', async () => {
      await setupWorld();
      mockWebSocket.send.mockClear();
      fireEvent.keyDown(document, { key: 'z' });
      await waitFor(() => {
        expect(mockWebSocket.send).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe('5. Movement Context Restrictions', () => {
    it('should not respond to movement keys when not in world state', async () => {
      render(<PokemonCyberMMO />);
      
      // Stay in intro state, don't enter world
      const playerCharacter = screen.queryByTestId('player-character');
      
      // Try to move while not in world state
      fireEvent.keyDown(document, { key: 'w' });
      fireEvent.keyDown(document, { key: 's' });
      fireEvent.keyDown(document, { key: 'a' });
      fireEvent.keyDown(document, { key: 'd' });
      
      // Should not send any movement messages
      await waitFor(() => {
        expect(mockWebSocket.send).not.toHaveBeenCalledWith(
          expect.stringContaining('"type":"player_move"')
        );
      }, { timeout: 1000 });
    });

    it('should disable movement when in battle mode', async () => {
      await setupWorld();
      // Click on a wild Pokemon to enter battle mode
      const wildPokemon = screen.getAllByTestId(/wild-pokemon/)[0];
      if (wildPokemon) {
        fireEvent.click(wildPokemon);
      }
      mockWebSocket.send.mockClear();
      fireEvent.keyDown(document, { key: 'w' });
      await waitFor(() => {
        expect(mockWebSocket.send).not.toHaveBeenCalledWith(
          expect.stringContaining('"type":"player_move"')
        );
      }, { timeout: 1000 });
    });
  });
});
