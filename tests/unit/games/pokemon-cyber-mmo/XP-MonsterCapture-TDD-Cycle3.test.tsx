/**
 * 🔴 TDD CYCLE 3: XP Earning & Monster Capture System (RED PHASE)
 * Test Guardian Agent Implementation - Following test_guardian.prompt.md
 * 
 * FOCUS: Comprehensive testing of XP earning from battles and monster capture mechanics with pokeballs
 * 
 * RED-GREEN-REFACTOR Methodology:
 * 1. 🔴 RED: Write failing tests that describe desired XP/capture behavior
 * 2. 🟢 GREEN: Write minimal code to make tests pass
 * 3. 🔵 REFACTOR: Improve code quality while keeping tests green
 * 
 * Current Status: 🔴 RED PHASE - Writing failing tests for untested XP/capture features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PokemonCyberMMO from '../../../../src/app/games/pokemon-cyber-mmo/PokemonCyberMMO';

// Mock the CyberSecurityQuestions module
jest.mock('../../../../src/app/games/pokemon-cyber-mmo/data/CyberSecurityQuestions', () => ({
  CyberSecurityQuestions: {
    getOptimalQuestion: jest.fn(),
    createBattleSession: jest.fn(() => ({ sessionId: 'test-session-123' })),
    getQuestionForBattleSession: jest.fn()
  }
}));

describe('🔴 TDD CYCLE 3 - XP Earning & Monster Capture System (RED PHASE)', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the CyberSecurityQuestions functions with proper return values
    const { CyberSecurityQuestions } = require('../../../../src/app/games/pokemon-cyber-mmo/data/CyberSecurityQuestions');
    
    CyberSecurityQuestions.getOptimalQuestion.mockReturnValue({
      question: 'What is the primary purpose of encryption?',
      options: ['Security', 'Speed', 'Storage', 'Simplicity'],
      correctAnswer: 0,
      category: 'cryptography',
      difficulty: 'beginner',
      explanation: 'Encryption provides security by protecting data confidentiality.',
      damageMultiplier: 1.0
    });
    
    CyberSecurityQuestions.createBattleSession.mockReturnValue({ sessionId: 'test-session-123' });
    CyberSecurityQuestions.getQuestionForBattleSession.mockReturnValue({
      question: 'Test battle question?',
      options: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
      correctAnswer: 0,
      category: 'network-security',
      difficulty: 'beginner'
    });
  });

  describe('💰 XP Earning from Battle Victories', () => {
    it('🔴 should dispatch battleWon event when player wins a battle', async () => {
      render(<PokemonCyberMMO />);
      
      // Mock battleWon event listener to capture dispatched events
      const mockEventListener = jest.fn();
      document.addEventListener('battleWon', mockEventListener);
      
      // Start battle with wild monster
      const startBattleButton = screen.getByTestId('start-battle');
      fireEvent.click(startBattleButton);
      
      // Wait for battle to start and question to appear
      await waitFor(() => {
        expect(screen.getByText(/What is the primary purpose of encryption/)).toBeInTheDocument();
      });
      
      // Answer correctly to win battle
      const correctAnswer = screen.getByText('Security');
      fireEvent.click(correctAnswer);
      
      // Wait for battle resolution and check if battleWon event was dispatched
      await waitFor(() => {
        expect(mockEventListener).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'battleWon',
            detail: expect.objectContaining({
              expGained: expect.any(Number),
              pokemon: expect.any(String)
            })
          })
        );
      }, { timeout: 5000 });
      
      document.removeEventListener('battleWon', mockEventListener);
    });

    it('🔴 should calculate XP based on opponent level and difficulty', async () => {
      render(<PokemonCyberMMO />);
      
      const mockEventListener = jest.fn();
      document.addEventListener('battleWon', mockEventListener);
      
      // Battle a Level 3 opponent (should give more XP than Level 1)
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByText(/What is the primary purpose of encryption/)).toBeInTheDocument();
      });
      
      // Win the battle
      fireEvent.click(screen.getByText('Security'));
      
      await waitFor(() => {
        expect(mockEventListener).toHaveBeenCalled();
        const event = mockEventListener.mock.calls[0][0];
        
        // XP should be calculated: baseXP (20) + (opponentLevel * 10) + difficultyBonus
        // For Level 3 opponent: 20 + (3 * 10) + bonus = at least 50 XP
        expect(event.detail.expGained).toBeGreaterThan(40);
      });
      
      document.removeEventListener('battleWon', mockEventListener);
    });

    it('🔴 should display XP gained notification after battle victory', async () => {
      render(<PokemonCyberMMO />);
      
      // Manually dispatch battleWon event to test XP display
      act(() => {
        const battleWonEvent = new CustomEvent('battleWon', {
          detail: { expGained: 75, pokemon: 'hackmon' }
        });
        document.dispatchEvent(battleWonEvent);
      });

      // Should display XP notification
      await waitFor(() => {
        expect(screen.getByText(/75.*exp/i)).toBeInTheDocument();
      });
    });

    it('🔴 should accumulate total player XP from multiple battles', async () => {
      render(<PokemonCyberMMO />);
      
      // Check initial XP is 0
      expect(screen.getByText(/Total EXP:\s*0/)).toBeInTheDocument();
      
      // Win first battle
      act(() => {
        const battleWonEvent1 = new CustomEvent('battleWon', {
          detail: { expGained: 50, pokemon: 'hackmon' }
        });
        document.dispatchEvent(battleWonEvent1);
      });

      await waitFor(() => {
        expect(screen.getByText(/Total EXP:\s*50/)).toBeInTheDocument();
      });
      
      // Win second battle
      act(() => {
        const battleWonEvent2 = new CustomEvent('battleWon', {
          detail: { expGained: 30, pokemon: 'phishmon' }
        });
        document.dispatchEvent(battleWonEvent2);
      });

      await waitFor(() => {
        expect(screen.getByText(/Total EXP:\s*80/)).toBeInTheDocument();
      });
    });

    it('🔴 should trigger level up when XP threshold is reached', async () => {
      render(<PokemonCyberMMO />);
      
      const mockLevelUpListener = jest.fn();
      document.addEventListener('playerLevelUp', mockLevelUpListener);
      
      // Gain enough XP to level up (assuming 100 XP per level)
      act(() => {
        const battleWonEvent = new CustomEvent('battleWon', {
          detail: { expGained: 120, pokemon: 'hackmon' }
        });
        document.dispatchEvent(battleWonEvent);
      });

      // Should trigger playerLevelUp event
      await waitFor(() => {
        expect(mockLevelUpListener).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'playerLevelUp',
            detail: expect.objectContaining({
              newLevel: 2,
              oldLevel: 1
            })
          })
        );
      });
      
      document.removeEventListener('playerLevelUp', mockLevelUpListener);
    });
  });

  describe('🥎 Monster Capture with Pokeballs', () => {
    it('🔴 should show throw ball option during wild monster encounters', async () => {
      render(<PokemonCyberMMO />);
      
      // Start battle with wild monster
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByText(/What is the primary purpose of encryption/)).toBeInTheDocument();
      });
      
      // Should show option to throw cyber ball
      expect(screen.getByTestId('throw-cyber-ball')).toBeInTheDocument();
    });

    it('🔴 should calculate catch probability based on ball type and monster level', async () => {
      render(<PokemonCyberMMO />);
      
      // Mock Math.random for predictable catch results
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.3); // 30% - should catch with Ultra Cyber Ball
      
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByTestId('throw-cyber-ball')).toBeInTheDocument();
      });
      
      // Select Ultra Cyber Ball (better catch rate)
      const ultraBallOption = screen.getByText(/ultra.*cyber.*ball/i);
      fireEvent.click(ultraBallOption);
      
      // Should show catch attempt with success probability
      await waitFor(() => {
        expect(screen.getByText(/catch.*attempt/i)).toBeInTheDocument();
      });
      
      Math.random = originalRandom;
    });

    it('🔴 should add caught monsters to player inventory', async () => {
      render(<PokemonCyberMMO />);
      
      // Mock successful catch
      const mockCaughtListener = jest.fn();
      document.addEventListener('pokemonCaught', mockCaughtListener);
      
      // Simulate successful monster catch
      act(() => {
        const pokemonCaughtEvent = new CustomEvent('pokemonCaught', {
          detail: { 
            pokemon: 'hackmon', 
            level: 5, 
            ballUsed: 'cyber-ball',
            location: 'Starter Town'
          }
        });
        document.dispatchEvent(pokemonCaughtEvent);
      });

      // Should update inventory count
      await waitFor(() => {
        expect(mockCaughtListener).toHaveBeenCalled();
        // Verify inventory shows the caught monster
        expect(screen.getByText(/caught.*hackmon/i)).toBeInTheDocument();
      });
      
      document.removeEventListener('pokemonCaught', mockCaughtListener);
    });

    it('🔴 should consume pokeball from inventory when thrown', async () => {
      render(<PokemonCyberMMO />);
      
      // Check initial pokeball count (should start with some)
      const initialBallCount = screen.getByTestId('cyber-ball-count');
      const initialCount = parseInt(initialBallCount.textContent || '0');
      
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByTestId('throw-cyber-ball')).toBeInTheDocument();
      });
      
      // Throw a cyber ball
      fireEvent.click(screen.getByTestId('throw-cyber-ball'));
      
      // Ball count should decrease by 1
      await waitFor(() => {
        const newBallCount = parseInt(screen.getByTestId('cyber-ball-count').textContent || '0');
        expect(newBallCount).toBe(initialCount - 1);
      });
    });

    it('🔴 should show different ball types with varying effectiveness', async () => {
      render(<PokemonCyberMMO />);
      
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByTestId('throw-cyber-ball')).toBeInTheDocument();
      });
      
      // Should show all ball types
      expect(screen.getByText(/cyber.*ball/i)).toBeInTheDocument();      // 1.0x catch rate
      expect(screen.getByText(/ultra.*cyber.*ball/i)).toBeInTheDocument(); // 1.5x catch rate  
      expect(screen.getByText(/master.*cyber.*ball/i)).toBeInTheDocument(); // 100.0x catch rate (guaranteed)
    });

    it('🔴 should show catch success/failure animation and message', async () => {
      render(<PokemonCyberMMO />);
      
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByTestId('throw-cyber-ball')).toBeInTheDocument();
      });
      
      // Mock failed catch attempt
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.9); // 90% - should fail with regular cyber ball
      
      fireEvent.click(screen.getByTestId('throw-cyber-ball'));
      
      // Should show catch attempt result
      await waitFor(() => {
        expect(screen.getByText(/broke.*free|catch.*failed/i)).toBeInTheDocument();
      });
      
      Math.random = originalRandom;
    });
  });

  describe('🔄 Battle-to-Capture Flow Integration', () => {
    it('🔴 should allow switching between battle and capture modes', async () => {
      render(<PokemonCyberMMO />);
      
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByText(/What is the primary purpose of encryption/)).toBeInTheDocument();
      });
      
      // Should show both battle options (answer questions) and capture options (throw balls)
      expect(screen.getByText('Security')).toBeInTheDocument(); // Answer option
      expect(screen.getByTestId('throw-cyber-ball')).toBeInTheDocument(); // Capture option
    });

    it('🔴 should end battle when monster is successfully caught', async () => {
      render(<PokemonCyberMMO />);
      
      fireEvent.click(screen.getByTestId('start-battle'));
      
      await waitFor(() => {
        expect(screen.getByTestId('throw-cyber-ball')).toBeInTheDocument();
      });
      
      // Mock guaranteed catch with Master Cyber Ball
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.1); // Guaranteed catch
      
      const masterBall = screen.getByText(/master.*cyber.*ball/i);
      fireEvent.click(masterBall);
      
      // Battle should end with successful catch
      await waitFor(() => {
        expect(screen.getByText(/successfully.*caught|monster.*captured/i)).toBeInTheDocument();
      });
      
      Math.random = originalRandom;
    });

    it('🔴 should award XP for successful monster captures', async () => {
      render(<PokemonCyberMMO />);
      
      const mockEventListener = jest.fn();
      document.addEventListener('battleWon', mockEventListener);
      
      // Simulate successful capture (should trigger battleWon with capture bonus XP)
      act(() => {
        const captureEvent = new CustomEvent('pokemonCaught', {
          detail: { 
            pokemon: 'hackmon', 
            level: 5, 
            ballUsed: 'cyber-ball',
            expBonus: 25 // Capture bonus XP
          }
        });
        document.dispatchEvent(captureEvent);
      });

      // Should also dispatch battleWon with capture XP bonus
      await waitFor(() => {
        expect(mockEventListener).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'battleWon',
            detail: expect.objectContaining({
              expGained: expect.any(Number),
              captureBonus: true
            })
          })
        );
      });
      
      document.removeEventListener('battleWon', mockEventListener);
    });
  });

  describe('🏆 Advanced XP and Progression Features', () => {
    it('🔴 should provide XP multipliers for consecutive victories', async () => {
      render(<PokemonCyberMMO />);
      
      const mockEventListener = jest.fn();
      document.addEventListener('battleWon', mockEventListener);
      
      // Win multiple battles in succession
      for (let i = 1; i <= 3; i++) {
        act(() => {
          const battleWonEvent = new CustomEvent('battleWon', {
            detail: { 
              expGained: 50, 
              pokemon: `hackmon${i}`,
              winStreak: i
            }
          });
          document.dispatchEvent(battleWonEvent);
        });
      }

      // Third win should have streak multiplier
      await waitFor(() => {
        const calls = mockEventListener.mock.calls;
        const thirdWin = calls[2][0];
        expect(thirdWin.detail.winStreak).toBe(3);
        // XP should be multiplied by streak (50 * 1.5 for 3-win streak = 75)
        expect(thirdWin.detail.expGained).toBeGreaterThan(65);
      });
      
      document.removeEventListener('battleWon', mockEventListener);
    });

    it('🔴 should track and display battle statistics', async () => {
      render(<PokemonCyberMMO />);
      
      // Should show battle stats
      expect(screen.getByTestId('battle-stats')).toBeInTheDocument();
      expect(screen.getByText(/battles.*won/i)).toBeInTheDocument();
      expect(screen.getByText(/monsters.*caught/i)).toBeInTheDocument();
      expect(screen.getByText(/win.*rate/i)).toBeInTheDocument();
    });

    it('🔴 should unlock new areas based on XP and level progression', async () => {
      render(<PokemonCyberMMO />);
      
      // Initial areas should be limited
      const areaButtons = screen.getAllByRole('button');
      const initialAreas = areaButtons.filter(btn => btn.textContent?.includes('Town') || btn.textContent?.includes('City'));
      
      // Level up to unlock new areas
      act(() => {
        const levelUpEvent = new CustomEvent('playerLevelUp', {
          detail: { newLevel: 5, oldLevel: 4, areasUnlocked: ['Hardware Forest'] }
        });
        document.dispatchEvent(levelUpEvent);
      });

      await waitFor(() => {
        expect(screen.getByText(/hardware.*forest.*unlocked/i)).toBeInTheDocument();
      });
    });
  });
});
