'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Zap,
  Server,
  Wifi,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { GameStatePersistenceManager } from '@/utils/persistence/GameStatePersistence'

interface ClickUpgrade {
  id: string
  name: string
  cost: number
  multiplier: number
  owned: number
  icon: React.ComponentType<{ size?: number }>
  description: string
}

export default function CyberClickerGameClassic() {
  // --- ENHANCED ENTERPRISE PERSISTENCE: LOAD & SAVE STATE ---
  interface CyberClickerSaveState {
    score: number
    clickPower: number
    autoClickRate: number
    level: number
    exp: number
    upgradeStates: Record<string, ClickUpgrade>
    sessionId: string
    lastSave: string
  }

  // Initialize persistence manager with robust error handling
  const [persistenceManager] = useState(() => {
    try {
      const manager = new GameStatePersistenceManager()
      // Verify the manager has required methods
      if (manager && typeof manager.loadGameState === 'function' && typeof manager.saveGameState === 'function') {
        return manager
      } else {
        throw new Error('GameStatePersistenceManager does not have required methods')
      }
    } catch (error) {
      console.warn('Failed to initialize GameStatePersistenceManager, using fallback:', error)
      // Return a robust fallback object with the expected interface
      return {
        loadGameState: async () => ({ gameState: null, error: null, metrics: null }),
        saveGameState: async () => ({ success: true, error: null, metrics: null }),
        // Ensure we have the proper type signature to pass runtime checks
        __isFallback: true
      }
    }
  })
  const GAME_KEY = 'cyber_clicker_classic'

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

  function loadState(): CyberClickerSaveState {
    try {
      const json = localStorage.getItem('CyberClickerClassicSave')
      if (json) {
        const saved = JSON.parse(json)
        
        // Robust data validation to prevent React error #130
        // Ensure all numeric values are actual numbers, not objects
        const safeScore = typeof saved.score === 'number' ? saved.score : 
                         (typeof saved.score === 'object' && saved.score?.value) ? Number(saved.score.value) : 0
        const safeClickPower = typeof saved.clickPower === 'number' ? saved.clickPower :
                              (typeof saved.clickPower === 'object' && saved.clickPower?.current) ? Number(saved.clickPower.current) : 1
        const safeAutoClickRate = typeof saved.autoClickRate === 'number' ? saved.autoClickRate :
                                  (typeof saved.autoClickRate === 'object' && saved.autoClickRate?.rate) ? Number(saved.autoClickRate.rate) : 0
        const safeLevel = typeof saved.level === 'number' ? saved.level :
                         (typeof saved.level === 'object' && saved.level?.current) ? Number(saved.level.current) : 1
        const safeExp = typeof saved.exp === 'number' ? saved.exp :
                       (typeof saved.exp === 'object' && saved.exp?.points) ? Number(saved.exp.points) : 0
        
        // Validate and sanitize upgradeStates
        let safeUpgradeStates: Record<string, ClickUpgrade> = upgrades.reduce(
          (acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }),
          {} as Record<string, ClickUpgrade>
        )
        
        if (saved.upgradeStates && typeof saved.upgradeStates === 'object') {
          Object.keys(saved.upgradeStates).forEach(key => {
            const savedUpgrade = saved.upgradeStates[key]
            if (savedUpgrade && typeof savedUpgrade === 'object') {
              // Ensure the owned count is a number, not an object
              const safeOwned = typeof savedUpgrade.owned === 'number' ? savedUpgrade.owned :
                               (typeof savedUpgrade.owned === 'object' && savedUpgrade.owned?.count) ? Number(savedUpgrade.owned.count) : 0
              
              if (safeUpgradeStates[key]) {
                safeUpgradeStates[key] = {
                  ...safeUpgradeStates[key],
                  owned: safeOwned
                }
              }
            }
          })
        }
        
        return {
          score: safeScore,
          clickPower: safeClickPower,
          autoClickRate: safeAutoClickRate,
          level: safeLevel,
          exp: safeExp,
          upgradeStates: safeUpgradeStates,
          sessionId: typeof saved.sessionId === 'string' ? saved.sessionId : `cyber_clicker_${Date.now()}`,
          lastSave: typeof saved.lastSave === 'string' ? saved.lastSave : new Date().toISOString()
        }
      }
    } catch (error) {
      // Log error for debugging but don't throw - gracefully handle corrupted data
      console.warn('Failed to parse saved game data, using defaults:', error)
    }
    
    // Return safe default state
    return {
      score: 0,
      clickPower: 1,
      autoClickRate: 0,
      level: 1,
      exp: 0,
      upgradeStates: upgrades.reduce(
        (acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }),
        {}
      ),
      sessionId: `cyber_clicker_${Date.now()}`,
      lastSave: new Date().toISOString()
    }
  }

  const [score, setScore] = useState(() => loadState().score)
  const [clickPower, setClickPower] = useState(() => loadState().clickPower)
  const [autoClickRate, setAutoClickRate] = useState(
    () => loadState().autoClickRate
  )
  const [level, setLevel] = useState(() => loadState().level)
  const [exp, setExp] = useState(() => loadState().exp)
  const [clickAnimation, setClickAnimation] = useState(false)
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: 'success' | 'upgrade' | 'level' }>
  >([])

  const [upgradeStates, setUpgradeStates] = useState<Record<string, ClickUpgrade>>(
    () => {
      const loaded = loadState()
      const defaultStates = upgrades.reduce(
        (acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }),
        {}
      )
      return { ...defaultStates, ...loaded.upgradeStates }
    }
  )

  // Load from enterprise persistence asynchronously on mount
  useEffect(() => {
    const loadFromEnterprisePersistence = async () => {
      try {
        // More robust check for persistence manager methods
        if (!persistenceManager || 
            !persistenceManager.loadGameState || 
            typeof persistenceManager.loadGameState !== 'function') {
          console.warn('Persistence manager not properly initialized, skipping enterprise persistence load')
          return
        }

        const result = await persistenceManager.loadGameState()
        if (result.gameState) {
          const cyberClickerProgress =
            result.gameState.gameProgress?.find(
              (game) => game.gameId === GAME_KEY
            )
          if (cyberClickerProgress && cyberClickerProgress.completedAt) {
            const json = localStorage.getItem('CyberClickerClassicSave')
            if (json) {
              const saved = JSON.parse(json) as CyberClickerSaveState
              setScore(saved.score || cyberClickerProgress.highScore || 0)
              setClickPower(saved.clickPower || 1)
              setAutoClickRate(saved.autoClickRate || 0)
              setLevel(
                saved.level || result.gameState.playerStats.level || 1
              )
              setExp(saved.exp || 0)
              const defaultStates = upgrades.reduce(
                (acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }),
                {}
              )
              setUpgradeStates({ ...defaultStates, ...saved.upgradeStates })
              console.log(
                'Successfully loaded game state from enterprise persistence + localStorage'
              )
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load from enterprise persistence:', error)
      }
    }

    loadFromEnterprisePersistence()
  }, [persistenceManager])

  // Save state whenever key values change
  useEffect(() => {
    const saveState = async () => {
      try {
        const save: CyberClickerSaveState = {
          score,
          clickPower,
          autoClickRate,
          level,
          exp,
          upgradeStates,
          sessionId: `cyber_clicker_${Date.now()}`,
          lastSave: new Date().toISOString()
        }

        const gameState = {
          playerStats: {
            level,
            totalXP: exp,
            gamesCompleted: Math.floor(score / 1000),
            achievementsUnlocked: Object.values(upgradeStates).reduce(
              (acc, u) => acc + (u.owned > 0 ? 1 : 0),
              0
            ),
            streakDays: 1,
            lastVisit: new Date().toISOString(),
            timeSpent: Date.now() - parseInt(save.sessionId.split('_')[2] || '0')
          },
          achievements: [] as any[],
          gameProgress: [
            {
              gameId: GAME_KEY,
              completed: level >= 10,
              highScore: score,
              timeSpent:
                Date.now() - parseInt(save.sessionId.split('_')[2] || '0'),
              attempts: 1,
              hintsUsed: 0,
              completedAt: level >= 10 ? new Date().toISOString() : undefined
            }
          ],
          skillProgress: {
            cryptography: Math.min(100, level * 10),
            passwordSecurity: Math.min(
              100,
              Object.values(upgradeStates).reduce(
                (acc, u) => acc + u.owned,
                0
              ) * 5
            ),
            phishingDetection: 0,
            socialEngineering: 0,
            networkSecurity: Math.min(100, autoClickRate * 2),
            incidentResponse: Math.min(100, clickPower * 5)
          },
          preferences: {
            soundEnabled: true,
            difficulty: 'normal',
            theme: 'cyber'
          },
          sessionInfo: {
            sessionId: save.sessionId,
            startTime: save.lastSave,
            lastActivity: new Date().toISOString()
          }
        }

        // More robust check for persistence manager methods before using
        if (persistenceManager && 
            persistenceManager.saveGameState && 
            typeof persistenceManager.saveGameState === 'function') {
          await persistenceManager.saveGameState(gameState)
        } else {
          console.warn('Persistence manager not properly initialized, skipping enterprise persistence save')
        }
        
        localStorage.setItem('CyberClickerClassicSave', JSON.stringify(save))
      } catch (error) {
        console.warn('Failed to save game state:', error)
        try {
          const saveFallback: CyberClickerSaveState = {
            score,
            clickPower,
            autoClickRate,
            level,
            exp,
            upgradeStates,
            sessionId: `cyber_clicker_${Date.now()}`,
            lastSave: new Date().toISOString()
          }
          localStorage.setItem(
            'CyberClickerClassicSave',
            JSON.stringify(saveFallback)
          )
        } catch (fallbackError) {
          console.error('All persistence mechanisms failed:', fallbackError)
        }
      }
    }

    saveState()
  }, [score, clickPower, autoClickRate, level, exp, upgradeStates, persistenceManager])

  // Auto-clicking effect
  useEffect(() => {
    if (autoClickRate > 0) {
      const interval = setInterval(() => {
        setScore((prev) => prev + autoClickRate)
        setExp((prev) => prev + autoClickRate * 0.1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoClickRate])

  // Level up calculation
  useEffect(() => {
    const expRequired = level * 100
    if (exp >= expRequired) {
      setLevel((prev) => prev + 1)
      setExp((prev) => prev - expRequired)
      setClickPower((prev) => prev + 1)
      showNotification(`Level Up! Now Level ${level + 1}`, 'level')
    }
  }, [exp, level])

  const handleClick = useCallback(() => {
    const points = clickPower
    setScore((prev) => prev + points)
    setExp((prev) => prev + points * 0.1)
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 200)
  }, [clickPower])

  const showNotification = (
    message: string,
    type: 'success' | 'upgrade' | 'level'
  ) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgradeStates[upgradeId]
    const cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.owned))

    if (score >= cost) {
      setScore((prev) => prev - cost)
      setUpgradeStates((prev) => ({
        ...prev,
        [upgradeId]: {
          ...prev[upgradeId],
          owned: prev[upgradeId].owned + 1
        }
      }))

      if (upgradeId === 'firewall' || upgradeId === 'antivirus') {
        setClickPower((prev) => prev + upgrade.multiplier)
      } else {
        setAutoClickRate((prev) => prev + upgrade.multiplier)
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