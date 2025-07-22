'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Server, Wifi, Lock, Unlock, AlertTriangle, CheckCircle } from 'lucide-react'

interface ClickUpgrade {
  id: string
  name: string
  cost: number
  multiplier: number
  owned: number
  icon: React.ComponentType<{ size?: number }>
  description: string
}

export default function CyberClickerGame() {
  // --- ENHANCED PERSISTENCE: LOAD & SAVE STATE ---
  interface SaveState {
    score: number
    clickPower: number
    autoClickRate: number
    level: number
    exp: number
    upgradeStates: Record<string, ClickUpgrade>
  }

  const STORAGE_KEY = 'CyberClickerClassicSave'

  const [upgrades] = useState<ClickUpgrade[]>([
    {
      id: 'firewall',
      name: 'Firewall',
      cost: 10,
      multiplier: 1.2,
      owned: 0,
      icon: Shield,
      description: 'Basic network protection (+1.2x click power)'
    },
    {
      id: 'antivirus',
      name: 'Antivirus',
      cost: 50,
      multiplier: 2,
      owned: 0,
      icon: Zap,
      description: 'Advanced malware detection (+2x click power)'
    },
    {
      id: 'encryption',
      name: 'Encryption',
      cost: 200,
      multiplier: 3,
      owned: 0,
      icon: Lock,
      description: 'Military-grade encryption (+3x click power)'
    },
    {
      id: 'ai-defender',
      name: 'AI Defender',
      cost: 1000,
      multiplier: 5,
      owned: 0,
      icon: Server,
      description: 'AI-powered security system (+5x click power)'
    },
    {
      id: 'quantum-shield',
      name: 'Quantum Shield',
      cost: 5000,
      multiplier: 10,
      owned: 0,
      icon: Wifi,
      description: 'Quantum-encrypted protection (+10x click power)'
    }
  ])

  function loadState(): SaveState {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (json) {
        const saved = JSON.parse(json)
        // Ensure all required fields exist with proper defaults
        return {
          score: saved.score || 0,
          clickPower: saved.clickPower || 1,
          autoClickRate: saved.autoClickRate || 0,
          level: saved.level || 1,
          exp: saved.exp || 0,
          upgradeStates: saved.upgradeStates || upgrades.reduce((acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }), {})
        }
      }
    } catch {
      /* ignore errors */
    }
    // Defaults
    return {
      score: 0,
      clickPower: 1,
      autoClickRate: 0,
      level: 1,
      exp: 0,
      upgradeStates: upgrades.reduce((acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }), {})
    }
  }

  const [score, setScore] = useState(() => loadState().score)
  const [clickPower, setClickPower] = useState(() => loadState().clickPower)
  const [autoClickRate, setAutoClickRate] = useState(() => loadState().autoClickRate)
  const [level, setLevel] = useState(() => loadState().level)
  const [exp, setExp] = useState(() => loadState().exp)
  const [clickAnimation, setClickAnimation] = useState(false)
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'upgrade' | 'level'}>>([])

  const [upgradeStates, setUpgradeStates] = useState<Record<string, ClickUpgrade>>(() => {
    const loaded = loadState()
    // Ensure all upgrades exist in the state, merge with defaults if missing
    const defaultStates = upgrades.reduce((acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }), {})
    return { ...defaultStates, ...loaded.upgradeStates }
  })

  // Save state to localStorage whenever key values change
  useEffect(() => {
    try {
      const save: SaveState = {
        score,
        clickPower,
        autoClickRate,
        level,
        exp,
        upgradeStates
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
    } catch (error) {
      // Handle localStorage errors gracefully (quota exceeded, etc.)
      console.warn('Failed to save game state:', error)
    }
  }, [score, clickPower, autoClickRate, level, exp, upgradeStates])

  // Auto-clicking effect
  useEffect(() => {
    if (autoClickRate > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + autoClickRate)
        setExp(prev => prev + autoClickRate * 0.1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoClickRate])

  // Level up calculation
  useEffect(() => {
    const expRequired = level * 100
    if (exp >= expRequired) {
      setLevel(prev => prev + 1)
      setExp(prev => prev - expRequired)
      setClickPower(prev => prev + 1)
      showNotification(`Level Up! Now Level ${level + 1}`, 'level')
    }
  }, [exp, level])

  const handleClick = useCallback(() => {
    const points = clickPower
    setScore(prev => prev + points)
    setExp(prev => prev + points * 0.1)
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 200)
  }, [clickPower])

  const showNotification = (message: string, type: 'success' | 'upgrade' | 'level') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgradeStates[upgradeId]
    const cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.owned))
    
    if (score >= cost) {
      setScore(prev => prev - cost)
      setUpgradeStates(prev => ({
        ...prev,
        [upgradeId]: {
          ...prev[upgradeId],
          owned: prev[upgradeId].owned + 1
        }
      }))
      
      // Update click power or auto-click rate
      if (upgradeId === 'firewall' || upgradeId === 'antivirus') {
        setClickPower(prev => prev + upgrade.multiplier)
      } else {
        setAutoClickRate(prev => prev + upgrade.multiplier)
      }
      
      showNotification(`Purchased ${upgrade.name}!`, 'upgrade')
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M' 
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return Math.floor(num).toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cyber Clicker
          </h1>
          <p className="text-lg text-gray-300">
            Build your cyber defense empire one click at a time!
          </p>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
                notification.type === 'level' ? 'bg-purple-600' :
                notification.type === 'upgrade' ? 'bg-green-600' :
                'bg-blue-600'
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Clicker Area */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{formatNumber(score)}</div>
                <div className="text-sm text-gray-400">Security Points</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{clickPower}</div>
                <div className="text-sm text-gray-400">Click Power</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{level}</div>
                <div className="text-sm text-gray-400">Level</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{formatNumber(autoClickRate)}/s</div>
                <div className="text-sm text-gray-400">Auto Defense</div>
              </div>
            </div>

            {/* EXP Bar */}
            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Level {level}</span>
                <span>{Math.floor(exp)}/{level * 100} EXP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(exp / (level * 100)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Main Clicker Button */}
            <div className="flex justify-center mb-6">
              <motion.button
                onClick={handleClick}
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={clickAnimation ? { scale: [1, 1.1, 1] } : {}}
              >
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Pulse effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    animate={clickAnimation ? { scale: [1, 1.5], opacity: [1, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <Shield size={80} className="text-white drop-shadow-lg" />
                  
                  {/* Click value indicator */}
                  <AnimatePresence>
                    {clickAnimation && (
                      <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -50 }}
                        exit={{ opacity: 0 }}
                        className="absolute text-2xl font-bold text-yellow-300"
                      >
                        +{clickPower}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="text-center mt-4">
                  <div className="text-lg font-bold">Cyber Defense Core</div>
                  <div className="text-sm text-gray-400">Click to strengthen defenses!</div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Upgrades Panel */}
          <div className="bg-black/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Security Upgrades</h2>
            
            <div className="space-y-4">
              {Object.values(upgradeStates).map((upgrade) => {
                const cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.owned))
                const canAfford = score >= cost
                const IconComponent = upgrade.icon
                
                return (
                  <motion.div
                    key={upgrade.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      canAfford 
                        ? 'border-green-500 bg-green-500/10 cursor-pointer' 
                        : 'border-gray-600 bg-gray-600/10 cursor-not-allowed opacity-60'
                    }`}
                    onClick={() => canAfford && buyUpgrade(upgrade.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-blue-400">
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{upgrade.name}</div>
                        <div className="text-sm text-gray-400">Owned: {upgrade.owned}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-400">{formatNumber(cost)}</div>
                        <div className="text-xs text-gray-400">SP</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">{upgrade.description}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Achievement Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Achievements</h3>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 p-2 rounded ${score >= 100 ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                  {score >= 100 ? <CheckCircle size={16} /> : <Lock size={16} />}
                  First Defense (100 SP)
                </div>
                <div className={`flex items-center gap-2 p-2 rounded ${score >= 1000 ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                  {score >= 1000 ? <CheckCircle size={16} /> : <Lock size={16} />}
                  Security Expert (1K SP)
                </div>
                <div className={`flex items-center gap-2 p-2 rounded ${level >= 10 ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                  {level >= 10 ? <CheckCircle size={16} /> : <Lock size={16} />}
                  Level 10 Defender
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 rounded-lg p-6 mt-8"
        >
          <h3 className="text-xl font-bold mb-4">Learning Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-blue-400 mb-2">Cybersecurity Fundamentals</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Understand layered security defense</li>
                <li>• Learn about different security tools</li>
                <li>• Explore automation in cybersecurity</li>
                <li>• Discover resource management principles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-purple-400 mb-2">Game Mechanics as Learning</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Incremental improvement mirrors security hardening</li>
                <li>• Upgrades represent real security investments</li>
                <li>• Auto-defense simulates automated security tools</li>
                <li>• Level progression shows skill development</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
