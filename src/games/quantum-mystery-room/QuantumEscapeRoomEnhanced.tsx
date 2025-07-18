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

// Interactive object type with visual properties
interface InteractiveObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tooltip: string;
  requiresItem?: string;
  givesItem?: InventoryItem;
  opensModal?: string;
  unlocks?: string;
  svgPath?: string;
  color?: string;
  glowColor?: string;
  isDiscovered?: boolean;
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

// Room visual components
const LabScene: React.FC<{ onObjectClick: (obj: InteractiveObject) => void; objects: InteractiveObject[] }> = ({ onObjectClick, objects }) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      {/* Room Background */}
      <defs>
        <linearGradient id="labGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <pattern id="gridPattern" patternUnits="userSpaceOnUse" width="40" height="40">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      
      {/* Floor */}
      <rect width="800" height="600" fill="url(#labGradient)" />
      <rect width="800" height="600" fill="url(#gridPattern)" />
      
      {/* Laboratory Bench */}
      <rect x="50" y="400" width="700" height="100" fill="#374151" stroke="#6b7280" strokeWidth="2" rx="5" />
      <rect x="60" y="410" width="680" height="20" fill="#4b5563" rx="2" />
      
      {/* Back Wall */}
      <rect x="0" y="0" width="800" height="300" fill="#1f2937" opacity="0.8" />
      
      {/* Laboratory Equipment */}
      {objects.map((obj) => {
        switch(obj.id) {
          case 'quantum-computer':
            return (
              <g key={obj.id}>
                {/* Computer Base */}
                <rect x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                      fill="#1f2937" stroke={obj.isDiscovered ? "#10b981" : "#3b82f6"} 
                      strokeWidth="2" rx="5" className="cursor-pointer" 
                      onClick={() => onObjectClick(obj)} />
                {/* Screen */}
                <rect x={obj.x + 10} y={obj.y + 10} width={obj.width - 20} height={obj.height - 30} 
                      fill="#000" stroke="#3b82f6" strokeWidth="1" rx="3" />
                {/* Wave Function Display */}
                <motion.path
                  d={`M ${obj.x + 15} ${obj.y + 35} Q ${obj.x + 35} ${obj.y + 20} ${obj.x + 55} ${obj.y + 35} T ${obj.x + 95} ${obj.y + 35}`}
                  stroke="#10b981" strokeWidth="2" fill="none"
                  animate={{ strokeDasharray: ["0,100", "100,0"], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Status Light */}
                <motion.circle cx={obj.x + obj.width - 15} cy={obj.y + 15} r="4" 
                               fill="#10b981" animate={{ opacity: [0.5, 1, 0.5] }} 
                               transition={{ duration: 1, repeat: Infinity }} />
              </g>
            );
            
          case 'research-notebook':
            return (
              <g key={obj.id}>
                {/* Notebook */}
                <rect x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                      fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" rx="3" 
                      className="cursor-pointer" onClick={() => onObjectClick(obj)} />
                {/* Lines */}
                {[...Array(5)].map((_, i) => (
                  <line key={i} x1={obj.x + 5} y1={obj.y + 10 + i * 8} 
                        x2={obj.x + obj.width - 5} y2={obj.y + 10 + i * 8} 
                        stroke="#9ca3af" strokeWidth="1" />
                ))}
                {/* Equations */}
                <text x={obj.x + 10} y={obj.y + 20} fontSize="8" fill="#374151">ψ = ∑ aₙ|n⟩</text>
                <text x={obj.x + 10} y={obj.y + 30} fontSize="8" fill="#374151">Δt·ΔE ≥ ħ/2</text>
              </g>
            );
            
          case 'double-slit-apparatus':
            return (
              <g key={obj.id}>
                {/* Apparatus Base */}
                <rect x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                      fill="#374151" stroke="#6b7280" strokeWidth="2" rx="5" 
                      className="cursor-pointer" onClick={() => onObjectClick(obj)} />
                {/* Laser Source */}
                <circle cx={obj.x + 20} cy={obj.y + obj.height/2} r="8" fill="#ef4444" />
                <motion.line x1={obj.x + 28} y1={obj.y + obj.height/2} 
                           x2={obj.x + 60} y2={obj.y + obj.height/2} 
                           stroke="#ef4444" strokeWidth="2"
                           animate={{ opacity: [0.5, 1, 0.5] }}
                           transition={{ duration: 0.5, repeat: Infinity }} />
                {/* Double Slit */}
                <rect x={obj.x + 60} y={obj.y + 20} width="4" height="40" fill="#1f2937" />
                <rect x={obj.x + 60} y={obj.y + 25} width="4" height="5" fill="#374151" />
                <rect x={obj.x + 60} y={obj.y + 35} width="4" height="5" fill="#374151" />
                {/* Detection Screen */}
                <rect x={obj.x + 80} y={obj.y + 10} width="15" height="60" fill="#f3f4f6" stroke="#6b7280" />
                {/* Interference Pattern */}
                <motion.g animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  {[...Array(5)].map((_, i) => (
                    <rect key={i} x={obj.x + 82} y={obj.y + 15 + i * 10} width="11" height="2" 
                          fill="#3b82f6" opacity={i % 2 === 0 ? 0.8 : 0.3} />
                  ))}
                </motion.g>
              </g>
            );
            
          case 'chamber-door':
            return (
              <g key={obj.id}>
                {/* Door Frame */}
                <rect x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                      fill="#374151" stroke="#6b7280" strokeWidth="3" rx="5" 
                      className="cursor-pointer" onClick={() => onObjectClick(obj)} />
                {/* Door Panel */}
                <rect x={obj.x + 5} y={obj.y + 5} width={obj.width - 10} height={obj.height - 10} 
                      fill="#1f2937" rx="3" />
                {/* Lock Mechanism */}
                <circle cx={obj.x + obj.width - 20} cy={obj.y + obj.height/2} r="8" 
                        fill={obj.requiresItem ? "#ef4444" : "#10b981"} />
                <text x={obj.x + obj.width - 25} y={obj.y + obj.height/2 + 3} fontSize="10" fill="#fff">
                  {obj.requiresItem ? "🔒" : "🔓"}
                </text>
                {/* Door Label */}
                <text x={obj.x + obj.width/2} y={obj.y + 30} fontSize="12" fill="#9ca3af" textAnchor="middle">
                  ENTANGLEMENT
                </text>
                <text x={obj.x + obj.width/2} y={obj.y + 45} fontSize="12" fill="#9ca3af" textAnchor="middle">
                  CHAMBER
                </text>
              </g>
            );
            
          default:
            return (
              <rect key={obj.id} x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                    fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" 
                    strokeDasharray="5,5" rx="3" className="cursor-pointer" 
                    onClick={() => onObjectClick(obj)} />
            );
        }
      })}
      
      {/* Floating Particles Effect */}
      <motion.g animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
        {[...Array(20)].map((_, i) => (
          <motion.circle key={i} 
                         cx={50 + (i * 35)} cy={100 + Math.sin(i) * 50} r="2" 
                         fill="#3b82f6" opacity="0.5"
                         animate={{ 
                           y: [0, -10, 0],
                           opacity: [0.3, 0.8, 0.3]
                         }}
                         transition={{ 
                           duration: 2 + i * 0.2, 
                           repeat: Infinity,
                           delay: i * 0.1 
                         }} />
        ))}
      </motion.g>
    </svg>
  );
};

