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
      'Large volume of student records accessed and downloaded',
      'Sensitive research data uploaded to external cloud service',
      'Database queries retrieving unusual amounts of personal information',
      'Email with confidential attachments sent to external address'
    ],
    privilege_escalation: [
      'Student account gained administrative privileges',
      'Service account used for unauthorized system access',
      'Buffer overflow exploit attempted against campus server',
      'SQL injection used to bypass access controls'
    ],
    brute_force_attack: [
      'Automated password guessing attack against student accounts',
      'Dictionary attack detected on faculty login portal',
      'SSH brute force attempts on campus servers',
      'API endpoints being tested with common credentials'
    ],
    phishing_attempt: [
      'Suspicious email requesting student login credentials',
      'Fake Microsoft Office 365 login page reported',
      'Spear phishing targeting faculty with malicious attachments',
      'SMS phishing messages sent to campus community'
    ],
    policy_violation: [
      'Student accessed prohibited website from campus network',
      'Unauthorized software installation on managed device',
      'Sensitive data stored in unencrypted cloud service',
      'Security software disabled on faculty computer'
    ],
    vulnerability_exploit: [
      'Outdated software exploited for unauthorized access',
      'Zero-day vulnerability exploited in campus application',
      'Unpatched system compromised through known CVE',
      'Web application vulnerable to SQL injection attacked'
    ],
    insider_threat: [
      'Faculty member accessing student records outside normal duties',
      'IT administrator downloading unusual amounts of data',
      'Employee attempting to access terminated colleague\'s files',
      'Contractor using elevated privileges for unauthorized activities'
    ],
    ddos_attack: [
      'Campus website overwhelmed by coordinated traffic flood',
      'Student portal experiencing severe performance degradation',
      'DNS servers under distributed denial of service attack',
      'Network infrastructure saturated by malicious traffic'
    ],
    data_leak: [
      'Student information accidentally posted to public website',
      'Email containing grades sent to wrong recipient list',
      'Research data found in publicly accessible cloud storage',
      'Database backup discovered on unsecured external drive'
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
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      
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
        <div className="flex justify-center items-center space-x-4 mb-6">
          <motion.button
            onClick={() => setIsRealTimeMode(!isRealTimeMode)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isRealTimeMode
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-green-500 text-white shadow-lg'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
        </div>

        {/* 📊 Tab Navigation */}
        <div className="flex justify-center space-x-4 flex-wrap">
          {[
            { id: 'overview', label: '📊 SOC Overview', icon: BarChart3 },
            { id: 'events', label: '🚨 Security Events', icon: AlertTriangle },
            { id: 'incidents', label: '🔍 Active Incidents', icon: Search },
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
    </div>
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
function EventsView(props: any) {
  return (
    <motion.div key="events" className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">🚨 Security Events Management</h2>
      <p className="text-gray-600 mb-4">Investigate, analyze, and respond to security events</p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700">📚 Advanced event management interface coming soon!</p>
        <p className="text-blue-600 text-sm mt-2">Full incident response workflow will be available here.</p>
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

function AnalyticsView(props: any) {
  return (
    <motion.div key="analytics" className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">📈 Threat Intelligence & Analytics</h2>
      <p className="text-gray-600 mb-4">Advanced threat hunting and security analytics</p>
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-purple-700">📊 Advanced analytics interface coming soon!</p>
        <p className="text-purple-600 text-sm mt-2">Threat hunting tools and security analytics will be available here.</p>
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
