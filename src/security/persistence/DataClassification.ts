/**
 * 🔍 DATA CLASSIFICATION & COPPA COMPLIANCE SYSTEM
 * 
 * Comprehensive data classification and privacy compliance system for educational environments.
 * Ensures full COPPA compliance and secure data handling for K-12 cybersecurity education.
 * 
 * Features:
 * - Automatic PII detection and classification
 * - COPPA compliance validation
 * - FERPA educational privacy compliance
 * - Data retention policy enforcement
 * - Real-time privacy risk assessment
 * 
 * @author Feature Engineer Agent
 * @version 1.0.0
 * @since 2025-01-15
 */

/**
 * 📊 DATA CLASSIFICATION LEVELS
 * 
 * Defines security classification levels for all game data
 */
export enum DataClassification {
  PUBLIC = 'public',           // Publicly shareable data (scores, achievements)
  INTERNAL = 'internal',       // Internal game data (preferences, settings)
  CONFIDENTIAL = 'confidential', // Sensitive but non-PII (detailed progress)
  RESTRICTED = 'restricted'    // PII or sensitive personal data (NEVER for COPPA)
}

/**
 * 🛡️ PRIVACY COMPLIANCE LEVELS
 * 
 * Compliance framework alignment
 */
export enum ComplianceFramework {
  COPPA = 'coppa',           // Children's Online Privacy Protection Act
  FERPA = 'ferpa',           // Family Educational Rights and Privacy Act
  GENERAL = 'general'        // General privacy best practices
}

/**
 * 🎯 DATA SENSITIVITY ANALYSIS
 * 
 * Results of data sensitivity analysis
 */
interface SensitivityAnalysis {
  classification: DataClassification
  complianceLevel: ComplianceFramework[]
  piiDetected: boolean
  riskScore: number // 0-100, where 100 is highest risk
  violations: string[]
  recommendations: string[]
}

/**
 * 📋 PII DETECTION PATTERNS
 * 
 * Patterns for detecting personally identifiable information
 */
interface PIIPattern {
  name: string
  pattern: RegExp
  riskLevel: number
  description: string
  coppaViolation: boolean
}

/**
 * 🔐 DATA CLASSIFICATION ENGINE
 * 
 * Main engine for classifying and validating data privacy compliance
 */
