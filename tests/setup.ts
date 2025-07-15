// Test Setup for EWU Cyber Games Portal
// Educational Cybersecurity Platform Testing Configuration
//
// This file configures our testing environment to support educational
// cybersecurity games and security components for middle school students.
//
// Learning Objectives:
// - Understand test environment setup and configuration
// - Learn about testing library utilities and matchers
// - See how proper test setup supports reliable code

// Import Jest DOM matchers for better assertions
import '@testing-library/jest-dom'

// Setup test environment before each test
beforeEach(() => {
  // Reset all mocks for clean test state
  jest.clearAllMocks()
})

// Cleanup after each test
afterEach(() => {
  // Restore all mocks
  jest.restoreAllMocks()
})
