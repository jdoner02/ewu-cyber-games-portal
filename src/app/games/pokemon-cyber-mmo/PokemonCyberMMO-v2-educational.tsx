'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Monitor, Settings, Zap, UserCheck, MapPin, Calendar, Wifi, MessageCircle, Star, Zap as ZapIcon, Brain, Target } from 'lucide-react';

// Import the original educational tutorials
import { CyberCareersTutorial, HardwareSoftwareTutorial, EthicsTutorial } from './components/Day1Tutorials';
import Day1EnhancedTutorials from './components/Day1EnhancedTutorials';
import { IPAddressTutorial, PacketTracerTutorial, WiFiSecurityTutorial } from './components/Day2Tutorials';
import Day2EnhancedTutorials from './components/Day2EnhancedTutorials';
import { PythonCodingTutorial, TurtleGraphicsTutorial, PhidgetTutorial } from './components/Day3Tutorials';
import { VMSetupTutorial, LinuxCommandsTutorial, AIEthicsTutorial, CryptographyTutorial } from './components/Day4Tutorials';
import Day4EnhancedTutorials from './components/Day4EnhancedTutorials';
import Day4AdditionalEnhancedTutorials from './components/Day4AdditionalEnhancedTutorials';
import { PhishingIdentificationTutorial, OSINTTutorial, RedBlueTeamTutorial } from './components/Day5Tutorials';
import Day5EnhancedTutorials from './components/Day5EnhancedTutorials';
import AlgorithmTutorial from './components/AlgorithmTutorial';
import CTFCompetitionTutorial from './components/CTFCompetitionTutorial';
import KnowledgeArena from './components/KnowledgeArena';

// Import new battle and trivia systems
import { BattleSystem, type Battle, type Player as BattlePlayer } from './systems/BattleSystem';
import { TriviaEngine, type TriviaQuestion, type AnswerResult } from './systems/TriviaEngine';
import { CyberSecurityQuestions } from './data/CyberSecurityQuestions';

// Enhanced Types for MMO functionality
interface CyberPokemon {
  id: string;
  name: string;
  type: 'cyber-career' | 'hardware' | 'software' | 'ethics' | 'teamwork' | 'security' | 'networking' | 'programming' | 'systems' | 'attack-defense' | 'intelligence';
  level: number;
  hp: number;
  maxHp: number;
  abilities: string[];
  description: string;
  sprite: string;
  rarity: 'starter' | 'common' | 'uncommon' | 'rare' | 'legendary';
  dayOneSkills: string[];
  careerPath?: string;
  genCyberDay?: number;
  position?: { x: number; y: number };
  isWild?: boolean;
  catchRate?: number;
}

interface Player {
  id: string;
  name: string;
  position: { x: number; y: number };
  currentArea: string;
  pokemon: CyberPokemon[];
  level: number;
  isOnline: boolean;
  lastSeen: Date;
  sprite: string;
}

interface MultiplayerMessage {
  type: 'player_join' | 'player_leave' | 'player_move' | 'chat_message' | 'trade_request' | 'battle_request' | 'pokemon_caught' | 'world_state_update';
  playerId: string;
  data: any;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
  channel: 'global' | 'area' | 'team';
}

interface GameArea {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  dayOneConcepts: string[];
  bgGradient: string;
  icon: string;
  wildPokemon: CyberPokemon[];
}

interface PlayerProfile {
  name: string;
  level: number;
  currentArea: string;
  team: CyberPokemon[];
  storage: CyberPokemon[];
  badges: string[];
  completedChallenges: string[];
  teammates: string[];
  mentorProgress: number;
  exp: number;
  totalExp: number;
  ballInventory: {
    'cyber-ball': number;
    'ultra-cyber-ball': number;
    'master-cyber-ball': number;
  };
}

interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  concept: string;
  teamSize: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  rewards: string[];
}

// Multiplayer Manager Class
class MultiplayerManager {
  private socket: WebSocket | null = null;
  private players: Map<string, Player> = new Map();
  private messageHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageQueue: MultiplayerMessage[] = [];

