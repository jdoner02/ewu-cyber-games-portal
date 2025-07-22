/**
 * Game Types - Critical Type Definitions for Deployment
 * Command Architect Emergency Deployment: Resolving pipeline blockers
 * 
 * @fileoverview Essential type definitions to resolve TypeScript compilation errors
 * @classification public
 * @educational-standard AP Cybersecurity aligned
 */

// Critical Types for CyberClickerGame
export interface ThreatEvent {
  id: string;
  type: 'phishing' | 'malware' | 'social_engineering' | 'network_attack' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  resolved: boolean;
}

export interface LearningScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  threats: ThreatEvent[];
  objectives: string[];
  rewards: {
    xp: number;
    achievements: string[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  name: string; // Display name for notifications
  description: string;
  icon: string;
  category: 'security' | 'learning' | 'engagement' | 'mastery';
  criteria: {
    type: string;
    value: number;
  };
  condition: (gameState: GameState) => boolean; // Function to check if achievement is unlocked
  reward: {
    sp?: number; // Skill points
    clickMultiplier?: number; // Click value multiplier
    unlockRole?: string; // Role to unlock
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GameState {
  score: number;
  level: number;
  experience: number;
  currency: number;
  sp: number; // Skill points
  achievements: Achievement[];
  unlockedFeatures: string[];
  currentScenario?: LearningScenario;
  threats: ThreatEvent[];
  stats: {
    clicksPerSecond: number;
    totalClicks: number;
    threatsDefended: number;
    lessonsCompleted: number;
  };
}

export interface GameProgress {
  gameId: string;
  completed: boolean;
  score: number;
  timeSpent: number;
  achievements: string[];
  lastPlayed: Date;
  difficulty: string;
  learningObjectives: string[];
}

// Achievement definitions constant
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first_click',
    title: 'First Click',
    name: 'First Click',
    description: 'Click your first cyber defense button',
    icon: '🖱️',
    category: 'engagement',
    criteria: { type: 'clicks', value: 1 },
    condition: (gameState: GameState) => gameState.stats.totalClicks >= 1,
    reward: { sp: 10 },
    unlocked: false
  },
  {
    id: 'threat_hunter',
    title: 'Threat Hunter',
    name: 'Threat Hunter',
    description: 'Successfully identify and defend against 10 threats',
    icon: '🔍',
    category: 'security',
    criteria: { type: 'threats_defended', value: 10 },
    condition: (gameState: GameState) => gameState.stats.threatsDefended >= 10,
    reward: { sp: 50, clickMultiplier: 1.5 },
    unlocked: false
  },
  {
    id: 'security_expert',
    title: 'Security Expert',
    name: 'Security Expert',
    description: 'Complete all learning scenarios',
    icon: '🛡️',
    category: 'mastery',
    criteria: { type: 'scenarios_completed', value: 100 },
    condition: (gameState: GameState) => gameState.stats.lessonsCompleted >= 100,
    reward: { sp: 200, unlockRole: 'Security Expert' },
    unlocked: false
  },
  {
    id: 'quick_learner',
    title: 'Quick Learner',
    name: 'Quick Learner',
    description: 'Complete a scenario in under 5 minutes',
    icon: '⚡',
    category: 'learning',
    criteria: { type: 'speed_completion', value: 300000 },
    condition: (gameState: GameState) => gameState.level >= 5,
    reward: { sp: 25, clickMultiplier: 1.2 },
    unlocked: false
  }
];

// Additional type exports for compatibility
export type SecurityThreatType = ThreatEvent['type'];
export type DifficultyLevel = LearningScenario['difficulty'];
export type AchievementCategory = Achievement['category'];
