'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, Zap, Eye, Target, Clock, CheckCircle, TrendingUp } from 'lucide-react'

interface Threat {
  id: string
  type: 'malware' | 'ddos' | 'phishing' | 'ransomware' | 'insider'
  severity: 'low' | 'medium' | 'high' | 'critical'
  position: { x: number; y: number }
  speed: number
  health: number
  maxHealth: number
  value: number
}

interface Defense {
  id: string
  type: 'firewall' | 'antivirus' | 'ids' | 'honeypot' | 'aimonitor'
  position: { x: number; y: number }
  range: number
  damage: number
  cost: number
  level: number
}

interface GameState {
  score: number
  lives: number
  wave: number
  resources: number
  gameStatus: 'playing' | 'paused' | 'gameOver' | 'victory'
}

export default function CyberDefenseSimulatorGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 100,
    wave: 1,
    resources: 100,
    gameStatus: 'paused'
  })
  
  const [threats, setThreats] = useState<Threat[]>([])
  const [defenses, setDefenses] = useState<Defense[]>([])
  const [selectedDefenseType, setSelectedDefenseType] = useState<Defense['type']>('firewall')
  const [hoveredCell, setHoveredCell] = useState<{x: number, y: number} | null>(null)
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'warning' | 'danger'}>>([])

  const defenseTypes = {
    firewall: { name: 'Firewall', cost: 20, damage: 15, range: 2, icon: Shield, color: 'blue' },
    antivirus: { name: 'Antivirus', cost: 30, damage: 25, range: 1, icon: Zap, color: 'yellow' },
    ids: { name: 'IDS', cost: 40, damage: 10, range: 3, icon: Eye, color: 'green' },
    honeypot: { name: 'Honeypot', cost: 50, damage: 5, range: 4, icon: Target, color: 'purple' },
    aimonitor: { name: 'AI Monitor', cost: 80, damage: 35, range: 2, icon: TrendingUp, color: 'red' }
  }

  const threatTypes = {
    malware: { name: 'Malware', health: 30, speed: 1, value: 10, color: 'red' },
    ddos: { name: 'DDoS', health: 50, speed: 2, value: 15, color: 'orange' },
    phishing: { name: 'Phishing', health: 20, speed: 3, value: 8, color: 'yellow' },
    ransomware: { name: 'Ransomware', health: 80, speed: 0.5, value: 25, color: 'purple' },
    insider: { name: 'Insider Threat', health: 40, speed: 1.5, value: 20, color: 'pink' }
  }

  // Grid size (10x6 grid for placement)
  const gridWidth = 10
  const gridHeight = 6

  // Generate new wave of threats
  const generateWave = useCallback(() => {
    const waveSize = Math.min(3 + gameState.wave, 10)
    const newThreats: Threat[] = []
    
    for (let i = 0; i < waveSize; i++) {
      const threatTypeKeys = Object.keys(threatTypes) as Array<keyof typeof threatTypes>
      const threatType = threatTypeKeys[Math.floor(Math.random() * threatTypeKeys.length)]
      const threatData = threatTypes[threatType]
      
      const threat: Threat = {
        id: `threat-${Date.now()}-${i}`,
        type: threatType,
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        position: { x: 0, y: Math.floor(Math.random() * gridHeight) },
        speed: threatData.speed * (0.8 + Math.random() * 0.4),
        health: threatData.health,
        maxHealth: threatData.health,
        value: threatData.value
      }
      
      newThreats.push(threat)
    }
    
    setThreats(prev => [...prev, ...newThreats])
    showNotification(`Wave ${gameState.wave} incoming! ${waveSize} threats detected.`, 'warning')
  }, [gameState.wave])

  // Game loop
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return

    const gameLoop = setInterval(() => {
      // Move threats
      setThreats(prev => prev.map(threat => {
        const newX = threat.position.x + threat.speed * 0.1
        if (newX >= gridWidth) {
          // Threat reached the end
          setGameState(gs => ({ ...gs, lives: Math.max(0, gs.lives - 10) }))
          return null
        }
        return { ...threat, position: { ...threat.position, x: newX } }
      }).filter(Boolean) as Threat[])

      // Defense attacks
      setThreats(prevThreats => {
        const updatedThreats = [...prevThreats]
        
        defenses.forEach(defense => {
          const defenseData = defenseTypes[defense.type]
          
          // Find threats in range
          const threatsInRange = updatedThreats.filter(threat => {
            const distance = Math.sqrt(
              Math.pow(threat.position.x - defense.position.x, 2) +
              Math.pow(threat.position.y - defense.position.y, 2)
            )
            return distance <= defenseData.range && threat.health > 0
          })

          // Attack the closest threat
          if (threatsInRange.length > 0) {
            const target = threatsInRange.reduce((closest, current) => 
              Math.abs(current.position.x - defense.position.x) < Math.abs(closest.position.x - defense.position.x) 
                ? current : closest
            )
            
            const targetIndex = updatedThreats.findIndex(t => t.id === target.id)
            if (targetIndex !== -1) {
              updatedThreats[targetIndex] = {
                ...updatedThreats[targetIndex],
                health: Math.max(0, updatedThreats[targetIndex].health - defenseData.damage)
              }
            }
          }
        })

        // Remove destroyed threats and add score
        const destroyedThreats = updatedThreats.filter(threat => threat.health <= 0)
        destroyedThreats.forEach(threat => {
          setGameState(gs => ({
            ...gs,
            score: gs.score + threat.value,
            resources: gs.resources + Math.floor(threat.value / 2)
          }))
        })

        return updatedThreats.filter(threat => threat.health > 0)
      })

      // Check for wave completion
      if (threats.length === 0) {
        setTimeout(() => {
          setGameState(gs => ({ ...gs, wave: gs.wave + 1 }))
        }, 2000)
      }

    }, 100)

    return () => clearInterval(gameLoop)
  }, [gameState.gameStatus, defenses, threats])

  // Generate waves
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && threats.length === 0) {
      const timer = setTimeout(generateWave, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState.gameStatus, threats.length, generateWave])

  // Check game over
  useEffect(() => {
    if (gameState.lives <= 0) {
      setGameState(gs => ({ ...gs, gameStatus: 'gameOver' }))
      showNotification('Game Over! Your network has been compromised.', 'danger')
    }
  }, [gameState.lives])

  const showNotification = (message: string, type: 'success' | 'warning' | 'danger') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  const placeDefense = (x: number, y: number) => {
    const defenseData = defenseTypes[selectedDefenseType]
    
    if (gameState.resources < defenseData.cost) {
      showNotification('Insufficient resources!', 'warning')
      return
    }

    // Check if position is occupied
    const isOccupied = defenses.some(d => d.position.x === x && d.position.y === y)
    if (isOccupied) {
      showNotification('Position already occupied!', 'warning')
      return
    }

    const newDefense: Defense = {
      id: `defense-${Date.now()}`,
      type: selectedDefenseType,
      position: { x, y },
      range: defenseData.range,
      damage: defenseData.damage,
      cost: defenseData.cost,
      level: 1
    }

    setDefenses(prev => [...prev, newDefense])
    setGameState(gs => ({ ...gs, resources: gs.resources - defenseData.cost }))
    showNotification(`${defenseData.name} deployed!`, 'success')
  }

  const startGame = () => {
    setGameState(gs => ({ ...gs, gameStatus: 'playing' }))
  }

  const pauseGame = () => {
    setGameState(gs => ({ ...gs, gameStatus: 'paused' }))
  }

  const resetGame = () => {
    setGameState({
      score: 0,
      lives: 100,
      wave: 1,
      resources: 100,
      gameStatus: 'paused'
    })
    setThreats([])
    setDefenses([])
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cyber Defense Simulator
          </h1>
          <p className="text-lg text-gray-300">
            Defend your network against cyber threats using strategic security placement
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
                notification.type === 'danger' ? 'bg-red-600' :
                notification.type === 'warning' ? 'bg-yellow-600' :
                'bg-green-600'
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{gameState.score}</div>
            <div className="text-sm text-gray-400">Score</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{gameState.lives}%</div>
            <div className="text-sm text-gray-400">Network Health</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{gameState.wave}</div>
            <div className="text-sm text-gray-400">Wave</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{gameState.resources}</div>
            <div className="text-sm text-gray-400">Resources</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{threats.length}</div>
            <div className="text-sm text-gray-400">Active Threats</div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-6">
          {gameState.gameStatus === 'paused' && (
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Shield size={20} />
              Start Defense
            </button>
          )}
          {gameState.gameStatus === 'playing' && (
            <button
              onClick={pauseGame}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
            >
              <Clock size={20} />
              Pause
            </button>
          )}
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reset Game
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Defense Selection */}
          <div className="bg-black/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Security Tools</h3>
            <div className="space-y-3">
              {Object.entries(defenseTypes).map(([type, data]) => {
                const IconComponent = data.icon
                const canAfford = gameState.resources >= data.cost
                
                return (
                  <motion.button
                    key={type}
                    onClick={() => setSelectedDefenseType(type as Defense['type'])}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      selectedDefenseType === type
                        ? 'border-blue-500 bg-blue-500/20'
                        : canAfford
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-600/10'
                        : 'border-gray-700 bg-gray-700/10 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!canAfford}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent size={20} className={`text-${data.color}-400`} />
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm">{data.name}</div>
                        <div className="text-xs text-gray-400">
                          Cost: {data.cost} | DMG: {data.damage} | Range: {data.range}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Game Grid */}
          <div className="lg:col-span-3 bg-black/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Network Defense Grid</h3>
            <div className="grid grid-cols-10 gap-1 max-w-4xl mx-auto">
              {Array.from({ length: gridHeight }).map((_, row) =>
                Array.from({ length: gridWidth }).map((_, col) => {
                  const defense = defenses.find(d => d.position.x === col && d.position.y === row)
                  const threatsInCell = threats.filter(t => 
                    Math.floor(t.position.x) === col && Math.floor(t.position.y) === row
                  )
                  
                  return (
                    <motion.div
                      key={`${row}-${col}`}
                      className={`aspect-square border border-gray-600 rounded cursor-pointer relative ${
                        hoveredCell?.x === col && hoveredCell?.y === row
                          ? 'bg-blue-500/30'
                          : col === 0
                          ? 'bg-red-500/20'
                          : col === gridWidth - 1
                          ? 'bg-green-500/20'
                          : 'bg-gray-800/50'
                      }`}
                      onClick={() => placeDefense(col, row)}
                      onMouseEnter={() => setHoveredCell({ x: col, y: row })}
                      onMouseLeave={() => setHoveredCell(null)}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Defense */}
                      {defense && (
                        <div className={`absolute inset-0 flex items-center justify-center bg-${defenseTypes[defense.type].color}-500/50 rounded`}>
                          {React.createElement(defenseTypes[defense.type].icon, { size: 16, className: 'text-white' })}
                        </div>
                      )}
                      
                      {/* Threats */}
                      {threatsInCell.map(threat => (
                        <motion.div
                          key={threat.id}
                          className={`absolute inset-0 flex items-center justify-center bg-${threatTypes[threat.type].color}-500 rounded opacity-80`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <AlertTriangle size={12} className="text-white" />
                          <div className="absolute -top-1 -right-1 w-2 h-1 bg-red-600 rounded">
                            <div 
                              className="h-full bg-green-500 rounded"
                              style={{ width: `${(threat.health / threat.maxHealth) * 100}%` }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )
                })
              )}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              <p>Red zone: Attack entry point | Green zone: Network core | Click to place selected defense</p>
            </div>
          </div>
        </div>

        {/* Learning Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 rounded-lg p-6 mt-8"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-blue-400 mb-2">Defense Strategy</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Understand layered security architecture</li>
                <li>• Learn about different security tool capabilities</li>
                <li>• Practice resource allocation under pressure</li>
                <li>• Explore threat detection and response timing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-purple-400 mb-2">Threat Intelligence</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Identify different attack vectors and speeds</li>
                <li>• Understand threat severity classification</li>
                <li>• Learn about attack pattern recognition</li>
                <li>• Practice prioritizing security investments</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
