'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Target, Shield, CheckCircle, Activity, Monitor } from 'lucide-react';
import useGameStore from '../../stores/gameStore';

/**
 * 🐍 Snake.io Knowledge Arena - Multiplayer Knowledge Competition
 * 
 * A snake.io-inspired game where players control knowledge-hungry snakes that consume
 * cyber knowledge "food" generated from other players' skill trees and learning progress.
 * The more knowledge you consume, the longer your snake grows and the more skills you unlock!
 * 
 * Features:
 * - Real-time multiplayer snake gameplay
 * - Knowledge orbs generated from player skill trees
 * - Snake growth based on consumed knowledge types
 * - Leaderboard with knowledge specializations
 * - Power-ups based on cybersecurity concepts
 * - Educational tooltips for consumed knowledge
 */

// Game configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SNAKE_SIZE = 20;
const FOOD_SIZE = 12;
const INITIAL_SPEED = 150; // ms per move

// Knowledge types that can be consumed
interface KnowledgeFood {
  id: string;
  x: number;
  y: number;
  type: 'password-security' | 'networking' | 'programming' | 'ethics' | 'cryptography' | 'social-engineering' | 'incident-response';
  value: number;
  color: string;
  description: string;
  source: string; // Which player's knowledge tree generated this
}

// Snake segment
interface SnakeSegment {
  x: number;
  y: number;
}

// Player snake
interface PlayerSnake {
  id: string;
  name: string;
  segments: SnakeSegment[];
  direction: 'up' | 'down' | 'left' | 'right';
  color: string;
  knowledgeTypes: string[];
  totalKnowledge: number;
  specialization: string;
  alive: boolean;
}

// Power-up items
interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: 'speed-boost' | 'knowledge-multiplier' | 'ghost-mode' | 'knowledge-radar';
  duration: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

// Game state
interface GameState {
  players: PlayerSnake[];
  knowledgeFood: KnowledgeFood[];
  powerUps: PowerUp[];
  gameStarted: boolean;
  gameOver: boolean;
  leaderboard: { name: string; score: number; specialization: string }[];
}

