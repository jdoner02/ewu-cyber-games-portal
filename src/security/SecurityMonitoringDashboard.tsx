/**
 * 🚨 SECURITY MONITORING DASHBOARD - Real-Time Cybersecurity Operations Center
 * 
 * Welcome to your cybersecurity command center! 🛡️🚀
 * 
 * WHAT IS SECURITY MONITORING? 🤔
 * Imagine you're the guardian of a digital fortress! Security monitoring is like having
 * hundreds of digital security cameras, motion detectors, and alarm systems all watching
 * for suspicious activity 24/7. This dashboard shows you what's happening across all
 * your systems in real-time, just like a real Security Operations Center (SOC)!
 * 
 * WHY IS SECURITY MONITORING CRITICAL? 🌟
 * - Detect cyber attacks as they happen (not months later!)
 * - Respond to incidents before major damage occurs  
 * - Meet compliance requirements (schools, businesses need this!)
 * - Build evidence for law enforcement if crimes occur
 * - Understand normal vs. suspicious behavior patterns
 * - Protect sensitive data like grades, personal info, financial records
 * 
 * REAL SOC (SECURITY OPERATIONS CENTER) ACTIVITIES:
 * 🔍 Threat Detection: AI and rules identify suspicious patterns
 * 📊 Log Analysis: Examining millions of security events daily
 * 🚨 Incident Response: Coordinating response to security breaches
 * 🕵️ Threat Hunting: Proactively searching for hidden threats
 * 📋 Compliance Monitoring: Ensuring security policies are followed
 * 🤝 Collaboration: Working with IT, legal, and management teams
 * 
 * FOR STUDENT DEVELOPERS: 👩‍💻👨‍💻
 * This dashboard demonstrates enterprise-grade security monitoring concepts!
 * You'll see SIEM (Security Information and Event Management) principles,
 * threat detection algorithms, incident management workflows, and compliance
 * reporting - all technologies used by cybersecurity professionals at companies
 * like Microsoft, Amazon, and government agencies worldwide!
 * 
 * CAREER CONNECTIONS: 💼
 * - SOC Analyst: Monitor security dashboards and investigate alerts
 * - Incident Responder: Coordinate response to cyber attacks
 * - Threat Hunter: Proactively search for advanced threats
 * - Security Engineer: Build and maintain monitoring systems
 * - Compliance Analyst: Ensure regulatory requirements are met
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Shield, 
  Eye,
  Activity,
  Bell,
  BellRing,
  Clock,
  Users,
  MapPin,
  Smartphone,
  Monitor,
  Server,
  Database,
  Globe,
  Wifi,
  Lock,
  Unlock,
  Key,
  Search,
  Filter,
  Download,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Bug,
  Target,
  Radio,
  HardDrive,
  Code,
  FileText,
  Calendar,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * 🎯 SECURITY EVENT DATA STRUCTURES
 * 
 * These TypeScript interfaces define how we organize security monitoring data.
 * Real SIEM systems use similar structures to process millions of events!
 */

// 🚨 Security Event (Individual security incident or observation)
interface SecurityEvent {
  id: string                        // Unique event identifier
  timestamp: Date                   // When the event occurred
  eventType: SecurityEventType      // What kind of security event
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'  // How serious it is
  source: EventSource              // Where the event came from
  title: string                    // Human-readable event name
  description: string              // Detailed description
  status: 'new' | 'investigating' | 'resolved' | 'false_positive'  // Current status
  assignedTo?: string              // Which analyst is handling it
  affectedAssets: string[]         // Systems or users involved
  tags: string[]                   // Categorization tags
  riskScore: number               // Calculated risk (0-100)
  evidence: Evidence[]            // Supporting evidence and artifacts
  timeline: TimelineEntry[]       // Investigation timeline
  relatedEvents: string[]         // IDs of related events
  mitreTactics: string[]          // MITRE ATT&CK framework tactics
  geolocation?: {                 // Geographic information
    country: string
    city: string
    latitude: number
    longitude: number
  }
}

// 🏷️ Security Event Types (Categories of security events)
type SecurityEventType = 
  | 'login_anomaly'               // Unusual login patterns
  | 'malware_detection'           // Malicious software detected
  | 'network_intrusion'           // Unauthorized network access
  | 'data_exfiltration'           // Sensitive data being stolen
  | 'privilege_escalation'        // User gaining unauthorized access
  | 'brute_force_attack'          // Password guessing attacks
  | 'phishing_attempt'            // Social engineering attacks
  | 'policy_violation'            // Security policy violations
  | 'vulnerability_exploit'       // Known vulnerabilities being exploited
  | 'insider_threat'              // Threats from internal users
  | 'ddos_attack'                 // Distributed denial of service
  | 'data_leak'                   // Accidental data exposure

// 📍 Event Source (Where security events originate)
interface EventSource {
  type: 'firewall' | 'antivirus' | 'ids' | 'application' | 'endpoint' | 'network' | 'user'
  name: string                    // Specific source name
  location: string                // Physical or logical location
  version?: string                // Software version if applicable
}

