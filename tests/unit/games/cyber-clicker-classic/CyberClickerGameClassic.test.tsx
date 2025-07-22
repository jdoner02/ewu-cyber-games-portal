/**
 * 🧪 TDD RED PHASE - Cyber Clicker Classic Component Tests
 * 
 * These tests are designed to FAIL first to identify the issues causing 
 * the client-side exception on the deployed site.
 * 
 * Following Test Guardian Agent protocol:
 * 1. RED: Write failing tests that expose the bug
 * 2. GREEN: Fix minimum code to make tests pass
 * 3. REFACTOR: Clean up implementation
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CyberClickerGameClassic from '@/app/games/cyber-clicker-classic/CyberClickerGame-classic'

// Mock the persistence manager to avoid dependency issues
jest.mock('@/utils/persistence/GameStatePersistence', () => ({
  GameStatePersistenceManager: jest.fn().mockImplementation(() => ({
    loadGameState: jest.fn().mockResolvedValue({ gameState: null }),
    saveGameState: jest.fn().mockResolvedValue(undefined)
  }))
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('CyberClickerGameClassic Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  /**
   * 🔴 RED PHASE TEST 1: Component should render without crashing
   * This test should FAIL if there are import or initialization issues
   */
  test('should render without throwing client-side exceptions', () => {
    expect(() => {
      render(<CyberClickerGameClassic />)
    }).not.toThrow()
  })

  /**
   * 🔴 RED PHASE TEST 2: Essential UI elements should be present
   * This test should FAIL if the component fails to render properly
   */
  test('should render essential game elements', () => {
    render(<CyberClickerGameClassic />)
    
    // Check for main title
    expect(screen.getByText('Cyber Clicker')).toBeInTheDocument()
    
    // Check for main click button
    expect(screen.getByText('Cyber Defense Core')).toBeInTheDocument()
    
    // Check for stats display
    expect(screen.getByText('Security Points')).toBeInTheDocument()
    expect(screen.getByText('Click Power')).toBeInTheDocument()
    expect(screen.getByText('Level')).toBeInTheDocument()
    expect(screen.getByText('Auto Defense')).toBeInTheDocument()
  })

  /**
   * 🔴 RED PHASE TEST 3: Game state should initialize properly
   * This test should FAIL if there are state initialization issues
   */
  test('should initialize with default game state', () => {
    render(<CyberClickerGameClassic />)
    
    // Check initial values are displayed
    expect(screen.getByText('0')).toBeInTheDocument() // Initial score (should be unique)
    expect(screen.getAllByText('1')).toHaveLength(2) // Initial click power and level (both should be 1)
  })

  /**
   * 🔴 RED PHASE TEST 4: Clicking should work without errors
   * This test should FAIL if the click handler has issues
   */
  test('should handle clicks without throwing errors', () => {
    render(<CyberClickerGameClassic />)
    
    const clickButton = screen.getByRole('button')
    
    expect(() => {
      fireEvent.click(clickButton)
    }).not.toThrow()
  })

  /**
   * 🔴 RED PHASE TEST 5: Game upgrades should render
   * This test should FAIL if the upgrades array has issues
   */
  test('should render security upgrades section', () => {
    render(<CyberClickerGameClassic />)
    
    expect(screen.getByText('Security Upgrades')).toBeInTheDocument()
    expect(screen.getByText('Firewall')).toBeInTheDocument()
    expect(screen.getByText('Antivirus')).toBeInTheDocument()
    expect(screen.getByText('Encryption')).toBeInTheDocument()
  })

  /**
   * 🔴 RED PHASE TEST 6: Persistence manager should not cause crashes
   * This test should FAIL if GameStatePersistenceManager import/usage is problematic
   */
  test('should handle persistence operations without crashing', async () => {
    const { rerender } = render(<CyberClickerGameClassic />)
    
    // Simulate component re-render to trigger useEffect
    expect(() => {
      rerender(<CyberClickerGameClassic />)
    }).not.toThrow()
  })

  /**
   * 🔴 RED PHASE TEST 7: Learning objectives should render
   * This test should FAIL if there are issues with the learning panel
   */
  test('should render learning objectives section', () => {
    render(<CyberClickerGameClassic />)
    
    expect(screen.getByText('Learning Objectives')).toBeInTheDocument()
    expect(screen.getByText('Cybersecurity Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('Game Mechanics as Learning')).toBeInTheDocument()
  })
})
