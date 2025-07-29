/**
 * @fileoverview Test Guardian Agent - Interactive Gameplay Enhancement TDD
 * 
 * RED PHASE: Creating failing tests for interactive gameplay features
 * - Crop planting/harvesting mechanics with visual feedback
 * - Points/scoring system for engagement
 * - Achievement system for motivation  
 * - Interactive farm elements (barns, wells, fences)
 * 
 * Following TDD: RED → GREEN → REFACTOR
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CyberFarmGame from '../../../src/components/CyberFarmGameTest';

// Mock framer-motion for stable testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('🎮 CyberFarm Interactive Gameplay Enhancement TDD', () => {
  beforeEach(() => {
    // Reset any global state before each test
    jest.clearAllMocks();
  });

  describe('🌱 Crop Planting & Harvesting Mechanics', () => {
    test('🔴 RED: should allow clicking empty farm plots to plant crops', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should find clickable farm plots
      expect(screen.getByTestId('farm-plot-1')).toBeInTheDocument();
      expect(screen.getByTestId('farm-plot-2')).toBeInTheDocument();
      expect(screen.getByTestId('farm-plot-3')).toBeInTheDocument();
      
      // Should show plant action on hover
      const farmPlot1 = screen.getByTestId('farm-plot-1');
      await user.hover(farmPlot1);
      expect(screen.getByTestId('plant-action-tooltip')).toBeInTheDocument();
      
      // Should plant crop when clicked
      await user.click(farmPlot1);
      expect(screen.getByTestId('planted-crop-1')).toBeInTheDocument();
      expect(screen.getByTestId('planted-crop-1')).toHaveAttribute('data-crop-type', 'firewall-seed');
    });

    test('🔴 RED: should show crop growth stages with visual progression', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Plant a crop first
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      
      // Should show seedling stage initially
      expect(screen.getByTestId('crop-growth-stage')).toHaveAttribute('data-stage', 'seedling');
      expect(screen.getByTestId('growth-progress-bar')).toHaveAttribute('data-progress', '25');
      
      // Should show growing stage after time progression
      fireEvent.click(screen.getByTestId('advance-time-button'));
      await waitFor(() => {
        expect(screen.getByTestId('crop-growth-stage')).toHaveAttribute('data-stage', 'growing');
        expect(screen.getByTestId('growth-progress-bar')).toHaveAttribute('data-progress', '50');
      });
      
      // Should show mature stage when ready to harvest
      fireEvent.click(screen.getByTestId('advance-time-button'));
      await waitFor(() => {
        expect(screen.getByTestId('crop-growth-stage')).toHaveAttribute('data-stage', 'mature');
        expect(screen.getByTestId('growth-progress-bar')).toHaveAttribute('data-progress', '100');
      });
    });

    test('🔴 RED: should allow harvesting mature crops with rewards', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Setup: Plant and grow crop to maturity
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      
      // Fast-forward to mature stage
      fireEvent.click(screen.getByTestId('advance-time-button'));
      fireEvent.click(screen.getByTestId('advance-time-button'));
      
      // Should show harvest action when crop is mature
      const matureCrop = screen.getByTestId('planted-crop-1');
      await user.hover(matureCrop);
      expect(screen.getByTestId('harvest-action-tooltip')).toBeInTheDocument();
      
      // Should harvest and provide rewards
      await user.click(matureCrop);
      expect(screen.getByTestId('harvest-animation')).toBeInTheDocument();
      expect(screen.getByTestId('cyber-points-gained')).toHaveTextContent('+50');
      expect(screen.getByTestId('security-knowledge-gained')).toHaveTextContent('+10');
    });
  });

  describe('🏆 Points & Scoring System', () => {
    test('🔴 RED: should display real-time scoring dashboard', () => {
      render(<CyberFarmGame />);
      
      // Should show comprehensive scoring display
      expect(screen.getByTestId('scoring-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('total-cyber-points')).toBeInTheDocument();
      expect(screen.getByTestId('security-level')).toBeInTheDocument();
      expect(screen.getByTestId('farm-efficiency-rating')).toBeInTheDocument();
      
      // Should show initial values
      expect(screen.getByTestId('total-cyber-points')).toHaveTextContent('0');
      expect(screen.getByTestId('security-level')).toHaveTextContent('Novice');
      expect(screen.getByTestId('farm-efficiency-rating')).toHaveTextContent('0%');
    });

    test('🔴 RED: should award points for different farming activities', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Initial points should be 0
      expect(screen.getByTestId('total-cyber-points')).toHaveTextContent('0');
      
      // Plant crop - should award planning points
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      expect(screen.getByTestId('total-cyber-points')).toHaveTextContent('10');
      expect(screen.getByTestId('points-animation')).toHaveTextContent('+10 Planning');
      
      // Harvest crop - should award execution points
      fireEvent.click(screen.getByTestId('advance-time-button'));
      fireEvent.click(screen.getByTestId('advance-time-button'));
      await user.click(screen.getByTestId('planted-crop-1'));
      expect(screen.getByTestId('total-cyber-points')).toHaveTextContent('60');
      expect(screen.getByTestId('points-animation')).toHaveTextContent('+50 Execution');
    });

    test('🔴 RED: should implement security level progression system', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should start at Novice level
      expect(screen.getByTestId('security-level')).toHaveTextContent('Novice');
      expect(screen.getByTestId('level-progress-bar')).toHaveAttribute('data-progress', '0');
      
      // Should progress levels based on points earned
      // Simulate earning 100 points (level up threshold)
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot); // 10 points
      fireEvent.click(screen.getByTestId('advance-time-button'));
      fireEvent.click(screen.getByTestId('advance-time-button'));
      await user.click(screen.getByTestId('planted-crop-1')); // 50 points
      
      // Plant and harvest second crop
      await user.click(screen.getByTestId('farm-plot-2')); // 10 points  
      fireEvent.click(screen.getByTestId('advance-time-button'));
      fireEvent.click(screen.getByTestId('advance-time-button'));
      await user.click(screen.getByTestId('planted-crop-2')); // 50 points
      
      // Should level up to Apprentice
      await waitFor(() => {
        expect(screen.getByTestId('security-level')).toHaveTextContent('Apprentice');
        expect(screen.getByTestId('level-up-animation')).toBeInTheDocument();
      });
    });
  });

  describe('🎖️ Achievement System', () => {
    test('🔴 RED: should display achievement panel with categories', () => {
      render(<CyberFarmGame />);
      
      // Should show achievement panel
      expect(screen.getByTestId('achievement-panel')).toBeInTheDocument();
      expect(screen.getByTestId('achievement-categories')).toBeInTheDocument();
      
      // Should show different achievement categories
      expect(screen.getByTestId('farming-achievements')).toBeInTheDocument();
      expect(screen.getByTestId('security-achievements')).toBeInTheDocument();
      expect(screen.getByTestId('knowledge-achievements')).toBeInTheDocument();
      expect(screen.getByTestId('social-achievements')).toBeInTheDocument();
    });

    test('🔴 RED: should unlock farming achievements based on actions', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show locked achievement initially
      expect(screen.getByTestId('achievement-first-plant')).toHaveAttribute('data-status', 'locked');
      expect(screen.getByTestId('achievement-first-plant')).toHaveClass('achievement-locked');
      
      // Should unlock achievement when planting first crop
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      
      await waitFor(() => {
        expect(screen.getByTestId('achievement-first-plant')).toHaveAttribute('data-status', 'unlocked');
        expect(screen.getByTestId('achievement-first-plant')).toHaveClass('achievement-unlocked');
        expect(screen.getByTestId('achievement-notification')).toHaveTextContent('🌱 First Plant Unlocked!');
      });
    });

    test('🔴 RED: should show achievement progress tracking', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show multi-step achievement progress
      const masterFarmerAchievement = screen.getByTestId('achievement-master-farmer');
      expect(masterFarmerAchievement).toHaveAttribute('data-progress', '0/10');
      expect(masterFarmerAchievement).toHaveAttribute('data-description', 'Harvest 10 crops');
      
      // Should update progress as crops are harvested
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      fireEvent.click(screen.getByTestId('advance-time-button'));
      fireEvent.click(screen.getByTestId('advance-time-button'));
      await user.click(screen.getByTestId('planted-crop-1'));
      
      await waitFor(() => {
        expect(masterFarmerAchievement).toHaveAttribute('data-progress', '1/10');
      });
    });
  });

  describe('🏡 Interactive Farm Elements', () => {
    test('🔴 RED: should include clickable farm buildings with functions', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show interactive farm buildings
      expect(screen.getByTestId('farm-barn')).toBeInTheDocument();
      expect(screen.getByTestId('farm-well')).toBeInTheDocument();
      expect(screen.getByTestId('farm-storage')).toBeInTheDocument();
      expect(screen.getByTestId('farm-security-tower')).toBeInTheDocument();
      
      // Should show functionality tooltips on hover
      const barn = screen.getByTestId('farm-barn');
      await user.hover(barn);
      expect(screen.getByTestId('barn-tooltip')).toHaveTextContent('Store crops and tools');
      
      // Should open building interface when clicked
      await user.click(barn);
      expect(screen.getByTestId('barn-interface')).toBeInTheDocument();
      expect(screen.getByTestId('stored-items-list')).toBeInTheDocument();
    });

    test('🔴 RED: should implement farm expansion mechanics', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show expansion options
      expect(screen.getByTestId('farm-expansion-panel')).toBeInTheDocument();
      expect(screen.getByTestId('available-plots')).toHaveTextContent('3');
      expect(screen.getByTestId('max-plots')).toHaveTextContent('12');
      
      // Should allow purchasing new plots
      const expandButton = screen.getByTestId('expand-farm-button');
      expect(expandButton).toHaveTextContent('Expand Farm (100 points)');
      
      // Should be disabled if insufficient points
      expect(expandButton).toBeDisabled();
      
      // Should enable after earning enough points
      // (Test assumes some point earning mechanism exists)
      fireEvent.click(screen.getByTestId('cheat-add-points-button')); // Test helper
      await waitFor(() => {
        expect(expandButton).not.toBeDisabled();
      });
      
      // Should add new plots when purchased
      await user.click(expandButton);
      await waitFor(() => {
        expect(screen.getByTestId('available-plots')).toHaveTextContent('6');
        expect(screen.getByTestId('farm-plot-4')).toBeInTheDocument();
        expect(screen.getByTestId('farm-plot-5')).toBeInTheDocument();
        expect(screen.getByTestId('farm-plot-6')).toBeInTheDocument();
      });
    });

    test('🔴 RED: should show environmental interactions and effects', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show weather system
      expect(screen.getByTestId('weather-display')).toBeInTheDocument();
      expect(screen.getByTestId('current-weather')).toHaveAttribute('data-weather', 'sunny');
      
      // Should show day/night cycle
      expect(screen.getByTestId('time-display')).toBeInTheDocument();
      expect(screen.getByTestId('current-time')).toHaveAttribute('data-time-period', 'day');
      
      // Should affect crop growth based on conditions
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      
      // Sunny weather should boost growth
      expect(screen.getByTestId('growth-modifier')).toHaveTextContent('+20% (Sunny Weather)');
      
      // Should change weather and affect growth
      fireEvent.click(screen.getByTestId('change-weather-button'));
      await waitFor(() => {
        expect(screen.getByTestId('current-weather')).toHaveAttribute('data-weather', 'rainy');
        expect(screen.getByTestId('growth-modifier')).toHaveTextContent('+10% (Rainy Weather)');
      });
    });
  });

  describe('🎯 Engagement & Polish Features', () => {
    test('🔴 RED: should provide audio/visual feedback for all interactions', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show visual feedback system
      expect(screen.getByTestId('feedback-system')).toBeInTheDocument();
      
      // Should trigger effects on plant action
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      
      expect(screen.getByTestId('plant-particle-effect')).toBeInTheDocument();
      expect(screen.getByTestId('plant-sound-effect')).toHaveAttribute('data-sound', 'plant.mp3');
      expect(screen.getByTestId('plant-haptic-feedback')).toBeInTheDocument();
    });

    test('🔴 RED: should implement help system and tutorials', () => {
      render(<CyberFarmGame />);
      
      // Should show help system
      expect(screen.getByTestId('help-system')).toBeInTheDocument();
      expect(screen.getByTestId('tutorial-progress')).toBeInTheDocument();
      
      // Should show contextual hints
      expect(screen.getByTestId('current-hint')).toHaveTextContent('Click on empty plots to plant your first crop!');
      
      // Should show tutorial steps
      expect(screen.getByTestId('tutorial-step')).toHaveAttribute('data-step', '1');
      expect(screen.getByTestId('tutorial-total-steps')).toHaveAttribute('data-total', '5');
    });

    test('🔴 RED: should save and load game progress', async () => {
      const user = userEvent.setup();
      render(<CyberFarmGame />);
      
      // Should show save/load functionality
      expect(screen.getByTestId('save-game-button')).toBeInTheDocument();
      expect(screen.getByTestId('load-game-button')).toBeInTheDocument();
      
      // Should save current progress
      const farmPlot = screen.getByTestId('farm-plot-1');
      await user.click(farmPlot);
      
      await user.click(screen.getByTestId('save-game-button'));
      expect(screen.getByTestId('save-confirmation')).toHaveTextContent('Game saved successfully!');
      
      // Should load saved progress
      await user.click(screen.getByTestId('load-game-button'));
      expect(screen.getByTestId('planted-crop-1')).toBeInTheDocument();
      expect(screen.getByTestId('load-confirmation')).toHaveTextContent('Game loaded successfully!');
    });
  });
});
