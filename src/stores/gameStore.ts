import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameStatePersistenceManager, StorageMechanism } from '../utils/persistence/GameStatePersistence'

/**
 * 🎮 ENHANCED GAME STORE WITH SECURE PERSISTENCE
 * 
 * Now featuring enterprise-grade security with:
 * - Secure cookie-based persistence that survives browser restarts
 * - COPPA compliance for educational environments  
 * - Hybrid storage (localStorage + cookies + memory)
 * - Automatic data sanitization and validation
 * - Real-time audit logging and performance monitoring
 * 
 * @author Feature Engineer Agent (Enhanced)
 * @version 2.0.0
 * @since 2025-01-15
 */

// Initialize our advanced persistence manager
const persistenceManager = new GameStatePersistenceManager()

// Types for our gaming state
interface PlayerStats {
  level: number
  totalXP: number
  gamesCompleted: number
  achievementsUnlocked: number
  streakDays: number
  lastVisit: string
  timeSpent: number // in minutes
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  category: 'cryptography' | 'passwords' | 'phishing' | 'general' | 'social'
}

interface GameProgress {
  gameId: string
  completed: boolean
  highScore: number
  timeSpent: number
  attempts: number
  hintsUsed: number
  completedAt?: string
}

interface SkillProgress {
  cryptography: number
  passwordSecurity: number
  phishingDetection: number
  socialEngineering: number
  networkSecurity: number
  incidentResponse: number
}

interface AICompanionState {
  isVisible: boolean
  mood: 'happy' | 'excited' | 'curious' | 'encouraging' | 'thinking'
  messagesCount: number
  lastInteraction: string
  helpTopics: string[]
}

interface GameState {
  // Player progression
  playerStats: PlayerStats
  achievements: Achievement[]
  gameProgress: GameProgress[]
  skillProgress: SkillProgress
  
  // AI Companion
  aiCompanion: AICompanionState
  
  // UI State
  currentGame: string | null
  showAchievements: boolean
  showStats: boolean
  soundEnabled: boolean
  
  // 🆕 ENHANCED PERSISTENCE FEATURES
  persistenceHealth: {
    available: boolean
    secure: boolean
    compliant: boolean
    lastCheck: string
  }
  
  // Actions
  addXP: (amount: number) => void
  unlockAchievement: (id: string, title: string, description: string, category?: string) => void
  updateGameProgress: (gameId: string, progress: Partial<GameProgress>) => void
  updateSkillProgress: (skill: keyof SkillProgress, increment: number) => void
  toggleAICompanion: () => void
  updateAICompanion: (updates: Partial<AICompanionState>) => void
  updateAICompanionMood: (mood: AICompanionState['mood']) => void
  recordTimeSpent: (minutes: number) => void
  updateStreak: () => void
  setCurrentGame: (gameId: string | null) => void
  toggleSound: () => void
  
  // 🆕 ENHANCED PERSISTENCE ACTIONS
  forceSyncToCookies: () => Promise<boolean>
  clearAllData: () => Promise<boolean>
  checkPersistenceHealth: () => Promise<void>
  getPerformanceMetrics: () => any
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // Initial state
      playerStats: {
        level: 1,
        totalXP: 0,
        gamesCompleted: 0,
        achievementsUnlocked: 0,
        streakDays: 0,
        lastVisit: new Date().toISOString(),
        timeSpent: 0
      },
      
      achievements: [
        {
          id: 'first_password',
          title: 'Password Novice',
          description: 'Created your first secure password',
          icon: '🔐',
          category: 'passwords'
        },
        {
          id: 'fortress_master',
          title: 'Fortress Master',
          description: 'Completed the Password Fortress escape room',
          icon: '🏰',
          category: 'passwords'
        },
        {
          id: 'two_factor_hero',
          title: 'Two-Factor Hero',
          description: 'Mastered multi-factor authentication',
          icon: '🛡️',
          category: 'passwords'
        },
        {
          id: 'clicker_champion',
          title: 'Defense Champion',
          description: 'Built an unstoppable cyber defense network',
          icon: '⚡',
          category: 'general'
        },
        {
          id: 'network_navigator',
          title: 'Network Navigator',
          description: 'Successfully navigated the network maze',
          icon: '🌐',
          category: 'general'
        }
      ],
      gameProgress: [],
      skillProgress: {
        cryptography: 0,
        passwordSecurity: 0,
        phishingDetection: 0,
        socialEngineering: 0,
        networkSecurity: 0,
        incidentResponse: 0
      },
      
