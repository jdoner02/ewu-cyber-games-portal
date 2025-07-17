'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Monitor, Users, Brain, Star, Trophy, Target } from 'lucide-react';

// Types for the Knowledge Arena (Snake.io style gameplay)
interface KnowledgeOrb {
  id: string;
  x: number;
  y: number;
  type: 'cyber-career' | 'hardware' | 'software' | 'ethics' | 'teamwork' | 'security';
  concept: string;
  value: number;
  color: string;
  icon: string;
  genCyberDay: number;
}

interface PlayerSnake {
  id: string;
  name: string;
  pokemonType: string;
  segments: { x: number; y: number }[];
  direction: { dx: number; dy: number };
  color: string;
  knowledgePoints: number;
  collectedConcepts: string[];
  level: number;
  isLocalPlayer: boolean;
}

interface ArenaState {
  players: PlayerSnake[];
  knowledgeOrbs: KnowledgeOrb[];
  arenaSize: { width: number; height: number };
  gameStarted: boolean;
  connectedPlayers: number;
}

interface CyberKnowledgeBrain {
  nodes: { id: string; concept: string; x: number; y: number; connections: string[]; strength: number }[];
  connections: { from: string; to: string; strength: number }[];
  totalKnowledge: number;
  domains: string[];
}

const KnowledgeArena: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [arenaState, setArenaState] = useState<ArenaState>({
    players: [],
    knowledgeOrbs: [],
    arenaSize: { width: 800, height: 600 },
    gameStarted: false,
    connectedPlayers: 1
  });
  
  const [localPlayer, setLocalPlayer] = useState<PlayerSnake | null>(null);
  const [knowledgeBrain, setKnowledgeBrain] = useState<CyberKnowledgeBrain>({
    nodes: [],
    connections: [],
    totalKnowledge: 0,
    domains: []
  });
  
  const [showBrainVisualization, setShowBrainVisualization] = useState(false);
  const [gameMode, setGameMode] = useState<'arena' | 'brain' | 'tutorial'>('tutorial');
  const [inputDirection, setInputDirection] = useState({ dx: 1, dy: 0 });

  // Day 1 GenCyber Knowledge Orbs Database
  const knowledgeOrbTypes: Omit<KnowledgeOrb, 'id' | 'x' | 'y'>[] = [
    // Cyber Careers
    { type: 'cyber-career', concept: 'Incident Response Specialist', value: 10, color: '#ff6b6b', icon: '🚨', genCyberDay: 1 },
    { type: 'cyber-career', concept: 'Penetration Tester', value: 15, color: '#ff6b6b', icon: '🔍', genCyberDay: 1 },
    { type: 'cyber-career', concept: 'Security Analyst', value: 10, color: '#ff6b6b', icon: '🛡️', genCyberDay: 1 },
    { type: 'cyber-career', concept: 'Forensic Investigator', value: 15, color: '#ff6b6b', icon: '🔬', genCyberDay: 1 },
    { type: 'cyber-career', concept: 'Security Architect', value: 20, color: '#ff6b6b', icon: '🏗️', genCyberDay: 1 },
    
    // Hardware vs Software
    { type: 'hardware', concept: 'CPU (Central Processing Unit)', value: 8, color: '#4ecdc4', icon: '🧠', genCyberDay: 1 },
    { type: 'hardware', concept: 'RAM (Random Access Memory)', value: 8, color: '#4ecdc4', icon: '⚡', genCyberDay: 1 },
    { type: 'hardware', concept: 'Motherboard', value: 10, color: '#4ecdc4', icon: '🔧', genCyberDay: 1 },
    { type: 'hardware', concept: 'Hard Drive Storage', value: 8, color: '#4ecdc4', icon: '💾', genCyberDay: 1 },
    { type: 'software', concept: 'Operating System', value: 12, color: '#45b7d1', icon: '💻', genCyberDay: 1 },
    { type: 'software', concept: 'Application Software', value: 8, color: '#45b7d1', icon: '📱', genCyberDay: 1 },
    { type: 'software', concept: 'File System', value: 10, color: '#45b7d1', icon: '📁', genCyberDay: 1 },
    
    // Ethics & Teamwork
    { type: 'ethics', concept: 'White Hat Hacking', value: 15, color: '#a8e6cf', icon: '🎩', genCyberDay: 1 },
    { type: 'ethics', concept: 'Responsible Disclosure', value: 12, color: '#a8e6cf', icon: '📢', genCyberDay: 1 },
    { type: 'ethics', concept: 'Digital Privacy Rights', value: 10, color: '#a8e6cf', icon: '🔒', genCyberDay: 1 },
    { type: 'teamwork', concept: 'Collaborative Problem Solving', value: 10, color: '#ffd93d', icon: '🤝', genCyberDay: 1 },
    { type: 'teamwork', concept: 'Communication Skills', value: 8, color: '#ffd93d', icon: '💬', genCyberDay: 1 },
    { type: 'teamwork', concept: 'Algorithm Design', value: 12, color: '#ffd93d', icon: '🔄', genCyberDay: 1 },
    
    // Security Basics
    { type: 'security', concept: 'Windows Firewall', value: 10, color: '#ff9ff3', icon: '🔥', genCyberDay: 1 },
    { type: 'security', concept: 'User Account Control', value: 8, color: '#ff9ff3', icon: '👤', genCyberDay: 1 },
    { type: 'security', concept: 'Command Line Security', value: 12, color: '#ff9ff3', icon: '⌨️', genCyberDay: 1 },
    { type: 'security', concept: 'God Mode Settings', value: 15, color: '#ff9ff3', icon: '⚙️', genCyberDay: 1 }
  ];

  // Initialize the arena with knowledge orbs
  const generateKnowledgeOrbs = useCallback((playerCount: number) => {
    const baseOrbCount = 20;
    const additionalOrbsPerPlayer = 5;
    const totalOrbs = baseOrbCount + (playerCount - 1) * additionalOrbsPerPlayer;
    
    const orbs: KnowledgeOrb[] = [];
    
    for (let i = 0; i < totalOrbs; i++) {
      const orbType = knowledgeOrbTypes[Math.floor(Math.random() * knowledgeOrbTypes.length)];
      orbs.push({
        ...orbType,
        id: `orb-${i}`,
        x: Math.random() * (arenaState.arenaSize.width - 40) + 20,
        y: Math.random() * (arenaState.arenaSize.height - 40) + 20
      });
    }
    
    return orbs;
  }, [arenaState.arenaSize]);

  // Initialize local player
  const initializePlayer = useCallback(() => {
    const player: PlayerSnake = {
      id: 'local-player',
      name: 'Cyber Trainer',
      pokemonType: 'Hackamon',
      segments: [
        { x: 100, y: 100 },
        { x: 90, y: 100 },
        { x: 80, y: 100 }
      ],
      direction: { dx: 1, dy: 0 },
      color: '#4ecdc4',
      knowledgePoints: 0,
      collectedConcepts: [],
      level: 1,
      isLocalPlayer: true
    };
    
    setLocalPlayer(player);
    setArenaState(prev => ({
      ...prev,
      players: [player],
      knowledgeOrbs: generateKnowledgeOrbs(1)
    }));
  }, [generateKnowledgeOrbs]);

  // Game loop for snake movement and collision detection
  const gameLoop = useCallback(() => {
    if (!localPlayer || !arenaState.gameStarted) return;
    
    setArenaState(prev => {
      const updatedPlayers = prev.players.map(player => {
        if (!player.isLocalPlayer) return player;
        
        // Update player direction based on input
        const currentDirection = inputDirection;
        
        // Move the snake
        const head = player.segments[0];
        const newHead = {
          x: head.x + currentDirection.dx * 10,
          y: head.y + currentDirection.dy * 10
        };
        
        // Wrap around screen edges
        if (newHead.x < 0) newHead.x = prev.arenaSize.width - 10;
        if (newHead.x >= prev.arenaSize.width) newHead.x = 0;
        if (newHead.y < 0) newHead.y = prev.arenaSize.height - 10;
        if (newHead.y >= prev.arenaSize.height) newHead.y = 0;
        
        const newSegments = [newHead, ...player.segments];
        
        // Check for knowledge orb collision
        let orbCollected = false;
        const remainingOrbs = prev.knowledgeOrbs.filter(orb => {
          const distance = Math.sqrt(
            Math.pow(newHead.x - orb.x, 2) + Math.pow(newHead.y - orb.y, 2)
          );
          
          if (distance < 20) {
            // Collect the orb
            orbCollected = true;
            
            // Add to knowledge brain
            setKnowledgeBrain(prevBrain => {
              const newNode = {
                id: orb.id,
                concept: orb.concept,
                x: Math.random() * 400 + 100,
                y: Math.random() * 300 + 100,
                connections: [],
                strength: orb.value
              };
              
              // Create connections to related concepts
              const relatedNodes = prevBrain.nodes.filter(node => 
                node.concept.includes(orb.type) || orb.concept.includes('Security')
              );
              
              const connections = relatedNodes.map(node => ({
                from: orb.id,
                to: node.id,
                strength: Math.random() * 0.8 + 0.2
              }));
              
              return {
                ...prevBrain,
                nodes: [...prevBrain.nodes, newNode],
                connections: [...prevBrain.connections, ...connections],
                totalKnowledge: prevBrain.totalKnowledge + orb.value,
                domains: [...new Set([...prevBrain.domains, orb.type])]
              };
            });
            
            return false; // Remove this orb
          }
          return true; // Keep this orb
        });
        
        // If orb collected, grow the snake; otherwise, remove tail
        const finalSegments = orbCollected ? newSegments : newSegments.slice(0, -1);
        
        return {
          ...player,
          segments: finalSegments,
          direction: currentDirection,
          knowledgePoints: orbCollected ? player.knowledgePoints + 1 : player.knowledgePoints,
          collectedConcepts: orbCollected ? [...player.collectedConcepts, prev.knowledgeOrbs.find(orb => 
            Math.sqrt(Math.pow(newHead.x - orb.x, 2) + Math.pow(newHead.y - orb.y, 2)) < 20
          )?.concept || ''] : player.collectedConcepts,
          level: Math.floor((player.knowledgePoints + (orbCollected ? 1 : 0)) / 5) + 1
        };
      });
      
      return {
        ...prev,
        players: updatedPlayers,
        knowledgeOrbs: prev.knowledgeOrbs.filter(orb => {
          const head = updatedPlayers[0]?.segments[0];
          if (!head) return true;
          
          const distance = Math.sqrt(
            Math.pow(head.x - orb.x, 2) + Math.pow(head.y - orb.y, 2)
          );
          return distance >= 20;
        })
      };
    });
  }, [localPlayer, arenaState.gameStarted, inputDirection]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          setInputDirection({ dx: 0, dy: -1 });
          break;
        case 'ArrowDown':
        case 's':
          setInputDirection({ dx: 0, dy: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          setInputDirection({ dx: -1, dy: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          setInputDirection({ dx: 1, dy: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Start game loop
  useEffect(() => {
    if (arenaState.gameStarted) {
      const interval = setInterval(gameLoop, 150);
      return () => clearInterval(interval);
    }
  }, [gameLoop, arenaState.gameStarted]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw knowledge orbs
    arenaState.knowledgeOrbs.forEach(orb => {
      ctx.fillStyle = orb.color;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(orb.icon, orb.x, orb.y + 4);
    });
    
    // Draw players
    arenaState.players.forEach(player => {
      player.segments.forEach((segment, index) => {
        if (index === 0) {
          // Head
          ctx.fillStyle = player.color;
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, 8, 0, 2 * Math.PI);
          ctx.fill();
          
          // Eyes
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(segment.x - 3, segment.y - 2, 2, 0, 2 * Math.PI);
          ctx.arc(segment.x + 3, segment.y - 2, 2, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          // Body
          ctx.fillStyle = player.color;
          ctx.globalAlpha = 0.8 - (index * 0.1);
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
    });
    
  }, [arenaState]);

  const startGame = () => {
    initializePlayer();
    setArenaState(prev => ({ ...prev, gameStarted: true }));
    setGameMode('arena');
  };

  const showKnowledgeBrain = () => {
    setGameMode('brain');
    setShowBrainVisualization(true);
  };

  // Cookie-based persistence for knowledge progress
  useEffect(() => {
    // Load saved progress from cookies
    const savedProgress = document.cookie
      .split('; ')
      .find(row => row.startsWith('knowledgeArenaProgress='))
      ?.split('=')[1];
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(decodeURIComponent(savedProgress));
        setKnowledgeBrain(progress.knowledgeBrain || knowledgeBrain);
        setLocalPlayer(prev => prev ? { ...prev, ...progress.playerStats } : prev);
      } catch (error) {
        console.log('Error loading saved progress:', error);
      }
    }
  }, []);

  // Save progress to cookies when brain or player updates
  useEffect(() => {
    if (localPlayer && knowledgeBrain.nodes.length > 0) {
      const progressData = {
        knowledgeBrain,
        playerStats: {
          level: localPlayer.level,
          knowledgePoints: localPlayer.knowledgePoints,
          collectedConcepts: localPlayer.collectedConcepts
        },
        lastPlayed: new Date().toISOString()
      };
      
      const cookieValue = encodeURIComponent(JSON.stringify(progressData));
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year
      
      document.cookie = `knowledgeArenaProgress=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    }
  }, [localPlayer?.knowledgePoints, knowledgeBrain.nodes.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            🧠 Cyber Knowledge Arena
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Collect GenCyber Day 1 knowledge orbs in this Snake.io style adventure! 
            Watch your Cyber Knowledge Brain grow as you learn about careers, hardware, software, and security.
          </p>
        </motion.div>

        {/* Game Mode Selection */}
        {gameMode === 'tutorial' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-400/30"
          >
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl">
                  🎮
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Snake.io Style Gameplay</h3>
                <p className="text-slate-400">Control your Cyber Pokemon to collect knowledge orbs and grow!</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl">
                  🧠
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Knowledge Brain</h3>
                <p className="text-slate-400">Watch your cyber knowledge form connections in a beautiful neural network!</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl">
                  👥
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Multiplayer Learning</h3>
                <p className="text-slate-400">More players = more knowledge orbs for everyone!</p>
              </div>
            </div>
            
            <div className="text-center">
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg mr-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Enter the Arena
              </motion.button>
              
              <motion.button
                onClick={showKnowledgeBrain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🧠 View Knowledge Brain
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Game Arena */}
        {gameMode === 'arena' && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Game Canvas */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30"
              >
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-cyan-400">
                      <Zap className="w-5 h-5 inline mr-2" />
                      Level: {localPlayer?.level || 1}
                    </div>
                    <div className="text-purple-400">
                      <Star className="w-5 h-5 inline mr-2" />
                      Knowledge: {localPlayer?.knowledgePoints || 0}
                    </div>
                    <div className="text-green-400">
                      <Users className="w-5 h-5 inline mr-2" />
                      Players: {arenaState.connectedPlayers}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={showKnowledgeBrain}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Brain className="w-4 h-4 inline mr-2" />
                    View Brain
                  </motion.button>
                </div>
                
                <canvas
                  ref={canvasRef}
                  width={arenaState.arenaSize.width}
                  height={arenaState.arenaSize.height}
                  className="border border-slate-600 rounded-lg bg-black"
                />
                
                <div className="mt-4 text-center text-slate-400">
                  Use WASD or Arrow Keys to move • Collect knowledge orbs to grow and learn!
                </div>
              </motion.div>
            </div>

            {/* Stats Panel */}
            <div className="space-y-4">
              {/* Player Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30"
              >
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                  Cyber Trainer Stats
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level:</span>
                    <span className="text-cyan-400 font-bold">{localPlayer?.level || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Length:</span>
                    <span className="text-green-400 font-bold">{localPlayer?.segments.length || 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Knowledge:</span>
                    <span className="text-purple-400 font-bold">{localPlayer?.knowledgePoints || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Brain Nodes:</span>
                    <span className="text-pink-400 font-bold">{knowledgeBrain.nodes.length}</span>
                  </div>
                </div>
              </motion.div>

              {/* Recent Knowledge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30"
              >
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  Recent Learning
                </h3>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {localPlayer?.collectedConcepts.slice(-5).reverse().map((concept, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm bg-slate-700/50 rounded p-2"
                    >
                      <span className="text-slate-300">{concept}</span>
                    </motion.div>
                  )) || (
                    <div className="text-slate-500 text-sm">
                      No concepts learned yet. Start collecting orbs!
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Knowledge Domains */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-green-400/30"
              >
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Knowledge Domains
                </h3>
                
                <div className="space-y-2">
                  {knowledgeBrain.domains.map((domain, index) => (
                    <div key={domain} className="flex items-center justify-between">
                      <span className="text-slate-300 capitalize">{domain.replace('-', ' ')}</span>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                    </div>
                  ))}
                  
                  {knowledgeBrain.domains.length === 0 && (
                    <div className="text-slate-500 text-sm">
                      Explore different knowledge types!
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Knowledge Brain Visualization */}
        {gameMode === 'brain' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                🧠 Your Cyber Knowledge Brain
              </h2>
              <motion.button
                onClick={() => setGameMode('arena')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Back to Arena
              </motion.button>
            </div>
            
            <div className="bg-black rounded-lg p-4 mb-4" style={{ height: '400px', position: 'relative' }}>
              {knowledgeBrain.nodes.length > 0 ? (
                <svg width="100%" height="100%" className="absolute inset-0">
                  {/* Draw connections */}
                  {knowledgeBrain.connections.map((connection, index) => {
                    const fromNode = knowledgeBrain.nodes.find(n => n.id === connection.from);
                    const toNode = knowledgeBrain.nodes.find(n => n.id === connection.to);
                    if (!fromNode || !toNode) return null;
                    
                    return (
                      <motion.line
                        key={index}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={`rgba(139, 92, 246, ${connection.strength})`}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    );
                  })}
                  
                  {/* Draw nodes */}
                  {knowledgeBrain.nodes.map((node, index) => (
                    <motion.g key={node.id}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={Math.sqrt(node.strength) * 2 + 5}
                        fill="rgba(74, 222, 128, 0.8)"
                        stroke="rgba(74, 222, 128, 1)"
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                      />
                      <motion.text
                        x={node.x}
                        y={node.y + 25}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {node.concept.length > 15 ? node.concept.substring(0, 15) + '...' : node.concept}
                      </motion.text>
                    </motion.g>
                  ))}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="text-6xl mb-4">🧠</div>
                    <h3 className="text-xl font-bold text-white mb-2">Your Brain is Ready to Learn!</h3>
                    <p className="text-slate-400">
                      Collect knowledge orbs in the arena to see your cyber knowledge brain grow and form connections.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{knowledgeBrain.totalKnowledge}</div>
                <div className="text-slate-400">Total Knowledge Points</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{knowledgeBrain.nodes.length}</div>
                <div className="text-slate-400">Concepts Learned</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{knowledgeBrain.connections.length}</div>
                <div className="text-slate-400">Neural Connections</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeArena;
