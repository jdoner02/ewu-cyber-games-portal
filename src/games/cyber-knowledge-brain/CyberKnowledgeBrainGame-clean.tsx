'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'

// Types for the educational game system - GenCyber Aligned
interface Monster {
  id: string
  name: string
  type: 'cyber-fundamentals' | 'hardware-fundamentals' | 'cryptography' | 'network-security' | 'security-frameworks' | 'system-security' | 'authentication' | 'ethics-law'
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  baseStats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
  description: string
  abilities: string[]
  evolvesTo: string | null
  learningObjectives: string[]
  knowledgeArea: string
  gencyber_standard: string
  hands_on_activity: string
  career_connection: string
  ewu_pathway: string
}

interface SkillNode {
  id: string
  name: string
  description: string
  category: 'cia-triad' | 'cryptography' | 'network-security' | 'hardware-security' | 'security-frameworks' | 'incident-response' | 'ethics-law'
  level: number
  unlocked: boolean
  prerequisites: string[]
  rewards: {
    monsters?: string[]
    badges?: string[]
    abilities?: string[]
  }
  educational_activity?: {
    title: string
    type: 'hands-on-lab' | 'simulation' | 'case-study' | 'research-project'
    objectives: string[]
    assessment: string[]
  }
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum'
  earned: boolean
  requirements: string
  gencyber_alignment: string
  career_relevance: string
}

interface PlayerProgress {
  level: number
  experience: number
  totalExperience: number
  unlockedNodes: string[]
  collectedMonsters: string[]
  earnedBadges: string[]
  completedActivities: string[]
  cyberScoutRank: string
  currentRegion: string
}

const CyberKnowledgeBrainGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<'exploration' | 'collection' | 'skillTree' | 'badges'>('exploration')
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    level: 1,
    experience: 0,
    totalExperience: 0,
    unlockedNodes: ['cia-triad-basics'],
    collectedMonsters: [],
    earnedBadges: [],
    completedActivities: [],
    cyberScoutRank: 'Novice Scout',
    currentRegion: 'Fundamentals Island'
  })
  
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null)
  const [showMonsterDetails, setShowMonsterDetails] = useState(false)
  const [isCollecting, setIsCollecting] = useState(false)
  const [discoveryAnimation, setDiscoveryAnimation] = useState<string | null>(null)

  const skillTreeRef = useRef<SVGSVGElement>(null)
  const creatureWorldRef = useRef<HTMLDivElement>(null)

  // Enhanced Monster Database - GenCyber Educational Framework
  const monsterDatabase: Monster[] = [
    // CIA Triad Foundation Family - Basic cybersecurity principles
    {
      id: 'confidentia',
      name: 'Confidentia',
      type: 'cyber-fundamentals',
      rarity: 'common',
      baseStats: { hp: 45, attack: 35, defense: 40, speed: 55 },
      description: 'A secretive creature that embodies information confidentiality. Only authorized users can access its hidden knowledge.',
      abilities: ['Access Control', 'Data Classification', 'Privacy Shield'],
      evolvesTo: 'encryptasaurus',
      learningObjectives: [
        'Define confidentiality in the CIA security triad',
        'Identify access control mechanisms',
        'Explain data classification principles'
      ],
      knowledgeArea: 'CIA Triad',
      gencyber_standard: 'Cybersecurity Principles',
      hands_on_activity: 'Password Policy Workshop',
      career_connection: 'Information Security Analyst',
      ewu_pathway: 'Cybersecurity Fundamentals → Security Operations'
    },
    {
      id: 'integron',
      name: 'Integron',
      type: 'cyber-fundamentals',
      rarity: 'common',
      baseStats: { hp: 50, attack: 40, defense: 45, speed: 50 },
      description: 'Guardian of data integrity, this creature ensures information remains unaltered and trustworthy.',
      abilities: ['Hash Verification', 'Checksum Validation', 'Version Control'],
      evolvesTo: 'validatron',
      learningObjectives: [
        'Explain data integrity requirements',
        'Demonstrate hash function applications',
        'Identify integrity threats and controls'
      ],
      knowledgeArea: 'CIA Triad',
      gencyber_standard: 'Cybersecurity Principles',
      hands_on_activity: 'File Integrity Monitoring Lab',
      career_connection: 'Security Auditor',
      ewu_pathway: 'Security Analysis → Risk Assessment'
    },
    {
      id: 'availabeast',
      name: 'Availabeast',
      type: 'cyber-fundamentals',
      rarity: 'common',
      baseStats: { hp: 60, attack: 30, defense: 35, speed: 65 },
      description: 'High-energy creature ensuring systems stay online. When services go down, it springs into action!',
      abilities: ['Load Balancing', 'Redundancy Design', 'Disaster Recovery'],
      evolvesTo: 'uptimemon',
      learningObjectives: [
        'Define system availability requirements',
        'Design high-availability architectures',
        'Plan business continuity strategies'
      ],
      knowledgeArea: 'CIA Triad',
      gencyber_standard: 'System Administration',
      hands_on_activity: 'Server Uptime Monitoring',
      career_connection: 'Systems Administrator',
      ewu_pathway: 'Infrastructure Security → Business Continuity'
    },

    // Hardware Security Family - Physical cybersecurity fundamentals
    {
      id: 'motherboardmon',
      name: 'MotherBoard-mon',
      type: 'hardware-fundamentals',
      rarity: 'common',
      baseStats: { hp: 70, attack: 40, defense: 60, speed: 30 },
      description: 'The foundation creature connecting all hardware components. Its pathways carry critical data flows.',
      abilities: ['Component Integration', 'Bus Architecture', 'Port Management'],
      evolvesTo: 'systemmax',
      learningObjectives: [
        'Identify motherboard components and functions',
        'Understand computer architecture basics',
        'Recognize hardware security vulnerabilities'
      ],
      knowledgeArea: 'Hardware Fundamentals',
      gencyber_standard: 'Hardware/Software',
      hands_on_activity: 'Motherboard Assembly Lab',
      career_connection: 'Hardware Security Specialist',
      ewu_pathway: 'Hardware Security → Embedded Systems Security'
    },
    {
      id: 'cpumon',
      name: 'CPU-mon',
      type: 'hardware-fundamentals',
      rarity: 'common',
      baseStats: { hp: 55, attack: 60, defense: 45, speed: 80 },
      description: 'The brain creature of computing systems. Its instruction cycles power all digital operations.',
      abilities: ['Instruction Execution', 'Cache Management', 'Branch Prediction'],
      evolvesTo: 'quantumprocessor',
      learningObjectives: [
        'Explain CPU architecture and instruction sets',
        'Understand processor security features',
        'Identify side-channel attack vectors'
      ],
      knowledgeArea: 'Hardware Fundamentals',
      gencyber_standard: 'Hardware/Software',
      hands_on_activity: 'CPU Installation and Thermal Management',
      career_connection: 'Embedded Security Engineer',
      ewu_pathway: 'Computer Architecture → Hardware Security Research'
    },

    // Cryptography Evolution Line
    {
      id: 'encryptasaurus',
      name: 'Encryptasaurus',
      type: 'cryptography',
      rarity: 'uncommon',
      baseStats: { hp: 65, attack: 70, defense: 60, speed: 75 },
      description: 'Evolved from Confidentia, this crypto-beast transforms plaintext into unbreakable ciphertext.',
      abilities: ['AES Encryption', 'Key Management', 'Algorithm Selection'],
      evolvesTo: 'quantumcrypt',
      learningObjectives: [
        'Implement symmetric encryption algorithms',
        'Design secure key management systems',
        'Compare encryption algorithm strengths'
      ],
      knowledgeArea: 'Cryptography',
      gencyber_standard: 'Cryptography',
      hands_on_activity: 'Encryption Implementation Challenge',
      career_connection: 'Cryptography Engineer',
      ewu_pathway: 'Applied Cryptography → Security Research'
    },

    // Network Security Family
    {
      id: 'firewalldragon',
      name: 'Firewall Dragon',
      type: 'network-security',
      rarity: 'uncommon',
      baseStats: { hp: 80, attack: 45, defense: 90, speed: 40 },
      description: 'Mighty guardian filtering network traffic with rule-based precision. Blocks malicious packets with fire breath.',
      abilities: ['Packet Filtering', 'Stateful Inspection', 'Application Control'],
      evolvesTo: 'ngfwleviathan',
      learningObjectives: [
        'Configure firewall rules and policies',
        'Analyze network traffic patterns',
        'Implement network segmentation'
      ],
      knowledgeArea: 'Network Security',
      gencyber_standard: 'Networks and the Internet',
      hands_on_activity: 'Firewall Configuration Workshop',
      career_connection: 'Network Security Engineer',
      ewu_pathway: 'Network Security → Infrastructure Design'
    },

    // Legendary Framework Creatures
    {
      id: 'zerotrust_leviathan',
      name: 'Zero Trust Leviathan',
      type: 'security-frameworks',
      rarity: 'legendary',
      baseStats: { hp: 100, attack: 95, defense: 110, speed: 90 },
      description: 'Ultimate security framework embodiment. Never trusts, always verifies. Masters microsegmentation and least privilege.',
      abilities: ['Never Trust Always Verify', 'Least Privilege', 'Continuous Monitoring'],
      evolvesTo: null,
      learningObjectives: [
        'Design Zero Trust security architectures',
        'Implement identity-based security',
        'Deploy microsegmentation strategies'
      ],
      knowledgeArea: 'Security Frameworks',
      gencyber_standard: 'Cybersecurity Principles',
      hands_on_activity: 'Zero Trust Network Design Challenge',
      career_connection: 'Security Architect',
      ewu_pathway: 'Advanced Security Architecture → Research Leadership'
    },
    {
      id: 'ethicalguardian',
      name: 'Ethical Guardian',
      type: 'ethics-law',
      rarity: 'legendary',
      baseStats: { hp: 90, attack: 70, defense: 85, speed: 75 },
      description: 'Wise protector of digital rights and privacy. Guides cybersecurity professionals in ethical decision-making.',
      abilities: ['Responsible Disclosure', 'Privacy by Design', 'Legal Compliance'],
      evolvesTo: null,
      learningObjectives: [
        'Apply ethical frameworks to security decisions',
        'Navigate legal and regulatory requirements',
        'Balance security with privacy rights'
      ],
      knowledgeArea: 'Ethics and Law',
      gencyber_standard: 'Cybersecurity Principles',
      hands_on_activity: 'Ethical Hacking Scenario Workshop',
      career_connection: 'Chief Information Security Officer',
      ewu_pathway: 'Security Leadership → Policy Development'
    }
  ]

  // Educational Skill Tree Nodes - GenCyber Aligned
  const skillNodes: SkillNode[] = [
    {
      id: 'cia-triad-basics',
      name: 'CIA Triad Fundamentals',
      description: 'Master the foundational principles of cybersecurity: Confidentiality, Integrity, and Availability.',
      category: 'cia-triad',
      level: 1,
      unlocked: true,
      prerequisites: [],
      rewards: {
        monsters: ['confidentia', 'integron', 'availabeast'],
        badges: ['cia-foundation']
      },
      educational_activity: {
        title: 'CIA Triad Workshop',
        type: 'hands-on-lab',
        objectives: [
          'Identify confidentiality mechanisms in real systems',
          'Demonstrate integrity verification techniques',
          'Design availability and redundancy solutions'
        ],
        assessment: [
          'Design a system protecting all three CIA principles',
          'Explain trade-offs between security and usability',
          'Classify data based on confidentiality requirements'
        ]
      }
    },
    {
      id: 'hardware-security-foundation',
      name: 'Hardware Security Fundamentals',
      description: 'Understand physical computing components and their security implications.',
      category: 'hardware-security',
      level: 2,
      unlocked: false,
      prerequisites: ['cia-triad-basics'],
      rewards: {
        monsters: ['motherboardmon', 'cpumon'],
        badges: ['hardware-expert']
      },
      educational_activity: {
        title: 'Computer Assembly & Security Lab',
        type: 'hands-on-lab',
        objectives: [
          'Assemble computer components safely',
          'Identify hardware security vulnerabilities',
          'Configure boot security settings'
        ],
        assessment: [
          'Complete motherboard assembly challenge',
          'Explain side-channel attack vectors',
          'Design physical security controls'
        ]
      }
    },
    {
      id: 'cryptography-fundamentals',
      name: 'Cryptography Basics',
      description: 'Learn the mathematics and implementation of cryptographic systems.',
      category: 'cryptography',
      level: 3,
      unlocked: false,
      prerequisites: ['cia-triad-basics'],
      rewards: {
        monsters: ['encryptasaurus'],
        badges: ['crypto-novice']
      },
      educational_activity: {
        title: 'Encryption Implementation Challenge',
        type: 'hands-on-lab',
        objectives: [
          'Implement symmetric encryption algorithms',
          'Design secure key exchange protocols',
          'Analyze cryptographic algorithm strengths'
        ],
        assessment: [
          'Break weak encryption using frequency analysis',
          'Implement AES encryption in Python',
          'Design public key infrastructure'
        ]
      }
    }
  ]

  // Educational Badges - GenCyber Career Aligned
  const badges: Badge[] = [
    {
      id: 'cia-foundation',
      name: 'CIA Foundation',
      description: 'Mastered the fundamental principles of cybersecurity: Confidentiality, Integrity, and Availability.',
      icon: '🛡️',
      rarity: 'bronze',
      earned: false,
      requirements: 'Complete CIA Triad Fundamentals module and hands-on workshop',
      gencyber_alignment: 'Cybersecurity Principles - CIA Triad',
      career_relevance: 'Essential foundation for all cybersecurity roles'
    },
    {
      id: 'hardware-expert',
      name: 'Hardware Security Expert',
      description: 'Demonstrated deep understanding of computer hardware security and assembly.',
      icon: '🔧',
      rarity: 'silver',
      earned: false,
      requirements: 'Complete hardware assembly lab and security vulnerability assessment',
      gencyber_alignment: 'Hardware/Software - Physical Security',
      career_relevance: 'Hardware Security Specialist, Embedded Systems Engineer'
    },
    {
      id: 'crypto-novice',
      name: 'Cryptography Novice',
      description: 'Successfully implemented encryption algorithms and key management systems.',
      icon: '🔐',
      rarity: 'silver',
      earned: false,
      requirements: 'Implement AES encryption and design public key infrastructure',
      gencyber_alignment: 'Cryptography - Symmetric and Asymmetric Encryption',
      career_relevance: 'Cryptography Engineer, Security Software Developer'
    }
  ]

  // Helper Functions
  const getCyberScoutRank = (level: number): string => {
    if (level < 5) return 'Novice Scout'
    if (level < 10) return 'Cyber Scout'
    if (level < 20) return 'Security Scout'
    if (level < 30) return 'Expert Scout'
    return 'Master Scout'
  }

  const getMonsterEmoji = (monster: Monster): string => {
    const emojiMap: Record<string, string> = {
      'cyber-fundamentals': '🛡️',
      'hardware-fundamentals': '⚙️',
      'cryptography': '🔐',
      'network-security': '🌐',
      'security-frameworks': '🏛️',
      'system-security': '💻',
      'authentication': '🔑',
      'ethics-law': '⚖️'
    }
    return emojiMap[monster.type] || '🔹'
  }

  const earnBadge = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId)
    if (badge && !badge.earned) {
      badge.earned = true
      setTimeout(() => {
        alert(`🏆 Badge Earned: ${badge.name}\n\n${badge.description}`)
      }, 500)
    }
  }

  const discoverMonster = (monsterId: string) => {
    const monster = monsterDatabase.find(m => m.id === monsterId)
    if (!monster) return

    setSelectedMonster(monster)
    setDiscoveryAnimation(monsterId)
    setShowMonsterDetails(true)

    setPlayerProgress(prev => ({
      ...prev,
      collectedMonsters: [...prev.collectedMonsters, monsterId]
    }))

    setTimeout(() => {
      setDiscoveryAnimation(null)
    }, 3000)
  }

  const handleSkillNodeClick = (node: SkillNode) => {
    if (node.educational_activity) {
      alert(`Starting Educational Activity: ${node.educational_activity.title}\n\nType: ${node.educational_activity.type}\n\nObjectives:\n${node.educational_activity.objectives.join('\n')}`)
      completeSkillNode(node.id)
    }
  }

  const completeSkillNode = (nodeId: string) => {
    const node = skillNodes.find(n => n.id === nodeId)
    if (!node) return

    if (node.rewards.monsters) {
      node.rewards.monsters.forEach(monsterId => {
        discoverMonster(monsterId)
      })
    }

    if (node.rewards.badges) {
      node.rewards.badges.forEach(badgeId => {
        earnBadge(badgeId)
      })
    }

    setPlayerProgress(prev => {
      const newProgress = {
        ...prev,
        unlockedNodes: [...prev.unlockedNodes, nodeId],
        experience: prev.experience + (node.level * 50),
        totalExperience: prev.totalExperience + (node.level * 50),
        completedActivities: [...prev.completedActivities, nodeId]
      }

      const newLevel = Math.floor(newProgress.totalExperience / 200) + 1
      if (newLevel > prev.level) {
        newProgress.level = newLevel
        newProgress.cyberScoutRank = getCyberScoutRank(newLevel)
      }

      return newProgress
    })

    skillNodes.forEach(skillNode => {
      if (skillNode.prerequisites.includes(nodeId)) {
        skillNode.unlocked = true
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-300">🧠 Cyber Knowledge Brain</h1>
            <p className="text-white/70">Pokemon-style learning adventure for Cyber Scouts</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-white/70">Scout Level {playerProgress.level}</p>
              <p className="font-semibold">{playerProgress.cyberScoutRank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Monsters</p>
              <p className="font-semibold">{playerProgress.collectedMonsters.length}/{monsterDatabase.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex gap-4">
            {[
              { key: 'exploration', label: '🌍 Explore', desc: 'Discover new regions' },
              { key: 'collection', label: '📦 Collection', desc: 'View your monsters' },
              { key: 'skillTree', label: '🌳 Skills', desc: 'Learning pathways' },
              { key: 'badges', label: '🏆 Badges', desc: 'Achievements' }
            ].map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => setGameMode(key as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  gameMode === key
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs opacity-70">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {gameMode === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-purple-300">📦 Monster Collection</h2>
                <p className="text-white/80 mb-6">
                  Your collection of cybersecurity creatures! Each monster represents different security concepts and career pathways.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monsterDatabase.map(monster => (
                    <div
                      key={monster.id}
                      className={`rounded-xl p-6 border transition-all cursor-pointer ${
                        playerProgress.collectedMonsters.includes(monster.id)
                          ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50 hover:scale-105'
                          : 'bg-gray-500/10 border-gray-500/30 opacity-50'
                      }`}
                      onClick={() => playerProgress.collectedMonsters.includes(monster.id) && setSelectedMonster(monster)}
                    >
                      <div className="text-4xl mb-2">{getMonsterEmoji(monster)}</div>
                      <h3 className="text-lg font-bold text-white mb-2">{monster.name}</h3>
                      <p className="text-sm text-gray-300 mb-2">{monster.type}</p>
                      <p className="text-xs text-gray-400">{monster.description}</p>
                      {playerProgress.collectedMonsters.includes(monster.id) && (
                        <div className="mt-2 flex gap-2">
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Collected</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            monster.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                            monster.rarity === 'rare' ? 'bg-purple-500/20 text-purple-300' :
                            monster.rarity === 'uncommon' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {monster.rarity}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameMode === 'skillTree' && (
            <motion.div
              key="skillTree"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-green-300">🌳 Cybersecurity Learning Pathways</h2>
                <p className="text-white/80 mb-6">
                  Progress through educational modules to unlock new monsters and advance your cyber skills!
                </p>
                
                <div className="grid gap-4">
                  {skillNodes.map(node => (
                    <div
                      key={node.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        node.unlocked
                          ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30'
                          : 'bg-gray-500/10 border-gray-500/30 opacity-50'
                      }`}
                      onClick={() => node.unlocked && handleSkillNodeClick(node)}
                    >
                      <h3 className="text-lg font-bold mb-2">{node.name}</h3>
                      <p className="text-sm text-white/70 mb-3">{node.description}</p>
                      {node.educational_activity && (
                        <div className="text-xs text-cyan-300">
                          📋 Activity: {node.educational_activity.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameMode === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-yellow-300">🏆 Achievement Badges</h2>
                <p className="text-white/80 mb-6">
                  Earn badges by completing educational challenges and demonstrating cybersecurity mastery!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map(badge => (
                    <div
                      key={badge.id}
                      className={`rounded-xl p-6 border transition-all ${
                        badge.earned
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                          : 'bg-gray-500/10 border-gray-500/30 opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                      <p className="text-xs text-gray-400">{badge.requirements}</p>
                      {badge.earned && (
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Earned!</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Monster Details Modal */}
      <AnimatePresence>
        {showMonsterDetails && selectedMonster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowMonsterDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-6 max-w-2xl w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedMonster.name}</h2>
                  <p className="text-white/70">{selectedMonster.knowledgeArea}</p>
                </div>
                <button
                  onClick={() => setShowMonsterDetails(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-white/80">{selectedMonster.description}</p>
                
                <div>
                  <h3 className="font-semibold text-cyan-300 mb-2">Learning Objectives:</h3>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    {selectedMonster.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-300 mb-2">Career Connection:</h3>
                  <p className="text-white/70">{selectedMonster.career_connection}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-300 mb-2">EWU Pathway:</h3>
                  <p className="text-white/70">{selectedMonster.ewu_pathway}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CyberKnowledgeBrainGame
