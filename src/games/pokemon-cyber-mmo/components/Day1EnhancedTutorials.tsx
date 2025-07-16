import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Shield, Target } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Enhanced Day 1 Social Features
export const TeammateFinderTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [trainerType, setTrainerType] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teammates, setTeammates] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const personalityQuestions = [
    {
      question: "In a cybersecurity incident, you would most likely:",
      options: [
        "Analyze the attack patterns methodically", // Analyst
        "Quickly coordinate team response", // Leader  
        "Research the latest threat intelligence", // Researcher
        "Test defenses to find vulnerabilities" // Penetration Tester
      ],
      types: ["Cyber Analyst", "Team Leader", "Threat Researcher", "Ethical Hacker"]
    },
    {
      question: "Your ideal Pokemon team would focus on:",
      options: [
        "Defensive walls and protection",
        "Coordinated group strategies", 
        "Gathering intelligence and scouting",
        "Fast offensive attacks"
      ],
      types: ["Cyber Analyst", "Team Leader", "Threat Researcher", "Ethical Hacker"]
    },
    {
      question: "When learning new cybersecurity concepts, you prefer:",
      options: [
        "Step-by-step detailed analysis",
        "Hands-on team exercises",
        "Research and case studies", 
        "Interactive hacking simulations"
      ],
      types: ["Cyber Analyst", "Team Leader", "Threat Researcher", "Ethical Hacker"]
    }
  ];

  const trainerTypes = {
    "Cyber Analyst": {
      description: "Patient and methodical, you excel at analyzing threats and protecting systems.",
      pokemon: "Guardmon", 
      icon: "🛡️",
      strengths: ["Threat Detection", "System Analysis", "Pattern Recognition"],
      teamRole: "Defender"
    },
    "Team Leader": {
      description: "Natural coordinator who brings teams together to solve complex problems.",
      pokemon: "Coordinatemon",
      icon: "⚡",
      strengths: ["Team Coordination", "Strategic Planning", "Communication"],
      teamRole: "Leader"
    },
    "Threat Researcher": {
      description: "Curious investigator who uncovers the latest cyber threats and trends.",
      pokemon: "Scoutmon",
      icon: "🔍", 
      strengths: ["Research", "Intelligence Gathering", "Trend Analysis"],
      teamRole: "Intelligence"
    },
    "Ethical Hacker": {
      description: "Creative problem solver who thinks like an attacker to improve defenses.",
      pokemon: "Hackmon",
      icon: "🕵️",
      strengths: ["Penetration Testing", "Creative Thinking", "Vulnerability Assessment"],
      teamRole: "Offense"
    }
  };

  const generateTeammates = (playerType: string) => {
    const types = Object.keys(trainerTypes).filter(type => type !== playerType);
    const shuffled = types.sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, 2).map((type, index) => ({
      name: ["Alex", "Sam", "Jordan", "Casey", "Riley", "Morgan"][Math.floor(Math.random() * 6)],
      type: type,
      pokemon: trainerTypes[type as keyof typeof trainerTypes].pokemon,
      icon: trainerTypes[type as keyof typeof trainerTypes].icon,
      online: Math.random() > 0.3 // 70% chance of being online
    }));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers, personalityQuestions[currentStep].types[answerIndex]];
    setSelectedAnswers(newAnswers);
    
    if (currentStep + 1 >= personalityQuestions.length) {
      // Calculate trainer type based on most common answer
      const typeCounts: { [key: string]: number } = {};
      newAnswers.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      
      const dominantType = Object.entries(typeCounts).sort(([,a], [,b]) => b - a)[0][0];
      setTrainerType(dominantType);
      setTeammates(generateTeammates(dominantType));
      setScore(75); // Base score for completing assessment
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleTeamFormation = () => {
    if (teamName.trim()) {
      setScore(100);
      setTimeout(() => onComplete(100), 2000);
    }
  };

  // Personality Assessment Phase
  if (currentStep < personalityQuestions.length && !trainerType) {
    const question = personalityQuestions[currentStep];
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          🎯 Cyber Trainer Type Assessment
        </h3>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-4">
            Question {currentStep + 1} of {personalityQuestions.length}
          </h4>
          <p className="text-white/90 text-lg mb-6">{question.question}</p>
          
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-left transition-all hover:scale-105"
              >
                <span className="font-bold">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / personalityQuestions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-white/60 text-sm">Discovering your cyber trainer type...</p>
        </div>
      </motion.div>
    );
  }

  // Results & Team Formation Phase
  if (trainerType && !teamName) {
    const typeInfo = trainerTypes[trainerType as keyof typeof trainerTypes];
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-5xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          🎉 Meet Your Cyber Team!
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Player Type */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-2">Your Trainer Type</h4>
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{typeInfo.icon}</div>
              <div>
                <h5 className="text-xl font-bold text-white">{trainerType}</h5>
                <p className="text-blue-200 text-sm">{typeInfo.teamRole}</p>
              </div>
            </div>
            <p className="text-white/90 text-sm mb-4">{typeInfo.description}</p>
            <div className="bg-white/10 rounded-lg p-3">
              <h6 className="text-white font-bold text-sm mb-2">Your Strengths:</h6>
              <div className="flex flex-wrap gap-2">
                {typeInfo.strengths.map((strength, index) => (
                  <span key={index} className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded text-xs">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Teammates */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Your Teammates</h4>
            <div className="space-y-3">
              {teammates.map((teammate, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center">
                  <div className="text-2xl mr-3">{teammate.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h6 className="text-white font-bold">{teammate.name}</h6>
                      <span className={`text-xs px-2 py-1 rounded ${
                        teammate.online ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-200'
                      }`}>
                        {teammate.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <p className="text-green-200 text-sm">{teammate.type}</p>
                    <p className="text-green-100 text-xs">Partner: {teammate.pokemon}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Team Name Formation */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">🏆 Create Your Team Name</h4>
          <p className="text-white/90 mb-4">
            Work with your teammates to choose a creative team name that represents your cybersecurity mission!
          </p>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name..."
              className="flex-1 p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20"
              maxLength={30}
            />
            <button
              onClick={handleTeamFormation}
              disabled={!teamName.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-bold"
            >
              Form Team!
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {["Cyber Guardians", "Code Breakers", "Digital Defenders", "Hack Heroes", "Pixel Protectors", "Binary Bashers", "Firewall Force", "Crypto Crusaders"].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setTeamName(suggestion)}
                className="bg-white/10 hover:bg-white/20 text-white/80 p-2 rounded text-xs"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Completion Phase
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🎉 Team Formation Complete!
      </h3>
      
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🏆</div>
        <h4 className="text-xl font-bold text-white mb-2">Welcome to Team "{teamName}"!</h4>
        <p className="text-white/90">
          You're now ready to tackle cybersecurity challenges together as a {trainerType}.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 mb-4">
        <p className="text-white font-bold text-center">🎮 You've unlocked Teammon!</p>
        <p className="text-white/90 text-sm text-center">
          Team collaboration is essential in cybersecurity. Great teams combine different skills and perspectives!
        </p>
      </div>
      
      <button
        onClick={() => onComplete(100)}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
      >
        Join Your Team!
      </button>
    </motion.div>
  );
};

// Collaborative Drawing Activity
export const TeamDrawingTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [drawings, setDrawings] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [challenge, setChallenge] = useState(0);

  const challenges = [
    {
      title: "Draw a Secure Network",
      description: "Work together to draw a network diagram showing computers, routers, and firewalls.",
      points: 25,
      keywords: ["computer", "router", "firewall", "connection"]
    },
    {
      title: "Design a Password Strategy", 
      description: "Illustrate what makes a strong password using symbols and drawings.",
      points: 25,
      keywords: ["password", "symbols", "length", "strength"]
    },
    {
      title: "Create a Cyber Hero",
      description: "Design a superhero character that represents cybersecurity protection.",
      points: 25,
      keywords: ["hero", "shield", "protection", "cyber"]
    },
    {
      title: "Map Attack vs Defense",
      description: "Draw a battle scene showing cyber attackers vs defenders.",
      points: 25, 
      keywords: ["attack", "defense", "battle", "protection"]
    }
  ];

  const tools = [
    { name: 'pen', icon: '✏️', size: 2 },
    { name: 'brush', icon: '🖌️', size: 8 },
    { name: 'marker', icon: '🖊️', size: 12 },
    { name: 'eraser', icon: '🧽', size: 20 }
  ];

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#000000'];

  const handleDrawingComplete = () => {
    setScore(score + challenges[challenge].points);
    
    if (challenge + 1 >= challenges.length) {
      onComplete(score + challenges[challenge].points);
    } else {
      setChallenge(challenge + 1);
    }
  };

  const currentChallenge = challenges[challenge];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-6xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🎨 Team Cyber Art Studio
      </h3>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Challenge Instructions */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Challenge {challenge + 1}: {currentChallenge.title}
          </h4>
          <p className="text-white/90 mb-4">{currentChallenge.description}</p>
          
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <h5 className="text-white font-bold text-sm mb-2">Team Goal:</h5>
            <p className="text-white/80 text-sm">
              Collaborate to create an illustration that teaches others about this cybersecurity concept.
            </p>
          </div>
          
          <button
            onClick={handleDrawingComplete}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
          >
            Complete Drawing ({currentChallenge.points} pts)
          </button>
        </div>
        
        {/* Drawing Tools */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Drawing Tools</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-white text-sm font-bold mb-2">Tools:</h5>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => setCurrentTool(tool.name)}
                    className={`p-2 rounded text-center ${
                      currentTool === tool.name 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-lg">{tool.icon}</div>
                    <div className="text-xs">{tool.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-white text-sm font-bold mb-2">Colors:</h5>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-8 h-8 rounded border-2 ${
                      currentColor === color ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Drawing Canvas */}
        <div className="md:col-span-2 bg-white rounded-lg p-4">
          <h4 className="text-gray-800 font-bold mb-4">Collaborative Canvas</h4>
          <div 
            className="relative bg-white border-2 border-gray-300 rounded-lg h-80 overflow-hidden"
            style={{ cursor: currentTool === 'eraser' ? 'crosshair' : 'pointer' }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Drawing strokes would be rendered here */}
              <text x="50%" y="50%" textAnchor="middle" className="fill-gray-400 text-lg">
                Canvas Area - Draw Here!
              </text>
            </svg>
            
            {/* Simulated teammate cursors */}
            <div className="absolute top-10 left-20 animate-pulse">
              <div className="text-blue-500">🖱️</div>
              <div className="text-xs text-blue-600 font-bold">Alex</div>
            </div>
            <div className="absolute top-32 right-16 animate-pulse">
              <div className="text-green-500">🖱️</div>
              <div className="text-xs text-green-600 font-bold">Sam</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-gray-600 text-sm">
              Active: {currentTool} | Color: <span className="inline-block w-4 h-4 rounded border" style={{backgroundColor: currentColor}}></span>
            </div>
            <div className="text-gray-600 text-sm">
              Challenge {challenge + 1} of {challenges.length} | Score: {score}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Windows Security Basics Tutorial
export const WindowsSecurityTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showGodMode, setShowGodMode] = useState(false);

  const securitySections = [
    {
      title: "User Account Control",
      description: "Learn how to manage user accounts and permissions in Windows",
      icon: "👤",
      tasks: [
        { id: "create-user", name: "Create a new standard user account", points: 15 },
        { id: "set-password", name: "Set up password requirements", points: 15 },
        { id: "admin-rights", name: "Understand administrator privileges", points: 10 }
      ],
      simulation: {
        panel: "User Accounts",
        options: ["Create User", "Change Password", "Manage Admin Rights", "Set Parental Controls"]
      }
    },
    {
      title: "Windows Firewall",
      description: "Configure Windows Firewall to protect your computer",
      icon: "🔥",
      tasks: [
        { id: "enable-firewall", name: "Enable Windows Firewall", points: 10 },
        { id: "add-exception", name: "Add a program exception", points: 15 },
        { id: "block-program", name: "Block a suspicious program", points: 20 }
      ],
      simulation: {
        panel: "Windows Firewall",
        options: ["Turn On/Off Firewall", "Allow App Through Firewall", "Advanced Settings", "Restore Defaults"]
      }
    },
    {
      title: "Internet Security Settings",
      description: "Secure your web browser and internet connections",
      icon: "🌐",
      tasks: [
        { id: "security-zones", name: "Configure security zones", points: 15 },
        { id: "pop-up-blocker", name: "Enable pop-up blocker", points: 10 },
        { id: "download-settings", name: "Set secure download settings", points: 15 }
      ],
      simulation: {
        panel: "Internet Options",
        options: ["Security Zones", "Privacy Settings", "Pop-up Blocker", "Download Security"]
      }
    },
    {
      title: "God Mode (Advanced)",
      description: "Access advanced Windows configuration options",
      icon: "⚡",
      tasks: [
        { id: "create-godmode", name: "Create God Mode folder", points: 20 },
        { id: "explore-settings", name: "Explore advanced settings", points: 15 },
        { id: "security-audit", name: "Perform security audit", points: 15 }
      ],
      simulation: {
        panel: "God Mode",
        options: ["All Control Panel Items", "Security Settings", "Administrative Tools", "System Configuration"]
      }
    }
  ];

  const handleTaskComplete = (taskId: string, points: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      setScore(score + points);
    }
  };

  const handleSectionComplete = () => {
    if (currentSection === 3) { // God Mode section
      setShowGodMode(true);
    }
    
    if (currentSection + 1 >= securitySections.length) {
      onComplete(score);
    } else {
      setCurrentSection(currentSection + 1);
    }
  };

  const currentSectionData = securitySections[currentSection];
  const sectionProgress = currentSectionData.tasks.filter(task => completedTasks.includes(task.id)).length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-6xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🛡️ Windows Security Command Center
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Section Navigation */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Security Modules</h4>
          <div className="space-y-3">
            {securitySections.map((section, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  index === currentSection 
                    ? 'bg-white/20 border-2 border-white/50' 
                    : index < currentSection 
                    ? 'bg-green-500/20 border border-green-400/50'
                    : 'bg-white/10 border border-white/20'
                }`}
                onClick={() => index <= currentSection && setCurrentSection(index)}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{section.icon}</span>
                  <div>
                    <h5 className="text-white font-bold text-sm">{section.title}</h5>
                    <p className="text-white/70 text-xs">{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Overall Progress:</span>
              <span>{completedTasks.length}/{securitySections.reduce((sum, s) => sum + s.tasks.length, 0)}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Score:</span>
              <span>{score} points</span>
            </div>
          </div>
        </div>
        
        {/* Control Panel Simulation */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="bg-gray-700 rounded-t-lg px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white/60 text-sm ml-4">Control Panel - {currentSectionData.simulation.panel}</span>
          </div>
          
          <div className="bg-white rounded-b-lg p-4 h-80">
            <h4 className="text-gray-800 font-bold mb-4">{currentSectionData.simulation.panel}</h4>
            <div className="grid grid-cols-2 gap-3">
              {currentSectionData.simulation.options.map((option, index) => (
                <button
                  key={index}
                  className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-gray-800 text-sm text-left"
                >
                  <div className="font-bold">{option}</div>
                  <div className="text-gray-600 text-xs">Click to configure</div>
                </button>
              ))}
            </div>
            
            {showGodMode && currentSection === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg"
              >
                <h5 className="text-yellow-800 font-bold text-sm mb-2">⚡ God Mode Activated!</h5>
                <p className="text-yellow-700 text-xs">
                  You now have access to all Windows configuration options in one place. 
                  Use this power responsibly!
                </p>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Tasks & Instructions */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            {currentSectionData.title}
          </h4>
          <p className="text-white/90 mb-4 text-sm">{currentSectionData.description}</p>
          
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">Tasks to Complete:</h5>
            {currentSectionData.tasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <div 
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    isCompleted 
                      ? 'bg-green-500/20 border-green-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isCompleted ? 'text-green-200' : 'text-white'}`}>
                      {isCompleted ? '✅' : '⏳'} {task.name}
                    </span>
                    <span className="text-xs text-white/70">{task.points}pts</span>
                  </div>
                  {!isCompleted && (
                    <button
                      onClick={() => handleTaskComplete(task.id, task.points)}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Complete Task
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-white/80 text-sm mb-2">
              <span>Section Progress:</span>
              <span>{sectionProgress}/{currentSectionData.tasks.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(sectionProgress / currentSectionData.tasks.length) * 100}%` }}
              ></div>
            </div>
            
            {sectionProgress === currentSectionData.tasks.length && (
              <button
                onClick={handleSectionComplete}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold"
              >
                {currentSection + 1 >= securitySections.length ? 'Complete Security Training' : 'Next Module'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced File System Tutorial
export const EnhancedFileSystemTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentDirectory, setCurrentDirectory] = useState('/C:/Users/Student');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [score, setScore] = useState(0);
  const [discoveredFileTypes, setDiscoveredFileTypes] = useState<string[]>([]);

  const fileSystem = {
    '/C:/': {
      type: 'folder',
      name: 'C Drive',
      children: {
        'Users': {
          type: 'folder',
          name: 'Users',
          children: {
            'Student': {
              type: 'folder',
              name: 'Student',
              children: {
                'Documents': {
                  type: 'folder',
                  name: 'Documents',
                  children: {
                    'report.docx': { type: 'file', name: 'report.docx', size: '25 KB', description: 'Microsoft Word Document' },
                    'presentation.pptx': { type: 'file', name: 'presentation.pptx', size: '2.1 MB', description: 'PowerPoint Presentation' },
                    'data.xlsx': { type: 'file', name: 'data.xlsx', size: '156 KB', description: 'Excel Spreadsheet' }
                  }
                },
                'Downloads': {
                  type: 'folder',
                  name: 'Downloads',
                  children: {
                    'setup.exe': { type: 'file', name: 'setup.exe', size: '45 MB', description: 'Executable Program', warning: true },
                    'image.jpg': { type: 'file', name: 'image.jpg', size: '2.3 MB', description: 'JPEG Image' },
                    'archive.zip': { type: 'file', name: 'archive.zip', size: '15 MB', description: 'Compressed Archive' }
                  }
                },
                'Pictures': {
                  type: 'folder',
                  name: 'Pictures',
                  children: {
                    'vacation.png': { type: 'file', name: 'vacation.png', size: '4.2 MB', description: 'PNG Image' },
                    'screenshot.bmp': { type: 'file', name: 'screenshot.bmp', size: '8.1 MB', description: 'Bitmap Image' }
                  }
                }
              }
            }
          }
        },
        'Program Files': {
          type: 'folder',
          name: 'Program Files',
          children: {
            'Common Files': { type: 'folder', name: 'Common Files' },
            'Windows Defender': { type: 'folder', name: 'Windows Defender' }
          }
        },
        'Windows': {
          type: 'folder',
          name: 'Windows',
          children: {
            'System32': { type: 'folder', name: 'System32', protected: true },
            'Temp': { type: 'folder', name: 'Temp' }
          }
        }
      }
    }
  };

  const commands = [
    { cmd: 'dir', description: 'List files and folders in current directory' },
    { cmd: 'cd [folder]', description: 'Change to specified directory' },
    { cmd: 'cd ..', description: 'Go up one directory level' },
    { cmd: 'type [file]', description: 'Display contents of a text file' },
    { cmd: 'attrib [file]', description: 'Show file attributes and properties' },
    { cmd: 'tree', description: 'Display directory structure as a tree' }
  ];

  const fileTypes = {
    '.exe': { name: 'Executable', risk: 'High', description: 'Can run programs and potentially contain malware' },
    '.docx': { name: 'Word Document', risk: 'Low', description: 'Text document, generally safe' },
    '.jpg': { name: 'JPEG Image', risk: 'Low', description: 'Image file, usually safe' },
    '.zip': { name: 'Archive', risk: 'Medium', description: 'Compressed files, scan before extracting' },
    '.pdf': { name: 'PDF Document', risk: 'Low', description: 'Portable document, generally safe' },
    '.bat': { name: 'Batch Script', risk: 'High', description: 'Can execute commands, potentially dangerous' }
  };

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
    const extension = '.' + file.name.split('.').pop();
    if (!discoveredFileTypes.includes(extension) && fileTypes[extension as keyof typeof fileTypes]) {
      setDiscoveredFileTypes([...discoveredFileTypes, extension]);
      setScore(score + 10);
    }
  };

  const executeCommand = (cmd: string) => {
    setCommandHistory([...commandHistory, `C:${currentDirectory}> ${cmd}`]);
    setCurrentCommand('');
    
    if (cmd.toLowerCase() === 'dir') {
      setScore(score + 5);
    } else if (cmd.toLowerCase().startsWith('cd ')) {
      setScore(score + 5);
    } else if (cmd.toLowerCase() === 'tree') {
      setScore(score + 10);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-7xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        📁 Advanced File System Explorer
      </h3>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* File System Navigator */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">File Explorer</h4>
          <div className="bg-white/10 rounded-lg p-3 max-h-80 overflow-y-auto">
            <div className="text-white text-sm font-mono">
              <div className="mb-2 text-blue-200">📂 C:/</div>
              <div className="ml-2">
                <div className="mb-1 cursor-pointer hover:bg-white/10 p-1 rounded">📂 Users</div>
                <div className="ml-2">
                  <div className="mb-1 cursor-pointer hover:bg-white/10 p-1 rounded">📂 Student</div>
                  <div className="ml-2">
                    <div className="mb-1 cursor-pointer hover:bg-white/10 p-1 rounded">📂 Documents</div>
                    <div className="mb-1 cursor-pointer hover:bg-white/10 p-1 rounded">📂 Downloads</div>
                    <div className="mb-1 cursor-pointer hover:bg-white/10 p-1 rounded">📂 Pictures</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Command Line Interface */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="bg-gray-700 rounded-t-lg px-4 py-2">
            <span className="text-white/60 text-sm">Command Prompt</span>
          </div>
          <div className="bg-black rounded-b-lg p-4 h-64 overflow-y-auto">
            <div className="text-green-400 font-mono text-sm">
              <div className="mb-2">Microsoft Windows [Version 10.0.19041.1]</div>
              <div className="mb-2">(c) Microsoft Corporation. All rights reserved.</div>
              <div className="mb-4"></div>
              
              {commandHistory.map((cmd, index) => (
                <div key={index} className="mb-1">{cmd}</div>
              ))}
              
              <div className="flex items-center">
                <span className="mr-2">C:{currentDirectory}&gt;</span>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                  placeholder="Enter command..."
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="text-white font-bold text-sm mb-2">Available Commands:</h5>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {commands.map((cmd, index) => (
                <div key={index} className="text-xs">
                  <span className="text-blue-300 font-mono">{cmd.cmd}</span>
                  <span className="text-gray-400 ml-2">{cmd.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* File Details Panel */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">File Inspector</h4>
          
          {selectedFile ? (
            <div className="bg-white/10 rounded-lg p-4">
              <h5 className="text-white font-bold mb-2">{selectedFile.name}</h5>
              <div className="space-y-2 text-sm">
                <div className="text-white/90">Size: {selectedFile.size}</div>
                <div className="text-white/90">Type: {selectedFile.description}</div>
                {selectedFile.warning && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded p-2">
                    <span className="text-red-200 text-xs">⚠️ Potentially dangerous file type</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-white/60 text-sm">Click on a file to inspect its properties</p>
            </div>
          )}
          
          <div className="mt-6">
            <h5 className="text-white font-bold text-sm mb-2">Discovered File Types:</h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {discoveredFileTypes.map((ext) => {
                const type = fileTypes[ext as keyof typeof fileTypes];
                return (
                  <div key={ext} className="bg-white/10 rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-xs font-mono">{ext}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        type.risk === 'High' ? 'bg-red-500' : 
                        type.risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {type.risk}
                      </span>
                    </div>
                    <div className="text-white/80 text-xs mt-1">{type.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* File Security Guide */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Security Guide</h4>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-3">
              <h5 className="text-white font-bold text-sm mb-2">🔴 High Risk Files:</h5>
              <div className="text-white/80 text-xs space-y-1">
                <div>.exe - Executable programs</div>
                <div>.bat - Batch scripts</div>
                <div>.scr - Screen savers</div>
                <div>.com - Command files</div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <h5 className="text-white font-bold text-sm mb-2">🟡 Medium Risk Files:</h5>
              <div className="text-white/80 text-xs space-y-1">
                <div>.zip - Archives</div>
                <div>.rar - Compressed files</div>
                <div>.iso - Disk images</div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <h5 className="text-white font-bold text-sm mb-2">🟢 Safe Files:</h5>
              <div className="text-white/80 text-xs space-y-1">
                <div>.txt - Text documents</div>
                <div>.jpg/.png - Images</div>
                <div>.pdf - PDF documents</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Score:</span>
              <span>{score} points</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Files Discovered:</span>
              <span>{discoveredFileTypes.length}/{Object.keys(fileTypes).length}</span>
            </div>
            
            {discoveredFileTypes.length >= 3 && (
              <button
                onClick={() => onComplete(score)}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
              >
                Complete File System Training
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Enhanced Day 1 Tutorial Component
const Day1EnhancedTutorials: React.FC = () => {
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const tutorials = [
    {
      id: 'teammate-finder',
      title: 'Find Your Teammates',
      description: 'Connect with other cyber defenders and form your team',
      icon: '👥',
      estimatedTime: '15 minutes',
      component: TeammateFinderTutorial
    },
    {
      id: 'windows-security',
      title: 'Windows Security Basics',
      description: 'Master Windows security settings and user management',
      icon: '🛡️',
      estimatedTime: '20 minutes',
      component: WindowsSecurityTutorial
    },
    {
      id: 'file-system',
      title: 'Enhanced File System',
      description: 'Deep dive into file systems, command line, and file security',
      icon: '📁',
      estimatedTime: '25 minutes',
      component: EnhancedFileSystemTutorial
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
            🎮 Day 1 Enhanced Training Modules
          </h1>
          <p className="text-white/80 text-lg">
            Advanced cybersecurity concepts with social features and deep technical skills
          </p>
          
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{completedTutorials.length}</div>
                <div className="text-white/60 text-sm">Modules Completed</div>
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
                    {isCompleted ? 'Review Tutorial' : 'Start Tutorial'}
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
              🎉 Day 1 Enhanced Training Complete!
            </h2>
            <p className="text-white/90 mb-4">
              Excellent work! You've mastered social features, Windows security, and advanced file systems.
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

export default Day1EnhancedTutorials;
