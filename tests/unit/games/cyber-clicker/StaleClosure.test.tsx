import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CyberClickerGame from '../../../../src/app/games/cyber-clicker/CyberClickerGame'

describe('🔬 Stale Closure Bug Investigation', () => {
  it('� should demonstrate the stale closure bug in handleClick', async () => {
    const { rerender } = render(<CyberClickerGame />)
    
    // Wait for component to initialize
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    console.log('\n=== 🔬 TESTING STALE CLOSURE BUG ===')
    
    // First click - should trigger "First Click" achievement
    console.log('🖱️  Performing first click...')
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    // Wait for and capture the first achievement
    await waitFor(() => {
      const achievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
      expect(achievements.length).toBeGreaterThan(0)
    }, { timeout: 2000 })
    
    const firstAchievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
    console.log(`✅ First click triggered ${firstAchievements.length} achievement(s)`)
    
    // Let the notification display for a moment, then clear it
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Wait for notifications to auto-clear (they clear after 3 seconds)
    await waitFor(() => {
      const achievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
      expect(achievements.length).toBe(0)
    }, { timeout: 4000 })
    
    console.log('🧹 Notifications cleared')
    
    // Now perform second click - this should NOT trigger achievements
    console.log('🖱️  Performing second click...')
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    // Wait briefly to see if any new achievements appear
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const secondClickAchievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
    console.log(`Second click shows ${secondClickAchievements.length} achievement(s)`)
    
    if (secondClickAchievements.length > 0) {
      console.log('🐛 BUG DETECTED: Second click triggered achievement!')
      console.log('Achievement text:', secondClickAchievements.map(a => a.textContent))
      
      // This is the bug - due to stale closure in handleClick useCallback,
      // the checkAchievements function captures stale achievementsUnlocked=[]
      // which makes it think the achievement hasn't been unlocked yet
      throw new Error('🐛 STALE CLOSURE BUG: Second click triggered achievement notification. This happens because handleClick useCallback has wrong dependencies - it should include checkAchievements or its dependencies to prevent stale closure over achievementsUnlocked state.')
    }
    
    // Continue with more clicks to make sure
    for (let i = 3; i <= 5; i++) {
      console.log(`🖱️  Performing click ${i}...`)
      await act(async () => {
        fireEvent.click(clickButton)
      })
      
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const currentAchievements = screen.queryAllByText(/🏆 Achievement Unlocked/)
      console.log(`Click ${i} shows ${currentAchievements.length} achievement(s)`)
      
      if (currentAchievements.length > 0) {
        throw new Error(`🐛 STALE CLOSURE BUG: Click ${i} triggered achievement notification! The handleClick function is using a stale closure over checkAchievements.`)
      }
    }
    
    console.log('✅ No additional achievements triggered - either the bug is fixed or not reproduced in test')
    
    // For TDD RED phase, we want this test to fail when the bug exists
    // If we reach here without seeing the bug, that might mean:
    // 1. The bug was already fixed
    // 2. Our test conditions aren't sufficient to reproduce it
    // 3. The bug only occurs under different conditions
    
    // The achievement should have been triggered exactly once in total
    const totalAchievementEvents = firstAchievements.length
    console.log(`🎯 Expected: 1 achievement event total, Actual: ${totalAchievementEvents}`)
    
    expect(totalAchievementEvents).toBe(1)
  })
})
