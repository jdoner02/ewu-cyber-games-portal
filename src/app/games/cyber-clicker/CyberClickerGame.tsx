// CareerClickerGame.tsx
// An educational idle/clicker game for teaching cybersecurity careers to curious middle schoolers.
// Players build a virtual cybersecurity company, hire and promote roles, and learn career pathways.
// The code is heavily commented to explain both what each piece does and why it matters!

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // for smooth animations
import { useEnterprisePersistence, validateGameState, safeDataSanitization } from '../../../hooks/useEnterprisePersistence'

// ----------------------------------------
// --- DATA TYPES AND CONFIGURATION ---
// ----------------------------------------

// Define a Role in the company with properties for game logic and educational content
// Game State interface for complete game state
interface GameState {
  sp: number
  totalEarned: number
  roles: { [key: string]: number }
  achievements: string[]
  lastSaved: number
  clickValue: number
  passiveIncome: number
  newsItems: string[]
  codex: { [key: string]: boolean }
  threatEvents: ThreatEvent[]
  learningScenarios: LearningScenario[]
  statisticsTracking: {
    totalClicks: number
    totalSpent: number
    timePlayedSeconds: number
    threatsDetected: number
    scenariosCompleted: number
  }
}

// Base interface for career progression
interface CareerRole {
  id: string
  name: string
  tier: number
  baseCost: number
  baseProd: number
  description: string
  nextRoleId?: string
  level?: number
  costSP?: number
  spPerSecond?: number
  sprite?: string // Visual representation for the role
}

// Achievement interface for gamification
interface Achievement {
  id: string
  title: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  condition: {
    type: 'clicks' | 'sp_earned' | 'roles_hired' | 'threats_detected' | 'scenarios_completed'
    target: number
    roleId?: string
  }
  reward?: {
    clickMultiplier?: number
    spBonus?: number
    sp?: number
    unlockRole?: string
  }
}

// Threat event interface for interactive scenarios  
interface ThreatEvent {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  active: boolean
  timeRemaining: number
  requiredRole?: string
  spReward: number
  learningOutcome: string
}

// Learning scenario interface for educational content
interface LearningScenario {
  id: string
  title: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'technical' | 'management' | 'compliance' | 'incident-response'
  completed: boolean
  spReward: number
  prerequisites?: string[]
  learningObjectives: string[]
}

// Define a NewsItem for the ticker
interface NewsItem {
  id: string               // unique key
  text: string             // headline text
}

