import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Monitor, Settings, Zap, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

interface CareerPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  dailyTasks: string[];
  skills: string[];
  pokemon: string;
}

// Day 1 Cyber Careers Tutorial
export const CyberCareersTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentCareer, setCurrentCareer] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const careerPaths: CareerPath[] = [
    {
      id: 'penetration-tester',
      name: 'Penetration Tester (Red Team)',
      description: 'Ethical hackers who test security by finding vulnerabilities before bad actors do.',
      icon: '🔍',
      dailyTasks: ['Security assessments', 'Vulnerability scanning', 'Writing reports', 'Client presentations'],
      skills: ['Network protocols', 'Scripting', 'Social engineering awareness', 'Risk assessment'],
      pokemon: 'RedTeammon'
    },
    {
      id: 'security-analyst',
      name: 'Security Analyst (Blue Team)',
      description: 'Defenders who monitor networks, respond to incidents, and protect organizations.',
      icon: '🛡️',
      dailyTasks: ['Monitor security alerts', 'Incident response', 'Forensic analysis', 'Security policies'],
      skills: ['Log analysis', 'Threat detection', 'Digital forensics', 'Communication'],
      pokemon: 'BlueTeammon'
    },
    {
      id: 'security-engineer',
      name: 'Security Engineer',
      description: 'Architects who design and build secure systems and infrastructure.',
      icon: '⚙️',
      dailyTasks: ['Design secure systems', 'Code reviews', 'Security architecture', 'Tool development'],
      skills: ['Secure coding', 'System design', 'Cryptography', 'Risk modeling'],
      pokemon: 'Enginemon'
    },
    {
      id: 'compliance-specialist',
      name: 'Compliance Specialist',
      description: 'Experts who ensure organizations meet regulatory and industry security standards.',
      icon: '📋',
      dailyTasks: ['Audit preparations', 'Policy writing', 'Training staff', 'Risk assessments'],
      skills: ['Regulatory knowledge', 'Documentation', 'Training', 'Risk management'],
      pokemon: 'Complimon'
    }
  ];

  const questions = [
    {
      id: 'preference',
      question: 'What type of cybersecurity work appeals to you most?',
      options: [
        { value: 'penetration-tester', text: 'Finding security weaknesses by thinking like a hacker' },
        { value: 'security-analyst', text: 'Protecting systems and responding to cyber attacks' },
        { value: 'security-engineer', text: 'Building secure software and systems from the ground up' },
        { value: 'compliance-specialist', text: 'Ensuring organizations follow security rules and standards' }
      ]
    },
    {
      id: 'skills',
      question: 'Which skill set interests you most?',
      options: [
        { value: 'penetration-tester', text: 'Advanced hacking techniques and vulnerability research' },
        { value: 'security-analyst', text: 'Incident response and digital forensics' },
        { value: 'security-engineer', text: 'Programming and system architecture' },
        { value: 'compliance-specialist', text: 'Policy writing and regulatory frameworks' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateResults = () => {
    const answers = Object.values(selectedAnswers);
    const careerCounts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCareer = Object.entries(careerCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'security-analyst';
    return careerPaths.find(career => career.id === topCareer) || careerPaths[1];
  };

  const handleComplete = () => {
    const score = Object.keys(selectedAnswers).length * 25; // 25 points per question
    onComplete(score);
  };

  if (showResults) {
    const recommendedCareer = calculateResults();
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          Your Cybersecurity Career Match!
        </h3>
        
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-6 mb-4">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{recommendedCareer.icon}</span>
            <div>
              <h4 className="text-xl font-bold text-white">{recommendedCareer.name}</h4>
              <p className="text-white/80">{recommendedCareer.description}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-bold text-yellow-300 mb-2">Daily Tasks:</h5>
              <ul className="text-white/90 text-sm space-y-1">
                {recommendedCareer.dailyTasks.map((task, index) => (
                  <li key={index}>• {task}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-yellow-300 mb-2">Key Skills:</h5>
              <ul className="text-white/90 text-sm space-y-1">
                {recommendedCareer.skills.map((skill, index) => (
                  <li key={index}>• {skill}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-white/90 text-sm">
              🎮 <strong>Pokemon Partner:</strong> You've unlocked {recommendedCareer.pokemon}! 
              This Pokemon will help you learn the skills needed for your cybersecurity career path.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowResults(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Try Again
          </button>
          <button
            onClick={handleComplete}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <CheckCircle size={16} className="inline mr-2" />
            Complete Tutorial
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        Discover Your Cybersecurity Career Path
      </h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-bold text-yellow-300 mb-4">
          Meet the Cybersecurity Professionals:
        </h4>
        <div className="grid gap-3">
          {careerPaths.map((career, index) => (
            <div key={career.id} className="bg-white/10 rounded-lg p-3 flex items-center">
              <span className="text-2xl mr-3">{career.icon}</span>
              <div>
                <h5 className="font-bold text-white">{career.name}</h5>
                <p className="text-white/80 text-sm">{career.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {questions.map((question, questionIndex) => (
          <div key={question.id} className="bg-white/10 rounded-lg p-4">
            <h4 className="text-lg font-bold text-white mb-3">
              Question {questionIndex + 1}: {question.question}
            </h4>
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(question.id, option.value)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedAnswers[question.id] === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
        <button
          onClick={() => setShowResults(true)}
          disabled={Object.keys(selectedAnswers).length < questions.length}
          className={`px-4 py-2 rounded-lg ${
            Object.keys(selectedAnswers).length < questions.length
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          Get My Results!
        </button>
      </div>
    </motion.div>
  );
};

// Hardware vs Software Mini-Game
export const HardwareSoftwareTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const items = [
    { name: 'CPU (Processor)', type: 'hardware', icon: '🔧', description: 'The brain of the computer that executes instructions' },
    { name: 'Microsoft Word', type: 'software', icon: '💾', description: 'A word processing application program' },
    { name: 'RAM (Memory)', type: 'hardware', icon: '🔧', description: 'Physical memory modules that store data temporarily' },
    { name: 'Google Chrome', type: 'software', icon: '💾', description: 'A web browser application' },
    { name: 'Hard Drive', type: 'hardware', icon: '🔧', description: 'Physical storage device for files and programs' },
    { name: 'Windows 11', type: 'software', icon: '💾', description: 'An operating system that manages the computer' },
    { name: 'Graphics Card', type: 'hardware', icon: '🔧', description: 'Physical component that processes visual data' },
    { name: 'Python', type: 'software', icon: '💾', description: 'A programming language and development environment' }
  ];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === items[currentItem].type) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentItem + 1 >= items.length) {
        setGameComplete(true);
      } else {
        setCurrentItem(currentItem + 1);
      }
    }, 2000);
  };

  if (gameComplete) {
    const percentage = Math.round((score / items.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Game Complete! 🎉</h3>
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥉' : '🎮'}
        </div>
        <p className="text-xl text-white mb-2">
          You scored {score} out of {items.length} ({percentage}%)
        </p>
        <p className="text-white/80 mb-6">
          {percentage >= 80 
            ? 'Excellent! You understand the difference between hardware and software!'
            : percentage >= 60
            ? 'Good job! Keep practicing to master this concept.'
            : 'Keep learning! Hardware is physical, software is digital programs.'}
        </p>
        <button
          onClick={() => onComplete(score * 12.5)} // 12.5 points per correct answer
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Complete Tutorial
        </button>
      </motion.div>
    );
  }

  const currentThing = items[currentItem];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Hardware vs Software</h3>
        <p className="text-white/80">Can you tell the difference?</p>
        <div className="text-sm text-white/60 mt-2">
          Question {currentItem + 1} of {items.length} | Score: {score}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 mb-6 text-center">
        <div className="text-6xl mb-4">{currentThing.icon}</div>
        <h4 className="text-xl font-bold text-white mb-2">{currentThing.name}</h4>
        <p className="text-white/90">{currentThing.description}</p>
      </div>

      {showFeedback ? (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-6"
        >
          <div className={`text-6xl mb-2 ${selectedAnswer === currentThing.type ? 'text-green-400' : 'text-red-400'}`}>
            {selectedAnswer === currentThing.type ? '✅' : '❌'}
          </div>
          <p className={`text-lg font-bold ${selectedAnswer === currentThing.type ? 'text-green-300' : 'text-red-300'}`}>
            {selectedAnswer === currentThing.type ? 'Correct!' : 'Incorrect!'}
          </p>
          <p className="text-white/80">
            {currentThing.name} is <strong>{currentThing.type}</strong>
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer('hardware')}
            className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-lg transition-all hover:scale-105"
          >
            <div className="text-2xl mb-2">🔧</div>
            <div className="font-bold">Hardware</div>
            <div className="text-sm opacity-80">Physical components</div>
          </button>
          <button
            onClick={() => handleAnswer('software')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg transition-all hover:scale-105"
          >
            <div className="text-2xl mb-2">💾</div>
            <div className="font-bold">Software</div>
            <div className="text-sm opacity-80">Programs & apps</div>
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Tutorial
        </button>
        <div className="text-white/60 text-sm flex items-center">
          Progress: {Math.round(((currentItem + 1) / items.length) * 100)}%
        </div>
      </div>
    </motion.div>
  );
};

// Ethics Quiz Tutorial
export const EthicsTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const questions = [
    {
      question: "You find a USB drive in the school parking lot. What should you do?",
      options: [
        "Plug it into a school computer to see what's on it",
        "Take it home and check it on your personal computer",
        "Turn it in to school security without plugging it in",
        "Keep it because someone lost it"
      ],
      correct: 2,
      explanation: "Never plug unknown USB drives into any computer! They could contain malware. Always report found devices to authorities."
    },
    {
      question: "A classmate shares their Netflix password with you. Is this okay?",
      options: [
        "Yes, friends share everything",
        "No, this violates Netflix's terms of service",
        "Yes, if they're paying for it",
        "Only if I don't share it with others"
      ],
      correct: 1,
      explanation: "Sharing streaming passwords violates terms of service and can be considered unauthorized access, even if your friend gave permission."
    },
    {
      question: "You discover a vulnerability in your school's website. What should you do?",
      options: [
        "Exploit it to change your grades",
        "Share it with friends to show off",
        "Report it responsibly to school IT staff",
        "Post about it on social media"
      ],
      correct: 2,
      explanation: "Responsible disclosure means reporting vulnerabilities to the appropriate authorities so they can be fixed, not exploited."
    },
    {
      question: "Someone asks you to help them hack their ex-friend's social media account. Should you help?",
      options: [
        "Yes, if they have a good reason",
        "No, this is unauthorized access and illegal",
        "Only if they promise not to post anything mean",
        "Yes, but only to read messages, not post"
      ],
      correct: 1,
      explanation: "Accessing someone else's accounts without permission is illegal, regardless of your relationship or intentions."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (currentQuestion + 1 >= questions.length) {
      setGameComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">Ethics Quiz Complete! ⚖️</h3>
        <div className="text-6xl mb-4">
          {percentage >= 75 ? '🏆' : percentage >= 50 ? '🎖️' : '📚'}
        </div>
        <p className="text-xl text-white mb-2">
          You scored {score} out of {questions.length} ({percentage}%)
        </p>
        <p className="text-white/80 mb-6">
          {percentage >= 75 
            ? 'Outstanding! You have strong ethical principles for cybersecurity!'
            : percentage >= 50
            ? 'Good foundation! Keep learning about cyber ethics.'
            : 'Keep studying! Ethical hacking means always following the law and helping others.'}
        </p>
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 mb-4">
          <p className="text-white font-bold">🎮 Achievement Unlocked: Ethimon Pokemon!</p>
          <p className="text-white/90 text-sm">This Pokemon represents your commitment to ethical cybersecurity practices.</p>
        </div>
        <button
          onClick={() => onComplete(score * 25)} // 25 points per correct answer
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Complete Tutorial
        </button>
      </motion.div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Cyber Ethics Challenge</h3>
        <p className="text-white/80">Test your ethical cybersecurity knowledge</p>
        <div className="text-sm text-white/60 mt-2">
          Question {currentQuestion + 1} of {questions.length} | Score: {score}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-bold text-white mb-4">{current.question}</h4>
        
        {!showExplanation ? (
          <div className="space-y-3">
            {current.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className={`text-4xl mb-3 ${selectedAnswer === current.correct ? 'text-green-400' : 'text-red-400'}`}>
              {selectedAnswer === current.correct ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-white/90">{current.explanation}</p>
            </div>
            <p className="text-green-300 font-bold">
              Correct Answer: {String.fromCharCode(65 + current.correct)}. {current.options[current.correct]}
            </p>
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
        {showExplanation && (
          <button
            onClick={nextQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {currentQuestion + 1 >= questions.length ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </motion.div>
  );
};
