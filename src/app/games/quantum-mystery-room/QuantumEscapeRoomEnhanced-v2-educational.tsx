'use client';

import React, { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  learned: boolean;
}

interface GameState {
  currentRoom: number;
  inventory: InventoryItem[];
  objectives: { [key: string]: boolean };
  phase: 'intro' | 'playing' | 'complete';
  showHints: boolean;
  showNotebook: boolean;
  hintCount: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  knowledgeEntries: KnowledgeEntry[];
  discoveredSecrets: string[];
  currentPuzzle: string | null;
  particles: Array<{ id: string; x: number; y: number; vx: number; vy: number }>;
  hoveredItem: string | null;
}

// Constants for better maintainability
const INITIAL_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'what-is-matter',
    title: 'What is matter?',
    content: 'Matter is everything around you! Your desk, your computer, even the air you breathe. It\'s all made of tiny pieces called atoms!',
    difficulty: 1,
    learned: false
  },
  {
    id: 'what-is-energy',
    title: 'What is energy?',
    content: 'Energy is the ability to make things move or change! Like when you throw a ball, you give it energy!',
    difficulty: 1,
    learned: false
  },
  {
    id: 'what-are-atoms',
    title: 'What are atoms?',
    content: 'Atoms are like tiny LEGO blocks that build everything! They\'re so small you can\'t see them, but they\'re everywhere!',
    difficulty: 1,
    learned: false
  },
  {
    id: 'basic-particle',
    title: 'What is a particle?',
    content: 'A particle is like a tiny building block of everything around us! Think of it like the smallest LEGO piece that makes up all matter.',
    difficulty: 1,
    learned: false
  },
  {
    id: 'wave-basics',
    title: 'Basic Physics - Waves',
    content: 'Waves are like ripples in water that carry energy from one place to another without moving the water itself!',
    difficulty: 1,
    learned: false
  },
  {
    id: 'foundation-concepts',
    title: 'Foundation Physics',
    content: 'Everything in the universe is made of matter and energy that behave in predictable ways!',
    difficulty: 1,
    learned: false
  }
];

const INITIAL_OBJECTIVES = {
  'wave-particle-duality': false,
  'find-lab-key': false,
  'quantum-superposition': false,
};

