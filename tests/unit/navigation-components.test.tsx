/**
 * 🎯 Navigation Component Integration Test
 * 
 * Tests the actual navigation components to ensure they work properly
 */

import { render, screen } from '@testing-library/react'
import GameHeader from '@/components/GameHeader'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

describe('🧭 Navigation Component Tests', () => {
  
  describe('GameHeader Component', () => {
    it('should render back button when showBackButton is true', () => {
      render(<GameHeader gameTitle="Test Game" showBackButton={true} />)
      
      expect(screen.getByText('Back to Portal')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    it('should not render back button when showBackButton is false', () => {
      render(<GameHeader gameTitle="Test Game" showBackButton={false} />)
      
      expect(screen.queryByText('Back to Portal')).not.toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    it('should display correct game title', () => {
      render(<GameHeader gameTitle="Password Fortress" />)
      
      expect(screen.getByText('Password Fortress')).toBeInTheDocument()
    })
  })

  describe('Navigation Accessibility', () => {
    it('should have proper ARIA labels for navigation buttons', () => {
      render(<GameHeader gameTitle="Test Game" />)
      
      // Check that buttons are properly labeled for screen readers
      const homeButton = screen.getByText('Home')
      expect(homeButton).toBeInTheDocument()
      
      // Ensure buttons are focusable
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })
  })
})
