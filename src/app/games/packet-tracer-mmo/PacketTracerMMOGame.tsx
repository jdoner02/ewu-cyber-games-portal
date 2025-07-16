'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Router, Monitor, Server, Wifi, Cable, Settings, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react'

interface NetworkDevice {
  id: string
  type: 'router' | 'switch' | 'pc' | 'server' | 'wireless'
  position: { x: number; y: number }
  ip?: string
  connected: string[]
  status: 'active' | 'inactive' | 'error'
  config: Record<string, any>
}

interface Connection {
  id: string
  from: string
  to: string
  type: 'ethernet' | 'fiber' | 'wireless'
  status: 'active' | 'inactive' | 'error'
}

interface NetworkPacket {
  id: string
  source: string
  destination: string
  type: 'ping' | 'http' | 'dns' | 'ssh'
  progress: number
  path: string[]
  currentHop: number
}

export default function PacketTracerMMOGame() {
  const [devices, setDevices] = useState<NetworkDevice[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [packets, setPackets] = useState<NetworkPacket[]>([])
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  const [selectedTool, setSelectedTool] = useState<'router' | 'switch' | 'pc' | 'server' | 'wireless'>('pc')
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [objectives, setObjectives] = useState([
    { id: 'connect-pcs', text: 'Connect 2 PCs to a switch', completed: false },
    { id: 'add-router', text: 'Add a router for inter-network communication', completed: false },
    { id: 'ping-test', text: 'Successfully ping between different networks', completed: false },
    { id: 'web-server', text: 'Set up a web server and access it', completed: false }
  ])

  const deviceTypes = {
    router: { name: 'Router', icon: Router, color: 'blue', cost: 50 },
    switch: { name: 'Switch', icon: Cable, color: 'green', cost: 30 },
    pc: { name: 'PC', icon: Monitor, color: 'purple', cost: 20 },
    server: { name: 'Server', icon: Server, color: 'orange', cost: 40 },
    wireless: { name: 'Wireless AP', icon: Wifi, color: 'cyan', cost: 35 }
  }

  // Initialize with basic setup
  useEffect(() => {
    const initialDevices: NetworkDevice[] = [
      {
        id: 'pc1',
        type: 'pc',
        position: { x: 100, y: 200 },
        ip: '192.168.1.2',
        connected: [],
        status: 'inactive',
        config: { hostname: 'PC1', gateway: '192.168.1.1' }
      },
      {
        id: 'pc2',
        type: 'pc',
        position: { x: 100, y: 350 },
        ip: '192.168.1.3',
        connected: [],
        status: 'inactive',
        config: { hostname: 'PC2', gateway: '192.168.1.1' }
      }
    ]
    setDevices(initialDevices)
  }, [])

  // Simulation loop
  useEffect(() => {
    if (!simulationRunning) return

    const interval = setInterval(() => {
      // Move packets along their paths
      setPackets(prev => prev.map(packet => {
        if (packet.currentHop < packet.path.length - 1) {
          return {
            ...packet,
            progress: packet.progress + 0.1,
            currentHop: packet.progress >= 1 ? packet.currentHop + 1 : packet.currentHop
          }
        }
        return packet
      }).filter(packet => packet.currentHop < packet.path.length))

      // Randomly generate network traffic
      if (Math.random() < 0.3 && devices.length > 1) {
        generateRandomPacket()
      }
    }, 200)

    return () => clearInterval(interval)
  }, [simulationRunning, devices])

  const generateRandomPacket = () => {
    const activeDevices = devices.filter(d => d.status === 'active')
    if (activeDevices.length < 2) return

    const source = activeDevices[Math.floor(Math.random() * activeDevices.length)]
    const destination = activeDevices.filter(d => d.id !== source.id)[0]

    if (!destination) return

    const packetTypes: Array<'ping' | 'http' | 'dns' | 'ssh'> = ['ping', 'http', 'dns', 'ssh']
    const packetType = packetTypes[Math.floor(Math.random() * packetTypes.length)]

    // Simple path finding (direct connection or through shared device)
    const path = findPath(source.id, destination.id)
    if (path.length === 0) return

    const newPacket: NetworkPacket = {
      id: `packet-${Date.now()}`,
      source: source.id,
      destination: destination.id,
      type: packetType,
      progress: 0,
      path,
      currentHop: 0
    }

    setPackets(prev => [...prev, newPacket])
  }

  const findPath = (sourceId: string, destinationId: string): string[] => {
    // Simple pathfinding - direct connection or through one intermediary
    const sourceDevice = devices.find(d => d.id === sourceId)
    const destDevice = devices.find(d => d.id === destinationId)
    
    if (!sourceDevice || !destDevice) return []

    // Check direct connection
    if (sourceDevice.connected.includes(destinationId)) {
      return [sourceId, destinationId]
    }

    // Check for common intermediate device
    for (const intermediateid of sourceDevice.connected) {
      const intermediate = devices.find(d => d.id === intermediateid)
      if (intermediate && intermediate.connected.includes(destinationId)) {
        return [sourceId, intermediateid, destinationId]
      }
    }

    return []
  }

  const placeDevice = (x: number, y: number) => {
    const newDevice: NetworkDevice = {
      id: `${selectedTool}-${Date.now()}`,
      type: selectedTool,
      position: { x, y },
      connected: [],
      status: 'inactive',
      config: {}
    }

    // Auto-assign IP based on type
    if (selectedTool === 'router') {
      newDevice.ip = '192.168.1.1'
      newDevice.config = { 
        hostname: `Router${devices.filter(d => d.type === 'router').length + 1}`,
        interfaces: ['192.168.1.1/24', '192.168.2.1/24']
      }
    } else if (selectedTool === 'server') {
      newDevice.ip = '192.168.1.100'
      newDevice.config = { 
        hostname: `Server${devices.filter(d => d.type === 'server').length + 1}`,
        services: ['HTTP', 'DNS', 'DHCP']
      }
    }

    setDevices(prev => [...prev, newDevice])
    setScore(prev => prev + 10)
  }

  const connectDevices = (device1Id: string, device2Id: string) => {
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      from: device1Id,
      to: device2Id,
      type: 'ethernet',
      status: 'active'
    }

    setConnections(prev => [...prev, newConnection])
    
    // Update device connections
    setDevices(prev => prev.map(device => {
      if (device.id === device1Id || device.id === device2Id) {
        const otherId = device.id === device1Id ? device2Id : device1Id
        return {
          ...device,
          connected: [...device.connected, otherId],
          status: 'active'
        }
      }
      return device
    }))

    setScore(prev => prev + 20)
    checkObjectives()
  }

  const checkObjectives = () => {
    setObjectives(prev => prev.map(obj => {
      if (obj.completed) return obj

      switch (obj.id) {
        case 'connect-pcs':
          const pcs = devices.filter(d => d.type === 'pc' && d.connected.length > 0)
          return { ...obj, completed: pcs.length >= 2 }
        
        case 'add-router':
          const routers = devices.filter(d => d.type === 'router')
          return { ...obj, completed: routers.length >= 1 }
        
        case 'ping-test':
          // Simplified: if we have connected devices from different subnets
          const connectedDevices = devices.filter(d => d.connected.length > 0)
          return { ...obj, completed: connectedDevices.length >= 3 }
        
        case 'web-server':
          const servers = devices.filter(d => d.type === 'server' && d.connected.length > 0)
          return { ...obj, completed: servers.length >= 1 }
        
        default:
          return obj
      }
    }))
  }

  const resetNetwork = () => {
    setDevices([])
    setConnections([])
    setPackets([])
    setSelectedDevice(null)
    setSimulationRunning(false)
    setScore(0)
    setObjectives(prev => prev.map(obj => ({ ...obj, completed: false })))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Packet Tracer MMO
          </h1>
          <p className="text-lg text-gray-300">
            Build and configure networks in this collaborative network simulation environment
          </p>
        </motion.div>

        {/* Stats and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{score}</div>
            <div className="text-sm text-gray-400">Network Score</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{devices.length}</div>
            <div className="text-sm text-gray-400">Devices</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{connections.length}</div>
            <div className="text-sm text-gray-400">Connections</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{packets.length}</div>
            <div className="text-sm text-gray-400">Active Packets</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setSimulationRunning(!simulationRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              simulationRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {simulationRunning ? <Pause size={20} /> : <Play size={20} />}
            {simulationRunning ? 'Pause' : 'Start'} Simulation
          </button>
          <button
            onClick={resetNetwork}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <RotateCcw size={20} />
            Reset Network
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Device Palette */}
          <div className="bg-black/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Network Devices</h3>
            <div className="space-y-3">
              {Object.entries(deviceTypes).map(([type, data]) => {
                const IconComponent = data.icon
                
                return (
                  <motion.button
                    key={type}
                    onClick={() => setSelectedTool(type as any)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      selectedTool === type
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-600/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent size={20} className={`text-${data.color}-400`} />
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm">{data.name}</div>
                        <div className="text-xs text-gray-400">Cost: {data.cost} pts</div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Objectives */}
            <div className="mt-6">
              <h4 className="font-bold mb-3">Mission Objectives</h4>
              <div className="space-y-2">
                {objectives.map(obj => (
                  <div
                    key={obj.id}
                    className={`flex items-center gap-2 p-2 rounded text-sm ${
                      obj.completed ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                    }`}
                  >
                    <CheckCircle size={16} className={obj.completed ? 'text-green-400' : 'text-gray-500'} />
                    {obj.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Network Canvas */}
          <div className="lg:col-span-3 bg-black/30 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Network Topology</h3>
            <div 
              className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                placeDevice(x, y)
              }}
            >
              <svg className="absolute inset-0 w-full h-full">
                {/* Connections */}
                {connections.map(conn => {
                  const fromDevice = devices.find(d => d.id === conn.from)
                  const toDevice = devices.find(d => d.id === conn.to)
                  if (!fromDevice || !toDevice) return null

                  return (
                    <motion.line
                      key={conn.id}
                      x1={fromDevice.position.x}
                      y1={fromDevice.position.y}
                      x2={toDevice.position.x}
                      y2={toDevice.position.y}
                      stroke={conn.status === 'active' ? '#10b981' : '#6b7280'}
                      strokeWidth="3"
                      strokeDasharray={conn.status === 'active' ? '0' : '5,5'}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )
                })}

                {/* Packet animations */}
                {packets.map(packet => {
                  if (packet.currentHop >= packet.path.length - 1) return null
                  
                  const currentDevice = devices.find(d => d.id === packet.path[packet.currentHop])
                  const nextDevice = devices.find(d => d.id === packet.path[packet.currentHop + 1])
                  
                  if (!currentDevice || !nextDevice) return null

                  const x = currentDevice.position.x + (nextDevice.position.x - currentDevice.position.x) * (packet.progress % 1)
                  const y = currentDevice.position.y + (nextDevice.position.y - currentDevice.position.y) * (packet.progress % 1)

                  return (
                    <motion.circle
                      key={packet.id}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={
                        packet.type === 'ping' ? '#3b82f6' :
                        packet.type === 'http' ? '#10b981' :
                        packet.type === 'dns' ? '#f59e0b' :
                        '#8b5cf6'
                      }
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )
                })}
              </svg>

              {/* Devices */}
              {devices.map(device => {
                const IconComponent = deviceTypes[device.type].icon
                
                return (
                  <motion.div
                    key={device.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      selectedDevice?.id === device.id ? 'ring-2 ring-cyan-400' : ''
                    }`}
                    style={{ left: device.position.x, top: device.position.y }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedDevice && selectedDevice.id !== device.id) {
                        connectDevices(selectedDevice.id, device.id)
                        setSelectedDevice(null)
                      } else {
                        setSelectedDevice(device)
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${deviceTypes[device.type].color}-500 flex items-center justify-center shadow-lg`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs text-center">
                      <div className="bg-black/70 px-2 py-1 rounded">
                        {device.config.hostname || device.id}
                        {device.ip && <div className="text-gray-400">{device.ip}</div>}
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      device.status === 'active' ? 'bg-green-500' :
                      device.status === 'error' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>Click to place devices | Click two devices to connect them | Click device to configure</p>
            </div>
          </div>
        </div>

        {/* Device Configuration Panel */}
        <AnimatePresence>
          {selectedDevice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/30 rounded-lg p-6 mt-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings />
                Device Configuration: {selectedDevice.id}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Type:</strong> {deviceTypes[selectedDevice.type].name}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  <span className={`capitalize ${
                    selectedDevice.status === 'active' ? 'text-green-400' :
                    selectedDevice.status === 'error' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {selectedDevice.status}
                  </span>
                </div>
                <div>
                  <strong>Connections:</strong> {selectedDevice.connected.length}
                </div>
              </div>

              {selectedDevice.ip && (
                <div className="mt-4">
                  <strong>IP Address:</strong> {selectedDevice.ip}
                </div>
              )}

              <button
                onClick={() => setSelectedDevice(null)}
                className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close Configuration
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Learning Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 rounded-lg p-6 mt-8"
        >
          <h3 className="text-xl font-bold mb-4">Learning Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-cyan-400 mb-2">Network Design</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Understand network topology design principles</li>
                <li>• Learn about different network device roles</li>
                <li>• Practice IP addressing and subnetting</li>
                <li>• Explore network protocol behavior</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-400 mb-2">Network Operations</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Configure network devices and services</li>
                <li>• Troubleshoot connectivity issues</li>
                <li>• Monitor network traffic patterns</li>
                <li>• Implement network security policies</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}