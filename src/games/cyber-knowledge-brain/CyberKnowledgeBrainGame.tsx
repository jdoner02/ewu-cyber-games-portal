'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Zap, Target, Users, Shield } from 'lucide-react';
import useGameStore from '@/stores/gameStore';

/**
 * 🧠 CYBER KNOWLEDGE BRAIN - Enhanced with Weave Silk Mechanics
 * 
 * 🎯 EDUCATIONAL MISSION:
 * Visualize student learning progress as a living, breathing knowledge network
 * that grows and evolves as they master cybersecurity concepts through games.
 * 
 * ✨ WEAVE SILK MECHANICS:
 * - Flowing, organic connections between concepts (like silk threads)
 * - Dynamic animations that respond to learning progress
 * - Knowledge "particles" that flow between connected nodes
 * - Beautiful gradient effects that pulse with activity
 * 
 * 🎮 LEARNING POINTS INTEGRATION:
 * - Real-time XP and skill tracking from all games
 * - Visual growth as students master concepts
 * - Achievement unlocks that expand the brain
 * - Progress pathways that guide learning journey
 */

// Enhanced types for the knowledge brain system
interface KnowledgeNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  category: 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'bonus'
  type: 'cyber-fundamentals' | 'hardware-fundamentals' | 'cryptography' | 'network-security' | 'security-frameworks' | 'system-security' | 'authentication' | 'ethics-law' | 'programming' | 'ai-ethics' | 'attack-defense'
  level: number
  mastery: number // 0-100 based on game progress
  connections: string[] // IDs of connected nodes
  position: { x: number; y: number }
  unlocked: boolean
  description: string
  learningObjectives: string[]
  gameSource: string[] // Which games contribute to this node
  genCyberDay: number
  careerConnections: string[]
  hands_on_activities: string[]
  prerequisites: string[]
  silk_intensity: number // For weave silk visual effects
}

interface LearningParticle {
  id: string
  sourceNode: string
  targetNode: string
  progress: number // 0-1 animation progress
  type: 'xp' | 'mastery' | 'connection'
  color: string
}

interface SilkConnection {
  id: string
  source: string
  target: string
  strength: number // 0-1 based on how related the concepts are
  flow_direction: 'bidirectional' | 'source_to_target' | 'target_to_source'
  pulsePhase: number // For animation timing
  active: boolean // Currently transmitting knowledge
}

interface SkillNode {
  id: string
  name: string
  description: string
  category: 'cia-triad' | 'cryptography' | 'network-security' | 'hardware-security' | 'security-frameworks' | 'incident-response' | 'ethics-law'
  level: number
  unlocked: boolean
  prerequisites: string[]
  rewards: {
    monsters?: string[]
    badges?: string[]
    abilities?: string[]
  }
  educational_activity?: {
    title: string
    type: 'hands-on-lab' | 'simulation' | 'case-study' | 'research-project'
    objectives: string[]
    assessment: string[]
  }
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum'
  earned: boolean
  requirements: string
  gencyber_alignment: string
  career_relevance: string
}

interface PlayerProgress {
  level: number
  experience: number
  totalExperience: number
  unlockedNodes: string[]
  collectedMonsters: string[]
  earnedBadges: string[]
  completedActivities: string[]
  cyberScoutRank: string
  currentRegion: string
}

// Main Enhanced Cyber Knowledge Brain Component
const EnhancedCyberKnowledgeBrain: React.FC = () => {
  // Game store integration for real-time learning data
  const { 
    playerStats, 
    skillProgress, 
    gameProgress, 
    achievements,
    addXP,
    updateSkillProgress 
  } = useGameStore();

  // Component state
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [viewMode, setViewMode] = useState<'brain' | 'constellation' | 'neural-network'>('brain');
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [showParticles, setShowParticles] = useState(true);
  const [activeConnections, setActiveConnections] = useState<SilkConnection[]>([]);
  const [learningParticles, setLearningParticles] = useState<LearningParticle[]>([]);
  
  // D3 visualization refs
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<KnowledgeNode, SilkConnection> | null>(null);

  // GenCyber Day 1-5 Knowledge Network Data
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([
    // Day 1 Nodes - Foundations
    {
      id: 'cyber-careers',
      name: 'Cybersecurity Careers',
      category: 'day1',
      type: 'cyber-fundamentals',
      level: 1,
      mastery: calculateMastery('cyber-careers'),
      connections: ['cyber-ethics', 'teamwork-skills', 'computer-basics'],
      position: { x: 100, y: 100 },
      unlocked: true,
      description: 'Explore the diverse world of cybersecurity careers',
      learningObjectives: [
        'Identify different cybersecurity job roles',
        'Understand career pathways in cybersecurity',
        'Connect personal interests to cyber careers'
      ],
      gameSource: ['pokemon-cyber-mmo'],
      genCyberDay: 1,
      careerConnections: ['Security Analyst', 'Penetration Tester', 'CISO'],
      hands_on_activities: ['Career exploration game', 'Role-playing exercises'],
      prerequisites: [],
      silk_intensity: 0.8
    },
    {
      id: 'cyber-ethics',
      name: 'Cybersecurity Ethics',
      category: 'day1',
      type: 'ethics-law',
      level: 1,
      mastery: calculateMastery('cyber-ethics'),
      connections: ['cyber-careers', 'hacking-concepts', 'legal-frameworks'],
      position: { x: 200, y: 150 },
      unlocked: true,
      description: 'Learn the ethical foundations of cybersecurity',
      learningObjectives: [
        'Distinguish between ethical and unethical hacking',
        'Understand responsible disclosure',
        'Apply ethical frameworks to cyber scenarios'
      ],
      gameSource: ['pokemon-cyber-mmo', 'phishing-detective'],
      genCyberDay: 1,
      careerConnections: ['Ethical Hacker', 'Compliance Officer', 'Security Consultant'],
      hands_on_activities: ['Ethical dilemma scenarios', 'Code of conduct creation'],
      prerequisites: [],
      silk_intensity: 0.9
    },
    {
      id: 'computer-basics',
      name: 'Computer Hardware & Software',
      category: 'day1',
      type: 'hardware-fundamentals',
      level: 1,
      mastery: calculateMastery('computer-basics'),
      connections: ['file-systems', 'windows-security', 'network-fundamentals'],
      position: { x: 150, y: 200 },
      unlocked: true,
      description: 'Understand the building blocks of computer systems',
      learningObjectives: [
        'Differentiate hardware from software',
        'Identify key computer components',
        'Understand system interdependencies'
      ],
      gameSource: ['pokemon-cyber-mmo'],
      genCyberDay: 1,
      careerConnections: ['Systems Administrator', 'Hardware Security Specialist'],
      hands_on_activities: ['Computer disassembly/assembly', 'Component identification'],
      prerequisites: [],
      silk_intensity: 0.7
    },
    
    // Day 2 Nodes - Networking
    {
      id: 'network-fundamentals',
      name: 'Network Fundamentals',
      category: 'day2',
      type: 'network-security',
      level: 2,
      mastery: calculateMastery('network-fundamentals'),
      connections: ['ip-addressing', 'wifi-security', 'packet-analysis'],
      position: { x: 300, y: 100 },
      unlocked: checkUnlocked('network-fundamentals'),
      description: 'Master the basics of computer networking',
      learningObjectives: [
        'Understand IP addressing concepts',
        'Configure basic network settings',
        'Analyze network traffic patterns'
      ],
      gameSource: ['packet-tracer-mmo', 'network-defense'],
      genCyberDay: 2,
      careerConnections: ['Network Security Engineer', 'SOC Analyst'],
      hands_on_activities: ['Packet Tracer simulations', 'Wireshark analysis'],
      prerequisites: ['computer-basics'],
      silk_intensity: 0.8
    },
    
    // Day 3 Nodes - Programming
    {
      id: 'programming-basics',
      name: 'Python Programming',
      category: 'day3',
      type: 'programming',
      level: 3,
      mastery: calculateMastery('programming-basics'),
      connections: ['algorithm-thinking', 'cyber-automation', 'turtle-graphics'],
      position: { x: 400, y: 150 },
      unlocked: checkUnlocked('programming-basics'),
      description: 'Learn programming fundamentals through Python',
      learningObjectives: [
        'Write basic Python programs',
        'Understand variables and data types',
        'Create simple algorithms'
      ],
      gameSource: ['pokemon-cyber-mmo'],
      genCyberDay: 3,
      careerConnections: ['Security Developer', 'Automation Engineer'],
      hands_on_activities: ['Python coding exercises', 'Turtle graphics projects'],
      prerequisites: ['computer-basics'],
      silk_intensity: 0.9
    },
    
    // Day 4 Nodes - Advanced Concepts
    {
      id: 'cryptography-basics',
      name: 'Cryptography & Encryption',
      category: 'day4',
      type: 'cryptography',
      level: 4,
      mastery: calculateMastery('cryptography-basics'),
      connections: ['binary-systems', 'steganography', 'password-security'],
      position: { x: 500, y: 100 },
      unlocked: checkUnlocked('cryptography-basics'),
      description: 'Discover the math behind securing information',
      learningObjectives: [
        'Understand encryption principles',
        'Implement basic ciphers',
        'Analyze cryptographic strength'
      ],
      gameSource: ['encryption-escape', 'password-fortress'],
      genCyberDay: 4,
      careerConnections: ['Cryptographer', 'Security Architect'],
      hands_on_activities: ['Caesar cipher challenges', 'CyberChef exercises'],
      prerequisites: ['programming-basics'],
      silk_intensity: 1.0
    },
    
    // Day 5 Nodes - Practical Application
    {
      id: 'social-engineering',
      name: 'Social Engineering Defense',
      category: 'day5',
      type: 'attack-defense',
      level: 5,
      mastery: calculateMastery('social-engineering'),
      connections: ['phishing-detection', 'osint-awareness', 'incident-response'],
      position: { x: 600, y: 150 },
      unlocked: checkUnlocked('social-engineering'),
      description: 'Recognize and defend against human-based attacks',
      learningObjectives: [
        'Identify social engineering tactics',
        'Develop defensive strategies',
        'Practice incident response'
      ],
      gameSource: ['phishing-detective'],
      genCyberDay: 5,
      careerConnections: ['Security Awareness Trainer', 'Incident Response Specialist'],
      hands_on_activities: ['Red vs Blue exercises', 'Phishing simulations'],
      prerequisites: ['cyber-ethics', 'network-fundamentals'],
      silk_intensity: 0.8
    }
  ]);

  // Helper functions for dynamic data
  function calculateMastery(nodeId: string): number {
    // Calculate mastery based on game progress and skill progress
    const gameScores = gameProgress
      .filter(game => game.gameId.includes(nodeId) || game.completed)
      .reduce((sum, game) => sum + game.highScore, 0);
    
    const skillValue = Object.values(skillProgress).reduce((sum, skill) => sum + skill, 0) / 6;
    
    return Math.min(100, (gameScores / 10) + skillValue);
  }

  function checkUnlocked(nodeId: string): boolean {
    // Unlock logic based on prerequisites and player progress
    const node = knowledgeNodes.find(n => n.id === nodeId);
    if (!node) return false;
    
    if (node.prerequisites.length === 0) return true;
    
    return node.prerequisites.every(prereqId => {
      const prereq = knowledgeNodes.find(n => n.id === prereqId);
      return prereq && prereq.mastery >= 50; // 50% mastery required to unlock
    });
  }