      aiCompanion: {
        isVisible: false,
        mood: 'happy',
        messagesCount: 0,
        lastInteraction: new Date().toISOString(),
        helpTopics: []
      },
      
      // 🆕 PERSISTENCE HEALTH MONITORING
      persistenceHealth: {
        available: true,
        secure: false, // Will be updated on first health check
        compliant: false, // Will be updated on first health check
        lastCheck: new Date().toISOString()
      },
      
      currentGame: null,
      showAchievements: false,
      showStats: false,
      soundEnabled: true,
      
      // Actions
      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.playerStats.totalXP + amount
          const newLevel = Math.floor(newXP / 100) + 1 // Level up every 100 XP
          
          return {
            playerStats: {
              ...state.playerStats,
              totalXP: newXP,
              level: newLevel
            }
          }
        })
      },
      
      unlockAchievement: (id: string, title: string, description: string, category = 'general') => {
        set((state) => {
          // Check if achievement already exists
          if (state.achievements.find(a => a.id === id)) {
            return state
          }
          
          const newAchievement: Achievement = {
            id,
            title,
            description,
            icon: getCategoryIcon(category),
            unlockedAt: new Date().toISOString(),
            category: category as Achievement['category']
          }
          
          return {
            achievements: [...state.achievements, newAchievement],
            playerStats: {
              ...state.playerStats,
              achievementsUnlocked: state.playerStats.achievementsUnlocked + 1
            }
          }
        })
      },
      
      updateGameProgress: (gameId: string, progress: Partial<GameProgress>) => {
        set((state) => {
          const existingProgress = state.gameProgress.find(p => p.gameId === gameId)
          
          if (existingProgress) {
            return {
              gameProgress: state.gameProgress.map(p =>
                p.gameId === gameId ? { ...p, ...progress } : p
              )
            }
          } else {
            const newProgress: GameProgress = {
              gameId,
              completed: false,
              highScore: 0,
              timeSpent: 0,
              attempts: 0,
              hintsUsed: 0,
              ...progress
            }
            
            return {
              gameProgress: [...state.gameProgress, newProgress],
              playerStats: progress.completed 
                ? { ...state.playerStats, gamesCompleted: state.playerStats.gamesCompleted + 1 }
                : state.playerStats
            }
          }
        })
      },
      
      updateSkillProgress: (skill: keyof SkillProgress, increment: number) => {
        set((state) => ({
          skillProgress: {
            ...state.skillProgress,
            [skill]: Math.min(100, state.skillProgress[skill] + increment)
          }
        }))
      },
      
      toggleAICompanion: () => {
        set((state) => ({
          aiCompanion: {
            ...state.aiCompanion,
            isVisible: !state.aiCompanion.isVisible,
            lastInteraction: new Date().toISOString()
          }
        }))
      },
      
      updateAICompanionMood: (mood: AICompanionState['mood']) => {
        set((state) => ({
          aiCompanion: {
            ...state.aiCompanion,
            mood
          }
        }))
      },
      
      updateAICompanion: (updates: Partial<AICompanionState>) => {
        set((state) => ({
          aiCompanion: {
            ...state.aiCompanion,
            ...updates
          }
        }))
      },
      
      recordTimeSpent: (minutes: number) => {
        set((state) => ({
          playerStats: {
            ...state.playerStats,
            timeSpent: state.playerStats.timeSpent + minutes
          }
        }))
      },
      
      updateStreak: () => {
        set((state) => {
          const today = new Date().toDateString()
          const lastVisit = new Date(state.playerStats.lastVisit).toDateString()
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          
          let newStreak = state.playerStats.streakDays
          
          if (lastVisit === yesterday) {
            newStreak += 1
          } else if (lastVisit !== today) {
            newStreak = 1
          }
          
          return {
            playerStats: {
              ...state.playerStats,
              streakDays: newStreak,
              lastVisit: new Date().toISOString()
            }
          }
        })
      },
      
      setCurrentGame: (gameId: string | null) => {
        set({ currentGame: gameId })
      },
      
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }))
      },
      
      // 🆕 ENHANCED PERSISTENCE ACTIONS
      
      /**
       * 🍪 FORCE SYNC TO COOKIES
       * 
       * Manually forces current state to be saved to secure cookies
       */
      forceSyncToCookies: async () => {
        try {
          const state = useGameStore.getState()
          const result = await persistenceManager.saveGameState(state)
          
          // Update persistence health based on results
          set({
            persistenceHealth: {
              available: result.success,
              secure: result.mechanisms.includes(StorageMechanism.COOKIES),
              compliant: result.warnings.length === 0,
              lastCheck: new Date().toISOString()
            }
          })
          
          return result.success
        } catch (error) {
          console.error('Failed to sync to cookies:', error)
          return false
        }
      },
      
      /**
       * 🧹 CLEAR ALL DATA
       * 
       * Securely removes all stored game data from all storage mechanisms
       */
      clearAllData: async () => {
        try {
          const result = await persistenceManager.clearGameState()
          
          if (result.success) {
            // Reset to initial state
            set({
              playerStats: {
                level: 1,
                totalXP: 0,
                gamesCompleted: 0,
                achievementsUnlocked: 0,
                streakDays: 0,
                lastVisit: new Date().toISOString(),
                timeSpent: 0
              },
              achievements: [],
              gameProgress: [],
              skillProgress: {
                cryptography: 0,
                passwordSecurity: 0,
                phishingDetection: 0,
                socialEngineering: 0,
                networkSecurity: 0,
                incidentResponse: 0
              },
              persistenceHealth: {
                available: true,
                secure: false,
                compliant: true,
                lastCheck: new Date().toISOString()
              }
            })
          }
          
          return result.success
        } catch (error) {
          console.error('Failed to clear all data:', error)
          return false
        }
      },
      
      /**
       * 🏥 CHECK PERSISTENCE HEALTH
       * 
       * Performs comprehensive health check of all storage mechanisms
       */
      checkPersistenceHealth: async () => {
        try {
          const health = await persistenceManager.healthCheck()
          
          set({
            persistenceHealth: {
              available: health.available,
              secure: health.secure,
              compliant: health.compliant,
              lastCheck: new Date().toISOString()
            }
          })
        } catch (error) {
          console.error('Health check failed:', error)
          set({
            persistenceHealth: {
              available: false,
              secure: false,
              compliant: false,
              lastCheck: new Date().toISOString()
            }
          })
        }
      },
      
      /**
       * 📊 GET PERFORMANCE METRICS
       * 
       * Returns detailed performance metrics for the persistence system
       */
      getPerformanceMetrics: () => {
        return persistenceManager.getPerformanceMetrics()
      }
    }),
    {
      name: 'ewu-cyber-games-storage',
      // Only persist certain parts of the state for COPPA compliance
      partialize: (state) => ({
        playerStats: state.playerStats,
        achievements: state.achievements,
        gameProgress: state.gameProgress,
        skillProgress: state.skillProgress,
        soundEnabled: state.soundEnabled
      })
    }
  )
)

