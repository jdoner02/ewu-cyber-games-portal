/**
 * 🔐 ENCRYPTION ESCAPE ROOM - Educational Cryptography Game
 * 
 * Escape the digital prison by mastering encryption and decryption!
 * 
 * WHAT YOU'LL LEARN:
 * - How encryption protects sensitive information
 * - Different types of ciphers and their strengths
 * - The mathematical foundations of modern cryptography
 * - Why encryption keys are critical for security
 * 
 * GAME MECHANICS (Escape Room + Puzzles!):
 * - Solve encryption puzzles to unlock doors
 * - Use historical and modern cipher techniques
 * - Discover hidden messages and secret codes
 * - Progress from simple substitution to advanced algorithms
 * 
 * FOR STUDENT DEVELOPERS:
 * This game teaches cryptography fundamentals through interactive
 * puzzle solving. Every cipher technique demonstrated here is used
 * in real cybersecurity applications!
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  Unlock, 
  Key, 
  Eye, 
  EyeOff,
  Hash,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Binary,
  Calculator,
  BookOpen,
  Trophy,
  Timer,
  Zap,
  Brain
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * 🔐 ENCRYPTION PUZZLE TYPES
 * 
 * These interfaces define our educational cryptography challenges!
 */

interface EncryptionPuzzle {
  id: string
  room: number
  type: 'caesar' | 'substitution' | 'vigenere' | 'rsa' | 'hash' | 'steganography'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  encryptedMessage: string
  solution: string
  hints: string[]
  educationalInfo: string[]
  tools: string[]
  keyInfo?: string
  completed: boolean
  timeLimit: number // seconds
}

interface CipherTool {
  name: string
  description: string
  icon: string
  action: (input: string, key?: string) => string
}

interface GameProgress {
  currentRoom: number
  totalRooms: number
  puzzlesSolved: number
  hintsUsed: number
  totalTime: number
  score: number
  achievements: string[]
  cryptographyLevel: 'novice' | 'apprentice' | 'expert' | 'master'
}

/**
 * 🎯 ENCRYPTION PUZZLE DATABASE
 * 
 * Educational puzzles that teach cryptography concepts progressively!
 */
