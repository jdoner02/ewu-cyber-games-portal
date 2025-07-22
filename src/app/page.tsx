'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  Zap, 
  Users, 
  Clock,
  TrendingUp,
  Settings,
  Play,
  Eye,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react'
import { Star, Trophy, Heart, Search, CheckCircle } from 'lucide-react'

import AICompanion from '@/components/AICompanion'
import UpdateNotification from '@/components/UpdateNotification'
import PatchNotes from '@/components/PatchNotes'
import useGameStore from '@/stores/gameStore'

interface GameData {
  id: string
  title: string
  description: string
  icon: string
  difficulty: string
  category: string
  estimatedTime: string
  rating: number
  plays: number
  lastPlayed: number | null
  isNew: boolean
  isFeatured: boolean
  isFinished: boolean
  gradient: string
  skillsLearned: string[]
}

export default function HomePage() {
  const { 
    playerStats, 
    achievements, 
    gameProgress, 
    updateStreak, 
    skillProgress,
    addXP
  } = useGameStore()
  
  const [favoriteGames, setFavoriteGames] = useState<string[]>([])
  const [recentGames, setRecentGames] = useState<string[]>([])
  const [newGames] = useState(['cyber-knowledge-brain', 'packet-tracer-mmo', 'phishing-detective', 'network-defense', 'encryption-escape', 'quantum-mystery-room', 'snake-knowledge-arena'])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPersonalizedView, setShowPersonalizedView] = useState(true)
  const [showPatchNotes, setShowPatchNotes] = useState(false)
  const [showUnfinishedGames, setShowUnfinishedGames] = useState(false)

  // 🎮 Game Data with Cookie Clicker-style tracking
  const allGames: GameData[] = [
    {
      id: 'password-fortress',
      title: 'Password Fortress',
      description: 'Escape a digital fortress by solving password puzzles',
      icon: '🏰',
      difficulty: 'Beginner',
      category: 'Passwords',
      estimatedTime: '10-15 min',
      rating: 4.8,
      plays: gameProgress.find((g: any) => g.gameId === 'password-fortress')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'password-fortress')?.timeSpent || null,
      isNew: false,
      isFeatured: true,
      isFinished: false,
      gradient: 'from-cyan-500 to-blue-600',
      skillsLearned: ['Password Security', 'Authentication']
    },
    {
      id: 'pokemon-cyber-mmo',
      title: 'Pokemon Cyber MMO',
      description: '🔥 NEW: Battle System! Embark on a Pokemon-style adventure with real-time multiplayer battles using Kahoot-style trivia! Challenge friends, answer cybersecurity questions, and master GenCyber concepts through competitive learning.',
      icon: '🐉',
      difficulty: 'Beginner',
      category: 'MMO',
      estimatedTime: '45+ min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'pokemon-cyber-mmo')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'pokemon-cyber-mmo')?.timeSpent || null,
      isNew: false,
      isFeatured: true,
      isFinished: true,
      gradient: 'from-purple-500 to-indigo-600',
      skillsLearned: ['Cyber Careers', 'Computer Basics', 'Team Building', 'Cyber Ethics', 'Monster Catching', 'Multiplayer Gaming', 'Battle Strategy', 'Trivia Mastery']
    },
    {
      id: 'cyber-knowledge-brain',
      title: 'Cyber Knowledge Brain Network',
      description: '🧠✨ RESTORED! Interactive knowledge visualization with weave silk mechanics! Watch your learning progress create beautiful patterns as you master cybersecurity concepts and build connections between ideas.',
      icon: '🧠',
      difficulty: 'All Levels',
      category: 'Visualization',
      estimatedTime: '15-30 min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'cyber-knowledge-brain')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'cyber-knowledge-brain')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: false,
      gradient: 'from-cyan-400 via-purple-500 to-pink-600',
      skillsLearned: ['Knowledge Visualization', 'Learning Progress Tracking', 'Concept Mapping', 'Network Security Fundamentals', 'GenCyber Curriculum']
    },
    {
      id: 'packet-tracer-mmo',
      title: 'CyberCity Heroes',
      description: '🦸 Superhero network configuration adventure with team-based challenges',
      icon: '🦸',
      difficulty: 'Intermediate',
      category: 'Networking',
      estimatedTime: '25-40 min',
      rating: 4.8,
      plays: gameProgress.find((g: any) => g.gameId === 'packet-tracer-mmo')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'packet-tracer-mmo')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: false,
      gradient: 'from-orange-500 to-red-600',
      skillsLearned: ['Network Config', 'Routing', 'Team Collaboration', 'Infrastructure Security']
    },
    {
      id: 'cyber-defense-simulator',
      title: 'Cyber Defense Simulator',
      description: 'Build your cyber defense empire by upgrading security systems',
      icon: '⚡',
      difficulty: 'All Levels',
      category: 'Strategy',
      estimatedTime: '15+ min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'cyber-defense-simulator')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'cyber-defense-simulator')?.timeSpent || null,
      isNew: false,
      isFeatured: false,
      isFinished: false,
      gradient: 'from-purple-500 to-pink-600',
      skillsLearned: ['Incident Response', 'Security Operations']
    },
    {
      id: 'cyber-clicker',
      title: 'Cyber Clicker',
      description: 'Build your cyber defense empire one click at a time! Learn cybersecurity fundamentals through compelling clicker gameplay that teaches real skills.',
      icon: '🖱️',
      difficulty: 'All Levels',
      category: 'Clicker',
      estimatedTime: '10+ min',
      rating: 4.8,
      plays: gameProgress.find((g: any) => g.gameId === 'cyber-clicker')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'cyber-clicker')?.timeSpent || null,
      isNew: false,
      isFeatured: true,
      isFinished: true,
      gradient: 'from-blue-500 to-purple-600',
      skillsLearned: ['Security Fundamentals', 'Resource Management', 'Incremental Strategy']
    },
    {
      id: 'cyber-clicker-classic',
      title: 'Cyber Clicker Classic',
      description: '📺 RETRO! The original cyber defense clicker experience! Simple, focused gameplay with basic upgrades and classic cybersecurity fundamentals.',
      icon: '🖱️',
      difficulty: 'All Levels',
      category: 'Classic',
      estimatedTime: '10+ min',
      rating: 4.6,
      plays: gameProgress.find((g: any) => g.gameId === 'cyber-clicker-classic')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'cyber-clicker-classic')?.timeSpent || null,
      isNew: false,
      isFeatured: false,
      isFinished: true,
      gradient: 'from-gray-500 to-slate-600',
      skillsLearned: ['Basic Security', 'Simple Upgrades', 'Classic Gameplay', 'Retro Experience']
    },
    {
      id: 'cybersilk',
      title: 'CyberFlow Silk',
      description: '🆕 ENHANCED! Create beautiful silk art while learning network protocols. Draw flowing patterns with WeavesilK.com-inspired mechanics and discover cybersecurity through creative expression.',
      icon: '✨',
      difficulty: 'Creative',
      category: 'Creative',
      estimatedTime: '20-45 min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'cybersilk')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'cybersilk')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: false,
      gradient: 'from-cyan-400 via-purple-500 to-pink-600',
      skillsLearned: ['Protocol Security', 'Network Visualization', 'Silk Drawing', 'Symmetry Patterns', 'Creative Cybersecurity']
    },
    {
      id: 'snake-knowledge-arena',
      title: 'Snake.io Knowledge Arena',
      description: '🆕 NEW! Multiplayer snake game where you consume cybersecurity knowledge to grow! Compete with other players while learning different cyber domains.',
      icon: '🐍',
      difficulty: 'All Levels',
      category: 'Multiplayer',
      estimatedTime: '10-20 min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'snake-knowledge-arena')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'snake-knowledge-arena')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: false,
      gradient: 'from-green-500 to-teal-600',
      skillsLearned: ['Knowledge Integration', 'Specialization Paths', 'Multiplayer Learning', 'Skill Building']
    },
    {
      id: 'cyber-knowledge-snake',
      title: 'Cyber Knowledge Snake Explorer',
      description: '🗺️ CLASSIC! Single-player snake adventure with fog-of-war exploration! Navigate themed cybersecurity regions, collect knowledge orbs, and unlock concepts through immersive gameplay.',
      icon: '🐍',
      difficulty: 'Beginner',
      category: 'Exploration',
      estimatedTime: '15-25 min',
      rating: 4.8,
      plays: gameProgress.find((g: any) => g.gameId === 'cyber-knowledge-snake')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'cyber-knowledge-snake')?.timeSpent || null,
      isNew: false,
      isFeatured: true,
      isFinished: true,
      gradient: 'from-emerald-500 to-green-600',
      skillsLearned: ['Security+ Fundamentals', 'Concept Exploration', 'Knowledge Mapping', 'Single Player Focus', 'Region Discovery']
    },
    {
      id: 'phishing-detective',
      title: 'Phishing Detective Agency',
      description: 'Master the art of spotting fake emails and social engineering attacks',
      icon: '🕵️',
      difficulty: 'Intermediate',
      category: 'Investigation',
      estimatedTime: '15-25 min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'phishing-detective')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'phishing-detective')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: true,
      gradient: 'from-red-500 to-orange-600',
      skillsLearned: ['Phishing Detection', 'Social Engineering', 'Email Security']
    },
    {
      id: 'network-defense',
      title: 'Network Defense Tower',
      description: 'Build the ultimate cyber fortress using strategic defense systems',
      icon: '🏰',
      difficulty: 'Advanced',
      category: 'Strategy',
      estimatedTime: '25-40 min',
      rating: 4.8,
      plays: gameProgress.find((g: any) => g.gameId === 'network-defense')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'network-defense')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: false,
      gradient: 'from-green-500 to-teal-600',
      skillsLearned: ['Network Security', 'Firewall Management', 'Threat Analysis']
    },
    {
      id: 'encryption-escape',
      title: 'Encryption Escape Room',
      description: 'Escape digital puzzles by mastering cryptography and cipher techniques',
      icon: '🔐',
      difficulty: 'Intermediate',
      category: 'Puzzles',
      estimatedTime: '20-35 min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'encryption-escape')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'encryption-escape')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: true,
      gradient: 'from-yellow-500 to-amber-600',
      skillsLearned: ['Cryptography', 'Data Protection', 'Mathematical Security']
    },
    {
      id: 'quantum-mystery-room',
      title: 'Dr. Quantum\'s Time-Lock Laboratory',
      description: '� ESCAPE ROOM! Experience a thrilling quantum physics escape room adventure! Learn wave-particle duality, entanglement, and quantum cryptography while solving Dr. Quantum\'s time-lock crisis.',
      icon: '⚛️',
      difficulty: 'Advanced',
      category: 'Escape Room',
      estimatedTime: '45-60 min',
      rating: 4.9,
      plays: gameProgress.find((g: any) => g.gameId === 'quantum-mystery-room')?.attempts || 0,
      lastPlayed: gameProgress.find((g: any) => g.gameId === 'quantum-mystery-room')?.timeSpent || null,
      isNew: true,
      isFeatured: true,
      isFinished: false,
      gradient: 'from-violet-500 via-purple-600 to-indigo-700',
      skillsLearned: ['Quantum Physics', 'Wave-Particle Duality', 'Quantum Entanglement', 'Quantum Cryptography', 'Temporal Mechanics', 'Problem Solving']
    }
  ]

  // 🔄 Cookie Clicker-style persistent interactions
  const toggleFavorite = (gameId: string) => {
    setFavoriteGames(prev => {
      const updated = prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
      
      // Save to persistent storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('ewu_cyber_favorite_games', JSON.stringify(updated))
      }
      
      // Add XP for interaction
      addXP(5)
      
      return updated
    })
  }

  const trackGameView = (gameId: string) => {
    if (typeof window === 'undefined') return
    
    // Track views like Cookie Clicker tracks clicks
    const viewKey = `ewu_cyber_game_views_${gameId}`
    const currentViews = parseInt(localStorage.getItem(viewKey) || '0')
    localStorage.setItem(viewKey, (currentViews + 1).toString())
    
    // Update recent games
    setRecentGames(prev => {
      const updated = [gameId, ...prev.filter(id => id !== gameId)].slice(0, 5)
      localStorage.setItem('ewu_cyber_recent_games', JSON.stringify(updated))
      return updated
    })
    
    addXP(2) // Small XP for engagement
  }

  // 📊 Personalized game recommendations
  const getPersonalizedGames = () => {
    const completedGames = gameProgress.filter((g: any) => g.completed).map((g: any) => g.gameId)
    const skillLevels = Object.entries(skillProgress)
    
    return allGames.map(game => ({
      ...game,
      personalizedScore: calculatePersonalizationScore(game, completedGames, skillLevels),
      isFavorite: favoriteGames.includes(game.id),
      viewCount: typeof window !== 'undefined' ? parseInt(localStorage.getItem(`ewu_cyber_game_views_${game.id}`) || '0') : 0
    })).sort((a, b) => b.personalizedScore - a.personalizedScore)
  }

  const calculatePersonalizationScore = (game: GameData, completedGames: string[], skillLevels: any[]) => {
    let score = 0
    
    // Boost new games
    if (game.isNew) score += 30
    
    // Boost favorites heavily
    if (favoriteGames.includes(game.id)) score += 50
    
    // Boost recently played
    if (recentGames.includes(game.id)) score += 20
    
    // Skill-based recommendations
    const avgSkillLevel = skillLevels.reduce((sum, [_, level]: [string, number]) => sum + level, 0) / skillLevels.length
    if (game.difficulty === 'Beginner' && avgSkillLevel < 30) score += 25
    if (game.difficulty === 'Intermediate' && avgSkillLevel >= 30 && avgSkillLevel < 70) score += 25
    if (game.difficulty === 'Advanced' && avgSkillLevel >= 70) score += 25
    
    // Boost unplayed games for variety
    if (!completedGames.includes(game.id)) score += 15
    
    return score
  }

  // 🔄 Load persisted data on mount
  useEffect(() => {
    updateStreak()
    
    if (typeof window !== 'undefined') {
      // Load favorites
      const savedFavorites = localStorage.getItem('ewu_cyber_favorite_games')
      if (savedFavorites) {
        setFavoriteGames(JSON.parse(savedFavorites))
      }
      
      // Load recent games
      const savedRecent = localStorage.getItem('ewu_cyber_recent_games')
      if (savedRecent) {
        setRecentGames(JSON.parse(savedRecent))
      }
    }
  }, [updateStreak])

  const personalizedGames = getPersonalizedGames()
  const featuredGames = personalizedGames.filter(game => game.isFeatured)
  const favoriteGamesList = personalizedGames.filter(game => game.isFavorite)
  const recentGamesList = personalizedGames.filter(game => recentGames.includes(game.id))

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        
        {/* Floating cyber elements */}
        <motion.div
          className="absolute top-1/4 left-1/3 text-cyan-400/30 text-xs font-mono"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          01001000
        </motion.div>
        <motion.div
          className="absolute top-3/4 right-1/4 text-purple-400/30 text-xs font-mono"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          SECURE
        </motion.div>
      </div>

      {/* Player Progress Header */}
      <section className="relative z-10 pt-8 pb-4 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-4 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                  {playerStats.level}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Level {playerStats.level} Cyber Hero</h2>
                  <p className="text-slate-400">{playerStats.totalXP} XP • {playerStats.gamesCompleted} games completed</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{playerStats.streakDays}</div>
                  <div className="text-xs text-slate-400">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{achievements.length}</div>
                  <div className="text-xs text-slate-400">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{Math.floor(playerStats.timeSpent / 60)}</div>
                  <div className="text-xs text-slate-400">Hours Played</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Section with Clear Student Entry Points */}
      <section className="relative z-10 py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Primary Hero - Clear Student Focus */}
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-cyan-400/30 mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 font-medium">🎮 12 Epic Cyber Adventures • 🛡️ Level Up Your Security Skills</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  EWU Cyber Games
                </span>
                <br />
                <span className="text-2xl md:text-3xl text-slate-300">Learn Cybersecurity Through Play</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {playerStats.gamesCompleted === 0 
                  ? "🎮 Jump into interactive cybersecurity adventures! Start with our beginner-friendly games or dive into advanced challenges. Every game teaches real cyber skills while having fun."
                  : `🏆 Amazing progress! You've completed ${playerStats.gamesCompleted} games. Ready to master new cybersecurity skills?`
                }
              </p>
            </div>

            {/* Quick Start for Returning Users */}
            {playerStats.gamesCompleted > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-slate-400 mb-4">🔥 Welcome back! Continue your cyber journey below ⬇️</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>


      {/* Category Filter */}
      <section className="relative z-10 px-4 mb-8">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['all', 'favorites', 'new', 'recent', 'completed'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'all' && <Target className="w-4 h-4 inline mr-2" />}
                {category === 'favorites' && <Heart className="w-4 h-4 inline mr-2" />}
                {category === 'new' && <Star className="w-4 h-4 inline mr-2" />}
                {category === 'recent' && <Clock className="w-4 h-4 inline mr-2" />}
                {category === 'completed' && <Trophy className="w-4 h-4 inline mr-2" />}
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {category === 'favorites' && favoriteGamesList.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {favoriteGamesList.length}
                  </span>
                )}
                {category === 'new' && newGames.length > 0 && (
                  <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {newGames.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Show Unfinished Games Toggle */}
          <div className="flex justify-center mb-8">
            <motion.button
              onClick={() => setShowUnfinishedGames(!showUnfinishedGames)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                showUnfinishedGames
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              {showUnfinishedGames ? 'Hide Unfinished Games' : 'Show Unfinished Games'}
              <span className="ml-2 bg-orange-500/20 text-orange-300 text-xs rounded-full px-2 py-1">
                Beta
              </span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Games Grid - Dynamic based on selected category */}
      <section className="relative z-10 py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedCategory === 'all' && "Recommended For You"}
              {selectedCategory === 'favorites' && `Your Favorite Games ${favoriteGamesList.length > 0 ? `(${favoriteGamesList.length})` : ''}`}
              {selectedCategory === 'new' && "New Adventures Await"}
              {selectedCategory === 'recent' && "Continue Your Journey"}
              {selectedCategory === 'completed' && "Your Achievements"}
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {selectedCategory === 'all' && "Games picked just for you based on your progress and interests"}
              {selectedCategory === 'favorites' && "Your most beloved cybersecurity adventures"}
              {selectedCategory === 'new' && "Fresh challenges to expand your skills"}
              {selectedCategory === 'recent' && "Pick up where you left off"}
              {selectedCategory === 'completed' && "Celebrate your cybersecurity victories"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              let gamesToShow = personalizedGames
              
              // Apply category filter
              if (selectedCategory === 'favorites') {
                gamesToShow = favoriteGamesList
              } else if (selectedCategory === 'new') {
                gamesToShow = personalizedGames.filter(game => game.isNew)
              } else if (selectedCategory === 'recent') {
                gamesToShow = recentGamesList
              } else if (selectedCategory === 'completed') {
                gamesToShow = personalizedGames.filter(game => 
                  gameProgress.some((g: any) => g.gameId === game.id && g.completed)
                )
              }
              
              // Apply finished/unfinished filter
              if (!showUnfinishedGames) {
                gamesToShow = gamesToShow.filter(game => game.isFinished)
              }

              if (gamesToShow.length === 0) {
                return (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🎮</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedCategory === 'favorites' && "No favorites yet!"}
                      {selectedCategory === 'recent' && "No recent games"}
                      {selectedCategory === 'completed' && "No completed games yet"}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {selectedCategory === 'favorites' && "Heart your favorite games to see them here"}
                      {selectedCategory === 'recent' && "Start playing to see your recent games"}
                      {selectedCategory === 'completed' && "Complete games to unlock achievements"}
                    </p>
                    <motion.button
                      onClick={() => setSelectedCategory('all')}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      Explore All Games
                    </motion.button>
                  </div>
                )
              }

              return gamesToShow.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link 
                    href={`/games/${game.id}` as const}
                    onClick={() => trackGameView(game.id)}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <div className={`h-48 bg-gradient-to-br ${game.gradient} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        
                        {/* Game Icon */}
                        <div className="absolute top-4 left-4 text-4xl">
                          {game.icon}
                        </div>
                        
                        {/* Favorite Button */}
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(game.id)
                          }}
                          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            game.isFavorite 
                              ? 'bg-red-500 text-white' 
                              : 'bg-black/30 text-white/70 hover:bg-black/50'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart className={`w-5 h-5 ${game.isFavorite ? 'fill-current' : ''}`} />
                        </motion.button>
                        
                        {/* New Badge */}
                        {game.isNew && (
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            NEW!
                          </div>
                        )}
                        
                        {/* Game Category */}
                        <div className="absolute bottom-4 right-4 text-white/80 text-sm font-mono uppercase">
                          {game.category}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{game.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-cyan-400 text-sm font-medium flex items-center">
                              <Star className="w-4 h-4 mr-1 fill-current" />
                              {game.rating}
                            </span>
                            <span className="text-purple-400 text-sm">{game.difficulty}</span>
                          </div>
                          <span className="text-slate-500 text-sm">{game.estimatedTime}</span>
                        </div>
                        
                        {/* Progress and Stats */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center">
                            <Play className="w-3 h-3 mr-1" />
                            {game.plays} plays
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {game.viewCount} views
                          </span>
                          {gameProgress.some((g: any) => g.gameId === game.id && g.completed) && (
                            <span className="flex items-center text-green-400">
                              <Trophy className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            })()}
          </div>
        </div>
      </section>

      {/* Advanced Cyber Hero Tools Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              🛡️ Advanced Cyber Hero Tools Lab
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              Master the same cybersecurity tools used by real cyber heroes worldwide! Learn through hands-on interaction with industry-standard security systems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Vulnerability Assessment Scanner */}
            <Link href="/security/vulnerability-assessment">
              <motion.div
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-red-400/30 hover:border-red-400/60 transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Vulnerability Scanner</h3>
                  <p className="text-slate-400 mb-4">
                    Discover security weaknesses like elite cyber detectives! Learn CVSS scoring and real vulnerability analysis techniques.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm">Security Pro</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Security Monitoring Dashboard */}
            <Link href="/security">
              <motion.div
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">SOC Dashboard</h3>
                  <p className="text-slate-400 mb-4">
                    Experience a real Security Operations Center. Monitor threats, analyze logs, and coordinate incident response.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">Real-time</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* STRIDE Threat Modeling */}
            <Link href="/security/threat-modeling">
              <motion.div
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">STRIDE Threat Modeler</h3>
                  <p className="text-slate-400 mb-4">
                    Think like a security architect. Analyze systems for threats using Microsoft's STRIDE methodology.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">Advanced</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Achievement Center Link */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/achievements">
              <motion.div
                className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl p-6 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">🏆 Achievement Center</h3>
                    <p className="text-cyan-100">Track your progress and unlock achievements as you master cybersecurity skills</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              💡 <strong>Educator Note:</strong> These tools demonstrate real cybersecurity workflows used by professionals at companies like Microsoft, Amazon, and government agencies. Students gain hands-on experience with industry-standard security practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Learning Pathways Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              📚 Structured Learning Pathways
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Master cybersecurity through carefully designed learning journeys that adapt to your skill level and career goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-green-400/30 hover:border-green-400/60 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-bold text-white mb-3">Beginner Explorer</h3>
              <p className="text-slate-400 mb-4 text-sm">Start with password security, phishing detection, and digital hygiene fundamentals.</p>
              <div className="text-green-400 text-sm font-medium">2-4 weeks • 4 modules</div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-violet-800 to-indigo-900 rounded-xl p-6 border border-violet-400/30 hover:border-violet-400/60 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-lg font-bold text-white mb-3">GenCyber Track</h3>
              <p className="text-slate-400 mb-4 text-sm">Explore our new enhanced games: Quantum Escape Room, Knowledge Brain, and Snake Arena!</p>
              <div className="text-violet-400 text-sm font-medium">5 days • Camp focused</div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-white mb-3">Digital Detective</h3>
              <p className="text-slate-400 mb-4 text-sm">Develop analytical thinking and advanced threat recognition capabilities.</p>
              <div className="text-blue-400 text-sm font-medium">4-8 weeks • 4 modules</div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-white mb-3">Cyber Guardian</h3>
              <p className="text-slate-400 mb-4 text-sm">Master advanced concepts and develop cybersecurity leadership skills.</p>
              <div className="text-purple-400 text-sm font-medium">Ongoing • 4 modules</div>
            </motion.div>
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/learning">
              <motion.div
                className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl p-6 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">📚 Start Your Learning Journey</h3>
                    <p className="text-cyan-100">Choose your path and master cybersecurity step by step</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Educational Excellence */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">🎓 Educational Excellence by Design</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform follows proven educational principles with robust security measures and comprehensive progress tracking. 
              Every game is designed with clear learning objectives and real-world cybersecurity applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">🎮 Play & Learn</h3>
              <p className="text-slate-400">
                Engage with expertly crafted games that teach real cybersecurity concepts through interactive experiences and exciting challenges!
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">📊 Track Progress</h3>
              <p className="text-slate-400">
                Comprehensive progress tracking with detailed analytics, skill assessments, and personalized learning recommendations.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">🔒 Stay Safe</h3>
              <p className="text-slate-400">
                COPPA-compliant platform with robust privacy protections and age-appropriate content for all learners.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">🏆 Earn Recognition</h3>
              <p className="text-slate-400">
                Build a portfolio of cybersecurity skills with achievements, certificates, and detailed progress reports.
              </p>
            </motion.div>
          </div>

          {/* Educational Standards Alignment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-indigo-400/20 p-6"
          >
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">📚 Aligned with Educational Standards</h3>
              <p className="text-slate-300">Our curriculum meets rigorous academic and industry standards</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400">NSA GenCyber</div>
                <div className="text-xs text-slate-400">Program Aligned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">AP Cybersecurity</div>
                <div className="text-xs text-slate-400">Standards Ready</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">COPPA Compliant</div>
                <div className="text-xs text-slate-400">Privacy Protected</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">Open Source</div>
                <div className="text-xs text-slate-400">Community Driven</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AICompanion />

      {/* Patch Notes Modal */}
      <PatchNotes 
        isOpen={showPatchNotes} 
        onClose={() => setShowPatchNotes(false)} 
      />

      {/* Floating Patch Notes Button */}
      <motion.div
        className="fixed bottom-4 right-20 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          onClick={() => setShowPatchNotes(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg border border-purple-400/30 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="View Patch Notes v1.3.0"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-bold">v1.3.0</span>
          </div>
        </motion.button>
      </motion.div>

      <UpdateNotification 
        version="1.2.0"
        features={[
          "🐉 Pokemon Cyber MMO - Embark on a GenCyber Day 1 adventure! Learn cyber careers, computer basics, and teamwork!",
          "🦸 CyberCity Heroes - Superhero network defense adventures!",
          "💾 Smart Progress Tracking - Your journey remembers everything!"
        ]}
      />
    </main>
  )
}
