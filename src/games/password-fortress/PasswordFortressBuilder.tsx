/**
 * 🔑 PASSWORD FORTRESS BUILDER - Educational Cybersecurity Game
 * 
 * 🎯 WHAT YOU'RE LEARNING:
 * This game teaches you how cybersecurity professionals think about password security!
 * Every click and upgrade teaches you real principles used by security experts.
 * 
 * 🧠 LEARNING OBJECTIVES (Research-Backed):
 * - Why longer passwords are exponentially stronger (NIST SP 800-63B)
 * - How character diversity creates computational barriers for attackers
 * - Why human-memorable patterns are dangerous in the wrong hands
 * - What makes passwords mathematically unbreakable
 * 
 * 🎮 GAME MECHANICS (Flow Theory Applied):
 * - Click to add characters to your password fortress
 * - Watch your security visualization grow stronger in real-time  
 * - Unlock educational upgrades that teach professional concepts
 * - Defend against realistic (but safe!) simulated attacks
 * 
 * 👩‍💻 FOR FUTURE DEVELOPERS:
 * This component demonstrates React state management and educational game design.
 * Every part combines fun with learning - you're seeing how professionals
 * create engaging educational technology!
 * 
 * 🔬 EDUCATIONAL RESEARCH BASIS:
 * - Constructivist Learning Theory (Papert, 1980): Learn by building
 * - Flow Theory (Csikszentmihalyi, 1990): Optimal challenge-skill balance
 * - Immediate Feedback (Hattie & Timperley, 2007): Real-time learning support
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Key, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react'
import { toast } from 'sonner'
import useGameStore from '@/stores/gameStore'

/**
 * 🎮 GAME DATA STRUCTURES
 * 
 * These TypeScript interfaces define what our game remembers.
 * Think of them as blueprints for the game's memory!
 * 
 * 🧠 WHY INTERFACES MATTER:
 * In cybersecurity, defining clear data structures prevents security bugs.
 * This same technique protects banking systems and secure communications!
 */

