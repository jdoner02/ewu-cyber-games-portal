'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '@/stores/gameStore';

// Room types for the escape room progression
type RoomType = 'lab' | 'entanglement' | 'cryptography' | 'timelock';

// Inventory item type
interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

// Interactive hotspot type
interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tooltip: string;
  requiresItem?: string;
  givesItem?: InventoryItem;
  opensModal?: string;
  unlocks?: string;
}

// Modal content type
interface ModalContent {
  id: string;
  title: string;
  content: React.ReactNode;
  completesObjective?: string;
  xpReward?: number;
  skillReward?: number;
  givesItem?: InventoryItem;
}

const QuantumEscapeRoom: React.FC = () => {
  const { addXP, updateSkillProgress } = useGameStore();
  
  // Game state
  const [currentRoom, setCurrentRoom] = useState<RoomType>('lab');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(new Set());
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [storyProgress, setStoryProgress] = useState(0);

  // Room definitions with hotspots
  const rooms: Record<RoomType, { 
    title: string; 
    description: string; 
    background: string;
    hotspots: Hotspot[];
    objectives: string[];
  }> = {
    lab: {
      title: "Dr. Quantum's Laboratory",
      description: "The main lab where the time-lock experiment went wrong. Find clues about quantum mechanics to proceed.",
      background: "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900",
      hotspots: [
        {
          id: 'computer',
          x: 100, y: 150, width: 80, height: 60,
          tooltip: 'Quantum Computer - Shows wave function data',
          opensModal: 'wave-function'
        },
        {
          id: 'notebook',
          x: 250, y: 200, width: 60, height: 40,
          tooltip: "Dr. Quantum's Research Notes",
          opensModal: 'research-notes',
          givesItem: { id: 'lab-key', name: 'Lab Key', emoji: '🔑', description: 'Key to the Entanglement Chamber' }
        },
        {
          id: 'apparatus',
          x: 450, y: 180, width: 100, height: 80,
          tooltip: 'Double-slit Experiment Setup',
          opensModal: 'double-slit'
        },
        {
          id: 'door-entanglement',
          x: 650, y: 100, width: 80, height: 120,
          tooltip: 'Door to Entanglement Chamber',
          requiresItem: 'lab-key',
          unlocks: 'entanglement-room'
        }
      ],
      objectives: ['Learn about wave-particle duality', 'Find the lab key', 'Understand superposition']
    },
    entanglement: {
      title: "Entanglement Chamber",
      description: "A specialized room for quantum entanglement experiments. Pair the entangled particles correctly.",
      background: "bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900",
      hotspots: [
        {
          id: 'particle-a',
          x: 150, y: 200, width: 60, height: 60,
          tooltip: 'Quantum Particle A',
          opensModal: 'entanglement-puzzle'
        },
        {
          id: 'particle-b',
          x: 550, y: 200, width: 60, height: 60,
          tooltip: 'Quantum Particle B',
          opensModal: 'entanglement-puzzle'
        },
        {
          id: 'detector',
          x: 350, y: 300, width: 80, height: 60,
          tooltip: 'Quantum State Detector',
          opensModal: 'detector-readings'
        },
        {
          id: 'door-crypto',
          x: 600, y: 400, width: 80, height: 120,
          tooltip: 'Door to Cryptography Vault',
          requiresItem: 'entanglement-key',
          unlocks: 'crypto-room'
        }
      ],
      objectives: ['Understand quantum entanglement', 'Solve the particle pairing puzzle', 'Unlock cryptography vault']
    },
    cryptography: {
      title: "Quantum Cryptography Vault",
      description: "Advanced quantum encryption systems. Decode the quantum messages to access the time-lock core.",
      background: "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900",
      hotspots: [
        {
          id: 'quantum-key',
          x: 200, y: 150, width: 70, height: 50,
          tooltip: 'Quantum Key Generator',
          opensModal: 'key-distribution'
        },
        {
          id: 'encrypted-message',
          x: 400, y: 200, width: 100, height: 60,
          tooltip: 'Encrypted Quantum Message',
          opensModal: 'quantum-cipher'
        },
        {
          id: 'security-terminal',
          x: 150, y: 350, width: 90, height: 70,
          tooltip: 'Security Terminal',
          requiresItem: 'cipher-key',
          opensModal: 'security-access'
        },
        {
          id: 'door-timelock',
          x: 550, y: 300, width: 80, height: 120,
          tooltip: 'Door to Time-Lock Core',
          requiresItem: 'access-card',
          unlocks: 'timelock-room'
        }
      ],
      objectives: ['Learn quantum key distribution', 'Decode the encrypted message', 'Access the time-lock core']
    },
    timelock: {
      title: "Time-Lock Core",
      description: "The heart of the time manipulation device. Stabilize the quantum field to complete your escape!",
      background: "bg-gradient-to-br from-purple-900 via-pink-900 to-red-900",
      hotspots: [
        {
          id: 'time-crystal',
          x: 350, y: 150, width: 100, height: 100,
          tooltip: 'Temporal Stabilization Crystal',
          opensModal: 'time-stabilization'
        },
        {
          id: 'control-panel',
          x: 150, y: 250, width: 120, height: 80,
          tooltip: 'Time-Lock Control Panel',
          opensModal: 'final-puzzle'
        },
        {
          id: 'quantum-field',
          x: 500, y: 200, width: 150, height: 100,
          tooltip: 'Quantum Field Generator',
          opensModal: 'field-stabilization'
        },
        {
          id: 'escape-portal',
          x: 300, y: 400, width: 200, height: 100,
          tooltip: 'Temporal Escape Portal',
          requiresItem: 'stabilized-field',
          unlocks: 'game-complete'
        }
      ],
      objectives: ['Stabilize the time crystal', 'Solve the temporal equation', 'Activate the escape portal']
    }
  };

  // Modal content definitions
  const modalContent: Record<string, ModalContent> = {
    'wave-function': {
      id: 'wave-function',
      title: 'Wave Function Analysis',
      content: (
        <div>
          <p className="mb-4">The quantum computer displays a wave function - a mathematical description of a quantum system's state.</p>
          <div className="bg-blue-800 p-4 rounded mb-4">
            <div className="text-center text-2xl mb-2">ψ(x) = A·sin(kx)</div>
            <p className="text-sm">Wave function showing particle probability distribution</p>
          </div>
          <p>In quantum mechanics, particles exist in superposition - they can be in multiple states simultaneously until observed!</p>
        </div>
      ),
      completesObjective: 'wave-particle-duality',
      xpReward: 50,
      skillReward: 2
    },
    'research-notes': {
      id: 'research-notes',
      title: "Dr. Quantum's Research Notes",
      content: (
        <div>
          <p className="mb-4">Entry #47: "The time-lock experiment uses quantum superposition to exist in multiple temporal states."</p>
          <p className="mb-4">"If something goes wrong, the key to the Entanglement Chamber will be needed to reverse the process."</p>
          <div className="bg-green-800 p-3 rounded">
            <p className="font-bold">🔑 Lab Key acquired!</p>
            <p className="text-sm">Use this to access the Entanglement Chamber</p>
          </div>
        </div>
      ),
      completesObjective: 'find-lab-key',
      xpReward: 30,
      givesItem: { id: 'lab-key', name: 'Lab Key', emoji: '🔑', description: 'Key to the Entanglement Chamber' }
    },
    'double-slit': {
      id: 'double-slit',
      title: 'Double-Slit Experiment',
      content: (
        <div>
          <p className="mb-4">This famous experiment shows wave-particle duality:</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800 p-3 rounded">
              <h4 className="font-bold">With Observation</h4>
              <p className="text-sm">Particles behave like particles (two bands)</p>
            </div>
            <div className="bg-blue-800 p-3 rounded">
              <h4 className="font-bold">Without Observation</h4>
              <p className="text-sm">Particles behave like waves (interference pattern)</p>
            </div>
          </div>
          <p>Observation changes quantum behavior - this is key to understanding Dr. Quantum's time-lock!</p>
        </div>
      ),
      completesObjective: 'understand-superposition',
      xpReward: 40,
      skillReward: 3
    },
    'entanglement-puzzle': {
      id: 'entanglement-puzzle',
      title: 'Quantum Entanglement Experiment',
      content: (
        <div>
          <p className="mb-4">Two particles are quantum entangled - measuring one instantly affects the other!</p>
          <div className="bg-teal-800 p-4 rounded mb-4">
            <h4 className="font-bold mb-2">Entanglement Properties:</h4>
            <ul className="text-sm space-y-1">
              <li>• Particles share quantum states</li>
              <li>• Measurement affects both particles</li>
              <li>• "Spooky action at a distance" - Einstein</li>
              <li>• Foundation of quantum computing</li>
            </ul>
          </div>
          <p>Successfully pair the entangled particles to unlock the next chamber!</p>
        </div>
      ),
      completesObjective: 'understand-entanglement',
      xpReward: 60,
      skillReward: 3,
      givesItem: { id: 'entanglement-key', name: 'Entanglement Key', emoji: '🌀', description: 'Key to the Cryptography Vault' }
    },
    'detector-readings': {
      id: 'detector-readings',
      title: 'Quantum State Measurements',
      content: (
        <div>
          <p className="mb-4">The detector shows quantum measurement results:</p>
          <div className="bg-cyan-800 p-4 rounded mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Particle A:</strong><br/>
                State: |↑⟩ (Spin Up)<br/>
                Probability: 100%
              </div>
              <div>
                <strong>Particle B:</strong><br/>
                State: |↓⟩ (Spin Down)<br/>
                Probability: 100%
              </div>
            </div>
          </div>
          <p>Perfect correlation! The entangled particles always have opposite spins when measured.</p>
        </div>
      ),
      completesObjective: 'particle-pairing',
      xpReward: 40,
      skillReward: 2
    },
    'key-distribution': {
      id: 'key-distribution',
      title: 'Quantum Key Distribution',
      content: (
        <div>
          <p className="mb-4">Quantum cryptography uses quantum mechanics to create unbreakable encryption keys.</p>
          <div className="bg-orange-800 p-4 rounded mb-4">
            <h4 className="font-bold mb-2">How it works:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Alice sends quantum states to Bob</li>
              <li>Any eavesdropping changes the quantum states</li>
              <li>Alice and Bob can detect tampering</li>
              <li>Secure key is established</li>
            </ol>
          </div>
          <p>This technology protects financial transactions and government communications today!</p>
        </div>
      ),
      completesObjective: 'learn-key-distribution',
      xpReward: 70,
      skillReward: 4
    },
    'quantum-cipher': {
      id: 'quantum-cipher',
      title: 'Encrypted Message Analysis',
      content: (
        <div>
          <p className="mb-4">Analyzing the quantum-encrypted message...</p>
          <div className="bg-red-800 p-4 rounded mb-4 font-mono text-sm">
            01001000 01100101 01101100 01110000<br/>
            ψ₁⟨0|1⟩ ψ₂⟨1|0⟩ ψ₃⟨+|-⟩ ψ₄⟨-|+⟩<br/>
            [QUANTUM DECRYPTION COMPLETE]<br/>
            Message: "TIMELOCK CORE ACCESS REQUIRED"
          </div>
          <p>The message reveals the location of the temporal core! You need special access credentials.</p>
        </div>
      ),
      completesObjective: 'decode-message',
      xpReward: 80,
      skillReward: 4,
      givesItem: { id: 'cipher-key', name: 'Cipher Key', emoji: '🔐', description: 'Decoded quantum cipher key' }
    },
    'security-access': {
      id: 'security-access',
      title: 'Security Terminal Access',
      content: (
        <div>
          <p className="mb-4">Using the cipher key to access the security terminal...</p>
          <div className="bg-yellow-800 p-4 rounded mb-4">
            <p className="font-bold">ACCESS GRANTED</p>
            <p className="text-sm mt-2">Generating temporal access card...</p>
            <div className="mt-3 p-2 bg-yellow-900 rounded text-xs font-mono">
              ID: TEMPORAL_ACCESS_001<br/>
              CLEARANCE: LEVEL_QUANTUM<br/>
              VALID_FOR: TIME_LOCK_CORE
            </div>
          </div>
          <p>Access card generated! You can now enter the Time-Lock Core chamber.</p>
        </div>
      ),
      completesObjective: 'access-timelock',
      xpReward: 60,
      skillReward: 3,
      givesItem: { id: 'access-card', name: 'Access Card', emoji: '💳', description: 'Temporal access credentials' }
    },
    'time-stabilization': {
      id: 'time-stabilization',
      title: 'Temporal Crystal Analysis',
      content: (
        <div>
          <p className="mb-4">The time crystal is oscillating wildly! You need to stabilize its quantum frequency.</p>
          <div className="bg-pink-800 p-4 rounded mb-4">
            <h4 className="font-bold mb-2">Crystal Status:</h4>
            <div className="text-sm space-y-1">
              <div>Frequency: 432.7 THz (UNSTABLE)</div>
              <div>Amplitude: ±8.3 (CRITICAL)</div>
              <div>Phase: 147° (OUT OF SYNC)</div>
            </div>
            <div className="mt-3 p-2 bg-pink-900 rounded">
              <p className="text-xs">Applying quantum stabilization field...</p>
            </div>
          </div>
          <p>Stabilization successful! The crystal is now in harmony with the temporal field.</p>
        </div>
      ),
      completesObjective: 'stabilize-crystal',
      xpReward: 90,
      skillReward: 5
    },
    'final-puzzle': {
      id: 'final-puzzle',
      title: 'Temporal Equation Solver',
      content: (
        <div>
          <p className="mb-4">Solve the temporal stability equation to unlock the escape portal:</p>
          <div className="bg-purple-800 p-4 rounded mb-4">
            <div className="text-center text-lg mb-3">Δt = ħ/(2ΔE)</div>
            <p className="text-sm mb-2">Where:</p>
            <ul className="text-xs space-y-1">
              <li>Δt = temporal uncertainty</li>
              <li>ħ = reduced Planck constant</li>
              <li>ΔE = energy uncertainty</li>
            </ul>
          </div>
          <div className="bg-green-800 p-3 rounded">
            <p className="font-bold">Solution Verified!</p>
            <p className="text-sm">Heisenberg uncertainty principle applied to time-energy relationship</p>
          </div>
        </div>
      ),
      completesObjective: 'solve-equation',
      xpReward: 100,
      skillReward: 6
    },
    'field-stabilization': {
      id: 'field-stabilization',
      title: 'Quantum Field Generator',
      content: (
        <div>
          <p className="mb-4">Activating the quantum field stabilization sequence...</p>
          <div className="bg-red-800 p-4 rounded mb-4">
            <div className="text-sm space-y-2">
              <div>Phase 1: Particle alignment ✓</div>
              <div>Phase 2: Wave function collapse ✓</div>
              <div>Phase 3: Temporal synchronization ✓</div>
              <div>Phase 4: Field stabilization ✓</div>
            </div>
          </div>
          <div className="bg-green-800 p-3 rounded">
            <p className="font-bold">Field Stabilized Successfully!</p>
            <p className="text-sm">The temporal escape portal is now accessible</p>
          </div>
        </div>
      ),
      completesObjective: 'activate-portal',
      xpReward: 120,
      skillReward: 7,
      givesItem: { id: 'stabilized-field', name: 'Stabilized Field', emoji: '⚡', description: 'Stable quantum field energy' }
    }
  };

  // Handle hotspot clicks
  const handleHotspotClick = (hotspot: Hotspot) => {
    // Check if item is required
    if (hotspot.requiresItem && !inventory.some(item => item.id === hotspot.requiresItem)) {
      return; // Can't interact without required item
    }

    // Handle room unlocking
    if (hotspot.unlocks) {
      if (hotspot.unlocks === 'game-complete') {
        setGamePhase('complete');
        addXP(200);
        updateSkillProgress('quantum', 10);
        return;
      }
      if (hotspot.unlocks.endsWith('-room')) {
        const roomName = hotspot.unlocks.replace('-room', '') as RoomType;
        setCurrentRoom(roomName);
        return;
      }
    }

    // Give item if specified
    if (hotspot.givesItem && !inventory.some(item => item.id === hotspot.givesItem!.id)) {
      setInventory(prev => [...prev, hotspot.givesItem!]);
    }

    // Open modal if specified
    if (hotspot.opensModal) {
      setShowModal(hotspot.opensModal);
    }
  };

  // Handle modal completion
  const handleModalComplete = (modalId: string) => {
    const modal = modalContent[modalId];
    if (modal) {
      if (modal.completesObjective) {
        setCompletedObjectives(prev => new Set([...prev, modal.completesObjective!]));
      }
      if (modal.xpReward) {
        addXP(modal.xpReward);
      }
      if (modal.skillReward) {
        addSkillPoints('quantum', modal.skillReward);
      }
      if (modal.givesItem && !inventory.some(item => item.id === modal.givesItem!.id)) {
        setInventory(prev => [...prev, modal.givesItem!]);
      }
    }
    setShowModal(null);
  };

  // Story introduction
  const storyText = [
    "You are Alex, a curious student visiting Dr. Quantum's laboratory.",
    "Suddenly, alarms blare! The time-lock experiment has malfunctioned!",
    "Reality is becoming unstable. You must learn quantum physics to escape!",
    "Use your knowledge of quantum mechanics to solve puzzles and fix the time-lock.",
    "Click on objects to investigate. Collect items and solve quantum mysteries!"
  ];

  if (gamePhase === 'intro') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <motion.div
          className="max-w-2xl mx-auto text-center text-white p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-6">Dr. Quantum's Time-Lock Laboratory</h1>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={storyProgress}
              className="mb-8 min-h-[100px] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg leading-relaxed">{storyText[storyProgress]}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4">
            {storyProgress > 0 && (
              <button
                onClick={() => setStoryProgress(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            
            {storyProgress < storyText.length - 1 ? (
              <button
                onClick={() => setStoryProgress(prev => prev + 1)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setGamePhase('playing')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-lg font-semibold transition-colors"
              >
                Begin Your Escape!
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (gamePhase === 'complete') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <motion.div
          className="max-w-2xl mx-auto text-center text-white p-8"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1 className="text-5xl font-bold mb-6">🎉 Escape Successful!</h1>
          <p className="text-xl mb-6">
            Congratulations! You've mastered quantum mechanics and escaped Dr. Quantum's time-lock laboratory!
          </p>
          <div className="bg-green-800 bg-opacity-50 p-6 rounded-xl mb-6">
            <h2 className="text-2xl font-bold mb-4">What You Learned:</h2>
            <ul className="text-left space-y-2">
              <li>• Wave-particle duality and superposition</li>
              <li>• Quantum entanglement and measurement</li>
              <li>• Quantum cryptography and key distribution</li>
              <li>• Temporal mechanics and field stabilization</li>
            </ul>
          </div>
          <button
            onClick={() => {
              setGamePhase('intro');
              setCurrentRoom('lab');
              setInventory([]);
              setCompletedObjectives(new Set());
              setStoryProgress(0);
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-lg font-semibold transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  const currentRoomData = rooms[currentRoom];

  return (
    <div className={`relative w-full h-screen ${currentRoomData.background} overflow-hidden`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
        <div className="flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold">{currentRoomData.title}</h1>
            <p className="text-sm text-gray-300">{currentRoomData.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm">
              Objectives: {completedObjectives.size}/{currentRoomData.objectives.length}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="absolute top-20 right-4 z-10 bg-black bg-opacity-50 rounded-lg p-3 min-w-[200px]">
        <h3 className="text-white font-bold mb-2">Inventory</h3>
        <div className="space-y-1">
          {inventory.length === 0 ? (
            <p className="text-gray-400 text-sm">No items</p>
          ) : (
            inventory.map(item => (
              <div key={item.id} className="flex items-center gap-2 text-white text-sm" title={item.description}>
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Room Scene */}
      <div className="relative w-full h-full pt-16">
        {/* Room Hotspots */}
        {currentRoomData.hotspots.map(hotspot => {
          const canInteract = !hotspot.requiresItem || inventory.some(item => item.id === hotspot.requiresItem);
          
          return (
            <motion.div
              key={hotspot.id}
              className={`absolute border-2 border-dashed transition-all cursor-pointer ${
                canInteract ? 'border-cyan-400 hover:bg-cyan-400 hover:bg-opacity-20' : 'border-gray-600 cursor-not-allowed opacity-50'
              }`}
              style={{
                left: hotspot.x,
                top: hotspot.y,
                width: hotspot.width,
                height: hotspot.height,
              }}
              whileHover={canInteract ? { scale: 1.05 } : {}}
              whileTap={canInteract ? { scale: 0.95 } : {}}
              onClick={() => canInteract && handleHotspotClick(hotspot)}
              title={hotspot.tooltip}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {hotspot.tooltip}
                {hotspot.requiresItem && !canInteract && (
                  <div className="text-red-400">(Requires: {hotspot.requiresItem})</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Objectives Panel */}
      <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-50 rounded-lg p-3 max-w-md">
        <h3 className="text-white font-bold mb-2">Current Objectives:</h3>
        <ul className="space-y-1">
          {currentRoomData.objectives.map((objective, index) => (
            <li key={index} className={`text-sm flex items-center gap-2 ${
              completedObjectives.has(objective.toLowerCase().replace(/\s+/g, '-')) 
                ? 'text-green-400' 
                : 'text-gray-300'
            }`}>
              <span>{completedObjectives.has(objective.toLowerCase().replace(/\s+/g, '-')) ? '✓' : '○'}</span>
              {objective}
            </li>
          ))}
        </ul>
      </div>

      {/* Room Navigation */}
      <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 rounded-lg p-3">
        <h3 className="text-white font-bold mb-2 text-sm">Rooms:</h3>
        <div className="flex gap-2">
          {Object.keys(rooms).map(roomKey => {
            const room = roomKey as RoomType;
            const isAccessible = room === 'lab' || 
              (room === 'entanglement' && inventory.some(item => item.id === 'lab-key')) ||
              (room === 'cryptography' && inventory.some(item => item.id === 'entanglement-key')) ||
              (room === 'timelock' && inventory.some(item => item.id === 'access-card'));
            
            return (
              <button
                key={room}
                onClick={() => isAccessible && setCurrentRoom(room)}
                className={`w-3 h-3 rounded-full ${
                  currentRoom === room ? 'bg-cyan-400' :
                  isAccessible ? 'bg-gray-400 hover:bg-gray-300' : 'bg-gray-700'
                } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                disabled={!isAccessible}
                title={rooms[room].title}
              />
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && modalContent[showModal] && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl max-w-2xl w-full border border-purple-500 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{modalContent[showModal].title}</h2>
                <button
                  onClick={() => handleModalComplete(showModal)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="text-gray-100 mb-6">
                {modalContent[showModal].content}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {modalContent[showModal].xpReward && (
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm text-white">
                      +{modalContent[showModal].xpReward} XP
                    </span>
                  )}
                  {modalContent[showModal].skillReward && (
                    <span className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white">
                      +{modalContent[showModal].skillReward} Quantum
                    </span>
                  )}
                  {modalContent[showModal].givesItem && (
                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm text-white">
                      +{modalContent[showModal].givesItem?.emoji} {modalContent[showModal].givesItem?.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleModalComplete(showModal)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantumEscapeRoom;
