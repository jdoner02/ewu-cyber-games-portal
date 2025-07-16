/**
 * 🔑 PASSWORD FORTRESS BUILDER - Educational Clicker Game
 * 
 * This is a Cookie Clicker-style game that teaches password security!
 * 
 * LEARNING GOALS:
 * - Why longer passwords are stronger than complex short ones
 * - How special characters and numbers help security  
 * - Why common words and patterns are dangerous
 * - What makes passwords truly unbreakable
 * 
 * GAME MECHANICS:
 * - Click to add characters to your password
 * - Watch your password fortress grow stronger visually
 * - Unlock upgrades that teach security concepts
 * - Defend against cartoon hacker attacks
 * 
 * FOR CURIOUS CODERS:
 * This component uses React hooks to manage game state and create
 * an addictive learning experience. Every part is designed to teach!
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Key, 
  Zap, 
  Star, 
  Crown,
  AlertTriangle,
  CheckCircle,
  Target,
  Award
} from 'lucide-react'
import { toast } from 'sonner'
import useGameStore from '@/stores/gameStore'

/**
 * 🎮 GAME DATA STRUCTURES
 * 
 * These TypeScript interfaces define what our game remembers.
 * Think of them as blueprints for the game's memory!
 */

interface PasswordStats {
  length: number           // How many characters in the password
  strength: number         // Password strength (0-100)
  securityPoints: number   // Points earned by player
  clickCount: number       // Total clicks by player
  fortressLevel: number    // Visual fortress level (0-6)
}

interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  owned: number            // How many of this upgrade player has
  maxLevel: number
  icon: React.ReactNode
  effect: string           // What this upgrade teaches
}

interface Achievement {
  id: string
  name: string
  description: string
  requirement: string      // What you need to do to unlock it
  unlocked: boolean
  icon: React.ReactNode
  cybersecurityConcept: string  // What security concept this teaches
}

/**
 * 🛡️ MAIN GAME COMPONENT
 * 
 * This is the heart of our password fortress game!
 */
