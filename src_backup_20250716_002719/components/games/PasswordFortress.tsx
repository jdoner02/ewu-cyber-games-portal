'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Eye, EyeOff, CheckCircle, XCircle, Lightbulb, Star } from 'lucide-react'
import useGameStore from '@/stores/gameStore'
import { toast } from 'react-hot-toast'
import GameHeader from '@/components/GameHeader'

interface PasswordStrength {
  score: number
  feedback: string
  color: string
  requirements: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
  }
}

interface Room {
  id: number
  title: string
  description: string
  passwordRequirement: string
  hint: string
  targetPassword?: string
  minStrength: number
  completed: boolean
  concept: string
  lesson: string
}

const ROOMS: Room[] = [
  {
    id: 1,
    title: "The Entry Gate",
    description: "Welcome to the Password Fortress! Your first challenge is to create a basic secure password to enter the fortress.",
    passwordRequirement: "Create a password with at least 8 characters",
    hint: "Length matters! Longer passwords are harder to crack.",
    minStrength: 2,
    completed: false,
    concept: "Password Length",
    lesson: "Longer passwords exponentially increase security. Each additional character makes brute force attacks much more difficult."
  },
  {
    id: 2,
    title: "The Complexity Chamber",
    description: "The fortress defenses are stronger here. You need a more complex password to proceed.",
    passwordRequirement: "Create a password with uppercase, lowercase, numbers, and symbols",
    hint: "Mix different types of characters: ABC, abc, 123, !@#",
    minStrength: 4,
    completed: false,
    concept: "Password Complexity",
    lesson: "Using different character types (uppercase, lowercase, numbers, symbols) makes passwords much harder to guess."
  },
  {
    id: 3,
    title: "The Social Engineering Trap",
    description: "Beware! The fortress has detected attempts to guess passwords using personal information.",
    passwordRequirement: "Create a strong password that doesn't use common words or personal info",
    hint: "Avoid dictionary words, names, dates, or anything someone could guess about you!",
    minStrength: 4,
    completed: false,
    concept: "Social Engineering Defense",
    lesson: "Attackers often try to guess passwords using information they find about you online. Avoid personal details!"
  },
  {
    id: 4,
    title: "The Two-Factor Sanctum",
    description: "The final chamber requires not just a password, but also a second form of authentication.",
    passwordRequirement: "Enter the master password and complete 2FA",
    hint: "Even the strongest password can be stolen. Two-factor authentication adds a second layer of protection!",
    targetPassword: "CyberGuardian2025!",
    minStrength: 5,
    completed: false,
    concept: "Multi-Factor Authentication",
    lesson: "2FA means even if someone steals your password, they still can't get in without your second factor (phone, app, etc.)."
  }
]

