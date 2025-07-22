import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Monitor, Globe, Shield, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// IP Address Configuration Tutorial
export const IPAddressTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const networkScenario = {
    networkAddress: '192.168.1.0',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    devices: [
      { name: 'Router', ip: '192.168.1.1', type: 'gateway' },
      { name: 'Computer 1', ip: '', type: 'host' },
      { name: 'Computer 2', ip: '', type: 'host' },
      { name: 'Printer', ip: '', type: 'host' }
    ]
  };

  const steps = [
    {
      title: 'Understanding IP Addresses',
      content: 'IP addresses are like postal addresses for devices on a network. They help data find its way to the right destination.',
      question: 'What network are we setting up?',
      answer: '192.168.1.0/24',
      explanation: 'This is a private network that can have devices from 192.168.1.1 to 192.168.1.254'
    },
    {
      title: 'Setting Gateway Address',
      content: 'The gateway (router) is already configured at 192.168.1.1. This is the device that connects our network to the internet.',
      question: 'What should be the first available IP for our devices?',
      answer: '192.168.1.2',
      explanation: 'Since the router uses .1, the first available address for other devices is .2'
    },
    {
      title: 'Configuring Devices',
      content: 'Now let\'s assign IP addresses to our devices. Each device needs a unique address.',
      question: 'Assign an IP to Computer 1 (use format 192.168.1.X)',
      answer: '192.168.1.2',
      explanation: 'Computer 1 gets the first available address after the router'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [field]: value }));
  };

  const checkAnswer = () => {
    const currentInput = userInputs[`step_${currentStep}`] || '';
    const correct = currentInput.toLowerCase().trim() === steps[currentStep].answer.toLowerCase();
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentStep + 1 >= steps.length) {
        onComplete(score * 33.33); // Max 100 points
      } else {
        setCurrentStep(currentStep + 1);
      }
    }, 3000);
  };

  const currentStepData = steps[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🌐 IP Address Configuration Lab
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Network Diagram */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Network Diagram</h4>
          <div className="space-y-4">
            {/* Router */}
            <div className="flex items-center bg-white/20 rounded-lg p-3">
              <Globe className="text-white mr-3" size={24} />
              <div>
                <div className="text-white font-bold">Gateway Router</div>
                <div className="text-white/80 text-sm">IP: {networkScenario.gateway}</div>
              </div>
            </div>
            
            {/* Devices */}
            {networkScenario.devices.slice(1).map((device, index) => (
              <div key={index} className="flex items-center bg-white/10 rounded-lg p-3">
                <Monitor className="text-white mr-3" size={24} />
                <div>
                  <div className="text-white font-bold">{device.name}</div>
                  <div className="text-white/80 text-sm">
                    IP: {device.ip || 'Not configured'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <div className="text-white/90 text-sm">
              <strong>Network:</strong> {networkScenario.networkAddress}<br/>
              <strong>Subnet Mask:</strong> {networkScenario.subnetMask}<br/>
              <strong>Available IPs:</strong> 192.168.1.2 - 192.168.1.254
            </div>
          </div>
        </div>
        
        {/* Tutorial Content */}
        <div className="bg-white/10 rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-white mb-2">
              Step {currentStep + 1}: {currentStepData.title}
            </h4>
            <p className="text-white/90">{currentStepData.content}</p>
          </div>
          
          {!showFeedback ? (
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">
                  {currentStepData.question}
                </label>
                <input
                  type="text"
                  value={userInputs[`step_${currentStep}`] || ''}
                  onChange={(e) => handleInputChange(`step_${currentStep}`, e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  placeholder="Enter your answer..."
                />
              </div>
              <button
                onClick={checkAnswer}
                disabled={!userInputs[`step_${currentStep}`]}
                className={`w-full py-2 rounded-lg font-bold ${
                  userInputs[`step_${currentStep}`]
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                Check Answer
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className={`text-6xl mb-3 ${
                userInputs[`step_${currentStep}`]?.toLowerCase().trim() === currentStepData.answer.toLowerCase() 
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                {userInputs[`step_${currentStep}`]?.toLowerCase().trim() === currentStepData.answer.toLowerCase() 
                  ? '✅' : '❌'}
              </div>
              <p className="text-white/90 mb-4">{currentStepData.explanation}</p>
              <div className="bg-blue-500/30 rounded-lg p-3">
                <p className="text-white/80 text-sm">
                  <strong>Correct Answer:</strong> {currentStepData.answer}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Lab
        </button>
        <div className="text-white/60 text-sm flex items-center">
          Progress: {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </div>
      </div>
    </motion.div>
  );
};

// Packet Tracer Simulation
export const PacketTracerTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [connections, setConnections] = useState<Array<{from: string, to: string}>>([]);
  const [score, setScore] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const devices = [
    { id: 'pc1', name: 'PC 1', type: 'computer', x: 100, y: 100, icon: '💻' },
    { id: 'pc2', name: 'PC 2', type: 'computer', x: 300, y: 100, icon: '💻' },
    { id: 'switch1', name: 'Switch', type: 'switch', x: 200, y: 200, icon: '🔌' },
    { id: 'router1', name: 'Router', type: 'router', x: 200, y: 300, icon: '📡' },
    { id: 'server1', name: 'Server', type: 'server', x: 200, y: 400, icon: '🖥️' }
  ];

  const tasks = [
    {
      instruction: 'Connect PC 1 to the Switch',
      requiredConnections: [{ from: 'pc1', to: 'switch1' }],
      explanation: 'Computers connect to switches using Ethernet cables to join the local network.'
    },
    {
      instruction: 'Connect PC 2 to the Switch',
      requiredConnections: [{ from: 'pc1', to: 'switch1' }, { from: 'pc2', to: 'switch1' }],
      explanation: 'Multiple computers can connect to the same switch to communicate with each other.'
    },
    {
      instruction: 'Connect the Switch to the Router',
      requiredConnections: [
        { from: 'pc1', to: 'switch1' }, 
        { from: 'pc2', to: 'switch1' }, 
        { from: 'switch1', to: 'router1' }
      ],
      explanation: 'The router provides internet access and connects different networks together.'
    }
  ];

  const makeConnection = (deviceId: string) => {
    // Simple connection logic - for demo purposes
    if (currentTask === 0 && deviceId === 'pc1') {
      setConnections([{ from: 'pc1', to: 'switch1' }]);
      checkTask();
    } else if (currentTask === 1 && deviceId === 'pc2') {
      setConnections([{ from: 'pc1', to: 'switch1' }, { from: 'pc2', to: 'switch1' }]);
      checkTask();
    } else if (currentTask === 2 && deviceId === 'switch1') {
      setConnections([
        { from: 'pc1', to: 'switch1' }, 
        { from: 'pc2', to: 'switch1' }, 
        { from: 'switch1', to: 'router1' }
      ]);
      checkTask();
    }
  };

  const checkTask = () => {
    setScore(score + 1);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentTask + 1 >= tasks.length) {
        onComplete(score * 33.33);
      } else {
        setCurrentTask(currentTask + 1);
      }
    }, 2000);
  };

  const currentTaskData = tasks[currentTask];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        📡 Packet Tracer Network Lab
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Network Canvas */}
        <div className="md:col-span-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 h-96 relative">
          <h4 className="text-white font-bold mb-4">Network Topology</h4>
          
          {/* Devices */}
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => makeConnection(device.id)}
              className={`absolute bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all transform hover:scale-110 ${
                device.type === 'computer' ? 'border-2 border-blue-400' :
                device.type === 'switch' ? 'border-2 border-green-400' :
                device.type === 'router' ? 'border-2 border-purple-400' :
                'border-2 border-orange-400'
              }`}
              style={{ left: device.x, top: device.y }}
            >
              <div className="text-2xl">{device.icon}</div>
              <div className="text-white text-xs">{device.name}</div>
            </button>
          ))}
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map((conn, index) => {
              const fromDevice = devices.find(d => d.id === conn.from);
              const toDevice = devices.find(d => d.id === conn.to);
              if (!fromDevice || !toDevice) return null;
              
              return (
                <line
                  key={index}
                  x1={fromDevice.x + 25}
                  y1={fromDevice.y + 25}
                  x2={toDevice.x + 25}
                  y2={toDevice.y + 25}
                  stroke="#10B981"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Instructions */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-lg font-bold text-white mb-4">
            Task {currentTask + 1} of {tasks.length}
          </h4>
          
          {!showFeedback ? (
            <div>
              <p className="text-white/90 mb-4">{currentTaskData.instruction}</p>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <p className="text-white/80 text-sm">
                  💡 <strong>Tip:</strong> Click on the device mentioned in the task to connect it.
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="text-4xl text-green-400 mb-2">✅</div>
              <p className="text-green-300 font-bold mb-2">Great work!</p>
              <p className="text-white/90 text-sm">{currentTaskData.explanation}</p>
            </motion.div>
          )}
          
          <div className="mt-4">
            <div className="text-white/60 text-sm mb-2">Legend:</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                <span className="text-white/80">Computers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                <span className="text-white/80">Switch</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded mr-2"></div>
                <span className="text-white/80">Router</span>
              </div>
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
        <div className="text-white/60 text-sm flex items-center">
          Score: {score} | Progress: {Math.round(((currentTask + 1) / tasks.length) * 100)}%
        </div>
      </div>
    </motion.div>
  );
};

// WiFi Security Configuration Tutorial
export const WiFiSecurityTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wifiConfig, setWifiConfig] = useState({
    ssid: '',
    security: '',
    password: '',
    hidden: false
  });
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const steps = [
    {
      title: 'Network Name (SSID)',
      instruction: 'Choose a network name that doesn\'t reveal personal information',
      field: 'ssid',
      type: 'text',
      validation: (value: string) => value.length >= 3 && !value.includes('password') && !value.includes('admin'),
      feedback: 'Good! Avoid using personal names or obvious identifiers in your SSID.'
    },
    {
      title: 'Security Protocol',
      instruction: 'Select the most secure encryption method',
      field: 'security',
      type: 'select',
      options: ['Open (No Security)', 'WEP', 'WPA', 'WPA2', 'WPA3'],
      validation: (value: string) => value === 'WPA3' || value === 'WPA2',
      feedback: 'Excellent! WPA2 and WPA3 provide strong security for your network.'
    },
    {
      title: 'Network Password',
      instruction: 'Create a strong password for your WiFi network',
      field: 'password',
      type: 'password',
      validation: (value: string) => value.length >= 12 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*]/.test(value),
      feedback: 'Strong password! It has uppercase, lowercase, numbers, and special characters.'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setWifiConfig(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const currentStepData = steps[currentStep];
    const currentValue = wifiConfig[currentStepData.field as keyof typeof wifiConfig] as string;
    
    if (currentStepData.validation(currentValue)) {
      setScore(score + 1);
    }
    
    if (currentStep + 1 >= steps.length) {
      setShowResults(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const calculateSecurityRating = () => {
    let rating = 0;
    if (wifiConfig.ssid && !wifiConfig.ssid.includes('password')) rating += 20;
    if (wifiConfig.security === 'WPA3') rating += 40;
    else if (wifiConfig.security === 'WPA2') rating += 30;
    if (wifiConfig.password.length >= 12) rating += 20;
    if (/[A-Z]/.test(wifiConfig.password) && /[a-z]/.test(wifiConfig.password)) rating += 10;
    if (/[0-9]/.test(wifiConfig.password) && /[!@#$%^&*]/.test(wifiConfig.password)) rating += 10;
    return Math.min(rating, 100);
  };

  if (showResults) {
    const securityRating = calculateSecurityRating();
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          WiFi Configuration Complete! 📶
        </h3>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-4">
          <h4 className="text-lg font-bold text-white mb-4">Your WiFi Network</h4>
          <div className="space-y-2 text-white">
            <div><strong>Network Name:</strong> {wifiConfig.ssid}</div>
            <div><strong>Security:</strong> {wifiConfig.security}</div>
            <div><strong>Password:</strong> {'•'.repeat(wifiConfig.password.length)}</div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-bold">Security Rating:</span>
              <span className={`font-bold ${
                securityRating >= 80 ? 'text-green-300' :
                securityRating >= 60 ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {securityRating}/100
              </span>
            </div>
            <div className="bg-white/20 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  securityRating >= 80 ? 'bg-green-400' :
                  securityRating >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${securityRating}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-white/90">
            {securityRating >= 80 
              ? 'Excellent! Your network is highly secure! 🏆'
              : securityRating >= 60
              ? 'Good security, but could be improved. 🛡️'
              : 'Your network needs better security settings. ⚠️'}
          </p>
        </div>
        
        <button
          onClick={() => onComplete(securityRating)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
        >
          Complete WiFi Tutorial
        </button>
      </motion.div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        📶 WiFi Security Configuration
      </h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-white/60">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="bg-white/20 rounded-full h-2">
          <div 
            className="bg-blue-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-bold text-white mb-2">{currentStepData.title}</h4>
        <p className="text-white/90 mb-4">{currentStepData.instruction}</p>
        
        {currentStepData.type === 'select' ? (
          <select
            value={String(wifiConfig[currentStepData.field as keyof typeof wifiConfig])}
            onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Select security type...</option>
            {currentStepData.options?.map((option) => (
              <option key={option} value={option} className="text-black">{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={currentStepData.type}
            value={String(wifiConfig[currentStepData.field as keyof typeof wifiConfig])}
            onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50"
            placeholder={`Enter ${currentStepData.title.toLowerCase()}...`}
          />
        )}
        
        {wifiConfig[currentStepData.field as keyof typeof wifiConfig] && currentStepData.validation(wifiConfig[currentStepData.field as keyof typeof wifiConfig] as string) && (
          <div className="mt-2 text-green-300 text-sm">
            ✅ {currentStepData.feedback}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Tutorial
        </button>
        <button
          onClick={nextStep}
          disabled={!wifiConfig[currentStepData.field as keyof typeof wifiConfig] || !currentStepData.validation(wifiConfig[currentStepData.field as keyof typeof wifiConfig] as string)}
          className={`px-4 py-2 rounded-lg ${
            wifiConfig[currentStepData.field as keyof typeof wifiConfig] && currentStepData.validation(wifiConfig[currentStepData.field as keyof typeof wifiConfig] as string)
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          {currentStep + 1 >= steps.length ? 'Finish Setup' : 'Next Step'}
        </button>
      </div>
    </motion.div>
  );
};
