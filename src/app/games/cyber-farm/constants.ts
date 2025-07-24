/**
 * CyberFarm Game Constants
 * Centralized configuration for the cybersecurity farming game
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum CropType {
  FIREWALL = 'firewall',
  ANTIVIRUS = 'antivirus', 
  ENCRYPTION = 'encryption',
  IDS = 'ids'
}

export enum ParticleType {
  SPARKLE = 'sparkle',
  CONFETTI = 'confetti',
  SECURITY = 'security',
  GROWTH = 'growth'
}

export enum DayNightPhase {
  DAY = 'day',
  NIGHT = 'night',
  DAWN = 'dawn',
  DUSK = 'dusk'
}

export enum SkillTree {
  NETWORK_DEFENSE = 'Network Defense',
  THREAT_ANALYSIS = 'Threat Analysis', 
  INCIDENT_RESPONSE = 'Incident Response'
}

// ============================================================================
// GAME TIMING
// ============================================================================

export const GAME_TIMING = {
  DAY_NIGHT_CYCLE_MS: 5000,
  CROP_GROWTH_MS: 3000,
  PARTICLE_DURATION_MS: 1000,
  AUTO_SAVE_INTERVAL_MS: 30000
} as const;

// ============================================================================
// GAME LAYOUT
// ============================================================================

export const LAYOUT = {
  FARM_GRID_SIZE: 3,
  PLOT_SIZE_CLASS: 'h-16 w-16',
  Z_INDEX: {
    BACKGROUND: 10,
    FARM: 20,
    UI_PANELS: 30,
    MOBILE_INTERFACE: 40,
    PARTICLES: 50
  }
} as const;

// ============================================================================
// GAME ECONOMY
// ============================================================================

export const ECONOMY = {
  INITIAL_COINS: 150,
  CROP_VALUES: {
    [CropType.FIREWALL]: { plantCost: 10, sellValue: 25, xp: 15 },
    [CropType.ANTIVIRUS]: { plantCost: 15, sellValue: 35, xp: 20 },
    [CropType.ENCRYPTION]: { plantCost: 20, sellValue: 45, xp: 25 },
    [CropType.IDS]: { plantCost: 25, sellValue: 55, xp: 30 }
  }
} as const;

// ============================================================================
// UI STRINGS
// ============================================================================

export const UI_STRINGS = {
  BUTTONS: {
    PLANT_CROP: '🌱 Plant',
    HARVEST_CROP: '🌾 Harvest', 
    SEND_GIFT: '🎁 Send Gift',
    VISIT_FARM: "Visit {name}'s Farm",
    BUY_SEEDS: 'Buy Seeds',
    BUY_TOOLS: 'Buy Tools',
    SELL_CROP: 'Sell Crop'
  },
  LABELS: {
    CYBER_COINS: 'CyberCoins',
    NEIGHBOR_FARMS: 'Neighbor Farms',
    PARTY_ZONE: 'Party Zone',
    SKILL_TREES: 'Skill Trees',
    SEASONAL_EVENTS: 'Seasonal Events'
  },
  MESSAGES: {
    GIFTS_INBOX: 'You have {count} new gifts!',
    MISSION_PARTICIPANTS: '{names} joined',
    ZOOM_LEVEL: 'Zoom: {level}%'
  }
} as const;

// ============================================================================
// VISUAL EFFECTS
// ============================================================================

export const VISUAL_EFFECTS = {
  CROP_EMOJIS: {
    [CropType.FIREWALL]: '🔥',
    [CropType.ANTIVIRUS]: '🛡️', 
    [CropType.ENCRYPTION]: '🔐',
    [CropType.IDS]: '👁️'
  },
  PARTICLE_COLORS: {
    [ParticleType.SPARKLE]: 'text-yellow-400',
    [ParticleType.CONFETTI]: 'text-rainbow',
    [ParticleType.SECURITY]: 'text-blue-400',
    [ParticleType.GROWTH]: 'text-green-400'
  },
  DAY_NIGHT_CLASSES: {
    [DayNightPhase.DAY]: 'day-mode',
    [DayNightPhase.NIGHT]: 'night-mode',
    [DayNightPhase.DAWN]: 'dawn-mode',
    [DayNightPhase.DUSK]: 'dusk-mode'
  }
} as const;

// ============================================================================
// MOBILE CONFIGURATION
// ============================================================================

export const MOBILE_CONFIG = {
  BREAKPOINT_WIDTH: 768,
  TOUCH_TARGET_CLASS: 'mobile-touch-target',
  INTERFACE_ELEMENTS: {
    FARM_INTERFACE: 'mobile-farm-interface',
    ZOOM_CONTROLS: 'zoom-controls',
    ACTION_MENU: 'mobile-action-menu'
  }
} as const;

// ============================================================================
// SOCIAL FEATURES
// ============================================================================

export const SOCIAL_FEATURES = {
  NEIGHBOR_FARMS: [
    { name: 'Alice', level: 5 },
    { name: 'Bob', level: 3 },
    { name: 'Charlie', level: 7 }
  ],
  GIFT_TYPES: ['seeds', 'tools', 'decorations', 'coins'],
  COLLABORATIVE_MISSIONS: [
    {
      id: 'ddos-defense',
      name: 'DDoS Defense',
      description: 'Team Mission: DDoS Defense',
      participants: ['Alice', 'Bob', 'Charlie']
    }
  ]
} as const;

// ============================================================================
// ACHIEVEMENT SYSTEM
// ============================================================================

export const ACHIEVEMENTS = {
  SKILL_TREES: {
    [SkillTree.NETWORK_DEFENSE]: {
      icon: '🛡️',
      levels: 10,
      xpPerLevel: 100
    },
    [SkillTree.THREAT_ANALYSIS]: {
      icon: '🔍', 
      levels: 10,
      xpPerLevel: 120
    },
    [SkillTree.INCIDENT_RESPONSE]: {
      icon: '🚨',
      levels: 10, 
      xpPerLevel: 150
    }
  },
  MASTERY_LEVELS: {
    NOVICE: { min: 0, max: 99 },
    APPRENTICE: { min: 100, max: 299 },
    EXPERT: { min: 300, max: 599 },
    MASTER: { min: 600, max: 999 },
    GRANDMASTER: { min: 1000, max: Infinity }
  }
} as const;

// ============================================================================
// SEASONAL EVENTS
// ============================================================================

export const SEASONAL_EVENTS = {
  CURRENT_EVENTS: [
    {
      id: 'cyber-security-awareness',
      name: '🔐 Cyber Security Awareness Month',
      description: 'Learn about password security!',
      endDate: '2024-12-31',
      rewards: ['special seeds', 'exclusive decorations']
    }
  ],
  SEASONAL_CROPS: {
    HALLOWEEN: 'pumpkin-firewall',
    CHRISTMAS: 'candy-cane-antivirus',
    SPRING: 'flower-encryption'
  },
  HOLIDAY_CHALLENGES: [
    {
      id: 'halloween-security',
      name: '🎃 Halloween Security Challenge',
      description: 'Protect against spooky threats!'
    }
  ]
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type CropData = {
  type: CropType;
  plantedAt: number;
  isReady: boolean;
  growthStage: 'seedling' | 'growing' | 'mature';
};

export type Particle = {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
};

export type GameState = {
  cyberCoins: number;
  level: number;
  xp: number;
  currentCrop: CropType | null;
  dayNightPhase: DayNightPhase;
  zoomLevel: number;
};
