import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Search, Target, Users } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Phishing Identification Tutorial
export const PhishingIdentificationTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentEmail, setCurrentEmail] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const emails = [
    {
      from: 'security@yourbank.com',
      subject: 'URGENT: Account Verification Required',
      body: 'Dear Valued Customer,\n\nYour account has been flagged for suspicious activity. Click here immediately to verify your account or it will be suspended within 24 hours.\n\nClick here: http://yourbank-secure.net/verify\n\nThank you,\nSecurity Team',
      isPhishing: true,
      redFlags: [
        'Urgent language and time pressure',
        'Suspicious URL (yourbank-secure.net vs real bank domain)',
        'Generic greeting ("Valued Customer")',
        'Threat of account suspension'
      ],
      explanation: 'This is a classic phishing email. Banks never ask for verification via email links, and the URL domain is suspicious.'
    },
    {
      from: 'noreply@github.com',
      subject: 'Security alert: New sign-in from Chrome on Windows',
      body: 'Hi there,\n\nWe noticed a new sign-in to your GitHub account from:\n\nDevice: Chrome on Windows\nLocation: Seattle, WA\nTime: Today at 2:30 PM\n\nIf this was you, you can safely ignore this email. If not, please secure your account immediately.\n\nBest,\nThe GitHub Team',
      isPhishing: false,
      redFlags: [],
      explanation: 'This is a legitimate security notification. It provides specific details and doesn\'t ask for any action via links.'
    },
    {
      from: 'admin@schooldistric.edu',
      subject: 'Important: Update Your Password',
      body: 'Students,\n\nDue to a system update, all students must update their passwords by clicking the link below. Failure to do so will result in loss of access to school systems.\n\nUpdate now: http://bit.ly/update-school-pass\n\nIT Department',
      isPhishing: true,
      redFlags: [
        'Misspelled domain (schooldistric instead of schooldistrict)',
        'Shortened URL hides real destination',
        'Mass generic message',
        'Threat of losing access'
      ],
      explanation: 'The misspelled domain and shortened URL are major red flags. Schools would use official communication channels for password updates.'
    },
    {
      from: 'team@netflix.com',
      subject: 'Your monthly invoice',
      body: 'Hi,\n\nYour Netflix subscription has been renewed for $15.99.\n\nSubscription: Netflix Standard\nNext billing date: March 15, 2024\n\nQuestions? Visit our help center.\n\nThe Netflix Team',
      isPhishing: false,
      redFlags: [],
      explanation: 'This appears to be a legitimate billing notification with no suspicious requests or urgent calls to action.'
    }
  ];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    const currentEmailData = emails[currentEmail];
    const isCorrect = (answer === 'phishing' && currentEmailData.isPhishing) || 
                     (answer === 'legitimate' && !currentEmailData.isPhishing);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentEmail + 1 >= emails.length) {
        onComplete(score * 25);
      } else {
        setCurrentEmail(currentEmail + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    }, 4000);
  };

  const currentEmailData = emails[currentEmail];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🎣 Phishing Detection Academy
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Email Display */}
        <div className="bg-white rounded-lg p-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h4 className="text-lg font-bold text-gray-800 mb-2">Email {currentEmail + 1}</h4>
            <div className="space-y-2 text-sm">
              <div><strong>From:</strong> {currentEmailData.from}</div>
              <div><strong>Subject:</strong> {currentEmailData.subject}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="text-gray-800 text-sm whitespace-pre-wrap font-sans">
              {currentEmailData.body}
            </pre>
          </div>
          
          {!showExplanation && (
            <div className="space-y-3">
              <p className="text-gray-700 font-bold">Is this email legitimate or phishing?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAnswer('legitimate')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
                >
                  ✅ Legitimate
                </button>
                <button
                  onClick={() => handleAnswer('phishing')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold"
                >
                  🎣 Phishing
                </button>
              </div>
            </div>
          )}
          
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                currentEmailData.isPhishing ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
              }`}
            >
              <h5 className={`font-bold mb-2 ${
                currentEmailData.isPhishing ? 'text-red-800' : 'text-green-800'
              }`}>
                {currentEmailData.isPhishing ? '🎣 This is PHISHING!' : '✅ This is LEGITIMATE!'}
              </h5>
              <p className={`text-sm mb-3 ${
                currentEmailData.isPhishing ? 'text-red-700' : 'text-green-700'
              }`}>
                {currentEmailData.explanation}
              </p>
              
              {currentEmailData.redFlags.length > 0 && (
                <div>
                  <p className="text-red-700 font-bold text-sm mb-1">Red Flags:</p>
                  <ul className="text-red-600 text-xs space-y-1">
                    {currentEmailData.redFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Detection Guide */}
        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Phishing Detection Guide</h4>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-lg p-3">
              <h5 className="text-white font-bold text-sm mb-2">🚨 Red Flags to Watch For:</h5>
              <ul className="text-white/90 text-xs space-y-1">
                <li>• Urgent language and time pressure</li>
                <li>• Generic greetings ("Dear Customer")</li>
                <li>• Suspicious or shortened URLs</li>
                <li>• Requests for personal information</li>
                <li>• Poor spelling/grammar</li>
                <li>• Mismatched sender domains</li>
                <li>• Threats of account closure</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <h5 className="text-white font-bold text-sm mb-2">✅ What Legitimate Emails Do:</h5>
              <ul className="text-white/90 text-xs space-y-1">
                <li>• Use your actual name</li>
                <li>• Come from official domains</li>
                <li>• Don't pressure immediate action</li>
                <li>• Provide contact information</li>
                <li>• Have proper spelling/grammar</li>
                <li>• Don't ask for passwords via email</li>
              </ul>
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
              <h5 className="text-yellow-200 font-bold text-sm mb-2">💡 Pro Tip:</h5>
              <p className="text-yellow-100 text-xs">
                When in doubt, contact the organization directly through their official website or phone number, not through the email.
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Email:</span>
              <span>{currentEmail + 1} of {emails.length}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Score:</span>
              <span>{score}/{emails.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Academy
        </button>
      </div>
    </motion.div>
  );
};

// OSINT Investigation Tutorial
export const OSINTTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentMission, setCurrentMission] = useState(0);
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [currentClue, setCurrentClue] = useState('');
  const [score, setScore] = useState(0);
  const [investigationComplete, setInvestigationComplete] = useState(false);

  const missions = [
    {
      title: 'Social Media Investigation',
      scenario: 'A cybercriminal posted about their latest scheme. Find clues about their location and plans.',
      target: '@CyberCrimX',
      clues: [
        'Posted photo at "Joe\'s Coffee Shop" with location tag',
        'Profile mentions "Night shift worker"',
        'Recent post: "Big score tomorrow at the tech conference"',
        'Following several cryptocurrency accounts'
      ],
      correctClues: ['Posted photo at "Joe\'s Coffee Shop" with location tag', 'Recent post: "Big score tomorrow at the tech conference"'],
      evidence: 'Location: Joe\'s Coffee Shop, Plan: Attack at tech conference',
      solution: 'The criminal revealed their location through a geotagged photo and their plan to target a tech conference.'
    },
    {
      title: 'Domain Investigation',
      scenario: 'Investigate the suspicious domain "secure-banking123.com" that appeared in phishing emails.',
      target: 'secure-banking123.com',
      clues: [
        'Domain registered 2 days ago',
        'Registrar location: Russia',
        'SSL certificate is self-signed',
        'Website copied from legitimate bank',
        'No contact information provided'
      ],
      correctClues: ['Domain registered 2 days ago', 'SSL certificate is self-signed', 'Website copied from legitimate bank'],
      evidence: 'New domain, fake SSL, copied content',
      solution: 'This is clearly a phishing site: newly registered domain, suspicious location, self-signed certificate, and copied content.'
    },
    {
      title: 'Digital Footprint Analysis',
      scenario: 'Track down information about a person who may be involved in identity theft.',
      target: 'John_Hacker_2024',
      clues: [
        'LinkedIn shows employment at "DataSecure Inc"',
        'Twitter posts about attending DEF CON conference',
        'Instagram photos show expensive lifestyle',
        'GitHub repos contain suspicious scripts',
        'Uses same username across multiple platforms'
      ],
      correctClues: ['GitHub repos contain suspicious scripts', 'Instagram photos show expensive lifestyle', 'Uses same username across multiple platforms'],
      evidence: 'Suspicious code, unexplained wealth, poor OPSEC',
      solution: 'Poor operational security: using the same username everywhere, posting suspicious code, and displaying unexplained wealth.'
    }
  ];

  const investigateClue = (clue: string) => {
    if (!discoveredClues.includes(clue)) {
      setDiscoveredClues([...discoveredClues, clue]);
      setCurrentClue(clue);
      
      const mission = missions[currentMission];
      if (mission.correctClues.includes(clue)) {
        setScore(score + 1);
      }
    }
  };

  const completeMission = () => {
    const mission = missions[currentMission];
    const foundCorrectClues = mission.correctClues.filter(clue => discoveredClues.includes(clue));
    
    if (foundCorrectClues.length >= 2) {
      if (currentMission + 1 >= missions.length) {
        setInvestigationComplete(true);
        onComplete(score * 10);
      } else {
        setCurrentMission(currentMission + 1);
        setDiscoveredClues([]);
        setCurrentClue('');
      }
    }
  };

  const currentMissionData = missions[currentMission];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-6xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🔍 OSINT Investigation Bureau
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Mission Briefing */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Mission {currentMission + 1}: {currentMissionData.title}
          </h4>
          <p className="text-white/90 mb-4">{currentMissionData.scenario}</p>
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <p className="text-white text-sm"><strong>Target:</strong> {currentMissionData.target}</p>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
            <p className="text-yellow-200 text-sm">
              💡 <strong>OSINT Tip:</strong> Open Source Intelligence uses publicly available information. Look for patterns and inconsistencies!
            </p>
          </div>
        </div>
        
        {/* Investigation Tools */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Available Evidence</h4>
          <div className="space-y-2">
            {currentMissionData.clues.map((clue, index) => (
              <button
                key={index}
                onClick={() => investigateClue(clue)}
                className={`w-full p-2 rounded-lg text-left text-sm transition-all ${
                  discoveredClues.includes(clue)
                    ? currentMissionData.correctClues.includes(clue)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                {discoveredClues.includes(clue) ? clue : `Investigate clue ${index + 1}`}
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h5 className="text-white font-bold text-sm mb-2">Investigation Progress</h5>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Clues Found:</span>
              <span>{discoveredClues.length}/{currentMissionData.clues.length}</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Valid Evidence:</span>
              <span>{discoveredClues.filter(clue => currentMissionData.correctClues.includes(clue)).length}/{currentMissionData.correctClues.length}</span>
            </div>
          </div>
          
          {discoveredClues.filter(clue => currentMissionData.correctClues.includes(clue)).length >= 2 && (
            <button
              onClick={completeMission}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
            >
              Complete Investigation
            </button>
          )}
        </div>
        
        {/* Evidence Analysis */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Evidence Analysis</h4>
          
          {currentClue && (
            <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3 mb-4">
              <h5 className="text-blue-200 font-bold text-sm mb-2">Latest Finding:</h5>
              <p className="text-blue-100 text-sm">{currentClue}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm">OSINT Tools & Techniques:</h5>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-purple-500/20 rounded p-2">
                <div className="text-purple-300 font-bold">Social Media Analysis</div>
                <div className="text-purple-200">Check posts, locations, connections</div>
              </div>
              <div className="bg-red-500/20 rounded p-2">
                <div className="text-red-300 font-bold">Domain Investigation</div>
                <div className="text-red-200">WHOIS, registration dates, SSL certs</div>
              </div>
              <div className="bg-green-500/20 rounded p-2">
                <div className="text-green-300 font-bold">Digital Footprints</div>
                <div className="text-green-200">Cross-platform username searches</div>
              </div>
              <div className="bg-yellow-500/20 rounded p-2">
                <div className="text-yellow-300 font-bold">Pattern Analysis</div>
                <div className="text-yellow-200">Behavioral patterns and timing</div>
              </div>
            </div>
          </div>
          
          {discoveredClues.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <h5 className="text-white font-bold text-sm mb-2">Discovered Evidence:</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {discoveredClues.map((clue, index) => (
                  <div key={index} className={`text-xs p-1 rounded ${
                    currentMissionData.correctClues.includes(clue) 
                      ? 'text-green-300 bg-green-500/10' 
                      : 'text-gray-300 bg-gray-500/10'
                  }`}>
                    • {clue}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Bureau
        </button>
      </div>
    </motion.div>
  );
};

// Red vs Blue Team Tutorial
export const RedBlueTeamTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [gamePhase, setGamePhase] = useState<'setup' | 'red' | 'blue' | 'results'>('setup');
  const [playerTeam, setPlayerTeam] = useState<'red' | 'blue' | null>(null);
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const totalRounds = 3;

  const redTeamActions = [
    {
      name: 'Port Scanning',
      description: 'Scan for open ports on target systems',
      difficulty: 'Easy',
      points: 10,
      success: 'Found several open ports including SSH (22) and HTTP (80)',
      counter: 'Port scanning detected and blocked by IDS'
    },
    {
      name: 'Social Engineering',
      description: 'Attempt to trick users into revealing credentials',
      difficulty: 'Medium',
      points: 20,
      success: 'Successfully obtained credentials from 3 employees',
      counter: 'Security awareness training prevented credential disclosure'
    },
    {
      name: 'SQL Injection',
      description: 'Try to exploit database vulnerabilities',
      difficulty: 'Hard',
      points: 30,
      success: 'Extracted sensitive user data from database',
      counter: 'Input validation and WAF blocked injection attempts'
    }
  ];

  const blueTeamActions = [
    {
      name: 'Intrusion Detection',
      description: 'Monitor network traffic for suspicious activity',
      difficulty: 'Easy',
      points: 10,
      success: 'Detected and logged suspicious network scanning',
      counter: 'Failed to detect stealthy reconnaissance'
    },
    {
      name: 'Patch Management',
      description: 'Update systems with security patches',
      difficulty: 'Medium',
      points: 20,
      success: 'Closed critical vulnerabilities before exploitation',
      counter: 'Patches applied too late, systems already compromised'
    },
    {
      name: 'Incident Response',
      description: 'Respond to and contain security incidents',
      difficulty: 'Hard',
      points: 30,
      success: 'Quickly contained breach and preserved evidence',
      counter: 'Slow response allowed attackers to achieve objectives'
    }
  ];

  const executeAction = (action: any) => {
    setSelectedAction(action.name);
    
    // Simulate success/failure based on difficulty
    const successRate = action.difficulty === 'Easy' ? 0.8 : action.difficulty === 'Medium' ? 0.6 : 0.4;
    const isSuccess = Math.random() < successRate;
    
    if (isSuccess) {
      if (playerTeam === 'red') {
        setRedScore(redScore + action.points);
      } else {
        setBlueScore(blueScore + action.points);
      }
    }
    
    setTimeout(() => {
      if (currentRound >= totalRounds) {
        setGamePhase('results');
      } else {
        setCurrentRound(currentRound + 1);
        setSelectedAction(null);
      }
    }, 3000);
  };

  const getResults = () => {
    const totalScore = redScore + blueScore;
    let message = '';
    
    if (redScore > blueScore) {
      message = 'Red Team Wins! Attackers successfully penetrated defenses.';
    } else if (blueScore > redScore) {
      message = 'Blue Team Wins! Defenders successfully protected the network.';
    } else {
      message = 'Tie Game! Both teams showed strong cybersecurity skills.';
    }
    
    return { message, totalScore };
  };

  if (gamePhase === 'setup') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          ⚔️ Red vs Blue Team Arena
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-2">🔴 Red Team (Attackers)</h4>
            <p className="text-white/90 mb-4">
              Your goal is to find and exploit vulnerabilities in the target systems. Use various attack techniques to gain unauthorized access.
            </p>
            <ul className="text-white/80 text-sm space-y-1 mb-4">
              <li>• Reconnaissance and scanning</li>
              <li>• Social engineering attacks</li>
              <li>• Exploit known vulnerabilities</li>
              <li>• Gain system access</li>
            </ul>
            <button
              onClick={() => {
                setPlayerTeam('red');
                setGamePhase('red');
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold"
            >
              Join Red Team
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-2">🔵 Blue Team (Defenders)</h4>
            <p className="text-white/90 mb-4">
              Your goal is to protect the network and systems from attacks. Monitor, detect, and respond to security threats.
            </p>
            <ul className="text-white/80 text-sm space-y-1 mb-4">
              <li>• Monitor network traffic</li>
              <li>• Patch system vulnerabilities</li>
              <li>• Implement security controls</li>
              <li>• Respond to incidents</li>
            </ul>
            <button
              onClick={() => {
                setPlayerTeam('blue');
                setGamePhase('blue');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold"
            >
              Join Blue Team
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-bold mb-2">Game Rules</h4>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• 3 rounds of action selection</li>
            <li>• Each action has different difficulty and point values</li>
            <li>• Success depends on skill and some luck</li>
            <li>• Team with the most points wins</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  if (gamePhase === 'results') {
    const results = getResults();
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          🏆 Battle Results
        </h3>
        
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {redScore > blueScore ? '🔴' : blueScore > redScore ? '🔵' : '⚖️'}
          </div>
          <h4 className="text-xl font-bold text-white mb-2">{results.message}</h4>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4">
            <h5 className="text-red-300 font-bold mb-2">🔴 Red Team Score</h5>
            <div className="text-3xl font-bold text-red-200">{redScore}</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
            <h5 className="text-blue-300 font-bold mb-2">🔵 Blue Team Score</h5>
            <div className="text-3xl font-bold text-blue-200">{blueScore}</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 mb-4">
          <p className="text-white font-bold text-center">🎮 You've unlocked Team Battlemon!</p>
          <p className="text-white/90 text-sm text-center">
            Experience Points: {results.totalScore} - Great teamwork and strategy!
          </p>
        </div>
        
        <button
          onClick={() => onComplete(results.totalScore)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
        >
          Complete Battle
        </button>
      </motion.div>
    );
  }

  const actions = playerTeam === 'red' ? redTeamActions : blueTeamActions;
  const teamColor = playerTeam === 'red' ? 'red' : 'blue';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        {playerTeam === 'red' ? '🔴' : '🔵'} {playerTeam === 'red' ? 'Red' : 'Blue'} Team Operations
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Actions */}
        <div className={`bg-gradient-to-br from-${teamColor}-500 to-${teamColor}-700 rounded-lg p-6`}>
          <h4 className="text-lg font-bold text-white mb-4">
            Round {currentRound} of {totalRounds} - Choose Your Action
          </h4>
          
          <div className="space-y-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => executeAction(action)}
                disabled={!!selectedAction}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedAction === action.name
                    ? 'bg-white/30 scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                } disabled:opacity-50`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="text-white font-bold">{action.name}</h5>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      action.difficulty === 'Easy' ? 'bg-green-500' :
                      action.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {action.difficulty}
                    </span>
                    <span className="text-white text-sm font-bold">{action.points}pts</span>
                  </div>
                </div>
                <p className="text-white/90 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
          
          {selectedAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/20 rounded-lg p-3"
            >
              <p className="text-white font-bold text-sm">Executing: {selectedAction}</p>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Status and Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Battle Status</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="text-red-300 font-bold text-sm">Red Team</div>
                <div className="text-red-200 text-xl font-bold">{redScore}</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <div className="text-blue-300 font-bold text-sm">Blue Team</div>
                <div className="text-blue-200 text-xl font-bold">{blueScore}</div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3">
              <h5 className="text-white font-bold text-sm mb-2">
                {playerTeam === 'red' ? 'Attack' : 'Defense'} Strategy Tips:
              </h5>
              <ul className="text-white/80 text-xs space-y-1">
                {playerTeam === 'red' ? (
                  <>
                    <li>• Start with reconnaissance (easier actions)</li>
                    <li>• Build on discovered information</li>
                    <li>• Higher risk actions give more points</li>
                    <li>• Think like a real attacker</li>
                  </>
                ) : (
                  <>
                    <li>• Monitor constantly for threats</li>
                    <li>• Patch vulnerabilities quickly</li>
                    <li>• Prepare incident response plans</li>
                    <li>• Defense in depth strategy</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="bg-purple-500/20 rounded-lg p-3">
              <h5 className="text-purple-300 font-bold text-sm mb-2">Learning Objective:</h5>
              <p className="text-purple-200 text-xs">
                Understand both offensive and defensive cybersecurity perspectives. 
                Real security requires thinking like both an attacker and defender.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Arena
        </button>
      </div>
    </motion.div>
  );
};
