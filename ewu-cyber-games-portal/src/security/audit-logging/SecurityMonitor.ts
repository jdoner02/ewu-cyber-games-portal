/*
🔍 CYBERSECURITY EDUCATION: SECURITY MONITORING SYSTEM

Welcome to the heart of cybersecurity defense! This class demonstrates how
Security Operations Centers (SOCs) monitor thousands of systems 24/7 to
protect against cyber threats.

🎯 LEARNING OBJECTIVES:
- Understand real-time threat detection systems
- Learn pattern recognition for security analysis
- See automated incident response in action
- Master threat intelligence and correlation techniques

🛡️ REAL-WORLD APPLICATION:
Every major organization has systems like this running constantly:
- Banks detecting fraudulent transactions
- Hospitals protecting patient data  
- Government agencies preventing cyber espionage
- Gaming companies catching cheaters and hackers
*/

import { LogEntry, SecurityEvent, isSecurityEvent, ThreatType } from './types/LogEntry';

/**
 * 🛡️ SECURITY MONITOR CLASS
 * 
 * This class simulates enterprise-grade security monitoring used by
 * Fortune 500 companies and government agencies worldwide.
 * 
 * 🔑 KEY CAPABILITIES:
 * 1. Real-time Threat Detection: Spot attacks as they happen
 * 2. Pattern Analysis: Identify attack campaigns across time
 * 3. Threat Intelligence: Correlate with known bad actors
 * 4. Automated Response: Take defensive actions instantly
 * 5. Risk Scoring: Prioritize threats by severity
 */
export class SecurityMonitor {
  
  // 🧠 THREAT INTELLIGENCE DATABASE
  // In real systems, this would be constantly updated from global threat feeds
  private readonly KNOWN_ATTACK_PATTERNS = new Map<string, ThreatPattern>([
    ['rapid_requests', {
      name: 'DDoS Attack Pattern',
      description: 'High volume of requests from single source',
      severity: 'high',
      indicators: ['request_count > 100', 'time_window < 60s'],
      response: 'rate_limit',
      educationalNote: 'Distributed Denial of Service attacks overwhelm servers'
    }],
    ['sql_injection_sequence', {
      name: 'SQL Injection Campaign',
      description: 'Sequential database attack attempts',
      severity: 'critical',
      indicators: ['sql_keywords', 'multiple_attempts', 'parameter_manipulation'],
      response: 'block_immediate',
      educationalNote: 'Attackers try to access database by manipulating queries'
    }],
    ['privilege_escalation_chain', {
      name: 'Privilege Escalation Attack',
      description: 'Attempts to gain higher system permissions',
      severity: 'critical',
      indicators: ['admin_access_attempt', 'unauthorized_commands', 'system_enumeration'],
      response: 'lockdown_account',
      educationalNote: 'Hackers try to gain admin rights to control systems'
    }]
  ]);
  
  // 📊 REAL-TIME MONITORING STATE
  private threatStatistics = new Map<ThreatType, number>();
  private activeIncidents = new Map<string, SecurityIncident>();
  private alertThresholds = new Map<ThreatType, AlertThreshold>();
  
  // 🔄 SLIDING WINDOW FOR PATTERN DETECTION
  private recentEvents: LogEntry[] = [];
  private readonly MAX_RECENT_EVENTS = 1000;
  private readonly PATTERN_ANALYSIS_WINDOW = 300000; // 5 minutes
  
  constructor() {
    this.initializeMonitoring();
    console.log('🛡️ [SECURITY] Security monitoring system initialized');
    console.log('🎓 [EDUCATION] Learning real SOC (Security Operations Center) techniques!');
  }
  
