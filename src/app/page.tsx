'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Gamepad2, Trophy, Brain, Zap } from 'lucide-react'
import Link from 'next/link'
import useGameStore from '@/stores/gameStore'
import AICompanion from '@/components/AICompanion'

export default function HomePage() {
  const { updateStreak } = useGameStore()

  useEffect(() => {
    // Update streak on page load
    updateStreak()
  }, [updateStreak])

  return (
    <main className="min-h-screen relative overflow-x-hidden">
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

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
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
              <span className="text-3xl md:text-4xl text-slate-300">Portal</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Become a <span className="text-cyan-400 font-semibold">cybersecurity hero</span> through 
              addictive games that teach you to protect the digital world while having a blast!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Start Playing Now
                </div>
              </motion.button>

              <motion.button
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </motion.button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-cyan-400/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Trophy className="w-8 h-8 text-yellow-400 mb-3 mx-auto" />
                <h3 className="text-lg font-bold text-white mb-2">No Login Required</h3>
                <p className="text-slate-400 text-sm">Jump straight into the action! Your progress saves automatically.</p>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-400/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Brain className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                <h3 className="text-lg font-bold text-white mb-2">Learn by Playing</h3>
                <p className="text-slate-400 text-sm">Master cybersecurity concepts through addictive gameplay.</p>
              </motion.div>

              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-green-400/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Zap className="w-8 h-8 text-green-400 mb-3 mx-auto" />
                <h3 className="text-lg font-bold text-white mb-2">AI Companion</h3>
                <p className="text-slate-400 text-sm">Swoop Bot helps you learn and provides hints when you&apos;re stuck.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Adventure</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Every game teaches real cybersecurity skills while keeping you engaged and entertained
            </p>
          </motion.div>

          {/* Featured Games Grid - CrazyGames Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Password Fortress */}
            <Link href="/games/password-fortress">
              <motion.div
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-4 right-4 text-white/80 text-sm font-mono">ESCAPE ROOM</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Password Fortress</h3>
                  <p className="text-slate-400 text-sm mb-4">Escape a digital fortress by solving password puzzles and learning security best practices</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 text-sm font-medium">⭐ 4.8 Rating</span>
                    <span className="text-purple-400 text-sm">🎯 Beginner</span>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Cyber Defense Simulator */}
            <Link href="/games/cyber-defense-simulator">
              <motion.div
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-4 right-4 text-white/80 text-sm font-mono">CLICKER</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Cyber Defense Simulator</h3>
                  <p className="text-slate-400 text-sm mb-4">Build your cyber defense empire by clicking to upgrade firewalls and security systems</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 text-sm font-medium">⭐ 4.9 Rating</span>
                    <span className="text-green-400 text-sm">🎯 All Levels</span>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Network Maze */}
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-green-400/30 hover:border-green-400/60 transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="absolute top-4 left-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-4 right-4 text-white/80 text-sm font-mono">PUZZLE</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Network Maze</h3>
                <p className="text-slate-400 text-sm mb-4">Navigate through network topologies while learning about routing and network security</p>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium">⭐ 4.7 Rating</span>
                  <span className="text-yellow-400 text-sm">🎯 Intermediate</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Learn cybersecurity through games designed to be as engaging as your favorite mobile apps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Choose a Game</h3>
              <p className="text-slate-400 text-sm">Pick from escape rooms, puzzles, clickers, and more</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Play & Learn</h3>
              <p className="text-slate-400 text-sm">Have fun while absorbing cybersecurity concepts naturally</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Level Up</h3>
              <p className="text-slate-400 text-sm">Earn XP, unlock achievements, and track your progress</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Become a Hero</h3>
              <p className="text-slate-400 text-sm">Master cybersecurity skills to protect the digital world</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* AI Companion */}
      <AICompanion />
    </main>
  )
}
