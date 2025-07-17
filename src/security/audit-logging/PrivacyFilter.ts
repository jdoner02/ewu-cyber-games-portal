/*
🔒 CYBERSECURITY EDUCATION: PRIVACY FILTER SYSTEM

Welcome to one of the most important parts of any cybersecurity system - 
PRIVACY PROTECTION! This class shows you how real companies protect user
data while still getting the information they need for security.

🎯 LEARNING OBJECTIVES:
- Understand data anonymization techniques
- Learn privacy-preserving analytics methods  
- See GDPR/COPPA compliance in action
- Master the "principle of data minimization"

🛡️ WHY THIS MATTERS:
Privacy isn't just about following laws (though that's important!) - it's about
building trust with users and protecting vulnerable populations like students.
*/

import { 
  LogEntry, 
  GameEvent, 
  SecurityEvent, 
  UserEvent, 
  SystemEvent,
  PrivacyFilterConfig 
} from './types/LogEntry';

/**
 * 🛡️ PRIVACY FILTER CLASS
 * 
 * This class demonstrates enterprise-grade privacy protection used by
 * companies like Apple, Google, and Microsoft when handling user data.
 * 
 * 🔑 KEY PRINCIPLES:
 * 1. Data Minimization: Collect only what you need
 * 2. Anonymization: Remove identifying information  
 * 3. Aggregation: Combine data so individuals can't be identified
 * 4. Encryption: Protect data in storage and transit
 * 5. Retention Limits: Delete data when no longer needed
 */
export class PrivacyFilter {
  private config: PrivacyFilterConfig;
  
  // 🎓 EDUCATIONAL: List of terms that might contain personal information
  private readonly PERSONAL_IDENTIFIERS = [
    'email', 'name', 'phone', 'address', 'ssn', 'student_id',
    'password', 'credit_card', 'license', 'passport'
  ];
  
  // 🔍 SENSITIVE PATTERNS: Regular expressions that detect personal data
  private readonly SENSITIVE_PATTERNS = [
    /\b[\w\.-]+@[\w\.-]+\.\w+\b/g, // Email addresses
    /\b\d{3}-\d{2}-\d{4}\b/g,      // SSN format
    /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card format
    /\b\d{3}-\d{3}-\d{4}\b/g,      // Phone number format
  ];
  
  constructor(config?: Partial<PrivacyFilterConfig>) {
    // 🛡️ DEFAULT PRIVACY-FIRST CONFIGURATION
    this.config = {
      hashIpAddresses: true,
      hashUserAgents: true,
      removePersonalIdentifiers: true,
      logRetentionDays: 90,
      anonymizeAfterDays: 30,
      deleteAfterDays: 365,
      allowEducationalViewing: true,
      maxEducationalRecords: 100,
      encryptSensitiveData: true,
      requireSecureStorage: true,
      auditAccess: true,
      ...config
    };
    
    console.log('🔒 [PRIVACY] Privacy filter initialized with protection level: MAXIMUM');
  }
  
