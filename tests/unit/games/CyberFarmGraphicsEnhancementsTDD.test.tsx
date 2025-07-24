/**
 * CyberFarm Graphics Enhancements TDD Test Suite
 * Enhanced Farmville-like Visual Graphics & User Experience
 * 
 * Following Test Guardian Agent TDD methodology:
 * 🔴 RED: Write failing tests first
 * 🟢 GREEN: Implement minimal code to pass tests  
 * 🔵 REFACTOR: Improve code while keeping tests green
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CyberFarmGame from '../../../src/app/games/cyber-farm/page';

describe('🎨 CyberFarm Enhanced Graphics & Farmville-like Visuals', () => {
  
  describe('🌻 Enhanced Farm Visual Elements', () => {
    test('🔴 RED: should display animated 3D-style crop sprites', () => {
      render(<CyberFarmGame />);
      
      // Plant a crop first
      const plantButton = screen.getByTestId('plant-data-seed');
      fireEvent.click(plantButton);
      
      // Check for enhanced crop graphics
      expect(screen.getByTestId('animated-crop-sprite')).toBeInTheDocument();
      expect(screen.getByTestId('animated-crop-sprite')).toHaveClass('crop-3d-style');
      expect(screen.getByTestId('animated-crop-sprite')).toHaveClass('animate-grow');
    });

    test('🔴 RED: should have colorful farm terrain with grass patterns', () => {
      render(<CyberFarmGame />);
      
      // Check for enhanced terrain graphics
      expect(screen.getByTestId('farm-terrain')).toBeInTheDocument();
      expect(screen.getByTestId('farm-terrain')).toHaveClass('grass-pattern');
      expect(screen.getByTestId('farm-terrain')).toHaveClass('colorful-background');
      
      // Check for multiple terrain zones
      expect(screen.getByTestId('fertile-soil-zone')).toBeInTheDocument();
      expect(screen.getByTestId('decorative-paths')).toBeInTheDocument();
    });

    test('🔴 RED: should display farm buildings with Farmville-style graphics', () => {
      render(<CyberFarmGame />);
      
      // Check for farm buildings
      expect(screen.getByTestId('farm-house')).toBeInTheDocument();
      expect(screen.getByTestId('farm-house')).toHaveClass('farmville-building');
      
      expect(screen.getByTestId('security-barn')).toBeInTheDocument();
      expect(screen.getByTestId('security-barn')).toHaveClass('animated-building');
      
      expect(screen.getByTestId('cyber-silo')).toBeInTheDocument();
      expect(screen.getByTestId('cyber-silo')).toHaveClass('storage-building');
    });
  });

  describe('🌱 Enhanced Crop Graphics & Growth Animations', () => {
    test('🔴 RED: should show detailed crop growth stages with animations', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      const plantButton = screen.getByTestId('plant-data-seed');
      await user.click(plantButton);
      
      // Check growth stage progression
      expect(screen.getByTestId('crop-stage-seed')).toBeInTheDocument();
      expect(screen.getByTestId('crop-stage-seed')).toHaveClass('stage-animation');
      
      // Simulate growth over time
      fireEvent.click(screen.getByTestId('accelerate-growth'));
      
      await waitFor(() => {
        expect(screen.getByTestId('crop-stage-sprout')).toBeInTheDocument();
        expect(screen.getByTestId('crop-stage-sprout')).toHaveClass('growth-animation');
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('crop-stage-mature')).toBeInTheDocument();
        expect(screen.getByTestId('crop-stage-mature')).toHaveClass('mature-glow');
      });
    });

    test('🔴 RED: should display harvest animations with particle effects', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Plant and grow crop to maturity
      const plantButton = screen.getByTestId('plant-data-seed');
      await user.click(plantButton);
      fireEvent.click(screen.getByTestId('instant-mature'));
      
      // Harvest with animations
      const harvestButton = screen.getByTestId('harvest-crop');
      await user.click(harvestButton);
      
      // Check for harvest animation effects
      expect(screen.getByTestId('harvest-sparkles')).toBeInTheDocument();
      expect(screen.getByTestId('harvest-sparkles')).toHaveClass('sparkle-animation');
      
      expect(screen.getByTestId('crop-collection-effect')).toBeInTheDocument();
      expect(screen.getByTestId('crop-collection-effect')).toHaveClass('collect-animation');
      
      expect(screen.getByTestId('xp-gain-popup')).toBeInTheDocument();
      expect(screen.getByTestId('xp-gain-popup')).toHaveClass('popup-animation');
    });

    test('🔴 RED: should have different crop types with unique visual designs', () => {
      render(<CyberFarmGame />);
      
      // Check different crop type graphics
      expect(screen.getByTestId('data-seed-graphic')).toBeInTheDocument();
      expect(screen.getByTestId('data-seed-graphic')).toHaveClass('blue-data-crop');
      
      expect(screen.getByTestId('encryption-seed-graphic')).toBeInTheDocument();
      expect(screen.getByTestId('encryption-seed-graphic')).toHaveClass('gold-crypto-crop');
      
      expect(screen.getByTestId('firewall-seed-graphic')).toBeInTheDocument();
      expect(screen.getByTestId('firewall-seed-graphic')).toHaveClass('red-security-crop');
    });
  });

  describe('🎮 Enhanced UI/UX with Farmville-style Interface', () => {
    test('🔴 RED: should have colorful button designs with hover effects', () => {
      render(<CyberFarmGame />);
      
      // Check enhanced button styling
      const plantButton = screen.getByTestId('plant-data-seed');
      expect(plantButton).toHaveClass('farmville-button');
      expect(plantButton).toHaveClass('green-gradient');
      expect(plantButton).toHaveClass('hover-lift');
      
      const harvestButton = screen.getByTestId('harvest-crop');
      expect(harvestButton).toHaveClass('farmville-button');
      expect(harvestButton).toHaveClass('orange-gradient');
      expect(harvestButton).toHaveClass('pulse-animation');
    });

    test('🔴 RED: should display resource counters with animated graphics', () => {
      render(<CyberFarmGame />);
      
      // Check enhanced resource displays
      expect(screen.getByTestId('cyber-coins-counter')).toBeInTheDocument();
      expect(screen.getByTestId('cyber-coins-counter')).toHaveClass('coin-animation');
      expect(screen.getByTestId('cyber-coins-counter')).toHaveClass('golden-shine');
      
      expect(screen.getByTestId('security-score-meter')).toBeInTheDocument();
      expect(screen.getByTestId('security-score-meter')).toHaveClass('progress-bar-animated');
      expect(screen.getByTestId('security-score-meter')).toHaveClass('shield-icon');
      
      expect(screen.getByTestId('level-progress-bar')).toBeInTheDocument();
      expect(screen.getByTestId('level-progress-bar')).toHaveClass('xp-bar-glow');
    });

    test('🔴 RED: should have decorative farm elements and background details', () => {
      render(<CyberFarmGame />);
      
      // Check decorative elements
      expect(screen.getByTestId('decorative-fence')).toBeInTheDocument();
      expect(screen.getByTestId('decorative-fence')).toHaveClass('wooden-fence');
      
      expect(screen.getByTestId('farm-animals')).toBeInTheDocument();
      expect(screen.getByTestId('cyber-chickens')).toBeInTheDocument();
      expect(screen.getByTestId('cyber-chickens')).toHaveClass('animated-chickens');
      
      expect(screen.getByTestId('decorative-trees')).toBeInTheDocument();
      expect(screen.getByTestId('decorative-trees')).toHaveClass('swaying-trees');
      
      expect(screen.getByTestId('background-clouds')).toBeInTheDocument();
      expect(screen.getByTestId('background-clouds')).toHaveClass('drifting-clouds');
    });
  });

  describe('✨ Enhanced Visual Feedback & Animation Effects', () => {
    test('🔴 RED: should display achievement popup animations', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Trigger achievement
      const plantButton = screen.getByTestId('plant-data-seed');
      for (let i = 0; i < 5; i++) {
        await user.click(plantButton);
      }
      
      // Check achievement popup
      await waitFor(() => {
        expect(screen.getByTestId('achievement-popup')).toBeInTheDocument();
        expect(screen.getByTestId('achievement-popup')).toHaveClass('achievement-animation');
        expect(screen.getByTestId('achievement-popup')).toHaveClass('celebration-effects');
      });
      
      expect(screen.getByText(/First Harvest Master!/)).toBeInTheDocument();
      expect(screen.getByTestId('achievement-icon')).toHaveClass('golden-badge');
    });

    test('🔴 RED: should have enhanced weather effects and atmosphere', () => {
      render(<CyberFarmGame />);
      
      // Check weather system
      expect(screen.getByTestId('weather-system')).toBeInTheDocument();
      expect(screen.getByTestId('sunshine-rays')).toBeInTheDocument();
      expect(screen.getByTestId('sunshine-rays')).toHaveClass('animated-rays');
      
      // Check day/night cycle enhancements
      expect(screen.getByTestId('sky-gradient')).toBeInTheDocument();
      expect(screen.getByTestId('sky-gradient')).toHaveClass('day-time-sky');
      
      // Check seasonal effects
      expect(screen.getByTestId('seasonal-effects')).toBeInTheDocument();
    });

    test('🔴 RED: should show interactive hover states on farm elements', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      const farmPlot = screen.getByTestId('farm-plot-0');
      
      // Test hover effects
      await user.hover(farmPlot);
      
      expect(farmPlot).toHaveClass('plot-hover-highlight');
      expect(screen.getByTestId('plot-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('plot-tooltip')).toHaveClass('tooltip-animation');
      
      // Test click feedback
      await user.click(farmPlot);
      expect(farmPlot).toHaveClass('plot-selected');
      expect(screen.getByTestId('selection-indicator')).toBeInTheDocument();
    });

    test('🔴 RED: should display loading animations and transitions', () => {
      render(<CyberFarmGame />);
      
      // Check loading states
      fireEvent.click(screen.getByTestId('save-game'));
      
      expect(screen.getByTestId('saving-animation')).toBeInTheDocument();
      expect(screen.getByTestId('saving-animation')).toHaveClass('spinner-animation');
      
      // Check transition effects between views
      fireEvent.click(screen.getByTestId('marketplace-button'));
      
      expect(screen.getByTestId('view-transition')).toBeInTheDocument();
      expect(screen.getByTestId('view-transition')).toHaveClass('fade-transition');
    });
  });

  describe('🏆 Enhanced Social Features Graphics', () => {
    test('🔴 RED: should display neighbor farm previews with thumbnails', () => {
      render(<CyberFarmGame />);
      
      // Check neighbor farm graphics
      expect(screen.getByTestId('neighbor-farm-alice-preview')).toBeInTheDocument();
      expect(screen.getByTestId('neighbor-farm-alice-preview')).toHaveClass('farm-thumbnail');
      expect(screen.getByTestId('neighbor-farm-alice-preview')).toHaveClass('mini-farm-view');
      
      expect(screen.getByTestId('neighbor-level-badge')).toBeInTheDocument();
      expect(screen.getByTestId('neighbor-level-badge')).toHaveClass('level-badge-graphic');
    });

    test('🔴 RED: should show gift animations and collectible graphics', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      const giftButton = screen.getByTestId('send-gift-button');
      await user.click(giftButton);
      
      // Check gift animations
      expect(screen.getByTestId('gift-send-animation')).toBeInTheDocument();
      expect(screen.getByTestId('gift-send-animation')).toHaveClass('gift-fly-animation');
      
      // Check collectible gift graphics
      expect(screen.getByTestId('gift-box-graphic')).toBeInTheDocument();
      expect(screen.getByTestId('gift-box-graphic')).toHaveClass('wrapped-gift');
      expect(screen.getByTestId('gift-box-graphic')).toHaveClass('sparkling-gift');
    });
  });
});
