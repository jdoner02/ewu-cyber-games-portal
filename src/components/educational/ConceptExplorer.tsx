'use client'

/**
 * Educational interface ConceptLink {
  id: string
  title: string
  type: 'prerequisite' | 'related' | 'advanced'
  description: string
  icon: React.ComponentType
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}Explorer Component
 * Content Analyst Implementation for EWU Cyber Games Portal
 * 
 * This component provides "what-if" scenarios and deeper learning opportunities
 * that connect the practical code to atomic cybersecurity concepts.
 * 
 * Educational Philosophy:
 * - Explosive Recursive Decomposition: Break complex ideas into explorable parts
 * - Knowledge Graph Connections: Link concepts to create learning pathways
 * - What-If Scenarios: Encourage critical thinking and exploration
 * - Pedagogical Excellence: Maintain age-appropriate depth and engagement
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  LightbulbIcon, 
  BookOpenIcon, 
  BrainIcon, 
  ZapIcon,
  LockIcon,
  ShieldIcon,
  EyeIcon,
  Code,
  Users,
  Globe
} from 'lucide-react'

interface ConceptConnection {
  id: string
  title: string
  type: 'prerequisite' | 'related' | 'advanced'
  description: string
  icon: typeof LockIcon
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface WhatIfScenario {
  id: string
  question: string
  exploration: string
  realWorldExample: string
  furtherThinking: string[]
}

interface AtomicConcept {
  id: string
  title: string
  summary: string
  connections: ConceptConnection[]
  whatIfScenarios: WhatIfScenario[]
  codeExample?: string
  practicalApplication: string
}

const CYBERSECURITY_CONCEPTS: AtomicConcept[] = [
  {
    id: 'password-strength-algorithms',
    title: 'How Computers Check Password Strength',
    summary: 'Understanding the step-by-step process computers use to evaluate password security',
    connections: [
      {
        id: 'authentication-basics',
        title: 'Authentication Fundamentals',
        type: 'prerequisite',
        description: 'Basic concepts of proving identity in computer systems',
        icon: Lock,
        difficulty: 'beginner'
      },
      {
        id: 'cryptographic-hashing',
        title: 'Password Hashing and Storage',
        type: 'advanced',
        description: 'How passwords are securely stored using cryptographic hash functions',
        icon: ShieldIcon,
        difficulty: 'advanced'
      },
      {
        id: 'brute-force-attacks',
        title: 'Brute Force Attack Mathematics',
        type: 'related',
        description: 'The mathematical principles behind password cracking attempts',
        icon: BrainIcon,
        difficulty: 'intermediate'
      }
    ],
    whatIfScenarios: [
      {
        id: 'algorithm-reverse-engineering',
        question: 'What if hackers could see the password strength algorithm code?',
        exploration: 'Since our code is open source, anyone can examine exactly how we check password strength. This might seem dangerous, but it\'s actually more secure!',
        realWorldExample: 'The Linux operating system is open source and powers most of the internet\'s servers. Being open source allows security experts worldwide to find and fix vulnerabilities.',
        furtherThinking: [
          'Why might "security through obscurity" (hiding how security works) be weaker than open security?',
          'How do security researchers use open source code to improve cybersecurity?',
          'What role does peer review play in making security systems stronger?'
        ]
      },
      {
        id: 'ai-password-generation',
        question: 'What if AI could generate uncrackable passwords that humans could remember?',
        exploration: 'Future AI might create passwords that are both mathematically strong and memorable to humans by understanding psychology and linguistics.',
        realWorldExample: 'Password managers like 1Password and Bitwarden already use algorithms to generate strong passwords, but they\'re random and hard to remember.',
        furtherThinking: [
          'How might AI understand what makes a password memorable to specific individuals?',
          'Could personalized passwords be more vulnerable to social engineering attacks?',
          'What ethical considerations arise when AI knows personal information for password creation?'
        ]
      }
    ],
    codeExample: `// Real code from our security utilities!
function checkPasswordStrength(password: string) {
  let score = 0
  const feedback = []
  
  // Each requirement adds to security score
  if (password.length >= 8) score += 20
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  
  return { score, feedback, isStrong: score >= 80 }
}`,
    practicalApplication: 'This algorithm runs every time you create a password on our platform, helping you learn while protecting your account!'
  },
  {
    id: 'phishing-detection-patterns',
    title: 'How to Spot Phishing Before It Tricks You',
    summary: 'Learning to recognize suspicious email patterns and social engineering tactics',
    connections: [
      {
        id: 'social-engineering',
        title: 'Social Engineering Psychology',
        type: 'related',
        description: 'How attackers manipulate human psychology to bypass technical security',
        icon: Users,
        difficulty: 'intermediate'
      },
      {
        id: 'domain-validation',
        title: 'DNS and Domain Security',
        type: 'advanced',
        description: 'Technical foundations of how internet domains work and can be spoofed',
        icon: Globe,
        difficulty: 'advanced'
      },
      {
        id: 'digital-literacy',
        title: 'Digital Citizenship Skills',
        type: 'prerequisite',
        description: 'Basic skills for safe and responsible internet use',
        icon: EyeIcon,
        difficulty: 'beginner'
      }
    ],
    whatIfScenarios: [
      {
        id: 'ai-generated-phishing',
        question: 'What if AI could create perfect phishing emails that are impossible to detect?',
        exploration: 'Advanced AI might generate personalized phishing emails using social media data, making them incredibly convincing and targeted.',
        realWorldExample: 'Deepfake technology can already create fake videos of people saying things they never said. Similar AI could create fake emails.',
        furtherThinking: [
          'How might AI-powered phishing change cybersecurity defense strategies?',
          'What role will human intuition play when technical detection fails?',
          'Could blockchain or other technologies provide new authentication methods?'
        ]
      },
      {
        id: 'zero-trust-communication',
        question: 'What if we couldn\'t trust any digital communication?',
        exploration: 'In a world where all digital communication could be faked, we\'d need entirely new ways to verify authenticity.',
        realWorldExample: 'Some high-security organizations already use multiple verification channels for important communications (phone + email + in-person).',
        furtherThinking: [
          'How would society function if digital communication lost all trustworthiness?',
          'What technologies might emerge to restore trust in digital communication?',
          'How do military and intelligence agencies handle ultra-high-security communications?'
        ]
      }
    ],
    codeExample: `// Email validation with phishing detection
function validateEmail(email: string) {
  const suspiciousDomains = ['lottery', 'winner', 'bank-security']
  const urgencyKeywords = ['urgent', 'expire', 'suspended']
  
  const warnings = []
  if (suspiciousDomains.some(domain => email.includes(domain))) {
    warnings.push('Domain looks suspicious!')
  }
  
  return { isValid: /* format check */, warnings }
}`,
    practicalApplication: 'Our phishing detection games use these same patterns to teach you real-world email security!'
  }
]

interface ConceptExplorerProps {
  conceptId?: string
  className?: string
}

export default function ConceptExplorer({ conceptId, className = '' }: ConceptExplorerProps) {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(conceptId || null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [activeScenario, setActiveScenario] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const concept = selectedConcept ? CYBERSECURITY_CONCEPTS.find(c => c.id === selectedConcept) : null

  if (!concept) {
    return (
      <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <BrainIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Concept Explorer</h3>
          <p className="text-slate-300 mb-4">
            Dive deeper into cybersecurity concepts! Select a topic to explore connections and "what-if" scenarios.
          </p>
          <div className="grid gap-2">
            {CYBERSECURITY_CONCEPTS.map(concept => (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className="text-left p-3 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
              >
                <div className="font-semibold text-cyan-400">{concept.title}</div>
                <div className="text-sm text-slate-300">{concept.summary}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{concept.title}</h3>
          <p className="text-slate-300">{concept.summary}</p>
        </div>
        <button
          onClick={() => setSelectedConcept(null)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <BookOpenIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Knowledge Graph Connections */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('connections')}
          className="flex items-center gap-2 text-lg font-semibold text-cyan-400 mb-3 hover:text-cyan-300 transition-colors"
        >
          <ZapIcon className="w-5 h-5" />
          Knowledge Connections
          {expandedSections.has('connections') ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('connections') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-3"
            >
              {concept.connections.map(connection => {
                const IconComponent = connection.icon
                return (
                  <div key={connection.id} className="bg-slate-700 rounded p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold text-white">{connection.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        connection.type === 'prerequisite' ? 'bg-orange-600' :
                        connection.type === 'related' ? 'bg-blue-600' : 'bg-red-600'
                      }`}>
                        {connection.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        connection.difficulty === 'beginner' ? 'bg-green-600' :
                        connection.difficulty === 'intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {connection.difficulty}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{connection.description}</p>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* What-If Scenarios */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('scenarios')}
          className="flex items-center gap-2 text-lg font-semibold text-cyan-400 mb-3 hover:text-cyan-300 transition-colors"
        >
          <LightbulbIcon className="w-5 h-5" />
          What-If Scenarios
          {expandedSections.has('scenarios') ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('scenarios') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {concept.whatIfScenarios.map(scenario => (
                <div key={scenario.id} className="bg-slate-700 rounded-lg p-4">
                  <button
                    onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
                    className="w-full text-left"
                  >
                    <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      <BrainIcon className="w-4 h-4" />
                      {scenario.question}
                      {activeScenario === scenario.id ? <ChevronUpIcon className="w-4 h-4 ml-auto" /> : <ChevronDownIcon className="w-4 h-4 ml-auto" />}
                    </h4>
                  </button>
                  
                  <AnimatePresence>
                    {activeScenario === scenario.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <div>
                          <h5 className="font-medium text-cyan-400 mb-1">Exploration:</h5>
                          <p className="text-slate-300 text-sm">{scenario.exploration}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-green-400 mb-1">Real-World Example:</h5>
                          <p className="text-slate-300 text-sm">{scenario.realWorldExample}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-yellow-400 mb-1">Deeper Questions:</h5>
                          <ul className="text-slate-300 text-sm space-y-1">
                            {scenario.furtherThinking.map((question, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-1">•</span>
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Code Example */}
      {concept.codeExample && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('code')}
            className="flex items-center gap-2 text-lg font-semibold text-cyan-400 mb-3 hover:text-cyan-300 transition-colors"
          >
            <Code className="w-5 h-5" />
            Live Code Example
            {expandedSections.has('code') ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.has('code') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-slate-900 rounded p-4 font-mono text-sm">
                  <pre className="text-green-400 whitespace-pre-wrap">
                    {concept.codeExample}
                  </pre>
                </div>
                <p className="text-slate-300 text-sm mt-2">{concept.practicalApplication}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Back to Concept List */}
      <div className="text-center">
        <button
          onClick={() => setSelectedConcept(null)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
        >
          Explore Other Concepts
        </button>
      </div>
    </div>
  )
}
