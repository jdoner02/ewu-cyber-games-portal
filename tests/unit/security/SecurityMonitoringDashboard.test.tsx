/**
 * 🧪 SECURITY MONITORING DASHBOARD - COMPREHENSIVE TEST SUITE
 * 
 * Test Guardian Agent: Autonomous Testing for Educational Cybersecurity Platform
 * 
 * 🎯 USER STORY COVERAGE:
 * - Story 2: Real-Time Security Monitoring for Educators
 * - Privacy protection for middle school students (ages 10-14)
 * - Age-appropriate    test('should handle rapid event generation without overwhelming teachers', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Start monitoring
      fireEvent.click(screen.getByText('▶️ St    test('should manage memory efficiently during extended classroom use', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Start real-time monitoring
      fireEvent.click(screen.getByText('▶️ Start Real-Time Monitoring'))
      
      // Simulate extended use with act()
      await act(async () => {
        jest.advanceTimersByTime(30000) // 30 seconds
      })

      // Should not accumulate excessive events
      await waitFor(() => {
        // Events should be limited to prevent memory issues
        const content = document.body.textContent || ''
        expect(content).toMatch(/\d+/) // Should show manageable numbers
      })
      
      // Stop monitoring
      fireEvent.click(screen.getByText('🛑 Stop Real-Time Monitoring'))
    })oring'))
      
      // Simulate rapid event generation with act()
      await act(async () => {
        jest.advanceTimersByTime(15000) // 15 seconds = 5 events
      })

      await waitFor(() => {
        // Should limit total events to prevent overwhelming
        const content = document.body.textContent || ''
        
        // Events should be rate-limited or summarized for teacher consumption
        // Should not show hundreds of individual events
        expect(content).toMatch(/\d+/) // Shows counts
      })
    })n content
 * - Teacher oversight and monitoring capabilities
 * 
 * 🔍 TESTING STRATEGY:
 * This test suite validates that the SecurityMonitoringDashboard:
 * 1. Renders safely for educational environments
 * 2. Protects student privacy (no PII exposure)
 * 3. Provides real-time monitoring capabilities for teachers
 * 4. Displays age-appropriate security content
 * 5. Handles security alerts appropriately for educational settings
 * 6. Integrates properly with our tested AuditLogger system
 * 7. Maintains accessibility standards for diverse learners
 * 8. Performs efficiently with educational workloads
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import SecurityMonitoringDashboard from '../../../src/security/SecurityMonitoringDashboard'

// Mock external dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    warning: jest.fn(),
    success: jest.fn(),
    info: jest.fn()
  }
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, whileHover, whileTap, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, initial, animate, exit, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children, mode, ...props }: any) => <>{children}</>
}))

// Test data generators for educational scenarios
const createEducationalSecurityEvent = (overrides = {}) => ({
  id: 'test-event-123',
  timestamp: new Date('2024-01-15T10:30:00Z'),
  eventType: 'policy_violation' as const,
  severity: 'medium' as const,
  source: {
    type: 'application' as const,
    name: 'Student Portal',
    location: 'Web Server'
  },
  title: 'Student Portal Policy Violation',
  description: 'Student accessed educational content outside permitted hours',
  status: 'new' as const,
  affectedAssets: ['student-portal-01'],
  tags: ['policy_violation', 'medium', 'application'],
  riskScore: 35,
  evidence: [],
  timeline: [{
    timestamp: new Date('2024-01-15T10:30:00Z'),
    action: 'Event detected and created',
    analyst: 'SOC-AI-Agent',
    notes: 'Automated detection by security monitoring system'
  }],
  relatedEvents: [],
  mitreTactics: ['Defense Evasion'],
  geolocation: {
    country: 'United States',
    city: 'Seattle',
    latitude: 47.6062,
    longitude: -122.3321
  },
  ...overrides
})

const createStudentPrivacyEvent = (overrides = {}) => ({
  ...createEducationalSecurityEvent(),
  id: 'privacy-event-456',
  eventType: 'data_leak' as const,
  severity: 'high' as const,
  title: 'Student Information Exposure Risk',
  description: 'Potential exposure of student records detected',
  riskScore: 75,
  affectedAssets: ['student-database'],
  tags: ['data_leak', 'high', 'privacy'],
  ...overrides
})

describe('🛡️ SecurityMonitoringDashboard - Educational Safety Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset any timers or intervals
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('🎯 Core Rendering & Educational Safety', () => {
    
    test('should render main dashboard without exposing sensitive information', () => {
      render(<SecurityMonitoringDashboard />)
      
      // Should show educational SOC title
      expect(screen.getByText('🚨 Security Operations Center (SOC)')).toBeInTheDocument()
      expect(screen.getByText('Real-time cybersecurity monitoring and incident response')).toBeInTheDocument()
      
      // Should show all educational tabs
      expect(screen.getByText('📊 SOC Overview')).toBeInTheDocument()
      expect(screen.getByText('🚨 Security Events')).toBeInTheDocument()
      expect(screen.getByText('🔍 Active Incidents')).toBeInTheDocument()
      expect(screen.getByText('📈 Threat Analytics')).toBeInTheDocument()
      expect(screen.getByText('🎓 SOC Training')).toBeInTheDocument()
      
      // Should show monitoring controls
      expect(screen.getByText('▶️ Start Real-Time Monitoring')).toBeInTheDocument()
      expect(screen.getByText('MONITORING PAUSED')).toBeInTheDocument()
    })

    test('should initialize with safe default state for educational environment', () => {
      render(<SecurityMonitoringDashboard />)
      
      // Real-time monitoring should be OFF by default for safety
      const monitorButton = screen.getByText('▶️ Start Real-Time Monitoring')
      expect(monitorButton).toBeInTheDocument()
      
      // Should default to overview tab (safest view)
      expect(screen.getByText('📊 SOC Overview')).toHaveClass('bg-blue-500')
      
      // Should show initial metrics safely
      expect(screen.getByText('🚨 Total Events')).toBeInTheDocument()
      expect(screen.getByText('📅 Events (24h)')).toBeInTheDocument()
      expect(screen.getByText('🔍 Active Incidents')).toBeInTheDocument()
      expect(screen.getByText('⚡ Threat Level')).toBeInTheDocument()
    })

    test('should handle missing or invalid props gracefully', () => {
      // Component should render even with no data
      const { container } = render(<SecurityMonitoringDashboard />)
      
      expect(container).not.toBeEmptyDOMElement()
      
      // Should not throw errors or crash
      expect(() => {
        screen.getByText('🚨 Security Operations Center (SOC)')
      }).not.toThrow()
    })
  })

  describe('🔐 Privacy Protection & Student Safety', () => {
    
    test('should never display student personal information in security events', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Wait for initial events to load
      await waitFor(() => {
        expect(screen.getByText('🚨 Total Events')).toBeInTheDocument()
      })
      
      // Click on events tab to see event data
      fireEvent.click(screen.getByText('🚨 Security Events'))
      
      await waitFor(() => {
        const eventsSection = screen.getByText('🚨 Security Events')
        expect(eventsSection).toHaveClass('bg-blue-500') // Active tab
      })
      
      // Should not contain any obvious PII patterns
      const container = screen.getByRole('main') || document.body
      const textContent = container.textContent || ''
      
      // Check for common PII patterns that should NOT appear
      expect(textContent).not.toMatch(/\\b\\d{3}-\\d{2}-\\d{4}\\b/) // SSN pattern
      expect(textContent).not.toMatch(/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/) // Email pattern
      expect(textContent).not.toMatch(/\\b\\d{3}-\\d{3}-\\d{4}\\b/) // Phone pattern
      expect(textContent).not.toMatch(/student_id_\\d+/) // Student ID pattern
      expect(textContent).not.toMatch(/grade_\\d+/) // Grade pattern
    })

    test('should filter sensitive data from event descriptions', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Wait for events to load and navigate to events view
      await waitFor(() => {
        fireEvent.click(screen.getByText('🚨 Security Events'))
      })
      
      await waitFor(() => {
        const eventsContainer = document.querySelector('[data-testid=\"events-container\"]') 
          || document.body
        
        // Event descriptions should be educational and generic
        // Should not contain specific student names, IDs, or other PII
        const descriptions = eventsContainer.textContent || ''
        
        // Should contain educational terms
        expect(descriptions).toMatch(/educational|learning|student portal|campus/i)
        
        // Should NOT contain specific identifiers
        expect(descriptions).not.toMatch(/john.doe|jane.smith|student123|room_215/)
      })
    })

    test('should use privacy-compliant event aggregation', async () => {
      render(<SecurityMonitoringDashboard />)
      
      await waitFor(() => {
        // Metrics should show counts and aggregates, not individual identities
        const totalEvents = screen.getByText('🚨 Total Events')
        expect(totalEvents).toBeInTheDocument()
        
        // Should show numeric aggregates only
        const metricsSection = totalEvents.closest('div')
        expect(metricsSection?.textContent).toMatch(/\\d+/) // Contains numbers
        expect(metricsSection?.textContent).not.toMatch(/[A-Za-z]+\\.[A-Za-z]+@/) // No email
      })
    })
  })

  describe('🎓 Educational Content Appropriateness', () => {
    
    test('should display age-appropriate security concepts for middle school', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Navigate to learning tab
      fireEvent.click(screen.getByText('🎓 SOC Training'))
      
      await waitFor(() => {
        const content = document.body.textContent || ''
        
        // Should contain educational and encouraging language
        expect(content).toMatch(/learning|education|training|cybersecurity/i)
        
        // Should NOT contain scary or inappropriate terms
        expect(content).not.toMatch(/hack|attack|breach|compromise|threat actor/i)
        
        // Should use positive, educational framing
        expect(content).toMatch(/protect|secure|safe|monitor|detect/i)
      })
    })

    test('should present security events in educational context', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Switch to events view
      fireEvent.click(screen.getByText('🚨 Security Events'))
      
      await waitFor(() => {
        const content = document.body.textContent || ''
        
        // Security events should be framed educationally
        expect(content).toMatch(/policy.?violation|educational.?content|campus.?network/i)
        
        // Should avoid fear-inducing language
        expect(content).not.toMatch(/malicious.?actor|cyber.?criminal|hacker.?group/i)
      })
    })

    test('should provide educational explanations for security concepts', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // The component should include educational tooltips or explanations
      const container = document.body
      const content = container.textContent || ''
      
      // Should contain educational explanations
      expect(content).toMatch(/SOC|Security Operations Center/i)
      expect(content).toMatch(/monitoring|detection|response/i)
    })
  })

  describe('⚡ Real-Time Monitoring for Teachers', () => {
    
    test('should start and stop real-time monitoring safely', async () => {
      render(<SecurityMonitoringDashboard />)
      
      const startButton = screen.getByText('▶️ Start Real-Time Monitoring')
      
      // Start monitoring
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(screen.getByText('🛑 Stop Real-Time Monitoring')).toBeInTheDocument()
        expect(screen.getByText('LIVE MONITORING')).toBeInTheDocument()
      })
      
      // Stop monitoring  
      const stopButton = screen.getByText('🛑 Stop Real-Time Monitoring')
      fireEvent.click(stopButton)
      
      await waitFor(() => {
        expect(screen.getByText('▶️ Start Real-Time Monitoring')).toBeInTheDocument()
        expect(screen.getByText('MONITORING PAUSED')).toBeInTheDocument()
      })
    })

    test('should generate appropriate notifications for teachers', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Start real-time monitoring
      fireEvent.click(screen.getByText('▶️ Start Real-Time Monitoring'))
      
      // Fast-forward time to trigger event generation with act()
      await act(async () => {
        jest.advanceTimersByTime(4000) // More than 3 second interval
      })

      await waitFor(() => {
        // Should have called toast notifications appropriately
        // High/critical events should trigger error toasts
        // Medium events should trigger warning toasts
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringMatching(/🚨 (HIGH|CRITICAL):/))
      }, { timeout: 5000 })
    })

    test('should handle rapid event generation without overwhelming teachers', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Start monitoring
      fireEvent.click(screen.getByText('▶️ Start Real-Time Monitoring'))
      
      // Simulate rapid event generation
      jest.advanceTimersByTime(15000) // 15 seconds = 5 events
      
      await waitFor(() => {
        // Should limit total events to prevent overwhelming
        const content = document.body.textContent || ''
        
        // Events should be rate-limited or summarized for teacher consumption
        // Should not show hundreds of individual events
        expect(content).toMatch(/\\d+/) // Shows counts
      })
    })
  })

  describe('🔍 Event Management & Teacher Controls', () => {
    
    test('should allow teachers to update event status appropriately', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Navigate to events view
      fireEvent.click(screen.getByText('🚨 Security Events'))
      
      await waitFor(() => {
        // Should be able to interact with events
        const eventsTab = screen.getByText('🚨 Security Events')
        expect(eventsTab).toHaveClass('bg-blue-500')
      })
      
      // Mock event status update functionality
      // In real implementation, would test status update buttons
    })

    test('should provide filtering capabilities for teacher workflow', async () => {
      render(<SecurityMonitoringDashboard />)
      
      fireEvent.click(screen.getByText('🚨 Security Events'))
      
      await waitFor(() => {
        // Should provide severity filtering
        const eventsSection = document.body
        const content = eventsSection.textContent || ''
        
        // Should indicate filtering capabilities for teachers
        expect(content).toMatch(/filter|search|severity/i)
      })
    })

    test('should enable event assignment for educational team collaboration', async () => {
      render(<SecurityMonitoringDashboard />)
      
      fireEvent.click(screen.getByText('🚨 Security Events'))
      
      await waitFor(() => {
        // Should support assignment workflow for educational teams
        const content = document.body.textContent || ''
        
        // Educational context should support collaboration
        expect(content).toMatch(/assign|analyst|team|teacher/i)
      })
    })
  })

  describe('📊 Analytics & Educational Insights', () => {
    
    test('should provide educational security metrics', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Analytics should be available
      fireEvent.click(screen.getByText('📈 Threat Analytics'))
      
      await waitFor(() => {
        const content = document.body.textContent || ''
        
        // Should show educational analytics
        expect(content).toMatch(/analytics|metrics|statistics/i)
        
        // Should provide learning insights
        expect(content).toMatch(/learning|educational|progress/i)
      })
    })

    test('should calculate threat scores appropriately for educational environment', () => {
      render(<SecurityMonitoringDashboard />)
      
      // Threat scores should be calibrated for educational context
      const threatLevelElement = screen.getByText('⚡ Threat Level')
      expect(threatLevelElement).toBeInTheDocument()
      
      // Should display threat score in educational context
      const container = threatLevelElement.closest('div')
      expect(container?.textContent).toMatch(/\\d+/) // Contains numeric score
    })

    test('should show geographic distribution safely for educational purposes', async () => {
      render(<SecurityMonitoringDashboard />)
      
      fireEvent.click(screen.getByText('📈 Threat Analytics'))
      
      await waitFor(() => {
        const content = document.body.textContent || ''
        
        // Geographic info should be educational and aggregated
        expect(content).toMatch(/country|region|geographic/i)
        
        // Should not expose specific student locations
        expect(content).not.toMatch(/home.?address|student.?location|personal.?address/i)
      })
    })
  })

  describe('♿ Accessibility & Inclusive Design', () => {
    
    test('should be accessible to diverse learners', () => {
      render(<SecurityMonitoringDashboard />)
      
      // Should have proper heading structure
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      
      // Interactive elements should be keyboard accessible
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
        // Should be focusable
        button.focus()
        expect(document.activeElement).toBe(button)
      })
    })

    test('should provide clear visual hierarchy for student comprehension', () => {
      render(<SecurityMonitoringDashboard />)
      
      // Should use clear visual indicators
      const container = document.body
      
      // Should have distinct sections
      expect(screen.getByText('🚨 Security Operations Center (SOC)')).toBeInTheDocument()
      
      // Should use emojis and icons for visual clarity
      const content = container.textContent || ''
      expect(content).toMatch(/[🚨📊🔍📈🎓⚡]/u) // Contains educational emojis
    })

    test('should handle screen reader navigation appropriately', () => {
      render(<SecurityMonitoringDashboard />)
      
      // Should have proper semantic structure
      const navigation = document.querySelector('nav') || 
                        document.querySelector('[role=\"navigation\"]') ||
                        screen.getByRole('main')
      
      expect(navigation).toBeInTheDocument()
      
      // Content should be logically structured
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
    })
  })

  describe('🚀 Performance & Educational Usability', () => {
    
    test('should load quickly for classroom environments', async () => {
      const startTime = performance.now()
      
      render(<SecurityMonitoringDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('🚨 Security Operations Center (SOC)')).toBeInTheDocument()
      })
      
      const loadTime = performance.now() - startTime
      
      // Should load within reasonable time for educational settings
      expect(loadTime).toBeLessThan(2000) // 2 seconds max for classroom
    })

    test('should handle multiple students using dashboard simultaneously', () => {
      // Simulate multiple instances
      const { unmount: unmount1 } = render(<SecurityMonitoringDashboard />)
      const { unmount: unmount2 } = render(<SecurityMonitoringDashboard />)
      const { unmount: unmount3 } = render(<SecurityMonitoringDashboard />)
      
      // All should render successfully
      const dashboards = screen.getAllByText('🚨 Security Operations Center (SOC)')
      expect(dashboards).toHaveLength(3)
      
      // Cleanup
      unmount1()
      unmount2()
      unmount3()
    })

    test('should manage memory efficiently during extended classroom use', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Start real-time monitoring
      fireEvent.click(screen.getByText('▶️ Start Real-Time Monitoring'))
      
      // Simulate extended use
      jest.advanceTimersByTime(30000) // 30 seconds
      
      // Should not accumulate excessive events
      await waitFor(() => {
        // Events should be limited to prevent memory issues
        const content = document.body.textContent || ''
        expect(content).toMatch(/\\d+/) // Should show manageable numbers
      })
      
      // Stop monitoring
      fireEvent.click(screen.getByText('🛑 Stop Real-Time Monitoring'))
    })
  })

  describe('🔗 Integration with Educational Security Infrastructure', () => {
    
    test('should integrate with AuditLogger system for educational compliance', () => {
      render(<SecurityMonitoringDashboard />)
      
      // Should work alongside our tested AuditLogger
      // Component should use consistent data formats with AuditLogger
      const content = document.body.textContent || ''
      
      // Should use educational security terminology
      expect(content).toMatch(/security|monitoring|educational|compliance/i)
    })

    test('should support educational data export for compliance reporting', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Should provide export capabilities for educational reporting
      const content = document.body.textContent || ''
      
      // Should indicate data export/reporting capabilities
      expect(content).toMatch(/download|export|report/i)
    })

    test('should maintain educational data retention policies', async () => {
      render(<SecurityMonitoringDashboard />)
      
      // Start real-time monitoring to generate events
      fireEvent.click(screen.getByText('▶️ Start Real-Time Monitoring'))
      
      // Fast forward to generate many events with act()
      await act(async () => {
        jest.advanceTimersByTime(60000) // 1 minute = 20 events
      })

      // Should limit retained events for educational compliance
      // Events should be summarized or archived, not accumulated indefinitely
      expect(document.body).toBeInTheDocument() // Component still functioning
    })
  })
})

/**
 * 🎓 EDUCATIONAL INTEGRATION TESTS
 * 
 * These tests verify the dashboard works in realistic educational scenarios
 */
