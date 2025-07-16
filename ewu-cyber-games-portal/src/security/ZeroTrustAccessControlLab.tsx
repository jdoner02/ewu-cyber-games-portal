/**
 * 🔐 ZERO TRUST ACCESS CONTROL LAB - Educational Security System
 * 
 * Hey future cybersecurity pros! 🚀 Welcome to the coolest security concept in the modern world!
 * 
 * WHAT IS ZERO TRUST? 🤔
 * Zero Trust is like having the world's most careful security guard who checks EVERYONE'S ID, 
 * even if they've been in the building for years. Traditional security was like a castle with 
 * high walls - once you got inside, you could go anywhere. Zero Trust is like having checkpoints 
 * everywhere!
 * 
 * THE ZERO TRUST MOTTO: "Never trust, always verify" 🛡️
 * 
 * Think of it like this:
 * 🏰 Old Security: "Trust but verify" (castle walls)
 * 🔐 Zero Trust: "Never trust, always verify" (airport security everywhere)
 * 
 * WHY IS THIS REVOLUTIONARY? 🌟
 * - Perfect for our mobile, cloud-connected world
 * - Works when employees work from home, coffee shops, anywhere
 * - Protects against insider threats (bad guys already inside)
 * - Assumes attackers are already in your network (because they probably are!)
 * 
 * CORE PRINCIPLES EVERY CYBERSECURITY PRO KNOWS:
 * 1. 🔍 Verify explicitly - Check every user, device, and application
 * 2. 🔒 Least privilege access - Give minimum permissions needed
 * 3. 🚨 Assume breach - Act like attackers are already inside
 * 
 * FOR STUDENT DEVELOPERS: 👩‍💻👨‍💻
 * This component shows you how to build modern access control systems that companies
 * like Google, Microsoft, and Netflix use to protect their systems. Pay attention to
 * how we verify identity, assess risk, and make access decisions in real-time!
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Unlock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserCheck,
  Settings,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Wifi,
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  Database,
  Server,
  Globe,
  Fingerprint,
  CreditCard,
  Camera
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * 🎯 ZERO TRUST DATA STRUCTURES
 * 
 * These TypeScript interfaces define how we organize Zero Trust security information.
 * In real companies, these might be stored in databases and used by security systems!
 */

// 👤 User Information (Who is trying to access something?)
interface ZeroTrustUser {
  id: string                    // Unique identifier for the user
  username: string              // What they call themselves
  email: string                 // Their email address
  role: 'student' | 'teacher' | 'admin' | 'parent'  // What they're allowed to do
  trustScore: number            // How much we trust them (0-100)
  lastVerified: Date            // When we last checked their identity
  activeDevices: string[]       // Devices they've used recently
  riskFactors: string[]         // Things that make them more risky
  permissions: string[]         // What they're allowed to access
  authMethods: AuthMethod[]     // How they can prove who they are
}

// 🔑 Authentication Methods (How do you prove you're really you?)
interface AuthMethod {
  type: 'password' | 'mfa' | 'biometric' | 'hardware_key' | 'sso'
  enabled: boolean              // Is this method turned on?
  lastUsed: Date               // When did they last use this method?
  trustLevel: number           // How much we trust this method (0-100)
  description: string          // Human-readable explanation
}

// 📋 Access Request (Someone wants to do something - should we let them?)
interface AccessRequest {
  id: string                   // Unique ID for this request
  userId: string               // Who is asking?
  resource: string             // What do they want to access?
  action: 'read' | 'write' | 'delete' | 'execute'  // What do they want to do?
  context: AccessContext       // Where/when/how are they asking?
  timestamp: Date              // When did they ask?
  status: 'pending' | 'approved' | 'denied' | 'expired'  // What's our decision?
  riskAssessment: RiskAssessment  // How risky is this request?
}

