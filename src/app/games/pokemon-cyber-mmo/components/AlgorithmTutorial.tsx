import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, Users } from 'lucide-react';

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
}

const AlgorithmTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  const [userSteps, setUserSteps] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const steps = [
    {
      title: "What is an Algorithm? 🤔",
      description: "Learn the foundation of computational thinking",
      content: "An algorithm is a step-by-step set of instructions to solve a problem. Like a recipe for computers!"
    },
    {
      title: "Algorithms in Cybersecurity",
      description: "How algorithms protect our digital world",
      content: "Cybersecurity uses algorithms for encryption, threat detection, and secure communications!"
    },
    {
      title: "Build Your Own Algorithm",
      description: "Create step-by-step security procedures",
      content: "Let's practice creating algorithms by building cybersecurity procedures step by step!"
    }
  ];

  const algorithms = [
    {
      id: 'password-check',
      title: 'Password Security Algorithm',
      description: 'Create an algorithm to check if a password is strong',
      problem: 'How would you check if a password is secure?',
      steps: [
        { id: '1', instruction: 'Check password length (at least 8 characters)', expected: 'length >= 8', hint: 'Think about minimum character count' },
        { id: '2', instruction: 'Check for uppercase letters', expected: 'has uppercase', hint: 'A-Z characters needed' },
        { id: '3', instruction: 'Check for lowercase letters', expected: 'has lowercase', hint: 'a-z characters needed' },
        { id: '4', instruction: 'Check for numbers', expected: 'has numbers', hint: '0-9 digits needed' },
        { id: '5', instruction: 'Check for special characters', expected: 'has symbols', hint: '!@#$ characters needed' }
      ]
    },
    {
      id: 'phishing-detection',
      title: 'Phishing Email Detection Algorithm',
      description: 'Create an algorithm to identify suspicious emails',
      problem: 'How would you determine if an email might be phishing?',
      steps: [
        { id: '1', instruction: 'Check sender email address', expected: 'verify sender', hint: 'Is the sender legitimate?' },
        { id: '2', instruction: 'Look for urgent language', expected: 'check urgency', hint: 'Scammers create false urgency' },
        { id: '3', instruction: 'Examine links carefully', expected: 'verify links', hint: 'Hover to see real destination' },
        { id: '4', instruction: 'Check for spelling errors', expected: 'check grammar', hint: 'Professional emails have good grammar' },
        { id: '5', instruction: 'Verify unexpected requests', expected: 'confirm requests', hint: 'Contact sender directly if suspicious' }
      ]
    },
    {
      id: 'incident-response',
      title: 'Cyber Incident Response Algorithm',
      description: 'Create an algorithm for responding to security incidents',
      problem: 'What steps should you take when a security incident occurs?',
      steps: [
        { id: '1', instruction: 'Identify and contain the threat', expected: 'contain threat', hint: 'Stop the incident from spreading' },
        { id: '2', instruction: 'Assess the damage', expected: 'assess damage', hint: 'What was affected?' },
        { id: '3', instruction: 'Preserve evidence', expected: 'preserve evidence', hint: 'Keep logs and data for investigation' },
        { id: '4', instruction: 'Notify stakeholders', expected: 'notify team', hint: 'Alert management and users' },
        { id: '5', instruction: 'Recovery and lessons learned', expected: 'recover and learn', hint: 'Fix the issue and prevent recurrence' }
      ]
    }
  ];

  const currentAlgorithmData = algorithms[currentAlgorithm];
  const currentStepData = currentAlgorithmData.steps[userSteps.length];

  const addStep = (step: string) => {
    const newSteps = [...userSteps, step];
    setUserSteps(newSteps);
    
    // Check if step is correct
    if (step.toLowerCase().includes(currentStepData.expected.toLowerCase())) {
      setScore(score + 20);
    }
    
    // Move to next algorithm if this one is complete
    if (newSteps.length === currentAlgorithmData.steps.length) {
      setTimeout(() => {
        if (currentAlgorithm < algorithms.length - 1) {
          setCurrentAlgorithm(currentAlgorithm + 1);
          setUserSteps([]);
          setShowHint(false);
        }
      }, 2000);
    }
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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🧠 Algorithm Thinking Lab</h1>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

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
                </div>
                <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/50">
                  <div className="text-3xl mb-2">🛡️</div>
                  <h3 className="text-white font-bold">Detection Algorithms</h3>
                  <p className="text-white/80 text-sm">Identify threats and suspicious behavior automatically</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/50">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="text-white font-bold">Analysis Algorithms</h3>
                  <p className="text-white/80 text-sm">Process data to find patterns and security insights</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-white/60">Step {currentStep + 1} of {steps.length}</div>
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg"
              >
                {currentStep === steps.length - 1 ? 'Start Building!' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {currentStep >= 2 && (
          <>
            {/* Progress Dashboard */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{currentAlgorithm + 1}</div>
                  <div className="text-white/60 text-sm">Current Algorithm</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{score}</div>
                  <div className="text-white/60 text-sm">Total Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{overallProgress.toFixed(0)}%</div>
                  <div className="text-white/60 text-sm">Overall Progress</div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* Current Algorithm Builder */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">{currentAlgorithmData.title}</h2>
                <p className="text-white/80 mb-4">{currentAlgorithmData.description}</p>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-bold mb-2">Problem to Solve:</h3>
                  <p className="text-white/90">{currentAlgorithmData.problem}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-bold">Algorithm Steps:</h3>
                  
                  {/* Display completed steps */}
                  {userSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-green-500/20 border border-green-400/50 rounded-lg p-3"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-white">
                          Step {index + 1}: {step}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Current step to complete */}
                  {userSteps.length < currentAlgorithmData.steps.length && (
                    <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                      <h4 className="text-yellow-300 font-bold mb-2">
                        Step {userSteps.length + 1}: {currentStepData.instruction}
                      </h4>
                      
                      <input
                        type="text"
                        placeholder="Type your algorithm step here..."
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-500 mb-3"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            addStep(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
                        >
                          {showHint ? 'Hide' : 'Show'} Hint
                        </button>
                        <button
                          onClick={resetAlgorithm}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Reset Algorithm
                        </button>
                      </div>
                      
                      {showHint && (
                        <div className="mt-3 p-3 bg-blue-500/20 border border-blue-400/50 rounded">
                          <div className="text-blue-300 text-sm">
                            💡 Hint: {currentStepData.hint}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Algorithm complete */}
                  {userSteps.length === currentAlgorithmData.steps.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 text-center"
                    >
                      <div className="text-green-400 font-bold text-lg mb-2">
                        🎉 Algorithm Complete!
                      </div>
                      <p className="text-white/80 text-sm">
                        You've successfully built a {currentAlgorithmData.title.toLowerCase()}!
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Algorithm List */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Available Algorithms</h3>
                
                <div className="space-y-3">
                  {algorithms.map((algorithm, index) => (
                    <div
                      key={algorithm.id}
                      className={`bg-gray-800 rounded-lg p-3 ${
                        index === currentAlgorithm ? 'ring-2 ring-teal-400' : ''
                      } ${index < currentAlgorithm ? 'bg-green-500/20' : ''}`}
                    >
                      <h4 className="text-white font-bold text-sm">{algorithm.title}</h4>
                      <p className="text-white/60 text-xs">{algorithm.description}</p>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs">
                          {index < currentAlgorithm ? (
                            <span className="text-green-400">✅ Complete</span>
                          ) : index === currentAlgorithm ? (
                            <span className="text-yellow-400">🔄 In Progress</span>
                          ) : (
                            <span className="text-gray-400">⏳ Pending</span>
                          )}
                        </div>
                        <div className="text-teal-300 text-xs">
                          {algorithm.steps.length} steps
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-teal-500/20 rounded-lg">
                  <h4 className="text-teal-300 font-bold text-sm mb-2">Algorithm Tips:</h4>
                  <ul className="text-teal-200 text-xs space-y-1">
                    <li>• Break problems into small steps</li>
                    <li>• Be specific and clear</li>
                    <li>• Think about edge cases</li>
                    <li>• Test your logic</li>
                  </ul>
                </div>
              </div>
            </div>

            {currentAlgorithm === algorithms.length - 1 && userSteps.length === currentAlgorithmData.steps.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl p-6 text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  🎉 Algorithm Mastery Complete!
                </h2>
                <p className="text-white/90 mb-4">
                  Excellent work! You've learned to think algorithmically and created step-by-step
                  solutions for cybersecurity challenges. This is the foundation of computational thinking!
                </p>
                <div className="text-3xl font-bold text-white mb-4">
                  Final Score: {score} points
                </div>
                <div className="bg-white/20 rounded-lg p-4 inline-block">
                  <div className="text-white font-bold mb-2">🧠 Skills Developed:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>🔐 Security Procedures</div>
                    <div>🛡️ Threat Detection</div>
                    <div>🔍 Problem Solving</div>
                    <div>📝 Step-by-Step Thinking</div>
                  </div>
                </div>
                
                <button
                  onClick={() => onComplete(Math.max(150, score))}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-bold"
                >
                  Complete Algorithm Lab
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AlgorithmTutorial;
