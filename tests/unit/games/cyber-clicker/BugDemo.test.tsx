import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CyberClickerGame from '../../../../src/app/games/cyber-clicker/CyberClickerGame'

describe('🐛 Real Bug Demonstration', () => {
  beforeEach(() => {
    // Clear localStorage to ensure clean state
    localStorage.clear()
  })

  it('🧪 should confirm achievement system works', async () => {
    render(<CyberClickerGame />)
    
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    // Click and wait for achievement
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    // Look for any achievement notification with debugging
    console.log('Looking for achievement notifications...')
    
    try {
      await waitFor(() => {
        const achievements = screen.queryAllByText(/🏆/)
        console.log(`Found ${achievements.length} 🏆 notifications`)
        const unlocked = screen.queryAllByText(/Achievement Unlocked/)
        console.log(`Found ${unlocked.length} "Achievement Unlocked" notifications`)
        const first = screen.queryAllByText(/First Click/)
        console.log(`Found ${first.length} "First Click" notifications`)
        
        expect(achievements.length + unlocked.length + first.length).toBeGreaterThan(0)
      }, { timeout: 3000 })
      
      console.log('✅ Achievement notifications detected')
    } catch (e) {
      console.log('❌ No achievement notifications found')
      
      // Debug what we do have
      const allText = screen.getByText(/DEFEND/).closest('.min-h-screen')?.textContent || 'No content'
      console.log('Current page content includes:', allText.slice(0, 500))
      
      throw e
    }
  })

  it('🔍 manual bug reproduction', async () => {
    const { rerender } = render(<CyberClickerGame />)
    
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    // Debug initial state
    console.log('Initial state: SP should be 10')
    expect(screen.getByText('10')).toBeInTheDocument()
    
    // First click - should increment SP to 11 and trigger achievement 
    console.log('Performing first click...')
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    // Verify SP increased
    await waitFor(() => {
      expect(screen.getByText('11')).toBeInTheDocument()
    })
    console.log('✅ First click increased SP to 11')
    
    // Now let's manually trigger state changes to create stale closure conditions
    // The bug happens when handleClick captures a stale checkAchievements
    
    // Keep clicking to see if achievements duplicate
    for (let i = 2; i <= 5; i++) {
      console.log(`Click ${i}...`)
      await act(async () => {
        fireEvent.click(clickButton)
      })
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Check for any achievement notifications
      const achievements = screen.queryAllByText(/🏆|Achievement|First Click/)
      if (achievements.length > 0) {
        console.log(`🔍 Found ${achievements.length} achievement-related elements on click ${i}:`)
        achievements.forEach((el, idx) => {
          console.log(`  ${idx + 1}: "${el.textContent}"`)
        })
      }
    }
    
    // Final SP should be 15 (10 + 5 clicks of +1 each)
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument()
    })
    console.log('✅ Final SP is 15 after 5 clicks')
  })
})
