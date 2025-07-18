'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Multi-Factor Authentication Interactive Tutorial
export const MFATutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userCredentials, setUserCredentials] = useState({ username: '', password: '' });
  const [mfaCodes, setMfaCodes] = useState<string[]>(['', '', '', '', '', '']);
  const [authenticationMethods, setAuthenticationMethods] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const mfaSteps = [
    {
      title: "Understanding Multi-Factor Authentication",
      description: "Learn the three pillars of authentication security",
      component: "theory"
    },
    {
      title: "Set Up Your Account",
      description: "Create secure login credentials",
      component: "setup"
    },
    {
      title: "Enable SMS Authentication",
      description: "Add your phone number for SMS codes",
      component: "sms"
    },
    {
      title: "Configure Authenticator App",
      description: "Set up TOTP with Google Authenticator",
      component: "totp"
    },
    {
      title: "Biometric Setup",
      description: "Enable fingerprint authentication",
      component: "biometric"
    },
    {
      title: "Test Your Security",
      description: "Complete the MFA challenge",
      component: "test"
    }
  ];

  const authPillars = [
    {
      name: "Something You Know",
      description: "Knowledge Factor",
      examples: ["Password", "PIN", "Security Questions"],
      icon: "🧠",
      color: "blue"
    },
    {
      name: "Something You Have", 
      description: "Possession Factor",
      examples: ["Phone", "Token", "Smart Card"],
      icon: "📱",
      color: "green"
    },
    {
      name: "Something You Are",
      description: "Inherence Factor", 
      examples: ["Fingerprint", "Face ID", "Voice Recognition"],
      icon: "👤",
      color: "purple"
    }
  ];

  const generateTOTPCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const [totpCode, setTotpCode] = useState(generateTOTPCode());

  useEffect(() => {
    const interval = setInterval(() => {
      setTotpCode(generateTOTPCode());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMFACodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCodes = [...mfaCodes];
    newCodes[index] = value;
    setMfaCodes(newCodes);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyMFA = () => {
    const enteredCode = mfaCodes.join('');
    setAttempts(attempts + 1);
    
    if (enteredCode === totpCode) {
      setScore(score + 50);
      setShowSuccess(true);
      setTimeout(() => {
        onComplete(score + 50);
      }, 2000);
    } else {
      setMfaCodes(['', '', '', '', '', '']);
      if (attempts >= 2) {
        setScore(Math.max(0, score - 10));
      }
    }
  };

  const renderTheoryStep = () => (
    <div className="grid md:grid-cols-3 gap-6">
      {authPillars.map((pillar, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className={`bg-gradient-to-br from-${pillar.color}-500 to-${pillar.color}-600 rounded-xl p-6 text-white`}
        >
          <div className="text-6xl mb-4 text-center">{pillar.icon}</div>
          <h3 className="text-xl font-bold mb-2 text-center">{pillar.name}</h3>
          <p className="text-center text-white/80 mb-4">{pillar.description}</p>
          <div className="space-y-2">
            {pillar.examples.map((example, idx) => (
              <div key={idx} className="bg-white/20 rounded-lg p-2 text-center text-sm">
                {example}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSetupStep = () => (
    <div className="max-w-md mx-auto bg-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Create Your Account</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-2">Username</label>
          <input
            type="text"
            value={userCredentials.username}
            onChange={(e) => setUserCredentials({...userCredentials, username: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
            placeholder="Enter username"
          />
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-2">Password</label>
          <input
            type="password"
            value={userCredentials.password}
            onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
            placeholder="Enter secure password"
          />
        </div>
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
          <h4 className="text-yellow-200 font-bold text-sm mb-2">Password Security Tips:</h4>
          <ul className="text-yellow-100 text-xs space-y-1">
            <li>• Use at least 12 characters</li>
            <li>• Mix uppercase, lowercase, numbers, symbols</li>
            <li>• Avoid personal information</li>
            <li>• Use unique passwords for each account</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSMSStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">SMS Authentication Setup</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl">📱</div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <button 
            onClick={() => {
              setScore(score + 10);
              setAuthenticationMethods([...authenticationMethods, 'SMS']);
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
          >
            Send Verification Code
          </button>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-xl p-4">
        <div className="flex items-center justify-center mb-2">
          <span className="text-green-400 text-sm">📞 SMS Received</span>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <span className="text-green-400 font-mono">Your verification code: 923847</span>
        </div>
      </div>
    </div>
  );

  const renderTOTPStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Authenticator App Setup</h3>
        
        <div className="text-center mb-6">
          <div className="bg-white p-4 rounded-lg inline-block">
            <div className="text-8xl">📱</div>
            <div className="text-black text-xs mt-2">QR Code</div>
          </div>
          <p className="text-white/80 text-sm mt-2">Scan with Google Authenticator</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Current Code:</span>
            <span className="text-green-400 font-mono text-xl">{totpCode}</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div className="bg-green-400 h-2 rounded-full w-1/2"></div>
          </div>
          <p className="text-white/60 text-xs mt-1">Refreshes every 30 seconds</p>
        </div>
        
        <button 
          onClick={() => {
            setScore(score + 15);
            setAuthenticationMethods([...authenticationMethods, 'TOTP']);
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold"
        >
          Verify Authenticator App
        </button>
      </div>
    </div>
  );

  const renderBiometricStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Biometric Authentication</h3>
        
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-4"
          >
            👆
          </motion.div>
          <p className="text-white/80">Place your finger on the sensor</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-green-400 text-sm mb-2">✓ Fingerprint Detected</div>
            <div className="text-white/80 text-xs">Biometric template saved securely</div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setScore(score + 15);
            setAuthenticationMethods([...authenticationMethods, 'Biometric']);
          }}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-bold"
        >
          Enable Biometric Login
        </button>
      </div>
    </div>
  );

  const renderTestStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center">MFA Security Test</h3>
        
        <div className="mb-6">
          <p className="text-white/80 text-center mb-4">
            Enter the 6-digit code from your authenticator app:
          </p>
          <div className="text-center mb-2">
            <span className="text-green-400 font-mono text-lg">Current Code: {totpCode}</span>
          </div>
          
          <div className="flex justify-center space-x-2 mb-4">
            {mfaCodes.map((code, index) => (
              <input
                key={index}
                id={`mfa-input-${index}`}
                type="text"
                maxLength={1}
                value={code}
                onChange={(e) => handleMFACodeInput(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-bold bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
              />
            ))}
          </div>
          
          {attempts > 0 && !showSuccess && (
            <div className="text-red-400 text-sm text-center mb-2">
              Incorrect code. Attempts: {attempts}/3
            </div>
          )}
        </div>
        
        <button 
          onClick={verifyMFA}
          disabled={mfaCodes.some(code => !code) || showSuccess}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white py-2 rounded-lg font-bold"
        >
          Verify MFA Code
        </button>
        
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-green-500/20 border border-green-400/50 rounded-lg text-center"
          >
            <div className="text-green-400 text-lg mb-2">🎉 MFA Setup Complete!</div>
            <div className="text-white/80 text-sm">Your account is now secured with multiple factors</div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const currentStepData = mfaSteps[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          🔐 Multi-Factor Authentication Lab
        </h2>
        <p className="text-white/80">Learn to secure accounts with multiple authentication factors</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-white/60 text-sm mb-2">
          <span>Step {currentStep + 1} of {mfaSteps.length}</span>
          <span>Score: {score} points</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / mfaSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-2">{currentStepData.title}</h3>
        <p className="text-white/80 mb-6">{currentStepData.description}</p>

        {currentStepData.component === 'theory' && renderTheoryStep()}
        {currentStepData.component === 'setup' && renderSetupStep()}
        {currentStepData.component === 'sms' && renderSMSStep()}
        {currentStepData.component === 'totp' && renderTOTPStep()}
        {currentStepData.component === 'biometric' && renderBiometricStep()}
        {currentStepData.component === 'test' && renderTestStep()}
      </div>

      {/* Navigation */}
      {!showSuccess && (
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Previous
          </button>
          
          <button
            onClick={() => {
              if (currentStep + 1 >= mfaSteps.length) {
                onComplete(score);
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {currentStep + 1 >= mfaSteps.length ? 'Complete Tutorial' : 'Next Step'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Binary and Hexadecimal Number Games
export const BinaryHexGamesTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStates, setGameStates] = useState({
    binaryToDecimal: { current: 0, answers: [] as number[] },
    decimalToBinary: { current: 0, answers: [] as string[] },
    hexToDecimal: { current: 0, answers: [] as number[] },
    asciiDecoding: { current: 0, answers: [] as string[] }
  });

  const games = [
    {
      id: 'binary-to-decimal',
      title: 'Binary to Decimal Converter',
      description: 'Convert binary numbers to decimal',
      icon: '📊'
    },
    {
      id: 'decimal-to-binary', 
      title: 'Decimal to Binary Challenge',
      description: 'Convert decimal numbers to binary',
      icon: '🔢'
    },
    {
      id: 'hex-decoder',
      title: 'Hexadecimal Decoder',
      description: 'Convert hex values to decimal',
      icon: '🎯'
    },
    {
      id: 'ascii-message',
      title: 'ASCII Secret Messages',
      description: 'Decode hidden ASCII messages',
      icon: '📝'
    }
  ];

  // Game data generators
  const generateBinaryNumber = () => {
    const decimal = Math.floor(Math.random() * 255) + 1;
    return {
      decimal,
      binary: decimal.toString(2).padStart(8, '0')
    };
  };

  const generateHexNumber = () => {
    const decimal = Math.floor(Math.random() * 255) + 1;
    return {
      decimal,
      hex: decimal.toString(16).toUpperCase().padStart(2, '0')
    };
  };

  const generateASCIIMessage = () => {
    const messages = [
      "HELLO", "CYBER", "SECURE", "POKEMON", "HACKER", "SHIELD"
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const ascii = message.split('').map(char => char.charCodeAt(0));
    return { message, ascii };
  };

  const [currentQuestion, setCurrentQuestion] = useState(() => ({
    binary: generateBinaryNumber(),
    hex: generateHexNumber(),
    ascii: generateASCIIMessage()
  }));

  const checkBinaryAnswer = (answer: string) => {
    const correct = parseInt(answer) === currentQuestion.binary.decimal;
    if (correct) {
      setScore(score + 10);
      setCurrentQuestion(prev => ({ ...prev, binary: generateBinaryNumber() }));
    }
    return correct;
  };

  const checkDecimalToBinaryAnswer = (answer: string) => {
    const decimal = Math.floor(Math.random() * 255) + 1;
    const correctBinary = decimal.toString(2).padStart(8, '0');
    const correct = answer === correctBinary;
    if (correct) {
      setScore(score + 15);
    }
    return correct;
  };

  const checkHexAnswer = (answer: string) => {
    const correct = parseInt(answer) === currentQuestion.hex.decimal;
    if (correct) {
      setScore(score + 12);
      setCurrentQuestion(prev => ({ ...prev, hex: generateHexNumber() }));
    }
    return correct;
  };

  const checkASCIIAnswer = (answer: string) => {
    const correct = answer.toUpperCase() === currentQuestion.ascii.message;
    if (correct) {
      setScore(score + 20);
      setCurrentQuestion(prev => ({ ...prev, ascii: generateASCIIMessage() }));
    }
    return correct;
  };

  const renderBinaryToDecimalGame = () => (
    <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Binary to Decimal Challenge</h3>
      
      <div className="text-center mb-6">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-green-400 font-mono text-3xl mb-2">
            {currentQuestion.binary.binary}
          </div>
          <div className="text-white/60 text-sm">Convert this binary to decimal</div>
        </div>
        
        <div className="grid grid-cols-8 gap-2 mb-4">
          {currentQuestion.binary.binary.split('').map((bit, index) => (
            <div key={index} className="bg-white/10 rounded p-2 text-center">
              <div className="text-white font-bold">{bit}</div>
              <div className="text-white/60 text-xs">{Math.pow(2, 7-index)}</div>
            </div>
          ))}
        </div>
      </div>

      <BinaryGameInput onAnswer={checkBinaryAnswer} />
    </div>
  );

  const renderHexDecoderGame = () => (
    <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Hexadecimal Decoder</h3>
      
      <div className="text-center mb-6">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-green-400 font-mono text-3xl mb-2">
            0x{currentQuestion.hex.hex}
          </div>
          <div className="text-white/60 text-sm">Convert this hex to decimal</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <h4 className="text-white font-bold mb-2">Hex Reference:</h4>
          <div className="grid grid-cols-8 gap-2 text-sm">
            {['0=0', '1=1', '2=2', '3=3', '4=4', '5=5', '6=6', '7=7'].map((ref, idx) => (
              <div key={idx} className="text-white/80">{ref}</div>
            ))}
            {['8=8', '9=9', 'A=10', 'B=11', 'C=12', 'D=13', 'E=14', 'F=15'].map((ref, idx) => (
              <div key={idx} className="text-white/80">{ref}</div>
            ))}
          </div>
        </div>
      </div>

      <HexGameInput onAnswer={checkHexAnswer} />
    </div>
  );

  const renderASCIIGame = () => (
    <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">ASCII Secret Messages</h3>
      
      <div className="text-center mb-6">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-green-400 font-mono text-lg mb-2">
            {currentQuestion.ascii.ascii.join(' ')}
          </div>
          <div className="text-white/60 text-sm">Decode this ASCII message</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <h4 className="text-white font-bold mb-2">ASCII Hint:</h4>
          <div className="text-white/80 text-sm">
            A=65, B=66, C=67... Z=90
          </div>
        </div>
      </div>

      <ASCIIGameInput onAnswer={checkASCIIAnswer} />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          🔢 Binary & Hex Number Games
        </h2>
        <p className="text-white/80">Master different number systems used in cybersecurity</p>
      </div>

      {/* Game Selection */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {games.map((game, index) => (
          <button
            key={game.id}
            onClick={() => setCurrentGame(index)}
            className={`p-4 rounded-lg text-center transition-all ${
              currentGame === index
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <div className="text-3xl mb-2">{game.icon}</div>
            <div className="font-bold text-sm">{game.title}</div>
          </button>
        ))}
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4 inline-block">
          <span className="text-yellow-200 font-bold">Current Score: {score} points</span>
        </div>
      </div>

      {/* Game Content */}
      <div className="mb-8">
        {currentGame === 0 && renderBinaryToDecimalGame()}
        {currentGame === 1 && <DecimalToBinaryGame onAnswer={checkDecimalToBinaryAnswer} />}
        {currentGame === 2 && renderHexDecoderGame()}
        {currentGame === 3 && renderASCIIGame()}
      </div>

      {/* Completion */}
      {score >= 100 && (
        <div className="text-center">
          <button
            onClick={() => onComplete(score)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            Complete Number Games! 🎉
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Steganography and Hidden Messages Tutorial
export const SteganographyTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [discoveredMessages, setDiscoveredMessages] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const challenges = [
    {
      title: "Introduction to Steganography",
      description: "Learn the art of hiding information in plain sight",
      type: "theory"
    },
    {
      title: "LSB (Least Significant Bit) Method",
      description: "Hide messages in image pixels",
      type: "lsb-demo"
    },
    {
      title: "Text Message Hidden in Image",
      description: "Find the secret message hidden in this Pokemon image",
      type: "image-decode"
    },
    {
      title: "Audio Steganography",
      description: "Discover hidden data in sound files",
      type: "audio-decode"
    },
    {
      title: "Create Your Own Hidden Message",
      description: "Hide a secret message in an image",
      type: "encode-message"
    },
    {
      title: "Digital Forensics Challenge",
      description: "Use forensic tools to find hidden evidence",
      type: "forensics"
    }
  ];

  const hiddenMessages = [
    { 
      image: "🖼️ pikachu_normal.jpg", 
      message: "TEAM ROCKET HIDEOUT AT VIRIDIAN CITY",
      technique: "LSB in Red Channel",
      hint: "Check the least significant bits of red pixels"
    },
    {
      image: "🖼️ pokeball_wallpaper.png",
      message: "MASTER PASSWORD: THUNDER123",
      technique: "Metadata injection", 
      hint: "Look in the EXIF data"
    },
    {
      image: "🖼️ gym_map.bmp",
      message: "SECRET ENTRANCE BEHIND WATERFALL",
      technique: "Pixel value manipulation",
      hint: "Compare pixel values with original"
    }
  ];

  const audioFiles = [
    {
      name: "🎵 battle_theme.wav",
      hiddenData: "COORDINATES: 38.9072°N 77.0369°W",
      technique: "Frequency domain hiding",
      hint: "Check the spectrogram for unusual patterns"
    },
    {
      name: "🎵 pokemon_center.mp3", 
      hiddenData: "NEXT MEETING: FRIDAY 2PM",
      technique: "Phase encoding",
      hint: "Analyze phase differences between channels"
    }
  ];

  const renderTheorySection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🖼️ Image Steganography</h3>
          <div className="space-y-3 text-white/80 text-sm">
            <div>• LSB (Least Significant Bit)</div>
            <div>• Metadata embedding</div>
            <div>• Palette manipulation</div>
            <div>• Transform domain hiding</div>
          </div>
        </div>
        
        <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🎵 Audio Steganography</h3>
          <div className="space-y-3 text-white/80 text-sm">
            <div>• Echo hiding</div>
            <div>• Phase coding</div>
            <div>• Spread spectrum</div>
            <div>• Parity coding</div>
          </div>
        </div>
        
        <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📄 Text Steganography</h3>
          <div className="space-y-3 text-white/80 text-sm">
            <div>• Invisible watermarks</div>
            <div>• White space encoding</div>
            <div>• Word shifting</div>
            <div>• Line shifting</div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🔍 Why Steganography Matters in Cybersecurity</h3>
        <div className="grid md:grid-cols-2 gap-4 text-white/80 text-sm">
          <div>
            <h4 className="font-bold text-white mb-2">Defensive Uses:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Digital watermarking</li>
              <li>• Copyright protection</li>
              <li>• Covert communications</li>
              <li>• Data integrity verification</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Security Concerns:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Malware hiding</li>
              <li>• Data exfiltration</li>
              <li>• Command & control</li>
              <li>• Evidence concealment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLSBDemo = () => {
    // Static data for demonstration - no hooks needed in render function
    const pixelData = [
      { r: 255, g: 128, b: 64, binary: '11111111 10000000 01000000' },
      { r: 200, g: 150, b: 100, binary: '11001000 10010110 01100100' },
      { r: 175, g: 200, b: 225, binary: '10101111 11001000 11100001' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">LSB Steganography Demonstration</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Original Pixels</h4>
              <div className="space-y-3">
                {pixelData.map((pixel, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div 
                        className="w-6 h-6 rounded mr-3"
                        style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
                      ></div>
                      <span className="text-white font-mono">RGB({pixel.r}, {pixel.g}, {pixel.b})</span>
                    </div>
                    <div className="text-green-400 font-mono text-xs">{pixel.binary}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-3">With Hidden Message "HI"</h4>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white/80 text-sm mb-2">Message bits: H=01001000, I=01101001</div>
                  <div className="text-yellow-400 font-mono text-xs">
                    Modified LSBs: 0 1 0 0 1 0 0 0 0 1 1 0 1 0 0 1
                  </div>
                </div>
                {pixelData.map((pixel, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div 
                        className="w-6 h-6 rounded mr-3"
                        style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
                      ></div>
                      <span className="text-white font-mono">Modified RGB</span>
                    </div>
                    <div className="text-red-400 font-mono text-xs">
                      {pixel.binary.replace(/([01])(?= |$)/g, (match, bit, offset) => {
                        const bitIndex = Math.floor(offset / 9);
                        return bitIndex < 8 ? `<span class="bg-red-600">${bit}</span>` : bit;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Convert to proper component to use hooks
const ImageDecodeChallenge: React.FC<{ onScoreUpdate: (points: number) => void; onMessageFound: (message: string) => void }> = ({ onScoreUpdate, onMessageFound }) => {
  const [selectedImageForDecode, setSelectedImageForDecode] = useState<number | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleDecodeAttempt = () => {
    if (selectedImageForDecode !== null) {
      const correct = hiddenMessages[selectedImageForDecode];
      if (userGuess.toUpperCase().includes(correct.message)) {
        onScoreUpdate(25);
        onMessageFound(correct.message);
          setUserGuess('');
          setSelectedImageForDecode(null);
          setShowHint(false);
        }
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">🕵️ Find Hidden Messages</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {hiddenMessages.map((item, index) => (
            <div 
              key={index}
              className={`bg-white/10 rounded-lg p-4 cursor-pointer transition-all ${
                selectedImageForDecode === index ? 'ring-2 ring-blue-400' : 'hover:bg-white/20'
              }`}
              onClick={() => setSelectedImageForDecode(index)}
            >
              <div className="text-4xl mb-2 text-center">{item.image.split(' ')[0]}</div>
              <div className="text-white font-bold text-sm text-center">{item.image.split(' ')[1]}</div>
              <div className="text-white/60 text-xs text-center mt-2">{item.technique}</div>
            </div>
          ))}
        </div>
        
        {selectedImageForDecode !== null && (
          <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4">
              Analyzing: {hiddenMessages[selectedImageForDecode].image}
            </h4>
            
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-white/80 text-sm mb-2">Steganography Analysis Tools:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-blue-600 text-white py-1 px-3 rounded text-sm">LSB Extractor</button>
                  <button className="bg-green-600 text-white py-1 px-3 rounded text-sm">Metadata Reader</button>
                  <button className="bg-purple-600 text-white py-1 px-3 rounded text-sm">Hex Viewer</button>
                  <button className="bg-red-600 text-white py-1 px-3 rounded text-sm">Pixel Analyzer</button>
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600"
                  placeholder="Enter the hidden message..."
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={handleDecodeAttempt}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Extract Message
                </button>
              </div>
              
              {showHint && (
                <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
                  <div className="text-yellow-200 text-sm">
                    💡 {hiddenMessages[selectedImageForDecode].hint}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAudioDecodeChallenge = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">🎵 Audio Steganography Lab</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {audioFiles.map((audio, index) => (
          <div key={index} className="bg-green-500/20 border border-green-400/50 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎵</div>
              <div className="text-white font-bold">{audio.name}</div>
              <div className="text-white/60 text-sm">{audio.technique}</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="text-white/80 text-sm mb-2">Audio Analysis:</div>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white/10 rounded p-2 text-xs">
                  <span className="text-green-400">◆</span> Frequency Domain Analysis
                </div>
                <div className="bg-white/10 rounded p-2 text-xs">
                  <span className="text-blue-400">◆</span> Spectrogram Generated
                </div>
                <div className="bg-white/10 rounded p-2 text-xs">
                  <span className="text-yellow-400">◆</span> Phase Analysis Complete
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setScore(score + 20);
                setDiscoveredMessages([...discoveredMessages, audio.hiddenData]);
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            >
              Extract Hidden Data
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEncodeMessageChallenge = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">🎨 Create Hidden Message</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Choose Your Cover Image</h4>
          <div className="grid grid-cols-2 gap-4">
            {['🏞️ landscape.jpg', '🐱 cat.png', '🏠 house.bmp', '🌸 flower.gif'].map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`p-4 rounded-lg text-center transition-all ${
                  selectedImage === img ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="text-3xl mb-2">{img.split(' ')[0]}</div>
                <div className="text-white text-xs">{img.split(' ')[1]}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Enter Secret Message</h4>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="w-full h-24 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 resize-none"
            placeholder="Type your secret message here..."
            maxLength={100}
          />
          <div className="text-white/60 text-xs mt-2">{userMessage.length}/100 characters</div>
        </div>
      </div>
      
      {selectedImage && userMessage && (
        <div className="bg-white/10 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Steganography Process</h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="text-white text-sm">Load Image</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="text-white text-sm">Convert Message</div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="text-white text-sm">Embed in LSBs</div>
            </div>
            <div className="text-center">
              <div className="bg-red-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="text-white text-sm">Save Result</div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setScore(score + 30);
              setDiscoveredMessages([...discoveredMessages, `Hidden: "${userMessage}"`]);
            }}
            className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-bold"
          >
            Embed Message in {selectedImage}
          </button>
        </div>
      )}
    </div>
  );

  const renderForensicsChallenge = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">🔍 Digital Forensics Investigation</h3>
      
      <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Cyber Crime Scene</h4>
        <p className="text-white/80 mb-4">
          A suspicious file has been found on a suspect's computer. Use forensic tools to uncover hidden evidence.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h5 className="text-white font-bold mb-2">📄 evidence.docx</h5>
            <div className="text-white/60 text-sm space-y-1">
              <div>Size: 2.4 MB</div>
              <div>Created: 2024-01-15</div>
              <div>Modified: 2024-01-20</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h5 className="text-white font-bold mb-2">🖼️ vacation.jpg</h5>
            <div className="text-white/60 text-sm space-y-1">
              <div>Size: 15.7 MB</div>
              <div>Dimensions: 4000x3000</div>
              <div>Unusually large for content</div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h5 className="text-white font-bold mb-2">🎵 music.mp3</h5>
            <div className="text-white/60 text-sm space-y-1">
              <div>Duration: 3:45</div>
              <div>Bitrate: 320 kbps</div>
              <div>Metadata anomalies detected</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <h5 className="text-white font-bold mb-3">Forensic Tools Available:</h5>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-blue-600 text-white py-2 px-3 rounded text-sm">Steghide</button>
            <button className="bg-green-600 text-white py-2 px-3 rounded text-sm">Binwalk</button>
            <button className="bg-purple-600 text-white py-2 px-3 rounded text-sm">ExifTool</button>
            <button className="bg-red-600 text-white py-2 px-3 rounded text-sm">Hex Editor</button>
            <button className="bg-yellow-600 text-white py-2 px-3 rounded text-sm">Strings</button>
            <button className="bg-indigo-600 text-white py-2 px-3 rounded text-sm">File</button>
          </div>
        </div>
        
        <button
          onClick={() => {
            setScore(score + 40);
            setDiscoveredMessages([...discoveredMessages, "CRIMINAL EVIDENCE FOUND: Bank account numbers hidden in vacation.jpg"]);
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold"
        >
          Complete Forensic Analysis
        </button>
      </div>
    </div>
  );

  const currentChallenge = challenges[currentChallengeIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-6xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          🔍 Steganography & Hidden Messages
        </h2>
        <p className="text-white/80">Master the art of hiding and finding secret information</p>
      </div>

      {/* Progress & Score */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white/10 rounded-lg p-3">
          <span className="text-white/80 text-sm">Challenge {currentChallengeIndex + 1} of {challenges.length}</span>
        </div>
        <div className="bg-yellow-500/20 rounded-lg p-3">
          <span className="text-yellow-200 font-bold">Score: {score} points</span>
        </div>
        <div className="bg-green-500/20 rounded-lg p-3">
          <span className="text-green-200 text-sm">Messages Found: {discoveredMessages.length}</span>
        </div>
      </div>

      {/* Challenge Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
        {challenges.map((challenge, index) => (
          <button
            key={index}
            onClick={() => setCurrentChallengeIndex(index)}
            className={`p-3 rounded-lg text-center transition-all ${
              currentChallengeIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <div className="font-bold text-xs">{challenge.title}</div>
          </button>
        ))}
      </div>

      {/* Challenge Content */}
      <div className="mb-8">
        {currentChallengeIndex === 0 && renderTheorySection()}
        {currentChallengeIndex === 1 && renderLSBDemo()}
        {currentChallengeIndex === 2 && (
          <ImageDecodeChallenge
            onScoreUpdate={(points) => {}}
            onMessageFound={(message) => {}}
          />
        )}
        {currentChallengeIndex === 3 && renderAudioDecodeChallenge()}
        {currentChallengeIndex === 4 && renderEncodeMessageChallenge()}
        {currentChallengeIndex === 5 && renderForensicsChallenge()}
      </div>

      {/* Discovered Messages */}
      {discoveredMessages.length > 0 && (
        <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-4">🎉 Discovered Messages</h4>
          <div className="space-y-2">
            {discoveredMessages.map((message, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-3">
                <span className="text-green-400 font-mono text-sm">{message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentChallengeIndex(Math.max(0, currentChallengeIndex - 1))}
          disabled={currentChallengeIndex === 0}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Previous
        </button>
        
        {score >= 150 ? (
          <button
            onClick={() => onComplete(score)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
          >
            Complete Steganography Training! 🎉
          </button>
        ) : (
          <button
            onClick={() => setCurrentChallengeIndex(Math.min(challenges.length - 1, currentChallengeIndex + 1))}
            disabled={currentChallengeIndex === challenges.length - 1}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Main Day 4 Enhanced Tutorial Component
const Day4EnhancedTutorials: React.FC = () => {
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const tutorials = [
    {
      id: 'mfa-lab',
      title: 'Multi-Factor Authentication Lab',
      description: 'Master MFA setup and security best practices',
      icon: '🔐',
      estimatedTime: '25 minutes',
      component: MFATutorial
    },
    {
      id: 'binary-hex-games',
      title: 'Binary & Hex Number Games',
      description: 'Learn number systems through interactive challenges',
      icon: '🔢',
      estimatedTime: '20 minutes',
      component: BinaryHexGamesTutorial
    },
    {
      id: 'steganography',
      title: 'Steganography & Hidden Messages',
      description: 'Discover the art of hiding information in plain sight',
      icon: '🕵️',
      estimatedTime: '30 minutes',
      component: SteganographyTutorial
    }
  ];

  const handleTutorialComplete = (tutorialId: string, score: number) => {
    if (!completedTutorials.includes(tutorialId)) {
      setCompletedTutorials([...completedTutorials, tutorialId]);
      setTotalScore(totalScore + score);
    }
    setCurrentTutorial(null);
  };

  const handleTutorialClose = () => {
    setCurrentTutorial(null);
  };

  const overallProgress = (completedTutorials.length / tutorials.length) * 100;

  if (currentTutorial) {
    const tutorial = tutorials.find(t => t.id === currentTutorial);
    if (tutorial) {
      const TutorialComponent = tutorial.component;
      return (
        <TutorialComponent 
          tutorialId={currentTutorial}
          onComplete={(score) => handleTutorialComplete(currentTutorial, score)}
          onClose={handleTutorialClose}
        />
      );
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🛡️ Day 4 Enhanced Security Labs
          </h1>
          <p className="text-white/80 text-lg">
            Advanced security concepts: MFA, number systems, and steganography
          </p>
          
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{completedTutorials.length}</div>
                <div className="text-white/60 text-sm">Labs Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{totalScore}</div>
                <div className="text-white/60 text-sm">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{Math.round(overallProgress)}%</div>
                <div className="text-white/60 text-sm">Overall Progress</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => {
            const isCompleted = completedTutorials.includes(tutorial.id);
            
            return (
              <motion.div
                key={tutorial.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all ${
                  isCompleted 
                    ? 'ring-2 ring-green-400 bg-green-500/20' 
                    : 'hover:bg-white/20'
                }`}
                onClick={() => setCurrentTutorial(tutorial.id)}
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      ✓
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-6xl mb-4">{tutorial.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{tutorial.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{tutorial.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-white/60 mb-4">
                    <span>⏱️ {tutorial.estimatedTime}</span>
                    <span>{isCompleted ? '✅ Complete' : '🎯 Start'}</span>
                  </div>
                  
                  <button className={`w-full py-2 rounded-lg font-bold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}>
                    {isCompleted ? 'Review Lab' : 'Start Lab'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {completedTutorials.length === tutorials.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Day 4 Enhanced Labs Complete!
            </h2>
            <p className="text-white/90 mb-4">
              Outstanding work! You've mastered advanced security concepts including MFA, number systems, and steganography.
            </p>
            <div className="text-3xl font-bold text-white">
              Final Score: {totalScore} points
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Day4EnhancedTutorials;

// Game Input Components
const BinaryGameInput: React.FC<{ onAnswer: (answer: string) => boolean }> = ({ onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const correct = onAnswer(answer);
    setFeedback(correct ? '✅ Correct!' : '❌ Try again!');
    if (correct) setAnswer('');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div className="text-center">
      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-32 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 text-center"
        placeholder="Decimal"
      />
      <button
        onClick={handleSubmit}
        className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Submit
      </button>
      {feedback && <div className="mt-2 text-lg">{feedback}</div>}
    </div>
  );
};

const HexGameInput: React.FC<{ onAnswer: (answer: string) => boolean }> = ({ onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const correct = onAnswer(answer);
    setFeedback(correct ? '✅ Correct!' : '❌ Try again!');
    if (correct) setAnswer('');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div className="text-center">
      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-32 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 text-center"
        placeholder="Decimal"
      />
      <button
        onClick={handleSubmit}
        className="ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Submit
      </button>
      {feedback && <div className="mt-2 text-lg">{feedback}</div>}
    </div>
  );
};

const ASCIIGameInput: React.FC<{ onAnswer: (answer: string) => boolean }> = ({ onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const correct = onAnswer(answer);
    setFeedback(correct ? '✅ Correct!' : '❌ Try again!');
    if (correct) setAnswer('');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div className="text-center">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toUpperCase())}
        className="w-40 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 text-center"
        placeholder="MESSAGE"
      />
      <button
        onClick={handleSubmit}
        className="ml-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Submit
      </button>
      {feedback && <div className="mt-2 text-lg">{feedback}</div>}
    </div>
  );
};

const DecimalToBinaryGame: React.FC<{ onAnswer: (answer: string) => boolean }> = ({ onAnswer }) => {
  const [targetDecimal] = useState(Math.floor(Math.random() * 255) + 1);
  const [binaryInput, setBinaryInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const correctBinary = targetDecimal.toString(2).padStart(8, '0');
    const correct = binaryInput === correctBinary;
    setFeedback(correct ? '✅ Correct!' : `❌ Correct answer: ${correctBinary}`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="bg-orange-500/20 border border-orange-400/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Decimal to Binary Challenge</h3>
      
      <div className="text-center mb-6">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-green-400 font-mono text-3xl mb-2">{targetDecimal}</div>
          <div className="text-white/60 text-sm">Convert this decimal to 8-bit binary</div>
        </div>
      </div>

      <div className="text-center">
        <input
          type="text"
          value={binaryInput}
          onChange={(e) => setBinaryInput(e.target.value.replace(/[^01]/g, '').slice(0, 8))}
          className="w-64 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 text-center font-mono"
          placeholder="00000000"
          maxLength={8}
        />
        <button
          onClick={handleSubmit}
          className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Submit
        </button>
        {feedback && <div className="mt-2 text-lg">{feedback}</div>}
      </div>
    </div>
  );
};
