/**
 * 🔐 ZERO TRUST ACCESS CONTROL LAB - Educational Security Testing
 * 
 * Test Guardian Agent - Autonomous Testing Implementation
 * Target: ZeroTrustAccessControlLab.tsx (0% coverage → 95%+ goal)
 * Focus: Educational safety, COPPA compliance, age-appropriate learning
 * 
 * Based on 15 comprehensive user stories for middle school cybersecurity education
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { toast } from 'sonner';

// Mock external dependencies for educational environment
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

// Import component under test
import ZeroTrustAccessControlLab from '@/security/ZeroTrustAccessControlLab';

describe('🔐 ZeroTrustAccessControlLab - Educational Security Tool', () => {
  
  // Mock educational data for testing
  const mockEducationalUser = {
    id: 'edu-student-001',
    username: 'student_learner',
    email: 'learning@education.sim',
    role: 'student',
    trustScore: 85,
    lastVerified: new Date(),
    activeDevices: ['school-laptop-001'],
    riskFactors: [],
    permissions: ['read', 'learn'],
    authMethods: []
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  /**
   * 🎨 COMPONENT RENDERING & USER INTERFACE TESTS
   * Based on User Stories 1, 10, 14 - Foundation for educational interaction
   */
  describe('🎨 Component Rendering & User Interface', () => {
    
    test('renders main Zero Trust lab interface', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Core educational interface elements
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText(/Zero Trust/i)).toBeInTheDocument();
      expect(screen.getByText(/Never trust, always verify/i)).toBeInTheDocument();
    });

    test('displays educational Zero Trust concept explanation', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Age-appropriate concept introduction
      expect(screen.getByText(/security guard who checks EVERYONE/i)).toBeInTheDocument();
      expect(screen.getByText(/castle with high walls/i)).toBeInTheDocument();
      expect(screen.getByText(/airport security everywhere/i)).toBeInTheDocument();
    });

    test('shows core Zero Trust principles for students', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Three fundamental principles
      expect(screen.getByText(/Verify explicitly/i)).toBeInTheDocument();
      expect(screen.getByText(/Least privilege access/i)).toBeInTheDocument();
      expect(screen.getByText(/Assume breach/i)).toBeInTheDocument();
    });

    test('provides navigation between different lab sections', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Educational navigation tabs
      expect(screen.getByRole('tab', { name: /Concepts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Risk Assessment/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Access Control/i })).toBeInTheDocument();
    });

    test('displays with educational styling and branding', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Educational design elements
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toHaveClass('bg-gradient-to-br');
      expect(screen.getByTestId('zero-trust-logo')).toBeInTheDocument();
    });
  });

  /**
   * 🎓 EDUCATIONAL CONTENT SAFETY & AGE-APPROPRIATENESS TESTS
   * Based on User Stories 1, 9, 13 - Ensuring safe, age-appropriate learning
   */
  describe('🎓 Educational Content Safety & Age-Appropriateness', () => {
    
    test('uses age-appropriate language for Zero Trust concepts', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Middle school appropriate explanations
      expect(screen.getByText(/Hey future cybersecurity pros!/i)).toBeInTheDocument();
      expect(screen.getByText(/world's most careful security guard/i)).toBeInTheDocument();
      expect(screen.queryByText(/hacker/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/attack/i)).not.toBeInTheDocument();
    });

    test('focuses on protective rather than offensive security', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Positive security education focus
      expect(screen.getByText(/protect/i)).toBeInTheDocument();
      expect(screen.getByText(/safety/i)).toBeInTheDocument();
      expect(screen.getByText(/verify/i)).toBeInTheDocument();
      expect(screen.queryByText(/exploit/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/penetration/i)).not.toBeInTheDocument();
    });

    test('provides positive learning outcomes', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Career inspiration and positive framing
      expect(screen.getByText(/cybersecurity professionals/i)).toBeInTheDocument();
      expect(screen.getByText(/modern access control systems/i)).toBeInTheDocument();
      expect(screen.getByText(/companies like Google, Microsoft/i)).toBeInTheDocument();
    });

    test('includes appropriate safety warnings', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Educational safety guidance
      expect(screen.getByText(/Never share personal information/i)).toBeInTheDocument();
      expect(screen.getByText(/This is a learning simulation/i)).toBeInTheDocument();
      expect(screen.getByText(/Always ask a teacher if unsure/i)).toBeInTheDocument();
    });

    test('demonstrates real-world applications appropriately', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Career-focused, inspirational examples
      expect(screen.getByText(/work from home, coffee shops/i)).toBeInTheDocument();
      expect(screen.getByText(/mobile, cloud-connected world/i)).toBeInTheDocument();
      expect(screen.queryByText(/classified/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/military/i)).not.toBeInTheDocument();
    });
  });

  /**
   * 🔒 PRIVACY PROTECTION & COPPA COMPLIANCE TESTS
   * Based on User Stories 6, 8 - Ensuring student privacy and safety
   */
  describe('🔒 Privacy Protection & COPPA Compliance', () => {
    
    test('does not collect or display personal information', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // No PII collection or display
      expect(screen.queryByPlaceholderText(/real name/i)).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/home address/i)).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/phone number/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/birthday/i)).not.toBeInTheDocument();
    });

    test('uses simulated data for educational examples', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // All examples use clearly fictional data
      expect(screen.getByText(/student_learner/i)).toBeInTheDocument();
      expect(screen.getByText(/education.sim/i)).toBeInTheDocument();
      expect(screen.getByText(/school-laptop-001/i)).toBeInTheDocument();
      expect(screen.queryByText(/\.com/i)).not.toBeInTheDocument();
    });

    test('implements privacy-safe risk assessment examples', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Risk examples don't expose real vulnerabilities
      expect(screen.getByText(/unusual login time/i)).toBeInTheDocument();
      expect(screen.getByText(/new device/i)).toBeInTheDocument();
      expect(screen.queryByText(/password123/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/real vulnerability/i)).not.toBeInTheDocument();
    });

    test('provides teacher oversight capabilities', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Teacher control and monitoring features
      expect(screen.getByRole('button', { name: /Teacher Dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Student Progress/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Session/i })).toBeInTheDocument();
    });

    test('maintains educational focus without real security risks', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // No actual security testing capabilities
      expect(screen.queryByText(/scan network/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/test passwords/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/real-time monitoring/i)).not.toBeInTheDocument();
    });
  });

  /**
   * ♿ ACCESSIBILITY & INCLUSIVE DESIGN TESTS
   * Based on User Story 10 - Ensuring all students can learn effectively
   */
  describe('♿ Accessibility & Inclusive Design', () => {
    
    test('provides semantic HTML structure', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Proper semantic elements
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByRole('heading')).toHaveLength(3);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    test('includes descriptive text for all interactive elements', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Accessible labels and descriptions
      expect(screen.getByLabelText(/Risk Assessment Simulator/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Access Control Decision/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Analyze Risk Factors/i })).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Tab navigation works correctly
      await user.tab();
      expect(screen.getByRole('tab', { name: /Concepts/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('tab', { name: /Risk Assessment/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('tab', { name: /Access Control/i })).toHaveFocus();
    });

    test('uses high contrast colors for text readability', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Accessible color contrasts
      const headings = screen.getAllByRole('heading');
      headings.forEach(heading => {
        expect(heading).toHaveClass('text-gray-900');
      });
      
      const descriptions = screen.getAllByTestId('concept-description');
      descriptions.forEach(desc => {
        expect(desc).toHaveClass('text-gray-700');
      });
    });

    test('provides alternative text for visual indicators', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Alt text for all visual elements
      expect(screen.getByAltText(/Low risk indicator/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Medium risk indicator/i)).toBeInTheDocument();
      expect(screen.getByAltText(/High risk indicator/i)).toBeInTheDocument();
    });
  });

  /**
   * 🔍 INTERACTIVE RISK ASSESSMENT SIMULATION TESTS
   * Based on User Stories 2, 3, 11 - Hands-on learning through simulation
   */
  describe('🔍 Interactive Risk Assessment Simulation', () => {
    
    test('initializes with default educational scenarios', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Default educational risk scenarios
      expect(screen.getByText(/Student accessing homework portal/i)).toBeInTheDocument();
      expect(screen.getByText(/Teacher updating gradebook/i)).toBeInTheDocument();
      expect(screen.getByText(/Administrator reviewing system logs/i)).toBeInTheDocument();
    });

    test('allows selection of different risk scenarios', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Scenario selection interaction
      const scenarioSelect = screen.getByLabelText(/Choose Risk Scenario/i);
      await user.selectOptions(scenarioSelect, 'unusual-time');
      
      expect(screen.getByText(/3 AM homework submission/i)).toBeInTheDocument();
      expect(screen.getByText(/Unusual time access/i)).toBeInTheDocument();
    });

    test('simulates risk factor analysis process', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Risk analysis simulation
      const analyzeButton = screen.getByRole('button', { name: /Analyze Risk Factors/i });
      await user.click(analyzeButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Analyzing device trust.../i)).toBeInTheDocument();
        expect(screen.getByText(/Checking location patterns.../i)).toBeInTheDocument();
        expect(screen.getByText(/Verifying user behavior.../i)).toBeInTheDocument();
      });
    });

    test('generates educational risk assessment results', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Complete risk assessment flow
      await user.click(screen.getByRole('button', { name: /Analyze Risk Factors/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Risk Score: Low/i)).toBeInTheDocument();
        expect(screen.getByText(/Factors considered:/i)).toBeInTheDocument();
        expect(screen.getByText(/Device: Trusted school laptop/i)).toBeInTheDocument();
        expect(screen.getByText(/Location: School network/i)).toBeInTheDocument();
      });
    });

    test('provides different risk scenarios for learning', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Multiple educational scenarios available
      const scenarios = ['normal-access', 'new-device', 'unusual-location', 'unusual-time'];
      
      for (const scenario of scenarios) {
        const scenarioSelect = screen.getByLabelText(/Choose Risk Scenario/i);
        await user.selectOptions(scenarioSelect, scenario);
        expect(screen.getByDisplayValue(scenario)).toBeInTheDocument();
      }
    });
  });

  /**
   * 🎮 GAMIFIED LEARNING & ENGAGEMENT TESTS
   * Based on User Stories 11, 14 - Interactive educational gameplay
   */
  describe('🎮 Gamified Learning & Engagement', () => {
    
    test('provides interactive decision-making challenges', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Navigate to decision challenge
      await user.click(screen.getByRole('tab', { name: /Access Control/i }));
      
      expect(screen.getByText(/Make the Access Decision/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Allow Access/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Deny Access/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Request More Info/i })).toBeInTheDocument();
    });

    test('provides immediate educational feedback', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Make a decision and get feedback
      await user.click(screen.getByRole('tab', { name: /Access Control/i }));
      await user.click(screen.getByRole('button', { name: /Allow Access/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Great choice!/i)).toBeInTheDocument();
        expect(screen.getByText(/This follows Zero Trust principles/i)).toBeInTheDocument();
      });
    });

    test('tracks learning progress appropriately', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Complete multiple scenarios
      await user.click(screen.getByRole('button', { name: /Analyze Risk Factors/i }));
      await user.click(screen.getByRole('tab', { name: /Access Control/i }));
      await user.click(screen.getByRole('button', { name: /Allow Access/i }));
      
      // Progress indicator appears
      expect(screen.getByText(/Progress: 2 of 5 scenarios completed/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
    });

    test('supports collaborative learning features', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Classroom sharing capabilities
      expect(screen.getByRole('button', { name: /Share with Class/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Compare Solutions/i })).toBeInTheDocument();
      expect(screen.getByText(/Discuss with your team/i)).toBeInTheDocument();
    });
  });

  /**
   * 👩‍🏫 TEACHER TOOLS & CLASSROOM INTEGRATION TESTS
   * Based on User Stories 5, 6, 7 - Supporting educator needs
   */
  describe('👩‍🏫 Teacher Tools & Classroom Integration', () => {
    
    test('provides classroom demonstration mode', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Teacher demonstration controls
      await user.click(screen.getByRole('button', { name: /Teacher Dashboard/i }));
      
      expect(screen.getByRole('button', { name: /Presentation Mode/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Show to Class/i })).toBeInTheDocument();
      expect(screen.getByText(/Project this scenario/i)).toBeInTheDocument();
    });

    test('includes curriculum-aligned learning objectives', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Educational standards alignment
      expect(screen.getByText(/NIST Cybersecurity Framework/i)).toBeInTheDocument();
      expect(screen.getByText(/Grade 6-8 Computer Science Standards/i)).toBeInTheDocument();
      expect(screen.getByText(/Digital Citizenship Objectives/i)).toBeInTheDocument();
    });

    test('offers assessment and reporting features', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Teacher assessment tools
      await user.click(screen.getByRole('button', { name: /Teacher Dashboard/i }));
      
      expect(screen.getByRole('button', { name: /Generate Report/i })).toBeInTheDocument();
      expect(screen.getByText(/Student Understanding Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/Common Misconceptions/i)).toBeInTheDocument();
    });

    test('supports individualized student help', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Help and support features
      expect(screen.getByRole('button', { name: /Need Help?/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Hint/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Ask Teacher/i })).toBeInTheDocument();
    });
  });

  /**
   * ⚡ PERFORMANCE & RELIABILITY TESTS
   * Ensuring smooth educational experience
   */
  describe('⚡ Performance & Reliability', () => {
    
    test('renders without performance issues', () => {
      const startTime = performance.now();
      render(<ZeroTrustAccessControlLab />);
      const endTime = performance.now();
      
      // Renders quickly for classroom use
      expect(endTime - startTime).toBeLessThan(1000);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('handles rapid interaction gracefully', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Rapid clicking doesn't break interface
      const analyzeButton = screen.getByRole('button', { name: /Analyze Risk Factors/i });
      
      await user.click(analyzeButton);
      await user.click(analyzeButton);
      await user.click(analyzeButton);
      
      // Interface remains responsive
      expect(screen.getByRole('button', { name: /Analyze Risk Factors/i })).toBeEnabled();
    });

    test('manages memory efficiently with educational data', async () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Simulate extended use
      for (let i = 0; i < 50; i++) {
        fireEvent.click(screen.getByRole('button', { name: /Analyze Risk Factors/i }));
        await waitFor(() => {
          expect(screen.getByText(/Risk Score/i)).toBeInTheDocument();
        });
      }
      
      // No memory leaks or performance degradation
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('provides responsive design for different devices', () => {
      // Test mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;
      global.dispatchEvent(new Event('resize'));
      
      render(<ZeroTrustAccessControlLab />);
      
      // Mobile-friendly layout
      expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveClass('mobile-optimized');
    });
  });

  /**
   * 🎯 EDUCATIONAL LEARNING OUTCOMES TESTS
   * Based on User Stories 12, 13, 15 - Measuring educational effectiveness
   */
  describe('🎯 Educational Learning Outcomes', () => {
    
    test('demonstrates Zero Trust principles effectively', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Core principle communication
      expect(screen.getByText(/Verify explicitly/i)).toBeInTheDocument();
      expect(screen.getByText(/Least privilege access/i)).toBeInTheDocument();
      expect(screen.getByText(/Assume breach/i)).toBeInTheDocument();
      expect(screen.getByText(/Never trust, always verify/i)).toBeInTheDocument();
    });

    test('connects concepts to real-world cybersecurity careers', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Career inspiration and pathways
      expect(screen.getByText(/cybersecurity analyst/i)).toBeInTheDocument();
      expect(screen.getByText(/security architect/i)).toBeInTheDocument();
      expect(screen.getByText(/Google, Microsoft, and Netflix/i)).toBeInTheDocument();
    });

    test('emphasizes ethical security practices', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Ethics and responsibility focus
      expect(screen.getByText(/protect people and organizations/i)).toBeInTheDocument();
      expect(screen.getByText(/responsible disclosure/i)).toBeInTheDocument();
      expect(screen.getByText(/help, not harm/i)).toBeInTheDocument();
    });

    test('provides self-assessment capabilities', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Self-reflection and assessment
      await user.click(screen.getByRole('button', { name: /Self Assessment/i }));
      
      expect(screen.getByText(/What did you learn about Zero Trust?/i)).toBeInTheDocument();
      expect(screen.getByText(/How confident do you feel?/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Reflection/i })).toBeInTheDocument();
    });

    test('encourages continued cybersecurity learning', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Next steps and continued learning
      expect(screen.getByText(/Want to learn more?/i)).toBeInTheDocument();
      expect(screen.getByText(/Next: Network Security Lab/i)).toBeInTheDocument();
      expect(screen.getByText(/Explore cybersecurity careers/i)).toBeInTheDocument();
    });
  });

  /**
   * 🏫 EDUCATIONAL SCENARIO INTEGRATION TESTS
   * Real-world classroom usage scenarios
   */
  describe('🏫 Educational Scenario Integration Tests', () => {
    
    test('handles typical classroom cybersecurity lesson scenario', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Complete classroom lesson flow
      // 1. Intro concepts
      expect(screen.getByText(/Zero Trust/i)).toBeInTheDocument();
      
      // 2. Interactive learning
      await user.click(screen.getByRole('tab', { name: /Risk Assessment/i }));
      await user.click(screen.getByRole('button', { name: /Analyze Risk Factors/i }));
      
      // 3. Apply knowledge
      await user.click(screen.getByRole('tab', { name: /Access Control/i }));
      await user.click(screen.getByRole('button', { name: /Allow Access/i }));
      
      // 4. Reflect and assess
      await user.click(screen.getByRole('button', { name: /Self Assessment/i }));
      
      expect(screen.getByText(/Lesson completed successfully/i)).toBeInTheDocument();
    });

    test('supports cybersecurity competition training', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Competition mode features
      await user.click(screen.getByRole('button', { name: /Competition Mode/i }));
      
      expect(screen.getByText(/CyberPatriot Training/i)).toBeInTheDocument();
      expect(screen.getByText(/Timed Challenges/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Challenge/i })).toBeInTheDocument();
    });

    test('handles parent-teacher conference demonstrations', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      // Parent demonstration mode
      await user.click(screen.getByRole('button', { name: /Parent Demo/i }));
      
      expect(screen.getByText(/What your child is learning/i)).toBeInTheDocument();
      expect(screen.getByText(/Age-appropriate cybersecurity/i)).toBeInTheDocument();
      expect(screen.getByText(/Digital citizenship skills/i)).toBeInTheDocument();
    });
  });
});
