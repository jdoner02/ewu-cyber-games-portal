import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, Users, Target } from 'lucide-react';

// Knowledge Graph Integration - Research-Based Learning Enhancement
interface ConceptNode {
  id: string;
  label: string;
  description: string;
  prerequisites: string[];
  connections: ConceptConnection[];
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  realWorldApplication: string;
  ncaeAlignment: string[];
  niceAlignment: string[];
}

interface ConceptConnection {
  targetId: string;
  relationship: 'prerequisite' | 'enables' | 'applies_to' | 'strengthens';
  strength: number; // 0-1 connection strength
  description: string;
}

// Research-backed concept mapping based on NSA GenCyber objectives and AP Cybersecurity standards
const algorithmConceptMap: ConceptNode[] = [
  {
    id: 'algorithm_definition',
    label: 'Algorithm Definition',
    description: 'Step-by-step procedure for solving problems systematically',
    prerequisites: [],
    connections: [
      { 
        targetId: 'computational_thinking', 
        relationship: 'enables', 
        strength: 0.9,
        description: 'Algorithms are the foundation of computational thinking'
      },
      { 
        targetId: 'security_procedures', 
        relationship: 'applies_to', 
        strength: 0.8,
        description: 'Security procedures are specialized algorithms'
      }
    ],
    bloomLevel: 'understand',
    realWorldApplication: 'Every software program and security system uses algorithms',
    ncaeAlignment: ['Basic Security Concepts'],
    niceAlignment: ['K0001', 'K0002']
  },
  {
    id: 'computational_thinking',
    label: 'Computational Thinking',
    description: 'Problem-solving process using decomposition, patterns, abstraction, and algorithms',
    prerequisites: ['algorithm_definition'],
    connections: [
      { 
        targetId: 'problem_decomposition', 
        relationship: 'enables', 
        strength: 0.9,
        description: 'Breaking complex problems into manageable parts'
      },
      { 
        targetId: 'pattern_recognition', 
        relationship: 'enables', 
        strength: 0.8,
        description: 'Identifying similarities and trends in data'
      }
    ],
    bloomLevel: 'apply',
    realWorldApplication: 'Cybersecurity analysts use computational thinking to identify threats',
    ncaeAlignment: ['Problem Solving', 'Critical Thinking'],
    niceAlignment: ['K0066', 'S0018']
  },
  {
    id: 'security_procedures',
    label: 'Security Procedures',
    description: 'Systematic approaches to protecting digital assets and responding to threats',
    prerequisites: ['algorithm_definition', 'computational_thinking'],
    connections: [
      { 
        targetId: 'incident_response', 
        relationship: 'applies_to', 
        strength: 0.9,
        description: 'Incident response follows structured procedural algorithms'
      },
      { 
        targetId: 'threat_detection', 
        relationship: 'applies_to', 
        strength: 0.8,
        description: 'Threat detection uses algorithmic pattern matching'
      },
      { 
        targetId: 'access_control', 
        relationship: 'applies_to', 
        strength: 0.7,
        description: 'Access control implements security policy algorithms'
      }
    ],
    bloomLevel: 'apply',
    realWorldApplication: 'Every organization has security procedures based on proven algorithms',
    ncaeAlignment: ['Security Operations', 'Incident Response'],
    niceAlignment: ['K0161', 'K0162', 'S0167']
  },
  {
    id: 'incident_response',
    label: 'Incident Response',
    description: 'Systematic process for handling security breaches and cyberattacks',
    prerequisites: ['security_procedures'],
    connections: [
      { 
        targetId: 'forensic_analysis', 
        relationship: 'enables', 
        strength: 0.8,
        description: 'Proper incident response preserves evidence for forensic analysis'
      },
      { 
        targetId: 'business_continuity', 
        relationship: 'strengthens', 
        strength: 0.7,
        description: 'Good incident response ensures business operations continue'
      }
    ],
    bloomLevel: 'analyze',
    realWorldApplication: 'CERT teams use standardized incident response algorithms daily',
    ncaeAlignment: ['Incident Response', 'Crisis Management'],
    niceAlignment: ['K0041', 'K0042', 'S0034']
  }
];

