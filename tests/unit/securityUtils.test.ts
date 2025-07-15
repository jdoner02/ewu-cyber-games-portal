/**
 * Simple Security Utility Unit Tests
 * EWU Cyber Games Portal - Educational Cybersecurity Platform
 * 
 * This test file demonstrates Test-Driven Development (TDD) principles
 * for basic security utility functions. This is a great starting point
 * for middle school students to understand testing concepts.
 * 
 * Learning Objectives:
 * - Understand the TDD cycle (Red-Green-Refactor)
 * - Learn to test pure functions (functions without side effects)
 * - See how testing validates cybersecurity logic
 * 
 * TDD Process:
 * 1. Write a failing test (RED) - describes what we want
 * 2. Write minimal code to pass (GREEN) - make it work
 * 3. Improve the code (REFACTOR) - make it better
 */

// Import the security utility functions we want to test
import { 
  checkPasswordStrength, 
  validateEmail,
  type PasswordStrengthResult,
  type EmailValidationResult
} from '../../src/utils/securityUtils'

/**
 * TEST GROUP 1: Password Strength Validation
 * 
 * These tests ensure our password strength checker works correctly.
 * Strong password validation is a fundamental cybersecurity concept.
 * 
 * Educational Value: Students learn about password security requirements
 */
describe('Password Security Utils', () => {

  describe('Password Strength Validation', () => {
    test('should reject passwords shorter than 8 characters', () => {
      // ARRANGE: Set up test data
      const shortPassword = '1234567' // 7 characters
      
      // ACT: Call the function we want to test
      const result = checkPasswordStrength(shortPassword)
      
      // ASSERT: Verify the expected behavior (should be marked as not strong)
      expect(result.isStrong).toBe(false)
      expect(result.feedback).toContain('Password must be at least 8 characters long')
    })

    test('should accept passwords with 8 or more characters', () => {
      // ARRANGE: Set up test data
      const longPassword = 'abcdefgh' // 8 characters
      
      // ACT: Call the function
      const result = checkPasswordStrength(longPassword)
      
      // ASSERT: Should not reject due to length
      expect(result.feedback).not.toContain('Password must be at least 8 characters long')
    })

    test('should require at least one uppercase letter', () => {
      // ARRANGE: Password with no uppercase
      const noUppercase = 'lowercase123!'
      
      // ACT: Test the password
      const result = checkPasswordStrength(noUppercase)
      
      // ASSERT: Should provide uppercase feedback
      expect(result.feedback).toContain('Add at least one uppercase letter (A-Z)')
    })

    test('should require at least one lowercase letter', () => {
      // ARRANGE: Password with no lowercase
      const noLowercase = 'UPPERCASE123!'
      
      // ACT: Test the password
      const result = checkPasswordStrength(noLowercase)
      
      // ASSERT: Should provide lowercase feedback
      expect(result.feedback).toContain('Add at least one lowercase letter (a-z)')
    })

    test('should require at least one number', () => {
      // ARRANGE: Password with no numbers
      const noNumbers = 'Password!'
      
      // ACT: Test the password
      const result = checkPasswordStrength(noNumbers)
      
      // ASSERT: Should provide number feedback
      expect(result.feedback).toContain('Add at least one number (0-9)')
    })

    test('should require at least one special character', () => {
      // ARRANGE: Password with no special characters (but not a common password)
      const noSpecial = 'MyUniquePassword123'
      
      // ACT: Test the password
      const result = checkPasswordStrength(noSpecial)
      
      // ASSERT: Should provide special character feedback
      expect(result.feedback).toContain('Add at least one special character (!@#$%^&*)')
    })

    test('should rate strong passwords highly', () => {
      // ARRANGE: A strong password meeting all criteria
      const strongPassword = 'MyStr0ng!P@ssw0rd'
      
      // ACT: Test the strong password
      const result = checkPasswordStrength(strongPassword)
      
      // ASSERT: Should be rated as strong
      expect(result.isStrong).toBe(true)
      expect(result.score).toBeGreaterThanOrEqual(80)
      expect(result.feedback).toHaveLength(0) // No feedback means no issues
    })
  })

  /**
   * TEST GROUP 2: Common Password Detection
   * 
   * These tests check if we can detect commonly used passwords.
   * Teaching students about common password risks is crucial.
   * 
   * Educational Value: Shows why unique passwords matter
   */
  describe('Common Password Detection', () => {
    test('should detect common passwords like "password123"', () => {
      // ARRANGE: Common weak password
      const commonPassword = 'password123'
      
      // ACT: Test the password
      const result = checkPasswordStrength(commonPassword)
      
      // ASSERT: Should detect it as common
      expect(result.feedback).toContain('This password is commonly used - choose something unique!')
    })

    test('should detect common passwords like "123456789"', () => {
      // ARRANGE: Another common weak password
      const commonPassword = '123456789'
      
      // ACT: Test the password
      const result = checkPasswordStrength(commonPassword)
      
      // ASSERT: Should detect it as common
      expect(result.feedback).toContain('This password is commonly used - choose something unique!')
    })

    test('should accept unique passwords that meet criteria', () => {
      // ARRANGE: Unique strong password
      const uniquePassword = 'CyberHero2024!Quest'
      
      // ACT: Test the password
      const result = checkPasswordStrength(uniquePassword)
      
      // ASSERT: Should not flag as common
      expect(result.feedback).not.toContain('This password is commonly used')
    })
  })
})

