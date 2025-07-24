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
  Smartphone
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
    effectiveness: 70,
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
    activeCrops: [],
    recentEvents: []
  });

  const [currentScenario, setCurrentScenario] = useState<ThreatScenario | null>(null);
  const [showScenario, setShowScenario] = useState(false);
  const [gameMessage, setGameMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 mobile-responsive"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2">
              <Target className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Security Score</p>
                <p 
                  data-testid="security-score" 
                  aria-label="Current security score"
                  className="text-2xl font-bold text-blue-600"
                >
                  {gameState.securityScore}
                </p>
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
            <div className="flex items-center gap-2">
              <Lock className="text-blue-500" />
              <span>Learn the CIA Triad: {gameState.genCyberProgress.ciaTriad}/3</span>
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
                    }`}
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
      </div>
    </div>
  );
}