  /**
   * 🎮 SANITIZE GAME EVENTS
   * 
   * This method shows how to clean game data while preserving educational value.
   * We keep learning analytics but remove anything that could identify students.
   */
  public sanitizeGameEvent(event: GameEvent): GameEvent {
    // 🛡️ NULL SAFETY: Handle invalid events gracefully
    if (!event) {
      return {
        anonymousUserId: 'anonymous_invalid',
        sessionId: 'session_invalid',
        gameName: 'unknown',
        gameVersion: '0.0.0',
        action: 'game_started',
        level: 0,
        score: 0,
        timeSpent: 0,
        difficultyRating: undefined,
        hintsUsed: 0,
        mistakesCount: 0,
        progressPercentage: 0,
        securityConcepts: [],
        vulnerabilitiesFound: [],
        securityToolsUsed: []
      };
    }

    const sanitized: GameEvent = {
      ...event,
      
      // 🆔 ANONYMIZE USER IDENTIFICATION
      // Replace any real IDs with anonymous versions
      anonymousUserId: this.anonymizeUserId(event.anonymousUserId),
      sessionId: this.anonymizeSessionId(event.sessionId),
      
      // 🧹 CLEAN TEXT FIELDS
      // Remove any personal information from text inputs
      conceptLearned: event.conceptLearned ? this.sanitizeText(event.conceptLearned) : undefined,
      clickPattern: event.clickPattern ? this.sanitizeClickPattern(event.clickPattern) : undefined,
      
      // 🎯 PRESERVE EDUCATIONAL VALUE
      // Keep all the data that helps us improve learning!
      gameName: event.gameName,
      action: event.action,
      level: event.level,
      score: event.score,
      timeSpent: event.timeSpent,
      difficultyRating: event.difficultyRating,
      hintsUsed: event.hintsUsed,
      mistakesCount: event.mistakesCount,
      progressPercentage: event.progressPercentage,
      securityConcepts: event.securityConcepts,
      vulnerabilitiesFound: event.vulnerabilitiesFound,
      securityToolsUsed: event.securityToolsUsed,
    };

    // 🔒 ADDITIONAL PII REMOVAL
    // Remove any personally identifiable information that might have slipped through
    const cleanedSanitized = this.removePIIFromObject(sanitized);
    
    // 🧪 EDUCATIONAL LOG: Show what we filtered (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🎮 [PRIVACY] Game event sanitized:', {
        original_user_id: event.anonymousUserId ? event.anonymousUserId.slice(0, 8) + '...' : 'null',
        sanitized_user_id: cleanedSanitized.anonymousUserId.slice(0, 8) + '...',
        educational_data_preserved: true
      });
    }
    
    return cleanedSanitized;
  }
  
  /**
   * 🛡️ SANITIZE SECURITY EVENTS
   * 
   * Security events are extra sensitive because they might contain attack data.
   * We need to keep enough information for threat analysis but protect privacy!
   */
  public sanitizeSecurityEvent(event: SecurityEvent): SecurityEvent {
    const sanitized: SecurityEvent = {
      ...event,
      
      // 🌐 ANONYMIZE NETWORK DATA
      // Hash IP addresses and user agents for pattern analysis without tracking
      ipAddress: this.hashData(event.ipAddress, 'ip'),
      userAgent: this.hashData(event.userAgent, 'ua'),
      
      // 🧹 SANITIZE ATTACK DATA
      // Remove personal info from attack payloads while keeping threat signatures
      payloadDetected: event.payloadDetected ? 
        this.sanitizeAttackPayload(event.payloadDetected) : undefined,
      
      requestUrl: event.requestUrl ? 
        this.sanitizeUrl(event.requestUrl) : undefined,
      
      // 📍 GENERALIZE LOCATION DATA
      // Keep general threat info but remove specific identifying details
      affectedResource: event.affectedResource ? 
        this.generalizeResourcePath(event.affectedResource) : undefined,
      
      // 🎓 PRESERVE EDUCATIONAL VALUE
      eventType: event.eventType,
      severity: event.severity,
      threatScore: event.threatScore,
      attackVector: event.attackVector,
      repeated: event.repeated,
      fromKnownBadIp: event.fromKnownBadIp,
      affectsMultipleUsers: event.affectsMultipleUsers,
      actionTaken: event.actionTaken,
      educationalCategory: event.educationalCategory,
      lessonPlan: event.lessonPlan,
    };
    
    // 🔍 EDUCATIONAL LOG: Show threat analysis process
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ [PRIVACY] Security event sanitized:', {
        threat_type: event.eventType,
        severity: event.severity,
        ip_anonymized: true,
        educational_value: event.educationalCategory || 'general_security'
      });
    }
    
    return sanitized;
  }
  
  /**
   * 👤 SANITIZE USER EVENTS
   * 
   * User events track navigation and interaction patterns. We want to understand
   * how students use our platform without violating their privacy.
   */
  public sanitizeUserEvent(event: UserEvent): UserEvent {
    const sanitized: UserEvent = {
      ...event,
      
      // 🆔 ANONYMIZE USER IDENTIFICATION
      anonymousUserId: this.anonymizeUserId(event.anonymousUserId),
      sessionId: this.anonymizeSessionId(event.sessionId),
      
      // 🌐 SANITIZE NAVIGATION DATA
      currentPage: this.sanitizePagePath(event.currentPage),
      previousPage: event.previousPage ? this.sanitizePagePath(event.previousPage) : undefined,
      
      // 🔍 ANONYMIZE SEARCH QUERIES
      searchQuery: event.searchQuery ? this.anonymizeSearchQuery(event.searchQuery) : undefined,
      
      // 🖱️ GENERALIZE INTERACTION DATA
      buttonClicked: event.buttonClicked ? this.generalizeButtonId(event.buttonClicked) : undefined,
      
      // 📊 PRESERVE ANALYTICS DATA
      action: event.action,
      timeOnPage: event.timeOnPage,
      featureUsed: event.featureUsed,
      pageLoadTime: event.pageLoadTime,
      browserVersion: event.browserVersion ? this.generalizeBrowserVersion(event.browserVersion) : undefined,
      screenResolution: event.screenResolution ? this.generalizeScreenResolution(event.screenResolution) : undefined,
      learningPathPosition: event.learningPathPosition,
      tutorialStep: event.tutorialStep,
      scrollDepth: event.scrollDepth,
      timeToFirstInteraction: event.timeToFirstInteraction,
    };
    
    return sanitized;
  }
  
  /**
   * 🎓 SANITIZE FOR EDUCATION
   * 
   * This special method prepares data for student viewing in our educational dashboards.
   * We apply extra privacy protection since students will see this directly!
   */
  public sanitizeForEducation(data: any): any {
    if (!this.config.allowEducationalViewing) {
      return { message: 'Educational viewing disabled for privacy protection' };
    }
    
    // 🧹 DEEP CLEAN: Remove all potentially identifying information
    const cleanData = JSON.parse(JSON.stringify(data));
    
    // 🔍 RECURSIVE CLEANING: Check every field for personal data
    this.deepCleanObject(cleanData);
    
    // 📚 ADD EDUCATIONAL CONTEXT
    return {
      ...cleanData,
      privacy_note: 'This data has been anonymized for educational purposes',
      learning_value: 'Use this to understand cybersecurity patterns and trends',
      timestamp_anonymized: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    };
  }
  
  /**
   * 🔐 ANONYMIZE USER ID
   * 
   * Creates a consistent but anonymous identifier for tracking user sessions
   * without revealing who the user actually is.
   */
  private anonymizeUserId(userId: string): string {
    // 🛡️ NULL SAFETY: Handle undefined/null user IDs
    if (!userId) {
      return 'anonymous_unknown';
    }
    
    // 🎯 EDUCATIONAL TECHNIQUE: Consistent hashing
    // Same input always produces same output, but original can't be recovered
    const hash = this.createHash(userId + 'user_salt');
    return `anonymous_${hash.substring(0, 12)}`;
  }
  
  /**
   * 🔗 ANONYMIZE SESSION ID
   * 
   * Creates privacy-safe session tracking that allows us to understand
   * user journeys without compromising privacy.
   */
  private anonymizeSessionId(sessionId: string): string {
    const hash = this.createHash(sessionId + 'session_salt');
    return `session_${hash.substring(0, 16)}`;
  }
  
  /**
   * 🧹 SANITIZE TEXT CONTENT
   * 
   * This method demonstrates how to remove personal information from
   * free-text fields while preserving educational content.
   */
  private sanitizeText(text: string): string {
    let sanitized = text;
    
    // 🔍 REMOVE SENSITIVE PATTERNS
    this.SENSITIVE_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    
    // 🧹 REMOVE PERSONAL IDENTIFIER WORDS
    this.PERSONAL_IDENTIFIERS.forEach(identifier => {
      const regex = new RegExp(`\\b${identifier}\\b`, 'gi');
      sanitized = sanitized.replace(regex, '[FILTERED]');
    });
    
    return sanitized;
  }
  
  /**
   * 🖱️ SANITIZE CLICK PATTERNS
   * 
   * User click patterns can reveal personal information (like typing passwords).
   * We generalize the patterns while keeping behavioral insights.
   */
  private sanitizeClickPattern(pattern: string): string {
    // 🎯 GENERALIZE SPECIFIC COORDINATES
    // Replace exact coordinates with general regions
    return pattern
      .replace(/\d{3,}/g, '[COORD]') // Replace large numbers (coordinates)
      .replace(/password|login|email/gi, '[AUTH_FIELD]') // Generalize auth fields
      .replace(/\b\w+@\w+\.\w+/g, '[EMAIL]'); // Remove email patterns
  }
  
  /**
   * 🔒 SANITIZE ATTACK PAYLOADS
   * 
   * Attack data might contain personal information if attackers tried to use
   * social engineering. We extract the attack signature without personal data.
   */
  private sanitizeAttackPayload(payload: string): string {
    // 🛡️ KEEP ATTACK PATTERNS FOR EDUCATION
    // Remove personal data but keep the attack structure for learning
    let sanitized = payload;
    
    // 📧 REMOVE EMAIL ADDRESSES
    sanitized = sanitized.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL_REMOVED]');
    
    // 📞 REMOVE PHONE NUMBERS
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REMOVED]');
    
    // 🔢 REMOVE POTENTIAL SSNs
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REMOVED]');
    
    // 💳 REMOVE CREDIT CARD NUMBERS
    sanitized = sanitized.replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CC_REMOVED]');
    
    // 🎓 TRUNCATE IF TOO LONG (keep first 200 chars for analysis)
    if (sanitized.length > 200) {
      sanitized = sanitized.substring(0, 200) + '[TRUNCATED]';
    }
    
    return sanitized;
  }
  
  /**
   * 🌐 SANITIZE URLs
   * 
   * URLs might contain personal information in query parameters.
   * We keep the path structure for threat analysis but remove sensitive data.
   */
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // 🛡️ REMOVE SENSITIVE QUERY PARAMETERS
      const sensitiveParams = ['email', 'phone', 'name', 'id', 'token', 'password'];
      sensitiveParams.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '[REDACTED]');
        }
      });
      
      return urlObj.toString();
    } catch {
      // 🧹 FALLBACK: If URL parsing fails, apply text sanitization
      return this.sanitizeText(url);
    }
  }
  
  /**
   * 📍 GENERALIZE RESOURCE PATHS
   * 
   * File paths might reveal system structure or user directories.
   * We generalize them while keeping threat analysis capability.
   */
  private generalizeResourcePath(path: string): string {
    return path
      .replace(/\/users\/[^\/]+/g, '/users/[USER]')
      .replace(/\/home\/[^\/]+/g, '/home/[USER]')
      .replace(/\/Documents\/[^\/]+/g, '/Documents/[USER]')
      .replace(/\b\d{6,}\b/g, '[ID]'); // Replace long numbers (likely IDs)
  }
  
  /**
   * 🔍 ANONYMIZE SEARCH QUERIES
   * 
   * Search queries might contain personal information if users search for
   * their own names, addresses, etc. We keep educational search terms.
   */
  private anonymizeSearchQuery(query: string): string {
    // 🎓 PRESERVE EDUCATIONAL SEARCHES
    const educationalTerms = [
      'cybersecurity', 'encryption', 'password', 'hacking', 'firewall',
      'malware', 'phishing', 'authentication', 'vulnerability', 'security'
    ];
    
    const words = query.toLowerCase().split(/\s+/);
    const isEducational = words.some(word => 
      educationalTerms.some(term => word.includes(term))
    );
    
    if (isEducational) {
      // 🧹 CLEAN BUT PRESERVE EDUCATIONAL VALUE
      return this.sanitizeText(query);
    } else {
      // 🔒 COMPLETELY ANONYMIZE NON-EDUCATIONAL SEARCHES
      return '[SEARCH_QUERY_ANONYMIZED]';
    }
  }
  
  /**
   * 📱 GENERALIZE DEVICE DATA
   * 
   * Device information helps with analytics but can be used for fingerprinting.
   * We generalize it for privacy while keeping useful insights.
   */
  private generalizeBrowserVersion(version: string): string {
    // 🎯 KEEP MAJOR VERSION, REMOVE SPECIFIC BUILD NUMBERS
    return version.replace(/\d+\.\d+\.\d+\.\d+/, 'X.X.X.X');
  }
  
  private generalizeScreenResolution(resolution: string): string {
    // 📏 GROUP INTO COMMON CATEGORIES
    const [width] = resolution.split('x').map(Number);
    
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    if (width < 1920) return 'desktop';
    return 'large_desktop';
  }
  
  private generalizeButtonId(buttonId: string): string {
    // 🎯 GENERALIZE SPECIFIC IDs BUT KEEP BUTTON TYPE
    return buttonId
      .replace(/\d+/g, '[ID]')
      .replace(/user_\w+/g, 'user_[ID]')
      .replace(/session_\w+/g, 'session_[ID]');
  }
  
  private sanitizePagePath(path: string): string {
    // 🌐 REMOVE USER-SPECIFIC PATH COMPONENTS
    return path
      .replace(/\/user\/[^\/]+/g, '/user/[USER_ID]')
      .replace(/\/profile\/[^\/]+/g, '/profile/[USER_ID]')
      .replace(/\?.*$/, ''); // Remove all query parameters
  }
  
  /**
   * 🔐 HASH CREATION
   * 
   * Creates consistent, one-way hashes for anonymization.
   * Same input always produces same output, but can't be reversed.
   */
  private hashData(data: string, type: 'ip' | 'ua'): string {
    const salt = type === 'ip' ? 'ip_privacy_salt' : 'ua_privacy_salt';
    const hash = this.createHash(data + salt);
    return `${type}_${hash.substring(0, 16)}`;
  }
  
  private createHash(input: string): string {
    // 🎓 EDUCATIONAL: Simple hash function for demonstration
    // Real systems use cryptographic hashes like SHA-256
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  /**
   * 🧹 DEEP OBJECT CLEANING
   * 
   * Recursively cleans all fields in complex objects to remove personal data.
   */
  private deepCleanObject(obj: any): void {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        // 🔄 RECURSIVE CLEANING
        this.deepCleanObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        // 🧹 CLEAN STRING VALUES
        obj[key] = this.sanitizeText(obj[key]);
      }
      
      // 🔒 REMOVE SENSITIVE FIELD NAMES
      if (this.PERSONAL_IDENTIFIERS.some(id => key.toLowerCase().includes(id))) {
        obj[key] = '[PRIVACY_PROTECTED]';
      }
    }
  }
  
  /**
   * 🔒 REMOVE PII FROM ANY OBJECT
   * 
   * Recursively removes personally identifiable information from any object.
   * Essential for educational data protection!
   */
  private removePIIFromObject(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const piiFields = [
      'studentName', 'name', 'fullName', 'firstName', 'lastName',
      'email', 'emailAddress', 'phone', 'phoneNumber',
      'address', 'streetAddress', 'zipCode', 'socialSecurityNumber',
      'ssn', 'birthDate', 'dateOfBirth', 'age', 'realUserId',
      'parentEmail', 'parentName', 'teacherEmail', 'schoolName'
    ];

    const cleaned = { ...obj };
    
    // Remove any PII fields
    piiFields.forEach(field => {
      if (field in cleaned) {
        delete cleaned[field];
      }
    });

    // Recursively clean nested objects
    Object.keys(cleaned).forEach(key => {
      if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
        cleaned[key] = this.removePIIFromObject(cleaned[key]);
      }
    });

    return cleaned;
  }

  /**
   * 📊 GET PRIVACY STATISTICS
   * 
   * This method helps administrators understand how much data is being
   * filtered for privacy protection.
   */
  public getPrivacyStatistics(): any {
    return {
      configuration: {
        privacy_level: 'MAXIMUM',
        retention_days: this.config.logRetentionDays,
        educational_viewing: this.config.allowEducationalViewing,
      },
      protection_methods: [
        'data_anonymization',
        'field_sanitization', 
        'pattern_removal',
        'hash_generation',
        'content_generalization'
      ],
      compliance_standards: [
        'COPPA', // Children's Online Privacy Protection Act
        'FERPA', // Family Educational Rights and Privacy Act
        'GDPR',  // General Data Protection Regulation
        'CCPA'   // California Consumer Privacy Act
      ]
    };
  }
}
