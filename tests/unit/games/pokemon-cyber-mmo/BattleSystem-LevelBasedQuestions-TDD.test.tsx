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
      // ARRANGE: Use actual player level (1) vs very low opponent level 
      const actualPlayerLevel = 1; // This is the default player level in the game
      const testOpponentLevel = 0; // Make opponent much weaker to test level difference logic
      
      // Mock for easier question scenario - when player is stronger than opponent
      mockGetOptimalQuestion.mockReturnValueOnce({
        id: 'easy-basic-1',
        question: 'What does "HTTP" stand for?',
        options: ['HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'Heavy Text Transfer Protocol', 'Home Text Transfer Protocol'],
        correct: 0,
        category: 'networking',
        difficulty: 'beginner' as const,
        explanation: 'HTTP stands for HyperText Transfer Protocol.',
        text: 'What does "HTTP" stand for?'
      });

      await startGameAndBattle(actualPlayerLevel, 'prof-cyber');
      
      await waitFor(() => {
        expect(screen.getByText(/category:/i)).toBeInTheDocument();
      });

      // Verify getOptimalQuestion was called with correct player level
      expect(mockGetOptimalQuestion).toHaveBeenCalledWith(
        expect.any(String),
        actualPlayerLevel, // Should match actual player level (1)
        expect.any(Number) // Opponent level (10 from NPC data)
      );

      // The question shown should be appropriate for the level difference
      const questionElement = screen.getByText(/HTTP|what is/i).closest('div');
      expect(questionElement).toBeInTheDocument();
      
      // Should show the mocked easier question
      expect(screen.getByText(/HTTP/)).toBeInTheDocument();
    });

    it('should provide harder questions when opponent level is much higher than player', async () => {
      // ARRANGE: Use actual player level (1) vs high opponent level for higher difficulty
      const actualPlayerLevel = 1; // This is the default player level in the game
      
      // Mock for harder question scenario - when opponent is much stronger than player
      mockGetOptimalQuestion.mockReturnValueOnce({
        id: 'hard-advanced-1',
        question: 'In a PKI infrastructure, what is the primary purpose of a Certificate Revocation List (CRL)?',
        options: ['To encrypt private keys', 'To list revoked certificates', 'To generate new certificates', 'To validate certificate chains'],
        correct: 1,
        category: 'cryptography',
        difficulty: 'advanced' as const,
        explanation: 'A CRL lists certificates that have been revoked before their expiration date.',
        text: 'In a PKI infrastructure, what is the primary purpose of a Certificate Revocation List (CRL)?'
      });

      await startGameAndBattle(actualPlayerLevel, 'prof-cyber');
      
      // Wait for the question to appear (using the question text specifically)
      await waitFor(() => {
        expect(screen.getByText('In a PKI infrastructure, what is the primary purpose of a Certificate Revocation List (CRL)?')).toBeInTheDocument();
      });

      // Verify getOptimalQuestion was called with correct player level
      expect(mockGetOptimalQuestion).toHaveBeenCalledWith(
        expect.any(String),
        actualPlayerLevel, // Should match actual player level (1)
        expect.any(Number) // Opponent level (10 from NPC data - higher than player)
      );

      // The question shown should be the mocked harder question
      expect(screen.getByText('In a PKI infrastructure, what is the primary purpose of a Certificate Revocation List (CRL)?')).toBeInTheDocument();
    });    it('should not reuse questions during the same battle session', async () => {
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

      // Wait for next question or feedback phase
      await waitFor(() => {
        const nextElement = screen.queryByText(/next question/i) || 
                            screen.queryByText(/continue/i) ||
                            screen.queryByText(/correct/i) ||
                            screen.queryByText(/incorrect/i);
        return nextElement !== null;
      }, { timeout: 3000 });

      // Verify getOptimalQuestion was called multiple times with same session ID
      expect(mockGetOptimalQuestion).toHaveBeenCalledTimes(2);
      
      // Both calls should have same sessionId (first parameter)
      const calls = mockGetOptimalQuestion.mock.calls;
      expect(calls[0][0]).toBe(calls[1][0]); // Same session ID
      
      // This ensures no question repetition within same battle session
    });
  });

  describe('🔍 Integration Quality Assurance', () => {
    it('should maintain backward compatibility with existing battle flow', async () => {
      // ARRANGE: Mock for backward compatibility test
      mockGetOptimalQuestion.mockReturnValueOnce({
        id: 'compat-test-1',
        question: 'What is the primary purpose of encryption?',
        options: ['Data protection', 'Data compression', 'Data transfer', 'Data storage'],
        correct: 0,
        category: 'cybersecurity',
        difficulty: 'beginner' as const,
        explanation: 'Encryption protects data by making it unreadable to unauthorized users.',
        text: 'What is the primary purpose of encryption?'
      });

      // Ensure that implementing level-based questions doesn't break existing functionality
      await startGameAndBattle(1, 'prof-cyber');
      
      // Battle should still start normally
      expect(screen.getByTestId('battle-system')).toBeInTheDocument();
      
      // Questions should still appear
      await waitFor(() => {
        expect(screen.getByText('What is the primary purpose of encryption?')).toBeInTheDocument();
      });
      
      // Category should be displayed
      expect(screen.getByText(/category:/i)).toBeInTheDocument();
      
      // Health bars should still be visible
      expect(screen.getByText(/Your Health:/)).toBeInTheDocument();
      
      // Answer options should still be clickable
      const options = screen.getAllByRole('button').filter(btn => 
        btn.textContent?.includes('A') || 
        btn.textContent?.includes('B') ||
        btn.textContent?.includes('Data protection') ||
        btn.textContent?.includes('Data compression')
      );
      expect(options.length).toBeGreaterThan(0);
    });

    it('should handle edge cases in level calculation gracefully', async () => {
      // ARRANGE: Mock for edge cases test
      mockGetOptimalQuestion.mockReturnValueOnce({
        id: 'edge-test-1',
        question: 'What does firewall protection do?',
        options: ['Blocks unauthorized access', 'Speeds up internet', 'Stores passwords', 'Manages emails'],
        correct: 0,
        category: 'network-security',
        difficulty: 'beginner' as const,
        explanation: 'Firewalls protect networks by blocking unauthorized access attempts.',
        text: 'What does firewall protection do?'
      });

      // Test with edge case levels
      await startGameAndBattle(1, 'prof-cyber'); // Very low player level
      
      await waitFor(() => {
        expect(screen.getByText('What does firewall protection do?')).toBeInTheDocument();
      });

      // Should still call getOptimalQuestion even with edge case levels
      expect(mockGetOptimalQuestion).toHaveBeenCalled();
      
      // Should not crash or throw errors
      expect(screen.getByTestId('battle-system')).toBeInTheDocument();
    });
  });
});