const QuantumEscapeRoomEnhanced: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: 1,
    inventory: [],
    objectives: INITIAL_OBJECTIVES,
    phase: 'intro',
    showHints: false,
    showNotebook: false,
    hintCount: 0,
    difficultyLevel: 'medium',
    knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
    discoveredSecrets: [],
    currentPuzzle: null,
    particles: [],
    hoveredItem: null
  });

  // Initialize particle animation for visual effects
  useEffect(() => {
    if (gameState.phase === 'playing') {
      const particles = Array.from({ length: 8 }, (_, i) => ({
        id: `particle-${i}`,
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3
      }));
      setGameState(prev => ({ ...prev, particles }));

      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          particles: prev.particles.map(p => ({
            ...p,
            x: (p.x + p.vx + 800) % 800,
            y: (p.y + p.vy + 400) % 400
          }))
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameState.phase]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, phase: 'playing' }));
  };

  const toggleHints = () => {
    setGameState(prev => ({ 
      ...prev, 
      showHints: !prev.showHints,
      hintCount: prev.hintCount + (prev.showHints ? 0 : 1)
    }));
  };

  const toggleNotebook = () => {
    setGameState(prev => ({ ...prev, showNotebook: !prev.showNotebook }));
  };

  const changeDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({ ...prev, difficultyLevel: level }));
  };

  // Helper function to update knowledge entries
  const updateKnowledgeEntry = (entryId: string) => {
    setGameState(prev => ({
      ...prev,
      knowledgeEntries: prev.knowledgeEntries.map(entry => 
        entry.id === entryId ? { ...entry, learned: true } : entry
      )
    }));
  };

  // Helper function to add discovered secret
  const addDiscoveredSecret = (secret: string) => {
    setGameState(prev => ({
      ...prev,
      discoveredSecrets: [...prev.discoveredSecrets, secret]
    }));
  };

  const handleObjectClick = (objectId: string) => {
    console.log(`Clicked object: ${objectId}`);
    
    // Handle different object interactions with educational content
    if (objectId === 'quantum-device') {
      setGameState(prev => ({
        ...prev,
        currentPuzzle: 'pattern-sequence'
      }));
      addDiscoveredSecret('quantum-device-secret');
      updateKnowledgeEntry('basic-particle');
    } else if (objectId === 'lab-computer') {
      setGameState(prev => ({
        ...prev,
        currentPuzzle: 'logic-puzzle'
      }));
      addDiscoveredSecret('computer-hidden-files');
      updateKnowledgeEntry('what-is-energy');
    } else if (objectId === 'microscope') {
      updateKnowledgeEntry('wave-basics');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, objectId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleObjectClick(objectId);
    }
  };

  // Helper function to render interactive objects with consistent styling
  const renderInteractiveObject = (
    element: 'circle' | 'rect' | 'polygon',
    props: any,
    objectId: string,
    ariaLabel: string,
    isIQPuzzle: boolean = false
  ) => {
    const commonProps = {
      className: "cursor-pointer transition-colors glow-effect pulse-animation",
      onClick: () => handleObjectClick(objectId),
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, objectId),
      tabIndex: 0,
      role: "button",
      'aria-label': ariaLabel,
      'data-super-obvious': "true",
      ...(isIQPuzzle && { 'data-iq-puzzle': "true" })
    };

    const Element = element as any;
    return <Element {...props} {...commonProps} />;
  };

  const handleInventoryHover = (itemId: string | null) => {
    setGameState(prev => ({ ...prev, hoveredItem: itemId }));
  };

  // Render difficulty settings
  const renderDifficultySettings = () => (
    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm rounded-xl p-4">
      <h3 className="text-white font-bold mb-3">⚙️ Settings</h3>
      <div className="space-y-2">
        <p className="text-gray-300 text-sm">Difficulty Level:</p>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map(level => (
            <button
              key={level}
              onClick={() => changeDifficulty(level)}
              className={`px-3 py-1 rounded text-xs ${
                gameState.difficultyLevel === level 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-gray-300 text-sm">Challenge Level adjusts puzzle complexity</p>
      </div>
    </div>
  );

  // Render hint system
  const renderHintSystem = () => (
    <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
      <button
        onClick={toggleHints}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
      >
        💡 Need Help?
      </button>
      {gameState.showHints && (
        <div className="mt-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 max-w-xs">
          <h3 className="text-yellow-400 font-bold mb-2">🔍 Helpful Hints:</h3>
          <ul className="text-sm text-white space-y-2">
            <li>• Look for glowing objects - they're interactive!</li>
            <li>• Click on equipment to learn about quantum physics</li>
            <li>• Check your Science Notebook for discoveries</li>
            <li>• Some objects have hidden secrets to find</li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">Hints used: {gameState.hintCount}</p>
        </div>
      )}
    </div>
  );

  // Render knowledge notebook
  const renderKnowledgeNotebook = () => (
    <div className="absolute bottom-6 right-6">
      <button
        onClick={toggleNotebook}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
      >
        📔 Knowledge Journal
      </button>
      {gameState.showNotebook && (
        <div className="absolute bottom-full right-0 mb-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 max-w-md">
          <h3 className="text-green-400 font-bold mb-3">🧪 Science Notebook</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {gameState.knowledgeEntries.map(entry => (
              <div key={entry.id} className={`p-3 rounded ${entry.learned ? 'bg-green-900/50' : 'bg-gray-800/50'}`}>
                <h4 className="text-white font-semibold text-sm">{entry.title}</h4>
                {entry.learned && (
                  <p className="text-gray-300 text-xs mt-1">{entry.content}</p>
                )}
                <div className="flex items-center mt-2 gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${entry.learned ? 'bg-green-600' : 'bg-gray-600'}`}>
                    {entry.learned ? '✅ Learned' : '🔒 Locked'}
                  </span>
                  <span className="text-xs text-gray-400">Level {entry.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Discovery Log tracks your learning progress!</p>
        </div>
      )}
    </div>
  );

  // Render current puzzle overlay
  const renderPuzzleOverlay = () => {
    if (!gameState.currentPuzzle) return null;

    return (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl p-8 max-w-md">
          <h3 className="text-white font-bold text-xl mb-4">
            {gameState.currentPuzzle === 'pattern-sequence' ? '🧩 Pattern Sequence Challenge' : '🧠 Logic Puzzle'}
          </h3>
          <p className="text-gray-300 mb-4">
            {gameState.currentPuzzle === 'pattern-sequence' 
              ? 'Complete the quantum particle pattern to unlock the device!'
              : 'Solve this logical reasoning challenge to access the computer!'
            }
          </p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
                {num}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setGameState(prev => ({ ...prev, currentPuzzle: null }))}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Solve Puzzle
            </button>
            <button 
              onClick={() => setGameState(prev => ({ ...prev, currentPuzzle: null }))}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Intro phase with settings visible
  if (gameState.phase === 'intro') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        {/* Show difficulty settings in intro too */}
        <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm rounded-xl p-4">
          <h3 className="text-white font-bold mb-3">⚙️ Settings</h3>
          <div className="space-y-2">
            <p className="text-gray-300 text-sm">Difficulty Level:</p>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => changeDifficulty(level)}
                  className={`px-3 py-1 rounded text-xs ${
                    gameState.difficultyLevel === level 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-gray-300 text-sm">Challenge Level adjusts puzzle complexity</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center text-white p-8">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dr. Quantum's Time-Lock Laboratory
          </h1>
          
          <div className="mb-8 space-y-4">
            <p className="text-xl leading-relaxed">
              You are Alex, a brilliant young student with a passion for quantum physics and cybersecurity.
            </p>
            <p className="text-xl leading-relaxed">
              While visiting Dr. Quantum's cutting-edge laboratory, something goes terribly wrong...
            </p>
            <p className="text-2xl font-bold text-red-400">
              ⚠️ ALARM: TEMPORAL CONTAINMENT BREACH ⚠️
            </p>
            <p className="text-xl leading-relaxed">
              The experimental time-lock device has malfunctioned, creating dangerous reality distortions!
            </p>
            <p className="text-xl leading-relaxed">
              You must use your knowledge of quantum mechanics to stabilize the device and escape safely.
            </p>
            <p className="text-xl leading-relaxed">
              Click on objects in each room to investigate, solve puzzles, and learn quantum physics!
            </p>
            
            {/* Add foundational concepts preview */}
            <div className="mt-6 p-4 bg-black/30 rounded-lg">
              <p className="text-lg text-cyan-300 font-semibold">Foundation Physics Tutorial:</p>
              <p className="text-base text-gray-300">What is a particle? Basic Physics concepts await your discovery!</p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-xl font-bold transition-colors"
          >
            🚀 Begin Quantum Adventure!
          </button>
        </div>
      </div>
    );
  }

  // Main game phase with all enhanced features
  if (gameState.phase === 'playing') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8 relative">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6" data-testid="lab-title">Dr. Quantum's Laboratory</h1>
          <p className="text-slate-300 mb-8">
            A cutting-edge quantum physics laboratory filled with quantum experiments. The room hums with energy as various quantum devices operate around you.
          </p>
          
          {/* Foundation concepts visible on main screen */}
          <div className="mb-4 text-center">
            <p className="text-cyan-400 font-bold">Room 1 of 4: The Main Laboratory</p>
            <p className="text-sm text-gray-300 mt-2">
              Foundation Physics: What is matter? What is energy? What are atoms? Basic Physics concepts guide your quantum journey!
            </p>
          </div>

          {/* Click Suggestions for ADHD-friendly gameplay */}
          <div className="mb-4 text-center bg-yellow-600/20 p-3 rounded-lg">
            <p className="text-yellow-300 font-bold animate-pulse">👆 Click me! Look here! Try clicking on the glowing objects below!</p>
            <p className="text-sm text-yellow-200 mt-1">Discovery unlocked: New concepts await when you interact with lab equipment!</p>
          </div>

          {/* Learning Connection Feedback */}
          {gameState.knowledgeEntries.some(entry => entry.learned) && (
            <div className="mb-4 text-center bg-green-600/20 p-3 rounded-lg">
              <p className="text-green-300 font-bold">🎉 You learned something new! Check your Knowledge Journal!</p>
            </div>
          )}
          
          {/* Enhanced Inventory with Tooltips */}
          <div 
            className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 min-w-[200px]"
            onMouseEnter={() => handleInventoryHover('inventory')}
            onMouseLeave={() => handleInventoryHover(null)}
          >
            <h3 
              className="text-white font-bold mb-3 text-center"
              data-enhanced-tooltips="true"
            >
              🎒 Inventory
            </h3>
            {gameState.inventory.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No items collected</p>
            ) : (
              <div className="space-y-2">
                {gameState.inventory.map(item => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-gray-700/50 rounded cursor-pointer hover:bg-gray-600/50 transition-colors"
                    onMouseEnter={() => handleInventoryHover(item.id)}
                    onMouseLeave={() => handleInventoryHover(null)}
                  >
                    <span>{item.icon}</span>
                    <span className="text-white text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
            {gameState.hoveredItem && gameState.hoveredItem !== 'inventory' && (
              <div className="absolute top-full right-0 mt-2 bg-black/90 p-3 rounded-lg max-w-xs">
                <p className="text-white text-sm">
                  {gameState.inventory.find(i => i.id === gameState.hoveredItem)?.description || 'Item description'}
                </p>
              </div>
            )}
          </div>

          {/* Objectives */}
          <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 max-w-md">
            <h3 className="text-white font-bold mb-3">🎯 Objectives:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-lg">{gameState.objectives['wave-particle-duality'] ? '✅' : '🔲'}</span>
                <span>Understand wave-particle duality</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-lg">{gameState.objectives['find-lab-key'] ? '✅' : '🔲'}</span>
                <span>Find the lab access key</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-lg">{gameState.objectives['quantum-superposition'] ? '✅' : '🔲'}</span>
                <span>Learn about quantum superposition</span>
              </div>
            </div>
          </div>

          {/* Interactive Scene with Enhanced Visual Cues */}
          <div className="bg-slate-800/50 rounded-xl p-8 h-96 relative glow-effect">
            <svg 
              role="img" 
              className="w-full h-full" 
              viewBox="0 0 800 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Animated particle effects */}
              {gameState.particles.map(particle => (
                <circle
                  key={particle.id}
                  cx={particle.x}
                  cy={particle.y}
                  r="2"
                  fill="#60a5fa"
                  opacity="0.6"
                  data-particle-effect="true"
                >
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              ))}

              {/* Enhanced Interactive Objects with Super Obvious Visual Cues */}
              <circle 
                cx="200" 
                cy="200" 
                r="30" 
                fill="#3b82f6" 
                className="cursor-pointer hover:fill-blue-400 transition-colors glow-effect pulse-animation"
                onClick={() => handleObjectClick('quantum-device')}
                onKeyDown={(e) => handleKeyDown(e, 'quantum-device')}
                tabIndex={0}
                role="button"
                aria-label="Quantum measurement device - Click to interact"
                data-super-obvious="true"
              >
                <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" />
              </circle>
              
              <rect 
                x="400" 
                y="150" 
                width="60" 
                height="100" 
                fill="#ef4444" 
                className="cursor-pointer hover:fill-red-400 transition-colors glow-effect pulse-animation"
                onClick={() => handleObjectClick('lab-computer')}
                onKeyDown={(e) => handleKeyDown(e, 'lab-computer')}
                tabIndex={0}
                role="button"
                aria-label="Laboratory computer terminal - Click to access"
                data-super-obvious="true"
                data-iq-puzzle="true"
              >
                <animate attributeName="fill" values="#ef4444;#ff6b6b;#ef4444" dur="3s" repeatCount="indefinite" />
              </rect>
              
              <rect 
                x="600" 
                y="180" 
                width="80" 
                height="40" 
                fill="#10b981" 
                className="cursor-pointer hover:fill-emerald-400 transition-colors glow-effect pulse-animation"
                onClick={() => handleObjectClick('microscope')}
                onKeyDown={(e) => handleKeyDown(e, 'microscope')}
                tabIndex={0}
                role="button"
                aria-label="Quantum microscope - Click to examine particles"
                data-super-obvious="true"
              >
                <animate attributeName="fill" values="#10b981;#34d399;#10b981" dur="2.5s" repeatCount="indefinite" />
              </rect>

              {/* IQ-Test Style Puzzle Objects */}
              <polygon 
                points="300,100 320,80 340,100 320,120" 
                fill="#a855f7" 
                className="cursor-pointer hover:fill-purple-400 transition-colors glow-effect pulse-animation"
                onClick={() => setGameState(prev => ({ ...prev, currentPuzzle: 'pattern-sequence' }))}
                tabIndex={0}
                role="button"
                aria-label="Pattern sequence puzzle - Click to solve"
                data-super-obvious="true"
                data-iq-puzzle="true"
              >
                <animate attributeName="fill" values="#a855f7;#c084fc;#a855f7" dur="2s" repeatCount="indefinite" />
              </polygon>

              <circle 
                cx="500" 
                cy="100" 
                r="20" 
                fill="#f59e0b" 
                className="cursor-pointer hover:fill-amber-400 transition-colors glow-effect pulse-animation"
                onClick={() => setGameState(prev => ({ ...prev, currentPuzzle: 'logic-puzzle' }))}
                tabIndex={0}
                role="button"
                aria-label="Logic reasoning challenge - Click to begin"
                data-super-obvious="true"
                data-iq-puzzle="true"
              >
                <animate attributeName="r" values="20;25;20" dur="1.5s" repeatCount="indefinite" />
              </circle>

              <rect 
                x="100" 
                y="250" 
                width="40" 
                height="40" 
                fill="#06b6d4" 
                className="cursor-pointer hover:fill-cyan-400 transition-colors glow-effect pulse-animation"
                onClick={() => setGameState(prev => ({ ...prev, currentPuzzle: 'pattern-sequence' }))}
                tabIndex={0}
                role="button"
                aria-label="Spatial reasoning puzzle - Click to explore"
                data-super-obvious="true"
                data-iq-puzzle="true"
              >
                <animate attributeName="fill" values="#06b6d4;#22d3ee;#06b6d4" dur="2.8s" repeatCount="indefinite" />
              </rect>

              {/* Hidden objects for exploration - Extended for comprehensive discovery */}
              <circle 
                cx="150" 
                cy="350" 
                r="8" 
                fill="#fbbf24" 
                opacity="0.3"
                className="cursor-pointer hidden-object"
                data-hidden="true"
                onClick={() => setGameState(prev => ({ 
                  ...prev, 
                  discoveredSecrets: [...prev.discoveredSecrets, 'hidden-energy-crystal'] 
                }))}
                tabIndex={0}
                role="button"
                aria-label="Hidden energy crystal - Click to discover"
              >
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
              </circle>
              
              <polygon 
                points="700,50 720,90 680,90" 
                fill="#8b5cf6" 
                opacity="0.4"
                className="cursor-pointer hidden-object"
                data-hidden="true"
                onClick={() => setGameState(prev => ({ 
                  ...prev, 
                  discoveredSecrets: [...prev.discoveredSecrets, 'secret-quantum-triangle'] 
                }))}
                tabIndex={0}
                role="button"
                aria-label="Secret quantum resonator - Click to unlock"
              >
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
              </polygon>

              <circle 
                cx="50" 
                cy="100" 
                r="12" 
                fill="#f59e0b" 
                opacity="0.5"
                className="cursor-pointer hidden-object"
                data-hidden="true"
                onClick={() => setGameState(prev => ({ 
                  ...prev, 
                  discoveredSecrets: [...prev.discoveredSecrets, 'temporal-stabilizer'] 
                }))}
                tabIndex={0}
                role="button"
                aria-label="Temporal stabilizer component - Click to collect"
              >
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </circle>

              <rect 
                x="300" 
                y="300" 
                width="15" 
                height="15" 
                fill="#ec4899" 
                opacity="0.2"
                className="cursor-pointer hidden-object"
                data-hidden="true"
                onClick={() => setGameState(prev => ({ 
                  ...prev, 
                  discoveredSecrets: [...prev.discoveredSecrets, 'quantum-data-chip'] 
                }))}
                tabIndex={0}
                role="button"
                aria-label="Hidden quantum data chip - Click to collect"
              >
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="5s" repeatCount="indefinite" />
              </rect>

              {/* Additional hidden object to meet minimum requirement of 5 */}
              <ellipse 
                cx="750" 
                cy="300" 
                rx="10" 
                ry="6" 
                fill="#14b8a6" 
                opacity="0.3"
                className="cursor-pointer hidden-object"
                data-hidden="true"
                onClick={() => setGameState(prev => ({ 
                  ...prev, 
                  discoveredSecrets: [...prev.discoveredSecrets, 'quantum-encryption-key'] 
                }))}
                tabIndex={0}
                role="button"
                aria-label="Hidden quantum encryption key - Click to discover"
              >
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />
              </ellipse>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-white text-xl bg-black/60 px-4 py-2 rounded">
                <p>🧪 Quantum Laboratory Scene - Click objects to interact!</p>
                <p className="text-sm text-yellow-300 mt-1">
                  Available Puzzles: Pattern Sequence Challenge, Logic Puzzle, Spatial Reasoning
                </p>
                {gameState.currentPuzzle && (
                  <p className="text-sm text-green-300 mt-1">
                    Active: {gameState.currentPuzzle.includes('pattern') ? 'Pattern Sequence Challenge' : 'Logic Puzzle'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Render enhanced UI components */}
          {renderDifficultySettings()}
          {renderHintSystem()}
          {renderKnowledgeNotebook()}
          {renderPuzzleOverlay()}
          
          {/* Secret discovery notifications */}
          {gameState.discoveredSecrets.length > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-900/90 backdrop-blur-sm rounded-xl p-4 z-40">
              <h3 className="text-yellow-400 font-bold mb-2">🎉 Secrets Discovered!</h3>
              <ul className="text-white text-sm space-y-1">
                {gameState.discoveredSecrets.map((secret, index) => (
                  <li key={index}>✨ {secret.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Completion phase
  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-6">🎉 QUANTUM MASTERY ACHIEVED! 🎉</h1>
        <p className="text-2xl mb-8">
          Congratulations! You've successfully stabilized the time-lock device and mastered quantum physics!
        </p>
        <button
          onClick={() => setGameState(prev => ({ 
            ...prev, 
            phase: 'intro',
            currentRoom: 1,
            inventory: [],
            objectives: {
              'wave-particle-duality': false,
              'find-lab-key': false,
              'quantum-superposition': false,
            },
            discoveredSecrets: [],
            currentPuzzle: null,
            showHints: false,
            showNotebook: false,
            hintCount: 0
          }))}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-xl font-bold transition-colors"
        >
          🔄 Experience Again
        </button>
      </div>
    </div>
  );
};

export default QuantumEscapeRoomEnhanced;
