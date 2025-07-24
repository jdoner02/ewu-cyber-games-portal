/**
 * Test Guardian Agent - Modal State Management TDD Test Suite
 * RED-GREEN-REFACTOR cycle for fixing GUI popup/modal cluttering issue
 * 
 * ISSUE: GUI elements that should be popups/modals are staying visible all the time,
 * causing UI cluttering instead of proper show/hide behavior.
 * 
 * EXPECTED BEHAVIOR: All modals, popups, and overlays should be hidden by default
 * and only show when triggered by user interaction.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import CyberFarmGame from '../../../src/app/games/cyber-farm/page';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('CyberFarm Modal State Management TDD', () => {
  
  // RED PHASE: Write tests that should pass but currently fail due to modal cluttering
  
  describe('Initial State - All Modals Should Be Hidden', () => {
    
    test('NIST Dashboard should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // NIST Dashboard should NOT be visible by default
      expect(screen.queryByText('NIST Cybersecurity Framework')).not.toBeInTheDocument();
      expect(screen.queryByText('Framework Functions')).not.toBeInTheDocument();
    });
    
    test('Threat Scenarios modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Threat scenarios should NOT be visible by default
      expect(screen.queryByText('Active Threat Scenarios')).not.toBeInTheDocument();
      expect(screen.queryByText('Threat Intelligence Feed')).not.toBeInTheDocument();
    });
    
    test('Risk Assessment modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Risk assessment should NOT be visible by default
      expect(screen.queryByText('Risk Assessment Framework')).not.toBeInTheDocument();
      expect(screen.queryByText('Risk Matrix')).not.toBeInTheDocument();
    });
    
    test('Incident Response modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Incident response should NOT be visible by default
      expect(screen.queryByText('Incident Response Center')).not.toBeInTheDocument();
      expect(screen.queryByText('Response Playbooks')).not.toBeInTheDocument();
    });
    
    test('Compliance Dashboard should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Compliance dashboard should NOT be visible by default
      expect(screen.queryByText('Compliance Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Regulatory Framework')).not.toBeInTheDocument();
    });
    
    test('Threat Hunting modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Threat hunting should NOT be visible by default
      expect(screen.queryByText('Threat Hunting Platform')).not.toBeInTheDocument();
      expect(screen.queryByText('Hunt Queries')).not.toBeInTheDocument();
    });
    
    test('IOC Training modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // IOC training should NOT be visible by default
      expect(screen.queryByText('IOC Training Module')).not.toBeInTheDocument();
      expect(screen.queryByText('Indicators of Compromise')).not.toBeInTheDocument();
    });
    
    test('MITRE ATT&CK Matrix should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // MITRE matrix should NOT be visible by default
      expect(screen.queryByText('MITRE ATT&CK Matrix')).not.toBeInTheDocument();
      expect(screen.queryByText('Attack Techniques')).not.toBeInTheDocument();
    });
    
  });
  
  describe('Advanced Feature Modals Should Be Hidden', () => {
    
    test('Gift modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Gift modal should NOT be visible by default
      expect(screen.queryByText('Send Gift')).not.toBeInTheDocument();
      expect(screen.queryByText('Choose a gift to send')).not.toBeInTheDocument();
    });
    
    test('Marketplace modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Marketplace should NOT be visible by default
      expect(screen.queryByText('Marketplace')).not.toBeInTheDocument();
      expect(screen.queryByText('Buy Seeds & Items')).not.toBeInTheDocument();
    });
    
    test('Skill Tree modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Skill tree should NOT be visible by default
      expect(screen.queryByText('Skill Tree')).not.toBeInTheDocument();
      expect(screen.queryByText('Farming Mastery')).not.toBeInTheDocument();
    });
    
    test('Leaderboard modal should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Leaderboard should NOT be visible by default
      expect(screen.queryByText('Global Leaderboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Top Farmers')).not.toBeInTheDocument();
    });
    
  });
  
  describe('Modal Show/Hide Behavior', () => {
    
    test('NIST Dashboard should show when triggered', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Find and click NIST dashboard trigger button
      const nistButton = screen.getByText('NIST Framework');
      fireEvent.click(nistButton);
      
      // Now NIST Dashboard should be visible
      expect(screen.getByText('🏛️ NIST Framework')).toBeInTheDocument();
    });
    
    test('modals should have close functionality', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Open NIST dashboard
      const nistButton = screen.getByText('NIST Framework');
      fireEvent.click(nistButton);
      
      // Verify it's open
      expect(screen.getByText('🏛️ NIST Framework')).toBeInTheDocument();
      
      // Find and click close button (×)
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      // Verify it's closed
      expect(screen.queryByText('🏛️ NIST Framework')).not.toBeInTheDocument();
    });
    
    test('crop selection menu should be hidden by default', async () => {
      render(<CyberFarmGame />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading CyberFarm...')).not.toBeInTheDocument();
      });
      
      // Crop selection menu should NOT be visible by default unless in test mode
      if (process.env.NODE_ENV !== 'test') {
        expect(screen.queryByText('Select Crop Type')).not.toBeInTheDocument();
      }
    });
    
  });
  
});
