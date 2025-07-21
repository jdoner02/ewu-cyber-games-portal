'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  Users, 
  Activity, 
  Monitor, 
  Server,
  Wifi,
  Lock,
  Eye,
  Settings,
  HardDrive,
  Globe,
  Play
} from 'lucide-react'

interface Player {
  id: string
  name: string
  level: number
  hero: string
  district: string
  power: number
  online: boolean
}

interface NetworkDistrict {
  id: string
  name: string
  description: string
  threat_level: 'low' | 'medium' | 'high' | 'critical'
  players_online: number
  icon: any
  color: string
}

const network_districts: NetworkDistrict[] = [
  {
    id: 'router-realm',
    name: 'Router Realm',
    description: 'Master routing protocols and path optimization',
    threat_level: 'medium',
    players_online: 12,
    icon: Settings,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'switch-sanctuary',
    name: 'Switch Sanctuary', 
    description: 'Control VLAN powers and switching magic',
    threat_level: 'low',
    players_online: 8,
    icon: Activity,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'server-stronghold',
    name: 'Server Stronghold',
    description: 'Defend critical infrastructure and services',
    threat_level: 'high',
    players_online: 15,
    icon: Server,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'wireless-wasteland',
    name: 'Wireless Wasteland',
    description: 'Navigate RF chaos and signal interference',
    threat_level: 'critical',
    players_online: 6,
    icon: Wifi,
    color: 'from-red-500 to-orange-500'
  }
]

const sample_players: Player[] = [
  { id: '1', name: 'RouterMaster_Jake', level: 24, hero: 'Network Guardian', district: 'Router Realm', power: 87, online: true },
  { id: '2', name: 'SwitchQueen_Sara', level: 31, hero: 'VLAN Virtuoso', district: 'Switch Sanctuary', power: 92, online: true },
  { id: '3', name: 'ServerSage_Mike', level: 28, hero: 'Infrastructure Defender', district: 'Server Stronghold', power: 89, online: false },
  { id: '4', name: 'WifiWarrior_Alex', level: 19, hero: 'Signal Specialist', district: 'Wireless Wasteland', power: 76, online: true },
]

export default function PacketTracerMMOGame() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>(sample_players)
  const [gameStarted, setGameStarted] = useState(false)

  const getThreatColor = (level: string) => {
    switch(level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400' 
      case 'high': return 'text-orange-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const startGame = () => {
    setGameStarted(true)
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Game Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              🏰 CyberCity Heroes
            </h1>
            <p className="text-xl text-gray-300">
              Multiplayer Packet Tracer MMO Adventure
            </p>
          </motion.div>

          {/* Network Districts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {network_districts.map((district, index) => {
              const IconComponent = district.icon
              return (
                <motion.div
                  key={district.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${district.color} p-6 rounded-xl shadow-lg cursor-pointer border border-gray-700 hover:border-gray-500 transition-all duration-300`}
                  onClick={() => setSelectedDistrict(district.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-bold">{district.players_online}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{district.name}</h3>
                  <p className="text-sm opacity-90 mb-3">{district.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold">Threat Level:</span>
                    <span className={`text-xs font-bold uppercase ${getThreatColor(district.threat_level)}`}>
                      {district.threat_level}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Online Players Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-cyan-400" />
              Heroes Online ({players.filter(p => p.online).length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {players.filter(p => p.online).map((player) => (
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-cyan-400">{player.name}</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">Level {player.level} {player.hero}</p>
                  <p className="text-xs text-purple-400">{player.district}</p>
                  <div className="mt-2 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${player.power}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Selected District Details */}
          <AnimatePresence>
            {selectedDistrict && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                onClick={() => setSelectedDistrict(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full border border-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const district = network_districts.find(d => d.id === selectedDistrict)
                    if (!district) return null
                    const IconComponent = district.icon
                    return (
                      <>
                        <div className="flex items-center mb-6">
                          <IconComponent className="w-12 h-12 text-cyan-400 mr-4" />
                          <div>
                            <h2 className="text-3xl font-bold">{district.name}</h2>
                            <p className="text-gray-400">{district.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="font-bold mb-2 flex items-center">
                              <Shield className="w-5 h-5 mr-2 text-green-400" />
                              Mission Briefing
                            </h3>
                            <p className="text-sm text-gray-300">
                              Configure network devices to restore communication and defend against cyber threats in this district.
                            </p>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="font-bold mb-2 flex items-center">
                              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                              Required Skills
                            </h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                              <li>• Packet Tracer Mastery</li>
                              <li>• Network Configuration</li>
                              <li>• Team Collaboration</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:from-cyan-600 hover:to-purple-600 transition-all duration-300">
                            Enter District
                          </button>
                          <button 
                            onClick={() => setSelectedDistrict(null)}
                            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </>
                    )
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🏰 CyberCity Heroes
          </h1>
          <p className="text-2xl text-gray-300 mb-6">
            The Ultimate Packet Tracer MMO Adventure
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <Activity className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Multiplayer Networks</h3>
            <p className="text-gray-400">Team up with heroes to configure complex network topologies</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Superhero Powers</h3>
            <p className="text-gray-400">Unlock networking abilities as you master Packet Tracer skills</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Defend Districts</h3>
            <p className="text-gray-400">Protect network districts from cyber villains and infrastructure threats</p>
          </div>
        </motion.div>

        {/* Start Game Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
        >
          <Play className="w-6 h-6 mr-2" />
          Begin Adventure
        </motion.button>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-500 mt-8"
        >
          Transform into a cybersecurity superhero and save CyberCity!
        </motion.p>
      </motion.div>
    </div>
  )
}
