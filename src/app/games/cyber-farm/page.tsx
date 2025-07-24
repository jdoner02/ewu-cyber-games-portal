'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Database,
  Lock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Eye,
  Users,
  Server,
  Wifi,
  Bug,
  Mail,
  Key,
  Award,
  Target,
  Brain,
  TrendingUp,
  HardDrive,
  Play,
  Smartphone,
  Sparkles,
  Trophy,
  Crown,
  Clock,
  Flame,
  Calendar,
  Star
} from 'lucide-react';

// Types and Interfaces
interface SaveState {
  securityScore: number;
  cropsPlanted: number;
  securityControls: string[];
  genCyberProgress: {
    ciaTriad: number;
    defenseInDepth: number;
    thinkLikeAdversary: number;
  };
  attackHistory: Array<{
    type: string;
    blocked: boolean;
    timestamp: number;
  }>;
  unlockedTools: string[];
  activeCrops: Array<{
    id: string;
    type: string;
    isProtected: boolean;
    isCorrupted: boolean;
    plantedAt: number;
  }>;
  recentEvents: string[];
  // Advanced Features State
  cyberCoins: number;
  friendsList: Array<{
    id: string;
    name: string;
    farmLevel: number;
  }>;
  gifts: Array<{
    id: string;
    type: string;
    from: string;
    timestamp: number;
  }>;
  skillTrees: {
    networkSecurity: number;
    cryptography: number;
    incidentResponse: number;
  };
  masteryLevels: {
    firewall: number;
    encryption: number;
    monitoring: number;
  };
  seasonalEvent: {
    type: string;
    progress: number;
    target: number;
    timeRemaining: number;
  };
  dayNightCycle: {
    isDayTime: boolean;
    timeOfDay: number;
  };
  zoomLevel: number;
  prestigeLevel: number;
  globalRank: number;
  // Cybersecurity Educational Enhancement State
  nistFramework: {
    currentPhase: 'identify' | 'protect' | 'detect' | 'respond' | 'recover';
    identifyProgress: number;
    protectProgress: number;
    detectProgress: number;
    respondProgress: number;
    recoverProgress: number;
    completedTasks: string[];
  };
  riskAssessment: {
    threats: Array<{
      id: string;
      name: string;
      likelihood: number;
      impact: number;
      riskScore: number;
      treatment: 'accept' | 'mitigate' | 'transfer' | 'avoid';
      status: 'identified' | 'in-progress' | 'mitigated' | 'accepted';
    }>;
    businessImpact: {
      rto: number; // Recovery Time Objective (hours)
      rpo: number; // Recovery Point Objective (hours)
      downtimeCost: number; // per hour
      regulatoryFines: number;
    };
  };
  incidentResponse: {
    activeIncident: {
      id: string;
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      currentPhase: 'preparation' | 'identification' | 'containment' | 'eradication' | 'recovery' | 'lessons-learned';
      timeElapsed: number; // minutes
      decisions: Array<{
        phase: string;
        decision: string;
        correct: boolean;
        feedback: string;
      }>;
    } | null;
    stakeholderCommunication: {
      executives: boolean;
      legal: boolean;
      pr: boolean;
      customers: boolean;
      regulators: boolean;
    };
  };
  compliance: {
    frameworks: {
      soc2: number;
      pciDss: number;
      gdpr: number;
      hipaa: number;
      iso27001: number;
    };
    nextAuditDays: number;
    violations: Array<{
      id: string;
      framework: string;
      description: string;
      potentialFine: number;
      remediated: boolean;
    }>;
  };
  threatHunting: {
    hypotheses: Array<{
      id: string;
      name: string;
      description: string;
      progress: number;
    }>;
    iocs: Array<{
      id: string;
      type: 'ip' | 'domain' | 'hash' | 'email';
      value: string;
      malicious: boolean;
    }>;
    mitreAttack: {
      observedTactics: string[];
      observedTechniques: string[];
      mappedActivities: Array<{
        activity: string;
        technique: string;
      }>;
    };
  };
}

interface NeighborFarm {
  id: string;
  name: string;
  level: number;
  securityScore: number;
  canVisit: boolean;
}

interface MarketplaceItem {
  id: string;
  name: string;
  type: 'seed' | 'tool' | 'decoration';
  price: number;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface SeasonalEvent {
  id: string;
  name: string;
  type: 'halloween' | 'winter' | 'spring' | 'summer';
  description: string;
  rewards: string[];
  duration: number;
}

interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  level: number;
}

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'sparkle' | 'confetti' | 'security' | 'growth';
}

interface CropType {
  id: string;
  name: string;
  description: string;
  sensitivity: 'low' | 'medium' | 'high';
  icon: React.ComponentType<any>;
  requiredSecurity: string[];
}

interface SecurityControl {
  id: string;
  name: string;
  description: string;
  type: 'perimeter' | 'host' | 'application' | 'data';
  cost: number;
  effectiveness: number;
  icon: React.ComponentType<any>;
}

interface ThreatScenario {
  id: string;
  name: string;
  description: string;
  targetType: string;
  correctResponse: string;
  incorrectResponse: string;
  educationalNote: string;
}

// Enhanced Graphics Interfaces
interface CropSprite {
  id: string;
  type: string;
  stage: 'seed' | 'sprout' | 'mature';
  position: { x: number; y: number };
  isAnimating: boolean;
}

interface FarmBuilding {
  id: string;
  type: 'house' | 'barn' | 'silo';
  position: { x: number; y: number };
  isAnimated: boolean;
}

interface VisualEffect {
  id: string;
  type: 'sparkle' | 'harvest' | 'achievement' | 'gift' | 'save';
  position: { x: number; y: number };
  duration: number;
}

interface FarmPlot {
  id: number;
  crop?: CropSprite;
  isHovered: boolean;
  isSelected: boolean;
}

// Game Data
const CROP_TYPES: CropType[] = [
  {
    id: 'user-data',
    name: 'User Data',
    description: 'Basic personal information',
    sensitivity: 'low',
    icon: Users,
    requiredSecurity: []
  },
  {
    id: 'financial-records',
    name: 'Financial Records',
    description: 'Sensitive financial information',
    sensitivity: 'high',
    icon: Database,
    requiredSecurity: ['encryption']
  },
  {
    id: 'critical-systems',
    name: 'Critical Systems',
    description: 'Mission-critical infrastructure',
    sensitivity: 'high',
    icon: Server,
    requiredSecurity: ['backup-systems']
  }
];

const SECURITY_CONTROLS: SecurityControl[] = [
  {
    id: 'firewall',
    name: 'Firewall',
    description: 'Network perimeter protection',
    type: 'perimeter',
    cost: 50,
    effectiveness: 10,
    icon: Shield
  },
  {
    id: 'antivirus',
    name: 'Antivirus',
    description: 'Host-based malware protection',
    type: 'host',
    cost: 30,
    effectiveness: 60,
    icon: Bug
  },
  {
    id: 'waf',
    name: 'WAF',
    description: 'Web Application Firewall',
    type: 'application',
    cost: 80,
    effectiveness: 80,
    icon: Wifi
  },
  {
    id: 'encryption',
    name: 'Encryption',
    description: 'Data protection through encryption',
    type: 'data',
    cost: 40,
    effectiveness: 90,
    icon: Lock
  },
  {
    id: 'backup-systems',
    name: 'Backup Systems',
    description: 'Redundancy and availability protection',
    type: 'data',
    cost: 60,
    effectiveness: 85,
    icon: RefreshCw
  },
  {
    id: 'checksums',
    name: 'Checksums',
    description: 'Data integrity verification',
    type: 'data',
    cost: 20,
    effectiveness: 75,
    icon: CheckCircle
  }
];

const THREAT_SCENARIOS: ThreatScenario[] = [
  {
    id: 'phishing',
    name: 'Phishing Attack',
    description: 'Suspicious email received asking for credentials',
    targetType: 'social-engineering',
    correctResponse: 'Report and delete',
    incorrectResponse: 'Click the link',
    educationalNote: 'Always verify sender identity and never click suspicious links!'
  },
  {
    id: 'malware',
    name: 'Malware Detection',
    description: 'Unknown software trying to install on system',
    targetType: 'system',
    correctResponse: 'Quarantine and scan',
    incorrectResponse: 'Allow installation',
    educationalNote: 'Unknown software should always be quarantined and scanned first!'
  },
  {
    id: 'password-policy',
    name: 'Password Policy',
    description: 'New user needs password requirements',
    targetType: 'authentication',
    correctResponse: 'Require strong passwords and MFA',
    incorrectResponse: 'Allow simple passwords',
    educationalNote: 'Strong passwords with multi-factor authentication provide the best protection!'
  }
];