// 🔍 Evidence (Supporting information for security events)
interface Evidence {
  type: 'log_entry' | 'file_hash' | 'network_traffic' | 'screenshot' | 'artifact'
  description: string
  data: string                    // Actual evidence data
  collectedAt: Date
  integrity: 'verified' | 'unverified'  // Chain of custody
}

// ⏱️ Timeline Entry (Investigation history)
interface TimelineEntry {
  timestamp: Date
  action: string                  // What action was taken
  analyst: string                 // Who performed the action
  notes: string                   // Additional details
}

// 📊 Security Metrics (Key performance indicators)
interface SecurityMetrics {
  totalEvents: number
  eventsLast24h: number
  eventsThisWeek: number
  activeIncidents: number
  resolvedIncidents: number
  meanTimeToDetection: number     // Hours
  meanTimeToResponse: number      // Hours
  falsePositiveRate: number       // Percentage
  complianceScore: number         // Percentage
  threatScore: number             // Current threat level (0-100)
  topEventTypes: Array<{
    type: SecurityEventType
    count: number
  }>
  geographicDistribution: Array<{
    country: string
    eventCount: number
  }>
}

// 🚨 Alert Rule (Automated detection rules)
interface AlertRule {
  id: string
  name: string
  description: string
  eventType: SecurityEventType
  conditions: AlertCondition[]
  severity: SecurityEvent['severity']
  enabled: boolean
  lastTriggered?: Date
  triggerCount: number
  actions: string[]               // What to do when triggered
}

// 📋 Alert Condition (Specific detection criteria)
interface AlertCondition {
  field: string                   // What to check
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex'
  value: string | number
  description: string
}

/**
 * 🎲 REALISTIC SECURITY EVENT GENERATOR
 * 
 * This creates realistic security events for educational purposes.
 * Real SOCs process thousands of events like these every day!
 */
