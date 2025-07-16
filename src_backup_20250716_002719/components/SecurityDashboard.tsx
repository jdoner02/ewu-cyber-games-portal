'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Lock, 
  Eye,
  TrendingUp,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { 
  useSecurityMonitoringStore, 
  SecurityEventType,
  StrideCategory,
  RiskLevel,
  SecurityMonitoringService 
} from '@/utils/SecurityMonitoringSystem'

interface SecurityDashboardProps {
  className?: string
}

export default function SecurityDashboard({ className = '' }: SecurityDashboardProps) {
  const {
    securityMetrics,
    securityEvents,
    threatModels,
    complianceFrameworks,
    monitoringEnabled,
    addSecurityEvent,
    calculateRiskScore,
    generateThreatAssessment,
    enableContinuousMonitoring,
    disableContinuousMonitoring,
    exportSecurityReport
  } = useSecurityMonitoringStore()

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [showDetails, setShowDetails] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const securityService = SecurityMonitoringService.getInstance()

  // Filter events by timeframe
  const getFilteredEvents = () => {
    const now = new Date()
    let cutoff: Date
    
    switch (selectedTimeframe) {
      case '1h': cutoff = new Date(now.getTime() - 60 * 60 * 1000); break
      case '24h': cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); break
      case '7d': cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break
      case '30d': cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break
    }
    
    return securityEvents.filter(event => new Date(event.timestamp) > cutoff)
  }

  const filteredEvents = getFilteredEvents()

  // Calculate dashboard metrics
  const dashboardMetrics = {
    totalEvents: filteredEvents.length,
    criticalEvents: filteredEvents.filter(e => e.riskLevel === RiskLevel.CRITICAL).length,
    highEvents: filteredEvents.filter(e => e.riskLevel === RiskLevel.HIGH).length,
    resolvedEvents: filteredEvents.filter(e => e.mitigationStatus === 'resolved').length,
    averageResolutionTime: '12 minutes', // Simulated
    systemUptime: '99.8%' // Simulated
  }

  // Handle refresh
  const handleRefresh = () => {
    calculateRiskScore()
    setLastRefresh(new Date())
    
    // Simulate new security event for demonstration
    if (Math.random() < 0.7) {
      addSecurityEvent({
        type: SecurityEventType.PERFORMANCE_ANOMALY,
        strideCategory: StrideCategory.DENIAL_OF_SERVICE,
        riskLevel: RiskLevel.LOW,
        source: 'system_monitor',
        description: 'Slight increase in response time detected',
        mitigationStatus: 'resolved',
        automaticResponse: 'Load balancing adjusted automatically',
        metadata: { responseTime: '450ms', threshold: '500ms' }
      })
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000)
    return () => clearInterval(interval)
  }, [])

  // Risk level colors
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'text-green-400 bg-green-400/10'
      case RiskLevel.MEDIUM: return 'text-yellow-400 bg-yellow-400/10'
      case RiskLevel.HIGH: return 'text-orange-400 bg-orange-400/10'
      case RiskLevel.CRITICAL: return 'text-red-400 bg-red-400/10'
    }
  }

  const getStrideIcon = (category: StrideCategory) => {
    switch (category) {
      case StrideCategory.SPOOFING: return '🎭'
      case StrideCategory.TAMPERING: return '🔧'
      case StrideCategory.REPUDIATION: return '📝'
      case StrideCategory.INFORMATION_DISCLOSURE: return '📊'
      case StrideCategory.DENIAL_OF_SERVICE: return '⚡'
      case StrideCategory.ELEVATION_OF_PRIVILEGE: return '🔑'
    }
  }

  return (
    <div className={`bg-slate-900/50 backdrop-blur rounded-xl border border-slate-700/50 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-cyan-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">Security Operations Center</h2>
              <p className="text-slate-400">Real-time security monitoring and threat analysis</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Monitoring Status */}
            <div className={`flex items-center px-3 py-1 rounded-full ${
              monitoringEnabled ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                monitoringEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              {monitoringEnabled ? 'ACTIVE' : 'INACTIVE'}
            </div>
            
            {/* Control Buttons */}
            <button
              onClick={monitoringEnabled ? disableContinuousMonitoring : enableContinuousMonitoring}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                monitoringEnabled 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {monitoringEnabled ? 'Disable' : 'Enable'} Monitoring
            </button>
            
            <button
              onClick={handleRefresh}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                const report = exportSecurityReport()
                const blob = new Blob([report], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`
                a.click()
              }}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="p-4 border-b border-slate-700/30">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm">Timeframe:</span>
          {(['1h', '24h', '7d', '30d'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                selectedTimeframe === timeframe
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
          <span className="text-slate-500 text-xs ml-4">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Overall Risk</p>
                <p className="text-2xl font-bold text-white">{securityMetrics.riskScore}</p>
              </div>
              <TrendingUp className={`w-8 h-8 ${
                securityMetrics.riskScore < 30 ? 'text-green-400' : 
                securityMetrics.riskScore < 60 ? 'text-yellow-400' : 'text-red-400'
              }`} />
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Health</p>
                <p className="text-2xl font-bold text-white">{securityMetrics.systemHealth}%</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Events ({selectedTimeframe})</p>
                <p className="text-2xl font-bold text-white">{dashboardMetrics.totalEvents}</p>
              </div>
              <Eye className="w-8 h-8 text-cyan-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Compliance</p>
                <p className="text-2xl font-bold text-white">{securityMetrics.complianceScore}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>
        </div>

        {/* STRIDE Threat Landscape */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            STRIDE Threat Landscape
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(securityMetrics.threatLandscape).map(([category, count]) => (
              <div
                key={category}
                className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getStrideIcon(category as StrideCategory)}</span>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {category.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {category === 'spoofing' ? 'Identity threats' :
                         category === 'tampering' ? 'Data integrity' :
                         category === 'repudiation' ? 'Audit trails' :
                         category === 'information_disclosure' ? 'Data leaks' :
                         category === 'denial_of_service' ? 'Availability' :
                         'Privilege escalation'}
                      </p>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-bold">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-cyan-400" />
              Recent Security Events
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredEvents.slice(0, 10).map((event) => (
              <motion.div
                key={event.id}
                className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRiskColor(event.riskLevel)}`}>
                        {event.riskLevel.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-slate-400 text-xs">{event.source}</span>
                    </div>
                    <p className="text-white text-sm">{event.description}</p>
                    {showDetails && (
                      <div className="mt-2 text-xs text-slate-400">
                        <p>Category: {getStrideIcon(event.strideCategory)} {event.strideCategory}</p>
                        {event.automaticResponse && (
                          <p className="text-green-400">Response: {event.automaticResponse}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    event.mitigationStatus === 'resolved' ? 'bg-green-400' :
                    event.mitigationStatus === 'in_progress' ? 'bg-yellow-400' :
                    event.mitigationStatus === 'false_positive' ? 'bg-blue-400' :
                    'bg-red-400'
                  }`}></div>
                </div>
              </motion.div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                <p>No security events in the selected timeframe</p>
                <p className="text-sm">System operating normally</p>
              </div>
            )}
          </div>
        </div>

        {/* Threat Models Summary */}
        {threatModels.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-purple-400" />
              Active Threat Models
            </h3>
            <div className="space-y-2">
              {threatModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{model.name}</p>
                      <p className="text-slate-400 text-sm">{model.description}</p>
                      <p className="text-slate-500 text-xs">
                        Assets: {model.assets.length} | Updated: {new Date(model.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 text-sm">Risk Analysis</p>
                      <div className="flex space-x-1 mt-1">
                        {Object.entries(model.strideAssessment).map(([category, assessment]) => (
                          <div
                            key={category}
                            className={`w-2 h-8 rounded ${
                              assessment.riskScore > 20 ? 'bg-red-400' :
                              assessment.riskScore > 10 ? 'bg-yellow-400' :
                              'bg-green-400'
                            }`}
                            title={`${category}: ${assessment.riskScore}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => generateThreatAssessment()}
            className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all"
          >
            Generate Threat Model
          </button>
          <button
            onClick={() => {
              addSecurityEvent({
                type: SecurityEventType.SUSPICIOUS_ACTIVITY,
                strideCategory: StrideCategory.INFORMATION_DISCLOSURE,
                riskLevel: RiskLevel.MEDIUM,
                source: 'manual_test',
                description: 'Manual security test initiated',
                mitigationStatus: 'pending',
                metadata: { testType: 'penetration_test' }
              })
            }}
            className="p-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-all"
          >
            Test Security Event
          </button>
          <button
            onClick={calculateRiskScore}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all"
          >
            Recalculate Risk
          </button>
          <button
            onClick={() => window.open('/games', '_blank')}
            className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-all"
          >
            Return to Games
          </button>
        </div>
      </div>
    </div>
  )
}
