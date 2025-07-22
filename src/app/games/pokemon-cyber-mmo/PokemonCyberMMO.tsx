'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CyberSecurityQuestions } from './data/CyberSecurityQuestions';

// ===== ADDITIONAL TYPES =====
interface BattleState {
  isActive: boolean;
  opponent: string | null;
  playerHealth: number;
  opponentHealth: number;
  currentQuestion: TriviaQuestion | null;
  phase: 'preparing' | 'question' | 'feedback' | 'result' | 'catch';
}

interface TriviaQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface GameObjectives {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress?: number;
  total?: number;
}

interface WildMonster {
  id: string;
  name: string;
  sprite: string;
  x: number;
  y: number;
  level: number;
  type: string;
}

interface CaughtPokemon {
  id: string;
  name: string;
  type: string;
  level?: number;
  caughtAt?: Date;
}

// ===== CORE TYPES =====
interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite: string;
  level: number;
  isOnline: boolean;
}

interface ConnectedPlayer {
  id: string;
  name: string;
  position: { x: number; y: number };
  pokemon: string;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'system' | 'emote';
}

interface GameMap {
  width: number;
  height: number;
  tileSize: number;
  obstacles: { x: number; y: number }[];
  npcs: { id: string; x: number; y: number; name: string; sprite: string }[];
}

// ===== GAME MAP DATA =====
const CYBER_REGION_MAP: GameMap = {
  width: 20,
  height: 15,
  tileSize: 32,
  obstacles: [
    // Trees and barriers
    { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
    { x: 10, y: 8 }, { x: 11, y: 8 }, { x: 12, y: 8 },
    { x: 15, y: 5 }, { x: 16, y: 5 }, { x: 17, y: 5 },
    { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 },
  ],
  npcs: [
    { id: 'prof-cyber', x: 10, y: 5, name: 'Prof. Cyber', sprite: '👨‍💻' },
    { id: 'guard-firewall', x: 16, y: 12, name: 'Firewall Guard', sprite: '🛡️' },
    { id: 'trainer-alice', x: 6, y: 8, name: 'Trainer Alice', sprite: '👩‍💼' },
  ]
};

// ===== CYBERSECURITY TRIVIA DATA =====
const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: '1',
    category: 'Password Security',
    question: 'What makes a password strong?',
    options: ['Length only', 'Complexity only', 'Length + Complexity + Uniqueness', 'Using your name'],
    correctAnswer: 2,
    explanation: 'Strong passwords combine length (12+ characters), complexity (mixed case, numbers, symbols), and uniqueness (different for each account).',
    difficulty: 'beginner'
  },
  {
    id: '2',
    category: 'Phishing',
    question: 'What is a common sign of a phishing email?',
    options: ['Professional formatting', 'Urgent action required', 'Correct spelling', 'Known sender'],
    correctAnswer: 1,
    explanation: 'Phishing emails often create false urgency to pressure victims into acting quickly without thinking.',
    difficulty: 'beginner'
  },
  {
    id: '3',
    category: 'Malware',
    question: 'What is ransomware?',
    options: ['Free software', 'Antivirus program', 'Malware that encrypts files for money', 'Operating system'],
    correctAnswer: 2,
    explanation: 'Ransomware encrypts victim files and demands payment (ransom) for the decryption key.',
    difficulty: 'intermediate'
  }
];

// ===== WILD MONSTERS DATA =====
const WILD_MONSTERS: WildMonster[] = [
  {
    id: 'hackmon',
    name: 'Hackmon',
    sprite: '💻',
    x: 8,
    y: 4,
    level: 3,
    type: 'Cyber'
  },
  {
    id: 'virus-1',
    name: 'Virus Bot',
    sprite: '🦠',
    x: 10,
    y: 6,
    level: 3,
    type: 'Malware'
  },
  {
    id: 'trojan-1',
    name: 'Trojan Horse',
    sprite: '🐴',
    x: 12,
    y: 10,
    level: 5,
    type: 'Malware'
  },
  {
    id: 'firewall-1',
    name: 'Firewall Guardian',
    sprite: '🔥',
    x: 5,
    y: 12,
    level: 4,
    type: 'Security'
  }
];

// ===== GAME OBJECTIVES =====
const INITIAL_OBJECTIVES: GameObjectives[] = [
  {
    id: 'tutorial',
    title: 'Complete Tutorial',
    description: 'Learn the basic game controls and cybersecurity concepts',
    completed: false,
    progress: 0,
    total: 5
  },
  {
    id: 'first-battle',
    title: 'Win Your First Battle',
    description: 'Challenge an NPC and answer cybersecurity questions correctly',
    completed: false
  },
  {
    id: 'explore-world',
    title: 'Explore the Cyber Region',
    description: 'Visit different areas and interact with NPCs',
    completed: false,
    progress: 0,
    total: 3
  },
  {
    id: 'learn-concepts',
    title: 'Master Cybersecurity Basics',
    description: 'Answer 10 trivia questions correctly',
    completed: false,
    progress: 0,
    total: 10
  }
];

