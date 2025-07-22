/**
 * 🔐 ZERO TRUST ACCESS CONTROL LAB - Focused TDD Test Implementation
 * 
 * Test Guardian Agent - Strategic TDD Approach
 * Target: Achieve 95% coverage by testing actual functionality first
 * Focus: Current implementation + systematic feature building
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import component under test
import ZeroTrustAccessControlLab from '@/security/ZeroTrustAccessControlLab';

describe('🔐 ZeroTrustAccessControlLab - Strategic TDD Implementation', () => {
  
  describe('✅ Basic Component Rendering', () => {
    test('renders main Zero Trust lab interface successfully', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByText(/Zero Trust Access Control Lab/i)).toBeInTheDocument();
      // Use more specific selector for the main subtitle
      expect(screen.getByText(/Experience the "Never Trust, Always Verify" security revolution!/i)).toBeInTheDocument();
    });

    test('displays educational safety warning appropriately', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByText(/Never share personal information/i)).toBeInTheDocument();
      expect(screen.getByText(/learning simulation/i)).toBeInTheDocument();
    });

    test('shows Zero Trust core principles correctly', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByText(/Verify explicitly/i)).toBeInTheDocument();
      expect(screen.getByText(/Least privilege access/i)).toBeInTheDocument();
      expect(screen.getByText(/Assume breach/i)).toBeInTheDocument();
    });
  });

  describe('🎯 Tab Navigation System', () => {
    test('displays all navigation tabs correctly', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByRole('tab', { name: /Concepts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Risk Assessment/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Access Control/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Learn More/i })).toBeInTheDocument();
    });

    test('handles tab switching interactions', async () => {
      const user = userEvent.setup();
      render(<ZeroTrustAccessControlLab />);
      
      const riskTab = screen.getByRole('tab', { name: /Risk Assessment/i });
      await user.click(riskTab);
      
      // Tab should become active (visual state change)
      expect(riskTab).toHaveAttribute('aria-selected', 'true');
    });

    test('provides proper accessibility attributes for tabs', () => {
      render(<ZeroTrustAccessControlLab />);
      
      const conceptsTab = screen.getByRole('tab', { name: /Concepts/i });
      expect(conceptsTab).toHaveAttribute('aria-controls');
      expect(conceptsTab).toHaveAttribute('role', 'tab');
    });
  });

  describe('🎓 Educational Content', () => {
    test('displays curriculum-aligned learning objectives', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByText(/NIST Cybersecurity Framework/i)).toBeInTheDocument();
      expect(screen.getByText(/Grade 6-8 Computer Science Standards/i)).toBeInTheDocument();
    });

    test('shows age-appropriate language for Zero Trust concepts', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByText(/future cybersecurity pros/i)).toBeInTheDocument();
      expect(screen.getByText(/world's most careful security guard/i)).toBeInTheDocument();
    });

    test('includes learning objectives in accessible format', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByText(/What You'll Learn/i)).toBeInTheDocument();
      expect(screen.getByText(/How modern companies protect their systems/i)).toBeInTheDocument();
    });
  });

  describe('👩‍🏫 Teacher and Administrative Features', () => {
    test('provides teacher dashboard access', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByRole('button', { name: /Teacher Dashboard/i })).toBeInTheDocument();
    });

    test('includes student progress tracking', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByRole('button', { name: /Student Progress/i })).toBeInTheDocument();
    });

    test('offers session reset functionality', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByRole('button', { name: /Reset Session/i })).toBeInTheDocument();
    });
  });

  describe('♿ Accessibility Compliance', () => {
    test('provides semantic HTML structure with proper headings', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Check for proper heading hierarchy with specific text
      expect(screen.getByRole('heading', { level: 1, name: /Zero Trust Access Control Lab/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Hey future cybersecurity pros/i })).toBeInTheDocument();
    });

    test('includes alternative text for visual indicators', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByAltText(/Zero Trust Security Logo/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Low risk indicator/i)).toBeInTheDocument();
    });

    test('supports keyboard navigation with proper tabindex', () => {
      render(<ZeroTrustAccessControlLab />);
      
      const mainButton = screen.getByText(/Create Demo User & Start Learning/i);
      expect(mainButton).toHaveAttribute('tabindex', '0');
    });
  });

  describe('🎮 Interactive Learning Features', () => {
    test('provides main learning interaction button', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByRole('button', { name: /Create Demo User & Start Learning/i })).toBeInTheDocument();
    });

    test('displays risk indicator images for visual learning', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByAltText(/Low risk indicator/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Medium risk indicator/i)).toBeInTheDocument();
      expect(screen.getByAltText(/High risk indicator/i)).toBeInTheDocument();
    });
  });

  describe('🔒 Privacy and Safety', () => {
    test('does not collect or display personal information', () => {
      render(<ZeroTrustAccessControlLab />);
      
      // Should not contain any real personal data patterns
      expect(screen.queryByText(/@gmail\.com/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/password:/i)).not.toBeInTheDocument();
    });

    test('maintains educational focus without real security risks', () => {
      render(<ZeroTrustAccessControlLab />);
      
      expect(screen.getByText(/learning simulation/i)).toBeInTheDocument();
      expect(screen.getByText(/ask a teacher if unsure/i)).toBeInTheDocument();
    });
  });

  describe('⚡ Performance and Reliability', () => {
    test('renders without performance issues', () => {
      const startTime = performance.now();
      render(<ZeroTrustAccessControlLab />);
      const endTime = performance.now();
      
      // Should render quickly (under 100ms for basic rendering)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('handles component unmounting gracefully', () => {
      const { unmount } = render(<ZeroTrustAccessControlLab />);
      
      expect(() => unmount()).not.toThrow();
    });
  });
});
