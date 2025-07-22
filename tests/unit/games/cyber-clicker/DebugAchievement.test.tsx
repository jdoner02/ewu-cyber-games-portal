import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CyberClickerGame from '../../../../src/app/games/cyber-clicker/CyberClickerGame'

describe('🔍 Debug Achievement System', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should debug step by step what happens on first click', async () => {
    const { container } = render(<CyberClickerGame />)
    
    await waitFor(() => {
      expect(screen.getByText(/DEFEND \(/)).toBeInTheDocument()
    })
    
    const clickButton = screen.getByText(/DEFEND \(/)
    
    // Check initial state
    console.log('Initial SP:', screen.getByText('Security Points (SP)').previousElementSibling?.textContent)
    
    // Perform first click
    console.log('Performing first click...')
    await act(async () => {
      fireEvent.click(clickButton)
    })
    
    // Check SP after click
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('SP after click:', screen.getByText('Security Points (SP)').previousElementSibling?.textContent)
    
    // Check for notifications in DOM
    const notificationArea = container.querySelector('.fixed.top-4.right-4')
    console.log('Notification area HTML:', notificationArea?.innerHTML)
    
    // Look for any text containing achievement
    const allElements = container.querySelectorAll('*')
    const achievementElements = Array.from(allElements).filter(el => 
      el.textContent?.includes('Achievement') || 
      el.textContent?.includes('🏆') ||
      el.textContent?.includes('First Click')
    )
    
    console.log('Found achievement-related elements:', achievementElements.length)
    achievementElements.forEach((el, idx) => {
      console.log(`${idx + 1}: "${el.textContent}"`)
    })
    
    // Wait a bit more to see if notification appears
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check again
    const notificationAreaAfter = container.querySelector('.fixed.top-4.right-4')
    console.log('Notification area HTML after delay:', notificationAreaAfter?.innerHTML)
  })
})