export class DataClassificationEngine {
  private piiPatterns: PIIPattern[] = [
    {
      name: 'email',
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      riskLevel: 90,
      description: 'Email address detected',
      coppaViolation: true
    },
    {
      name: 'phone',
      pattern: /(\+1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
      riskLevel: 85,
      description: 'Phone number detected',
      coppaViolation: true
    },
    {
      name: 'ssn',
      pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g,
      riskLevel: 100,
      description: 'Social Security Number detected',
      coppaViolation: true
    },
    {
      name: 'full_name',
      pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
      riskLevel: 70,
      description: 'Potential full name detected',
      coppaViolation: true
    },
    {
      name: 'address',
      pattern: /\d{1,5}\s\w+\s(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|circle|cir|way|plaza|square|sq)/gi,
      riskLevel: 85,
      description: 'Street address detected',
      coppaViolation: true
    },
    {
      name: 'credit_card',
      pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
      riskLevel: 100,
      description: 'Credit card number detected',
      coppaViolation: true
    },
    {
      name: 'ip_address',
      pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
      riskLevel: 50,
      description: 'IP address detected',
      coppaViolation: false
    },
    {
      name: 'student_id',
      pattern: /\b(?:student|id)[-_]?\d{6,}\b/gi,
      riskLevel: 80,
      description: 'Student ID detected',
      coppaViolation: true
    }
  ]

  private allowedGameDataFields = [
    'playerLevel',
    'totalXP',
    'achievementsCount',
    'gamesCompleted',
    'sessionId',
    'lastGamePlayed',
    'criticalCheckpoints',
    'skillProgress',
    'gameProgress',
    'soundEnabled',
    'preferences',
    'highScores',
    'streakDays',
    'lastVisit'
  ]

  /**
   * 🔍 ANALYZE DATA SENSITIVITY
   * 
   * Comprehensively analyzes data for privacy compliance and security classification
   */
  analyzeDataSensitivity(data: any): SensitivityAnalysis {
    const dataString = this.serializeData(data)
    const violations: string[] = []
    const recommendations: string[] = []
    let piiDetected = false
    let maxRiskScore = 0

    // 🔍 PII Detection
    for (const pattern of this.piiPatterns) {
      const matches = dataString.match(pattern.pattern)
      if (matches) {
        piiDetected = true
        maxRiskScore = Math.max(maxRiskScore, pattern.riskLevel)
        violations.push(`${pattern.description}: ${matches.length} instance(s) found`)
        
        if (pattern.coppaViolation) {
          violations.push(`COPPA VIOLATION: ${pattern.name} is not allowed in children's data`)
          recommendations.push(`Remove all instances of ${pattern.name} from data`)
        }
      }
    }

    // 🏫 Educational Context Validation
    const educationalCompliance = this.validateEducationalCompliance(data)
    violations.push(...educationalCompliance.violations)
    recommendations.push(...educationalCompliance.recommendations)

    // 📊 Determine Classification
    const classification = this.determineClassification(maxRiskScore, piiDetected)
    const complianceLevel = this.determineComplianceLevel(violations)

    // 💡 Generate Recommendations
    if (recommendations.length === 0 && classification === DataClassification.PUBLIC) {
      recommendations.push('Data is safe for storage and transmission')
    }

    return {
      classification,
      complianceLevel,
      piiDetected,
      riskScore: maxRiskScore,
      violations,
      recommendations
    }
  }

  /**
   * ✅ VALIDATE COPPA COMPLIANCE
   * 
   * Specifically validates Children's Online Privacy Protection Act compliance
   */
  validateCOPPACompliance(data: any): {
    compliant: boolean
    violations: string[]
    recommendations: string[]
  } {
    const analysis = this.analyzeDataSensitivity(data)
    const coppaViolations = analysis.violations.filter(v => v.includes('COPPA'))
    
    return {
      compliant: coppaViolations.length === 0,
      violations: coppaViolations,
      recommendations: analysis.recommendations.filter(r => 
        r.toLowerCase().includes('remove') || r.toLowerCase().includes('coppa')
      )
    }
  }

  /**
   * 🎓 VALIDATE EDUCATIONAL COMPLIANCE
   * 
   * Validates FERPA and educational privacy requirements
   */
  validateEducationalCompliance(data: any): {
    violations: string[]
    recommendations: string[]
  } {
    const violations: string[] = []
    const recommendations: string[] = []

    // Check for unauthorized data fields
    if (typeof data === 'object' && data !== null) {
      for (const key of Object.keys(data)) {
        if (!this.allowedGameDataFields.includes(key) && !key.startsWith('temp_')) {
          violations.push(`Unauthorized data field: ${key}`)
          recommendations.push(`Remove or classify field: ${key}`)
        }
      }
    }

    // Check session ID format (should be anonymous)
    if (data.sessionId && typeof data.sessionId === 'string') {
      if (data.sessionId.length < 16) {
        violations.push('Session ID too short for anonymity')
        recommendations.push('Use longer, more anonymous session IDs')
      }
      
      // Should not contain patterns that could identify users
      if (/user|student|name|id\d{1,6}$/i.test(data.sessionId)) {
        violations.push('Session ID appears to contain identifying information')
        recommendations.push('Use completely anonymous session IDs')
      }
    }

    // Check for excessive data retention
    if (data.lastVisit) {
      const lastVisit = new Date(data.lastVisit)
      const daysSinceVisit = (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceVisit > 365) {
        violations.push('Data retention exceeds recommended 365-day limit')
        recommendations.push('Implement automatic data purging after 1 year')
      }
    }

    return { violations, recommendations }
  }

  /**
   * 🧹 SANITIZE DATA FOR STORAGE
   * 
   * Removes or anonymizes sensitive data for safe storage
   */
  sanitizeDataForStorage(data: any): {
    sanitizedData: any
    removedFields: string[]
    warnings: string[]
  } {
    const sanitizedData = JSON.parse(JSON.stringify(data)) // Deep clone
    const removedFields: string[] = []
    const warnings: string[] = []

    // Remove any detected PII
    const analysis = this.analyzeDataSensitivity(data)
    
    if (analysis.piiDetected) {
      for (const violation of analysis.violations) {
        if (violation.includes('COPPA VIOLATION')) {
          warnings.push(`Blocked COPPA violation: ${violation}`)
        }
      }
    }

    // Sanitize string fields
    this.sanitizeStringFields(sanitizedData, removedFields, warnings)

    // Ensure session ID is properly anonymized
    if (sanitizedData.sessionId && typeof sanitizedData.sessionId === 'string') {
      sanitizedData.sessionId = this.anonymizeSessionId(sanitizedData.sessionId)
    }

    // Add privacy protection timestamp
    sanitizedData._privacyValidated = new Date().toISOString()
    sanitizedData._dataClassification = analysis.classification

    return {
      sanitizedData,
      removedFields,
      warnings
    }
  }

  /**
   * 📊 GENERATE PRIVACY COMPLIANCE REPORT
   * 
   * Generates comprehensive privacy compliance report
   */
  generateComplianceReport(data: any): {
    summary: {
      compliant: boolean
      riskLevel: 'low' | 'medium' | 'high' | 'critical'
      classification: DataClassification
    }
    details: {
      coppaCompliant: boolean
      ferpaCompliant: boolean
      piiDetected: boolean
      dataAge: number // days
      violations: string[]
      recommendations: string[]
    }
    auditTrail: {
      analyzedAt: string
      dataSize: number
      fieldsAnalyzed: number
    }
  } {
    const analysis = this.analyzeDataSensitivity(data)
    const coppaCheck = this.validateCOPPACompliance(data)
    const educationalCheck = this.validateEducationalCompliance(data)

    const riskLevel = this.calculateRiskLevel(analysis.riskScore)
    const dataAge = this.calculateDataAge(data)

    return {
      summary: {
        compliant: coppaCheck.compliant && educationalCheck.violations.length === 0,
        riskLevel,
        classification: analysis.classification
      },
      details: {
        coppaCompliant: coppaCheck.compliant,
        ferpaCompliant: educationalCheck.violations.length === 0,
        piiDetected: analysis.piiDetected,
        dataAge,
        violations: analysis.violations,
        recommendations: analysis.recommendations
      },
      auditTrail: {
        analyzedAt: new Date().toISOString(),
        dataSize: JSON.stringify(data).length,
        fieldsAnalyzed: this.countObjectFields(data)
      }
    }
  }

  // 🔧 PRIVATE UTILITY METHODS

  private serializeData(data: any): string {
    try {
      return JSON.stringify(data, null, 2).toLowerCase()
    } catch {
      return String(data).toLowerCase()
    }
  }

  private determineClassification(riskScore: number, piiDetected: boolean): DataClassification {
    if (piiDetected || riskScore >= 80) {
      return DataClassification.RESTRICTED
    } else if (riskScore >= 50) {
      return DataClassification.CONFIDENTIAL
    } else if (riskScore >= 20) {
      return DataClassification.INTERNAL
    } else {
      return DataClassification.PUBLIC
    }
  }

  private determineComplianceLevel(violations: string[]): ComplianceFramework[] {
    const frameworks: ComplianceFramework[] = [ComplianceFramework.GENERAL]

    const hasCOPPAViolation = violations.some(v => v.includes('COPPA'))
    const hasEducationalData = violations.some(v => v.includes('student') || v.includes('educational'))

    if (!hasCOPPAViolation) {
      frameworks.push(ComplianceFramework.COPPA)
    }

    if (!hasEducationalData) {
      frameworks.push(ComplianceFramework.FERPA)
    }

    return frameworks
  }

  private sanitizeStringFields(obj: any, removedFields: string[], warnings: string[]): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        const original = obj[key]
        obj[key] = this.sanitizeString(obj[key])
        
        if (obj[key] !== original) {
          warnings.push(`Sanitized field: ${key}`)
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.sanitizeStringFields(obj[key], removedFields, warnings)
      }
    }
  }

  private sanitizeString(value: string): string {
    // Remove potential PII patterns
    let sanitized = value

    for (const pattern of this.piiPatterns) {
      if (pattern.coppaViolation) {
        sanitized = sanitized.replace(pattern.pattern, '[REDACTED]')
      }
    }

    return sanitized
  }

  private anonymizeSessionId(sessionId: string): string {
    // Ensure session ID is properly anonymized
    if (sessionId.length < 16) {
      return 'anon_' + Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15)
    }
    return sessionId
  }

  private calculateRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 90) return 'critical'
    if (riskScore >= 70) return 'high'
    if (riskScore >= 40) return 'medium'
    return 'low'
  }

  private calculateDataAge(data: any): number {
    if (data.lastVisit) {
      const lastVisit = new Date(data.lastVisit)
      return Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
    }
    return 0
  }

  private countObjectFields(obj: any): number {
    if (typeof obj !== 'object' || obj === null) return 0
    
    let count = 0
    for (const key in obj) {
      count++
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += this.countObjectFields(obj[key])
      }
    }
    return count
  }
}

/**
 * 🏭 DATA CLASSIFICATION FACTORY
 * 
 * Factory for creating configured data classification engines
 */
export class DataClassificationFactory {
  static createForEducational(): DataClassificationEngine {
    return new DataClassificationEngine()
  }

  static createForTesting(): DataClassificationEngine {
    const engine = new DataClassificationEngine()
    // Test environment might have relaxed requirements
    return engine
  }
}

// 📊 UTILITY FUNCTIONS

/**
 * Quick validation for simple game data
 */
export function isGameDataCOPPACompliant(data: any): boolean {
  const engine = new DataClassificationEngine()
  const result = engine.validateCOPPACompliance(data)
  return result.compliant
}

/**
 * Quick sanitization for game data storage
 */
export function sanitizeGameData(data: any): any {
  const engine = new DataClassificationEngine()
  const result = engine.sanitizeDataForStorage(data)
  return result.sanitizedData
}

export default DataClassificationEngine
