'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Zap, 
  Sparkles, 
  Trophy,
  DollarSign,
  TrendingUp,
  Medal,
  Target,
  Timer,
  Flame,
  Rocket,
  Cpu,
  Wifi,
  Database,
  Server
} from 'lucide-react'
import { toast } from 'sonner'
import useGameStore from '@/stores/gameStore'

interface ClickerStats {
  totalClicks: number
  securityPoints: number
  pointsPerSecond: number
  clickPower: number
  totalEarned: number
  prestigeLevel: number
}

interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  owned: number
  baseCost: number
  pointsPerSecond: number
  maxLevel: number
  icon: React.ReactNode
  cybersecurityFact: string
  unlockAt: number
}

interface Achievement {
  id: string
  name: string
  description: string
  requirement: number
  unlocked: boolean
  icon: React.ReactNode
  reward: number
  cybersecurityLesson: string
}

const UPGRADES: Upgrade[] = [
  {
    id: 'password-bot',
    name: 'Password Bot',
    description: 'Automatically generates secure passwords',
    cost: 15,
    baseCost: 15,
    owned: 0,
    pointsPerSecond: 0.1,
    maxLevel: 100,
    unlockAt: 0,
    icon: <Lock className="w-4 h-4" />,
    cybersecurityFact: "Strong passwords are your first line of defense! Each character adds exponential security."
  },
  {
    id: 'firewall-guard',
    name: 'Firewall Guardian',
    description: 'Blocks malicious traffic automatically',
    cost: 100,
    baseCost: 100,
    owned: 0,
    pointsPerSecond: 1,
    maxLevel: 50,
    unlockAt: 100,
    icon: <Shield className="w-4 h-4" />,
    cybersecurityFact: "Firewalls act like security guards for your network, checking everything that comes in and goes out."
  },
  {
    id: 'encryption-engine',
    name: 'Encryption Engine',
    description: 'Encrypts data at lightning speed',
    cost: 1100,
    baseCost: 1100,
    owned: 0,
    pointsPerSecond: 8,
    maxLevel: 25,
    unlockAt: 1000,
    icon: <Cpu className="w-4 h-4" />,
    cybersecurityFact: "Encryption scrambles your data so only authorized people can read it. It's like a secret code!"
  },
  {
    id: 'ai-threat-detector',
    name: 'AI Threat Detector',
    description: 'Uses machine learning to spot threats',
    cost: 12000,
    baseCost: 12000,
    owned: 0,
    pointsPerSecond: 47,
    maxLevel: 20,
    unlockAt: 10000,
    icon: <Target className="w-4 h-4" />,
    cybersecurityFact: "AI can analyze millions of patterns to detect new types of cyber attacks that humans might miss."
  },
  {
    id: 'quantum-secure-vault',
    name: 'Quantum Secure Vault',
    description: 'Quantum-encrypted data storage',
    cost: 130000,
    baseCost: 130000,
    owned: 0,
    pointsPerSecond: 260,
    maxLevel: 10,
    unlockAt: 100000,
    icon: <Database className="w-4 h-4" />,
    cybersecurityFact: "Quantum encryption uses the laws of physics to create unbreakable codes!"
  },
  {
    id: 'cyber-defense-network',
    name: 'Global Cyber Defense Network',
    description: 'Worldwide threat intelligence sharing',
    cost: 1400000,
    baseCost: 1400000,
    owned: 0,
    pointsPerSecond: 1400,
    maxLevel: 5,
    unlockAt: 1000000,
    icon: <Wifi className="w-4 h-4" />,
    cybersecurityFact: "Cybersecurity works best when organizations share threat information globally."
  }
]

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-click',
    name: 'First Click',
    description: 'Click the security shield for the first time',
    requirement: 1,
    unlocked: false,
    reward: 10,
    icon: <Sparkles className="w-4 h-4" />,
    cybersecurityLesson: "Every cybersecurity journey starts with a single step!"
  },
  {
    id: 'hundred-clicks',
    name: 'Click Master',
    description: 'Click 100 times',
    requirement: 100,
    unlocked: false,
    reward: 50,
    icon: <Target className="w-4 h-4" />,
    cybersecurityLesson: "Persistence is key in cybersecurity - attackers never give up, so defenders can't either!"
  },
  {
    id: 'first-upgrade',
    name: 'Security Investment',
    description: 'Purchase your first upgrade',
    requirement: 1,
    unlocked: false,
    reward: 25,
    icon: <TrendingUp className="w-4 h-4" />,
    cybersecurityLesson: "Investing in security tools is always worth it - prevention is cheaper than recovery!"
  },
  {
    id: 'automation-master',
    name: 'Automation Master',
    description: 'Reach 10 points per second',
    requirement: 10,
    unlocked: false,
    reward: 100,
    icon: <Rocket className="w-4 h-4" />,
    cybersecurityLesson: "Automation is crucial in cybersecurity - computers can monitor threats 24/7!"
  },
  {
    id: 'security-empire',
    name: 'Security Empire',
    description: 'Earn 1 million total security points',
    requirement: 1000000,
    unlocked: false,
    reward: 500,
    icon: <Trophy className="w-4 h-4" />,
    cybersecurityLesson: "Building a security empire takes time, but it protects everything you value!"
  }
]