// Static list of career roles derived from real cyber career pathways
const ROLE_DEFINITIONS: CareerRole[] = [
  { id: 'soc1', name: 'SOC Analyst I',     tier: 1, baseCost:  50, baseProd:   1, description: 'Monitors security alerts and investigates basic incidents.', nextRoleId: 'soc2', sprite: '🛡️' },
  { id: 'sup_spec', name: 'Support Specialist', tier: 1, baseCost:  30, baseProd:   0.5, description: 'Handles helpdesk tickets and basic troubleshooting.', nextRoleId: 'forensics', sprite: '💻' },
  { id: 'vuln1',   name: 'Vulnerability Analyst', tier: 1, baseCost:  80, baseProd:   1.2, description: 'Runs scans to find security weaknesses.', nextRoleId: 'pentest', sprite: '🔍' },
  { id: 'auditor', name: 'IT Auditor',        tier: 1, baseCost:  70, baseProd:   0.8, description: 'Assesses systems for compliance and controls.', nextRoleId: 'risk_ana', sprite: '📋' },

  { id: 'soc2',    name: 'SOC Analyst II',    tier: 2, baseCost: 300, baseProd:   5, description: 'Handles complex incidents and fine-tunes defenses.', nextRoleId: 'threat_hunter', sprite: '🛡️⚡' },
  { id: 'forensics', name: 'Digital Forensics Analyst', tier: 2, baseCost: 250, baseProd:   4, description: 'Investigates breaches by analyzing evidence.' , nextRoleId: 'ir_lead', sprite: '🔬' },
  { id: 'pentest', name: 'Penetration Tester', tier: 2, baseCost: 400, baseProd:   6, description: 'Simulates attacks to find vulnerabilities.' , nextRoleId: 'redteam', sprite: '⚔️' },
  { id: 'risk_ana', name: 'Risk Analyst',      tier: 2, baseCost: 200, baseProd:   3, description: 'Analyzes and mitigates organizational risks.' , nextRoleId: 'sec_mgr', sprite: '📊' },

  { id: 'threat_hunter', name: 'Threat Hunter',   tier: 3, baseCost:2000, baseProd:  20, description: 'Proactively searches for hidden threats.' , nextRoleId: 'ciso', sprite: '🕵️' },
  { id: 'ir_lead', name: 'Incident Response Lead', tier: 3, baseCost:1800, baseProd:  18, description: 'Leads response to major security incidents.', sprite: '🚨' },
  { id: 'redteam', name: 'Red Team Lead',    tier: 3, baseCost:2200, baseProd:  22, description: 'Leads adversary simulation exercises.', sprite: '👑⚔️' },
  { id: 'sec_mgr', name: 'Security Manager', tier: 3, baseCost:1500, baseProd:  15, description: 'Coordinates teams and security programs.', sprite: '👨‍💼' },

  { id: 'ciso',    name: 'CISO',              tier: 4, baseCost: 0,    baseProd:   0, description: 'Chief Information Security Officer: sets strategy and policies.', sprite: '👨‍💼⭐' }
]

// Simple news headlines for the ticker (learn terms casually)
const NEWS_HEADLINES: NewsItem[] = [
  { id: 'n1', text: 'New zero-day exploit discovered – companies rush to patch!' },
  { id: 'n2', text: 'SOC Analysts detect unusual traffic spike.' },
  { id: 'n3', text: 'Pen Testers break into test network – fun exercises!' },
  { id: 'n4', text: 'Risk Analyst identifies critical compliance gap.' },
  { id: 'n5', text: 'Threat Hunter uncovers hidden malware in logs.' },
  { id: 'n6', text: 'Major breach averted by rapid IR team response.' }
]

// Achievement definitions for gamification system
const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first_click',
    title: 'First Click',
    name: 'First Click',
    description: 'Click the defend button for the first time',
    icon: '👆',
    unlocked: false,
    condition: {
      type: 'clicks',
      target: 1
    },
    reward: { sp: 5 }
  },
  {
    id: 'quick_clicker',
    title: 'Quick Clicker',
    name: 'Quick Clicker',
    description: 'Getting Started - 5 clicks completed!',
    icon: '⚡',
    unlocked: false,
    condition: {
      type: 'clicks',
      target: 5
    },
    reward: { sp: 10 }
  },
  {
    id: 'click_master',
    title: 'Click Master',
    name: 'Click Master', 
    description: 'Click the defend button 100 times',
    icon: '🖱️',
    unlocked: false,
    condition: {
      type: 'clicks',
      target: 100
    },
    reward: { sp: 50 }
  },
  {
    id: 'sp_collector',
    title: 'SP Collector',
    name: 'SP Collector',
    description: 'Earn 1000 total Security Points',
    icon: '💰',
    unlocked: false,
    condition: {
      type: 'sp_earned',
      target: 1000
    },
    reward: { sp: 100 }
  }
]

// ----------------------------------------
// --- MAIN GAME COMPONENT ---
// ----------------------------------------

