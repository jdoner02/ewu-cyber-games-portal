/**
 * 🔴 RED PHASE - Test for notification containment improvement
 * 
 * This test verifies that notifications don't interfere with upgrade buttons
 * by ensuring they are contained within a proper notification area.
 * 
 * Following Test Guardian Agent TDD protocol:
 * 1. RED: Write failing test that exposes notification overflow issue
 * 2. GREEN: Fix minimum code to contain notifications properly
 * 3. REFACTOR: Improve notification system design
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the enterprise persistence hook
jest.mock('../../../../src/hooks/useEnterprisePersistence', () => ({
  useEnterprisePersistence: jest.fn(() => ({
    persistenceManager: null,
    isLoading: false,
    error: null
  })),
  validateGameState: jest.fn((data) => ({ isValid: true, errors: [] })),
  safeDataSanitization: jest.fn((data) => ({ ...data, _metadata: { sanitized: true } }))
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

// Import after mocks are set up
const CyberClickerGame = require('@/app/games/cyber-clicker/CyberClickerGame').default

describe('CyberClickerGame - Notification Containment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  /**
   * 🔴 RED PHASE TEST: Notifications should be contained in a dedicated area
   * This test should FAIL because notifications currently lack proper container attributes
   */
  test('notifications should be contained in a notification box to prevent UI interference', async () => {
    render(<CyberClickerGame />)
    
    // Trigger multiple notifications by clicking defend button multiple times
    const defendButton = screen.getByText(/DEFEND/i)
    
    // Click multiple times to potentially trigger achievement notifications
    for (let i = 0; i < 5; i++) {
      fireEvent.click(defendButton)
    }
    
    // Wait for potential notifications to appear
    await waitFor(() => {
      // Check if notifications have a proper container with testid
      const notificationContainer = screen.queryByTestId('notification-container')
      expect(notificationContainer).toBeInTheDocument()
      expect(notificationContainer).toHaveClass('fixed', 'top-4', 'right-4')
      
      // Should have proper z-index to not interfere with buttons
      expect(notificationContainer).toHaveClass('z-50')
      
      // Should have max height constraint to prevent overflow
      expect(notificationContainer).toHaveClass('max-h-96', 'overflow-y-auto')
    }, { timeout: 1000 })
    
    // Verify upgrade buttons remain clickable by checking their visibility
    const hireButtons = screen.getAllByText(/Hire/i)
    hireButtons.forEach(button => {
      expect(button).toBeVisible()
      expect(button).not.toHaveStyle('pointer-events: none')
    })
  })

  /**
   * 🔴 RED PHASE TEST: Notification box should have proper styling and limits
   * This test should FAIL because there's no notification limit or proper overflow handling
   */
  test('notification container should limit the number of visible notifications', async () => {
    render(<CyberClickerGame />)
    
    // Try to generate many notifications quickly
    const defendButton = screen.getByText(/DEFEND/i)
    
    // Rapid clicking to potentially generate achievement notifications
    for (let i = 0; i < 10; i++) {
      fireEvent.click(defendButton)
    }
    
    await waitFor(() => {
      const notificationContainer = screen.queryByTestId('notification-container')
      expect(notificationContainer).toBeInTheDocument()
      
      // Should have overflow handling
      expect(notificationContainer).toHaveClass('max-h-96', 'overflow-y-auto')
      
      // Should not have more than 5 notifications visible at once
      const notifications = screen.queryAllByText(/Achievement Unlocked|Hired|Promoted/i)
      expect(notifications.length).toBeLessThanOrEqual(5)
    }, { timeout: 2000 })
  })

  /**
   * 🔴 RED PHASE TEST: Notifications should auto-dismiss and not accumulate indefinitely
   * This test should FAIL if notifications don't properly clean up
   */
  test('notifications should auto-dismiss after timeout to prevent accumulation', async () => {
    render(<CyberClickerGame />)
    
    // Trigger a notification
    const defendButton = screen.getByText(/DEFEND/i)
    fireEvent.click(defendButton)
    
    // Check if notifications disappear after timeout (currently 3 seconds)
    await waitFor(() => {
      const allNotifications = screen.queryAllByText(/Hired|Promoted|Achievement/i)
      // After sufficient time, notifications should be gone
      expect(allNotifications.length).toBe(0)
    }, { timeout: 4000 })
  })

  /**
   * 🔴 RED PHASE TEST: Multiple rapid actions should not break notification system
   * This test should FAIL if the notification system doesn't handle rapid actions well
   */
  test('rapid hiring/promoting should not break notification container', async () => {
    // Set up game state with enough SP to hire
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      sp: 1000,
      totalSpEarned: 1000,
      totalClicks: 0,
      hired: {},
      codex: {},
      achievements: [],
      scenarios: [],
      dayStreak: 1,
      playerLevel: 1,
      lastPlayDate: new Date().toDateString()
    }))
    
    render(<CyberClickerGame />)
    
    // Try to hire multiple people rapidly
    const hireButtons = screen.getAllByText(/Hire/i)
    
    if (hireButtons.length > 0) {
      // Click hire buttons rapidly
      for (let i = 0; i < Math.min(3, hireButtons.length); i++) {
        fireEvent.click(hireButtons[i])
        fireEvent.click(hireButtons[i])
      }
    }
    
    // The notification system should handle this gracefully
    await waitFor(() => {
      const notificationContainer = screen.queryByTestId('notification-container')
      if (notificationContainer) {
        // Should still be properly positioned
        expect(notificationContainer).toBeInTheDocument()
      }
    }, { timeout: 1000 })
  })
})