export default function PasswordFortressBuilder() {
  // 🎯 Get functions from our global game store
  const { addXP, unlockAchievement, updateGameProgress } = useGameStore()

  /**
   * 🧠 GAME STATE (What the game remembers)
   * 
   * React's useState hook lets us store information that can change.
   * When these values change, the game automatically updates!
   */
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState<PasswordStats>({
    length: 0,
    strength: 0,
    securityPoints: 0,
    clickCount: 0,
    fortressLevel: 0
  })

  /**
   * 📦 UPGRADE SYSTEM
   * 
   * These upgrades teach different password security concepts!
   * Each one makes your password automatically better over time.
   */
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'auto-length',
      name: 'Length Booster',
      description: 'Automatically adds characters every 3 seconds',
      cost: 50,
      owned: 0,
      maxLevel: 10,
      icon: <Zap className="w-4 h-4" />,
      effect: 'Teaches: Longer passwords are exponentially harder to crack!'
    },
    {
      id: 'smart-symbols',
      name: 'Symbol Generator',
      description: 'Adds random special characters (!@#$%)',
      cost: 150,
      owned: 0,
      maxLevel: 5,
      icon: <Star className="w-4 h-4" />,
      effect: 'Teaches: Special characters increase password complexity!'
    },
    {
      id: 'number-ninja',
      name: 'Number Ninja',
      description: 'Sprinkles random numbers throughout password',
      cost: 100,
      owned: 0,
      maxLevel: 5,
      icon: <Target className="w-4 h-4" />,
      effect: 'Teaches: Numbers make passwords harder to guess!'
    },
    {
      id: 'case-mixer',
      name: 'Case Mixer',
      description: 'Randomly capitalizes letters',
      cost: 200,
      owned: 0,
      maxLevel: 3,
      icon: <Crown className="w-4 h-4" />,
      effect: 'Teaches: Mixed case adds more possible combinations!'
    }
  ])

  /**
   * 🏆 ACHIEVEMENT SYSTEM
   * 
   * Achievements unlock as you learn new concepts!
   * Each one teaches an important cybersecurity principle.
   */
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-click',
      name: 'Password Pioneer',
      description: 'Created your first password character!',
      requirement: 'Click the password builder once',
      unlocked: false,
      icon: <Key className="w-4 h-4" />,
      cybersecurityConcept: 'Every password starts with a single character!'
    },
    {
      id: 'double-digits',
      name: 'Length Champion',
      description: 'Built a 10-character password!',
      requirement: 'Create a password with 10+ characters',
      unlocked: false,
      icon: <Shield className="w-4 h-4" />,
      cybersecurityConcept: 'Length is the most important factor in password strength!'
    },
    {
      id: 'fortress-defender',
      name: 'Fortress Defender', 
      description: 'Defeated your first hacker attack!',
      requirement: 'Have a password strong enough to stop an attack',
      unlocked: false,
      icon: <Crown className="w-4 h-4" />,
      cybersecurityConcept: 'Strong passwords are your first line of defense!'
    },
    {
      id: 'upgrade-master',
      name: 'Upgrade Master',
      description: 'Purchased your first upgrade!',
      requirement: 'Buy any upgrade',
      unlocked: false,
      icon: <Award className="w-4 h-4" />,
      cybersecurityConcept: 'Automation tools help create better passwords!'
    }
  ])

  /**
   * 🧮 PASSWORD STRENGTH CALCULATOR
   * 
   * This function determines how strong a password is.
   * It teaches students what makes passwords secure!
   */
  const calculatePasswordStrength = useCallback((pwd: string): number => {
    let strength = 0
    
    // 📏 LENGTH IS MOST IMPORTANT!
    // Each character exponentially increases security
    strength += pwd.length * 6
    
    // 🔤 CHARACTER VARIETY BONUS
    // Different types of characters make passwords harder to crack
    if (/[a-z]/.test(pwd)) strength += 5    // lowercase letters
    if (/[A-Z]/.test(pwd)) strength += 5    // uppercase letters  
    if (/[0-9]/.test(pwd)) strength += 5    // numbers
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 10  // special characters (!@#$)
    
    // 🎯 PATTERN PENALTIES
    // Common patterns make passwords weaker
    if (pwd.includes('123')) strength -= 10    // sequential numbers
    if (pwd.includes('abc')) strength -= 10    // sequential letters
    if (pwd.toLowerCase().includes('password')) strength -= 20  // common word
    
    // 📊 Keep strength between 0 and 100
    return Math.max(0, Math.min(100, strength))
  }, [])

  /**
   * 🏰 FORTRESS LEVEL CALCULATOR
   * 
   * This determines what your fortress looks like based on password strength!
   * Visual feedback makes learning fun and memorable.
   */
  const getFortressLevel = useCallback((strength: number): number => {
    if (strength < 10) return 0   // Empty lot
    if (strength < 25) return 1   // Wooden shack
    if (strength < 40) return 2   // Small house
    if (strength < 60) return 3   // Fortified house
    if (strength < 75) return 4   // Small castle
    if (strength < 90) return 5   // Medieval fortress
    return 6                      // High-tech fortress
  }, [])

  /**
   * 🖱️ MAIN CLICK HANDLER
   * 
   * This is what happens when you click the password builder!
   * Each click teaches something about password creation.
   */
  const handlePasswordClick = useCallback(() => {
    // 🎲 Generate a random character (letters, numbers, symbols)
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    const newChar = chars[Math.floor(Math.random() * chars.length)]
    
    // 📝 Add the character to our password
    const newPassword = password + newChar
    setPassword(newPassword)
    
    // 📊 Calculate new stats
    const newStrength = calculatePasswordStrength(newPassword)
    const newFortressLevel = getFortressLevel(newStrength)
    const pointsEarned = Math.floor(newStrength / 10) + 1
    
    // 💾 Update game statistics
    setStats(prev => ({
      ...prev,
      length: newPassword.length,
      strength: newStrength,
      securityPoints: prev.securityPoints + pointsEarned,
      clickCount: prev.clickCount + 1,
      fortressLevel: newFortressLevel
    }))
    
    // 🎉 Add XP to global game system
    addXP(pointsEarned)
    
    // 🔔 Show encouraging feedback
    if (newStrength > 80) {
      toast.success(`🛡️ Fortress-level security! (+${pointsEarned} points)`)
    } else if (newStrength > 50) {
      toast.success(`💪 Getting stronger! (+${pointsEarned} points)`)
    } else {
      toast.success(`📈 Keep building! (+${pointsEarned} points)`)
    }
    
    // 🏆 Check for achievement unlocks
    checkAchievements(newPassword, newStrength, stats.clickCount + 1)
  }, [password, stats, calculatePasswordStrength, getFortressLevel, addXP])

  /**
   * 🏆 ACHIEVEMENT CHECKER
   * 
   * This function checks if the player has earned any new achievements!
   * Achievements teach cybersecurity concepts at the perfect moment.
   */
  const checkAchievements = useCallback((pwd: string, strength: number, clicks: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement
      
      let shouldUnlock = false
      
      // 🎯 Check specific achievement conditions
      switch (achievement.id) {
        case 'first-click':
          shouldUnlock = clicks >= 1
          break
        case 'double-digits':
          shouldUnlock = pwd.length >= 10
          break
        case 'fortress-defender':
          shouldUnlock = strength >= 70
          break
        case 'upgrade-master':
          shouldUnlock = upgrades.some(upgrade => upgrade.owned > 0)
          break
      }
      
      // 🎉 Unlock achievement and show celebration
      if (shouldUnlock) {
        toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`)
        unlockAchievement(achievement.id, achievement.name, achievement.description, 'passwords')
        
        // 📚 Show the cybersecurity learning moment
        setTimeout(() => {
          toast.info(`💡 ${achievement.cybersecurityConcept}`)
        }, 1000)
        
        return { ...achievement, unlocked: true }
      }
      
      return achievement
    }))
  }, [upgrades, unlockAchievement])

  /**
   * 🛒 UPGRADE PURCHASE HANDLER
   * 
   * This lets players buy upgrades that automate password building!
   * Each upgrade teaches a different security concept.
   */
  const purchaseUpgrade = useCallback((upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId)
    if (!upgrade || upgrade.owned >= upgrade.maxLevel) return
    
    // 💰 Check if player has enough points
    if (stats.securityPoints < upgrade.cost) {
      toast.error('💸 Not enough Security Points!')
      return
    }
    
    // 💳 Purchase the upgrade
    setStats(prev => ({
      ...prev,
      securityPoints: prev.securityPoints - upgrade.cost
    }))
    
    setUpgrades(prev => prev.map(u => 
      u.id === upgradeId 
        ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.5) }
        : u
    ))
    
    // 🎉 Celebrate the purchase
    toast.success(`🚀 ${upgrade.name} upgraded!`)
    
    // 📚 Show what this upgrade teaches
    setTimeout(() => {
      toast.info(`💡 ${upgrade.effect}`)
    }, 500)
    
    // 🏆 Check for upgrade-related achievements
    checkAchievements(password, stats.strength, stats.clickCount)
  }, [upgrades, stats, password, checkAchievements])

  /**
   * ⚡ AUTO-UPGRADE SYSTEM
   * 
   * This runs automatically every 3 seconds to apply upgrades!
   * It shows how automation can help with password security.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      let shouldUpdate = false
      let newPassword = password
      
      // 🔄 Apply each owned upgrade
      upgrades.forEach(upgrade => {
        if (upgrade.owned > 0) {
          switch (upgrade.id) {
            case 'auto-length':
              // 📏 Automatically add characters
              const chars = 'abcdefghijklmnopqrstuvwxyz'
              newPassword += chars[Math.floor(Math.random() * chars.length)]
              shouldUpdate = true
              break
              
            case 'smart-symbols':
              // ⭐ Add special characters
              if (Math.random() < 0.3) {
                const symbols = '!@#$%^&*'
                newPassword += symbols[Math.floor(Math.random() * symbols.length)]
                shouldUpdate = true
              }
              break
              
            case 'number-ninja':
              // 🔢 Add random numbers
              if (Math.random() < 0.4) {
                newPassword += Math.floor(Math.random() * 10).toString()
                shouldUpdate = true
              }
              break
              
            case 'case-mixer':
              // 🔤 Mix up the case of existing letters
              if (newPassword.length > 0 && Math.random() < 0.3) {
                const lastChar = newPassword[newPassword.length - 1]
                if (/[a-z]/.test(lastChar)) {
                  newPassword = newPassword.slice(0, -1) + lastChar.toUpperCase()
                  shouldUpdate = true
                }
              }
              break
          }
        }
      })
      
      // 💾 Update password if any upgrades triggered
      if (shouldUpdate) {
        setPassword(newPassword)
        const newStrength = calculatePasswordStrength(newPassword)
        const newFortressLevel = getFortressLevel(newStrength)
        
        setStats(prev => ({
          ...prev,
          length: newPassword.length,
          strength: newStrength,
          fortressLevel: newFortressLevel
        }))
      }
    }, 3000) // Run every 3 seconds
    
    return () => clearInterval(interval)
  }, [password, upgrades, calculatePasswordStrength, getFortressLevel])

  /**
   * 🎨 FORTRESS VISUAL REPRESENTATION
   * 
   * This shows your password fortress growing stronger!
   * Visual feedback makes learning memorable and fun.
   */
  const getFortressDisplay = () => {
    const level = stats.fortressLevel
    const fortressStages = [
      { emoji: '🏗️', name: 'Empty Lot', description: 'Start building your security!' },
      { emoji: '🏚️', name: 'Wooden Shack', description: 'Basic protection, easily broken' },
      { emoji: '🏠', name: 'Small House', description: 'Better, but still vulnerable' },
      { emoji: '🏘️', name: 'Fortified House', description: 'Good defenses taking shape' },
      { emoji: '🏰', name: 'Small Castle', description: 'Strong walls and basic defenses' },
      { emoji: '🏯', name: 'Medieval Fortress', description: 'Impressive defensive structure' },
      { emoji: '🏛️', name: 'High-Tech Fortress', description: 'Unbreakable cyber fortress!' }
    ]
    
    return fortressStages[level] || fortressStages[0]
  }

  /**
   * 🎯 PASSWORD STRENGTH DESCRIPTION
   * 
   * This gives encouraging feedback about password strength!
   * Educational descriptions help students understand their progress.
   */
  const getStrengthDescription = (strength: number): { text: string, color: string, advice: string } => {
    if (strength < 20) return {
      text: 'Very Weak',
      color: 'text-red-500',
      advice: 'Add more characters! Length is most important.'
    }
    if (strength < 40) return {
      text: 'Weak',
      color: 'text-orange-500',
      advice: 'Getting better! Try adding numbers or symbols.'
    }
    if (strength < 60) return {
      text: 'Fair',
      color: 'text-yellow-500',
      advice: 'Good progress! Keep building length.'
    }
    if (strength < 80) return {
      text: 'Strong',
      color: 'text-green-500',
      advice: 'Excellent! This password is hard to crack.'
    }
    return {
      text: 'Fortress-Level',
      color: 'text-purple-500',
      advice: 'Unbreakable! You\'ve mastered password security!'
    }
  }

  const strengthInfo = getStrengthDescription(stats.strength)
  const fortressDisplay = getFortressDisplay()

  /**
   * 🎨 RENDER THE GAME INTERFACE
   * 
   * This creates all the visual elements players see and interact with!
   * Every element is designed to teach while being fun to use.
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* 📈 Game Header with Stats */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔑 Password Fortress Builder
          </h1>
          <p className="text-blue-200 text-lg">
            Build unbreakable passwords through the power of clicking!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* 🏰 Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Fortress Display */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-8xl mb-4">
                {fortressDisplay.emoji}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {fortressDisplay.name}
              </h2>
              <p className="text-blue-200">
                {fortressDisplay.description}
              </p>
            </motion.div>

            {/* Password Builder Button */}
            <motion.button
              onClick={handlePasswordClick}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-8 px-6 rounded-xl text-xl shadow-lg transform transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔨 Click to Build Password!
              <div className="text-sm mt-2 opacity-80">
                Each click adds a random character
              </div>
            </motion.button>

            {/* Current Password Display */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                🔐 Your Password Fortress:
              </h3>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-green-400 text-lg break-all">
                {password || 'Click above to start building!'}
              </div>
              
              {/* Password Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.length}
                  </div>
                  <div className="text-blue-200 text-sm">
                    Characters
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${strengthInfo.color}`}>
                    {strengthInfo.text}
                  </div>
                  <div className="text-blue-200 text-sm">
                    Strength
                  </div>
                </div>
              </div>
              
              {/* Strength Advice */}
              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
                <p className="text-blue-200 text-sm">
                  💡 {strengthInfo.advice}
                </p>
              </div>
            </div>
          </div>

          {/* 🛒 Sidebar with Upgrades and Achievements */}
          <div className="space-y-6">
            
            {/* Player Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                📊 Your Progress
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Security Points:</span>
                  <span className="text-white font-bold">
                    {stats.securityPoints} 🛡️
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Total Clicks:</span>
                  <span className="text-white font-bold">
                    {stats.clickCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Password Length:</span>
                  <span className="text-white font-bold">
                    {stats.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Upgrades Shop */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                🚀 Password Upgrades
              </h3>
              
              <div className="space-y-3">
                {upgrades.map(upgrade => (
                  <motion.button
                    key={upgrade.id}
                    onClick={() => purchaseUpgrade(upgrade.id)}
                    disabled={stats.securityPoints < upgrade.cost || upgrade.owned >= upgrade.maxLevel}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-left transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {upgrade.icon}
                        <span className="text-white font-medium">
                          {upgrade.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">
                          {upgrade.cost} 🛡️
                        </div>
                        <div className="text-xs text-blue-200">
                          Owned: {upgrade.owned}/{upgrade.maxLevel}
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-200 text-sm mt-1">
                      {upgrade.description}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                🏆 Achievements
              </h3>
              
              <div className="space-y-3">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {achievement.icon}
                      <span className={`font-medium ${
                        achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </span>
                      {achievement.unlocked && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className={`text-sm mt-1 ${
                      achievement.unlocked ? 'text-green-200' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 📚 Educational Footer */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            💡 What You're Learning
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-blue-200">
            <div>
              <h4 className="font-semibold text-white mb-2">Password Security Principles:</h4>
              <ul className="space-y-1 text-sm">
                <li>📏 Length is more important than complexity</li>
                <li>🎲 Random characters are harder to guess</li>
                <li>🔤 Character variety increases security</li>
                <li>🚫 Avoid common words and patterns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Real-World Applications:</h4>
              <ul className="space-y-1 text-sm">
                <li>🔐 Use unique passwords for each account</li>
                <li>🛠️ Password managers generate strong passwords</li>
                <li>🔒 Two-factor authentication adds extra security</li>
                <li>🔄 Update passwords if they might be compromised</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 🎓 EDUCATIONAL NOTES FOR STUDENTS READING THIS CODE:
 * 
 * This game component demonstrates several important programming concepts:
 * 
 * 1. STATE MANAGEMENT: We use React hooks to remember game information
 * 2. EVENT HANDLING: Button clicks trigger functions that update the game
 * 3. CONDITIONAL RENDERING: Different content shows based on game state
 * 4. EFFECTS: useEffect runs code at specific times (like timers)
 * 5. ANIMATIONS: Framer Motion makes the interface feel responsive
 * 
 * But more importantly, it shows how code can be a powerful teaching tool!
 * Every function and feature is designed to help you learn cybersecurity.
 * 
 * Try changing some values and see what happens:
 * - Modify the password strength calculation
 * - Add new upgrade types
 * - Create new achievements
 * - Change the visual feedback
 * 
 * Remember: The best way to learn programming is by experimenting! 🚀
 */
