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
import 'jest-canvas-mock'

// Mock canvas context for game testing
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn().mockImplementation((contextType) => {
    if (contextType === '2d') {
      return {
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        strokeRect: jest.fn(),
        fillText: jest.fn(),
        measureText: jest.fn(() => ({ width: 50 })),
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        setTransform: jest.fn(),
        transform: jest.fn(),
        createImageData: jest.fn(),
        getImageData: jest.fn(),
        putImageData: jest.fn(),
        drawImage: jest.fn(),
        canvas: {
          width: 800,
          height: 600
        }
      }
    }
    return null
  })
})

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
