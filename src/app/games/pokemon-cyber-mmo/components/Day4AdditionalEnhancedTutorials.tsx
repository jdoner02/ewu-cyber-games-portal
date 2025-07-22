import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Teachable Machine Tutorial
const TeachableMachineTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [modelType, setModelType] = useState<'image' | 'audio' | 'pose'>('image');
  const [trainingData, setTrainingData] = useState<{[key: string]: string[]}>({});
  const [modelTrained, setModelTrained] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const steps = [
    {
      title: "Welcome to AI/ML Lab! 🤖",
      description: "Learn machine learning with Google's Teachable Machine",
      content: "Machine Learning allows computers to learn patterns and make predictions. Today you'll train your own AI model!"
    },
    {
      title: "Choose Your Model Type",
      description: "Select what type of data your AI will learn from",
      content: "Different types of models can recognize different kinds of patterns. Choose based on what you want to teach the computer."
    },
    {
      title: "Collect Training Data",
      description: "Gather examples for your AI to learn from",
      content: "AI needs lots of examples to learn patterns. The more diverse examples you provide, the better your model will be!"
    },
    {
      title: "Train Your Model",
      description: "Let the AI learn from your data",
      content: "The computer will analyze all your examples and find patterns that help it make predictions on new data."
    },
    {
      title: "Test Your Model",
      description: "See how well your AI performs",
      content: "Test your trained model with new examples to see how accurately it can make predictions."
    }
  ];

  const modelTypes = [
    {
      type: 'image' as const,
      name: 'Image Recognition',
      description: 'Teach AI to recognize different objects, people, or gestures',
      icon: '📷',
      examples: ['Cats vs Dogs', 'Hand Gestures', 'Safe vs Unsafe Email Images']
    },
    {
      type: 'audio' as const,
      name: 'Sound Classification',
      description: 'Train AI to recognize different sounds or voice commands',
      icon: '🎵',
      examples: ['Voice Commands', 'Music Genres', 'Security Alert Sounds']
    },
    {
      type: 'pose' as const,
      name: 'Pose Detection',
      description: 'Teach AI to recognize body positions and movements',
      icon: '🏃',
      examples: ['Exercise Forms', 'Dance Moves', 'Security Postures']
    }
  ];

  const handleDataCollection = (className: string) => {
    const currentData = trainingData[className] || [];
    const newData = [...currentData, `Sample ${currentData.length + 1}`];
    setTrainingData({ ...trainingData, [className]: newData });
    setScore(score + 5);
  };

  const trainModel = () => {
    const classes = Object.keys(trainingData);
    if (classes.length < 2 || classes.some(c => trainingData[c].length < 3)) {
      alert('Need at least 2 classes with 3+ samples each!');
      return;
    }
    
    setModelTrained(true);
    setScore(score + 50);
    
    // Simulate predictions
    setTimeout(() => {
      setPredictions([
        `✅ Sample A: ${classes[0]} (95% confidence)`,
        `✅ Sample B: ${classes[1]} (87% confidence)`,
        `✅ Sample C: ${classes[0]} (92% confidence)`
      ]);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen p-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🤖 Teachable Machine AI Lab</h1>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
          <p className="text-white/90 mb-2">{steps[currentStep].description}</p>
          <p className="text-blue-200 text-sm">{steps[currentStep].content}</p>
        </div>

        {currentStep === 1 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">🎯 Choose Your AI Model Type</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {modelTypes.map((type) => (
                <motion.div
                  key={type.type}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setModelType(type.type);
                    setScore(score + 10);
                  }}
                  className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${
                    modelType === type.type ? 'ring-2 ring-blue-400 bg-blue-500/20' : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <h4 className="text-white font-bold mb-2">{type.name}</h4>
                  <p className="text-white/80 text-sm mb-3">{type.description}</p>
                  
                  <div className="space-y-1">
                    <div className="text-white/60 text-xs font-bold">Examples:</div>
                    {type.examples.map((example, index) => (
                      <div key={index} className="text-white/60 text-xs">• {example}</div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">📊 Collect Training Data</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Class 1: Cybersecurity Images</h4>
                <div className="space-y-2 mb-4">
                  {(trainingData['cybersecurity'] || []).map((sample, index) => (
                    <div key={index} className="text-green-400 text-sm">✓ {sample}</div>
                  ))}
                </div>
                <button
                  onClick={() => handleDataCollection('cybersecurity')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                >
                  Add Cybersecurity Sample ({(trainingData['cybersecurity'] || []).length})
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Class 2: Non-Security Images</h4>
                <div className="space-y-2 mb-4">
                  {(trainingData['normal'] || []).map((sample, index) => (
                    <div key={index} className="text-blue-400 text-sm">✓ {sample}</div>
                  ))}
                </div>
                <button
                  onClick={() => handleDataCollection('normal')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                  Add Normal Sample ({(trainingData['normal'] || []).length})
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg">
              <div className="text-yellow-200 text-sm">
                💡 ML Tip: You need at least 3 samples per class, but more samples = better accuracy!
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">🧠 Train Your AI Model</h3>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              
              {!modelTrained ? (
                <div>
                  <h4 className="text-white font-bold text-lg mb-4">Ready to Train!</h4>
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="text-white/80 text-sm space-y-2">
                      <div>Training Data Summary:</div>
                      {Object.entries(trainingData).map(([className, samples]) => (
                        <div key={className}>
                          • {className}: {samples.length} samples
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={trainModel}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-bold"
                  >
                    🚀 Start Training
                  </button>
                </div>
              ) : (
                <div>
                  <div className="animate-pulse mb-4">
                    <div className="text-green-400 font-bold text-lg">Training Complete!</div>
                    <div className="text-white/80">Your AI model is ready to make predictions</div>
                  </div>
                  
                  <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
                    <div className="text-green-300 font-bold mb-2">Model Performance:</div>
                    <div className="text-white/80 text-sm">
                      • Accuracy: 94.2%
                      • Training Time: 23 seconds
                      • Ready for predictions!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">🎯 Test Your Model</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Model Predictions</h4>
                <div className="space-y-2">
                  {predictions.map((prediction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.5 }}
                      className="bg-white/10 rounded p-2 text-sm text-white"
                    >
                      {prediction}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">ML Ethics & Security</h4>
                <div className="text-white/80 text-sm space-y-2">
                  <div className="text-green-300 font-bold">✅ Good Practices:</div>
                  <div>• Diverse, representative training data</div>
                  <div>• Regular model testing and validation</div>
                  <div>• Transparent AI decision-making</div>
                  <div>• Privacy protection for training data</div>
                  
                  <div className="text-red-300 font-bold mt-4">⚠️ Potential Risks:</div>
                  <div>• Biased training data</div>
                  <div>• Adversarial attacks on models</div>
                  <div>• Privacy leaks from model inference</div>
                  <div>• Over-reliance on AI decisions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-white/60">Score: {score} points</div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 2 && Object.keys(trainingData).length < 2}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => onComplete(Math.max(100, score))}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                Complete Lab
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// CyberChef Tutorial
const CyberChefTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operations, setOperations] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const recipes = [
    {
      title: "Base64 Encoding/Decoding",
      description: "Learn to encode and decode Base64 data",
      challenge: "Decode this message: SGVsbG8gQ3liZXIgV29ybGQh",
      solution: "Hello Cyber World!",
      operation: "From Base64",
      hint: "Base64 is commonly used to encode binary data in text format"
    },
    {
      title: "ROT13 Caesar Cipher",
      description: "Decrypt a simple substitution cipher",
      challenge: "Decrypt: Plorefrphevgl vf sha!",
      solution: "Cybersecurity is fun!",
      operation: "ROT13",
      hint: "ROT13 shifts each letter 13 positions in the alphabet"
    },
    {
      title: "Hex to ASCII",
      description: "Convert hexadecimal to readable text",
      challenge: "Convert: 4861636b657220457468696373a20476f6f64",
      solution: "Hacker Ethics: Good",
      operation: "From Hex",
      hint: "Hexadecimal represents binary data using 0-9 and A-F"
    },
    {
      title: "URL Decoding",
      description: "Decode URL-encoded strings",
      challenge: "Decode: %48%61%63%6B%69%6E%67%20%69%73%20%66%75%6E%21",
      solution: "Hacking is fun!",
      operation: "URL Decode",
      hint: "URLs encode special characters as %XX where XX is hexadecimal"
    }
  ];

  const applyOperation = (op: string, inputText: string) => {
    let result = '';
    
    switch (op) {
      case 'From Base64':
        try {
          result = atob(inputText);
        } catch {
          result = 'Invalid Base64';
        }
        break;
      case 'ROT13':
        result = inputText.replace(/[a-zA-Z]/g, (char) => {
          const start = char <= 'Z' ? 65 : 97;
          return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
        });
        break;
      case 'From Hex':
        try {
          result = inputText.replace(/[^0-9A-Fa-f]/g, '').match(/.{2}/g)
            ?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
        } catch {
          result = 'Invalid Hex';
        }
        break;
      case 'URL Decode':
        try {
          result = decodeURIComponent(inputText);
        } catch {
          result = 'Invalid URL encoding';
        }
        break;
      default:
        result = inputText;
    }
    
    return result;
  };

  const handleOperationAdd = (operation: string) => {
    const newOps = [...operations, operation];
    setOperations(newOps);
    
    let result = input;
    newOps.forEach(op => {
      result = applyOperation(op, result);
    });
    setOutput(result);
    
    if (result === recipes[currentRecipe].solution) {
      setScore(score + 25);
    }
  };

  const clearRecipe = () => {
    setOperations([]);
    setOutput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🍳 CyberChef Crypto Kitchen</h1>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recipe Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📖 Crypto Recipes</h2>
            
            <div className="space-y-3">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setCurrentRecipe(index);
                    setInput(recipe.challenge);
                    clearRecipe();
                  }}
                  className={`bg-gray-800 rounded-lg p-3 cursor-pointer transition-all ${
                    currentRecipe === index ? 'ring-2 ring-orange-400' : 'hover:bg-gray-700'
                  }`}
                >
                  <h3 className="text-white font-bold text-sm">{recipe.title}</h3>
                  <p className="text-white/80 text-xs">{recipe.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-orange-500/20 rounded-lg">
              <h4 className="text-orange-300 font-bold text-sm mb-2">Current Challenge:</h4>
              <p className="text-white/80 text-xs">{recipes[currentRecipe].hint}</p>
            </div>
          </div>

          {/* Operations Panel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🧪 Operations</h2>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['From Base64', 'To Base64', 'ROT13', 'From Hex', 'To Hex', 'URL Decode', 'URL Encode', 'MD5'].map((op) => (
                <button
                  key={op}
                  onClick={() => handleOperationAdd(op)}
                  className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded text-xs"
                >
                  {op}
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white font-bold text-sm">Recipe Steps:</h3>
              <div className="bg-gray-800 rounded p-2 min-h-[100px]">
                {operations.length === 0 ? (
                  <div className="text-white/60 text-xs">Click operations above to build your recipe</div>
                ) : (
                  operations.map((op, index) => (
                    <div key={index} className="text-green-400 text-xs mb-1">
                      {index + 1}. {op}
                    </div>
                  ))
                )}
              </div>
              
              <button
                onClick={clearRecipe}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded text-xs"
              >
                Clear Recipe
              </button>
            </div>
          </div>

          {/* Input/Output Panel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🔄 Input/Output</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Input:</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-24 bg-gray-800 text-white p-2 rounded text-xs font-mono"
                  placeholder="Enter your challenge text here..."
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Output:</label>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-24 bg-gray-900 text-green-400 p-2 rounded text-xs font-mono"
                  placeholder="Results will appear here..."
                />
              </div>
              
              {output === recipes[currentRecipe].solution && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-400/50 rounded p-3 text-center"
                >
                  <div className="text-green-400 font-bold">🎉 Correct!</div>
                  <div className="text-white/80 text-xs">You successfully decoded the message!</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div className="text-white/60">Score: {score} points</div>
            <button
              onClick={() => onComplete(Math.max(100, score))}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
            >
              Complete CyberChef Lab
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// TFTP File Transfer Tutorial
const TFTPTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [serverConfig, setServerConfig] = useState({
    serverIP: '',
    port: '69',
    rootDirectory: '/tftpboot',
    readOnly: false,
    maxConnections: '10'
  });
  const [transferStatus, setTransferStatus] = useState<'idle' | 'uploading' | 'downloading' | 'complete'>('idle');
  const [files, setFiles] = useState([
    { name: 'config.txt', size: '2.4 KB', type: 'Configuration', lastModified: '2025-07-16' },
    { name: 'firmware.bin', size: '15.7 MB', type: 'Firmware', lastModified: '2025-07-15' },
    { name: 'backup.tar', size: '45.2 MB', type: 'Backup', lastModified: '2025-07-14' }
  ]);
  const [score, setScore] = useState(0);

  const steps = [
    {
      title: "Understanding TFTP",
      description: "Learn about Trivial File Transfer Protocol",
      content: "TFTP is a simple file transfer protocol commonly used for transferring configuration files, firmware updates, and network booting."
    },
    {
      title: "Server Configuration",
      description: "Set up a TFTP server",
      content: "Configure the TFTP server with proper security settings and file directory permissions."
    },
    {
      title: "File Transfer Operations",
      description: "Practice uploading and downloading files",
      content: "Learn to transfer files securely using TFTP commands and understand the protocol limitations."
    },
    {
      title: "Security Considerations",
      description: "Understand TFTP security implications",
      content: "TFTP has limited security features, so learn when and how to use it safely in network environments."
    }
  ];

  const simulateTransfer = (operation: 'upload' | 'download') => {
    setTransferStatus(operation === 'upload' ? 'uploading' : 'downloading');
    
    setTimeout(() => {
      setTransferStatus('complete');
      setScore(score + 25);
      
      if (operation === 'upload') {
        setFiles([...files, {
          name: 'new-config.txt',
          size: '1.8 KB',
          type: 'Configuration',
          lastModified: '2025-07-16'
        }]);
      }
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 min-h-screen p-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">📁 TFTP File Transfer Lab</h1>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
          <p className="text-white/90 mb-2">{steps[currentStep].description}</p>
          <p className="text-cyan-200 text-sm">{steps[currentStep].content}</p>
        </div>

        {currentStep === 1 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">⚙️ TFTP Server Configuration</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Server IP Address</label>
                  <input
                    type="text"
                    value={serverConfig.serverIP}
                    onChange={(e) => setServerConfig({...serverConfig, serverIP: e.target.value})}
                    placeholder="192.168.1.100"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Port Number</label>
                  <input
                    type="text"
                    value={serverConfig.port}
                    onChange={(e) => setServerConfig({...serverConfig, port: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Root Directory</label>
                  <input
                    type="text"
                    value={serverConfig.rootDirectory}
                    onChange={(e) => setServerConfig({...serverConfig, rootDirectory: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={serverConfig.readOnly}
                      onChange={(e) => setServerConfig({...serverConfig, readOnly: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-white/80 text-sm">Read-Only Mode</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Max Connections</label>
                  <select
                    value={serverConfig.maxConnections}
                    onChange={(e) => setServerConfig({...serverConfig, maxConnections: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-cyan-500"
                  >
                    <option value="5">5 connections</option>
                    <option value="10">10 connections</option>
                    <option value="20">20 connections</option>
                  </select>
                </div>
                
                <div className="bg-yellow-500/20 border border-yellow-400/50 rounded p-3">
                  <div className="text-yellow-200 text-sm">
                    ⚠️ Security Note: TFTP transmits data in plaintext. Use only on trusted networks!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">📁 File Transfer Operations</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Server Files</h4>
                
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="bg-white/10 rounded p-2 flex justify-between items-center">
                      <div>
                        <div className="text-white text-sm font-bold">{file.name}</div>
                        <div className="text-white/60 text-xs">{file.type} • {file.size}</div>
                      </div>
                      <div className="text-white/60 text-xs">{file.lastModified}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => simulateTransfer('download')}
                    disabled={transferStatus !== 'idle'}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white py-2 rounded text-sm"
                  >
                    Download File
                  </button>
                  <button
                    onClick={() => simulateTransfer('upload')}
                    disabled={transferStatus !== 'idle'}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-2 rounded text-sm"
                  >
                    Upload File
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Transfer Status</h4>
                
                {transferStatus === 'idle' && (
                  <div className="text-center text-white/60">
                    Select an operation to begin file transfer
                  </div>
                )}
                
                {(transferStatus === 'uploading' || transferStatus === 'downloading') && (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
                    <div className="text-cyan-400 font-bold">
                      {transferStatus === 'uploading' ? 'Uploading...' : 'Downloading...'}
                    </div>
                    <div className="text-white/60 text-sm">Transfer in progress</div>
                  </div>
                )}
                
                {transferStatus === 'complete' && (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <div className="text-green-400 font-bold">Transfer Complete!</div>
                    <div className="text-white/60 text-sm">File transferred successfully</div>
                    <button
                      onClick={() => setTransferStatus('idle')}
                      className="mt-3 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                    >
                      Reset
                    </button>
                  </div>
                )}
                
                <div className="mt-4 bg-cyan-500/20 border border-cyan-400/50 rounded p-3">
                  <div className="text-cyan-300 text-sm font-bold mb-2">TFTP Commands:</div>
                  <div className="text-white/80 text-xs space-y-1 font-mono">
                    <div>tftp -i 192.168.1.100 GET file.txt</div>
                    <div>tftp -i 192.168.1.100 PUT file.txt</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">🔒 TFTP Security Analysis</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4">
                <h4 className="text-red-300 font-bold mb-3">⚠️ Security Limitations</h4>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>• No authentication mechanism</li>
                  <li>• Data transmitted in plaintext</li>
                  <li>• No encryption of any kind</li>
                  <li>• Limited access controls</li>
                  <li>• Vulnerable to eavesdropping</li>
                  <li>• No integrity checking</li>
                </ul>
              </div>
              
              <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4">
                <h4 className="text-green-300 font-bold mb-3">✅ Safe Usage Practices</h4>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>• Use only on isolated/trusted networks</li>
                  <li>• Implement firewall restrictions</li>
                  <li>• Configure read-only access when possible</li>
                  <li>• Monitor transfer logs regularly</li>
                  <li>• Consider SFTP for sensitive data</li>
                  <li>• Use network segmentation</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-500/20 border border-blue-400/50 rounded p-4">
              <h4 className="text-blue-300 font-bold mb-2">When to Use TFTP:</h4>
              <div className="text-white/80 text-sm grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-bold mb-1">Good Use Cases:</div>
                  <ul className="space-y-1">
                    <li>• Network device configuration backup</li>
                    <li>• Firmware updates</li>
                    <li>• PXE boot environments</li>
                    <li>• Internal lab environments</li>
                  </ul>
                </div>
                <div>
                  <div className="font-bold mb-1">Avoid For:</div>
                  <ul className="space-y-1">
                    <li>• Sensitive data transfers</li>
                    <li>• Internet-facing services</li>
                    <li>• User credential files</li>
                    <li>• Production environments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-white/60">Score: {score} points</div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => onComplete(Math.max(100, score))}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                Complete TFTP Lab
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Day 4 Additional Enhanced Tutorials Component
const Day4AdditionalEnhancedTutorials: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const tutorials = [
    {
      id: 'teachable-machine',
      title: 'Teachable Machine AI Lab',
      description: 'Train your own machine learning model with Google\'s Teachable Machine',
      icon: '🤖',
      difficulty: 'Intermediate',
      estimatedTime: '25 minutes',
      component: TeachableMachineTutorial
    },
    {
      id: 'cyberchef',
      title: 'CyberChef Crypto Kitchen',
      description: 'Master the essential cybersecurity analysis tool for encoding/decoding data',
      icon: '🍳',
      difficulty: 'Advanced',
      estimatedTime: '20 minutes',
      component: CyberChefTutorial
    },
    {
      id: 'tftp',
      title: 'TFTP File Transfer Lab',
      description: 'Learn secure file transfer protocols and network service configuration',
      icon: '📁',
      difficulty: 'Intermediate',
      estimatedTime: '18 minutes',
      component: TFTPTutorial
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
      className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Day 4 Additional Advanced Labs
          </h1>
          <p className="text-white/80 text-lg">
            Machine learning, cryptographic analysis, and network protocols
          </p>
          
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{completedTutorials.length}</div>
                <div className="text-white/60 text-sm">Labs Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalScore}</div>
                <div className="text-white/60 text-sm">Total Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{overallProgress.toFixed(0)}%</div>
                <div className="text-white/60 text-sm">Progress</div>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tutorials.map((tutorial) => (
            <motion.div
              key={tutorial.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all ${
                completedTutorials.includes(tutorial.id) 
                  ? 'ring-2 ring-green-400 bg-green-500/20' 
                  : 'hover:bg-white/20'
              }`}
              onClick={() => setCurrentTutorial(tutorial.id)}
            >
              <div className="text-4xl mb-4">{tutorial.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{tutorial.title}</h3>
              <p className="text-white/80 text-sm mb-4">{tutorial.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  tutorial.difficulty === 'Advanced' ? 'bg-red-500/30 text-red-200' :
                  tutorial.difficulty === 'Intermediate' ? 'bg-yellow-500/30 text-yellow-200' :
                  'bg-green-500/30 text-green-200'
                }`}>
                  {tutorial.difficulty}
                </span>
                <span className="text-white/60 text-xs">{tutorial.estimatedTime}</span>
              </div>
              
              {completedTutorials.includes(tutorial.id) ? (
                <div className="flex items-center text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </div>
              ) : (
                <div className="text-purple-300 text-sm">Click to start →</div>
              )}
            </motion.div>
          ))}
        </div>

        {overallProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Day 4 Additional Labs Complete!
            </h2>
            <p className="text-white/90 mb-4">
              Incredible work! You've mastered advanced AI/ML concepts, cryptographic analysis tools,
              and network file transfer protocols. You're ready for professional cybersecurity work!
            </p>
            <div className="text-3xl font-bold text-white mb-4">
              Final Score: {totalScore} points
            </div>
            <div className="bg-white/20 rounded-lg p-4 inline-block">
              <div className="text-white font-bold mb-2">🏆 Advanced Skills Mastered:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>🤖 Machine Learning</div>
                <div>🍳 CyberChef Analysis</div>
                <div>📁 Network Protocols</div>
                <div>🔒 Security Analysis</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-bold"
          >
            Return to Pokemon MMO
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Day4AdditionalEnhancedTutorials;
