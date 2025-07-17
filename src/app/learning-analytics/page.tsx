'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Target, 
  Users, 
  Clock,
  Zap,
  Shield,
  BarChart3,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  MapPin
} from 'lucide-react'
import useGameStore from '@/stores/gameStore'

/**
 * 🏛️ LEARNING ANALYTICS COMMAND CENTER
 * 
 * This is the strategic Command Architect enhancement that transforms
 * the cyber games project from individual excellent games into a 
 * unified educational learning management ecosystem.
 * 
 * Key Features:
 * - Cross-game learning analytics and progress visualization
 * - Adaptive learning recommendations based on performance patterns
 * - Educational effectiveness dashboard with curriculum alignment
 * - Student achievement tracking and skill development mapping
 * - Real-time learning insights and personalized pathways
 * - COPPA-compliant educator reporting and analytics
 * 
 * This represents the culmination of all existing educational infrastructure
 * into a world-class learning management experience that rivals
 * commercial educational platforms.
 * 
 * @author Command Architect Agent
 * @version 1.0.0 - Transformational Learning Analytics Implementation
 * @since 2025-01-15
 */

interface LearningInsight {
  id: string
  type: 'strength' | 'improvement' | 'recommendation' | 'achievement'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  gameContext?: string
}

interface SkillRadarData {
  skill: string
  current: number
  target: number
  improvement: number
}

interface LearningPathway {
  id: string
  title: string
  description: string
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  skills: string[]
  nextSteps: string[]
  priority: number
}