const generateRealisticSecurityEvent = (): SecurityEvent => {
  const eventTypes: SecurityEventType[] = [
    'login_anomaly', 'malware_detection', 'network_intrusion', 'data_exfiltration',
    'privilege_escalation', 'brute_force_attack', 'phishing_attempt', 'policy_violation',
    'vulnerability_exploit', 'insider_threat', 'ddos_attack', 'data_leak'
  ]

  const sources: EventSource[] = [
    { type: 'firewall', name: 'Perimeter Firewall', location: 'Network Edge' },
    { type: 'antivirus', name: 'Windows Defender', location: 'Student Laptop' },
    { type: 'ids', name: 'Snort IDS', location: 'Campus Network' },
    { type: 'application', name: 'Student Portal', location: 'Web Server' },
    { type: 'endpoint', name: 'EDR Agent', location: 'Faculty Desktop' },
    { type: 'network', name: 'WiFi Controller', location: 'Student Center' },
    { type: 'user', name: 'User Report', location: 'Help Desk' }
  ]

  const severities: SecurityEvent['severity'][] = ['info', 'low', 'medium', 'high', 'critical']
  const countries = ['United States', 'China', 'Russia', 'Germany', 'Brazil', 'India', 'Unknown']
  const cities = ['Seattle', 'Beijing', 'Moscow', 'Berlin', 'São Paulo', 'Mumbai', 'Unknown']

  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
  const source = sources[Math.floor(Math.random() * sources.length)]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const country = countries[Math.floor(Math.random() * countries.length)]
  const city = cities[Math.floor(Math.random() * cities.length)]

  // 📚 Educational event descriptions based on real scenarios
  const eventDescriptions: Record<SecurityEventType, string[]> = {
    login_anomaly: [
      'User logged in from unusual geographic location during off-hours',
      'Multiple failed login attempts followed by successful authentication',
      'User account accessed from two different countries simultaneously',
      'Login attempt using previously compromised credentials'
    ],
    malware_detection: [
      'Trojan horse detected in email attachment',
      'Ransomware attempting to encrypt student files',
      'Spyware found collecting keyboard input',
      'Cryptominer installed on faculty computer'
    ],
    network_intrusion: [
      'Unauthorized device detected on campus network',
      'Suspicious network scanning activity from external IP',
      'Attempted connection to command & control server',
      'Lateral movement detected between campus subnets'
    ],
    data_exfiltration: [
      'Unusual amount of educational data accessed from campus system',
      'Research project files uploaded to unauthorized cloud service',
      'Database queries accessing more educational records than typical',
      'Email containing educational attachments sent to external address'
    ],
    privilege_escalation: [
      'Educational account gained elevated administrative privileges',
      'Service account used for unauthorized educational system access',
      'Security vulnerability attempted against educational server',
      'Unauthorized access attempted to educational access controls'
    ],
    brute_force_attack: [
      'Automated login attempts detected against educational accounts',
      'Dictionary attack detected on educational login portal',
      'Multiple login attempts on campus servers',
      'API endpoints being tested with common educational credentials'
    ],
    phishing_attempt: [
      'Suspicious email requesting educational login credentials',
      'Fake educational platform login page reported',
      'Social engineering targeting faculty with malicious attachments',
      'Suspicious messages sent to campus educational community'
    ],
    policy_violation: [
      'Educational user accessed restricted website from campus network',
      'Unauthorized educational software installation on managed device',
      'Educational data stored in unencrypted cloud service',
      'Security software disabled on educational computer'
    ],
    vulnerability_exploit: [
      'Outdated software exploited for unauthorized access',
      'Zero-day vulnerability exploited in campus application',
      'Unpatched system compromised through known CVE',
      'Web application vulnerable to SQL injection attacked'
    ],
    insider_threat: [
      'Faculty member accessing educational records outside normal duties',
      'IT administrator downloading unusual amounts of system data',
      'Employee attempting to access former colleague\'s educational files',
      'Contractor using elevated privileges for unauthorized educational activities'
    ],
    ddos_attack: [
      'Campus website overwhelmed by coordinated traffic flood',
      'Student portal experiencing severe performance degradation',
      'DNS servers under distributed denial of service attack',
      'Network infrastructure saturated by malicious traffic'
    ],
    data_leak: [
      'Educational content accidentally posted to public website',
      'Email containing class materials sent to wrong recipient list',
      'Course materials found in publicly accessible cloud storage',
      'Educational database backup discovered on unsecured external drive'
    ]
  }

  const descriptions = eventDescriptions[eventType]
  const description = descriptions[Math.floor(Math.random() * descriptions.length)]

  // 🎯 Generate realistic MITRE ATT&CK tactics
  const mitreTactics = {
    login_anomaly: ['Initial Access', 'Credential Access'],
    malware_detection: ['Execution', 'Persistence', 'Defense Evasion'],
    network_intrusion: ['Initial Access', 'Discovery', 'Lateral Movement'],
    data_exfiltration: ['Collection', 'Exfiltration'],
    privilege_escalation: ['Privilege Escalation', 'Persistence'],
    brute_force_attack: ['Credential Access'],
    phishing_attempt: ['Initial Access', 'Credential Access'],
    policy_violation: ['Defense Evasion'],
    vulnerability_exploit: ['Initial Access', 'Execution'],
    insider_threat: ['Collection', 'Exfiltration'],
    ddos_attack: ['Impact'],
    data_leak: ['Exfiltration']
  }

  // 🔢 Calculate risk score based on severity and context
  const severityScores = { info: 10, low: 25, medium: 50, high: 75, critical: 90 }
  const baseRisk = severityScores[severity]
  const locationRisk = country === 'Unknown' ? 20 : country !== 'United States' ? 15 : 0
  const riskScore = Math.min(100, baseRisk + locationRisk + Math.floor(Math.random() * 20))

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
    eventType,
    severity,
    source,
    title: `${eventType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Detected`,
    description,
    status: 'new',
    affectedAssets: [`asset-${Math.floor(Math.random() * 1000)}`],
    tags: [`${eventType}`, `${severity}`, `${source.type}`],
    riskScore,
    evidence: [],
    timeline: [{
      timestamp: new Date(),
      action: 'Event detected and created',
      analyst: 'SOC-AI-Agent',
      notes: 'Automated detection by security monitoring system'
    }],
    relatedEvents: [],
    mitreTactics: mitreTactics[eventType] || [],
    geolocation: {
      country,
      city,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180
    }
  }
}

/**
 * 🎮 MAIN SECURITY MONITORING DASHBOARD
 * 
 * This is your cybersecurity command center interface!
 */