  connect(serverUrl: string = 'ws://localhost:3001'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(serverUrl);
        
        this.socket.onopen = () => {
          this.reconnectAttempts = 0;
          this.flushMessageQueue();
          resolve(true);
        };
        
        this.socket.onerror = () => reject(false);
        this.socket.onmessage = this.handleMessage.bind(this);
        this.socket.onclose = this.handleDisconnect.bind(this);
        
      } catch (error) {
        reject(false);
      }
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: MultiplayerMessage = JSON.parse(event.data);
      const handlers = this.messageHandlers.get(message.type) || [];
      handlers.forEach(handler => handler(message));
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) this.sendMessage(message.type, message.data);
    }
  }

  sendMessage(type: string, data: any) {
    const message: MultiplayerMessage = {
      type: type as any,
      playerId: 'current_player',
      data,
      timestamp: new Date()
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  onMessage(type: string, handler: Function) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  updatePlayerPosition(x: number, y: number) {
    this.sendMessage('player_move', { x, y });
  }

  sendChatMessage(message: string, channel: string = 'global') {
    this.sendMessage('chat_message', { text: message, channel });
  }

  requestTrade(targetPlayerId: string, offeredPokemon: string[], requestedPokemon: string[]) {
    this.sendMessage('trade_request', { targetPlayerId, offeredPokemon, requestedPokemon });
  }

  requestBattle(targetPlayerId: string, battleType: string = 'friendly') {
    this.sendMessage('battle_request', { targetPlayerId, battleType });
  }

  getOnlinePlayers(): Player[] {
    return Array.from(this.players.values()).filter(p => p.isOnline);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Battle helper functions
const createBattlePlayer = (profile: PlayerProfile, position: { x: number; y: number }): BattlePlayer => {
  const currentPokemon = profile.team[0] || {
    id: 'starter-firewall',
    name: 'Firewall Starter',
    type: 'security',
    level: profile.level,
    hp: 50 + (profile.level * 10),
    maxHp: 50 + (profile.level * 10),
    abilities: ['Basic Protection'],
    rarity: 'starter'
  };

  return {
    id: profile.name,
    name: profile.name,
    level: profile.level,
    currentPokemon: currentPokemon as any
  };
};

const getDifficultyForLevel = (level: number): 'beginner' | 'intermediate' | 'advanced' => {
  if (level <= 5) return 'beginner';
  if (level <= 12) return 'intermediate';
  return 'advanced';
};

// Monster Catching System
class MonsterCatchingSystem {
  static calculateCatchRate(pokemon: CyberPokemon, ballType: string): number {
    const baseRate = pokemon.catchRate || 0.7;
    const ballMultiplier = {
      'cyber-ball': 1.0,
      'ultra-cyber-ball': 1.5,
      'master-cyber-ball': 100.0
    }[ballType] || 1.0;
    
    return Math.min(baseRate * ballMultiplier, 1.0);
  }

  static attemptCatch(pokemon: CyberPokemon, ballType: string) {
    const catchRate = this.calculateCatchRate(pokemon, ballType);
    const success = Math.random() < catchRate;
    const shakeCount = success ? 3 : Math.floor(Math.random() * 3);

    return {
      pokemonId: pokemon.id,
      ballType,
      success,
      shakeCount
    };
  }

  static generateWildPokemon(areaName: string): CyberPokemon {
    const typeMapping: { [key: string]: string } = {
      'new-bark-cyber': 'cyber-career',
      'hardware-lab': 'hardware',
      'file-forest': 'software',
      'security-city': 'security'
    };

    const rarityRoll = Math.random();
    let rarity: CyberPokemon['rarity'] = 'common';
    if (rarityRoll < 0.05) rarity = 'legendary';
    else if (rarityRoll < 0.15) rarity = 'rare';
    else if (rarityRoll < 0.35) rarity = 'uncommon';

    return {
      id: 'wild_' + Math.random().toString(36).substr(2, 9),
      name: 'Wild ' + (typeMapping[areaName] || 'Cyber') + 'mon',
      type: typeMapping[areaName] as any || 'cyber-career',
      level: Math.floor(Math.random() * 10) + 1,
      hp: 30,
      maxHp: 30,
      abilities: ['Wild Ability'],
      description: 'A wild Pokemon focused on cybersecurity concepts.',
      sprite: '🔮',
      rarity,
      dayOneSkills: ['Basic Skills'],
      isWild: true,
      catchRate: rarity === 'legendary' ? 0.05 : rarity === 'rare' ? 0.3 : rarity === 'uncommon' ? 0.6 : 0.8,
      position: {
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100
      }
    };
  }
}

const PokemonCyberMMO: React.FC = () => {
  // Game state management
  const [gameState, setGameState] = useState<'intro' | 'character-creation' | 'world' | 'battle' | 'storage' | 'team' | 'knowledge-arena'>('intro');
  
  // Battle system state
  const [battleSystem] = useState(() => new BattleSystem());
  const [triviaEngine] = useState(() => new TriviaEngine());
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [currentArea, setCurrentArea] = useState('new-bark-cyber');
  const [showAreaMap, setShowAreaMap] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<CyberPokemon | null>(null);
  const [showPokemonDetails, setShowPokemonDetails] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [teamChallengeActive, setTeamChallengeActive] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [unlockedDays, setUnlockedDays] = useState([1, 2, 3, 4, 5]);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);

  // Multiplayer state
  const [isConnected, setIsConnected] = useState(false);
  const [multiplayerManager] = useState(() => new MultiplayerManager());
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [wildPokemon, setWildPokemon] = useState<CyberPokemon[]>([]);
  const [catchingPokemon, setCatchingPokemon] = useState<CyberPokemon | null>(null);
  const [shakeAnimation, setShakeAnimation] = useState(0);

  // Player state
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    name: '',
    level: 1,
    currentArea: 'new-bark-cyber',
    team: [],
    storage: [],
    badges: [],
    completedChallenges: [],
    teammates: [],
    mentorProgress: 0,
    exp: 0,
    totalExp: 0,
    ballInventory: {
      'cyber-ball': 10,
      'ultra-cyber-ball': 3,
      'master-cyber-ball': 1
    }
  });

  // Player position for movement
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 300 });

  // Initialize multiplayer connection
  useEffect(() => {
    const initializeMultiplayer = async () => {
      try {
        await multiplayerManager.connect();
        setIsConnected(true);

        // Set up message handlers
        multiplayerManager.onMessage('player_join', (message: MultiplayerMessage) => {
          setOnlinePlayers(prev => [...prev, message.data]);
        });

        multiplayerManager.onMessage('player_leave', (message: MultiplayerMessage) => {
          setOnlinePlayers(prev => prev.filter(p => p.id !== message.playerId));
        });

        multiplayerManager.onMessage('player_move', (message: MultiplayerMessage) => {
          setOnlinePlayers(prev => prev.map(p => 
            p.id === message.playerId 
              ? { ...p, position: message.data }
              : p
          ));
        });

        multiplayerManager.onMessage('chat_message', (message: MultiplayerMessage) => {
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            playerId: message.playerId,
            playerName: message.data.playerName || 'Unknown Trainer',
            message: message.data.text,
            timestamp: new Date(),
            channel: message.data.channel || 'global'
          };
          setChatMessages(prev => [...prev, newMessage]);
        });

      } catch (error) {
        console.error('Failed to connect to multiplayer server:', error);
      }
    };

    initializeMultiplayer();

    return () => {
      multiplayerManager.disconnect();
    };
  }, [multiplayerManager]);

  // Generate wild Pokemon for current area
  useEffect(() => {
    const spawnWildPokemon = () => {
      const newWildPokemon = Array.from({ length: 3 }, () => 
        MonsterCatchingSystem.generateWildPokemon(currentArea)
      );
      setWildPokemon(newWildPokemon);
    };

    spawnWildPokemon();
  }, [currentArea]);

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== 'world') return;

      const moveSpeed = 10;
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newY = Math.max(0, newY - moveSpeed);
          break;
        case 's':
        case 'arrowdown':
          newY = Math.min(600, newY + moveSpeed);
          break;
        case 'a':
        case 'arrowleft':
          newX = Math.max(0, newX - moveSpeed);
          break;
        case 'd':
        case 'arrowright':
          newX = Math.min(800, newX + moveSpeed);
          break;
      }

      if (newX !== playerPosition.x || newY !== playerPosition.y) {
        setPlayerPosition({ x: newX, y: newY });
        multiplayerManager.updatePlayerPosition(newX, newY);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerPosition, multiplayerManager]);

  // Chat functions
  const sendChatMessage = () => {
    if (chatInput.trim()) {
      multiplayerManager.sendChatMessage(chatInput, 'global');
      setChatInput('');
    }
  };

  const handleChatKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      sendChatMessage();
    }
  };

  // Pokemon catching functions
  const encounterWildPokemon = (pokemon: CyberPokemon) => {
    setCatchingPokemon(pokemon);
    setBattleMode(true);
  };

  const attemptCatch = (ballType: string) => {
    if (!catchingPokemon) return;

    // Check if player has the ball
    if (playerProfile.ballInventory[ballType as keyof typeof playerProfile.ballInventory] <= 0) {
      alert(`You don't have any ${ballType}s left!`);
      return;
    }

    // Use the ball
    setPlayerProfile(prev => ({
      ...prev,
      ballInventory: {
        ...prev.ballInventory,
        [ballType]: prev.ballInventory[ballType as keyof typeof prev.ballInventory] - 1
      }
    }));

    const result = MonsterCatchingSystem.attemptCatch(catchingPokemon, ballType);
    
    // Animate shake
    setShakeAnimation(result.shakeCount);
    
    setTimeout(() => {
      if (result.success) {
        // Add to team or storage
        const caughtPokemon = {
          ...catchingPokemon,
          id: `caught_${Date.now()}`,
          isWild: false
        };

        setPlayerProfile(prev => ({
          ...prev,
          team: prev.team.length < 6 ? [...prev.team, caughtPokemon] : prev.team,
          storage: prev.team.length >= 6 ? [...prev.storage, caughtPokemon] : prev.storage,
          exp: prev.exp + 25
        }));

        // Remove from wild Pokemon
        setWildPokemon(prev => prev.filter(p => p.id !== catchingPokemon.id));
        
        // Dispatch custom event for testing
        document.dispatchEvent(new CustomEvent('pokemonCaught', {
          detail: { pokemon: caughtPokemon }
        }));

        alert(`${catchingPokemon.name} was caught!`);
      } else {
        alert(`${catchingPokemon.name} broke free!`);
      }

      setCatchingPokemon(null);
      setBattleMode(false);
      setShakeAnimation(0);
    }, 2000);
  };

  // Level up system
  useEffect(() => {
    const expForNextLevel = playerProfile.level * 100;
    if (playerProfile.exp >= expForNextLevel) {
      setPlayerProfile(prev => ({
        ...prev,
        level: prev.level + 1,
        exp: prev.exp - expForNextLevel,
        totalExp: prev.totalExp + expForNextLevel
      }));

      // Dispatch level up event
      document.dispatchEvent(new CustomEvent('playerLevelUp', {
        detail: { newLevel: playerProfile.level + 1, oldLevel: playerProfile.level }
      }));
    }
  }, [playerProfile.exp, playerProfile.level]);

  // Area unlocking system
  useEffect(() => {
    if (playerProfile.level >= 10) {
      document.dispatchEvent(new CustomEvent('areaUnlocked', {
        detail: { area: 'advanced-security-lab', level: 10 }
      }));
    }
  }, [playerProfile.level]);

  // Battle system functions
  const initiateBattle = (opponent: Player) => {
    const player1 = createBattlePlayer(playerProfile, playerPosition);
    const player2 = createBattlePlayer({
      ...playerProfile,
      name: opponent.name,
      level: opponent.level || 1
    }, opponent.position);

    const eligibility = battleSystem.checkBattleEligibility(player1, player2);
    if (!eligibility.canBattle) {
      setBattleLog(prev => [...prev, `Cannot battle: ${eligibility.reason}`]);
      return;
    }

    const battle = battleSystem.initiateBattle(player1, player2);
    setCurrentBattle(battle);
    setGameState('battle');
    setBattleLog(prev => [...prev, `Battle started between ${player1.name} and ${player2.name}!`]);
    
    // Start first question
    generateNextQuestion();
  };

  const generateNextQuestion = () => {
    if (!currentBattle) return;
    
    const difficulty = getDifficultyForLevel(currentBattle.player1.currentPokemon.level);
    const categories = ['fundamentals', 'networking', 'security', 'cryptography'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const question = triviaEngine.generateQuestion(difficulty, randomCategory);
    setCurrentQuestion(question);
    setQuestionTimeLeft(30);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentBattle || !currentQuestion) return;

    const result = triviaEngine.processAnswer(
      currentBattle,
      currentBattle.currentTurn,
      currentQuestion,
      answerIndex
    );

    // Update battle log
    const currentPlayer = currentBattle.currentTurn === currentBattle.player1.id ? 
      currentBattle.player1 : currentBattle.player2;
    const opponent = currentBattle.currentTurn === currentBattle.player1.id ? 
      currentBattle.player2 : currentBattle.player1;

    if (result.isCorrect) {
      setBattleLog(prev => [...prev, 
        `✅ ${currentPlayer.name} answered correctly!`,
        `💥 ${opponent.name} takes ${result.damageDealt} damage!`
      ]);
      opponent.currentPokemon.hp -= result.damageDealt;
    } else {
      setBattleLog(prev => [...prev, 
        `❌ ${currentPlayer.name} answered incorrectly!`,
        `💔 ${currentPlayer.name} takes ${result.selfDamage} self-damage!`
      ]);
      currentPlayer.currentPokemon.hp -= result.selfDamage;
    }

    // Check for battle end
    if (currentBattle.player1.currentPokemon.hp <= 0 || currentBattle.player2.currentPokemon.hp <= 0) {
      const battleResult = battleSystem.concludeBattle(currentBattle.id);
      setBattleLog(prev => [...prev, `🏆 ${battleResult.winner} wins the battle!`]);
      
      // Award experience
      setPlayerProfile(prev => ({
        ...prev,
        exp: prev.exp + battleResult.expGained.player1
      }));
      
      setCurrentBattle(null);
      setCurrentQuestion(null);
      setGameState('world');
    } else {
      // Continue battle - switch turns and new question
      battleSystem.completeTurn(currentBattle.id, currentBattle.currentTurn);
      setTimeout(generateNextQuestion, 2000); // 2 second delay for feedback
    }
  };

  // Question timer
  useEffect(() => {
    if (currentQuestion && questionTimeLeft > 0) {
      const timer = setTimeout(() => {
        setQuestionTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentQuestion && questionTimeLeft === 0) {
      // Time's up - treat as incorrect answer
      handleAnswerSelect(-1); // Invalid answer index
    }
  }, [currentQuestion, questionTimeLeft]);

  const gameAreas: GameArea[] = [
    {
      id: 'new-bark-cyber',
      name: 'New Bark Cyber Town',
      description: 'Your cybersecurity journey begins here! Meet Professor Oak-Sec and choose your first cyber career Pokemon.',
      unlocked: true,
      dayOneConcepts: ['Meet Teammates', 'Cyber Careers', 'Choose Your Path'],
      bgGradient: 'from-green-400 to-blue-500',
      icon: '🏠',
      wildPokemon: []
    },
    {
      id: 'hardware-lab',
      name: 'Hardware Lab City',
      description: 'Discover the physical world of computers! Take apart and rebuild systems with your Pokemon.',
      unlocked: false,
      dayOneConcepts: ['Hardware vs Software', 'Computer Components', 'System Assembly'],
      bgGradient: 'from-orange-400 to-red-500',
      icon: '🔧',
      wildPokemon: []
    }
  ];

  if (gameState === 'knowledge-arena') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <KnowledgeArena />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Chat System */}
      {showChat && (
        <div className="fixed bottom-4 left-4 w-80 h-64 bg-black bg-opacity-80 rounded-lg p-4 text-white z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Global Chat</h3>
            <button onClick={() => setShowChat(false)}>✕</button>
          </div>
          <div className="h-40 overflow-y-auto mb-2 space-y-1">
            {chatMessages.map(msg => (
              <div key={msg.id} className="text-sm">
                <span className="text-blue-300">{msg.playerName}:</span> {msg.message}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-2 py-1 bg-gray-700 rounded-l text-white text-sm"
            />
            <button
              onClick={sendChatMessage}
              className="px-3 py-1 bg-blue-600 rounded-r text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Battle System */}
      {battleMode && catchingPokemon && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40">
          <div className="bg-gradient-to-br from-purple-800 to-blue-900 p-8 rounded-xl text-white text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Wild {catchingPokemon.name} appeared!</h2>
            <div className={`text-6xl mb-4 ${shakeAnimation > 0 ? 'animate-bounce' : ''}`}>
              {catchingPokemon.sprite}
            </div>
            <p className="mb-4">{catchingPokemon.description}</p>
            
            <div className="space-y-2">
              <h3 className="font-bold">Choose your Cyber Ball:</h3>
              {Object.entries(playerProfile.ballInventory).map(([ballType, count]) => (
                <button
                  key={ballType}
                  onClick={() => attemptCatch(ballType)}
                  disabled={count <= 0}
                  className={`block w-full p-2 rounded ${
                    count > 0 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                  data-testid="cyber-ball-button"
                >
                  {ballType.replace('-', ' ')} ({count} left)
                </button>
              ))}
              <button
                onClick={() => {
                  setCatchingPokemon(null);
                  setBattleMode(false);
                }}
                className="w-full p-2 bg-gray-600 rounded mt-4"
              >
                Run Away
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Interface */}
      <div className="p-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setGameState('knowledge-arena')}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold"
            >
              🧠 Enter Knowledge Arena
            </button>

            <button
              onClick={() => {
                // Demo battle with a mock opponent
                const mockOpponent: Player = {
                  id: 'demo-opponent',
                  name: 'Cyber Challenger',
                  position: { x: 200, y: 200 },
                  currentArea: 'battle-arena',
                  pokemon: [],
                  level: Math.max(1, playerProfile.level - 1),
                  isOnline: true,
                  lastSeen: new Date(),
                  sprite: '🤖'
                };
                initiateBattle(mockOpponent);
              }}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2"
            >
              <ZapIcon className="w-5 h-5" />
              <span>⚔️ Battle Challenge</span>
            </button>
            
            <div className="flex items-center space-x-2 text-white">
              <Wifi className={`w-5 h-5 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-sm">{isConnected ? 'Online' : 'Offline'}</span>
              <span className="text-sm">({onlinePlayers.length} players)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setGameState('team')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Team ({playerProfile.team.length}/6)
            </button>

            <button
              onClick={() => setShowAreaMap(!showAreaMap)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              data-testid="area-selector"
            >
              <MapPin className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Game World */}
        {gameState === 'world' || gameState === 'intro' ? (
          <div 
            className="relative bg-gradient-to-br from-green-400 to-blue-600 rounded-xl p-8 min-h-[600px]"
            data-testid="game-world"
          >
            {/* Player Character */}
            <div
              className="absolute w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg z-20 transition-all duration-200"
              style={{ left: playerPosition.x, top: playerPosition.y }}
              data-testid="player-character"
            >
              🧑‍💻
            </div>

            {/* Other Players */}
            {onlinePlayers.map(player => (
              <div
                key={player.id}
                className="absolute w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-lg z-20"
                style={{ left: player.position.x, top: player.position.y }}
                title={player.name}
              >
                {player.sprite || '👤'}
              </div>
            ))}

            {/* Wild Pokemon */}
            {wildPokemon.map(pokemon => (
              <div
                key={pokemon.id}
                className="absolute w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform z-10"
                style={{ left: pokemon.position?.x, top: pokemon.position?.y }}
                onClick={() => encounterWildPokemon(pokemon)}
                data-testid={`wild-pokemon-${pokemon.name.toLowerCase()}`}
                title={`Wild ${pokemon.name} - Click to battle!`}
              >
                {pokemon.sprite}
              </div>
            ))}

            {/* Game UI */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h3 className="font-bold text-lg">{gameAreas.find(a => a.id === currentArea)?.name}</h3>
              <p className="text-sm">Use WASD to move around</p>
              <p className="text-sm">Click wild Pokemon to battle!</p>
              <div className="mt-2 text-sm">
                <div>Level: {playerProfile.level}</div>
                <div>EXP: {playerProfile.exp}/{playerProfile.level * 100}</div>
                <div>Cyber Balls: {playerProfile.ballInventory['cyber-ball']}</div>
              </div>
            </div>

            {/* Wild Pokemon Spawned Notification */}
            {wildPokemon.length > 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                  Wild Pokemon appeared in the area!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Pokemon Cyber MMO</h1>
            <p>Current state: {gameState}</p>
            <p>Day {currentDay} of GenCyber Camp</p>
            
            {gameState === 'intro' && (
              <div className="mt-8">
                <button
                  onClick={() => setGameState('world')}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-green-700"
                >
                  Enter the Cyber World!
                </button>
              </div>
            )}

            {/* Battle Interface */}
            {gameState === 'battle' && currentBattle && (
              <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-50">
                <div className="h-full flex flex-col">
                  {/* Battle Header */}
                  <div className="bg-black bg-opacity-50 p-4 text-center">
                    <h2 className="text-3xl font-bold text-white">🔥 Cyber Battle Arena 🔥</h2>
                    <p className="text-xl text-cyan-300">
                      {currentBattle.player1.name} VS {currentBattle.player2.name}
                    </p>
                  </div>

                  {/* Battle Status */}
                  <div className="flex justify-between p-6 bg-black bg-opacity-30">
                    {/* Player 1 */}
                    <div className="bg-blue-800 p-4 rounded-xl text-white max-w-xs">
                      <h3 className="font-bold text-lg">{currentBattle.player1.name}</h3>
                      <div className="text-6xl my-2">🛡️</div>
                      <p className="text-sm">{currentBattle.player1.currentPokemon.name}</p>
                      <p className="text-sm">Level {currentBattle.player1.currentPokemon.level}</p>
                      <div className="mt-2">
                        <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all duration-500"
                            style={{ 
                              width: `${Math.max(0, (currentBattle.player1.currentPokemon.hp / currentBattle.player1.currentPokemon.maxHp) * 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs mt-1">
                          HP: {Math.max(0, currentBattle.player1.currentPokemon.hp)}/{currentBattle.player1.currentPokemon.maxHp}
                        </p>
                      </div>
                    </div>

                    {/* VS Indicator */}
                    <div className="flex items-center">
                      <div className="text-6xl animate-pulse">⚡</div>
                    </div>

                    {/* Player 2 */}
                    <div className="bg-red-800 p-4 rounded-xl text-white max-w-xs">
                      <h3 className="font-bold text-lg">{currentBattle.player2.name}</h3>
                      <div className="text-6xl my-2">🗡️</div>
                      <p className="text-sm">{currentBattle.player2.currentPokemon.name}</p>
                      <p className="text-sm">Level {currentBattle.player2.currentPokemon.level}</p>
                      <div className="mt-2">
                        <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all duration-500"
                            style={{ 
                              width: `${Math.max(0, (currentBattle.player2.currentPokemon.hp / currentBattle.player2.currentPokemon.maxHp) * 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs mt-1">
                          HP: {Math.max(0, currentBattle.player2.currentPokemon.hp)}/{currentBattle.player2.currentPokemon.maxHp}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Question Display */}
                  {currentQuestion && (
                    <div className="flex-1 flex flex-col justify-center p-6">
                      {/* Turn Indicator */}
                      <div className="text-center mb-4">
                        <div className={`inline-block px-6 py-2 rounded-full text-white font-bold ${
                          currentBattle.currentTurn === currentBattle.player1.id ? 'bg-blue-600' : 'bg-red-600'
                        }`}>
                          {currentBattle.currentTurn === currentBattle.player1.id ? 
                            currentBattle.player1.name : currentBattle.player2.name}'s Turn
                        </div>
                      </div>

                      {/* Question Card */}
                      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-3">
                            <Brain className="w-8 h-8 text-purple-600" />
                            <span className="text-2xl font-bold text-purple-800">
                              Cyber Challenge
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-2xl font-bold text-red-600">
                            <Target className="w-6 h-6" />
                            {questionTimeLeft}s
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-6 text-gray-800">
                          {currentQuestion.question}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          {currentQuestion.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                              <span className="text-2xl mr-3">
                                {['🅰️', '🅱️', '🅲️', '🅳️'][index]}
                              </span>
                              {option}
                            </button>
                          ))}
                        </div>

                        <div className="mt-6 text-center">
                          <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                            currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {currentQuestion.difficulty.toUpperCase()} • {currentQuestion.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Battle Log */}
                  <div className="bg-black bg-opacity-50 p-4 max-h-32 overflow-y-auto">
                    <h4 className="text-white font-bold mb-2">Battle Log:</h4>
                    {battleLog.slice(-5).map((log, index) => (
                      <p key={index} className="text-gray-300 text-sm">{log}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gameState === 'team' && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Team</h2>
                <div className="grid grid-cols-2 gap-4">
                  {playerProfile.team.map(pokemon => (
                    <div key={pokemon.id} className="bg-blue-800 p-4 rounded-lg">
                      <div className="text-4xl mb-2">{pokemon.sprite}</div>
                      <h3 className="font-bold">{pokemon.name}</h3>
                      <p className="text-sm">{pokemon.type}</p>
                      <p className="text-sm">Level {pokemon.level}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setGameState('world')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Back to World
                </button>
              </div>
            )}
          </div>
        )}

        {/* Area Map */}
        {showAreaMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white p-8 rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Cyber Region Map</h2>
                <button
                  onClick={() => setShowAreaMap(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {gameAreas.map(area => (
                  <div
                    key={area.id}
                    className={`p-4 rounded-lg cursor-pointer border-2 ${
                      area.unlocked 
                        ? 'bg-gradient-to-br ' + area.bgGradient + ' text-white border-transparent hover:scale-105'
                        : 'bg-gray-300 text-gray-600 border-gray-400'
                    } transition-transform`}
                    onClick={() => {
                      if (area.unlocked) {
                        setCurrentArea(area.id);
                        setShowAreaMap(false);
                      }
                    }}
                  >
                    <div className="text-3xl mb-2">{area.icon}</div>
                    <h3 className="font-bold text-lg">{area.name}</h3>
                    <p className="text-sm opacity-90">{area.description}</p>
                    {!area.unlocked && (
                      <p className="text-xs mt-2 text-red-600">🔒 Locked</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trading Interface Placeholder */}
      <div className="hidden">
        <button data-testid="trade-button">Trade</button>
        <button data-testid="form-team-button">Form Team</button>
        <button data-testid="start-battle">Start Battle</button>
        <input placeholder="Type a message..." />
      </div>
    </div>
  );
};

export default PokemonCyberMMO;
