/**
 * 🏰 NETWORK DEFENSE TOWER - Educational Network Security Game
 * 
 * Build the ultimate cyber fortress to protect against network attacks!
 * 
 * WHAT YOU'LL LEARN:
 * - How firewalls filter network traffic
 * - Different types of cyber attacks and defenses
 * - Network architecture and security layers
 * - Real-time threat detection and response
 * 
 * GAME MECHANICS (Tower Defense + Education!):
 * - Place security devices to block incoming attacks
 * - Different attacks require different defense strategies
 * - Upgrade your defenses with better technology
 * - Learn from each attack attempt
 * 
 * FOR STUDENT DEVELOPERS:
 * This game teaches network security concepts through interactive
 * tower defense mechanics. Every defense mechanism represents
 * real cybersecurity technology!
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  Eye, 
  Lock,
  AlertTriangle,
  TrendingUp,
  Settings,
  Target,
  Server,
  Wifi,
  Database,
  Bug,
  Skull,
  Heart,
  Star,
  Award,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * 🎯 NETWORK SECURITY TYPES
 * 
 * These interfaces define our educational tower defense system!
 */

interface NetworkDefense {
  id: string
  type: 'firewall' | 'antivirus' | 'ids' | 'honeypot' | 'encryption'
  name: string
  description: string
  cost: number
  damage: number
  range: number
  speed: number
  specialAbility: string
  educationalInfo: string[]
  position: { x: number, y: number }
  level: number
  kills: number
}

interface CyberAttack {
  id: string
  type: 'malware' | 'ddos' | 'phishing' | 'ransomware' | 'insider_threat'
  name: string
  health: number
  maxHealth: number
  speed: number
  damage: number
  reward: number
  description: string
  vulnerableTo: string[]
  position: { x: number, y: number }
  pathIndex: number
  educationalInfo: string[]
}

interface GameStats {
  wave: number
  health: number
  maxHealth: number
  money: number
  score: number
  attacksBlocked: number
  attacksSucceeded: number
  defenseEfficiency: number
  experiencePoints: number
  levelsCompleted: number
}

interface DefenseTemplate {
  type: NetworkDefense['type']
  name: string
  description: string
  baseCost: number
  baseDamage: number
  baseRange: number
  baseSpeed: number
  specialAbility: string
  educationalInfo: string[]
  icon: string
}

/**
 * 🛡️ NETWORK DEFENSE TEMPLATES
 * 
 * Each defense type teaches different cybersecurity concepts!
 */
const DEFENSE_TEMPLATES: Record<NetworkDefense['type'], DefenseTemplate> = {
  firewall: {
    type: 'firewall',
    name: 'Network Firewall',
    description: 'Blocks unauthorized network traffic',
    baseCost: 100,
    baseDamage: 25,
    baseRange: 80,
    baseSpeed: 2,
    specialAbility: 'Blocks multiple attacks simultaneously',
    educationalInfo: [
      'Firewalls examine all network traffic entering and leaving a network',
      'They use rules to decide what traffic is allowed through',
      'Like security guards checking IDs at a building entrance',
      'Can block attacks based on IP addresses, ports, or protocols'
    ],
    icon: '🔥🧱'
  },
  antivirus: {
    type: 'antivirus',
    name: 'Antivirus Scanner',
    description: 'Detects and removes malicious software',
    baseCost: 75,
    baseDamage: 40,
    baseRange: 60,
    baseSpeed: 3,
    specialAbility: 'Extra damage against malware',
    educationalInfo: [
      'Antivirus software scans files and programs for known threats',
      'Uses signature databases to identify malicious code',
      'Can detect viruses, worms, trojans, and other malware',
      'Provides real-time protection and scheduled scans'
    ],
    icon: '🦠💉'
  },
  ids: {
    type: 'ids',
    name: 'Intrusion Detection System',
    description: 'Monitors network for suspicious activity',
    baseCost: 150,
    baseDamage: 15,
    baseRange: 120,
    baseSpeed: 4,
    specialAbility: 'Reveals hidden attacks and provides early warning',
    educationalInfo: [
      'IDS systems monitor network traffic for suspicious patterns',
      'Can detect attacks that firewalls might miss',
      'Like security cameras watching for unusual behavior',
      'Alerts administrators to potential security incidents'
    ],
    icon: '👁️🕸️'
  },
  honeypot: {
    type: 'honeypot',
    name: 'Honeypot Trap',
    description: 'Lures attackers into a controlled environment',
    baseCost: 200,
    baseDamage: 50,
    baseRange: 50,
    baseSpeed: 1,
    specialAbility: 'Slows down attackers and gathers intelligence',
    educationalInfo: [
      'Honeypots are fake systems designed to attract attackers',
      'They waste attackers\' time and resources',
      'Provide valuable information about attack methods',
      'Help security teams understand new threats'
    ],
    icon: '🍯🪤'
  },
  encryption: {
    type: 'encryption',
    name: 'Encryption Gateway',
    description: 'Protects data with advanced encryption',
    baseCost: 125,
    baseDamage: 30,
    baseRange: 70,
    baseSpeed: 2,
    specialAbility: 'Prevents data theft and protects sensitive information',
    educationalInfo: [
      'Encryption scrambles data so only authorized parties can read it',
      'Uses mathematical algorithms to transform plain text into cipher text',
      'Even if data is stolen, it\'s useless without the decryption key',
      'Essential for protecting sensitive information in transit and storage'
    ],
    icon: '🔐🌐'
  }
}

