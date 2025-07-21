import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Shield, Lock, Eye, Server } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Virtual Machine Setup Tutorial
export const VMSetupTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [vmStatus, setVmStatus] = useState('off');
  const [selectedOS, setSelectedOS] = useState('');
  const [ramAllocation, setRamAllocation] = useState(2048);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      title: 'Choose Operating System',
      description: 'Select a virtual machine operating system for cybersecurity practice',
      task: 'Choose Kali Linux for penetration testing or Ubuntu for general cybersecurity work',
      options: ['Kali Linux', 'Ubuntu Linux', 'Windows 10', 'Parrot Security OS'],
      correct: ['Kali Linux', 'Parrot Security OS']
    },
    {
      title: 'Configure Memory',
      description: 'Allocate appropriate RAM for your virtual machine',
      task: 'Set RAM between 2GB-4GB for optimal performance',
      minRam: 2048,
      maxRam: 4096
    },
    {
      title: 'Network Configuration',
      description: 'Configure network settings for security testing',
      task: 'Choose NAT mode for isolated network testing',
      options: ['Bridged', 'NAT', 'Host-only', 'Internal'],
      correct: ['NAT', 'Host-only']
    },
    {
      title: 'Security Settings',
      description: 'Enable security features for safe testing',
      task: 'Enable snapshots and disable shared folders for security',
      features: ['Snapshots', 'Shared Folders', 'USB Support', 'Network Adapter']
    }
  ];

  const handleStepComplete = () => {
    const step = steps[currentStep];
    let stepScore = 0;

    if (currentStep === 0 && step.correct?.includes(selectedOS)) {
      stepScore = 25;
    } else if (currentStep === 1 && ramAllocation >= step.minRam! && ramAllocation <= step.maxRam!) {
      stepScore = 25;
    } else if (currentStep === 2 && selectedOS && step.correct?.includes(selectedOS)) {
      stepScore = 25;
    } else if (currentStep === 3) {
      stepScore = 25;
    }

    setScore(score + stepScore);

    if (currentStep + 1 >= steps.length) {
      setVmStatus('running');
      setCompleted(true);
    } else {
      setCurrentStep(currentStep + 1);
      setSelectedOS('');
    }
  };

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          Virtual Machine Configured! 💻
        </h3>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🖥️</div>
          <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
            <p className="text-green-200 font-bold">VM Status: Running ✅</p>
            <p className="text-white/90 text-sm mt-2">
              Your virtual machine is ready for cybersecurity practice!
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 mb-4">
          <p className="text-white font-bold text-center">🎮 You've unlocked Virtumon!</p>
          <p className="text-white/90 text-sm text-center">
            Score: {score}/100 - {score >= 80 ? 'Expert VM Administrator!' : 'Good VM setup skills!'}
          </p>
        </div>
        <button
          onClick={() => onComplete(score)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
        >
          Complete Tutorial
        </button>
      </motion.div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        💻 Virtual Machine Setup Lab
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Step Instructions */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Step {currentStep + 1}: {currentStepData.title}
          </h4>
          <p className="text-white/90 mb-4">{currentStepData.description}</p>
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <p className="text-white text-sm font-bold">Task:</p>
            <p className="text-white/90 text-sm">{currentStepData.task}</p>
          </div>
          
          {/* Step-specific controls */}
          {currentStep === 0 && (
            <div className="space-y-2">
              <p className="text-white font-bold text-sm">Select OS:</p>
              {currentStepData.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOS(option)}
                  className={`w-full p-2 rounded text-left ${
                    selectedOS === option 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {currentStep === 1 && (
            <div>
              <p className="text-white font-bold text-sm mb-2">RAM Allocation: {ramAllocation}MB</p>
              <input
                type="range"
                min="1024"
                max="8192"
                step="512"
                value={ramAllocation}
                onChange={(e) => setRamAllocation(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>1GB</span>
                <span>8GB</span>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-2">
              <p className="text-white font-bold text-sm">Network Mode:</p>
              {currentStepData.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOS(option)}
                  className={`w-full p-2 rounded text-left ${
                    selectedOS === option 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-2">
              <p className="text-white font-bold text-sm">Security Features:</p>
              {currentStepData.features?.map((feature) => (
                <label key={feature} className="flex items-center space-x-2 text-white/90">
                  <input type="checkbox" className="rounded" />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* VM Display */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Virtual Machine Preview</h4>
          <div className="bg-black rounded-lg p-4 h-64 flex items-center justify-center">
            {vmStatus === 'off' ? (
              <div className="text-center">
                <div className="text-4xl mb-2">💻</div>
                <p className="text-gray-400">VM Powered Off</p>
                <p className="text-gray-500 text-sm">Complete setup to start</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2 animate-pulse">🖥️</div>
                <p className="text-green-400">VM Running</p>
                <p className="text-green-300 text-sm">{selectedOS || 'Linux'} Ready</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-white/80 text-sm">
              <span>OS:</span>
              <span>{selectedOS || 'Not Selected'}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>RAM:</span>
              <span>{ramAllocation}MB</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Status:</span>
              <span className={vmStatus === 'running' ? 'text-green-400' : 'text-red-400'}>
                {vmStatus === 'running' ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Lab
        </button>
        <button
          onClick={handleStepComplete}
          disabled={currentStep === 0 && !selectedOS}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          {currentStep + 1 >= steps.length ? 'Start VM' : 'Next Step'}
        </button>
      </div>
    </motion.div>
  );
};

// Linux Commands Tutorial
export const LinuxCommandsTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCommand, setUserCommand] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('$ ');
  const [score, setScore] = useState(0);
  const [fileSystem, setFileSystem] = useState({
    '/home/student': ['documents', 'downloads', 'secret.txt'],
    '/home/student/documents': ['report.pdf', 'notes.txt'],
    '/home/student/downloads': ['malware.exe', 'safe_file.txt']
  });
  const [currentDirectory, setCurrentDirectory] = useState('/home/student');

  const challenges = [
    {
      title: 'List Files',
      description: 'Use the ls command to see what files are in the current directory',
      command: 'ls',
      hint: 'Type "ls" to list files and folders',
      expectedOutput: 'documents  downloads  secret.txt'
    },
    {
      title: 'Navigate Directories',
      description: 'Change to the documents directory',
      command: 'cd documents',
      hint: 'Use "cd documents" to change directory',
      expectedOutput: '/home/student/documents'
    },
    {
      title: 'View File Contents',
      description: 'Look at the contents of notes.txt',
      command: 'cat notes.txt',
      hint: 'Use "cat filename" to view file contents',
      expectedOutput: 'These are my cybersecurity study notes.\nRemember: Always verify file integrity!'
    },
    {
      title: 'Find Hidden Files',
      description: 'List all files including hidden ones',
      command: 'ls -la',
      hint: 'Use "ls -la" to show all files including hidden ones',
      expectedOutput: 'drwxr-xr-x  .  ..  .hidden_config  report.pdf  notes.txt'
    },
    {
      title: 'Search for Text',
      description: 'Search for the word "malware" in all files',
      command: 'grep -r malware',
      hint: 'Use "grep -r searchterm" to search recursively',
      expectedOutput: 'downloads/malware.exe: This file contains malicious code'
    }
  ];

  const executeCommand = () => {
    const challenge = challenges[currentChallenge];
    const command = userCommand.trim().toLowerCase();
    
    if (command === challenge.command.toLowerCase()) {
      setTerminalOutput(prev => prev + userCommand + '\n' + challenge.expectedOutput + '\n$ ');
      setScore(score + 1);
      setUserCommand('');
      
      // Update current directory if cd command
      if (command.startsWith('cd ')) {
        const newDir = command.split(' ')[1];
        if (newDir === 'documents') {
          setCurrentDirectory('/home/student/documents');
        }
      }
      
      setTimeout(() => {
        if (currentChallenge + 1 >= challenges.length) {
          onComplete(score * 20);
        } else {
          setCurrentChallenge(currentChallenge + 1);
        }
      }, 2000);
    } else {
      setTerminalOutput(prev => prev + userCommand + '\nCommand not found or incorrect. Try again!\n$ ');
      setUserCommand('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    }
  };

  const currentChallengeData = challenges[currentChallenge];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🐧 Linux Command Line Academy
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Challenge Instructions */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Challenge {currentChallenge + 1}: {currentChallengeData.title}
          </h4>
          <p className="text-white/90 mb-4">{currentChallengeData.description}</p>
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <p className="text-white text-sm font-bold">Goal:</p>
            <p className="text-white/90 text-sm">{currentChallengeData.description}</p>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 mb-4">
            <p className="text-yellow-200 text-sm">
              💡 <strong>Hint:</strong> {currentChallengeData.hint}
            </p>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3">
            <p className="text-blue-200 text-sm font-bold">File System:</p>
            <div className="mt-2 text-blue-100 text-xs font-mono">
              <div>📁 /home/student/</div>
              <div className="ml-4">📁 documents/</div>
              <div className="ml-8">📄 report.pdf</div>
              <div className="ml-8">📄 notes.txt</div>
              <div className="ml-4">📁 downloads/</div>
              <div className="ml-8">⚠️ malware.exe</div>
              <div className="ml-8">📄 safe_file.txt</div>
              <div className="ml-4">🔒 secret.txt</div>
            </div>
          </div>
        </div>
        
        {/* Terminal */}
        <div className="bg-black rounded-lg p-4">
          <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white/60 text-sm ml-4">Terminal</span>
          </div>
          
          <div className="bg-black rounded-b-lg p-4 h-64 overflow-y-auto">
            <div className="text-green-400 font-mono text-sm mb-2">
              student@cybersec-vm:{currentDirectory}$
            </div>
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
              {terminalOutput}
            </pre>
            <div className="flex items-center">
              <span className="text-green-400 font-mono text-sm">$ </span>
              <input
                type="text"
                value={userCommand}
                onChange={(e) => setUserCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none ml-1"
                placeholder="Type your command..."
                autoFocus
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between text-white/60 text-sm">
            <span>Current Directory: {currentDirectory}</span>
            <span>Score: {score}/{challenges.length}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Terminal
        </button>
        <button
          onClick={() => setUserCommand(currentChallengeData.command)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Show Command
        </button>
      </div>
    </motion.div>
  );
};

// AI Ethics Tutorial
export const AIEthicsTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const scenarios = [
    {
      title: 'Facial Recognition Privacy',
      scenario: 'Your school wants to install facial recognition cameras for security. Students are concerned about privacy.',
      question: 'What should be the primary consideration?',
      options: [
        'Security is most important, install immediately',
        'Balance security needs with student privacy rights',
        'Only install if students vote to approve it',
        'Facial recognition is never acceptable in schools'
      ],
      correct: 1,
      explanation: 'Balancing security needs with privacy rights follows ethical AI principles. This requires transparent policies, consent mechanisms, and data protection safeguards.'
    },
    {
      title: 'AI Bias in Hiring',
      scenario: 'A company uses AI to screen job applications, but it seems to favor certain demographic groups over others.',
      question: 'What is the most important action to take?',
      options: [
        'Continue using the AI since it saves time',
        'Audit the AI system for bias and retrain it',
        'Only use human reviewers for hiring',
        'Ignore the bias since AI is objective'
      ],
      correct: 1,
      explanation: 'AI systems can perpetuate or amplify existing biases. Regular auditing and retraining with diverse datasets helps ensure fairness and equality.'
    },
    {
      title: 'Deepfake Detection',
      scenario: 'You discover a deepfake video of a classmate saying embarrassing things. They ask for your help.',
      question: 'What should you do first?',
      options: [
        'Share it with friends to warn them',
        'Help them report it to platforms and authorities',
        'Ignore it since it\'s not real',
        'Create a counter-deepfake to fight back'
      ],
      correct: 1,
      explanation: 'Deepfakes can cause real harm even though they\'re fake. The best response is to help the victim report it through proper channels and support them.'
    },
    {
      title: 'Data Collection Consent',
      scenario: 'An app you\'re developing could help students study better, but it needs to collect their browsing data.',
      question: 'How should you handle data collection?',
      options: [
        'Collect all data possible for better features',
        'Only collect necessary data with clear consent',
        'Collect data but don\'t tell users what it\'s for',
        'Don\'t collect any data at all'
      ],
      correct: 1,
      explanation: 'Data minimization and informed consent are key principles. Collect only what\'s necessary, be transparent about usage, and give users control over their data.'
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex.toString());
    setShowExplanation(true);
    
    if (answerIndex === scenarios[currentScenario].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentScenario + 1 >= scenarios.length) {
        onComplete(score * 25);
      } else {
        setCurrentScenario(currentScenario + 1);
        setSelectedAnswer('');
        setShowExplanation(false);
      }
    }, 4000);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🤖 AI Ethics Challenge Center
      </h3>
      
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-bold text-white mb-2">
          Scenario {currentScenario + 1}: {currentScenarioData.title}
        </h4>
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-white/90 mb-3">{currentScenarioData.scenario}</p>
          <p className="text-white font-bold">{currentScenarioData.question}</p>
        </div>
        
        <div className="space-y-3">
          {currentScenarioData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                showExplanation
                  ? index === currentScenarioData.correct
                    ? 'bg-green-500 text-white'
                    : selectedAnswer === index.toString()
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white/60'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="font-bold">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          ))}
        </div>
        
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-blue-500/20 border border-blue-400/50 rounded-lg p-4"
          >
            <h5 className="text-blue-200 font-bold mb-2">Explanation:</h5>
            <p className="text-blue-100 text-sm">{currentScenarioData.explanation}</p>
          </motion.div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-bold mb-3">AI Ethics Principles</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-white/80">
              <Shield className="w-4 h-4 mr-2 text-blue-400" />
              <span>Privacy & Data Protection</span>
            </div>
            <div className="flex items-center text-white/80">
              <Eye className="w-4 h-4 mr-2 text-green-400" />
              <span>Transparency & Accountability</span>
            </div>
            <div className="flex items-center text-white/80">
              <Monitor className="w-4 h-4 mr-2 text-purple-400" />
              <span>Fairness & Non-discrimination</span>
            </div>
            <div className="flex items-center text-white/80">
              <Lock className="w-4 h-4 mr-2 text-red-400" />
              <span>Safety & Security</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-bold mb-3">Progress</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-white/80">
              <span>Scenario:</span>
              <span>{currentScenario + 1} of {scenarios.length}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Score:</span>
              <span>{score}/{scenarios.length}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Ethics Center
        </button>
      </div>
    </motion.div>
  );
};

// Cryptography Challenge
export const CryptographyTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const challenges = [
    {
      title: 'Caesar Cipher',
      description: 'Decode this message that was shifted by 3 positions in the alphabet',
      ciphertext: 'FUBHUVWB LV IXQ',
      solution: 'SECURITY IS FUN',
      hint: 'Each letter is shifted 3 positions forward. A→D, B→E, C→F...',
      method: 'Replace each letter with the one 3 positions earlier in the alphabet'
    },
    {
      title: 'Binary Message',
      description: 'Convert this binary code to letters (A=01000001, B=01000010, etc.)',
      ciphertext: '01001000 01000101 01001100 01001100 01001111',
      solution: 'HELLO',
      hint: 'Each 8-bit group represents one letter. Use ASCII values.',
      method: 'Convert each 8-bit binary number to its ASCII character'
    },
    {
      title: 'Base64 Encoding',
      description: 'Decode this Base64 encoded message',
      ciphertext: 'Q3liZXJTZWM=',
      solution: 'CYBERSEC',
      hint: 'Base64 uses A-Z, a-z, 0-9, +, / characters to encode data',
      method: 'Use a Base64 decoder or understand the encoding table'
    },
    {
      title: 'Simple Substitution',
      description: 'Each letter is replaced with another. Find the pattern!',
      ciphertext: 'NRRO JDBL',
      solution: 'GOOD LUCK',
      hint: 'N=G, R=O, O=O, space, J=L, D=U, B=C, L=K',
      method: 'Look for common words and letter patterns to find substitutions'
    }
  ];

  const checkAnswer = () => {
    const challenge = challenges[currentChallenge];
    if (userAnswer.toUpperCase().trim() === challenge.solution) {
      setScore(score + 1);
      setTimeout(() => {
        if (currentChallenge + 1 >= challenges.length) {
          onComplete(score * 25);
        } else {
          setCurrentChallenge(currentChallenge + 1);
          setUserAnswer('');
          setHint('');
          setShowSolution(false);
        }
      }, 2000);
    } else {
      setHint('❌ Not quite right. Try again or use a hint!');
    }
  };

  const currentChallengeData = challenges[currentChallenge];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🔐 Cryptography Puzzle Palace
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Challenge */}
        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Challenge {currentChallenge + 1}: {currentChallengeData.title}
          </h4>
          <p className="text-white/90 mb-4">{currentChallengeData.description}</p>
          
          <div className="bg-black rounded-lg p-4 mb-4">
            <h5 className="text-green-400 font-bold text-sm mb-2">Encrypted Message:</h5>
            <div className="text-green-300 font-mono text-lg break-all">
              {currentChallengeData.ciphertext}
            </div>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your decoded message..."
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20"
            />
            
            <button
              onClick={checkAnswer}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
            >
              Check Answer
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setHint(currentChallengeData.hint)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded text-sm"
              >
                Show Hint
              </button>
              <button
                onClick={() => {
                  setShowSolution(true);
                  setUserAnswer(currentChallengeData.solution);
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1 rounded text-sm"
              >
                Show Solution
              </button>
            </div>
          </div>
          
          {hint && (
            <div className="mt-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
              <p className="text-yellow-200 text-sm">{hint}</p>
            </div>
          )}
        </div>
        
        {/* Method Explanation */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Decryption Method</h4>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-white/90 text-sm">{currentChallengeData.method}</p>
          </div>
          
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Cryptography Tools:</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-500/20 rounded p-2">
                <div className="text-blue-300 font-bold">Caesar Cipher</div>
                <div className="text-blue-200">Letter shifting</div>
              </div>
              <div className="bg-green-500/20 rounded p-2">
                <div className="text-green-300 font-bold">Binary</div>
                <div className="text-green-200">0s and 1s</div>
              </div>
              <div className="bg-purple-500/20 rounded p-2">
                <div className="text-purple-300 font-bold">Base64</div>
                <div className="text-purple-200">Encoding scheme</div>
              </div>
              <div className="bg-red-500/20 rounded p-2">
                <div className="text-red-300 font-bold">Substitution</div>
                <div className="text-red-200">Letter replacement</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Progress:</span>
              <span>{currentChallenge + 1}/{challenges.length}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Score:</span>
              <span>{score}/{challenges.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Palace
        </button>
      </div>
    </motion.div>
  );
};
