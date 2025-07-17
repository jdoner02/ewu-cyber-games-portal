'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Monitor, Settings, Zap, UserCheck, MapPin, Calendar } from 'lucide-react';
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

// Types for the Day 1 GenCyber Pokemon MMO
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
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  rewards: string[];
}

const PokemonCyberMMO: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'character-creation' | 'world' | 'battle' | 'storage' | 'team' | 'knowledge-arena'>('intro');
  const [currentArea, setCurrentArea] = useState('new-bark-cyber');
  const [showAreaMap, setShowAreaMap] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<CyberPokemon | null>(null);
  const [showPokemonDetails, setShowPokemonDetails] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [teamChallengeActive, setTeamChallengeActive] = useState(false);
  const [currentDay, setCurrentDay] = useState(1); // Track GenCyber camp day (1-5)
  const [unlockedDays, setUnlockedDays] = useState([1, 2, 3, 4, 5]); // Which days are accessible
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null); // Current tutorial
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]); // Completed tutorials
  
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
      careerPath: undefined,
      genCyberDay: 1
    },

    // DAY 2 POKEMON - NETWORKING FOCUS
    {
      id: 'ipmon',
      name: 'IPmon',
      type: 'networking',
      level: 3,
      hp: 45,
      maxHp: 45,
      abilities: ['Address Assignment', 'Subnet Masking', 'Network Identification'],
      description: 'A logical Pokemon that assigns unique addresses to every device on the network. Every computer needs an IP address!',
      sprite: '📍',
      rarity: 'common',
      dayOneSkills: ['IP Addresses', 'Network Identification', 'Connectivity Basics'],
      careerPath: undefined,
      genCyberDay: 2
    },
    {
      id: 'packetmon',
      name: 'Packetmon',
      type: 'networking',
      level: 4,
      hp: 40,
      maxHp: 40,
      abilities: ['Data Encapsulation', 'Route Discovery', 'Packet Assembly'],
      description: 'A speedy messenger Pokemon that carries data across networks in small packets. Works great with Packet Tracer!',
      sprite: '📦',
      rarity: 'common',
      dayOneSkills: ['Packet Tracer Networks', 'Data Transmission', 'Network Commands'],
      careerPath: undefined,
      genCyberDay: 2
    },
    {
      id: 'switchmon',
      name: 'Switchmon',
      type: 'networking',
      level: 5,
      hp: 60,
      maxHp: 60,
      abilities: ['MAC Learning', 'Frame Forwarding', 'VLAN Segmentation'],
      description: 'A social Pokemon that connects devices within a network. Learns MAC addresses and forwards data efficiently!',
      sprite: '🔀',
      rarity: 'uncommon',
      dayOneSkills: ['Switches', 'Ethernet Cords', 'Local Networks'],
      careerPath: undefined,
      genCyberDay: 2
    },
    {
      id: 'wifimon',
      name: 'WiFimon',
      type: 'networking',
      level: 4,
      hp: 35,
      maxHp: 35,
      abilities: ['Wireless Signal', 'SSID Broadcast', 'WPA Encryption'],
      description: 'A wireless Pokemon that enables network connections without cables. Manages SSIDs and wireless security!',
      sprite: '📶',
      rarity: 'common',
      dayOneSkills: ['WiFi Setup', 'SSID Configuration', 'Wireless Security'],
      careerPath: undefined,
      genCyberDay: 2
    },
    {
      id: 'dhcpmon',
      name: 'DHCPmon',
      type: 'networking',
      level: 3,
      hp: 50,
      maxHp: 50,
      abilities: ['Dynamic Assignment', 'IP Pool Management', 'Lease Control'],
      description: 'A helpful Pokemon that automatically assigns IP addresses to devices. No more manual configuration!',
      sprite: '🎯',
      rarity: 'common',
      dayOneSkills: ['DHCP', 'Dynamic IP Assignment', 'Network Automation'],
      careerPath: undefined,
      genCyberDay: 2
    },

    // DAY 3 POKEMON - PROGRAMMING FOCUS
    {
      id: 'pythonmon',
      name: 'Pythonmon',
      type: 'programming',
      level: 5,
      hp: 55,
      maxHp: 55,
      abilities: ['Clean Syntax', 'Library Import', 'Rapid Development'],
      description: 'A wise serpent Pokemon that speaks in Python code! Easy to learn but incredibly powerful for cybersecurity.',
      sprite: '🐍',
      rarity: 'uncommon',
      dayOneSkills: ['Python Installation', 'Programming Basics', 'Pyscripter Setup'],
      careerPath: undefined,
      genCyberDay: 3
    },
    {
      id: 'variablemon',
      name: 'Variablemon',
      type: 'programming',
      level: 2,
      hp: 30,
      maxHp: 30,
      abilities: ['Data Storage', 'Type Flexibility', 'Value Assignment'],
      description: 'A shapeshifting Pokemon that can store any type of data! Strings, numbers, lists - it remembers everything.',
      sprite: '📝',
      rarity: 'common',
      dayOneSkills: ['Data Types', 'Variables', 'Value Assignment'],
      careerPath: undefined,
      genCyberDay: 3
    },
    {
      id: 'loopmon',
      name: 'Loopmon',
      type: 'programming',
      level: 3,
      hp: 40,
      maxHp: 40,
      abilities: ['Iteration', 'Condition Check', 'Repeated Execution'],
      description: 'A persistent Pokemon that repeats actions until the job is done! Masters of for loops and while loops.',
      sprite: '🔄',
      rarity: 'common',
      dayOneSkills: ['Logic Structures', 'Loops', 'Iteration Control'],
      careerPath: undefined,
      genCyberDay: 3
    },
    {
      id: 'turtlemon',
      name: 'Turtlemon',
      type: 'programming',
      level: 4,
      hp: 45,
      maxHp: 45,
      abilities: ['Graphics Drawing', 'Coordinate Movement', 'Creative Art'],
      description: 'An artistic Pokemon that draws beautiful pictures with code! Perfect for learning Python turtle graphics.',
      sprite: '🐢',
      rarity: 'uncommon',
      dayOneSkills: ['Turtle Programming', 'Graphics Programming', 'Creative Coding'],
      careerPath: undefined,
      genCyberDay: 3
    },
    {
      id: 'phidgetmon',
      name: 'Phidgetmon',
      type: 'programming',
      level: 5,
      hp: 50,
      maxHp: 50,
      abilities: ['Hardware Control', 'Sensor Reading', 'Physical Computing'],
      description: 'A bridge Pokemon that connects code to the physical world! Controls lights, sensors, and motors with programming.',
      sprite: '🔌',
      rarity: 'rare',
      dayOneSkills: ['Hardware Integration', 'Phidget Programming', 'Physical Computing'],
      careerPath: undefined,
      genCyberDay: 3
    },

    // DAY 4 POKEMON - ADVANCED SYSTEMS
    {
      id: 'vmmon',
      name: 'VMmon',
      type: 'systems',
      level: 6,
      hp: 65,
      maxHp: 65,
      abilities: ['Virtual Environment', 'OS Emulation', 'Resource Management'],
      description: 'A mystical Pokemon that creates virtual computers inside real computers! Run multiple operating systems safely.',
      sprite: '💻',
      rarity: 'rare',
      dayOneSkills: ['Virtual Machines', 'VMware Installation', 'OS Virtualization'],
      careerPath: undefined,
      genCyberDay: 4
    },
    {
      id: 'linuxmon',
      name: 'Linuxmon',
      type: 'systems',
      level: 5,
      hp: 55,
      maxHp: 55,
      abilities: ['Command Line', 'Open Source', 'System Administration'],
      description: 'A powerful penguin Pokemon that runs on commands! Master of terminal operations and system control.',
      sprite: '🐧',
      rarity: 'uncommon',
      dayOneSkills: ['Linux Basics', 'Command Structure', 'Operating Systems'],
      careerPath: undefined,
      genCyberDay: 4
    },
    {
      id: 'aimon',
      name: 'AImon',
      type: 'systems',
      level: 7,
      hp: 70,
      maxHp: 70,
      abilities: ['Machine Learning', 'Pattern Recognition', 'Ethical AI'],
      description: 'A futuristic Pokemon that learns and adapts! Teaches responsible AI usage and machine learning basics.',
      sprite: '🤖',
      rarity: 'rare',
      dayOneSkills: ['AI Ethics', 'Machine Learning', 'Teachable Machine'],
      careerPath: undefined,
      genCyberDay: 4
    },
    {
      id: 'binarymon',
      name: 'Binarymon',
      type: 'systems',
      level: 4,
      hp: 40,
      maxHp: 40,
      abilities: ['Binary Translation', 'Hex Conversion', 'Number Systems'],
      description: 'A digital Pokemon that speaks in 1s and 0s! Master of binary, decimal, and hexadecimal number systems.',
      sprite: '💾',
      rarity: 'common',
      dayOneSkills: ['Binary Numbers', 'Hex Conversion', 'Number Systems'],
      careerPath: undefined,
      genCyberDay: 4
    },
    {
      id: 'cryptomon',
      name: 'Cryptomon',
      type: 'systems',
      level: 6,
      hp: 55,
      maxHp: 55,
      abilities: ['Caesar Cipher', 'Steganography', 'Data Hiding'],
      description: 'A secretive Pokemon that hides information in plain sight! Expert in ciphers, steganography, and data concealment.',
      sprite: '🔐',
      rarity: 'rare',
      dayOneSkills: ['Caesar Cipher', 'Steganography', 'Data Hiding'],
      careerPath: undefined,
      genCyberDay: 4
    },

    // DAY 5 POKEMON - ATTACK & DEFENSE
    {
      id: 'phishmon',
      name: 'Phishmon',
      type: 'attack-defense',
      level: 5,
      hp: 45,
      maxHp: 45,
      abilities: ['Social Engineering', 'Deception Detection', 'Email Analysis'],
      description: 'A tricky Pokemon that teaches about phishing attacks! Learn to spot fake emails and social engineering.',
      sprite: '🎣',
      rarity: 'uncommon',
      dayOneSkills: ['Phishing Detection', 'Social Engineering', 'Email Security'],
      careerPath: undefined,
      genCyberDay: 5
    },
    {
      id: 'osintmon',
      name: 'OSINTmon',
      type: 'intelligence',
      level: 6,
      hp: 50,
      maxHp: 50,
      abilities: ['Information Gathering', 'Metadata Analysis', 'Source Verification'],
      description: 'A detective Pokemon that finds information from public sources! Master of open source intelligence gathering.',
      sprite: '🔍',
      rarity: 'rare',
      dayOneSkills: ['OSINT', 'Metadata Analysis', 'Information Gathering'],
      careerPath: undefined,
      genCyberDay: 5
    },
    {
      id: 'redteammon',
      name: 'RedTeammon',
      type: 'attack-defense',
      level: 7,
      hp: 60,
      maxHp: 60,
      abilities: ['Offensive Operations', 'Penetration Testing', 'Vulnerability Discovery'],
      description: 'An aggressive Pokemon that thinks like an attacker! Helps teams understand offensive cybersecurity tactics.',
      sprite: '⚔️',
      rarity: 'rare',
      dayOneSkills: ['Red Team Operations', 'Attack Techniques', 'Penetration Testing'],
      careerPath: undefined,
      genCyberDay: 5
    },
    {
      id: 'blueteammon',
      name: 'BlueTeammon',
      type: 'attack-defense',
      level: 7,
      hp: 65,
      maxHp: 65,
      abilities: ['Defensive Operations', 'Incident Response', 'Threat Hunting'],
      description: 'A protective Pokemon that defends against cyber attacks! Expert in defense strategies and incident response.',
      sprite: '🛡️',
      rarity: 'rare',
      dayOneSkills: ['Blue Team Defense', 'Incident Response', 'Threat Detection'],
      careerPath: undefined,
      genCyberDay: 5
    },
    {
      id: 'ctfmon',
      name: 'CTFmon',
      type: 'attack-defense',
      level: 8,
      hp: 70,
      maxHp: 70,
      abilities: ['Capture The Flag', 'Puzzle Solving', 'Competitive Hacking'],
      description: 'A competitive Pokemon that loves cybersecurity challenges! Master of CTF competitions and problem solving.',
      sprite: '🏁',
      rarity: 'legendary',
      dayOneSkills: ['CTF Competitions', 'Problem Solving', 'Cybersecurity Challenges'],
      careerPath: undefined,
      genCyberDay: 5
    }
  ];

  // Game Areas - Complete 5-Day GenCyber Progression
  const gameAreas: GameArea[] = [
    // DAY 1 AREAS
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
    },

    // DAY 2 AREAS - NETWORKING
    {
      id: 'network-harbor',
      name: 'Network Harbor',
      description: 'Explore the vast ocean of networking! Learn IP addressing and packet routing with your Pokemon crew.',
      unlocked: false,
      dayOneConcepts: ['IP Addresses', 'Packet Tracer Networks', 'Network Commands'],
      bgGradient: 'from-cyan-400 to-blue-600',
      icon: '🌊'
    },
    {
      id: 'switch-stadium',
      name: 'Switch Stadium',
      description: 'Battle arena for network switches! Connect devices and manage ethernet connections like a pro.',
      unlocked: false,
      dayOneConcepts: ['Switches', 'Ethernet Cords', 'Network Hardware'],
      bgGradient: 'from-teal-400 to-cyan-600',
      icon: '🏟️'
    },
    {
      id: 'router-rapids',
      name: 'Router Rapids',
      description: 'Navigate the rushing data streams! Master routing protocols and network connectivity.',
      unlocked: false,
      dayOneConcepts: ['Remote Desktop', 'File Sharing', 'Network Protocols'],
      bgGradient: 'from-blue-500 to-indigo-600',
      icon: '🌊'
    },
    {
      id: 'wifi-wilderness',
      name: 'WiFi Wilderness',
      description: 'Venture into the wireless frontier! Set up WiFi networks and master wireless security.',
      unlocked: false,
      dayOneConcepts: ['WiFi Setup', 'SSID Configuration', 'DHCP', 'Wireless Security'],
      bgGradient: 'from-purple-400 to-blue-500',
      icon: '📶'
    },

    // DAY 3 AREAS - PROGRAMMING
    {
      id: 'python-palace',
      name: 'Python Palace',
      description: 'Enter the royal court of programming! Learn Python basics with serpentine Pokemon masters.',
      unlocked: false,
      dayOneConcepts: ['Python Installation', 'Programming Basics', 'Data Types', 'Variables'],
      bgGradient: 'from-green-600 to-emerald-700',
      icon: '🐍'
    },
    {
      id: 'turtle-temple',
      name: 'Turtle Temple',
      description: 'Ancient temple of creative coding! Draw amazing graphics and learn turtle programming.',
      unlocked: false,
      dayOneConcepts: ['Turtle Programming', 'Graphics', 'Creative Coding', 'Python Libraries'],
      bgGradient: 'from-emerald-500 to-green-600',
      icon: '🐢'
    },
    {
      id: 'logic-labyrinth',
      name: 'Logic Labyrinth',
      description: 'Navigate the maze of programming logic! Master loops, conditionals, and algorithm design.',
      unlocked: false,
      dayOneConcepts: ['Logic Structures', 'Loops', 'Methods', 'Parameters & Returns'],
      bgGradient: 'from-amber-500 to-orange-600',
      icon: '🧩'
    },
    {
      id: 'phidget-factory',
      name: 'Phidget Factory',
      description: 'Industrial complex where code meets hardware! Control physical devices with programming.',
      unlocked: false,
      dayOneConcepts: ['Hardware Integration', 'Phidget Programming', 'Physical Computing'],
      bgGradient: 'from-gray-600 to-slate-700',
      icon: '🏭'
    },

    // DAY 4 AREAS - ADVANCED SYSTEMS
    {
      id: 'virtual-valley',
      name: 'Virtual Valley',
      description: 'Mystical realm of virtual machines! Create and manage multiple operating systems safely.',
      unlocked: false,
      dayOneConcepts: ['Virtual Machines', 'VMware', 'Ubuntu Installation', 'OS Management'],
      bgGradient: 'from-violet-500 to-purple-600',
      icon: '💻'
    },
    {
      id: 'ai-academy',
      name: 'AI Academy',
      description: 'Futuristic school of artificial intelligence! Learn ethical AI usage and machine learning.',
      unlocked: false,
      dayOneConcepts: ['AI Ethics', 'Machine Learning', 'AI Prompting', 'Teachable Machine'],
      bgGradient: 'from-indigo-500 to-blue-600',
      icon: '🤖'
    },
    {
      id: 'linux-laboratory',
      name: 'Linux Laboratory',
      description: 'Open source research facility! Master command line operations and Linux systems.',
      unlocked: false,
      dayOneConcepts: ['Linux Basics', 'Command Line', 'Terminal Operations', 'Open Source'],
      bgGradient: 'from-slate-600 to-gray-700',
      icon: '🐧'
    },
    {
      id: 'binary-battlefield',
      name: 'Binary Battlefield',
      description: 'Digital warzone of numbers! Master binary, hex, and cryptographic challenges.',
      unlocked: false,
      dayOneConcepts: ['Binary Numbers', 'Hex Conversion', 'Caesar Cipher', 'Steganography'],
      bgGradient: 'from-red-600 to-rose-700',
      icon: '💾'
    },
    {
      id: 'crypto-caverns',
      name: 'Crypto Caverns',
      description: 'Hidden underground network of secret codes! Explore encryption and data hiding techniques.',
      unlocked: false,
      dayOneConcepts: ['Encryption', 'Data Hiding', 'Cyber Chef', 'Secure Communication'],
      bgGradient: 'from-stone-600 to-neutral-700',
      icon: '🔐'
    },

    // DAY 5 AREAS - ATTACK & DEFENSE
    {
      id: 'attack-archipelago',
      name: 'Attack Archipelago',
      description: 'Island chain of offensive techniques! Learn about different types of cyber attacks responsibly.',
      unlocked: false,
      dayOneConcepts: ['Social Engineering', 'Phishing', 'Attack Types', 'Vulnerability Research'],
      bgGradient: 'from-red-500 to-orange-600',
      icon: '⚔️'
    },
    {
      id: 'defense-dojo',
      name: 'Defense Dojo',
      description: 'Training grounds for cyber defenders! Master blue team tactics and incident response.',
      unlocked: false,
      dayOneConcepts: ['Blue Team Defense', 'Incident Response', 'Threat Detection', 'Security Operations'],
      bgGradient: 'from-blue-600 to-indigo-700',
      icon: '🛡️'
    },
    {
      id: 'osint-observatory',
      name: 'OSINT Observatory',
      description: 'High-tech intelligence gathering facility! Learn to find information from public sources.',
      unlocked: false,
      dayOneConcepts: ['OSINT', 'Metadata Analysis', 'File Recovery', 'Information Gathering'],
      bgGradient: 'from-emerald-600 to-teal-700',
      icon: '🔭'
    },
    {
      id: 'red-vs-blue-arena',
      name: 'Red vs Blue Arena',
      description: 'Ultimate competition arena! Test your skills in the final cyber warfare simulation.',
      unlocked: false,
      dayOneConcepts: ['Red vs Blue Exercise', 'CTF Competitions', 'Team Competition', 'Practical Application'],
      bgGradient: 'from-gradient-to-rainbow',
      icon: '🏁'
    },
    {
      id: 'cyber-graduation',
      name: 'Cyber Graduation Hall',
      description: 'Celebrate your GenCyber journey! Showcase your skills and plan your cybersecurity future.',
      unlocked: false,
      dayOneConcepts: ['CyberPatriot Demo', 'Career Planning', 'School Clubs', 'Future Opportunities'],
      bgGradient: 'from-yellow-400 to-amber-500',
      icon: '🎓'
    }
  ];

  // Team Challenges for All 5 Days of GenCyber
  const teamChallenges: TeamChallenge[] = [
    // DAY 1 CHALLENGES
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
    },

    // DAY 2 CHALLENGES - NETWORKING
    {
      id: 'network-setup',
      title: 'Build the Cyber Campus Network',
      description: 'Design and configure a complete network for your Pokemon Center using switches and routers!',
      concept: 'Network Configuration',
      teamSize: 4,
      difficulty: 'medium',
      rewards: ['Network Engineer Badge', 'IPmon Pokemon', 'Routing Skills']
    },
    {
      id: 'packet-detective',
      title: 'Packet Detective Challenge',
      description: 'Use Packet Tracer to solve network mysteries and track down communication issues!',
      concept: 'Network Troubleshooting',
      teamSize: 3,
      difficulty: 'medium',
      rewards: ['Detective Badge', 'Packetmon Pokemon', 'Analysis Skills']
    },
    {
      id: 'wifi-fortress',
      title: 'Secure WiFi Fortress',
      description: 'Create an impenetrable wireless network with your team. Set up authentication and encryption!',
      concept: 'Wireless Security',
      teamSize: 3,
      difficulty: 'hard',
      rewards: ['Security Badge', 'WiFimon Pokemon', 'Wireless Mastery']
    },

    // DAY 3 CHALLENGES - PROGRAMMING
    {
      id: 'python-quest',
      title: 'Python Programming Quest',
      description: 'Embark on a coding adventure! Master variables, loops, and functions together!',
      concept: 'Programming Fundamentals',
      teamSize: 2,
      difficulty: 'medium',
      rewards: ['Coder Badge', 'Pythonmon Pokemon', 'Programming Skills']
    },
    {
      id: 'turtle-art-gallery',
      title: 'Turtle Art Gallery Challenge',
      description: 'Create a collaborative digital art gallery using Python turtle graphics!',
      concept: 'Creative Programming',
      teamSize: 4,
      difficulty: 'easy',
      rewards: ['Artist Badge', 'Turtlemon Pokemon', 'Creative Coding']
    },
    {
      id: 'phidget-robotics',
      title: 'Phidget Robotics Tournament',
      description: 'Program physical devices to compete in robotic challenges using sensors and motors!',
      concept: 'Physical Computing',
      teamSize: 3,
      difficulty: 'hard',
      rewards: ['Robotics Badge', 'Phidgetmon Pokemon', 'Hardware Programming']
    },

    // DAY 4 CHALLENGES - ADVANCED SYSTEMS
    {
      id: 'vm-laboratory',
      title: 'Virtual Machine Laboratory',
      description: 'Set up a complete virtual lab with multiple operating systems for cybersecurity testing!',
      concept: 'Virtualization',
      teamSize: 2,
      difficulty: 'medium',
      rewards: ['Virtualization Badge', 'VMmon Pokemon', 'System Administration']
    },
    {
      id: 'linux-expedition',
      title: 'Linux Command Line Expedition',
      description: 'Navigate the Linux wilderness using only terminal commands. Survive and thrive!',
      concept: 'Linux Mastery',
      teamSize: 3,
      difficulty: 'hard',
      rewards: ['Linux Master Badge', 'Linuxmon Pokemon', 'Command Line Skills']
    },
    {
      id: 'crypto-puzzle-masters',
      title: 'Cryptography Puzzle Masters',
      description: 'Decode ancient cyber mysteries using binary, hex, Caesar ciphers, and steganography!',
      concept: 'Cryptography',
      teamSize: 4,
      difficulty: 'hard',
      rewards: ['Crypto Master Badge', 'Cryptomon Pokemon', 'Encryption Skills']
    },
    {
      id: 'ai-ethics-council',
      title: 'AI Ethics Council',
      description: 'Form an ethics committee to discuss responsible AI development and usage!',
      concept: 'AI Ethics',
      teamSize: 5,
      difficulty: 'medium',
      rewards: ['Ethics Badge', 'AImon Pokemon', 'Ethical Reasoning']
    },

    // DAY 5 CHALLENGES - ATTACK & DEFENSE
    {
      id: 'phishing-hunters',
      title: 'Phishing Email Hunters',
      description: 'Protect your organization by identifying and analyzing sophisticated phishing attempts!',
      concept: 'Social Engineering Defense',
      teamSize: 3,
      difficulty: 'medium',
      rewards: ['Guardian Badge', 'Phishmon Pokemon', 'Threat Recognition']
    },
    {
      id: 'osint-investigators',
      title: 'OSINT Investigation Team',
      description: 'Use open source intelligence to solve cyber mysteries and find hidden information!',
      concept: 'Intelligence Gathering',
      teamSize: 4,
      difficulty: 'hard',
      rewards: ['Intelligence Badge', 'OSINTmon Pokemon', 'Research Skills']
    },
    {
      id: 'red-vs-blue-championship',
      title: 'Red Team vs Blue Team Championship',
      description: 'The ultimate showdown! Attack and defend in the most epic cybersecurity battle!',
      concept: 'Competitive Cybersecurity',
      teamSize: 6,
      difficulty: 'expert',
      rewards: ['Champion Badge', 'RedTeammon Pokemon', 'BlueTeammon Pokemon', 'Elite Status']
    },
    {
      id: 'incident-response-squad',
      title: 'Cyber Incident Response Squad',
      description: 'Lead your team through a realistic cyber attack simulation and coordinate the response!',
      concept: 'Incident Management',
      teamSize: 5,
      difficulty: 'expert',
      rewards: ['Response Leader Badge', 'CTFmon Pokemon', 'Leadership Skills']
    }
  ];

  // Load game state from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('pokemon-cyber-mmo-profile');
    const savedProgress = localStorage.getItem('pokemon-cyber-mmo-progress');
    
    if (savedProfile) {
      setPlayerProfile(JSON.parse(savedProfile));
      setGameState('world');
    }
    
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentDay(progress.currentDay || 1);
      setUnlockedDays(progress.unlockedDays || [1]);
      setCompletedTutorials(progress.completedTutorials || []);
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (playerProfile.name) {
      localStorage.setItem('pokemon-cyber-mmo-profile', JSON.stringify(playerProfile));
    }
  }, [playerProfile]);

  // Save day progression to localStorage
  useEffect(() => {
    const progress = { currentDay, unlockedDays, completedTutorials };
    localStorage.setItem('pokemon-cyber-mmo-progress', JSON.stringify(progress));
  }, [currentDay, unlockedDays, completedTutorials]);

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

  // Day progression system for GenCyber camp
  const progressToNextDay = () => {
    if (currentDay < 5) {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      setUnlockedDays(prev => [...prev, nextDay]);
      
      // Unlock areas for the new day
      const newAreasToUnlock = gameAreas.filter(area => {
        if (nextDay === 2) return ['network-harbor', 'switch-stadium', 'router-rapids', 'wifi-wilderness'].includes(area.id);
        if (nextDay === 3) return ['python-palace', 'turtle-temple', 'logic-labyrinth', 'phidget-factory'].includes(area.id);
        if (nextDay === 4) return ['virtual-valley', 'ai-academy', 'linux-laboratory', 'binary-battlefield', 'crypto-caverns'].includes(area.id);
        if (nextDay === 5) return ['attack-archipelago', 'defense-dojo', 'osint-observatory', 'red-vs-blue-arena', 'cyber-graduation'].includes(area.id);
        return false;
      });
      
      // Show day progression notification
      alert(`🎉 Welcome to Day ${nextDay} of GenCyber Camp! New areas and Pokemon await!`);
    }
  };

  // Check if player has completed enough challenges to progress to next day
  const canProgressToNextDay = () => {
    const completedChallenges = teamChallenges.filter(challenge => challenge.concept).length;
    const requiredChallenges = currentDay * 2; // Need 2 challenges per day minimum
    return completedChallenges >= requiredChallenges && currentDay < 5;
  };

  // Filter areas and challenges based on current day
  const availableAreas = gameAreas.filter(area => {
    if (currentDay === 1) return ['new-bark-cyber', 'career-canyon', 'hardware-heights', 'software-city', 'ethics-grove'].includes(area.id);
    if (currentDay === 2) return ['networking-nexus', 'packet-plaza', 'wifi-wonderland', 'firewall-forest'].includes(area.id);
    if (currentDay === 3) return ['python-peaks', 'turtle-town', 'phidget-plains', 'algorithm-academy'].includes(area.id);
    if (currentDay === 4) return ['vm-valley', 'linux-labs', 'ai-academy', 'crypto-caves'].includes(area.id);
    if (currentDay === 5) return ['attack-archipelago', 'defense-dojo', 'osint-observatory', 'red-vs-blue-arena', 'cyber-graduation'].includes(area.id);
    return true;
  });

  const availableChallenges = teamChallenges.filter(challenge => {
    if (currentDay === 1) return challenge.concept.includes('Day 1');
    if (currentDay === 2) return challenge.concept.includes('Day 2');
    if (currentDay === 3) return challenge.concept.includes('Day 3');
    if (currentDay === 4) return challenge.concept.includes('Day 4');
    if (currentDay === 5) return challenge.concept.includes('Day 5');
    return true;
  });

  // Knowledge Arena mode
  if (gameState === 'knowledge-arena') {
    return <KnowledgeArena />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Game content goes here */}
      <div className="p-4">
        <motion.button
          onClick={() => setGameState('knowledge-arena')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold mb-4"
          whileHover={{ scale: 1.05 }}
        >
          🧠 Enter Knowledge Arena
        </motion.button>
        
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-4">Pokemon Cyber MMO</h1>
          <p>Current state: {gameState}</p>
          <p>Day {currentDay} of GenCyber Camp</p>
        </div>
      </div>
    </div>
  );
};
