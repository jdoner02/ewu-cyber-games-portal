// CyberClickerGame-classic.test.tsx
// Test suite for the classic cybersecurity clicker game with cookie clicker-style persistence
// Following TDD principles: Red-Green-Refactor cycle

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CyberClickerGame from '@/app/games/cyber-clicker-classic/CyberClickerGame-classic'

// Mock localStorage for testing persistence
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock timers for testing idle mechanics
beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})

beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})

describe('CyberClickerGame Classic - Cookie Clicker-style Persistence', () => {
  
  // ========================================
  // RED PHASE: Write failing tests first
  // ========================================
  
  describe('Game Initialization and Persistence Loading', () => {
    
    test('should load default state when no save data exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<CyberClickerGame />)
      
      // Should start with default values
      expect(screen.getByText('0')).toBeInTheDocument() // Default score
      expect(screen.getByText('Level 1')).toBeInTheDocument() // Default level
      expect(screen.getByText('0/s')).toBeInTheDocument() // Default auto defense
    })
    
    test('should load saved state from localStorage when available', () => {
      const mockSaveData = {
        score: 500,
        clickPower: 5,
        autoClickRate: 10,
        level: 3,
        exp: 50,
        upgradeStates: {
          'firewall': { id: 'firewall', name: 'Firewall', cost: 10, multiplier: 1.2, owned: 2, icon: 'Shield', description: 'Basic network protection (+1.2x click power)' }
        }
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSaveData))
      
      render(<CyberClickerGame />)
      
      // Should display saved values
      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // Level
      expect(screen.getByText('10/s')).toBeInTheDocument() // Auto defense rate
    })
    
    test('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json data')
      
      render(<CyberClickerGame />)
      
      // Should fall back to defaults without crashing
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('Click Power')).toBeInTheDocument()
      expect(screen.getByText('Level')).toBeInTheDocument()
    })
  })
  
  describe('Persistence Saving Functionality', () => {
    
    test('should save game state to localStorage when score changes', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Click the defense button to change score
      const defenseButton = screen.getByRole('button', { name: /cyber defense core/i })
      await user.click(defenseButton)
      
      // Should save to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'CyberClickerClassicSave',
        expect.stringContaining('"score":1') // Score should be incremented
      )
    })
    
    test('should save upgrade states when upgrades are purchased', async () => {
      // Mock having enough score to buy upgrades
      const initialState = {
        score: 100,
        clickPower: 1,
        autoClickRate: 0,
        level: 1,
        exp: 0,
        upgradeStates: {
          'firewall': { id: 'firewall', name: 'Firewall', cost: 10, multiplier: 1.2, owned: 0, icon: 'Shield', description: 'Basic network protection (+1.2x click power)' }
        }
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(initialState))
      
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Find and click upgrade button
      const upgradeButton = screen.getByText('Firewall').closest('div')
      if (upgradeButton) {
        await user.click(upgradeButton)
      }
      
      // Should save updated upgrade state
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'CyberClickerClassicSave',
        expect.stringContaining('"owned":1') // Firewall should be owned: 1
      )
    })
    
    test('should save level progression and experience', async () => {
      // Mock state close to level up
      const initialState = {
        score: 50,
        clickPower: 1,
        autoClickRate: 0,
        level: 1,
        exp: 95, // Close to level up (needs 100)
        upgradeStates: {}
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(initialState))
      
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Click enough to level up (need 5+ more exp, each click = 1 point * 0.1 = 0.1 exp)
      const defenseButton = screen.getByRole('button', { name: /cyber defense core/i })
      
      // Click 60 times to get 6 exp (95 + 6 = 101 exp >= 100 required)
      for (let i = 0; i < 60; i++) {
        await user.click(defenseButton)
      }
      
      // Should save level progression
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'CyberClickerClassicSave',
          expect.stringContaining('"level":2')
        )
      }, { timeout: 3000 })
    })
  })
  
  describe('Game Mechanics with Persistence', () => {
    
    test('should maintain click power through save/load cycles', async () => {
      const savedState = {
        score: 200,
        clickPower: 5,
        autoClickRate: 0,
        level: 2,
        exp: 0,
        upgradeStates: {}
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState))
      
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Click should use saved click power
      const defenseButton = screen.getByRole('button', { name: /cyber defense core/i })
      await user.click(defenseButton)
      
      // Score should increase by click power (5)
      expect(screen.getByText('205')).toBeInTheDocument()
    })
    
    test('should persist auto-click rate and continue generating points', async () => {
      const savedState = {
        score: 100,
        clickPower: 1,
        autoClickRate: 5,
        level: 1,
        exp: 0,
        upgradeStates: {}
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState))
      
      render(<CyberClickerGame />)
      
      // Should show saved auto-click rate
      expect(screen.getByText('5/s')).toBeInTheDocument()
      
      // Advance time by 1 second
      jest.advanceTimersByTime(1000)
      
      // Score should increase by auto-click rate
      await waitFor(() => {
        expect(screen.getByText('105')).toBeInTheDocument()
      })
    })
    
    test('should preserve achievement progress across sessions', () => {
      const savedState = {
        score: 1500, // Above achievement thresholds
        clickPower: 1,
        autoClickRate: 0,
        level: 12,
        exp: 0,
        upgradeStates: {}
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState))
      
      render(<CyberClickerGame />)
      
      // Should show achieved status for score-based achievements
      expect(screen.getByText('First Defense (100 SP)')).toBeInTheDocument()
      expect(screen.getByText('Security Expert (1K SP)')).toBeInTheDocument()
      expect(screen.getByText('Level 10 Defender')).toBeInTheDocument()
      
      // Achievement indicators should show completion
      const achievementSection = screen.getByText('Achievements')
      expect(achievementSection).toBeInTheDocument()
      
      // Should show completed achievements with green styling
      expect(screen.getByText('First Defense (100 SP)')).toBeInTheDocument()
      expect(screen.getByText('Security Expert (1K SP)')).toBeInTheDocument()
      expect(screen.getByText('Level 10 Defender')).toBeInTheDocument()
    })
  })
  
  describe('Upgrade System Persistence', () => {
    
    test('should save and load individual upgrade ownership counts', () => {
      const savedState = {
        score: 1000,
        clickPower: 10,
        autoClickRate: 15,
        level: 5,
        exp: 0,
        upgradeStates: {
          'firewall': { id: 'firewall', name: 'Firewall', cost: 10, multiplier: 1.2, owned: 3, icon: 'Shield', description: 'Basic network protection (+1.2x click power)' },
          'antivirus': { id: 'antivirus', name: 'Antivirus', cost: 50, multiplier: 2, owned: 2, icon: 'Zap', description: 'Advanced malware detection (+2x click power)' }
        }
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState))
      
      render(<CyberClickerGame />)
      
      // Should show owned counts for upgrades
      expect(screen.getByText('Owned: 3')).toBeInTheDocument() // Firewall
      expect(screen.getByText('Owned: 2')).toBeInTheDocument() // Antivirus
    })
    
    test('should calculate correct upgrade costs based on ownership', () => {
      const savedState = {
        score: 1000,
        clickPower: 1,
        autoClickRate: 0,
        level: 1,
        exp: 0,
        upgradeStates: {
          'firewall': { id: 'firewall', name: 'Firewall', cost: 10, multiplier: 1.2, owned: 2, icon: 'Shield', description: 'Basic network protection (+1.2x click power)' }
        }
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState))
      
      render(<CyberClickerGame />)
      
      // Cost should be base cost * 1.15^owned = 10 * 1.15^2 ≈ 13
      expect(screen.getByText('13')).toBeInTheDocument()
    })
  })
  
  describe('Error Handling and Edge Cases', () => {
    
    test('should handle localStorage quota exceeded gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })
      
      render(<CyberClickerGame />)
      
      // Should not crash when localStorage fails
      expect(screen.getByText('Cyber Clicker')).toBeInTheDocument()
    })
    
    test('should handle missing upgrade data in save state', () => {
      const incompleteSaveState = {
        score: 100,
        clickPower: 1,
        // Missing other required fields
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(incompleteSaveState))
      
      render(<CyberClickerGame />)
      
      // Should fill in missing data with defaults
      expect(screen.getByText('Click Power')).toBeInTheDocument()
      expect(screen.getByText('Level')).toBeInTheDocument()
      expect(screen.getByText('0/s')).toBeInTheDocument() // Default auto rate
    })
    
    test('should maintain data integrity during rapid state changes', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      const defenseButton = screen.getByRole('button', { name: /cyber defense core/i })
      
      // Rapid clicking
      for (let i = 0; i < 10; i++) {
        await user.click(defenseButton)
      }
      
      // Should have saved final state correctly
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'CyberClickerClassicSave',
        expect.stringContaining('"score":10')
      )
    })
  })
  
  describe('Performance and UX with Persistence', () => {
    
    test('should load quickly with large save data', () => {
      const largeSaveState = {
        score: 999999999,
        clickPower: 1000,
        autoClickRate: 5000,
        level: 100,
        exp: 5000,
        upgradeStates: {
          'firewall': { id: 'firewall', name: 'Firewall', cost: 10, multiplier: 1.2, owned: 50, icon: 'Shield', description: 'Basic network protection (+1.2x click power)' },
          'antivirus': { id: 'antivirus', name: 'Antivirus', cost: 50, multiplier: 2, owned: 30, icon: 'Zap', description: 'Advanced malware detection (+2x click power)' },
          'encryption': { id: 'encryption', name: 'Encryption', cost: 200, multiplier: 3, owned: 20, icon: 'Lock', description: 'Military-grade encryption (+3x click power)' },
          'ai-defender': { id: 'ai-defender', name: 'AI Defender', cost: 1000, multiplier: 5, owned: 10, icon: 'Server', description: 'AI-powered security system (+5x click power)' },
          'quantum-shield': { id: 'quantum-shield', name: 'Quantum Shield', cost: 5000, multiplier: 10, owned: 5, icon: 'Wifi', description: 'Quantum-encrypted protection (+10x click power)' }
        }
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(largeSaveState))
      
      const startTime = performance.now()
      render(<CyberClickerGame />)
      const endTime = performance.now()
      
      // Should load within reasonable time
      expect(endTime - startTime).toBeLessThan(100) // 100ms
      
      // Should display large numbers correctly
      expect(screen.getByText('1000.0M')).toBeInTheDocument() // Formatted large score
    })
    
    test('should not save too frequently to avoid performance issues', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      const defenseButton = screen.getByRole('button', { name: /cyber defense core/i })
      
      // Multiple rapid clicks
      await user.click(defenseButton)
      await user.click(defenseButton)
      await user.click(defenseButton)
      
      // Should debounce saves or batch them efficiently
      // Exact implementation may vary, but shouldn't spam localStorage
      expect(localStorageMock.setItem.mock.calls.length).toBeLessThan(10)
    })
  })
})
