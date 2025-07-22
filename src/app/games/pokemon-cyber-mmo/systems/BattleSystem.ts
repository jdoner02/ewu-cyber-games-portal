// GREEN PHASE - Minimal BattleSystem implementation to pass tests

export interface CyberPokemon {
  id: string;
  name: string;
  type: string;
  level: number;
  hp: number;
  maxHp: number;
  abilities: string[];
  rarity: string;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  currentPokemon: CyberPokemon;
}

export interface Battle {
  id: string;
  player1: Player;
  player2: Player;
  status: 'active' | 'completed' | 'paused';
  currentTurn: string;
  turnTimer: number;
  turnNumber: number;
}

export interface BattleEligibility {
  canBattle: boolean;
  reason: string;
  levelGapWarning?: string;
}

export interface BattleResult {
  winner: string;
  expGained: {
    player1: number;
    player2: number;
  };
  status: string;
}

export interface BattleHUD {
  player1Stats: {
    hp: number;
  };
  player2Stats: {
    hp: number;
  };
  currentQuestion: any;
  turnIndicator: string;
  timeRemaining: number;
}

export interface ProgressionRewards {
  expGained: number;
  skillPoints: {
    trivia: number;
    battle: number;
  };
  unlockNewConcepts: string[];
}

export class BattleSystem {
  private battles: Map<string, Battle> = new Map();
  private battleCounter = 0;

  initiateBattle(player1: Player, player2: Player): Battle {
    this.battleCounter++;
    const battle: Battle = {
      id: `battle_${this.battleCounter}`,
      player1: { ...player1, currentPokemon: { ...player1.currentPokemon } },
      player2: { ...player2, currentPokemon: { ...player2.currentPokemon } },
      status: 'active',
      currentTurn: player1.id,
      turnTimer: 30,
      turnNumber: 1
    };
    
    this.battles.set(battle.id, battle);
    return battle;
  }

  checkBattleEligibility(player1: Player, player2: Player): BattleEligibility {
    const levelDifference = Math.abs(player1.level - player2.level);
    
    if (levelDifference > 3) {
      return {
        canBattle: true,
        reason: '',
        levelGapWarning: `Large level difference: ${levelDifference} levels`
      };
    }
    
    return {
      canBattle: true,
      reason: ''
    };
  }

  completeTurn(battleId: string, playerId: string): void {
    const battle = this.battles.get(battleId);
    if (!battle) return;

    if (battle.currentTurn === battle.player1.id) {
      battle.currentTurn = battle.player2.id;
    } else {
      battle.currentTurn = battle.player1.id;
    }
    battle.turnNumber++;
  }

  concludeBattle(battleId: string): BattleResult {
    const battle = this.battles.get(battleId);
    if (!battle) throw new Error('Battle not found');

    const winner = battle.player1.currentPokemon.hp > 0 ? battle.player1.id : battle.player2.id;
    
    return {
      winner,
      expGained: {
        player1: winner === battle.player1.id ? 100 : 50,
        player2: winner === battle.player2.id ? 100 : 50
      },
      status: 'completed'
    };
  }

  calculateBaseDamage(pokemonLevel: number, difficulty: string): number {
    const baseDamage = pokemonLevel * 2;
    const difficultyMultiplier = {
      'beginner': 1.0,
      'intermediate': 1.3,
      'advanced': 1.8
    }[difficulty] || 1.0;
    
    return Math.floor(baseDamage * difficultyMultiplier);
  }

  getTypeEffectiveness(attackerType: string, defenderType: string): number {
    // Simple type effectiveness chart for cybersecurity domains
    const effectiveness: Record<string, Record<string, number>> = {
      'security': {
        'networking': 1.5, // Security is super effective against networking
        'programming': 1.0,
        'hardware': 1.0,
        'cryptography': 1.0
      },
      'cryptography': {
        'programming': 1.0,
        'hardware': 1.0,
        'networking': 1.0,
        'security': 1.0
      },
      'programming': {
        'hardware': 0.8, // Programming is not very effective against hardware
        'networking': 1.0,
        'security': 1.0,
        'cryptography': 1.0
      }
    };

    return effectiveness[attackerType]?.[defenderType] || 1.0;
  }

  getBattleHUD(battleId: string): BattleHUD {
    const battle = this.battles.get(battleId);
    if (!battle) throw new Error('Battle not found');

    return {
      player1Stats: {
        hp: battle.player1.currentPokemon.hp
      },
      player2Stats: {
        hp: battle.player2.currentPokemon.hp
      },
      currentQuestion: { id: 'sample', question: 'Sample question?' },
      turnIndicator: battle.currentTurn,
      timeRemaining: battle.turnTimer
    };
  }

  checkBattleAchievements(battleStats: {
    perfectRound: boolean;
    streakCount: number;
    comebackVictory: boolean;
    triviaCategory: string;
  }): string[] {
    const achievements: string[] = [];
    
    if (battleStats.perfectRound) {
      achievements.push('Perfect Round');
    }
    
    if (battleStats.streakCount >= 5) {
      achievements.push('Trivia Streak Master');
    }
    
    if (battleStats.triviaCategory === 'cryptography') {
      achievements.push('Cryptography Expert');
    }
    
    return achievements;
  }

  calculateProgressionRewards(battleData: {
    battleResult: string;
    questionsCorrect: number;
    questionsTotal: number;
    difficultyLevel: string;
    opponentLevel: number;
  }): ProgressionRewards {
    const baseExp = battleData.questionsCorrect * 10;
    const difficultyBonus = {
      'beginner': 1.0,
      'intermediate': 1.5,
      'advanced': 2.0
    }[battleData.difficultyLevel] || 1.0;
    
    return {
      expGained: Math.floor(baseExp * difficultyBonus),
      skillPoints: {
        trivia: battleData.questionsCorrect * 2,
        battle: battleData.battleResult === 'victory' ? 10 : 5
      },
      unlockNewConcepts: ['Advanced Cryptography', 'Network Defense']
    };
  }
}