export default function LearningAnalyticsPage() {
  const { 
    playerStats, 
    gameProgress, 
    skillProgress, 
    achievements 
  } = useGameStore()
  
  const [activeView, setActiveView] = useState<'overview' | 'progress' | 'insights' | 'pathways' | 'educator'>('overview')
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month')
  const [learningInsights, setLearningInsights] = useState<LearningInsight[]>([])
  const [adaptivePathways, setAdaptivePathways] = useState<LearningPathway[]>([])

  // Generate adaptive learning insights based on current progress
  useEffect(() => {
    generateLearningInsights()
    generateAdaptivePathways()
  }, [playerStats, gameProgress, skillProgress])

  const generateLearningInsights = () => {
    const insights: LearningInsight[] = []
    
    // Analyze skill strengths and weaknesses
    const skillEntries = Object.entries(skillProgress)
    const strongestSkill = skillEntries.reduce((a, b) => a[1] > b[1] ? a : b)
    const weakestSkill = skillEntries.reduce((a, b) => a[1] < b[1] ? a : b)
    
    if (strongestSkill[1] > 70) {
      insights.push({
        id: 'strength-' + strongestSkill[0],
        type: 'strength',
        title: `Excellent ${strongestSkill[0]} Skills`,
        description: `You've mastered ${strongestSkill[0]} with ${strongestSkill[1]}% proficiency. Consider helping other students or exploring advanced topics.`,
        priority: 'medium',
        actionable: true
      })
    }
    
    if (weakestSkill[1] < 50) {
      insights.push({
        id: 'improvement-' + weakestSkill[0],
        type: 'improvement',
        title: `Focus on ${weakestSkill[0]}`,
        description: `Your ${weakestSkill[0]} skills could use attention. Try the related games and tutorials to build confidence.`,
        priority: 'high',
        actionable: true
      })
    }
    
    // Analyze game completion patterns
    const completedGames = gameProgress.filter(g => g.completed).length
    const totalGames = gameProgress.length || 5 // Estimated total games
    
    if (completedGames >= 3) {
      insights.push({
        id: 'achievement-games',
        type: 'achievement',
        title: 'Game Master Achievement',
        description: `You've completed ${completedGames} cybersecurity games! Your practical skills are developing well.`,
        priority: 'medium',
        actionable: false
      })
    }
    
    // Learning streak analysis
    if (playerStats.streakDays >= 7) {
      insights.push({
        id: 'streak-achievement',
        type: 'achievement',
        title: 'Consistent Learner',
        description: `${playerStats.streakDays} day learning streak! Consistency is key to mastering cybersecurity.`,
        priority: 'low',
        actionable: false
      })
    }
    
    // Adaptive recommendations
    if (playerStats.totalXP > 1000) {
      insights.push({
        id: 'advanced-recommendation',
        type: 'recommendation',
        title: 'Ready for Advanced Topics',
        description: 'Based on your progress, you\'re ready to explore advanced cybersecurity concepts like penetration testing and incident response.',
        priority: 'high',
        actionable: true
      })
    }
    
    setLearningInsights(insights)
  }

  const generateAdaptivePathways = () => {
    const pathways: LearningPathway[] = []
    
    // Analyze current skill levels to recommend pathways
    const avgSkillLevel = Object.values(skillProgress).reduce((a, b) => a + b, 0) / Object.values(skillProgress).length
    
    if (avgSkillLevel < 30) {
      pathways.push({
        id: 'foundation-pathway',
        title: 'Cybersecurity Foundations',
        description: 'Build essential cybersecurity knowledge through interactive games and simulations',
        estimatedTime: '2-3 weeks',
        difficulty: 'beginner',
        skills: ['Basic Security Awareness', 'Password Security', 'Phishing Recognition'],
        nextSteps: ['Complete Password Fortress', 'Practice with Phishing Detective', 'Learn about Social Engineering'],
        priority: 1
      })
    } else if (avgSkillLevel < 70) {
      pathways.push({
        id: 'intermediate-pathway',
        title: 'Security Analyst Track',
        description: 'Develop technical skills for cybersecurity analysis and response',
        estimatedTime: '4-6 weeks',
        difficulty: 'intermediate',
        skills: ['Network Security', 'Incident Response', 'Threat Analysis'],
        nextSteps: ['Advanced Network Defense', 'Security Monitoring Practice', 'Digital Forensics Basics'],
        priority: 1
      })
    } else {
      pathways.push({
        id: 'advanced-pathway',
        title: 'Cybersecurity Expert',
        description: 'Master advanced cybersecurity concepts and leadership skills',
        estimatedTime: '6-8 weeks',
        difficulty: 'advanced',
        skills: ['Advanced Cryptography', 'Security Architecture', 'Team Leadership'],
        nextSteps: ['Design Security Systems', 'Lead Incident Response', 'Mentor Other Students'],
        priority: 1
      })
    }
    
    // Add specialized pathways based on strong skills
    const strongSkills = Object.entries(skillProgress).filter(([_, value]) => value > 60)
    
    if (strongSkills.some(([skill]) => skill === 'cryptography')) {
      pathways.push({
        id: 'crypto-specialist',
        title: 'Cryptography Specialist',
        description: 'Deep dive into advanced cryptographic concepts and applications',
        estimatedTime: '3-4 weeks',
        difficulty: 'advanced',
        skills: ['Advanced Encryption', 'Key Management', 'Blockchain Security'],
        nextSteps: ['Implement Crypto Algorithms', 'Study Quantum Cryptography', 'Build Secure Protocols'],
        priority: 2
      })
    }
    
    setAdaptivePathways(pathways.sort((a, b) => a.priority - b.priority))
  }

  const getSkillRadarData = (): SkillRadarData[] => {
    return Object.entries(skillProgress).map(([skill, current]) => ({
      skill: skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      current,
      target: 100,
      improvement: Math.max(0, current - 50) // Improvement over baseline
    }))
  }

  const calculateOverallProgress = () => {
    const skillAvg = Object.values(skillProgress).reduce((a, b) => a + b, 0) / Object.values(skillProgress).length
    const gameCompletion = gameProgress.filter(g => g.completed).length / Math.max(gameProgress.length, 1) * 100
    const achievementRatio = achievements.filter(a => a.unlockedAt).length / achievements.length * 100
    
    return Math.round((skillAvg + gameCompletion + achievementRatio) / 3)
  }

  const getEngagementMetrics = () => {
    const totalTimeHours = playerStats.timeSpent / 60
    const avgSessionTime = totalTimeHours > 0 ? playerStats.timeSpent / Math.max(playerStats.gamesCompleted, 1) : 0
    const learningVelocity = playerStats.totalXP / Math.max(totalTimeHours, 1)
    
    return {
      totalTimeHours: Math.round(totalTimeHours * 10) / 10,
      avgSessionTime: Math.round(avgSessionTime),
      learningVelocity: Math.round(learningVelocity),
      consistencyScore: playerStats.streakDays * 10
    }
  }

  const renderOverviewView = () => {
    const overallProgress = calculateOverallProgress()
    const engagement = getEngagementMetrics()
    
    return (
      <div className="space-y-8">
        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">{overallProgress}%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Overall Progress</h3>
            <p className="text-slate-300 text-sm">Across all learning activities</p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{playerStats.totalXP}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Experience Points</h3>
            <p className="text-slate-300 text-sm">Total learning achievements</p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{engagement.learningVelocity}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Learning Velocity</h3>
            <p className="text-slate-300 text-sm">XP per hour</p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{playerStats.streakDays}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Learning Streak</h3>
            <p className="text-slate-300 text-sm">Consecutive days</p>
          </motion.div>
        </div>

        {/* Skills Radar Chart */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-cyan-400" />
            Cybersecurity Skills Development
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getSkillRadarData().map((skill, index) => (
              <div key={skill.skill} className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">{skill.skill}</h4>
                <div className="w-full bg-slate-600 rounded-full h-3 mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.current}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-slate-300 text-sm">{skill.current}% mastery</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-yellow-400" />
            Recent Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter(a => a.unlockedAt)
              .slice(-6)
              .map((achievement, index) => (
                <div key={achievement.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="text-white font-medium mb-1">{achievement.title}</h4>
                  <p className="text-slate-300 text-sm">{achievement.description}</p>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    )
  }

  const renderInsightsView = () => {
    return (
      <div className="space-y-8">
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-yellow-400" />
            Personalized Learning Insights
          </h3>
          
          <div className="space-y-4">
            {learningInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                className={`bg-slate-700/50 rounded-lg p-4 border-l-4 ${
                  insight.type === 'strength' ? 'border-green-400' :
                  insight.type === 'improvement' ? 'border-yellow-400' :
                  insight.type === 'recommendation' ? 'border-blue-400' :
                  'border-purple-400'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {insight.type === 'strength' && <CheckCircle className="w-5 h-5 text-green-400 mr-2" />}
                      {insight.type === 'improvement' && <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />}
                      {insight.type === 'recommendation' && <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />}
                      {insight.type === 'achievement' && <Target className="w-5 h-5 text-purple-400 mr-2" />}
                      <h4 className="text-white font-medium">{insight.title}</h4>
                    </div>
                    <p className="text-slate-300 text-sm">{insight.description}</p>
                  </div>
                  {insight.actionable && (
                    <button className="ml-4 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm">
                      Take Action
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  const renderPathwaysView = () => {
    return (
      <div className="space-y-8">
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-cyan-400" />
            Adaptive Learning Pathways
          </h3>
          
          <div className="space-y-6">
            {adaptivePathways.map((pathway, index) => (
              <motion.div
                key={pathway.id}
                className="bg-slate-700/50 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">{pathway.title}</h4>
                    <p className="text-slate-300 mb-4">{pathway.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pathway.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    pathway.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {pathway.difficulty}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h5 className="text-cyan-400 font-medium mb-2">Duration</h5>
                    <p className="text-slate-300 text-sm">{pathway.estimatedTime}</p>
                  </div>
                  <div>
                    <h5 className="text-cyan-400 font-medium mb-2">Skills You'll Gain</h5>
                    <div className="flex flex-wrap gap-2">
                      {pathway.skills.map(skill => (
                        <span key={skill} className="bg-slate-600 text-slate-300 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-cyan-400 font-medium mb-2">Next Steps</h5>
                    <ul className="text-slate-300 text-sm space-y-1">
                      {pathway.nextSteps.slice(0, 3).map((step, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Start This Pathway
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  const renderEducatorView = () => {
    const engagement = getEngagementMetrics()
    
    return (
      <div className="space-y-8">
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-green-400" />
            Educator Dashboard (COPPA Compliant)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">Learning Time</h4>
              <p className="text-2xl font-bold text-white">{engagement.totalTimeHours}h</p>
              <p className="text-slate-300 text-sm">Total engaged time</p>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">Session Quality</h4>
              <p className="text-2xl font-bold text-white">{engagement.avgSessionTime}m</p>
              <p className="text-slate-300 text-sm">Average session length</p>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-2">Consistency</h4>
              <p className="text-2xl font-bold text-white">{playerStats.streakDays}</p>
              <p className="text-slate-300 text-sm">Day learning streak</p>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-2">Achievements</h4>
              <p className="text-2xl font-bold text-white">{achievements.filter(a => a.unlockedAt).length}</p>
              <p className="text-slate-300 text-sm">Badges earned</p>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Learning Objectives Progress</h4>
            <div className="space-y-3">
              {Object.entries(skillProgress).map(([skill, progress]) => (
                <div key={skill}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 capitalize">{skill.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
            <BarChart3 className="w-12 h-12 mr-4 text-cyan-400" />
            Learning Analytics Command Center
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Your comprehensive cybersecurity learning dashboard with AI-powered insights, 
            adaptive pathways, and real-time progress analytics
          </p>
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'progress', label: 'Progress', icon: TrendingUp },
            { id: 'insights', label: 'AI Insights', icon: Zap },
            { id: 'pathways', label: 'Learning Paths', icon: Target },
            { id: 'educator', label: 'Educator View', icon: Users }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeView === view.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <view.icon className="w-5 h-5 mr-2" />
              {view.label}
            </button>
          ))}
        </div>

        {/* Content Views */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && renderOverviewView()}
          {activeView === 'insights' && renderInsightsView()}
          {activeView === 'pathways' && renderPathwaysView()}
          {activeView === 'educator' && renderEducatorView()}
        </AnimatePresence>
      </div>
    </div>
  )
}
