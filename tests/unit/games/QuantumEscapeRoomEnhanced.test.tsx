import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import QuantumEscapeRoomEnhanced from '../../../src/app/games/quantum-mystery-room/QuantumEscapeRoomEnhanced-v2-educational';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
    circle: ({ children, ...props }: any) => <circle {...props}>{children}</circle>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    line: ({ children, ...props }: any) => <line {...props}>{children}</line>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock the game store
jest.mock('../../../src/stores/gameStore', () => ({
  __esModule: true,
  default: () => ({
    addXP: jest.fn(),
    updateSkillProgress: jest.fn(),
    updateProgress: jest.fn(),
  }),
}));

describe('QuantumEscapeRoomEnhanced', () => {
  describe('Basic Component Rendering', () => {
    test('renders the intro story correctly', () => {
      render(<QuantumEscapeRoomEnhanced />);
      
      expect(screen.getByText(/You are Alex, a brilliant young student/)).toBeInTheDocument();
      expect(screen.getByText(/⚠️ ALARM: TEMPORAL CONTAINMENT BREACH ⚠️/)).toBeInTheDocument();
      expect(screen.getByText(/Begin Quantum Adventure/)).toBeInTheDocument();
    });

    test('transitions from intro to game when start button is clicked', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Dr. Quantum's Laboratory/)).toBeInTheDocument();
      });
    });
  });

  describe('Room Navigation and Progression', () => {
    test('starts in the laboratory room', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Dr. Quantum's Laboratory/)).toBeInTheDocument();
        expect(screen.getByText(/A cutting-edge quantum physics laboratory/)).toBeInTheDocument();
      });
    });

    test('shows room objectives and progress', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Objectives:/)).toBeInTheDocument();
        expect(screen.getByText(/Room 1 of 4/)).toBeInTheDocument();
      });
    });
  });

  describe('Interactive Object System', () => {
    test('displays clickable objects with visual feedback', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Check for SVG elements representing objects
        const svgElement = screen.getByRole('img', { hidden: true }) || document.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
      });
    });

    test('shows tooltips on object hover', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Look for cursor-pointer elements which indicate clickable objects
        const clickableElements = document.querySelectorAll('.cursor-pointer');
        expect(clickableElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Enhanced Usability for 10-year-olds', () => {
    test('FAILING: should highlight all clickable objects with obvious visual cues', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // This should fail initially - we want obvious glow/pulse effects
        const glowingElements = document.querySelectorAll('.glow-effect, .pulse-animation');
        expect(glowingElements.length).toBeGreaterThan(3); // Should have multiple obvious visual cues
      });
    });

    test('FAILING: should show a hint system for confused players', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should have a "Need Help?" or "Show Hints" button
        const hintButton = screen.getByText(/Need Help\?|Show Hints|Get Hint/);
        expect(hintButton).toBeInTheDocument();
      });
    });

    test('FAILING: should have a master knowledge notebook feature', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should have a notebook/journal feature
        const notebook = screen.getByText(/Knowledge Journal|Science Notebook|Discovery Log/);
        expect(notebook).toBeInTheDocument();
      });
    });

    test('FAILING: should have hidden objects that require exploration to find', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should have objects that become visible only after interaction
        const hiddenObjectCount = document.querySelectorAll('[data-hidden="true"]').length;
        expect(hiddenObjectCount).toBeGreaterThan(2);
      });
    });

    test('FAILING: should provide IQ-test style mini-puzzles', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Look for pattern recognition or logic puzzle elements
        const puzzleElement = screen.getByText(/Pattern|Sequence|Logic|Puzzle/);
        expect(puzzleElement).toBeInTheDocument();
      });
    });

    test('FAILING: should show particle trails and physics animations', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should have animated particle effects
        const particleEffects = document.querySelectorAll('[data-particle-effect="true"]');
        expect(particleEffects.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Educational Content Quality', () => {
    test('uses age-appropriate language for gifted 10-year-olds', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Check for complex but accessible explanations - use specific elements
        expect(screen.getByText(/quantum physics/i)).toBeInTheDocument();
        expect(screen.getByTestId('lab-title')).toBeInTheDocument(); // Use specific test ID
      });
    });

    test('FAILING: provides progressive complexity building from basic concepts', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should start with foundational concepts before advancing
        const basicConcepts = screen.getByText(/What is a particle\?|Basic Physics|Foundation/);
        expect(basicConcepts).toBeInTheDocument();
      });
    });
  });

  describe('Inventory and State Management', () => {
    test('displays inventory correctly', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText(/🎒 Inventory/)).toBeInTheDocument();
        expect(screen.getByText(/No items collected/)).toBeInTheDocument();
      });
    });

    test('FAILING: shows item descriptions when hovering over inventory items', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      // This test will fail until we implement enhanced inventory tooltips
      await waitFor(() => {
        const inventoryArea = screen.getByText(/🎒 Inventory/);
        expect(inventoryArea).toHaveAttribute('data-enhanced-tooltips', 'true');
      });
    });
  });

  describe('Accessibility for Gifted Children', () => {
    test('FAILING: provides multiple interaction modes (keyboard, mouse, touch)', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should support keyboard navigation for accessibility
        const keyboardNavElements = document.querySelectorAll('[tabindex="0"]');
        expect(keyboardNavElements.length).toBeGreaterThan(3);
      });
    });

    test('FAILING: provides difficulty adjustment options', async () => {
      render(<QuantumEscapeRoomEnhanced />);
      
      await waitFor(() => {
        // Should have settings for adjusting challenge level - use getAllByText for multiple matches
        const difficultySettings = screen.getAllByText(/Difficulty|Challenge Level|Settings/);
        expect(difficultySettings.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Enhanced ADHD-Friendly Features for Gifted 10-Year-Olds', () => {
    test('FAILING: should provide super obvious visual cues that pulse and glow', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should have multiple obvious visual indicators for ADHD children
        const superObviousCues = document.querySelectorAll('[data-super-obvious="true"]');
        expect(superObviousCues.length).toBeGreaterThan(5);
      });
    });

    test('FAILING: should show click suggestions and visual guides', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should show helpful click suggestions for confused players
        const clickGuides = screen.getByText(/Click me!|Try clicking|Look here/i);
        expect(clickGuides).toBeInTheDocument();
      });
    });

    test('FAILING: should have multiple mini-game style IQ puzzles', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should provide multiple IQ-test style challenges
        const iqPuzzles = document.querySelectorAll('[data-iq-puzzle="true"]');
        expect(iqPuzzles.length).toBeGreaterThan(2);
      });
    });

    test('FAILING: should have a comprehensive hidden object discovery system', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should have at least 5 hidden objects to discover
        const hiddenObjects = document.querySelectorAll('[data-hidden="true"]');
        expect(hiddenObjects.length).toBeGreaterThanOrEqual(5);
      });
    });

    test('FAILING: should provide step-by-step physics learning from basics', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should start with very basic concepts
        const basicPhysics = screen.getByText(/What is matter\?|What is energy\?|What are atoms\?/i);
        expect(basicPhysics).toBeInTheDocument();
      });
    });

    test('FAILING: should have obvious connection between actions and learning', async () => {
      const user = userEvent.setup();
      render(<QuantumEscapeRoomEnhanced />);
      
      const startButton = screen.getByText(/Begin Quantum Adventure/);
      await user.click(startButton);
      
      await waitFor(() => {
        // Should clearly show how each interaction teaches something
        const learningConnection = screen.getByText(/You learned|Discovery unlocked|New concept/i);
        expect(learningConnection).toBeInTheDocument();
      });
    });
  });
});
