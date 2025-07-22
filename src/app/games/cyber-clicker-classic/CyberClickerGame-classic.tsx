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

  // Initialize persistence manager
  const [persistenceManager] = useState(() => new GameStatePersistenceManager())
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
        return {
          score: saved.score || 0,
          clickPower: saved.clickPower || 1,
          autoClickRate: saved.autoClickRate || 0,
          level: saved.level || 1,
          exp: saved.exp || 0,
          upgradeStates:
            saved.upgradeStates ||
            upgrades.reduce(
              (acc, upgrade) => ({ ...acc, [upgrade.id]: { ...upgrade } }),
              {}
            ),
          sessionId: saved.sessionId || `cyber_clicker_${Date.now()}`,
          lastSave: saved.lastSave || new Date().toISOString()
        }
      }
    } catch {
      // ignore parse errors
    }
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

        await persistenceManager.saveGameState(gameState)
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
      {/* …the rest of your JSX remains unchanged… */}
    </div>
  )
}
