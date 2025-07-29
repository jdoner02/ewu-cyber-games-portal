/**
 * Test Guardian Agent - RED Phase Test
 * Testing employee promotion functionality in CyberClickerGame
 * 
 * This test file focuses on the uncovered promotion system which allows
 * players to promote employees from tier 1 to tier 2 roles, creating
 * career progression and educational value about cybersecurity career paths.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CyberClickerGame from '../../../../src/app/games/cyber-clicker/CyberClickerGame'

// Mock enterprise persistence to avoid external dependencies
jest.mock('../../../../src/hooks/useEnterprisePersistence', () => ({
  useEnterprisePersistence: () => ({
    persistenceManager: null,
    isAvailable: false
  }),
  validateGameState: jest.fn(() => ({ isValid: true, sanitizedData: null })),
  safeDataSanitization: jest.fn((data) => data)
}))

describe('CyberClickerGame - Employee Promotion System', () => {
  
  describe('Role Promotion Mechanics', () => {
    it('should show promote button for SOC Analyst I when employee is hired', async () => {
      render(<CyberClickerGame />)
      
      // Accumulate enough SP to hire SOC Analyst I (cost is 50 SP)
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 60; i++) {
        fireEvent.click(defendButton)
      }
      
      // Hire SOC Analyst I (cost is 50 SP)
      await waitFor(() => {
        const hireButton = screen.getByText(/Hire.*50.*SP/)
        expect(hireButton).not.toBeDisabled()
        fireEvent.click(hireButton)
      })
      
      // Verify hire notification appeared
      await waitFor(() => {
        expect(screen.getByText(/Hired 1 SOC Analyst I!/)).toBeInTheDocument()
      })
      
      // Check that promote button is now visible for SOC Analyst I
      await waitFor(() => {
        const promoteButton = screen.getByRole('button', { name: /promote/i })
        expect(promoteButton).toBeInTheDocument()
        expect(promoteButton).not.toBeDisabled()
      })
    })

    it('should successfully promote SOC Analyst I to SOC Analyst II', async () => {
      render(<CyberClickerGame />)
      
      // Accumulate enough SP for hiring (50 SP) and promotion (100 SP for tier 1*2*1)
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 150; i++) {
        fireEvent.click(defendButton)
      }
      
      // Hire SOC Analyst I first
      await waitFor(() => {
        const hireButton = screen.getByText(/Hire 50 SP/)
        fireEvent.click(hireButton)
      })
      
      // Wait for hire to complete, then promote
      await waitFor(() => {
        const promoteButton = screen.getByRole('button', { name: /promote/i })
        fireEvent.click(promoteButton)
      })
      
      // Verify promotion notification
      await waitFor(() => {
        expect(screen.getByText(/Promoted 1 SOC Analyst I → SOC Analyst II!/)).toBeInTheDocument()
      })
      
      // Verify SOC Analyst II is now shown in the roles list
      await waitFor(() => {
        expect(screen.getByText(/SOC Analyst II \(x1\)/)).toBeInTheDocument()
      })
      
      // Verify SOC Analyst I count decreased to 0
      await waitFor(() => {
        expect(screen.getByText(/SOC Analyst I \(x0\)/)).toBeInTheDocument()
      })
    })

    it('should unlock SOC Analyst II in the codex after promotion', async () => {
      render(<CyberClickerGame />)
      
      // Accumulate SP and perform hire + promote workflow
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 150; i++) {
        fireEvent.click(defendButton)
      }
      
      // Hire and promote SOC Analyst I
      await waitFor(() => {
        fireEvent.click(screen.getByText(/Hire 50 SP/))
      })
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /promote/i }))
      })
      
      // Check that SOC Analyst II appears in the Career Codex
      await waitFor(() => {
        // Look specifically in Career Codex for Level 2 career
        expect(screen.getByText(/Level 2 career/)).toBeInTheDocument()
      })
    })

    it('should prevent promotion when insufficient SP', async () => {
      render(<CyberClickerGame />)
      
      // Only accumulate enough SP to hire (50 SP) but not promote (needs 100 more)
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 50; i++) {
        fireEvent.click(defendButton)
      }
      
      // Hire SOC Analyst I
      await waitFor(() => {
        fireEvent.click(screen.getByText(/Hire 50 SP/))
      })
      
      // Try to promote without enough SP
      await waitFor(() => {
        const promoteButton = screen.getByRole('button', { name: /promote/i })
        fireEvent.click(promoteButton)
      })
      
      // Should not see promotion notification since we don't have enough SP
      await waitFor(() => {
        expect(screen.queryByText(/Promoted 1 SOC Analyst I → SOC Analyst II!/)).not.toBeInTheDocument()
      }, { timeout: 1000 })
      
      // SOC Analyst I count should remain 1
      await waitFor(() => {
        expect(screen.getByText(/SOC Analyst I \(x1\)/)).toBeInTheDocument()
      })
    })

    it('should prevent promotion when no employees to promote', async () => {
      render(<CyberClickerGame />)
      
      // Accumulate plenty of SP but don't hire anyone
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 200; i++) {
        fireEvent.click(defendButton)
      }
      
      // Try to find promote button - it should not exist without hired employees
      expect(screen.queryByRole('button', { name: /promote/i })).not.toBeInTheDocument()
    })
  })

  describe('Promotion Cost Calculation', () => {
    it('should calculate promotion cost using the correct formula', async () => {
      render(<CyberClickerGame />)
      
      // Test the promotion cost formula: baseCost * 2 * tier
      // For SOC Analyst I: 50 * 2 * 1 = 100 SP
      
      const defendButton = screen.getByText(/DEFEND/)
      
      // Accumulate exactly 89 SP (not enough for promotion after hiring)
      // Start: 10 SP + 89 clicks + 5 SP (first click achievement) = 104 SP
      // After hire: 104 - 50 = 54 SP (not enough for 100 SP promotion cost)
      for (let i = 0; i < 89; i++) {
        fireEvent.click(defendButton)
      }
      
      // Hire SOC Analyst I (costs 50 SP, leaves us with 54 SP)
      await waitFor(() => {
        fireEvent.click(screen.getByText(/Hire 50 SP/))
      })
      
      // Try to promote with 99 SP (should fail since we need 100)
      await waitFor(() => {
        const promoteButton = screen.getByRole('button', { name: /promote/i })
        fireEvent.click(promoteButton)
      })
      
      // Should not see promotion notification
      await waitFor(() => {
        expect(screen.queryByText(/Promoted 1 SOC Analyst I → SOC Analyst II!/)).not.toBeInTheDocument()
      }, { timeout: 1000 })
      
      // Click more times to get enough SP for promotion (need 100 SP total)
      // Currently have 54 SP, need 46 more SP
      for (let i = 0; i < 46; i++) {
        fireEvent.click(defendButton)
      }
      
      // Now promotion should work
      await waitFor(() => {
        const promoteButton = screen.getByRole('button', { name: /promote/i })
        fireEvent.click(promoteButton)
      })
      
      await waitFor(() => {
        expect(screen.getByText(/Promoted 1 SOC Analyst I → SOC Analyst II!/)).toBeInTheDocument()
      })
    })
  })

  describe('Employee Sprite Updates After Promotion', () => {
    it('should update employee sprites when promoted to new role', async () => {
      render(<CyberClickerGame />)
      
      // Accumulate SP for hire and promote
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 150; i++) {
        fireEvent.click(defendButton)
      }
      
      // Hire SOC Analyst I
      await waitFor(() => {
        fireEvent.click(screen.getByText(/Hire 50 SP/))
      })
      
      // Verify SOC Analyst I sprite appears
      await waitFor(() => {
        expect(screen.getByTestId('employee-sprite-soc1')).toBeInTheDocument()
      })
      
      // Promote to SOC Analyst II
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /promote/i }))
      })
      
      // Verify SOC Analyst II sprite appears and SOC Analyst I sprite is removed
      await waitFor(() => {
        expect(screen.getByTestId('employee-sprite-soc2')).toBeInTheDocument()
        expect(screen.queryByTestId('employee-sprite-soc1')).not.toBeInTheDocument()
      })
    })
  })

  describe('Multiple Employee Promotion', () => {
    it('should handle promotion when multiple employees of same role exist', async () => {
      render(<CyberClickerGame />)
      
      // Accumulate enough SP for 2 hires and 1 promotion
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 250; i++) {
        fireEvent.click(defendButton)
      }
      
      // Hire two SOC Analyst I employees
      await waitFor(() => {
        fireEvent.click(screen.getByText(/Hire 50 SP/))
      })
      
      await waitFor(() => {
        fireEvent.click(screen.getByText(/Hire 57 SP/)) // Cost increases by 15% for second hire
      })
      
      // Verify we have 2 SOC Analyst I employees
      await waitFor(() => {
        expect(screen.getByText(/SOC Analyst I \(x2\)/)).toBeInTheDocument()
      })
      
      // Promote one SOC Analyst I to SOC Analyst II
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /promote/i }))
      })
      
      // Should have 1 SOC Analyst I and 1 SOC Analyst II
      await waitFor(() => {
        expect(screen.getByText(/SOC Analyst I \(x1\)/)).toBeInTheDocument()
        expect(screen.getByText(/SOC Analyst II \(x1\)/)).toBeInTheDocument()
      })
    })
  })

  describe('Educational Value - Career Progression', () => {
    it('should demonstrate realistic cybersecurity career advancement paths', async () => {
      render(<CyberClickerGame />)
      
      // This test validates that the promotion system teaches real career progression
      const defendButton = screen.getByText(/DEFEND/)
      for (let i = 0; i < 150; i++) {
        fireEvent.click(defendButton)
      }
      
      // Start career at entry level
      await waitFor(() => {
        fireEvent.click(screen.getByText(/Hire 50 SP/))
      })
      
      // Verify entry-level role description in Career Codex
      await waitFor(() => {
        const codexSection = screen.getByText('Career Codex').closest('div')
        expect(codexSection).toBeInTheDocument()
        // Look specifically within the codex for the description
        const elements = screen.getAllByText(/Monitors security alerts and investigates basic incidents/)
        expect(elements.length).toBeGreaterThan(0)
      })
      
      // Advance to next level
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /promote/i }))
      })
      
      // Verify advanced role is available in codex with appropriate description
      await waitFor(() => {
        // Look specifically in the Career Codex section for SOC Analyst II
        const codexSection = screen.getByText('Career Codex').closest('div')
        expect(codexSection).toBeInTheDocument()
        expect(screen.getByText(/Level 2 career/)).toBeInTheDocument()
      })
    })
  })
})
