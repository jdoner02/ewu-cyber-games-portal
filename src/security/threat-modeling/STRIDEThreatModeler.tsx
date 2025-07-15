/**
 * 🎯 STRIDE THREAT MODELING TOOL - Educational Cybersecurity Analysis
 * 
 * Hey curious coders! 👋 Welcome to one of the most important tools in cybersecurity!
 * 
 * WHAT IS STRIDE?
 * STRIDE is like being a security detective 🕵️ - you look at a system and think:
 * "If I were a bad guy, how would I try to break this?"
 * 
 * S - SPOOFING: Pretending to be someone you're not (like fake ID cards)
 * T - TAMPERING: Changing data you shouldn't (like editing your grade in the school system)
 * R - REPUDIATION: Denying you did something (like "I didn't send that mean message!")
 * I - INFORMATION DISCLOSURE: Seeing data you shouldn't (like reading someone's diary)
 * D - DENIAL OF SERVICE: Breaking things so others can't use them (like unplugging the WiFi)
 * E - ELEVATION OF PRIVILEGE: Getting permissions you shouldn't have (like getting admin access)
 * 
 * WHY IS THIS SO IMPORTANT?
 * - Real cybersecurity teams use STRIDE every day to find security problems
 * - It helps us think like both the good guys AND the bad guys
 * - By finding problems first, we can fix them before hackers exploit them
 * - This same process protects everything from your phone to NASA's computers!
 * 
 * FOR STUDENT DEVELOPERS:
 * This component shows how to build interactive analysis tools that help security
 * professionals evaluate threats. Pay attention to how we structure the analysis
 * and present complex security concepts in an understandable way!
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Zap,
  UserX,
  Edit3,
  XCircle,
  FileX,
  Server,
  Crown,
  Target,
  CheckCircle,
  Info,
  Lightbulb,
  Play,
  RotateCcw,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * 🎯 THREAT ANALYSIS INTERFACES
 * 
 * These TypeScript interfaces define how we structure our threat analysis.
 * Think of them as the "blueprints" for organizing security information!
 */

interface STRIDEThreat {
  id: string
  category: 'spoofing' | 'tampering' | 'repudiation' | 'information_disclosure' | 'denial_of_service' | 'elevation_of_privilege'
  title: string
  description: string
  likelihood: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  riskScore: number
  mitigations: string[]
  examples: string[]
  educationalNotes: string[]
}

interface SystemComponent {
  id: string
  name: string
  type: 'user' | 'process' | 'data_store' | 'external_entity' | 'trust_boundary'
  description: string
  threats: STRIDEThreat[]
  securityControls: string[]
}

interface ThreatModel {
  id: string
  systemName: string
  description: string
  components: SystemComponent[]
  overallRiskScore: number
  completedAnalysis: boolean
  createdAt: Date
  lastModified: Date
}

/**
 * 🎓 EDUCATIONAL THREAT TEMPLATES
 * 
 * These are real threat scenarios adapted for learning purposes.
 * Each one teaches different aspects of cybersecurity!
 */
