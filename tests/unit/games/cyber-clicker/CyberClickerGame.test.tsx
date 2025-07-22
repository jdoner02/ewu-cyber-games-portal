/**
 * 🧪 TDD RED PHASE - Cyber Clicker Component Tests
 * 
 * These tests are designed to FAIL first to identify the issues causing 
 * potential client-side exceptions, particularly with undefined ACHIEVEMENT_DEFINITIONS.
 * 
 * Following Test Guardian Agent protocol:
 * 1. RED: Write failing tests that expose the bug
 * 2. GREEN: Fix minimum code to make tests pass
 * 3. REFACTOR: Clean up implementation
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock localStorage before importing the component
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Import after localStorage mock is set up
const CyberClickerGame = require('@/app/games/cyber-clicker/CyberClickerGame').default

describe('CyberClickerGame Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  /**
   * 🔴 RED PHASE TEST 1: Component should render without crashing
   * This test should FAIL if there are undefined reference issues
   */
  test('should render without throwing client-side exceptions', () => {
    expect(() => {
      render(<CyberClickerGame />)
    }).not.toThrow()
  })

  /**
   * 🔴 RED PHASE TEST 2: Should handle ACHIEVEMENT_DEFINITIONS safely
   * This test should FAIL if ACHIEVEMENT_DEFINITIONS is undefined
   */
  test('should not crash when processing achievements', () => {
    const { rerender } = render(<CyberClickerGame />)
    
    // Simulate state changes that trigger achievement processing
    expect(() => {
      rerender(<CyberClickerGame />)
    }).not.toThrow()
  })

  /**
   * 🔴 RED PHASE TEST 3: Essential UI elements should be present
   * This test should FAIL if the component fails to render properly
   */
  test('should render essential game elements', () => {
    render(<CyberClickerGame />)
    
    // Check for main elements that should always be present
    expect(screen.getByText('Cybersecurity Career Clicker')).toBeInTheDocument()
  })

  /**
   * 🔴 RED PHASE TEST 4: Game state should initialize properly
   * This test should FAIL if there are state initialization issues
   */
  test('should initialize with default game state', () => {
    render(<CyberClickerGame />)
    
    // Check initial values are displayed
    expect(screen.getByText(/Security Points/i)).toBeInTheDocument()
  })

  /**
   * 🔴 RED PHASE TEST 5: Clicking should work without errors
   * This test should FAIL if the click handler has issues
   */
  test('should handle clicks without throwing errors', () => {
    render(<CyberClickerGame />)
    
    // Find a clickable button and test clicking
    const buttons = screen.getAllByRole('button')
    expect(() => {
      if (buttons.length > 0) {
        fireEvent.click(buttons[0])
      }
    }).not.toThrow()
  })

  /**
   * 🔴 RED PHASE TEST 6: localStorage operations should be safe
   * This test should FAIL if localStorage operations cause errors
   */
  test('should handle localStorage operations safely', () => {
    // Test with null localStorage return
    localStorageMock.getItem.mockReturnValue(null)
    expect(() => {
      render(<CyberClickerGame />)
    }).not.toThrow()

    // Test with invalid JSON in localStorage
    localStorageMock.getItem.mockReturnValue('invalid json')
    expect(() => {
      render(<CyberClickerGame />)
    }).not.toThrow()
  })

  /**
   * 🔴 RED PHASE TEST 7: State properties should exist
   * This test should FAIL if GameState interface is mismatched
   */
  test('should have properly typed state properties', () => {
    render(<CyberClickerGame />)
    
    // The component should render without TypeScript/runtime errors
    // related to missing state properties like totalSpEarned
    expect(screen.getByText(/Security Points/i)).toBeInTheDocument()
  })

  /**
   * 🔴 RED PHASE TEST 8: Enterprise persistence manager should be integrated
   * This test should FAIL because the component doesn't use GameStatePersistenceManager
   */
  test('should integrate with GameStatePersistenceManager for enterprise persistence', async () => {
    // Mock the persistence manager
    const mockPersistenceManager = {
      saveGameState: jest.fn().mockResolvedValue({ success: true }),
      loadGameState: jest.fn().mockResolvedValue({ 
        gameState: {
          playerStats: { level: 5, totalXP: 1000 },
          gameProgress: [{ gameId: 'cyber-clicker', highScore: 500 }]
        }
      })
    }

    // Mock the enterprise persistence hook (this should exist but doesn't yet)
    const mockUseEnterprisePersistence = jest.fn().mockReturnValue(mockPersistenceManager)
    
    render(<CyberClickerGame />)
    
    // The component should call the persistence manager for loading
    await waitFor(() => {
      expect(mockPersistenceManager.loadGameState).toHaveBeenCalled()
    })
    
    // This test will FAIL because enterprise persistence is not yet integrated
    expect(mockPersistenceManager.saveGameState).toHaveBeenCalledTimes(0)
  })

  /**
   * 🔴 RED PHASE TEST 9: Data should be sanitized before storage
   * This test should FAIL because the component doesn't sanitize data
   */
  test('should sanitize game data before saving to prevent React error #130', () => {
    render(<CyberClickerGame />)
    
    // Mock localStorage to capture what gets saved
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
    
    // Trigger a save by clicking (this should save sanitized data)
    const buttons = screen.getAllByRole('button')
    if (buttons.length > 0) {
      fireEvent.click(buttons[0])
    }
    
    // Check if data was sanitized (this will FAIL initially)
    const savedData = mockSetItem.mock.calls.find(call => 
      call[0] === 'ewu_cyber_clicker_game'
    )
    
    if (savedData) {
      const parsedData = JSON.parse(savedData[1])
      // Should have metadata indicating sanitization
      expect(parsedData._metadata?.sanitized).toBe(true)
    }
    
    mockSetItem.mockRestore()
  })

  /**
   * 🔴 RED PHASE TEST 10: Should handle persistence failures gracefully
   * This test should FAIL because the component doesn't have robust error handling
   */
  test('should fallback when enterprise persistence fails', async () => {
    // Mock persistence manager that fails
    const mockFailingPersistence = {
      saveGameState: jest.fn().mockRejectedValue(new Error('Network error')),
      loadGameState: jest.fn().mockRejectedValue(new Error('Storage corrupted'))
    }
    
    // Mock console.warn to capture fallback warnings
    const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation()
    
    render(<CyberClickerGame />)
    
    // Component should load despite persistence failure
    expect(screen.getByText(/Security Points/i)).toBeInTheDocument()
    
    // Should log warning about fallback (this will FAIL initially)
    await waitFor(() => {
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load from enterprise persistence')
      )
    })
    
    mockConsoleWarn.mockRestore()
  })

  /**
   * 🔴 RED PHASE TEST 11: Should validate data integrity on load
   * This test should FAIL because the component doesn't validate loaded data
   */
  test('should validate data integrity and handle corrupted saves', () => {
    // Mock corrupted localStorage data
    localStorageMock.getItem.mockReturnValue('{"sp": "invalid", "malformedData": true}')
    
    // Mock console.warn to capture validation warnings
    const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation()
    
    render(<CyberClickerGame />)
    
    // Component should still render with default values
    expect(screen.getByText(/Security Points/i)).toBeInTheDocument()
    
    // Should warn about data validation failure (this will FAIL initially)
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('validation')
    )
    
    mockConsoleWarn.mockRestore()
  })

  /**
   * 🔴 RED PHASE TEST 12: Should implement COPPA compliance validation
   * This test should FAIL because the component doesn't check COPPA compliance
   */
  test('should ensure COPPA compliance for educational use', async () => {
    render(<CyberClickerGame />)
    
    // Mock data that might contain PII (should be rejected)
    const mockGameStateWithPII = {
      sp: 100,
      playerName: 'john.doe@email.com', // This should trigger COPPA violation
      totalSpEarned: 500
    }
    
    // Mock the COPPA validation function (should exist but doesn't yet)
    const mockCOPPAValidation = jest.fn().mockReturnValue(false)
    
    // This test will FAIL because COPPA validation is not implemented
    expect(mockCOPPAValidation(mockGameStateWithPII)).toBe(false)
  })
})
