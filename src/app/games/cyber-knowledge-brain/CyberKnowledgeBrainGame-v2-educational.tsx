'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Network, Zap, Shield, Code, Users, Eye, Target, Star, BookOpen, Trophy, Lock, Monitor } from 'lucide-react';
import useGameStore from '../../stores/gameStore';

/**
 * 🧠 Cyber Knowledge Brain - Central Learning Visualization Hub
 * 
 * This component serves as the main knowledge visualization interface for the EWU Cyber Games.
 * It displays student learning progress through an interactive network graph with "weave silk" 
 * mechanics that connect concepts, skills, and career pathways in cybersecurity.
 * 
 * Features:
 * - Real-time learning points integration from all games
 * - Interactive knowledge nodes with prerequisite unlocking
 * - Visual skill progression tracking
 * - GenCyber Day 1-5 curriculum mapping
 * - Career pathway visualization
 * - Easter eggs and hidden knowledge connections
 */

// Knowledge node types based on GenCyber curriculum
interface KnowledgeNode {
  id: string;
  title: string;
  category: 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'career' | 'skill' | 'secret';
  description: string;
  masteryLevel: number; // 0-100
  prerequisites: string[];
  unlocked: boolean;
  position: { x: number; y: number };
  connections: string[];
  icon: React.ReactNode;
  color: string;
  xpValue: number;
  practicalApplication?: string;
}

// Weave silk connection types
interface SilkConnection {
  id: string;
  from: string;
  to: string;
  strength: number; // 0-1, based on learning correlation
  type: 'prerequisite' | 'related' | 'career-path' | 'mystery';
  animated: boolean;
}

// Career pathway definitions
interface CareerPath {
  id: string;
  name: string;
  description: string;
  requiredNodes: string[];
  icon: React.ReactNode;
  color: string;
  salary: string;
  demand: string;
}