const SnakeKnowledgeArena: React.FC = () => {
  const {
    playerStats,
    addXP,
    updateSkillProgress,
    unlockAchievement,
  } = useGameStore();

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    knowledgeFood: [],
    powerUps: [],
    gameStarted: false,
    gameOver: false,
    leaderboard: []
  });

  const [playerSnake, setPlayerSnake] = useState<PlayerSnake | null>(null);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [consumedKnowledge, setConsumedKnowledge] = useState<string[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playerName, setPlayerName] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<'up' | 'down' | 'left' | 'right'>('right');

  // Initialize game
  const initializeGame = useCallback(() => {
    const initialSnake: PlayerSnake = {
      id: 'player',
      name: playerName || 'Anonymous Hacker',
      segments: [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 }
      ],
      direction: 'right',
      color: '#4F46E5',
      knowledgeTypes: [],
      totalKnowledge: 0,
      specialization: 'Generalist',
      alive: true
    };

    setPlayerSnake(initialSnake);
    setGameState(prev => ({
      ...prev,
      players: [initialSnake],
      gameStarted: true,
      gameOver: false
    }));

    generateInitialFood();
    startGameLoop();
  }, [playerName]);

  // Generate knowledge food based on player progress
  const generateKnowledgeFood = useCallback(() => {
    const foodTypes = [
      { type: 'password-security', color: '#10B981', value: 10, description: 'Password Security Knowledge' },
      { type: 'networking', color: '#3B82F6', value: 15, description: 'Network Security Principles' },
      { type: 'programming', color: '#8B5CF6', value: 20, description: 'Secure Coding Practices' },
      { type: 'ethics', color: '#F59E0B', value: 12, description: 'Cybersecurity Ethics' },
      { type: 'cryptography', color: '#EF4444', value: 25, description: 'Cryptographic Techniques' },
      { type: 'social-engineering', color: '#EC4899', value: 18, description: 'Social Engineering Defense' },
      { type: 'incident-response', color: '#6366F1', value: 22, description: 'Incident Response Procedures' }
    ];

    return foodTypes.map(type => ({
      id: `food-${Date.now()}-${Math.random()}`,
      x: Math.floor(Math.random() * (CANVAS_WIDTH - FOOD_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_HEIGHT - FOOD_SIZE)),
      type: type.type as any,
      value: type.value,
      color: type.color,
      description: type.description,
      source: 'system' // Could be enhanced to track source player
    }));
  }, []);

  // Generate initial food
  const generateInitialFood = useCallback(() => {
    const initialFood = generateKnowledgeFood();
    setGameState(prev => ({
      ...prev,
      knowledgeFood: initialFood.slice(0, 15) // Start with 15 knowledge orbs
    }));
  }, [generateKnowledgeFood]);

  // Move snake
  const moveSnake = useCallback(() => {
    if (!playerSnake || !gameState.gameStarted || gameState.gameOver) return;

    setPlayerSnake(prev => {
      if (!prev) return null;

      const head = prev.segments[0];
      let newHead: SnakeSegment;

      switch (directionRef.current) {
        case 'up':
          newHead = { x: head.x, y: head.y - SNAKE_SIZE };
          break;
        case 'down':
          newHead = { x: head.x, y: head.y + SNAKE_SIZE };
          break;
        case 'left':
          newHead = { x: head.x - SNAKE_SIZE, y: head.y };
          break;
        case 'right':
          newHead = { x: head.x + SNAKE_SIZE, y: head.y };
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= CANVAS_WIDTH || newHead.y < 0 || newHead.y >= CANVAS_HEIGHT) {
        setGameState(prevState => ({ ...prevState, gameOver: true }));
        return prev;
      }

      // Check self collision
      if (prev.segments.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState(prevState => ({ ...prevState, gameOver: true }));
        return prev;
      }

      const newSegments = [newHead, ...prev.segments];
      
      // Check food collision
      const consumedFood = gameState.knowledgeFood.find(
        food => Math.abs(food.x - newHead.x) < SNAKE_SIZE && Math.abs(food.y - newHead.y) < SNAKE_SIZE
      );

      if (consumedFood) {
        // Consume knowledge
        setScore(prevScore => prevScore + consumedFood.value);
        setConsumedKnowledge(prev => [...prev, consumedFood.type]);
        
        // Award XP and update skill progress based on food type
        addXP(consumedFood.value);
        
        // Map food types to skill progress
        const skillMapping: Record<string, keyof any> = {
          'password-security': 'passwordSecurity',
          'networking': 'networkSecurity', 
          'cryptography': 'cryptography',
          'social-engineering': 'socialEngineering',
          'incident-response': 'incidentResponse',
          'programming': 'cryptography', // Map to closest skill
          'ethics': 'phishingDetection' // Map to closest skill
        };
        
        const skill = skillMapping[consumedFood.type];
        if (skill) {
          updateSkillProgress(skill as any, 1);
        }

        // Remove consumed food and add new food
        setGameState(prevState => ({
          ...prevState,
          knowledgeFood: [
            ...prevState.knowledgeFood.filter(f => f.id !== consumedFood.id),
            ...generateKnowledgeFood().slice(0, 1) // Add one new food
          ]
        }));

        // Snake grows (don't remove tail)
        return {
          ...prev,
          segments: newSegments,
          totalKnowledge: prev.totalKnowledge + consumedFood.value,
          knowledgeTypes: [...new Set([...prev.knowledgeTypes, consumedFood.type])]
        };
      } else {
        // Normal movement (remove tail)
        return {
          ...prev,
          segments: newSegments.slice(0, -1),
          direction: directionRef.current
        };
      }
    });
  }, [playerSnake, gameState, generateKnowledgeFood, addXP, updateSkillProgress]);

  // Game loop
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    
    gameLoopRef.current = setInterval(() => {
      moveSnake();
    }, gameSpeed);
  }, [moveSnake, gameSpeed]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.gameStarted || gameState.gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'down') directionRef.current = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'up') directionRef.current = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'right') directionRef.current = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'left') directionRef.current = 'right';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStarted, gameState.gameOver]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += SNAKE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += SNAKE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw knowledge food
    gameState.knowledgeFood.forEach(food => {
      ctx.fillStyle = food.color;
      ctx.beginPath();
      ctx.arc(food.x + FOOD_SIZE / 2, food.y + FOOD_SIZE / 2, FOOD_SIZE / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = food.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw snake
    if (playerSnake) {
      playerSnake.segments.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#FFF' : playerSnake.color; // Head is white
        ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);
        
        if (index === 0) {
          // Draw eyes
          ctx.fillStyle = '#000';
          ctx.fillRect(segment.x + 4, segment.y + 4, 3, 3);
          ctx.fillRect(segment.x + 13, segment.y + 4, 3, 3);
        }
      });
    }
  }, [gameState, playerSnake]);

  // Determine specialization based on consumed knowledge
  const getSpecialization = useCallback(() => {
    const knowledgeCounts = consumedKnowledge.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topKnowledge = Object.entries(knowledgeCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (!topKnowledge) return 'Novice Explorer';

    const specializations: Record<string, string> = {
      'password-security': 'Password Security Specialist',
      'networking': 'Network Security Expert',
      'programming': 'Secure Development Pro',
      'ethics': 'Cyber Ethics Guardian',
      'cryptography': 'Cryptography Master',
      'social-engineering': 'Social Engineering Defense Expert',
      'incident-response': 'Incident Response Specialist'
    };

    return specializations[topKnowledge[0]] || 'Knowledge Generalist';
  }, [consumedKnowledge]);

  // Restart game
  const restartGame = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setGameState({
      players: [],
      knowledgeFood: [],
      powerUps: [],
      gameStarted: false,
      gameOver: false,
      leaderboard: []
    });
    setPlayerSnake(null);
    setScore(0);
    setConsumedKnowledge([]);
    directionRef.current = 'right';
    setShowInstructions(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            🐍 Snake.io Knowledge Arena
          </h1>
          <p className="text-blue-200 text-lg">
            Consume cybersecurity knowledge to grow your snake and become the ultimate cyber expert!
          </p>
        </div>

        {/* Instructions Modal */}
        <AnimatePresence>
          {showInstructions && !gameState.gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold text-white mb-4">🎮 How to Play</h3>
                
                <div className="space-y-3 text-gray-300 mb-6">
                  <p>• Use arrow keys or WASD to control your snake</p>
                  <p>• Consume colorful knowledge orbs to grow longer</p>
                  <p>• Each knowledge type teaches different cybersecurity skills</p>
                  <p>• Avoid hitting walls or yourself</p>
                  <p>• Develop specializations based on what you consume</p>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="block text-white font-medium">
                    Enter Your Hacker Name:
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Anonymous Hacker"
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <button
                  onClick={() => {
                    setShowInstructions(false);
                    initializeGame();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
                >
                  Start Learning! 🚀
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Game Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-600 rounded-lg w-full"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              
              {/* Game Over Overlay */}
              <AnimatePresence>
                {gameState.gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-white mb-4">🎯 Mission Complete!</h2>
                      <p className="text-xl text-blue-200 mb-2">Knowledge Consumed: {consumedKnowledge.length}</p>
                      <p className="text-lg text-green-400 mb-4">Specialization: {getSpecialization()}</p>
                      <p className="text-lg text-yellow-400 mb-6">Final Score: {score}</p>
                      <button
                        onClick={restartGame}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
                      >
                        🔄 Learn Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            
            {/* Current Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Current Stats
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Score:</span>
                  <span className="text-white font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Length:</span>
                  <span className="text-white font-bold">{playerSnake?.segments.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Knowledge Types:</span>
                  <span className="text-white font-bold">{new Set(consumedKnowledge).size}</span>
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Specialization
              </h3>
              <p className="text-blue-200 text-sm">{getSpecialization()}</p>
            </div>

            {/* Knowledge Legend */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Knowledge Types
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-blue-200">Password Security</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-blue-200">Networking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-blue-200">Programming</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-blue-200">Ethics</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-blue-200">Cryptography</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                  <span className="text-blue-200">Social Engineering</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                  <span className="text-blue-200">Incident Response</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3">🎮 Controls</h3>
              <div className="text-xs text-blue-200 space-y-1">
                <p>↑ ↓ ← → Arrow Keys</p>
                <p>W A S D Keys</p>
                <p>Consume knowledge orbs to grow!</p>
              </div>
            </div>

          </div>
        </div>

        {/* Educational Footer */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            💡 What You're Learning
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-blue-200 text-sm">
            <div>
              <strong>Knowledge Consumption:</strong> Learn how different cybersecurity domains connect and build upon each other.
            </div>
            <div>
              <strong>Specialization Paths:</strong> Discover how focusing on specific areas leads to career specializations.
            </div>
            <div>
              <strong>Continuous Learning:</strong> See how knowledge accumulation in cybersecurity is an ongoing process.
            </div>
            <div>
              <strong>Skill Building:</strong> Experience how different knowledge types contribute to overall expertise.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SnakeKnowledgeArena;
