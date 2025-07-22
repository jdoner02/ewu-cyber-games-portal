// CyberClickerGame.test.tsx
// Comprehensive test suite for the educational cybersecurity clicker game
// Following TDD principles: Red-Green-Refactor cycle
// 
// Educational Testing Goals:
// - Ensure game mechanics teach cybersecurity career paths effectively
// - Verify achievement system motivates learning progression
// - Test interactive scenarios provide real-world cybersecurity knowledge
// - Validate accessibility and engagement for middle school students

import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CyberClickerGame from '@/app/games/cyber-clicker/CyberClickerGame'

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

describe('CyberClickerGame - Educational Cybersecurity Career Game', () => {
  
  // ========================================
  // RED PHASE: Write failing tests first
  // ========================================
  
  describe('Game Initialization and Core Mechanics', () => {
    
    test('should render game title and educational description', () => {
      render(<CyberClickerGame />)
      
      // These will fail initially - RED phase
      expect(screen.getByRole('heading', { name: /cybersecurity career clicker/i })).toBeInTheDocument()
      expect(screen.getByText(/build your cyber firm and explore career paths/i)).toBeInTheDocument()
    })
    
    test('should display initial Security Points and game stats', () => {
      render(<CyberClickerGame />)
      
      // Basic game stats should be visible
      expect(screen.getByText(/security points \(sp\)/i)).toBeInTheDocument()
      expect(screen.getByText(/sp per sec/i)).toBeInTheDocument()
      
      // Should start with some initial SP
      expect(screen.getByText('10')).toBeInTheDocument() // Default starting SP
    })
    
    test('should have a clickable defense button with clear feedback', () => {
      render(<CyberClickerGame />)
      
      const defenseButton = screen.getByRole('button', { name: /defend \(\+\d+ sp\)/i })
      expect(defenseButton).toBeInTheDocument()
      expect(defenseButton).toBeEnabled()
    })
  })
  
  describe('Click Mechanics and Visual Feedback', () => {
    
    test('should increment Security Points when defense button is clicked', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      const defenseButton = screen.getByRole('button', { name: /defend/i })
      
      // Initial SP should be 10
      expect(screen.getByText('10')).toBeInTheDocument()
      
      // Click to defend
      await user.click(defenseButton)
      
      // Should increase by click value (default 1)
      expect(screen.getByText('11')).toBeInTheDocument()
    })
    
    test('should show visual particle effects when clicking', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      const defenseButton = screen.getByRole('button', { name: /defend/i })
      
      // This test will fail initially - we need to implement particle effects
      await user.click(defenseButton)
      
      // Should create visual feedback for engagement
      expect(screen.getByTestId('click-particle')).toBeInTheDocument()
    })
    
    test('should track total clicks for achievement system', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      const defenseButton = screen.getByRole('button', { name: /defend/i })
      
      // Click multiple times
      await user.click(defenseButton)
      await user.click(defenseButton)
      await user.click(defenseButton)
      
      // Should track total clicks (this will fail initially)
      expect(screen.getByText(/total clicks: 3/i)).toBeInTheDocument()
    })
  })
  
  describe('Educational Career Role System', () => {
    
    test('should display entry-level cybersecurity roles with educational descriptions', () => {
      render(<CyberClickerGame />)
      
      // Entry-level roles should be visible from start
      expect(screen.getByText('SOC Analyst I')).toBeInTheDocument()
      expect(screen.getByText('Support Specialist')).toBeInTheDocument()
      expect(screen.getByText('Vulnerability Analyst')).toBeInTheDocument()
      expect(screen.getByText('IT Auditor')).toBeInTheDocument()
      
      // Should show educational descriptions
      expect(screen.getByText(/monitors security alerts/i)).toBeInTheDocument()
      expect(screen.getByText(/handles helpdesk tickets/i)).toBeInTheDocument()
    })
    
    test('should allow hiring entry-level roles when player has enough SP', async () => {
      // Mock localStorage to give player enough SP
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        sp: 100,
        totalSpEarned: 100,
        totalClicks: 0,
        hired: {},
        codex: {},
        achievements: [],
        scenarios: [],
        dayStreak: 1,
        playerLevel: 1,
        lastPlayDate: new Date().toDateString()
      }))
      
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Should have hire buttons for entry roles
      const hireButtons = screen.getAllByRole('button', { name: /hire \d+ sp/i })
      expect(hireButtons.length).toBeGreaterThan(0)
      
      // Click first hire button
      await user.click(hireButtons[0])
      
      // Should show hired count (this will fail initially)
      expect(screen.getByText(/x1/)).toBeInTheDocument()
    })
    
    test('should show detailed career information in codex when role is unlocked', () => {
      render(<CyberClickerGame />)
      
      // Career Codex should be visible
      expect(screen.getByText('Career Codex')).toBeInTheDocument()
      
      // Should show educational details for unlocked roles
      expect(screen.getByText(/level 1 career/i)).toBeInTheDocument()
    })
  })
  
  describe('Achievement System for Educational Motivation', () => {
    
    test('should unlock "Welcome to Cybersecurity" achievement on first click', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      const defenseButton = screen.getByRole('button', { name: /defend/i })
      
      // First click should trigger achievement
      await user.click(defenseButton)
      
      // Should show achievement notification (this will fail initially)
      await waitFor(() => {
        expect(screen.getByText(/achievement unlocked.*welcome to cybersecurity/i)).toBeInTheDocument()
      })
    })
    
    test('should track and display achievement progress', () => {
      render(<CyberClickerGame />)
      
      // Should have achievements section
      expect(screen.getByText(/achievements/i)).toBeInTheDocument()
      
      // Should show progress indicators (this will fail initially)
      expect(screen.getByText(/0\/8 achievements unlocked/i)).toBeInTheDocument()
    })
    
    test('should provide educational rewards for achievements', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Mock multiple clicks to unlock click master achievement
      const defenseButton = screen.getByRole('button', { name: /defend/i })
      
      for (let i = 0; i < 100; i++) {
        await user.click(defenseButton)
      }
      
      // Should unlock click master and improve click multiplier (this will fail initially)
      await waitFor(() => {
        expect(screen.getByText(/click master/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /defend \(\+2 sp\)/i })).toBeInTheDocument()
      })
    })
  })
  
  describe('Interactive Learning Scenarios', () => {
    
    test('should display available learning scenarios with difficulty levels', () => {
      render(<CyberClickerGame />)
      
      // Should have learning section
      expect(screen.getByText(/learning scenarios/i)).toBeInTheDocument()
      
      // Should show phishing detection scenario
      expect(screen.getByText('Spot the Phishing Email')).toBeInTheDocument()
      expect(screen.getByText('Creating Strong Passwords')).toBeInTheDocument()
      
      // Should show difficulty and time estimates
      expect(screen.getByText(/beginner/i)).toBeInTheDocument()
      expect(screen.getByText(/5 minutes/i)).toBeInTheDocument()
    })
    
    test('should allow players to start and complete learning scenarios', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Click on phishing scenario
      const phishingScenario = screen.getByText('Spot the Phishing Email')
      await user.click(phishingScenario)
      
      // Should open scenario interface (this will fail initially)
      expect(screen.getByText(/learn to identify suspicious emails/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /start scenario/i })).toBeInTheDocument()
    })
    
    test('should provide educational feedback for scenario answers', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Start phishing scenario
      const phishingScenario = screen.getByText('Spot the Phishing Email')
      await user.click(phishingScenario)
      
      const startButton = screen.getByRole('button', { name: /start scenario/i })
      await user.click(startButton)
      
      // Should show question with multiple choice
      expect(screen.getByText(/which.*email.*phishing/i)).toBeInTheDocument()
      
      // Select correct answer
      const correctAnswer = screen.getByText(/email from your bank asking you to click/i)
      await user.click(correctAnswer)
      
      // Should show educational feedback (this will fail initially)
      expect(screen.getByText(/correct.*urgent requests to click links/i)).toBeInTheDocument()
    })
  })
  
  describe('Active Threat Response System', () => {
    
    test('should randomly generate threat events for educational engagement', async () => {
      render(<CyberClickerGame />)
      
      // Mock random threat generation
      jest.advanceTimersByTime(30000) // Advance 30 seconds
      
      // Should show threat event (this will fail initially)
      await waitFor(() => {
        expect(screen.getByText(/ddos attack|malware detected|data breach/i)).toBeInTheDocument()
      })
    })
    
    test('should require specific roles to handle different threats', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Mock having hired SOC analysts
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        sp: 1000,
        hired: { 'soc1': 2 },
        // ... other state
      }))
      
      // Trigger DDoS threat event
      jest.advanceTimersByTime(30000)
      
      await waitFor(() => {
        expect(screen.getByText(/ddos attack/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /respond to threat/i })).toBeInTheDocument()
      })
    })
  })
  
  describe('Idle Game Mechanics and Progression', () => {
    
    test('should automatically generate SP based on hired employees', async () => {
      // Mock having hired employees
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        sp: 100,
        hired: { 'soc1': 1, 'sup_spec': 1 },
        // ... other state
      }))
      
      render(<CyberClickerGame />)
      
      // Should show SP per second based on hired roles
      expect(screen.getByText(/1\.5/)).toBeInTheDocument() // 1.0 + 0.5 SP/sec
      
      // Advance time by 1 second
      jest.advanceTimersByTime(1000)
      
      // SP should increase automatically (this will fail initially)
      await waitFor(() => {
        expect(screen.getByText('101')).toBeInTheDocument() // 100 + 1.5
      })
    })
    
    test('should save and load game progress from localStorage', () => {
      const mockSaveData = {
        sp: 500,
        totalSpEarned: 1000,
        totalClicks: 50,
        hired: { 'soc1': 2, 'sup_spec': 1 },
        codex: { 'soc1': true, 'sup_spec': true },
        achievements: ['first_click', 'first_hire'],
        scenarios: ['phishing_detection'],
        dayStreak: 3,
        playerLevel: 2,
        lastPlayDate: new Date().toDateString()
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSaveData))
      
      render(<CyberClickerGame />)
      
      // Should load saved state
      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText(/day streak: 3/i)).toBeInTheDocument()
      expect(screen.getByText(/level 2/i)).toBeInTheDocument()
    })
  })
  
  describe('Educational Content and Real-World Connections', () => {
    
    test('should display rotating cybersecurity news with educational context', () => {
      render(<CyberClickerGame />)
      
      // Should show news ticker
      expect(screen.getByText(/news:/i)).toBeInTheDocument()
      
      // Should show educational news items
      expect(screen.getByText(/zero-day exploit|soc analysts detect|pen testers/i)).toBeInTheDocument()
    })
    
    test('should provide detailed career information with real-world tasks', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      // Click on a role to see details
      const socAnalyst = screen.getByText('SOC Analyst I')
      await user.click(socAnalyst)
      
      // Should show detailed career information (this will fail initially)
      expect(screen.getByText(/soc.*security operations center.*analysts/i)).toBeInTheDocument()
      expect(screen.getByText(/monitor security dashboards/i)).toBeInTheDocument()
      expect(screen.getByText(/analyze security alerts/i)).toBeInTheDocument()
    })
    
    test('should connect game mechanics to real cybersecurity concepts', () => {
      render(<CyberClickerGame />)
      
      // Should have educational tooltips and explanations
      expect(screen.getByText(/security points represent your organization's cyber defense capability/i)).toBeInTheDocument()
      
      // Should explain role hierarchies
      expect(screen.getByText(/tier 1.*entry level/i)).toBeInTheDocument()
      expect(screen.getByText(/tier 2.*mid-level/i)).toBeInTheDocument()
    })
  })
  
  describe('Accessibility and Middle School Engagement', () => {
    
    test('should have proper ARIA labels and keyboard navigation', () => {
      render(<CyberClickerGame />)
      
      // Main game button should have proper accessibility
      const defenseButton = screen.getByRole('button', { name: /defend/i })
      expect(defenseButton).toHaveAttribute('aria-label', expect.stringContaining('defense'))
      
      // Interactive elements should be keyboard accessible
      expect(defenseButton).toHaveAttribute('tabIndex', '0')
    })
    
    test('should use age-appropriate language and clear explanations', () => {
      render(<CyberClickerGame />)
      
      // Should avoid overly technical jargon
      expect(screen.getByText(/build your cyber firm/i)).toBeInTheDocument()
      expect(screen.getByText(/defend/i)).toBeInTheDocument()
      
      // Should provide clear, engaging descriptions
      expect(screen.getByText(/monitors security alerts and investigates basic incidents/i)).toBeInTheDocument()
    })
    
    test('should provide progressive difficulty and clear learning paths', () => {
      render(<CyberClickerGame />)
      
      // Should show clear progression from entry to advanced roles
      const codexSection = screen.getByText('Career Codex')
      expect(codexSection).toBeInTheDocument()
      
      // Should indicate skill development and career advancement
      expect(screen.getByText(/promote/i)).toBeInTheDocument()
      expect(screen.getByText(/next role/i)).toBeInTheDocument()
    })
  })
  
  describe('Performance and User Experience', () => {
    
    test('should handle rapid clicking without performance issues', async () => {
      render(<CyberClickerGame />)
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      const defenseButton = screen.getByRole('button', { name: /defend/i })
      
      // Rapid clicking test
      const startTime = performance.now()
      for (let i = 0; i < 50; i++) {
        await user.click(defenseButton)
      }
      const endTime = performance.now()
      
      // Should handle rapid clicks efficiently
      expect(endTime - startTime).toBeLessThan(1000) // Should complete in under 1 second
    })
    
    test('should maintain responsive design across different screen sizes', () => {
      // Mock different screen sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
      
      render(<CyberClickerGame />)
      
      // Should maintain layout integrity on mobile
      const gameContainer = screen.getByRole('main', { name: /cyber clicker game/i })
      expect(gameContainer).toHaveClass(/responsive|grid|flex/i)
    })
  })
})

// Additional test utilities for complex scenarios
describe('CyberClickerGame - Advanced Educational Features', () => {
  
  test('should simulate realistic cybersecurity career progression', async () => {
    // This test will verify the complete career journey
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    
    // Mock progression through multiple career levels
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      sp: 10000,
      hired: { 'soc1': 5, 'soc2': 2, 'threat_hunter': 1 },
      achievements: ['first_hire', 'promotion_master'],
      scenarios: ['phishing_detection', 'password_strength'],
      // ... other advanced state
    }))
    
    render(<CyberClickerGame />)
    
    // Should show advanced roles and career paths
    expect(screen.getByText('Threat Hunter')).toBeInTheDocument()
    expect(screen.getByText(/elite cyber defender/i)).toBeInTheDocument()
    
    // Should show realistic career progression options
    expect(screen.getByText(/promote to ciso/i)).toBeInTheDocument()
  })
  
  test('should integrate with external cybersecurity educational content', () => {
    render(<CyberClickerGame />)
    
    // Should provide links to real cybersecurity resources
    expect(screen.getByRole('link', { name: /learn more about soc analyst careers/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cybersecurity career guide/i })).toBeInTheDocument()
  })
})