// Enhanced concept visualization component
const ConceptMapVisualization: React.FC<{
  currentConcept: string;
  completedConcepts: string[];
  onConceptSelect: (conceptId: string) => void;
}> = ({ currentConcept, completedConcepts, onConceptSelect }) => {
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  
  const getConceptById = (id: string): ConceptNode | undefined => {
    return algorithmConceptMap.find(concept => concept.id === id);
  };

  const getNodeStatus = (conceptId: string) => {
    if (completedConcepts.includes(conceptId)) return 'completed';
    if (conceptId === currentConcept) return 'current';
    return 'locked';
  };

  const isNodeAccessible = (concept: ConceptNode): boolean => {
    return concept.prerequisites.every(prereq => completedConcepts.includes(prereq));
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 mb-6 border border-indigo-400/20">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-indigo-400" />
        <h3 className="text-2xl font-bold text-white">🔗 Knowledge Network</h3>
        <div className="ml-auto bg-indigo-500/20 rounded-lg px-3 py-1">
          <span className="text-indigo-300 text-sm font-medium">
            Progress: {completedConcepts.length}/{algorithmConceptMap.length}
          </span>
        </div>
      </div>
      
      {/* Interactive concept map visualization */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {algorithmConceptMap.map((concept) => {
          const status = getNodeStatus(concept.id);
          const accessible = isNodeAccessible(concept);
          
          return (
            <motion.div
              key={concept.id}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${status === 'completed' ? 'bg-green-500/20 border-green-400/50 text-green-200' : ''}
                ${status === 'current' ? 'bg-blue-500/20 border-blue-400/50 text-blue-200 ring-2 ring-blue-400/30' : ''}
                ${status === 'locked' && !accessible ? 'bg-gray-500/10 border-gray-600/30 text-gray-500' : ''}
                ${status === 'locked' && accessible ? 'bg-yellow-500/10 border-yellow-600/30 text-yellow-300 hover:bg-yellow-500/20' : ''}
              `}
              whileHover={accessible ? { scale: 1.02 } : {}}
              onClick={() => {
                if (accessible) {
                  setSelectedNode(concept);
                  onConceptSelect(concept.id);
                }
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {status === 'completed' && <CheckCircle className="w-4 h-4" />}
                {status === 'current' && <Target className="w-4 h-4" />}
                {status === 'locked' && !accessible && <div className="w-4 h-4 rounded-full bg-gray-600" />}
                {status === 'locked' && accessible && <div className="w-4 h-4 rounded-full bg-yellow-500" />}
                
                <h4 className="font-bold text-sm truncate">{concept.label}</h4>
              </div>
              
              <p className="text-xs opacity-80 mb-2">{concept.description}</p>
              
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span className="text-xs capitalize">{concept.bloomLevel}</span>
              </div>
              
              {/* Connection indicators */}
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                {concept.connections.map((connection, index) => (
                  <motion.div
                    key={connection.targetId}
                    className="w-2 h-2 bg-blue-400 rounded-full mb-1 opacity-60"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed concept information panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/30 rounded-lg p-6 border border-white/10"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-3">{selectedNode.label}</h4>
                <p className="text-white/90 mb-4">{selectedNode.description}</p>
                
                <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3 mb-4">
                  <h5 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Real-World Application
                  </h5>
                  <p className="text-blue-200 text-sm">{selectedNode.realWorldApplication}</p>
                </div>

                <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3">
                  <h5 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Learning Level
                  </h5>
                  <p className="text-purple-200 text-sm">
                    Bloom's Taxonomy: <span className="capitalize font-medium">{selectedNode.bloomLevel}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-bold text-white mb-3">🔗 Connections</h5>
                <div className="space-y-3">
                  {selectedNode.connections.map((connection) => {
                    const targetConcept = getConceptById(connection.targetId);
                    if (!targetConcept) return null;
                    
                    return (
                      <div 
                        key={connection.targetId}
                        className="bg-white/10 rounded-lg p-3 border border-white/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white text-sm">{targetConcept.label}</span>
                          <span className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${connection.relationship === 'enables' ? 'bg-green-500/20 text-green-300' : ''}
                            ${connection.relationship === 'applies_to' ? 'bg-blue-500/20 text-blue-300' : ''}
                            ${connection.relationship === 'prerequisite' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                            ${connection.relationship === 'strengthens' ? 'bg-purple-500/20 text-purple-300' : ''}
                          `}>
                            {connection.relationship.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-white/70 text-xs">{connection.description}</p>
                        
                        {/* Connection strength indicator */}
                        <div className="mt-2 bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 rounded-full"
                            style={{ width: `${connection.strength * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Standards alignment */}
                <div className="mt-4 bg-gray-800/50 rounded-lg p-3">
                  <h6 className="font-bold text-white text-sm mb-2">📋 Standards Alignment</h6>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-300 text-xs font-medium">NCAE: </span>
                      <span className="text-white/70 text-xs">{selectedNode.ncaeAlignment.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-blue-300 text-xs font-medium">NICE: </span>
                      <span className="text-white/70 text-xs">{selectedNode.niceAlignment.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedNode(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning pathway indicator */}
      <div className="mt-6 bg-black/20 rounded-lg p-4">
        <h5 className="font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Your Learning Journey
        </h5>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-white/70">Next up:</span>
          {algorithmConceptMap
            .filter(concept => !completedConcepts.includes(concept.id) && isNodeAccessible(concept))
            .slice(0, 3)
            .map((concept, index) => (
              <span key={concept.id} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                {concept.label}
              </span>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ConceptMapVisualization;