  /**
   * 📊 ANALYZE BATCH OF SECURITY EVENTS
   * 
   * This is the main analysis engine that processes multiple security events
   * to identify attack patterns and coordinated threats.
   */
  public analyzeBatch(securityEvents: LogEntry[]): SecurityAnalysisReport {
    console.log(`🔍 [SECURITY] Analyzing batch of ${securityEvents.length} security events`);
    
    const report: SecurityAnalysisReport = {
      timestamp: new Date().toISOString(),
      eventsAnalyzed: securityEvents.length,
      threatsDetected: [],
      patternsFound: [],
      riskscore: 0,
      recommendedActions: [],
      educationalInsights: []
    };
    
    // 🎯 STEP 1: Individual Event Analysis
    securityEvents.forEach(event => {
      if (isSecurityEvent(event.data)) {
        this.analyzeIndividualEvent(event, report);
      }
    });
    
    // 🔍 STEP 2: Pattern Recognition Across Events
    this.detectAttackPatterns(securityEvents, report);
    
    // 📈 STEP 3: Risk Assessment and Scoring
    report.riskscore = this.calculateBatchRiskScore(securityEvents);
    
    // 🚨 STEP 4: Generate Automated Responses
    this.generateAutomatedResponses(report);
    
    // 🎓 STEP 5: Add Educational Context
    this.addEducationalInsights(report);
    
    // 📊 STEP 6: Update Statistics and State
    this.updateThreatStatistics(securityEvents);
    this.updateRecentEvents(securityEvents);
    
    // 🔔 STEP 7: Trigger Alerts if Necessary
    this.triggerAlertsIfNeeded(report);
    
    return report;
  }
  