// 🌍 Access Context (The situation around the request)
interface AccessContext {
  deviceId: string             // What device are they using?
  deviceType: 'laptop' | 'phone' | 'tablet' | 'unknown'
  location: {                  // Where are they?
    ip: string                 // Their internet address
    country: string            // What country?
    city: string               // What city?
    isVPN: boolean            // Are they using a VPN?
  }
  networkInfo: {               // What network are they on?
    type: 'home' | 'school' | 'public' | 'cellular'
    ssid?: string              // WiFi network name
    isSecure: boolean          // Is the network secure?
  }
  timeOfDay: string            // What time is it?
  dayOfWeek: string            // What day of the week?
}

// ⚠️ Risk Assessment (How dangerous is this request?)
interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number            // Numerical risk (0-100)
  factors: RiskFactor[]        // What makes this risky?
  mitigations: string[]        // How can we reduce the risk?
}

// 🚩 Risk Factor (One thing that makes a request risky)
interface RiskFactor {
  type: 'device' | 'location' | 'time' | 'behavior' | 'network'
  description: string          // What's the problem?
  severity: 'info' | 'warning' | 'danger'  // How bad is it?
  impact: number              // How much does this increase risk?
}

// 📜 Security Policy (Rules about what's allowed)
interface SecurityPolicy {
  id: string
  name: string
  description: string
  conditions: string[]         // When does this policy apply?
  actions: string[]            // What should we do?
  enabled: boolean             // Is this policy active?
  explanation: string          // Simple explanation for students
}

/**
 * 🔐 EDUCATIONAL AUTHENTICATION METHODS
 * 
 * These are real authentication methods used by companies worldwide!
 * We've added educational descriptions so you understand each one.
 */
const AUTH_METHODS: Record<AuthMethod['type'], Omit<AuthMethod, 'enabled' | 'lastUsed'>> = {
  password: {
    type: 'password',
    trustLevel: 30,  // Passwords alone are weak!
    description: '🔤 Traditional username and password - weakest but most common method'
  },
  mfa: {
    type: 'mfa',
    trustLevel: 70,  // Much better!
    description: '📱 Multi-Factor Authentication - requires something you know AND something you have'
  },
  biometric: {
    type: 'biometric',
    trustLevel: 85,  // Very secure!
    description: '👆 Fingerprint, face, or voice recognition - something you ARE'
  },
  hardware_key: {
    type: 'hardware_key',
    trustLevel: 95,  // The gold standard!
    description: '🔑 Physical security key like YubiKey - most secure option available'
  },
  sso: {
    type: 'sso',
    trustLevel: 60,  // Pretty good!
    description: '🔗 Single Sign-On through trusted provider like Google or Microsoft'
  }
}

/**
 * 🛡️ EXAMPLE SECURITY POLICIES
 * 
 * These are the kinds of rules that real organizations use to protect themselves!
 */
const SECURITY_POLICIES: SecurityPolicy[] = [
  {
    id: 'high_value_protection',
    name: 'Protect Sensitive Information',
    description: 'Extra security when accessing grades, personal info, or financial data',
    conditions: [
      'Resource contains personal information or grades',
      'User is student or parent role',
      'Risk score is above 40'
    ],
    actions: [
      'Require multi-factor authentication',
      'Log all access attempts for auditing',
      'Limit session to 30 minutes maximum',
      'Block access from unrecognized devices'
    ],
    enabled: true,
    explanation: 'When you access your grades or personal info, we need extra proof it\'s really you!'
  },
  {
    id: 'unusual_location',
    name: 'New Location Detection',
    description: 'Enhanced verification when logging in from somewhere new',
    conditions: [
      'Login from new city or country',
      'VPN or proxy service detected',
      'Connection from public WiFi network'
    ],
    actions: [
      'Require additional identity verification',
      'Send security notification to registered email',
      'Temporarily reduce access permissions',
      'Monitor session activity more closely'
    ],
    enabled: true,
    explanation: 'If you log in from somewhere new, we\'ll ask for extra proof to keep your account safe!'
  },
  {
    id: 'after_hours_access',
    name: 'After-Hours Security',
    description: 'Special rules for access outside normal school hours',
    conditions: [
      'Access time is between 10 PM and 6 AM',
      'Weekend access to school resources',
      'Holiday period access attempts'
    ],
    actions: [
      'Temporarily reduce user trust score',
      'Require justification for after-hours access',
      'Limit to read-only permissions',
      'Increase security monitoring frequency'
    ],
    enabled: true,
    explanation: 'Late-night access is watched more carefully, like having a security guard notice you in the building after hours!'
  }
]