/**
 * 🦹 CYBER ATTACK TEMPLATES
 * 
 * Each attack type teaches about real cybersecurity threats!
 */
const ATTACK_TEMPLATES: Record<CyberAttack['type'], Omit<CyberAttack, 'id' | 'position' | 'pathIndex'>> = {
  malware: {
    type: 'malware',
    name: 'Malware Bot',
    health: 100,
    maxHealth: 100,
    speed: 1.5,
    damage: 15,
    reward: 25,
    description: 'Malicious software trying to infect your systems',
    vulnerableTo: ['antivirus', 'firewall'],
    educationalInfo: [
      'Malware includes viruses, worms, trojans, and spyware',
      'Can steal data, damage systems, or create backdoors',
      'Often spreads through email attachments or infected websites',
      'Antivirus software is the primary defense against malware'
    ]
  },
  ddos: {
    type: 'ddos',
    name: 'DDoS Swarm',
    health: 50,
    maxHealth: 50,
    speed: 3,
    damage: 10,
    reward: 15,
    description: 'Flood of traffic trying to overwhelm your servers',
    vulnerableTo: ['firewall', 'ids'],
    educationalInfo: [
      'DDoS attacks flood networks with traffic to make them unavailable',
      'Uses many compromised computers (botnets) to generate traffic',
      'Can take down websites and online services',
      'Firewalls and traffic filtering help defend against DDoS attacks'
    ]
  },
  phishing: {
    type: 'phishing',
    name: 'Phishing Hook',
    health: 75,
    maxHealth: 75,
    speed: 2,
    damage: 20,
    reward: 30,
    description: 'Social engineering attack targeting users',
    vulnerableTo: ['ids', 'honeypot'],
    educationalInfo: [
      'Phishing tricks users into revealing sensitive information',
      'Often uses fake emails or websites that look legitimate',
      'Targets human psychology rather than technical vulnerabilities',
      'User education and awareness are the best defenses'
    ]
  },
  ransomware: {
    type: 'ransomware',
    name: 'Ransomware Crypter',
    health: 150,
    maxHealth: 150,
    speed: 1,
    damage: 30,
    reward: 50,
    description: 'Malware that encrypts files and demands payment',
    vulnerableTo: ['antivirus', 'encryption'],
    educationalInfo: [
      'Ransomware encrypts victim\'s files and demands payment for decryption',
      'Can spread through networks and infect multiple systems',
      'Backup systems and encryption help protect against ransomware',
      'Never pay the ransom - it encourages more attacks'
    ]
  },
  insider_threat: {
    type: 'insider_threat',
    name: 'Insider Threat',
    health: 200,
    maxHealth: 200,
    speed: 0.5,
    damage: 25,
    reward: 75,
    description: 'Malicious activity from trusted users',
    vulnerableTo: ['ids', 'honeypot', 'encryption'],
    educationalInfo: [
      'Insider threats come from employees or contractors with legitimate access',
      'Can be malicious insiders or compromised accounts',
      'Difficult to detect because they already have authorized access',
      'Monitoring and access controls help detect insider threats'
    ]
  }
}

/**
 * 🗺️ NETWORK PATH SYSTEM
 * 
 * Defines the route attacks take through your network infrastructure.
 */
