'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, Shield, CheckCircle, RotateCcw } from 'lucide-react'

interface SilkStroke {
  id: string
  points: { x: number; y: number; pressure: number }[]
  color: string
  protocol: 'HTTP' | 'HTTPS' | 'SSH' | 'FTP' | 'SMTP'
  security: 'secure' | 'unsecure' | 'encrypted'
  opacity: number
  createdAt: number
}

interface ParticleEffect {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

type DrawingMode = 'network' | 'dataflow' | 'encryption' | 'attacks' | 'freeform'
type SymmetryMode = 'none' | 'bilateral' | 'radial4' | 'radial6' | 'radial8'
type LearningMode = 'creative' | 'tutorial' | 'assessment' | 'scenario'
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  completed: boolean;
  prerequisite?: string[];
}

interface SecurityScenario {
  id: string;
  title: string;
  description: string;
  threat_category: 'spoofing' | 'tampering' | 'repudiation' | 'information_disclosure' | 'denial_of_service' | 'elevation_of_privilege';
  challenge: string;
  expected_drawing: string;
  learning_outcome: string;
  real_world_example: string;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  concept_link: string;
}

const CyberSilkGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [silkStrokes, setSilkStrokes] = useState<SilkStroke[]>([])
  const [particles, setParticles] = useState<ParticleEffect[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<SilkStroke | null>(null)
  const [score, setScore] = useState(0)
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('network')
  const [symmetryMode, setSymmetryMode] = useState<SymmetryMode>('bilateral')
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [networkConcepts, setNetworkConcepts] = useState<string[]>([])
  
  // Enhanced Pedagogical State
  const [learningMode, setLearningMode] = useState<LearningMode>('creative')
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('beginner')
  const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>([])
  const [currentScenario, setCurrentScenario] = useState<SecurityScenario | null>(null)
  const [showAssessment, setShowAssessment] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null)
  const [studentProgress, setStudentProgress] = useState({
    concepts_mastered: 0,
    total_concepts: 0,
    current_streak: 0,
    learning_session_time: 0
  })
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)

  // Protocol colors for educational visualization
  const protocolColors = {
    'HTTP': '#ef4444',     // Red - unsecure
    'HTTPS': '#10b981',    // Green - secure
    'SSH': '#3b82f6',      // Blue - secure terminal
    'FTP': '#f59e0b',      // Orange - file transfer
    'SMTP': '#8b5cf6'      // Purple - email
  }

  // Initialize educational content with atomic learning objectives
  useEffect(() => {
    updateNetworkConcepts()
    initializeLearningObjectives()
    initializeSecurityScenarios()
  }, [drawingMode])

  const initializeLearningObjectives = () => {
    const objectives: LearningObjective[] = [
      // Beginner Level - Foundation Concepts
      {
        id: 'network-topology-basics',
        title: 'Network Topology Fundamentals',
        description: 'Understand how devices connect in computer networks and identify common topology patterns',
        difficulty: 'beginner',
        completed: false,
        prerequisite: []
      },
      {
        id: 'protocol-identification',
        title: 'Protocol Recognition and Classification',
        description: 'Distinguish between different network protocols and understand their security implications',
        difficulty: 'beginner',
        completed: false,
        prerequisite: ['network-topology-basics']
      },
      {
        id: 'data-flow-visualization',
        title: 'Data Flow Pattern Recognition',
        description: 'Visualize how data moves through networks and identify potential bottlenecks',
        difficulty: 'beginner',
        completed: false,
        prerequisite: ['protocol-identification']
      },
      
      // Intermediate Level - Security Applications
      {
        id: 'encryption-concepts',
        title: 'Encryption in Network Communications',
        description: 'Understand how encryption protects data in transit and identify encrypted vs unencrypted protocols',
        difficulty: 'intermediate',
        completed: false,
        prerequisite: ['data-flow-visualization']
      },
      {
        id: 'threat-modeling-stride',
        title: 'STRIDE Threat Modeling Application',
        description: 'Apply STRIDE framework to identify and visualize potential security threats in network diagrams',
        difficulty: 'intermediate',
        completed: false,
        prerequisite: ['encryption-concepts']
      },
      {
        id: 'attack-pattern-recognition',
        title: 'Attack Vector Visualization',
        description: 'Recognize common attack patterns and understand how threats propagate through networks',
        difficulty: 'intermediate',
        completed: false,
        prerequisite: ['threat-modeling-stride']
      },
      
      // Advanced Level - Complex Analysis
      {
        id: 'network-forensics',
        title: 'Network Forensics and Analysis',
        description: 'Analyze network traffic patterns to identify suspicious activity and security incidents',
        difficulty: 'advanced',
        completed: false,
        prerequisite: ['attack-pattern-recognition']
      },
      {
        id: 'security-architecture',
        title: 'Secure Network Architecture Design',
        description: 'Design secure network architectures that implement defense-in-depth principles',
        difficulty: 'advanced',
        completed: false,
        prerequisite: ['network-forensics']
      }
    ]
    
    setLearningObjectives(objectives)
    setStudentProgress(prev => ({
      ...prev,
      total_concepts: objectives.length
    }))
  }

  const initializeSecurityScenarios = () => {
    const scenarios: SecurityScenario[] = [
      {
        id: 'corporate-network-breach',
        title: 'Corporate Network Security Breach',
        description: 'A company discovered unauthorized access to their internal network. Draw the attack path.',
        threat_category: 'elevation_of_privilege',
        challenge: 'Draw how an attacker might move from external access to internal systems',
        expected_drawing: 'Shows progression from perimeter to internal network with protocol changes',
        learning_outcome: 'Understanding lateral movement and privilege escalation in networks',
        real_world_example: 'Similar to the 2020 SolarWinds attack where attackers moved through trusted network connections'
      },
      {
        id: 'phishing-email-attack',
        title: 'Phishing Email Network Analysis',
        description: 'An employee clicked a malicious email link. Visualize the resulting network traffic.',
        threat_category: 'spoofing',
        challenge: 'Draw the network communication pattern of a successful phishing attack',
        expected_drawing: 'Shows initial HTTP/HTTPS connection leading to malware download and C2 communication',
        learning_outcome: 'Understanding how social engineering attacks manifest in network traffic',
        real_world_example: 'Based on common business email compromise (BEC) attack patterns'
      },
      {
        id: 'ddos-attack-pattern',
        title: 'Distributed Denial of Service Attack',
        description: 'A web server is under attack from multiple sources. Draw the attack pattern.',
        threat_category: 'denial_of_service',
        challenge: 'Visualize how multiple attack sources overwhelm a single target',
        expected_drawing: 'Shows multiple sources converging on single target with traffic volume indicators',
        learning_outcome: 'Understanding distributed attack patterns and mitigation strategies',
        real_world_example: 'Similar to major DDoS attacks on content delivery networks'
      },
      {
        id: 'data-exfiltration',
        title: 'Sensitive Data Exfiltration',
        description: 'Confidential data is being stolen from a secure database. Map the exfiltration path.',
        threat_category: 'information_disclosure',
        challenge: 'Draw how sensitive data moves from internal systems to external attackers',
        expected_drawing: 'Shows data path from secure systems through various network layers to external destination',
        learning_outcome: 'Understanding data loss prevention and monitoring requirements',
        real_world_example: 'Based on healthcare and financial data breach patterns'
      }
    ]
    
    // Set initial scenario based on difficulty level
    if (currentDifficulty === 'beginner') {
      setCurrentScenario(scenarios[1]) // Start with phishing
    } else if (currentDifficulty === 'intermediate') {
      setCurrentScenario(scenarios[0]) // Corporate breach
    } else {
      setCurrentScenario(scenarios[2]) // DDoS attack
    }
  }

  // Enhanced cybersecurity education feedback
  const showProtocolFeedback = (protocol: string, security: string, pos: { x: number; y: number }) => {
    const messages = {
      'HTTP': '⚠️ Unencrypted! Data visible to attackers',
      'HTTPS': '🔒 Encrypted connection - data protected',
      'SSH': '🛡️ Secure shell - authentication protected', 
      'FTP': '📁 File transfer - consider SFTP instead',
      'SMTP': '📧 Email protocol - encryption recommended'
    }
    
    const message = messages[protocol as keyof typeof messages]
    
    // Visual feedback near drawing point
    createEducationalPopup(pos.x, pos.y, message, security === 'secure' ? 'success' : 'warning')
    
    // Update network concepts with real-time learning
    updateNetworkConcepts()
  }

  const createEducationalPopup = (x: number, y: number, message: string, type: 'success' | 'warning' | 'info') => {
    const popup = document.createElement('div')
    popup.className = `absolute pointer-events-none z-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-1000 ${
      type === 'success' ? 'bg-green-500/90 text-white' :
      type === 'warning' ? 'bg-yellow-500/90 text-black' :
      'bg-blue-500/90 text-white'
    }`
    popup.style.left = `${x}px`
    popup.style.top = `${y - 40}px`
    popup.textContent = message
    
    const canvas = canvasRef.current
    if (canvas && canvas.parentElement) {
      canvas.parentElement.style.position = 'relative'
      canvas.parentElement.appendChild(popup)
      
      // Animate and remove
      setTimeout(() => {
        popup.style.transform = 'translateY(-20px)'
        popup.style.opacity = '0'
      }, 100)
      
      setTimeout(() => {
        if (popup.parentElement) {
          popup.parentElement.removeChild(popup)
        }
      }, 1100)
    }
  }

  // Enhanced network concepts with real cybersecurity learning
  const updateNetworkConcepts = () => {
    const concepts = []
    
    // Analyze current drawing for educational insights
    const protocols = silkStrokes.map(stroke => stroke.protocol)
    const secureCount = protocols.filter(p => ['HTTPS', 'SSH'].includes(p)).length
    const insecureCount = protocols.filter(p => ['HTTP', 'FTP'].includes(p)).length
    
    if (secureCount > insecureCount) {
      concepts.push('**Excellent Security Posture!** Your network uses mostly encrypted protocols.')
    } else if (insecureCount > 0) {
      concepts.push('**Security Alert!** Unencrypted protocols detected. Consider upgrading to secure alternatives.')
    }
    
    // Mode-specific educational content
    if (drawingMode === 'network') {
      concepts.push('**Network Topology**: Each stroke represents a network connection. Notice how different protocols create different visual patterns.')
      concepts.push('**OSI Model**: Your drawing shows different network layers - application (top), transport (middle), network (bottom).')
    } else if (drawingMode === 'encryption') {
      concepts.push('**Encryption in Transit**: Secure protocols (HTTPS, SSH) create glowing effects to show data protection.')
      concepts.push('**Cryptographic Strength**: The visual intensity represents the strength of encryption algorithms.')
    } else if (drawingMode === 'attacks') {
      concepts.push('**Attack Vectors**: Vulnerable protocols show potential entry points for cybercriminals.')
      concepts.push('**Threat Modeling**: Each insecure connection represents a possible attack path.')
    } else if (drawingMode === 'dataflow') {
      concepts.push('**Data Packet Flow**: Your strokes simulate how data packets travel through network infrastructure.')
      concepts.push('**Bandwidth Visualization**: Thicker strokes represent higher data throughput.')
    }
    
    // Advanced cybersecurity concepts based on stroke patterns
    if (symmetryMode !== 'none') {
      concepts.push('**Network Redundancy**: Symmetric patterns represent failover systems and backup connections.')
    }
    
    if (silkStrokes.length > 10) {
      concepts.push('**Complex Networks**: Large networks require careful security architecture and monitoring.')
    }
    
    setNetworkConcepts(concepts.slice(0, 4)) // Keep most relevant concepts
  }

  // Enhanced interactive threat simulation
  const simulateThreatScenario = useCallback(() => {
    if (drawingMode !== 'attacks') return
    
    // Find vulnerable strokes (HTTP, FTP)
    const vulnerableStrokes = silkStrokes.filter(stroke => 
      ['HTTP', 'FTP'].includes(stroke.protocol)
    )
    
    if (vulnerableStrokes.length > 0) {
      // Simulate attack propagation
      vulnerableStrokes.forEach(stroke => {
        // Create visual "attack" effect
        const attackParticles = Array.from({ length: 5 }, (_, i) => ({
          id: `attack-${stroke.id}-${i}`,
          x: stroke.points[0].x + Math.random() * 50 - 25,
          y: stroke.points[0].y + Math.random() * 50 - 25,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 120,
          maxLife: 120,
          color: '#ff4444',
          size: 3 + Math.random() * 2
        }))
        
        setParticles(prev => [...prev, ...attackParticles])
        
        // Show educational alert
        createEducationalPopup(
          stroke.points[0].x, 
          stroke.points[0].y, 
          '🚨 Attack detected on vulnerable protocol!', 
          'warning'
        )
      })
      
      setScore(prev => prev + 50) // Points for recognizing vulnerability
    }
  }, [drawingMode, silkStrokes])

  // Auto-trigger threat simulation in attack mode
  useEffect(() => {
    if (drawingMode === 'attacks' && silkStrokes.length > 0) {
      const timer = setTimeout(simulateThreatScenario, 2000)
      return () => clearTimeout(timer)
    }
  }, [drawingMode, silkStrokes.length, simulateThreatScenario])

  const getAssessmentQuestions = (mode: DrawingMode): AssessmentQuestion[] => {
    const questions = {
      'network': [
        {
          id: 'topology-basic',
          question: 'Which network topology provides the highest redundancy and fault tolerance?',
          options: ['Bus topology', 'Star topology', 'Mesh topology', 'Ring topology'],
          correct_answer: 2,
          explanation: 'Mesh topology provides multiple paths between devices, so if one connection fails, communication can continue through alternative routes.',
          concept_link: 'Network Topology Foundation'
        },
        {
          id: 'protocol-security',
          question: 'Which protocol should be used for secure web browsing to protect against eavesdropping?',
          options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
          correct_answer: 2,
          explanation: 'HTTPS uses SSL/TLS encryption to protect web traffic from being intercepted and read by attackers.',
          concept_link: 'Communication Protocols'
        }
      ],
      'dataflow': [
        {
          id: 'packet-analysis',
          question: 'What information is typically found in a data packet header?',
          options: ['Only the data payload', 'Source and destination addresses', 'Encryption keys', 'User passwords'],
          correct_answer: 1,
          explanation: 'Packet headers contain routing information including source and destination addresses, but not sensitive data like passwords or encryption keys.',
          concept_link: 'Data Packet Concept'
        }
      ],
      'encryption': [
        {
          id: 'encryption-purpose',
          question: 'What is the primary purpose of encryption in network communications?',
          options: ['Increase data transmission speed', 'Compress data to save space', 'Protect data confidentiality', 'Reduce network latency'],
          correct_answer: 2,
          explanation: 'Encryption\'s main purpose is to protect data confidentiality by making it unreadable to unauthorized parties who might intercept it.',
          concept_link: 'Encryption Fundamentals'
        }
      ],
      'attacks': [
        {
          id: 'attack-vector',
          question: 'Which of the following is considered a common network attack vector?',
          options: ['Strong password policies', 'Regular software updates', 'Unencrypted wireless networks', 'Multi-factor authentication'],
          correct_answer: 2,
          explanation: 'Unencrypted wireless networks allow attackers to easily intercept and view network traffic, making them a significant attack vector.',
          concept_link: 'Attack Vector Analysis'
        }
      ],
      'freeform': [
        {
          id: 'visual-learning',
          question: 'How does visual representation help in understanding cybersecurity concepts?',
          options: ['It makes concepts more abstract', 'It improves pattern recognition and retention', 'It replaces the need for technical knowledge', 'It only helps artistic students'],
          correct_answer: 1,
          explanation: 'Visual representations help students recognize patterns and relationships in complex data, improving both understanding and memory retention.',
          concept_link: 'Visual Learning Enhancement'
        }
      ]
    }
    return questions[mode] || []
  }

  // Drawing functions
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)
    
    // Enhanced protocol selection based on drawing mode and position
    let protocol: 'HTTP' | 'HTTPS' | 'SSH' | 'FTP' | 'SMTP'
    
    // Make protocol selection educational and contextual
    if (drawingMode === 'encryption') {
      // In encryption mode, prioritize secure protocols
      protocol = Math.random() > 0.3 ? 'HTTPS' : 'SSH'
    } else if (drawingMode === 'attacks') {
      // In attack mode, start with vulnerable protocols
      protocol = Math.random() > 0.7 ? 'HTTP' : 'FTP'
    } else if (drawingMode === 'network') {
      // In network mode, use position to determine protocol (simulate network layers)
      const canvasHeight = canvasRef.current?.height || 400
      const layer = pos.y / canvasHeight
      if (layer < 0.3) protocol = 'HTTPS' // Application layer
      else if (layer < 0.6) protocol = 'SSH' // Transport layer  
      else protocol = 'HTTP' // Network layer
    } else {
      protocol = getRandomProtocol()
    }
    
    const security = getSecurityFromProtocol(protocol)
    
    const newStroke: SilkStroke = {
      id: `stroke-${Date.now()}`,
      points: [{ x: pos.x, y: pos.y, pressure: 1 }],
      color: protocolColors[protocol],
      protocol,
      security,
      opacity: 1,
      createdAt: Date.now()
    }
    
    setCurrentStroke(newStroke)
    setIsDrawing(true)
    
    // Enhanced audio feedback for cybersecurity learning
    if (isSoundEnabled) {
      playDrawingSound(protocol)
    }
    
    // Real-time educational feedback
    showProtocolFeedback(protocol, security, pos)
  }, [getMousePos, isSoundEnabled, drawingMode])

  const continueDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return
    
    const pos = getMousePos(e)
    const newPoint = { x: pos.x, y: pos.y, pressure: 1 }
    
    setCurrentStroke(prev => prev ? {
      ...prev,
      points: [...prev.points, newPoint]
    } : null)
    
    // Enhanced particle effects based on security level
    const particleColor = currentStroke.security === 'secure' ? 
      currentStroke.color : '#ff6b6b' // Red particles for insecure protocols
    
    createParticleEffect(pos.x, pos.y, particleColor)
    
    // Interactive cybersecurity learning - detect drawing patterns
    if (currentStroke.points.length > 5) {
      detectCyberSecurityPatterns(currentStroke)
    }
    
    // Dynamic scoring based on security awareness
    if (currentStroke.security === 'secure') {
      setScore(prev => prev + 1) // Reward secure protocol usage
    }
  }, [isDrawing, currentStroke, getMousePos])

  // Pattern recognition for cybersecurity education
  const detectCyberSecurityPatterns = (stroke: SilkStroke) => {
    const points = stroke.points
    if (points.length < 5) return
    
    // Detect circular patterns (representing network loops/redundancy)
    const isCircular = isCircularPattern(points)
    if (isCircular && drawingMode === 'network') {
      createEducationalPopup(
        points[0].x, 
        points[0].y, 
        '🔄 Network redundancy detected! Great for failover protection.',
        'success'
      )
      setScore(prev => prev + 25)
    }
    
    // Detect branching patterns (representing network hierarchies)
    const isBranching = isBranchingPattern(points)
    if (isBranching && drawingMode === 'network') {
      createEducationalPopup(
        points[0].x, 
        points[0].y, 
        '🌳 Hierarchical network structure! Efficient for large organizations.',
        'info'
      )
      setScore(prev => prev + 20)
    }
    
    // Detect zigzag patterns (representing attack paths)
    const isZigzag = isZigzagPattern(points)
    if (isZigzag && drawingMode === 'attacks') {
      createEducationalPopup(
        points[0].x, 
        points[0].y, 
        '⚡ Lateral movement detected! Attackers use this to spread through networks.',
        'warning'
      )
      setScore(prev => prev + 30)
    }
  }

  // Pattern detection algorithms for educational feedback
  const isCircularPattern = (points: { x: number; y: number }[]): boolean => {
    if (points.length < 8) return false
    
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + 
      Math.pow(lastPoint.y - firstPoint.y, 2)
    )
    
    // Check if end point is close to start point and path has curves
    return distance < 50 && hasSignificantCurvature(points)
  }

  const isBranchingPattern = (points: { x: number; y: number }[]): boolean => {
    if (points.length < 6) return false
    
    // Look for significant direction changes indicating branches
    let directionChanges = 0
    for (let i = 2; i < points.length - 2; i++) {
      const angle1 = Math.atan2(points[i].y - points[i-1].y, points[i].x - points[i-1].x)
      const angle2 = Math.atan2(points[i+1].y - points[i].y, points[i+1].x - points[i].x)
      const angleDiff = Math.abs(angle2 - angle1)
      
      if (angleDiff > Math.PI / 3) { // 60 degrees or more
        directionChanges++
      }
    }
    
    return directionChanges >= 2
  }

  const isZigzagPattern = (points: { x: number; y: number }[]): boolean => {
    if (points.length < 6) return false
    
    let alternatingDirection = 0
    for (let i = 2; i < points.length - 1; i++) {
      const dx1 = points[i].x - points[i-1].x
      const dx2 = points[i+1].x - points[i].x
      
      if ((dx1 > 0 && dx2 < 0) || (dx1 < 0 && dx2 > 0)) {
        alternatingDirection++
      }
    }
    
    return alternatingDirection >= 3
  }

  const hasSignificantCurvature = (points: { x: number; y: number }[]): boolean => {
    let totalAngleChange = 0
    for (let i = 1; i < points.length - 1; i++) {
      const angle1 = Math.atan2(points[i].y - points[i-1].y, points[i].x - points[i-1].x)
      const angle2 = Math.atan2(points[i+1].y - points[i].y, points[i+1].x - points[i].x)
      totalAngleChange += Math.abs(angle2 - angle1)
    }
    
    return totalAngleChange > Math.PI // More than 180 degrees total curvature
  }

  const stopDrawing = useCallback(() => {
    if (currentStroke && currentStroke.points.length > 1) {
      const finalStroke = { ...currentStroke }
      const symmetricStrokes = applySymmetry(finalStroke)
      
      setSilkStrokes(prev => [...prev, ...symmetricStrokes])
      
      // Enhanced educational feedback on stroke completion
      provideStrokeCompletionFeedback(finalStroke)
      
      // Update learning progress based on stroke characteristics
      updateLearningProgress(finalStroke)
      
      setScore(prev => prev + symmetricStrokes.length * 10)
      
      if (finalStroke.security === 'encrypted') {
        setScore(prev => prev + 50)
      }
    }
    
    setCurrentStroke(null)
    setIsDrawing(false)
  }, [currentStroke, symmetryMode])

  const provideStrokeCompletionFeedback = (stroke: SilkStroke) => {
    const strokeLength = calculateStrokeLength(stroke.points)
    const complexity = stroke.points.length
    
    let feedback = ''
    let feedbackType: 'success' | 'warning' | 'info' = 'info'
    
    if (stroke.security === 'encrypted' && strokeLength > 100) {
      feedback = '🔐 Excellent! Long secure connection established.'
      feedbackType = 'success'
      markObjectiveProgress('encryption-concepts')
    } else if (stroke.security === 'unsecure') {
      feedback = '⚠️ Insecure protocol used. Consider HTTPS or SSH.'
      feedbackType = 'warning'
      markObjectiveProgress('protocol-identification')
    } else if (complexity > 20) {
      feedback = '🎨 Complex network path created! Great for redundancy.'
      feedbackType = 'success'
      markObjectiveProgress('network-topology-basics')
    }
    
    if (feedback) {
      const centerPoint = stroke.points[Math.floor(stroke.points.length / 2)]
      createEducationalPopup(centerPoint.x, centerPoint.y, feedback, feedbackType)
    }
  }

  const calculateStrokeLength = (points: { x: number; y: number }[]): number => {
    let length = 0
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i-1].x
      const dy = points[i].y - points[i-1].y
      length += Math.sqrt(dx * dx + dy * dy)
    }
    return length
  }

  const markObjectiveProgress = (objectiveId: string) => {
    setLearningObjectives(prev => 
      prev.map(obj => {
        if (obj.id === objectiveId && !obj.completed) {
          // Check if prerequisites are met
          const prerequisitesMet = obj.prerequisite?.every(prereqId => 
            prev.find(p => p.id === prereqId)?.completed
          ) ?? true
          
          if (prerequisitesMet) {
            return { ...obj, completed: true }
          }
        }
        return obj
      })
    )
  }

  const updateLearningProgress = (stroke: SilkStroke) => {
    setStudentProgress(prev => {
      const sessionTime = prev.learning_session_time + 1
      const newStreak = stroke.security === 'secure' ? 
        prev.current_streak + 1 : 
        Math.max(0, prev.current_streak - 1)
      
      return {
        ...prev,
        current_streak: newStreak,
        learning_session_time: sessionTime
      }
    })
    
    // Achievement unlocks based on streaks
    if (studentProgress.current_streak >= 5) {
      createEducationalPopup(
        400, 300, 
        '🏆 Security Streak! 5 secure protocols in a row!', 
        'success'
      )
      setScore(prev => prev + 100)
    }
  }

  const getRandomProtocol = (): 'HTTP' | 'HTTPS' | 'SSH' | 'FTP' | 'SMTP' => {
    const protocols: Array<'HTTP' | 'HTTPS' | 'SSH' | 'FTP' | 'SMTP'> = ['HTTP', 'HTTPS', 'SSH', 'FTP', 'SMTP']
    
    if (drawingMode === 'network' || drawingMode === 'encryption') {
      const secureProtocols = ['HTTPS', 'SSH', 'HTTPS', 'SSH']
      return secureProtocols[Math.floor(Math.random() * secureProtocols.length)] as any
    }
    
    return protocols[Math.floor(Math.random() * protocols.length)]
  }

  const getSecurityFromProtocol = (protocol: string): 'secure' | 'unsecure' | 'encrypted' => {
    switch (protocol) {
      case 'HTTPS':
      case 'SSH':
        return 'encrypted'
      case 'HTTP':
      case 'FTP':
        return 'unsecure'
      default:
        return 'secure'
    }
  }

  const applySymmetry = (baseStroke: SilkStroke): SilkStroke[] => {
    const strokes = [baseStroke]
    const canvas = canvasRef.current
    if (!canvas) return strokes
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    switch (symmetryMode) {
      case 'bilateral':
        strokes.push({
          ...baseStroke,
          id: `${baseStroke.id}-mirror`,
          points: baseStroke.points.map(p => ({
            ...p,
            x: centerX * 2 - p.x
          }))
        })
        break
        
      case 'radial4':
      case 'radial6':
      case 'radial8':
        const divisions = symmetryMode === 'radial4' ? 4 : symmetryMode === 'radial6' ? 6 : 8
        for (let i = 1; i < divisions; i++) {
          const angle = (Math.PI * 2 * i) / divisions
          strokes.push({
            ...baseStroke,
            id: `${baseStroke.id}-radial-${i}`,
            points: baseStroke.points.map(p => {
              const dx = p.x - centerX
              const dy = p.y - centerY
              const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle)
              const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle)
              return {
                ...p,
                x: rotatedX + centerX,
                y: rotatedY + centerY
              }
            })
          })
        }
        break
    }
    
    return strokes
  }

  const createParticleEffect = (x: number, y: number, color: string) => {
    const newParticles: ParticleEffect[] = []
    
    for (let i = 0; i < 3; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 60,
        maxLife: 60,
        color,
        size: Math.random() * 3 + 1
      })
    }
    
    setParticles(prev => [...prev, ...newParticles])
  }

  const playDrawingSound = (protocol: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      const frequencies = {
        'HTTP': 220,
        'HTTPS': 440,
        'SSH': 330,
        'FTP': 277,
        'SMTP': 369
      }
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequencies[protocol as keyof typeof frequencies] || 220
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      // Silently fail if audio context not available
    }
  }

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // Clear canvas with slight fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw all silk strokes
    silkStrokes.forEach(stroke => {
      if (stroke.points.length < 2) return
      
      ctx.save()
      ctx.globalAlpha = stroke.opacity
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      if (stroke.security === 'encrypted') {
        ctx.shadowColor = stroke.color
        ctx.shadowBlur = 15
      }
      
      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      
      for (let i = 1; i < stroke.points.length; i++) {
        const current = stroke.points[i]
        const previous = stroke.points[i - 1]
        const cpx = (previous.x + current.x) / 2
        const cpy = (previous.y + current.y) / 2
        ctx.quadraticCurveTo(previous.x, previous.y, cpx, cpy)
      }
      
      ctx.stroke()
      ctx.restore()
    })
    
    // Draw current stroke
    if (currentStroke && currentStroke.points.length > 1) {
      ctx.save()
      ctx.strokeStyle = currentStroke.color
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = currentStroke.color
      ctx.shadowBlur = 10
      
      ctx.beginPath()
      ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y)
      
      for (let i = 1; i < currentStroke.points.length; i++) {
        const current = currentStroke.points[i]
        const previous = currentStroke.points[i - 1]
        const cpx = (previous.x + current.x) / 2
        const cpy = (previous.y + current.y) / 2
        ctx.quadraticCurveTo(previous.x, previous.y, cpx, cpy)
      }
      
      ctx.stroke()
      ctx.restore()
    }
    
    // Draw particles
    particles.forEach(particle => {
      ctx.save()
      const alpha = particle.life / particle.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }, [silkStrokes, currentStroke, particles])

  // Particle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0)
      )
    }, 16)
    
    return () => clearInterval(interval)
  }, [])

  // Stroke fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSilkStrokes(prev => prev.map(stroke => ({
        ...stroke,
        opacity: Math.max(0.1, stroke.opacity - 0.002)
      })).filter(stroke => stroke.opacity > 0.05))
    }, 100)
    
    return () => clearInterval(interval)
  }, [])

  const clearCanvas = () => {
    setSilkStrokes([])
    setParticles([])
    setCurrentStroke(null)
    setIsDrawing(false)
  }

  const startTutorial = () => {
    setShowTutorial(true)
    setTutorialStep(0)
    setLearningMode('tutorial')
  }

  const nextTutorialStep = () => {
    setTutorialStep(prev => prev + 1)
  }

  const completeTutorial = () => {
    setShowTutorial(false)
    setLearningMode('creative')
    markObjectiveComplete('network-topology-basics')
  }

  const startAssessment = () => {
    const questions = getAssessmentQuestions(drawingMode)
    if (questions.length > 0) {
      setCurrentQuestion(questions[0])
      setShowAssessment(true)
      setLearningMode('assessment')
    }
  }

  const answerQuestion = (selectedAnswer: number) => {
    if (!currentQuestion) return
    
    const isCorrect = selectedAnswer === currentQuestion.correct_answer
    if (isCorrect) {
      setScore(prev => prev + 100)
      setStudentProgress(prev => ({
        ...prev,
        current_streak: prev.current_streak + 1
      }))
    } else {
      setStudentProgress(prev => ({
        ...prev,
        current_streak: 0
      }))
    }
    
    // Show explanation briefly before moving to next question or closing
    setTimeout(() => {
      setShowAssessment(false)
      setCurrentQuestion(null)
      setLearningMode('creative')
      
      if (isCorrect) {
        markRelatedObjectiveComplete()
      }
    }, 3000)
  }

  const markObjectiveComplete = (objectiveId: string) => {
    setLearningObjectives(prev => 
      prev.map(obj => 
        obj.id === objectiveId 
          ? { ...obj, completed: true }
          : obj
      )
    )
    
    setStudentProgress(prev => ({
      ...prev,
      concepts_mastered: prev.concepts_mastered + 1
    }))
  }

  const markRelatedObjectiveComplete = () => {
    const modeObjectiveMap = {
      'network': 'protocol-identification',
      'dataflow': 'data-flow-visualization', 
      'encryption': 'encryption-concepts',
      'attacks': 'attack-pattern-recognition',
      'freeform': 'network-topology-basics'
    }
    
    const objectiveId = modeObjectiveMap[drawingMode]
    if (objectiveId) {
      markObjectiveComplete(objectiveId)
    }
  }

  const startScenarioMode = () => {
    setLearningMode('scenario')
    if (currentScenario) {
      setSilkStrokes([]) // Clear canvas for scenario
    }
  }

  const completeScenario = () => {
    if (currentScenario) {
      setScore(prev => prev + 200)
      markObjectiveComplete('threat-modeling-stride')
      setLearningMode('creative')
    }
  }

  const resetSimulation = () => {
    setSilkStrokes([])
    setParticles([])
    setScore(0)
    setCurrentStroke(null)
    setIsDrawing(false)
  }

  const getModeDescription = (mode: DrawingMode) => {
    const descriptions = {
      'network': 'Draw network topologies and connections. Each stroke represents a network link with different protocols.',
      'dataflow': 'Visualize data flowing through networks. Create patterns that show how information moves.',
      'encryption': 'Explore encryption patterns. Secure protocols glow with special effects.',
      'attacks': 'Simulate attack patterns and learn how threats spread through networks.',
      'freeform': 'Creative expression mode. Draw beautiful patterns while learning about network concepts.'
    }
    return descriptions[mode]
  }

  // Interactive cybersecurity mini-challenges
  const startInteractiveChallenge = () => {
    const challenges = {
      'network': {
        title: '🌐 Network Security Challenge',
        instruction: 'Draw a secure network topology connecting 3 devices. Use only HTTPS and SSH.',
        target: 'Create 3 secure connections',
        validator: () => {
          const secureConnections = silkStrokes.filter(s => ['HTTPS', 'SSH'].includes(s.protocol))
          return secureConnections.length >= 3
        }
      },
      'encryption': {
        title: '🔐 Encryption Mastery',
        instruction: 'Create an encrypted data flow. Draw smooth, continuous paths using only secure protocols.',
        target: 'Achieve 100% encrypted communications',
        validator: () => {
          const totalStrokes = silkStrokes.length
          const encryptedStrokes = silkStrokes.filter(s => s.security === 'encrypted').length
          return totalStrokes > 0 && encryptedStrokes === totalStrokes
        }
      },
      'attacks': {
        title: '⚔️ Threat Simulation',
        instruction: 'Demonstrate how attacks spread through vulnerable protocols. Start with HTTP.',
        target: 'Show attack propagation paths',
        validator: () => {
          const vulnerableStrokes = silkStrokes.filter(s => s.protocol === 'HTTP')
          return vulnerableStrokes.length >= 2
        }
      },
      'dataflow': {
        title: '📊 Data Flow Optimization',
        instruction: 'Design efficient data paths. Create branching patterns for load distribution.',
        target: 'Create 2+ branching patterns',
        validator: () => {
          let branchingPatterns = 0
          silkStrokes.forEach(stroke => {
            if (isBranchingPattern(stroke.points)) branchingPatterns++
          })
          return branchingPatterns >= 2
        }
      },
      'freeform': {
        title: '🎨 Creative Security Art',
        instruction: 'Express network security concepts through art. Combine multiple protocol types.',
        target: 'Use all 5 protocol types',
        validator: () => {
          const protocols = new Set(silkStrokes.map(s => s.protocol))
          return protocols.size >= 5
        }
      }
    }
    
    const challenge = challenges[drawingMode]
    if (challenge) {
      createEducationalPopup(400, 100, `${challenge.title}: ${challenge.instruction}`, 'info')
      setCurrentChallenge(challenge)
    }
  }

  // State for interactive challenges
  const [currentChallenge, setCurrentChallenge] = useState<any>(null)

  // Check challenge completion
  useEffect(() => {
    if (currentChallenge && currentChallenge.validator()) {
      createEducationalPopup(400, 200, `🏆 Challenge Complete! ${currentChallenge.target}`, 'success')
      setScore(prev => prev + 250)
      setCurrentChallenge(null)
      
      // Mark advanced objectives as complete
      markObjectiveProgress('security-architecture')
    }
  }, [silkStrokes, currentChallenge])

  // Real-time cybersecurity insights panel
  const getCyberSecurityInsights = () => {
    const insights = []
    const protocolCount = silkStrokes.reduce((acc, stroke) => {
      acc[stroke.protocol] = (acc[stroke.protocol] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const totalStrokes = silkStrokes.length
    const secureStrokes = silkStrokes.filter(s => s.security === 'secure').length
    const encryptedStrokes = silkStrokes.filter(s => s.security === 'encrypted').length
    
    if (totalStrokes === 0) {
      insights.push('🎨 Start drawing to see cybersecurity insights!')
      return insights
    }
    
    const securityScore = Math.round((secureStrokes / totalStrokes) * 100)
    insights.push(`🛡️ Security Score: ${securityScore}%`)
    
    if (encryptedStrokes > 0) {
      const encryptionRate = Math.round((encryptedStrokes / totalStrokes) * 100)
      insights.push(`🔐 Encryption Rate: ${encryptionRate}%`)
    }
    
    // Protocol distribution analysis
    const mostUsed = Object.entries(protocolCount).sort(([,a], [,b]) => b - a)[0]
    if (mostUsed) {
      insights.push(`📊 Most Used: ${mostUsed[0]} (${mostUsed[1]} connections)`)
    }
    
    // Security recommendations
    if (protocolCount['HTTP'] > 0) {
      insights.push('⚠️ Recommendation: Upgrade HTTP to HTTPS for security')
    }
    
    if (protocolCount['FTP'] > 0) {
      insights.push('💡 Tip: Consider SFTP instead of FTP for file transfers')
    }
    
    // Network topology insights
    if (totalStrokes > 5) {
      insights.push('🌐 Complex network detected - consider segmentation')
    }
    
    return insights.slice(0, 4) // Show top 4 insights
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Header with Learning Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CyberFlow Silk - Educational Network Art
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-4">
            Create flowing network art while mastering cybersecurity concepts through structured learning and creative expression.
          </p>
          
          {/* Learning Mode Selector */}
          <div className="flex justify-center gap-2 mb-4">
            {(['creative', 'tutorial', 'scenario', 'assessment'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setLearningMode(mode)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  learningMode === mode
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {mode === 'tutorial' ? '📚 Tutorial' :
                 mode === 'scenario' ? '🎯 Scenarios' :
                 mode === 'assessment' ? '✅ Assessment' :
                 '🎨 Creative'}
              </button>
            ))}
          </div>
          
          {/* Difficulty Level Selector */}
          <div className="flex justify-center gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setCurrentDifficulty(level)}
                className={`px-3 py-1 rounded-lg text-sm transition-all capitalize ${
                  currentDifficulty === level
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Learning Progress Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 mb-6 backdrop-blur-sm border border-purple-400/30"
        >
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{studentProgress.concepts_mastered}</div>
              <div className="text-xs text-gray-400">Concepts Mastered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{studentProgress.current_streak}</div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((studentProgress.concepts_mastered / studentProgress.total_concepts) * 100)}%
              </div>
              <div className="text-xs text-gray-400">Course Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{currentDifficulty}</div>
              <div className="text-xs text-gray-400">Difficulty Level</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(studentProgress.concepts_mastered / studentProgress.total_concepts) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Main Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-6"
        >
          {/* Drawing Mode Selector */}
          <div className="flex gap-2">
            {(['network', 'dataflow', 'encryption', 'attacks', 'freeform'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDrawingMode(mode)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  drawingMode === mode
                    ? 'bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/25'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Symmetry Controls */}
          <div className="flex gap-2">
            {(['none', 'bilateral', 'radial4', 'radial6', 'radial8'] as const).map((symmetry) => (
              <button
                key={symmetry}
                onClick={() => setSymmetryMode(symmetry)}
                className={`px-3 py-2 rounded-lg transition-all text-sm ${
                  symmetryMode === symmetry
                    ? 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/25'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {symmetry === 'none' ? 'No Symmetry' : 
                 symmetry === 'bilateral' ? 'Mirror' :
                 symmetry.replace('radial', '') + '× Radial'}
              </button>
            ))}
          </div>

          {/* Utility Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`px-3 py-2 rounded-lg transition-all ${
                isSoundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              🔊 {isSoundEnabled ? 'On' : 'Off'}
            </button>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              Clear Canvas
            </button>
            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <RotateCcw size={16} />
              Reset All
            </button>
          </div>
        </motion.div>

        {/* Interactive Challenge Panel */}
        {currentChallenge && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-yellow-300">{currentChallenge.title}</h3>
                <p className="text-yellow-200 text-sm">{currentChallenge.instruction}</p>
                <div className="text-orange-300 text-sm mt-1">
                  🎯 Target: {currentChallenge.target}
                </div>
              </div>
              <button
                onClick={() => setCurrentChallenge(null)}
                className="text-yellow-400 hover:text-yellow-300 text-2xl"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Cybersecurity Insights Panel */}
        {silkStrokes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 rounded-lg p-4 mb-4 backdrop-blur-sm border border-blue-400/30"
          >
            <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
              🧠 Real-Time Cybersecurity Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getCyberSecurityInsights().map((insight, index) => (
                <div key={index} className="text-sm text-blue-200 bg-blue-500/10 rounded-lg p-2">
                  {insight}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhanced Mode Description with Challenge Starter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`${drawingMode}-${learningMode}`}
          className="text-center mb-4 p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-cyan-400/30"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <h3 className="text-lg font-bold text-white">
              {learningMode === 'tutorial' ? '📚 Interactive Tutorial Mode' :
               learningMode === 'scenario' ? '🎯 Security Scenario Challenge' :
               learningMode === 'assessment' ? '✅ Knowledge Assessment' :
               '🎨 Creative Learning Mode'}
            </h3>
            {!currentChallenge && learningMode === 'creative' && (
              <button
                onClick={startInteractiveChallenge}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                🚀 Start Challenge
              </button>
            )}
          </div>
          <p className="text-sm text-gray-300">{getModeDescription(drawingMode)}</p>
          
          {learningMode === 'scenario' && currentScenario && (
            <div className="mt-3 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
              <h4 className="text-red-300 font-bold mb-1">{currentScenario.title}</h4>
              <p className="text-red-200 text-sm mb-2">{currentScenario.description}</p>
              <p className="text-yellow-300 text-sm">
                <strong>Challenge:</strong> {currentScenario.challenge}
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
        >
          <div className="bg-black/30 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-xl font-bold text-cyan-400">{silkStrokes.length}</div>
            <div className="text-xs text-gray-400">Silk Strokes</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-xl font-bold text-purple-400">{score}</div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-xl font-bold text-green-400">{symmetryMode}</div>
            <div className="text-xs text-gray-400">Symmetry</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-xl font-bold text-pink-400">{particles.length}</div>
            <div className="text-xs text-gray-400">Particles</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-xl font-bold text-yellow-400">{drawingMode}</div>
            <div className="text-xs text-gray-400">Mode</div>
          </div>
        </motion.div>

        {/* Main Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 rounded-xl p-4 mb-6 backdrop-blur-sm relative"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-96 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg cursor-crosshair border border-white/10"
            onMouseDown={startDrawing}
            onMouseMove={continueDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          
          {/* Enhanced Drawing Instructions Overlay */}
          {silkStrokes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center text-white/80 bg-black/40 rounded-lg p-6 border border-white/20">
                <div className="text-3xl mb-3">
                  {drawingMode === 'network' ? '🌐' :
                   drawingMode === 'encryption' ? '🔐' :
                   drawingMode === 'attacks' ? '⚔️' :
                   drawingMode === 'dataflow' ? '📊' : '🎨'}
                </div>
                <div className="text-xl font-bold mb-2">
                  {drawingMode === 'network' ? 'Design Your Network' :
                   drawingMode === 'encryption' ? 'Secure Your Data' :
                   drawingMode === 'attacks' ? 'Simulate Threats' :
                   drawingMode === 'dataflow' ? 'Optimize Data Flow' : 'Create Security Art'}
                </div>
                <div className="text-sm text-white/70 max-w-md">
                  {drawingMode === 'network' ? 'Draw network connections. Green lines = secure protocols, Red lines = vulnerable protocols.' :
                   drawingMode === 'encryption' ? 'Create encrypted pathways. Secure protocols will glow with protective energy.' :
                   drawingMode === 'attacks' ? 'Show how attacks spread. Vulnerable protocols will trigger threat simulations.' :
                   drawingMode === 'dataflow' ? 'Design data highways. Branching patterns represent load balancing.' :
                   'Express cybersecurity concepts through beautiful, flowing art patterns.'}
                </div>
                <div className="mt-3 text-cyan-400 text-sm animate-pulse">
                  🖱️ Click and drag anywhere to start
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Educational Content with Learning Objectives */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Learning Objectives Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-emerald-400/30"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye />
              Learning Objectives - {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {learningObjectives
                .filter(obj => obj.difficulty === currentDifficulty)
                .map((objective, index) => (
                <motion.div
                  key={objective.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border-l-4 ${
                    objective.completed 
                      ? 'bg-emerald-500/20 border-emerald-400'
                      : 'bg-slate-700/50 border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white text-sm">{objective.title}</h4>
                    {objective.completed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-slate-400 rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{objective.description}</p>
                  
                  {objective.prerequisite && objective.prerequisite.length > 0 && (
                    <div className="mt-2 text-xs text-blue-300">
                      <strong>Prerequisites:</strong> {objective.prerequisite.join(', ')}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={startTutorial}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 text-blue-300 px-3 py-2 rounded text-sm"
              >
                📚 Start Tutorial
              </button>
              <button
                onClick={startAssessment}
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 text-green-300 px-3 py-2 rounded text-sm"
              >
                ✅ Take Quiz
              </button>
            </div>
          </motion.div>

          {/* Enhanced Network Concepts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-cyan-400/30"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye />
              Concept Deep Dive: {drawingMode.charAt(0).toUpperCase() + drawingMode.slice(1)}
            </h3>
            
            <div className="space-y-3">
              {networkConcepts.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border-l-4 border-cyan-400"
                >
                  <div 
                    className="text-sm text-gray-300"
                    dangerouslySetInnerHTML={{ 
                      __html: concept.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {learningMode === 'scenario' && currentScenario && (
              <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
                <h4 className="text-yellow-300 font-bold mb-2">Real-World Context:</h4>
                <p className="text-yellow-200 text-sm mb-2">{currentScenario.real_world_example}</p>
                <p className="text-green-300 text-sm">
                  <strong>Learning Outcome:</strong> {currentScenario.learning_outcome}
                </p>
              </div>
            )}
          </motion.div>

          {/* Protocol Guide with Security Framework Integration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-purple-400/30"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield />
              Security Framework: STRIDE Analysis
            </h3>
            
            <div className="grid grid-cols-1 gap-3 mb-4">
              {Object.entries(protocolColors).map(([protocol, color]) => (
                <div key={protocol} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{protocol}</div>
                    <div className="text-xs text-gray-400">
                      {protocol === 'HTTP' && 'Vulnerable to spoofing and information disclosure'}
                      {protocol === 'HTTPS' && 'Protects against tampering and eavesdropping'}
                      {protocol === 'SSH' && 'Prevents elevation of privilege attacks'}
                      {protocol === 'FTP' && 'Susceptible to denial of service attacks'}
                      {protocol === 'SMTP' && 'Can be exploited for repudiation attacks'}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    ['HTTPS', 'SSH'].includes(protocol) 
                      ? 'bg-green-500/20 text-green-400' 
                      : protocol === 'HTTP' 
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {['HTTPS', 'SSH'].includes(protocol) ? 'Secure' : 
                     protocol === 'HTTP' ? 'Vulnerable' : 'Mixed'}
                  </div>
                </div>
              ))}
            </div>

            {/* STRIDE Framework Quick Reference */}
            <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3">
              <div className="text-purple-300 font-bold mb-2">🛡️ STRIDE Threat Model:</div>
              <div className="text-xs text-purple-200 space-y-1">
                <div><strong>S</strong>poofing - Identity falsification</div>
                <div><strong>T</strong>ampering - Data modification</div>
                <div><strong>R</strong>epudiation - Action denial</div>
                <div><strong>I</strong>nformation Disclosure - Data exposure</div>
                <div><strong>D</strong>enial of Service - Availability attacks</div>
                <div><strong>E</strong>levation of Privilege - Unauthorized access</div>
              </div>
            </div>

            {learningMode === 'scenario' && (
              <button
                onClick={completeScenario}
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-bold"
              >
                🎯 Complete Scenario (+200 pts)
              </button>
            )}
          </motion.div>
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-8 max-w-2xl mx-4 border border-blue-400/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                📚 Interactive Tutorial - Step {tutorialStep + 1}
              </h2>
              
              {tutorialStep === 0 && (
                <div>
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Welcome to CyberFlow Silk!</h3>
                  <p className="text-white/90 mb-4">
                    This tutorial will teach you how to visualize network security concepts through artistic creation. 
                    You'll learn to identify protocols, understand security implications, and apply cybersecurity frameworks.
                  </p>
                  <div className="bg-blue-500/20 rounded-lg p-3 mb-4">
                    <strong className="text-blue-300">Learning Objective:</strong>
                    <p className="text-blue-200 text-sm">Understand network topology fundamentals and protocol security implications</p>
                  </div>
                </div>
              )}
              
              {tutorialStep === 1 && (
                <div>
                  <h3 className="text-lg font-bold text-green-300 mb-2">Drawing Network Connections</h3>
                  <p className="text-white/90 mb-4">
                    Each stroke you draw represents a network connection using different protocols. 
                    Watch how colors indicate security levels:
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-green-500/20 rounded p-2">
                      <div className="text-green-300 font-bold">🟢 Secure Protocols</div>
                      <div className="text-green-200 text-sm">HTTPS, SSH - Encrypted</div>
                    </div>
                    <div className="bg-red-500/20 rounded p-2">
                      <div className="text-red-300 font-bold">🔴 Unsecure Protocols</div>
                      <div className="text-red-200 text-sm">HTTP, FTP - Plaintext</div>
                    </div>
                  </div>
                </div>
              )}
              
              {tutorialStep === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">STRIDE Threat Modeling</h3>
                  <p className="text-white/90 mb-4">
                    As you draw, consider the STRIDE framework for identifying security threats:
                  </p>
                  <div className="bg-purple-500/20 rounded-lg p-3 mb-4 text-sm">
                    <div className="grid grid-cols-2 gap-2 text-purple-200">
                      <div>🎭 <strong>S</strong>poofing - False identity</div>
                      <div>⚡ <strong>T</strong>ampering - Data modification</div>
                      <div>❌ <strong>R</strong>epudiation - Denying actions</div>
                      <div>👁️ <strong>I</strong>nfo Disclosure - Data leaks</div>
                      <div>🚫 <strong>D</strong>oS - Service disruption</div>
                      <div>⬆️ <strong>E</strong>levation - Privilege abuse</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={tutorialStep < 2 ? nextTutorialStep : completeTutorial}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded font-bold"
                >
                  {tutorialStep < 2 ? 'Next Step' : 'Start Learning!'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Assessment Overlay */}
        {showAssessment && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl p-8 max-w-2xl mx-4 border border-green-400/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                ✅ Knowledge Assessment
              </h2>
              
              <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-green-300 mb-3">{currentQuestion.question}</h3>
                
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => answerQuestion(index)}
                      className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded border border-green-400/30 transition-all text-white"
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-500/20 rounded-lg p-3">
                <div className="text-blue-300 font-bold mb-1">Related Concept:</div>
                <div className="text-blue-200 text-sm">{currentQuestion.concept_link}</div>
              </div>
              
              <button
                onClick={() => setShowAssessment(false)}
                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Close Assessment
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CyberSilkGame
