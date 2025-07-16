'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Server, Lock, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import useGameStore from '@/stores/gameStore'
import GameHeader from '@/components/GameHeader'

interface DefenseSystem {
  id: string
  name: string
  level: number
  cost: number
  protection: number
  maxLevel: number
  icon: React.ReactNode
  description: string
  autoGeneration?: number
}

interface SecurityEvent {
  id: string
  type: 'attack' | 'breach' | 'critical' | 'warning'
  message: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  blocked: boolean
}

interface GameStats {
  totalClicks: number
  defensePoints: number
  attacksBlocked: number
  breachesDetected: number
  systemsUpgraded: number
  autoDefensePerSecond: number
}

export default function CyberDefenseSimulator() {
  const { addXP, unlockAchievement, updateGameProgress, updateSkillProgress } = useGameStore()

  // Game state
  const [stats, setStats] = useState<GameStats>({
    totalClicks: 0,
    defensePoints: 0,
    attacksBlocked: 0,
    breachesDetected: 0,
    systemsUpgraded: 0,
    autoDefensePerSecond: 0
  })

  const [defenseSystems, setDefenseSystems] = useState<DefenseSystem[]>([
    {
      id: 'firewall',
      name: 'Basic Firewall',
      level: 1,
      cost: 15,
      protection: 1,
      maxLevel: 20,
      icon: <Shield className="w-4 h-4" />,
      description: 'Blocks basic network attacks',
      autoGeneration: 0.1
    },
    {
      id: 'antivirus',
      name: 'Antivirus Engine',
      level: 0,
      cost: 100,
      protection: 5,
      maxLevel: 15,
      icon: <Zap className="w-4 h-4" />,
      description: 'Detects and removes malware',
      autoGeneration: 0.5
    },
    {
      id: 'ids',
      name: 'Intrusion Detection',
      level: 0,
      cost: 500,
      protection: 25,
      maxLevel: 12,
      icon: <Eye className="w-4 h-4" />,
      description: 'Monitors network for suspicious activity',
      autoGeneration: 2.5
    },
    {
      id: 'waf',
      name: 'Web Application Firewall',
      level: 0,
      cost: 2500,
      protection: 100,
      maxLevel: 10,
      icon: <Server className="w-4 h-4" />,
      description: 'Protects web applications from attacks',
      autoGeneration: 10
    },
    {
      id: 'siem',
      name: 'SIEM Platform',
      level: 0,
      cost: 10000,
      protection: 500,
      maxLevel: 8,
      icon: <Lock className="w-4 h-4" />,
      description: 'Advanced security information and event management',
      autoGeneration: 50
    }
  ])

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [gameStartTime] = useState(Date.now())
  const [isAutoDefenseRunning, setIsAutoDefenseRunning] = useState(false)

  // Generate realistic security events
  const generateSecurityEvent = useCallback(() => {
    const eventTypes = [
      { type: 'attack', message: 'SQL injection attempt blocked', severity: 'medium', blocked: true },
      { type: 'attack', message: 'DDoS attack detected and mitigated', severity: 'high', blocked: true },
      { type: 'breach', message: 'Suspicious login from unknown location', severity: 'high', blocked: false },
      { type: 'warning', message: 'Unusual network traffic pattern detected', severity: 'low', blocked: false },
      { type: 'attack', message: 'Malware signature detected', severity: 'medium', blocked: true },
      { type: 'critical', message: 'Zero-day exploit attempt detected', severity: 'critical', blocked: false },
      { type: 'attack', message: 'Cross-site scripting attempt blocked', severity: 'low', blocked: true },
      { type: 'breach', message: 'Unauthorized API access attempt', severity: 'medium', blocked: false }
    ]

    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const newEvent: SecurityEvent = {
      id: Date.now().toString(),
      ...event,
      timestamp: Date.now()
    } as SecurityEvent

    setSecurityEvents((prev: SecurityEvent[]) => {
      const updated = [newEvent, ...prev].slice(0, 10) // Keep only latest 10 events
      return updated
    })

    if (event.blocked) {
      setStats((prev: GameStats) => ({ ...prev, attacksBlocked: prev.attacksBlocked + 1 }))
    } else {
      setStats((prev: GameStats) => ({ ...prev, breachesDetected: prev.breachesDetected + 1 }))
    }

    // Show toast notification
    if (event.severity === 'critical') {
      toast.error(`🚨 ${event.message}`)
    } else if (event.blocked) {
      toast.success(`🛡️ ${event.message}`)
    } else {
      toast.warning(`⚠️ ${event.message}`)
    }
  }, [])

  // Core clicking mechanic
  const handleDefenseClick = useCallback(() => {
    setStats((prev: GameStats) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      defensePoints: prev.defensePoints + 1
    }))

    // Random chance for security events
    if (Math.random() < 0.1) {
      generateSecurityEvent()
    }

    // Achievement checks
    if (stats.totalClicks === 49) {
      unlockAchievement('first_clicks', 'First Clicks', 'Started building your defense network', 'general')
      addXP(10)
    }
    
    if (stats.totalClicks === 999) {
      unlockAchievement('clicker_champion', 'Defense Champion', 'Built an unstoppable cyber defense network', 'general')
      addXP(50)
    }
  }, [stats.totalClicks, unlockAchievement, addXP, generateSecurityEvent])

  // Upgrade defense system
  const upgradeSystem = useCallback((systemId: string) => {
    setDefenseSystems((prev: DefenseSystem[]) => prev.map((system: DefenseSystem) => {
      if (system.id === systemId && system.level < system.maxLevel && stats.defensePoints >= system.cost) {
        setStats((prevStats: GameStats) => ({
          ...prevStats,
          defensePoints: prevStats.defensePoints - system.cost,
          systemsUpgraded: prevStats.systemsUpgraded + 1
        }))

        const newLevel = system.level + 1
        const newCost = Math.floor(system.cost * 1.5)
        
        toast.success(`🔧 ${system.name} upgraded to level ${newLevel}!`)
        addXP(5)
        updateSkillProgress('networkSecurity', newLevel * 2)

        return {
          ...system,
          level: newLevel,
          cost: newCost
        }
      }
      return system
    }))
  }, [stats.defensePoints, addXP, updateSkillProgress])

  // Auto-defense calculation
  useEffect(() => {
    const autoDefensePerSecond = defenseSystems.reduce((total: number, system: DefenseSystem) => {
      return total + (system.autoGeneration || 0) * system.level
    }, 0)

    setStats((prev: GameStats) => ({ ...prev, autoDefensePerSecond }))

    if (autoDefensePerSecond > 0) {
      setIsAutoDefenseRunning(true)
      const interval = setInterval(() => {
        setStats((prev: GameStats) => ({
          ...prev,
          defensePoints: prev.defensePoints + autoDefensePerSecond
        }))
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setIsAutoDefenseRunning(false)
    }
  }, [defenseSystems])

  // Educational tooltips and achievement tracking
  useEffect(() => {
    const gameTime = Date.now() - gameStartTime
    
    // Update game progress every 30 seconds
    const progressInterval = setInterval(() => {
      updateGameProgress('cyber-defense-simulator', {
        timeSpent: Math.floor(gameTime / 1000 / 60),
        highScore: stats.defensePoints,
        completed: stats.systemsUpgraded >= 10
      })
    }, 30000)

    return () => clearInterval(progressInterval)
  }, [gameStartTime, stats, updateGameProgress])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader title="Cyber Defense Simulator" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Header */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-cyan-400/30">
            <div className="text-cyan-400 text-sm font-medium">Defense Points</div>
            <div className="text-2xl font-bold text-white">{Math.floor(stats.defensePoints)}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-green-400/30">
            <div className="text-green-400 text-sm font-medium">Attacks Blocked</div>
            <div className="text-2xl font-bold text-white">{stats.attacksBlocked}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-purple-400/30">
            <div className="text-purple-400 text-sm font-medium">Auto Defense/sec</div>
            <div className="text-2xl font-bold text-white">{stats.autoDefensePerSecond.toFixed(1)}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-yellow-400/30">
            <div className="text-yellow-400 text-sm font-medium">Systems Level</div>
            <div className="text-2xl font-bold text-white">{stats.systemsUpgraded}</div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Defense Panel */}
          <div className="space-y-6">
            {/* Primary Defense Button */}
            <motion.div
              className="text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.button
                onClick={handleDefenseClick}
                className="w-48 h-48 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full border-4 border-cyan-400/50 shadow-2xl shadow-cyan-400/20 flex items-center justify-center group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Shield className="w-16 h-16 text-white group-hover:animate-pulse" />
              </motion.button>
              <p className="text-cyan-400 mt-4 font-medium">Click to strengthen defenses!</p>
              <p className="text-slate-400 text-sm">+1 Defense Point per click</p>
            </motion.div>

            {/* Defense Systems Upgrades */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-purple-400" />
                Defense Systems
              </h3>
              <div className="space-y-3">
                {defenseSystems.map((system) => (
                  <motion.div
                    key={system.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      stats.defensePoints >= system.cost && system.level < system.maxLevel
                        ? 'bg-slate-700/50 border-cyan-400/50 hover:border-cyan-400/80 cursor-pointer'
                        : 'bg-slate-700/30 border-slate-600/50'
                    }`}
                    whileHover={stats.defensePoints >= system.cost && system.level < system.maxLevel ? { scale: 1.02 } : {}}
                    onClick={() => upgradeSystem(system.id)}
                  >
                    <div className="flex items-center">
                      <div className="text-purple-400 mr-3">{system.icon}</div>
                      <div>
                        <div className="text-white font-medium">{system.name}</div>
                        <div className="text-slate-400 text-sm">{system.description}</div>
                        <div className="text-cyan-400 text-xs">
                          Level {system.level}/{system.maxLevel}
                          {system.autoGeneration && system.level > 0 && (
                            <span className="ml-2">+{(system.autoGeneration * system.level).toFixed(1)}/sec</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${stats.defensePoints >= system.cost ? 'text-green-400' : 'text-red-400'}`}>
                        {system.level < system.maxLevel ? system.cost : 'MAX'}
                      </div>
                      <div className="text-slate-400 text-xs">Defense Points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Events Feed */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-red-400/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
              Security Events
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {securityEvents.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <p>All systems secure</p>
                  <p className="text-sm">Click to generate activity</p>
                </div>
              ) : (
                securityEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className={`p-3 rounded-lg border flex items-start ${
                      event.type === 'critical'
                        ? 'bg-red-900/30 border-red-400/50'
                        : event.type === 'breach'
                        ? 'bg-orange-900/30 border-orange-400/50'
                        : event.blocked
                        ? 'bg-green-900/30 border-green-400/50'
                        : 'bg-yellow-900/30 border-yellow-400/50'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{event.message}</div>
                      <div className="flex items-center text-xs text-slate-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(event.timestamp).toLocaleTimeString()}
                        <span className={`ml-2 px-2 py-1 rounded ${
                          event.blocked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {event.blocked ? 'BLOCKED' : 'DETECTED'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Educational Panel */}
        <motion.div
          className="mt-8 bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-blue-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Lock className="w-6 h-6 mr-2 text-blue-400" />
            Cybersecurity Learning Hub
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h4 className="text-cyan-400 font-medium mb-2">Firewalls</h4>
              <p className="text-slate-300">Network security systems that monitor and control incoming and outgoing traffic based on predetermined security rules.</p>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">Intrusion Detection</h4>
              <p className="text-slate-300">Systems that monitor network traffic for suspicious activity and potential threats in real-time.</p>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">SIEM Platforms</h4>
              <p className="text-slate-300">Security Information and Event Management systems that provide real-time analysis of security alerts.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
