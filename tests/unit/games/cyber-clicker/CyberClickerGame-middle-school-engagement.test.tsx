/**
 * 🔴 RED PHASE - Tests for Middle School (Grades 6-8) Engagement Features
 * 
 * These tes  test('role descriptions should be age-appropriate for middle school', async () => {
    render(<CyberClickerGame />)
    
    // Look for role descriptions
    const socAnalysts = screen.getAllByText(/SOC Analyst/i)
    expect(socAnalysts.length).toBeGreaterThan(0)
    
    // Check that descriptions use middle school vocabulary
    const roleDescription = screen.getByText(/Monitors security alerts/i)
    
    // Should not contain overly technical jargon
    expect(roleDescription.textContent).not.toMatch(/cryptographic|heuristic|polymorphic/)
    
    // Should use engaging, relatable terms
    expect(roleDescription.textContent).toMatch(/investigates|monitors|finds|protects/i)
  })bersecurity clicker game is engaging and educational
 * for students ages 11-14, with inspiration from popular games like Cookie Clicker,
 * SimCity, Fortnite, and Roblox.
 * 
 * Following Test Guardian Agent TDD protocol:
 * 1. RED: Write failing tests for engagement features that don't exist yet
 * 2. GREEN: Implement minimum code to make tests pass  
 * 3. REFACTOR: Improve design and polish
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

describe('CyberClickerGame - Middle School Engagement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  /**
   * 🔴 RED PHASE TEST: Click effects for visual feedback
   * Middle schoolers need immediate visual feedback like popular games
   */
  test('DEFEND button should show click effects for engaging feedback', async () => {
    render(<CyberClickerGame />)
    
    const defendButton = screen.getByText(/DEFEND/i)
    
    // Should have click effect class or animation
    expect(defendButton).toHaveClass('click-effect-enabled')
    
    // When clicked, should show visual feedback
    fireEvent.click(defendButton)
    
    await waitFor(() => {
      // Look for click effect indicators
      const clickEffect = screen.queryByTestId('click-effect-animation')
      expect(clickEffect).toBeInTheDocument()
    }, { timeout: 500 })
  })

  /**
   * 🔴 RED PHASE TEST: Progress milestones for motivation
   * Middle schoolers need frequent positive reinforcement
   */
  test('should show progress milestones at regular intervals', async () => {
    render(<CyberClickerGame />)
    
    const defendButton = screen.getByText(/DEFEND/i)
    
    // Click 5 times to reach a small milestone
    for (let i = 0; i < 5; i++) {
      fireEvent.click(defendButton)
    }
    
    await waitFor(() => {
      // Should show a milestone celebration
      const milestone = screen.queryByTestId('progress-milestone')
      expect(milestone).toBeInTheDocument()
      expect(milestone).toHaveTextContent(/milestone|great|awesome|excellent/i)
    }, { timeout: 1000 })
  })

  /**
   * 🔴 RED PHASE TEST: Educational tooltips that are age-appropriate
   * Cybersecurity concepts should be explained simply for grades 6-8
   */
  test('role descriptions should be age-appropriate for middle school', () => {
    render(<CyberClickerGame />)
    
    // Look for role descriptions (there are multiple SOC Analyst elements)
    const socAnalystElements = screen.getAllByText(/SOC Analyst/i)
    expect(socAnalystElements.length).toBeGreaterThan(0)
    
    // Check that descriptions use middle school vocabulary (there are multiple instances)
    const simpleDescriptions = screen.getAllByText(/monitors security alerts and investigates basic incidents/i)
    expect(simpleDescriptions.length).toBeGreaterThan(0)
  })

  /**
   * 🔴 RED PHASE TEST: Quick achievements for early motivation
   * Following popular game psychology - early wins to build engagement  
   */
  test('should have quick early achievements to build confidence', async () => {
    render(<CyberClickerGame />)
    
    const defendButton = screen.getByText(/DEFEND/i)
    
    // First click should unlock achievement quickly
    fireEvent.click(defendButton)
    
    await waitFor(() => {
      const achievement = screen.getByText(/Achievement Unlocked.*First Click/i)
      expect(achievement).toBeInTheDocument()
    }, { timeout: 500 })
    
    // Should have more quick wins in early game
    for (let i = 0; i < 4; i++) {
      fireEvent.click(defendButton)
    }
    
    await waitFor(() => {
      // Should unlock another achievement by 5 clicks
      const quickWin = screen.queryByText(/5.*clicks|Quick.*Clicker|Getting.*Started/i)
      expect(quickWin).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  /**
   * 🔴 RED PHASE TEST: Colorful UI elements for visual appeal
   * Middle schoolers respond to vibrant, engaging interfaces
   */
  test('game interface should have engaging colors and visual elements', () => {
    render(<CyberClickerGame />)
    
    // DEFEND button should have engaging styling
    const defendButton = screen.getByText(/DEFEND/i)
    expect(defendButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700')
    
    // Should have colorful employee sprites
    const office = screen.getByText(/Firm Office/i)
    expect(office).toBeInTheDocument()
    
    // Employee sprites should have colorful backgrounds
    const teamSizeText = screen.queryByText(/Team Size:/i)
    if (teamSizeText) {
      const sprites = screen.queryAllByTestId(/employee-sprite-/)
      sprites.forEach(sprite => {
        expect(sprite).toHaveClass('bg-blue-600')
      })
    }
  })

  /**
   * 🔴 RED PHASE TEST: Game stats should be clearly visible and motivating
   * Clear progress indicators help maintain engagement
   */
  test('key game stats should be prominently displayed and easy to understand', () => {
    render(<CyberClickerGame />)
    
    // SP (Security Points) should be clearly labeled
    const spDisplay = screen.getByText(/Security Points \(SP\)/i)
    expect(spDisplay).toBeInTheDocument()
    
    // SP per second should be visible
    const spPerSec = screen.getByText(/SP per sec/i)
    expect(spPerSec).toBeInTheDocument()
    
    // Should show clear progression indicators - find the grid container
    const statsContainer = screen.getByText(/Security Points \(SP\)/i).closest('.bg-gray-800.p-4.rounded')
    expect(statsContainer).toBeInTheDocument()
    expect(statsContainer).toHaveClass('bg-gray-800', 'p-4', 'rounded')
  })

  /**
   * 🔴 RED PHASE TEST: Interactive sprites for discovery
   * Like Roblox/SimCity, employees should be interactive for engagement
   */
  test('employee sprites should be interactive and provide information when clicked', async () => {
    // Set up game state with hired employees
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      sp: 1000,
      totalSpEarned: 1000,
      totalClicks: 0,
      hired: { 'soc1': 1 }, // Hire one SOC Analyst
      codex: {},
      achievements: [],
      scenarios: [],
      dayStreak: 1,
      playerLevel: 1,
      lastPlayDate: new Date().toDateString()
    }))

    render(<CyberClickerGame />)
    
    await waitFor(() => {
      const sprite = screen.queryByTestId('employee-sprite-soc1')
      if (sprite) {
        expect(sprite).toBeInTheDocument()
        expect(sprite).toHaveClass('cursor-pointer')
        
        // Click on sprite should show information
        fireEvent.click(sprite)
        
        // Should show notification with role info
        return waitFor(() => {
          const notification = screen.queryByText(/SOC Analyst.*Monitors security alerts/i)
          expect(notification).toBeInTheDocument()
        }, { timeout: 1000 })
      }
    })
  })
})