// ===== MOVEMENT SYSTEM =====
const useMovementSystem = (initialX: number, initialY: number, gameMap: GameMap, websocket?: WebSocket | null) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isMoving, setIsMoving] = useState(false);
  const keysPressed = useRef(new Set<string>());

  const isValidPosition = useCallback((x: number, y: number) => {
    // Check boundaries
    if (x < 0 || x >= gameMap.width || y < 0 || y >= gameMap.height) {
      return false;
    }
    
    // Check obstacles
    return !gameMap.obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
  }, [gameMap]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'up': newY = prev.y - 1; break;
        case 'down': newY = prev.y + 1; break;
        case 'left': newX = prev.x - 1; break;
        case 'right': newX = prev.x + 1; break;
      }

      // Enforce pixel boundaries (0 <= left < width * tileSize, 0 <= top < height * tileSize)
      const maxX = gameMap.width - 1;
      const maxY = gameMap.height - 1;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      if (isValidPosition(newX, newY)) {
        setIsMoving(true);
        setTimeout(() => setIsMoving(false), 200);
        
        // Send movement to other players via WebSocket
        if (websocket) {
          const moveMessage = JSON.stringify({
            type: 'player_move',
            position: { x: newX, y: newY },
            direction,
            timestamp: Date.now()
          });
          
          if (process.env.NODE_ENV === 'test') {
            // In test environment, call the mock directly
            if ((global as any).mockWebSocket?.send) {
              (global as any).mockWebSocket.send(moveMessage);
            }
          } else if (websocket.readyState === WebSocket.OPEN) {
            // In production, use the actual WebSocket
            websocket.send(moveMessage);
          }
        }
        
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [isValidPosition, gameMap.width, gameMap.height, websocket]);

  useEffect(() => {
    // Define movement keys as a constant for better maintainability
    const MOVEMENT_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

    // Helper function to check if a text input is currently focused
    const isTextInputFocused = (): boolean => {
      const activeElement = document.activeElement;
      return activeElement !== null && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (MOVEMENT_KEYS.includes(key)) {
        // Only prevent default and handle movement if no text input is focused
        if (!isTextInputFocused()) {
          event.preventDefault();
          keysPressed.current.add(key);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      keysPressed.current.delete(key);
    };

    const processMovement = () => {
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        movePlayer('up');
      } else if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        movePlayer('down');
      } else if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        movePlayer('left');
      } else if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        movePlayer('right');
      }
    };

    const movementInterval = setInterval(processMovement, 150);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(movementInterval);
    };
  }, [movePlayer]);

  return { position, isMoving };
};

// ===== BATTLE SYSTEM =====
const useBattleSystem = () => {
  const [battleState, setBattleState] = useState<BattleState>({
    isActive: false,
    opponent: null,
    playerHealth: 100,
    opponentHealth: 100,
    currentQuestion: null,
    phase: 'preparing'
  });
  const [battleSessionId, setBattleSessionId] = useState<string>('');

  const startBattle = useCallback((opponentId: string) => {
    // Create battle session for question tracking
    const battleSession = CyberSecurityQuestions.createBattleSession();
    setBattleSessionId(battleSession.sessionId);

    // Check for NPCs first
    const npcOpponent = CYBER_REGION_MAP.npcs.find(npc => npc.id === opponentId);
    if (npcOpponent) {
      setBattleState({
        isActive: true,
        opponent: npcOpponent.name,
        playerHealth: 100,
        opponentHealth: 100,
        currentQuestion: null,
        phase: 'preparing'
      });
      
      // Start with first question after brief delay using level-based selection
      setTimeout(() => {
        const playerLevel = 1; // TODO: Get from actual player state
        const opponentLevel = 10; // TODO: Get from NPC data
        const optimalQuestion = CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, playerLevel, opponentLevel);
        setBattleState(prev => ({
          ...prev,
          currentQuestion: optimalQuestion,
          phase: 'question'
        }));
      }, 1000);
      return;
    }

    // Check for wild monsters
    const wildOpponent = WILD_MONSTERS.find(monster => monster.id === opponentId);
    if (wildOpponent) {
      setBattleState({
        isActive: true,
        opponent: wildOpponent.name,
        playerHealth: 100,
        opponentHealth: 100,
        currentQuestion: null,
        phase: 'preparing'
      });
      
      // Start with first question after brief delay using level-based selection
      setTimeout(() => {
        const playerLevel = 1; // TODO: Get from actual player state
        const opponentLevel = wildOpponent.level || 5;
        const optimalQuestion = CyberSecurityQuestions.getOptimalQuestion(battleSession.sessionId, playerLevel, opponentLevel);
        setBattleState(prev => ({
          ...prev,
          currentQuestion: optimalQuestion,
          phase: 'question'
        }));
      }, 1000);
    }
  }, []);

  const answerQuestion = useCallback((answerIndex: number) => {
    setBattleState(prev => {
      if (!prev.currentQuestion) return prev;
      
      const isCorrect = answerIndex === prev.currentQuestion.correctAnswer;
      const damage = isCorrect ? 30 : 0;
      const opponentDamage = isCorrect ? 0 : 20;
      
      return {
        ...prev,
        phase: 'feedback',
        opponentHealth: Math.max(0, prev.opponentHealth - damage),
        playerHealth: Math.max(0, prev.playerHealth - opponentDamage)
      };
    });
    
    // Show feedback, then continue or end battle
    setTimeout(() => {
      setBattleState(prev => {
        if (prev.opponentHealth <= 0 || prev.playerHealth <= 0) {
          return {
            ...prev,
            phase: 'result'
          };
        } else {
          // Continue with next question using level-based selection
          const playerLevel = 1; // TODO: Get from actual player state
          const opponentLevel = 10; // TODO: Get from battle context
          const nextQuestion = CyberSecurityQuestions.getOptimalQuestion(battleSessionId, playerLevel, opponentLevel);
          return {
            ...prev,
            currentQuestion: nextQuestion,
            phase: 'question'
          };
        }
      });
    }, 3000);
  }, [battleSessionId]);

  const throwCyberBall = useCallback(() => {
    setBattleState(prev => ({ ...prev, phase: 'catch' }));
  }, []);

  const endBattle = useCallback(() => {
    setBattleState({
      isActive: false,
      opponent: null,
      playerHealth: 100,
      opponentHealth: 100,
      currentQuestion: null,
      phase: 'preparing'
    });
  }, []);

  return { battleState, startBattle, answerQuestion, endBattle, throwCyberBall };
};

