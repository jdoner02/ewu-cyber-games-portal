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

  // Protocol colors for educational visualization
  const protocolColors = {
    'HTTP': '#ef4444',     // Red - unsecure
    'HTTPS': '#10b981',    // Green - secure
    'SSH': '#3b82f6',      // Blue - secure terminal
    'FTP': '#f59e0b',      // Orange - file transfer
    'SMTP': '#8b5cf6'      // Purple - email
  }

  // Initialize educational content
  useEffect(() => {
    updateNetworkConcepts()
  }, [drawingMode])

  const updateNetworkConcepts = () => {
    const concepts = {
      'network': [
        'Network Topology: The arrangement of interconnected devices',
        'Router: Central hub that directs data between devices',
        'Protocol: Rules for how data is transmitted (HTTP, HTTPS, SSH)',
        'Security: Different protocols offer varying levels of protection'
      ],
      'dataflow': [
        'Data Packets: Small chunks of information sent across networks',
        'Bandwidth: The capacity of a network connection',
        'Latency: The time it takes for data to travel from source to destination',
        'Traffic Analysis: Monitoring data flow to detect anomalies'
      ],
      'encryption': [
        'Encryption: Converting data into unreadable code for security',
        'SSL/TLS: Protocols that encrypt web traffic (HTTPS)',
        'Key Exchange: How devices securely share encryption keys',
        'Cipher Strength: Different encryption methods offer varying protection'
      ],
      'attacks': [
        'Attack Vectors: Ways malicious actors can compromise networks',
        'Malware Propagation: How malicious software spreads through networks',
        'DDoS: Overwhelming a system with excessive traffic',
        'Man-in-the-Middle: Intercepting communications between devices'
      ],
      'freeform': [
        'Creative Expression: Art as a medium for understanding complex systems',
        'Pattern Recognition: Identifying structures in network behavior',
        'Visualization: Making abstract concepts tangible through art',
        'Synesthesia: Connecting visual, auditory, and conceptual learning'
      ]
    }
    setNetworkConcepts(concepts[drawingMode] || [])
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
    const protocol = getRandomProtocol()
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
    
    if (isSoundEnabled) {
      playDrawingSound(protocol)
    }
  }, [getMousePos, isSoundEnabled])

  const continueDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return
    
    const pos = getMousePos(e)
    const newPoint = { x: pos.x, y: pos.y, pressure: 1 }
    
    setCurrentStroke(prev => prev ? {
      ...prev,
      points: [...prev.points, newPoint]
    } : null)
    
    createParticleEffect(pos.x, pos.y, currentStroke.color)
  }, [isDrawing, currentStroke, getMousePos])

  const stopDrawing = useCallback(() => {
    if (currentStroke && currentStroke.points.length > 1) {
      const finalStroke = { ...currentStroke }
      const symmetricStrokes = applySymmetry(finalStroke)
      
      setSilkStrokes(prev => [...prev, ...symmetricStrokes])
      setScore(prev => prev + symmetricStrokes.length * 10)
      
      if (finalStroke.security === 'encrypted') {
        setScore(prev => prev + 50)
      }
    }
    
    setCurrentStroke(null)
    setIsDrawing(false)
  }, [currentStroke, symmetryMode])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CyberFlow Silk
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Create flowing network art while learning cybersecurity concepts. 
            Draw with silk-like strokes that represent data flows, protocols, and security patterns.
          </p>
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

        {/* Mode Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={drawingMode}
          className="text-center mb-4 p-3 bg-black/20 rounded-lg backdrop-blur-sm"
        >
          <p className="text-sm text-gray-300">{getModeDescription(drawingMode)}</p>
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
          
          {/* Drawing Instructions Overlay */}
          {silkStrokes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center text-white/60">
                <div className="text-2xl mb-2">✨</div>
                <div className="text-lg font-medium">Start Drawing</div>
                <div className="text-sm">Click and drag to create flowing network patterns</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Educational Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Network Concepts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 rounded-lg p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye />
              Learning: {drawingMode.charAt(0).toUpperCase() + drawingMode.slice(1)} Mode
            </h3>
            
            <div className="space-y-3">
              {networkConcepts.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white/5 rounded-lg border-l-4 border-cyan-400"
                >
                  <p className="text-sm text-gray-300">{concept}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Protocol Guide */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 rounded-lg p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield />
              Protocol Colors & Security
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(protocolColors).map(([protocol, color]) => (
                <div key={protocol} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{protocol}</div>
                    <div className="text-xs text-gray-400">
                      {protocol === 'HTTP' && 'Unsecure web traffic - visible to attackers'}
                      {protocol === 'HTTPS' && 'Secure web traffic - encrypted connection'}
                      {protocol === 'SSH' && 'Secure shell - encrypted terminal access'}
                      {protocol === 'FTP' && 'File transfer - often unsecured'}
                      {protocol === 'SMTP' && 'Email protocol - can be encrypted'}
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
                     protocol === 'HTTP' ? 'Unsecure' : 'Mixed'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <CheckCircle size={16} />
                <strong>Pro Tip:</strong>
              </div>
              <p className="text-xs text-blue-200">
                Secure protocols (HTTPS, SSH) create glowing effects and earn bonus points. 
                Try different symmetry modes to see how network patterns can represent different topologies!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CyberSilkGame