const NETWORK_PATH = [
  { x: 0, y: 200 },      // Internet entry point
  { x: 100, y: 200 },    // Border router
  { x: 200, y: 200 },    // DMZ
  { x: 300, y: 150 },    // External firewall
  { x: 400, y: 100 },    // Internal network
  { x: 500, y: 150 },    // Application servers
  { x: 600, y: 200 },    // Database servers
  { x: 700, y: 200 },    // Critical data center
]

/**
 * 🏰 MAIN NETWORK DEFENSE TOWER COMPONENT
 * 
 * The complete tower defense game with cybersecurity education!
 */
export default function NetworkDefenseTower() {
  /**
   * 🎮 GAME STATE MANAGEMENT
   */
  const [gameState, setGameState] = useState<'planning' | 'playing' | 'paused' | 'victory' | 'defeat'>('planning')
  const [stats, setStats] = useState<GameStats>({
    wave: 1,
    health: 100,
    maxHealth: 100,
    money: 300,
    score: 0,
    attacksBlocked: 0,
    attacksSucceeded: 0,
    defenseEfficiency: 100,
    experiencePoints: 0,
    levelsCompleted: 0
  })
  
  const [defenses, setDefenses] = useState<NetworkDefense[]>([])
  const [attacks, setAttacks] = useState<CyberAttack[]>([])
  const [selectedDefenseType, setSelectedDefenseType] = useState<NetworkDefense['type'] | null>(null)
  const [selectedDefense, setSelectedDefense] = useState<NetworkDefense | null>(null)
  const [waveInProgress, setWaveInProgress] = useState(false)
  const [showEducationalInfo, setShowEducationalInfo] = useState<string | null>(null)

  const gameLoopRef = useRef<number | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /**
   * 🎯 DEFENSE PLACEMENT SYSTEM
   * 
   * Handles placing cybersecurity defenses on the network map.
   */
  const placeDefense = useCallback((x: number, y: number) => {
    if (!selectedDefenseType || !canvasRef.current) return
    
    const template = DEFENSE_TEMPLATES[selectedDefenseType]
    
    // Check if player has enough money
    if (stats.money < template.baseCost) {
      toast.error(`Not enough budget! Need $${template.baseCost}`)
      return
    }
    
    // Check if position is valid (not on path, not too close to other defenses)
    const isValidPosition = !defenses.some(defense => 
      Math.sqrt((defense.position.x - x) ** 2 + (defense.position.y - y) ** 2) < 50
    )
    
    if (!isValidPosition) {
      toast.error('Too close to another defense system!')
      return
    }
    
    // Create new defense
    const newDefense: NetworkDefense = {
      id: `defense-${Date.now()}`,
      type: template.type,
      name: template.name,
      description: template.description,
      cost: template.baseCost,
      damage: template.baseDamage,
      range: template.baseRange,
      speed: template.baseSpeed,
      specialAbility: template.specialAbility,
      educationalInfo: template.educationalInfo,
      position: { x, y },
      level: 1,
      kills: 0
    }
    
    setDefenses(prev => [...prev, newDefense])
    setStats(prev => ({ ...prev, money: prev.money - template.baseCost }))
    setSelectedDefenseType(null)
    
    toast.success(`${template.name} deployed! 🛡️`)
  }, [selectedDefenseType, stats.money, defenses])

  /**
   * 🌊 WAVE GENERATION SYSTEM
   * 
   * Creates waves of cyber attacks with educational progression.
   */
  const generateWave = useCallback(() => {
    const waveAttacks: CyberAttack[] = []
    const baseCount = Math.floor(stats.wave * 1.5)
    
    // Wave composition changes based on difficulty
    const attackTypes: CyberAttack['type'][] = ['malware', 'ddos']
    
    if (stats.wave >= 3) attackTypes.push('phishing')
    if (stats.wave >= 5) attackTypes.push('ransomware')
    if (stats.wave >= 7) attackTypes.push('insider_threat')
    
    for (let i = 0; i < baseCount; i++) {
      const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)]
      const template = ATTACK_TEMPLATES[attackType]
      
      const attack: CyberAttack = {
        id: `attack-${Date.now()}-${i}`,
        ...template,
        position: { ...NETWORK_PATH[0] },
        pathIndex: 0
      }
      
      // Scale difficulty with wave number
      attack.health = Math.floor(attack.health * (1 + stats.wave * 0.2))
      attack.maxHealth = attack.health
      attack.speed = attack.speed * (1 + stats.wave * 0.1)
      attack.damage = Math.floor(attack.damage * (1 + stats.wave * 0.15))
      attack.reward = Math.floor(attack.reward * (1 + stats.wave * 0.1))
      
      waveAttacks.push(attack)
    }
    
    return waveAttacks
  }, [stats.wave])

  /**
   * ⚔️ COMBAT SYSTEM
   * 
   * Handles defense vs attack interactions with educational feedback.
   */
  const updateCombat = useCallback(() => {
    setAttacks(prevAttacks => {
      const updatedAttacks = [...prevAttacks]
      
      // Move attacks along the path
      updatedAttacks.forEach(attack => {
        if (attack.pathIndex < NETWORK_PATH.length - 1) {
          const currentTarget = NETWORK_PATH[attack.pathIndex + 1]
          const dx = currentTarget.x - attack.position.x
          const dy = currentTarget.y - attack.position.y
          const distance = Math.sqrt(dx ** 2 + dy ** 2)
          
          if (distance < 5) {
            attack.pathIndex++
          } else {
            attack.position.x += (dx / distance) * attack.speed
            attack.position.y += (dy / distance) * attack.speed
          }
        }
      })
      
      // Defense attacks
      defenses.forEach(defense => {
        const attacksInRange = updatedAttacks.filter(attack => {
          const distance = Math.sqrt(
            (attack.position.x - defense.position.x) ** 2 + 
            (attack.position.y - defense.position.y) ** 2
          )
          return distance <= defense.range && attack.health > 0
        })
        
        if (attacksInRange.length > 0) {
          const target = attacksInRange[0]
          
          // Check if this defense is effective against this attack type
          const isEffective = target.vulnerableTo.includes(defense.type)
          const damageMultiplier = isEffective ? 1.5 : 1
          
          target.health -= defense.damage * damageMultiplier
          
          if (target.health <= 0) {
            defense.kills++
            setStats(prev => ({
              ...prev,
              money: prev.money + target.reward,
              score: prev.score + target.reward * 10,
              attacksBlocked: prev.attacksBlocked + 1,
              experiencePoints: prev.experiencePoints + target.reward
            }))
            
            if (isEffective) {
              toast.success(`${defense.name} blocked ${target.name}! (+${Math.floor(target.reward * 1.5)})`)
            }
          }
        }
      })
      
      // Remove defeated attacks
      return updatedAttacks.filter(attack => attack.health > 0)
    })
  }, [defenses])

  /**
   * 🏥 HEALTH AND DAMAGE SYSTEM
   * 
   * Handles what happens when attacks reach critical systems.
   */
  const processAttackDamage = useCallback(() => {
    setAttacks(prevAttacks => {
      const survivingAttacks = prevAttacks.filter(attack => {
        if (attack.pathIndex >= NETWORK_PATH.length - 1) {
          // Attack reached critical systems
          setStats(prev => ({
            ...prev,
            health: Math.max(0, prev.health - attack.damage),
            attacksSucceeded: prev.attacksSucceeded + 1
          }))
          
          toast.error(`${attack.name} breached your defenses! (-${attack.damage} security)`)
          return false
        }
        return true
      })
      
      return survivingAttacks
    })
  }, [])

  /**
   * 🎮 MAIN GAME LOOP
   * 
   * Orchestrates all game systems and updates.
   */
  const gameLoop = useCallback(() => {
    if (gameState === 'playing') {
      updateCombat()
      processAttackDamage()
      
      // Check win/lose conditions
      if (stats.health <= 0) {
        setGameState('defeat')
        toast.error('Network compromised! Your cybersecurity defenses have failed.')
        return
      }
      
      // Check if wave is complete
      if (waveInProgress && attacks.length === 0) {
        setWaveInProgress(false)
        setStats(prev => ({ 
          ...prev, 
          wave: prev.wave + 1,
          defenseEfficiency: (prev.attacksBlocked / (prev.attacksBlocked + prev.attacksSucceeded)) * 100
        }))
        toast.success(`Wave ${stats.wave} defended! Preparing next attack wave...`)
        
        if (stats.wave >= 10) {
          setGameState('victory')
          toast.success('🏆 Network fully secured! You\'ve mastered cybersecurity defense!')
        }
      }
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, stats.health, stats.wave, waveInProgress, attacks.length, updateCombat, processAttackDamage])

  /**
   * 🌊 START WAVE HANDLER
   * 
   * Begins the next wave of cyber attacks.
   */
  const startWave = () => {
    if (!waveInProgress) {
      const newAttacks = generateWave()
      setAttacks(newAttacks)
      setWaveInProgress(true)
      setGameState('playing')
      toast.info(`Wave ${stats.wave} incoming! ${newAttacks.length} cyber threats detected!`)
    }
  }

  /**
   * 🔄 GAME LIFECYCLE EFFECTS
   */
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop])

  /**
   * 🎨 CANVAS RENDERING SYSTEM
   * 
   * Draws the network topology and security visualization.
   */
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw network path
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    NETWORK_PATH.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw network nodes
    NETWORK_PATH.forEach((point, index) => {
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Label network segments
      const labels = ['Internet', 'Router', 'DMZ', 'Firewall', 'LAN', 'Servers', 'Database', 'Core']
      ctx.fillStyle = '#1e293b'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(labels[index], point.x, point.y - 15)
    })
    
    // Draw defenses
    defenses.forEach(defense => {
      const template = DEFENSE_TEMPLATES[defense.type]
      
      // Defense range
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
      ctx.beginPath()
      ctx.arc(defense.position.x, defense.position.y, defense.range, 0, Math.PI * 2)
      ctx.fill()
      
      // Defense unit
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(
        defense.position.x - 15, 
        defense.position.y - 15, 
        30, 
        30
      )
      
      // Defense icon
      ctx.fillStyle = 'white'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(template.icon, defense.position.x, defense.position.y + 5)
      
      // Level indicator
      ctx.fillStyle = '#fbbf24'
      ctx.font = '10px Arial'
      ctx.fillText(`L${defense.level}`, defense.position.x, defense.position.y + 25)
    })
    
    // Draw attacks
    attacks.forEach(attack => {
      const attackColor = {
        malware: '#ef4444',
        ddos: '#f97316',
        phishing: '#8b5cf6',
        ransomware: '#dc2626',
        insider_threat: '#6b7280'
      }[attack.type]
      
      // Attack unit
      ctx.fillStyle = attackColor
      ctx.beginPath()
      ctx.arc(attack.position.x, attack.position.y, 12, 0, Math.PI * 2)
      ctx.fill()
      
      // Health bar
      const healthPercent = attack.health / attack.maxHealth
      ctx.fillStyle = '#fee2e2'
      ctx.fillRect(attack.position.x - 15, attack.position.y - 20, 30, 4)
      ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444'
      ctx.fillRect(attack.position.x - 15, attack.position.y - 20, 30 * healthPercent, 4)
    })
    
  }, [defenses, attacks])

  /**
   * 🖼️ RENDER LOOP
   */
  useEffect(() => {
    const renderLoop = () => {
      drawGame()
      requestAnimationFrame(renderLoop)
    }
    renderLoop()
  }, [drawGame])

  /**
   * 🎨 RENDER THE NETWORK DEFENSE INTERFACE
   * 
   * Creates the complete tower defense game interface!
   */
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      
      {/* 🏢 Game Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🏰 Network Defense Tower 🏰
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Build cybersecurity defenses to protect your network infrastructure!
        </p>
        
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white rounded-lg p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Wave {stats.wave}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.health}</div>
            <div className="text-sm text-gray-600">Security Health</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${stats.money}</div>
            <div className="text-sm text-gray-600">Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.attacksBlocked}</div>
            <div className="text-sm text-gray-600">Threats Blocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{stats.defenseEfficiency.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Defense Rate</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 🎮 Game Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
            {/* Game Controls */}
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <motion.button
                    onClick={startWave}
                    disabled={waveInProgress || gameState === 'defeat'}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    <span>{waveInProgress ? 'Wave Active' : 'Start Wave'}</span>
                  </motion.button>
                  
                  <button
                    onClick={() => setGameState(gameState === 'paused' ? 'playing' : 'paused')}
                    disabled={!waveInProgress}
                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{gameState === 'paused' ? 'Resume' : 'Pause'}</span>
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  {gameState === 'planning' && 'Plan your defenses, then start the wave!'}
                  {gameState === 'playing' && 'Cyber attacks incoming! Defend your network!'}
                  {gameState === 'paused' && 'Game paused - resume when ready'}
                  {gameState === 'victory' && '🏆 Network secured! All threats neutralized!'}
                  {gameState === 'defeat' && '💥 Network compromised! Try again with better defenses.'}
                </div>
              </div>
            </div>
            
            {/* Network Defense Canvas */}
            <div className="relative">
              <canvas 
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full cursor-crosshair"
                onClick={(e) => {
                  const rect = canvasRef.current?.getBoundingClientRect()
                  if (rect && selectedDefenseType) {
                    const x = ((e.clientX - rect.left) / rect.width) * 800
                    const y = ((e.clientY - rect.top) / rect.height) * 400
                    placeDefense(x, y)
                  }
                }}
              />
              
              {selectedDefenseType && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                  Click to place {DEFENSE_TEMPLATES[selectedDefenseType].name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🛡️ Defense Shop & Info Panel */}
        <div className="space-y-6">
          
          {/* Defense Shop */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              🛒 Defense Systems
            </h3>
            
            <div className="space-y-3">
              {Object.values(DEFENSE_TEMPLATES).map((template) => (
                <motion.button
                  key={template.type}
                  onClick={() => setSelectedDefenseType(template.type)}
                  disabled={stats.money < template.baseCost}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedDefenseType === template.type
                      ? 'border-blue-500 bg-blue-50'
                      : stats.money >= template.baseCost
                      ? 'border-gray-200 hover:border-blue-300 bg-white'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                  whileHover={{ scale: stats.money >= template.baseCost ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{template.icon}</span>
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <span className="font-bold text-green-600">${template.baseCost}</span>
                  </div>
                  <div className="text-sm text-gray-600">{template.description}</div>
                  <div className="text-xs text-blue-600 mt-1">{template.specialAbility}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Educational Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              📚 Cybersecurity Intel
            </h3>
            
            {selectedDefenseType ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h4 className="font-medium text-blue-600">
                  {DEFENSE_TEMPLATES[selectedDefenseType].name}
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  {DEFENSE_TEMPLATES[selectedDefenseType].educationalInfo.map((info, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <div className="text-sm text-gray-600">
                Select a defense system to learn about cybersecurity technologies and how they protect networks from cyber threats.
              </div>
            )}
          </div>

          {/* Current Threats */}
          {attacks.length > 0 && (
            <div className="bg-red-50 rounded-xl shadow-lg p-6 border border-red-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-red-700">
                <AlertTriangle className="w-5 h-5 mr-2" />
                🚨 Active Threats
              </h3>
              
              <div className="space-y-2">
                {attacks.slice(0, 3).map((attack) => (
                  <div key={attack.id} className="bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-red-700">{attack.name}</span>
                      <span className="text-sm text-gray-600">
                        {Math.round((attack.health / attack.maxHealth) * 100)}% HP
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(attack.health / attack.maxHealth) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Vulnerable to: {attack.vulnerableTo.join(', ')}
                    </div>
                  </div>
                ))}
                {attacks.length > 3 && (
                  <div className="text-center text-sm text-gray-600">
                    +{attacks.length - 3} more threats detected
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 🎓 EDUCATIONAL NOTES FOR STUDENT DEVELOPERS:
 * 
 * This Network Defense Tower game teaches comprehensive cybersecurity concepts:
 * 
 * 1. **Network Architecture**: Understanding how data flows through networks
 * 2. **Defense in Depth**: Multiple layers of security working together
 * 3. **Threat Intelligence**: Knowing which defenses work against which attacks
 * 4. **Resource Management**: Balancing security costs with protection needs
 * 5. **Real-time Monitoring**: Continuous vigilance and response
 * 
 * Key Technical Concepts:
 * - Firewall rules and traffic filtering
 * - Intrusion Detection Systems (IDS) for monitoring
 * - Antivirus protection against malware
 * - Honeypots for threat intelligence
 * - Encryption for data protection
 * 
 * Game Design Patterns:
 * - Canvas-based rendering for smooth animations
 * - Game loop architecture for real-time updates
 * - State management for complex game interactions
 * - Educational feedback integrated into gameplay
 * 
 * Try extending this game:
 * - Add more sophisticated attack patterns
 * - Implement defense upgrade systems
 * - Create team-based multiplayer modes
 * - Add historical attack scenarios
 * - Integrate with real threat intelligence feeds
 * 
 * Remember: Good cybersecurity is like good tower defense - 
 * it's all about strategic planning and layered defenses! 🏰🛡️
 */
