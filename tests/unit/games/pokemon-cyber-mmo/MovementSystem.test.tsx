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
  const nameInput = screen.getByPlaceholderText(/trainer name/i);
  fireEvent.change(nameInput, { target: { value: 'Ash' } });
  const enterWorldButton = screen.getByText(/enter.*world/i);
  fireEvent.click(enterWorldButton);
  await waitFor(() => {
    expect(screen.getByTestId('game-world')).toBeInTheDocument();
  });
  const skipButton = screen.queryByText(/skip tutorial/i);
  if (skipButton) fireEvent.click(skipButton);
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
      render(<PokemonCyberMMO />);

      // Enter a player name to enable the button
      const nameInput = screen.getByPlaceholderText(/trainer name/i);
      fireEvent.change(nameInput, { target: { value: 'Ash' } });

      // Navigate to world state where movement is enabled
      const enterWorldButton = screen.getByText(/enter.*world/i);
      fireEvent.click(enterWorldButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-world')).toBeInTheDocument();
      });

      // Skip tutorial overlay if present
      const skipButton = screen.queryByText(/skip tutorial/i);
      if (skipButton) {
        fireEvent.click(skipButton);
      }

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
      render(<PokemonCyberMMO />);

      // Enter a player name to enable the button
      const nameInput = screen.getByPlaceholderText(/trainer name/i);
      fireEvent.change(nameInput, { target: { value: 'Ash' } });

      const enterWorldButton = screen.getByText(/enter.*world/i);
      fireEvent.click(enterWorldButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-world')).toBeInTheDocument();
      });

      // Skip tutorial overlay if present
      const skipButton = screen.queryByText(/skip tutorial/i);
      if (skipButton) {
        fireEvent.click(skipButton);
      }

      // Move up once to ensure not at bottom boundary
      let playerCharacter = screen.getByTestId('player-character');
      fireEvent.keyDown(document, { key: 'w' });
      await waitFor(() => {
        playerCharacter = screen.getByTestId('player-character');
        expect(parseFloat(playerCharacter.style.top)).toBe(224 - 32); // 192
      });
      // Now move down
      fireEvent.keyDown(document, { key: 's' });
      await waitFor(() => {
        const newTop = parseFloat(playerCharacter.style.top);
        expect(newTop).toBe(224); // Should return to initial position
      });
    });

    it('should update player position when A key is pressed (move left)', async () => {
      render(<PokemonCyberMMO />);

      // Enter a player name to enable the button
      const nameInput = screen.getByPlaceholderText(/trainer name/i);
      fireEvent.change(nameInput, { target: { value: 'Ash' } });

      const enterWorldButton = screen.getByText(/enter.*world/i);
      fireEvent.click(enterWorldButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-world')).toBeInTheDocument();
      });

      // Skip tutorial overlay if present
      const skipButton = screen.queryByText(/skip tutorial/i);
      if (skipButton) {
        fireEvent.click(skipButton);
      }

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
      // Move left once to ensure not at right boundary
      let playerCharacter = screen.getByTestId('player-character');
      fireEvent.keyDown(document, { key: 'a' });
      await waitFor(() => {
        playerCharacter = screen.getByTestId('player-character');
        expect(parseFloat(playerCharacter.style.left)).toBe(320 - 32); // 288
      });
      // Now move right
      fireEvent.keyDown(document, { key: 'd' });
      await waitFor(() => {
        const newLeft = parseFloat(playerCharacter.style.left);
        expect(newLeft).toBe(320); // Should return to initial position
      });
    });
  });

  describe('2. Arrow Key Movement Support', () => {
    function setupWorld() {
      render(<PokemonCyberMMO />);
      const nameInput = screen.getByPlaceholderText(/trainer name/i);
      fireEvent.change(nameInput, { target: { value: 'Ash' } });
      const enterWorldButton = screen.getByText(/enter.*world/i);
      fireEvent.click(enterWorldButton);
      return waitFor(() => {
        expect(screen.getByTestId('game-world')).toBeInTheDocument();
      }).then(() => {
        const skipButton = screen.queryByText(/skip tutorial/i);
        if (skipButton) fireEvent.click(skipButton);
      });
    }

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
      const playerCharacter = screen.getByTestId('player-character');
      const initialTop = 224;
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      await waitFor(() => {
        const newTop = parseFloat(playerCharacter.style.top);
        expect(newTop).toBe(initialTop + 32); // 256
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
          expect.stringContaining('"x":410,"y":300')
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
      const wildPokemon = screen.queryByTestId(/wild-pokemon/);
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