const ENCRYPTION_PUZZLES: EncryptionPuzzle[] = [
  {
    id: 'room1_caesar',
    room: 1,
    type: 'caesar',
    title: 'The Caesar Cipher Lock',
    description: 'Emperor Julius Caesar used this simple cipher to protect military messages. Shift each letter by a fixed number!',
    difficulty: 'beginner',
    encryptedMessage: 'PHHW PH DW WKH ILEHU RSWLF FDEOH',
    solution: 'MEET ME AT THE FIBER OPTIC CABLE',
    hints: [
      'Caesar cipher shifts each letter by the same amount',
      'Try shifting letters backward by 3 positions',
      'A becomes X, B becomes Y, C becomes Z when shifting back by 3'
    ],
    educationalInfo: [
      'Caesar cipher is one of the oldest known encryption methods',
      'It\'s a type of substitution cipher with a fixed shift',
      'Easy to break with frequency analysis or brute force',
      'Modern encryption uses much more complex mathematical operations'
    ],
    tools: ['caesar_decoder', 'frequency_analyzer'],
    keyInfo: 'Key: Shift value (1-25)',
    completed: false,
    timeLimit: 300
  },
  {
    id: 'room2_substitution',
    room: 2,
    type: 'substitution',
    title: 'The Substitution Chamber',
    description: 'Each letter is replaced with a different letter. Use frequency analysis to crack this cipher!',
    difficulty: 'intermediate',
    encryptedMessage: 'WKH VHFUHW LV KLGGHQ LQ WKH GDWDEDVH VHUYLR',
    solution: 'THE SECRET IS HIDDEN IN THE DATABASE SERVER',
    hints: [
      'Look for common letters like E, T, A, O, I, N',
      'Single letter words are usually A or I',
      'Common three-letter words: THE, AND, FOR'
    ],
    educationalInfo: [
      'Substitution ciphers replace each letter with another letter',
      'Frequency analysis exploits letter usage patterns in languages',
      'E is the most common letter in English (~12% frequency)',
      'Modern ciphers use mathematical operations, not simple substitution'
    ],
    tools: ['substitution_decoder', 'frequency_analyzer', 'pattern_matcher'],
    completed: false,
    timeLimit: 600
  },
  {
    id: 'room3_vigenere',
    room: 3,
    type: 'vigenere',
    title: 'The Vigenère Vault',
    description: 'This "unbreakable" cipher uses a keyword to create multiple Caesar shifts. Find the repeating key!',
    difficulty: 'intermediate',
    encryptedMessage: 'FMVS JNQZ LHWZ DLCQ SHVA FGKL',
    solution: 'NEXT ROOM USES QUANTUM KEYS',
    hints: [
      'The keyword repeats throughout the message',
      'Try the keyword "CYBER" for this message',
      'Each letter of the keyword creates a different Caesar shift'
    ],
    educationalInfo: [
      'Vigenère cipher uses a repeating keyword to vary the encryption',
      'Each keyword letter determines the Caesar shift for that position',
      'Was considered unbreakable for 300 years ("Le Chiffre Indéchiffrable")',
      'Broken by finding the keyword length and frequency analysis'
    ],
    tools: ['vigenere_decoder', 'keyword_analyzer', 'kasiski_test'],
    keyInfo: 'Key: CYBER',
    completed: false,
    timeLimit: 900
  },
  {
    id: 'room4_rsa',
    room: 4,
    type: 'rsa',
    title: 'The RSA Mathematics Portal',
    description: 'Modern public-key cryptography uses mathematical operations on very large numbers. Decrypt using modular arithmetic!',
    difficulty: 'advanced',
    encryptedMessage: '89 156 204 72 156 108 47 89 72 230',
    solution: 'ASYMMETRIC',
    hints: [
      'RSA decryption: message = ciphertext^d mod n',
      'Public key: n=247, e=3',
      'Private key: d=163',
      'Convert numbers back to letters (A=1, B=2, ...)'
    ],
    educationalInfo: [
      'RSA enables secure communication without sharing secret keys',
      'Based on the mathematical difficulty of factoring large numbers',
      'Uses public key for encryption, private key for decryption',
      'Foundation of modern internet security (HTTPS, digital signatures)'
    ],
    tools: ['rsa_calculator', 'modular_arithmetic', 'number_converter'],
    keyInfo: 'Public: (n=247, e=3), Private: d=163',
    completed: false,
    timeLimit: 1200
  },
  {
    id: 'room5_hash',
    room: 5,
    type: 'hash',
    title: 'The Hash Function Sanctum',
    description: 'One-way mathematical functions create unique fingerprints for data. Find the input that produces the target hash!',
    difficulty: 'advanced',
    encryptedMessage: 'Target SHA-256: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    solution: 'hello',
    hints: [
      'Hash functions are one-way - easy to compute, hard to reverse',
      'Try common words or phrases',
      'The target hash is for a simple English word',
      'Rainbow tables contain precomputed hashes for common inputs'
    ],
    educationalInfo: [
      'Hash functions create fixed-size outputs from variable inputs',
      'Used for password storage, data integrity, and digital signatures',
      'SHA-256 is cryptographically secure - no known way to reverse it',
      'Collision resistance: finding two inputs with same hash is computationally infeasible'
    ],
    tools: ['hash_calculator', 'rainbow_table', 'dictionary_attack'],
    keyInfo: 'Find input that produces the target SHA-256 hash',
    completed: false,
    timeLimit: 600
  }
]

/**
 * 🛠️ CRYPTOGRAPHY TOOLS
 * 
 * Interactive tools that help students understand encryption techniques!
 */