export default function PasswordFortress() {
  const [currentRoom, setCurrentRoom] = useState(1)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rooms, setRooms] = useState(ROOMS)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [correctTwoFactorCode] = useState('847291') // In real app, this would be generated
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [currentLesson, setCurrentLesson] = useState('')
  
  const { addXP, unlockAchievement, updateSkillProgress, updateGameProgress } = useGameStore()

  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    }

    let score = 0
    if (requirements.length) score++
    if (requirements.uppercase) score++
    if (requirements.lowercase) score++
    if (requirements.numbers) score++
    if (requirements.symbols) score++

    // Penalty for common patterns
    const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'login']
    const lowerPwd = pwd.toLowerCase()
    if (commonPatterns.some(pattern => lowerPwd.includes(pattern))) {
      score = Math.max(0, score - 2)
    }

    let feedback = ''
    let color = ''

    if (score === 0) {
      feedback = 'Very Weak'
      color = 'text-red-500'
    } else if (score === 1) {
      feedback = 'Weak'
      color = 'text-red-400'
    } else if (score === 2) {
      feedback = 'Fair'
      color = 'text-yellow-500'
    } else if (score === 3) {
      feedback = 'Good'
      color = 'text-yellow-400'
    } else if (score === 4) {
      feedback = 'Strong'
      color = 'text-green-400'
    } else {
      feedback = 'Very Strong'
      color = 'text-green-300'
    }

    return { score, feedback, color, requirements }
  }

  const currentRoomData = rooms.find(r => r.id === currentRoom)!
  const passwordStrength = calculatePasswordStrength(password)

  const handlePasswordSubmit = () => {
    if (currentRoom === 4) {
      // Final room requires specific password and 2FA
      if (password !== currentRoomData.targetPassword) {
        toast.error('Incorrect master password! Hint: CyberGuardian2025!')
        return
      }
      if (twoFactorCode !== correctTwoFactorCode) {
        toast.error('Incorrect 2FA code! Check your authenticator: 847291')
        return
      }
    } else {
      // Other rooms require meeting strength requirements
      if (passwordStrength.score < currentRoomData.minStrength) {
        toast.error(`Password not strong enough! Need strength level ${currentRoomData.minStrength}`)
        return
      }
    }

    // Success!
    const updatedRooms = rooms.map(room => 
      room.id === currentRoom ? { ...room, completed: true } : room
    )
    setRooms(updatedRooms)

    // Award XP and achievements
    addXP(50 * currentRoom) // More XP for later rooms
    updateSkillProgress('passwordSecurity', 25)
    
    if (currentRoom === 1) {
      unlockAchievement('first_password', 'Password Novice', 'Created your first secure password', 'passwords')
    } else if (currentRoom === 4) {
      unlockAchievement('fortress_master', 'Fortress Master', 'Completed the Password Fortress escape room', 'passwords')
      updateGameProgress('password-fortress', { completed: true, timeSpent: 0, attempts: 1, hintsUsed: 0, highScore: 100 })
    }

    // Show lesson
    setCurrentLesson(currentRoomData.lesson)
    setShowLessonModal(true)

    toast.success(`🎉 Room ${currentRoom} completed!`)
    
    // Move to next room after delay
    setTimeout(() => {
      if (currentRoom < 4) {
        setCurrentRoom(currentRoom + 1)
        setPassword('')
        setTwoFactorCode('')
      }
    }, 2000)
  }

  const getProgressWidth = () => {
    const completedRooms = rooms.filter(r => r.completed).length
    return (completedRooms / rooms.length) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <GameHeader gameTitle="Password Fortress" />
      
      <div className="pt-20 p-4">{/* Add top padding for fixed header */}
        <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Password Fortress</h1>
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressWidth()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-slate-300">Room {currentRoom} of 4</p>
        </motion.div>

        {/* Current Room */}
        <motion.div
          key={currentRoom}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-400/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">{currentRoomData.title}</h2>
            {currentRoomData.completed && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>

          <p className="text-slate-300 mb-6">{currentRoomData.description}</p>

          <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
            <h3 className="text-cyan-300 font-semibold mb-2">Challenge:</h3>
            <p className="text-white">{currentRoomData.passwordRequirement}</p>
          </div>

          {/* Password Input */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-cyan-300 font-medium mb-2">
                {currentRoom === 4 ? 'Master Password:' : 'Your Password:'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 pr-12 border border-slate-600 focus:border-cyan-400 focus:outline-none"
                  placeholder="Enter your password..."
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && currentRoom !== 4 && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Strength:</span>
                  <span className={`font-semibold ${passwordStrength.color}`}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(passwordStrength.requirements).map(([req, met]) => (
                    <div key={req} className="flex items-center gap-2">
                      {met ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={met ? 'text-green-300' : 'text-red-300'}>
                        {req === 'length' ? '8+ characters' :
                         req === 'uppercase' ? 'Uppercase (A-Z)' :
                         req === 'lowercase' ? 'Lowercase (a-z)' :
                         req === 'numbers' ? 'Numbers (0-9)' :
                         'Symbols (!@#$)'}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2FA Input for final room */}
            {currentRoom === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="block text-cyan-300 font-medium">
                  Two-Factor Authentication Code:
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-cyan-400 focus:outline-none"
                  placeholder="Enter 6-digit code from your authenticator..."
                  maxLength={6}
                />
                <p className="text-slate-400 text-sm">Hint: Check your authenticator app for code 847291</p>
              </motion.div>
            )}

            {/* Hint */}
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 font-medium">Hint:</span>
              </div>
              <p className="text-yellow-200 text-sm">{currentRoomData.hint}</p>
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={!password || (currentRoom === 4 && !twoFactorCode)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {currentRoom === 4 ? 'Complete Fortress!' : 'Enter Room'}
            </button>
          </div>
        </motion.div>

        {/* Completed Rooms */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              className={`p-4 rounded-lg border ${
                room.completed
                  ? 'bg-green-900/20 border-green-400/30'
                  : room.id === currentRoom
                  ? 'bg-blue-900/20 border-blue-400/30'
                  : 'bg-slate-800/20 border-slate-600/30'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: room.id * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  room.completed ? 'bg-green-500' : room.id === currentRoom ? 'bg-blue-500' : 'bg-slate-600'
                }`}>
                  {room.completed ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-bold">{room.id}</span>
                  )}
                </div>
                <h3 className="text-white font-medium text-sm">{room.title}</h3>
              </div>
              <p className="text-slate-400 text-xs">{room.concept}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {showLessonModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-cyan-400/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Lesson Learned!</h3>
              </div>
              <p className="text-slate-300 mb-6">{currentLesson}</p>
              <button
                onClick={() => setShowLessonModal(false)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
