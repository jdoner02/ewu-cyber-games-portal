'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Digital File Recovery and Forensics Tutorial
export const FileRecoveryTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [recoveredFiles, setRecoveredFiles] = useState<string[]>([]);
  const [evidenceAnalyzed, setEvidenceAnalyzed] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const scenarios = [
    {
      title: "Deleted File Recovery",
      description: "Recover critical files from a suspect's computer",
      difficulty: "Beginner",
      icon: "🗂️"
    },
    {
      title: "Hard Drive Forensics",
      description: "Analyze damaged hard drive sectors",
      difficulty: "Intermediate", 
      icon: "💾"
    },
    {
      title: "Network Log Analysis",
      description: "Reconstruct deleted network logs",
      difficulty: "Advanced",
      icon: "🌐"
    },
    {
      title: "Mobile Device Recovery",
      description: "Extract data from damaged smartphone",
      difficulty: "Expert",
      icon: "📱"
    }
  ];

  const forensicTools = [
    {
      name: "PhotoRec",
      description: "File carving and recovery tool",
      icon: "📸",
      effectiveness: { documents: 90, images: 95, videos: 85, archives: 80 }
    },
    {
      name: "TestDisk",
      description: "Partition and boot sector recovery",
      icon: "💿",
      effectiveness: { partitions: 95, bootSectors: 90, fileSystem: 85, mbr: 90 }
    },
    {
      name: "Sleuth Kit",
      description: "Digital investigation platform",
      icon: "🔍",
      effectiveness: { timeline: 95, metadata: 90, deleted: 85, analysis: 95 }
    },
    {
      name: "Volatility",
      description: "Memory forensics framework",
      icon: "🧠",
      effectiveness: { processes: 90, network: 85, encryption: 80, malware: 95 }
    },
    {
      name: "Wireshark",
      description: "Network protocol analyzer",
      icon: "🦈",
      effectiveness: { packets: 95, protocols: 90, traffic: 85, encryption: 75 }
    },
    {
      name: "Cellebrite",
      description: "Mobile forensics extraction",
      icon: "📲",
      effectiveness: { contacts: 95, messages: 90, apps: 85, location: 80 }
    }
  ];

  const deletedFiles = [
    {
      name: "financial_records.xlsx",
      type: "document",
      size: "2.4 MB",
      lastModified: "2024-01-15 14:30",
      recoveryDifficulty: "easy",
      evidenceValue: "high",
      content: "Bank account transactions showing suspicious transfers"
    },
    {
      name: "encrypted_messages.zip", 
      type: "archive",
      size: "156 KB",
      lastModified: "2024-01-20 09:15",
      recoveryDifficulty: "medium",
      evidenceValue: "critical",
      content: "Encrypted communications between suspects"
    },
    {
      name: "meeting_recording.mp4",
      type: "video", 
      size: "45 MB",
      lastModified: "2024-01-18 16:45",
      recoveryDifficulty: "hard",
      evidenceValue: "high",
      content: "Video recording of criminal planning meeting"
    },
    {
      name: "contact_list.vcf",
      type: "document",
      size: "24 KB", 
      lastModified: "2024-01-22 11:20",
      recoveryDifficulty: "easy",
      evidenceValue: "medium",
      content: "Contact information for criminal network"
    },
    {
      name: "browser_history.db",
      type: "database",
      size: "892 KB",
      lastModified: "2024-01-25 20:10", 
      recoveryDifficulty: "medium",
      evidenceValue: "medium",
      content: "Web browsing history with illegal activity"
    }
  ];

  const renderScenarioSelection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white text-center mb-6">Choose Your Investigation</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScenario(index)}
            className={`bg-white/10 rounded-xl p-6 cursor-pointer transition-all ${
              currentScenario === index ? 'ring-2 ring-blue-400' : 'hover:bg-white/20'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{scenario.icon}</div>
              <h4 className="text-xl font-bold text-white mb-2">{scenario.title}</h4>
              <p className="text-white/80 text-sm mb-3">{scenario.description}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                scenario.difficulty === 'Beginner' ? 'bg-green-500' :
                scenario.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                scenario.difficulty === 'Advanced' ? 'bg-orange-500' : 'bg-red-500'
              }`}>
                {scenario.difficulty}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderToolSelection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">🛠️ Select Forensic Tool</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {forensicTools.map((tool, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedTool(tool.name)}
            className={`bg-white/10 rounded-lg p-4 cursor-pointer transition-all ${
              selectedTool === tool.name ? 'ring-2 ring-green-400 bg-green-500/20' : 'hover:bg-white/20'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{tool.icon}</div>
              <h4 className="text-white font-bold text-sm mb-2">{tool.name}</h4>
              <p className="text-white/70 text-xs">{tool.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedTool && (
        <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Tool Effectiveness: {selectedTool}</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(forensicTools.find(t => t.name === selectedTool)?.effectiveness || {}).map(([category, percentage]) => (
              <div key={category} className="bg-white/10 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 text-sm capitalize">{category}</span>
                  <span className="text-white font-bold">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFileRecovery = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">🔍 File Recovery in Progress</h3>
      
      <div className="bg-gray-800 rounded-xl p-6">
        <h4 className="text-white font-bold mb-4">Scanning Deleted Files...</h4>
        <div className="space-y-3">
          {deletedFiles.map((file, index) => {
            const isRecovered = recoveredFiles.includes(file.name);
            const canRecover = selectedTool && 
              ((file.type === 'document' && selectedTool === 'PhotoRec') ||
               (file.type === 'archive' && selectedTool === 'TestDisk') ||
               (file.type === 'video' && selectedTool === 'PhotoRec') ||
               (file.type === 'database' && selectedTool === 'Sleuth Kit'));

            return (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  isRecovered 
                    ? 'bg-green-500/20 border-green-400/50'
                    : canRecover
                    ? 'bg-blue-500/20 border-blue-400/50 cursor-pointer hover:bg-blue-500/30'
                    : 'bg-white/10 border-white/20'
                }`}
                onClick={() => {
                  if (canRecover && !isRecovered) {
                    setRecoveredFiles([...recoveredFiles, file.name]);
                    setScore(score + (file.evidenceValue === 'critical' ? 30 : file.evidenceValue === 'high' ? 20 : 10));
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-white font-bold">{file.name}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        file.evidenceValue === 'critical' ? 'bg-red-500' :
                        file.evidenceValue === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}>
                        {file.evidenceValue} evidence
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">
                      Size: {file.size} | Modified: {file.lastModified}
                    </div>
                    {isRecovered && (
                      <div className="text-green-400 text-sm mt-2">
                        📄 {file.content}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`text-sm px-2 py-1 rounded ${
                      file.recoveryDifficulty === 'easy' ? 'bg-green-600' :
                      file.recoveryDifficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                      {file.recoveryDifficulty}
                    </div>
                    <div className="mt-2">
                      {isRecovered ? (
                        <span className="text-green-400">✅ Recovered</span>
                      ) : canRecover ? (
                        <span className="text-blue-400">🔍 Click to recover</span>
                      ) : (
                        <span className="text-gray-400">❌ Wrong tool</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {recoveredFiles.length > 0 && (
        <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">📁 Evidence Recovered</h4>
          <div className="space-y-2">
            {recoveredFiles.map((fileName, index) => {
              const file = deletedFiles.find(f => f.name === fileName);
              return (
                <div key={index} className="bg-white/10 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-bold">{fileName}</span>
                    <button
                      onClick={() => {
                        if (file && !evidenceAnalyzed.includes(fileName)) {
                          setEvidenceAnalyzed([...evidenceAnalyzed, fileName]);
                          setScore(score + 15);
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Analyze Evidence
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-6xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          🔍 Digital File Recovery & Forensics
        </h2>
        <p className="text-white/80">Investigate cybercrimes by recovering deleted evidence</p>
      </div>

      {/* Progress Display */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-white/60 text-sm">Investigation Score</div>
        </div>
        <div className="bg-green-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{recoveredFiles.length}</div>
          <div className="text-white/60 text-sm">Files Recovered</div>
        </div>
        <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{evidenceAnalyzed.length}</div>
          <div className="text-white/60 text-sm">Evidence Analyzed</div>
        </div>
        <div className="bg-purple-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{scenarios[currentScenario]?.difficulty || 'N/A'}</div>
          <div className="text-white/60 text-sm">Difficulty Level</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {renderScenarioSelection()}
        {renderToolSelection()}
        {selectedTool && renderFileRecovery()}
      </div>

      {/* Completion Check */}
      {recoveredFiles.length >= 3 && evidenceAnalyzed.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-2">🎉 Investigation Complete!</h3>
          <p className="text-white/90 mb-4">You've successfully recovered critical evidence and solved the case.</p>
          <button
            onClick={() => onComplete(score)}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Submit Investigation Report
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Metadata Analysis and EXIF Investigation Tutorial
export const MetadataAnalysisTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [discoveredMetadata, setDiscoveredMetadata] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>({});

  const suspiciousFiles = [
    {
      name: "vacation_photo.jpg",
      type: "image",
      icon: "📸",
      metadata: {
        camera: "Canon EOS 5D Mark IV",
        location: "38.8951°N, 77.0364°W (Washington, DC)",
        timestamp: "2024-01-15 14:30:25",
        software: "Adobe Photoshop CC 2024",
        hidden: "Secret meeting location coordinates embedded"
      },
      suspicionLevel: "high"
    },
    {
      name: "document.pdf",
      type: "document", 
      icon: "📄",
      metadata: {
        author: "John_Hacker_2024",
        creationDate: "2024-01-20 09:15:00",
        modificationDate: "2024-01-20 09:45:30",
        producer: "Microsoft Word",
        hidden: "Author name reveals suspect identity"
      },
      suspicionLevel: "medium"
    },
    {
      name: "meeting_audio.mp3",
      type: "audio",
      icon: "🎵", 
      metadata: {
        duration: "00:45:32",
        encoder: "LAME 3.100",
        recordingDevice: "iPhone 15 Pro",
        bitrate: "320 kbps",
        hidden: "Background conversation reveals criminal plans"
      },
      suspicionLevel: "critical"
    },
    {
      name: "spreadsheet.xlsx",
      type: "spreadsheet",
      icon: "📊",
      metadata: {
        lastAuthor: "finance_manager_offshore",
        company: "Shell Corporation Ltd",
        createdBy: "Excel 365",
        templateUsed: "Money_Laundering_Template.xltx",
        hidden: "Financial records show illegal transactions"
      },
      suspicionLevel: "critical"
    }
  ];

  const metadataTools = [
    {
      name: "ExifTool",
      description: "Extract comprehensive metadata from files",
      icon: "🔧",
      effectiveness: ["images", "documents", "audio", "video"]
    },
    {
      name: "FOCA",
      description: "Forensic analysis of Office documents",
      icon: "📋",
      effectiveness: ["documents", "spreadsheets", "presentations"]
    },
    {
      name: "Metadata Extractor",
      description: "Extract hidden information from various file types", 
      icon: "🔍",
      effectiveness: ["images", "documents", "multimedia"]
    },
    {
      name: "Strings",
      description: "Find readable text in binary files",
      icon: "📝",
      effectiveness: ["executables", "binary", "compressed"]
    }
  ];

  const analyzeFile = (file: any) => {
    setSelectedFile(file);
    setAnalysisResults(file.metadata);
    
    // Add to discovered metadata if not already found
    if (!discoveredMetadata.includes(file.name)) {
      setDiscoveredMetadata([...discoveredMetadata, file.name]);
      setScore(score + (file.suspicionLevel === 'critical' ? 30 : file.suspicionLevel === 'high' ? 20 : 10));
    }
  };

  const extractHiddenData = () => {
    if (selectedFile && !discoveredMetadata.includes(selectedFile.hidden)) {
      setDiscoveredMetadata([...discoveredMetadata, selectedFile.hidden]);
      setScore(score + 25);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-6xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          🔍 Metadata Analysis & EXIF Investigation
        </h2>
        <p className="text-white/80">Uncover hidden information in digital files</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* File Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">📁 Suspicious Files</h3>
          {suspiciousFiles.map((file, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => analyzeFile(file)}
              className={`bg-white/10 rounded-lg p-4 cursor-pointer transition-all ${
                selectedFile?.name === file.name ? 'ring-2 ring-blue-400' : 'hover:bg-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{file.icon}</span>
                  <div>
                    <div className="text-white font-bold">{file.name}</div>
                    <div className="text-white/60 text-sm">{file.type}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  file.suspicionLevel === 'critical' ? 'bg-red-500' :
                  file.suspicionLevel === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                }`}>
                  {file.suspicionLevel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">🔬 Metadata Analysis</h3>
          
          {selectedFile ? (
            <div className="bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">
                Analyzing: {selectedFile.name}
              </h4>
              
              <div className="space-y-3">
                {Object.entries(analysisResults).filter(([key]) => key !== 'hidden').map(([key, value]) => (
                  <div key={key} className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-white font-mono">{value as string}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={extractHiddenData}
                className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold"
              >
                🕵️ Extract Hidden Data
              </button>
              
              {discoveredMetadata.includes(selectedFile.hidden) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg"
                >
                  <div className="text-red-200 font-bold mb-2">🚨 Critical Evidence Found:</div>
                  <div className="text-white">{selectedFile.hidden}</div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <p className="text-white/60">Select a file to begin metadata analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Tools Panel */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">🛠️ Forensic Tools</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {metadataTools.map((tool, index) => (
            <div key={index} className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl mb-2">{tool.icon}</div>
                <h4 className="text-white font-bold text-sm mb-2">{tool.name}</h4>
                <p className="text-white/70 text-xs mb-3">{tool.description}</p>
                <div className="text-white/60 text-xs">
                  Supports: {tool.effectiveness.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      {discoveredMetadata.length > 0 && (
        <div className="mt-8 bg-green-500/20 border border-green-400/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📋 Investigation Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-white/80 text-sm mb-2">Files Analyzed:</div>
              <div className="text-white font-bold">{discoveredMetadata.filter(item => suspiciousFiles.some(f => f.name === item)).length}</div>
            </div>
            <div>
              <div className="text-white/80 text-sm mb-2">Evidence Discovered:</div>
              <div className="text-white font-bold">{discoveredMetadata.filter(item => !suspiciousFiles.some(f => f.name === item)).length}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-white/80 text-sm mb-2">Investigation Score:</div>
            <div className="text-2xl font-bold text-green-400">{score} points</div>
          </div>

          {score >= 100 && (
            <button
              onClick={() => onComplete(score)}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold"
            >
              Complete Metadata Investigation 🎉
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Cybersecurity Escape Room Challenge
export const CyberEscapeRoomTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [score, setScore] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [gameState, setGameState] = useState<any>({});

  const rooms = [
    {
      id: "server-room",
      name: "Server Room Infiltration",
      description: "You've gained access to the main server room. Find the admin credentials.",
      icon: "🖥️",
      background: "from-blue-900 to-purple-900",
      puzzles: ["network-scan", "password-crack", "privilege-escalation"]
    },
    {
      id: "crypto-lab", 
      name: "Cryptography Laboratory",
      description: "Decrypt the secret messages to unlock the next area.",
      icon: "🔐",
      background: "from-green-900 to-teal-900",
      puzzles: ["caesar-cipher", "rsa-decrypt", "steganography-decode"]
    },
    {
      id: "forensics-chamber",
      name: "Digital Forensics Chamber", 
      description: "Analyze the evidence to identify the insider threat.",
      icon: "🔍",
      background: "from-red-900 to-orange-900",
      puzzles: ["log-analysis", "file-recovery", "timeline-reconstruction"]
    },
    {
      id: "final-vault",
      name: "Security Vault",
      description: "Use everything you've learned to access the final vault.",
      icon: "🏛️",
      background: "from-yellow-900 to-red-900", 
      puzzles: ["multi-factor-auth", "social-engineering-defense", "incident-response"]
    }
  ];

  const puzzles = {
    "network-scan": {
      title: "Network Discovery",
      description: "Scan the network to find active hosts and open ports",
      type: "interactive",
      solution: "192.168.1.100:22,80,443",
      hint: "Use nmap to scan the 192.168.1.0/24 network",
      points: 20
    },
    "password-crack": {
      title: "Password Cracking",
      description: "Crack the admin password using common techniques",
      type: "wordlist",
      solution: "admin123!",
      hint: "Try common passwords with numbers and special characters",
      points: 25
    },
    "privilege-escalation": {
      title: "Privilege Escalation",
      description: "Gain root access to the system",
      type: "command",
      solution: "sudo -l && sudo /bin/bash",
      hint: "Check sudo permissions and exploit misconfiguration",
      points: 30
    },
    "caesar-cipher": {
      title: "Caesar Cipher Decoder",
      description: "Decode: WKLV LV D VHFUHW PHVVDJH",
      type: "cipher",
      solution: "this is a secret message",
      hint: "Shift each letter back by 3 positions",
      points: 15
    },
    "rsa-decrypt": {
      title: "RSA Decryption",
      description: "Decrypt the RSA encrypted message with the private key",
      type: "crypto",
      solution: "VAULT_CODE_7834",
      hint: "Use the RSA private key found in the previous room",
      points: 35
    },
    "steganography-decode": {
      title: "Hidden Message Extraction",
      description: "Extract the hidden message from the image file",
      type: "steganography",
      solution: "MEET_AT_MIDNIGHT",
      hint: "Use LSB extraction on the red channel",
      points: 25
    },
    "log-analysis": {
      title: "Security Log Analysis",
      description: "Identify suspicious login attempts in the logs",
      type: "forensics",
      solution: "172.16.0.55",
      hint: "Look for failed login attempts from external IPs",
      points: 20
    },
    "file-recovery": {
      title: "Deleted File Recovery",
      description: "Recover the deleted evidence file",
      type: "recovery",
      solution: "evidence_backup.zip",
      hint: "Use photorec to scan for deleted ZIP files",
      points: 30
    },
    "timeline-reconstruction": {
      title: "Timeline Analysis",
      description: "Determine the exact time of the security breach",
      type: "timeline",
      solution: "2024-01-15 14:30:00",
      hint: "Correlate system logs with network logs",
      points: 25
    },
    "multi-factor-auth": {
      title: "MFA Bypass Challenge",
      description: "Bypass the multi-factor authentication",
      type: "social-engineering",
      solution: "BACKUP_CODE_9876",
      hint: "Check for backup codes in the user's documents",
      points: 40
    },
    "social-engineering-defense": {
      title: "Social Engineering Defense",
      description: "Identify and counter the social engineering attack",
      type: "awareness",
      solution: "PHISHING_EMAIL_DETECTED",
      hint: "Analyze email headers and sender reputation",
      points: 30
    },
    "incident-response": {
      title: "Incident Response Protocol",
      description: "Execute proper incident response procedures",
      type: "procedure",
      solution: "ISOLATE_CONTAIN_ERADICATE_RECOVER",
      hint: "Follow the NIST incident response framework",
      points: 35
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const solvePuzzle = (puzzleId: string, answer: string) => {
    const puzzle = puzzles[puzzleId as keyof typeof puzzles];
    if (puzzle && answer.toLowerCase().trim() === puzzle.solution.toLowerCase()) {
      if (!solvedPuzzles.includes(puzzleId)) {
        setSolvedPuzzles([...solvedPuzzles, puzzleId]);
        setScore(score + puzzle.points);
        
        // Add items to inventory based on puzzle solved
        if (puzzleId === 'password-crack') setInventory([...inventory, 'admin_credentials']);
        if (puzzleId === 'rsa-decrypt') setInventory([...inventory, 'vault_code']);
        if (puzzleId === 'file-recovery') setInventory([...inventory, 'evidence_file']);
      }
      return true;
    }
    return false;
  };

  const canAdvanceToNextRoom = () => {
    const currentRoomPuzzles = rooms[currentRoom].puzzles;
    return currentRoomPuzzles.every(puzzleId => solvedPuzzles.includes(puzzleId));
  };

  const renderPuzzle = (puzzleId: string) => {
    const puzzle = puzzles[puzzleId as keyof typeof puzzles];
    const isSolved = solvedPuzzles.includes(puzzleId);

    return (
      <div key={puzzleId} className={`bg-white/10 rounded-lg p-4 ${isSolved ? 'ring-2 ring-green-400' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-white font-bold">{puzzle.title}</h4>
          <span className={`px-2 py-1 rounded text-xs ${isSolved ? 'bg-green-500' : 'bg-gray-500'}`}>
            {puzzle.points} pts
          </span>
        </div>
        <p className="text-white/80 text-sm mb-3">{puzzle.description}</p>
        
        {!isSolved ? (
          <PuzzleInput puzzleId={puzzleId} onSolve={solvePuzzle} hint={puzzle.hint} />
        ) : (
          <div className="text-green-400 font-bold">✅ Solved!</div>
        )}
      </div>
    );
  };

  const currentRoomData = rooms[currentRoom];

  if (timeLeft === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-900 min-h-screen flex items-center justify-center p-6"
      >
        <div className="text-center bg-black/50 rounded-xl p-8">
          <h2 className="text-4xl font-bold text-red-400 mb-4">⏰ Time's Up!</h2>
          <p className="text-white/80 mb-6">The security system has detected your presence.</p>
          <div className="text-2xl font-bold text-white mb-6">Final Score: {score} points</div>
          <button
            onClick={() => onComplete(score)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            Exit Escape Room
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-gradient-to-br ${currentRoomData.background} min-h-screen p-6`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{currentRoomData.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{currentRoomData.name}</h1>
                <p className="text-white/80">{currentRoomData.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm">Time Remaining</div>
              <div className={`text-2xl font-mono font-bold ${timeLeft < 600 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Room Progress</span>
            <span className="text-white">{solvedPuzzles.filter(p => currentRoomData.puzzles.includes(p)).length}/{currentRoomData.puzzles.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(solvedPuzzles.filter(p => currentRoomData.puzzles.includes(p)).length / currentRoomData.puzzles.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Puzzles */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">🧩 Security Challenges</h3>
            {currentRoomData.puzzles.map(puzzleId => renderPuzzle(puzzleId))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score & Inventory */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">📊 Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Score:</span>
                  <span className="text-yellow-400 font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Room:</span>
                  <span className="text-white">{currentRoom + 1}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Puzzles Solved:</span>
                  <span className="text-green-400">{solvedPuzzles.length}</span>
                </div>
              </div>
              
              {inventory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <h5 className="text-white font-bold mb-2">🎒 Inventory</h5>
                  <div className="space-y-2">
                    {inventory.map((item, index) => (
                      <div key={index} className="bg-white/10 rounded px-3 py-1 text-sm text-white">
                        {item.replace(/_/g, ' ').toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Room Navigation */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">🚪 Room Access</h4>
              <div className="space-y-2">
                {rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className={`p-3 rounded-lg ${
                      index === currentRoom 
                        ? 'bg-blue-500/50 border border-blue-400' 
                        : index < currentRoom 
                        ? 'bg-green-500/20 cursor-pointer hover:bg-green-500/30'
                        : 'bg-gray-500/20 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (index <= currentRoom) setCurrentRoom(index);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{room.icon}</span>
                      <div>
                        <div className="text-white font-bold text-sm">{room.name}</div>
                        <div className="text-white/60 text-xs">
                          {index < currentRoom ? '✅ Complete' : 
                           index === currentRoom ? '🎯 Current' : '🔒 Locked'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {canAdvanceToNextRoom() && currentRoom < rooms.length - 1 && (
                <button
                  onClick={() => setCurrentRoom(currentRoom + 1)}
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
                >
                  Advance to Next Room 🚀
                </button>
              )}
              
              {currentRoom === rooms.length - 1 && canAdvanceToNextRoom() && (
                <button
                  onClick={() => onComplete(score + Math.floor(timeLeft / 10))}
                  className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold"
                >
                  Escape Successfully! 🎉
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Puzzle Input Component
const PuzzleInput: React.FC<{ puzzleId: string, onSolve: (id: string, answer: string) => boolean, hint: string }> = ({ 
  puzzleId, onSolve, hint 
}) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const success = onSolve(puzzleId, answer);
    if (success) {
      setFeedback('✅ Correct!');
      setAnswer('');
    } else {
      setFeedback('❌ Incorrect. Try again!');
    }
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500"
          placeholder="Enter your answer..."
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-yellow-400 hover:text-yellow-300 text-sm"
        >
          {showHint ? 'Hide Hint' : '💡 Show Hint'}
        </button>
        {feedback && <span className="text-sm">{feedback}</span>}
      </div>
      
      {showHint && (
        <div className="bg-yellow-500/20 border border-yellow-400/50 rounded p-3">
          <div className="text-yellow-200 text-sm">{hint}</div>
        </div>
      )}
    </div>
  );
};

// Main Day 5 Enhanced Tutorial Component
const Day5EnhancedTutorials: React.FC = () => {
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const tutorials = [
    {
      id: 'file-recovery',
      title: 'Digital File Recovery & Forensics',
      description: 'Master advanced file recovery and digital forensics techniques',
      icon: '🔍',
      estimatedTime: '35 minutes',
      component: FileRecoveryTutorial
    },
    {
      id: 'metadata-analysis',
      title: 'Metadata Analysis & EXIF Investigation',
      description: 'Uncover hidden information in digital files and metadata',
      icon: '📊',
      estimatedTime: '25 minutes',
      component: MetadataAnalysisTutorial
    },
    {
      id: 'cyber-escape-room',
      title: 'Cybersecurity Escape Room Challenge',
      description: 'Test all your skills in an immersive escape room experience',
      icon: '🏃',
      estimatedTime: '60 minutes',
      component: CyberEscapeRoomTutorial
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
            🕵️ Day 5 Enhanced Investigation Labs
          </h1>
          <p className="text-white/80 text-lg">
            Advanced digital forensics, metadata analysis, and cybersecurity challenges
          </p>
          
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{completedTutorials.length}</div>
                <div className="text-white/60 text-sm">Investigations Completed</div>
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
                    {isCompleted ? 'Review Investigation' : 'Start Investigation'}
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
              🎉 Day 5 Enhanced Investigations Complete!
            </h2>
            <p className="text-white/90 mb-4">
              Exceptional work! You've mastered advanced digital forensics, metadata analysis, and complex cybersecurity challenges.
              You're now ready to be a cybersecurity professional!
            </p>
            <div className="text-3xl font-bold text-white mb-4">
              Final Score: {totalScore} points
            </div>
            <div className="bg-white/20 rounded-lg p-4 inline-block">
              <div className="text-white font-bold mb-2">🏆 Achievements Unlocked:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-green-300">🔍 Digital Detective</div>
                <div className="text-blue-300">📊 Metadata Master</div>
                <div className="text-purple-300">🏃 Escape Room Champion</div>
                <div className="text-yellow-300">🛡️ Cybersecurity Expert</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Day5EnhancedTutorials;