interface PasswordStats {
  length: number           // How many characters total (length = security!)
  strength: number         // Password strength score (0-100, like a grade!)
  securityPoints: number   // Points you've earned by learning
  clickCount: number       // Total learning interactions
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
  const { 
    addXP, 
    unlockAchievement, 
    updateGameProgress, 
    savePasswordFortressState,
    gameSpecificStates 
  } = useGameStore()

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
      icon: <Zap className="w-4 h-4" />,
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
      icon: <Shield className="w-4 h-4" />,
      effect: 'Teaches: Mixed case adds more possible combinations!'
    },
    {
      id: 'mfa-shield',
      name: 'MFA Shield Generator',
      description: 'Adds multi-factor authentication protection bonus',
      cost: 300,
      owned: 0,
      maxLevel: 3,
      icon: <Shield className="w-4 h-4" />,
      effect: 'Teaches: Multi-Factor Authentication adds layers beyond passwords!'
    },
    {
      id: 'password-manager',
      name: 'Password Manager Vault',
      description: 'Automatically generates and stores unique passwords',
      cost: 500,
      owned: 0,
      maxLevel: 5,
      icon: <Key className="w-4 h-4" />,
      effect: 'Teaches: Password managers create unique passwords for every account!'
    },
    {
      id: 'biometric-guard',
      name: 'Biometric Guardian',
      description: 'Adds fingerprint and face recognition security',
      cost: 750,
      owned: 0,
      maxLevel: 2,
      icon: <Target className="w-4 h-4" />,
      effect: 'Teaches: Biometrics are something you ARE, not something you KNOW!'
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
      icon: <CheckCircle className="w-4 h-4" />,
      cybersecurityConcept: 'Strong passwords are your first line of defense!'
    },
    {
      id: 'upgrade-master',
      name: 'Upgrade Master',
      description: 'Purchased your first upgrade!',
      requirement: 'Buy any upgrade',
      unlocked: false,
      icon: <Target className="w-4 h-4" />,
      cybersecurityConcept: 'Automation tools help create better passwords!'
    },
    {
      id: 'mfa-pioneer',
      name: 'Multi-Factor Master',
      description: 'Activated MFA Shield protection!',
      requirement: 'Purchase MFA Shield upgrade',
      unlocked: false,
      icon: <Shield className="w-4 h-4" />,
      cybersecurityConcept: 'MFA requires something you KNOW, HAVE, and ARE!'
    },
    {
      id: 'vault-keeper',
      name: 'Digital Vault Keeper',
      description: 'Mastered password manager technology!',
      requirement: 'Purchase Password Manager Vault',
      unlocked: false,
      icon: <Key className="w-4 h-4" />,
      cybersecurityConcept: 'Password managers generate unique passwords for every account!'
    },
    {
      id: 'biometric-expert',
      name: 'Biometric Security Expert',
      description: 'Understood the power of biometric authentication!',
      requirement: 'Purchase Biometric Guardian',
      unlocked: false,
      icon: <Target className="w-4 h-4" />,
      cybersecurityConcept: 'Biometrics verify WHO you are, not WHAT you know!'
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
    
    // 🛡️ MFA AND SECURITY TOOL BONUSES
    // These upgrades add additional security layers beyond just passwords!
    const mfaShield = upgrades.find(u => u.id === 'mfa-shield')?.owned || 0
    const passwordManager = upgrades.find(u => u.id === 'password-manager')?.owned || 0
    const biometricGuard = upgrades.find(u => u.id === 'biometric-guard')?.owned || 0
    
    strength += mfaShield * 15      // MFA adds significant security
    strength += passwordManager * 12   // Password managers help avoid reuse
    strength += biometricGuard * 20    // Biometrics are extremely secure
    
    // 🎯 PATTERN PENALTIES
    // Common patterns make passwords weaker
    if (pwd.includes('123')) strength -= 10    // sequential numbers
    if (pwd.includes('abc')) strength -= 10    // sequential letters
    if (pwd.toLowerCase().includes('password')) strength -= 20  // common word
    
    // 📊 Keep strength between 0 and 150 (higher cap for MFA bonuses)
    return Math.max(0, Math.min(150, strength))
  }, [upgrades])

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
    if (strength < 110) return 6  // Advanced fortress with MFA
    if (strength < 130) return 7  // Cyber fortress with biometrics
    return 8                      // Impenetrable digital fortress
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
        case 'mfa-pioneer':
          shouldUnlock = (upgrades.find(u => u.id === 'mfa-shield')?.owned || 0) > 0
          break
        case 'vault-keeper':
          shouldUnlock = (upgrades.find(u => u.id === 'password-manager')?.owned || 0) > 0
          break
        case 'biometric-expert':
          shouldUnlock = (upgrades.find(u => u.id === 'biometric-guard')?.owned || 0) > 0
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

            case 'mfa-shield':
              // 🛡️ MFA provides passive security bonus (calculated in strength function)
              // Shows educational toast about MFA concepts
              if (Math.random() < 0.1) {
                toast.info('🛡️ MFA Shield active: Your account has multiple protection layers!')
              }
              break

            case 'password-manager':
              // 🔐 Password Manager provides unique password generation
              if (Math.random() < 0.2) {
                // Simulate password manager generating unique characters
                const uniqueChars = 'QWERTYqwerty789!@#'
                newPassword += uniqueChars[Math.floor(Math.random() * uniqueChars.length)]
                shouldUpdate = true
                if (Math.random() < 0.3) {
                  toast.info('🔐 Password Manager: Generating unique password for this account!')
                }
              }
              break

            case 'biometric-guard':
              // 👤 Biometric Guard provides passive security bonus
              if (Math.random() < 0.05) {
                toast.info('👤 Biometric Guard: Your fingerprint/face adds extra security!')
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
   * 💾 LOAD SAVED STATE ON COMPONENT MOUNT
   * 
   * This retrieves previously saved game progress when the player returns!
   */
  useEffect(() => {
    const savedState = gameSpecificStates.passwordFortress
    if (savedState) {
      setPassword(savedState.password)
      setStats({
        length: savedState.password.length,
        strength: calculatePasswordStrength(savedState.password),
        securityPoints: savedState.securityPoints,
        clickCount: savedState.clickCount,
        fortressLevel: getFortressLevel(calculatePasswordStrength(savedState.password))
      })
      
      // Restore upgrades
      setUpgrades(prev => prev.map(upgrade => ({
        ...upgrade,
        owned: savedState.upgrades[upgrade.id]?.owned || 0,
        cost: savedState.upgrades[upgrade.id]?.cost || upgrade.cost
      })))
      
      // Restore achievements
      setAchievements(prev => prev.map(achievement => ({
        ...achievement,
        unlocked: savedState.achievements[achievement.id] || false
      })))
      
      toast.success('🎮 Game progress restored!')
    }
  }, [gameSpecificStates.passwordFortress, calculatePasswordStrength, getFortressLevel])

  /**
   * 💾 SAVE STATE WHENEVER IMPORTANT CHANGES OCCUR
   * 
   * This automatically saves your progress so you never lose it!
   */
  useEffect(() => {
    // Only save if we have meaningful progress
    if (password || stats.securityPoints > 0 || stats.clickCount > 0) {
      const upgradesState: { [key: string]: { owned: number; cost: number } } = {}
      upgrades.forEach(upgrade => {
        upgradesState[upgrade.id] = {
          owned: upgrade.owned,
          cost: upgrade.cost
        }
      })
      
      const achievementsState: { [key: string]: boolean } = {}
      achievements.forEach(achievement => {
        achievementsState[achievement.id] = achievement.unlocked
      })
      
      savePasswordFortressState({
        password,
        securityPoints: stats.securityPoints,
        clickCount: stats.clickCount,
        fortressLevel: stats.fortressLevel,
        upgrades: upgradesState,
        achievements: achievementsState,
        lastSaved: new Date().toISOString()
      })
    }
  }, [password, stats, upgrades, achievements, savePasswordFortressState])

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

            {/* 🛡️ MFA Education Center */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">
                🛡️ Multi-Factor Authentication (MFA) Center
              </h3>
              
              <div className="space-y-4">
                {/* MFA Basics */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    The Three Factors of Authentication
                  </h4>
                  <div className="space-y-2 text-blue-200 text-sm">
                    <div>🧠 <strong>Something you KNOW:</strong> Password, PIN, security questions</div>
                    <div>📱 <strong>Something you HAVE:</strong> Phone, token, smart card</div>
                    <div>👤 <strong>Something you ARE:</strong> Fingerprint, face, voice</div>
                  </div>
                </div>

                {/* MFA Status Display */}
                <div className="grid md:grid-cols-3 gap-3">
                  <div className={`text-center p-3 rounded-lg ${
                    (upgrades.find(u => u.id === 'mfa-shield')?.owned || 0) > 0 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-white/5'
                  }`}>
                    <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-white font-medium">MFA Shield</div>
                    <div className="text-xs text-blue-200">
                      Level {upgrades.find(u => u.id === 'mfa-shield')?.owned || 0}
                    </div>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg ${
                    (upgrades.find(u => u.id === 'password-manager')?.owned || 0) > 0 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-white/5'
                  }`}>
                    <Key className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-white font-medium">Password Vault</div>
                    <div className="text-xs text-blue-200">
                      Level {upgrades.find(u => u.id === 'password-manager')?.owned || 0}
                    </div>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg ${
                    (upgrades.find(u => u.id === 'biometric-guard')?.owned || 0) > 0 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-white/5'
                  }`}>
                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-white font-medium">Biometric Guard</div>
                    <div className="text-xs text-blue-200">
                      Level {upgrades.find(u => u.id === 'biometric-guard')?.owned || 0}
                    </div>
                  </div>
                </div>

                {/* Security Strength Display */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">🔒 Your Security Layers</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Password Strength:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (stats.strength / 100) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-bold">{Math.round(stats.strength)}%</span>
                      </div>
                    </div>
                    
                    {(upgrades.find(u => u.id === 'mfa-shield')?.owned || 0) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-300">+ MFA Protection:</span>
                        <span className="text-green-400 font-bold">+{(upgrades.find(u => u.id === 'mfa-shield')?.owned || 0) * 15} points</span>
                      </div>
                    )}
                    
                    {(upgrades.find(u => u.id === 'password-manager')?.owned || 0) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-blue-300">+ Unique Passwords:</span>
                        <span className="text-blue-400 font-bold">+{(upgrades.find(u => u.id === 'password-manager')?.owned || 0) * 12} points</span>
                      </div>
                    )}
                    
                    {(upgrades.find(u => u.id === 'biometric-guard')?.owned || 0) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">+ Biometric Auth:</span>
                        <span className="text-purple-400 font-bold">+{(upgrades.find(u => u.id === 'biometric-guard')?.owned || 0) * 20} points</span>
                      </div>
                    )}
                  </div>
                </div>
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
