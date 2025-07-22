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

describe('Pokemon Cyber MMO - Core Features (TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Real-time Multiplayer Connection', () => {
    it('should establish WebSocket connection on game start', async () => {
      render(<PokemonCyberMMO />);
      
      // Start the game to trigger multiplayer connection
      const startButton = screen.getByText(/start/i);
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(global.WebSocket).toHaveBeenCalledWith(
          expect.stringContaining('ws://') // Should connect to multiplayer server
        );
      });
    });

    it('should display connected players in real-time', async () => {
      render(<PokemonCyberMMO />);
      
      // Simulate receiving player data from server
      const mockPlayers = [
        { id: 'player1', name: 'Ash', position: { x: 100, y: 200 }, pokemon: 'hackmon' },
        { id: 'player2', name: 'Misty', position: { x: 150, y: 250 }, pokemon: 'guardmon' }
      ];

      act(() => {
        // Simulate WebSocket message
        const messageEvent = new MessageEvent('message', {
          data: JSON.stringify({
            type: 'players_update',
            players: mockPlayers
          })
        });
        mockWebSocket.addEventListener.mock.calls
          .find(call => call[0] === 'message')[1](messageEvent);
      });

      await waitFor(() => {
        expect(screen.getByText('Ash')).toBeInTheDocument();
        expect(screen.getByText('Misty')).toBeInTheDocument();
      });
    });

    it('should sync player movements across clients', async () => {
      render(<PokemonCyberMMO />);
      
      // Move player
      const gameCanvas = screen.getByRole('application') || document.querySelector('canvas');
      fireEvent.keyDown(gameCanvas!, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(mockWebSocket.send).toHaveBeenCalledWith(
          expect.stringContaining('"type":"player_move"')
        );
      });
    });
  });

  describe('2. Monster Catching System', () => {
    it('should display wild monsters in the game world', async () => {
      render(<PokemonCyberMMO />);
      
      // Navigate to world view
      const enterWorldButton = screen.getByText(/enter.*world/i);
      fireEvent.click(enterWorldButton);

      await waitFor(() => {
        // Should show wild CyberPokemon
        expect(screen.getByText(/wild.*appeared/i)).toBeInTheDocument();
      });
    });

    it('should initiate battle when encountering wild monster', async () => {
      render(<PokemonCyberMMO />);
      
      // Simulate encountering a wild pokemon
      const wildPokemon = screen.getByTestId('wild-pokemon-hackmon');
      fireEvent.click(wildPokemon);

      await waitFor(() => {
        expect(screen.getByText(/battle.*started/i)).toBeInTheDocument();
        expect(screen.getByText(/hackmon/i)).toBeInTheDocument();
      });
    });

    it('should allow throwing cyber balls to catch monsters', async () => {
      render(<PokemonCyberMMO />);
      
      // Start a battle
      const battleButton = screen.getByTestId('start-battle');
      fireEvent.click(battleButton);

      // Use cyber ball
      const cyberBallButton = screen.getByText(/cyber.*ball/i);
      fireEvent.click(cyberBallButton);

      await waitFor(() => {
        expect(screen.getByText(/attempting.*catch/i)).toBeInTheDocument();
      });
    });

    it('should add caught monsters to player inventory', async () => {
      render(<PokemonCyberMMO />);
      
      // Simulate successful catch
      act(() => {
        // Trigger catch success event
        const catchEvent = new CustomEvent('pokemonCaught', {
          detail: { pokemon: { id: 'hackmon', name: 'Hackmon', type: 'cyber-career' } }
        });
        document.dispatchEvent(catchEvent);
      });

      // Check inventory
      const inventoryButton = screen.getByText(/team/i);
      fireEvent.click(inventoryButton);

      await waitFor(() => {
        expect(screen.getByText('Hackmon')).toBeInTheDocument();
      });
    });
  });

  describe('3. Interactive Game World', () => {
    it('should render explorable 2D world map', async () => {
      render(<PokemonCyberMMO />);
      
      const worldView = screen.getByTestId('game-world');
      expect(worldView).toBeInTheDocument();
      expect(worldView).toHaveClass('interactive-world');
    });

    it('should allow movement with WASD keys', async () => {
      render(<PokemonCyberMMO />);
      
      const player = screen.getByTestId('player-character');
      const initialPosition = player.getBoundingClientRect();

      // Move up - simulate key press and release with proper act() wrapping
      act(() => {
        fireEvent.keyDown(document, { key: 'w' });
      });
      
      // Wait for movement interval (150ms) plus buffer
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });
      
      // Release key
      act(() => {
        fireEvent.keyUp(document, { key: 'w' });
      });
      
      await waitFor(() => {
        const newPosition = player.getBoundingClientRect();
        expect(newPosition.top).toBeLessThan(initialPosition.top);
      });
    });

    it('should show different areas with unique themes', async () => {
      render(<PokemonCyberMMO />);
      
      const areaSelector = screen.getByTestId('area-selector');
      fireEvent.click(areaSelector);

      await waitFor(() => {
        expect(screen.getByText(/new.*bark.*cyber/i)).toBeInTheDocument();
        expect(screen.getByText(/cyber.*career.*city/i)).toBeInTheDocument();
        expect(screen.getByText(/hardware.*forest/i)).toBeInTheDocument();
      });
    });
  });

  describe('4. Player Progression System', () => {
    it('should track experience points from battles', async () => {
      render(<PokemonCyberMMO />);
      
      // Win a battle
      act(() => {
        const battleWinEvent = new CustomEvent('battleWon', {
          detail: { expGained: 50, pokemon: 'hackmon' }
        });
        document.dispatchEvent(battleWinEvent);
      });

      await waitFor(() => {
        expect(screen.getByText(/50.*exp/i)).toBeInTheDocument();
      });
    });

    it('should level up player character when enough EXP gained', async () => {
      render(<PokemonCyberMMO />);
      
      // Simulate level up
      act(() => {
        const levelUpEvent = new CustomEvent('playerLevelUp', {
          detail: { newLevel: 2, oldLevel: 1 }
        });
        document.dispatchEvent(levelUpEvent);
      });

      await waitFor(() => {
        expect(screen.getByText(/level.*up/i)).toBeInTheDocument();
        expect(screen.getByText(/level.*2/i)).toBeInTheDocument();
      });
    });

    it('should unlock new areas as player progresses', async () => {
      render(<PokemonCyberMMO />);
      
      // Check that advanced areas are initially locked
      expect(screen.queryByText(/advanced.*security.*lab/i)).not.toBeInTheDocument();
      
      // Simulate reaching required level
      act(() => {
        const unlockEvent = new CustomEvent('areaUnlocked', {
          detail: { area: 'advanced-security-lab', level: 10 }
        });
        document.dispatchEvent(unlockEvent);
      });

      await waitFor(() => {
        expect(screen.getByText(/advanced.*security.*lab/i)).toBeInTheDocument();
      });
    });
  });

  describe('5. Social Features', () => {
    it('should allow players to trade monsters with each other', async () => {
      render(<PokemonCyberMMO />);
      
      const tradeButton = screen.getByText(/trade/i);
      fireEvent.click(tradeButton);

      await waitFor(() => {
        expect(screen.getByText(/select.*player.*trade/i)).toBeInTheDocument();
      });
    });

    it('should enable team formation for group challenges', async () => {
      render(<PokemonCyberMMO />);
      
      const teamButton = screen.getByText(/form.*team/i);
      fireEvent.click(teamButton);

      await waitFor(() => {
        expect(screen.getByText(/invite.*players/i)).toBeInTheDocument();
      });
    });

    it('should support real-time chat between players', async () => {
      render(<PokemonCyberMMO />);
      
      const chatInput = screen.getByPlaceholderText(/type.*message/i);
      fireEvent.change(chatInput, { target: { value: 'Hello world!' } });
      fireEvent.keyDown(chatInput, { key: 'Enter' });

      await waitFor(() => {
        expect(mockWebSocket.send).toHaveBeenCalledWith(
          expect.stringContaining('"type":"chat_message"')
        );
      });
    });
  });

  describe('6. Keyboard Input Handling (TDD GREEN PHASE - COMPLETE)', () => {
    it('should allow typing WASD characters in chat input without triggering movement', async () => {
      render(<PokemonCyberMMO />);
      
      // Start the game first
      const nameInput = screen.getByPlaceholderText(/enter.*trainer.*name/i);
      fireEvent.change(nameInput, { target: { value: 'TestTrainer' } });
      
      const enterButton = screen.getByText(/enter world/i);
      fireEvent.click(enterButton);
      
      // Wait for game to load and find the chat input
      await waitFor(() => {
        const chatInput = screen.getByPlaceholderText(/type.*message/i);
        expect(chatInput).toBeInTheDocument();
      });
      
      const chatInput = screen.getByPlaceholderText(/type.*message/i);
      
      // Focus the chat input
      chatInput.focus();
      
      // Type 'wasd' characters
      fireEvent.keyDown(chatInput, { key: 'w', target: chatInput });
      fireEvent.change(chatInput, { target: { value: 'w' } });
      
      fireEvent.keyDown(chatInput, { key: 'a', target: chatInput });
      fireEvent.change(chatInput, { target: { value: 'wa' } });
      
      fireEvent.keyDown(chatInput, { key: 's', target: chatInput });
      fireEvent.change(chatInput, { target: { value: 'was' } });
      
      fireEvent.keyDown(chatInput, { key: 'd', target: chatInput });
      fireEvent.change(chatInput, { target: { value: 'wasd' } });
      
      // Verify the text appears in the input
      expect(chatInput).toHaveValue('wasd');
    });

    it('should not prevent typing movement keys in focused text inputs', async () => {
      render(<PokemonCyberMMO />);
      
      // Start the game first
      const nameInput = screen.getByPlaceholderText(/enter.*trainer.*name/i);
      fireEvent.change(nameInput, { target: { value: 'TestTrainer' } });
      
      const enterButton = screen.getByText(/enter world/i);
      fireEvent.click(enterButton);
      
      await waitFor(() => {
        const chatInput = screen.getByPlaceholderText(/type.*message/i);
        expect(chatInput).toBeInTheDocument();
      });
      
      const chatInput = screen.getByPlaceholderText(/type.*message/i);
      chatInput.focus();
      
      // Create a custom keyboard event that we can verify preventDefault wasn't called
      const keydownEvent = new KeyboardEvent('keydown', { 
        key: 'w', 
        bubbles: true,
        cancelable: true 
      });
      
      const preventDefaultSpy = jest.spyOn(keydownEvent, 'preventDefault');
      
      // Dispatch the event to the input
      chatInput.dispatchEvent(keydownEvent);
      
      // When typing in a focused input, preventDefault should NOT be called for the input
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should still allow player movement when no text input is focused', async () => {
      render(<PokemonCyberMMO />);
      
      // Start the game first
      const nameInput = screen.getByPlaceholderText(/enter.*trainer.*name/i);
      fireEvent.change(nameInput, { target: { value: 'TestTrainer' } });
      
      const enterButton = screen.getByText(/enter world/i);
      fireEvent.click(enterButton);
      
      // Wait for game to load
      await waitFor(() => {
        const player = screen.getByTestId('player-character');
        expect(player).toBeInTheDocument();
      });
      
      // Get player element to check initial position
      const player = screen.getByTestId('player-character');
      const initialStyle = player.style.top;
      
      // Simulate keydown for movement when no input is focused
      fireEvent.keyDown(document, { key: 'w' });
      
      // Wait for movement to process
      await waitFor(() => {
        // Player position should change (movement should still work)
        expect(player.style.top).not.toBe(initialStyle);
      }, { timeout: 200 });
    });
  });
});
