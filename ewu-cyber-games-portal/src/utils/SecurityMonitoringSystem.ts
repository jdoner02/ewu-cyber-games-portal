/**
 * Comprehensive Security Monitoring System
 * Implements STRIDE threat modeling and real-time security monitoring
 * for the Cybersecurity Education Gaming Portal
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// STRIDE Threat Categories
export enum StrideCategory {
  SPOOFING = 'spoofing',
  TAMPERING = 'tampering', 
  REPUDIATION = 'repudiation',
  INFORMATION_DISCLOSURE = 'information_disclosure',
  DENIAL_OF_SERVICE = 'denial_of_service',
  ELEVATION_OF_PRIVILEGE = 'elevation_of_privilege'
}

// Risk Assessment Levels
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Security Event Types
export enum SecurityEventType {
  AUTHENTICATION_FAILURE = 'auth_failure',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_ACCESS_VIOLATION = 'data_access_violation',
  SYSTEM_INTEGRITY_ISSUE = 'system_integrity',
  PERFORMANCE_ANOMALY = 'performance_anomaly',
  CONFIGURATION_DRIFT = 'config_drift'
}

// Security Metrics Interface
export interface SecurityMetrics {
  totalEvents: number
  criticalAlerts: number
  riskScore: number
  systemHealth: number
  complianceScore: number
  lastAssessment: string
  threatLandscape: {
    [key in StrideCategory]: number
  }
}

// Security Event Interface
export interface SecurityEvent {
  id: string
  timestamp: string
  type: SecurityEventType
  strideCategory: StrideCategory
  riskLevel: RiskLevel
  source: string
  description: string
  mitigationStatus: 'pending' | 'in_progress' | 'resolved' | 'false_positive'
  automaticResponse?: string
  manualIntervention?: boolean
  metadata: Record<string, any>
}

// Threat Model Interface
export interface ThreatModel {
  id: string
  name: string
  description: string
  assets: string[]
  threatActors: string[]
  attackVectors: string[]
  strideAssessment: {
    [key in StrideCategory]: {
      likelihood: number
      impact: number
      riskScore: number
      mitigations: string[]
    }
  }
  lastUpdated: string
}

// Zero Trust Policy Interface
export interface ZeroTrustPolicy {
  id: string
  name: string
  description: string
  conditions: {
    userType: string[]
    dataClassification: string[]
    networkLocation: string[]
    deviceTrust: string[]
    timeConstraints?: string
  }
  actions: {
    allow: boolean
    requireMFA: boolean
    restrictAccess: string[]
    logLevel: 'basic' | 'detailed' | 'forensic'
    alertOnViolation: boolean
  }
  active: boolean
  createdAt: string
  lastModified: string
}

// Compliance Framework Interface
export interface ComplianceFramework {
  id: string
  name: string
  version: string
  requirements: {
    id: string
    description: string
    implementation: string
    status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable'
    evidence: string[]
    lastAudit: string
  }[]
  overallScore: number
}

// Security State Interface
interface SecurityMonitoringState {
  // Core Security Data
  securityMetrics: SecurityMetrics
  securityEvents: SecurityEvent[]
  threatModels: ThreatModel[]
  zeroTrustPolicies: ZeroTrustPolicy[]
  complianceFrameworks: ComplianceFramework[]
  
  // System Status
  monitoringEnabled: boolean
  realTimeAlerts: boolean
  auditMode: boolean
  
  // Actions
  addSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void
  updateThreatModel: (threatModel: ThreatModel) => void
  createZeroTrustPolicy: (policy: Omit<ZeroTrustPolicy, 'id' | 'createdAt' | 'lastModified'>) => void
  updateComplianceStatus: (frameworkId: string, requirementId: string, status: string) => void
  calculateRiskScore: () => number
  generateThreatAssessment: () => ThreatModel
  enableContinuousMonitoring: () => void
  disableContinuousMonitoring: () => void
  exportSecurityReport: () => string
}

// Feature Engineer Security Monitoring Store
export const useSecurityMonitoringStore = create<SecurityMonitoringState>()(
  persist(
    (set, get) => ({
      // Initial Security State
      securityMetrics: {
        totalEvents: 0,
        criticalAlerts: 0,
        riskScore: 25, // Low baseline for educational platform
        systemHealth: 98,
        complianceScore: 92,
        lastAssessment: new Date().toISOString(),
        threatLandscape: {
          [StrideCategory.SPOOFING]: 5,
          [StrideCategory.TAMPERING]: 8,
          [StrideCategory.REPUDIATION]: 3,
          [StrideCategory.INFORMATION_DISCLOSURE]: 12,
          [StrideCategory.DENIAL_OF_SERVICE]: 15,
          [StrideCategory.ELEVATION_OF_PRIVILEGE]: 2
        }
      },
      
      securityEvents: [],
      threatModels: [],
      zeroTrustPolicies: [],
      complianceFrameworks: [
        {
          id: 'nist-cybersecurity-framework',
          name: 'NIST Cybersecurity Framework',
          version: '2.0',
          requirements: [
            {
              id: 'ID.AM-1',
              description: 'Physical devices and systems within the organization are inventoried',
              implementation: 'Automated asset discovery and inventory management',
              status: 'compliant',
              evidence: ['Asset inventory database', 'Discovery scan logs'],
              lastAudit: new Date().toISOString()
            },
            {
              id: 'PR.AC-1',
              description: 'Identities and credentials are issued, managed, verified, revoked',
              implementation: 'User account management with role-based access',
              status: 'compliant',
              evidence: ['User management logs', 'Access control policies'],
              lastAudit: new Date().toISOString()
            }
          ],
          overallScore: 92
        }
      ],
      
      monitoringEnabled: true,
      realTimeAlerts: true,
      auditMode: false,
      
      // Security Actions
      addSecurityEvent: (eventData) => {
        const event: SecurityEvent = {
          ...eventData,
          id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        }
        
        set((state) => {
          const updatedEvents = [event, ...state.securityEvents].slice(0, 1000) // Keep last 1000 events
          
          // Update metrics
          const criticalAlerts = event.riskLevel === RiskLevel.CRITICAL 
            ? state.securityMetrics.criticalAlerts + 1 
            : state.securityMetrics.criticalAlerts
            
          const updatedThreatLandscape = {
            ...state.securityMetrics.threatLandscape,
            [event.strideCategory]: state.securityMetrics.threatLandscape[event.strideCategory] + 1
          }
          
          return {
            securityEvents: updatedEvents,
            securityMetrics: {
              ...state.securityMetrics,
              totalEvents: state.securityMetrics.totalEvents + 1,
              criticalAlerts,
              threatLandscape: updatedThreatLandscape,
              lastAssessment: new Date().toISOString()
            }
          }
        })
        
        // Trigger automatic response for high-risk events
        if (event.riskLevel === RiskLevel.CRITICAL || event.riskLevel === RiskLevel.HIGH) {
          console.warn('🚨 High-risk security event detected:', event)
        }
      },
      
      updateThreatModel: (threatModel) => {
        set((state) => ({
          threatModels: state.threatModels.map(tm => 
            tm.id === threatModel.id ? threatModel : tm
          ).concat(state.threatModels.find(tm => tm.id === threatModel.id) ? [] : [threatModel])
        }))
      },
      
      createZeroTrustPolicy: (policyData) => {
        const policy: ZeroTrustPolicy = {
          ...policyData,
          id: `zt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
        
        set((state) => ({
          zeroTrustPolicies: [...state.zeroTrustPolicies, policy]
        }))
      },
      
      updateComplianceStatus: (frameworkId, requirementId, status) => {
        set((state) => ({
          complianceFrameworks: state.complianceFrameworks.map(framework => {
            if (framework.id === frameworkId) {
              const updatedRequirements = framework.requirements.map(req => 
                req.id === requirementId 
                  ? { ...req, status: status as any, lastAudit: new Date().toISOString() }
                  : req
              )
              
              // Recalculate compliance score
              const compliantCount = updatedRequirements.filter(req => req.status === 'compliant').length
              const overallScore = Math.round((compliantCount / updatedRequirements.length) * 100)
              
              return {
                ...framework,
                requirements: updatedRequirements,
                overallScore
              }
            }
            return framework
          })
        }))
      },
      
      calculateRiskScore: () => {
        const state = get()
        const recentEvents = state.securityEvents.filter(event => 
          new Date(event.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        )
        
        let riskScore = 0
        recentEvents.forEach(event => {
          switch (event.riskLevel) {
            case RiskLevel.LOW: riskScore += 1; break
            case RiskLevel.MEDIUM: riskScore += 3; break
            case RiskLevel.HIGH: riskScore += 7; break
            case RiskLevel.CRITICAL: riskScore += 15; break
          }
        })
        
        // Cap at 100
        riskScore = Math.min(riskScore, 100)
        
        set((state) => ({
          securityMetrics: {
            ...state.securityMetrics,
            riskScore,
            lastAssessment: new Date().toISOString()
          }
        }))
        
        return riskScore
      },
      
      generateThreatAssessment: () => {
        const threatModel: ThreatModel = {
          id: `threat_${Date.now()}`,
          name: 'Educational Gaming Platform Threat Assessment',
          description: 'Comprehensive threat analysis for cybersecurity education platform',
          assets: [
            'Student progress data',
            'Educational content',
            'User authentication system',
            'Game state data',
            'Web application infrastructure'
          ],
          threatActors: [
            'Curious students',
            'Malicious outsiders',
            'Automated bots',
            'Insider threats'
          ],
          attackVectors: [
            'Web application vulnerabilities',
            'Social engineering',
            'Credential compromise',
            'Client-side attacks',
            'Data interception'
          ],
          strideAssessment: {
            [StrideCategory.SPOOFING]: {
              likelihood: 30,
              impact: 40,
              riskScore: 12,
              mitigations: ['Strong authentication', 'Session management', 'User verification']
            },
            [StrideCategory.TAMPERING]: {
              likelihood: 20,
              impact: 60,
              riskScore: 12,
              mitigations: ['Input validation', 'Data integrity checks', 'Secure coding practices']
            },
            [StrideCategory.REPUDIATION]: {
              likelihood: 15,
              impact: 30,
              riskScore: 5,
              mitigations: ['Comprehensive logging', 'Digital signatures', 'Audit trails']
            },
            [StrideCategory.INFORMATION_DISCLOSURE]: {
              likelihood: 40,
              impact: 70,
              riskScore: 28,
              mitigations: ['Data encryption', 'Access controls', 'Privacy by design']
            },
            [StrideCategory.DENIAL_OF_SERVICE]: {
              likelihood: 25,
              impact: 50,
              riskScore: 13,
              mitigations: ['Rate limiting', 'Load balancing', 'Resource monitoring']
            },
            [StrideCategory.ELEVATION_OF_PRIVILEGE]: {
              likelihood: 10,
              impact: 80,
              riskScore: 8,
              mitigations: ['Principle of least privilege', 'Role-based access', 'Regular reviews']
            }
          },
          lastUpdated: new Date().toISOString()
        }
        
        set((state) => ({
          threatModels: [...state.threatModels, threatModel]
        }))
        
        return threatModel
      },
      
      enableContinuousMonitoring: () => {
        set({ monitoringEnabled: true, realTimeAlerts: true })
        
        // Simulate periodic security events for educational purposes
        const eventSimulation = setInterval(() => {
          const state = get()
          if (!state.monitoringEnabled) {
            clearInterval(eventSimulation)
            return
          }
          
          // Generate realistic security events
          const events = [
            {
              type: SecurityEventType.AUTHENTICATION_FAILURE,
              strideCategory: StrideCategory.SPOOFING,
              riskLevel: RiskLevel.LOW,
              source: 'auth_system',
              description: 'Failed login attempt with invalid credentials',
              mitigationStatus: 'resolved' as const,
              automaticResponse: 'Account lockout after 5 attempts',
              metadata: { attempts: Math.floor(Math.random() * 5) + 1 }
            },
            {
              type: SecurityEventType.SUSPICIOUS_ACTIVITY,
              strideCategory: StrideCategory.INFORMATION_DISCLOSURE,
              riskLevel: RiskLevel.MEDIUM,
              source: 'web_application',
              description: 'Unusual data access pattern detected',
              mitigationStatus: 'pending' as const,
              metadata: { accessCount: Math.floor(Math.random() * 50) + 10 }
            }
          ]
          
          if (Math.random() < 0.3) { // 30% chance of generating an event
            const randomEvent = events[Math.floor(Math.random() * events.length)]
            state.addSecurityEvent(randomEvent)
          }
        }, 30000) // Every 30 seconds
        
        return eventSimulation
      },
      
      disableContinuousMonitoring: () => {
        set({ monitoringEnabled: false, realTimeAlerts: false })
      },
      
      exportSecurityReport: () => {
        const state = get()
        const report = {
          generatedAt: new Date().toISOString(),
          metrics: state.securityMetrics,
          recentEvents: state.securityEvents.slice(0, 100),
          threatModels: state.threatModels,
          compliance: state.complianceFrameworks,
          recommendations: [
            'Continue monitoring for suspicious authentication patterns',
            'Review and update threat models quarterly',
            'Conduct regular security awareness training',
            'Implement additional data encryption for sensitive information',
            'Consider implementing behavioral analytics for anomaly detection'
          ]
        }
        
        return JSON.stringify(report, null, 2)
      }
    }),
    {
      name: 'security-monitoring-store',
      partialize: (state) => ({
        securityMetrics: state.securityMetrics,
        securityEvents: state.securityEvents.slice(0, 500), // Persist only recent events
        threatModels: state.threatModels,
        zeroTrustPolicies: state.zeroTrustPolicies,
        complianceFrameworks: state.complianceFrameworks
      })
    }
  )
)

// Security Monitoring Utilities
export class SecurityMonitoringService {
  private static instance: SecurityMonitoringService
  
  static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService()
    }
    return SecurityMonitoringService.instance
  }
  
  // STRIDE Threat Analysis
  analyzeStrideThreats(component: string, dataFlow: string[]): Record<StrideCategory, number> {
    const analysis: Record<StrideCategory, number> = {
      [StrideCategory.SPOOFING]: 0,
      [StrideCategory.TAMPERING]: 0,
      [StrideCategory.REPUDIATION]: 0,
      [StrideCategory.INFORMATION_DISCLOSURE]: 0,
      [StrideCategory.DENIAL_OF_SERVICE]: 0,
      [StrideCategory.ELEVATION_OF_PRIVILEGE]: 0
    }
    
    // Analyze based on component type and data flows
    if (component.includes('auth')) {
      analysis[StrideCategory.SPOOFING] += 30
      analysis[StrideCategory.ELEVATION_OF_PRIVILEGE] += 20
    }
    
    if (component.includes('api') || component.includes('endpoint')) {
      analysis[StrideCategory.TAMPERING] += 25
      analysis[StrideCategory.DENIAL_OF_SERVICE] += 35
    }
    
    if (dataFlow.includes('user_data') || dataFlow.includes('personal_info')) {
      analysis[StrideCategory.INFORMATION_DISCLOSURE] += 40
    }
    
    if (component.includes('logging') || component.includes('audit')) {
      analysis[StrideCategory.REPUDIATION] -= 10 // Logging reduces repudiation risk
    }
    
    return analysis
  }
  
  // Automated Risk Assessment
  assessRisk(events: SecurityEvent[]): { overallRisk: RiskLevel; recommendations: string[] } {
    let riskScore = 0
    const recommendations: string[] = []
    
    events.forEach(event => {
      switch (event.riskLevel) {
        case RiskLevel.LOW: riskScore += 1; break
        case RiskLevel.MEDIUM: riskScore += 3; break
        case RiskLevel.HIGH: riskScore += 7; break
        case RiskLevel.CRITICAL: riskScore += 15; break
      }
    })
    
    let overallRisk: RiskLevel
    if (riskScore < 5) {
      overallRisk = RiskLevel.LOW
      recommendations.push('Maintain current security posture')
    } else if (riskScore < 15) {
      overallRisk = RiskLevel.MEDIUM
      recommendations.push('Consider additional monitoring', 'Review access controls')
    } else if (riskScore < 30) {
      overallRisk = RiskLevel.HIGH
      recommendations.push('Immediate security review required', 'Implement additional controls')
    } else {
      overallRisk = RiskLevel.CRITICAL
      recommendations.push('URGENT: Security incident response required', 'Isolate affected systems')
    }
    
    return { overallRisk, recommendations }
  }
  
  // Zero Trust Validation
  validateZeroTrustAccess(request: {
    user: string
    resource: string
    context: Record<string, any>
  }): { allowed: boolean; reason: string; additionalControls: string[] } {
    // Simplified Zero Trust logic for educational purposes
    const additionalControls: string[] = []
    
    // Always verify - no implicit trust
    if (!request.user) {
      return { allowed: false, reason: 'No authenticated user', additionalControls: [] }
    }
    
    // Check resource sensitivity
    if (request.resource.includes('admin') || request.resource.includes('config')) {
      additionalControls.push('Require MFA', 'Log detailed access')
    }
    
    // Check context for suspicious patterns
    if (request.context.unusualTime || request.context.newDevice) {
      additionalControls.push('Additional verification required')
    }
    
    return {
      allowed: true,
      reason: 'Access granted with controls',
      additionalControls
    }
  }
}