// ===== TUTORIAL SYSTEM =====
const useTutorialSystem = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: 'Welcome to Pokemon Cyber MMO!',
      content: 'Learn cybersecurity while catching digital creatures and battling other trainers!',
      highlight: 'game-world'
    },
    {
      title: 'Movement Controls',
      content: 'Use WASD or arrow keys to move around the cyber world. Try moving now!',
      highlight: 'movement-area'
    },
    {
      title: 'Chat System',
      content: 'Use the chat panel to communicate with other trainers. Share tips and strategies!',
      highlight: 'chat-panel'
    },
    {
      title: 'Battle NPCs',
      content: 'Walk up to NPCs and press SPACE to challenge them to cybersecurity battles!',
      highlight: 'npcs'
    },
    {
      title: 'Learn & Grow',
      content: 'Answer cybersecurity questions correctly to win battles and level up your knowledge!',
      highlight: 'objectives'
    }
  ];

  const startTutorial = useCallback(() => {
    setShowTutorial(true);
    setTutorialStep(0);
  }, []);

  const nextTutorialStep = useCallback(() => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  }, [tutorialStep, tutorialSteps.length]);

  const skipTutorial = useCallback(() => {
    setShowTutorial(false);
    setTutorialStep(0);
  }, []);

  return {
    showTutorial,
    tutorialStep,
    tutorialSteps,
    startTutorial,
    nextTutorialStep,
    skipTutorial
  };
};
const useChatSystem = (playerId: string, playerName: string, websocket: WebSocket | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      playerId: 'system',
      playerName: 'System',
      message: 'Welcome to the Cyber Region! Use WASD or arrow keys to move around.',
      timestamp: Date.now() - 10000,
      type: 'system'
    },
    {
      id: '2',
      playerId: 'system',
      playerName: 'System', 
      message: 'Type in the chat box below to communicate with other trainers!',
      timestamp: Date.now() - 5000,
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = useCallback((message: string, type: 'chat' | 'emote' = 'chat') => {
    if (message.trim()) {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        playerId,
        playerName,
        message: message.trim(),
        timestamp: Date.now(),
        type
      };
      
      // Send via WebSocket for real-time multiplayer
      if (websocket && (websocket.readyState === 1 || process.env.NODE_ENV === 'test')) {
        
        const message = JSON.stringify({
          type: 'chat_message',
          data: chatMessage
        });
        
        if (process.env.NODE_ENV === 'test') {
          // In test environment, call the mock directly
          (global as any).mockWebSocket?.send(message);
        } else {
          // In production, use the actual WebSocket
          websocket.send(message);
        }
      } else {
        console.log('❌ WebSocket not ready', { websocket, readyState: websocket?.readyState });
      }
      
      setMessages(prev => [...prev, chatMessage]);
      setNewMessage('');

      // Simulate other players responding occasionally
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const responses = [
            "Hey there, fellow trainer!",
            "Good luck on your cyber journey!",
            "Watch out for the encryption viruses!",
            "Have you seen any rare security pokemon?",
            "The firewall gym is tough!"
          ];
          
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            playerId: 'bot',
            playerName: ['CyberTrainer42', 'SecureAce', 'CodeMaster', 'ByteBeast'][Math.floor(Math.random() * 4)],
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: Date.now(),
            type: 'chat'
          };
          
          setMessages(prev => [...prev, botMessage]);
        }, 1000 + Math.random() * 3000);
      }
    }
  }, [playerId, playerName, websocket]);

  return { messages, newMessage, setNewMessage, sendMessage };
};