const EntanglementScene: React.FC<{ onObjectClick: (obj: InteractiveObject) => void; objects: InteractiveObject[] }> = ({ onObjectClick, objects }) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        <linearGradient id="entanglementGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      <rect width="800" height="600" fill="url(#entanglementGradient)" />
      
      {/* Entanglement Beam */}
      <motion.line x1="150" y1="300" x2="650" y2="300" 
                   stroke="#10b981" strokeWidth="4" opacity="0.6"
                   animate={{ strokeDasharray: ["0,20", "20,0"] }}
                   transition={{ duration: 1, repeat: Infinity }} />
      
      {objects.map((obj) => {
        switch(obj.id) {
          case 'particle-generator-a':
            return (
              <g key={obj.id}>
                <rect x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                      fill="#1f2937" stroke="#10b981" strokeWidth="2" rx="5" 
                      className="cursor-pointer" onClick={() => onObjectClick(obj)} />
                <motion.circle cx={obj.x + obj.width/2} cy={obj.y + obj.height/2} r="15" 
                               fill="url(#particleGlow)"
                               animate={{ scale: [0.8, 1.2, 0.8] }}
                               transition={{ duration: 1, repeat: Infinity }} />
                <text x={obj.x + obj.width/2} y={obj.y - 10} fontSize="10" fill="#10b981" textAnchor="middle">
                  PARTICLE A
                </text>
              </g>
            );
          case 'particle-generator-b':
            return (
              <g key={obj.id}>
                <rect x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                      fill="#1f2937" stroke="#10b981" strokeWidth="2" rx="5" 
                      className="cursor-pointer" onClick={() => onObjectClick(obj)} />
                <motion.circle cx={obj.x + obj.width/2} cy={obj.y + obj.height/2} r="15" 
                               fill="url(#particleGlow)"
                               animate={{ scale: [1.2, 0.8, 1.2] }}
                               transition={{ duration: 1, repeat: Infinity }} />
                <text x={obj.x + obj.width/2} y={obj.y - 10} fontSize="10" fill="#10b981" textAnchor="middle">
                  PARTICLE B
                </text>
              </g>
            );
          default:
            return (
              <rect key={obj.id} x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
                    fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" 
                    strokeDasharray="5,5" rx="3" className="cursor-pointer" 
                    onClick={() => onObjectClick(obj)} />
            );
        }
      })}
    </svg>
  );
};

