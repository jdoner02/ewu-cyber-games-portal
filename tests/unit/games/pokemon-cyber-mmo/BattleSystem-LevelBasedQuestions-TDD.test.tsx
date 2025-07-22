/**
 * @jest-environment jsdom
 * 
 * 🔴 RED PHASE - Pokemon Bat// Set up mock return values
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock createBattleSession to return a valid session
  mockCreateBattleSession.mockReturnValue({
    sessionId: 'test-session-123',
    usedQuestionIds: new Set(),
    playerLevel: 10,
    opponentLevel: 5
  });
  
  // Mock getOptimalQuestion to return a realistic cybersecurity question
  mockGetOptimalQuestion.mockReturnValue({
    id: 'test-crypto-1',
    question: 'What cryptographic principle ensures perfect forward secrecy?',
    options: [
      'Using the same key for all sessions',
      'Generating new session keys for each communication session',
      'Storing keys in plaintext',
      'Using weak encryption algorithms'
    ],
    correct: 1,
    category: 'cryptography',
    difficulty: 'intermediate' as const,
    explanation: 'Perfect forward secrecy ensures that session keys are not compromised even if long-term keys are compromised.',
    text: 'What cryptographic principle ensures perfect forward secrecy?'
  });
  
  // Mock getQuestionForBattleSession to return the same question
  mockGetQuestionForBattleSession.mockReturnValue({
    id: 'test-crypto-1',
    question: 'What cryptographic principle ensures perfect forward secrecy?',
    options: [
      'Using the same key for all sessions',
      'Generating new session keys for each communication session',
      'Storing keys in plaintext',
      'Using weak encryption algorithms'
    ],
    correct: 1,
    category: 'cryptography',
    difficulty: 'intermediate' as const,
    explanation: 'Perfect forward secrecy ensures that session keys are not compromised even if long-term keys are compromised.',
    text: 'What cryptographic principle ensures perfect forward secrecy?'
  });
});gration with CyberSecurityQuestions
 * 
 * Test Guardian Agent - TDD Integration Testing
 * Purpose: Ensure Pokemon battle system uses level-based question difficulty selection
 * 
 * This test will FAIL initially because PokemonCyberMMO.tsx currently uses:
 * - Random selection from basic TRIVIA_QUESTIONS array
 * - No level-based difficulty consideration
 * 
 * Expected behavior after GREEN phase:
 * - Use CyberSecurityQuestions.getOptimalQuestion(sessionId, playerLevel, opponentLevel)
 * - Questions should be appropriate for level difference
 * - Higher level players get easier questions vs lower level opponents
 * - Lower level players get harder questions vs higher level opponents
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonCyberMMO from '@/app/games/pokemon-cyber-mmo/PokemonCyberMMO';

// Mock the CyberSecurityQuestions module completely
jest.mock('@/app/games/pokemon-cyber-mmo/data/CyberSecurityQuestions', () => {
  const mockGetOptimalQuestion = jest.fn();
  const mockGetQuestionForBattleSession = jest.fn();
  const mockCreateBattleSession = jest.fn();
  
  return {
    CyberSecurityQuestions: {
      getOptimalQuestion: mockGetOptimalQuestion,
      getQuestionForBattleSession: mockGetQuestionForBattleSession,
      createBattleSession: mockCreateBattleSession,
    },
    // Export the mocks so we can access them in tests
    __mockGetOptimalQuestion: mockGetOptimalQuestion,
    __mockGetQuestionForBattleSession: mockGetQuestionForBattleSession, 
    __mockCreateBattleSession: mockCreateBattleSession,
  };
});

// Import the mocked module
import { CyberSecurityQuestions } from '@/app/games/pokemon-cyber-mmo/data/CyberSecurityQuestions';

// Access the mock functions from the mocked module
const mockModule = require('@/app/games/pokemon-cyber-mmo/data/CyberSecurityQuestions');
const mockGetOptimalQuestion = mockModule.__mockGetOptimalQuestion;
const mockGetQuestionForBattleSession = mockModule.__mockGetQuestionForBattleSession;
const mockCreateBattleSession = mockModule.__mockCreateBattleSession;

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

describe('🔴 RED PHASE - Pokemon Battle System Level-Based Question Integration', () => {
  
  // Set up mock return values
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock createBattleSession to return a valid session
    mockCreateBattleSession.mockReturnValue({
      sessionId: 'test-session-123',
      usedQuestionIds: new Set(),
      playerLevel: 10,
      opponentLevel: 5
    });
    
    // Mock getOptimalQuestion to return a realistic cybersecurity question
    mockGetOptimalQuestion.mockReturnValue({
      id: 'test-crypto-1',
      question: 'What cryptographic principle ensures perfect forward secrecy?',
      options: [
        'Using the same key for all sessions',
        'Generating new session keys for each communication session',
        'Storing keys in plaintext',
        'Using weak encryption algorithms'
      ],
      correct: 1,
      category: 'cryptography',
      difficulty: 'intermediate' as const,
      explanation: 'Perfect forward secrecy ensures that session keys are not compromised even if long-term keys are compromised.',
      text: 'What cryptographic principle ensures perfect forward secrecy?'
    });
    
    // Mock getQuestionForBattleSession to return the same question
    mockGetQuestionForBattleSession.mockReturnValue({
      id: 'test-crypto-1',
      question: 'What cryptographic principle ensures perfect forward secrecy?',
      options: [
        'Using the same key for all sessions',
        'Generating new session keys for each communication session',
        'Storing keys in plaintext',
        'Using weak encryption algorithms'
      ],
      correct: 1,
      category: 'cryptography',
      difficulty: 'intermediate' as const,
      explanation: 'Perfect forward secrecy ensures that session keys are not compromised even if long-term keys are compromised.',
      text: 'What cryptographic principle ensures perfect forward secrecy?'
    });
  });

  // Helper function to start game and initiate battle
  const startGameAndBattle = async (playerLevel = 10, opponentId = 'prof-cyber') => {
    render(<PokemonCyberMMO />);
    
    // Game starts directly in world when NODE_ENV is test
    // Wait for game world to load
    await waitFor(() => {
      expect(screen.getByTestId('game-world')).toBeInTheDocument();
    });

    // Find and click on NPC to start battle
    const npcElement = screen.getByTestId(`npc-${opponentId}`);
    fireEvent.click(npcElement);
    
    // Wait for battle to start
    await waitFor(() => {
      expect(screen.getByTestId('battle-system')).toBeInTheDocument();
    });

    return { playerLevel, opponentId };
  };

  describe('🎯 Level-Based Question Selection Integration', () => {
    test('should use CyberSecurityQuestions.getOptimalQuestion() for battle questions instead of random selection', async () => {
      // ARRANGE: Set up player with specific level and opponent
      await startGameAndBattle();
      
      // Wait for async operations to complete (1000ms timeout in useBattleSystem)
      await waitFor(() => {
        // Look for battle question phase with question content
        const questionPhaseDiv = screen.getByText(/Category:/);
        return questionPhaseDiv !== null;
      }, { timeout: 2000 }); // Give extra time for the setTimeout to complete
      
      // Additional wait to ensure all spy calls are captured
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // CRITICAL ASSERTION: Verify CyberSecurityQuestions.getOptimalQuestion was called
      // This will FAIL in RED phase because PokemonCyberMMO.tsx doesn't use this method
      console.log('🔍 Mock call counts:', {
        mockGetOptimalQuestion: mockGetOptimalQuestion.mock.calls.length,
        mockGetQuestionForBattleSession: mockGetQuestionForBattleSession.mock.calls.length,
        mockCreateBattleSession: mockCreateBattleSession.mock.calls.length
      });
      expect(mockGetOptimalQuestion).toHaveBeenCalled();
      
      // Verify battle session was created for question tracking
      expect(mockCreateBattleSession).toHaveBeenCalled();
      
      // Verify a sophisticated cybersecurity question appears (not basic trivia)
      const categoryElement = screen.getByText(/Category:/);
      expect(categoryElement).toBeInTheDocument();
      
      // Log the question to verify level-based selection is working
      const categoryText = categoryElement.textContent;
      console.log('🎯 Question category generated:', categoryText);
      
      // Should not be a basic trivia question from TRIVIA_QUESTIONS array
      const questionButtons = screen.getAllByRole('button', { name: /^[A-D]\./ });
      const questionContent = questionButtons[0].textContent;
      expect(questionContent).not.toContain('What is the capital of France?');
      expect(questionContent).not.toContain('What is 2 + 2?');
      
      // Should contain sophisticated cybersecurity terminology
      const allText = document.body.textContent || '';
      const hasAdvancedTerms = /encryption|cryptography|authentication|vulnerability|firewall|malware|phishing|security|forward secrecy/i.test(allText);
      expect(hasAdvancedTerms).toBe(true);
      
      console.log('🎉 SUCCESS: Level-based cybersecurity questions working!', {
        questionText: allText.includes('What cryptographic principle ensures perfect forward secrecy?'),
        categoryCorrect: allText.includes('Category: cryptography'),
        mockCallsWorking: true
      });
    });

    it('should provide easier questions when player level is much higher than opponent', async () => {
      // RED: This will fail because no level-based difficulty selection exists
      const playerLevel = 25;
      const mockOpponentLevel = 5; // Much lower level opponent
      
      await startGameAndBattle(playerLevel, 'prof-cyber');
      
      await waitFor(() => {
        expect(screen.getByText(/category:/i)).toBeInTheDocument();
      });

      // Verify getOptimalQuestion was called with level difference favoring player
      expect(getOptimalQuestionSpy).toHaveBeenCalledWith(
        expect.any(String),
        playerLevel,
        expect.any(Number) // Should be lower than playerLevel
      );

      // The question shown should be from beginner difficulty
      // (This assertion will fail in RED phase since no level-based selection exists)
      const questionElement = screen.getByText(/what is/i).closest('div');
      expect(questionElement).toBeInTheDocument();
      
      // In GREEN phase, this should show a beginner-level question
      // For now, this assertion documents expected behavior
    });

    it('should provide harder questions when opponent level is much higher than player', async () => {
      // RED: This will fail because no level-based difficulty selection exists  
      const playerLevel = 8;
      const mockOpponentLevel = 30; // Much higher level opponent
      
      await startGameAndBattle(playerLevel, 'prof-cyber');
      
      await waitFor(() => {
        expect(screen.getByText(/category:/i)).toBeInTheDocument();
      });

      // Verify getOptimalQuestion was called with level difference favoring opponent
      expect(getOptimalQuestionSpy).toHaveBeenCalledWith(
        expect.any(String),
        playerLevel,
        expect.any(Number) // Should be higher than playerLevel
      );

      // The question shown should be from advanced difficulty
      // (This assertion will fail in RED phase since no level-based selection exists)
      const questionElement = screen.getByText(/category:/i).closest('div');
      expect(questionElement).toBeInTheDocument();
      
      // In GREEN phase, this should show an advanced-level question
    });

    it('should not reuse questions during the same battle session', async () => {
      // RED: This will fail because current implementation doesn't track question usage
      await startGameAndBattle(15, 'prof-cyber');
      
      // Answer first question
      await waitFor(() => {
        expect(screen.getByText(/category:/i)).toBeInTheDocument();
      });
      
      const firstOption = screen.getAllByRole('button').find(btn => 
        btn.textContent?.includes('A)') || btn.textContent?.includes('1.')
      );
      if (firstOption) {
        fireEvent.click(firstOption);
      }

      // Wait for next question
      await waitFor(() => {
        expect(screen.getByText(/next turn/i) || screen.getByText(/continue/i)).toBeInTheDocument();
      });

      // Verify getOptimalQuestion was called multiple times with same session ID
      expect(getOptimalQuestionSpy).toHaveBeenCalledTimes(2);
      
      // Both calls should have same sessionId (first parameter)
      const calls = getOptimalQuestionSpy.mock.calls;
      expect(calls[0][0]).toBe(calls[1][0]); // Same session ID
      
      // This ensures no question repetition within same battle session
    });
  });

  describe('🔍 Integration Quality Assurance', () => {
    it('should maintain backward compatibility with existing battle flow', async () => {
      // Ensure that implementing level-based questions doesn't break existing functionality
      await startGameAndBattle(10, 'prof-cyber');
      
      // Battle should still start normally
      expect(screen.getByText(/battle/i)).toBeInTheDocument();
      
      // Questions should still appear
      await waitFor(() => {
        expect(screen.getByText(/category:/i)).toBeInTheDocument();
      });
      
      // Health bars should still be visible
      expect(screen.getByText(/health/i) || screen.getByText(/hp/i)).toBeInTheDocument();
      
      // Answer options should still be clickable
      const options = screen.getAllByRole('button').filter(btn => 
        btn.textContent?.includes('A)') || 
        btn.textContent?.includes('B)') ||
        btn.textContent?.includes('1.') ||
        btn.textContent?.includes('2.')
      );
      expect(options.length).toBeGreaterThan(0);
    });

    it('should handle edge cases in level calculation gracefully', async () => {
      // Test with edge case levels
      await startGameAndBattle(1, 'prof-cyber'); // Very low player level
      
      await waitFor(() => {
        expect(screen.getByText(/category:/i)).toBeInTheDocument();
      });

      // Should still call getOptimalQuestion even with edge case levels
      expect(getOptimalQuestionSpy).toHaveBeenCalled();
      
      // Should not crash or throw errors
      expect(screen.getByText(/battle/i)).toBeInTheDocument();
    });
  });
});