// Helper function to get category icons
function getCategoryIcon(category: string): string {
  const icons = {
    cryptography: '🔐',
    passwords: '🛡️',
    phishing: '🎣',
    general: '⭐',
    social: '👥',
    network: '🌐',
    incident: '🚨'
  }
  return icons[category as keyof typeof icons] || '⭐'
}

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_GAME: {
    id: 'first-game',
    title: 'First Steps',
    description: 'Complete your first cybersecurity game!',
    category: 'general'
  },
  PASSWORD_MASTER: {
    id: 'password-master', 
    title: 'Password Master',
    description: 'Create 10 strong passwords in Password Fortress',
    category: 'passwords'
  },
  CRYPTO_DETECTIVE: {
    id: 'crypto-detective',
    title: 'Crypto Detective',
    description: 'Solve 5 encryption puzzles',
    category: 'cryptography'
  },
  PHISHING_FIGHTER: {
    id: 'phishing-fighter',
    title: 'Phishing Fighter',
    description: 'Identify 10 phishing attempts correctly',
    category: 'phishing'
  },
  STREAK_WARRIOR: {
    id: 'streak-warrior',
    title: 'Streak Warrior',
    description: 'Play games for 7 days in a row',
    category: 'general'
  },
  KNOWLEDGE_SEEKER: {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Ask Swoop Bot 25 questions',
    category: 'general'
  }
} as const

export default useGameStore