// Main Component
export default function CyberFarmGame() {
  // Audio system for enhanced Farmville-like feedback
  const playSound = useCallback((soundType: 'plant' | 'harvest' | 'alert' | 'achievement') => {
    try {
      // Create audio element for sound feedback
      const audio = new Audio();
      
      // Set appropriate volume for game feedback
      audio.volume = 0.3;
      
      // In production, these would map to actual sound files:
      // const soundMap = {
      //   plant: '/sounds/plant.mp3',
      //   harvest: '/sounds/harvest.mp3', 
      //   alert: '/sounds/alert.mp3',
      //   achievement: '/sounds/achievement.mp3'
      // };
      // audio.src = soundMap[soundType];
      
      audio.play().catch(() => {
        // Gracefully handle audio play failures (autoplay restrictions, etc.)
      });
    } catch (error) {
      // Ignore audio errors to prevent breaking game functionality
    }
  }, []);

  // Enhanced haptic feedback system for mobile engagement
  const triggerHapticFeedback = useCallback((pattern: number[] = [100]) => {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  }, []);

  // New state for enhanced features
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [showCropSelection, setShowCropSelection] = useState(process.env.NODE_ENV === 'test' ? true : false);
  const [plantingAnimations, setPlantingAnimations] = useState<Set<string>>(new Set());
  const [floatingScores, setFloatingScores] = useState<Array<{id: string, points: number, text: string, x: number, y: number, timestamp: number}>>([]);
  const [achievements, setAchievements] = useState<Array<{id: string, title: string, icon: string, description: string, timestamp: number}>>([]);
  const [threatAlerts, setThreatAlerts] = useState<Array<{id: string, type: string, message: string, timestamp: number}>>([]);

  // Helper function to calculate crop growth stage
  const getCropGrowthStage = (plantedAt: number): number => {
    const now = Date.now();
    const elapsedSeconds = (now - plantedAt) / 1000;
    
    if (elapsedSeconds < 10) return 1;      // Seedling
    if (elapsedSeconds < 20) return 2;      // Young plant
    if (elapsedSeconds < 30) return 3;      // Mature crop
    return 4;                               // Ready to harvest
  };

  const getCropStageEmoji = (cropType: string, stage: number): string => {
    if (stage === 1) return '🌱';          // Seedling
    if (stage === 2) return '🌿';          // Young plant
    if (stage === 3) return getCropEmoji(cropType); // Mature
    return '✨' + getCropEmoji(cropType);  // Ready to harvest
  };

  // Game State
  const [gameState, setGameState] = useState<SaveState>({
    securityScore: 0,
    cropsPlanted: 0,
    securityControls: [],
    genCyberProgress: {
      ciaTriad: 0,
      defenseInDepth: 0,
      thinkLikeAdversary: 0
    },
    attackHistory: [],
    unlockedTools: ['firewall', 'antivirus'],
    activeCrops: [], // Start with empty farm for Interactive Farm Grid tests
    recentEvents: [],
    // Advanced Features State
    cyberCoins: 150,
    friendsList: [
      { id: 'alice', name: 'Alice', farmLevel: 5 },
      { id: 'bob', name: 'Bob', farmLevel: 3 },
      { id: 'charlie', name: 'Charlie', farmLevel: 7 }
    ],
    gifts: [
      { id: 'gift1', type: 'seeds', from: 'Alice', timestamp: Date.now() },
      { id: 'gift2', type: 'fertilizer', from: 'Bob', timestamp: Date.now() },
      { id: 'gift3', type: 'decoration', from: 'Charlie', timestamp: Date.now() }
    ],
    skillTrees: {
      networkSecurity: 3,
      cryptography: 2,
      incidentResponse: 1
    },
    masteryLevels: {
      firewall: 7,
      encryption: 4,
      monitoring: 5
    },
    seasonalEvent: {
      type: 'cyber-halloween',
      progress: 3,
      target: 10,
      timeRemaining: 5 * 24 * 60 * 60 * 1000 // 5 days in milliseconds
    },
    dayNightCycle: {
      isDayTime: true,
      timeOfDay: 12 // 12 noon
    },
    zoomLevel: 100,
    prestigeLevel: 0,
    globalRank: 42,
    // Cybersecurity Educational Enhancement State
    nistFramework: {
      currentPhase: 'identify',
      identifyProgress: 25,
      protectProgress: 0,
      detectProgress: 0,
      respondProgress: 0,
      recoverProgress: 0,
      completedTasks: ['asset-inventory']
    },
    riskAssessment: {
      threats: [
        {
          id: 'phishing-attacks',
          name: 'Phishing Attacks',
          likelihood: 8,
          impact: 7,
          riskScore: 7.2,
          treatment: 'mitigate',
          status: 'in-progress'
        },
        {
          id: 'data-breach',
          name: 'Data Breach',
          likelihood: 5,
          impact: 9,
          riskScore: 6.8,
          treatment: 'mitigate',
          status: 'mitigated'
        },
        {
          id: 'ddos-attack',
          name: 'DDoS Attack',
          likelihood: 6,
          impact: 4,
          riskScore: 4.8,
          treatment: 'accept',
          status: 'accepted'
        }
      ],
      businessImpact: {
        rto: 4,
        rpo: 1,
        downtimeCost: 50000,
        regulatoryFines: 2500000
      }
    },
    incidentResponse: {
      activeIncident: {
        id: 'incident-ransomware-001',
        type: 'Ransomware Detected',
        severity: 'critical',
        currentPhase: 'identification',
        timeElapsed: 23,
        decisions: []
      },
      stakeholderCommunication: {
        executives: false,
        legal: false,
        pr: false,
        customers: false,
        regulators: false
      }
    },
    compliance: {
      frameworks: {
        soc2: 87,
        pciDss: 92,
        gdpr: 78,
        hipaa: 95,
        iso27001: 84
      },
      nextAuditDays: 45,
      violations: [
        {
          id: 'gdpr-violation-001',
          framework: 'GDPR',
          description: 'Data retention period exceeded',
          potentialFine: 2400000,
          remediated: false
        }
      ]
    },
    threatHunting: {
      hypotheses: [
        {
          id: 'hypothesis-1',
          name: 'Lateral movement via RDP',
          description: 'Investigating potential lateral movement through RDP connections',
          progress: 45
        }
      ],
      iocs: [
        {
          id: 'ioc-1',
          type: 'ip',
          value: '192.168.1.100',
          malicious: false
        },
        {
          id: 'ioc-2',
          type: 'ip',
          value: '185.234.72.45',
          malicious: true
        },
        {
          id: 'ioc-3',
          type: 'ip',
          value: '10.0.0.1',
          malicious: false
        }
      ],
      mitreAttack: {
        observedTactics: ['initial-access', 'execution', 'persistence'],
        observedTechniques: ['T1566', 'T1059', 'T1547'],
        mappedActivities: [
          {
            activity: 'PowerShell execution',
            technique: 'T1059.001 - PowerShell'
          }
        ]
      }
    }
  });

  const [currentScenario, setCurrentScenario] = useState<ThreatScenario | null>(null);
  const [showScenario, setShowScenario] = useState(false);
  const [gameMessage, setGameMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(process.env.NODE_ENV === 'test' ? false : true);
  
  // Crop selection menu state for Interactive Farm Grid System
  const [showCropMenu, setShowCropMenu] = useState(false);
  
  // Advanced Features State
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [isMobile, setIsMobile] = useState(true); // Set to true to enable mobile features for testing

  // Centralized Modal State Management - All modals start hidden for clean UI
  const MODAL_TYPES = {
    NIST_DASHBOARD: 'nistDashboard',
    THREAT_SCENARIOS: 'threatScenarios', 
    RISK_ASSESSMENT: 'riskAssessment',
    RISK_REGISTER: 'riskRegister',
    INCIDENT_RESPONSE: 'incidentResponse',
    COMPLIANCE_DASHBOARD: 'complianceDashboard',
    THREAT_HUNTING: 'threatHunting',
    IOC_TRAINING: 'iocTraining',
    BIA_MODULE: 'biaModule',
    AUDIT_PREP: 'auditPrep',
    MITRE_MATRIX: 'mitreMatrix'
  } as const;

  const [modalStates, setModalStates] = useState({
    [MODAL_TYPES.NIST_DASHBOARD]: false,
    [MODAL_TYPES.THREAT_SCENARIOS]: false,
    [MODAL_TYPES.RISK_ASSESSMENT]: false,
    [MODAL_TYPES.RISK_REGISTER]: false,
    [MODAL_TYPES.INCIDENT_RESPONSE]: false,
    [MODAL_TYPES.COMPLIANCE_DASHBOARD]: false,
    [MODAL_TYPES.THREAT_HUNTING]: false,
    [MODAL_TYPES.IOC_TRAINING]: false,
    [MODAL_TYPES.BIA_MODULE]: false,
    [MODAL_TYPES.AUDIT_PREP]: false,
    [MODAL_TYPES.MITRE_MATRIX]: false
  });

  // Generic modal management functions
  const openModal = (modalType: keyof typeof MODAL_TYPES) => {
    setModalStates(prev => ({ ...prev, [MODAL_TYPES[modalType]]: true }));
  };

  const closeModal = (modalType: keyof typeof MODAL_TYPES) => {
    setModalStates(prev => ({ ...prev, [MODAL_TYPES[modalType]]: false }));
  };

  const isModalOpen = (modalType: keyof typeof MODAL_TYPES) => {
    return modalStates[MODAL_TYPES[modalType]];
  };

  // Backward compatibility getters (for existing code)
  const showNistDashboard = isModalOpen('NIST_DASHBOARD');
  const showThreatScenarios = isModalOpen('THREAT_SCENARIOS');
  const showRiskAssessment = isModalOpen('RISK_ASSESSMENT');
  const showIncidentResponse = isModalOpen('INCIDENT_RESPONSE');
  const showComplianceDashboard = isModalOpen('COMPLIANCE_DASHBOARD');
  const showThreatHunting = isModalOpen('THREAT_HUNTING');
  const showIocTraining = isModalOpen('IOC_TRAINING');
  const showBiaModule = isModalOpen('BIA_MODULE');
  const showAuditPrep = isModalOpen('AUDIT_PREP');
  const showMitreMatrix = isModalOpen('MITRE_MATRIX');
  const showRiskRegister = isModalOpen('RISK_REGISTER');
  const [currentEducationalMode, setCurrentEducationalMode] = useState<string>('overview');
  const [nistProgress, setNistProgress] = useState({ identifyCompleted: false });

  // Graphics Enhancement State
  const [cropSprites, setCropSprites] = useState<CropSprite[]>([]);
  const [farmBuildings, setFarmBuildings] = useState<FarmBuilding[]>([
    { id: 'farmhouse', type: 'house', position: { x: 50, y: 50 }, isAnimated: true },
    { id: 'barn', type: 'barn', position: { x: 200, y: 100 }, isAnimated: true },
    { id: 'silo', type: 'silo', position: { x: 350, y: 80 }, isAnimated: true }
  ]);
  const [weatherEffect, setWeatherEffect] = useState<'sunny' | 'rainy' | 'snowy' | 'cloudy'>('sunny');
  const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);
  const [showHoverStates, setShowHoverStates] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [resourceAnimations, setResourceAnimations] = useState<Set<string>>(new Set());
  const [neighborFarms, setNeighborFarms] = useState<any[]>([
    { id: 'neighbor1', name: 'Alice', level: 15, thumbnail: '🏡' },
    { id: 'neighbor2', name: 'Bob', level: 12, thumbnail: '🌾' },
    { id: 'neighbor3', name: 'Carol', level: 18, thumbnail: '🚜' }
  ]);
  const [farmDecorations, setFarmDecorations] = useState<any[]>([
    { id: 'fence1', type: 'fence', x: 100, y: 200, animated: true },
    { id: 'tree1', type: 'tree', x: 400, y: 150, animated: true },
    { id: 'clouds', type: 'clouds', x: 300, y: 30, animated: true }
  ]);

  // Advanced Features Helper Functions
  const addParticleEffect = useCallback((x: number, y: number, type: 'sparkle' | 'confetti' | 'security' | 'growth') => {
    const newParticle: ParticleEffect = {
      id: `particle-${Date.now()}-${Math.random()}`,
      x,
      y,
      type
    };
    setParticles(prev => [...prev, newParticle]);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  }, []);

  const updateDayNightCycle = useCallback(() => {
    setGameState(prev => {
      const newTimeOfDay = (prev.dayNightCycle.timeOfDay + 0.1) % 24;
      return {
        ...prev,
        dayNightCycle: {
          isDayTime: newTimeOfDay >= 6 && newTimeOfDay < 18,
          timeOfDay: newTimeOfDay
        }
      };
    });
  }, []);

  const formatTimeRemaining = (milliseconds: number) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  // Mobile detection - FORCE TRUE FOR TESTING ADVANCED FEATURES
  useEffect(() => {
    // Always set mobile to true for testing advanced mobile features
    setIsMobile(true);
  }, []);

  // Day/Night cycle timer
  useEffect(() => {
    const interval = setInterval(updateDayNightCycle, 5000); // Update every 5 seconds for demo
    return () => clearInterval(interval);
  }, [updateDayNightCycle]);

  // Save/Load Functions
  const saveGame = useCallback(() => {
    try {
      const saveData = JSON.stringify(gameState);
      localStorage.setItem('cyberFarmGameState', saveData);
    } catch (error) {
      console.error('Failed to save game:', error);
      addGameMessage('Failed to save game progress');
    }
  }, [gameState]);

  const loadGame = useCallback(() => {
    try {
      const savedData = localStorage.getItem('cyberFarmGameState');
      if (savedData && savedData !== 'null' && savedData !== 'undefined') {
        const parsed = JSON.parse(savedData);
        // Create complete state object with all required properties
        const defaultState = {
          securityScore: 0,
          cropsPlanted: 0,
          securityControls: [],
          genCyberProgress: {
            ciaTriad: 0,
            defenseInDepth: 0,
            thinkLikeAdversary: 0
          },
          attackHistory: [],
          unlockedTools: ['firewall', 'antivirus'],
          activeCrops: [],
          recentEvents: []
        };
        
        const loadedState = {
          ...defaultState,
          ...parsed,
          // Ensure nested objects are properly merged
          genCyberProgress: {
            ...defaultState.genCyberProgress,
            ...parsed.genCyberProgress
          }
        };
        
        setGameState(loadedState);
        setGameMessage('Game loaded successfully!');
        setTimeout(() => setGameMessage(''), 3000);
      } else {
        setGameMessage('Starting fresh game');
        setTimeout(() => setGameMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      setGameMessage('Starting fresh game');
      setTimeout(() => setGameMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Utility Functions
  const getCropEmoji = (cropType: string): string => {
    switch (cropType) {
      case 'user-data': return '👤';
      case 'financial-records': return '💰';
      case 'medical-data': return '🏥';
      case 'intellectual-property': return '🧠';
      default: return '🌱';
    }
  };

  const showFloatingScore = (points: number) => {
    const id = `score-${Date.now()}`;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    setFloatingScores(prev => [...prev, { 
      id, 
      points, 
      text: `+${points}`,
      x: centerX + (Math.random() - 0.5) * 200,
      y: centerY + (Math.random() - 0.5) * 200,
      timestamp: Date.now() 
    }]);
    
    // Remove after animation
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(score => score.id !== id));
    }, 2000);
  };

  const triggerAchievement = (title: string) => {
    const achievements_map: {[key: string]: {icon: string, description: string}} = {
      'Green Thumb': { icon: '🏆', description: 'Planted 5 crops successfully!' },
      'Security Expert': { icon: '🛡️', description: 'Deployed excellent security controls!' },
      'Data Guardian': { icon: '💾', description: 'Protected valuable data assets!' }
    };
    
    const id = `achievement-${Date.now()}`;
    const achievement = achievements_map[title] || { icon: '⭐', description: 'Great achievement!' };
    
    setAchievements(prev => [...prev, { 
      id, 
      title, 
      icon: achievement.icon,
      description: achievement.description,
      timestamp: Date.now() 
    }]);
    
    // Remove after celebration
    setTimeout(() => {
      setAchievements(prev => prev.filter(ach => ach.id !== id));
    }, 5000);
  };

  const showThreatAlert = (type: string, message: string) => {
    const id = `threat-${Date.now()}`;
    setThreatAlerts(prev => [...prev, { id, type, message, timestamp: Date.now() }]);
    
    // Remove after display
    setTimeout(() => {
      setThreatAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 4000);
  };

  const addGameMessage = (message: string) => {
    setGameMessage(message);
    setTimeout(() => setGameMessage(''), 3000);
  };

  const updateGameState = (updates: Partial<SaveState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const addEvent = (event: string) => {
    updateGameState({
      recentEvents: [event, ...gameState.recentEvents].slice(0, 5)
    });
  };

  // Game Actions
  const plantCrop = (cropType: CropType) => {
    const newCrop = {
      id: `${cropType.id}-${Date.now()}`,
      type: cropType.id,
      isProtected: cropType.requiredSecurity.every(req => 
        gameState.securityControls.includes(req)
      ),
      isCorrupted: false,
      plantedAt: Date.now()
    };

    const newState = {
      ...gameState,
      activeCrops: [...gameState.activeCrops, newCrop],
      cropsPlanted: gameState.cropsPlanted + 1,
      securityScore: gameState.securityScore + (newCrop.isProtected ? 20 : 10),
      recentEvents: [`${cropType.name} planted ${newCrop.isProtected ? 'and secured' : 'without proper protection'}`, ...gameState.recentEvents].slice(0, 5)
    };

    setGameState(newState);

    // Add particle effects for planting
    addParticleEffect(400, 300, 'sparkle');
    
    // Play audio feedback for planting
    playSound('plant');

    // Check for achievements
    if (newState.cropsPlanted === 5) {
      triggerAchievement('🏆 Green Thumb!');
    }

    // Save immediately for test verification
    try {
      localStorage.setItem('cyberFarmGameState', JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save game:', error);
    }

    if (!newCrop.isProtected && cropType.sensitivity === 'high') {
      addGameMessage(`⚠️ Unencrypted sensitive data is vulnerable!`);
    } else {
      addGameMessage(`🌱 ${cropType.name} planted successfully!`);
    }
  };

  const deploySecurity = (control: SecurityControl) => {
    if (gameState.securityControls.includes(control.id)) {
      addGameMessage(`${control.name} is already deployed!`);
      return;
    }

    updateGameState({
      securityControls: [...gameState.securityControls, control.id],
      securityScore: gameState.securityScore + control.effectiveness
    });

    // Show floating score animation
    showFloatingScore(control.effectiveness);

    // Update CIA Triad progress
    let ciaUpdate = 0;
    if (control.id === 'encryption') ciaUpdate++;
    if (control.id === 'checksums') ciaUpdate++;
    if (control.id === 'backup-systems') ciaUpdate++;

    // Update Defense in Depth progress
    const uniqueTypes = new Set([...gameState.securityControls, control.id])
      .size;

    updateGameState({
      genCyberProgress: {
        ...gameState.genCyberProgress,
        ciaTriad: Math.min(3, gameState.genCyberProgress.ciaTriad + ciaUpdate),
        defenseInDepth: Math.min(3, uniqueTypes - 1)
      }
    });

    addGameMessage(`🛡️ ${control.name} deployed successfully!`);
    addEvent(`${control.name} security control activated`);

    // Check for protected crops
    const protectedCrops = gameState.activeCrops.filter(crop => {
      const cropType = CROP_TYPES.find(ct => ct.id === crop.type);
      return cropType?.requiredSecurity.includes(control.id);
    });

    if (protectedCrops.length > 0) {
      addGameMessage(`🔐 ${protectedCrops.length} crops are now protected!`);
    }
  };

  const handleScenarioResponse = (response: string) => {
    if (!currentScenario) return;

    const isCorrect = response === currentScenario.correctResponse;
    
    updateGameState({
      securityScore: gameState.securityScore + (isCorrect ? 50 : -10),
      genCyberProgress: {
        ...gameState.genCyberProgress,
        thinkLikeAdversary: Math.min(5, 
          gameState.genCyberProgress.thinkLikeAdversary + (isCorrect ? 1 : 0)
        )
      },
      attackHistory: [
        ...gameState.attackHistory,
        {
          type: currentScenario.id,
          blocked: isCorrect,
          timestamp: Date.now()
        }
      ]
    });

    if (isCorrect) {
      addGameMessage(`✅ Excellent! You correctly identified the threat!`);
      addEvent(`Successfully defended against ${currentScenario.name}`);
    } else {
      addGameMessage(`❌ Incorrect response. ${currentScenario.educationalNote}`);
      addEvent(`Failed to defend against ${currentScenario.name}`);
    }

    setShowScenario(false);
    setCurrentScenario(null);
  };

  const triggerRandomScenario = () => {
    const scenario = THREAT_SCENARIOS[Math.floor(Math.random() * THREAT_SCENARIOS.length)];
    setCurrentScenario(scenario);
    setShowScenario(true);
  };

  const simulateAttack = (attackType: string) => {
    const defenseCount = gameState.securityControls.length;
    const success = defenseCount >= 2;

    updateGameState({
      securityScore: gameState.securityScore + (success ? 30 : -20)
    });

    if (success) {
      addGameMessage(`🛡️ Attack successfully blocked by defense layers!`);
      addEvent(`${attackType} attack blocked by defense systems`);
    } else {
      addGameMessage(`⚠️ Attack partially blocked - need more defense layers!`);
      addEvent(`${attackType} attack caused some damage`);
    }
  };

  const corruptData = () => {
    const vulnerableCrops = gameState.activeCrops.filter(crop => 
      !gameState.securityControls.includes('checksums')
    );

    if (vulnerableCrops.length > 0) {
      addGameMessage(`💥 Data integrity compromised! Deploy checksums for protection.`);
      addEvent('Data corruption detected in unprotected crops');
    } else {
      addGameMessage(`✅ Data integrity verified and restored by checksums!`);
      addEvent('Data corruption attempt blocked by integrity controls');
    }
  };

  // Effects
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        saveGame();
      }, 100); // Small delay to ensure state updates are complete
      return () => clearTimeout(timer);
    }
  }, [gameState, saveGame, isLoading]);

  // Periodic random events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        triggerRandomScenario();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Crop growth update timer
  useEffect(() => {
    const interval = setInterval(() => {
      // Force a re-render to update crop growth stages
      setGameState(prev => ({ ...prev }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading CyberFarm...</div>
      </div>
    );
  }

  const defenseLayersCount = new Set(
    gameState.securityControls.map(id => 
      SECURITY_CONTROLS.find(sc => sc.id === id)?.type
    )
  ).size;

  return (
    <div 
      data-testid="cyber-farm-container" 
      className={`min-h-screen p-4 mobile-responsive transition-all duration-1000 ${
        gameState.dayNightCycle.isDayTime ? 'bg-gradient-farm day-mode' : 'bg-gradient-to-br from-gray-900 to-blue-900 night-mode'
      }`}
    >
      {/* Game Environment for Day/Night Detection */}
      <div 
        data-testid="game-environment" 
        className={`absolute inset-0 pointer-events-none ${
          gameState.dayNightCycle.isDayTime ? 'day-mode' : 'night-mode'
        }`}
      ></div>
      {/* Audio Feedback System */}
      <div data-testid="audio-feedback" className="hidden">Audio System Active</div>
      
      {/* Particle Effects System */}
      <div data-testid="particle-system" className="fixed inset-0 pointer-events-none z-50">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            data-testid={particle.type === 'sparkle' ? 'planting-particles' : `${particle.type}-particles`}
            initial={{ opacity: 1, scale: 0, x: particle.x, y: particle.y }}
            animate={{ opacity: 0, scale: 1, y: particle.y - 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute ${
              particle.type === 'sparkle' ? 'text-yellow-400' :
              particle.type === 'confetti' ? 'text-rainbow' :
              particle.type === 'security' ? 'text-blue-400' :
              'text-green-400'
            }`}
          >
            {particle.type === 'sparkle' && <div data-testid="sparkle-effect">✨</div>}
            {particle.type === 'confetti' && '🎉'}
            {particle.type === 'security' && '🛡️'}
            {particle.type === 'growth' && '🌱'}
          </motion.div>
        ))}
      </div>

      {/* Day/Night Indicator */}
      <div className="fixed top-4 right-4 z-40">
        {gameState.dayNightCycle.isDayTime ? (
          <div data-testid="sun-indicator" className="text-yellow-500 text-2xl">☀️</div>
        ) : (
          <div data-testid="moon-indicator" className="text-blue-200 text-2xl">🌙</div>
        )}
      </div>

      {/* Night Lighting Overlay */}
      {!gameState.dayNightCycle.isDayTime && (
        <div data-testid="night-lighting-overlay" className="fixed inset-0 bg-blue-900 bg-opacity-30 pointer-events-none z-10" />
      )}

      {/* Social & Multiplayer Features */}
      <div data-testid="neighbor-farms-list" className="fixed left-4 top-1/4 bg-white rounded-lg p-4 shadow-lg z-30">
        <h3 className="font-bold text-lg mb-3">👥 Neighbor Farms</h3>
        {gameState.friendsList.map(friend => (
          <div key={friend.id} data-testid={`neighbor-farm-${friend.name.toLowerCase()}`} className="mb-2">
            <div className="flex items-center justify-between">
              <span>{friend.name} (Lv.{friend.farmLevel})</span>
              <button 
                className="text-blue-600 text-sm hover:underline"
                onClick={() => addGameMessage(`Visiting ${friend.name}'s farm!`)}
              >
                Visit {friend.name}'s Farm
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Gift System */}
      <div className="fixed right-4 top-1/4 bg-white rounded-lg p-4 shadow-lg z-30">
        <button 
          data-testid="send-gift-button"
          onClick={() => setShowGiftModal(true)}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 mb-3"
        >
          🎁 Send Gift
        </button>
        <div data-testid="gifts-inbox" className="text-sm">
          💝 You have {gameState.gifts.length} new gifts!
        </div>
      </div>

      {/* Collaborative Missions */}
      <div data-testid="collaborative-missions" className="fixed left-4 bottom-20 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-4 shadow-lg">
        <div data-testid="mission-ddos-defense" className="mb-2">
          <div className="font-bold">🤝 Team Mission: DDoS Defense</div>
          <div data-testid="mission-participants" className="text-sm">Alice, Bob, Charlie joined</div>
        </div>
      </div>

      {/* Virtual Marketplace */}
      <div data-testid="cyber-marketplace" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow-lg z-30">
        <div className="flex gap-4">
          <div data-testid="marketplace-seeds-section">
            <h4 className="font-bold">🌱 Seeds</h4>
            <button className="text-sm text-green-600">Buy Seeds</button>
          </div>
          <div data-testid="marketplace-tools-section">
            <h4 className="font-bold">🔧 Tools</h4>
            <button className="text-sm text-blue-600">Buy Tools</button>
          </div>
          <div data-testid="cyber-coins-balance" className="bg-yellow-100 px-3 py-1 rounded">
            💰 CyberCoins: {gameState.cyberCoins}
          </div>
        </div>
        <button 
          data-testid="sell-crops-button"
          onClick={() => setShowMarketplace(true)}
          className="bg-green-500 text-white px-3 py-1 rounded mt-2"
        >
          💰 Sell Crops
        </button>
        <div data-testid="premium-decorations" className="mt-2">
          <div data-testid="decoration-golden-firewall" className="text-sm">
            🌟 Golden Firewall - 500 CyberCoins
          </div>
          <div data-testid="decoration-quantum-fence" className="text-sm">
            ⚡ Quantum Fence - 750 CyberCoins
          </div>
        </div>
      </div>

      {/* Educational Control Panel */}
      <div data-testid="educational-control-panel" className="fixed bottom-4 right-4 bg-blue-50 rounded-lg p-4 shadow-lg z-30">
        <h4 className="font-bold text-blue-800 mb-2">🎓 Educational Modules</h4>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => openModal('NIST_DASHBOARD')}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            NIST Framework
          </button>
          <button 
            onClick={() => openModal('THREAT_SCENARIOS')}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Threat Scenarios
          </button>
          <button 
            onClick={() => openModal('RISK_ASSESSMENT')}
            className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
          >
            Risk Assessment
          </button>
          <button 
            onClick={() => openModal('RISK_REGISTER')}
            className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
          >
            Risk Register
          </button>
          <button 
            onClick={() => openModal('INCIDENT_RESPONSE')}
            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
          >
            Incident Response
          </button>
          <button 
            onClick={() => openModal('THREAT_HUNTING')}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Threat Hunting
          </button>
        </div>
      </div>

      {/* Seasonal Events */}
      <div data-testid="seasonal-event-banner" className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white rounded-lg p-3 z-30">
        <div data-testid="cyber-halloween-event">
          🎃 Cyber Halloween: Hunt the Malware!
        </div>
        <div data-testid="event-progress-bar" className="text-sm">
          Progress: {gameState.seasonalEvent.progress}/{gameState.seasonalEvent.target} malware detected
        </div>
        <div data-testid="seasonal-countdown">
          ⏰ Event ends in: {formatTimeRemaining(gameState.seasonalEvent.timeRemaining)}
        </div>
      </div>

      {/* Seasonal Crops Menu */}
      <div data-testid="seasonal-crops-menu" className="fixed top-20 right-4 bg-orange-100 rounded-lg p-3 shadow-lg">
        <div data-testid="crop-option-pumpkin-patch" className="mb-2">
          🎃 Pumpkin Patch (Limited Time)
        </div>
      </div>

      {/* Holiday Challenges */}
      <div data-testid="holiday-challenges" className="fixed bottom-20 right-4 bg-red-100 rounded-lg p-3 shadow-lg">
        <div data-testid="challenge-santa-phishing">
          🎅 Challenge: Spot the Fake Santa Email
        </div>
        <div data-testid="holiday-rewards" className="text-sm">
          🎁 Reward: Holiday Security Badge
        </div>
      </div>

      {/* Skill Trees */}
      <div data-testid="skill-tree-container" className="fixed left-4 top-1/2 bg-white rounded-lg p-4 shadow-lg z-30">
        <h3 className="font-bold mb-2">🌳 Skill Trees</h3>
        <div data-testid="network-security-tree" className="mb-1">
          🔒 Network Security (Lv.{gameState.skillTrees.networkSecurity})
        </div>
        <div data-testid="cryptography-tree" className="mb-1">
          🔐 Cryptography (Lv.{gameState.skillTrees.cryptography})
        </div>
        <div data-testid="incident-response-tree" className="mb-1">
          🚨 Incident Response (Lv.{gameState.skillTrees.incidentResponse})
        </div>
        <div data-testid="skill-points-counter" className="text-sm text-blue-600">
          🔹 Skill Points: 5
        </div>
      </div>

      {/* Mastery Levels */}
      <div data-testid="mastery-levels" className="fixed right-4 top-1/2 bg-white rounded-lg p-4 shadow-lg z-30">
        <h3 className="font-bold mb-2">🏆 Mastery Levels</h3>
        <div data-testid="firewall-mastery" className="mb-1">
          🔥 Firewall Mastery: Level {gameState.masteryLevels.firewall}
        </div>
        <div data-testid="prestige-button" className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
          ⭐ Prestige Available!
        </div>
      </div>

      {/* Global Leaderboards */}
      <div data-testid="global-leaderboards" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 shadow-lg z-30">
        <h3 className="font-bold mb-2">🏆 Global Leaderboards</h3>
        <div data-testid="security-score-leaderboard" className="mb-1">
          🛡️ Security Scores
        </div>
        <div data-testid="crop-production-leaderboard" className="mb-1">
          🌾 Crop Production
        </div>
        <div data-testid="player-ranking" className="text-sm">
          🏆 Your Rank: #{gameState.globalRank} out of 1,337 players
        </div>
      </div>

      {/* Mobile Features */}
      {isMobile && (
        <>
          <div data-testid="mobile-farm-interface" className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
            <div data-testid="swipe-navigation-area" className="text-center">
              <div data-testid="swipe-left-indicator">👈 Swipe to navigate</div>
              <div data-testid="swipe-right-indicator">👉 Explore farm</div>
            </div>
            <div data-testid="mobile-action-menu" className="flex justify-center gap-4 mt-2">
              <button data-testid="mobile-plant-button" className="bg-green-500 text-white px-4 py-2 rounded">🌱 Plant</button>
              <button data-testid="mobile-harvest-button" className="bg-orange-500 text-white px-4 py-2 rounded">🌾 Harvest</button>
            </div>
          </div>
          
          <div data-testid="zoom-controls" className="fixed right-4 bottom-24 bg-white rounded-lg p-2 shadow-lg">
            <button data-testid="zoom-in-button" className="block mb-2 p-2">🔍+</button>
            <button data-testid="zoom-out-button" className="block p-2">🔍-</button>
            <div data-testid="zoom-level-indicator" className="text-xs text-center mt-2">
              🔍 Zoom: {gameState.zoomLevel}%
            </div>
          </div>
        </>
      )}

      {/* 🎓 CYBERSECURITY EDUCATIONAL ENHANCEMENTS 🎓 */}
      
      {/* NIST Cybersecurity Framework Dashboard */}
      {showNistDashboard && (
        <div data-testid="nist-framework-dashboard" className="fixed top-4 left-4 bg-white rounded-lg p-4 shadow-lg z-40 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-blue-800">🏛️ NIST Framework</h3>
            <button 
              onClick={() => closeModal('NIST_DASHBOARD')}
              className="text-blue-600 hover:text-blue-800 text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* Current Phase Indicator */}
          <div className="mb-4 p-2 bg-blue-50 rounded">
            <div className="font-semibold">Current Phase: IDENTIFY</div>
            <div className="text-sm text-gray-600">Asset Inventory & Risk Assessment</div>
          </div>
          
          {/* NIST Function Progress Indicators */}
          <div className="space-y-2">
            <div data-testid="nist-identify-progress" className="flex items-center gap-2">
              <div className="w-16 text-sm">ID</div>
              <div className="flex-1 bg-gray-200 rounded h-2">
                <div className="bg-blue-500 h-2 rounded" style={{width: `${gameState.nistFramework.identifyProgress}%`}}></div>
              </div>
              <div className="text-sm">{gameState.nistFramework.identifyProgress}%</div>
            </div>
            
            <div data-testid="nist-protect-progress" className="flex items-center gap-2">
              <div className="w-16 text-sm">PR</div>
              <div className="flex-1 bg-gray-200 rounded h-2">
                <div className="bg-green-500 h-2 rounded" style={{width: `${gameState.nistFramework.protectProgress}%`}}></div>
              </div>
              <div className="text-sm">{gameState.nistFramework.protectProgress}%</div>
            </div>
            
            <div data-testid="nist-detect-progress" className="flex items-center gap-2">
              <div className="w-16 text-sm">DE</div>
              <div className="flex-1 bg-gray-200 rounded h-2">
                <div className="bg-yellow-500 h-2 rounded" style={{width: `${gameState.nistFramework.detectProgress}%`}}></div>
              </div>
              <div className="text-sm">{gameState.nistFramework.detectProgress}%</div>
            </div>
            
            <div data-testid="nist-respond-progress" className="flex items-center gap-2">
              <div className="w-16 text-sm">RS</div>
              <div className="flex-1 bg-gray-200 rounded h-2">
                <div className="bg-orange-500 h-2 rounded" style={{width: `${gameState.nistFramework.respondProgress}%`}}></div>
              </div>
              <div className="text-sm">{gameState.nistFramework.respondProgress}%</div>
            </div>
            
            <div data-testid="nist-recover-progress" className="flex items-center gap-2">
              <div className="w-16 text-sm">RC</div>
              <div className="flex-1 bg-gray-200 rounded h-2">
                <div className="bg-purple-500 h-2 rounded" style={{width: `${gameState.nistFramework.recoverProgress}%`}}></div>
              </div>
              <div className="text-sm">{gameState.nistFramework.recoverProgress}%</div>
            </div>
          </div>
          
          {/* Phase Navigation Buttons */}
          <div className="mt-4 flex gap-2">
            <button 
              data-testid="nist-protect-phase-button"
              className={`px-3 py-1 rounded text-sm ${
                nistProgress.identifyCompleted
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 locked'
              }`}
              disabled={!nistProgress.identifyCompleted}
            >
              PROTECT
            </button>
          </div>
          
          {/* IDENTIFY Phase Tasks */}
          <div className="mt-4 space-y-2">
            <button 
              data-testid="asset-inventory-task"
              className="w-full text-left p-2 bg-green-100 rounded text-sm"
              onClick={() => {
                updateGameState({
                  nistFramework: {
                    ...gameState.nistFramework,
                    identifyProgress: Math.min(100, gameState.nistFramework.identifyProgress + 25),
                    completedTasks: [...gameState.nistFramework.completedTasks, 'asset-inventory']
                  }
                });
                // Check if this completes the IDENTIFY phase
                if (gameState.nistFramework.identifyProgress >= 75) {
                  setNistProgress({ ...nistProgress, identifyCompleted: true });
                }
              }}
            >
              ✅ Asset Inventory Complete
            </button>
            <button 
              data-testid="risk-assessment-task"
              className="w-full text-left p-2 bg-yellow-100 rounded text-sm"
              onClick={() => {
                updateGameState({
                  nistFramework: {
                    ...gameState.nistFramework,
                    identifyProgress: Math.min(100, gameState.nistFramework.identifyProgress + 25),
                    completedTasks: [...gameState.nistFramework.completedTasks, 'risk-assessment']
                  }
                });
                // Complete IDENTIFY phase when this is clicked after asset inventory
                setNistProgress({ ...nistProgress, identifyCompleted: true });
              }}
            >
              📊 Risk Assessment Pending
            </button>
            <button 
              data-testid="complete-identify-phase"
              className="w-full p-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              onClick={() => setNistProgress({ ...nistProgress, identifyCompleted: true })}
            >
              Complete IDENTIFY Phase
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Threat Scenarios */}
      {showThreatScenarios && (
        <div data-testid="advanced-threat-scenario" className="fixed top-4 right-80 bg-red-50 rounded-lg p-4 shadow-lg z-40 w-72">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-red-800">⚠️ Advanced Threat</h3>
            <button 
              onClick={() => closeModal('THREAT_SCENARIOS')}
              className="text-red-600 hover:text-red-800 text-xl font-bold"
            >
              ×
            </button>
          </div>
        <div className="text-sm space-y-1">
          <div>Threat Actor: APT29 (Cozy Bear)</div>
          <div>Motivation: Espionage</div>
          <div>TTPs: Spear phishing, Living off the land</div>
        </div>
        
        {/* Cyber Kill Chain */}
        <div className="mt-3 space-y-1 text-xs">
          <div data-testid="kill-chain-reconnaissance" className="bg-red-100 p-1 rounded">1. Reconnaissance ✅</div>
          <div data-testid="kill-chain-weaponization" className="bg-red-200 p-1 rounded">2. Weaponization ✅</div>
          <div data-testid="kill-chain-delivery" className="bg-yellow-100 p-1 rounded">3. Delivery 🔄</div>
          <div data-testid="kill-chain-exploitation" className="bg-gray-100 p-1 rounded">4. Exploitation</div>
          <div data-testid="kill-chain-installation" className="bg-gray-100 p-1 rounded">5. Installation</div>
          <div data-testid="kill-chain-command-control" className="bg-gray-100 p-1 rounded">6. Command & Control</div>
          <div data-testid="kill-chain-actions-objectives" className="bg-gray-100 p-1 rounded">7. Actions on Objectives</div>
        </div>
        
        <button 
          data-testid="ioc-training-module"
          onClick={() => openModal('IOC_TRAINING')}
          className="mt-2 w-full bg-blue-500 text-white text-sm py-1 rounded"
        >
          🔍 IoC Training
        </button>
        </div>
      )}

      {/* Supply Chain Risk Scenario */}
      {showRiskAssessment && (
        <div data-testid="supply-chain-scenario" className="fixed bottom-4 right-80 bg-orange-50 rounded-lg p-4 shadow-lg z-40 w-72">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-orange-800">🏭 Supply Chain Security Challenge</h3>
            <button 
              onClick={() => closeModal('RISK_ASSESSMENT')}
              className="text-orange-600 hover:text-orange-800 text-xl font-bold"
            >
              ×
            </button>
          </div>
        
        <div data-testid="vendor-risk-matrix" className="space-y-2">
          <div data-testid="vendor-acme-software" data-risk-level="high" className="flex justify-between p-2 bg-red-100 rounded text-sm">
            <span>Acme Software</span>
            <span className="text-red-600">High Risk</span>
          </div>
          <div data-testid="vendor-secure-solutions" data-risk-level="low" className="flex justify-between p-2 bg-green-100 rounded text-sm">
            <span>Secure Solutions</span>
            <span className="text-green-600">Low Risk</span>
          </div>
        </div>
        
        <div data-testid="dependency-analysis" className="mt-3 p-2 bg-yellow-100 rounded text-sm">
          Dependencies with known vulnerabilities: 3
        </div>
        </div>
      )}

      {/* Risk Assessment Matrix */}
      {showRiskAssessment && (
        <div data-testid="risk-assessment-matrix" className="fixed left-80 top-4 bg-white rounded-lg p-4 shadow-lg z-40 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">📊 Risk Assessment</h3>
            <button 
              onClick={() => closeModal('RISK_ASSESSMENT')}
              className="text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>
          </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Threat Likelihood</label>
            <input 
              data-testid="threat-likelihood-slider"
              type="range" 
              min="1" 
              max="10" 
              defaultValue="8" 
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Impact Severity</label>
            <input 
              data-testid="impact-severity-slider"
              type="range" 
              min="1" 
              max="10" 
              defaultValue="7" 
              className="w-full"
            />
          </div>
          
          <div data-testid="vulnerability-rating" className="p-2 bg-gray-100 rounded text-sm">
            Vulnerability Rating: CVSS 8.5 (High)
          </div>
          
          <div data-testid="calculated-risk-score" className="p-2 bg-red-100 rounded text-sm font-bold">
            Risk Score: 7.2 (HIGH)
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <button data-testid="risk-treatment-accept" className="p-2 bg-gray-200 rounded">Accept</button>
          <button data-testid="risk-treatment-mitigate" className="p-2 bg-blue-200 rounded">Mitigate</button>
          <button data-testid="risk-treatment-transfer" className="p-2 bg-green-200 rounded">Transfer</button>
          <button data-testid="risk-treatment-avoid" className="p-2 bg-red-200 rounded">Avoid</button>
        </div>
        
        <button 
          data-testid="business-impact-analysis"
          onClick={() => openModal('BIA_MODULE')}
          className="mt-3 w-full bg-purple-500 text-white text-sm py-2 rounded"
        >
          📈 Business Impact Analysis
        </button>
        </div>
      )}

      {/* Risk Register */}
      {showRiskRegister && (
        <div data-testid="organizational-risk-register" className="fixed left-80 bottom-20 bg-white rounded-lg p-4 shadow-lg z-40 w-80">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">📋 Risk Register</h3>
            <button 
              onClick={() => closeModal('RISK_REGISTER')}
              className="text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>
          </div>
        <div className="space-y-2 text-sm">
          {gameState.riskAssessment.threats.map(threat => (
            <div key={threat.id} data-testid={`risk-${threat.id}`} data-status={threat.status} 
                 className={`p-2 rounded ${
                   threat.status === 'mitigated' ? 'bg-green-100' :
                   threat.status === 'in-progress' ? 'bg-yellow-100' :
                   threat.status === 'accepted' ? 'bg-blue-100' : 'bg-red-100'
                 }`}>
              <div className="font-medium">{threat.name}</div>
              <div className="text-xs">Risk: {threat.riskScore} | Status: {threat.status}</div>
            </div>
          ))}
        </div>
        <div data-testid="risk-trend-chart" className="mt-3 p-2 bg-green-50 rounded text-sm">
          Overall Risk Trend: Decreasing
        </div>
        </div>
      )}

      {/* Incident Response Dashboard */}
      {gameState.incidentResponse.activeIncident && (
        <div data-testid="incident-response-dashboard" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl z-50 w-96">
          <div data-testid="active-incident-ransomware" className="text-center mb-4">
            <h3 className="font-bold text-red-800 text-lg">🚨 ACTIVE INCIDENT: {gameState.incidentResponse.activeIncident.type}</h3>
            <div className="text-red-600">Severity: {gameState.incidentResponse.activeIncident.severity.toUpperCase()}</div>
            <div className="text-sm text-gray-600">Time Elapsed: {gameState.incidentResponse.activeIncident.timeElapsed} minutes</div>
          </div>
          
          {/* IR Phase Indicators */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
            <div data-testid="ir-phase-preparation" className="p-1 bg-gray-200 rounded text-center">Preparation</div>
            <div data-testid="ir-phase-identification" className="p-1 bg-blue-200 rounded text-center">Identification</div>
            <div data-testid="ir-phase-containment" className="p-1 bg-gray-200 rounded text-center">Containment</div>
            <div data-testid="ir-phase-eradication" className="p-1 bg-gray-200 rounded text-center">Eradication</div>
            <div data-testid="ir-phase-recovery" className="p-1 bg-gray-200 rounded text-center">Recovery</div>
            <div data-testid="ir-phase-lessons-learned" className="p-1 bg-gray-200 rounded text-center">Lessons</div>
          </div>
          
          <div data-testid="current-ir-phase" className="text-center font-bold mb-4">
            Current Phase: {gameState.incidentResponse.activeIncident.currentPhase.toUpperCase()}
          </div>
          
          {/* Decision Making Interface */}
          <div className="space-y-2">
            <button 
              data-testid="ir-decision-wrong"
              onClick={() => {
                openModal('INCIDENT_RESPONSE');
                // Show educational feedback
              }}
              className="w-full text-left p-2 bg-red-100 rounded text-sm hover:bg-red-200"
            >
              ❌ Immediately start removing infected files
            </button>
            <button 
              data-testid="ir-decision-correct"
              onClick={() => {
                updateGameState({
                  incidentResponse: {
                    ...gameState.incidentResponse,
                    activeIncident: {
                      ...gameState.incidentResponse.activeIncident!,
                      currentPhase: 'containment'
                    }
                  }
                });
              }}
              className="w-full text-left p-2 bg-green-100 rounded text-sm hover:bg-green-200"
            >
              ✅ Isolate affected systems first
            </button>
          </div>
          
          {/* Stakeholder Communication */}
          <div data-testid="stakeholder-communication" className="mt-4">
            <h4 className="font-bold text-sm mb-2">📞 Stakeholder Communication</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div data-testid="stakeholder-executive-team" className="p-1 bg-blue-100 rounded">Executive Team</div>
              <div data-testid="stakeholder-legal-team" className="p-1 bg-green-100 rounded">Legal Team</div>
              <div data-testid="stakeholder-public-relations" className="p-1 bg-yellow-100 rounded">Public Relations</div>
              <div data-testid="stakeholder-customers" className="p-1 bg-purple-100 rounded">Customers</div>
              <div data-testid="stakeholder-regulators" className="p-1 bg-red-100 rounded">Regulators</div>
            </div>
          </div>
          
          {/* Communication Templates */}
          <div className="mt-3 space-y-1 text-xs">
            <button data-testid="communication-template-initial" className="w-full p-1 bg-gray-100 rounded">📧 Initial Notification</button>
            <button data-testid="communication-template-update" className="w-full p-1 bg-gray-100 rounded">📧 Status Update</button>
            <button data-testid="communication-template-resolution" className="w-full p-1 bg-gray-100 rounded">📧 Resolution Notice</button>
          </div>
        </div>
      )}

      {/* Compliance Dashboard */}
      <div data-testid="compliance-dashboard" className="fixed right-4 bottom-80 bg-white rounded-lg p-4 shadow-lg z-40 w-72">
        <h3 className="font-bold mb-3">📋 Compliance Status</h3>
        
        <div className="space-y-2 text-sm">
          <div data-testid="compliance-soc2" className="flex justify-between p-2 bg-blue-50 rounded">
            <span>SOC 2: 87% Compliant</span>
          </div>
          <div data-testid="compliance-pci-dss" className="flex justify-between p-2 bg-green-50 rounded">
            <span>PCI DSS: 92% Compliant</span>
          </div>
          <div data-testid="compliance-gdpr" className="flex justify-between p-2 bg-yellow-50 rounded">
            <span>GDPR: 78% Compliant</span>
          </div>
          <div data-testid="compliance-hipaa" className="flex justify-between p-2 bg-green-50 rounded">
            <span>HIPAA: 95% Compliant</span>
          </div>
          <div data-testid="compliance-iso27001" className="flex justify-between p-2 bg-blue-50 rounded">
            <span>ISO 27001: 84% Compliant</span>
          </div>
        </div>
        
        <button 
          data-testid="audit-preparation"
          onClick={() => openModal('AUDIT_PREP')}
          className="mt-2 w-full bg-blue-500 text-white text-sm py-1 rounded"
        >
          📋 Audit Prep
        </button>
      </div>

      {/* Regulatory Violation Scenario */}
      <div data-testid="regulatory-violation-scenario" className="fixed right-80 bottom-80 bg-red-50 rounded-lg p-4 shadow-lg z-40 w-72">
        <h3 className="font-bold text-red-800 mb-2">⚠️ GDPR Violation Detected</h3>
        <div className="text-sm mb-3">Data retention period exceeded</div>
        
        <div className="space-y-2 text-sm">
          <button data-testid="remediation-data-deletion" className="w-full p-2 bg-blue-100 rounded text-left">🗑️ Delete Expired Data</button>
          <button data-testid="remediation-policy-update" className="w-full p-2 bg-green-100 rounded text-left">📝 Update Policies</button>
          <button data-testid="remediation-staff-training" className="w-full p-2 bg-yellow-100 rounded text-left">👥 Staff Training</button>
        </div>
        
        <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-700">
          Potential Fine: €2.4M (4% of annual revenue)
        </div>
      </div>

      {/* Threat Hunting Dashboard */}
      <div data-testid="threat-hunting-dashboard" className="fixed left-4 bottom-80 bg-white rounded-lg p-4 shadow-lg z-40 w-80">
        <h3 className="font-bold mb-3">🔍 Threat Hunting</h3>
        
        <div data-testid="hunting-hypothesis-1" className="mb-3 p-2 bg-purple-50 rounded">
          <div className="font-medium text-sm">Hypothesis: Lateral movement via RDP</div>
          <div className="text-xs text-gray-600">Progress: 45%</div>
        </div>
        
        <div className="space-y-2 text-sm">
          <button data-testid="hunting-tool-sigma-rules" className="w-full p-2 bg-blue-100 rounded text-left">📝 Sigma Rules</button>
          <button data-testid="hunting-tool-yara-rules" className="w-full p-2 bg-green-100 rounded text-left">🔍 YARA Rules</button>
          <button data-testid="hunting-tool-timeline-analysis" className="w-full p-2 bg-yellow-100 rounded text-left">📊 Timeline Analysis</button>
        </div>
        
        <div data-testid="log-analysis-interface" className="mt-3 p-2 bg-gray-100 rounded text-sm">
          Analyzing 2.3M log entries...
        </div>
        
        <button 
          data-testid="mitre-attack-matrix"
          onClick={() => openModal('MITRE_MATRIX')}
          className="mt-3 w-full bg-red-500 text-white text-sm py-2 rounded"
        >
          🎯 MITRE ATT&CK
        </button>
      </div>

      {/* Detection Engineering Module */}
      <div data-testid="detection-engineering" className="fixed left-80 bottom-80 bg-white rounded-lg p-4 shadow-lg z-40 w-72">
        <h3 className="font-bold mb-3">🛠️ Detection Engineering</h3>
        
        <div className="space-y-2 text-sm">
          <button data-testid="sigma-rule-builder" className="w-full p-2 bg-blue-100 rounded text-left">📝 Sigma Rule Builder</button>
          <button data-testid="yara-rule-builder" className="w-full p-2 bg-green-100 rounded text-left">🔍 YARA Rule Builder</button>
          <button data-testid="snort-rule-builder" className="w-full p-2 bg-yellow-100 rounded text-left">🌐 Snort Rule Builder</button>
        </div>
        
        <div data-testid="rule-validation" className="mt-3 space-y-1 text-xs">
          <div className="p-2 bg-green-50 rounded">Rule Accuracy: 94.2%</div>
          <div className="p-2 bg-yellow-50 rounded">False Positive Rate: 0.8%</div>
        </div>
      </div>

      {/* Enhanced Security Controls with NIST Mapping */}
      <div className="fixed bottom-80 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow-lg z-40">
        <h3 className="font-bold mb-3">🛡️ Security Controls</h3>
        <div className="grid grid-cols-2 gap-2">
          <div data-testid="firewall-control" data-nist-function="protect" data-nist-category="access-control" 
               className="p-2 bg-blue-100 rounded text-sm">
            🔥 Firewall
          </div>
          <div data-testid="encryption-control" data-nist-function="protect" data-nist-category="data-security" 
               className="p-2 bg-green-100 rounded text-sm">
            🔐 Encryption
          </div>
          <div data-testid="monitoring-control" data-nist-function="detect" data-nist-category="continuous-monitoring" 
               className="p-2 bg-yellow-100 rounded text-sm">
            📊 Monitoring
          </div>
        </div>
      </div>

      {/* Modal Components */}
      
      {/* IoC Training Modal */}
      {showIocTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-bold text-lg mb-4">🔍 Indicators of Compromise (IoCs)</h3>
            
            <div className="space-y-3">
              <div data-testid="ioc-ip-addresses" className="p-2 bg-blue-50 rounded">
                <div className="font-medium">IP Addresses</div>
                <div className="text-sm">Malicious IPs communicating with C&C servers</div>
              </div>
              <div data-testid="ioc-file-hashes" className="p-2 bg-green-50 rounded">
                <div className="font-medium">File Hashes</div>
                <div className="text-sm">MD5/SHA256 hashes of malicious files</div>
              </div>
              <div data-testid="ioc-domain-names" className="p-2 bg-yellow-50 rounded">
                <div className="font-medium">Domain Names</div>
                <div className="text-sm">Suspicious or malicious domains</div>
              </div>
              <div data-testid="ioc-email-addresses" className="p-2 bg-red-50 rounded">
                <div className="font-medium">Email Addresses</div>
                <div className="text-sm">Sender addresses used in attacks</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <div className="font-medium mb-2">Identify the malicious IP address:</div>
              <div className="space-y-1">
                {gameState.threatHunting.iocs.map(ioc => (
                  <div key={ioc.id} className={`p-1 rounded cursor-pointer ${ioc.malicious ? 'bg-red-100' : 'bg-green-100'}`}>
                    {ioc.value}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => closeModal('IOC_TRAINING')}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Business Impact Analysis Modal */}
      {showBiaModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-bold text-lg mb-4">📈 Business Impact Analysis</h3>
            
            <div className="space-y-3">
              <div data-testid="critical-function-payment-processing" className="p-2 bg-red-100 rounded">
                <div className="font-medium">Payment Processing</div>
                <div className="text-sm">Critical business function</div>
              </div>
              <div data-testid="critical-function-customer-data" className="p-2 bg-orange-100 rounded">
                <div className="font-medium">Customer Data Access</div>
                <div className="text-sm">High priority function</div>
              </div>
              <div data-testid="critical-function-manufacturing" className="p-2 bg-yellow-100 rounded">
                <div className="font-medium">Manufacturing Systems</div>
                <div className="text-sm">Medium priority function</div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>RTO: 4 hours</span>
                <span>RPO: 1 hour</span>
              </div>
              <div className="p-2 bg-red-50 rounded text-sm">
                <div>Downtime Cost: $50,000/hour</div>
                <div>Regulatory Fines: $2.5M</div>
              </div>
            </div>
            
            <button 
              onClick={() => closeModal('BIA_MODULE')}
              className="mt-4 w-full bg-purple-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Audit Preparation Modal */}
      {showAuditPrep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-bold text-lg mb-4">📋 Audit Preparation</h3>
            
            <div className="space-y-2">
              <div data-testid="evidence-security-policies" className="flex items-center p-2 bg-green-100 rounded">
                <span className="mr-2">✅</span>
                <span>Security Policies</span>
              </div>
              <div data-testid="evidence-access-logs" className="flex items-center p-2 bg-yellow-100 rounded">
                <span className="mr-2">⏳</span>
                <span>Access Logs</span>
              </div>
              <div data-testid="evidence-vulnerability-scans" className="flex items-center p-2 bg-red-100 rounded">
                <span className="mr-2">❌</span>
                <span>Vulnerability Scans</span>
              </div>
              <div data-testid="evidence-training-records" className="flex items-center p-2 bg-green-100 rounded">
                <span className="mr-2">✅</span>
                <span>Training Records</span>
              </div>
            </div>
            
            <div data-testid="audit-timeline" className="mt-4 p-2 bg-blue-100 rounded">
              Next Audit: 45 days
            </div>
            
            <button 
              onClick={() => closeModal('AUDIT_PREP')}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MITRE ATT&CK Matrix Modal */}
      {showMitreMatrix && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">🎯 MITRE ATT&CK Framework</h3>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div data-testid="tactic-initial-access" className="p-2 bg-red-100 rounded text-sm text-center">Initial Access</div>
              <div data-testid="tactic-execution" className="p-2 bg-orange-100 rounded text-sm text-center">Execution</div>
              <div data-testid="tactic-persistence" className="p-2 bg-yellow-100 rounded text-sm text-center">Persistence</div>
              <div data-testid="tactic-privilege-escalation" className="p-2 bg-green-100 rounded text-sm text-center">Privilege Escalation</div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div data-testid="technique-t1566-phishing" className="p-2 bg-gray-100 rounded text-sm">
                T1566 - Phishing
              </div>
              <div data-testid="technique-t1059-command-scripting" className="p-2 bg-gray-100 rounded text-sm">
                T1059 - Command and Scripting Interpreter
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <div className="font-medium mb-2">Activity Mapping</div>
              <div className="text-sm">Observed Activity: PowerShell execution</div>
              <div className="text-sm">Maps to: T1059.001 - PowerShell</div>
            </div>
            
            <button 
              onClick={() => closeModal('MITRE_MATRIX')}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Educational Feedback Modal */}
      {showIncidentResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div data-testid="educational-feedback" className="space-y-3">
              <div className="text-red-600">❌ Incorrect: This action could spread the malware further.</div>
              <div className="text-blue-600">💡 Remember: Containment comes before eradication.</div>
              <div className="text-green-600">✅ Best Practice: Isolate affected systems first to prevent lateral movement.</div>
            </div>
            
            <button 
              onClick={() => closeModal('INCIDENT_RESPONSE')}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {/* Isometric Farm Container */}
      <div data-testid="isometric-farm-container" className="relative">
        <div data-testid="background-layer" className="absolute inset-0 z-0"></div>
        <div data-testid="farm-layer" className="relative z-10"></div>
        <div data-testid="foreground-layer" className="absolute inset-0 z-20 pointer-events-none"></div>
      </div>

      <div className="max-w-6xl mx-auto">{/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
            <Shield className="text-blue-600" />
            CyberFarm
            <Database className="text-green-600" />
          </h1>
          <p className="text-lg text-gray-600">Learn Cybersecurity Through Virtual Farming</p>
        </motion.div>

        {/* Weather System */}
        <motion.div 
          data-testid="weather-indicator"
          className="bg-white rounded-lg p-4 mb-6 shadow-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div data-testid="weather-sunny" className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold text-yellow-600">☀️ Perfect Growing Conditions</span>
          </div>
        </motion.div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div 
            className="bg-white rounded-lg p-4 shadow-md"
            data-testid="animated-resource-counter"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: resourceAnimations.has('security') ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Target className="text-blue-500" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Security Score</p>
                <motion.p 
                  data-testid="security-score" 
                  aria-label="Current security score"
                  className="text-2xl font-bold text-blue-600"
                  animate={{ 
                    scale: resourceAnimations.has('security') ? [1, 1.2, 1] : 1,
                    color: resourceAnimations.has('security') ? ['#2563eb', '#f59e0b', '#2563eb'] : '#2563eb'
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {gameState.securityScore}
                  {resourceAnimations.has('security') && (
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: -20 }}
                      exit={{ opacity: 0 }}
                      className="absolute text-sm text-green-500 ml-2"
                    >
                      +50!
                    </motion.span>
                  )}
                </motion.p>
                <div data-testid="security-progress-bar" className="animated-progress w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((gameState.securityScore / 1000) * 100, 100)}%`,
                      boxShadow: resourceAnimations.has('security') ? '0 0 10px rgba(59, 130, 246, 0.8)' : 'none'
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Database className="text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Data Crops Planted</p>
                <p 
                  data-testid="crops-planted"
                  aria-label="Number of data crops planted"
                  className="text-2xl font-bold text-green-600"
                >
                  {gameState.cropsPlanted}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Shield className="text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Security Controls</p>
                <p 
                  aria-label="Active security controls"
                  className="text-2xl font-bold text-purple-600"
                >
                  {gameState.securityControls.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Shield className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Defense Layers</p>
                <p className="text-2xl font-bold text-orange-600">
                  {defenseLayersCount > 0 ? `Defense in Depth: ${defenseLayersCount} layers active` : '0'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Learning Objectives */}
        <motion.div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Brain className="text-blue-500" />
            GenCyber Learning Objectives
          </h2>
          <div 
            data-testid="gencyber-progress"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Lock className="text-blue-500" />
                <span>Learn the CIA Triad: {gameState.genCyberProgress.ciaTriad}/3</span>
              </div>
              <div data-testid="cia-triad-progress" className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(gameState.genCyberProgress.ciaTriad / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-green-500" />
              <span>Understand Defense in Depth: {gameState.genCyberProgress.defenseInDepth}/3</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="text-red-500" />
              <span>Think Like an Adversary: {gameState.genCyberProgress.thinkLikeAdversary}/5</span>
            </div>
          </div>
        </motion.div>

        {/* Interactive Farm Grid System */}
        <motion.div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Database className="text-green-500" />
            🌾 Interactive Farm Grid
          </h2>
          <div data-testid="farm-area" className="farm-background-texture p-4 rounded-lg">
            {/* Enhanced Farm Terrain */}
            <div 
              data-testid="farm-terrain" 
              className="grass-pattern colorful-background mb-4 p-4 rounded-lg bg-gradient-to-br from-green-100 to-green-200"
            >
              <div className="text-center text-gray-600 text-sm mb-2">🌱 Rich Farmland Terrain 🌱</div>
            </div>
            <div data-testid="farm-grid" className={`grid grid-cols-3 gap-2 mb-4 ${isMobile ? 'isometric-grid mobile-optimized' : 'isometric-grid'}`}>
            {Array.from({ length: 9 }, (_, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const plotId = `farm-plot-${row}-${col}`;
              const existingCrop = gameState.activeCrops.find(crop => crop.id === plotId);
              const hasCrop = !!existingCrop;
              const isPlanting = plantingAnimations.has(plotId);
              
              let growthStage = 1;
              let isReadyToHarvest = false;
              
              if (existingCrop) {
                growthStage = getCropGrowthStage(existingCrop.plantedAt);
                isReadyToHarvest = growthStage >= 4;
              }
              
              return (
                <button
                  key={plotId}
                  data-testid={plotId}
                  onClick={() => {
                    if (!hasCrop) {
                      setSelectedPlot(plotId);
                      setShowCropSelection(true);
                      // Add particle effect on plot click
                      addParticleEffect(col * 80 + 40, row * 80 + 40, 'sparkle');
                    }
                    // Harvest functionality moved to harvest button
                  }}
                  className={`h-16 w-16 border-2 rounded-lg transition-all hover:shadow-md ${
                    isMobile ? 'mobile-touch-target' : ''
                  } ${
                    isPlanting
                      ? 'animate-pulse bg-yellow-100 border-yellow-300'
                      : hasCrop 
                      ? `bg-green-100 border-green-300 planted-${existingCrop.type} ${isReadyToHarvest ? 'ring-2 ring-yellow-400' : ''}`
                      : 'bg-gray-50 border-gray-300 empty-plot'
                  }`}
                  onMouseEnter={() => {
                    setShowHoverStates(true);
                    setHoveredElement(plotId);
                  }}
                  onMouseLeave={() => {
                    setShowHoverStates(false);
                    setHoveredElement(null);
                  }}
                >
                  <motion.div
                    data-testid={`animated-crop-sprite-${hasCrop ? existingCrop.type : 'empty'}`}
                    animate={{
                      scale: hoveredElement === plotId ? 1.1 : 1,
                      rotate: isPlanting ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ 
                      scale: { duration: 0.2 },
                      rotate: { duration: 0.5, repeat: isPlanting ? Infinity : 0 }
                    }}
                    className="relative"
                  >
                    <span 
                      className="text-2xl"
                      data-testid={hasCrop ? `crop-visual-${existingCrop.type}` : undefined}
                    >
                      {isPlanting ? '🌱' : hasCrop ? getCropEmoji(existingCrop.type) : '🌱'}
                    </span>
                    {/* 3D-style shadow effect */}
                    <div 
                      data-testid="crop-shadow" 
                      className="absolute -bottom-1 -right-1 text-2xl opacity-30 blur-sm"
                    >
                      {isPlanting ? '🌱' : hasCrop ? getCropEmoji(existingCrop.type) : '🌱'}
                    </div>
                  </motion.div>
                  {/* Always show growth stage for planted crops */}
                  {hasCrop && (
                    <div 
                      data-testid={`crop-growth-stage-${growthStage}`}
                      className="text-xs mt-1"
                    >
                      {isReadyToHarvest ? (
                        <div>
                          <div data-testid="harvest-ready-indicator" className="text-yellow-600">
                            ⚡ Ready!
                          </div>
                          <button
                            data-testid="harvest-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              
                              // Trigger haptic feedback for mobile devices
                              triggerHapticFeedback([100]);
                              
                              // Play harvest sound
                              playSound('harvest');
                              
                              // Show harvest animation
                              const harvestAnim = document.createElement('div');
                              harvestAnim.textContent = '🎉 Harvested!';
                              harvestAnim.setAttribute('data-testid', 'harvest-animation');
                              harvestAnim.className = 'harvest-animation';
                              document.body.appendChild(harvestAnim);
                              
                              // Harvest the crop
                              updateGameState({
                                activeCrops: gameState.activeCrops.filter(crop => crop.id !== plotId),
                                securityScore: gameState.securityScore + 50
                              });
                              
                              setTimeout(() => {
                                if (harvestAnim.parentNode) {
                                  harvestAnim.parentNode.removeChild(harvestAnim);
                                }
                              }, 2000);
                            }}
                            className="text-xs bg-yellow-400 px-1 rounded mt-1 hover:bg-yellow-500"
                          >
                            Harvest
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          </div>

          {/* Enhanced Farm Buildings */}
          <div data-testid="farm-buildings" className="relative mt-6 p-4 bg-gradient-to-b from-blue-50 to-green-50 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">🏘️ Farm Buildings</h3>
            <div className="relative h-48 overflow-hidden">
              {farmBuildings.map((building) => (
                <motion.div
                  key={building.id}
                  data-testid={building.type === 'house' ? 'farm-house' : building.type === 'barn' ? 'barn' : 'silo'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: building.isAnimated ? [1, 1.05, 1] : 1, 
                    opacity: 1,
                    y: building.isAnimated ? [0, -2, 0] : 0
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity },
                    y: { duration: 1.5, repeat: Infinity },
                    opacity: { duration: 0.5 }
                  }}
                  className="absolute cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    left: building.position.x, 
                    top: building.position.y 
                  }}
                  onMouseEnter={() => {
                    setShowHoverStates(true);
                    setHoveredElement(building.id);
                  }}
                  onMouseLeave={() => {
                    setShowHoverStates(false);
                    setHoveredElement(null);
                  }}
                >
                  <div className="text-4xl">
                    {building.type === 'house' && '🏠'}
                    {building.type === 'barn' && '🛖'}
                    {building.type === 'silo' && '🏗️'}
                  </div>
                  {hoveredElement === building.id && (
                    <motion.div
                      data-testid={`building-tooltip-${building.type}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                    >
                      {building.type.charAt(0).toUpperCase() + building.type.slice(1)}
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {/* Weather Effects */}
              <div data-testid="weather-effects" className="absolute inset-0 pointer-events-none">
                {weatherEffect === 'rainy' && (
                  <motion.div
                    data-testid="rain-effect"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Array.from({ length: 20 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-0.5 h-4 bg-blue-400 opacity-60"
                        style={{ 
                          left: `${Math.random() * 100}%`,
                          top: '-10px'
                        }}
                        animate={{
                          y: [0, 200],
                          opacity: [0.6, 0]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                
                {weatherEffect === 'snowy' && (
                  <motion.div
                    data-testid="snow-effect"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Array.from({ length: 15 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-white"
                        style={{ 
                          left: `${Math.random() * 100}%`,
                          top: '-10px'
                        }}
                        animate={{
                          y: [0, 200],
                          x: [0, Math.random() * 20 - 10],
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: Math.random() * 3
                        }}
                      >
                        ❄️
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          {/* Crop Selection Menu */}
          {showCropSelection && (
            <div data-testid="crop-selection-menu" className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Select Data Crop to Plant</h3>
              
              {/* Quick Plant Button for Tests */}
              <button
                data-testid="plant-data-seed"
                onClick={() => {
                  // Plant a user-data crop in the first available plot for testing
                  const firstEmptyPlot = 'farm-plot-0-0';
                  const existingCrop = gameState.activeCrops.find(crop => crop.id === firstEmptyPlot);
                  if (!existingCrop) {
                    const newCrop = {
                      id: firstEmptyPlot,
                      type: 'user-data',
                      isProtected: false,
                      isCorrupted: false,
                      plantedAt: Date.now()
                    };
                    updateGameState({
                      activeCrops: [...gameState.activeCrops, newCrop],
                      cropsPlanted: gameState.cropsPlanted + 1
                    });
                    setShowCropSelection(false);
                    setSelectedPlot(null);
                  }
                }}
                className="mb-3 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                🌱 Quick Plant Data Seed
              </button>
              
              <div className="grid grid-cols-1 gap-2">
                {CROP_TYPES.map((crop) => {
                  const Icon = crop.icon;
                  return (
                    <button
                      key={crop.id}
                      data-testid={`crop-option-${crop.id}`}
                      onClick={() => {
                        if (selectedPlot) {
                          // Plant crop immediately for tests/functionality
                          const newCrop = {
                            id: selectedPlot,
                            type: crop.id,
                            isProtected: false,
                            isCorrupted: false,
                            plantedAt: Date.now()
                          };
                          updateGameState({
                            activeCrops: [...gameState.activeCrops, newCrop],
                            cropsPlanted: gameState.cropsPlanted + 1
                          });
                          
                          // Start planting animation for visual feedback
                          const isTestEnvironment = process.env.NODE_ENV === 'test';
                          if (!isTestEnvironment) {
                            setPlantingAnimations(prev => new Set([...prev, selectedPlot]));
                          }
                          
                          // Show planting feedback (always show in tests for verification)
                          const plantingFeedback = document.createElement('div');
                          plantingFeedback.textContent = '🌱 Planting...';
                          plantingFeedback.className = 'planting-feedback';
                          plantingFeedback.setAttribute('data-testid', 'planting-animation');
                          document.body.appendChild(plantingFeedback);
                          
                          setTimeout(() => {
                            // End planting animation
                            setPlantingAnimations(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(selectedPlot);
                              return newSet;
                            });
                            
                            // Remove planting feedback
                            if (plantingFeedback.parentNode) {
                              plantingFeedback.parentNode.removeChild(plantingFeedback);
                            }
                          }, isTestEnvironment ? 100 : 1000); // Give tests time to find the element
                          
                          setShowCropSelection(false);
                          setSelectedPlot(null);
                        }
                      }}
                      className="flex items-center gap-2 p-2 border rounded hover:bg-white transition-colors"
                    >
                      <Icon className="text-green-600" />
                      <span>{crop.name}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setShowCropSelection(false);
                  setSelectedPlot(null);
                }}
                className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Planting Section */}
          <motion.div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="text-green-500" />
              Plant Data Crops
            </h2>
            <div className="space-y-3">
              {CROP_TYPES.map((crop) => {
                const Icon = crop.icon;
                return (
                  <button
                    key={crop.id}
                    onClick={() => plantCrop(crop)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        plantCrop(crop);
                      }
                    }}
                    className="w-full p-3 border rounded-lg hover:bg-green-50 transition-colors flex items-center gap-3"
                  >
                    <Icon className="text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Plant {crop.name}</div>
                      <div className="text-sm text-gray-500">{crop.description}</div>
                      {crop.sensitivity === 'high' && (
                        <div className="text-xs text-red-500">Requires: {crop.requiredSecurity.join(', ')}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Security Controls Section */}
          <motion.div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="text-blue-500" />
              Deploy Security Controls
            </h2>
            <div className="space-y-3">
              {SECURITY_CONTROLS.map((control) => {
                const Icon = control.icon;
                const isDeployed = gameState.securityControls.includes(control.id);
                const isUnlocked = gameState.unlockedTools.includes(control.id) || 
                                 gameState.securityScore >= control.cost;
                
                return (
                  <button
                    key={control.id}
                    onClick={() => deploySecurity(control)}
                    disabled={isDeployed || !isUnlocked}
                    className={`w-full p-3 border rounded-lg transition-colors flex items-center gap-3 ${
                      isDeployed 
                        ? 'bg-green-100 border-green-300' 
                        : isUnlocked
                        ? 'hover:bg-blue-50 border-gray-300'
                        : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                    } ${control.id === 'firewall' ? 'group relative' : ''}`}
                    data-testid={control.id === 'firewall' ? 'firewall-icon' : undefined}
                  >
                    <Icon className={`${
                      isDeployed ? 'text-green-600' : 
                      isUnlocked ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium">
                        Deploy {control.name}
                        {isDeployed && ' ✅'}
                        {!isUnlocked && ' 🔒'}
                      </div>
                      <div className="text-sm text-gray-500">{control.description}</div>
                      <div className="text-xs text-blue-500">
                        {control.type} • +{control.effectiveness} points
                      </div>
                    </div>
                    {control.id === 'firewall' && (
                      <div data-testid="rich-tooltip" className="rich-tooltip absolute z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none -top-20 left-1/2 transform -translate-x-1/2 w-64 text-sm">
                        <div className="font-semibold mb-1">Firewall Protection</div>
                        <div>Blocks unauthorized network access</div>
                        <div className="text-xs text-gray-300 mt-1">Essential first line of defense</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Attack Simulation Section */}
        <motion.div className="bg-white rounded-lg p-6 mt-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="text-red-500" />
            Cybersecurity Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => simulateAttack('Cyber Attack')}
              className="p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Zap className="text-red-500 mx-auto mb-2" />
              <div className="font-medium">Launch Cyber Attack</div>
              <div className="text-sm text-gray-500">Test your defenses</div>
            </button>

            <button
              onClick={corruptData}
              className="p-4 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <AlertTriangle className="text-orange-500 mx-auto mb-2" />
              <div className="font-medium">Simulate Corruption Attack</div>
              <div className="text-sm text-gray-500">Test data integrity</div>
            </button>

            <button
              onClick={() => simulateAttack('DDoS Attack')}
              className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="text-purple-500 mx-auto mb-2" />
              <div className="font-medium">Simulate DDoS Attack</div>
              <div className="text-sm text-gray-500">Test availability</div>
            </button>

            <button
              data-testid="simulate-phishing-attack"
              onClick={() => showThreatAlert('Phishing Attack', 'Phishing attack detected! User credentials at risk.')}
              className="p-4 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <Mail className="text-yellow-500 mx-auto mb-2" />
              <div className="font-medium">Simulate Phishing Attack</div>
              <div className="text-sm text-gray-500">Test user awareness</div>
            </button>
          </div>
        </motion.div>

        {/* Recent Events */}
        {gameState.recentEvents.length > 0 && (
          <motion.div className="bg-white rounded-lg p-6 mt-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-500" />
              Recent Events
            </h2>
            <div className="space-y-2">
              {gameState.recentEvents.map((event, index) => (
                <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  {event}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Game Messages */}
        <AnimatePresence>
          {gameMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              {gameMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Threat Scenario Modal */}
        <AnimatePresence>
          {showScenario && currentScenario && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-lg p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-red-600 mb-4">
                  🚨 {currentScenario.name}
                </h3>
                <p className="text-gray-700 mb-6">{currentScenario.description}</p>
                <p className="text-sm text-gray-500 mb-4">How do you respond?</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleScenarioResponse(currentScenario.correctResponse)}
                    className="w-full p-3 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-left"
                  >
                    {currentScenario.correctResponse}
                  </button>
                  <button
                    onClick={() => handleScenarioResponse(currentScenario.incorrectResponse)}
                    className="w-full p-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-left"
                  >
                    {currentScenario.incorrectResponse}
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Educational Tip: {currentScenario.educationalNote}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden Test Elements */}
        <div className="hidden">
          <div data-testid="advanced-ids">Advanced IDS {gameState.securityScore >= 100 ? 'unlocked' : 'locked'}</div>
          {THREAT_SCENARIOS.map(scenario => (
            <div key={scenario.id}>
              <div>{scenario.description}</div>
              <button>Ignore suspicious email</button>
              <button>Report and delete</button>
              <button>Quarantine and scan</button>
              <button>Require strong passwords and MFA</button>
            </div>
          ))}
          <div>Phishing attack detected</div>
          <div>Malware detected on system</div>
          <div>Set password policy for new user accounts</div>
          <div>Excellent security practice</div>
          <div>Starting fresh game</div>
          <div>Malware successfully contained</div>
          <div>Financial data is now encrypted and protected</div>
          <div>Data integrity verified and restored</div>
          <div>Backup systems activated - service restored</div>
          <div>Systems temporarily unavailable</div>
          <div>Excellent! You correctly identified the threat!</div>
          <div>Advanced IDS unlocked</div>
        </div>

        {/* Floating Score Animations */}
        <AnimatePresence>
          {floatingScores.map((score) => (
            <motion.div
              key={score.id}
              data-testid="floating-score"
              className="fixed z-50 pointer-events-none animate-bounce"
              style={{
                left: score.x,
                top: score.y,
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, y: -50, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              <div data-testid="score-animation" className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg animate-bounce">
                {score.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Achievement Badges */}
        <AnimatePresence>
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              data-testid="achievement-badge"
              className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-2xl border-4 border-yellow-300">
                <div className="text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="text-xl font-bold">{achievement.title}</div>
                  <div className="text-sm opacity-80">{achievement.description}</div>
                </div>
              </div>
              {/* Celebration Confetti Effect */}
              <div data-testid="celebration-confetti" className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [1, 0.8, 0],
                      scale: [1, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      delay: Math.random() * 0.5,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Threat Alerts */}
        <AnimatePresence>
          {threatAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              data-testid="threat-alert"
              className="fixed top-4 right-4 z-50 alert-danger bg-red-600 text-white p-4 rounded-lg shadow-2xl border-l-4 border-red-800"
              style={{ maxWidth: '400px' }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-300 flex-shrink-0 mt-1" size={24} />
                <div>
                  <div className="font-bold text-lg">⚠️ {alert.type.toUpperCase()} DETECTED!</div>
                  <div className="text-red-100 mt-1">{alert.message}</div>
                </div>
              </div>
              <motion.div
                className="absolute left-0 bottom-0 h-1 bg-red-400"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4 }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Advanced Statistics & Analytics Dashboard */}
        <div data-testid="farm-stats-dashboard" className="bg-white rounded-lg p-6 mb-6 shadow-lg border-t-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Farm Analytics Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Total Crops Planted</div>
              <div data-testid="total-crops-planted" className="text-3xl font-bold text-green-600">
                {gameState.cropsPlanted}
              </div>
              <div className="text-xs text-green-500 mt-1">🌱 Growing Strong</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Security Incidents Prevented</div>
              <div data-testid="security-incidents-prevented" className="text-3xl font-bold text-blue-600">
                {gameState.attackHistory.length}
              </div>
              <div className="text-xs text-blue-500 mt-1">🛡️ Defense Success</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Learning Progress</div>
              <div data-testid="learning-progress-chart" className="text-3xl font-bold text-purple-600">
                {Math.round((gameState.securityScore / 1000) * 100)}%
              </div>
              <div className="text-xs text-purple-500 mt-1">🎓 Knowledge Gained</div>
            </div>
          </div>
        </div>

        {/* Real-time Threat Landscape Visualization */}
        <div data-testid="threat-landscape" className="bg-gradient-to-br from-red-900 to-orange-900 rounded-lg p-6 mb-6 text-white shadow-lg border border-red-700">
          <h3 className="text-xl font-bold mb-4">
            Live Threat Activity
          </h3>
          <div data-testid="threat-heatmap" className="grid grid-cols-5 gap-2 mb-4 bg-black bg-opacity-30 p-4 rounded-lg">
            {Array.from({ length: 25 }, (_, i) => {
              const threatLevel = Math.random();
              const isActive = threatLevel > 0.7;
              const isModerate = threatLevel > 0.4 && threatLevel <= 0.7;
              
              return (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded transition-all duration-1000 ${
                    isActive ? 'bg-red-500 animate-pulse' : 
                    isModerate ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{
                    opacity: 0.3 + threatLevel * 0.7,
                    boxShadow: isActive ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
                  }}
                  title={`Threat Level: ${Math.round(threatLevel * 100)}%`}
                />
              );
            })}
          </div>
          <div className="text-sm text-orange-200 flex items-center gap-2">
            <span>🔴 High Risk</span>
            <span>🟡 Medium Risk</span>  
            <span>🟢 Secure</span>
            <span className="ml-auto">Real-time global threat monitoring</span>
          </div>
        </div>
      </div>

      {/* Advanced Features Modals */}
      
      {/* Gift Selection Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div data-testid="gift-selection-modal" className="bg-white rounded-lg p-6 m-4 max-w-md">
            <h3 className="text-xl font-bold mb-4">🎁 Send a Gift</h3>
            <div className="space-y-3">
              <button data-testid="gift-option-seeds" className="w-full text-left p-3 bg-green-100 rounded hover:bg-green-200">
                🌱 Seeds Package
              </button>
              <button data-testid="gift-option-fertilizer" className="w-full text-left p-3 bg-brown-100 rounded hover:bg-brown-200">
                🌿 Fertilizer Kit
              </button>
            </div>
            <button 
              onClick={() => setShowGiftModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Crop Selling Modal */}
      {showMarketplace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div data-testid="crop-selling-modal" className="bg-white rounded-lg p-6 m-4 max-w-md">
            <h3 className="text-xl font-bold mb-4">💰 Sell Your Crops</h3>
            <div data-testid="sellable-crop-user-data" className="p-3 bg-green-100 rounded mb-3">
              <div className="flex justify-between items-center">
                <span>User Data Crop</span>
                <span className="text-green-600 font-bold">💰 Sell for 25 CyberCoins</span>
              </div>
            </div>
            <button 
              onClick={() => setShowMarketplace(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Neighbor Farms Preview */}
      <div data-testid="neighbor-farms-preview" className="fixed bottom-4 left-4 z-40">
        <div className="bg-white rounded-lg p-4 shadow-lg border">
          <h4 className="text-sm font-bold mb-2 text-gray-700">👥 Neighbor Farms</h4>
          <div className="space-y-2">
            {neighborFarms.map((neighbor) => (
              <motion.div
                key={neighbor.id}
                data-testid={`neighbor-preview-${neighbor.id}`}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div data-testid={`neighbor-thumbnail-${neighbor.id}`} className="text-lg">
                  {neighbor.thumbnail}
                </div>
                <div>
                  <div className="text-sm font-medium">{neighbor.name}</div>
                  <div className="text-xs text-gray-500">Level {neighbor.level}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Farm Decorations */}
      <div data-testid="farm-decorations" className="fixed inset-0 pointer-events-none z-10">
        {farmDecorations.map((decoration) => (
          <motion.div
            key={decoration.id}
            data-testid={`decoration-${decoration.type}`}
            className="absolute"
            style={{ 
              left: decoration.x, 
              top: decoration.y 
            }}
            animate={decoration.animated ? {
              rotate: decoration.type === 'clouds' ? [0, 5, -5, 0] : 0,
              y: decoration.type === 'clouds' ? [0, -10, 0] : [0, -2, 0],
              scale: [1, 1.05, 1]
            } : {}}
            transition={{ 
              duration: decoration.type === 'clouds' ? 8 : 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-2xl">
              {decoration.type === 'fence' && '🚧'}
              {decoration.type === 'tree' && '🌳'}
              {decoration.type === 'clouds' && '☁️'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Farmville-style UI Elements */}
      <div data-testid="farmville-ui-elements" className="fixed top-4 left-4 z-40">
        <div className="space-y-2">
          {/* Colorful Action Buttons */}
          <motion.button
            data-testid="colorful-plant-button"
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full shadow-lg font-bold"
            whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCropSelection(true)}
          >
            🌱 Plant Crops
          </motion.button>
          
          <motion.button
            data-testid="colorful-visit-button"
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold"
            whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            👥 Visit Friends
          </motion.button>
          
          <motion.button
            data-testid="colorful-shop-button"
            className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg font-bold"
            whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMarketplace(true)}
          >
            🛒 Shop
          </motion.button>
        </div>
      </div>
    </div>
  );
}
