/**
 * 🎮 CYBER KNOWLEDGE BRAIN GAME - TDD Test Implementation
 * 
 * Test Guardian Agent - RED-GREEN-REFACTOR Cycle
 * Target: Improve games module coverage from 0% to 85%+
 * Focus: Basic functionality and educational safety
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import component under test
import CyberKnowledgeBrainGame from '@/app/games/cyber-knowledge-brain/CyberKnowledgeBrainGame';

describe('🧠 CyberKnowledgeBrainGame - Basic Functionality', () => {
  
  test('renders main game interface', () => {
    render(<CyberKnowledgeBrainGame />);
    
    // Basic game interface elements from actual component
    expect(screen.getByText(/Cyber Knowledge Brain/i)).toBeInTheDocument();
    expect(screen.getByText(/Pokemon-style learning adventure for Cyber Scouts/i)).toBeInTheDocument();
  });

  test('displays navigation tabs correctly', () => {
    render(<CyberKnowledgeBrainGame />);
    
    // Check for actual navigation buttons from component
    expect(screen.getByText(/🌍 Explore/i)).toBeInTheDocument();
    expect(screen.getByText(/📦 Collection/i)).toBeInTheDocument();
    expect(screen.getByText(/🌳 Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/🏆 Badges/i)).toBeInTheDocument();
  });

  test('shows player progress information', () => {
    render(<CyberKnowledgeBrainGame />);
    
    // Player progress should be visible - be more specific to avoid duplicates
    expect(screen.getByText(/Scout Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Novice Scout/i)).toBeInTheDocument();
    expect(screen.getByText('0/9')).toBeInTheDocument(); // Monster count display
  });

  test('handles tab navigation to collection', async () => {
    const user = userEvent.setup();
    render(<CyberKnowledgeBrainGame />);
    
    // Click on collection tab
    const collectionTab = screen.getByText(/📦 Collection/i);
    await user.click(collectionTab);
    
    // Should show collection content
    expect(screen.getByText(/Monster Collection/i)).toBeInTheDocument();
    expect(screen.getByText(/Your collection of cybersecurity creatures/i)).toBeInTheDocument();
  });

  test('handles navigation to skills tab', async () => {
    const user = userEvent.setup();
    render(<CyberKnowledgeBrainGame />);
    
    // Click on skills tab
    const skillsTab = screen.getByText(/🌳 Skills/i);
    await user.click(skillsTab);
    
    // Wait for skills content to appear
    await waitFor(() => {
      expect(screen.getByText(/Cybersecurity Learning Pathways/i)).toBeInTheDocument();
    });
  });

  test('handles navigation to badges tab', async () => {
    const user = userEvent.setup();
    render(<CyberKnowledgeBrainGame />);
    
    // Click on badges tab
    const badgesTab = screen.getByText(/🏆 Badges/i);
    await user.click(badgesTab);
    
    // Wait for badges content to appear
    await waitFor(() => {
      expect(screen.getByText(/Achievement Badges/i)).toBeInTheDocument();
    });
  });

  test('displays educational context appropriately', () => {
    render(<CyberKnowledgeBrainGame />);
    
    // Should have educational messaging for Cyber Scouts
    expect(screen.getByText(/Cyber Scouts/i)).toBeInTheDocument();
  });

  test('shows default exploration view on initial load', () => {
    render(<CyberKnowledgeBrainGame />);
    
    // Explore tab should be active by default (has cyan background)
    const exploreButton = screen.getByText(/🌍 Explore/i).closest('button');
    expect(exploreButton).toHaveClass('bg-cyan-500');
  });

  test('displays tab descriptions correctly', () => {
    render(<CyberKnowledgeBrainGame />);
    
    // Check tab descriptions
    expect(screen.getByText(/Discover new regions/i)).toBeInTheDocument();
    expect(screen.getByText(/View your monsters/i)).toBeInTheDocument();
    expect(screen.getByText(/Learning pathways/i)).toBeInTheDocument();
    expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
  });
});