const EDUCATIONAL_THREAT_TEMPLATES: Record<STRIDEThreat['category'], Omit<STRIDEThreat, 'id'>> = {
  spoofing: {
    category: 'spoofing',
    title: 'Identity Spoofing Attack',
    description: 'An attacker pretends to be a legitimate user or system to gain unauthorized access',
    likelihood: 'medium',
    impact: 'high',
    riskScore: 6,
    mitigations: [
      'Strong authentication (multi-factor authentication)',
      'Digital certificates and signatures',
      'Regular identity verification processes',
      'Monitoring for unusual login patterns'
    ],
    examples: [
      'Fake login pages that steal passwords',
      'Email spoofing to impersonate trusted senders',
      'IP address spoofing in network attacks',
      'Social media account impersonation'
    ],
    educationalNotes: [
      'Spoofing is like wearing a disguise to trick security systems',
      'Multi-factor authentication makes spoofing much harder',
      'Always verify identity through multiple channels when possible',
      'Look for subtle signs that might indicate spoofing attempts'
    ]
  },
  tampering: {
    category: 'tampering',
    title: 'Data Tampering Attack',
    description: 'An attacker modifies data, code, or system configurations without authorization',
    likelihood: 'medium',
    impact: 'high',
    riskScore: 6,
    mitigations: [
      'Digital signatures for data integrity',
      'Access controls and permission systems',
      'Checksums and hash verification',
      'Audit logging of all changes'
    ],
    examples: [
      'Modifying financial records or grades',
      'Injecting malicious code into software',
      'Changing configuration files',
      'Altering website content'
    ],
    educationalNotes: [
      'Tampering is like graffiti - changing something that isn\'t yours',
      'Hash functions help detect if data has been changed',
      'Digital signatures prove data came from who it says it did',
      'Always backup important data before making changes'
    ]
  },
  repudiation: {
    category: 'repudiation',
    title: 'Repudiation Attack',
    description: 'Someone denies performing an action, and the system cannot prove they did it',
    likelihood: 'low',
    impact: 'medium',
    riskScore: 3,
    mitigations: [
      'Comprehensive audit logging',
      'Digital signatures and timestamps',
      'Video surveillance for physical access',
      'Non-repudiation protocols'
    ],
    examples: [
      'Denying sending a message or email',
      'Claiming someone else made a purchase',
      'Denying access to sensitive information',
      'Disputing digital contract signatures'
    ],
    educationalNotes: [
      'Repudiation is like saying "I didn\'t do it!" when you actually did',
      'Good logging systems create an unbreakable chain of evidence',
      'Digital signatures make it very hard to deny actions',
      'Think of it like a security camera for digital actions'
    ]
  },
  information_disclosure: {
    category: 'information_disclosure',
    title: 'Information Disclosure Attack',
    description: 'Sensitive information is revealed to someone who should not have access to it',
    likelihood: 'high',
    impact: 'high',
    riskScore: 8,
    mitigations: [
      'Strong encryption for sensitive data',
      'Access controls and least privilege',
      'Data classification and handling policies',
      'Regular security training for users'
    ],
    examples: [
      'Database breaches exposing personal information',
      'Accidentally sharing confidential documents',
      'Eavesdropping on private conversations',
      'Looking at someone else\'s screen or files'
    ],
    educationalNotes: [
      'This is like accidentally leaving your diary open for everyone to read',
      'Encryption scrambles data so only authorized people can read it',
      'Always think "who should be able to see this?" before sharing',
      'Some of the biggest cybersecurity incidents involve information disclosure'
    ]
  },
  denial_of_service: {
    category: 'denial_of_service',
    title: 'Denial of Service Attack',
    description: 'Attackers prevent legitimate users from accessing systems or services',
    likelihood: 'medium',
    impact: 'medium',
    riskScore: 5,
    mitigations: [
      'Rate limiting and traffic filtering',
      'Redundant systems and failover capabilities',
      'DDoS protection services',
      'Resource monitoring and alerting'
    ],
    examples: [
      'Flooding a website with fake traffic',
      'Filling up disk space to crash systems',
      'Overloading networks with requests',
      'Physical attacks on infrastructure'
    ],
    educationalNotes: [
      'Like blocking the entrance to a store so customers can\'t get in',
      'Even if data isn\'t stolen, availability is crucial for many systems',
      'Distributed attacks use many computers to amplify the effect',
      'Good system design includes planning for high traffic loads'
    ]
  },
  elevation_of_privilege: {
    category: 'elevation_of_privilege',
    title: 'Privilege Escalation Attack',
    description: 'An attacker gains higher permissions than they should have',
    likelihood: 'medium',
    impact: 'high',
    riskScore: 7,
    mitigations: [
      'Principle of least privilege',
      'Regular permission audits',
      'Secure coding practices',
      'System hardening and updates'
    ],
    examples: [
      'Normal user gaining admin access',
      'Exploiting bugs to get system privileges',
      'Social engineering to get elevated permissions',
      'Using stolen credentials for higher-level access'
    ],
    educationalNotes: [
      'Like a student somehow getting teacher passwords and changing grades',
      'Most systems have different levels of access for good reasons',
      'Regular users should only have permissions they actually need',
      'Admin privileges should be carefully controlled and monitored'
    ]
  }
}

