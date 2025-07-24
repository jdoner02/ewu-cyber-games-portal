/**
 * 🎮 CYBER FARM FARMVILLE ENHANCEMENT - TDD Implementation
 * 
 * Test Guardian Agent - RED-GREEN-REFACTOR Cycle
 * Target: Add Farmville-like graphics and visual enhancements
 * Focus: Interactive farm grid, crop animations, visual feedback
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import component under test
import CyberFarmGame from '@/app/games/cyber-farm/page';

describe('🚜 CyberFarm Farmville Enhancements - Visual & Interactive Features', () => {

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock console methods to avoid test noise
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('🌾 Interactive Farm Grid System', () => {
    test('🔴 RED: should render a visual farm grid with plantable plots', () => {
      render(<CyberFarmGame />);
      
      // RED PHASE: These elements don't exist yet - should fail
      expect(screen.getByTestId('farm-grid')).toBeInTheDocument();
      expect(screen.getByTestId('farm-plot-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('farm-plot-1-1')).toBeInTheDocument();
      expect(screen.getByTestId('farm-plot-2-2')).toBeInTheDocument();
      
      // Should have at least 9 plantable plots (3x3 grid)
      const farmPlots = screen.getAllByTestId(/^farm-plot-\d+-\d+$/);
      expect(farmPlots).toHaveLength(9);
    });

    test('🔴 RED: should show empty plot visual state when no crops planted', () => {
      render(<CyberFarmGame />);
      
      const emptyPlot = screen.getByTestId('farm-plot-0-0');
      expect(emptyPlot).toHaveClass('empty-plot');
      expect(emptyPlot).toHaveTextContent('🌱'); // Empty plot emoji
    });

    test('🔴 RED: should allow clicking on empty plots to plant crops', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      const emptyPlot = screen.getByTestId('farm-plot-0-0');
      await user.click(emptyPlot);
      
      // Should show crop selection menu
      expect(screen.getByTestId('crop-selection-menu')).toBeInTheDocument();
      expect(screen.getByText('Select Data Crop to Plant')).toBeInTheDocument();
    });

    test('🔴 RED: should display different crop visuals based on data type', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Plant user data
      const plot = screen.getByTestId('farm-plot-0-0');
      await user.click(plot);
      
      const userDataOption = screen.getByTestId('crop-option-user-data');
      await user.click(userDataOption);
      
      // Should show user data crop visual
      expect(screen.getByTestId('crop-visual-user-data')).toBeInTheDocument();
      expect(plot).toHaveClass('planted-user-data');
      expect(plot).toHaveTextContent('👤'); // User data emoji
    });
  });

  describe('🌱 Crop Growth & Animation System', () => {
    test('🔴 RED: should show crop growth stages over time', async () => {
      jest.useFakeTimers();
      render(<CyberFarmGame />);
      
      // Plant a crop
      const plot = screen.getByTestId('farm-plot-0-0');
      fireEvent.click(plot);
      
      const userDataOption = screen.getByTestId('crop-option-user-data');
      fireEvent.click(userDataOption);
      
      // Initial stage - seedling
      expect(screen.getByTestId('crop-growth-stage-1')).toBeInTheDocument();
      
      // Advance time for growth
      jest.advanceTimersByTime(10000); // 10 seconds
      
      await waitFor(() => {
        expect(screen.getByTestId('crop-growth-stage-2')).toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });

    test('🔴 RED: should animate crop planting with visual feedback', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      const plot = screen.getByTestId('farm-plot-0-0');
      await user.click(plot);
      
      const userDataOption = screen.getByTestId('crop-option-user-data');
      await user.click(userDataOption);
      
      // Should show planting animation
      expect(screen.getByTestId('planting-animation')).toBeInTheDocument();
      expect(screen.getByText('🌱 Planting...')).toBeInTheDocument();
    });

    test('🔴 RED: should show harvest animation when crops are ready', async () => {
      jest.useFakeTimers();
      render(<CyberFarmGame />);
      
      // Plant and grow crop to maturity
      const plot = screen.getByTestId('farm-plot-0-0');
      fireEvent.click(plot);
      
      const userDataOption = screen.getByTestId('crop-option-user-data');
      fireEvent.click(userDataOption);
      
      // Fast-forward to harvest time
      jest.advanceTimersByTime(30000); // 30 seconds
      
      await waitFor(() => {
        expect(screen.getByTestId('harvest-ready-indicator')).toBeInTheDocument();
      });
      
      // Click to harvest
      const harvestButton = screen.getByTestId('harvest-button');
      fireEvent.click(harvestButton);
      
      expect(screen.getByTestId('harvest-animation')).toBeInTheDocument();
      expect(screen.getByText('🎉 Harvested!')).toBeInTheDocument();
      
      jest.useRealTimers();
    });
  });

  describe('⭐ Enhanced Visual Feedback & Rewards', () => {
    test('🔴 RED: should show floating score animations when earning points', () => {
      render(<CyberFarmGame />);
      
      // Deploy a security control to trigger score
      const firewallButton = screen.getByRole('button', { name: /Deploy Firewall/i });
      fireEvent.click(firewallButton);
      
      // Should show floating score animation
      expect(screen.getByTestId('floating-score')).toBeInTheDocument();
      expect(screen.getByText('+10')).toBeInTheDocument();
      expect(screen.getByTestId('score-animation')).toHaveClass('animate-bounce');
    });

    test('🔴 RED: should display achievement badges with visual celebrations', () => {
      render(<CyberFarmGame />);
      
      // Complete an achievement (plant 5 crops)
      for (let i = 0; i < 5; i++) {
        const plantButton = screen.getByRole('button', { name: /Plant User Data/i });
        fireEvent.click(plantButton);
      }
      
      // Should show achievement badge
      expect(screen.getByTestId('achievement-badge')).toBeInTheDocument();
      expect(screen.getByText('🏆 Green Thumb!')).toBeInTheDocument();
      expect(screen.getByTestId('celebration-confetti')).toBeInTheDocument();
    });

    test('🔴 RED: should show threat alerts with urgent visual styling', () => {
      render(<CyberFarmGame />);
      
      // Trigger a security threat
      const threatButton = screen.getByTestId('simulate-phishing-attack');
      fireEvent.click(threatButton);
      
      // Should show urgent threat alert
      expect(screen.getByTestId('threat-alert')).toBeInTheDocument();
      expect(screen.getByTestId('threat-alert')).toHaveClass('alert-danger');
      expect(screen.getByText('⚠️ PHISHING ATTACK DETECTED!')).toBeInTheDocument();
    });
  });

  describe('🎨 Enhanced UI/UX Design Elements', () => {
    test('🔴 RED: should have beautiful gradient backgrounds and styling', () => {
      render(<CyberFarmGame />);
      
      const gameContainer = screen.getByTestId('cyber-farm-container');
      expect(gameContainer).toHaveClass('bg-gradient-farm');
      
      const farmArea = screen.getByTestId('farm-area');
      expect(farmArea).toHaveClass('farm-background-texture');
    });

    test('🔴 RED: should display weather system with visual indicators', () => {
      render(<CyberFarmGame />);
      
      expect(screen.getByTestId('weather-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('weather-sunny')).toBeInTheDocument();
      expect(screen.getByText('☀️ Perfect Growing Conditions')).toBeInTheDocument();
    });

    test('🔴 RED: should show progress bars with smooth animations', () => {
      render(<CyberFarmGame />);
      
      const securityProgress = screen.getByTestId('security-progress-bar');
      expect(securityProgress).toBeInTheDocument();
      expect(securityProgress).toHaveClass('animated-progress');
      
      const ciaTriadProgress = screen.getByTestId('cia-triad-progress');
      expect(ciaTriadProgress).toBeInTheDocument();
    });

    test('🔴 RED: should have interactive tooltips with rich information', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      const firewallIcon = screen.getByTestId('firewall-icon');
      await user.hover(firewallIcon);
      
      await waitFor(() => {
        expect(screen.getByTestId('rich-tooltip')).toBeInTheDocument();
        expect(screen.getByText('Firewall Protection')).toBeInTheDocument();
        expect(screen.getByText('Blocks unauthorized network access')).toBeInTheDocument();
      });
    });
  });

  describe('🎵 Audio & Haptic Feedback', () => {
    test('🔴 RED: should play satisfying sound effects for actions', () => {
      // Mock audio context
      const mockPlay = jest.fn();
      global.Audio = jest.fn().mockImplementation(() => ({
        play: mockPlay,
        pause: jest.fn(),
        currentTime: 0,
        volume: 1
      }));
      
      render(<CyberFarmGame />);
      
      const plantButton = screen.getByRole('button', { name: /Plant User Data/i });
      fireEvent.click(plantButton);
      
      // Should play planting sound
      expect(mockPlay).toHaveBeenCalled();
      expect(screen.getByTestId('audio-feedback')).toBeInTheDocument();
    });

    test('🔴 RED: should provide haptic feedback on mobile devices', () => {
      // Mock navigator.vibrate
      Object.defineProperty(navigator, 'vibrate', {
        value: jest.fn(),
        writable: true
      });
      
      render(<CyberFarmGame />);
      
      const harvestButton = screen.getByTestId('harvest-button');
      fireEvent.click(harvestButton);
      
      // Should trigger haptic feedback
      expect(navigator.vibrate).toHaveBeenCalledWith([100]);
    });
  });

  describe('📊 Advanced Statistics & Analytics', () => {
    test('🔴 RED: should display detailed farm statistics dashboard', () => {
      render(<CyberFarmGame />);
      
      expect(screen.getByTestId('farm-stats-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('total-crops-planted')).toBeInTheDocument();
      expect(screen.getByTestId('security-incidents-prevented')).toBeInTheDocument();
      expect(screen.getByTestId('learning-progress-chart')).toBeInTheDocument();
    });

    test('🔴 RED: should show real-time threat landscape visualization', () => {
      render(<CyberFarmGame />);
      
      expect(screen.getByTestId('threat-landscape')).toBeInTheDocument();
      expect(screen.getByTestId('threat-heatmap')).toBeInTheDocument();
      expect(screen.getByText('Live Threat Activity')).toBeInTheDocument();
    });
  });
});
