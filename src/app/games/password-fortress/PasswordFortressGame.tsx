'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, Unlock, Eye, EyeOff, CheckCircle, XCircle, Zap, Clock } from 'lucide-react'

interface PasswordStrength {
  score: number
  level: 'weak' | 'fair' | 'good' | 'strong' | 'excellent'
  feedback: string[]
  requirements: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
    noCommon: boolean
  }
}

interface AttackScenario {
  id: string
  name: string
  type: 'bruteforce' | 'dictionary' | 'social' | 'phishing'
  timeToBreak: number
  description: string
  active: boolean
}

export default function PasswordFortressGame() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    level: 'weak',
    feedback: [],
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      noCommon: false
    }
  })
  const [attacks, setAttacks] = useState<AttackScenario[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameMode, setGameMode] = useState<'create' | 'defend' | 'learn'>('create')
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [isGameActive, setIsGameActive] = useState(false)
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'warning' | 'danger'}>>([])

  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master',
    'superman', 'batman', 'football', 'baseball', 'basketball'
  ]

  const attackScenarios: AttackScenario[] = [
    {
      id: 'brute1',
      name: 'Basic Brute Force',
      type: 'bruteforce',
      timeToBreak: 1000,
      description: 'Systematic attempt of all possible combinations',
      active: false
    },
    {
      id: 'dict1',
      name: 'Dictionary Attack',
      type: 'dictionary',
      timeToBreak: 500,
      description: 'Using common passwords and word lists',
      active: false
    },
    {
      id: 'social1',
      name: 'Social Engineering',
      type: 'social',
      timeToBreak: 200,
      description: 'Using personal information and social cues',
      active: false
    },
    {
      id: 'phish1',
      name: 'Phishing Campaign',
      type: 'phishing',
      timeToBreak: 100,
      description: 'Tricking users into revealing passwords',
      active: false
    }
  ]

  // Calculate password strength
  const calculateStrength = useCallback((pwd: string): PasswordStrength => {
    const requirements = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      noCommon: !commonPasswords.some(common => 
        pwd.toLowerCase().includes(common.toLowerCase())
      )
    }

    let score = 0
    const feedback: string[] = []

    // Length scoring
    if (pwd.length >= 12) score += 25
    else if (pwd.length >= 8) score += 15
    else if (pwd.length >= 6) score += 5
    else feedback.push('Password should be at least 12 characters long')

    // Character variety
    if (requirements.uppercase) score += 15
    else feedback.push('Add uppercase letters (A-Z)')

    if (requirements.lowercase) score += 15
    else feedback.push('Add lowercase letters (a-z)')

    if (requirements.numbers) score += 15
    else feedback.push('Add numbers (0-9)')

    if (requirements.symbols) score += 20
    else feedback.push('Add symbols (!@#$%^&*)')

    if (requirements.noCommon) score += 10
    else feedback.push('Avoid common passwords and words')

    // Bonus for complexity
    const charSets = [
      requirements.uppercase,
      requirements.lowercase,
      requirements.numbers,
      requirements.symbols
    ].filter(Boolean).length

    if (charSets >= 4) score += 10

    let level: PasswordStrength['level'] = 'weak'
    if (score >= 90) level = 'excellent'
    else if (score >= 70) level = 'strong'
    else if (score >= 50) level = 'good'
    else if (score >= 30) level = 'fair'

    return { score, level, feedback, requirements }
  }, [])

  // Update strength when password changes
  useEffect(() => {
    setStrength(calculateStrength(password))
  }, [password, calculateStrength])

  // Initialize attacks
  useEffect(() => {
    setAttacks(attackScenarios.map(attack => ({ ...attack })))
  }, [])

  // Game timer
  useEffect(() => {
    if (isGameActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      endGame()
    }
  }, [isGameActive, timeRemaining])

  // Attack simulation
  useEffect(() => {
    if (gameMode === 'defend' && isGameActive) {
      const interval = setInterval(() => {
        setAttacks(prev => prev.map(attack => {
          if (!attack.active) return attack

          const passwordComplexity = strength.score
          const resistance = Math.max(1, passwordComplexity / 10)
          const newTimeToBreak = Math.max(0, attack.timeToBreak - (10 / resistance))

          if (newTimeToBreak <= 0) {
            showNotification(`Password broken by ${attack.name}!`, 'danger')
            setScore(prev => Math.max(0, prev - 50))
            return { ...attack, active: false, timeToBreak: 0 }
          }

          return { ...attack, timeToBreak: newTimeToBreak }
        }))
      }, 100)

      return () => clearInterval(interval)
    }
  }, [gameMode, isGameActive, strength.score])

  const showNotification = (message: string, type: 'success' | 'warning' | 'danger') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  const startGame = () => {
    setIsGameActive(true)
    setTimeRemaining(60)
    if (gameMode === 'defend') {
      setAttacks(prev => prev.map(attack => ({ 
        ...attack, 
        active: true,
        timeToBreak: attack.id === 'brute1' ? 1000 : 
                    attack.id === 'dict1' ? 500 :
                    attack.id === 'social1' ? 200 : 100
      })))
    }
  }

  const endGame = () => {
    setIsGameActive(false)
    const finalScore = strength.score + (timeRemaining * 2)
    setScore(prev => prev + finalScore)
    showNotification(`Game ended! Bonus: ${finalScore} points`, 'success')
    
    if (strength.level === 'excellent') {
      setLevel(prev => prev + 1)
      showNotification('Level up! Password mastery achieved!', 'success')
    }
  }

  const generateSecurePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const allChars = lowercase + uppercase + numbers + symbols
    let result = ''
    
    // Ensure at least one character from each category
    result += lowercase[Math.floor(Math.random() * lowercase.length)]
    result += uppercase[Math.floor(Math.random() * uppercase.length)]
    result += numbers[Math.floor(Math.random() * numbers.length)]
    result += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Fill the rest randomly
    for (let i = 4; i < 16; i++) {
      result += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the result
    const shuffled = result.split('').sort(() => Math.random() - 0.5).join('')
    setPassword(shuffled)
    showNotification('Secure password generated!', 'success')
  }

  const getStrengthColor = (level: PasswordStrength['level']) => {
    switch (level) {
      case 'excellent': return 'green'
      case 'strong': return 'blue'
      case 'good': return 'yellow'
      case 'fair': return 'orange'
      default: return 'red'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            Password Fortress
          </h1>
          <p className="text-lg text-gray-300">
            Master the art of creating unbreakable passwords and defending against cyber attacks
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{score}</div>
            <div className="text-sm text-gray-400">Security Score</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{level}</div>
            <div className="text-sm text-gray-400">Security Level</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{strength.score}%</div>
            <div className="text-sm text-gray-400">Password Strength</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{timeRemaining}s</div>
            <div className="text-sm text-gray-400">Time Remaining</div>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="flex justify-center gap-4 mb-6">
          {(['create', 'defend', 'learn'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setGameMode(mode)}
              className={`px-6 py-3 rounded-lg transition-colors capitalize ${
                gameMode === mode
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {mode} Mode
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Password Creation Panel */}
          <div className="lg:col-span-2 bg-black/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock />
              Password Fortress Builder
            </h3>

            {/* Password Input */}
            <div className="relative mb-6">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Strength Meter */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Password Strength</span>
                <span className={`font-bold text-${getStrengthColor(strength.level)}-400 capitalize`}>
                  {strength.level} ({strength.score}%)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full bg-${getStrengthColor(strength.level)}-500`}
                  style={{ width: `${strength.score}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${strength.score}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {Object.entries(strength.requirements).map(([req, met]) => (
                <div
                  key={req}
                  className={`flex items-center gap-2 p-2 rounded ${
                    met ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                  }`}
                >
                  {met ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span className="text-sm capitalize">
                    {req === 'noCommon' ? 'Not Common Password' : req}
                  </span>
                </div>
              ))}
            </div>

            {/* Feedback */}
            {strength.feedback.length > 0 && (
              <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-yellow-400 mb-2">Improvement Suggestions:</h4>
                <ul className="text-sm text-yellow-300 space-y-1">
                  {strength.feedback.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
              <button
                onClick={generateSecurePassword}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Zap size={20} />
                Generate Secure Password
              </button>
              
              {gameMode === 'defend' && (
                <button
                  onClick={startGame}
                  disabled={isGameActive || strength.score < 50}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Shield size={20} />
                  Start Defense
                </button>
              )}
            </div>
          </div>

          {/* Attack Scenarios Panel */}
          <div className="bg-black/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Cyber Attacks</h3>
            
            {gameMode === 'defend' && (
              <div className="space-y-4 mb-6">
                {attacks.map(attack => (
                  <motion.div
                    key={attack.id}
                    className={`p-4 rounded-lg border-2 ${
                      attack.active
                        ? attack.timeToBreak > 0
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-red-500 bg-red-500/10'
                        : 'border-gray-600 bg-gray-600/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{attack.name}</h4>
                      <span className={`text-sm px-2 py-1 rounded ${
                        attack.active && attack.timeToBreak > 0 ? 'bg-yellow-600' :
                        attack.active && attack.timeToBreak <= 0 ? 'bg-red-600' :
                        'bg-gray-600'
                      }`}>
                        {attack.active && attack.timeToBreak > 0 ? 'ACTIVE' :
                         attack.active && attack.timeToBreak <= 0 ? 'BREACHED' :
                         'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{attack.description}</p>
                    {attack.active && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Time to Break:</span>
                          <span className="font-bold">
                            {attack.timeToBreak > 0 ? `${Math.ceil(attack.timeToBreak / 100)}s` : 'BROKEN!'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 bg-red-500 rounded-full transition-all duration-100"
                            style={{ width: `${Math.max(0, 100 - (attack.timeToBreak / (attack.id === 'brute1' ? 1000 : attack.id === 'dict1' ? 500 : attack.id === 'social1' ? 200 : 100)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Learning Section */}
            <div className="space-y-4">
              <h4 className="font-bold text-purple-400">Password Security Tips</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>• Use at least 12 characters</div>
                <div>• Mix uppercase, lowercase, numbers, and symbols</div>
                <div>• Avoid common words and personal information</div>
                <div>• Use unique passwords for each account</div>
                <div>• Consider using a password manager</div>
                <div>• Enable two-factor authentication when possible</div>
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
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-red-400 mb-2">Password Security</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Understand password complexity requirements</li>
                <li>• Learn about common attack vectors</li>
                <li>• Practice creating strong passwords</li>
                <li>• Explore password manager benefits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-purple-400 mb-2">Cyber Defense</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Recognize different attack methodologies</li>
                <li>• Understand time-to-break calculations</li>
                <li>• Learn about multi-factor authentication</li>
                <li>• Practice security best practices</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
