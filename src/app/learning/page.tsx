'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Users, 
  Clock,
  CheckCircle,
  Play,
  Star,
  Brain,
  Shield,
  Zap,
  Search,
  Eye,
  Lock,
  Globe,
  User
} from 'lucide-react'
import useGameStore from '@/stores/gameStore'

/**
 * 📚 Learning Pathways - Structured Cybersecurity Education
 * 
 * Provides scaffolded learning experiences for students at different levels,
 * integrating games, concepts, and real-world applications.
 * 
 * Educational Design Principles:
 * - Progressive difficulty and complexity
 * - Multiple learning modalities (visual, kinesthetic, auditory)
 * - Real-world application and context
 * - Social learning and collaboration opportunities
 * - Immediate feedback and achievement recognition
 */

interface LearningPath {
  id: string
  title: string
  description: string
  icon: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  skillsGained: string[]
  prerequisites: string[]
  modules: LearningModule[]
  gradient: string
}

interface LearningModule {
  id: string
  title: string
  type: 'game' | 'concept' | 'practice' | 'assessment'
  description: string
  estimatedTime: string
  gameId?: string
  conceptUrl?: string
}

export default function LearningPage() {
  const { playerStats, gameProgress, skillProgress } = useGameStore()
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])

  const learningPaths: LearningPath[] = [
    {
      id: 'beginner-explorer',
      title: '🌱 Beginner Explorer',
      description: 'Start your cybersecurity journey with fundamental concepts and hands-on practice',
      icon: '🌱',
      difficulty: 'Beginner',
      estimatedTime: '2-4 weeks',
      skillsGained: ['Password Security', 'Phishing Recognition', 'Basic Network Awareness', 'Digital Hygiene'],
      prerequisites: ['Basic computer literacy', 'Curiosity about cybersecurity'],
      gradient: 'from-green-500 to-emerald-600',
      modules: [
        {
          id: 'password-basics',
          title: 'Password Security Fundamentals',
          type: 'game',
          description: 'Learn to create and manage strong passwords through interactive challenges',
          estimatedTime: '15 min',
          gameId: 'password-fortress'
        },
        {
          id: 'phishing-intro',
          title: 'Spotting Suspicious Emails',
          type: 'concept',
          description: 'Understand the psychology and tactics behind phishing attacks',
          estimatedTime: '10 min',
          conceptUrl: '/learning/concepts/phishing-basics'
        },
        {
          id: 'phishing-practice',
          title: 'Detective Training',
          type: 'game',
          description: 'Practice identifying phishing emails in a safe environment',
          estimatedTime: '20 min',
          gameId: 'phishing-detective'
        },
        {
          id: 'digital-hygiene',
          title: 'Safe Computing Habits',
          type: 'concept',
          description: 'Daily practices that keep you secure online',
          estimatedTime: '15 min',
          conceptUrl: '/learning/concepts/digital-hygiene'
        }
      ]
    },
    {
      id: 'digital-detective',
      title: '🔍 Digital Detective',
      description: 'Develop analytical thinking and advanced threat recognition skills',
      icon: '🔍',
      difficulty: 'Intermediate', 
      estimatedTime: '4-8 weeks',
      skillsGained: ['Advanced Phishing Detection', 'Social Engineering Awareness', 'Incident Analysis', 'Risk Assessment'],
      prerequisites: ['Completed Beginner Explorer', 'Basic understanding of email security'],
      gradient: 'from-blue-500 to-cyan-600',
      modules: [
        {
          id: 'advanced-phishing',
          title: 'Advanced Phishing Techniques',
          type: 'concept',
          description: 'Learn about sophisticated social engineering attacks',
          estimatedTime: '20 min',
          conceptUrl: '/learning/concepts/advanced-phishing'
        },
        {
          id: 'investigation-skills',
          title: 'Cyber Investigation Methods',
          type: 'practice',
          description: 'Hands-on experience analyzing security incidents',
          estimatedTime: '30 min'
        },
        {
          id: 'network-fundamentals',
          title: 'Network Security Basics',
          type: 'concept',
          description: 'Understand how networks work and common vulnerabilities',
          estimatedTime: '25 min',
          conceptUrl: '/learning/concepts/network-security'
        },
        {
          id: 'defense-strategy',
          title: 'Strategic Defense Planning',
          type: 'game',
          description: 'Build comprehensive defense systems against various threats',
          estimatedTime: '35 min',
          gameId: 'network-defense'
        }
      ]
    },
    {
      id: 'cyber-guardian',
      title: '🚀 Cyber Guardian',
      description: 'Master advanced concepts and develop leadership in cybersecurity',
      icon: '🚀',
      difficulty: 'Advanced',
      estimatedTime: 'Ongoing',
      skillsGained: ['Cryptography', 'Security Architecture', 'Incident Response', 'Team Leadership'],
      prerequisites: ['Completed Digital Detective', 'Strong foundation in security principles'],
      gradient: 'from-purple-500 to-pink-600',
      modules: [
        {
          id: 'cryptography-deep',
          title: 'Cryptography Mastery',
          type: 'game',
          description: 'Master encryption techniques from historical to quantum-resistant',
          estimatedTime: '45 min',
          gameId: 'encryption-escape'
        },
        {
          id: 'security-tools',
          title: 'Professional Security Tools',
          type: 'practice',
          description: 'Experience real-world security monitoring and analysis tools',
          estimatedTime: '60 min'
        },
        {
          id: 'incident-response',
          title: 'Incident Response Planning',
          type: 'concept',
          description: 'Learn to coordinate response to security breaches',
          estimatedTime: '40 min',
          conceptUrl: '/learning/concepts/incident-response'
        },
        {
          id: 'leadership-skills',
          title: 'Cybersecurity Leadership',
          type: 'concept',
          description: 'Develop skills to lead security initiatives and teams',
          estimatedTime: '30 min',
          conceptUrl: '/learning/concepts/security-leadership'
        }
      ]
    }
  ]

  const getPathProgress = (path: LearningPath) => {
    const totalModules = path.modules.length
    const completed = path.modules.filter(module => {
      if (module.type === 'game' && module.gameId) {
        return gameProgress.some(g => g.gameId === module.gameId && g.completed)
      }
      return completedModules.includes(module.id)
    }).length
    return Math.round((completed / totalModules) * 100)
  }

  const getRecommendedPath = () => {
    const totalXP = playerStats.totalXP
    const gamesCompleted = playerStats.gamesCompleted
    
    if (totalXP < 500 || gamesCompleted < 2) {
      return 'beginner-explorer'
    } else if (totalXP < 2000 || gamesCompleted < 5) {
      return 'digital-detective'
    } else {
      return 'cyber-guardian'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-cyan-400/30 mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 font-medium">Structured Learning Pathways</span>
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Cybersecurity
              </span>
              <br />
              <span className="text-2xl md:text-3xl text-slate-300">Learning Journey</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master cybersecurity through carefully designed learning pathways that adapt to your skill level and interests.
              Each path combines interactive games, core concepts, and real-world practice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="relative py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{playerStats.totalXP}</div>
                <div className="text-slate-400 text-sm">Total Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{playerStats.gamesCompleted}</div>
                <div className="text-slate-400 text-sm">Games Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{Object.keys(skillProgress).length}</div>
                <div className="text-slate-400 text-sm">Skills Learned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{playerStats.streakDays}</div>
                <div className="text-slate-400 text-sm">Day Streak</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="relative py-8 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Learning Path</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Each pathway is designed to build your skills progressively, with hands-on practice and real-world applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => {
              const progress = getPathProgress(path)
              const isRecommended = getRecommendedPath() === path.id
              
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <motion.div
                    className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                      isRecommended 
                        ? 'border-cyan-400/60 ring-2 ring-cyan-400/30' 
                        : 'border-slate-600/50 hover:border-cyan-400/30'
                    }`}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                  >
                    <div className={`h-32 bg-gradient-to-br ${path.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      
                      {isRecommended && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                          RECOMMENDED
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-3xl mb-2">{path.icon}</div>
                        <div className="text-sm font-medium opacity-90">{path.difficulty}</div>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 text-white text-right">
                        <div className="text-xl font-bold">{progress}%</div>
                        <div className="text-xs opacity-75">Complete</div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{path.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-cyan-400 text-sm font-medium flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {path.estimatedTime}
                          </span>
                          <span className="text-purple-400 text-sm flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {path.modules.length} modules
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                        <motion.div
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                      
                      {/* Skills Preview */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {path.skillsGained.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {path.skillsGained.length > 3 && (
                          <span className="text-slate-500 text-xs">+{path.skillsGained.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Expanded Module Details */}
                  <AnimatePresence>
                    {selectedPath === path.id && (
                      <motion.div
                        className="mt-4 bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-lg font-bold text-white mb-4">Learning Modules</h4>
                        <div className="space-y-3">
                          {path.modules.map((module, idx) => {
                            const isCompleted = module.type === 'game' && module.gameId 
                              ? gameProgress.some(g => g.gameId === module.gameId && g.completed)
                              : completedModules.includes(module.id)
                            
                            return (
                              <motion.div
                                key={module.id}
                                className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted ? 'bg-green-500' : 'bg-slate-600'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-white">{module.title}</h5>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      module.type === 'game' ? 'bg-green-900/30 text-green-300' :
                                      module.type === 'concept' ? 'bg-blue-900/30 text-blue-300' :
                                      module.type === 'practice' ? 'bg-orange-900/30 text-orange-300' :
                                      'bg-purple-900/30 text-purple-300'
                                    }`}>
                                      {module.type}
                                    </span>
                                  </div>
                                  <p className="text-slate-400 text-sm">{module.description}</p>
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-slate-500 text-xs">{module.estimatedTime}</div>
                                  {module.gameId && (
                                    <Link 
                                      href={`/games/${module.gameId}`}
                                      className="text-cyan-400 hover:text-cyan-300 text-sm mt-1 inline-flex items-center"
                                    >
                                      <Play className="w-3 h-3 mr-1" />
                                      Play
                                    </Link>
                                  )}
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-600">
                          <h5 className="font-medium text-white mb-2">Skills You'll Gain:</h5>
                          <div className="flex flex-wrap gap-2">
                            {path.skillsGained.map((skill, idx) => (
                              <span key={idx} className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-400/20">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Statistics */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-8 border border-cyan-400/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">🎓 Your Learning Impact</h3>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every concept you master and every skill you develop contributes to a safer digital world. 
              Join thousands of students building the cybersecurity expertise our world needs!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <div className="text-2xl font-bold text-cyan-400 mb-1">Real Skills</div>
                <div className="text-slate-400 text-sm">Industry-relevant cybersecurity competencies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎮</div>
                <div className="text-2xl font-bold text-green-400 mb-1">Fun Learning</div>
                <div className="text-slate-400 text-sm">Engaging games and interactive experiences</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <div className="text-2xl font-bold text-purple-400 mb-1">Career Ready</div>
                <div className="text-slate-400 text-sm">Preparation for cybersecurity careers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
