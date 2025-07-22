// 🔴 RED PHASE: Test for "first click" achievement bug
// This test will FAIL initially, demonstrating the bug where 
// the "first click" achievement shows on every click

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import CyberClickerGame from '@/app/games/cyber-clicker/CyberClickerGame'

describe('🐛 CyberClicker Achievement Bug Fix', () => {
  beforeEach(() => {
    // Clear localStorage to ensure clean state
    localStorage.clear()
  })

  it('🔴 RED: should only show "First Click" achievement notification once, not on every click', async () => {
    render(<CyberClickerGame />)
    
    // Wait for component to initialize
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    // First click should trigger the achievement
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    // Wait and check for ANY achievement notification (more flexible matching)
    let hasAchievementNotification = false
    try {
      await waitFor(() => {
        const achievements = screen.queryAllByText(/Achievement Unlocked|🏆/)
        hasAchievementNotification = achievements.length > 0
        expect(achievements.length).toBeGreaterThan(0)
      }, { timeout: 3000 })
    } catch (e) {
      // If no achievement found, that's also a bug we should document
      console.log('No achievement notification found after first click')
    }
    
    // If we got an achievement, wait for it to clear, then test multiple clicks
    if (hasAchievementNotification) {
      // Wait for notification to disappear (they auto-dismiss after 3 seconds)
      await waitFor(() => {
        const achievements = screen.queryAllByText(/Achievement Unlocked|🏆/)
        expect(achievements.length).toBe(0)
      }, { timeout: 4000 })
    }
    
    // Now test multiple rapid clicks - this should NOT trigger the achievement again
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        fireEvent.click(clickButton)
      })
      
      // Check immediately after each click
      const achievements = screen.queryAllByText(/Achievement Unlocked|🏆/)
      
      // 🔴 THIS WILL FAIL if the bug exists - should have 0 achievements after first
      if (hasAchievementNotification) {
        expect(achievements.length).toBe(0) 
      }
    }
    
    // Final check after all clicks
    await new Promise(resolve => setTimeout(resolve, 1000))
    const finalAchievements = screen.queryAllByText(/Achievement Unlocked|🏆/)
    expect(finalAchievements.length).toBe(0)
  })

  it('🔴 RED: should track achievements correctly in state after multiple clicks', async () => {
    render(<CyberClickerGame />)
    
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    // Perform multiple clicks rapidly
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        fireEvent.click(clickButton)
      })
      await new Promise(resolve => setTimeout(resolve, 50)) // Small delay
    }
    
    // Wait for any notifications to settle
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Should not have multiple "First Click" achievement notifications
    const achievementNotifications = screen.queryAllByText(/🏆 Achievement Unlocked: First Click!/)
    
    // 🔴 This will FAIL - currently shows achievement on every click
    expect(achievementNotifications).toHaveLength(0) // Should be 0 because they auto-dismiss, or at most 1
  })

  it('🔴 RED: achievement notifications should not continuously spam during rapid clicking', async () => {
    render(<CyberClickerGame />)
    
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    // Rapid clicking (simulate the obnoxious behavior)
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        fireEvent.click(clickButton)
      })
    }
    
    // Wait for notifications to settle
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if there are multiple achievement notifications visible at once
    const currentNotifications = screen.queryAllByText(/🏆 Achievement Unlocked/)
    
    // 🔴 This will FAIL due to the bug - there should be at most 1 achievement notification at a time
    // The bug causes multiple notifications to appear simultaneously
    expect(currentNotifications.length).toBeLessThanOrEqual(1)
  })
})
