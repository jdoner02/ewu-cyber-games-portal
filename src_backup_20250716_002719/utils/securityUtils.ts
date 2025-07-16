/**
 * Security Utility Functions
 * EWU Cyber Games Portal - Educational Cybersecurity Platform
 * 
 * This module provides essential security utility functions for
 * middle school students learning cybersecurity concepts.
 * 
 * Learning Objectives:
 * - Understand password security requirements
 * - Learn email validation for phishing prevention
 * - See how security functions protect applications
 * 
 * Educational Design:
 * - Functions are pure (no side effects) for easy testing
 * - Clear feedback helps students learn security concepts
 * - Code demonstrates cybersecurity best practices
 */

// Type definitions for security utility return values
export interface PasswordStrengthResult {
  isStrong: boolean
  score: number
  feedback: string[]
}

export interface EmailValidationResult {
  isValid: boolean
  feedback: string[]
  warnings?: string[]
}

/**
 * Password Strength Checker
 * 
 * This function evaluates password strength based on cybersecurity
 * best practices. It helps students understand what makes a password secure.
 * 
 * @param password - The password to evaluate
 * @returns Object with strength assessment and feedback
 * 
 * Educational Value:
 * - Teaches password security requirements
 * - Demonstrates input validation
 * - Shows how to provide helpful user feedback
 */
export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = []
  let score = 0
  
  // List of commonly used weak passwords
  // In a real application, this would be a larger database
  const commonPasswords = [
    'password', 'password123', '123456', '123456789', 
    'qwerty', 'abc123', 'password1', 'admin', 
    'letmein', 'welcome', 'monkey', 'dragon'
  ]
  
  // Check for common passwords first (major security risk)
  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('This password is commonly used - choose something unique!')
    score = 0 // Common passwords get zero score
  } else {
    // Length requirement (fundamental security principle)
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long')
    } else {
      score += 20 // Base score for minimum length
      
      // Bonus points for longer passwords
      if (password.length >= 12) score += 10
      if (password.length >= 16) score += 10
    }
    
    // Character diversity requirements
    
    // Uppercase letters (A-Z)
    if (!/[A-Z]/.test(password)) {
      feedback.push('Add at least one uppercase letter (A-Z)')
    } else {
      score += 15
    }
    
    // Lowercase letters (a-z)
    if (!/[a-z]/.test(password)) {
      feedback.push('Add at least one lowercase letter (a-z)')
    } else {
      score += 15
    }
    
    // Numbers (0-9)
    if (!/[0-9]/.test(password)) {
      feedback.push('Add at least one number (0-9)')
    } else {
      score += 15
    }
    
    // Special characters
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Add at least one special character (!@#$%^&*)')
    } else {
      score += 15
    }
    
    // Bonus for character variety
    const uniqueChars = new Set(password).size
    if (uniqueChars >= password.length * 0.7) {
      score += 10 // Bonus for variety
    }
  }
  
  // Determine if password is strong enough
  const isStrong = score >= 80 && feedback.length === 0
  
  return {
    isStrong,
    score: Math.min(score, 100), // Cap at 100%
    feedback
  }
}

/**
 * Email Validation and Security Checker
 * 
 * This function validates email addresses and checks for suspicious
 * patterns that might indicate phishing attempts.
 * 
 * @param email - The email address to validate
 * @returns Object with validation results and security warnings
 * 
 * Educational Value:
 * - Teaches email format validation
 * - Demonstrates phishing detection techniques
 * - Shows pattern recognition for security
 */
export function validateEmail(email: string): EmailValidationResult {
  const feedback: string[] = []
  const warnings: string[] = []
  
  // Basic format validation
  
  // Must contain @ symbol
  if (!email.includes('@')) {
    feedback.push('Email must contain an @ symbol')
  }
  
  // Must have content before and after @
  const parts = email.split('@')
  if (parts.length !== 2) {
    feedback.push('Email must have exactly one @ symbol')
  } else {
    const [localPart, domain] = parts
    
    // Local part (before @) validation
    if (localPart.length === 0) {
      feedback.push('Email must have content before the @ symbol')
    }
    
    // Domain validation
    if (domain.length === 0) {
      feedback.push('Email must have a valid domain')
    } else if (!domain.includes('.')) {
      feedback.push('Domain must contain at least one dot (.)')
    }
    
    // Security checks for suspicious domains
    const suspiciousDomains = [
      'lottery', 'winner', 'prize', 'bank-security', 
      'paypal-security', 'amazon-security', 'urgent-action'
    ]
    
    if (suspiciousDomains.some(suspicious => domain.toLowerCase().includes(suspicious))) {
      warnings.push('Domain looks suspicious - be careful!')
    }
    
    // Check for urgent/scam keywords in email
    const scamKeywords = ['urgent', 'immediate', 'expire', 'suspended', 'verify-now']
    if (scamKeywords.some(keyword => email.toLowerCase().includes(keyword))) {
      warnings.push('Contains urgent keywords often used in scams')
    }
  }
  
  // Email is valid if no validation errors
  const isValid = feedback.length === 0
  
  const result: EmailValidationResult = {
    isValid,
    feedback
  }
  
  // Only add warnings if there are any
  if (warnings.length > 0) {
    result.warnings = warnings
  }
  
  return result
}

/**
 * Additional Security Utilities
 * 
 * These functions can be expanded as students learn more
 * cybersecurity concepts throughout the course.
 */

/**
 * Generate a secure password suggestion
 * Helps students understand what a good password looks like
 */
export function generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const allChars = uppercase + lowercase + numbers + symbols
  let password = ''
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Check if a URL looks suspicious (basic phishing detection)
 * Teaches students about URL analysis
 */
export function checkSuspiciousURL(url: string): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  // Check for suspicious TLDs
  const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf']
  if (suspiciousTLDs.some(tld => url.toLowerCase().includes(tld))) {
    reasons.push('Uses suspicious top-level domain')
  }
  
  // Check for URL shorteners (could hide real destination)
  const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl']
  if (shorteners.some(shortener => url.toLowerCase().includes(shortener))) {
    reasons.push('Uses URL shortener - verify destination before clicking')
  }
  
  // Check for suspicious keywords
  const suspiciousKeywords = ['secure-login', 'verify-account', 'update-payment']
  if (suspiciousKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
    reasons.push('Contains suspicious keywords often used in phishing')
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons
  }
}

/**
 * Educational Notes for Students:
 * 
 * 1. Password Security:
 *    - Length matters more than complexity alone
 *    - Unique passwords prevent credential stuffing attacks
 *    - Password managers help create and store strong passwords
 * 
 * 2. Email Security:
 *    - Always verify sender authenticity
 *    - Look for urgent language that pressures quick action
 *    - Check domains carefully for typos or suspicious names
 * 
 * 3. General Security:
 *    - Defense in depth: use multiple security layers
 *    - User education is often the best defense
 *    - Stay updated on current attack techniques
 * 
 * 4. Testing Importance:
 *    - Tests ensure security functions work correctly
 *    - Security bugs can have serious consequences
 *    - Automated testing catches regressions early
 */