const CryptographyScene: React.FC<{ onObjectClick: (obj: InteractiveObject) => void; objects: InteractiveObject[] }> = ({ onObjectClick, objects }) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        <linearGradient id="cryptoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>
      
      <rect width="800" height="600" fill="url(#cryptoGradient)" />
      
      {/* Matrix Effect Background */}
      <motion.g animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
        {[...Array(50)].map((_, i) => (
          <text key={i} x={i * 16} y={Math.random() * 600} fontSize="10" fill="#22c55e" opacity="0.3">
            {Math.random() > 0.5 ? '1' : '0'}
          </text>
        ))}
      </motion.g>
      
      {objects.map((obj) => (
        <rect key={obj.id} x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
              fill="rgba(234, 88, 12, 0.3)" stroke="#ea580c" strokeWidth="2" 
              strokeDasharray="5,5" rx="3" className="cursor-pointer" 
              onClick={() => onObjectClick(obj)} />
      ))}
    </svg>
  );
};

const TimeLockScene: React.FC<{ onObjectClick: (obj: InteractiveObject) => void; objects: InteractiveObject[] }> = ({ onObjectClick, objects }) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        <radialGradient id="temporalGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
        <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      <rect width="800" height="600" fill="url(#temporalGradient)" />
      
      {/* Central Crystal */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
        <polygon points="400,200 450,250 400,300 350,250" fill="url(#crystalGlow)" stroke="#a855f7" strokeWidth="2" />
      </motion.g>
      
      {/* Energy Rings */}
      {[...Array(3)].map((_, i) => (
        <motion.circle key={i} cx="400" cy="250" r={100 + i * 50} 
                       stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.4"
                       animate={{ scale: [1, 1.1, 1] }}
                       transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
      ))}
      
      {objects.map((obj) => (
        <rect key={obj.id} x={obj.x} y={obj.y} width={obj.width} height={obj.height} 
              fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="2" 
              strokeDasharray="5,5" rx="3" className="cursor-pointer" 
              onClick={() => onObjectClick(obj)} />
      ))}
    </svg>
  );
};