/**
 * TEST GROUP 3: Email Validation for Phishing Detection
 * 
 * These tests validate our email address checker.
 * Email validation helps students spot phishing attempts.
 * 
 * Educational Value: Students learn about email security
 */
describe('Email Security Utils', () => {

  describe('Email Format Validation', () => {
    test('should accept valid email addresses', () => {
      // ARRANGE: Valid email addresses
      const validEmails = [
        'student@school.edu',
        'teacher@university.edu',
        'admin@cybersecurity.org'
      ]
      
      // ACT & ASSERT: All should be valid
      validEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(true)
        expect(result.feedback).toHaveLength(0)
      })
    })

    test('should reject emails without @ symbol', () => {
      // ARRANGE: Invalid email format
      const invalidEmail = 'studentschool.edu'
      
      // ACT: Validate the email
      const result = validateEmail(invalidEmail)
      
      // ASSERT: Should be rejected
      expect(result.isValid).toBe(false)
      expect(result.feedback).toContain('Email must contain an @ symbol')
    })

    test('should reject emails without domain', () => {
      // ARRANGE: Email missing domain
      const invalidEmail = 'student@'
      
      // ACT: Validate the email
      const result = validateEmail(invalidEmail)
      
      // ASSERT: Should be rejected
      expect(result.isValid).toBe(false)
      expect(result.feedback).toContain('Email must have a valid domain')
    })
  })

  describe('Suspicious Email Detection', () => {
    test('should flag suspicious domains', () => {
      // ARRANGE: Email from suspicious domain
      const suspiciousEmail = 'winner@you-won-lottery.com'
      
      // ACT: Validate the email
      const result = validateEmail(suspiciousEmail)
      
      // ASSERT: Should be flagged as suspicious
      expect(result.warnings).toContain('Domain looks suspicious - be careful!')
    })

    test('should flag urgent/scam keywords', () => {
      // ARRANGE: Email with scam keywords
      const scamEmail = 'urgent-action@bank-security.com'
      
      // ACT: Validate the email
      const result = validateEmail(scamEmail)
      
      // ASSERT: Should warn about urgent keywords
      expect(result.warnings).toContain('Contains urgent keywords often used in scams')
    })
  })
})

/**
 * Test Summary and Next Steps
 * 
 * At this point, all our tests should FAIL because we haven't implemented
 * the functions yet. This is the "RED" phase of TDD.
 * 
 * Next Steps for TDD Green Phase:
 * 1. Create src/utils/securityUtils.ts
 * 2. Implement checkPasswordStrength function to make password tests pass
 * 3. Implement validateEmail function to make email tests pass
 * 4. Export both functions for use in components
 * 
 * Educational Benefits:
 * - Students see tests fail first (RED)
 * - Then implement minimal code to pass (GREEN)
 * - Finally refactor for better code quality (REFACTOR)
 * - Learn cybersecurity concepts through practical coding
 * 
 * Cybersecurity Learning Outcomes:
 * - Understand password strength requirements
 * - Learn about common password vulnerabilities
 * - Recognize email validation importance for phishing prevention
 * - See how testing ensures security functions work correctly
 */
