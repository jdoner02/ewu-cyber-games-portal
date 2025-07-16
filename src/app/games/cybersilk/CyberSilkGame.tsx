'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, Shield, Zap, Eye, AlertTriangle, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react'

interface NetworkNode {
  id: string
  x: number
  y: number
  type: 'device' | 'router' | 'server' | 'suspicious'
  connections: string[]
  data: number
  security: 'secure' | 'vulnerable' | 'compromised'
  isActive: boolean
}

interface DataPacket {
  id: string
  from: string
  to: string
  progress: number
  type: 'normal' | 'malicious' | 'encrypted'
  size: number
}

export default function CyberSilkGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [packets, setPackets] = useState<DataPacket[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [detectedThreats, setDetectedThreats] = useState(0)
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [gameMode, setGameMode] = useState<'visualization' | 'security' | 'analysis'>('visualization')
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Initialize network nodes
  useEffect(() => {
    const initialNodes: NetworkNode[] = [
      {
        id: 'router-1',
        x: 400,
        y: 300,
        type: 'router',
        connections: ['device-1', 'device-2', 'server-1'],
        data: 0,
        security: 'secure',
        isActive: true
      },
      {
        id: 'device-1',
        x: 200,
        y: 200,
        type: 'device',
        connections: ['router-1'],
        data: 0,
        security: 'secure',
        isActive: true
      },
      {
        id: 'device-2',
        x: 200,
        y: 400,
        type: 'device',
        connections: ['router-1'],
        data: 0,
        security: 'vulnerable',
        isActive: true
      },
      {
        id: 'server-1',
        x: 600,
        y: 300,
        type: 'server',
        connections: ['router-1'],
        data: 0,
        security: 'secure',
        isActive: true
      },
      {
        id: 'suspicious-1',
        x: 500,
        y: 150,
        type: 'suspicious',
        connections: ['router-1'],
        data: 0,
        security: 'compromised',
        isActive: false
      }
    ]
    setNodes(initialNodes)
  }, [])

  // Animation loop
  useEffect(() => {
    let animationFrame: number
    
    if (isRunning) {
      const animate = () => {
        setPackets(prev => {
          return prev.map(packet => ({
            ...packet,
            progress: Math.min(packet.progress + 0.02, 1)
          })).filter(packet => packet.progress < 1)
        })
        
        // Randomly generate new packets
        if (Math.random() < 0.1) {
          generateRandomPacket()
        }
        
        animationFrame = requestAnimationFrame(animate)
      }
      animationFrame = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isRunning, nodes])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const generateRandomPacket = () => {
    const activeNodes = nodes.filter(node => node.isActive)
    if (activeNodes.length < 2) return

    const fromNode = activeNodes[Math.floor(Math.random() * activeNodes.length)]
    const possibleTargets = activeNodes.filter(node => 
      node.id !== fromNode.id && fromNode.connections.includes(node.id)
    )
    
    if (possibleTargets.length === 0) return

    const toNode = possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
    
    const packetTypes: Array<'normal' | 'malicious' | 'encrypted'> = ['normal', 'normal', 'normal', 'encrypted', 'malicious']
    const packetType = packetTypes[Math.floor(Math.random() * packetTypes.length)]

    const newPacket: DataPacket = {
      id: `packet-${Date.now()}-${Math.random()}`,
      from: fromNode.id,
      to: toNode.id,
      progress: 0,
      type: packetType,
      size: Math.floor(Math.random() * 100) + 10
    }

    setPackets(prev => [...prev, newPacket])
  }

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      setSelectedNode(node)
      
      if (gameMode === 'security' && node.security === 'compromised') {
        setDetectedThreats(prev => prev + 1)
        setScore(prev => prev + 100)
        
        // Update node security
        setNodes(prev => prev.map(n => 
          n.id === nodeId ? { ...n, security: 'secure' } : n
        ))
      }
    }
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setPackets([])
    setScore(0)
    setDetectedThreats(0)
    setTimeElapsed(0)
    setSelectedNode(null)
  }

  const getNodeColor = (node: NetworkNode) => {
    switch (node.security) {
      case 'secure': return '#10b981'
      case 'vulnerable': return '#f59e0b'
      case 'compromised': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getPacketColor = (packet: DataPacket) => {
    switch (packet.type) {
      case 'normal': return '#3b82f6'
      case 'encrypted': return '#10b981'
      case 'malicious': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            CyberSilk - Network Art Visualization
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore network security through interactive art and data visualization. 
            Watch data flow like silk threads and learn to identify security threats.
          </p>
        </motion.div>

        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-6"
        >
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pause' : 'Start'} Simulation
            </button>
            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          <div className="flex gap-2">
            {(['visualization', 'security', 'analysis'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGameMode(mode)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  gameMode === mode
                    ? 'bg-pink-600 hover:bg-pink-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{timeElapsed}s</div>
            <div className="text-sm text-gray-400">Time Elapsed</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{score}</div>
            <div className="text-sm text-gray-400">Score</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{detectedThreats}</div>
            <div className="text-sm text-gray-400">Threats Detected</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{packets.length}</div>
            <div className="text-sm text-gray-400">Active Packets</div>
          </div>
        </motion.div>

        {/* Network Visualization Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/30 rounded-lg p-6 mb-6"
        >
          <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
            <svg className="w-full h-full">
              {/* Connections */}
              {nodes.map(node =>
                node.connections.map(connectionId => {
                  const targetNode = nodes.find(n => n.id === connectionId)
                  if (!targetNode) return null
                  
                  return (
                    <motion.line
                      key={`${node.id}-${connectionId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="rgba(147, 197, 253, 0.3)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: Math.random() * 0.5 }}
                    />
                  )
                })
              )}

              {/* Data Packets */}
              {packets.map(packet => {
                const fromNode = nodes.find(n => n.id === packet.from)
                const toNode = nodes.find(n => n.id === packet.to)
                if (!fromNode || !toNode) return null

                const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress
                const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress

                return (
                  <motion.circle
                    key={packet.id}
                    cx={x}
                    cy={y}
                    r={Math.max(2, packet.size / 10)}
                    fill={getPacketColor(packet)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )
              })}

              {/* Network Nodes */}
              {nodes.map(node => (
                <motion.g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={getNodeColor(node)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: Math.random() * 0.5 }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 35}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    className="pointer-events-none"
                  >
                    {node.id.split('-')[0]}
                  </text>
                </motion.g>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Node Information Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/30 rounded-lg p-6 mb-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                {selectedNode.type === 'router' && <Wifi />}
                {selectedNode.type === 'device' && <Shield />}
                {selectedNode.type === 'server' && <Zap />}
                {selectedNode.type === 'suspicious' && <AlertTriangle />}
                Node Information: {selectedNode.id}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Type:</strong> {selectedNode.type}
                </div>
                <div>
                  <strong>Security Status:</strong>{' '}
                  <span className={`font-bold ${
                    selectedNode.security === 'secure' ? 'text-green-400' :
                    selectedNode.security === 'vulnerable' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {selectedNode.security}
                  </span>
                </div>
                <div>
                  <strong>Connections:</strong> {selectedNode.connections.length}
                </div>
              </div>

              {gameMode === 'security' && selectedNode.security === 'compromised' && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle size={20} />
                    <strong>Security Threat Detected!</strong>
                  </div>
                  <p className="text-sm mt-2">Click this node to secure it and earn points.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Learning Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Eye />
            Learning Objectives
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-purple-400 mb-2">Network Visualization</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Understand network topology and data flow</li>
                <li>• Visualize packet transmission patterns</li>
                <li>• Identify network bottlenecks and congestion</li>
                <li>• Learn about different node types and roles</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-pink-400 mb-2">Security Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Detect suspicious network activity</li>
                <li>• Identify compromised devices</li>
                <li>• Understand attack vectors and patterns</li>
                <li>• Practice incident response procedures</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle size={20} />
              <strong>Pro Tip:</strong>
            </div>
            <p className="text-sm mt-2">
              In Security mode, look for red (compromised) nodes and click them to neutralize threats. 
              Encrypted packets (green) are safer than regular packets (blue), while malicious packets (red) indicate potential attacks.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
