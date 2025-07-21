'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lock, Unlock, Zap, Eye } from 'lucide-react';

// Types for Quantum Mystery Room
interface QuantumObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isClickable: boolean;
  isDiscovered: boolean;
  quantumConcept: string;
  description: string;
  requiredKnowledge: string[];
  revealsSecrets: string[];
  sprite: string;
  interactionType: 'click' | 'hover' | 'sequence' | 'puzzle';
}

interface QuantumSecret {
  id: string;
  name: string;
  description: string;
  quantumPrinciple: string;
  cryptographyApplication: string;
  discoveryMethod: string;
  isRevealed: boolean;
  linkedObjects: string[];
}

interface PlayerProgress {
  discoveredObjects: string[];
  revealedSecrets: string[];
  quantumKnowledge: number;
  cryptographyLevel: number;
  easterEggsFound: number;
  currentRoom: string;
  completedPuzzles: string[];
  collectedPhotons: number;
}

interface Room {
  id: string;
  name: string;
  theme: string;
  background: string;
  objects: QuantumObject[];
  hiddenPathways: string[];
  quantumConcepts: string[];
  completionRequirement: number;
}

const QuantumMysteryRoom: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState('quantum-basics-lab');
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    discoveredObjects: [],
    revealedSecrets: [],
    quantumKnowledge: 0,
    cryptographyLevel: 1,
    easterEggsFound: 0,
    currentRoom: 'quantum-basics-lab',
    completedPuzzles: [],
    collectedPhotons: 0
  });
  
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<QuantumObject | null>(null);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<string | null>(null);
  const [discoveryAnimation, setDiscoveryAnimation] = useState<string | null>(null);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);
  
  // Quantum Secrets Database
  const quantumSecrets: QuantumSecret[] = [
    {
      id: 'superposition-principle',
      name: 'Quantum Superposition',
      description: 'A quantum particle can exist in multiple states simultaneously until observed',
      quantumPrinciple: 'Particles exist in all possible states until measurement collapses the wavefunction',
      cryptographyApplication: 'Quantum key distribution uses superposition to detect eavesdropping',
      discoveryMethod: 'Click the glowing quantum computer while understanding wave-particle duality',
      isRevealed: false,
      linkedObjects: ['quantum-computer', 'wave-particle-demo']
    },
    {
      id: 'entanglement-phenomenon',
      name: 'Quantum Entanglement',
      description: 'Two particles can be mysteriously connected across vast distances',
      quantumPrinciple: 'Entangled particles share quantum states instantaneously regardless of distance',
      cryptographyApplication: 'Enables ultra-secure communication through quantum teleportation',
      discoveryMethod: 'Activate both entangled photon detectors simultaneously',
      isRevealed: false,
      linkedObjects: ['photon-detector-a', 'photon-detector-b']
    },
    {
      id: 'heisenberg-uncertainty',
      name: 'Uncertainty Principle',
      description: 'You cannot precisely know both position and momentum of a quantum particle',
      quantumPrinciple: 'The more precisely you know position, the less precisely you know momentum',
      cryptographyApplication: 'Makes quantum eavesdropping detectable by disturbing the system',
      discoveryMethod: 'Try to measure the same particle with multiple instruments',
      isRevealed: false,
      linkedObjects: ['measurement-device-1', 'measurement-device-2']
    },
    {
      id: 'quantum-tunneling',
      name: 'Quantum Tunneling',
      description: 'Particles can pass through barriers that should be impossible to cross',
      quantumPrinciple: 'Wave nature allows particles to tunnel through energy barriers',
      cryptographyApplication: 'Used in quantum random number generators for perfect cryptographic keys',
      discoveryMethod: 'Click the barrier wall exactly 7 times to discover the hidden passage',
      isRevealed: false,
      linkedObjects: ['energy-barrier', 'tunnel-detector']
    },
    {
      id: 'quantum-no-cloning',
      name: 'No-Cloning Theorem',
      description: 'It is impossible to create perfect copies of unknown quantum states',
      quantumPrinciple: 'Quantum information cannot be copied without destroying the original',
      cryptographyApplication: 'Prevents quantum information from being copied by eavesdroppers',
      discoveryMethod: 'Attempt to duplicate a quantum state and observe the failure',
      isRevealed: false,
      linkedObjects: ['cloning-attempt-machine', 'quantum-state-analyzer']
    }
  ];

  // Room Definitions
  const rooms: Room[] = [
    {
      id: 'quantum-basics-lab',
      name: 'Quantum Basics Laboratory',
      theme: 'Introduction to quantum mechanics fundamentals',
      background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900',
      quantumConcepts: ['superposition', 'wave-particle duality', 'quantum states'],
      completionRequirement: 3,
      hiddenPathways: ['click quantum computer 3 times → cryptography-chamber'],
      objects: [
        {
          id: 'quantum-computer',
          name: 'Quantum Computer',
          x: 200,
          y: 150,
          width: 120,
          height: 100,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Computing Basics',
          description: 'A mysterious machine that harnesses quantum mechanics for computation. Click to explore the strange world of qubits!',
          requiredKnowledge: [],
          revealsSecrets: ['superposition-principle'],
          sprite: '🖥️',
          interactionType: 'click'
        },
        {
          id: 'wave-particle-demo',
          name: 'Wave-Particle Demonstrator',
          x: 450,
          y: 200,
          width: 80,
          height: 80,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Wave-Particle Duality',
          description: 'Light behaves as both a wave and particle. The double-slit experiment that baffled Einstein!',
          requiredKnowledge: [],
          revealsSecrets: ['superposition-principle'],
          sprite: '🌊',
          interactionType: 'hover'
        },
        {
          id: 'photon-source',
          name: 'Photon Emitter',
          x: 100,
          y: 350,
          width: 60,
          height: 60,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Photons',
          description: 'Generates single photons for quantum experiments. Each photon carries quantum information!',
          requiredKnowledge: [],
          revealsSecrets: [],
          sprite: '💡',
          interactionType: 'click'
        },
        {
          id: 'mystery-panel',
          name: 'Hidden Control Panel',
          x: 600,
          y: 100,
          width: 40,
          height: 40,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Easter Egg Discovery',
          description: 'A barely visible panel... what secrets might it hold?',
          requiredKnowledge: ['superposition-principle'],
          revealsSecrets: [],
          sprite: '🔘',
          interactionType: 'sequence'
        }
      ]
    },
    {
      id: 'cryptography-chamber',
      name: 'Quantum Cryptography Chamber',
      theme: 'Advanced quantum cryptography and security applications',
      background: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900',
      quantumConcepts: ['quantum key distribution', 'entanglement-based security', 'quantum random numbers'],
      completionRequirement: 4,
      hiddenPathways: ['solve entanglement puzzle → secret-vault'],
      objects: [
        {
          id: 'photon-detector-a',
          name: 'Entangled Photon Detector Alpha',
          x: 150,
          y: 200,
          width: 100,
          height: 80,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Entanglement Detection',
          description: 'Detects entangled photons. When paired with Beta detector, creates spooky action at a distance!',
          requiredKnowledge: ['superposition-principle'],
          revealsSecrets: ['entanglement-phenomenon'],
          sprite: '📡',
          interactionType: 'click'
        },
        {
          id: 'photon-detector-b',
          name: 'Entangled Photon Detector Beta',
          x: 500,
          y: 200,
          width: 100,
          height: 80,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Entanglement Detection',
          description: 'The twin detector to Alpha. Measuring one instantly affects the other!',
          requiredKnowledge: ['superposition-principle'],
          revealsSecrets: ['entanglement-phenomenon'],
          sprite: '📡',
          interactionType: 'click'
        },
        {
          id: 'quantum-key-generator',
          name: 'Quantum Key Generator',
          x: 300,
          y: 100,
          width: 120,
          height: 60,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Key Distribution',
          description: 'Generates perfectly random encryption keys using quantum uncertainty!',
          requiredKnowledge: ['entanglement-phenomenon'],
          revealsSecrets: ['heisenberg-uncertainty'],
          sprite: '🗝️',
          interactionType: 'puzzle'
        },
        {
          id: 'eavesdropper-detector',
          name: 'Quantum Eavesdropper Detector',
          x: 250,
          y: 350,
          width: 90,
          height: 70,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Security Detection',
          description: 'Detects if anyone is trying to intercept quantum communications!',
          requiredKnowledge: ['heisenberg-uncertainty'],
          revealsSecrets: [],
          sprite: '🔍',
          interactionType: 'hover'
        }
      ]
    },
    {
      id: 'secret-vault',
      name: 'Quantum Secret Vault',
      theme: 'Hidden chamber with advanced quantum mysteries',
      background: 'bg-gradient-to-br from-purple-900 via-pink-900 to-red-900',
      quantumConcepts: ['quantum tunneling', 'no-cloning theorem', 'quantum supremacy'],
      completionRequirement: 2,
      hiddenPathways: [],
      objects: [
        {
          id: 'energy-barrier',
          name: 'Quantum Energy Barrier',
          x: 300,
          y: 250,
          width: 200,
          height: 20,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Tunneling',
          description: 'An impenetrable energy barrier... or is it? Click exactly 7 times to discover quantum tunneling!',
          requiredKnowledge: ['entanglement-phenomenon'],
          revealsSecrets: ['quantum-tunneling'],
          sprite: '⚡',
          interactionType: 'sequence'
        },
        {
          id: 'cloning-attempt-machine',
          name: 'Quantum State Duplicator',
          x: 100,
          y: 150,
          width: 120,
          height: 100,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'No-Cloning Theorem',
          description: 'Attempts to clone quantum states. Spoiler alert: it cannot succeed!',
          requiredKnowledge: ['quantum-tunneling'],
          revealsSecrets: ['quantum-no-cloning'],
          sprite: '🔬',
          interactionType: 'puzzle'
        },
        {
          id: 'quantum-supremacy-chamber',
          name: 'Quantum Supremacy Demonstration',
          x: 500,
          y: 100,
          width: 150,
          height: 120,
          isClickable: true,
          isDiscovered: false,
          quantumConcept: 'Quantum Supremacy',
          description: 'A problem only quantum computers can solve efficiently. The ultimate quantum advantage!',
          requiredKnowledge: ['quantum-no-cloning'],
          revealsSecrets: [],
          sprite: '👑',
          interactionType: 'click'
        }
      ]
    }
  ];

  const currentRoomData = rooms.find(room => room.id === currentRoom) || rooms[0];

  // Cookie-based persistence
  useEffect(() => {
    const savedProgress = document.cookie
      .split('; ')
      .find(row => row.startsWith('quantumMysteryProgress='))
      ?.split('=')[1];
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(decodeURIComponent(savedProgress));
        setPlayerProgress(progress);
        setCurrentRoom(progress.currentRoom || 'quantum-basics-lab');
      } catch (error) {
        console.log('Error loading quantum progress:', error);
      }
    }
  }, []);

  // Save progress to cookies
  useEffect(() => {
    const progressData = {
      ...playerProgress,
      currentRoom,
      lastPlayed: new Date().toISOString()
    };
    
    const cookieValue = encodeURIComponent(JSON.stringify(progressData));
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (365 * 24 * 60 * 60 * 1000));
    
    document.cookie = `quantumMysteryProgress=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  }, [playerProgress, currentRoom]);

  // Handle object interactions
  const handleObjectClick = (object: QuantumObject) => {
    // Check if player has required knowledge
    const hasRequiredKnowledge = object.requiredKnowledge.every(knowledge => 
      playerProgress.revealedSecrets.includes(knowledge)
    );

    if (!hasRequiredKnowledge) {
      setSelectedObject(object);
      return;
    }

    // Special sequence interactions
    if (object.interactionType === 'sequence') {
      handleSequenceInteraction(object);
      return;
    }

    // Regular discovery
    if (!playerProgress.discoveredObjects.includes(object.id)) {
      setPlayerProgress(prev => ({
        ...prev,
        discoveredObjects: [...prev.discoveredObjects, object.id],
        quantumKnowledge: prev.quantumKnowledge + 10,
        collectedPhotons: prev.collectedPhotons + 1
      }));

      // Reveal secrets
      object.revealsSecrets.forEach(secretId => {
        if (!playerProgress.revealedSecrets.includes(secretId)) {
          setPlayerProgress(prev => ({
            ...prev,
            revealedSecrets: [...prev.revealedSecrets, secretId],
            cryptographyLevel: prev.cryptographyLevel + 1
          }));
        }
      });

      setDiscoveryAnimation(object.id);
      setTimeout(() => setDiscoveryAnimation(null), 2000);
    }

    setSelectedObject(object);

    // Check for puzzle interactions
    if (object.interactionType === 'puzzle') {
      setCurrentPuzzle(object.id);
      setShowPuzzleModal(true);
    }
  };

  const handleSequenceInteraction = (object: QuantumObject) => {
    const sequenceKey = `sequence_${object.id}`;
    const currentCount = parseInt(localStorage.getItem(sequenceKey) || '0');
    
    if (object.id === 'energy-barrier' && currentCount < 6) {
      localStorage.setItem(sequenceKey, (currentCount + 1).toString());
    } else if (object.id === 'energy-barrier' && currentCount === 6) {
      // Reveal quantum tunneling!
      localStorage.setItem(sequenceKey, '0');
      handleObjectClick({...object, interactionType: 'click'});
    }
  };

  // Check for room transitions
  useEffect(() => {
    const discoveredInRoom = currentRoomData.objects.filter(obj => 
      playerProgress.discoveredObjects.includes(obj.id)
    ).length;

    if (discoveredInRoom >= currentRoomData.completionRequirement) {
      // Check for hidden pathway access
      if (currentRoom === 'quantum-basics-lab' && playerProgress.quantumKnowledge >= 30) {
        // Unlock cryptography chamber
      }
    }
  }, [playerProgress.discoveredObjects, currentRoom]);

  const revealedSecretsData = quantumSecrets.filter(secret => 
    playerProgress.revealedSecrets.includes(secret.id)
  );

  return (
    <div className={`min-h-screen relative ${currentRoomData.background} overflow-hidden`}>
      {/* Animated quantum particles background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-violet-400 rounded-full opacity-30"
            animate={{
              x: [0, window.innerWidth || 800],
              y: [Math.random() * (window.innerHeight || 600), Math.random() * (window.innerHeight || 600)],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * (window.innerWidth || 800),
              top: Math.random() * (window.innerHeight || 600),
            }}
          />
        ))}
      </div>

      {/* Header UI */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-violet-400/30">
            <h1 className="text-2xl font-bold text-white mb-2">
              🔬 {currentRoomData.name}
            </h1>
            <p className="text-violet-200 text-sm mb-4">{currentRoomData.theme}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-violet-400">{playerProgress.quantumKnowledge}</div>
                <div className="text-violet-300">Quantum Knowledge</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400">{revealedSecretsData.length}</div>
                <div className="text-cyan-300">Secrets Revealed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{playerProgress.collectedPhotons}</div>
                <div className="text-green-300">Photons Collected</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-pink-400">{playerProgress.cryptographyLevel}</div>
                <div className="text-pink-300">Crypto Level</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <motion.button
              onClick={() => setShowKnowledgeGraph(!showKnowledgeGraph)}
              className="bg-purple-500/80 hover:bg-purple-600/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-purple-400/50"
              whileHover={{ scale: 1.05 }}
            >
              🧠 Knowledge Graph
            </motion.button>
            
            {currentRoom !== 'quantum-basics-lab' && (
              <motion.button
                onClick={() => setCurrentRoom('quantum-basics-lab')}
                className="bg-indigo-500/80 hover:bg-indigo-600/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-indigo-400/50 block"
                whileHover={{ scale: 1.05 }}
              >
                🏠 Return to Lab
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Room Display */}
      <div className="relative z-10 p-8">
        <div className="relative w-full h-96 bg-black/20 rounded-xl border border-violet-400/30 backdrop-blur-sm overflow-hidden">
          {/* Room Objects */}
          {currentRoomData.objects.map((object) => {
            const isDiscovered = playerProgress.discoveredObjects.includes(object.id);
            const hasRequiredKnowledge = object.requiredKnowledge.every(knowledge => 
              playerProgress.revealedSecrets.includes(knowledge)
            );
            
            return (
              <motion.div
                key={object.id}
                className={`absolute cursor-pointer ${
                  hasRequiredKnowledge ? 'opacity-100' : 'opacity-50'
                } ${isDiscovered ? 'ring-2 ring-green-400' : ''}`}
                style={{
                  left: object.x,
                  top: object.y,
                  width: object.width,
                  height: object.height
                }}
                onClick={() => handleObjectClick(object)}
                onMouseEnter={() => setHoveredObject(object.id)}
                onMouseLeave={() => setHoveredObject(null)}
                whileHover={{ scale: 1.1 }}
                animate={discoveryAnimation === object.id ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, 360, 0]
                } : {}}
              >
                <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg border border-violet-400/50 flex items-center justify-center text-3xl backdrop-blur-sm">
                  {object.sprite}
                </div>
                
                {hoveredObject === object.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 bg-black/90 text-white p-3 rounded-lg border border-violet-400/50 w-64 z-20"
                  >
                    <h4 className="font-bold text-violet-300 mb-1">{object.name}</h4>
                    <p className="text-sm text-gray-300">{object.description}</p>
                    {!hasRequiredKnowledge && (
                      <p className="text-xs text-red-400 mt-2">
                        🔒 Requires: {object.requiredKnowledge.join(', ')}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
          
          {/* Easter Egg Hints */}
          <div className="absolute bottom-4 right-4 text-violet-300/50 text-xs">
            💡 Look for hidden objects and secret pathways...
          </div>
        </div>
      </div>

      {/* Revealed Secrets Panel */}
      {revealedSecretsData.length > 0 && (
        <div className="relative z-10 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30"
          >
            <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center">
              <Unlock className="w-5 h-5 mr-2" />
              Quantum Secrets Revealed
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {revealedSecretsData.map((secret) => (
                <motion.div
                  key={secret.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-400/30"
                >
                  <h4 className="font-bold text-white mb-2">{secret.name}</h4>
                  <p className="text-emerald-200 text-sm mb-3">{secret.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-violet-400 font-medium">Quantum Principle:</span>
                      <p className="text-gray-300">{secret.quantumPrinciple}</p>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-medium">Cryptography Use:</span>
                      <p className="text-gray-300">{secret.cryptographyApplication}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Knowledge Graph Modal */}
      <AnimatePresence>
        {showKnowledgeGraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={() => setShowKnowledgeGraph(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 border border-violet-400/50 max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">🧠 Quantum Knowledge Graph</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-violet-400">{playerProgress.quantumKnowledge}</div>
                  <div className="text-violet-300">Total Knowledge Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{revealedSecretsData.length}</div>
                  <div className="text-cyan-300">Quantum Concepts Mastered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{playerProgress.cryptographyLevel}</div>
                  <div className="text-green-300">Cryptography Expertise</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 min-h-64">
                <h3 className="text-white font-bold mb-4">Quantum Concepts Network</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quantumSecrets.map((secret) => {
                    const isRevealed = playerProgress.revealedSecrets.includes(secret.id);
                    return (
                      <div
                        key={secret.id}
                        className={`p-3 rounded-lg border text-center ${
                          isRevealed 
                            ? 'bg-green-500/20 border-green-400/50 text-green-300' 
                            : 'bg-gray-500/20 border-gray-400/50 text-gray-400'
                        }`}
                      >
                        <div className="text-lg mb-1">
                          {isRevealed ? '🔓' : '🔒'}
                        </div>
                        <div className="font-medium text-sm">
                          {isRevealed ? secret.name : '???'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Navigation */}
      {currentRoom === 'quantum-basics-lab' && playerProgress.quantumKnowledge >= 30 && (
        <div className="fixed bottom-4 right-4 z-20">
          <motion.button
            onClick={() => setCurrentRoom('cryptography-chamber')}
            className="bg-emerald-500/80 hover:bg-emerald-600/80 text-white px-6 py-3 rounded-xl backdrop-blur-sm border border-emerald-400/50"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🚪 Enter Cryptography Chamber
          </motion.button>
        </div>
      )}

      {currentRoom === 'cryptography-chamber' && playerProgress.cryptographyLevel >= 4 && (
        <div className="fixed bottom-4 right-4 z-20">
          <motion.button
            onClick={() => setCurrentRoom('secret-vault')}
            className="bg-red-500/80 hover:bg-red-600/80 text-white px-6 py-3 rounded-xl backdrop-blur-sm border border-red-400/50"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🏛️ Access Secret Vault
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default QuantumMysteryRoom;