/**
 * 🎨 THREAT CATEGORY STYLING
 * 
 * Each STRIDE category gets unique colors and icons for easy recognition!
 */
const THREAT_STYLING = {
  spoofing: {
    color: 'purple',
    icon: UserX,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800'
  },
  tampering: {
    color: 'red',
    icon: Edit3,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800'
  },
  repudiation: {
    color: 'orange',
    icon: XCircle,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800'
  },
  information_disclosure: {
    color: 'yellow',
    icon: Eye,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800'
  },
  denial_of_service: {
    color: 'blue',
    icon: Server,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  elevation_of_privilege: {
    color: 'green',
    icon: Crown,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800'
  }
}

/**
 * 🎮 MAIN STRIDE THREAT MODELING COMPONENT
 * 
 * This creates an interactive threat modeling experience for students!
 */
export default function STRIDEThreatModeler() {
  /**
   * 🧠 COMPONENT STATE MANAGEMENT
   * 
   * React hooks help us track the current state of our threat analysis.
   */
  const [selectedSystem, setSelectedSystem] = useState<string>('')
  const [currentAnalysis, setCurrentAnalysis] = useState<ThreatModel | null>(null)
  const [selectedThreatCategory, setSelectedThreatCategory] = useState<STRIDEThreat['category'] | null>(null)
  const [discoveredThreats, setDiscoveredThreats] = useState<STRIDEThreat[]>([])
  const [showEducationalMode, setShowEducationalMode] = useState(true)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  /**
   * 📚 EDUCATIONAL SYSTEM TEMPLATES
   * 
   * Pre-built systems that students can analyze to learn threat modeling!
   */
  const EDUCATIONAL_SYSTEMS = {
    'online_game': {
      name: 'Online Gaming Platform',
      description: 'A multiplayer online game with user accounts, chat, and virtual currency',
      components: [
        'User Authentication System',
        'Game Server',
        'Chat System', 
        'Virtual Currency Store',
        'Player Database',
        'Anti-Cheat System'
      ]
    },
    'school_portal': {
      name: 'School Learning Portal',
      description: 'Educational platform where students submit assignments and view grades',
      components: [
        'Student Login System',
        'Assignment Submission',
        'Grade Database',
        'Teacher Dashboard',
        'Parent Portal',
        'File Storage System'
      ]
    },
    'social_media': {
      name: 'Social Media App',
      description: 'Platform where users share photos, messages, and connect with friends',
      components: [
        'User Profiles',
        'Photo Sharing',
        'Private Messaging',
        'Friend Connections',
        'Content Moderation',
        'Advertising System'
      ]
    }
  }

  /**
   * 🎯 THREAT ANALYSIS FUNCTIONS
   * 
   * These functions help students systematically analyze threats.
   */
  const startThreatAnalysis = (systemType: string) => {
    const system = EDUCATIONAL_SYSTEMS[systemType]
    if (!system) return

    const newAnalysis: ThreatModel = {
      id: `analysis-${Date.now()}`,
      systemName: system.name,
      description: system.description,
      components: [],
      overallRiskScore: 0,
      completedAnalysis: false,
      createdAt: new Date(),
      lastModified: new Date()
    }

    setCurrentAnalysis(newAnalysis)
    setSelectedSystem(systemType)
    setDiscoveredThreats([])
    setAnalysisProgress(0)
    toast.success(`Starting threat analysis for ${system.name}! 🎯`)
  }

  /**
   * 🔍 THREAT DISCOVERY FUNCTION
   * 
   * When students click on a threat category, we help them discover threats.
   */
  const discoverThreat = (category: STRIDEThreat['category']) => {
    const template = EDUCATIONAL_THREAT_TEMPLATES[category]
    
    const newThreat: STRIDEThreat = {
      id: `threat-${Date.now()}`,
      ...template
    }

    setDiscoveredThreats(prev => [...prev, newThreat])
    setAnalysisProgress(prev => Math.min(100, prev + (100 / 6))) // 6 STRIDE categories
    
    toast.success(`🎉 You discovered a ${category.replace('_', ' ')} threat!`)
    
    // Show educational information
    setSelectedThreatCategory(category)
  }

  /**
   * 📊 RISK CALCULATION FUNCTION
   * 
   * Calculate overall risk score based on discovered threats.
   */
  const calculateOverallRisk = () => {
    if (discoveredThreats.length === 0) return 0
    
    const totalRisk = discoveredThreats.reduce((sum: number, threat: STRIDEThreat) => sum + threat.riskScore, 0)
    return Math.round(totalRisk / discoveredThreats.length)
  }

  /**
   * 🎓 GENERATE LEARNING REPORT
   * 
   * Create a comprehensive report of what the student learned.
   */
  const generateLearningReport = () => {
    const overallRisk = calculateOverallRisk()
    const threatsFound = discoveredThreats.length
    const categoriesCovered = new Set(discoveredThreats.map((t: STRIDEThreat) => t.category)).size
    
    const report = {
      systemAnalyzed: currentAnalysis?.systemName,
      threatsDiscovered: threatsFound,
      strideCategories: categoriesCovered,
      overallRiskScore: overallRisk,
      completionPercentage: analysisProgress,
      keyLearnings: discoveredThreats.flatMap((t: STRIDEThreat) => t.educationalNotes),
      recommendedMitigations: discoveredThreats.flatMap((t: STRIDEThreat) => t.mitigations)
    }
    
    toast.success(`📋 Analysis complete! Found ${threatsFound} threats across ${categoriesCovered} STRIDE categories.`)
    return report
  }

  /**
   * 🔄 RESET ANALYSIS
   * 
   * Start over with a clean slate.
   */
  const resetAnalysis = () => {
    setCurrentAnalysis(null)
    setSelectedSystem('')
    setDiscoveredThreats([])
    setSelectedThreatCategory(null)
    setAnalysisProgress(0)
    toast.info('Analysis reset. Ready to analyze a new system! 🔄')
  }

  /**
   * 🎨 RENDER THE STRIDE THREAT MODELING INTERFACE
   * 
   * This creates the visual interface students interact with!
   */
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      
      {/* 🎯 Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🎯 STRIDE Threat Modeling Lab
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Think like a security detective and discover how systems can be attacked!
        </p>
        
        {/* Progress Bar */}
        {currentAnalysis && (
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Analysis Progress</span>
              <span>{Math.round(analysisProgress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {!currentAnalysis ? (
        /* 🚀 System Selection Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Choose a System to Analyze 🔍
            </h2>
            <p className="text-gray-600">
              Pick a system you'd like to analyze for security threats. 
              We'll walk you through the STRIDE methodology step by step!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(EDUCATIONAL_SYSTEMS).map(([key, system]) => (
              <motion.div
                key={key}
                onClick={() => startThreatAnalysis(key)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">
                    {key === 'online_game' ? '🎮' : key === 'school_portal' ? '🎓' : '📱'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{system.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{system.description}</p>
                  
                  <div className="text-xs text-gray-500">
                    <strong>Components to analyze:</strong>
                    <div className="mt-2 space-y-1">
                      {system.components.slice(0, 3).map((component, index) => (
                        <div key={index} className="bg-gray-100 rounded px-2 py-1">
                          {component}
                        </div>
                      ))}
                      {system.components.length > 3 && (
                        <div className="text-blue-600">
                          +{system.components.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* 🔍 Active Threat Analysis Screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* STRIDE Categories Panel */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  STRIDE Threat Categories
                </h2>
                <button
                  onClick={resetAnalysis}
                  className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(THREAT_STYLING).map(([category, styling]) => {
                  const Icon = styling.icon
                  const isDiscovered = discoveredThreats.some(t => t.category === category)
                  
                  return (
                    <motion.div
                      key={category}
                      onClick={() => !isDiscovered && discoverThreat(category as STRIDEThreat['category'])}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${isDiscovered 
                          ? `${styling.bgColor} ${styling.borderColor} opacity-75` 
                          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }
                      `}
                      whileHover={!isDiscovered ? { scale: 1.02 } : {}}
                      whileTap={!isDiscovered ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className={`w-6 h-6 ${isDiscovered ? styling.textColor : 'text-gray-600'}`} />
                        <div>
                          <h3 className={`font-bold ${isDiscovered ? styling.textColor : 'text-gray-800'}`}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                          </h3>
                          {isDiscovered && <CheckCircle className="w-5 h-5 text-green-500 inline ml-2" />}
                        </div>
                      </div>
                      
                      <p className={`text-sm ${isDiscovered ? styling.textColor : 'text-gray-600'}`}>
                        {EDUCATIONAL_THREAT_TEMPLATES[category as STRIDEThreat['category']].description}
                      </p>
                      
                      {!isDiscovered && (
                        <div className="mt-3 text-xs text-blue-600 font-medium">
                          Click to discover this threat! 🔍
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Analysis Results Panel */}
          <div className="space-y-6">
            {/* System Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                System Under Analysis
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>System:</strong> {currentAnalysis.systemName}</div>
                <div><strong>Description:</strong> {currentAnalysis.description}</div>
                <div><strong>Threats Found:</strong> {discoveredThreats.length}/6</div>
                <div><strong>Risk Score:</strong> {calculateOverallRisk()}/10</div>
              </div>
            </div>

            {/* Discovered Threats */}
            {discoveredThreats.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Discovered Threats
                </h3>
                
                <div className="space-y-3">
                  {discoveredThreats.map((threat) => {
                    const styling = THREAT_STYLING[threat.category]
                    return (
                      <div 
                        key={threat.id}
                        className={`p-3 rounded-lg ${styling.bgColor} ${styling.borderColor} border`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${styling.textColor}`}>
                            {threat.category.charAt(0).toUpperCase() + threat.category.slice(1).replace('_', ' ')}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${styling.bgColor} ${styling.textColor}`}>
                            Risk: {threat.riskScore}/10
                          </span>
                        </div>
                        <p className={`text-sm ${styling.textColor}`}>
                          {threat.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Educational Information */}
            {selectedThreatCategory && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 rounded-xl shadow-lg p-6 border border-blue-200"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Learning Notes
                </h3>
                
                <div className="space-y-3 text-sm text-blue-700">
                  {EDUCATIONAL_THREAT_TEMPLATES[selectedThreatCategory].educationalNotes.map((note, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Generate Report Button */}
            {discoveredThreats.length === 6 && (
              <motion.button
                onClick={generateLearningReport}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl font-bold shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📊 Generate Security Report
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 🎓 EDUCATIONAL NOTES FOR STUDENT DEVELOPERS:
 * 
 * This STRIDE Threat Modeling tool demonstrates several important concepts:
 * 
 * 1. **Systematic Security Analysis**: STRIDE provides a structured way to think about threats
 * 2. **Interactive Learning**: Complex concepts become accessible through hands-on exploration
 * 3. **Real-World Application**: This same methodology is used by professional security teams
 * 4. **Risk Assessment**: Learning to quantify and prioritize security risks
 * 5. **Mitigation Planning**: Understanding how to address identified threats
 * 
 * Key Programming Concepts Demonstrated:
 * - TypeScript interfaces for structured data modeling
 * - React state management for interactive applications
 * - Component composition for complex user interfaces
 * - Animation and user feedback for engaging experiences
 * - Educational design patterns for teaching complex concepts
 * 
 * Try extending this tool:
 * - Add more system templates for analysis
 * - Implement automatic mitigation suggestions
 * - Create collaborative threat modeling sessions
 * - Add integration with real vulnerability databases
 * - Build assessment and scoring systems for learning progress
 * 
 * Remember: The goal isn't just to build cool tools, but to help others learn
 * how to think about security in a systematic, professional way! 🎯
 */
