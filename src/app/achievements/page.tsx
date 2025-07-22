'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Shield, 
  Target,
  Zap,
  Lock,
  Calendar,
  TrendingUp,
  BarChart3,
  Users,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import useGameStore from '@/stores/gameStore'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'security' | 'gaming' | 'learning' | 'special'
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum'
  unlocked: boolean
  progress: number
  requirement: number
  unlockedDate?: string
  xpReward: number
}

export default function AchievementsPage() {
  const { playerStats, gameProgress, skillProgress } = useGameStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [achievements, setAchievements] = useState<Achievement[]>([])

  // Initialize achievements based on player progress
  useEffect(() => {
    const baseAchievements: Achievement[] = [
      // Security Category
      {
        id: 'password_master',
        title: 'Password Master',
        description: 'Complete all 4 rooms in Password Fortress',
        icon: '🔐',
        category: 'security',
        difficulty: 'gold',
        unlocked: gameProgress.some(g => g.gameId === 'password-fortress' && g.completed),
        progress: gameProgress.find(g => g.gameId === 'password-fortress')?.timeSpent || 0,
        requirement: 100,
        xpReward: 500
      },
      {
        id: 'vulnerability_scanner',
        title: 'Security Scanner',
        description: 'Complete 10 vulnerability assessments',
        icon: '🔍',
        category: 'security', 
        difficulty: 'silver',
        unlocked: false,
        progress: 0,
        requirement: 10,
        xpReward: 300
      },
      {
        id: 'threat_modeler',
        title: 'Threat Analyst',
        description: 'Create 5 STRIDE threat models',
        icon: '🎯',
        category: 'security',
        difficulty: 'gold',
        unlocked: false,
        progress: 0,
        requirement: 5,
        xpReward: 400
      },
      {
        id: 'soc_analyst',
        title: 'SOC Operator',
        description: 'Monitor security dashboard for 30 minutes',
        icon: '🚨',
        category: 'security',
        difficulty: 'silver',
        unlocked: false,
        progress: 0,
        requirement: 30,
        xpReward: 250
      },

      // Gaming Category
      {
        id: 'first_game',
        title: 'First Steps',
        description: 'Complete your first cybersecurity game',
        icon: '🎮',
        category: 'gaming',
        difficulty: 'bronze',
        unlocked: playerStats.gamesCompleted > 0,
        progress: Math.min(playerStats.gamesCompleted, 1),
        requirement: 1,
        xpReward: 100
      },
      {
        id: 'game_collector',
        title: 'Game Collector',
        description: 'Try all available games',
        icon: '🏆',
        category: 'gaming',
        difficulty: 'gold',
        unlocked: playerStats.gamesCompleted >= 6,
        progress: playerStats.gamesCompleted,
        requirement: 6,
        xpReward: 600
      },
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'gaming',
        difficulty: 'silver',
        unlocked: false,
        progress: 0,
        requirement: 7,
        xpReward: 350
      },

      // Learning Category
      {
        id: 'level_10',
        title: 'Cyber Expert',
        description: 'Reach level 10',
        icon: '⭐',
        category: 'learning',
        difficulty: 'gold',
        unlocked: playerStats.level >= 10,
        progress: playerStats.level,
        requirement: 10,
        xpReward: 500
      },
      {
        id: 'xp_master',
        title: 'Experience Collector',
        description: 'Earn 5000 total XP',
        icon: '💎',
        category: 'learning',
        difficulty: 'platinum',
        unlocked: playerStats.totalXP >= 5000,
        progress: playerStats.totalXP,
        requirement: 5000,
        xpReward: 1000
      },
      {
        id: 'skill_specialist',
        title: 'Security Specialist',
        description: 'Max out any security skill',
        icon: '🎓',
        category: 'learning',
        difficulty: 'gold',
        unlocked: Object.values(skillProgress).some(level => level >= 100),
        progress: Math.max(...Object.values(skillProgress)),
        requirement: 100,
        xpReward: 400
      },

      // Special Category
      {
        id: 'early_adopter',
        title: 'Early Adopter',
        description: 'Welcome to EWU Cyber Games Portal!',
        icon: '🚀',
        category: 'special',
        difficulty: 'bronze',
        unlocked: true,
        progress: 1,
        requirement: 1,
        unlockedDate: new Date().toLocaleDateString(),
        xpReward: 50
      }
    ]

    setAchievements(baseAchievements)
  }, [playerStats, gameProgress, skillProgress])

  const categories = [
    { id: 'all', label: 'All Achievements', icon: CheckCircle },
    { id: 'security', label: 'Security Expert', icon: Shield },
    { id: 'gaming', label: 'Game Master', icon: Target },
    { id: 'learning', label: 'Learning Pro', icon: TrendingUp },
    { id: 'special', label: 'Special', icon: Zap }
  ]

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'from-orange-600 to-orange-800'
      case 'silver': return 'from-gray-400 to-gray-600'
      case 'gold': return 'from-yellow-400 to-yellow-600'
      case 'platinum': return 'from-purple-400 to-purple-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            🏆 Achievement Center
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            Track your cybersecurity learning journey and unlock achievements as you master new skills
          </p>
          
          {/* Progress Overview */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{unlockedCount}/{totalCount}</div>
                <div className="text-slate-400">Achievements Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{completionPercentage}%</div>
                <div className="text-slate-400">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{playerStats.totalXP}</div>
                <div className="text-slate-400">Total XP Earned</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-4 h-4" />
                {category.label}
              </motion.button>
            )
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`relative rounded-xl p-6 border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-400/50 shadow-lg'
                    : 'bg-slate-800/30 border-slate-600/30 opacity-75'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                {/* Difficulty Badge */}
                <div className={`absolute top-3 right-3 bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} text-white text-xs px-2 py-1 rounded-full font-bold uppercase`}>
                  {achievement.difficulty}
                </div>

                {/* Achievement Icon and Title */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className={`text-xl font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    {achievement.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.requirement}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-cyan-400 to-purple-500' 
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Reward and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">+{achievement.xpReward} XP</span>
                  </div>
                  {achievement.unlocked && (
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Unlocked</span>
                    </div>
                  )}
                </div>

                {/* Unlock Date */}
                {achievement.unlocked && achievement.unlockedDate && (
                  <div className="mt-3 text-xs text-slate-500 text-center">
                    Unlocked on {achievement.unlockedDate}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Back to Games Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/">
            <motion.button
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Back to Games
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