  /**
   * 🔍 ANALYZE INDIVIDUAL SECURITY EVENT
   * 
   * Each security event gets individual analysis to determine its threat level
   * and immediate response requirements.
   */
  private analyzeIndividualEvent(event: LogEntry, report: SecurityAnalysisReport): void {
    const securityData = event.data as SecurityEvent;
    
    // 🎯 THREAT CLASSIFICATION
    const threatInfo: ThreatInfo = {
      eventId: event.id,
      threatType: securityData.eventType,
      severity: this.mapSeverityToLevel(securityData.severity),
      confidence: this.calculateThreatConfidence(securityData),
      timestamp: event.timestamp,
      details: {
        attackVector: securityData.attackVector || 'unknown',
        affectedResource: securityData.affectedResource || 'unknown',
        automaticResponse: securityData.actionTaken || 'none'
      }
    };
    
    report.threatsDetected.push(threatInfo);
    
    // 🚨 IMMEDIATE RESPONSE FOR CRITICAL THREATS
    if (threatInfo.severity === 'critical' && threatInfo.confidence > 0.8) {
      this.handleCriticalThreat(threatInfo);
    }
    
    // 🎓 EDUCATIONAL: Log threat analysis process
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 [THREAT ANALYSIS] ${securityData.eventType}:`, {
        severity: threatInfo.severity,
        confidence: Math.round(threatInfo.confidence * 100) + '%',
        response: securityData.actionTaken || 'monitoring'
      });
    }
  }
  
  /**
   * 🔗 DETECT ATTACK PATTERNS
   * 
   * This is where we spot coordinated attacks by looking for patterns
   * across multiple events. Real SOCs use machine learning for this!
   */
  private detectAttackPatterns(events: LogEntry[], report: SecurityAnalysisReport): void {
    // 🎯 TIME-BASED PATTERN DETECTION
    this.detectTimeBasedPatterns(events, report);
    
    // 🌐 SOURCE-BASED PATTERN DETECTION  
    this.detectSourceBasedPatterns(events, report);
    
    // 🎯 TARGET-BASED PATTERN DETECTION
    this.detectTargetBasedPatterns(events, report);
    
    // 🔄 SEQUENCE-BASED PATTERN DETECTION
    this.detectSequenceBasedPatterns(events, report);
  }
  
  /**
   * ⏰ TIME-BASED PATTERN DETECTION
   * 
   * Looks for unusual timing patterns that might indicate automated attacks
   * or coordinated human activity.
   */
  private detectTimeBasedPatterns(events: LogEntry[], report: SecurityAnalysisReport): void {
    const timeGroups = new Map<string, LogEntry[]>();
    
    // 📊 GROUP EVENTS BY TIME WINDOWS (1-minute buckets)
    events.forEach(event => {
      const timeKey = new Date(event.timestamp).toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
      if (!timeGroups.has(timeKey)) {
        timeGroups.set(timeKey, []);
      }
      timeGroups.get(timeKey)!.push(event);
    });
    
    // 🚨 DETECT SUSPICIOUS TIME PATTERNS
    timeGroups.forEach((groupEvents, timeKey) => {
      if (groupEvents.length > 10) { // More than 10 events in 1 minute
        const pattern: AttackPattern = {
          patternId: `time_burst_${timeKey}`,
          name: 'High-Frequency Attack Burst',
          description: `${groupEvents.length} security events in 1-minute window`,
          confidence: 0.85,
          severity: 'high',
          events: groupEvents.map(e => e.id),
          educationalNote: 'Automated attacks often create regular timing patterns'
        };
        
        report.patternsFound.push(pattern);
        
        console.log(`⏰ [PATTERN] Time burst detected: ${groupEvents.length} events at ${timeKey}`);
      }
    });
  }
  
  /**
   * 🌐 SOURCE-BASED PATTERN DETECTION
   * 
   * Identifies when multiple attacks come from the same source or network,
   * indicating a focused attack campaign.
   */
  private detectSourceBasedPatterns(events: LogEntry[], report: SecurityAnalysisReport): void {
    const sourceGroups = new Map<string, LogEntry[]>();
    
    events.forEach(event => {
      if (isSecurityEvent(event.data)) {
        const source = event.data.ipAddress || 'unknown';
        if (!sourceGroups.has(source)) {
          sourceGroups.set(source, []);
        }
        sourceGroups.get(source)!.push(event);
      }
    });
    
    // 🎯 DETECT SOURCES WITH MULTIPLE ATTACK TYPES
    sourceGroups.forEach((sourceEvents, source) => {
      if (sourceEvents.length > 5) {
        const attackTypes = new Set(sourceEvents.map(e => (e.data as SecurityEvent).eventType));
        
        if (attackTypes.size > 2) { // Multiple attack types from same source
          const pattern: AttackPattern = {
            patternId: `multi_attack_${source}`,
            name: 'Multi-Vector Attack Campaign',
            description: `${attackTypes.size} different attack types from source ${source}`,
            confidence: 0.9,
            severity: 'critical',
            events: sourceEvents.map(e => e.id),
            educationalNote: 'Advanced attackers use multiple techniques in sequence'
          };
          
          report.patternsFound.push(pattern);
          
          console.log(`🌐 [PATTERN] Multi-vector attack from ${source}: ${Array.from(attackTypes).join(', ')}`);
        }
      }
    });
  }
  
  /**
   * 🎯 TARGET-BASED PATTERN DETECTION
   * 
   * Identifies when attackers are focusing on specific resources or systems,
   * which might indicate targeted reconnaissance or exploitation.
   */
  private detectTargetBasedPatterns(events: LogEntry[], report: SecurityAnalysisReport): void {
    const targetGroups = new Map<string, LogEntry[]>();
    
    events.forEach(event => {
      if (isSecurityEvent(event.data)) {
        const target = event.data.affectedResource || 'unknown';
        if (!targetGroups.has(target)) {
          targetGroups.set(target, []);
        }
        targetGroups.get(target)!.push(event);
      }
    });
    
    // 🔍 DETECT FOCUSED TARGETING
    targetGroups.forEach((targetEvents, target) => {
      if (targetEvents.length > 3 && target !== 'unknown') {
        const pattern: AttackPattern = {
          patternId: `focused_target_${target.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: 'Focused Resource Targeting',
          description: `${targetEvents.length} attacks targeting ${target}`,
          confidence: 0.75,
          severity: 'medium',
          events: targetEvents.map(e => e.id),
          educationalNote: 'Attackers often probe specific systems repeatedly before exploiting'
        };
        
        report.patternsFound.push(pattern);
        
        console.log(`🎯 [PATTERN] Focused targeting: ${targetEvents.length} attacks on ${target}`);
      }
    });
  }
  
  /**
   * 🔄 SEQUENCE-BASED PATTERN DETECTION
   * 
   * Looks for attack sequences that follow known patterns like:
   * reconnaissance → vulnerability scanning → exploitation → privilege escalation
   */
  private detectSequenceBasedPatterns(events: LogEntry[], report: SecurityAnalysisReport): void {
    // 📚 KNOWN ATTACK SEQUENCES
    const killChainSequences = [
      ['reconnaissance', 'vulnerability_scan', 'exploitation'],
      ['brute_force', 'unauthorized_access', 'privilege_escalation'],
      ['sql_injection', 'data_exfiltration'],
      ['xss_attempt', 'session_hijacking', 'privilege_escalation']
    ];
    
    // 🔍 SORT EVENTS BY TIME
    const sortedEvents = events.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // 🎯 CHECK FOR KILL CHAIN SEQUENCES
    killChainSequences.forEach((sequence, index) => {
      const matchedEvents = this.findSequenceInEvents(sortedEvents, sequence);
      
      if (matchedEvents.length >= sequence.length) {
        const pattern: AttackPattern = {
          patternId: `kill_chain_${index}`,
          name: 'Cyber Kill Chain Sequence',
          description: `Detected attack sequence: ${sequence.join(' → ')}`,
          confidence: 0.95,
          severity: 'critical',
          events: matchedEvents.map(e => e.id),
          educationalNote: 'Cyber Kill Chain shows how attacks progress through stages'
        };
        
        report.patternsFound.push(pattern);
        
        console.log(`🔄 [PATTERN] Kill chain detected: ${sequence.join(' → ')}`);
      }
    });
  }
  
  /**
   * 🔍 FIND SEQUENCE IN EVENTS
   * 
   * Helper method to find if a sequence of attack types appears in chronological order
   */
  private findSequenceInEvents(events: LogEntry[], sequence: string[]): LogEntry[] {
    const matched: LogEntry[] = [];
    let sequenceIndex = 0;
    
    for (const event of events) {
      if (isSecurityEvent(event.data)) {
        const eventType = event.data.eventType;
        
        // 🎯 CHECK IF THIS EVENT MATCHES NEXT EXPECTED SEQUENCE ITEM
        if (eventType.includes(sequence[sequenceIndex]) || 
            sequence[sequenceIndex].includes(eventType)) {
          matched.push(event);
          sequenceIndex++;
          
          if (sequenceIndex >= sequence.length) {
            break; // Found complete sequence
          }
        }
      }
    }
    
    return sequenceIndex >= sequence.length ? matched : [];
  }
  
  /**
   * 📊 CALCULATE BATCH RISK SCORE
   * 
   * Assigns an overall risk score to the batch of events based on:
   * - Individual threat severities
   * - Pattern complexity
   * - Attack coordination
   * - Potential impact
   */
  private calculateBatchRiskScore(events: LogEntry[]): number {
    let score = 0;
    
    events.forEach(event => {
      if (isSecurityEvent(event.data)) {
        // 🎯 BASE SCORE FROM INDIVIDUAL EVENTS
        score += event.data.severity * 10;
        score += event.data.threatScore || 0;
        
        // 🚨 MULTIPLIERS FOR SPECIAL CONDITIONS
        if (event.data.repeated) score *= 1.5;
        if (event.data.fromKnownBadIp) score *= 2.0;
        if (event.data.affectsMultipleUsers) score *= 1.8;
      }
    });
    
    // 🔗 PATTERN BONUS: Coordinated attacks are more dangerous
    const uniqueSources = new Set(events
      .filter(e => isSecurityEvent(e.data))
      .map(e => (e.data as SecurityEvent).ipAddress)
    );
    
    if (uniqueSources.size > 1 && events.length > 5) {
      score *= 1.3; // Coordinated attack bonus
    }
    
    // 📊 NORMALIZE TO 0-100 SCALE
    return Math.min(Math.round(score), 100);
  }
  
  /**
   * 🤖 GENERATE AUTOMATED RESPONSES
   * 
   * Based on the analysis, determines what automated defensive actions
   * should be taken immediately.
   */
  private generateAutomatedResponses(report: SecurityAnalysisReport): void {
    const actions: string[] = [];
    
    // 🚨 CRITICAL THREAT RESPONSES
    const criticalThreats = report.threatsDetected.filter(t => t.severity === 'critical');
    if (criticalThreats.length > 0) {
      actions.push('Implement immediate IP blocking for critical threats');
      actions.push('Escalate to security team for manual review');
      actions.push('Increase monitoring sensitivity for affected resources');
    }
    
    // 🔗 PATTERN-BASED RESPONSES
    const criticalPatterns = report.patternsFound.filter(p => p.severity === 'critical');
    if (criticalPatterns.length > 0) {
      actions.push('Activate coordinated attack response protocol');
      actions.push('Implement temporary rate limiting');
      actions.push('Initiate forensic data collection');
    }
    
    // 📊 RISK-BASED RESPONSES
    if (report.riskscore > 70) {
      actions.push('Elevate security monitoring to high alert status');
      actions.push('Notify incident response team');
    } else if (report.riskscore > 40) {
      actions.push('Increase log collection frequency');
      actions.push('Monitor for pattern continuation');
    }
    
    report.recommendedActions = actions;
  }
  
  /**
   * 🎓 ADD EDUCATIONAL INSIGHTS
   * 
   * Transforms security analysis into educational content that helps
   * students understand cybersecurity concepts.
   */
  private addEducationalInsights(report: SecurityAnalysisReport): void {
    const insights: string[] = [];
    
    // 🛡️ THREAT TYPE EDUCATION
    const threatTypes = new Set(report.threatsDetected.map(t => t.threatType));
    threatTypes.forEach(threatType => {
      switch (threatType) {
        case 'sql_injection':
          insights.push('SQL Injection: Attackers manipulate database queries to access unauthorized data');
          break;
        case 'xss_attempt':
          insights.push('Cross-Site Scripting (XSS): Malicious scripts injected into websites to steal user data');
          break;
        case 'brute_force':
          insights.push('Brute Force: Attackers try many password combinations to break into accounts');
          break;
        case 'privilege_escalation':
          insights.push('Privilege Escalation: Attackers try to gain higher system permissions');
          break;
      }
    });
    
    // 🔗 PATTERN EDUCATION
    if (report.patternsFound.length > 0) {
      insights.push(`Pattern Analysis: Found ${report.patternsFound.length} attack patterns - this shows coordinated threats`);
    }
    
    // 📊 RISK EDUCATION
    if (report.riskscore > 50) {
      insights.push(`Risk Assessment: Score of ${report.riskscore}/100 indicates significant threat activity`);
    }
    
    report.educationalInsights = insights;
  }
  
  /**
   * 📊 UPDATE THREAT STATISTICS
   * 
   * Maintains running statistics about threat types and frequencies
   * for trend analysis and educational dashboards.
   */
  private updateThreatStatistics(events: LogEntry[]): void {
    events.forEach(event => {
      if (isSecurityEvent(event.data)) {
        const threatType = event.data.eventType;
        const current = this.threatStatistics.get(threatType) || 0;
        this.threatStatistics.set(threatType, current + 1);
      }
    });
  }
  
  /**
   * 🔄 UPDATE RECENT EVENTS BUFFER
   * 
   * Maintains a sliding window of recent events for pattern analysis
   */
  private updateRecentEvents(events: LogEntry[]): void {
    this.recentEvents.push(...events);
    
    // 🗑️ CLEANUP OLD EVENTS
    const cutoffTime = Date.now() - this.PATTERN_ANALYSIS_WINDOW;
    this.recentEvents = this.recentEvents.filter(event => 
      new Date(event.timestamp).getTime() > cutoffTime
    );
    
    // 📊 SIZE LIMIT
    if (this.recentEvents.length > this.MAX_RECENT_EVENTS) {
      this.recentEvents = this.recentEvents.slice(-this.MAX_RECENT_EVENTS);
    }
  }
  
  /**
   * 🚨 TRIGGER ALERTS IF NEEDED
   * 
   * Sends alerts to administrators when significant threats are detected
   */
  private triggerAlertsIfNeeded(report: SecurityAnalysisReport): void {
    if (report.riskscore > 70 || report.patternsFound.some(p => p.severity === 'critical')) {
      console.log('🚨 [ALERT] HIGH-PRIORITY SECURITY ALERT TRIGGERED');
      console.log(`Risk Score: ${report.riskscore}/100`);
      console.log(`Critical Patterns: ${report.patternsFound.filter(p => p.severity === 'critical').length}`);
      
      // 📱 In real systems: Send to SIEM, page security team, etc.
    }
  }
  
  /**
   * 🛡️ HANDLE CRITICAL THREAT
   * 
   * Immediate response to critical security threats
   */
  private handleCriticalThreat(threat: ThreatInfo): void {
    console.log(`🚨 [CRITICAL THREAT] Immediate response to ${threat.threatType}`);
    
    // 🔒 AUTOMATED DEFENSIVE ACTIONS
    switch (threat.threatType) {
      case 'sql_injection':
        console.log('🛡️ [AUTO-RESPONSE] Enabling SQL injection protection filters');
        break;
      case 'privilege_escalation':
        console.log('🔐 [AUTO-RESPONSE] Restricting administrative access');
        break;
      case 'brute_force':
        console.log('⏱️ [AUTO-RESPONSE] Implementing rate limiting');
        break;
    }
  }
  
  /**
   * 🎯 CALCULATE THREAT CONFIDENCE
   * 
   * Determines how confident we are that this is actually a threat
   * vs. a false positive.
   */
  private calculateThreatConfidence(event: SecurityEvent): number {
    let confidence = 0.5; // Base confidence
    
    // 🎯 CONFIDENCE BOOSTERS
    if (event.repeated) confidence += 0.3;
    if (event.fromKnownBadIp) confidence += 0.4;
    if (event.payloadDetected) confidence += 0.2;
    if (event.affectsMultipleUsers) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
  
  /**
   * 📊 MAP SEVERITY TO LEVEL
   * 
   * Converts numeric severity to categorical level
   */
  private mapSeverityToLevel(severity: number): 'low' | 'medium' | 'high' | 'critical' {
    if (severity >= 5) return 'critical';
    if (severity >= 4) return 'high';
    if (severity >= 3) return 'medium';
    return 'low';
  }
  
  /**
   * ⚙️ INITIALIZE MONITORING
   * 
   * Sets up the monitoring system with default configurations
   */
  private initializeMonitoring(): void {
    // 🚨 SET ALERT THRESHOLDS
    this.alertThresholds.set('sql_injection', { count: 3, timeWindow: 300000 });
    this.alertThresholds.set('xss_attempt', { count: 5, timeWindow: 300000 });
    this.alertThresholds.set('brute_force', { count: 10, timeWindow: 600000 });
    this.alertThresholds.set('privilege_escalation', { count: 1, timeWindow: 300000 });
    
    console.log('🔧 [MONITORING] Alert thresholds configured');
  }
  
  /**
   * 📊 GET MONITORING STATISTICS
   * 
   * Returns current monitoring statistics for dashboards
   */
  public getMonitoringStatistics(): any {
    return {
      threatStatistics: Object.fromEntries(this.threatStatistics),
      activeIncidents: this.activeIncidents.size,
      recentEventsCount: this.recentEvents.length,
      monitoringStatus: 'active',
      alertThresholds: Object.fromEntries(this.alertThresholds),
      lastUpdate: new Date().toISOString()
    };
  }
}

// 🎯 TYPE DEFINITIONS FOR SECURITY MONITORING

interface ThreatPattern {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  response: string;
  educationalNote: string;
}

interface SecurityIncident {
  id: string;
  startTime: string;
  status: 'active' | 'investigating' | 'resolved';
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  events: string[];
}

interface AlertThreshold {
  count: number;
  timeWindow: number; // milliseconds
}

interface ThreatInfo {
  eventId: string;
  threatType: ThreatType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: string;
  details: {
    attackVector: string;
    affectedResource: string;
    automaticResponse: string;
  };
}

interface AttackPattern {
  patternId: string;
  name: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  events: string[];
  educationalNote: string;
}

interface SecurityAnalysisReport {
  timestamp: string;
  eventsAnalyzed: number;
  threatsDetected: ThreatInfo[];
  patternsFound: AttackPattern[];
  riskscore: number;
  recommendedActions: string[];
  educationalInsights: string[];
}
