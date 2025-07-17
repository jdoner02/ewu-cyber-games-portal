import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, Users, Target, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import ConceptMapVisualization from './ConceptMapVisualization';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface AlgorithmStep {
  id: string;
  instruction: string;
  expected: string;
  hint: string;
  explanation: string;
  realWorldExample: string;
}

interface MetacognitiveReflection {
  confidence: number;
  difficulty: number;
  strategy: string;
  connections: string;
  nextSteps: string;
}

const EnhancedAlgorithmTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  const [userSteps, setUserSteps] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedConcepts, setCompletedConcepts] = useState<string[]>(['algorithm_definition']);
  const [currentConcept, setCurrentConcept] = useState('computational_thinking');
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionData, setReflectionData] = useState<MetacognitiveReflection>({
    confidence: 3,
    difficulty: 3,
    strategy: '',
    connections: '',
    nextSteps: ''
  });
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [learningMetrics, setLearningMetrics] = useState({
    totalTime: 0,
    hintsUsed: 0,
    correctFirstTry: 0,
    reflectionsCompleted: 0
  });

  const steps = [
    {
      title: "What is an Algorithm? 🤔",
      description: "Learn the foundation of computational thinking",
      content: "An algorithm is a step-by-step set of instructions to solve a problem. Like a recipe for computers!",
      conceptAlignment: "algorithm_definition"
    },
    {
      title: "Algorithms in Cybersecurity",
      description: "How algorithms protect our digital world",
      content: "Cybersecurity uses algorithms for encryption, threat detection, and secure communications!",
      conceptAlignment: "computational_thinking"
    },
    {
      title: "Build Your Own Algorithm",
      description: "Create step-by-step security procedures",
      content: "Let's practice creating algorithms by building cybersecurity procedures step by step!",
      conceptAlignment: "security_procedures"
    }
  ];

  // Enhanced algorithms with deeper educational content
  const algorithms = [
    {
      id: 'password-check',
      title: 'Password Security Algorithm',
      description: 'Create an algorithm to check if a password is strong',
      problem: 'How would you check if a password is secure?',
      conceptAlignment: 'security_procedures',
      realWorldContext: 'Every login system uses password validation algorithms to protect user accounts.',
      industryConnection: 'Security engineers at companies like Google and Microsoft design these algorithms.',
      steps: [
        { 
          id: '1', 
          instruction: 'Check password length (at least 8 characters)', 
          expected: 'length >= 8', 
          hint: 'Think about minimum character count',
          explanation: 'Longer passwords are exponentially harder to crack through brute force attacks.',
          realWorldExample: 'Banking systems typically require 8-12 character minimum passwords.'
        },
        { 
          id: '2', 
          instruction: 'Check for uppercase letters', 
          expected: 'has uppercase', 
          hint: 'A-Z characters needed',
          explanation: 'Mixed case increases the possible character set, making passwords stronger.',
          realWorldExample: 'Corporate email systems often enforce uppercase requirements.'
        },
        { 
          id: '3', 
          instruction: 'Check for lowercase letters', 
          expected: 'has lowercase', 
          hint: 'a-z characters needed',
          explanation: 'Lowercase letters are the foundation of most password complexity requirements.',
          realWorldExample: 'Social media platforms check for both upper and lowercase letters.'
        },
        { 
          id: '4', 
          instruction: 'Check for numbers', 
          expected: 'has numbers', 
          hint: '0-9 digits needed',
          explanation: 'Numbers significantly increase password entropy and security strength.',
          realWorldExample: 'Financial institutions require numeric characters in all passwords.'
        },
        { 
          id: '5', 
          instruction: 'Check for special characters', 
          expected: 'has symbols', 
          hint: '!@#$ characters needed',
          explanation: 'Special characters create the strongest passwords by maximizing character diversity.',
          realWorldExample: 'Government systems often require special characters for classified access.'
        }
      ]
    },
    {
      id: 'phishing-detection',
      title: 'Phishing Email Detection Algorithm',
      description: 'Create an algorithm to identify suspicious emails',
      problem: 'How would you determine if an email might be phishing?',
      conceptAlignment: 'threat_detection',
      realWorldContext: 'Email security systems use algorithms to filter millions of phishing attempts daily.',
      industryConnection: 'Cybersecurity analysts at organizations like CISA develop these detection methods.',
      steps: [
        { 
          id: '1', 
          instruction: 'Check sender email address', 
          expected: 'verify sender', 
          hint: 'Is the sender legitimate?',
          explanation: 'Spoofed email addresses are the primary vector for phishing attacks.',
          realWorldExample: 'Corporate email filters check sender reputation and domain authenticity.'
        },
        { 
          id: '2', 
          instruction: 'Look for urgent language', 
          expected: 'check urgency', 
          hint: 'Scammers create false urgency',
          explanation: 'Urgency is a psychological manipulation tactic used to bypass critical thinking.',
          realWorldExample: 'Phishing emails often claim "your account will be closed in 24 hours."'
        },
        { 
          id: '3', 
          instruction: 'Examine links carefully', 
          expected: 'verify links', 
          hint: 'Hover to see real destination',
          explanation: 'Malicious links can appear legitimate but redirect to dangerous websites.',
          realWorldExample: 'Security training teaches employees to hover over links before clicking.'
        },
        { 
          id: '4', 
          instruction: 'Check for spelling errors', 
          expected: 'check grammar', 
          hint: 'Professional emails have good grammar',
          explanation: 'Poor grammar often indicates automated or foreign-origin phishing attempts.',
          realWorldExample: 'Legitimate companies have professional editing and quality control.'
        },
        { 
          id: '5', 
          instruction: 'Verify unexpected requests', 
          expected: 'confirm requests', 
          hint: 'Contact sender directly if suspicious',
          explanation: 'Out-of-band verification prevents social engineering attacks.',
          realWorldExample: 'Banks never ask for passwords via email and customers should call to verify.'
        }
      ]
    },
    {
      id: 'incident-response',
      title: 'Cyber Incident Response Algorithm',
      description: 'Create an algorithm for responding to security incidents',
      problem: 'What steps should you take when a security incident occurs?',
      conceptAlignment: 'incident_response',
      realWorldContext: 'Every organization has incident response teams that follow standardized algorithms.',
      industryConnection: 'CERT teams and SOC analysts use these procedures during real cyberattacks.',
      steps: [
        { 
          id: '1', 
          instruction: 'Identify and contain the threat', 
          expected: 'contain threat', 
          hint: 'Stop the incident from spreading',
          explanation: 'Rapid containment prevents damage expansion and preserves evidence.',
          realWorldExample: 'When malware is detected, IT teams immediately isolate affected systems.'
        },
        { 
          id: '2', 
          instruction: 'Assess the damage', 
          expected: 'assess damage', 
          hint: 'What was affected?',
          explanation: 'Understanding impact scope helps prioritize recovery efforts and resources.',
          realWorldExample: 'Security teams create impact assessments for management and insurance.'
        },
        { 
          id: '3', 
          instruction: 'Preserve evidence', 
          expected: 'preserve evidence', 
          hint: 'Keep logs and data for investigation',
          explanation: 'Digital forensics requires careful evidence preservation for legal proceedings.',
          realWorldExample: 'Law enforcement may need system images and logs for prosecution.'
        },
        { 
          id: '4', 
          instruction: 'Notify stakeholders', 
          expected: 'notify team', 
          hint: 'Alert management and users',
          explanation: 'Timely communication ensures coordinated response and regulatory compliance.',
          realWorldExample: 'Companies must notify customers and regulators about data breaches.'
        },
        { 
          id: '5', 
          instruction: 'Recovery and lessons learned', 
          expected: 'recover and learn', 
          hint: 'Fix the issue and prevent recurrence',
          explanation: 'Post-incident analysis strengthens defenses and improves future response.',
          realWorldExample: 'Organizations update security policies based on incident findings.'
        }
      ]
    }
  ];

  const currentAlgorithmData = algorithms[currentAlgorithm];
  const currentStepData = currentAlgorithmData.steps[userSteps.length];

  const addStep = (step: string) => {
    const newSteps = [...userSteps, step];
    setUserSteps(newSteps);
    
    // Enhanced scoring with pedagogical feedback
    if (step.toLowerCase().includes(currentStepData.expected.toLowerCase())) {
      setScore(score + 20);
      setLearningMetrics(prev => ({ ...prev, correctFirstTry: prev.correctFirstTry + 1 }));
    }
    
    // Update concept completion
    if (newSteps.length === currentAlgorithmData.steps.length) {
      setTimeout(() => {
        if (!completedConcepts.includes(currentAlgorithmData.conceptAlignment)) {
          setCompletedConcepts([...completedConcepts, currentAlgorithmData.conceptAlignment]);
        }
        
        if (currentAlgorithm < algorithms.length - 1) {
          setCurrentAlgorithm(currentAlgorithm + 1);
          setUserSteps([]);
          setShowHint(false);
          setShowReflection(true); // Trigger metacognitive reflection
        } else {
          // All algorithms completed
          setShowReflection(true);
        }
      }, 2000);
    }
  };

  const handleReflectionComplete = () => {
    setShowReflection(false);
    setLearningMetrics(prev => ({ ...prev, reflectionsCompleted: prev.reflectionsCompleted + 1 }));
    
    // Update total time spent
    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes
    setLearningMetrics(prev => ({ ...prev, totalTime: timeSpent }));
  };

  const resetAlgorithm = () => {
    setUserSteps([]);
    setShowHint(false);
  };

  const overallProgress = ((currentAlgorithm * algorithms[0].steps.length + userSteps.length) / (algorithms.length * algorithms[0].steps.length)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 min-h-screen p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🧠 Enhanced Algorithm Thinking Lab</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-white/80 text-sm">Learning Score: </span>
              <span className="text-white font-bold">{score}</span>
            </div>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>

        {/* Knowledge Graph Integration */}
        <ConceptMapVisualization 
          currentConcept={currentConcept}
          completedConcepts={completedConcepts}
          onConceptSelect={setCurrentConcept}
        />

        {/* Learning Analytics Dashboard */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-6 border border-blue-400/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            📊 Your Learning Analytics
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{Math.round(overallProgress)}%</div>
              <div className="text-white/60 text-sm">Progress</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{learningMetrics.totalTime}</div>
              <div className="text-white/60 text-sm">Minutes</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{learningMetrics.correctFirstTry}</div>
              <div className="text-white/60 text-sm">Correct First Try</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{learningMetrics.hintsUsed}</div>
              <div className="text-white/60 text-sm">Hints Used</div>
            </div>
          </div>
        </div>

        {/* Rest of the existing tutorial content with enhancements */}
        {currentStep < 2 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
            <p className="text-white/90 mb-2">{steps[currentStep].description}</p>
            <p className="text-teal-200 text-sm">{steps[currentStep].content}</p>
            
            {currentStep === 1 && (
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/50">
                  <div className="text-3xl mb-2">🔐</div>
                  <h3 className="text-white font-bold">Encryption Algorithms</h3>
                  <p className="text-white/80 text-sm">Protect data by scrambling it with mathematical formulas</p>
                  <div className="mt-2 text-purple-300 text-xs">Real Example: HTTPS uses AES encryption</div>
                </div>
                <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/50">
                  <div className="text-3xl mb-2">🛡️</div>
                  <h3 className="text-white font-bold">Detection Algorithms</h3>
                  <p className="text-white/80 text-sm">Identify threats and suspicious behavior automatically</p>
                  <div className="mt-2 text-red-300 text-xs">Real Example: Antivirus signature matching</div>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/50">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="text-white font-bold">Analysis Algorithms</h3>
                  <p className="text-white/80 text-sm">Process data to find patterns and security insights</p>
                  <div className="mt-2 text-blue-300 text-xs">Real Example: Network traffic analysis</div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-white/60">Step {currentStep + 1} of {steps.length}</div>
              <button
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                  if (currentStep === 1) {
                    setCompletedConcepts([...completedConcepts, 'computational_thinking']);
                    setCurrentConcept('security_procedures');
                  }
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg"
              >
                {currentStep === steps.length - 1 ? 'Start Building!' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Algorithm Building Section */}
        {currentStep >= 2 && (
          <>
            {/* Current Algorithm Builder with Real-World Context */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{currentAlgorithmData.title}</h3>
                  <p className="text-white/80 mb-4">{currentAlgorithmData.description}</p>
                  
                  {/* Real-world context */}
                  <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-blue-300 mb-2">🌟 Real-World Context</h4>
                    <p className="text-blue-200 text-sm mb-2">{currentAlgorithmData.realWorldContext}</p>
                    <p className="text-blue-300 text-xs font-medium">{currentAlgorithmData.industryConnection}</p>
                  </div>
                  
                  <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-300">🎯 Your Challenge</h4>
                    <p className="text-yellow-200 text-sm">{currentAlgorithmData.problem}</p>
                  </div>
                </div>

                {/* Enhanced step building interface */}
                {userSteps.length < currentAlgorithmData.steps.length && currentStepData && (
                  <div className="bg-black/20 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-white mb-3">
                      Step {userSteps.length + 1}: {currentStepData.instruction}
                    </h4>
                    
                    {/* Educational enhancement: explanation */}
                    <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3 mb-4">
                      <h5 className="font-bold text-green-300 text-sm mb-1">💡 Why This Matters</h5>
                      <p className="text-green-200 text-sm">{currentStepData.explanation}</p>
                    </div>
                    
                    {/* Real-world example */}
                    <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3 mb-4">
                      <h5 className="font-bold text-purple-300 text-sm mb-1">🏢 Industry Example</h5>
                      <p className="text-purple-200 text-sm">{currentStepData.realWorldExample}</p>
                    </div>

                    <div className="space-y-3">
                      {['Check length requirements', 'Verify character types', 'Validate complexity', 'Apply security rules', 'Generate feedback'].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => addStep(suggestion)}
                          className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>

                    {showHint && (
                      <div className="mt-4 bg-orange-500/20 border border-orange-400/50 rounded-lg p-3">
                        <p className="text-orange-200 text-sm">💡 Hint: {currentStepData.hint}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => {
                          setShowHint(!showHint);
                          if (!showHint) {
                            setLearningMetrics(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
                          }
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </button>
                      
                      <button
                        onClick={resetAlgorithm}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Reset Algorithm
                      </button>
                    </div>
                  </div>
                )}

                {/* Algorithm completion celebration */}
                {userSteps.length === currentAlgorithmData.steps.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 border border-green-400/50 rounded-lg p-6 text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-green-300 mb-2">Algorithm Complete! 🎉</h4>
                    <p className="text-green-200 mb-4">You've successfully built a {currentAlgorithmData.title}!</p>
                    <div className="text-sm text-green-300">
                      Score earned: +{currentAlgorithmData.steps.length * 20} points
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Algorithm Progress Sidebar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">📋 Your Algorithm</h4>
                <div className="space-y-3">
                  {userSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-green-500/20 border border-green-400/50 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-200 text-sm font-medium">Step {index + 1}</span>
                      </div>
                      <p className="text-green-100 text-sm mt-1">{step}</p>
                    </motion.div>
                  ))}
                  
                  {userSteps.length < currentAlgorithmData.steps.length && (
                    <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 border-dashed">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-200 text-sm font-medium">Next Step</span>
                      </div>
                      <p className="text-yellow-100 text-sm mt-1">Waiting for your input...</p>
                    </div>
                  )}
                </div>

                {/* Progress indicators */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-sm text-white/60 mb-2">
                    <span>Algorithm Progress</span>
                    <span>{userSteps.length}/{currentAlgorithmData.steps.length}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(userSteps.length / currentAlgorithmData.steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Metacognitive Reflection Modal */}
        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 max-w-2xl w-full border border-indigo-400/50"
              >
                <h3 className="text-2xl font-bold text-white mb-4">🤔 Reflect on Your Learning</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      How confident are you in your algorithm building skills? (1-5)
                    </label>
                    <div className="flex space-x-2">
                      {[1,2,3,4,5].map(num => (
                        <button
                          key={num}
                          className={`w-10 h-10 rounded-full text-sm font-bold ${
                            reflectionData.confidence >= num 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-600 text-gray-300'
                          }`}
                          onClick={() => setReflectionData({...reflectionData, confidence: num})}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      What strategy did you use to solve this problem?
                    </label>
                    <textarea
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white"
                      placeholder="Describe your thinking process..."
                      value={reflectionData.strategy}
                      onChange={(e) => setReflectionData({...reflectionData, strategy: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      How does this connect to what you already know about cybersecurity?
                    </label>
                    <textarea
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white"
                      placeholder="What connections can you make?"
                      value={reflectionData.connections}
                      onChange={(e) => setReflectionData({...reflectionData, connections: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      What would you like to learn next?
                    </label>
                    <textarea
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white"
                      placeholder="What are your next learning goals?"
                      value={reflectionData.nextSteps}
                      onChange={(e) => setReflectionData({...reflectionData, nextSteps: e.target.value})}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                    onClick={() => setShowReflection(false)}
                  >
                    Skip Reflection
                  </button>
                  <button 
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg"
                    onClick={handleReflectionComplete}
                  >
                    Complete Reflection
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EnhancedAlgorithmTutorial;
