import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Users, CheckCircle, Timer } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface CTFChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  description: string;
  solution: string;
  hints: string[];
  timeLimit: number; // in minutes
}

const CTFCompetitionTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to CTF Training! 🏆",
      description: "Learn about Capture The Flag competitions",
      content: "CTF competitions are cybersecurity puzzles where teams solve challenges to find hidden 'flags' and earn points!"
    },
    {
      title: "CTF Categories Explained",
      description: "Understanding different types of challenges",
      content: "CTFs have categories like Web Security, Cryptography, Reverse Engineering, Digital Forensics, and more!"
    },
    {
      title: "Your First CTF Challenge",
      description: "Start with a beginner-friendly puzzle",
      content: "Let's solve your first challenge! Remember: CTFs teach real cybersecurity skills through fun puzzles."
    }
  ];

  const challenges: CTFChallenge[] = [
    {
      id: 'crypto-caesar',
      title: 'Caesar\'s Secret Message',
      category: 'Cryptography',
      difficulty: 'beginner',
      points: 100,
      description: 'Decode this Caesar cipher: "FDHVDU FLSKHU LV IXQ!"',
      solution: 'CAESAR CIPHER IS FUN',
      hints: [
        'Caesar cipher shifts each letter by a fixed number',
        'Try shifting by 3 positions backwards',
        'A becomes X, B becomes Y, C becomes Z...'
      ],
      timeLimit: 10
    },
    {
      id: 'web-hidden',
      title: 'Hidden in Plain Sight',
      category: 'Web Security',
      difficulty: 'beginner',
      points: 150,
      description: 'Find the flag hidden in this HTML comment: <!-- flag{html_comments_are_visible} -->',
      solution: 'flag{html_comments_are_visible}',
      hints: [
        'Look for HTML comments in web pages',
        'Comments start with <!-- and end with -->',
        'Copy the entire flag including the curly braces'
      ],
      timeLimit: 5
    },
    {
      id: 'forensics-metadata',
      title: 'Picture Perfect Evidence',
      category: 'Digital Forensics',
      difficulty: 'intermediate',
      points: 200,
      description: 'A photo was taken at coordinates 40.7589, -73.9851. What famous landmark is this?',
      solution: 'TIMES SQUARE',
      hints: [
        'These are GPS coordinates (latitude, longitude)',
        'Use an online coordinate lookup tool',
        'This is a famous location in New York City'
      ],
      timeLimit: 8
    },
    {
      id: 'reverse-binary',
      title: 'Binary Detective',
      category: 'Reverse Engineering',
      difficulty: 'intermediate',
      points: 250,
      description: 'Convert this binary to ASCII: 01001000 01100101 01101100 01110000',
      solution: 'HELP',
      hints: [
        'Each group of 8 bits represents one ASCII character',
        'Use a binary to ASCII converter',
        'The message is a common 4-letter word'
      ],
      timeLimit: 12
    },
    {
      id: 'network-port',
      title: 'Port Scanner Puzzle',
      category: 'Network Security',
      difficulty: 'advanced',
      points: 300,
      description: 'What service commonly runs on port 22?',
      solution: 'SSH',
      hints: [
        'This port is used for secure remote access',
        'It stands for Secure Shell',
        'System administrators use this to manage remote servers'
      ],
      timeLimit: 15
    }
  ];

  const categories = [
    { name: 'Cryptography', icon: '🔐', color: 'purple' },
    { name: 'Web Security', icon: '🌐', color: 'blue' },
    { name: 'Digital Forensics', icon: '🔍', color: 'green' },
    { name: 'Reverse Engineering', icon: '⚙️', color: 'orange' },
    { name: 'Network Security', icon: '🌐', color: 'red' }
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const startChallenge = () => {
    setTimeRemaining(challenges[currentChallenge].timeLimit * 60);
    setIsActive(true);
    setUserAnswer('');
    setShowHints(false);
  };

  const submitAnswer = () => {
    const challenge = challenges[currentChallenge];
    const isCorrect = userAnswer.toUpperCase().trim() === challenge.solution.toUpperCase();
    
    if (isCorrect) {
      setCompletedChallenges([...completedChallenges, challenge.id]);
      setTotalScore(totalScore + challenge.points);
      setIsActive(false);
      
      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallenge(currentChallenge + 1);
        }, 2000);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const overallProgress = (completedChallenges.length / challenges.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🏆 CTF Competition Training</h1>
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
            <p className="text-cyan-200 text-sm">{steps[currentStep].content}</p>
            
            {currentStep === 1 && (
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className={`bg-${category.color}-500/20 rounded-lg p-4 border border-${category.color}-400/50`}>
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="text-white font-bold">{category.name}</h3>
                    <p className="text-white/80 text-sm">
                      {category.name === 'Cryptography' && 'Codes, ciphers, and encryption'}
                      {category.name === 'Web Security' && 'Website vulnerabilities and attacks'}
                      {category.name === 'Digital Forensics' && 'Finding evidence in digital files'}
                      {category.name === 'Reverse Engineering' && 'Understanding how programs work'}
                      {category.name === 'Network Security' && 'Network protocols and services'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-white/60">Step {currentStep + 1} of {steps.length}</div>
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
              >
                {currentStep === steps.length - 1 ? 'Start CTF!' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {currentStep >= 2 && (
          <>
            {/* Progress Dashboard */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{completedChallenges.length}</div>
                  <div className="text-white/60 text-sm">Challenges Solved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalScore}</div>
                  <div className="text-white/60 text-sm">Total Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{overallProgress.toFixed(0)}%</div>
                  <div className="text-white/60 text-sm">Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{formatTime(timeRemaining)}</div>
                  <div className="text-white/60 text-sm">Time Remaining</div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* Current Challenge */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{challenges[currentChallenge].title}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        challenges[currentChallenge].difficulty === 'beginner' ? 'bg-green-500/30 text-green-200' :
                        challenges[currentChallenge].difficulty === 'intermediate' ? 'bg-yellow-500/30 text-yellow-200' :
                        'bg-red-500/30 text-red-200'
                      }`}>
                        {challenges[currentChallenge].difficulty.toUpperCase()}
                      </span>
                      <span className="text-purple-300 text-sm">{challenges[currentChallenge].category}</span>
                      <span className="text-yellow-300 text-sm font-bold">{challenges[currentChallenge].points} pts</span>
                    </div>
                  </div>
                  
                  {isActive && timeRemaining > 0 && (
                    <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
                      <Timer className="w-6 h-6 inline mr-2" />
                      {formatTime(timeRemaining)}
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-bold mb-2">Challenge Description:</h3>
                  <p className="text-white/90">{challenges[currentChallenge].description}</p>
                </div>

                {!isActive ? (
                  <div className="text-center">
                    <button
                      onClick={startChallenge}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-bold"
                    >
                      <span className="text-lg mr-2">🏁</span>
                      Start Challenge
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Your Answer:</label>
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500"
                        placeholder="Enter your answer here..."
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={submitAnswer}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold"
                      >
                        Submit Answer
                      </button>
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
                      >
                        {showHints ? 'Hide' : 'Show'} Hints
                      </button>
                    </div>

                    {showHints && (
                      <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                        <h4 className="text-yellow-300 font-bold mb-2">💡 Hints:</h4>
                        {challenges[currentChallenge].hints.map((hint, index) => (
                          <div key={index} className="text-yellow-200 text-sm mb-1">
                            {index + 1}. {hint}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {completedChallenges.includes(challenges[currentChallenge].id) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 mt-4 text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-green-400 font-bold">Challenge Completed!</div>
                    <div className="text-white/80 text-sm">+{challenges[currentChallenge].points} points earned</div>
                  </motion.div>
                )}
              </div>

              {/* Challenge List */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">All Challenges</h3>
                
                <div className="space-y-3">
                  {challenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (!isActive) setCurrentChallenge(index);
                      }}
                      className={`bg-gray-800 rounded-lg p-3 cursor-pointer transition-all ${
                        index === currentChallenge ? 'ring-2 ring-purple-400' : 'hover:bg-gray-700'
                      } ${completedChallenges.includes(challenge.id) ? 'bg-green-500/20' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-bold text-sm">{challenge.title}</h4>
                          <p className="text-white/60 text-xs">{challenge.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-300 text-sm font-bold">{challenge.points}</div>
                          {completedChallenges.includes(challenge.id) && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
                  <h4 className="text-blue-300 font-bold text-sm mb-2">CTF Tips:</h4>
                  <ul className="text-blue-200 text-xs space-y-1">
                    <li>• Read challenges carefully</li>
                    <li>• Use hints when stuck</li>
                    <li>• Think like a hacker</li>
                    <li>• Practice makes perfect!</li>
                  </ul>
                </div>
              </div>
            </div>

            {overallProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  🎉 CTF Training Complete!
                </h2>
                <p className="text-white/90 mb-4">
                  Outstanding work! You've mastered the fundamentals of CTF competitions and are ready
                  to participate in real cybersecurity challenges!
                </p>
                <div className="text-3xl font-bold text-white mb-4">
                  Final Score: {totalScore} points
                </div>
                <div className="bg-white/20 rounded-lg p-4 inline-block">
                  <div className="text-white font-bold mb-2">🏆 Skills Mastered:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>🔐 Cryptography</div>
                    <div>🌐 Web Security</div>
                    <div>🔍 Digital Forensics</div>
                    <div>⚙️ Reverse Engineering</div>
                    <div>🌐 Network Security</div>
                    <div>🏆 CTF Techniques</div>
                  </div>
                </div>
                
                <div className="mt-4 text-white/80 text-sm">
                  Ready for real CTF competitions? Try PicoCTF, OverTheWire, or local university events!
                </div>
                
                <button
                  onClick={() => onComplete(Math.max(200, totalScore))}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-bold"
                >
                  Complete CTF Training
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CTFCompetitionTutorial;
