/**
 * 🧪 CYBERSECURITY QUESTIONS TDD TEST SUITE
 * 
 * Test Guardian Agent - Level-Based Question Selection & No-Repeat Logic
 * Following TDD methodology: RED-GREEN-REFACTOR
 * 
 * Focus Areas:
 * - Level-based difficulty selection (easy if player higher level, advanced if opponent much higher)
 * - No question repetition during single battle session
 * - Enhanced question selection algorithms
 * - Comprehensive test coverage for existing functionality
 * 
 * Educational Value: Demonstrates intelligent adaptive learning systems
 */

import { CyberSecurityQuestions, TriviaQuestion, QuestionDatabase } from '@/app/games/pokemon-cyber-mmo/data/CyberSecurityQuestions';

describe('🔐 CyberSecurityQuestions - TDD Enhancement Suite', () => {
  
  beforeEach(() => {
    // Reset any state before each test
    jest.clearAllMocks();
  });

  /**
   * ========================================================================
   * 🔴 RED PHASE - Level-Based Question Selection Tests
   * These tests will FAIL initially, driving our implementation
   * ========================================================================
   */
  
  describe('🎯 Level-Based Question Selection (RED PHASE)', () => {
    
    it('should select EASY questions when player level is significantly higher than opponent', () => {
      // RED: This will fail - method doesn't exist yet
      const playerLevel = 25;
      const opponentLevel = 5;
      const levelDifference = playerLevel - opponentLevel; // +20 (player much stronger)
      
      const question = CyberSecurityQuestions.getQuestionByLevelDifference(levelDifference);
      
      expect(question.difficulty).toBe('beginner');
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('question');
      expect(question.damageMultiplier).toBe(1.0); // Beginner questions have 1.0 multiplier
    });

    it('should select ADVANCED questions when opponent level is much higher than player', () => {
      // RED: This will fail - method doesn't exist yet
      const playerLevel = 8;
      const opponentLevel = 30;
      const levelDifference = playerLevel - opponentLevel; // -22 (opponent much stronger)
      
      const question = CyberSecurityQuestions.getQuestionByLevelDifference(levelDifference);
      
      expect(question.difficulty).toBe('advanced');
      expect(question.damageMultiplier).toBe(1.8); // Advanced questions have 1.8 multiplier
    });

    it('should select INTERMEDIATE questions when levels are roughly equal', () => {
      // RED: This will fail - method doesn't exist yet
      const playerLevel = 15;
      const opponentLevel = 17;
      const levelDifference = playerLevel - opponentLevel; // -2 (relatively balanced)
      
      const question = CyberSecurityQuestions.getQuestionByLevelDifference(levelDifference);
      
      expect(question.difficulty).toBe('intermediate');
      expect(question.damageMultiplier).toBe(1.3); // Intermediate questions have 1.3 multiplier
    });

    it('should handle edge cases in level difference calculation', () => {
      // RED: Testing boundary conditions
      const testCases = [
        { playerLevel: 1, opponentLevel: 1, expectedDifficulty: 'beginner' }, // Equal levels (0 difference)
        { playerLevel: 50, opponentLevel: 1, expectedDifficulty: 'beginner' }, // Max player advantage (+49)
        { playerLevel: 1, opponentLevel: 50, expectedDifficulty: 'advanced' }, // Max opponent advantage (-49)
        { playerLevel: 0, opponentLevel: 0, expectedDifficulty: 'beginner' }, // Zero levels (0 difference)
        { playerLevel: 10, opponentLevel: 8, expectedDifficulty: 'beginner' }, // Player advantage (+2)
        { playerLevel: 8, opponentLevel: 15, expectedDifficulty: 'advanced' }, // Opponent advantage (-7)
      ];

      testCases.forEach(testCase => {
        const levelDifference = testCase.playerLevel - testCase.opponentLevel;
        const question = CyberSecurityQuestions.getQuestionByLevelDifference(levelDifference);
        expect(question.difficulty).toBe(testCase.expectedDifficulty);
      });
    });
  });

  /**
   * ========================================================================
   * 🔴 RED PHASE - No-Repeat Battle Session Tests
   * These tests will FAIL initially, driving our implementation
   * ========================================================================
   */

  describe('🚫 No-Repeat Battle Session Logic (RED PHASE)', () => {
    
    it('should create a new battle session and track used questions', () => {
      // RED: This will fail - BattleSession class doesn't exist yet
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      expect(battleSession).toHaveProperty('sessionId');
      expect(battleSession).toHaveProperty('usedQuestionIds');
      expect(battleSession.usedQuestionIds).toEqual([]);
      expect(typeof battleSession.sessionId).toBe('string');
      expect(battleSession.sessionId.length).toBeGreaterThan(0);
    });

    it('should prevent question repetition within same battle session', () => {
      // RED: This will fail - session-based question selection doesn't exist yet
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      // Get first question
      const question1 = CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 0);
      expect(question1).toBeDefined();
      
      // Get second question - should be different
      const question2 = CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 0);
      expect(question2).toBeDefined();
      expect(question2.id).not.toBe(question1.id);
      
      // Get third question - should be different from both
      const question3 = CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 0);
      expect(question3).toBeDefined();
      expect(question3.id).not.toBe(question1.id);
      expect(question3.id).not.toBe(question2.id);
    });

    it('should track used questions across multiple calls in same session', () => {
      // RED: This will fail - session state tracking doesn't exist yet
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      // Use several questions
      const questions: TriviaQuestion[] = [];
      for (let i = 0; i < 5; i++) {
        const question = CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 0);
        questions.push(question);
      }
      
      // All questions should be unique
      const uniqueIds = new Set(questions.map(q => q.id));
      expect(uniqueIds.size).toBe(5);
      
      // Session should track all used questions
      const sessionState = CyberSecurityQuestions.getBattleSessionState(battleSession.sessionId);
      expect(sessionState.usedQuestionIds.length).toBe(5);
    });

    it('should handle session cleanup when battle ends', () => {
      // RED: This will fail - session cleanup doesn't exist yet
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      // Use some questions
      CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 0);
      CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 0);
      
      // End battle session
      CyberSecurityQuestions.endBattleSession(battleSession.sessionId);
      
      // Session should be cleaned up
      expect(() => {
        CyberSecurityQuestions.getBattleSessionState(battleSession.sessionId);
      }).toThrow('Battle session not found');
    });

    it('should prevent exhausting all questions in a category during battle', () => {
      // RED: This will fail - smart fallback logic doesn't exist yet
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      // Try to get more beginner questions than available
      const beginnerQuestions = CyberSecurityQuestions.getQuestionsByDifficulty('beginner');
      const availableCount = beginnerQuestions.length;
      
      // Get questions equal to available count
      const questions: TriviaQuestion[] = [];
      for (let i = 0; i < availableCount; i++) {
        const question = CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 10); // High level diff = beginner
        questions.push(question);
        expect(question.difficulty).toBe('beginner');
      }
      
      // Next question should gracefully fall back to intermediate
      const fallbackQuestion = CyberSecurityQuestions.getQuestionForBattleSession(battleSession.sessionId, 10);
      expect(fallbackQuestion.difficulty).toBe('intermediate');
    });
  });

  /**
   * ========================================================================
   * 🔴 RED PHASE - Enhanced Selection Algorithm Tests
   * These tests will FAIL initially, driving our implementation
   * ========================================================================
   */

  describe('🧠 Enhanced Selection Algorithm (RED PHASE)', () => {
    
    it('should combine level difference and session state for optimal question selection', () => {
      // RED: This will fail - combined algorithm doesn't exist yet
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      // Player much stronger - should get beginner questions
      const easyQuestion = CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, 20, 5);
      expect(easyQuestion.difficulty).toBe('beginner');
      
      // Opponent much stronger - should get advanced questions  
      const hardQuestion = CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, 5, 25);
      expect(hardQuestion.difficulty).toBe('advanced');
      
      // Questions should be different
      expect(easyQuestion.id).not.toBe(hardQuestion.id);
    });

    it('should provide category-balanced question distribution', () => {
      // RED: This will fail - category balancing doesn't exist yet
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      const questions: TriviaQuestion[] = [];
      const categories = new Set<string>();
      
      // Get 10 questions
      for (let i = 0; i < 10; i++) {
        const question = CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, 15, 15);
        questions.push(question);
        categories.add(question.category);
      }
      
      // Should have good category distribution (at least 3 different categories)
      expect(categories.size).toBeGreaterThanOrEqual(3);
      
      // No category should dominate (max 70% of questions)
      const categoryCounts = Array.from(categories).map(cat => 
        questions.filter(q => q.category === cat).length
      );
      const maxCategoryCount = Math.max(...categoryCounts);
      expect(maxCategoryCount).toBeLessThanOrEqual(7);
    });

    it('should prioritize educational progression in question selection', () => {
      // RED: Testing educational flow with isolated sessions
      
      // Test level differences that should give specific difficulties
      const levelDiffTests = [
        { diff: 7, expected: 'beginner' },   // +7 = beginner
        { diff: -3, expected: 'intermediate' }, // -3 = intermediate  
        { diff: -10, expected: 'advanced' }  // -10 = advanced
      ];
      
      const difficulties: string[] = [];
      levelDiffTests.forEach(test => {
        // Create a new session for each test to avoid fallback interference
        const session = CyberSecurityQuestions.createBattleSession();
        const question = CyberSecurityQuestions.getQuestionForBattleSession(
          session.sessionId, 
          test.diff
        );
        difficulties.push(question.difficulty);
        expect(question.difficulty).toBe(test.expected);
        // Clean up session
        CyberSecurityQuestions.endBattleSession(session.sessionId);
      });
      
      expect(difficulties).toEqual(['beginner', 'intermediate', 'advanced']);
    });
  });

  /**
   * ========================================================================
   * 🔴 RED PHASE - Existing Functionality Coverage Tests
   * These should PASS initially but ensure comprehensive coverage
   * ========================================================================
   */

  describe('📚 Existing Functionality Coverage (GREEN VERIFICATION)', () => {
    
    it('should validate question database structure and content', () => {
      const questions = CyberSecurityQuestions.getAllQuestions();
      
      expect(questions).toHaveProperty('beginner');
      expect(questions).toHaveProperty('intermediate');
      expect(questions).toHaveProperty('advanced');
      
      // Each difficulty should have substantial content
      expect(questions.beginner.length).toBeGreaterThan(15);
      expect(questions.intermediate.length).toBeGreaterThan(10);
      expect(questions.advanced.length).toBeGreaterThan(8);
    });

    it('should provide questions by difficulty level', () => {
      const beginnerQuestions = CyberSecurityQuestions.getQuestionsByDifficulty('beginner');
      const intermediateQuestions = CyberSecurityQuestions.getQuestionsByDifficulty('intermediate');
      const advancedQuestions = CyberSecurityQuestions.getQuestionsByDifficulty('advanced');
      
      expect(beginnerQuestions.length).toBeGreaterThan(0);
      expect(intermediateQuestions.length).toBeGreaterThan(0);
      expect(advancedQuestions.length).toBeGreaterThan(0);
      
      beginnerQuestions.forEach(q => expect(q.difficulty).toBe('beginner'));
      intermediateQuestions.forEach(q => expect(q.difficulty).toBe('intermediate'));
      advancedQuestions.forEach(q => expect(q.difficulty).toBe('advanced'));
    });

    it('should validate question format and educational content', () => {
      const sampleQuestion = CyberSecurityQuestions.getRandomQuestion('intermediate');
      
      expect(sampleQuestion).toHaveProperty('id');
      expect(sampleQuestion).toHaveProperty('question');
      expect(sampleQuestion).toHaveProperty('options');
      expect(sampleQuestion).toHaveProperty('correctAnswer');
      expect(sampleQuestion).toHaveProperty('difficulty');
      expect(sampleQuestion).toHaveProperty('category');
      expect(sampleQuestion).toHaveProperty('explanation');
      expect(sampleQuestion).toHaveProperty('damageMultiplier');
      
      expect(sampleQuestion.question.length).toBeGreaterThan(10);
      expect(sampleQuestion.options).toHaveLength(4);
      expect(sampleQuestion.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(sampleQuestion.correctAnswer).toBeLessThan(4);
      expect(sampleQuestion.explanation.length).toBeGreaterThan(20);
      expect(sampleQuestion.damageMultiplier).toBeGreaterThan(0);
    });

    it('should cover essential cybersecurity domains', () => {
      const allQuestions = [
        ...CyberSecurityQuestions.getQuestionsByDifficulty('beginner'),
        ...CyberSecurityQuestions.getQuestionsByDifficulty('intermediate'),
        ...CyberSecurityQuestions.getQuestionsByDifficulty('advanced')
      ];
      
      const categories = new Set(allQuestions.map(q => q.category));
      const expectedCategories = [
        'fundamentals', 'networking', 'cryptography', 'security',
        'programming', 'hardware', 'ethics', 'careers'
      ];
      
      expectedCategories.forEach(category => {
        expect(categories.has(category)).toBe(true);
      });
    });

    it('should retrieve questions by ID', () => {
      const beginnerQuestions = CyberSecurityQuestions.getQuestionsByDifficulty('beginner');
      const testQuestion = beginnerQuestions[0];
      
      const retrievedQuestion = CyberSecurityQuestions.getQuestionById(testQuestion.id);
      
      expect(retrievedQuestion).toEqual(testQuestion);
    });

    it('should handle invalid requests gracefully', () => {
      // Invalid difficulty
      const invalidDifficulty = CyberSecurityQuestions.getQuestionsByDifficulty('invalid' as any);
      expect(invalidDifficulty).toEqual([]);
      
      // Non-existent ID
      const nonExistentQuestion = CyberSecurityQuestions.getQuestionById('non-existent');
      expect(nonExistentQuestion).toBeUndefined();
    });
  });

  /**
   * ========================================================================
   * 🔴 RED PHASE - Performance and Edge Case Tests
   * These ensure robust implementation
   * ========================================================================
   */

  describe('⚡ Performance and Edge Cases (RED PHASE)', () => {
    
    it('should handle rapid question requests efficiently', () => {
      // RED: Testing performance with session state
      const battleSession = CyberSecurityQuestions.createBattleSession();
      const startTime = Date.now();
      
      // Request 20 questions rapidly
      for (let i = 0; i < 20; i++) {
        CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, 10, 12);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (under 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('should handle multiple concurrent battle sessions', () => {
      // RED: Testing session isolation
      const session1 = CyberSecurityQuestions.createBattleSession();
      const session2 = CyberSecurityQuestions.createBattleSession();
      const session3 = CyberSecurityQuestions.createBattleSession();
      
      // Each session should be independent
      expect(session1.sessionId).not.toBe(session2.sessionId);
      expect(session2.sessionId).not.toBe(session3.sessionId);
      
      // Questions used in one session shouldn't affect others
      const q1 = CyberSecurityQuestions.getOptimalQuestion(session1.sessionId, 10, 10);
      const q2 = CyberSecurityQuestions.getOptimalQuestion(session2.sessionId, 10, 10);
      
      // Sessions should track independently
      const state1 = CyberSecurityQuestions.getBattleSessionState(session1.sessionId);
      const state2 = CyberSecurityQuestions.getBattleSessionState(session2.sessionId);
      
      expect(state1.usedQuestionIds).toHaveLength(1);
      expect(state2.usedQuestionIds).toHaveLength(1);
      expect(state1.usedQuestionIds[0]).toBe(q1.id);
      expect(state2.usedQuestionIds[0]).toBe(q2.id);
    });

    it('should maintain educational value under stress conditions', () => {
      // RED: Ensure quality doesn't degrade under pressure
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      // Exhaust most beginner questions
      const beginnerCount = CyberSecurityQuestions.getQuestionsByDifficulty('beginner').length;
      for (let i = 0; i < beginnerCount - 1; i++) {
        CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, 20, 5); // Should get beginner
      }
      
      // Next question should still be educational and valid
      const finalQuestion = CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, 20, 5);
      expect(finalQuestion).toBeDefined();
      expect(finalQuestion.explanation.length).toBeGreaterThan(20);
      expect(finalQuestion.question.length).toBeGreaterThan(10);
    });
  });

  /**
   * ========================================================================
   * 🎓 Educational Testing Integration
   * Verify integration with existing battle system
   * ========================================================================
   */

  describe('🎮 Battle System Integration (RED PHASE)', () => {
    
    it('should provide consistent difficulty progression for learning', () => {
      // RED: Testing educational flow with isolated sessions 
      
      // Test level differences that should give specific difficulties
      const levelDiffTests = [
        { diff: 7, expected: 'beginner' },   // +7 = beginner
        { diff: -3, expected: 'intermediate' }, // -3 = intermediate  
        { diff: -10, expected: 'advanced' }  // -10 = advanced
      ];
      
      const progressionQuestions: TriviaQuestion[] = [];
      levelDiffTests.forEach(test => {
        // Create a new session for each test to avoid fallback interference
        const session = CyberSecurityQuestions.createBattleSession();
        const question = CyberSecurityQuestions.getQuestionForBattleSession(
          session.sessionId, 
          test.diff
        );
        progressionQuestions.push(question);
        // Clean up session
        CyberSecurityQuestions.endBattleSession(session.sessionId);
      });
      
      expect(progressionQuestions[0].difficulty).toBe('beginner');
      expect(progressionQuestions[1].difficulty).toBe('intermediate');
      expect(progressionQuestions[2].difficulty).toBe('advanced');
      
      // Damage multipliers should increase appropriately
      expect(progressionQuestions[0].damageMultiplier).toBeLessThan(progressionQuestions[1].damageMultiplier);
      expect(progressionQuestions[1].damageMultiplier).toBeLessThan(progressionQuestions[2].damageMultiplier);
    });

    it('should support adaptive learning based on player performance', () => {
      // RED: Testing adaptive difficulty adjustment
      const battleSession = CyberSecurityQuestions.createBattleSession();
      
      // Simulate incorrect answers leading to easier questions
      CyberSecurityQuestions.recordQuestionResult(battleSession.sessionId, 'q001', false); // Wrong
      CyberSecurityQuestions.recordQuestionResult(battleSession.sessionId, 'q002', false); // Wrong
      
      const adaptedQuestion = CyberSecurityQuestions.getAdaptiveQuestion(battleSession.sessionId, 15, 15);
      
      // Should provide easier question after failures
      expect(adaptedQuestion.difficulty).toBe('beginner');
    });
  });
});

/**
 * 🎯 TDD IMPLEMENTATION ROADMAP
 * 
 * RED PHASE (Current): All tests above will FAIL initially
 * - Implement: getQuestionByLevelDifference()
 * - Implement: createBattleSession() and BattleSession management
 * - Implement: getQuestionForBattleSession() with no-repeat logic
 * - Implement: getOptimalQuestion() combining level and session logic
 * - Implement: session cleanup and state management
 * - Implement: adaptive learning features
 * 
 * GREEN PHASE (Next): Minimal implementation to pass tests
 * - Add level-based selection algorithm
 * - Add session state tracking
 * - Add question filtering logic
 * - Add fallback mechanisms
 * 
 * REFACTOR PHASE (Final): Optimize and enhance
 * - Performance optimizations
 * - Code organization improvements
 * - Enhanced educational algorithms
 * - Better error handling and edge cases
 * 
 * 📊 SUCCESS METRICS:
 * - All tests passing (RED -> GREEN)
 * - No question repetition within battles
 * - Appropriate difficulty based on levels
 * - Robust session management
 * - Educational value maintained
 */
