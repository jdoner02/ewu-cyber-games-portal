'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  GamepadIcon, 
  Trophy, 
  Brain, 
  Zap, 
  Star,
  Target,
  Clock,
  Users,
  Gift,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import useGameStore from '@/stores/gameStore'
import AICompanion from '@/components/AICompanion'

// Daily challenges that rotate
const DAILY_CHALLENGES = [
  {
    id: 'password-master',
    title: '🔐 Password Master',
    description: 'Create 5 strong passwords in Password Fortress',
    reward: 100,
    progress: 0,
    max: 5,
    type: 'daily'
  },
  {
    id: 'phishing-detector',
    title: '🎣 Phishing Hunter', 
    description: 'Identify 10 phishing attempts correctly',
    reward: 150,
    progress: 0,
    max: 10,
    type: 'daily'
  },
  {
    id: 'cyber-clicker',
    title: '⚡ Cyber Clicker Champion',
    description: 'Earn 1000 security points in Cyber Clicker',
    reward: 200,
    progress: 0,
    max: 1000,
    type: 'daily'
  }
]

// Featured games with engagement stats
const FEATURED_GAMES = [
  {
    id: 'password-fortress',
    title: 'Password Fortress',
    description: 'Escape room adventure teaching password security',
    difficulty: 'Beginner',
    duration: '10-15 min',
    players: '12.4k playing',
    rating: 4.8,
    image: '/games/password-fortress.png',
    tags: ['Escape Room', 'Passwords', 'Adventure'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'cyber-clicker',
    title: 'Cyber Clicker Empire',
    description: 'Build your cybersecurity empire one click at a time!',
    difficulty: 'Easy',
    duration: 'Endless',
    players: '8.7k playing',
    rating: 4.9,
    image: '/games/cyber-clicker.png',
    tags: ['Clicker', 'Idle', 'Strategy'],
    color: 'from-green-500 to-teal-600',
    hot: true
  },
  {
    id: 'phishing-detective',
    title: 'Phishing Detective',
    description: 'Spot fake emails and protect innocent users!',
    difficulty: 'Medium',
    duration: '5-20 min',
    players: '6.2k playing',
    rating: 4.7,
    image: '/games/phishing-detective.png',
    tags: ['Detective', 'Email', 'Critical Thinking'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'network-defense',
    title: 'Network Defense Tower',
    description: 'Defend your network from waves of cyber attacks!',
    difficulty: 'Hard',
    duration: '15-30 min',
    players: '4.1k playing', 
    rating: 4.6,
    image: '/games/network-defense.png',
    tags: ['Tower Defense', 'Strategy', 'Real-time'],
    color: 'from-purple-500 to-pink-600'
  }
]

export default function HomePage() {
  const { 
    playerStats, 
    updateStreak
  } = useGameStore()
  
  const [dailyChallenges, setDailyChallenges] = useState(DAILY_CHALLENGES)
  const [onlineCount, setOnlineCount] = useState(2847)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)

  useEffect(() => {
    // Update streak on page load
    updateStreak()
    
    // Check if returning user
    const lastVisit = localStorage.getItem('lastVisit')
    if (lastVisit) {
      const hoursSince = (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60)
      if (hoursSince > 4) {
        setShowWelcomeBack(true)
        setTimeout(() => setShowWelcomeBack(false), 5000)
      }
    }
    localStorage.setItem('lastVisit', Date.now().toString())

    // Simulate online user count updates
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 20 - 10))
    }, 30000)

    return () => clearInterval(interval)
  }, [updateStreak])

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Dynamic background with floating cyber elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              ['bg-cyan-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400'][i % 4]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Welcome Back Notification */}
      {showWelcomeBack && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            <div>
              <p className="font-bold">Welcome back, Cyber Hero!</p>
              <p className="text-sm opacity-90">You've earned 50 bonus XP for returning!</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section with Stats */}
      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          {/* Live Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-6 mb-8 text-sm text-slate-400"
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>{onlineCount.toLocaleString()} players online</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>Level {playerStats.level}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{playerStats.totalXP.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{playerStats.streakDays} day streak</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-cyan-400/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 font-medium">EWU Cybersecurity Program</span>
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cyber Games
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-slate-300">Arcade</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Level up your <span className="text-cyan-400 font-semibold">cybersecurity skills</span> through 
              addictive games that make learning feel like playing!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center gap-2">
                  <GamepadIcon className="w-5 h-5" />
                  Play Now - It's Free!
                </div>
              </motion.button>

              <motion.button
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('daily-challenges')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Today's Challenges
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Daily Challenges Section */}
      <section id="daily-challenges" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <Clock className="inline w-8 h-8 mr-2 text-yellow-400" />
              Daily Challenges
            </h2>
            <p className="text-slate-300 text-lg">Complete today's challenges for bonus rewards!</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {dailyChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    +{challenge.reward} XP
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-4">{challenge.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-cyan-400">{challenge.progress}/{challenge.max}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / challenge.max) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games Grid */}
      <section id="games" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <GamepadIcon className="inline w-8 h-8 mr-2 text-purple-400" />
              Featured Games
            </h2>
            <p className="text-slate-300 text-lg">Master cybersecurity through fun, addictive gameplay</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {FEATURED_GAMES.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/games/${game.id}` as any}>
                  <div className={`bg-gradient-to-br ${game.color} p-1 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <div className="bg-slate-900 rounded-lg p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {game.title}
                            </h3>
                            {game.hot && (
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                                HOT
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mb-3">{game.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {game.tags.map(tag => (
                          <span key={tag} className="bg-slate-800 text-cyan-400 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{game.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{game.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{game.players}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{game.rating}</span>
                        </div>
                      </div>

                      <motion.button
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Play Now
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <TrendingUp className="inline w-8 h-8 mr-2 text-green-400" />
              Your Cyber Journey
            </h2>
            <p className="text-slate-300 text-lg">Track your progress and unlock new challenges</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Level', value: playerStats.level, icon: Trophy, color: 'text-yellow-400' },
              { label: 'Total XP', value: playerStats.totalXP.toLocaleString(), icon: Star, color: 'text-purple-400' },
              { label: 'Games Completed', value: playerStats.gamesCompleted, icon: GamepadIcon, color: 'text-cyan-400' },
              { label: 'Day Streak', value: playerStats.streakDays, icon: Zap, color: 'text-green-400' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Companion */}
      <AICompanion />
    </main>
  )
}
