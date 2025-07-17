import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Wifi, Eye, Play, CheckCircle, RotateCcw, Settings } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Wireshark Packet Analysis Tutorial
const WiresharkTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackets, setSelectedPackets] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<string[]>([]);

  const packetData = [
    {
      id: 1,
      time: '0.000000',
      source: '192.168.1.100',
      destination: '192.168.1.1',
      protocol: 'ICMP',
      length: 74,
      info: 'Echo (ping) request',
      suspicious: false,
      details: 'Normal ping request to gateway router'
    },
    {
      id: 2,
      time: '0.001234',
      source: '192.168.1.1',
      destination: '192.168.1.100',
      protocol: 'ICMP',
      length: 74,
      info: 'Echo (ping) reply',
      suspicious: false,
      details: 'Gateway responding to ping request'
    },
    {
      id: 3,
      time: '0.125000',
      source: '10.0.0.50',
      destination: '192.168.1.100',
      protocol: 'TCP',
      length: 1500,
      info: 'Port scan attempt on port 22',
      suspicious: true,
      details: 'External IP scanning for SSH access - potential threat!'
    },
    {
      id: 4,
      time: '0.135000',
      source: '192.168.1.100',
      destination: '8.8.8.8',
      protocol: 'DNS',
      length: 64,
      info: 'Standard DNS query for google.com',
      suspicious: false,
      details: 'Normal DNS resolution request'
    },
    {
      id: 5,
      time: '0.200000',
      source: '10.0.0.50',
      destination: '192.168.1.100',
      protocol: 'TCP',
      length: 60,
      info: 'Port scan on multiple ports',
      suspicious: true,
      details: 'Continuation of port scanning attack'
    }
  ];

  const analysisSteps = [
    {
      title: "Welcome to Wireshark Academy! 🦈",
      description: "Learn to analyze network packets like a cybersecurity detective",
      instruction: "Wireshark is the world's most popular network protocol analyzer. You'll learn to spot normal traffic from suspicious activity!"
    },
    {
      title: "Understanding Packet Headers",
      description: "Every packet contains important information",
      instruction: "Look at the packet list below. Each packet shows: Time, Source IP, Destination IP, Protocol, Length, and Info"
    },
    {
      title: "Identify Suspicious Activity",
      description: "Find packets that might indicate a security threat",
      instruction: "Click on packets that look suspicious. Look for: Unknown source IPs, port scans, unusual protocols, or large data transfers"
    },
    {
      title: "Security Analysis Report",
      description: "Review your findings",
      instruction: "Based on your packet analysis, we'll generate a security report"
    }
  ];

  const handlePacketClick = (packetId: number) => {
    const packet = packetData.find(p => p.id === packetId);
    if (!packet) return;

    if (selectedPackets.includes(packetId)) {
      setSelectedPackets(selectedPackets.filter(id => id !== packetId));
    } else {
      setSelectedPackets([...selectedPackets, packetId]);
      
      if (packet.suspicious) {
        setScore(score + 20);
        setAnalysisResults([...analysisResults, `✅ Correctly identified: ${packet.info}`]);
      } else {
        setScore(Math.max(0, score - 5));
        setAnalysisResults([...analysisResults, `❌ False positive: ${packet.info} is normal traffic`]);
      }
    }
  };

  const completeAnalysis = () => {
    const suspiciousPackets = packetData.filter(p => p.suspicious);
    const correctIdentifications = selectedPackets.filter(id => 
      suspiciousPackets.some(p => p.id === id)
    );
    
    const finalScore = Math.max(50, score + (correctIdentifications.length * 25));
    onComplete(finalScore);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🦈 Wireshark Packet Detective</h1>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{analysisSteps[currentStep].title}</h2>
            <div className="text-white/80">
              Step {currentStep + 1} of {analysisSteps.length} | Score: {score}
            </div>
          </div>
          
          <p className="text-white/90 mb-4">{analysisSteps[currentStep].description}</p>
          <p className="text-blue-200 text-sm">{analysisSteps[currentStep].instruction}</p>
        </div>

        {currentStep >= 1 && currentStep <= 2 && (
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">📊 Network Packet Capture</h3>
            
            {/* Wireshark-style header */}
            <div className="bg-gray-800 rounded-t-lg p-2 grid grid-cols-6 gap-2 text-xs font-bold text-white/80">
              <div>Time</div>
              <div>Source</div>
              <div>Destination</div>
              <div>Protocol</div>
              <div>Length</div>
              <div>Info</div>
            </div>
            
            {/* Packet list */}
            <div className="bg-gray-900 rounded-b-lg max-h-64 overflow-y-auto">
              {packetData.map((packet) => (
                <div
                  key={packet.id}
                  onClick={() => currentStep === 2 && handlePacketClick(packet.id)}
                  className={`grid grid-cols-6 gap-2 p-2 text-xs cursor-pointer hover:bg-white/10 transition-colors border-b border-gray-700 ${
                    selectedPackets.includes(packet.id) 
                      ? packet.suspicious 
                        ? 'bg-red-500/30 border-red-400' 
                        : 'bg-yellow-500/30 border-yellow-400'
                      : ''
                  }`}
                >
                  <div className="text-green-400">{packet.time}</div>
                  <div className="text-blue-400">{packet.source}</div>
                  <div className="text-purple-400">{packet.destination}</div>
                  <div className="text-orange-400">{packet.protocol}</div>
                  <div className="text-white">{packet.length}</div>
                  <div className="text-white/80">{packet.info}</div>
                </div>
              ))}
            </div>
            
            {currentStep === 2 && (
              <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
                <h4 className="text-white font-bold mb-2">🔍 Detective Instructions:</h4>
                <div className="text-white/80 text-sm space-y-1">
                  <div>• Look for external IP addresses (not 192.168.1.x)</div>
                  <div>• Port scans often target specific ports like 22 (SSH)</div>
                  <div>• Multiple packets from the same external source = suspicious</div>
                  <div>• Normal traffic: DNS queries, ping responses, internal communication</div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">📋 Security Analysis Report</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Analysis Results</h4>
                <div className="space-y-2 text-sm">
                  {analysisResults.map((result, index) => (
                    <div key={index} className="text-white/80">{result}</div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/20 rounded">
                  <div className="text-blue-200 text-sm">
                    Suspicious packets identified: {selectedPackets.filter(id => 
                      packetData.find(p => p.id === id)?.suspicious
                    ).length} / {packetData.filter(p => p.suspicious).length}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Security Recommendations</h4>
                <div className="space-y-2 text-sm text-white/80">
                  <div>🛡️ Block external IP 10.0.0.50</div>
                  <div>🔥 Enable firewall port scan detection</div>
                  <div>📊 Monitor SSH login attempts</div>
                  <div>🔔 Set up intrusion detection alerts</div>
                  <div>📝 Document security incident</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg"
          >
            Previous
          </button>
          
          {currentStep < analysisSteps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={completeAnalysis}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
            >
              Complete Analysis
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Remote Desktop Tutorial
const RemoteDesktopTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rdpSettings, setRdpSettings] = useState({
    enableRDP: false,
    networkAuth: false,
    firewallException: false,
    userPermissions: false
  });
  const [connectionAttempt, setConnectionAttempt] = useState<'none' | 'connecting' | 'connected' | 'failed'>('none');
  const [score, setScore] = useState(0);

  const steps = [
    {
      title: "Remote Desktop Fundamentals",
      description: "Learn how to securely connect to computers over a network",
      content: "Remote Desktop Protocol (RDP) allows you to control another computer as if you were sitting right in front of it. It's widely used in IT support and cybersecurity."
    },
    {
      title: "Security Configuration",
      description: "Set up RDP with proper security measures",
      content: "Before enabling RDP, we need to configure security settings to prevent unauthorized access."
    },
    {
      title: "Connection Testing",
      description: "Test the RDP connection",
      content: "Now we'll simulate connecting to the remote computer to verify everything works securely."
    },
    {
      title: "Security Best Practices",
      description: "Learn RDP security recommendations",
      content: "Review the essential security practices for safe remote desktop usage."
    }
  ];

  const handleSettingToggle = (setting: keyof typeof rdpSettings) => {
    const newSettings = { ...rdpSettings, [setting]: !rdpSettings[setting] };
    setRdpSettings(newSettings);
    
    if (!rdpSettings[setting]) {
      setScore(score + 15);
    }
  };

  const attemptConnection = () => {
    setConnectionAttempt('connecting');
    
    setTimeout(() => {
      const allSettingsEnabled = Object.values(rdpSettings).every(Boolean);
      if (allSettingsEnabled) {
        setConnectionAttempt('connected');
        setScore(score + 50);
      } else {
        setConnectionAttempt('failed');
      }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🖥️ Remote Desktop Academy</h1>
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
            <h3 className="text-lg font-bold text-white mb-4">🔧 RDP Security Configuration</h3>
            
            <div className="space-y-4">
              {[
                { key: 'enableRDP', label: 'Enable Remote Desktop', desc: 'Allow remote connections to this computer' },
                { key: 'networkAuth', label: 'Network Level Authentication', desc: 'Require authentication before connection' },
                { key: 'firewallException', label: 'Configure Firewall Exception', desc: 'Allow RDP through Windows Firewall' },
                { key: 'userPermissions', label: 'Set User Permissions', desc: 'Grant remote access to specific users only' }
              ].map((setting) => (
                <div key={setting.key} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">{setting.label}</h4>
                    <button
                      onClick={() => handleSettingToggle(setting.key as keyof typeof rdpSettings)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        rdpSettings[setting.key as keyof typeof rdpSettings]
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        rdpSettings[setting.key as keyof typeof rdpSettings]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <p className="text-white/70 text-sm">{setting.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg">
              <div className="text-yellow-200 text-sm">
                💡 Security Tip: Always enable Network Level Authentication to prevent unauthorized connection attempts!
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">🔗 Connection Test</h3>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-center mb-6">
                <Monitor className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h4 className="text-white font-bold text-lg">Target Computer: LAB-PC-01</h4>
                <p className="text-white/80">IP Address: 192.168.1.100</p>
              </div>
              
              {connectionAttempt === 'none' && (
                <button
                  onClick={attemptConnection}
                  disabled={!Object.values(rdpSettings).every(Boolean)}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold"
                >
                  {Object.values(rdpSettings).every(Boolean) 
                    ? 'Connect via RDP' 
                    : 'Configure Security Settings First'}
                </button>
              )}
              
              {connectionAttempt === 'connecting' && (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-white">Establishing secure connection...</p>
                </div>
              )}
              
              {connectionAttempt === 'connected' && (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 font-bold">Connection Successful!</p>
                  <p className="text-white/80 text-sm">You can now control the remote computer securely.</p>
                </div>
              )}
              
              {connectionAttempt === 'failed' && (
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">!</span>
                  </div>
                  <p className="text-red-400 font-bold">Connection Failed!</p>
                  <p className="text-white/80 text-sm">Check all security settings are properly configured.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">🛡️ RDP Security Best Practices</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4">
                <h4 className="text-green-300 font-bold mb-3">✅ Security Do's</h4>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>• Enable Network Level Authentication</li>
                  <li>• Use strong, unique passwords</li>
                  <li>• Change default RDP port (3389)</li>
                  <li>• Enable account lockout policies</li>
                  <li>• Use VPN for remote connections</li>
                  <li>• Monitor RDP logs regularly</li>
                </ul>
              </div>
              
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4">
                <h4 className="text-red-300 font-bold mb-3">❌ Security Don'ts</h4>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>• Don't expose RDP directly to internet</li>
                  <li>• Don't use default passwords</li>
                  <li>• Don't ignore failed login attempts</li>
                  <li>• Don't disable encryption</li>
                  <li>• Don't allow unrestricted user access</li>
                  <li>• Don't forget to patch regularly</li>
                </ul>
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => onComplete(Math.max(75, score))}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                Complete Tutorial
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// DHCP Configuration Tutorial  
const DHCPTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dhcpConfig, setDhcpConfig] = useState({
    startIP: '',
    endIP: '',
    subnetMask: '',
    gateway: '',
    dns1: '',
    dns2: '',
    leaseTime: '24'
  });
  const [score, setScore] = useState(0);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<Array<{name: string, ip: string, status: string}>>([]);

  const steps = [
    {
      title: "Understanding DHCP",
      description: "Dynamic Host Configuration Protocol automatically assigns IP addresses",
      content: "DHCP eliminates the need to manually configure IP addresses on every device. It's like an automated IP address vending machine!"
    },
    {
      title: "DHCP Configuration",
      description: "Set up the DHCP server parameters",
      content: "Configure the range of IP addresses, subnet mask, gateway, and DNS servers that will be automatically assigned to devices."
    },
    {
      title: "Device Simulation",
      description: "Watch devices automatically get IP addresses",
      content: "Simulate devices connecting to the network and receiving automatic IP configuration from your DHCP server."
    }
  ];

  const handleConfigChange = (field: string, value: string) => {
    setDhcpConfig({ ...dhcpConfig, [field]: value });
  };

  const validateConfig = () => {
    const required = ['startIP', 'endIP', 'subnetMask', 'gateway', 'dns1'];
    return required.every(field => dhcpConfig[field as keyof typeof dhcpConfig]);
  };

  const runSimulation = () => {
    if (!validateConfig()) return;
    
    setSimulationRunning(true);
    setConnectedDevices([]);
    
    const devices = ['Laptop-001', 'Phone-Android', 'Tablet-iPad', 'Smart-TV', 'IoT-Camera'];
    const startOctet = parseInt(dhcpConfig.startIP.split('.')[3]);
    
    devices.forEach((device, index) => {
      setTimeout(() => {
        const ip = dhcpConfig.startIP.split('.').slice(0, 3).join('.') + '.' + (startOctet + index);
        setConnectedDevices(prev => [...prev, {
          name: device,
          ip: ip,
          status: 'Connected'
        }]);
        setScore(score + 10);
      }, (index + 1) * 1000);
    });
    
    setTimeout(() => {
      setSimulationRunning(false);
      setScore(score + 50);
    }, 6000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🌐 DHCP Configuration Lab</h1>
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
            <h3 className="text-lg font-bold text-white mb-4">⚙️ DHCP Server Configuration</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">IP Address Range Start</label>
                  <input
                    type="text"
                    value={dhcpConfig.startIP}
                    onChange={(e) => handleConfigChange('startIP', e.target.value)}
                    placeholder="192.168.1.100"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">IP Address Range End</label>
                  <input
                    type="text"
                    value={dhcpConfig.endIP}
                    onChange={(e) => handleConfigChange('endIP', e.target.value)}
                    placeholder="192.168.1.200"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Subnet Mask</label>
                  <input
                    type="text"
                    value={dhcpConfig.subnetMask}
                    onChange={(e) => handleConfigChange('subnetMask', e.target.value)}
                    placeholder="255.255.255.0"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Default Gateway</label>
                  <input
                    type="text"
                    value={dhcpConfig.gateway}
                    onChange={(e) => handleConfigChange('gateway', e.target.value)}
                    placeholder="192.168.1.1"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Primary DNS Server</label>
                  <input
                    type="text"
                    value={dhcpConfig.dns1}
                    onChange={(e) => handleConfigChange('dns1', e.target.value)}
                    placeholder="8.8.8.8"
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Lease Time (hours)</label>
                  <select
                    value={dhcpConfig.leaseTime}
                    onChange={(e) => handleConfigChange('leaseTime', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                  >
                    <option value="8">8 hours</option>
                    <option value="24">24 hours</option>
                    <option value="72">72 hours</option>
                    <option value="168">1 week</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
              <h4 className="text-blue-300 font-bold mb-2">Configuration Tips:</h4>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Start IP should be higher than gateway (e.g., if gateway is .1, start at .100)</li>
                <li>• End IP should be in the same subnet as start IP</li>
                <li>• Use Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1) for reliability</li>
                <li>• Shorter lease times are better for guest networks, longer for offices</li>
              </ul>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">📱 Device Connection Simulation</h3>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-white">
                <div className="text-sm text-white/60">DHCP Server Status</div>
                <div className={`font-bold ${validateConfig() ? 'text-green-400' : 'text-red-400'}`}>
                  {validateConfig() ? 'Ready' : 'Configuration Incomplete'}
                </div>
              </div>
              
              <button
                onClick={runSimulation}
                disabled={!validateConfig() || simulationRunning}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                {simulationRunning ? 'Running Simulation...' : 'Start Device Simulation'}
              </button>
            </div>
            
            {connectedDevices.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3">Connected Devices</h4>
                <div className="space-y-2">
                  {connectedDevices.map((device, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center bg-white/10 rounded p-3"
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3" />
                        <div>
                          <div className="text-white font-bold">{device.name}</div>
                          <div className="text-white/60 text-sm">Auto-configured via DHCP</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-mono">{device.ip}</div>
                        <div className="text-green-400 text-sm">{device.status}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => onComplete(Math.max(100, score))}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                Complete Tutorial
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main enhanced Day 2 component
const Day2EnhancedTutorials: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const tutorials = [
    {
      id: 'wireshark',
      title: 'Wireshark Packet Detective',
      description: 'Analyze network traffic and spot security threats like a cybersecurity expert',
      icon: '🦈',
      difficulty: 'Advanced',
      estimatedTime: '20 minutes',
      component: WiresharkTutorial
    },
    {
      id: 'remote-desktop',
      title: 'Remote Desktop Security Lab',
      description: 'Learn secure remote access and RDP best practices',
      icon: '🖥️',
      difficulty: 'Intermediate',
      estimatedTime: '15 minutes',
      component: RemoteDesktopTutorial
    },
    {
      id: 'dhcp',
      title: 'DHCP Configuration Master',
      description: 'Set up automatic IP address assignment for network devices',
      icon: '🌐',
      difficulty: 'Intermediate',
      estimatedTime: '18 minutes',
      component: DHCPTutorial
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
      className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌐 Day 2 Enhanced Networking Labs
          </h1>
          <p className="text-white/80 text-lg">
            Advanced networking skills with packet analysis, remote access, and network automation
          </p>
          
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{completedTutorials.length}</div>
                <div className="text-white/60 text-sm">Tutorials Completed</div>
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
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
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
                <div className="text-blue-300 text-sm">Click to start →</div>
              )}
            </motion.div>
          ))}
        </div>

        {overallProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              🎉 Day 2 Enhanced Networking Complete!
            </h2>
            <p className="text-white/90 mb-4">
              Outstanding work! You've mastered advanced networking concepts including packet analysis, 
              remote access security, and network automation. You're ready for real-world networking challenges!
            </p>
            <div className="text-3xl font-bold text-white mb-4">
              Final Score: {totalScore} points
            </div>
            <div className="bg-white/20 rounded-lg p-4 inline-block">
              <div className="text-white font-bold mb-2">🏆 Skills Mastered:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>🦈 Packet Analysis</div>
                <div>🖥️ Remote Desktop Security</div>
                <div>🌐 DHCP Configuration</div>
                <div>🔍 Network Troubleshooting</div>
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

export default Day2EnhancedTutorials;