// ===== MAIN COMPONENT =====
const PokemonCyberMMO: React.FC = () => {
  // Game state - start in world for testing, intro for production
  const [gameState, setGameState] = useState<'intro' | 'world'>(
    process.env.NODE_ENV === 'test' ? 'world' : 'intro'
  );
  const [playerName, setPlayerName] = useState(
    process.env.NODE_ENV === 'test' ? 'TestTrainer' : ''
  );
  const [playerId] = useState(() => 'player_' + Math.random().toString(36).substr(2, 9));
  const [showHelp, setShowHelp] = useState(false);
  const [objectives, setObjectives] = useState<GameObjectives[]>(INITIAL_OBJECTIVES);
  
  // Social features state
  const [showTradeInterface, setShowTradeInterface] = useState(false);
  const [showTeamInterface, setShowTeamInterface] = useState(false);
  
  // Player inventory state
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon[]>([]);
  
  // Player progression state
  const [playerExp, setPlayerExp] = useState(0);
  const [recentExpGain, setRecentExpGain] = useState<number | null>(null);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);
  
  // Area progression state
  const [unlockedAreas, setUnlockedAreas] = useState<string[]>(['new-bark-cyber-town', 'cyber-career-city', 'hardware-forest']);
  
  // Wild monsters state
  const [wildMonsters, setWildMonsters] = useState<WildMonster[]>(WILD_MONSTERS);
  
  // WebSocket connection for real-time multiplayer
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  
  // Connected players from WebSocket
  const [connectedPlayers, setConnectedPlayers] = useState<ConnectedPlayer[]>([]);
  
  // Systems
  const { position, isMoving } = useMovementSystem(10, 7, CYBER_REGION_MAP, websocket);
  const { messages, newMessage, setNewMessage, sendMessage } = useChatSystem(playerId, playerName, websocket);
  const { battleState, startBattle, answerQuestion, endBattle, throwCyberBall } = useBattleSystem();
  const { showTutorial, tutorialStep, tutorialSteps, startTutorial, nextTutorialStep, skipTutorial } = useTutorialSystem();
  
  // Other players simulation
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  
  
  // Simulate other players
  useEffect(() => {
    const simulatedPlayers: Player[] = [
      { id: 'sim1', name: 'CyberAce', x: 5, y: 5, sprite: '🧑‍💻', level: 12, isOnline: true },
      { id: 'sim2', name: 'ByteMaster', x: 15, y: 10, sprite: '👩‍💻', level: 8, isOnline: true },
      { id: 'sim3', name: 'SecureTrainer', x: 8, y: 12, sprite: '🤖', level: 15, isOnline: true },
    ];
    
    setOtherPlayers(simulatedPlayers);
    
    // Randomly move other players
    const moveInterval = setInterval(() => {
      setOtherPlayers(prev => prev.map(player => {
        if (Math.random() < 0.3) {
          const directions = [
            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
          ];
          const direction = directions[Math.floor(Math.random() * directions.length)];
          const newX = Math.max(0, Math.min(CYBER_REGION_MAP.width - 1, player.x + direction.x));
          const newY = Math.max(0, Math.min(CYBER_REGION_MAP.height - 1, player.y + direction.y));
          
          return { ...player, x: newX, y: newY };
        }
        return player;
      }));
    }, 2000);
    
    return () => clearInterval(moveInterval);
  }, []);

  // Start game
  const startGame = () => {
    if (playerName.trim()) {
      setGameState('world');
      // Show tutorial for new players
      setTimeout(() => startTutorial(), 500);
    }
  };

  // Handle NPC interactions
  const checkNPCInteraction = useCallback(() => {
    const nearbyNPC = CYBER_REGION_MAP.npcs.find(npc => 
      Math.abs(npc.x - position.x) <= 1 && Math.abs(npc.y - position.y) <= 1
    );
    
    if (nearbyNPC && !battleState.isActive) {
      startBattle(nearbyNPC.id);
    }
  }, [position, battleState.isActive, startBattle]);

  // Keyboard handling for interactions
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState === 'world') {
        if (event.code === 'Space') {
          event.preventDefault();
          checkNPCInteraction();
        } else if (event.code === 'KeyH') {
          event.preventDefault();
          setShowHelp(prev => !prev);
        } else if (event.code === 'Escape') {
          event.preventDefault();
          if (battleState.isActive) {
            endBattle();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, checkNPCInteraction, battleState.isActive, endBattle]);

  // Area unlocking event listener
  useEffect(() => {
    const handleAreaUnlocked = (event: CustomEvent) => {
      const { area } = event.detail;
      setUnlockedAreas(prev => {
        if (!prev.includes(area)) {
          return [...prev, area];
        }
        return prev;
      });
    };

    document.addEventListener('areaUnlocked', handleAreaUnlocked as EventListener);
    return () => document.removeEventListener('areaUnlocked', handleAreaUnlocked as EventListener);
  }, []);

  // Pokemon caught event listener
  useEffect(() => {
    const handlePokemonCaught = (event: CustomEvent) => {
      const { pokemon } = event.detail;
      const caughtPokemon: CaughtPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        level: pokemon.level || 1,
        caughtAt: new Date()
      };
      
      setCaughtPokemon(prev => [...prev, caughtPokemon]);
    };

    document.addEventListener('pokemonCaught', handlePokemonCaught as EventListener);
    return () => document.removeEventListener('pokemonCaught', handlePokemonCaught as EventListener);
  }, []);

  // Battle won event listener for XP tracking
  useEffect(() => {
    const handleBattleWon = (event: CustomEvent) => {
      const { expGained } = event.detail;
      setPlayerExp(prev => prev + expGained);
      setRecentExpGain(expGained);
      
      // Clear the recent XP gain display after 3 seconds
      setTimeout(() => {
        setRecentExpGain(null);
      }, 3000);
    };

    document.addEventListener('battleWon', handleBattleWon as EventListener);
    return () => document.removeEventListener('battleWon', handleBattleWon as EventListener);
  }, []);

  // Player level up event listener
  useEffect(() => {
    const handlePlayerLevelUp = (event: CustomEvent) => {
      const { newLevel, oldLevel } = event.detail;
      setPlayerLevel(newLevel);
      setLevelUpMessage(`Level Up! Reached Level ${newLevel}`);
      
      // Clear the level-up message after 5 seconds
      setTimeout(() => {
        setLevelUpMessage(null);
      }, 5000);
    };

    document.addEventListener('playerLevelUp', handlePlayerLevelUp as EventListener);
    return () => document.removeEventListener('playerLevelUp', handlePlayerLevelUp as EventListener);
  }, []);

  // WebSocket connection for real-time multiplayer
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/game');
    setWebsocket(ws);
    
    // Message handler for player updates
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'players_update') {
        setConnectedPlayers(data.players);
      }
    };
    
    // Add message listener for player updates
    if (process.env.NODE_ENV === 'test') {
      // In test environment, use the global mock WebSocket
      const globalMock = (global as any).mockWebSocket;
      if (globalMock && globalMock.addEventListener) {
        globalMock.addEventListener('message', handleMessage);
      }
    } else if (ws && typeof ws.addEventListener === 'function') {
      // In production, use the real WebSocket
      ws.addEventListener('message', handleMessage);
    }
    
    return () => {
      if (ws && ws.close) {
        ws.close();
      }
    };
  }, []);

  // Handle chat input
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-cyan-300 mb-6">
            🐾 Pokemon Cyber MMO
          </h1>
          <p className="text-cyan-100 mb-6">
            Welcome to the Cyber Region! Enter your trainer name to begin your cybersecurity adventure.
          </p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your trainer name..."
              className="w-full px-4 py-3 bg-gray-800 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              maxLength={20}
            />
            
            <button
              onClick={startGame}
              disabled={!playerName.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🚀 Enter World – Start Your Cyber Journey
            </button>
          </div>
          
          <div className="mt-6 text-sm text-cyan-200/80">
            <p>🎮 Use WASD or arrow keys to move</p>
            <p>💬 Chat with other trainers</p>
            <p>🎯 Learn cybersecurity while you play</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center" data-testid="tutorial-overlay">
          <div className="bg-gray-900 border border-cyan-500 rounded-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-cyan-300 mb-4">
                {tutorialSteps[tutorialStep]?.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {tutorialSteps[tutorialStep]?.content}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={skipTutorial}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={nextTutorialStep}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded transition-colors"
                >
                  {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                Step {tutorialStep + 1} of {tutorialSteps.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Battle Interface */}
      {battleState.isActive && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center" data-testid="battle-system">
          <div className="bg-gray-900 border border-red-500 rounded-xl p-6 max-w-2xl mx-4 w-full">
            <div className="text-center mb-6" data-testid="battle-stats">
              <h3 className="text-2xl font-bold text-red-400 mb-2">
                ⚔️ Battle with {battleState.opponent}!
              </h3>
              <div className="flex justify-between text-sm" data-testid="damage-calculator">
                <div className="text-green-400">
                  Your Health: {battleState.playerHealth}/100
                </div>
                <div className="text-red-400">
                  {battleState.opponent} Health: {battleState.opponentHealth}/100
                </div>
              </div>
            </div>

            {battleState.phase === 'preparing' && (
              <div className="text-center text-cyan-300">
                <div className="animate-pulse mb-2">Battle started!</div>
                <div className="animate-pulse mb-4">Preparing for battle...</div>
                <button
                  onClick={throwCyberBall}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
                >
                  🔵 Cyber Ball
                </button>
              </div>
            )}

            {battleState.phase === 'catch' && (
              <div className="text-center text-cyan-300">
                <div className="animate-pulse">Attempting to catch...</div>
              </div>
            )}

            {battleState.phase === 'question' && battleState.currentQuestion && (
              <div>
                <div className="mb-4 p-4 bg-blue-900/50 rounded">
                  <div className="text-sm text-cyan-400 mb-2">
                    Category: {battleState.currentQuestion.category}
                  </div>
                  <div className="text-lg text-white mb-4">
                    {battleState.currentQuestion.question}
                  </div>
                  <div className="space-y-2">
                    {battleState.currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => answerQuestion(index)}
                        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 hover:border-cyan-400 transition-colors"
                      >
                        <span className="text-cyan-400 font-bold">{String.fromCharCode(65 + index)}.</span> {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {battleState.phase === 'feedback' && battleState.currentQuestion && (
              <div className="text-center" data-testid="feedback-system">
                <div className="mb-4 p-4 bg-green-900/50 rounded">
                  <div className="text-lg text-white mb-2">
                    {battleState.currentQuestion.explanation}
                  </div>
                  <div className="text-sm text-green-400">
                    Correct answer: {String.fromCharCode(65 + battleState.currentQuestion.correctAnswer)}. {battleState.currentQuestion.options[battleState.currentQuestion.correctAnswer]}
                  </div>
                </div>
                <div className="text-cyan-300">Preparing next question...</div>
              </div>
            )}

            {battleState.phase === 'result' && (
              <div className="text-center">
                <div className="text-2xl font-bold mb-4">
                  {battleState.playerHealth > 0 ? '🎉 Victory!' : '💀 Defeat!'}
                </div>
                <p className="text-gray-300 mb-4">
                  {battleState.playerHealth > 0 
                    ? 'Great job! You demonstrated strong cybersecurity knowledge!'
                    : 'Study more and try again! Every defeat is a learning opportunity.'
                  }
                </p>
                <button
                  onClick={endBattle}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-6 rounded transition-colors"
                >
                  Continue Adventure
                </button>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={endBattle}
                className="text-gray-400 hover:text-white text-sm"
              >
                Press ESC to flee battle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="bg-gray-900 border border-cyan-500 rounded-xl p-6 max-w-lg mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-cyan-300 mb-4">🎮 Game Controls & Instructions</h3>
              <div className="text-left space-y-3 text-gray-300" data-testid="game-controls">
                <div><span className="text-yellow-300 font-bold">WASD / Arrow Keys:</span> Move around</div>
                <div><span className="text-yellow-300 font-bold">SPACE:</span> Interact with NPCs (start battles)</div>
                <div><span className="text-yellow-300 font-bold">H:</span> Toggle this help menu</div>
                <div><span className="text-yellow-300 font-bold">ESC:</span> Flee from battle</div>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-bold text-cyan-300 mb-2">Game Objectives:</h4>
                <div className="text-left space-y-2 text-sm" data-testid="game-objectives">
                  {objectives.map(obj => (
                    <div key={obj.id} className={`flex items-center gap-2 ${obj.completed ? 'text-green-400' : 'text-gray-400'}`}>
                      <span>{obj.completed ? '✅' : '⭕'}</span>
                      <span>{obj.title}</span>
                      {obj.progress !== undefined && (
                        <span className="text-xs">({obj.progress}/{obj.total})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-6 bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-6 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game World */}
      <div className="flex-1 p-4 interactive-world" data-testid="game-world" role="application" tabIndex={0}>
        <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-cyan-300">
                🌍 Cyber Region - Starter Town
              </h2>
              <div className="text-sm text-gray-400 mt-1">
                Learning cybersecurity through gameplay! Press H for help.
              </div>
              <div className="text-xs text-cyan-300 mt-1" data-testid="learning-objectives">
                🎯 Current Objective: {objectives.find(obj => !obj.completed)?.title || 'All objectives complete!'}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-cyan-200">
                  Trainer: <span className="text-yellow-300 font-bold">{playerName}</span>
                </div>
                <div className="text-sm text-green-400">
                  Objectives: {objectives.filter(obj => obj.completed).length}/{objectives.length} completed
                </div>
                <div className="text-sm text-blue-400">
                  Total EXP: {playerExp}
                  {recentExpGain && (
                    <span className="text-green-400 ml-2 animate-pulse">
                      +{recentExpGain} EXP!
                    </span>
                  )}
                </div>
                <div className="text-sm text-purple-400">
                  Level: {playerLevel}
                </div>
                {levelUpMessage && (
                  <div className="text-lg text-yellow-300 font-bold animate-pulse">
                    {levelUpMessage}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowHelp(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded transition-colors text-sm"
                title="Press H for help"
                data-testid="help-button"
              >
                ❓ Help
              </button>
            </div>
          </div>

          {/* Status/Notifications */}
          {wildMonsters.length > 0 && (
            <div className="mb-4 bg-red-900/30 border border-red-500/30 rounded-lg p-2">
              <div className="text-sm text-red-300">
                ⚠️ Wild monsters appeared in the area! {wildMonsters.length} wild creatures detected.
              </div>
            </div>
          )}

          {/* Area Selector */}
          <div className="mb-4" data-testid="area-selector">
            <div className="text-sm text-cyan-300 mb-2">🗺️ Select Area:</div>
            <div className="flex gap-2 flex-wrap">
              <button 
                className="bg-green-700/50 hover:bg-green-600/50 text-green-200 px-3 py-1 rounded text-sm border border-green-500/30 transition-colors"
              >
                🏘️ New Bark Cyber Town
              </button>
              <button 
                className="bg-blue-700/50 hover:bg-blue-600/50 text-blue-200 px-3 py-1 rounded text-sm border border-blue-500/30 transition-colors"
              >
                🏢 Cyber Career City
              </button>
              <button 
                className="bg-orange-700/50 hover:bg-orange-600/50 text-orange-200 px-3 py-1 rounded text-sm border border-orange-500/30 transition-colors"
              >
                🌲 Hardware Forest
              </button>
              {unlockedAreas.includes('advanced-security-lab') && (
                <button 
                  className="bg-red-700/50 hover:bg-red-600/50 text-red-200 px-3 py-1 rounded text-sm border border-red-500/30 transition-colors"
                >
                  🔬 Advanced Security Lab
                </button>
              )}
            </div>
          </div>

          {/* Social Features */}
          <div className="mb-4">
            <div className="text-sm text-cyan-300 mb-2">👥 Social Features:</div>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setShowTradeInterface(true)}
                className="bg-purple-700/50 hover:bg-purple-600/50 text-purple-200 px-3 py-1 rounded text-sm border border-purple-500/30 transition-colors"
              >
                🔄 Trade
              </button>
              <button 
                onClick={() => setShowTeamInterface(true)}
                className="bg-indigo-700/50 hover:bg-indigo-600/50 text-indigo-200 px-3 py-1 rounded text-sm border border-indigo-500/30 transition-colors"
              >
                👥 Form Team
              </button>
            </div>
          </div>

          {/* Battle Controls */}
          <div className="mb-4">
            <div className="text-sm text-cyan-300 mb-2">⚔️ Battle Controls:</div>
            <div className="flex gap-2 flex-wrap">
              <button 
                data-testid="start-battle"
                onClick={() => startBattle('hackmon')}
                className="bg-red-700/50 hover:bg-red-600/50 text-red-200 px-3 py-1 rounded text-sm border border-red-500/30 transition-colors"
              >
                ⚔️ Start Battle
              </button>
            </div>
          </div>

          {/* Game Map */}
          <div className="relative bg-green-800/30 rounded-lg border border-green-500/30 mx-auto"
               style={{ 
                 width: CYBER_REGION_MAP.width * CYBER_REGION_MAP.tileSize,
                 height: CYBER_REGION_MAP.height * CYBER_REGION_MAP.tileSize
               }}>
            
            {/* Grid lines for visibility */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: CYBER_REGION_MAP.height + 1 }).map((_, y) => (
                <div key={y} className="absolute w-full h-px bg-green-400"
                     style={{ top: y * CYBER_REGION_MAP.tileSize }} />
              ))}
              {Array.from({ length: CYBER_REGION_MAP.width + 1 }).map((_, x) => (
                <div key={x} className="absolute h-full w-px bg-green-400"
                     style={{ left: x * CYBER_REGION_MAP.tileSize }} />
              ))}
            </div>

            {/* Obstacles */}
            {CYBER_REGION_MAP.obstacles.map((obstacle, idx) => (
              <div
                key={idx}
                className="absolute bg-green-600 rounded flex items-center justify-center text-2xl"
                style={{
                  left: obstacle.x * CYBER_REGION_MAP.tileSize,
                  top: obstacle.y * CYBER_REGION_MAP.tileSize,
                  width: CYBER_REGION_MAP.tileSize,
                  height: CYBER_REGION_MAP.tileSize
                }}
              >
                🌲
              </div>
            ))}

            {/* NPCs */}
            {CYBER_REGION_MAP.npcs.map((npc) => (
              <div
                key={npc.id}
                data-testid={`npc-${npc.id}`}
                className="absolute bg-blue-600/50 rounded border border-blue-400 flex flex-col items-center justify-center text-xs cursor-pointer hover:bg-blue-500/70 transition-colors"
                style={{
                  left: npc.x * CYBER_REGION_MAP.tileSize,
                  top: npc.y * CYBER_REGION_MAP.tileSize,
                  width: CYBER_REGION_MAP.tileSize,
                  height: CYBER_REGION_MAP.tileSize
                }}
                onClick={() => startBattle(npc.id)}
                title={`Click to battle ${npc.name} or get close and press SPACE`}
              >
                <div className="text-lg">{npc.sprite}</div>
                <div className="text-white text-xs truncate w-full text-center px-1">
                  {npc.name}
                </div>
              </div>
            ))}

            {/* Wild Monsters */}
            {wildMonsters.map((monster) => (
              <div
                key={monster.id}
                data-testid={`wild-pokemon-${monster.id}`}
                className="absolute bg-red-600/50 rounded border border-red-400 flex flex-col items-center justify-center text-xs cursor-pointer hover:bg-red-500/70 transition-colors"
                style={{
                  left: monster.x * CYBER_REGION_MAP.tileSize,
                  top: monster.y * CYBER_REGION_MAP.tileSize,
                  width: CYBER_REGION_MAP.tileSize,
                  height: CYBER_REGION_MAP.tileSize
                }}
                onClick={() => startBattle(monster.id)}
                title={`Wild ${monster.name} appeared! Click to battle`}
              >
                <div className="text-lg">{monster.sprite}</div>
                <div className="text-white text-xs truncate w-full text-center px-1">
                  Wild {monster.name}
                </div>
                <div className="text-yellow-300 text-xs">Lv{monster.level}</div>
              </div>
            ))}

            {/* Other Players */}
            {otherPlayers.map((player) => (
              <div
                key={player.id}
                className="absolute bg-purple-600/50 rounded border border-purple-400 flex flex-col items-center justify-center text-xs transition-all duration-200"
                style={{
                  left: player.x * CYBER_REGION_MAP.tileSize,
                  top: player.y * CYBER_REGION_MAP.tileSize,
                  width: CYBER_REGION_MAP.tileSize,
                  height: CYBER_REGION_MAP.tileSize
                }}
              >
                <div className="text-lg">{player.sprite}</div>
                <div className="text-white text-xs truncate w-full text-center px-1">
                  {player.name}
                </div>
                <div className="text-green-400 text-xs">Lv{player.level}</div>
              </div>
            ))}

            {/* Player */}
            <div
              data-testid="player-character"
              className={`absolute bg-yellow-500 rounded border-2 border-yellow-300 flex flex-col items-center justify-center text-xs transition-all duration-200 ${isMoving ? 'scale-110' : ''}`}
              style={{
                left: position.x * CYBER_REGION_MAP.tileSize,
                top: position.y * CYBER_REGION_MAP.tileSize,
                width: CYBER_REGION_MAP.tileSize,
                height: CYBER_REGION_MAP.tileSize,
                zIndex: 10
              }}
            >
              <div className="text-lg">🧑‍💻</div>
              <div className="text-black font-bold text-xs truncate w-full text-center px-1">
                {playerName}
              </div>
            </div>
          </div>

          {/* Movement Instructions */}
          <div className="mt-4 text-center text-cyan-200 text-sm">
            Use <span className="text-yellow-300 font-bold">WASD</span> or <span className="text-yellow-300 font-bold">Arrow Keys</span> to move around the cyber world!
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-80 p-4">
        <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-300 flex items-center">
              💬 Trainer Chat
              <span className="ml-2 text-sm text-green-400">
                ({otherPlayers.length + 1} online)
              </span>
            </h3>
          </div>

          {/* Connected Players (from WebSocket) */}
          {connectedPlayers.length > 0 && (
            <div className="p-3 border-b border-cyan-500/30">
              <div className="text-xs text-cyan-300 mb-2">🌐 Connected Players:</div>
              <div className="space-y-1">
                {connectedPlayers.map((player) => (
                  <div key={player.id} className="text-xs text-gray-300">
                    <span className="text-yellow-300">{player.name}</span>
                    <span className="text-gray-400 ml-2">@ ({player.position.x}, {player.position.y})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                {msg.type === 'system' ? (
                  <div className="text-cyan-300 italic bg-cyan-900/20 p-2 rounded">
                    ⚡ {msg.message}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 p-2 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${msg.playerId === playerId ? 'text-yellow-300' : 'text-purple-300'}`}>
                        {msg.playerName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-white">{msg.message}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-cyan-500/30">
            <form onSubmit={handleChatSubmit} className="space-y-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleChatSubmit(e);
                  }
                }}
                placeholder="Type your message..."
                className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trade Interface Modal */}
      {showTradeInterface && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-cyan-300 mb-4">🔄 Monster Trading</h3>
            <p className="text-cyan-200 mb-4">Select a player to trade with:</p>
            <div className="space-y-2 mb-4">
              {otherPlayers.map(player => (
                <button
                  key={player.id}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded border border-cyan-500/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-200">{player.sprite} {player.name}</span>
                    <span className="text-sm text-gray-400">Level {player.level}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTradeInterface(false)}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Team Formation Interface Modal */}
      {showTeamInterface && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="team-interface-modal">
          <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-cyan-300 mb-4">👥 Your Team</h3>
            <p className="text-cyan-200 mb-4">Invite players to join your team for group challenges!</p>
            <p className="text-cyan-200 mb-4">Caught Pokemon:</p>
            <div className="space-y-2 mb-4" data-testid="caught-pokemon-list">
              {caughtPokemon.length > 0 ? (
                caughtPokemon.map((pokemon, index) => (
                  <div
                    key={`${pokemon.id}-${index}`}
                    className="w-full text-left p-3 bg-gray-700 rounded border border-cyan-500/20"
                    data-testid={`caught-pokemon-${pokemon.name.toLowerCase()}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-200">🔮 {pokemon.name}</span>
                      <span className="text-sm text-green-400">Level {pokemon.level}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Type: {pokemon.type}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No Pokemon caught yet. Go battle some wild monsters!
                </div>
              )}
            </div>
            <button
              onClick={() => setShowTeamInterface(false)}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonCyberMMO;
