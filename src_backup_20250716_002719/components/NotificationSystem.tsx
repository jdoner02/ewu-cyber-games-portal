'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, Zap, Target } from 'lucide-react'

interface Notification {
  id: string
  type: 'achievement' | 'reward' | 'level-up' | 'streak' | 'daily'
  title: string
  message: string
  icon?: React.ReactNode
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const typeConfig = {
  achievement: {
    icon: <Shield className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    borderColor: 'border-yellow-400'
  },
  reward: {
    icon: <Lock className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-400'
  },
  'level-up': {
    icon: <Zap className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-400'
  },
  streak: {
    icon: <Zap className="w-6 h-6" />,
    color: 'from-green-500 to-teal-500',
    borderColor: 'border-green-400'
  },
  daily: {
    icon: <Target className="w-6 h-6" />,
    color: 'from-red-500 to-pink-500',
    borderColor: 'border-red-400'
  }
}

export default function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Play sound effect based on notification type
  const playSound = useCallback((type: string) => {
    if (!soundEnabled) return
    
    try {
      // Create simple audio feedback using Web Audio API
      const audioContext = new (window.AudioContext || (window as unknown as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Different frequencies for different notification types
      const frequencies = {
        achievement: [440, 554, 659], // Happy chord
        reward: [523, 659, 784], // Major chord
        'level-up': [659, 784, 988], // Higher pitch progression
        streak: [440, 523, 659, 784], // Rising sequence
        daily: [392, 440, 523] // Simple progression
      }
      
      const freqArray = frequencies[type as keyof typeof frequencies] || [440]
      
      freqArray.forEach((freq, index) => {
        setTimeout(() => {
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          
          if (index === 0) {
            oscillator.start(audioContext.currentTime)
          }
          if (index === freqArray.length - 1) {
            oscillator.stop(audioContext.currentTime + 0.3)
          }
        }, index * 100)
      })
    } catch {
      console.log('Audio not supported or blocked')
    }
  }, [soundEnabled])

  useEffect(() => {
    notifications.forEach(notification => {
      playSound(notification.type)
      
      // Auto-remove after duration
      const duration = notification.duration || 5000
      setTimeout(() => {
        onRemove(notification.id)
      }, duration)
    })
  }, [notifications, onRemove, playSound])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Sound Toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute top-0 right-0 -translate-y-12 bg-slate-800 text-white p-2 rounded-full text-xs hover:bg-slate-700 transition-colors"
        title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      <AnimatePresence>
        {notifications.map((notification) => {
          const config = typeConfig[notification.type]
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={`bg-gradient-to-r ${config.color} p-1 rounded-lg shadow-lg border ${config.borderColor}`}
            >
              <div className="bg-slate-900/95 backdrop-blur-sm rounded p-4 text-white">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-white">
                    {notification.icon || config.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm mb-1">{notification.title}</div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {notification.message}
                    </div>
                    
                    {notification.action && (
                      <motion.button
                        className="mt-2 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={notification.action.onClick}
                      >
                        {notification.action.label}
                      </motion.button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onRemove(notification.id)}
                    className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const addAchievementNotification = (title: string, message: string, action?: Notification['action']) => {
    addNotification({
      type: 'achievement',
      title,
      message,
      action,
      duration: 8000
    })
  }

  const addRewardNotification = (title: string, message: string) => {
    addNotification({
      type: 'reward',
      title,
      message,
      duration: 4000
    })
  }

  const addLevelUpNotification = (level: number) => {
    addNotification({
      type: 'level-up',
      title: `Level Up! 🎉`,
      message: `You've reached level ${level}! Keep learning cybersecurity!`,
      duration: 6000
    })
  }

  const addStreakNotification = (days: number) => {
    addNotification({
      type: 'streak',
      title: `${days} Day Streak! 🔥`,
      message: `You're on fire! Come back tomorrow to keep your streak alive.`,
      duration: 5000
    })
  }

  const addDailyNotification = (title: string, message: string) => {
    addNotification({
      type: 'daily',
      title,
      message,
      duration: 6000
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    addAchievementNotification,
    addRewardNotification,
    addLevelUpNotification,
    addStreakNotification,
    addDailyNotification
  }
}
