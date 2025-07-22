import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CyberClickerGame from '../../../../src/app/games/cyber-clicker/CyberClickerGame'

describe('🔴 TDD RED PHASE: Stale Closure Bug Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('🔴 RED: First Click achievement should only trigger once, not on every click', async () => {
    render(<CyberClickerGame />)
    
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    // First click - should trigger achievement and give +1 SP + 5 SP reward = 16 total
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    // Wait for first achievement
    await waitFor(() => {
      const achievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
      expect(achievements.length).toBeGreaterThan(0)
    })
    
    // Should be 16 SP total (10 + 1 click + 5 achievement reward)
    await waitFor(() => {
      expect(screen.getByText('16')).toBeInTheDocument()
    })
    
    // Wait for notification to clear
    await waitFor(() => {
      const achievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
      expect(achievements.length).toBe(0)
    }, { timeout: 5000 })
    
    // Second click - should NOT trigger achievement and give only +1 SP = 17 total
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Should be 17 SP (16 + 1 click, no achievement reward)
    await waitFor(() => {
      expect(screen.getByText('17')).toBeInTheDocument()
    })
    
    // No new achievement notifications should appear
    const achievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
    expect(achievements.length).toBe(0)
    
    // Third click - should also NOT trigger achievement
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Should be 18 SP (17 + 1 click, no achievement reward)
    await waitFor(() => {
      expect(screen.getByText('18')).toBeInTheDocument()
    })
    
    // Still no achievement notifications
    const achievementsAfter = screen.queryAllByText(/🏆 Achievement Unlocked/)
    expect(achievementsAfter.length).toBe(0)
  })
})