/**
 * 🎮 MAIN ZERO TRUST COMPONENT
 * 
 * This is the main interface where students can explore Zero Trust concepts!
 */
export default function ZeroTrustAccessControlLab() {
  /**
   * 🧠 COMPONENT STATE
   * 
   * React hooks help us track what's happening in our Zero Trust system.
   * Think of these as the "memory" of our security system!
   */
  const [currentUser, setCurrentUser] = useState<ZeroTrustUser | null>(null)
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [policies, setPolicies] = useState<SecurityPolicy[]>(SECURITY_POLICIES)
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low')
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'policies' | 'simulator' | 'learning'>('dashboard')

  /**
   * 🎯 RISK CALCULATION ENGINE
   * 
   * This is the "brain" of our Zero Trust system! It looks at all the context
   * around an access request and calculates how risky it is.
   * 
   * Real companies use much more complex versions of this same logic!
   */
  const calculateRisk = useCallback((context: AccessContext, user: ZeroTrustUser): RiskAssessment => {
    const riskFactors: RiskFactor[] = []
    let baseScore = 0

    // 📱 Device Risk Analysis
    if (!user.activeDevices.includes(context.deviceId)) {
      riskFactors.push({
        type: 'device',
        description: 'Unknown or new device detected',
        severity: 'warning',
        impact: 25
      })
      baseScore += 25
    }

    // 🌍 Location Risk Analysis  
    if (context.location.isVPN) {
      riskFactors.push({
        type: 'location',
        description: 'VPN or proxy service detected',
        severity: 'warning',
        impact: 15
      })
      baseScore += 15
    }

    if (context.location.country !== 'United States') {
      riskFactors.push({
        type: 'location',
        description: 'Access from foreign country',
        severity: 'danger',
        impact: 30
      })
      baseScore += 30
    }

    // 🌐 Network Risk Analysis
    if (context.networkInfo.type === 'public') {
      riskFactors.push({
        type: 'network',
        description: 'Public WiFi network detected',
        severity: 'warning',
        impact: 20
      })
      baseScore += 20
    }

    // ⏰ Time-Based Risk Analysis
    const hour = parseInt(context.timeOfDay.split(':')[0])
    if (hour < 6 || hour > 22) {
      riskFactors.push({
        type: 'time',
        description: 'Access outside normal hours',
        severity: 'info',
        impact: 10
      })
      baseScore += 10
    }

    // 👤 User Behavior Risk Analysis
    if (user.trustScore < 50) {
      riskFactors.push({
        type: 'behavior',
        description: 'User has low trust score',
        severity: 'danger',
        impact: 20
      })
      baseScore += 20
    }

    // 🎮 Apply simulated risk multiplier (for educational purposes)
    const multiplier = riskLevel === 'high' ? 1.5 : riskLevel === 'medium' ? 1.2 : 1.0
    const finalScore = Math.min(100, Math.round(baseScore * multiplier))

    // 📊 Determine overall risk level
    const overallRisk: RiskAssessment['overallRisk'] = 
      finalScore < 25 ? 'low' : 
      finalScore < 50 ? 'medium' : 
      finalScore < 75 ? 'high' : 'critical'

    return {
      overallRisk,
      riskScore: finalScore,
      factors: riskFactors,
      mitigations: generateMitigations(riskFactors)
    }
  }, [riskLevel])

  /**
   * 🛡️ MITIGATION GENERATOR
   * 
   * Based on the risks we find, suggest ways to reduce them!
   */
  const generateMitigations = (factors: RiskFactor[]): string[] => {
    const suggestions: string[] = []

    if (factors.some(f => f.type === 'device')) {
      suggestions.push('🔐 Require device verification or registration')
      suggestions.push('📧 Send device confirmation notification to user email')
    }

    if (factors.some(f => f.type === 'location')) {
      suggestions.push('🔑 Require additional authentication factor')
      suggestions.push('⏱️ Temporarily limit access permissions')
    }

    if (factors.some(f => f.type === 'network')) {
      suggestions.push('🔒 Recommend switching to secure network')
      suggestions.push('👁️ Enable enhanced monitoring for this session')
    }

    if (factors.some(f => f.type === 'time')) {
      suggestions.push('📝 Request justification for after-hours access')
      suggestions.push('👀 Apply read-only access restrictions')
    }

    if (factors.some(f => f.type === 'behavior')) {
      suggestions.push('👩‍💼 Require manager or teacher approval')
      suggestions.push('🔍 Increase verification requirements')
    }

    return suggestions
  }

  /**
   * 🎲 ACCESS REQUEST SIMULATOR
   * 
   * Generate realistic access scenarios for educational purposes!
   */
  const simulateAccessRequest = () => {
    if (!currentUser) return

    // 🎯 Example scenarios that might happen in real life
    const scenarios = [
      {
        resource: 'Student Grade Database',
        action: 'read' as const,
        context: {
          deviceId: 'laptop-home-001',
          deviceType: 'laptop' as const,
          location: {
            ip: '192.168.1.100',
            country: 'United States', 
            city: 'Cheney, WA',
            isVPN: false
          },
          networkInfo: {
            type: 'home' as const,
            ssid: 'FamilyWiFi',
            isSecure: true
          },
          timeOfDay: '15:30',
          dayOfWeek: 'Tuesday'
        }
      },
      {
        resource: 'Financial Aid Records',
        action: 'write' as const,
        context: {
          deviceId: 'phone-unknown-999',
          deviceType: 'phone' as const,
          location: {
            ip: '203.0.113.0',
            country: 'Unknown',
            city: 'Unknown', 
            isVPN: true
          },
          networkInfo: {
            type: 'public' as const,
            ssid: 'CoffeeShop_Free_WiFi',
            isSecure: false
          },
          timeOfDay: '02:15',
          dayOfWeek: 'Sunday'
        }
      },
      {
        resource: 'Assignment Submission Portal',
        action: 'write' as const,
        context: {
          deviceId: 'tablet-school-042',
          deviceType: 'tablet' as const,
          location: {
            ip: '10.0.0.50',
            country: 'United States',
            city: 'Cheney, WA',
            isVPN: false
          },
          networkInfo: {
            type: 'school' as const,
            ssid: 'EWU-Student-Network',
            isSecure: true
          },
          timeOfDay: '11:45',
          dayOfWeek: 'Wednesday'
        }
      }
    ]

    // 🎰 Pick a random scenario
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    
    // 🧮 Calculate the risk for this scenario
    const riskAssessment = calculateRisk(scenario.context, currentUser)

    // 🚦 Make access decision based on risk
    const newRequest: AccessRequest = {
      id: `req-${Date.now()}`,
      userId: currentUser.id,
      resource: scenario.resource,
      action: scenario.action,
      context: scenario.context,
      timestamp: new Date(),
      status: riskAssessment.overallRisk === 'critical' ? 'denied' : 
              riskAssessment.overallRisk === 'high' ? 'pending' : 'approved',
      riskAssessment
    }

    // 📝 Add to our list of requests (keep last 10)
    setAccessRequests(prev => [newRequest, ...prev.slice(0, 9)])
    
    // 📢 Tell the user what happened
    toast.success(`🔍 Access request simulated! Risk level: ${riskAssessment.overallRisk}`)
  }

  /**
   * 🏗️ CREATE DEMO USER
   * 
   * Set up a realistic user for demonstration purposes
   */
  const createDemoUser = () => {
    const demoUser: ZeroTrustUser = {
      id: 'student-demo-001',
      username: 'alex.student',
      email: 'alex.student@ewu.edu',
      role: 'student',
      trustScore: 75,
      lastVerified: new Date(),
      activeDevices: ['laptop-home-001', 'phone-personal-001'],
      riskFactors: ['Recently registered new device'],
      permissions: ['read_grades', 'submit_assignments', 'access_library_resources'],
      authMethods: [
        { ...AUTH_METHODS.password, enabled: true, lastUsed: new Date() },
        { ...AUTH_METHODS.mfa, enabled: true, lastUsed: new Date() },
        { ...AUTH_METHODS.biometric, enabled: false, lastUsed: new Date(0) },
        { ...AUTH_METHODS.hardware_key, enabled: false, lastUsed: new Date(0) },
        { ...AUTH_METHODS.sso, enabled: true, lastUsed: new Date() }
      ]
    }

    setCurrentUser(demoUser)
    toast.success('🎭 Demo user created! Now you can explore Zero Trust concepts.')
  }

  /**
   * 🔄 CONTINUOUS MONITORING
   * 
   * When monitoring is enabled, automatically generate access requests
   */
  useEffect(() => {
    if (isMonitoring && currentUser) {
      const interval = setInterval(() => {
        simulateAccessRequest()
      }, 5000) // New request every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isMonitoring, currentUser, simulateAccessRequest])

  /**
   * 🎨 RENDER THE ZERO TRUST INTERFACE
   * 
   * This creates the visual interface that students interact with!
   */
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      
      {/* 🎯 Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🔐 Zero Trust Access Control Lab
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Experience the "Never Trust, Always Verify" security revolution!
        </p>

        {/* 📊 Tab Navigation */}
        <div className="flex justify-center space-x-4 flex-wrap">
          {[
            { id: 'dashboard', label: '📊 Control Center', icon: BarChart3 },
            { id: 'policies', label: '🛡️ Security Rules', icon: Shield },
            { id: 'simulator', label: '🎮 Risk Simulator', icon: Activity },
            { id: 'learning', label: '🎓 Learn More', icon: Users }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5 inline mr-2" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {!currentUser ? (
        /* 🚀 Getting Started Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Explore Zero Trust Security?
            </h2>
            <p className="text-gray-600 mb-6">
              Create a demo user account to experience how Zero Trust access control 
              evaluates every request and verifies every user, device, and action in real-time!
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">🎓 What You'll Learn:</h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• How modern companies protect their systems</li>
                <li>• Why "never trust, always verify" is so powerful</li>
                <li>• How risk assessment works in cybersecurity</li>
                <li>• Real techniques used by security professionals</li>
              </ul>
            </div>
            
            <motion.button
              onClick={createDemoUser}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎭 Create Demo User & Start Learning
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <DashboardView user={currentUser} accessRequests={accessRequests} isMonitoring={isMonitoring} setIsMonitoring={setIsMonitoring} simulateRequest={simulateAccessRequest} />}
          {activeTab === 'policies' && <PoliciesView policies={policies} setPolicies={setPolicies} />}
          {activeTab === 'simulator' && <SimulatorView user={currentUser} riskLevel={riskLevel} setRiskLevel={setRiskLevel} onSimulate={simulateAccessRequest} />}
          {activeTab === 'learning' && <LearningView />}
        </AnimatePresence>
      )}
    </div>
  )
}

/**
 * 📊 DASHBOARD VIEW - The Control Center
 * 
 * This shows the current state of our Zero Trust system
 */
interface DashboardViewProps {
  user: ZeroTrustUser
  accessRequests: AccessRequest[]
  isMonitoring: boolean
  setIsMonitoring: (monitoring: boolean) => void
  simulateRequest: () => void
}

function DashboardView({ user, accessRequests, isMonitoring, setIsMonitoring, simulateRequest }: DashboardViewProps) {
  // 📈 Calculate statistics
  const approvedRequests = accessRequests.filter(r => r.status === 'approved').length
  const deniedRequests = accessRequests.filter(r => r.status === 'denied').length
  const pendingRequests = accessRequests.filter(r => r.status === 'pending').length

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* 👤 User Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2" />
          Current User Profile
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Username:</span>
            <span className="font-medium">{user.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trust Score:</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    user.trustScore >= 80 ? 'bg-green-500' : 
                    user.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${user.trustScore}%` }}
                />
              </div>
              <span className="font-bold">{user.trustScore}/100</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Devices:</span>
            <span className="font-medium">{user.activeDevices.length}</span>
          </div>
        </div>

        {/* 🔐 Authentication Methods */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-gray-800 mb-2">🔐 Auth Methods</h4>
          <div className="space-y-1">
            {user.authMethods.filter(method => method.enabled).map(method => (
              <div key={method.type} className="flex items-center justify-between text-sm">
                <span className="capitalize">{method.type.replace('_', ' ')}</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    method.trustLevel >= 80 ? 'bg-green-500' : 
                    method.trustLevel >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-600">{method.trustLevel}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎮 Action Buttons */}
        <div className="mt-6 space-y-3">
          <motion.button
            onClick={simulateRequest}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎯 Simulate Access Request
          </motion.button>
          
          <motion.button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`w-full py-2 rounded-lg transition-colors ${
              isMonitoring 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Start Real-Time Monitoring'}
          </motion.button>
        </div>
      </div>

      {/* 📊 Access Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Access Control Statistics
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
            <div className="text-sm text-green-700">✅ Approved</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{deniedRequests}</div>
            <div className="text-sm text-red-700">❌ Denied</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
            <div className="text-sm text-yellow-700">⏳ Pending</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{accessRequests.length}</div>
            <div className="text-sm text-blue-700">📊 Total</div>
          </div>
        </div>

        {/* 🎓 Educational Info */}
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">🎓 Learning Moment:</h4>
          <p className="text-sm text-purple-700">
            In a real Zero Trust system, these statistics help security teams understand 
            access patterns and identify potential threats or policy improvements.
          </p>
        </div>
      </div>

      {/* 📋 Recent Access Requests */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Recent Access Requests
        </h3>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {accessRequests.slice(0, 5).map(request => (
            <div key={request.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{request.resource}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'denied' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status.toUpperCase()}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <div>📋 Action: {request.action}</div>
                <div>⚠️ Risk: {request.riskAssessment.overallRisk} ({request.riskAssessment.riskScore}/100)</div>
                <div>📱 Device: {request.context.deviceType}</div>
                <div>⏰ Time: {request.timestamp.toLocaleTimeString()}</div>
              </div>
              
              {request.riskAssessment.factors.length > 0 && (
                <div className="mt-2 text-xs">
                  <strong>🚩 Risk Factors:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {request.riskAssessment.factors.slice(0, 2).map((factor, index) => (
                      <li key={index} className="text-gray-600">{factor.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          
          {accessRequests.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No access requests yet!</p>
              <p className="text-sm mt-2">Click "Simulate Access Request" to see Zero Trust in action!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// 🎭 Simple placeholder components for other views (you can expand these!)
function PoliciesView({ policies, setPolicies }: any) {
  return (
    <motion.div key="policies" className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">🛡️ Security Policy Management</h2>
      <p className="text-gray-600 mb-4">Configure the rules that govern access decisions</p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700">📚 Advanced policy management interface coming soon!</p>
        <p className="text-blue-600 text-sm mt-2">For now, explore the other tabs to see Zero Trust in action.</p>
      </div>
    </motion.div>
  )
}

function SimulatorView({ user, riskLevel, setRiskLevel, onSimulate }: any) {
  return (
    <motion.div key="simulator" className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">🎮 Zero Trust Risk Simulator</h2>
      <p className="text-gray-600 mb-4">Experiment with different risk scenarios</p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-green-700">🔬 Advanced simulation controls coming soon!</p>
        <p className="text-green-600 text-sm mt-2">Use the dashboard to simulate access requests for now.</p>
      </div>
    </motion.div>
  )
}

function LearningView() {
  return (
    <motion.div key="learning" className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🎓 Zero Trust Learning Center</h2>
      
      <div className="space-y-6">
        {/* Core Principles */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🎯 Zero Trust Core Principles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-semibold mb-2">Verify Explicitly</h4>
              <p className="text-sm text-gray-600">
                Always check identity, location, device health, and more before granting access
              </p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold mb-2">Least Privilege</h4>
              <p className="text-sm text-gray-600">
                Give users only the minimum access they need to do their job
              </p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <div className="text-3xl mb-2">🚨</div>
              <h4 className="font-semibold mb-2">Assume Breach</h4>
              <p className="text-sm text-gray-600">
                Act like attackers are already inside and verify everything continuously
              </p>
            </div>
          </div>
        </div>

        {/* Real-World Examples */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🌍 Real-World Zero Trust</h3>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold text-blue-800">🏢 Google's BeyondCorp</h4>
              <p className="text-blue-700 text-sm">
                Google implemented Zero Trust so employees can work securely from anywhere 
                without a traditional VPN.
              </p>
            </div>

            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-semibold text-purple-800">💳 Banking Security</h4>
              <p className="text-purple-700 text-sm">
                Banks use Zero Trust to verify every transaction and detect fraud in real-time.
              </p>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-800">🏥 Healthcare</h4>
              <p className="text-green-700 text-sm">
                Hospitals protect patient data with Zero Trust, ensuring only authorized 
                staff access sensitive medical records.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🚀 Ready to Dive Deeper?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">📚 Learn More About:</h4>
              <ul className="text-sm space-y-1">
                <li>• Identity and Access Management (IAM)</li>
                <li>• Multi-Factor Authentication (MFA)</li>
                <li>• Conditional Access Policies</li>
                <li>• Risk-Based Authentication</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🛠️ Try These Tools:</h4>
              <ul className="text-sm space-y-1">
                <li>• Microsoft Azure AD Conditional Access</li>
                <li>• Okta Identity Cloud</li>
                <li>• Google Cloud Identity</li>
                <li>• AWS IAM with Zero Trust</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * 🎓 EDUCATIONAL NOTES FOR CURIOUS STUDENTS
 * 
 * This Zero Trust Access Control Lab demonstrates several important concepts:
 * 
 * 1. **Modern Security Architecture**: Moving beyond perimeter-based security to identity-based security
 * 2. **Risk Assessment**: How to quantify and respond to security risks automatically
 * 3. **Context-Aware Security**: Using device, location, and behavior data for access decisions
 * 4. **Policy-Driven Access**: Defining security rules that computers can enforce automatically
 * 5. **Continuous Verification**: Never trusting, always verifying every single request
 * 
 * Key Programming Concepts Demonstrated:
 * - **Complex State Management**: Managing multiple interacting components with React hooks
 * - **Risk Calculation Algorithms**: Mathematical approaches to security decision-making
 * - **Real-Time Event Processing**: Handling security events as they happen
 * - **Policy Engine Design**: Building systems that enforce rules automatically
 * - **User Interface Design**: Creating intuitive interfaces for complex security concepts
 * 
 * This is the same type of system that protects:
 * - Your school's computer systems
 * - Banking and financial services
 * - Government and military networks
 * - Healthcare systems with patient data
 * - Any modern company with sensitive information
 * 
 * Zero Trust is the future of cybersecurity - understanding these concepts will be
 * crucial for any career in cybersecurity, software development, or IT administration!
 * 
 * Try exploring the code and see if you can:
 * - Add new risk factors to consider
 * - Create new security policies
 * - Modify the risk calculation algorithm
 * - Design new ways to visualize security data
 * 
 * Remember: With great power comes great responsibility! Use this knowledge to help
 * protect systems and people, never to cause harm. 🛡️💙
 */