const CyberKnowledgeBrainGame: React.FC = () => {
  const {
    playerStats,
    gameSpecificStates,
    addExperience,
    updateSkillProgress,
    getPlayerLevel,
  } = useGameStore();

  // Game state management
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [showNodeDetails, setShowNodeDetails] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'skills' | 'career' | 'mystery'>('skills');
  const [animateConnections, setAnimateConnections] = useState(true);
  const [showHiddenPaths, setShowHiddenPaths] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize knowledge nodes with GenCyber curriculum
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([
    // Day 1 - Meeting & Cyber Basics
    {
      id: 'cyber-careers',
      title: 'Cyber Careers Explorer',
      category: 'day1',
      description: 'Discover the diverse world of cybersecurity careers and find your passion!',
      masteryLevel: 0,
      prerequisites: [],
      unlocked: true,
      position: { x: 200, y: 150 },
      connections: ['cyber-ethics', 'hacking-basics', 'team-building'],
      icon: <Users className="w-6 h-6" />,
      color: '#4F46E5',
      xpValue: 50,
      practicalApplication: 'Explore career paths in cybersecurity'
    },
    {
      id: 'cyber-ethics',
      title: 'Cyber Ethics Foundation',
      category: 'day1',
      description: 'Learn the moral compass that guides all cybersecurity professionals.',
      masteryLevel: 0,
      prerequisites: ['cyber-careers'],
      unlocked: false,
      position: { x: 350, y: 100 },
      connections: ['hacking-basics', 'social-engineering'],
      icon: <Shield className="w-6 h-6" />,
      color: '#059669',
      xpValue: 75,
      practicalApplication: 'Apply ethical principles to security decisions'
    },
    {
      id: 'hacking-basics',
      title: 'What is Hacking?',
      category: 'day1',
      description: 'Understand the difference between white hat, black hat, and gray hat hackers.',
      masteryLevel: 0,
      prerequisites: ['cyber-careers'],
      unlocked: false,
      position: { x: 300, y: 250 },
      connections: ['computer-hardware', 'password-security'],
      icon: <Code className="w-6 h-6" />,
      color: '#DC2626',
      xpValue: 60,
      practicalApplication: 'Identify different types of hacking activities'
    },
    {
      id: 'team-building',
      title: 'Cyber Team Dynamics',
      category: 'day1',
      description: 'Master collaboration skills essential for cybersecurity teams.',
      masteryLevel: 0,
      prerequisites: [],
      unlocked: true,
      position: { x: 100, y: 200 },
      connections: ['algorithms', 'cyber-careers'],
      icon: <Users className="w-6 h-6" />,
      color: '#7C3AED',
      xpValue: 40,
      practicalApplication: 'Work effectively in cybersecurity teams'
    },
    {
      id: 'computer-hardware',
      title: 'Hardware vs Software',
      category: 'day1',
      description: 'Understand the fundamental building blocks of computer systems.',
      masteryLevel: 0,
      prerequisites: ['hacking-basics'],
      unlocked: false,
      position: { x: 450, y: 200 },
      connections: ['file-systems', 'windows-security'],
      icon: <Monitor className="w-6 h-6" />,
      color: '#059669',
      xpValue: 80,
      practicalApplication: 'Identify computer components and their security implications'
    },

    // Day 2 - Networking Foundations
    {
      id: 'ip-addressing',
      title: 'IP Address Mastery',
      category: 'day2',
      description: 'Learn how computers find each other on networks.',
      masteryLevel: 0,
      prerequisites: ['computer-hardware'],
      unlocked: false,
      position: { x: 600, y: 150 },
      connections: ['packet-tracer', 'wifi-security'],
      icon: <Network className="w-6 h-6" />,
      color: '#2563EB',
      xpValue: 90,
      practicalApplication: 'Configure and troubleshoot network addressing'
    },
    {
      id: 'packet-tracer',
      title: 'Network Simulation',
      category: 'day2',
      description: 'Build and test networks in virtual environments.',
      masteryLevel: 0,
      prerequisites: ['ip-addressing'],
      unlocked: false,
      position: { x: 750, y: 100 },
      connections: ['wireshark-analysis', 'firewalls'],
      icon: <Target className="w-6 h-6" />,
      color: '#0891B2',
      xpValue: 100,
      practicalApplication: 'Design secure network topologies'
    },
    {
      id: 'wifi-security',
      title: 'Wi-Fi Security Essentials',
      category: 'day2',
      description: 'Secure wireless networks and identify vulnerabilities.',
      masteryLevel: 0,
      prerequisites: ['ip-addressing'],
      unlocked: false,
      position: { x: 550, y: 300 },
      connections: ['encryption-basics', 'password-security'],
      icon: <Zap className="w-6 h-6" />,
      color: '#EA580C',
      xpValue: 85,
      practicalApplication: 'Configure secure wireless networks'
    },

    // Day 3 - Programming & Automation
    {
      id: 'python-programming',
      title: 'Python Security Scripts',
      category: 'day3',
      description: 'Automate cybersecurity tasks with Python programming.',
      masteryLevel: 0,
      prerequisites: ['algorithms'],
      unlocked: false,
      position: { x: 200, y: 400 },
      connections: ['turtle-graphics', 'phidget-iot'],
      icon: <Code className="w-6 h-6" />,
      color: '#16A34A',
      xpValue: 120,
      practicalApplication: 'Write security automation scripts'
    },
    {
      id: 'turtle-graphics',
      title: 'Visual Programming',
      category: 'day3',
      description: 'Learn programming concepts through visual graphics.',
      masteryLevel: 0,
      prerequisites: ['python-programming'],
      unlocked: false,
      position: { x: 350, y: 450 },
      connections: ['algorithms', 'data-visualization'],
      icon: <Star className="w-6 h-6" />,
      color: '#7C2D12',
      xpValue: 70,
      practicalApplication: 'Create visual representations of security data'
    },

    // Day 4 - Advanced Systems & AI
    {
      id: 'virtual-machines',
      title: 'Virtual System Security',
      category: 'day4',
      description: 'Isolate and secure systems using virtualization.',
      masteryLevel: 0,
      prerequisites: ['computer-hardware'],
      unlocked: false,
      position: { x: 700, y: 300 },
      connections: ['linux-commands', 'ai-ethics'],
      icon: <Monitor className="w-6 h-6" />,
      color: '#4338CA',
      xpValue: 110,
      practicalApplication: 'Deploy secure virtual environments'
    },
    {
      id: 'ai-ethics',
      title: 'AI in Cybersecurity',
      category: 'day4',
      description: 'Understand AI applications and ethics in security.',
      masteryLevel: 0,
      prerequisites: ['cyber-ethics'],
      unlocked: false,
      position: { x: 500, y: 500 },
      connections: ['machine-learning', 'automation'],
      icon: <Brain className="w-6 h-6" />,
      color: '#BE185D',
      xpValue: 130,
      practicalApplication: 'Apply AI tools responsibly in cybersecurity'
    },
    {
      id: 'cryptography',
      title: 'Cryptography Fundamentals',
      category: 'day4',
      description: 'Protect data with encryption and digital signatures.',
      masteryLevel: 0,
      prerequisites: ['binary-systems'],
      unlocked: false,
      position: { x: 650, y: 450 },
      connections: ['steganography', 'quantum-crypto'],
      icon: <Lock className="w-6 h-6" />,
      color: '#7C2D12',
      xpValue: 140,
      practicalApplication: 'Implement secure communication protocols'
    },

    // Day 5 - Attack & Defense
    {
      id: 'social-engineering',
      title: 'Social Engineering Defense',
      category: 'day5',
      description: 'Recognize and defend against human-based attacks.',
      masteryLevel: 0,
      prerequisites: ['cyber-ethics'],
      unlocked: false,
      position: { x: 800, y: 200 },
      connections: ['phishing-detection', 'osint'],
      icon: <Eye className="w-6 h-6" />,
      color: '#DC2626',
      xpValue: 100,
      practicalApplication: 'Train users to recognize social engineering'
    },
    {
      id: 'red-blue-teams',
      title: 'Cyber Warfare Simulation',
      category: 'day5',
      description: 'Practice attack and defense strategies in controlled environments.',
      masteryLevel: 0,
      prerequisites: ['social-engineering', 'cryptography'],
      unlocked: false,
      position: { x: 900, y: 350 },
      connections: ['incident-response', 'threat-hunting'],
      icon: <Target className="w-6 h-6" />,
      color: '#7C2D12',
      xpValue: 200,
      practicalApplication: 'Participate in cybersecurity exercises'
    },

    // Hidden/Secret Nodes (Easter Eggs)
    {
      id: 'quantum-crypto',
      title: 'Quantum Cryptography',
      category: 'secret',
      description: 'Explore the future of unbreakable encryption.',
      masteryLevel: 0,
      prerequisites: ['cryptography', 'ai-ethics'],
      unlocked: false,
      position: { x: 800, y: 500 },
      connections: ['quantum-computing'],
      icon: <Zap className="w-6 h-6" />,
      color: '#6366F1',
      xpValue: 300,
      practicalApplication: 'Understand post-quantum cryptography'
    }
  ]);

  // Career pathway definitions
  const careerPaths: CareerPath[] = [
    {
      id: 'penetration-tester',
      name: 'Penetration Tester',
      description: 'Ethical hackers who find vulnerabilities before the bad guys do.',
      requiredNodes: ['hacking-basics', 'python-programming', 'red-blue-teams'],
      icon: <Target className="w-8 h-8" />,
      color: '#DC2626',
      salary: '$75k - $150k',
      demand: 'Very High'
    },
    {
      id: 'security-analyst',
      name: 'Security Analyst',
      description: 'Monitor networks and systems for security threats.',
      requiredNodes: ['wireshark-analysis', 'incident-response', 'threat-hunting'],
      icon: <Eye className="w-8 h-8" />,
      color: '#2563EB',
      salary: '$60k - $120k',
      demand: 'High'
    },
    {
      id: 'cryptographer',
      name: 'Cryptographer',
      description: 'Design and analyze encryption systems.',
      requiredNodes: ['cryptography', 'quantum-crypto', 'ai-ethics'],
      icon: <Lock className="w-8 h-8" />,
      color: '#7C2D12',
      salary: '$90k - $180k',
      demand: 'Medium'
    }
  ];

  // Calculate mastery levels based on game progress
  const updateMasteryLevels = useCallback(() => {
    setKnowledgeNodes(prev => prev.map(node => {
      // Get XP from relevant games based on node type
      let totalXP = 0;
      let maxXP = node.xpValue;

      // Check Password Fortress progress for security nodes
      if (['password-security', 'mfa-concepts'].includes(node.id)) {
        const pfState = gameSpecificStates.passwordFortress;
        if (pfState) {
          totalXP += pfState.securityPoints || 0;
          maxXP = 500;
        }
      }

      // Check Pokemon MMO progress for GenCyber concepts
      if (node.category.startsWith('day')) {
        const pokeState = gameSpecificStates.pokemonMMO;
        if (pokeState) {
          totalXP += pokeState.totalExp || 0;
          maxXP = 1000;
        }
      }

      // Calculate mastery percentage
      const masteryLevel = Math.min(100, (totalXP / maxXP) * 100);
      
      // Check if prerequisites are met for unlocking
      const unlocked = node.prerequisites.length === 0 || 
        node.prerequisites.every(prereq => {
          const prereqNode = prev.find(n => n.id === prereq);
          return prereqNode?.unlocked && prereqNode.masteryLevel >= 50;
        });

      return {
        ...node,
        masteryLevel: Math.round(masteryLevel),
        unlocked: unlocked || node.unlocked
      };
    }));
  }, [gameSpecificStates]);

  // Update mastery levels when game states change
  useEffect(() => {
    updateMasteryLevels();
  }, [updateMasteryLevels]);

  // Handle node selection
  const handleNodeClick = (node: KnowledgeNode) => {
    if (!node.unlocked) return;
    
    setSelectedNode(node);
    setShowNodeDetails(true);
    
    // Award XP for exploring nodes
    addExperience(10);
    // updateSkillProgress('exploration', 1); // TODO: Fix skill progress interface
  };

  // Generate silk connections with animation
  const generateSilkConnections = (): SilkConnection[] => {
    const connections: SilkConnection[] = [];
    
    knowledgeNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = knowledgeNodes.find(n => n.id === connectionId);
        if (targetNode) {
          connections.push({
            id: `${node.id}-${connectionId}`,
            from: node.id,
            to: connectionId,
            strength: (node.masteryLevel + targetNode.masteryLevel) / 200,
            type: node.prerequisites.includes(connectionId) ? 'prerequisite' : 'related',
            animated: animateConnections && (node.unlocked || targetNode.unlocked)
          });
        }
      });
    });
    
    return connections;
  };

  // Render individual knowledge node
  const renderKnowledgeNode = (node: KnowledgeNode) => (
    <motion.div
      key={node.id}
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
        node.unlocked ? 'opacity-100' : 'opacity-50'
      }`}
      style={{ left: node.position.x, top: node.position.y }}
      whileHover={{ scale: node.unlocked ? 1.1 : 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleNodeClick(node)}
      onMouseEnter={() => setHoveredNode(node.id)}
      onMouseLeave={() => setHoveredNode(null)}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-2 ${
          node.unlocked ? 'border-white' : 'border-gray-500'
        }`}
        style={{ backgroundColor: node.color }}
      >
        {node.icon}
      </div>
      
      {/* Mastery progress ring */}
      <svg className="absolute inset-0 w-16 h-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2"
          strokeDasharray={`${(node.masteryLevel / 100) * 188} 188`}
          className="transition-all duration-500"
        />
      </svg>
      
      {/* Node label */}
      <div className="absolute top-full mt-2 text-center">
        <div className="text-white text-xs font-medium max-w-20 leading-tight">
          {node.title}
        </div>
        <div className="text-blue-200 text-xs">
          {node.masteryLevel}%
        </div>
      </div>
      
      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredNode === node.id && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 bg-gray-900 text-white p-2 rounded-lg text-xs max-w-48 z-50"
          >
            {node.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Render silk connections
  const renderSilkConnections = () => {
    const connections = generateSilkConnections();
    
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(connection => {
          const fromNode = knowledgeNodes.find(n => n.id === connection.from);
          const toNode = knowledgeNodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <motion.line
              key={connection.id}
              x1={fromNode.position.x}
              y1={fromNode.position.y}
              x2={toNode.position.x}
              y2={toNode.position.y}
              stroke={connection.type === 'prerequisite' ? '#10B981' : '#6366F1'}
              strokeWidth={2 + connection.strength * 3}
              strokeOpacity={0.3 + connection.strength * 0.4}
              strokeDasharray={connection.animated ? "5,5" : "none"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Brain className="w-10 h-10 mr-3" />
            🧠 Cyber Knowledge Brain
          </h1>
          <p className="text-blue-200 text-lg">
            Visualize your cybersecurity learning journey through the neural networks of knowledge
          </p>
        </div>

        {/* Control Panel */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setViewMode('skills')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'skills' ? 'bg-blue-600 text-white' : 'bg-white/10 text-blue-200'
            }`}
          >
            Skills View
          </button>
          <button
            onClick={() => setViewMode('career')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'career' ? 'bg-purple-600 text-white' : 'bg-white/10 text-blue-200'
            }`}
          >
            Career Paths
          </button>
          <button
            onClick={() => setViewMode('mystery')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'mystery' ? 'bg-pink-600 text-white' : 'bg-white/10 text-blue-200'
            }`}
          >
            🔍 Mystery Mode
          </button>
        </div>
      </div>

      {/* Main Knowledge Visualization */}
      <div className="relative w-full h-96 mx-auto">
        {/* Silk connections */}
        {renderSilkConnections()}
        
        {/* Knowledge nodes */}
        {knowledgeNodes
          .filter(node => viewMode === 'mystery' || node.category !== 'secret')
          .map(renderKnowledgeNode)
        }
      </div>

      {/* Stats Panel */}
      <div className="fixed bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
        <h3 className="font-bold mb-2">Learning Progress</h3>
        <div className="space-y-1 text-sm">
          <div>Total Level: {getPlayerLevel()}</div>
          <div>Nodes Unlocked: {knowledgeNodes.filter(n => n.unlocked).length}/{knowledgeNodes.length}</div>
          <div>Average Mastery: {Math.round(knowledgeNodes.reduce((sum, n) => sum + n.masteryLevel, 0) / knowledgeNodes.length)}%</div>
        </div>
      </div>

      {/* Node Details Modal */}
      <AnimatePresence>
        {showNodeDetails && selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNodeDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-4"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  {selectedNode.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedNode.title}</h3>
                  <p className="text-blue-200">Mastery: {selectedNode.masteryLevel}%</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{selectedNode.description}</p>
              
              {selectedNode.practicalApplication && (
                <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
                  <h4 className="text-blue-200 font-semibold mb-1">Practical Application:</h4>
                  <p className="text-blue-100 text-sm">{selectedNode.practicalApplication}</p>
                </div>
              )}
              
              <button
                onClick={() => setShowNodeDetails(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Continue Learning
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberKnowledgeBrainGame;
