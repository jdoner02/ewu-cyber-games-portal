// GREEN PHASE - Minimal TriviaEngine implementation to pass tests

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  explanation: string;
  damageMultiplier: number;
}

export interface RapidFireRound {
  questionCount: number;
  timePerQuestion: number;
  bonusMultiplier: number;
  questions: TriviaQuestion[];
  status: 'active' | 'completed';
}

export interface AnswerResult {
  isCorrect: boolean;
  damageDealt: number;
  selfDamage: number;
  targetPlayer: string;
}

export interface AnswerFeedback {
  isCorrect: boolean;
  explanation: string;
  additionalResources?: string[];
  nextConcept?: string;
  correctAnswerExplanation?: string;
  encouragement?: string;
}

export interface QuestionComponent {
  question: string;
  options: string[];
  timeRemaining: number;
  progressBar: any;
}

export class TriviaEngine {
  private questionBank: Map<string, TriviaQuestion[]> = new Map();

  constructor() {
    this.initializeQuestionBank();
  }

  private initializeQuestionBank(): void {
    // Initialize with sample questions for testing
    const sampleQuestions: TriviaQuestion[] = [
      {
        id: 'q001',
        question: 'What does CIA stand for in cybersecurity?',
        options: [
          'Central Intelligence Agency',
          'Confidentiality, Integrity, Availability',
          'Computer Information Access',
          'Cybersecurity Implementation Architecture'
        ],
        correctAnswer: 1,
        difficulty: 'beginner',
        category: 'fundamentals',
        explanation: 'CIA Triad represents the three core principles of information security.',
        damageMultiplier: 1.0
      }
    ];

    this.questionBank.set('beginner', [...sampleQuestions]);
    this.questionBank.set('intermediate', [...sampleQuestions.map(q => ({ ...q, difficulty: 'intermediate' as const, damageMultiplier: 1.3 }))]);
    this.questionBank.set('advanced', [...sampleQuestions.map(q => ({ ...q, difficulty: 'advanced' as const, damageMultiplier: 1.8 }))]);
  }

  generateQuestion(difficulty: string, category: string): TriviaQuestion {
    const questions = this.questionBank.get(difficulty) || [];
    const categoryQuestions = questions.filter(q => q.category === category);
    
    if (categoryQuestions.length === 0) {
      // Return a default question if none found
      return {
        id: 'default',
        question: 'What is the first principle of cybersecurity?',
        options: ['Availability', 'Confidentiality', 'Integrity', 'Authentication'],
        correctAnswer: 1,
        difficulty: difficulty as any,
        category,
        explanation: 'Confidentiality ensures information is accessible only to authorized parties.',
        damageMultiplier: difficulty === 'advanced' ? 1.8 : difficulty === 'intermediate' ? 1.3 : 1.0
      };
    }
    
    return categoryQuestions[0];
  }

  getQuestionForPokemonLevel(level: number): TriviaQuestion {
    let difficulty: string;
    let damageMultiplier: number;
    
    if (level <= 5) {
      difficulty = 'beginner';
      damageMultiplier = 1.0;
    } else if (level <= 12) {
      difficulty = 'intermediate'; 
      damageMultiplier = 1.3;
    } else {
      difficulty = 'advanced';
      damageMultiplier = 1.8;
    }
    
    return {
      id: `level_${level}`,
      question: `Level ${level} cybersecurity question?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 1,
      difficulty: difficulty as any,
      category: 'fundamentals',
      explanation: 'Sample explanation',
      damageMultiplier
    };
  }

  processAnswer(battle: any, playerId: string, question: TriviaQuestion, answerIndex: number): AnswerResult {
    const isCorrect = answerIndex === question.correctAnswer;
    const targetPlayer = playerId === battle.player1.id ? 'player2' : 'player1';
    
    if (isCorrect) {
      return {
        isCorrect: true,
        damageDealt: Math.floor(20 * question.damageMultiplier),
        selfDamage: 0,
        targetPlayer
      };
    } else {
      const potentialDamage = Math.floor(20 * question.damageMultiplier);
      return {
        isCorrect: false,
        damageDealt: 0,
        selfDamage: Math.floor(potentialDamage * 0.4), // 40% of potential damage as self-damage
        targetPlayer
      };
    }
  }

  startRapidFireRound(player1: any, player2: any): RapidFireRound {
    const questions: TriviaQuestion[] = [];
    for (let i = 0; i < 5; i++) {
      questions.push(this.generateQuestion('intermediate', 'fundamentals'));
    }
    
    return {
      questionCount: 5,
      timePerQuestion: 15,
      bonusMultiplier: 1.5,
      questions,
      status: 'active'
    };
  }

  calculateSelfDamage(difficulty: string, pokemonLevel: number): number {
    const baseDamage = pokemonLevel;
    const difficultyMultiplier = {
      'beginner': 0.5,
      'intermediate': 0.8,
      'advanced': 1.2
    }[difficulty] || 0.5;
    
    return Math.floor(baseDamage * difficultyMultiplier);
  }

  calculateOpponentDamage(difficulty: string, pokemonLevel: number): number {
    const baseDamage = pokemonLevel * 2;
    const difficultyMultiplier = {
      'beginner': 1.0,
      'intermediate': 1.3,
      'advanced': 1.8
    }[difficulty] || 1.0;
    
    return Math.floor(baseDamage * difficultyMultiplier);
  }

  renderQuestion(question: TriviaQuestion, timeRemaining: number): QuestionComponent {
    return {
      question: question.question,
      options: question.options,
      timeRemaining,
      progressBar: { percentage: (timeRemaining / 30) * 100 }
    };
  }

  generateAnswerFeedback(question: TriviaQuestion, answerIndex: number, wasCorrect: boolean): AnswerFeedback {
    if (wasCorrect) {
      return {
        isCorrect: true,
        explanation: question.explanation,
        additionalResources: ['Cybersecurity Fundamentals Guide', 'CIA Triad Deep Dive'],
        nextConcept: 'Authentication Mechanisms'
      };
    } else {
      return {
        isCorrect: false,
        explanation: question.explanation,
        correctAnswerExplanation: `The correct answer was: ${question.options[question.correctAnswer]}`,
        encouragement: "Don't worry! Learning cybersecurity takes practice. Try again!"
      };
    }
  }
}