export default function SecurityMonitoringDashboard() {
  /**
   * 🧠 COMPONENT STATE
   * 
   * React hooks manage our security monitoring system state
   */
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null)
  const [isRealTimeMode, setIsRealTimeMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'incidents' | 'analytics' | 'learning'>('overview')
  const [filterSeverity, setFilterSeverity] = useState<SecurityEvent['severity'] | 'all'>('all')
  const [filterEventType, setFilterEventType] = useState<SecurityEventType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  /**
   * 📊 CALCULATED METRICS
   * 
   * Real-time security metrics derived from our event data
   */
  const securityMetrics = useMemo((): SecurityMetrics => {
    const now = Date.now()
    const last24h = now - (24 * 60 * 60 * 1000)
    const lastWeek = now - (7 * 24 * 60 * 60 * 1000)

    const eventsLast24h = securityEvents.filter(e => e.timestamp.getTime() > last24h).length
    const eventsThisWeek = securityEvents.filter(e => e.timestamp.getTime() > lastWeek).length
    const activeIncidents = securityEvents.filter(e => e.status === 'investigating').length
    const resolvedIncidents = securityEvents.filter(e => e.status === 'resolved').length

    // 📈 Calculate event type distribution
    const eventTypeCounts = securityEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1
      return acc
    }, {} as Record<SecurityEventType, number>)

    const topEventTypes = Object.entries(eventTypeCounts)
      .map(([type, count]) => ({ type: type as SecurityEventType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // 🌍 Geographic distribution
    const geoCounts = securityEvents.reduce((acc, event) => {
      if (event.geolocation) {
        acc[event.geolocation.country] = (acc[event.geolocation.country] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const geographicDistribution = Object.entries(geoCounts)
      .map(([country, eventCount]) => ({ country, eventCount }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 5)

    // 🎯 Calculate threat score based on recent high-severity events
    const recentHighSeverityEvents = securityEvents.filter(e => 
      e.timestamp.getTime() > last24h && ['high', 'critical'].includes(e.severity)
    )
    const threatScore = Math.min(100, recentHighSeverityEvents.length * 10)

    return {
      totalEvents: securityEvents.length,
      eventsLast24h,
      eventsThisWeek,
      activeIncidents,
      resolvedIncidents,
      meanTimeToDetection: 2.5, // Simulated metric
      meanTimeToResponse: 45, // Simulated metric
      falsePositiveRate: 12, // Simulated metric
      complianceScore: 87, // Simulated metric
      threatScore,
      topEventTypes,
      geographicDistribution
    }
  }, [securityEvents])

  /**
   * 🔍 FILTERED EVENTS
   * 
   * Apply search and filter criteria to events list
   */
  const filteredEvents = useMemo(() => {
    return securityEvents.filter(event => {
      const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity
      const matchesType = filterEventType === 'all' || event.eventType === filterEventType
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesSeverity && matchesType && matchesSearch
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [securityEvents, filterSeverity, filterEventType, searchTerm])

  /**
   * 🎲 GENERATE INITIAL EVENTS
   * 
   * Populate the dashboard with realistic security events for demonstration
   */
  useEffect(() => {
    const initialEvents: SecurityEvent[] = []
    for (let i = 0; i < 25; i++) {
      initialEvents.push(generateRealisticSecurityEvent())
    }
    setSecurityEvents(initialEvents)
  }, [])

  /**
   * 🔄 REAL-TIME EVENT GENERATION
   * 
   * Simulate continuous security monitoring with new events
   */
  useEffect(() => {
    if (isRealTimeMode) {
      const interval = setInterval(() => {
        const newEvent = generateRealisticSecurityEvent()
        setSecurityEvents(prev => [newEvent, ...prev.slice(0, 99)]) // Keep last 100 events
        
        // 🚨 Show toast notification for high-severity events
        if (['high', 'critical'].includes(newEvent.severity)) {
          toast.error(`🚨 ${newEvent.severity.toUpperCase()}: ${newEvent.title}`)
        } else if (newEvent.severity === 'medium') {
          toast.warning(`⚠️ MEDIUM: ${newEvent.title}`)
        }
      }, 3000) // New event every 3 seconds

      return () => clearInterval(interval)
    }
  }, [isRealTimeMode])

  /**
   * 🔧 EVENT MANAGEMENT FUNCTIONS
   */
  const updateEventStatus = useCallback((eventId: string, newStatus: SecurityEvent['status']) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            status: newStatus,
            timeline: [
              ...event.timeline,
              {
                timestamp: new Date(),
                action: `Status changed to ${newStatus}`,
                analyst: 'SOC-Analyst-001',
                notes: `Event status updated by security analyst`
              }
            ]
          }
        : event
    ))
    
    toast.success(`✅ Event status updated to ${newStatus}`)
  }, [])

  const assignEvent = useCallback((eventId: string, analyst: string) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            assignedTo: analyst,
            timeline: [
              ...event.timeline,
              {
                timestamp: new Date(),
                action: `Assigned to ${analyst}`,
                analyst: 'SOC-Manager',
                notes: `Event assigned for investigation`
              }
            ]
          }
        : event
    ))
    
    toast.success(`👤 Event assigned to ${analyst}`)
  }, [])

  /**
   * 🎨 RENDER THE SECURITY MONITORING INTERFACE
   */
  return (
    <main className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen" role="main">
      
      {/* 🎯 Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🚨 Security Operations Center (SOC)
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Real-time cybersecurity monitoring and incident response
        </p>

        {/* 🔧 Control Panel */}
        <nav className="flex justify-center items-center space-x-4 mb-6" role="navigation" aria-label="SOC Controls">
          <motion.button
            onClick={() => setIsRealTimeMode(!isRealTimeMode)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isRealTimeMode
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-green-500 text-white shadow-lg'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={isRealTimeMode ? 'Stop real-time monitoring' : 'Start real-time monitoring'}
          >
            {isRealTimeMode ? (
              <>
                <Pause className="w-5 h-5 inline mr-2" />
                🛑 Stop Real-Time Monitoring
              </>
            ) : (
              <>
                <Play className="w-5 h-5 inline mr-2" />
                ▶️ Start Real-Time Monitoring
              </>
            )}
          </motion.button>

          <div className={`px-4 py-2 rounded-lg font-medium ${
            isRealTimeMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <Radio className={`w-4 h-4 inline mr-2 ${isRealTimeMode ? 'animate-pulse' : ''}`} />
            {isRealTimeMode ? 'LIVE MONITORING' : 'MONITORING PAUSED'}
          </div>
        </nav>

        {/* 📊 Tab Navigation */}
        <div className="flex justify-center space-x-4 flex-wrap">
          {[
            { id: 'overview', label: '📊 SOC Overview', icon: BarChart3 },
            { id: 'events', label: '🚨 Security Events', icon: AlertTriangle },
            { id: 'incidents', label: '🔍 Incident Response', icon: Search },
            { id: 'analytics', label: '📈 Threat Analytics', icon: TrendingUp },
            { id: 'learning', label: '🎓 SOC Training', icon: Users }
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

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewView metrics={securityMetrics} events={securityEvents.slice(0, 5)} />}
        {activeTab === 'events' && <EventsView events={filteredEvents} selectedEvent={selectedEvent} onSelectEvent={setSelectedEvent} onUpdateStatus={updateEventStatus} onAssignEvent={assignEvent} filters={{ severity: filterSeverity, eventType: filterEventType, search: searchTerm }} onFiltersChange={{ setSeverity: setFilterSeverity, setEventType: setFilterEventType, setSearch: setSearchTerm }} />}
        {activeTab === 'incidents' && <IncidentsView events={securityEvents.filter(e => e.status === 'investigating')} />}
        {activeTab === 'analytics' && <AnalyticsView metrics={securityMetrics} events={securityEvents} />}
        {activeTab === 'learning' && <LearningView />}
      </AnimatePresence>
    </main>
  )
}

/**
 * 📊 OVERVIEW VIEW - SOC Dashboard
 */
interface OverviewViewProps {
  metrics: SecurityMetrics
  events: SecurityEvent[]
}

function OverviewView({ metrics, events }: OverviewViewProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* 📊 Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{metrics.totalEvents}</div>
          <div className="text-sm text-gray-600">🚨 Total Events</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{metrics.eventsLast24h}</div>
          <div className="text-sm text-gray-600">📅 Events (24h)</div>
          <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{metrics.activeIncidents}</div>
          <div className="text-sm text-gray-600">🔍 Active Incidents</div>
          <div className="text-xs text-gray-500 mt-1">Being investigated</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className={`text-3xl font-bold ${
            metrics.threatScore > 70 ? 'text-red-600' : 
            metrics.threatScore > 40 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {metrics.threatScore}
          </div>
          <div className="text-sm text-gray-600">⚡ Threat Level</div>
          <div className="text-xs text-gray-500 mt-1">Current risk score</div>
        </div>
      </div>

      {/* 📈 SOC Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            SOC Performance Metrics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mean Time to Detection:</span>
              <span className="font-bold text-blue-600">{metrics.meanTimeToDetection} hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mean Time to Response:</span>
              <span className="font-bold text-orange-600">{metrics.meanTimeToResponse} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">False Positive Rate:</span>
              <span className="font-bold text-yellow-600">{metrics.falsePositiveRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Compliance Score:</span>
              <span className="font-bold text-green-600">{metrics.complianceScore}%</span>
            </div>
          </div>

          {/* 🎓 Educational Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">🎓 Learning Moment:</h4>
            <p className="text-sm text-blue-700">
              These metrics help SOC managers understand team performance and identify
              areas for improvement. Fast detection and response times are critical!
            </p>
          </div>
        </div>

        {/* 📊 Export Controls for Educational Compliance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            📊 Export Data for Educational Reports
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              📄 Export Security Report
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              📋 Download Event Log
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              📈 Export Analytics Data
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">🎓 Educational Compliance:</h4>
            <p className="text-sm text-green-700">
              Export capabilities support educational reporting requirements and compliance documentation for cybersecurity training programs.
            </p>
          </div>
        </div>

        {/* 🏆 Top Event Types */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Top Security Event Types
          </h3>
          
          <div className="space-y-3">
            {metrics.topEventTypes.map((eventType, index) => (
              <div key={eventType.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium capitalize">
                    {eventType.type.replace('_', ' ')}
                  </span>
                </div>
                <span className="font-bold text-gray-600">{eventType.count}</span>
              </div>
            ))}
          </div>

          {/* 🎓 Educational Note */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-1">🎓 Learning Moment:</h4>
            <p className="text-sm text-purple-700">
              Understanding attack patterns helps SOC teams focus on the most common
              threats and improve detection capabilities for high-priority risks.
            </p>
          </div>
        </div>
      </div>

      {/* 🌍 Geographic Threat Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Geographic Threat Distribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.geographicDistribution.map((geo, index) => (
            <div key={geo.country} className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{geo.eventCount}</div>
              <div className="text-sm text-gray-600">{geo.country}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(geo.eventCount / Math.max(...metrics.geographicDistribution.map(g => g.eventCount))) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚨 Recent Critical Events */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Recent Security Events (Real-Time Feed)
        </h3>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {events.map(event => (
            <div key={event.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{event.title}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  event.severity === 'low' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.severity.toUpperCase()}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <div>📋 {event.description}</div>
                <div>📍 Source: {event.source.name}</div>
                <div>⏰ {event.timestamp.toLocaleString()}</div>
                <div>🌍 Location: {event.geolocation?.city}, {event.geolocation?.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// 🎭 Placeholder components for other views (you can expand these!)
function EventsView({ events, filters, onFiltersChange, onUpdateStatus, onAssignEvent }: any) {
  return (
    <motion.div 
      key="events" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">🚨 Security Events Management</h2>
        <p className="text-gray-600 mb-4">Investigate, analyze, and respond to security events for educational purposes</p>
      </div>

      {/* 🔍 Educational Filter Controls */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">🔍 Filter & Search Controls for Teachers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Events</label>
            <input
              type="text"
              placeholder="Search for specific threats..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters?.search || ''}
              onChange={(e) => onFiltersChange?.setSearch?.(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters?.severity || 'all'}
              onChange={(e) => onFiltersChange?.setSeverity?.(e.target.value)}
            >
              <option value="all">All Severity Levels</option>
              <option value="low">Low - Learning Opportunities</option>
              <option value="medium">Medium - Practice Scenarios</option>
              <option value="high">High - Advanced Training</option>
              <option value="critical">Critical - Emergency Simulation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters?.eventType || 'all'}
              onChange={(e) => onFiltersChange?.setEventType?.(e.target.value)}
            >
              <option value="all">All Event Types</option>
              <option value="malware">Malware Detection</option>
              <option value="phishing">Phishing Attempts</option>
              <option value="intrusion">Network Intrusion</option>
              <option value="ddos">DDoS Attacks</option>
              <option value="insider">Insider Threats</option>
            </select>
          </div>
        </div>
      </div>

      {/* 👥 Team Assignment & Collaboration */}
      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-800">👥 Team Assignment & Educational Collaboration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-700 mb-3">🎓 Assign to Student Teams</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-white rounded-lg border hover:bg-purple-50">
                📚 Team Alpha - Beginner Analysts
              </button>
              <button className="w-full text-left px-4 py-2 bg-white rounded-lg border hover:bg-purple-50">
                🔍 Team Beta - Intermediate Investigators  
              </button>
              <button className="w-full text-left px-4 py-2 bg-white rounded-lg border hover:bg-purple-50">
                🛡️ Team Gamma - Advanced Security Experts
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-3">👨‍🏫 Teacher Oversight Controls</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-white rounded-lg border hover:bg-purple-50">
                📋 Review Team Progress
              </button>
              <button className="w-full text-left px-4 py-2 bg-white rounded-lg border hover:bg-purple-50">
                🎯 Set Learning Objectives
              </button>
              <button className="w-full text-left px-4 py-2 bg-white rounded-lg border hover:bg-purple-50">
                📊 Generate Assessment Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Event Management Interface */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Educational Event Analysis Workspace</h3>
        
        {events && events.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Showing {events.length} security events for educational analysis
            </div>
            {events.slice(0, 5).map((event: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{event.type || 'Security Event'}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.severity?.toUpperCase() || 'INFO'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    📍 Source: {event.source?.name || 'Unknown'} | ⏰ {event.timestamp?.toLocaleString?.() || event.timestamp}
                  </div>
                  <div className="space-x-2">
                    <button 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                      onClick={() => onAssignEvent?.(event)}
                    >
                      Assign to Team
                    </button>
                    <button 
                      className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                      onClick={() => onUpdateStatus?.(event.id, 'investigating')}
                    >
                      Start Analysis
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">No security events match current filters</div>
            <p className="text-sm text-gray-600">
              Adjust your search criteria or severity filters to view relevant educational events
            </p>
          </div>
        )}
      </div>

      {/* 🎓 Educational Learning Context */}
      <div className="bg-yellow-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">🎓 Educational Learning Moment</h3>
        <p className="text-gray-700">
          <strong>Event Management Best Practices:</strong> Security Operations Centers use sophisticated filtering 
          and assignment systems to manage large volumes of security events. Team collaboration ensures that 
          incidents are properly investigated and resolved. This educational interface helps students learn 
          real-world SOC workflows in a safe, controlled environment with teacher oversight.
        </p>
      </div>
    </motion.div>
  )
}

function IncidentsView(props: any) {
  return (
    <motion.div key="incidents" className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">🔍 Active Incident Response</h2>
      <p className="text-gray-600 mb-4">Coordinate response to ongoing security incidents</p>
      <div className="bg-orange-50 p-4 rounded-lg">
        <p className="text-orange-700">🚨 Advanced incident response interface coming soon!</p>
        <p className="text-orange-600 text-sm mt-2">Full case management and collaboration tools will be here.</p>
      </div>
    </motion.div>
  )
}

function AnalyticsView({ metrics, events }: { metrics: SecurityMetrics, events: SecurityEvent[] }) {
  // 🎓 Calculate educational analytics
  const threatScore = metrics ? metrics.threatScore : 75 // Use existing threat score (0-100)
  
  // 🌍 Geographic distribution for educational purposes (aggregated, no personal data)
  const geographicData = [
    { country: 'United States', threats: 12, region: 'North America' },
    { country: 'China', threats: 8, region: 'Asia' },
    { country: 'Russia', threats: 6, region: 'Europe' },
    { country: 'Germany', threats: 4, region: 'Europe' },
    { country: 'Brazil', threats: 3, region: 'South America' }
  ]
  
  // 🎯 Learning progress metrics
  const learningMetrics = {
    completedLessons: 15,
    totalLessons: 24,
    progressPercentage: Math.round((15 / 24) * 100),
    skillLevel: 'Intermediate'
  }
  
  return (
    <motion.div 
      key="analytics" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">📈 Threat Intelligence & Analytics</h2>
        <p className="text-gray-600 mb-4">Advanced threat hunting and security analytics for educational purposes</p>
      </div>

      {/* 🎓 Educational Learning Progress */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">🎓 Learning Progress & Educational Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600">{learningMetrics.progressPercentage}%</div>
            <div className="text-sm text-gray-600">Educational Progress</div>
            <div className="text-xs text-gray-500 mt-1">
              {learningMetrics.completedLessons} of {learningMetrics.totalLessons} lessons completed
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-lg font-bold text-green-600">{learningMetrics.skillLevel}</div>
            <div className="text-sm text-gray-600">Current Skill Level</div>
            <div className="text-xs text-gray-500 mt-1">
              Based on completed training modules
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ Threat Level Analytics */}
      <div className="bg-red-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-red-800">⚡ Threat Level Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-4xl font-bold text-red-600">{threatScore}</div>
            <div className="text-sm text-gray-600">⚡ Threat Level</div>
            <div className="text-xs text-gray-500 mt-1">Current risk score (0-100)</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{events.filter(e => e.severity === 'high').length}</div>
            <div className="text-sm text-gray-600">High Severity</div>
            <div className="text-xs text-gray-500 mt-1">Requires immediate attention</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{events.filter(e => e.severity === 'medium').length}</div>
            <div className="text-sm text-gray-600">Medium Severity</div>
            <div className="text-xs text-gray-500 mt-1">Monitor closely</div>
          </div>
        </div>
      </div>

      {/* 🌍 Geographic Threat Distribution */}
      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-green-800">🌍 Geographic Threat Distribution</h3>
        <p className="text-sm text-gray-600 mb-4">
          Educational overview of global cybersecurity threats by country and region
        </p>
        <div className="space-y-3">
          {geographicData.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-3 flex justify-between items-center">
              <div>
                <span className="font-medium">{item.country}</span>
                <span className="text-sm text-gray-500 ml-2">({item.region})</span>
              </div>
              <div className="text-lg font-bold text-red-600">{item.threats}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          📚 Geographic data aggregated for educational purposes. Does not contain personal information.
        </div>
      </div>

      {/* 👥 Team Collaboration & Assignment Features */}
      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-800">👥 Team Collaboration & Assignments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-700 mb-2">🎓 Teacher Dashboard</h4>
            <ul className="text-sm space-y-1">
              <li>• Assign security incidents to student teams</li>
              <li>• Monitor student analyst progress</li>
              <li>• Review team collaboration effectiveness</li>
              <li>• Track educational learning outcomes</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-700 mb-2">👥 Student Teams</h4>
            <ul className="text-sm space-y-1">
              <li>• Work with assigned team members</li>
              <li>• Collaborate on incident analysis</li>
              <li>• Learn from experienced analysts</li>
              <li>• Practice real-world SOC scenarios</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 🎓 Educational Learning Moment */}
      <div className="bg-yellow-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-2 text-yellow-800">🎓 Learning Moment</h3>
        <p className="text-gray-700">
          <strong>Threat Analytics in Practice:</strong> Security analysts use data visualization and geographic 
          threat mapping to identify patterns and trends in cybersecurity incidents. This helps teams prioritize 
          response efforts and allocate resources effectively. Educational environments provide safe spaces to 
          practice these critical skills without real-world consequences.
        </p>
      </div>
    </motion.div>
  )
}

function LearningView() {
  return (
    <motion.div key="learning" className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">🎓 Security Operations Center (SOC) Training</h2>
      
      <div className="space-y-6">
        {/* SOC Fundamentals */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🎯 SOC Fundamentals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-semibold mb-2">People</h4>
              <p className="text-sm text-gray-600">
                Skilled analysts, incident responders, threat hunters, and managers working 24/7
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-semibold mb-2">Processes</h4>
              <p className="text-sm text-gray-600">
                Standardized procedures for detection, analysis, containment, and recovery
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-3xl mb-2">💻</div>
              <h4 className="font-semibold mb-2">Technology</h4>
              <p className="text-sm text-gray-600">
                SIEM platforms, threat intelligence feeds, automation tools, and dashboards
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold mb-2">Metrics</h4>
              <p className="text-sm text-gray-600">
                Key performance indicators measuring detection speed, response time, and effectiveness
              </p>
            </div>
          </div>
        </div>

        {/* Incident Response Process */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🚨 Incident Response Process</h3>
          
          <div className="space-y-3">
            {[
              { phase: 'Preparation', icon: '🛡️', description: 'Build capabilities, train teams, establish procedures' },
              { phase: 'Detection & Analysis', icon: '🔍', description: 'Identify security events and determine if they are incidents' },
              { phase: 'Containment', icon: '🚧', description: 'Stop the incident from spreading and causing more damage' },
              { phase: 'Eradication', icon: '🧹', description: 'Remove the threat completely from all affected systems' },
              { phase: 'Recovery', icon: '🔄', description: 'Restore systems to normal operation and monitor for recurrence' },
              { phase: 'Lessons Learned', icon: '📚', description: 'Analyze the incident and improve processes for next time' }
            ].map((step, index) => (
              <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mr-4">{step.icon}</div>
                <div>
                  <h4 className="font-semibold text-blue-800">{step.phase}</h4>
                  <p className="text-sm text-blue-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOC Tools & Technologies */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🛠️ SOC Tools & Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-blue-800">🎯 Core SOC Technologies</h4>
              <ul className="text-sm space-y-1">
                <li>• SIEM (Splunk, QRadar, ArcSight)</li>
                <li>• SOAR (Phantom, Demisto, Swimlane)</li>
                <li>• EDR/XDR (CrowdStrike, SentinelOne)</li>
                <li>• Threat Intelligence (Recorded Future, ThreatConnect)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-800">🔍 Analysis Tools</h4>
              <ul className="text-sm space-y-1">
                <li>• Network Analysis (Wireshark, NetworkMiner)</li>
                <li>• Malware Analysis (IDA Pro, Ghidra)</li>
                <li>• Forensics (EnCase, FTK, Volatility)</li>
                <li>• Threat Hunting (Yara, Sigma Rules)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Career Paths */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🚀 SOC Career Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">🎯 SOC Career Progression:</h4>
              <ul className="text-sm space-y-1">
                <li>• SOC Analyst (Tier 1) - Event monitoring and triage</li>
                <li>• Senior SOC Analyst (Tier 2) - Investigation and analysis</li>
                <li>• SOC Lead/Manager (Tier 3) - Advanced analysis and leadership</li>
                <li>• SOC Manager - Team management and strategy</li>
                <li>• CISO - Executive security leadership</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📚 Skills to Develop:</h4>
              <ul className="text-sm space-y-1">
                <li>• Log analysis and correlation</li>
                <li>• Incident response procedures</li>
                <li>• Threat hunting methodologies</li>
                <li>• Network and system security</li>
                <li>• Communication and documentation</li>
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
 * This Security Monitoring Dashboard demonstrates enterprise cybersecurity concepts:
 * 
 * 1. **Security Information and Event Management (SIEM)**: Centralized collection and analysis of security data
 * 2. **Real-Time Threat Detection**: Automated systems that identify suspicious activity instantly
 * 3. **Incident Response**: Structured approach to handling security breaches and cyber attacks
 * 4. **Security Metrics**: Quantitative measurement of security program effectiveness
 * 5. **24/7 Operations**: Round-the-clock monitoring required for effective cybersecurity
 * 
 * Key Programming Concepts Demonstrated:
 * - **Real-Time Data Processing**: Handling continuous streams of security events
 * - **Complex State Management**: Managing multiple data types and user interactions
 * - **Event-Driven Architecture**: Responding to security events as they occur
 * - **Data Visualization**: Presenting complex security data in understandable formats
 * - **Filtering and Search**: Helping analysts find relevant information quickly
 * 
 * This type of system protects:
 * - Corporate networks and sensitive business data
 * - Government systems and classified information
 * - Healthcare networks with patient records
 * - Financial institutions and customer data
 * - Educational institutions and student information
 * - Critical infrastructure like power grids and water systems
 * 
 * Security Operations Centers (SOCs) are essential for:
 * - Early detection of cyber attacks and data breaches
 * - Coordinated response to security incidents
 * - Compliance with regulatory requirements
 * - Threat intelligence and attack attribution
 * - Continuous improvement of security posture
 * 
 * Career opportunities in SOC operations include roles in:
 * - Security analysis and incident response
 * - Threat hunting and intelligence analysis
 * - SOC management and strategy
 * - Security tool development and engineering
 * - Compliance and risk management
 * 
 * Try exploring the code and see if you can:
 * - Add new types of security events and alerts
 * - Implement machine learning for anomaly detection
 * - Create custom dashboards for different user roles
 * - Build integration with external threat intelligence feeds
 * - Design automated response workflows (SOAR)
 * 
 * Remember: SOC professionals are the guardians of digital society!
 * Their work protects businesses, governments, and individuals from cyber threats. 🛡️💙
 */
