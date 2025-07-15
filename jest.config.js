// Jest Configuration for EWU Cyber Games Portal
// Educational Cybersecurity Platform Testing Framework
// 
// This configuration sets up Jest testing for our cybersecurity education platform.
// It's designed to help middle school students (ages 10-14) learn cybersecurity
// concepts through well-tested, reliable code.
//
// Learning Objectives:
// - Understand how automated testing ensures code quality
// - Learn about test environments and configuration
// - See how testing supports security and reliability

const nextJest = require('next/jest')

// Create Jest configuration using Next.js helper
// This ensures our tests work properly with Next.js features
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  // Coverage configuration - aim for 90%+ coverage
  // This helps us ensure our educational content is thoroughly tested
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx', // Next.js layout files
    '!src/app/page.tsx',   // Main page (tested via e2e)
    '!**/*.stories.{js,jsx,ts,tsx}', // Storybook files
  ],
  
  // Coverage thresholds - maintain high quality for educational content
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Critical security components need higher coverage
    'src/security/**/*.{ts,tsx}': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    // Games should be well-tested for student engagement
    'src/games/**/*.{ts,tsx}': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Test environment setup
  testEnvironment: 'jsdom', // Browser-like environment for React components
  
  // Setup files - run before each test
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Module path mapping - matches Next.js path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/games/(.*)$': '<rootDir>/src/games/$1',
    '^@/security/(.*)$': '<rootDir>/src/security/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/stores/(.*)$': '<rootDir>/src/stores/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  
  // File extensions to process
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/out/',
  ],
  
  // Educational: Verbose output helps students understand test results
  verbose: true,
  
  // Security: Detect open handles to prevent resource leaks
  detectOpenHandles: true,
  
  // Performance: Force exit after tests complete
  forceExit: true,
  
  // Educational: Clear mock calls between tests for predictable results
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
}

// Export Jest configuration
// The createJestConfig helper ensures Next.js compatibility
module.exports = createJestConfig(config)
