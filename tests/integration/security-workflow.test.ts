/**
 * Integration Tests for Security Features
 * EWU Cyber Games Portal - Educational Cybersecurity Platform
 * 
 * Integration tests verify that multiple components work together correctly.
 * These tests are crucial for cybersecurity applications where component
 * interactions can create security vulnerabilities.
 * 
 * Learning Objectives:
 * - Understand integration testing vs unit testing
 * - Learn how security features interact
 * - See real-world cybersecurity testing scenarios
 * 
 * Educational Value:
 * - Shows how password validation integrates with UI components
 * - Demonstrates email security in user workflows
 * - Tests security monitoring across multiple functions
 */

import { 
  checkPasswordStrength, 
  validateEmail, 
  generateSecurePassword,
  checkSuspiciousURL
} from '../../src/utils/securityUtils'

describe('Security Feature Integration Tests', () => {
  /**
   * TEST GROUP 1: Password Security Workflow
   * 
   * These tests verify the complete password security workflow
   * from validation to generation to user feedback.
   * 
   * Educational Value: Shows end-to-end security processes
   */
  describe('Password Security Workflow', () => {
    test('should provide complete password improvement journey', () => {
      // ARRANGE: Start with a weak password (simulating student input)
      const weakPassword = 'password'
      
      // ACT: Check the weak password
      const weakResult = checkPasswordStrength(weakPassword)
      
      // ASSERT: Should identify all weaknesses
      expect(weakResult.isStrong).toBe(false)
      expect(weakResult.feedback.length).toBeGreaterThan(0)
      expect(weakResult.feedback).toContain('This password is commonly used - choose something unique!')
      
      // ACT: Generate a secure password
      const securePassword = generateSecurePassword(12)
      const secureResult = checkPasswordStrength(securePassword)
      
      // ASSERT: Generated password should be strong
      expect(secureResult.isStrong).toBe(true)
      expect(secureResult.score).toBeGreaterThanOrEqual(80)
      expect(secureResult.feedback).toHaveLength(0)
      
      // Educational assertion: show the improvement
      expect(secureResult.score).toBeGreaterThan(weakResult.score)
    })

    test('should validate password improvement steps', () => {
      // ARRANGE: Simulate student improving password step by step
      const passwords = [
        'pass',           // Too short
        'password',       // Common (will get 0 score)
        'myuniquepass',   // Better but still weak
        'MyUniquepass',   // Added uppercase
        'MyUniquepass1',  // Added number
        'MyUniquepass1!'  // Added special character - should be strong
      ]
      
      const results = passwords.map(checkPasswordStrength)
      
      // ASSERT: Show progressive improvement (but skip common password)
      // Skip comparison with common password (index 1) as it gets 0 score
      expect(results[0].score).toBeGreaterThan(0) // Short password still gets some points
      expect(results[1].score).toBe(0) // Common password gets 0
      expect(results[2].score).toBeGreaterThan(results[1].score) // Better than common
      expect(results[3].score).toBeGreaterThan(results[2].score) // Uppercase added
      expect(results[4].score).toBeGreaterThan(results[3].score) // Number added
      expect(results[5].score).toBeGreaterThan(results[4].score) // Special char added
      
      // Final password should be strong
      expect(results[results.length - 1].isStrong).toBe(true)
    })
  })

  /**
   * TEST GROUP 2: Email Security Workflow
   * 
   * These tests verify email validation in realistic user scenarios
   * including phishing detection and user education.
   * 
   * Educational Value: Demonstrates phishing prevention
   */
  describe('Email Security Workflow', () => {
    test('should handle complete email validation scenario', () => {
      // ARRANGE: Various email scenarios a student might encounter
      const emailScenarios = [
        {
          email: 'student@school.edu',
          expectedValid: true,
          expectedWarnings: 0,
          scenario: 'legitimate school email'
        },
        {
          email: 'invalid-email',
          expectedValid: false,
          expectedWarnings: 0,
          scenario: 'malformed email'
        },
        {
          email: 'winner@you-won-lottery.com',
          expectedValid: true,
          expectedWarnings: 1,
          scenario: 'suspicious lottery scam'
        },
        {
          email: 'urgent-action@bank-security.com',
          expectedValid: true,
          expectedWarnings: 2, // Suspicious domain + urgent keywords
          scenario: 'phishing attempt'
        }
      ]
      
      // ACT & ASSERT: Test each scenario
      emailScenarios.forEach(({ email, expectedValid, expectedWarnings, scenario }) => {
        const result = validateEmail(email)
        
        expect(result.isValid).toBe(expectedValid)
        expect(result.warnings?.length || 0).toBe(expectedWarnings)
        
        // Educational: log the scenario for student understanding
        console.log(`Scenario: ${scenario}`)
        console.log(`Email: ${email}`)
        console.log(`Valid: ${result.isValid}`)
        console.log(`Warnings: ${result.warnings?.length || 0}`)
        console.log('---')
      })
    })

    test('should provide educational feedback progression', () => {
      // ARRANGE: Progressive email validation learning
      const learningSequence = [
        'student@',                    // Missing domain
        'student@school',              // Missing TLD
        'student@school.edu',          // Valid
        'student@urgent-bank.com'      // Valid but suspicious
      ]
      
      // ACT: Validate each step
      const results = learningSequence.map(validateEmail)
      
      // ASSERT: Learning progression
      expect(results[0].isValid).toBe(false) // Step 1: Learn about domains
      expect(results[1].isValid).toBe(false) // Step 2: Learn about TLDs
      expect(results[2].isValid).toBe(true)  // Step 3: Valid email
      expect(results[3].isValid).toBe(true)  // Step 4: Valid but warnings
      expect(results[3].warnings?.length).toBeGreaterThan(0)
    })
  })

  /**
   * TEST GROUP 3: Multi-Component Security Integration
   * 
   * These tests verify that different security components work together
   * to provide comprehensive protection.
   * 
   * Educational Value: Shows defense-in-depth principles
   */
  describe('Multi-Component Security Integration', () => {
    test('should handle complete user registration security check', () => {
      // ARRANGE: Simulate user registration with security validation
      const userRegistration = {
        email: 'student@ewu.edu',
        password: 'MySecurePassword123!',
        confirmPassword: 'MySecurePassword123!'
      }
      
      // ACT: Validate all security aspects
      const emailValidation = validateEmail(userRegistration.email)
      const passwordValidation = checkPasswordStrength(userRegistration.password)
      const passwordsMatch = userRegistration.password === userRegistration.confirmPassword
      
      // ASSERT: All security checks pass
      expect(emailValidation.isValid).toBe(true)
      expect(emailValidation.warnings?.length || 0).toBe(0)
      expect(passwordValidation.isStrong).toBe(true)
      expect(passwordsMatch).toBe(true)
      
      // Integration assertion: overall security score
      const overallSecurityScore = (
        (emailValidation.isValid ? 25 : 0) +
        passwordValidation.score +
        (passwordsMatch ? 25 : 0)
      )
      
      expect(overallSecurityScore).toBeGreaterThanOrEqual(90)
    })

    test('should detect and prevent common attack scenarios', () => {
      // ARRANGE: Common attack scenarios students should recognize
      const attackScenarios = [
        {
          name: 'Credential Stuffing',
          email: 'user@example.com',
          password: 'password123', // Common password
          expectSecure: false
        },
        {
          name: 'Phishing Registration',
          email: 'admin@bank-security.com', // Changed to trigger warning  
          password: 'TempPassword123!',
          expectSecure: false // Suspicious email domain
        },
        {
          name: 'Legitimate Registration',
          email: 'student@university.edu',
          password: 'MyUniquePassword2024!',
          expectSecure: true
        }
      ]
      
      // ACT & ASSERT: Test each attack scenario
      attackScenarios.forEach(scenario => {
        const emailCheck = validateEmail(scenario.email)
        const passwordCheck = checkPasswordStrength(scenario.password)
        
        const isSecure = emailCheck.isValid && 
                        passwordCheck.isStrong && 
                        (!emailCheck.warnings || emailCheck.warnings.length === 0)
        
        expect(isSecure).toBe(scenario.expectSecure)
        
        // Educational logging
        console.log(`Attack Scenario: ${scenario.name}`)
        console.log(`Detected as secure: ${isSecure}`)
        console.log(`Expected secure: ${scenario.expectSecure}`)
        console.log('---')
      })
    })
  })

  /**
   * TEST GROUP 4: Security Monitoring Integration
   * 
   * These tests verify that security events are properly detected
   * and logged across different components.
   * 
   * Educational Value: Shows security monitoring concepts
   */
  describe('Security Monitoring Integration', () => {
    test('should detect and categorize security events', () => {
      // ARRANGE: Various security events to monitor
      const securityEvents = [
        {
          type: 'weak_password_attempt',
          data: 'password123',
          expectedRisk: 'HIGH'
        },
        {
          type: 'suspicious_email',
          data: 'admin@bank-security.com', // This should trigger warnings
          expectedRisk: 'MEDIUM'
        },
        {
          type: 'strong_credentials',
          data: { email: 'user@school.edu', password: 'SecurePass123!' },
          expectedRisk: 'LOW'
        }
      ]
      
      // ACT & ASSERT: Process each security event
      securityEvents.forEach(event => {
        let riskLevel = 'LOW'
        
        if (event.type === 'weak_password_attempt') {
          const result = checkPasswordStrength(event.data as string)
          riskLevel = result.isStrong ? 'LOW' : 'HIGH'
        } else if (event.type === 'suspicious_email') {
          const result = validateEmail(event.data as string)
          riskLevel = (result.warnings && result.warnings.length > 0) ? 'MEDIUM' : 'LOW'
        } else if (event.type === 'strong_credentials') {
          const data = event.data as { email: string, password: string }
          const emailResult = validateEmail(data.email)
          const passwordResult = checkPasswordStrength(data.password)
          riskLevel = (emailResult.isValid && passwordResult.isStrong) ? 'LOW' : 'HIGH'
        }
        
        expect(riskLevel).toBe(event.expectedRisk)
      })
    })

    test('should integrate URL security checking', () => {
      // ARRANGE: URLs students might encounter
      const urlsToCheck = [
        'https://school.edu/login',
        'https://bit.ly/secure-login',
        'https://secure-login.bank-site.com'
      ]
      
      // ACT: Check each URL
      const urlResults = urlsToCheck.map(checkSuspiciousURL)
      
      // ASSERT: Security assessment
      expect(urlResults[0].isSuspicious).toBe(false) // School URL should be safe
      expect(urlResults[1].isSuspicious).toBe(true)  // URL shortener is suspicious
      expect(urlResults[2].isSuspicious).toBe(true)  // Suspicious domain keywords
      
      // Integration: combine with email checking
      const phishingEmail = 'Click here: https://bit.ly/bank-security'
      const emailResult = validateEmail('sender@suspicious.com')
      const hasShortUrl = phishingEmail.includes('bit.ly') && 
                         checkSuspiciousURL('https://bit.ly/bank-security').isSuspicious
      
      expect(hasShortUrl).toBe(true)
    })
  })
})

/**
 * Integration Test Summary and Learning Outcomes
 * 
 * These integration tests demonstrate several important concepts:
 * 
 * 1. Component Interaction: How security functions work together
 * 2. Real-World Scenarios: Testing actual attack and defense patterns
 * 3. Defense in Depth: Multiple security layers working together
 * 4. User Experience: Security that doesn't break usability
 * 5. Educational Progression: Tests that teach as they validate
 * 
 * For middle school students learning cybersecurity:
 * - See how individual security concepts combine for protection
 * - Understand that security is a system, not just individual features
 * - Learn to think like both attackers and defenders
 * - Practice identifying and preventing common attacks
 * 
 * Next Steps for Comprehensive Testing:
 * 1. Add E2E tests for complete user workflows
 * 2. Create performance tests for security functions
 * 3. Add accessibility tests for inclusive security
 * 4. Implement security regression tests
 * 
 * TDD Progression:
 * ✅ RED: Written failing tests first
 * ✅ GREEN: Implemented functions to pass tests
 * ✅ REFACTOR: Can now improve implementation with confidence
 * ✅ INTEGRATION: Verified components work together
 */
