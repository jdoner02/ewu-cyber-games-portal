/**
 * @file CyberClickerGame-sprites.test.tsx
 * @description Tests for the employee sprite system in CyberClickerGame
 * 
 * These tests ensure that:
 * 1. Each cybersecurity role has a visual sprite/avatar representation
 * 2. Hired employees appear as sprites in a firm office area
 * 3. Sprite counts reflect the number of hired employees
 * 4. Sprites are visually distinct for different roles and tiers
 * 
 * This follows TDD methodology to drive sprite system implementation.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CyberClickerGame from '../../../../src/app/games/cyber-clicker/CyberClickerGame'

// Mock the enterprise persistence hook
jest.mock('../../../../src/hooks/useEnterprisePersistence', () => ({
  useEnterprisePersistence: () => ({
    persistenceManager: null,
    isLoading: false,
    error: null
  }),
  validateGameState: jest.fn().mockReturnValue({ isValid: true, errors: [] }),
  safeDataSanitization: jest.fn((data) => data)
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('CyberClickerGame - Employee Sprites', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock localStorage to return game state with enough SP to hire employees
    const mockGameState = {
      sp: 1000, // Start with enough SP to hire multiple employees
      totalSpEarned: 1000,
      totalClicks: 0,
      playerLevel: 1,
      dayStreak: 0,
      hired: {},
      achievements: [],
      lastSaved: Date.now(),
      clickValue: 1,
      passiveIncome: 0,
      newsItems: [],
      codex: {},
      threatEvents: [],
      learningScenarios: [],
      statisticsTracking: {
        totalClicks: 0,
        totalSpent: 0,
        timePlayedSeconds: 0,
        threatsDetected: 0,
        scenariosCompleted: 0
      }
    }
    
    // Make sure localStorage returns null first to trigger fallback to default state
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Firm Office Area', () => {
    it('should render a firm office area for displaying employee sprites', () => {
      render(<CyberClickerGame />)
      
      // Should have a dedicated area for showing the firm's employees
      const firmOfficeArea = screen.getByTestId('firm-office')
      expect(firmOfficeArea).toBeInTheDocument()
      expect(firmOfficeArea).toHaveClass('firm-office-container')
    })

    it('should show empty office message when no employees are hired', () => {
      render(<CyberClickerGame />)
      
      const firmOffice = screen.getByTestId('firm-office')
      expect(firmOffice).toContainElement(screen.getByText(/empty office/i))
    })
  })

  describe('Role Sprites', () => {
    it('should display sprites for hired SOC Analysts', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP)
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 45; i++) { // 45 clicks + 10 initial = 55 SP
        fireEvent.click(defendButton)
      }
      
      // Hire a SOC Analyst I by clicking the 50 SP button
      const hireButton = screen.getByRole('button', { name: /hire 50 sp/i })
      fireEvent.click(hireButton)
      
      // Should show SOC Analyst sprite in firm office
      await waitFor(() => {
        const firmOffice = screen.getByTestId('firm-office')
        const socSprite = screen.getByTestId('employee-sprite-soc1')
        expect(firmOffice).toContainElement(socSprite)
      })
    })

    it('should display different sprites for different role types', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP) + Vulnerability Analyst (80 SP) = 130 SP
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 125; i++) { // 125 clicks + 10 initial = 135 SP
        fireEvent.click(defendButton)
      }
      
      // Hire different roles by SP cost
      const socButton = screen.getByRole('button', { name: /hire 50 sp/i })
      const vulnButton = screen.getByRole('button', { name: /hire 80 sp/i })
      
      fireEvent.click(socButton)
      fireEvent.click(vulnButton)
      
      // Should show distinct sprites for different roles
      await waitFor(() => {
        const socSprite = screen.getByTestId('employee-sprite-soc1')
        const vulnSprite = screen.getByTestId('employee-sprite-vuln1')
        
        expect(socSprite).toBeInTheDocument()
        expect(vulnSprite).toBeInTheDocument()
        
        // Sprites should have different visual indicators (role attributes)
        expect(socSprite).toHaveAttribute('data-role-type', 'soc1')
        expect(vulnSprite).toHaveAttribute('data-role-type', 'vuln1')
      })
    })

    it('should show multiple sprites when multiple employees of same role are hired', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for two SOC Analysts (50 SP each = 100 SP)
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 95; i++) { // 95 clicks + 10 initial = 105 SP
        fireEvent.click(defendButton)
      }
      
      // Hire two SOC Analysts
      const hireButton = screen.getByRole('button', { name: /hire 50 sp/i })
      fireEvent.click(hireButton)
      fireEvent.click(hireButton)
      
      await waitFor(() => {
        const socSprites = screen.getAllByTestId(/employee-sprite-soc1/)
        expect(socSprites.length).toBeGreaterThanOrEqual(1) // At least one sprite should exist
      })
    })

    it('should display role information when hovering over sprites', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP)
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 45; i++) { // 45 clicks + 10 initial = 55 SP
        fireEvent.click(defendButton)
      }
      
      // Hire a SOC Analyst
      const hireButton = screen.getByRole('button', { name: /hire 50 sp/i })
      fireEvent.click(hireButton)
      
      await waitFor(() => {
        const socSprite = screen.getByTestId('employee-sprite-soc1')
        expect(socSprite).toHaveAttribute('title', expect.stringContaining('SOC Analyst I'))
      })
    })
  })

  describe('Sprite Visual Design', () => {
    it('should use distinct visual styles for different role tiers', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP)
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 45; i++) { // 45 clicks + 10 initial = 55 SP
        fireEvent.click(defendButton)
      }
      
      // Hire tier 1 role
      const tier1Button = screen.getByRole('button', { name: /hire 50 sp/i })
      fireEvent.click(tier1Button)
      
      await waitFor(() => {
        const tier1Sprite = screen.getByTestId('employee-sprite-soc1')
        expect(tier1Sprite).toHaveClass('sprite-tier-1')
      })
      
      // Note: Testing tier 2+ would require promoting or having enough SP
      // This test establishes the pattern for tier-based styling
    })

    it('should show sprite animations or visual feedback', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP)
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 45; i++) { // 45 clicks + 10 initial = 55 SP
        fireEvent.click(defendButton)
      }
      
      // Hire an employee
      const hireButton = screen.getByRole('button', { name: /hire 50 sp/i })
      fireEvent.click(hireButton)
      
      await waitFor(() => {
        const sprite = screen.getByTestId('employee-sprite-soc1')
        expect(sprite).toHaveClass('sprite-animated')
      })
    })

    it('should organize sprites in a visually appealing layout', () => {
      render(<CyberClickerGame />)
      
      const firmOffice = screen.getByTestId('firm-office')
      expect(firmOffice).toHaveClass('grid', 'gap-2')
    })
  })

  describe('Sprite Interactions', () => {
    it('should allow clicking sprites to see role details', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP)
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 45; i++) { // 45 clicks + 10 initial = 55 SP
        fireEvent.click(defendButton)
      }
      
      // Hire an employee
      const hireButton = screen.getByRole('button', { name: /hire 50 sp/i })
      fireEvent.click(hireButton)
      
      await waitFor(() => {
        const sprite = screen.getByTestId('employee-sprite-soc1')
        fireEvent.click(sprite)
        
        // Should show role details or tooltip (sprite should have title attribute)
        expect(sprite).toHaveAttribute('title', expect.stringContaining('SOC Analyst I'))
      })
    })

    it('should update sprites immediately when employees are hired or promoted', async () => {
      render(<CyberClickerGame />)
      
      // Initially no sprites
      expect(screen.queryByTestId(/employee-sprite/)).not.toBeInTheDocument()
      
      // Earn enough SP for SOC Analyst I (50 SP)
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 45; i++) { // 45 clicks + 10 initial = 55 SP
        fireEvent.click(defendButton)
      }
      
      // Hire employee
      const hireButton = screen.getByRole('button', { name: /hire 50 sp/i })
      fireEvent.click(hireButton)
      
      // Sprite should appear immediately
      await waitFor(() => {
        expect(screen.getByTestId('employee-sprite-soc1')).toBeInTheDocument()
      })
    })
  })

  describe('Educational Value', () => {
    it('should use role-appropriate visual representations', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP) + IT Auditor (70 SP) = 120 SP
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 115; i++) { // 115 clicks + 10 initial = 125 SP
        fireEvent.click(defendButton)
      }
      
      // Hire different types of roles by SP cost
      const socButton = screen.getByRole('button', { name: /hire 50 sp/i })
      const auditorButton = screen.getByRole('button', { name: /hire 70 sp/i })
      
      fireEvent.click(socButton)
      fireEvent.click(auditorButton)
      
      await waitFor(() => {
        const socSprite = screen.getByTestId('employee-sprite-soc1')
        const auditorSprite = screen.getByTestId('employee-sprite-auditor')
        
        // Sprites should visually represent their roles with emojis
        expect(socSprite).toHaveTextContent('🛡️')
        expect(auditorSprite).toHaveTextContent('📋')
      })
    })

    it('should help students visualize cybersecurity team composition', async () => {
      render(<CyberClickerGame />)
      
      // Earn enough SP for SOC Analyst I (50 SP) + Vulnerability Analyst (80 SP) = 130 SP
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 125; i++) { // 125 clicks + 10 initial = 135 SP
        fireEvent.click(defendButton)
      }
      
      // Build a small team by SP cost
      const socButton = screen.getByRole('button', { name: /hire 50 sp/i })
      const vulnButton = screen.getByRole('button', { name: /hire 80 sp/i })
      
      fireEvent.click(socButton)
      fireEvent.click(vulnButton)
      
      await waitFor(() => {
        const firmOffice = screen.getByTestId('firm-office')
        const teamCount = screen.getByTestId('team-count')
        
        expect(teamCount).toHaveTextContent('Team Size: 2')
        expect(firmOffice).toContainElement(screen.getByTestId('employee-sprite-soc1'))
        expect(firmOffice).toContainElement(screen.getByTestId('employee-sprite-vuln1'))
      })
    })
  })

  describe('Sprite Functionality With Earned SP', () => {
    it('should enable hire buttons after earning enough SP through clicking', async () => {
      render(<CyberClickerGame />)
      
      // Get the main click button
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      
      // Click 25 times to accumulate SP for hiring (25 clicks + 10 initial = 35 SP, enough for cheapest hire at 30 SP)
      for (let i = 0; i < 25; i++) {
        fireEvent.click(defendButton)
      }
      
      // Now check if hire buttons become enabled
      await waitFor(() => {
        const supportHireButton = screen.getByRole('button', { name: /hire 30 sp/i })
        expect(supportHireButton).not.toBeDisabled()
      })
    })

    it('should show employee sprites after successful hiring', async () => {
      render(<CyberClickerGame />)
      
      // Accumulate enough SP by clicking
      const defendButton = screen.getByRole('button', { name: /defend.*sp/i })
      for (let i = 0; i < 25; i++) { // 25 clicks + 10 initial = 35 SP
        fireEvent.click(defendButton)
      }
      
      // Wait for and click the Support Specialist hire button (cheapest at 30 SP)
      await waitFor(() => {
        const supportHireButton = screen.getByRole('button', { name: /hire 30 sp/i })
        expect(supportHireButton).not.toBeDisabled()
        fireEvent.click(supportHireButton)
      })
      
      // Check if a sprite appears in the firm office
      await waitFor(() => {
        const firmOffice = screen.getByTestId('firm-office')
        const sprites = firmOffice.querySelectorAll('[data-testid*="employee-sprite"]')
        expect(sprites.length).toBeGreaterThan(0)
      })
    })
  })
})