const CIPHER_TOOLS: Record<string, CipherTool> = {
  caesar_decoder: {
    name: 'Caesar Decoder',
    description: 'Shift letters by a fixed amount',
    icon: '🏛️',
    action: (input: string, shift: string = '3') => {
      const shiftAmount = parseInt(shift) || 3
      return input.split('').map(char => {
        if (char.match(/[A-Z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 65 - shiftAmount + 26) % 26) + 65)
        }
        return char
      }).join('')
    }
  },
  frequency_analyzer: {
    name: 'Frequency Analyzer',
    description: 'Count letter frequencies in the message',
    icon: '📊',
    action: (input: string) => {
      const frequencies: Record<string, number> = {}
      const letters = input.replace(/[^A-Z]/g, '')
      
      for (const letter of letters) {
        frequencies[letter] = (frequencies[letter] || 0) + 1
      }
      
      const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([letter, count]) => `${letter}: ${count}`)
        .join(', ')
      
      return `Most frequent letters: ${sorted}`
    }
  },
  vigenere_decoder: {
    name: 'Vigenère Decoder',
    description: 'Decode using a repeating keyword',
    icon: '🔑',
    action: (input: string, keyword: string = 'CYBER') => {
      const key = keyword.toUpperCase()
      return input.split('').map((char, index) => {
        if (char.match(/[A-Z]/)) {
          const keyShift = key[index % key.length].charCodeAt(0) - 65
          return String.fromCharCode(((char.charCodeAt(0) - 65 - keyShift + 26) % 26) + 65)
        }
        return char
      }).join('')
    }
  },
  hash_calculator: {
    name: 'Hash Calculator',
    description: 'Calculate hash values for input text',
    icon: '#️⃣',
    action: (input: string) => {
      // Simple hash simulation for educational purposes
      let hash = 0
      for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return `Simple hash: ${Math.abs(hash).toString(16)}`
    }
  }
}

/**
 * 🏆 ACHIEVEMENT SYSTEM
 * 
 * Students earn achievements for mastering cryptographic concepts!
 */
const ACHIEVEMENTS = {
  'first_cipher': {
    name: 'First Steps',
    description: 'Solved your first encryption puzzle!',
    icon: '🔓'
  },
  'speed_demon': {
    name: 'Speed Demon',
    description: 'Solved a puzzle in under 60 seconds!',
    icon: '⚡'
  },
  'no_hints': {
    name: 'Pure Genius',
    description: 'Solved a puzzle without using any hints!',
    icon: '🧠'
  },
  'crypto_master': {
    name: 'Crypto Master',
    description: 'Completed all encryption challenges!',
    icon: '👑'
  },
  'frequency_expert': {
    name: 'Frequency Expert',
    description: 'Mastered frequency analysis techniques!',
    icon: '📈'
  }
}

/**
 * 🔐 MAIN ENCRYPTION ESCAPE ROOM COMPONENT
 * 
 * The complete cryptography learning experience!
 */