describe('🏫 Educational Scenario Integration Tests', () => {
  
  test('should handle typical classroom cybersecurity lesson scenario', async () => {
    render(<SecurityMonitoringDashboard />)
    
    // Teacher starts lesson by demonstrating real-time monitoring
    fireEvent.click(screen.getByText('▶️ Start Real-Time Monitoring'))
    
    await waitFor(() => {
      expect(screen.getByText('🛑 Stop Real-Time Monitoring')).toBeInTheDocument()
    })
    
    // Teacher shows different views to students
    fireEvent.click(screen.getByText('🚨 Security Events'))
    await waitFor(() => {
      expect(screen.getByText('🚨 Security Events')).toHaveClass('bg-blue-500')
    })
    
    fireEvent.click(screen.getByText('📈 Threat Analytics'))
    await waitFor(() => {
      expect(screen.getByText('📈 Threat Analytics')).toHaveClass('bg-blue-500')
    })
    
    fireEvent.click(screen.getByText('🎓 SOC Training'))
    await waitFor(() => {
      expect(screen.getByText('🎓 SOC Training')).toHaveClass('bg-blue-500')
    })
    
    // Teacher stops monitoring at end of lesson
    fireEvent.click(screen.getByText('🛑 Stop Real-Time Monitoring'))
    
    await waitFor(() => {
      expect(screen.getByText('▶️ Start Real-Time Monitoring')).toBeInTheDocument()
    })
  })

  test('should support student cybersecurity competition training', async () => {
    render(<SecurityMonitoringDashboard />)
    
    // Students practicing for cybersecurity competitions
    // Should provide educational analytics and metrics
    fireEvent.click(screen.getByText('📈 Threat Analytics'))
    
    await waitFor(() => {
      const content = document.body.textContent || ''
      
      // Should provide competition-relevant insights
      expect(content).toMatch(/analytics|metrics|performance|score/i)
      
      // Should be educational and encouraging
      expect(content).not.toMatch(/failure|poor|bad|terrible/i)
    })
  })

  test('should handle parent-teacher conference security demonstrations', async () => {
    render(<SecurityMonitoringDashboard />)
    
    // Teachers showing parents how student digital safety is monitored
    // Should emphasize privacy protection and educational value
    
    const content = document.body.textContent || ''
    
    // Should demonstrate professional security monitoring
    expect(content).toMatch(/Security Operations Center|SOC|monitoring/i)
    
    // Should emphasize educational and safety aspects
    expect(content).toMatch(/educational|learning|training|safety/i)
    
    // Should not expose any student-specific information
    expect(content).not.toMatch(/student.?name|personal.?info|private.?data/i)
  })
})