export default function CyberClickerGame() {
  // --- CONSTANTS ---
  const STORAGE_KEY = 'CyberClickerSave'
  
  // Notification system constants
  const MAX_VISIBLE_NOTIFICATIONS = 5
  const NOTIFICATION_AUTO_DISMISS_MS = 3000

  // --- ENTERPRISE PERSISTENCE INTEGRATION ---
  const enterprisePersistenceResult = useEnterprisePersistence() || {}
  const { persistenceManager = null, isLoading: persistenceLoading = false, error: persistenceError = null } = enterprisePersistenceResult

  // --- ENHANCED GAME STATE HOOKS ---
  // Core game mechanics
  const [sp, setSp] = useState<number>(() => loadState().sp)
  const [totalSpEarned, setTotalSpEarned] = useState<number>(() => loadState().totalSpEarned)
  const [totalClicks, setTotalClicks] = useState<number>(() => loadState().totalClicks)
  const [clickValue, setClickValue] = useState<number>(1)
  const [spPerSec, setSpPerSec] = useState<number>(0)
  
  // Employee and progression
  const [hired, setHired] = useState<Record<string, number>>(() => loadState().hired)
  const [unlockedRoles, setUnlockedRoles] = useState<Set<string>>(new Set(['soc1', 'sup_spec', 'vuln1', 'auditor']))
  
  // UI and interaction
  const [notifications, setNotifications] = useState<string[]>([])
  const [clickEffect, setClickEffect] = useState<boolean>(false)
  const [showProgressMilestone, setShowProgressMilestone] = useState<boolean>(false)
  const [newsIndex, setNewsIndex] = useState<number>(0)
  const [showTutorial, setShowTutorial] = useState<boolean>(false)
  const [learnMode, setLearnMode] = useState<boolean>(false)
  
  // Achievement and progression tracking
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<string[]>(() => loadState().achievements)
  const [scenariosCompleted, setScenariosCompleted] = useState<string[]>(() => loadState().scenarios)
  const [dayStreak, setDayStreak] = useState<number>(() => loadState().dayStreak)
  const [playerLevel, setPlayerLevel] = useState<number>(() => loadState().playerLevel)
  
  // Active events and interactions
  const [activeThreats, setActiveThreats] = useState<ThreatEvent[]>([])
  const [selectedScenario, setSelectedScenario] = useState<LearningScenario | null>(null)
  const [clickParticles, setClickParticles] = useState<{id: number, x: number, y: number}[]>([])
  
  // Educational features
  const [codex, setCodex] = useState<Record<string, boolean>>(() => loadState().codex)
  const [educationalPopup, setEducationalPopup] = useState<{role: CareerRole, show: boolean}>({role: ROLE_DEFINITIONS[0], show: false})

  // ----------------------------------------
  // --- ENHANCED PERSISTENCE: LOAD & SAVE STATE ---
  // ----------------------------------------
  
  // Define enhanced shape of saved state in localStorage
  interface SaveState { 
    sp: number
    totalSpEarned: number
    totalClicks: number
    hired: Record<string, number>
    codex: Record<string, boolean>
    achievements: string[]
    scenarios: string[]
    dayStreak: number
    playerLevel: number
    lastPlayDate: string
  }
  
  // Load saved state or use defaults
  function loadState(): SaveState {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (json) {
        const saved = JSON.parse(json)
        
        // 🔍 Validate data integrity before using
        const validation = validateGameState(saved)
        if (!validation.isValid) {
          console.warn('Game state validation failed:', validation.errors)
          // Return default state if validation fails
          return getDefaultState()
        }
        
        // Check if it's a new day for streak tracking
        const today = new Date().toDateString()
        const lastPlay = saved.lastPlayDate
        if (lastPlay !== today) {
          // Reset or increment streak based on consecutive days
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          saved.dayStreak = lastPlay === yesterday.toDateString() ? saved.dayStreak + 1 : 1
          saved.lastPlayDate = today
        }
        return saved
      }
    } catch (error) {
      console.warn('Failed to load game state from localStorage:', error)
    }
    
    return getDefaultState()
  }

  // Extract default state creation to separate function
  function getDefaultState(): SaveState {
    // Default state: starter SP, no hires, basic codex unlocked
    const defaultHired: Record<string, number> = {}
    ROLE_DEFINITIONS.forEach(r => defaultHired[r.id] = 0)
    
    const defaultCodex: Record<string, boolean> = {}
    ROLE_DEFINITIONS.forEach(r => defaultCodex[r.id] = r.tier === 1)
    
    return { 
      sp: 10, 
      totalSpEarned: 0,
      totalClicks: 0,
      hired: defaultHired, 
      codex: defaultCodex,
      achievements: [],
      scenarios: [],
      dayStreak: 1,
      playerLevel: 1,
      lastPlayDate: new Date().toDateString()
    }
  }

  // --- ENTERPRISE PERSISTENCE LOADING ---
  // Load from enterprise persistence asynchronously on mount
  useEffect(() => {
    const loadFromEnterprisePersistence = async () => {
      try {
        // Check if persistence manager is available
        if (!persistenceManager || 
            !persistenceManager.loadGameState || 
            typeof persistenceManager.loadGameState !== 'function') {
          console.warn('Failed to load from enterprise persistence: persistence manager not available')
          return
        }

        const result = await persistenceManager.loadGameState()
        if (result.gameState) {
          const cyberClickerProgress = result.gameState.gameProgress?.find(
            (game) => game.gameId === 'cyber-clicker'
          )
          
          if (cyberClickerProgress && cyberClickerProgress.completedAt) {
            // Load from both enterprise persistence and localStorage
            const json = localStorage.getItem(STORAGE_KEY)
            if (json) {
              const saved = JSON.parse(json) as SaveState
              
              // Validate the data
              const validation = validateGameState(saved)
              if (validation.isValid) {
                setSp(saved.sp || cyberClickerProgress.highScore || 0)
                setTotalSpEarned(saved.totalSpEarned || 0)
                setTotalClicks(saved.totalClicks || 0)
                setPlayerLevel(saved.playerLevel || result.gameState.playerStats.level || 1)
                setHired(saved.hired || {})
                setAchievementsUnlocked(saved.achievements || [])
                setScenariosCompleted(saved.scenarios || [])
                setDayStreak(saved.dayStreak || 1)
                setCodex(saved.codex || {})
                
                console.log('Successfully loaded game state from enterprise persistence + localStorage')
              } else {
                console.warn('Loaded data failed validation:', validation.errors)
              }
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load from enterprise persistence:', error)
      }
    }

    // Only load if persistence manager is ready
    if (!persistenceLoading && persistenceManager) {
      loadFromEnterprisePersistence()
    }
  }, [persistenceManager, persistenceLoading])

  // --- ENHANCED SAVE WITH ENTERPRISE PERSISTENCE ---
  // Save enhanced state to localStorage whenever key values change
  useEffect(() => {
    const saveState = async () => {
      try {
        const save: SaveState = { 
          sp, 
          totalSpEarned, 
          totalClicks, 
          hired, 
          codex, 
          achievements: achievementsUnlocked,
          scenarios: scenariosCompleted,
          dayStreak,
          playerLevel,
          lastPlayDate: new Date().toDateString()
        }

        // 🧹 Sanitize data before saving
        const sanitizedSave = safeDataSanitization(save)
        
        // Add metadata to indicate sanitization
        const enrichedSave = {
          ...sanitizedSave,
          _metadata: {
            sanitized: true,
            savedAt: new Date().toISOString(),
            version: '1.0.0'
          }
        }

        // Save to localStorage (always)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enrichedSave))

        // Save to enterprise persistence if available
        if (persistenceManager && 
            persistenceManager.saveGameState && 
            typeof persistenceManager.saveGameState === 'function') {
          
          const gameState = {
            playerStats: {
              level: playerLevel,
              totalXP: totalSpEarned,
              gamesCompleted: Math.floor(sp / 1000),
              achievementsUnlocked: achievementsUnlocked.length,
              streakDays: dayStreak,
              lastVisit: new Date().toISOString(),
              timeSpent: 0
            },
            achievements: [], // Empty array for now, will be populated with proper achievement objects later
            gameProgress: [
              {
                gameId: 'cyber-clicker',
                completed: playerLevel >= 10,
                highScore: sp,
                timeSpent: 0,
                attempts: 1,
                hintsUsed: 0,
                completedAt: playerLevel >= 10 ? new Date().toISOString() : undefined
              }
            ],
            skillProgress: {
              cryptography: Math.min(100, playerLevel * 10),
              passwordSecurity: Math.min(100, Object.values(hired).reduce((acc, count) => acc + count, 0) * 5),
              phishingDetection: 0,
              socialEngineering: 0,
              networkSecurity: Math.min(100, spPerSec * 2),
              incidentResponse: Math.min(100, clickValue * 5)
            },
            preferences: {
              soundEnabled: true,
              difficulty: 'normal',
              theme: 'cyber'
            },
            sessionInfo: {
              sessionId: `cyber_clicker_${Date.now()}`,
              startTime: new Date().toISOString(),
              lastActivity: new Date().toISOString()
            }
          }

          await persistenceManager.saveGameState(gameState)
        } else {
          console.warn('Enterprise persistence not available, using localStorage only')
        }
      } catch (error) {
        console.warn('Failed to save game state:', error)
        // Fallback to basic localStorage save
        try {
          const basicSave: SaveState = { 
            sp, 
            totalSpEarned, 
            totalClicks, 
            hired, 
            codex, 
            achievements: achievementsUnlocked,
            scenarios: scenariosCompleted,
            dayStreak,
            playerLevel,
            lastPlayDate: new Date().toDateString()
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(basicSave))
        } catch (fallbackError) {
          console.error('All persistence mechanisms failed:', fallbackError)
        }
      }
    }

    saveState()
  }, [sp, totalSpEarned, totalClicks, hired, codex, achievementsUnlocked, scenariosCompleted, dayStreak, playerLevel, persistenceManager, spPerSec, clickValue])

  // ----------------------------------------
  // --- SP PRODUCTION LOOP (AUTO IDLE) ---
  // ----------------------------------------
  useEffect(() => {
    // calculate total SP/sec whenever hired counts change
    let total = 0
    ROLE_DEFINITIONS.forEach(role => {
      const count = hired[role.id] || 0
      total += role.baseProd * count
    })
    setSpPerSec(total)

    // set up interval to add auto SP
    const interval = setInterval(() => {
      setSp(prev => prev + total)
    }, 1000) // each second
    return () => clearInterval(interval)
  }, [hired])

  // ----------------------------------------
  // --- ACHIEVEMENT SYSTEM ---
  // ----------------------------------------
  
  // Unlock achievement with rewards
  const unlockAchievement = useCallback((achievement: Achievement) => {
    console.log('🏆 unlockAchievement called for:', achievement.id)
    
    setAchievementsUnlocked(prev => {
      console.log('🏆 Previous achievements:', prev)
      const newAchievements = [...prev, achievement.id]
      console.log('🏆 New achievements:', newAchievements)
      return newAchievements
    })
    
    const notificationMsg = `🏆 Achievement Unlocked: ${achievement.name}!`
    console.log('🏆 Showing notification:', notificationMsg)
    showNotification(notificationMsg)
    
    // Apply rewards safely with null checks
    if (achievement.reward?.sp) {
      console.log('🏆 Applying SP reward:', achievement.reward.sp)
      setSp(prev => prev + (achievement.reward?.sp || 0))
      setTotalSpEarned(prev => prev + (achievement.reward?.sp || 0))
    }
    if (achievement.reward?.clickMultiplier) {
      setClickValue(prev => prev * (achievement.reward?.clickMultiplier || 1))
    }
    if (achievement.reward?.unlockRole) {
      setUnlockedRoles(prev => new Set([...prev, achievement.reward?.unlockRole!]))
    }
  }, [])

  // Achievement checking system
  const checkAchievements = useCallback(() => {
    console.log('🔍 checkAchievements called')
    
    // Create simplified gameState for achievement checking
    const gameState = {
      sp,
      totalSpEarned,
      totalClicks,
      hired,
      dayStreak,
      achievementsUnlocked,
      scenariosCompleted
    }
    
    console.log('🔍 gameState:', { 
      totalClicks: gameState.totalClicks, 
      achievementsUnlocked: gameState.achievementsUnlocked 
    })
    
    // Check each achievement
    ACHIEVEMENT_DEFINITIONS.forEach(achievement => {
      let conditionMet = false
      
      // Evaluate condition based on type
      switch (achievement.condition.type) {
        case 'clicks':
          conditionMet = gameState.totalClicks >= achievement.condition.target
          console.log(`🔍 ${achievement.id}: clicks ${gameState.totalClicks} >= ${achievement.condition.target} = ${conditionMet}`)
          break
        case 'sp_earned':
          conditionMet = gameState.totalSpEarned >= achievement.condition.target
          break
        case 'roles_hired':
          const totalHired = Object.values(gameState.hired).reduce((sum, count) => sum + count, 0)
          conditionMet = totalHired >= achievement.condition.target
          break
        case 'scenarios_completed':
          conditionMet = gameState.scenariosCompleted.length >= achievement.condition.target
          break
        default:
          conditionMet = false
      }
      
      const alreadyUnlocked = gameState.achievementsUnlocked.includes(achievement.id)
      console.log(`🔍 ${achievement.id}: already unlocked = ${alreadyUnlocked}, condition met = ${conditionMet}`)
      
      if (!alreadyUnlocked && conditionMet) {
        console.log(`🔍 Unlocking achievement: ${achievement.id}`)
        unlockAchievement(achievement)
      }
    })
  }, [sp, totalSpEarned, totalClicks, hired, dayStreak, achievementsUnlocked, scenariosCompleted, unlockAchievement])

  // ----------------------------------------
  // --- ENHANCED CLICK HANDLER WITH VISUAL FEEDBACK ---
  // ----------------------------------------
  const handleClick = useCallback((event?: React.MouseEvent) => {
    console.log('🖱️ handleClick called')
    
    // Trigger click effect for visual feedback
    setClickEffect(true)
    setTimeout(() => setClickEffect(false), 200)
    
    // Add SP and track statistics
    setSp(prev => {
      console.log('🖱️ SP changing from', prev, 'to', prev + clickValue)
      return prev + clickValue
    })
    setTotalSpEarned(prev => prev + clickValue)
    setTotalClicks(prev => {
      const newTotalClicks = prev + 1
      console.log('🖱️ totalClicks changing from', prev, 'to', newTotalClicks)
      
      // Show progress milestones at regular intervals for middle school motivation
      if (newTotalClicks % 10 === 0 || newTotalClicks === 5 || newTotalClicks === 15) {
        setShowProgressMilestone(true)
        setTimeout(() => setShowProgressMilestone(false), 2000)
      }
      
      return newTotalClicks
    })
    
    // Create particle effect at click location
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const particleId = Date.now() + Math.random()
      
      setClickParticles(prev => [...prev, { id: particleId, x, y }])
      
      // Remove particle after animation
      setTimeout(() => {
        setClickParticles(prev => prev.filter(p => p.id !== particleId))
      }, 1000)
    }
  }, [clickValue])

  // 🔧 GREEN PHASE FIX: Check achievements whenever totalClicks changes
  useEffect(() => {
    console.log('🔍 useEffect triggered by totalClicks change:', totalClicks)
    if (totalClicks > 0) { // Only check if we have clicks (avoid initial render)
      checkAchievements()
    }
  }, [totalClicks, checkAchievements])
  
    // show a quick notification (+1) or animation if desired
    // (omitted for brevity)

  // ----------------------------------------
  // --- HIRING AND PROMOTION LOGIC ---
  // ----------------------------------------
  
  // hireRole: buy one unit of an entry-level role
  function hireRole(role: CareerRole) {
    const cost = Math.floor(role.baseCost * Math.pow(1.15, hired[role.id]))
    if (sp < cost) return // not enough SP
    setSp(prev => prev - cost)
    setHired(prev => ({ ...prev, [role.id]: prev[role.id] + 1 }))
    showNotification(`Hired 1 ${role.name}!`)
    unlockCodex(role.id)
  }

  // promoteRole: convert one unit of role into next tier
  function promoteRole(role: CareerRole) {
    if (!role.nextRoleId) return // can't promote further
    if (hired[role.id] < 1) return // none to promote
    const cost = Math.floor(role.baseCost * 2 * role.tier) // promotion cost heuristic
    if (sp < cost) return
    setSp(prev => prev - cost)
    // decrement old and increment new
    setHired(prev => ({
      ...prev,
      [role.id]: prev[role.id] - 1,
      [role.nextRoleId!]: prev[role.nextRoleId!] + 1
    }))
    showNotification(`Promoted 1 ${role.name} → ${getRole(role.nextRoleId!).name}!`)
    unlockCodex(role.nextRoleId!)
  }

  // unlockCodex: mark a role's codex entry as unlocked
  function unlockCodex(roleId: string) {
    setCodex(prev => ({ ...prev, [roleId]: true }))
  }

  // getRole helper by id
  function getRole(id: string) {
    return ROLE_DEFINITIONS.find(r => r.id === id)!
  }

  // ----------------------------------------
  // --- NEWS TICKER LOGIC ---
  // ----------------------------------------
  useEffect(() => {
    // rotate headline every 5 seconds
    const timeout = setTimeout(() => {
      setNewsIndex((i) => (i + 1) % NEWS_HEADLINES.length)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [newsIndex])

  // ----------------------------------------
  // --- NOTIFICATIONS (TOASTS) ---
  // ----------------------------------------
  function showNotification(msg: string) {
    setNotifications(prev => [...prev, msg])
    // remove after configured timeout
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, NOTIFICATION_AUTO_DISMISS_MS)
  }

  // ----------------------------------------
  // --- RENDERING UI SECTIONS ---
  // ----------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with game title */}
      <header className="p-4 bg-blue-800 text-center">
        <h1 className="text-3xl font-bold">Cybersecurity Career Clicker</h1>
        <p className="text-sm">Build your cyber firm and explore career paths!</p>
      </header>

      {/* Notifications (improved containment box) */}
      <div 
        data-testid="notification-container"
        className="fixed top-4 right-4 space-y-2 max-h-96 overflow-y-auto z-50 max-w-xs"
      >
        <AnimatePresence>
          {notifications.slice(-MAX_VISIBLE_NOTIFICATIONS).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 50 }}
              className="bg-green-500 text-black px-4 py-2 rounded shadow text-sm"
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Click Effect Animation for middle school engagement */}
      {clickEffect && (
        <div 
          data-testid="click-effect-animation"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-2xl"
          >
            ⚡
          </motion.div>
        </div>
      )}

      {/* Progress Milestone for motivation */}
      {showProgressMilestone && (
        <div 
          data-testid="progress-milestone"
          className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-bold"
          >
            🎉 Awesome progress! Keep going! 🎉
          </motion.div>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Left: Clicker Button and Stats */}
        <div className="col-span-2 space-y-4">
          {/* Stats panel */}
          <div className="bg-gray-800 p-4 rounded grid grid-cols-2 gap-4">
            {/* SP display */}
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.floor(sp)}</div>
              <div className="text-sm">Security Points (SP)</div>
            </div>
            {/* SP/sec display */}
            <div className="text-center">
              <div className="text-2xl font-bold">{spPerSec.toFixed(1)}</div>
              <div className="text-sm">SP per sec</div>
            </div>
          </div>

          {/* Clicker button */}
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-8 rounded text-2xl font-bold shadow-lg click-effect-enabled"
          >
            DEFEND (+{clickValue} SP)
          </button>

          {/* News ticker */}
          <div className="bg-gray-800 p-2 rounded">
            <span className="font-semibold">News:</span> {NEWS_HEADLINES[newsIndex].text}
          </div>
        </div>

        {/* Right: Roles and Codex Tabs */}
        <div className="space-y-4">
          {/* Firm Office - Visual representation of hired employees */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="font-bold mb-2">Your Cybersecurity Firm Office</h2>
            <div 
              data-testid="firm-office"
              className="firm-office-container grid grid-cols-4 gap-2 min-h-32 p-2 bg-gray-700 rounded"
            >
              {/* Show team count */}
              <div className="col-span-4 text-center text-sm mb-2">
                <span data-testid="team-count">
                  Team Size: {Object.values(hired).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
              
              {/* Render employee sprites */}
              {Object.values(hired).reduce((sum, count) => sum + count, 0) === 0 ? (
                <div className="col-span-4 text-center text-gray-400 text-sm">
                  Empty office - hire your first cybersecurity professional!
                </div>
              ) : (
                ROLE_DEFINITIONS.map(role => {
                  const count = hired[role.id] || 0
                  return Array.from({ length: count }, (_, index) => (
                    <div
                      key={`${role.id}-${index}`}
                      data-testid={`employee-sprite-${role.id}`}
                      data-role-type={role.id}
                      data-sprite-icon={role.sprite}
                      title={`${role.name}: ${role.description}`}
                      className={`sprite-animated sprite-tier-${role.tier} w-12 h-12 flex items-center justify-center bg-blue-600 rounded-lg text-2xl cursor-pointer hover:bg-blue-500 transition-colors`}
                      onClick={() => {
                        // Show role details when sprite is clicked
                        showNotification(`${role.name}: ${role.description}`)
                      }}
                    >
                      {role.sprite}
                    </div>
                  ))
                })
              )}
            </div>
          </div>

          {/* Hire / Promote Panel */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="font-bold mb-2">Hire & Promote</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ROLE_DEFINITIONS.map(role => {
                // only show entry roles or unlocked by codex
                if (role.tier > 1 && !codex[role.id]) return null
                const count = hired[role.id] || 0
                const cost = Math.floor(role.baseCost * Math.pow(1.15, count))
                return (
                  <div key={role.id} className="flex justify-between items-center">
                    {/* Role info */}
                    <div>
                      <div className="font-semibold">{role.name} (x{count})</div>
                      <div className="text-xs">{role.description}</div>
                    </div>
                    {/* Hire vs Promote */}
                    <div className="space-x-2">
                      {/* Hire button for tier1 */}
                      {role.tier === 1 && (
                        <button
                          onClick={() => hireRole(role)}
                          disabled={sp < cost}
                          className="px-2 py-1 bg-green-600 rounded disabled:opacity-50"
                        >Hire {cost} SP</button>
                      )}
                      {/* Promote button if nextRole exists */}
                      {role.nextRoleId && count > 0 && (
                        <button
                          onClick={() => promoteRole(role)}
                          className="px-2 py-1 bg-yellow-600 rounded"
                        >Promote</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Codex / Career Library */}
          <div className="bg-gray-800 p-4 rounded max-h-64 overflow-y-auto">
            <h2 className="font-bold mb-2">Career Codex</h2>
            {ROLE_DEFINITIONS.map(role => codex[role.id] && (
              <div key={role.id} className="mb-2 border-b border-gray-600 pb-1">
                <div className="font-semibold">{role.name}</div>
                <div className="text-xs">Level {role.tier} career</div>
                <div className="text-xs italic">{role.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
