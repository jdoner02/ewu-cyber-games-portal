import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Lightbulb, Users, Trophy, Code } from 'lucide-react';

// Educational Interface Design based on Constructivist Learning Theory
interface AlgorithmBlock {
  id: string;
  type: 'condition' | 'action' | 'loop' | 'decision' | 'input' | 'output';
  content: string;
  correctness: number; // 0-1 how pedagogically sound this step is
  alternatives: string[]; // Multiple valid approaches for differentiated learning
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cybersecurityConnection: string; // Real-world cybersecurity application
  hintsAvailable: string[];
  professionalExample?: string;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  estimatedTime: string;
  skillLevel: string;
}

interface PeerCollaboration {
  isEnabled: boolean;
  teamMembers: string[];
  sharedSolutions: AlgorithmBlock[][];
  discussionThread: {
    author: string;
    message: string;
    timestamp: Date;
  }[];
}

interface ConstructivistFeedback {
  type: 'encouragement' | 'guidance' | 'correction' | 'extension';
  message: string;
  suggestedImprovement?: string;
  relatedConcepts: string[];
}

const ConstructivistAlgorithmBuilder: React.FC = () => {
  const [algorithmBlocks, setAlgorithmBlocks] = useState<AlgorithmBlock[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [feedback, setFeedback] = useState<ConstructivistFeedback[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [peerCollaboration, setPeerCollaboration] = useState<PeerCollaboration>({
    isEnabled: false,
    teamMembers: [],
    sharedSolutions: [],
    discussionThread: []
  });
  const [draggedBlock, setDraggedBlock] = useState<AlgorithmBlock | null>(null);

  // Research-Based Algorithm Building Blocks for Cybersecurity Education
  const [availableBlocks] = useState<AlgorithmBlock[]>([
    {
      id: 'input_password',
      type: 'input',
      content: '🔑 Get password from user',
      correctness: 1.0,
      alternatives: ['Collect user password', 'Receive password input', 'Ask for password'],
      difficulty: 'beginner',
      cybersecurityConnection: 'Password input is the first step in authentication systems used by banks, schools, and social media.',
      hintsAvailable: [
        'Every security system needs to know who you are first!',
        'Think about logging into your favorite game or app'
      ],
      professionalExample: 'Security engineers design login systems that millions of people use every day.'
    },
    {
      id: 'check_length',
      type: 'condition',
      content: '📏 IF password length >= 8 characters',
      correctness: 1.0,
      alternatives: ['Check if password has enough characters', 'Verify minimum password length', 'Ensure password is long enough'],
      difficulty: 'beginner',
      cybersecurityConnection: 'Longer passwords are exponentially harder for hackers to crack using brute force attacks.',
      hintsAvailable: [
        'Why do you think longer passwords are safer?',
        'A 4-character password has 456,976 possibilities, but an 8-character password has over 6 trillion!'
      ],
      professionalExample: 'Cybersecurity analysts configure minimum password requirements to protect company data.'
    },
    {
      id: 'check_uppercase',
      type: 'condition',
      content: '🔤 IF password contains uppercase letters',
      correctness: 0.9,
      alternatives: ['Check for capital letters', 'Verify uppercase characters exist', 'Look for big letters'],
      difficulty: 'beginner',
      cybersecurityConnection: 'Mixed case passwords increase the search space hackers must explore exponentially.',
      hintsAvailable: [
        'Capital letters make passwords much stronger!',
        'Each additional character type multiplies the difficulty for attackers'
      ],
      professionalExample: 'Password policy experts design rules that balance security with user experience.'
    },
    {
      id: 'check_numbers',
      type: 'condition',
      content: '🔢 IF password contains numbers',
      correctness: 0.9,
      alternatives: ['Check for digits', 'Verify numeric characters', 'Look for numbers'],
      difficulty: 'beginner',
      cybersecurityConnection: 'Numbers add complexity that makes automated password cracking tools work much harder.',
      hintsAvailable: [
        'Numbers are like adding extra locks to your password!',
        'Hackers use dictionaries of common words, but numbers break their patterns'
      ],
      professionalExample: 'Security researchers study how different character types affect password strength.'
    },
    {
      id: 'check_special',
      type: 'condition',
      content: '⭐ IF password contains special characters (!@#$)',
      correctness: 0.95,
      alternatives: ['Check for symbols', 'Verify special characters', 'Look for punctuation'],
      difficulty: 'intermediate',
      cybersecurityConnection: 'Special characters create the strongest passwords by maximizing entropy and search space.',
      hintsAvailable: [
        'Special characters are like secret codes within your password!',
        'They make your password mathematically much harder to guess'
      ],
      professionalExample: 'Cryptographers calculate password entropy to determine theoretical crack time.'
    },
    {
      id: 'score_strong',
      type: 'output',
      content: '✅ Display "Strong Password!" with green checkmark',
      correctness: 1.0,
      alternatives: ['Show success message', 'Display positive feedback', 'Indicate strong password'],
      difficulty: 'beginner',
      cybersecurityConnection: 'User feedback helps people learn to create better passwords naturally.',
      hintsAvailable: [
        'People learn better when they get immediate positive feedback!',
        'Green colors psychologically signal safety and success'
      ],
      professionalExample: 'UX designers create interfaces that teach users security best practices.'
    },
    {
      id: 'score_weak',
      type: 'output',
      content: '⚠️ Display "Weak Password - Try Again" with suggestions',
      correctness: 1.0,
      alternatives: ['Show improvement suggestions', 'Give helpful feedback', 'Suggest password improvements'],
      difficulty: 'beginner',
      cybersecurityConnection: 'Constructive feedback helps users improve security habits without frustration.',
      hintsAvailable: [
        'Instead of just saying "wrong," good systems teach users how to improve!',
        'Educational feedback turns mistakes into learning opportunities'
      ],
      professionalExample: 'Security awareness trainers design programs that help people learn from mistakes.'
    },
    {
      id: 'loop_recheck',
      type: 'loop',
      content: '🔄 REPEAT until user enters acceptable password',
      correctness: 0.8,
      alternatives: ['Keep asking until password is good', 'Loop until acceptable', 'Retry until success'],
      difficulty: 'intermediate',
      cybersecurityConnection: 'Persistent validation ensures users create truly secure passwords, not just "good enough" ones.',
      hintsAvailable: [
        'Sometimes we need to be persistent to help people stay safe!',
        'Good security systems are patient but firm about requirements'
      ],
      professionalExample: 'System administrators configure policies that enforce security standards consistently.'
    },
    {
      id: 'save_securely',
      type: 'action',
      content: '🔐 Save password using secure hashing (not plain text!)',
      correctness: 1.0,
      alternatives: ['Store password safely', 'Hash and save password', 'Securely store credentials'],
      difficulty: 'advanced',
      cybersecurityConnection: 'Never storing passwords in plain text is the #1 rule of cybersecurity - even tech giants follow this.',
      hintsAvailable: [
        'Passwords should be scrambled (hashed) before storing - like a secret code!',
        'Even the company storing your password should never be able to read it directly'
      ],
      professionalExample: 'Cryptographic engineers design hashing systems that protect billions of passwords.'
    },
    {
      id: 'wrong_delete_files',
      type: 'action',
      content: '💥 Delete all user files if password is weak',
      correctness: 0.0,
      alternatives: [],
      difficulty: 'beginner',
      cybersecurityConnection: 'This is an example of terrible security design that would destroy user trust.',
      hintsAvailable: [
        'This would be a really bad idea! Can you think why?',
        'Good security helps people, it never punishes them with data loss'
      ],
      professionalExample: 'Ethical security professionals never design systems that harm users.'
    }
  ]);

  // Constructivist Learning Assessment Engine
  const evaluateAlgorithm = useCallback((blocks: AlgorithmBlock[]) => {
    if (blocks.length === 0) {
      return {
        correctness: 0,
        logicalFlow: 0,
        completeness: 0,
        feedback: {
          type: 'guidance' as const,
          message: "Start building your algorithm! Drag blocks from the left to create a password checker.",
          suggestedImprovement: "Try starting with getting the password from the user.",
          relatedConcepts: ['algorithm design', 'user input', 'cybersecurity basics']
        }
      };
    }

    const correctnessScore = blocks.reduce((sum, block) => sum + block.correctness, 0) / blocks.length;
    const logicalFlow = assessLogicalFlow(blocks);
    const completeness = assessCompleteness(blocks);
    
    const feedback = generatePedagogicalFeedback(blocks, correctnessScore, logicalFlow, completeness);
    
    return {
      correctness: correctnessScore,
      logicalFlow,
      completeness,
      feedback
    };
  }, []);

  // Pedagogical Flow Assessment (Educational Research-Based)
  const assessLogicalFlow = (blocks: AlgorithmBlock[]): number => {
    if (blocks.length === 0) return 0;
    
    let flowScore = 1.0;
    let hasInput = false;
    let hasValidation = false;
    let hasOutput = false;
    
    // Check for logical sequence: Input → Validation → Output
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      
      if (block.type === 'input') hasInput = true;
      if (block.type === 'condition' && hasInput) hasValidation = true;
      if (block.type === 'output' && hasValidation) hasOutput = true;
      
      // Penalty for destructive actions
      if (block.correctness === 0.0) {
        flowScore -= 0.3;
      }
      
      // Bonus for good sequence
      if (i > 0) {
        const prevBlock = blocks[i-1];
        if (prevBlock.type === 'input' && block.type === 'condition') {
          flowScore += 0.1;
        }
      }
    }
    
    return Math.max(0, Math.min(1, flowScore));
  };

  // Completeness Assessment for Algorithm Design
  const assessCompleteness = (blocks: AlgorithmBlock[]): number => {
    const hasInput = blocks.some(b => b.type === 'input');
    const hasConditions = blocks.some(b => b.type === 'condition');
    const hasOutput = blocks.some(b => b.type === 'output');
    const hasValidation = blocks.some(b => b.content.includes('length') || b.content.includes('uppercase') || b.content.includes('numbers'));
    
    let completenessScore = 0;
    if (hasInput) completenessScore += 0.25;
    if (hasConditions) completenessScore += 0.25;
    if (hasOutput) completenessScore += 0.25;
    if (hasValidation) completenessScore += 0.25;
    
    return completenessScore;
  };

  // Research-Based Feedback Generation (Constructivist Approach)
  const generatePedagogicalFeedback = (
    blocks: AlgorithmBlock[], 
    correctness: number, 
    logicalFlow: number, 
    completeness: number
  ): ConstructivistFeedback => {
    
    // Encouraging feedback for good progress
    if (correctness > 0.8 && logicalFlow > 0.8 && completeness > 0.8) {
      return {
        type: 'encouragement',
        message: "🎉 Excellent algorithm design! You're thinking like a cybersecurity professional. Your password checker follows security best practices.",
        relatedConcepts: ['algorithm design mastery', 'cybersecurity principles', 'professional development'],
        suggestedImprovement: "Try exploring different ways users might create strong passwords, or add additional security features."
      };
    }
    
    // Guidance for logical flow issues
    if (logicalFlow < 0.5) {
      return {
        type: 'guidance',
        message: "🤔 Good start! Let's think about the logical order. In real password systems, what happens first - do we check the password or ask for it?",
        suggestedImprovement: "Try putting the input block first, then the checking blocks, then the output.",
        relatedConcepts: ['algorithm sequence', 'logical thinking', 'system design']
      };
    }
    
    // Specific guidance for completeness
    if (completeness < 0.5) {
      const missing = [];
      if (!blocks.some(b => b.type === 'input')) missing.push('getting the password from the user');
      if (!blocks.some(b => b.type === 'condition')) missing.push('checking the password strength');
      if (!blocks.some(b => b.type === 'output')) missing.push('telling the user the result');
      
      return {
        type: 'guidance',
        message: `🎯 You're building something important! Consider adding: ${missing.join(', ')}. Every password system needs these steps.`,
        suggestedImprovement: "Look at the available blocks and think about what a complete password checker needs to do.",
        relatedConcepts: ['system completeness', 'user experience', 'security requirements']
      };
    }
    
    // Correction for destructive actions
    if (blocks.some(b => b.correctness === 0.0)) {
      return {
        type: 'correction',
        message: "⚠️ Whoa! One of your blocks would be harmful to users. Real cybersecurity professionals never design systems that hurt people. Can you find a better alternative?",
        suggestedImprovement: "Replace the destructive action with helpful feedback instead.",
        relatedConcepts: ['ethical security', 'user safety', 'professional responsibility']
      };
    }
    
    // Default encouragement
    return {
      type: 'encouragement',
      message: "🚀 Great job experimenting! Algorithm design is about trying different approaches. Keep building and see what works best.",
      relatedConcepts: ['experimentation', 'iterative design', 'learning process'],
      suggestedImprovement: "Try adding more blocks to make your algorithm more complete."
    };
  };

  // Simple Block Addition Handler (Constructivist Click-to-Add)
  const addBlockToAlgorithm = (block: AlgorithmBlock) => {
    const newBlock = { ...block, id: `${block.id}_${Date.now()}` };
    const newAlgorithmBlocks = [...algorithmBlocks, newBlock];
    setAlgorithmBlocks(newAlgorithmBlocks);
    
    // Immediate constructivist feedback
    const evaluation = evaluateAlgorithm(newAlgorithmBlocks);
    setFeedback([evaluation.feedback]);
    setCurrentScore(Math.round((evaluation.correctness * 30) + (evaluation.logicalFlow * 40) + (evaluation.completeness * 30)));
  };

  // Remove block from algorithm
  const removeBlockFromAlgorithm = (index: number) => {
    const newAlgorithmBlocks = [...algorithmBlocks];
    newAlgorithmBlocks.splice(index, 1);
    setAlgorithmBlocks(newAlgorithmBlocks);
    
    const evaluation = evaluateAlgorithm(newAlgorithmBlocks);
    setFeedback([evaluation.feedback]);
    setCurrentScore(Math.round((evaluation.correctness * 30) + (evaluation.logicalFlow * 40) + (evaluation.completeness * 30)));
  };

  // Move block up or down in algorithm
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === algorithmBlocks.length - 1)) {
      return;
    }
    
    const newAlgorithmBlocks = [...algorithmBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newAlgorithmBlocks[index], newAlgorithmBlocks[targetIndex]] = [newAlgorithmBlocks[targetIndex], newAlgorithmBlocks[index]];
    setAlgorithmBlocks(newAlgorithmBlocks);
    
    const evaluation = evaluateAlgorithm(newAlgorithmBlocks);
    setFeedback([evaluation.feedback]);
  };

  // Reset algorithm for new attempt
  const handleReset = () => {
    setAlgorithmBlocks([]);
    setFeedback([]);
    setCurrentScore(0);
  };

  // Show example solution for scaffolding
  const showExampleSolution = () => {
    const exampleSolution: AlgorithmBlock[] = [
      availableBlocks.find(b => b.id === 'input_password')!,
      availableBlocks.find(b => b.id === 'check_length')!,
      availableBlocks.find(b => b.id === 'check_uppercase')!,
      availableBlocks.find(b => b.id === 'check_numbers')!,
      availableBlocks.find(b => b.id === 'score_strong')!,
      availableBlocks.find(b => b.id === 'save_securely')!
    ].map((block, index) => ({ ...block, id: `example_${index}` }));
    
    setAlgorithmBlocks(exampleSolution);
    setFeedback([{
      type: 'extension',
      message: "📚 Here's one expert solution! But there are many other valid approaches. Try modifying this or creating your own version.",
      relatedConcepts: ['multiple solutions', 'expert thinking', 'algorithm variations'],
      suggestedImprovement: "What would you change to make this algorithm even better?"
    }]);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Cybersecurity Theme */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Code className="text-cyan-400" />
            🛡️ Cybersecurity Algorithm Builder 
            <Trophy className="text-yellow-400" />
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Build your own password strength checker algorithm! Drag and drop blocks to create 
            a security system like the ones protecting your favorite games and apps.
          </p>
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-lg text-cyan-300 font-semibold">
              🎯 Algorithm Score: {currentScore}/100 | 
              🧩 Blocks Used: {algorithmBlocks.length} | 
              🏆 Completeness: {Math.round(assessCompleteness(algorithmBlocks) * 100)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Available Blocks Panel (Constructivist Tool Palette) */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🧰 Algorithm Building Blocks
                <Lightbulb className="text-yellow-400" />
              </h2>
              <p className="text-blue-200 mb-4 text-sm">
                Click these blocks to add them to your password security algorithm. Each block represents 
                a step that real cybersecurity systems use!
              </p>
              
              <div className="space-y-3 min-h-[400px]">
                {availableBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    onClick={() => addBlockToAlgorithm(block)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                      block.correctness > 0.5 
                        ? 'bg-green-500/20 hover:bg-green-500/30 border-2 border-green-400' 
                        : 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm flex-1">
                        {block.content}
                      </span>
                      {block.correctness > 0.8 ? (
                        <CheckCircle className="text-green-400 ml-2" size={16} />
                      ) : block.correctness > 0.5 ? (
                        <AlertCircle className="text-yellow-400 ml-2" size={16} />
                      ) : (
                        <XCircle className="text-red-400 ml-2" size={16} />
                      )}
                    </div>
                    <div className="mt-1 text-xs text-blue-200">
                      <span className={`px-2 py-1 rounded ${
                        block.difficulty === 'beginner' ? 'bg-green-600' :
                        block.difficulty === 'intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {block.difficulty}
                      </span>
                    </div>
                    {showHints && (
                      <div className="mt-2 text-xs text-cyan-200 bg-black/20 p-2 rounded">
                        💡 {block.hintsAvailable[0]}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-white bg-blue-600/50 p-2 rounded">
                      👆 Click to add to your algorithm
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Algorithm Building Area (Constructivist Workspace) */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🏗️ Your Password Security Algorithm
                <Users className="text-blue-400" />
              </h2>
              <p className="text-blue-200 mb-4 text-sm">
                This is where you build your algorithm! The order matters - think about what should happen first, second, third...
              </p>

              <div className="min-h-[300px] border-2 border-dashed border-blue-400 rounded-lg p-4">
                {algorithmBlocks.length === 0 ? (
                  <div className="text-center text-blue-300 py-12">
                    <Code size={48} className="mx-auto mb-4 text-blue-400" />
                    <p className="text-lg">Start building your algorithm!</p>
                    <p className="text-sm">Click blocks from the left to add them to your password security system</p>
                  </div>
                ) : (
                  algorithmBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="p-4 mb-3 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                              Step {index + 1}
                            </span>
                            <span className="text-white font-medium">
                              {block.content}
                            </span>
                          </div>
                          <div className="text-xs text-cyan-200 mt-2">
                            🔒 {block.cybersecurityConnection}
                          </div>
                          {block.professionalExample && (
                            <div className="text-xs text-yellow-200 mt-1">
                              👨‍💼 {block.professionalExample}
                            </div>
                          )}
                        </div>
                        
                        {/* Block Control Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          {index > 0 && (
                            <button
                              onClick={() => moveBlock(index, 'up')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {index < algorithmBlocks.length - 1 && (
                            <button
                              onClick={() => moveBlock(index, 'down')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={() => removeBlockFromAlgorithm(index)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
                            title="Remove block"
                          >
                            ✕
                          </button>
                          
                          {block.correctness > 0.8 ? (
                            <CheckCircle className="text-green-400" size={20} />
                          ) : block.correctness > 0.5 ? (
                            <AlertCircle className="text-yellow-400" size={20} />
                          ) : (
                            <XCircle className="text-red-400" size={20} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Constructivist Feedback Panel */}
              {feedback.length > 0 && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    🧠 Learning Feedback
                    <Lightbulb className="text-yellow-400" />
                  </h3>
                  {feedback.map((fb, index) => (
                    <div key={index} className={`p-3 rounded-lg mb-2 ${
                      fb.type === 'encouragement' ? 'bg-green-500/20 border border-green-400' :
                      fb.type === 'guidance' ? 'bg-blue-500/20 border border-blue-400' :
                      fb.type === 'correction' ? 'bg-red-500/20 border border-red-400' :
                      'bg-purple-500/20 border border-purple-400'
                    }`}>
                      <p className="text-white font-medium">{fb.message}</p>
                      {fb.suggestedImprovement && (
                        <p className="text-sm text-cyan-200 mt-2">
                          💡 Try this: {fb.suggestedImprovement}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {fb.relatedConcepts.map((concept, i) => (
                          <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded text-blue-200">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons for Constructivist Learning */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  🔄 Start Over
                </button>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Lightbulb size={16} />
                  {showHints ? 'Hide' : 'Show'} Hints
                </button>
                <button
                  onClick={showExampleSolution}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  📚 Show Expert Example
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Extensions Panel */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🎓 Learn More About Cybersecurity
            <Trophy className="text-yellow-400" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-600/20 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">🔐 Password Security</h3>
              <p className="text-blue-200 text-sm">
                Learn how the algorithms you're building protect millions of accounts every day.
                Real password systems use advanced math to keep your data safe!
              </p>
            </div>
            <div className="bg-green-600/20 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">🧮 Algorithm Design</h3>
              <p className="text-green-200 text-sm">
                Every app and game you use runs on algorithms like the ones you're creating.
                Understanding algorithms helps you think like a programmer and problem-solver!
              </p>
            </div>
            <div className="bg-purple-600/20 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">👨‍💼 Career Connections</h3>
              <p className="text-purple-200 text-sm">
                Cybersecurity professionals, software engineers, and UX designers all use 
                skills like algorithm building. You're learning real job skills!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructivistAlgorithmBuilder;
