'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Monitor, Settings, Zap, UserCheck, MapPin, Archive, FolderOpen } from 'lucide-react';

// Types for the Day 1 GenCyber Pokemon MMO
interface CyberPokemon {
  id: string;
  name: string;
  type: 'cyber-career' | 'hardware' | 'software' | 'ethics' | 'teamwork' | 'security';
  level: number;
  hp: number;
  maxHp: number;
  abilities: string[];
  description: string;
  sprite: string;
  rarity: 'starter' | 'common' | 'uncommon' | 'rare';
  dayOneSkills: string[];
  careerPath?: string;
}

interface GameArea {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  dayOneConcepts: string[];
  bgGradient: string;
  icon: string;
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
}

interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  concept: string;
  teamSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: string[];
}

const PokemonCyberMMO: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'character-creation' | 'world' | 'battle' | 'storage' | 'team'>('intro');
  const [currentArea, setCurrentArea] = useState('new-bark-cyber');
  const [showAreaMap, setShowAreaMap] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<CyberPokemon | null>(null);
  const [showPokemonDetails, setShowPokemonDetails] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [teamChallengeActive, setTeamChallengeActive] = useState(false);
  
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
    totalExp: 0
  });

  // Day 1 GenCyber Pokemon Database
  const cyberPokemonDatabase: CyberPokemon[] = [
    // Starter Pokemon - Cyber Career Types
    {
      id: 'hackmon',
      name: 'Hackmon',
      type: 'cyber-career',
      level: 5,
      hp: 35,
      maxHp: 35,
      abilities: ['White Hat Ethics', 'Vulnerability Scan', 'Responsible Disclosure'],
      description: 'A curious creature that loves finding bugs in systems - but only to help fix them! Represents ethical hacking careers.',
      sprite: '🕵️‍♂️',
      rarity: 'starter',
      dayOneSkills: ['What is Hacking (Ethical)', 'Cyber Ethics', 'Career: Ethical Hacker'],
      careerPath: 'Ethical Hacker / Penetration Tester'
    },
    {
      id: 'guardmon',
      name: 'Guardmon',
      type: 'cyber-career',
      level: 5,
      hp: 40,
      maxHp: 40,
      abilities: ['Shield Wall', 'Threat Detection', 'Incident Response'],
      description: 'A protective defender that watches over networks and systems. Represents cybersecurity analyst careers.',
      sprite: '🛡️',
      rarity: 'starter',
      dayOneSkills: ['Cyber Defense', 'Security Monitoring', 'Career: Security Analyst'],
      careerPath: 'Cybersecurity Analyst / SOC Analyst'
    },
    {
      id: 'codemon',
      name: 'Codemon',
      type: 'cyber-career',
      level: 5,
      hp: 30,
      maxHp: 30,
      abilities: ['Secure Coding', 'Algorithm Design', 'Bug Fix'],
      description: 'A logical creature that writes secure code and builds safe systems. Represents software security careers.',
      sprite: '💻',
      rarity: 'starter',
      dayOneSkills: ['What Is An Algorithm', 'Secure Programming', 'Career: Security Developer'],
      careerPath: 'Security Software Developer'
    },

    // Hardware Pokemon - Computer Basics
    {
      id: 'mothermon',
      name: 'Mothermon',
      type: 'hardware',
      level: 1,
      hp: 50,
      maxHp: 50,
      abilities: ['Component Connection', 'Power Distribution', 'Data Pathways'],
      description: 'The foundation of all computer systems! This Pokemon connects every other hardware component together.',
      sprite: '🔧',
      rarity: 'common',
      dayOneSkills: ['Hardware vs Software', 'Motherboard Components', 'Computer Assembly'],
      careerPath: undefined
    },
    {
      id: 'cpumon',
      name: 'CPUmon',
      type: 'hardware',
      level: 1,
      hp: 35,
      maxHp: 35,
      abilities: ['Process Instructions', 'Calculate Fast', 'Multi-Core Power'],
      description: 'The brain of the computer! This speedy Pokemon handles all the thinking and calculations.',
      sprite: '🧠',
      rarity: 'common',
      dayOneSkills: ['CPU Function', 'Processing Speed', 'Computer Brain'],
      careerPath: undefined
    },
    {
      id: 'rammon',
      name: 'RAMmon',
      type: 'hardware',
      level: 1,
      hp: 25,
      maxHp: 25,
      abilities: ['Quick Access', 'Temporary Storage', 'Speed Boost'],
      description: 'This energetic Pokemon stores information temporarily for super-fast access. More RAM = faster computer!',
      sprite: '⚡',
      rarity: 'common',
      dayOneSkills: ['Memory vs Storage', 'RAM Function', 'System Performance'],
      careerPath: undefined
    },

    // Software Pokemon - File Structure & OS
    {
      id: 'foldermon',
      name: 'Foldermon',
      type: 'software',
      level: 1,
      hp: 40,
      maxHp: 40,
      abilities: ['Organize Files', 'Create Structure', 'Nest Folders'],
      description: 'A super organized Pokemon that keeps all your files neat and tidy in folders and subfolders!',
      sprite: '📁',
      rarity: 'common',
      dayOneSkills: ['Folder Structure', 'File Organization', 'Directory Navigation'],
      careerPath: undefined
    },
    {
      id: 'terminalmon',
      name: 'Terminalmon',
      type: 'software',
      level: 2,
      hp: 30,
      maxHp: 30,
      abilities: ['Command Line', 'Text Interface', 'Power User'],
      description: 'A mysterious Pokemon that speaks in commands! Learning its language gives you power over the computer.',
      sprite: '⌨️',
      rarity: 'uncommon',
      dayOneSkills: ['Command Line Basics', 'Text Commands', 'CLI Navigation'],
      careerPath: undefined
    },
    {
      id: 'extensiomon',
      name: 'Extensiomon',
      type: 'software',
      level: 1,
      hp: 20,
      maxHp: 20,
      abilities: ['File Identification', 'Type Recognition', 'Format Support'],
      description: 'A helpful Pokemon that knows what every file type does! .txt, .pdf, .exe - it knows them all!',
      sprite: '📄',
      rarity: 'common',
      dayOneSkills: ['File Types', 'File Extensions', 'Document Formats'],
      careerPath: undefined
    },

    // Security Pokemon - Windows Basics
    {
      id: 'firewallmon',
      name: 'Firewallmon',
      type: 'security',
      level: 3,
      hp: 60,
      maxHp: 60,
      abilities: ['Block Threats', 'Filter Traffic', 'Port Control'],
      description: 'A vigilant guardian that controls what can enter and leave your computer network. Your first line of defense!',
      sprite: '🔥',
      rarity: 'uncommon',
      dayOneSkills: ['Windows Firewall', 'Network Protection', 'Basic Security'],
      careerPath: undefined
    },
    {
      id: 'usermon',
      name: 'Usermon',
      type: 'security',
      level: 1,
      hp: 35,
      maxHp: 35,
      abilities: ['Access Control', 'Permission Management', 'Account Security'],
      description: 'A responsible Pokemon that manages who can access what on the computer. Different users, different permissions!',
      sprite: '👤',
      rarity: 'common',
      dayOneSkills: ['User Accounts', 'Windows Users', 'Access Control'],
      careerPath: undefined
    },

    // Ethics & Teamwork Pokemon
    {
      id: 'ethicmon',
      name: 'Ethicmon',
      type: 'ethics',
      level: 2,
      hp: 45,
      maxHp: 45,
      abilities: ['Moral Compass', 'Right Choice', 'Responsible Action'],
      description: 'A wise Pokemon that always knows the right thing to do. Helps cybersecurity professionals make ethical decisions.',
      sprite: '⚖️',
      rarity: 'uncommon',
      dayOneSkills: ['Cyber Ethics', 'Responsible Hacking', 'Digital Citizenship'],
      careerPath: undefined
    },
    {
      id: 'teammon',
      name: 'Teammon',
      type: 'teamwork',
      level: 1,
      hp: 50,
      maxHp: 50,
      abilities: ['Collaboration', 'Communication', 'Support Others'],
      description: 'A friendly Pokemon that brings people together! Cybersecurity is always better when we work as a team.',
      sprite: '🤝',
      rarity: 'common',
      dayOneSkills: ['Team Building', 'Communication', 'Collaborative Problem Solving'],
      careerPath: undefined
    }
  ];

  // Game Areas - Day 1 GenCyber Progression
  const gameAreas: GameArea[] = [
    {
      id: 'new-bark-cyber',
      name: 'New Bark Cyber Town',
      description: 'Your cybersecurity journey begins here! Meet Professor Oak-Sec and choose your first cyber career Pokemon.',
      unlocked: true,
      dayOneConcepts: ['Meet Teammates', 'Cyber Careers', 'Choose Your Path'],
      bgGradient: 'from-green-400 to-blue-500',
      icon: '🏠'
    },
    {
      id: 'route-ethics',
      name: 'Ethics Route',
      description: 'Learn what it means to be a good cyber citizen. Meet other trainers and form your team!',
      unlocked: false,
      dayOneConcepts: ['Cyber Ethics', 'What is Hacking', 'Team Building'],
      bgGradient: 'from-purple-400 to-pink-500',
      icon: '⚖️'
    },
    {
      id: 'hardware-lab',
      name: 'Hardware Lab City',
      description: 'Discover the physical world of computers! Take apart and rebuild systems with your Pokemon.',
      unlocked: false,
      dayOneConcepts: ['Hardware vs Software', 'Computer Components', 'System Assembly'],
      bgGradient: 'from-orange-400 to-red-500',
      icon: '🔧'
    },
    {
      id: 'file-forest',
      name: 'File Forest',
      description: 'Navigate the mysterious world of folders, files, and the command line with your Pokemon guides!',
      unlocked: false,
      dayOneConcepts: ['Folder Structure', 'File Types', 'Command Line Basics'],
      bgGradient: 'from-green-500 to-emerald-600',
      icon: '📁'
    },
    {
      id: 'security-city',
      name: 'Security City',
      description: 'Master Windows security basics! Control user accounts, firewalls, and system settings.',
      unlocked: false,
      dayOneConcepts: ['Windows Security', 'User Accounts', 'Control Panel', 'Firewalls'],
      bgGradient: 'from-blue-600 to-indigo-700',
      icon: '🛡️'
    },
    {
      id: 'team-gym',
      name: 'Collaboration Gym',
      description: 'Test your teamwork skills! Work with other trainers to solve cyber challenges together.',
      unlocked: false,
      dayOneConcepts: ['Team Challenges', 'Algorithm Design', 'Collaborative Problem Solving'],
      bgGradient: 'from-yellow-400 to-orange-500',
      icon: '🏟️'
    }
  ];

  // Team Challenges for Day 1
  const teamChallenges: TeamChallenge[] = [
    {
      id: 'meet-challenge',
      title: 'Meet Two New Trainers',
      description: 'Find and team up with two other cyber trainers in your area. Exchange trainer cards!',
      concept: 'Social Interaction',
      teamSize: 3,
      difficulty: 'easy',
      rewards: ['Friendship Badge', 'Team Bonus XP', 'Social Pokemon Encounter']
    },
    {
      id: 'mentor-challenge',
      title: 'Find Your Cyber Mentor',
      description: 'Connect with an experienced trainer who can guide your cybersecurity journey!',
      concept: 'Mentorship',
      teamSize: 2,
      difficulty: 'easy',
      rewards: ['Mentor Badge', 'Wisdom Boost', 'Career Guidance']
    },
    {
      id: 'hardware-build',
      title: 'Build the Perfect PC',
      description: 'Work as a team to assemble a computer from components. Each trainer handles different parts!',
      concept: 'Hardware Assembly',
      teamSize: 4,
      difficulty: 'medium',
      rewards: ['Builder Badge', 'Hardware Pokemon', 'System Knowledge']
    },
    {
      id: 'algorithm-race',
      title: 'Algorithm Speed Challenge',
      description: 'Design the fastest algorithm to solve a cyber puzzle. Collaborate to optimize your solution!',
      concept: 'Algorithmic Thinking',
      teamSize: 3,
      difficulty: 'medium',
      rewards: ['Logic Master Badge', 'Algorithm Pokemon', 'Problem Solving Skills']
    }
  ];

  // Load game state from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('pokemon-cyber-mmo-profile');
    if (savedProfile) {
      setPlayerProfile(JSON.parse(savedProfile));
      setGameState('world');
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (playerProfile.name) {
      localStorage.setItem('pokemon-cyber-mmo-profile', JSON.stringify(playerProfile));
    }
  }, [playerProfile]);

  const startGame = (trainerName: string, starterPokemon: CyberPokemon) => {
    const newProfile: PlayerProfile = {
      ...playerProfile,
      name: trainerName,
      team: [starterPokemon],
      exp: 100,
      totalExp: 100
    };
    setPlayerProfile(newProfile);
    setGameState('world');
  };

  const unlockNextArea = () => {
    const currentIndex = gameAreas.findIndex(area => area.id === currentArea);
    if (currentIndex < gameAreas.length - 1) {
      const nextArea = gameAreas[currentIndex + 1];
      nextArea.unlocked = true;
      setCurrentArea(nextArea.id);
      
      setPlayerProfile(prev => ({
        ...prev,
        currentArea: nextArea.id,
        exp: prev.exp + 200,
        totalExp: prev.totalExp + 200
      }));
    }
  };

  const catchPokemon = (pokemon: CyberPokemon) => {
    setPlayerProfile(prev => ({
      ...prev,
      storage: [...prev.storage, pokemon],
      exp: prev.exp + 50,
      totalExp: prev.totalExp + 50
    }));
  };

  const getCurrentAreaData = () => {
    return gameAreas.find(area => area.id === currentArea) || gameAreas[0];
  };

  const renderIntroScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            🐉 Pokemon Cyber MMO 🛡️
          </h1>
          <h2 className="text-3xl text-yellow-300 mb-6">GenCyber Day 1 Adventure</h2>
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            Welcome to the Cyber Region! 🌍 Embark on an epic Pokemon-style adventure where you'll learn 
            fundamental cybersecurity concepts, meet fellow trainers, and collect amazing cyber creatures!
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Your Day 1 Journey Includes:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-3">
              <Users className="text-green-400" size={24} />
              <span className="text-white">Meet teammates and cyber mentors</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="text-blue-400" size={24} />
              <span className="text-white">Explore cyber careers and ethics</span>
            </div>
            <div className="flex items-center space-x-3">
              <Monitor className="text-purple-400" size={24} />
              <span className="text-white">Learn computer hardware vs software</span>
            </div>
            <div className="flex items-center space-x-3">
              <FolderOpen className="text-yellow-400" size={24} />
              <span className="text-white">Master file structures and command line</span>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="text-red-400" size={24} />
              <span className="text-white">Discover Windows security basics</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="text-orange-400" size={24} />
              <span className="text-white">Complete team challenges and earn badges</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={() => setGameState('character-creation')}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start Your Cyber Adventure! 🚀
        </motion.button>
      </div>
    </div>
  );

  const renderCharacterCreation = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Choose Your Cyber Career Path!</h2>
        <p className="text-xl text-center text-white/80 mb-8">
          Select your starter Pokemon based on the cybersecurity career that interests you most:
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {cyberPokemonDatabase.filter(p => p.rarity === 'starter').map((pokemon) => (
            <motion.div
              key={pokemon.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const trainerName = prompt('What is your trainer name?') || 'Cyber Trainer';
                startGame(trainerName, pokemon);
              }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center cursor-pointer hover:bg-white/30 transition-all"
            >
              <div className="text-6xl mb-4">{pokemon.sprite}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{pokemon.name}</h3>
              <p className="text-blue-100 mb-4">{pokemon.description}</p>
              <div className="text-sm text-yellow-200">
                <strong>Career Path:</strong> {pokemon.careerPath}
              </div>
              <div className="mt-4">
                <div className="text-xs text-green-200">Day 1 Skills:</div>
                <div className="text-xs text-white/70">{pokemon.dayOneSkills.join(', ')}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorldMap = () => {
    const currentAreaData = getCurrentAreaData();
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentAreaData.bgGradient} p-4`}>
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{playerProfile.name}</h2>
              <p className="text-white/80">Level {playerProfile.level} • Area: {currentAreaData.name}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAreaMap(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
              >
                <MapPin size={20} />
              </button>
              <button
                onClick={() => setGameState('storage')}
                className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg"
              >
                <Monitor size={20} />
              </button>
              <button
                onClick={() => setGameState('team')}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
              >
                <UserCheck size={20} />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(playerProfile.exp % 500) / 5}%` }}
              ></div>
            </div>
            <p className="text-white/70 text-sm mt-1">EXP: {playerProfile.exp}/500</p>
          </div>
        </div>

        {/* Current Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{currentAreaData.icon}</span>
            <div>
              <h3 className="text-3xl font-bold text-white">{currentAreaData.name}</h3>
              <p className="text-white/80">{currentAreaData.description}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-bold text-yellow-300 mb-2">Day 1 Concepts You'll Learn:</h4>
            <div className="flex flex-wrap gap-2">
              {currentAreaData.dayOneConcepts.map((concept, index) => (
                <span key={index} className="bg-yellow-400/20 text-yellow-200 px-3 py-1 rounded-full text-sm">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Wild Pokemon Encounters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <Zap className="mr-2" size={20} />
              Wild Cyber Pokemon!
            </h4>
            <div className="space-y-3">
              {cyberPokemonDatabase
                .filter(p => p.rarity !== 'starter' && Math.random() > 0.5)
                .slice(0, 3)
                .map((pokemon) => (
                  <div key={pokemon.id} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <span className="text-2xl mr-3">{pokemon.sprite}</span>
                      <span className="text-white font-bold">{pokemon.name}</span>
                      <span className="text-white/70 text-sm ml-2">Lv.{pokemon.level}</span>
                    </div>
                    <button
                      onClick={() => {
                        catchPokemon(pokemon);
                        setSelectedPokemon(pokemon);
                        setShowPokemonDetails(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Catch!
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Team Challenges */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              Team Challenges
            </h4>
            <div className="space-y-3">
              {teamChallenges.slice(0, 3).map((challenge) => (
                <div key={challenge.id} className="bg-white/10 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-white font-bold text-sm">{challenge.title}</h5>
                    <span className={`text-xs px-2 py-1 rounded ${
                      challenge.difficulty === 'easy' ? 'bg-green-500' :
                      challenge.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{challenge.description}</p>
                  <button
                    onClick={() => setTeamChallengeActive(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Join Challenge ({challenge.teamSize} trainers)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h4 className="text-xl font-bold text-white mb-4">Travel to Next Area</h4>
          <button
            onClick={unlockNextArea}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
          >
            Continue Your Journey! 🌟
          </button>
        </div>
      </div>
    );
  };

  const renderAreaMap = () => (
    <AnimatePresence>
      {showAreaMap && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAreaMap(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold text-white text-center mb-8">Cyber Region Map</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {gameAreas.map((area, index) => (
                <div
                  key={area.id}
                  className={`p-4 rounded-xl ${
                    area.unlocked 
                      ? `bg-gradient-to-br ${area.bgGradient} cursor-pointer hover:scale-105`
                      : 'bg-gray-600 opacity-50'
                  } transition-all`}
                  onClick={() => {
                    if (area.unlocked) {
                      setCurrentArea(area.id);
                      setShowAreaMap(false);
                    }
                  }}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{area.icon}</span>
                    <h4 className="text-lg font-bold text-white">{area.name}</h4>
                    {!area.unlocked && <span className="ml-2 text-yellow-300">🔒</span>}
                  </div>
                  <p className="text-white/80 text-sm">{area.description}</p>
                  <div className="mt-2">
                    <div className="text-xs text-yellow-200">Concepts:</div>
                    <div className="text-xs text-white/70">{area.dayOneConcepts.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderPokemonDetails = () => (
    <AnimatePresence>
      {showPokemonDetails && selectedPokemon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPokemonDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedPokemon.sprite}</div>
              <h3 className="text-3xl font-bold text-white mb-2">{selectedPokemon.name}</h3>
              <p className="text-white/80 mb-4">{selectedPokemon.description}</p>
              
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-bold text-yellow-300 mb-2">Day 1 Skills</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedPokemon.dayOneSkills.map((skill, index) => (
                    <span key={index} className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-bold text-green-300 mb-2">Abilities</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedPokemon.abilities.map((ability, index) => (
                    <span key={index} className="bg-green-500/30 text-green-200 px-2 py-1 rounded text-sm">
                      {ability}
                    </span>
                  ))}
                </div>
              </div>

              {selectedPokemon.careerPath && (
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h4 className="text-lg font-bold text-purple-300 mb-2">Career Path</h4>
                  <p className="text-purple-200">{selectedPokemon.careerPath}</p>
                </div>
              )}

              <button
                onClick={() => setShowPokemonDetails(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderStorage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-white">Pokemon Storage</h2>
          <button
            onClick={() => setGameState('world')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to World
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playerProfile.storage.map((pokemon, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-all"
              onClick={() => {
                setSelectedPokemon(pokemon);
                setShowPokemonDetails(true);
              }}
            >
              <div className="text-4xl mb-2">{pokemon.sprite}</div>
              <h4 className="text-white font-bold">{pokemon.name}</h4>
              <p className="text-white/70 text-sm">Level {pokemon.level}</p>
              <div className="mt-2">
                <div className="bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${(pokemon.hp / pokemon.maxHp) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white/70 text-xs mt-1">HP: {pokemon.hp}/{pokemon.maxHp}</p>
              </div>
            </div>
          ))}
        </div>
        
        {playerProfile.storage.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-xl">Your storage is empty!</p>
            <p className="text-white/50">Catch some Pokemon to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTeamMode = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-white">Team & Social</h2>
          <button
            onClick={() => setGameState('world')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to World
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Team */}
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Pokemon Team</h3>
            <div className="space-y-3">
              {playerProfile.team.map((pokemon, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center">
                  <span className="text-3xl mr-4">{pokemon.sprite}</span>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{pokemon.name}</h4>
                    <p className="text-white/70 text-sm">Level {pokemon.level}</p>
                    <div className="bg-gray-600 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${(pokemon.hp / pokemon.maxHp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teammates */}
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Fellow Trainers Online</h3>
            <div className="space-y-3">
              {['CyberScout_Emma', 'HackerHero_Alex', 'SecuritySam_2025', 'CyberNinja_Jay'].map((name, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-bold">{name}</h4>
                    <p className="text-green-400 text-sm">● Online - Looking for team</p>
                  </div>
                  <button
                    onClick={() => {
                      setPlayerProfile(prev => ({
                        ...prev,
                        teammates: [...prev.teammates, name]
                      }));
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Team Challenges */}
        <div className="mt-6 bg-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Active Team Challenges</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {teamChallenges.slice(0, 2).map((challenge) => (
              <div key={challenge.id} className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold">{challenge.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    challenge.difficulty === 'easy' ? 'bg-green-500' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-white/70 text-sm mb-3">{challenge.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 text-sm">Need {challenge.teamSize} trainers</span>
                  <button
                    onClick={() => alert('Team challenge started! Work together to complete it.')}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Start Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {gameState === 'intro' && renderIntroScreen()}
      {gameState === 'character-creation' && renderCharacterCreation()}
      {gameState === 'world' && renderWorldMap()}
      {gameState === 'storage' && renderStorage()}
      {gameState === 'team' && renderTeamMode()}
      
      {renderAreaMap()}
      {renderPokemonDetails()}

      {/* Team Challenge Modal */}
      <AnimatePresence>
        {teamChallengeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setTeamChallengeActive(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white text-center mb-4">Team Challenge Active!</h3>
              <p className="text-white/80 text-center mb-6">
                Great! You've joined a team challenge. In a real GenCyber camp, you'd work with other 
                students to complete this activity. For now, enjoy exploring the Pokemon world!
              </p>
              <div className="text-center">
                <button
                  onClick={() => {
                    setTeamChallengeActive(false);
                    setPlayerProfile(prev => ({
                      ...prev,
                      exp: prev.exp + 150,
                      totalExp: prev.totalExp + 150,
                      badges: [...prev.badges, 'Team Player']
                    }));
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
                >
                  Complete Challenge (+150 EXP)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PokemonCyberMMO;