const QuantumEscapeRoomEnhanced: React.FC = () => {
  const { addXP, updateSkillProgress } = useGameStore();
  
  // Game state
  const [currentRoom, setCurrentRoom] = useState<RoomType>('lab');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(new Set());
  const [discoveredObjects, setDiscoveredObjects] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [storyProgress, setStoryProgress] = useState(0);

  // Room definitions with enhanced visual objects
  const rooms: Record<RoomType, { 
    title: string; 
    description: string; 
    objects: InteractiveObject[];
    objectives: string[];
    SceneComponent: React.FC<{ onObjectClick: (obj: InteractiveObject) => void; objects: InteractiveObject[] }>;
  }> = {
    lab: {
      title: "Dr. Quantum's Laboratory",
      description: "A cutting-edge quantum physics laboratory where reality itself seems unstable. Find clues about quantum mechanics to escape.",
      SceneComponent: LabScene,
      objects: [
        {
          id: 'quantum-computer',
          name: 'Quantum Computer',
          x: 100, y: 150, width: 120, height: 80,
          tooltip: 'Advanced quantum computer displaying wave function data',
          opensModal: 'wave-function',
          color: '#3b82f6',
          glowColor: '#10b981'
        },
        {
          id: 'research-notebook',
          name: "Dr. Quantum's Research Notes",
          x: 300, y: 420, width: 60, height: 40,
          tooltip: "Dr. Quantum's personal research notebook",
          opensModal: 'research-notes',
          givesItem: { id: 'lab-key', name: 'Lab Key', emoji: '🔑', description: 'Key to the Entanglement Chamber' }
        },
        {
          id: 'double-slit-apparatus',
          name: 'Double-slit Experiment',
          x: 500, y: 180, width: 120, height: 80,
          tooltip: 'Famous double-slit experiment demonstrating wave-particle duality',
          opensModal: 'double-slit'
        },
        {
          id: 'chamber-door',
          name: 'Chamber Door',
          x: 650, y: 100, width: 80, height: 150,
          tooltip: 'Secure door to the Entanglement Chamber',
          requiresItem: 'lab-key',
          unlocks: 'entanglement-room'
        }
      ],
      objectives: ['Understand wave-particle duality', 'Find the lab access key', 'Learn about quantum superposition']
    },
    entanglement: {
      title: "Quantum Entanglement Chamber",
      description: "A specialized chamber for quantum entanglement experiments. Spooky action at a distance awaits!",
      SceneComponent: EntanglementScene,
      objects: [
        {
          id: 'particle-generator-a',
          name: 'Particle Generator A',
          x: 100, y: 250, width: 60, height: 60,
          tooltip: 'Generates entangled particles with specific quantum states',
          opensModal: 'entanglement-experiment'
        },
        {
          id: 'particle-generator-b',
          name: 'Particle Generator B',
          x: 640, y: 250, width: 60, height: 60,
          tooltip: 'Partner generator - measurements here affect Generator A instantly',
          opensModal: 'entanglement-correlation'
        },
        {
          id: 'detector-array',
          name: 'Quantum Detector Array',
          x: 350, y: 350, width: 100, height: 60,
          tooltip: 'Measures quantum states and correlations',
          opensModal: 'quantum-measurement'
        },
        {
          id: 'crypto-door',
          name: 'Cryptography Vault Door',
          x: 350, y: 500, width: 100, height: 80,
          tooltip: 'Door to the Quantum Cryptography Vault',
          requiresItem: 'entanglement-key',
          unlocks: 'crypto-room'
        }
      ],
      objectives: ['Master quantum entanglement', 'Understand measurement correlations', 'Unlock the cryptography vault']
    },
    cryptography: {
      title: "Quantum Cryptography Vault",
      description: "The most secure vault in existence, protected by quantum cryptography protocols.",
      SceneComponent: CryptographyScene,
      objects: [
        {
          id: 'quantum-key-generator',
          name: 'Quantum Key Generator',
          x: 150, y: 200, width: 100, height: 80,
          tooltip: 'Generates unbreakable quantum encryption keys',
          opensModal: 'quantum-key-distribution'
        },
        {
          id: 'encrypted-terminal',
          name: 'Encrypted Terminal',
          x: 400, y: 250, width: 120, height: 100,
          tooltip: 'Terminal displaying quantum-encrypted messages',
          opensModal: 'quantum-decryption'
        },
        {
          id: 'timelock-door',
          name: 'Temporal Lock Door',
          x: 600, y: 400, width: 100, height: 120,
          tooltip: 'Final door secured with temporal quantum locks',
          requiresItem: 'crypto-key',
          unlocks: 'timelock-room'
        }
      ],
      objectives: ['Learn quantum cryptography', 'Decrypt the quantum message', 'Access the temporal core']
    },
    timelock: {
      title: "Temporal Core Chamber",
      description: "The heart of the time-lock device. Reality bends around the temporal stabilization crystal.",
      SceneComponent: TimeLockScene,
      objects: [
        {
          id: 'temporal-crystal',
          name: 'Temporal Stabilization Crystal',
          x: 350, y: 200, width: 100, height: 100,
          tooltip: 'Unstable temporal crystal causing reality distortions',
          opensModal: 'crystal-stabilization'
        },
        {
          id: 'control-console',
          name: 'Temporal Control Console',
          x: 200, y: 450, width: 150, height: 80,
          tooltip: 'Advanced controls for temporal field manipulation',
          opensModal: 'temporal-controls'
        },
        {
          id: 'escape-portal',
          name: 'Escape Portal',
          x: 500, y: 500, width: 120, height: 80,
          tooltip: 'Temporal escape portal - your way home!',
          requiresItem: 'stabilized-field',
          unlocks: 'game-complete'
        }
      ],
      objectives: ['Stabilize the temporal crystal', 'Master temporal controls', 'Activate the escape portal']
    }
  };

  // Enhanced modal content with detailed quantum physics explanations
  const modalContent: Record<string, ModalContent> = {
    'wave-function': {
      id: 'wave-function',
      title: 'Quantum Wave Function Analysis',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">🌊 What is a Wave Function?</h4>
            <p className="text-sm mb-3">A wave function (ψ) describes all possible states of a quantum particle. It's like a probability map showing where the particle might be!</p>
            <div className="bg-blue-900/50 p-3 rounded text-center">
              <div className="text-xl mb-2">ψ(x,t) = A·e^(i(kx-ωt))</div>
              <p className="text-xs">A complete quantum state description</p>
            </div>
          </div>
          <div className="bg-purple-800/50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">🎯 Key Concept: Superposition</h4>
            <p className="text-sm">Unlike classical objects, quantum particles can be in multiple states simultaneously until measured. This is called superposition!</p>
          </div>
          <div className="bg-green-800/50 p-3 rounded-lg">
            <p className="text-sm">🔬 <strong>Real Application:</strong> Quantum computers use superposition to process multiple calculations at once, making them incredibly powerful for certain problems!</p>
          </div>
        </div>
      ),
      completesObjective: 'wave-particle-duality',
      xpReward: 75,
      skillReward: 3
    },
    'research-notes': {
      id: 'research-notes',
      title: "Dr. Quantum's Research Journal",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-700 p-4 rounded-lg font-mono text-sm">
            <p className="text-yellow-300 mb-2">📝 Research Log Entry #847</p>
            <p className="mb-2">"The temporal stabilization experiment has exceeded all expectations. By creating a quantum superposition of time states, we've achieved localized temporal manipulation."</p>
            <p className="mb-2 text-red-300">"⚠️ WARNING: If the containment field fails, reality could become unstable. The emergency key to the Entanglement Chamber is hidden in my desk drawer."</p>
            <p className="text-cyan-300">"Remember: Quantum entanglement is the key to everything. What affects one particle instantly affects its partner, no matter the distance."</p>
          </div>
          <div className="bg-green-800/50 p-3 rounded-lg">
            <p className="font-bold text-green-300">🔑 Lab Key Found!</p>
            <p className="text-sm">You've discovered the key to the Entanglement Chamber. Dr. Quantum was always prepared for emergencies!</p>
          </div>
        </div>
      ),
      completesObjective: 'find-lab-key',
      xpReward: 50,
      givesItem: { id: 'lab-key', name: 'Lab Key', emoji: '🔑', description: 'Key to the Entanglement Chamber' }
    },
    'double-slit': {
      id: 'double-slit',
      title: 'The Double-Slit Experiment',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">🔬 The Most Important Experiment in Physics</h4>
            <p className="text-sm mb-3">This experiment shows that particles can behave like waves when no one is watching, but like particles when observed!</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-800/50 p-3 rounded-lg">
              <h5 className="font-bold text-blue-300 mb-2">📊 Without Observation</h5>
              <div className="text-xs space-y-1">
                <p>• Electron behaves like a wave</p>
                <p>• Creates interference pattern</p>
                <p>• Goes through both slits</p>
                <p>• Wave-like behavior</p>
              </div>
            </div>
            <div className="bg-red-800/50 p-3 rounded-lg">
              <h5 className="font-bold text-red-300 mb-2">👁️ With Observation</h5>
              <div className="text-xs space-y-1">
                <p>• Electron behaves like particle</p>
                <p>• Creates two distinct bands</p>
                <p>• Goes through one slit</p>
                <p>• Particle-like behavior</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-800/50 p-3 rounded-lg">
            <p className="text-sm">🤯 <strong>Mind-bending fact:</strong> The act of observation actually changes reality at the quantum level!</p>
          </div>
        </div>
      ),
      completesObjective: 'quantum-superposition',
      xpReward: 100,
      skillReward: 4
    },
    'entanglement-experiment': {
      id: 'entanglement-experiment',
      title: 'Quantum Entanglement Setup',
      content: (
        <div className="space-y-4">
          <div className="bg-green-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">🔗 Spooky Action at a Distance</h4>
            <p className="text-sm mb-3">Einstein called it "spooky action at a distance," but quantum entanglement is one of the most verified phenomena in physics!</p>
          </div>
          <div className="bg-teal-800/50 p-4 rounded-lg">
            <h5 className="font-bold mb-2">How it Works:</h5>
            <div className="text-sm space-y-2">
              <p>1. Two particles are created together in a special quantum state</p>
              <p>2. They become "entangled" - their properties are forever linked</p>
              <p>3. When you measure one particle, you instantly know about the other</p>
              <p>4. This happens faster than light could travel between them!</p>
            </div>
          </div>
          <div className="bg-blue-800/50 p-3 rounded-lg text-center">
            <p className="font-mono text-lg">|ψ⟩ = 1/√2(|↑↓⟩ - |↓↑⟩)</p>
            <p className="text-xs mt-1">Entangled state notation</p>
          </div>
          <div className="bg-red-800/50 p-3 rounded-lg">
            <p className="text-sm">🚀 <strong>Cool Fact:</strong> Quantum entanglement is the foundation of quantum teleportation and quantum communication!</p>
          </div>
        </div>
      ),
      completesObjective: 'quantum-entanglement',
      xpReward: 125,
      skillReward: 5,
      givesItem: { id: 'entanglement-key', name: 'Entanglement Key', emoji: '🔐', description: 'Key to the Cryptography Vault' }
    },
    'entanglement-correlation': {
      id: 'entanglement-correlation',
      title: 'Measuring Quantum Correlations',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">📊 Perfect Correlations</h4>
            <p className="text-sm mb-3">When particles are entangled, measuring one instantly determines the state of the other, no matter how far apart they are!</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-800/50 p-3 rounded-lg text-center">
              <h5 className="font-bold text-blue-300 mb-2">Particle A</h5>
              <div className="text-4xl mb-2">⬆️</div>
              <p className="text-xs">Measured: Spin UP</p>
            </div>
            <div className="bg-red-800/50 p-3 rounded-lg text-center">
              <h5 className="font-bold text-red-300 mb-2">Particle B</h5>
              <div className="text-4xl mb-2">⬇️</div>
              <p className="text-xs">Instantly: Spin DOWN</p>
            </div>
          </div>
          <div className="bg-yellow-800/50 p-3 rounded-lg">
            <p className="text-sm">⚡ <strong>Amazing:</strong> This correlation is stronger than anything possible in classical physics!</p>
          </div>
        </div>
      ),
      completesObjective: 'measurement-correlations',
      xpReward: 100,
      skillReward: 4
    },
    'quantum-measurement': {
      id: 'quantum-measurement',
      title: 'Quantum Measurement Theory',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">🎯 The Measurement Problem</h4>
            <p className="text-sm mb-3">In quantum mechanics, the act of measurement fundamentally changes the system being measured!</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h5 className="font-bold mb-2">Before Measurement:</h5>
            <div className="text-sm space-y-1">
              <p>• Particle exists in superposition</p>
              <p>• Multiple states simultaneously</p>
              <p>• Described by wave function</p>
              <p>• Probabilities, not certainties</p>
            </div>
          </div>
          <div className="bg-orange-800/50 p-4 rounded-lg">
            <h5 className="font-bold mb-2">After Measurement:</h5>
            <div className="text-sm space-y-1">
              <p>• Wave function "collapses"</p>
              <p>• Particle has definite state</p>
              <p>• Probability becomes reality</p>
              <p>• Information is gained</p>
            </div>
          </div>
          <div className="bg-green-800/50 p-3 rounded-lg">
            <p className="text-sm">🤔 <strong>Deep Question:</strong> What defines a measurement? This is still debated by physicists today!</p>
          </div>
        </div>
      ),
      completesObjective: 'measurement-theory',
      xpReward: 150,
      skillReward: 6
    },
    'quantum-key-distribution': {
      id: 'quantum-key-distribution',
      title: 'Quantum Key Distribution (QKD)',
      content: (
        <div className="space-y-4">
          <div className="bg-red-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">🔐 Unbreakable Encryption</h4>
            <p className="text-sm mb-3">Quantum Key Distribution uses the laws of physics to create perfectly secure communication!</p>
          </div>
          <div className="bg-blue-800/50 p-4 rounded-lg">
            <h5 className="font-bold mb-2">How QKD Works:</h5>
            <div className="text-sm space-y-2">
              <p>1. Alice sends quantum-encoded photons to Bob</p>
              <p>2. Each photon carries part of the encryption key</p>
              <p>3. Any eavesdropper disturbs the quantum states</p>
              <p>4. Alice and Bob can detect if someone was listening!</p>
            </div>
          </div>
          <div className="bg-purple-800/50 p-3 rounded-lg">
            <p className="text-sm">🛡️ <strong>Security Guarantee:</strong> If the quantum states are undisturbed, the communication is absolutely secure!</p>
          </div>
          <div className="bg-green-800/50 p-3 rounded-lg">
            <p className="text-sm">💡 <strong>Real World:</strong> QKD is already used by banks and governments for ultra-secure communications!</p>
          </div>
        </div>
      ),
      completesObjective: 'quantum-cryptography',
      xpReward: 175,
      skillReward: 7,
      givesItem: { id: 'crypto-key', name: 'Quantum Crypto Key', emoji: '🗝️', description: 'Key to the Temporal Core' }
    },
    'quantum-decryption': {
      id: 'quantum-decryption',
      title: 'Quantum Message Decryption',
      content: (
        <div className="space-y-4">
          <div className="bg-slate-700 p-4 rounded-lg font-mono text-sm">
            <p className="text-green-300 mb-2">🔓 QUANTUM ENCRYPTED MESSAGE DECODED:</p>
            <div className="bg-black p-3 rounded mb-3">
              <p className="text-cyan-300">"TEMPORAL CORE DESTABILIZING"</p>
              <p className="text-yellow-300">"REALITY BREACH IMMINENT"</p>
              <p className="text-red-300">"EMERGENCY PROTOCOL INITIATED"</p>
              <p className="text-white">"TIME REMAINING: 10 MINUTES"</p>
            </div>
            <p className="text-orange-300">Dr. Quantum's final message reveals the crisis!</p>
          </div>
          <div className="bg-red-900/50 p-4 rounded-lg">
            <h4 className="font-bold text-red-300 mb-2">⚠️ CRITICAL SITUATION</h4>
            <p className="text-sm">The temporal stabilization field is failing! You must reach the Temporal Core Chamber immediately to prevent a reality collapse!</p>
          </div>
          <div className="bg-blue-800/50 p-3 rounded-lg">
            <p className="text-sm">🔬 <strong>Physics Note:</strong> Temporal mechanics requires precise quantum field manipulation to maintain spacetime stability.</p>
          </div>
        </div>
      ),
      completesObjective: 'decrypt-quantum-message',
      xpReward: 125,
      skillReward: 5
    },
    'crystal-stabilization': {
      id: 'crystal-stabilization',
      title: 'Temporal Crystal Stabilization',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">💎 Temporal Mechanics</h4>
            <p className="text-sm mb-3">The crystal maintains temporal stability by creating a quantum superposition of time states!</p>
          </div>
          <div className="bg-red-800/50 p-4 rounded-lg">
            <h5 className="font-bold text-red-300 mb-2">⚠️ Current Status: UNSTABLE</h5>
            <div className="text-sm space-y-1">
              <p>• Temporal field oscillating wildly</p>
              <p>• Reality distortions increasing</p>
              <p>• Quantum decoherence detected</p>
              <p>• Time flow becoming irregular</p>
            </div>
          </div>
          <div className="bg-blue-800/50 p-4 rounded-lg">
            <h5 className="font-bold mb-2">Stabilization Process:</h5>
            <div className="text-sm space-y-2">
              <p>1. Apply quantum coherence field</p>
              <p>2. Synchronize temporal oscillations</p>
              <p>3. Lock quantum phase relationships</p>
              <p>4. Establish stable time flow</p>
            </div>
          </div>
          <div className="bg-green-800/50 p-3 rounded-lg">
            <p className="text-sm">✨ <strong>Success!</strong> Temporal field stabilized. Reality distortions contained!</p>
          </div>
        </div>
      ),
      completesObjective: 'crystal-stabilization',
      xpReward: 200,
      skillReward: 8,
      givesItem: { id: 'stabilized-field', name: 'Stabilized Temporal Field', emoji: '⚡', description: 'Stable temporal energy for escape portal' }
    },
    'temporal-controls': {
      id: 'temporal-controls',
      title: 'Temporal Field Controls',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-800/50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">⏰ Mastering Time</h4>
            <p className="text-sm mb-3">These advanced controls allow precise manipulation of temporal quantum fields!</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-800/50 p-2 rounded text-center">
              <div className="text-2xl mb-1">🔄</div>
              <p className="text-xs">Temporal Sync</p>
            </div>
            <div className="bg-purple-800/50 p-2 rounded text-center">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-xs">Field Strength</p>
            </div>
            <div className="bg-green-800/50 p-2 rounded text-center">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-xs">Phase Lock</p>
            </div>
          </div>
          <div className="bg-yellow-800/50 p-4 rounded-lg">
            <h5 className="font-bold mb-2">Control Sequence Activated:</h5>
            <div className="text-sm font-mono space-y-1">
              <p>► Initializing temporal synchronization...</p>
              <p>► Adjusting quantum field harmonics...</p>
              <p>► Establishing phase coherence...</p>
              <p className="text-green-300">► TEMPORAL FIELD STABLE ✓</p>
            </div>
          </div>
          <div className="bg-cyan-800/50 p-3 rounded-lg">
            <p className="text-sm">🚀 <strong>Achievement Unlocked:</strong> Temporal Engineer - You've mastered the manipulation of time itself!</p>
          </div>
        </div>
      ),
      completesObjective: 'temporal-controls',
      xpReward: 150,
      skillReward: 6
    }
  };

  // Handle object interactions
  const handleObjectClick = (obj: InteractiveObject) => {
    // Check if required item is present
    if (obj.requiresItem && !inventory.some(item => item.id === obj.requiresItem)) {
      return;
    }

    // Mark object as discovered
    setDiscoveredObjects(prev => new Set([...prev, obj.id]));

    // Handle room unlocking
    if (obj.unlocks) {
      if (obj.unlocks === 'game-complete') {
        setGamePhase('complete');
        addXP(200);
        updateSkillProgress('cryptography', 10);
        return;
      }
      if (obj.unlocks.endsWith('-room')) {
        const roomName = obj.unlocks.replace('-room', '') as RoomType;
        setCurrentRoom(roomName);
        return;
      }
    }

    // Give item if specified
    if (obj.givesItem && !inventory.some(item => item.id === obj.givesItem!.id)) {
      setInventory(prev => [...prev, obj.givesItem!]);
    }

    // Open modal if specified
    if (obj.opensModal) {
      setShowModal(obj.opensModal);
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
        updateSkillProgress('cryptography', modal.skillReward);
      }
      if (modal.givesItem && !inventory.some(item => item.id === modal.givesItem!.id)) {
        setInventory(prev => [...prev, modal.givesItem!]);
      }
    }
    setShowModal(null);
  };

  // Story introduction
  const storyText = [
    "You are Alex, a brilliant young student with a passion for quantum physics and cybersecurity.",
    "While visiting Dr. Quantum's cutting-edge laboratory, something goes terribly wrong...",
    "⚠️ ALARM: TEMPORAL CONTAINMENT BREACH ⚠️",
    "The experimental time-lock device has malfunctioned, creating dangerous reality distortions!",
    "You must use your knowledge of quantum mechanics to stabilize the device and escape safely.",
    "Click on objects in each room to investigate, solve puzzles, and learn quantum physics!"
  ];

  if (gamePhase === 'intro') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <motion.div
          className="max-w-3xl mx-auto text-center text-white p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 
            className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Dr. Quantum's Time-Lock Laboratory
          </motion.h1>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={storyProgress}
              className="mb-8 min-h-[120px] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl leading-relaxed max-w-2xl">{storyText[storyProgress]}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4">
            {storyProgress > 0 && (
              <button
                onClick={() => setStoryProgress(prev => Math.max(0, prev - 1))}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
              >
                ← Previous
              </button>
            )}
            
            {storyProgress < storyText.length - 1 ? (
              <button
                onClick={() => setStoryProgress(prev => prev + 1)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                Next →
              </button>
            ) : (
              <motion.button
                onClick={() => setGamePhase('playing')}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-xl font-bold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Begin Your Quantum Adventure!
              </motion.button>
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
          className="max-w-3xl mx-auto text-center text-white p-8"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.h1 
            className="text-6xl font-bold mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉 QUANTUM MASTERY ACHIEVED! 🎉
          </motion.h1>
          <p className="text-2xl mb-8">
            Congratulations! You've successfully stabilized the time-lock device and mastered quantum physics!
          </p>
          <div className="bg-green-800 bg-opacity-50 p-8 rounded-xl mb-8">
            <h2 className="text-3xl font-bold mb-6">🧠 Knowledge Gained:</h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <div>✨ Wave-particle duality</div>
                <div>🔗 Quantum entanglement</div>
                <div>🔐 Quantum cryptography</div>
              </div>
              <div className="space-y-2">
                <div>⚡ Superposition principles</div>
                <div>📊 Measurement theory</div>
                <div>⏰ Temporal mechanics</div>
              </div>
            </div>
          </div>
          <motion.button
            onClick={() => {
              setGamePhase('intro');
              setCurrentRoom('lab');
              setInventory([]);
              setCompletedObjectives(new Set());
              setDiscoveredObjects(new Set());
              setStoryProgress(0);
            }}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-xl font-bold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Experience Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentRoomData = rooms[currentRoom];
  const roomObjects = currentRoomData.objects.map(obj => ({
    ...obj,
    isDiscovered: discoveredObjects.has(obj.id)
  }));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Main Game Scene */}
      <div className="relative w-full h-full">
        <currentRoomData.SceneComponent onObjectClick={handleObjectClick} objects={roomObjects} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-auto">
          <div className="flex justify-between items-start text-white">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">{currentRoomData.title}</h1>
              <p className="text-slate-300 mt-1">{currentRoomData.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">
                Room {Object.keys(rooms).indexOf(currentRoom) + 1} of {Object.keys(rooms).length}
              </div>
              <div className="text-lg font-bold text-white">
                Objectives: {completedObjectives.size}/{currentRoomData.objectives.length}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 min-w-[200px] pointer-events-auto">
          <h3 className="text-white font-bold mb-3 text-center">🎒 Inventory</h3>
          <div className="space-y-2">
            {inventory.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No items collected</p>
            ) : (
              inventory.map(item => (
                <motion.div 
                  key={item.id} 
                  className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-2"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{item.name}</div>
                    <div className="text-gray-400 text-xs">{item.description}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Objectives Panel */}
        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 max-w-md pointer-events-auto">
          <h3 className="text-white font-bold mb-3">🎯 Current Objectives</h3>
          <div className="space-y-2">
            {currentRoomData.objectives.map((objective, index) => {
              const isCompleted = completedObjectives.has(objective.toLowerCase().replace(/\s+/g, '-'));
              return (
                <motion.div 
                  key={index} 
                  className={`flex items-center gap-3 text-sm ${isCompleted ? 'text-green-400' : 'text-gray-300'}`}
                  animate={{ opacity: isCompleted ? 1 : 0.7 }}
                >
                  <span className="text-lg">{isCompleted ? '✅' : '🔲'}</span>
                  <span>{objective}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Room Navigation Indicator */}
        <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-3 pointer-events-auto">
          <div className="flex gap-2">
            {Object.keys(rooms).map((roomKey, index) => {
              const room = roomKey as RoomType;
              const isCurrentRoom = currentRoom === room;
              const isAccessible = room === 'lab' || 
                (room === 'entanglement' && inventory.some(item => item.id === 'lab-key')) ||
                (room === 'cryptography' && inventory.some(item => item.id === 'entanglement-key')) ||
                (room === 'timelock' && inventory.some(item => item.id === 'crypto-key'));
              
              return (
                <motion.div
                  key={room}
                  className={`w-4 h-4 rounded-full ${
                    isCurrentRoom ? 'bg-cyan-400' :
                    isAccessible ? 'bg-gray-400' : 'bg-gray-700'
                  }`}
                  whileHover={isAccessible ? { scale: 1.2 } : {}}
                  title={rooms[room].title}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal System */}
      <AnimatePresence>
        {showModal && modalContent[showModal] && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl max-w-4xl w-full border-2 border-cyan-400/50 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 50, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">{modalContent[showModal].title}</h2>
                <button
                  onClick={() => handleModalComplete(showModal)}
                  className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-gray-100 mb-8">
                {modalContent[showModal].content}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  {modalContent[showModal].xpReward && (
                    <span className="bg-blue-600 px-4 py-2 rounded-full text-sm text-white font-medium">
                      +{modalContent[showModal].xpReward} XP
                    </span>
                  )}
                  {modalContent[showModal].skillReward && (
                    <span className="bg-purple-600 px-4 py-2 rounded-full text-sm text-white font-medium">
                      +{modalContent[showModal].skillReward} Cryptography
                    </span>
                  )}
                  {modalContent[showModal].givesItem && (
                    <span className="bg-green-600 px-4 py-2 rounded-full text-sm text-white font-medium">
                      +{modalContent[showModal].givesItem?.emoji} {modalContent[showModal].givesItem?.name}
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={() => handleModalComplete(showModal)}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 px-8 py-3 rounded-lg text-white font-bold text-lg hover:from-cyan-700 hover:to-purple-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Exploring! →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantumEscapeRoomEnhanced;
