/*
🎯 CYBERSECURITY EDUCATION: LOG ENTRY TYPE DEFINITIONS

Hey future cybersecurity analysts! This file defines the structure of our log entries.
In real cybersecurity systems, having well-defined log formats is CRITICAL for:

📊 Automated Analysis: Computers can process millions of logs per second
🔍 Pattern Recognition: AI can spot threats across huge datasets  
🚨 Alerting Systems: Instant notifications when bad things happen
📈 Compliance Reporting: Meet legal requirements for data protection

Learning these structures helps you understand how enterprise security works!
*/

/**
 * 📋 BASE LOG ENTRY INTERFACE
 * 
 * Every log entry in our system follows this structure. This is called a
 * "schema" and it ensures consistency across our entire platform.
 * 
 * 🎓 REAL-WORLD EXAMPLE: Companies like Google process billions of logs
 * daily using similar structured formats!
 */
export interface LogEntry {
  // 🆔 UNIQUE IDENTIFIER: Every log gets a unique ID for tracking
  id: string;
  
  // ⏰ PRECISE TIMESTAMP: When exactly did this event happen?
  // Uses ISO 8601 format for global compatibility
  timestamp: string;
  
  // 🏷️ EVENT CLASSIFICATION: What type of event is this?
  type: 'game_event' | 'security_event' | 'user_event' | 'system_event';
  
  // 🚨 SEVERITY LEVEL: How important is this event?
  level: 'low' | 'medium' | 'high' | 'critical' | 'info';
  
  // 📊 EVENT DATA: The actual details of what happened
  data: GameEvent | SecurityEvent | UserEvent | SystemEvent;
  
  // 🌐 SOURCE SYSTEM: Which part of our application created this log?
  source: string;
  
  // 🔢 VERSION TRACKING: Which version of our code was running?
  version: string;
  
  // 📋 OPTIONAL METADATA: Extra information for investigation
  metadata?: {
    [key: string]: any;
  };
}

/**
 * 🎮 GAME EVENT INTERFACE
 * 
 * Tracks everything students do while playing our cybersecurity games.
 * This helps us understand learning patterns and improve education!
 */
export interface GameEvent {
  // 🎯 GAME IDENTIFICATION
  gameName: string;
  gameVersion: string;
  
  // 👤 PRIVACY-SAFE USER TRACKING
  // We NEVER store real names or personal info!
  anonymousUserId: string;
  sessionId: string;
  
  // 🎮 GAME STATE INFORMATION
  action: 'game_started' | 'level_completed' | 'game_finished' | 'achievement_unlocked' | 
          'concept_learned' | 'mistake_made' | 'hint_used' | 'game_paused' | 'game_resumed';
  
  level?: number;
  score?: number;
  timeSpent: number; // in seconds
  
  // 🎓 EDUCATIONAL TRACKING
  conceptLearned?: string;
  difficultyRating?: 1 | 2 | 3 | 4 | 5;
  hintsUsed?: number;
  mistakesCount?: number;
  
  // 🏆 ACHIEVEMENT SYSTEM
  achievementUnlocked?: string;
  progressPercentage?: number;
  
  // 🔍 PATTERN ANALYSIS
  clickPattern?: string; // Sequence of user interactions
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  
  // 🛡️ CYBERSECURITY CONCEPT TRACKING
  // Which specific cybersecurity topics did the student encounter?
  securityConcepts?: string[];
  vulnerabilitiesFound?: string[];
  securityToolsUsed?: string[];
}

/**
 * 🛡️ SECURITY EVENT INTERFACE
 * 
 * This is where real cybersecurity magic happens! These events help us
 * detect and respond to potential threats in real-time.
 */
export interface SecurityEvent {
  // 🚨 THREAT CLASSIFICATION
  eventType: 'sql_injection' | 'xss_attempt' | 'brute_force' | 'unauthorized_access' |
            'privilege_escalation' | 'data_exfiltration' | 'suspicious_pattern' |
            'rate_limiting' | 'invalid_input' | 'malware_detected' | 'phishing_attempt';
  
  // 🎯 SEVERITY ASSESSMENT
  severity: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = critical
  threatScore: number; // 0-100 calculated risk score
  
  // 🌐 NETWORK INFORMATION (Privacy-Protected)
  ipAddress: string; // Will be hashed for privacy
  userAgent: string; // Will be hashed for privacy
  requestUrl?: string;
  httpMethod?: string;
  
  // 📋 ATTACK DETAILS
  attackVector?: string;
  payloadDetected?: string; // Sanitized version of malicious input
  affectedResource?: string;
  
  // 🔍 PATTERN ANALYSIS
  repeated: boolean; // Is this part of a repeated attack pattern?
  fromKnownBadIp: boolean; // Is this from a known malicious IP?
  affectsMultipleUsers: boolean; // Does this threaten multiple users?
  
  // 🛡️ DEFENSIVE ACTIONS
  actionTaken?: 'blocked' | 'monitored' | 'redirected' | 'rate_limited' | 'captcha_required';
  automaticResponse?: string;
  
  // 🎓 EDUCATIONAL CLASSIFICATION
  // What can students learn from this security event?
  educationalCategory?: 'web_attacks' | 'network_threats' | 'social_engineering' | 
                       'malware' | 'data_breaches' | 'authentication_attacks';
  
  // 📚 LEARNING OPPORTUNITIES
  // How can we turn this threat into a teaching moment?
  lessonPlan?: {
    concept: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    realWorldExample: string;
  };
}

/**
 * 👤 USER EVENT INTERFACE
 * 
 * Tracks how students navigate and use our platform while respecting
 * their privacy. This helps us improve the user experience!
 */
export interface UserEvent {
  // 🔐 PRIVACY-FIRST IDENTIFICATION
  anonymousUserId: string;
  sessionId: string;
  
  // 📱 INTERACTION TRACKING
  action: 'page_view' | 'button_click' | 'form_submission' | 'search_query' |
          'download_start' | 'video_play' | 'menu_navigation' | 'error_encountered';
  
  // 🌐 NAVIGATION INFORMATION
  currentPage: string;
  previousPage?: string;
  timeOnPage?: number; // seconds
  
  // 🎯 FEATURE USAGE
  featureUsed?: string;
  buttonClicked?: string;
  searchQuery?: string; // Anonymized/hashed for privacy
  
  // 📊 PERFORMANCE METRICS
  pageLoadTime?: number; // milliseconds
  errorMessage?: string;
  browserVersion?: string;
  screenResolution?: string;
  
  // 🎓 EDUCATIONAL CONTEXT
  learningPathPosition?: number;
  tutorialStep?: number;
  helpArticleViewed?: string;
  
  // 🔍 ENGAGEMENT METRICS
  scrollDepth?: number; // How much of the page did they see?
  clickHeatmap?: string; // Where on the page did they click?
  timeToFirstInteraction?: number; // How quickly did they engage?
}

/**
 * ⚙️ SYSTEM EVENT INTERFACE
 * 
 * Tracks technical events that help us maintain system health and security.
 * This is like the "vital signs" of our cybersecurity platform!
 */
export interface SystemEvent {
  // 🖥️ SYSTEM IDENTIFICATION
  component: 'web_server' | 'database' | 'authentication' | 'game_engine' |
            'security_scanner' | 'backup_system' | 'monitoring';
  
  // 📊 EVENT CLASSIFICATION
  action: 'startup' | 'shutdown' | 'error' | 'warning' | 'maintenance' |
          'backup_completed' | 'security_scan' | 'performance_alert';
  
  // 🔍 TECHNICAL DETAILS
  errorCode?: string;
  errorMessage?: string;
  stackTrace?: string; // For debugging (sanitized)
  
  // 📈 PERFORMANCE METRICS
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  responseTime?: number;
  
  // 🛡️ SECURITY STATUS
  securityScanResults?: {
    vulnerabilitiesFound: number;
    patchesNeeded: string[];
    securityScore: number;
  };
  
  // 🔄 MAINTENANCE INFORMATION
  maintenanceType?: 'scheduled' | 'emergency' | 'security_patch';
  downtime?: number; // seconds
  affectedUsers?: number;
  
  // 🎓 EDUCATIONAL VALUE
  // Even system events can be learning opportunities!
  teachingOpportunity?: {
    concept: string;
    explanation: string;
    preventionTips: string[];
  };
}

/**
 * 📊 LOG ANALYTICS INTERFACE
 * 
 * This interface defines the structure for our anonymized analytics data
 * that helps improve our educational platform.
 */
export interface LogAnalytics {
  // ⏰ TIME RANGE
  startTime: string;
  endTime: string;
  
  // 📈 EVENT STATISTICS
  totalEvents: number;
  eventsByType: {
    [eventType: string]: number;
  };
  
  // 🎮 GAME ANALYTICS
  popularGames: {
    gameName: string;
    playCount: number;
    averageCompletionTime: number;
  }[];
  
  // 🎓 LEARNING ANALYTICS
  conceptsMastered: {
    concept: string;
    masteryCount: number;
    averageAttempts: number;
  }[];
  
  // 🛡️ SECURITY ANALYTICS
  securityThreats: {
    threatType: string;
    count: number;
    severity: string;
  }[];
  
  // 👤 USER ENGAGEMENT
  engagementMetrics: {
    averageSessionTime: number;
    returnUserRate: number;
    featureAdoptionRate: number;
  };
}

/**
 * 🎯 PRIVACY FILTER CONFIGURATION
 * 
 * This interface defines what data should be filtered or anonymized
 * to protect student privacy while maintaining educational value.
 */
export interface PrivacyFilterConfig {
  // 🔐 ANONYMIZATION SETTINGS
  hashIpAddresses: boolean;
  hashUserAgents: boolean;
  removePersonalIdentifiers: boolean;
  
  // 📊 DATA RETENTION
  logRetentionDays: number;
  anonymizeAfterDays: number;
  deleteAfterDays: number;
  
  // 🎓 EDUCATIONAL EXCEPTIONS
  allowEducationalViewing: boolean;
  maxEducationalRecords: number;
  
  // 🛡️ SECURITY REQUIREMENTS
  encryptSensitiveData: boolean;
  requireSecureStorage: boolean;
  auditAccess: boolean;
}

// 🎯 EXPORT ALL INTERFACES
// This makes all our type definitions available throughout the application
export type LogEventData = GameEvent | SecurityEvent | UserEvent | SystemEvent;

// 🎓 EDUCATIONAL HELPER TYPES
// These help students understand the relationships between different data types
export type SecurityLevel = LogEntry['level'];
export type EventType = LogEntry['type'];
export type ThreatType = SecurityEvent['eventType'];

// 🏷️ TYPE GUARDS
// These functions help TypeScript understand what type of data we're working with
export function isGameEvent(data: LogEventData): data is GameEvent {
  return 'gameName' in data;
}

export function isSecurityEvent(data: LogEventData): data is SecurityEvent {
  return 'eventType' in data && 'severity' in data;
}

export function isUserEvent(data: LogEventData): data is UserEvent {
  return 'action' in data && 'currentPage' in data;
}

export function isSystemEvent(data: LogEventData): data is SystemEvent {
  return 'component' in data;
}
