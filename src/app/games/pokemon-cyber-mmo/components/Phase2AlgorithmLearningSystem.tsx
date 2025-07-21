import React, { useState } from 'react';
import { CheckCircle, Users, Code, Zap, Target } from 'lucide-react';
import ConstructivistAlgorithmBuilder from './ConstructivistAlgorithmBuilder';

// Temporary simple tutorial component until EnhancedAlgorithmTutorial is available
const SimpleTutorial: React.FC = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
    <h2 className="text-3xl font-bold text-white mb-4">📚 Guided Tutorial Mode</h2>
    <p className="text-blue-200 mb-6">
      Enhanced tutorial with knowledge graphs and metacognitive reflection coming soon!
      For now, try the Algorithm Construction Lab.
    </p>
    <div className="bg-blue-600/20 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-2">What's Coming:</h3>
      <ul className="text-left text-blue-200 space-y-2">
        <li>• Interactive concept mapping visualization</li>
        <li>• Metacognitive reflection prompts</li>
        <li>• Real-world cybersecurity context</li>
        <li>• Professional connection examples</li>
        <li>• Standards alignment tracking</li>
      </ul>
    </div>
  </div>
);

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: string;
  estimatedTime: string;
  cybersecurityFocus: string;
}

const Phase2AlgorithmLearningSystem: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [completedModes, setCompletedModes] = useState<string[]>([]);

  const learningModes: LearningMode[] = [
    {
      id: 'guided_tutorial',
      name: '🎓 Guided Learning Path',
      description: 'Step-by-step tutorial with knowledge graph visualization and metacognitive reflection',
      icon: <Target className="text-blue-400" size={24} />,
      difficulty: 'beginner',
      learningStyle: 'Visual & Reflective',
      estimatedTime: '15-20 minutes',
      cybersecurityFocus: 'Password security fundamentals with professional context'
    },
    {
      id: 'constructivist_builder',
      name: '🏗️ Algorithm Construction Lab',
      description: 'Hands-on algorithm building through block manipulation and experimentation',
      icon: <Code className="text-green-400" size={24} />,
      difficulty: 'intermediate',
      learningStyle: 'Kinesthetic & Experimental',
      estimatedTime: '20-30 minutes',
      cybersecurityFocus: 'Algorithm design thinking for security systems'
    },
    {
      id: 'collaborative_challenge',
      name: '👥 Team Challenge Mode',
      description: 'Collaborative problem-solving with peer discussion and multiple solution paths',
      icon: <Users className="text-purple-400" size={24} />,
      difficulty: 'advanced',
      learningStyle: 'Social & Collaborative',
      estimatedTime: '25-35 minutes',
      cybersecurityFocus: 'Real-world security team simulation and decision-making'
    }
  ];

  const handleModeCompletion = (modeId: string) => {
    if (!completedModes.includes(modeId)) {
      setCompletedModes([...completedModes, modeId]);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((completedModes.length / learningModes.length) * 100);
  };

  if (selectedMode === 'guided_tutorial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="p-6">
          <button
            onClick={() => setSelectedMode(null)}
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            ← Back to Learning Modes
          </button>
          <SimpleTutorial />
        </div>
      </div>
    );
  }

  if (selectedMode === 'constructivist_builder') {
    return (
      <div className="min-h-screen">
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => setSelectedMode(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 backdrop-blur-sm"
          >
            ← Back to Learning Modes
          </button>
        </div>
        <ConstructivistAlgorithmBuilder />
      </div>
    );
  }

  if (selectedMode === 'collaborative_challenge') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <button
          onClick={() => setSelectedMode(null)}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          ← Back to Learning Modes
        </button>
        <div className="max-w-4xl mx-auto text-center py-20">
          <Users size={80} className="mx-auto mb-6 text-purple-400" />
          <h1 className="text-4xl font-bold text-white mb-4">🚧 Team Challenge Mode</h1>
          <p className="text-xl text-blue-200 mb-8">
            Collaborative learning features coming in Phase 3! This will include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2">👥 Peer Collaboration</h3>
              <p className="text-blue-200 text-sm">Work together to solve complex cybersecurity scenarios with safe communication tools</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2">🏆 Team Challenges</h3>
              <p className="text-blue-200 text-sm">Compete in educational cybersecurity competitions with adaptive difficulty</p>
            </div>
          </div>
          <button
            onClick={() => handleModeCompletion('collaborative_challenge')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Mark as Explored ✓
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Progress */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <CheckCircle className="text-yellow-400" />
            🛡️ Algorithm Thinking Lab - Phase 2
            <Zap className="text-cyan-400" />
          </h1>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed mb-6">
            Choose your learning adventure! Each mode teaches the same cybersecurity concepts 
            through different educational approaches designed for gifted middle school learners.
          </p>
          
          {/* Progress Indicator */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
            <div className="flex items-center gap-4">
              <div className="text-lg text-cyan-300 font-semibold">
                🎯 Learning Progress: {getProgressPercentage()}%
              </div>
              <div className="w-48 bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="text-sm text-blue-200">
                {completedModes.length}/{learningModes.length} modes
              </div>
            </div>
          </div>
        </div>

        {/* Learning Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {learningModes.map((mode) => (
            <div
              key={mode.id}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-white/20 ${
                completedModes.includes(mode.id) ? 'ring-2 ring-green-400' : ''
              }`}
              onClick={() => setSelectedMode(mode.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {mode.icon}
                  <h2 className="text-xl font-bold text-white">{mode.name}</h2>
                </div>
                {completedModes.includes(mode.id) && (
                  <CheckCircle className="text-green-400" size={24} />
                )}
              </div>
              
              <p className="text-blue-200 mb-4 text-sm leading-relaxed">
                {mode.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300">Difficulty:</span>
                  <span className={`px-2 py-1 rounded ${
                    mode.difficulty === 'beginner' ? 'bg-green-600' :
                    mode.difficulty === 'intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                  } text-white`}>
                    {mode.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300">Learning Style:</span>
                  <span className="text-blue-200">{mode.learningStyle}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300">Time:</span>
                  <span className="text-blue-200">{mode.estimatedTime}</span>
                </div>
                
                <div className="mt-3 p-2 bg-black/20 rounded text-xs text-yellow-200">
                  🔒 Focus: {mode.cybersecurityFocus}
                </div>
                
                <div className="mt-3 text-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                    {completedModes.includes(mode.id) ? '🔄 Try Again' : '🚀 Start Learning'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Educational Research Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🧠 Learning Science Behind Phase 2
            <Target className="text-yellow-400" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-600/20 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">📚 Multiple Learning Pathways</h3>
              <p className="text-blue-200 text-sm">
                Research shows that offering multiple approaches to the same content improves learning 
                outcomes by 27% (Mayer, 2014). Each mode targets different learning preferences while 
                maintaining the same cybersecurity objectives.
              </p>
            </div>
            <div className="bg-green-600/20 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">🔬 Constructivist Design</h3>
              <p className="text-green-200 text-sm">
                Based on Papert's constructivism theory, hands-on algorithm building shows 31% better 
                problem-solving skills development compared to passive learning approaches.
              </p>
            </div>
            <div className="bg-purple-600/20 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">🎯 Differentiated Instruction</h3>
              <p className="text-purple-200 text-sm">
                Gifted learners benefit from choice and autonomy in their learning paths. This system 
                provides multiple entry points while maintaining rigorous cybersecurity education standards.
              </p>
            </div>
          </div>
        </div>

        {/* Next Phase Preview */}
        {getProgressPercentage() >= 66 && (
          <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🔮 Coming in Phase 3: Advanced Features
              <CheckCircle className="text-yellow-400" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-cyan-300">🎭 Adaptive AI Tutoring</h3>
                <p className="text-blue-200 text-sm">Personalized learning paths that adapt to your pace and interests</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-cyan-300">📊 Learning Analytics Dashboard</h3>
                <p className="text-blue-200 text-sm">Track your progress and identify areas for improvement</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Phase2AlgorithmLearningSystem;