export default function EncryptionEscapeRoom() {
  /**
   * 🎮 GAME STATE MANAGEMENT
   */
  const [progress, setProgress] = useState<GameProgress>({
    currentRoom: 1,
    totalRooms: 5,
    puzzlesSolved: 0,
    hintsUsed: 0,
    totalTime: 0,
    score: 0,
    achievements: [],
    cryptographyLevel: 'novice'
  })
  
  const [puzzles, setPuzzles] = useState(ENCRYPTION_PUZZLES)
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[0])
  const [userInput, setUserInput] = useState('')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [toolInput, setToolInput] = useState('')
  const [toolKey, setToolKey] = useState('')
  const [toolOutput, setToolOutput] = useState('')
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(currentPuzzle.timeLimit)
  const [gameStarted, setGameStarted] = useState(false)
  const [showEducationalInfo, setShowEducationalInfo] = useState(false)

  /**
   * ⏱️ TIMER SYSTEM
   * 
   * Tracks time spent on each puzzle and provides urgency.
   */
  useEffect(() => {
    if (!gameStarted || currentPuzzle.completed) return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          toast.error('Time\'s up! The encryption systems have reset.')
          resetPuzzle()
          return currentPuzzle.timeLimit
        }
        return prev - 1
      })
      
      setProgress(prev => ({
        ...prev,
        totalTime: prev.totalTime + 1
      }))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameStarted, currentPuzzle.completed, currentPuzzle.timeLimit])

  /**
   * 🔧 CIPHER TOOL SYSTEM
   * 
   * Interactive tools for learning encryption techniques.
   */
  const useTool = (toolId: string) => {
    const tool = CIPHER_TOOLS[toolId]
    if (!tool) return
    
    try {
      const result = tool.action(toolInput, toolKey)
      setToolOutput(result)
      toast.success(`${tool.name} applied successfully!`)
    } catch (error) {
      toast.error('Tool error - check your input format')
      setToolOutput('Error: Invalid input format')
    }
  }

  /**
   * 🎯 SOLUTION CHECKING SYSTEM
   * 
   * Validates puzzle solutions and provides educational feedback.
   */
  const checkSolution = () => {
    const normalizedInput = userInput.toUpperCase().replace(/[^A-Z]/g, '')
    const normalizedSolution = currentPuzzle.solution.toUpperCase().replace(/[^A-Z]/g, '')
    
    if (normalizedInput === normalizedSolution) {
      // Correct solution!
      const timeBonus = Math.max(0, timeRemaining * 10)
      const hintPenalty = hintsRevealed * 50
      const puzzleScore = Math.max(100, 500 + timeBonus - hintPenalty)
      
      setPuzzles(prev => 
        prev.map(p => p.id === currentPuzzle.id ? { ...p, completed: true } : p)
      )
      
      setProgress(prev => ({
        ...prev,
        puzzlesSolved: prev.puzzlesSolved + 1,
        score: prev.score + puzzleScore,
        currentRoom: prev.currentRoom + 1
      }))
      
      // Check for achievements
      checkAchievements(timeRemaining, hintsRevealed)
      
      toast.success(`🎉 Puzzle solved! +${puzzleScore} points`)
      
      // Move to next room
      if (progress.currentRoom < progress.totalRooms) {
        setTimeout(() => {
          const nextPuzzle = puzzles.find(p => p.room === progress.currentRoom + 1)
          if (nextPuzzle) {
            setCurrentPuzzle(nextPuzzle)
            setTimeRemaining(nextPuzzle.timeLimit)
            setUserInput('')
            setHintsRevealed(0)
            setToolOutput('')
          }
        }, 2000)
      } else {
        // Game completed!
        toast.success('🏆 Congratulations! You\'ve mastered the art of cryptography!')
        setProgress(prev => ({
          ...prev,
          cryptographyLevel: 'master'
        }))
      }
    } else {
      toast.error('Incorrect solution. Keep trying!')
      
      // Provide helpful feedback
      if (normalizedInput.length !== normalizedSolution.length) {
        toast.info(`Hint: Solution should be ${normalizedSolution.length} characters long`)
      }
    }
  }

  /**
   * 🏆 ACHIEVEMENT CHECKING
   * 
   * Awards achievements based on performance metrics.
   */
  const checkAchievements = (timeLeft: number, hintsUsed: number) => {
    const newAchievements: string[] = []
    
    // First cipher solved
    if (progress.puzzlesSolved === 0) {
      newAchievements.push('first_cipher')
    }
    
    // Speed demon (solved quickly)
    if (timeLeft > currentPuzzle.timeLimit - 60) {
      newAchievements.push('speed_demon')
    }
    
    // No hints used
    if (hintsUsed === 0) {
      newAchievements.push('no_hints')
    }
    
    // All puzzles completed
    if (progress.puzzlesSolved === progress.totalRooms - 1) {
      newAchievements.push('crypto_master')
    }
    
    // Frequency analysis expert
    if (currentPuzzle.type === 'substitution' && hintsUsed <= 1) {
      newAchievements.push('frequency_expert')
    }
    
    // Update achievements
    const filteredAchievements = newAchievements.filter(
      achievement => !progress.achievements.includes(achievement)
    )
    
    if (filteredAchievements.length > 0) {
      setProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...filteredAchievements]
      }))
      
      filteredAchievements.forEach(achievement => {
        toast.success(`🏆 Achievement: ${ACHIEVEMENTS[achievement as keyof typeof ACHIEVEMENTS].name}!`)
      })
    }
  }

  /**
   * 💡 HINT SYSTEM
   * 
   * Progressive hints help students learn without giving away answers.
   */
  const revealHint = () => {
    if (hintsRevealed < currentPuzzle.hints.length) {
      setHintsRevealed(prev => prev + 1)
      setProgress(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1
      }))
      toast.info('Hint revealed! Check the hints panel.')
    }
  }

  /**
   * 🔄 PUZZLE RESET SYSTEM
   * 
   * Allows students to restart a puzzle if they get stuck.
   */
  const resetPuzzle = () => {
    setUserInput('')
    setToolOutput('')
    setHintsRevealed(0)
    setTimeRemaining(currentPuzzle.timeLimit)
    toast.info('Puzzle reset. Try a different approach!')
  }

  /**
   * 🎮 GAME INITIALIZATION
   */
  const startGame = () => {
    setGameStarted(true)
    setTimeRemaining(currentPuzzle.timeLimit)
    toast.success('Welcome to the Encryption Escape Room! 🔐')
  }

  /**
   * 🎨 RENDER THE ENCRYPTION ESCAPE ROOM INTERFACE
   * 
   * Creates an immersive cryptography learning environment!
   */
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      
      {/* 🏢 Game Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🔐 Encryption Escape Room 🔐
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Master the art of cryptography to escape the digital prison!
        </p>
        
        {/* Progress Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white rounded-lg p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Room {progress.currentRoom}</div>
            <div className="text-sm text-gray-600">Current Challenge</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
            <div className="text-sm text-gray-600">Time Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{progress.score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{progress.puzzlesSolved}/{progress.totalRooms}</div>
            <div className="text-sm text-gray-600">Puzzles Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{progress.achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </motion.div>

      {!gameStarted ? (
        /* 🚀 Game Start Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Cryptography Student!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            You've been trapped in a digital prison protected by advanced encryption systems. 
            To escape, you must master the ancient and modern arts of cryptography - from Caesar's 
            simple substitution ciphers to today's RSA public-key encryption.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Each room presents a unique cryptographic challenge. Use the tools, analyze patterns, 
            and think like a codebreaker to decrypt the messages and unlock your path to freedom!
          </p>
          <motion.button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Your Escape! 🚀
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 🔐 Main Puzzle Area */}
          <div className="lg:col-span-2">
            <motion.div 
              key={currentPuzzle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              
              {/* Puzzle Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold">{currentPuzzle.title}</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentPuzzle.difficulty === 'beginner' ? 'bg-green-500' :
                    currentPuzzle.difficulty === 'intermediate' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    {currentPuzzle.difficulty}
                  </div>
                </div>
                <p className="text-blue-100 mb-4">{currentPuzzle.description}</p>
                
                {/* Timer and Key Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Timer className="w-4 h-4" />
                      <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                    </div>
                    {currentPuzzle.keyInfo && (
                      <div className="flex items-center space-x-1">
                        <Key className="w-4 h-4" />
                        <span>{currentPuzzle.keyInfo}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-purple-200">
                    Room {currentPuzzle.room} of {progress.totalRooms}
                  </div>
                </div>
              </div>
              
              {/* Encrypted Message */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Encrypted Message
                </h3>
                <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-lg tracking-wider">
                  {currentPuzzle.encryptedMessage}
                </div>
              </div>
              
              {/* Solution Input */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Unlock className="w-5 h-5 mr-2" />
                  Your Decryption
                </h3>
                
                <div className="flex space-x-3 mb-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter your decrypted message here..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => e.key === 'Enter' && checkSolution()}
                  />
                  <motion.button
                    onClick={checkSolution}
                    disabled={!userInput.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {/* Puzzle Controls */}
                <div className="flex space-x-3">
                  <button
                    onClick={revealHint}
                    disabled={hintsRevealed >= currentPuzzle.hints.length}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    <Lightbulb className="w-4 h-4 inline mr-1" />
                    Hint ({hintsRevealed}/{currentPuzzle.hints.length})
                  </button>
                  
                  <button
                    onClick={() => setShowEducationalInfo(!showEducationalInfo)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Learn More
                  </button>
                  
                  <button
                    onClick={resetPuzzle}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-1" />
                    Reset
                  </button>
                </div>
              </div>
              
              {/* Educational Information */}
              {showEducationalInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 p-6 border-t border-blue-200"
                >
                  <h4 className="font-semibold text-blue-800 mb-3">🎓 Cryptography Lesson</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    {currentPuzzle.educationalInfo.map((info, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {/* Hints Panel */}
              {hintsRevealed > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 p-6 border-t border-yellow-200"
                >
                  <h4 className="font-semibold text-yellow-800 mb-3">💡 Hints</h4>
                  <div className="space-y-2">
                    {currentPuzzle.hints.slice(0, hintsRevealed).map((hint, index) => (
                      <div key={index} className="bg-yellow-100 p-3 rounded-lg text-sm text-yellow-800">
                        <strong>Hint {index + 1}:</strong> {hint}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* 🛠️ Tools & Info Panel */}
          <div className="space-y-6">
            
            {/* Cryptography Tools */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                🔧 Crypto Tools
              </h3>
              
              <div className="space-y-3">
                {currentPuzzle.tools.map((toolId) => {
                  const tool = CIPHER_TOOLS[toolId]
                  if (!tool) return null
                  
                  return (
                    <motion.button
                      key={toolId}
                      onClick={() => setSelectedTool(selectedTool === toolId ? null : toolId)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedTool === toolId
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{tool.icon}</span>
                          <span className="font-medium">{tool.name}</span>
                        </div>
                        {selectedTool === toolId && <Eye className="w-4 h-4" />}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{tool.description}</div>
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Tool Interface */}
              {selectedTool && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg border"
                >
                  <h4 className="font-medium mb-3">{CIPHER_TOOLS[selectedTool].name}</h4>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      placeholder="Enter text to analyze..."
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    
                    {selectedTool !== 'frequency_analyzer' && (
                      <input
                        type="text"
                        value={toolKey}
                        onChange={(e) => setToolKey(e.target.value)}
                        placeholder="Enter key/shift value..."
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    )}
                    
                    <button
                      onClick={() => {
                        useTool(selectedTool);
                      }}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white p-2 rounded text-sm"
                    >
                      Apply Tool
                    </button>
                    
                    {toolOutput && (
                      <div className="bg-white p-3 rounded border text-sm font-mono">
                        {toolOutput}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                🏆 Achievements
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(ACHIEVEMENTS).map(([id, achievement]) => (
                  <div 
                    key={id}
                    className={`p-3 rounded-lg text-center text-sm ${
                      progress.achievements.includes(id)
                        ? 'bg-yellow-100 border-2 border-yellow-400'
                        : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                📈 Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cryptography Level</span>
                    <span className="font-medium">{progress.cryptographyLevel}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(progress.puzzlesSolved / progress.totalRooms) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>⏱️ Total Time: {Math.floor(progress.totalTime / 60)}m {progress.totalTime % 60}s</div>
                  <div>💡 Hints Used: {progress.hintsUsed}</div>
                  <div>🎯 Success Rate: {progress.puzzlesSolved > 0 ? Math.round((progress.puzzlesSolved / (progress.puzzlesSolved + (progress.currentRoom - progress.puzzlesSolved))) * 100) : 0}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 🎓 EDUCATIONAL NOTES FOR STUDENT DEVELOPERS:
 * 
 * This Encryption Escape Room teaches comprehensive cryptography concepts:
 * 
 * 1. **Historical Ciphers**: Understanding how encryption evolved over time
 * 2. **Frequency Analysis**: Statistical methods for breaking substitution ciphers
 * 3. **Modern Cryptography**: RSA public-key encryption and hash functions
 * 4. **Mathematical Foundations**: Modular arithmetic and prime numbers
 * 5. **Practical Applications**: Real-world uses of each encryption method
 * 
 * Key Learning Objectives:
 * - Pattern recognition in encrypted text
 * - Understanding the relationship between keys and security
 * - Appreciating the mathematical complexity of modern encryption
 * - Recognizing the importance of key management
 * - Learning about one-way functions and their applications
 * 
 * Technical Implementation Details:
 * - Interactive cipher tools for hands-on learning
 * - Progressive difficulty from simple to advanced concepts
 * - Achievement system to motivate continued learning
 * - Timer system to add engagement and urgency
 * - Educational feedback integrated into gameplay
 * 
 * Try extending this game:
 * - Add more cipher types (Enigma, AES, elliptic curve)
 * - Implement visual representations of mathematical operations
 * - Create team-based cryptography competitions
 * - Add historical context for each cipher method
 * - Integrate with real cryptographic libraries for accuracy
 * 
 * Remember: Cryptography is the foundation of digital security - 
 * understanding these concepts helps protect our digital world! 🔐🌐
 */