export default function CyberClickerEmpire() {
  const { addXP, unlockAchievement, updateGameProgress } = useGameStore()
  
  const [stats, setStats] = useState<ClickerStats>({
    totalClicks: 0,
    securityPoints: 0,
    pointsPerSecond: 0,
    clickPower: 1,
    totalEarned: 0,
    prestigeLevel: 0
  })
  
  const [upgrades, setUpgrades] = useState(UPGRADES)
  const [achievements, setAchievements] = useState(ACHIEVEMENTS)
  const [isClicking, setIsClicking] = useState(false)
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{id: number, value: number, x: number, y: number}>>([])
  const [autoClickerActive, setAutoClickerActive] = useState(false)
  const [multiplier, setMultiplier] = useState(1)
  const [streakCount, setStreakCount] = useState(0)

  // Auto-clicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        securityPoints: prev.securityPoints + prev.pointsPerSecond,
        totalEarned: prev.totalEarned + prev.pointsPerSecond
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [stats.pointsPerSecond])

  // Check achievements
  useEffect(() => {
    setAchievements(prev => prev.map(achievement => {
      if (!achievement.unlocked) {
        let meetsRequirement = false
        
        switch (achievement.id) {
          case 'first-click':
            meetsRequirement = stats.totalClicks >= 1
            break
          case 'hundred-clicks':
            meetsRequirement = stats.totalClicks >= 100
            break
          case 'first-upgrade':
            meetsRequirement = upgrades.some(u => u.owned > 0)
            break
          case 'automation-master':
            meetsRequirement = stats.pointsPerSecond >= 10
            break
          case 'security-empire':
            meetsRequirement = stats.totalEarned >= 1000000
            break
        }
        
        if (meetsRequirement) {
          toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
            description: achievement.cybersecurityLesson
          })
          addXP(achievement.reward)
          unlockAchievement(achievement.id, achievement.name, 'cyber-clicker')
          return { ...achievement, unlocked: true }
        }
      }
      return achievement
    }))
  }, [stats, upgrades, addXP, unlockAchievement])

  const handleShieldClick = useCallback((event: React.MouseEvent) => {
    const clickValue = stats.clickPower * multiplier
    
    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      securityPoints: prev.securityPoints + clickValue,
      totalEarned: prev.totalEarned + clickValue
    }))

    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 100)

    // Add floating number effect
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const floatingId = Date.now()
    setFloatingNumbers(prev => [...prev, { id: floatingId, value: clickValue, x, y }])
    
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(num => num.id !== floatingId))
    }, 1000)

    // Streak system for engagement
    setStreakCount(prev => {
      const newStreak = prev + 1
      if (newStreak % 10 === 0) {
        setMultiplier(2)
        toast.success(`🔥 ${newStreak} Click Streak! Double points for 5 seconds!`)
        setTimeout(() => setMultiplier(1), 5000)
      }
      return newStreak
    })

  }, [stats.clickPower, multiplier])

  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId)
    if (!upgrade || stats.securityPoints < upgrade.cost || upgrade.owned >= upgrade.maxLevel) return

    setStats(prev => ({
      ...prev,
      securityPoints: prev.securityPoints - upgrade.cost,
      pointsPerSecond: prev.pointsPerSecond + upgrade.pointsPerSecond
    }))

    setUpgrades(prev => prev.map(u => 
      u.id === upgradeId 
        ? { 
            ...u, 
            owned: u.owned + 1,
            cost: Math.floor(u.baseCost * Math.pow(1.15, u.owned + 1))
          }
        : u
    ))

    toast.success(`🛡️ Purchased ${upgrade.name}!`, {
      description: upgrade.cybersecurityFact
    })

    addXP(10)
  }, [stats.securityPoints, upgrades, addXP])

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return Math.floor(num).toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Header Stats */}
      <div className="p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{formatNumber(stats.securityPoints)}</div>
              <div className="text-xs text-slate-400">Security Points</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{formatNumber(stats.pointsPerSecond)}/sec</div>
              <div className="text-xs text-slate-400">Per Second</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">{formatNumber(stats.totalClicks)}</div>
              <div className="text-xs text-slate-400">Total Clicks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">{stats.clickPower}x</div>
              <div className="text-xs text-slate-400">Click Power</div>
            </div>
            <div>
              <div className="text-lg font-bold text-pink-400">{formatNumber(stats.totalEarned)}</div>
              <div className="text-xs text-slate-400">Total Earned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Clicking Area */}
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Cyber Clicker Empire
              </h1>
              <p className="text-slate-300">Build your cybersecurity empire one click at a time!</p>
              
              {multiplier > 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                >
                  <Flame className="w-4 h-4" />
                  {multiplier}x MULTIPLIER!
                </motion.div>
              )}
            </div>

            {/* Main Shield */}
            <div className="relative flex justify-center mb-8">
              <motion.button
                className="relative"
                onClick={handleShieldClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isClicking ? { scale: 1.1 } : { scale: 1 }}
              >
                <motion.div
                  className="w-48 h-48 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
                  animate={autoClickerActive ? { 
                    boxShadow: [
                      '0 0 0 0 rgba(6, 182, 212, 0.4)',
                      '0 0 0 20px rgba(6, 182, 212, 0)',
                      '0 0 0 0 rgba(6, 182, 212, 0.4)'
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Shield className="w-24 h-24 text-white" />
                </motion.div>
              </motion.button>

              {/* Floating Numbers */}
              <AnimatePresence>
                {floatingNumbers.map(num => (
                  <motion.div
                    key={num.id}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -50, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute text-2xl font-bold text-yellow-400 pointer-events-none"
                    style={{ left: num.x, top: num.y }}
                  >
                    +{formatNumber(num.value)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-cyan-400">{streakCount}</div>
                <div className="text-sm text-slate-400">Click Streak</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-green-400">{achievements.filter(a => a.unlocked).length}</div>
                <div className="text-sm text-slate-400">Achievements</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-purple-400">{upgrades.reduce((sum, u) => sum + u.owned, 0)}</div>
                <div className="text-sm text-slate-400">Upgrades Owned</div>
              </div>
            </div>
          </div>

          {/* Upgrades Panel */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">🛡️ Security Upgrades</h2>
            
            {upgrades.map((upgrade) => (
              <motion.div
                key={upgrade.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  stats.securityPoints >= upgrade.cost && upgrade.owned < upgrade.maxLevel && stats.totalEarned >= upgrade.unlockAt
                    ? 'bg-slate-800/70 border-cyan-500 hover:border-cyan-400 cursor-pointer'
                    : stats.totalEarned < upgrade.unlockAt
                    ? 'bg-slate-900/50 border-slate-700 opacity-50'
                    : 'bg-slate-800/30 border-slate-600 opacity-60'
                }`}
                whileHover={stats.securityPoints >= upgrade.cost && upgrade.owned < upgrade.maxLevel ? { scale: 1.02 } : {}}
                onClick={() => buyUpgrade(upgrade.id)}
              >
                {stats.totalEarned < upgrade.unlockAt ? (
                  <div className="text-center">
                    <Lock className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                    <div className="text-sm text-slate-400">
                      Unlock at {formatNumber(upgrade.unlockAt)} total points
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {upgrade.icon}
                        <span className="font-bold">{upgrade.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold">{formatNumber(upgrade.cost)}</div>
                        <div className="text-xs text-slate-400">Owned: {upgrade.owned}/{upgrade.maxLevel}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mb-2">{upgrade.description}</div>
                    <div className="text-xs text-green-400">+{upgrade.pointsPerSecond}/sec</div>
                    
                    {upgrade.owned > 0 && (
                      <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(upgrade.owned / upgrade.maxLevel) * 100}%` }}
                        />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}

            {/* Achievements */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">🏆 Achievements</h3>
              <div className="space-y-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-yellow-500/20 border-yellow-500' 
                        : 'bg-slate-800/30 border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {achievement.icon}
                      <div className="flex-1">
                        <div className="font-semibold">{achievement.name}</div>
                        <div className="text-xs text-slate-400">{achievement.description}</div>
                        {achievement.unlocked && (
                          <div className="text-xs text-yellow-400">+{achievement.reward} XP</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
