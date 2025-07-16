import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, CheckCircle, RotateCcw, Zap } from 'lucide-react';

interface TutorialProps {
  tutorialId: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

// Python Coding Tutorial
export const PythonCodingTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const challenges = [
    {
      title: 'Variables and Data Types',
      description: 'Create variables to store information about yourself',
      instruction: 'Create variables for your name (string), age (integer), and whether you like cybersecurity (boolean).',
      starterCode: '# Create your variables here\nname = \nage = \nlikes_cyber = ',
      solution: 'name = "Student"\nage = 13\nlikes_cyber = True',
      hint: 'Strings need quotes, numbers don\'t, and booleans are True or False',
      test: (code: string) => {
        return code.includes('name =') && code.includes('age =') && code.includes('likes_cyber =');
      }
    },
    {
      title: 'Print Statements',
      description: 'Display your information using print statements',
      instruction: 'Use print() to display your name, age, and cyber interest in a friendly message.',
      starterCode: '# Print your information\nprint("My name is", )\nprint("I am", , "years old")\nprint("I like cybersecurity:", )',
      solution: 'print("My name is", name)\nprint("I am", age, "years old")\nprint("I like cybersecurity:", likes_cyber)',
      hint: 'Put variable names inside the print() function without quotes',
      test: (code: string) => {
        return code.includes('print(') && code.split('print(').length >= 3;
      }
    },
    {
      title: 'Simple Loop',
      description: 'Use a for loop to count like a computer',
      instruction: 'Create a for loop that counts from 1 to 5 and prints each number.',
      starterCode: '# Create a counting loop\nfor i in range( , ):\n    print()',
      solution: 'for i in range(1, 6):\n    print(i)',
      hint: 'range(1, 6) gives you numbers 1, 2, 3, 4, 5. Don\'t forget indentation!',
      test: (code: string) => {
        return code.includes('for') && code.includes('range') && code.includes('print');
      }
    }
  ];

  const runCode = () => {
    const challenge = challenges[currentChallenge];
    if (challenge.test(userCode)) {
      setOutput('✅ Great work! Your code runs correctly!');
      setScore(score + 1);
      setTimeout(() => {
        if (currentChallenge + 1 >= challenges.length) {
          setGameComplete(true);
        } else {
          setCurrentChallenge(currentChallenge + 1);
          setUserCode(challenges[currentChallenge + 1].starterCode);
          setOutput('');
          setShowHint(false);
        }
      }, 2000);
    } else {
      setOutput('❌ Not quite right. Check your code and try again!');
    }
  };

  useEffect(() => {
    setUserCode(challenges[currentChallenge].starterCode);
  }, [currentChallenge]);

  if (gameComplete) {
    const percentage = Math.round((score / challenges.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          Python Coding Complete! 🐍
        </h3>
        <div className="text-6xl text-center mb-4">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥉' : '💻'}
        </div>
        <p className="text-xl text-white mb-2 text-center">
          You completed {score} out of {challenges.length} challenges ({percentage}%)
        </p>
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 mb-4">
          <p className="text-white font-bold text-center">🎮 Congratulations! You've unlocked Pythonmon!</p>
          <p className="text-white/90 text-sm text-center">
            {percentage >= 80 
              ? 'Outstanding! You have strong programming fundamentals!'
              : percentage >= 60
              ? 'Good work! Keep practicing your Python skills.'
              : 'Keep learning! Programming takes practice, but you\'re on the right track.'}
          </p>
        </div>
        <button
          onClick={() => onComplete(score * 33.33)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
        >
          Complete Tutorial
        </button>
      </motion.div>
    );
  }

  const currentChallengeData = challenges[currentChallenge];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🐍 Python Programming Lab
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Challenge Instructions */}
        <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Challenge {currentChallenge + 1}: {currentChallengeData.title}
          </h4>
          <p className="text-white/90 mb-4">{currentChallengeData.description}</p>
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <p className="text-white text-sm"><strong>Task:</strong> {currentChallengeData.instruction}</p>
          </div>
          
          {showHint && (
            <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 mb-4">
              <p className="text-yellow-200 text-sm">
                💡 <strong>Hint:</strong> {currentChallengeData.hint}
              </p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button
              onClick={() => setUserCode(currentChallengeData.solution)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
            >
              Show Solution
            </button>
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-bold">Code Editor</h4>
            <button
              onClick={runCode}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded flex items-center"
            >
              <Play size={16} className="mr-1" />
              Run Code
            </button>
          </div>
          
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-48 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded border border-gray-600 resize-none"
            placeholder="Write your Python code here..."
            spellCheck={false}
          />
          
          {/* Output */}
          <div className="mt-3">
            <h5 className="text-white font-bold text-sm mb-2">Output:</h5>
            <div className="bg-black rounded p-3 h-16 overflow-y-auto">
              <pre className="text-green-400 text-sm font-mono">{output || 'Run your code to see output...'}</pre>
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
          Progress: {currentChallenge + 1} of {challenges.length} | Score: {score}
        </div>
      </div>
    </motion.div>
  );
};

// Turtle Graphics Tutorial
export const TurtleGraphicsTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentProject, setCurrentProject] = useState(0);
  const [code, setCode] = useState('');
  const [canvasState, setCanvasState] = useState<Array<{x: number, y: number}>>([]);
  const [score, setScore] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const projects = [
    {
      title: 'Draw a Square',
      description: 'Use turtle graphics to draw a perfect square',
      instruction: 'Move forward 100 pixels, turn right 90 degrees, repeat 4 times',
      starterCode: 'import turtle\nt = turtle.Turtle()\n\n# Draw a square here\n',
      hints: ['Use t.forward(100) to move', 'Use t.right(90) to turn', 'Use a for loop to repeat'],
      solution: 'import turtle\nt = turtle.Turtle()\n\nfor i in range(4):\n    t.forward(100)\n    t.right(90)',
      demoPath: [{x: 0, y: 0}, {x: 100, y: 0}, {x: 100, y: 100}, {x: 0, y: 100}, {x: 0, y: 0}]
    },
    {
      title: 'Draw a Star',
      description: 'Create a five-pointed star using turtle graphics',
      instruction: 'Move forward, turn right 144 degrees, repeat 5 times',
      starterCode: 'import turtle\nt = turtle.Turtle()\n\n# Draw a star here\n',
      hints: ['Stars need 144-degree turns', 'Use range(5) for 5 points', 'Forward distance of 100 works well'],
      solution: 'import turtle\nt = turtle.Turtle()\n\nfor i in range(5):\n    t.forward(100)\n    t.right(144)',
      demoPath: [{x: 0, y: 0}, {x: 100, y: 0}, {x: 20, y: 80}, {x: -80, y: 30}, {x: 80, y: 30}, {x: -20, y: 80}, {x: 0, y: 0}]
    },
    {
      title: 'Colorful Pattern',
      description: 'Create a colorful geometric pattern',
      instruction: 'Use different colors and create a repeating pattern',
      starterCode: 'import turtle\nt = turtle.Turtle()\nt.speed(5)\n\n# Create colorful pattern\n',
      hints: ['Use t.color("red") to change colors', 'Combine shapes for patterns', 'Try t.circle(50) for circles'],
      solution: 'import turtle\nt = turtle.Turtle()\nt.speed(5)\n\ncolors = ["red", "blue", "green", "yellow"]\nfor i in range(4):\n    t.color(colors[i])\n    t.circle(50)\n    t.right(90)',
      demoPath: [{x: 0, y: 0}, {x: 50, y: 50}, {x: 0, y: 100}, {x: -50, y: 50}, {x: 0, y: 0}]
    }
  ];

  const runTurtleCode = () => {
    // Simulate turtle graphics execution
    const project = projects[currentProject];
    if (code.includes('forward') || code.includes('circle')) {
      setCanvasState(project.demoPath);
      setScore(score + 1);
      setTimeout(() => {
        if (currentProject + 1 >= projects.length) {
          onComplete(score * 33.33);
        } else {
          setCurrentProject(currentProject + 1);
          setCode(projects[currentProject + 1].starterCode);
          setCanvasState([]);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    setCode(projects[currentProject].starterCode);
  }, [currentProject]);

  const currentProjectData = projects[currentProject];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🐢 Turtle Graphics Art Studio
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Instructions */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Project {currentProject + 1}: {currentProjectData.title}
          </h4>
          <p className="text-white/90 mb-4">{currentProjectData.description}</p>
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <p className="text-white text-sm">{currentProjectData.instruction}</p>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm">Hints:</h5>
            {currentProjectData.hints.map((hint, index) => (
              <div key={index} className="text-white/80 text-sm">
                💡 {hint}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setCode(currentProjectData.solution)}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
          >
            Show Solution
          </button>
        </div>
        
        {/* Code Editor */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-bold">Python Code</h4>
            <button
              onClick={runTurtleCode}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Run
            </button>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded resize-none"
            placeholder="Write your turtle graphics code..."
          />
        </div>
        
        {/* Canvas */}
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-gray-800 font-bold mb-3">Turtle Canvas</h4>
          <div className="relative bg-gray-100 rounded h-64 overflow-hidden">
            <svg width="100%" height="100%" className="absolute inset-0">
              {canvasState.length > 1 && canvasState.map((point, index) => {
                if (index === 0) return null;
                const prevPoint = canvasState[index - 1];
                return (
                  <line
                    key={index}
                    x1={prevPoint.x + 100}
                    y1={prevPoint.y + 100}
                    x2={point.x + 100}
                    y2={point.y + 100}
                    stroke="blue"
                    strokeWidth="2"
                  />
                );
              })}
              {canvasState.length > 0 && (
                <circle
                  cx={canvasState[canvasState.length - 1].x + 100}
                  cy={canvasState[canvasState.length - 1].y + 100}
                  r="3"
                  fill="green"
                />
              )}
            </svg>
            {canvasState.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">
                Run your code to see turtle graphics!
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Studio
        </button>
        <div className="text-white/60 text-sm flex items-center">
          Project {currentProject + 1} of {projects.length} | Score: {score}
        </div>
      </div>
    </motion.div>
  );
};

// Phidget Hardware Tutorial
export const PhidgetTutorial: React.FC<TutorialProps> = ({ onComplete, onClose }) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [sensorValues, setSensorValues] = useState({ light: 50, temperature: 20, led: false });
  const [userCode, setUserCode] = useState('');
  const [score, setScore] = useState(0);
  const [deviceConnected, setDeviceConnected] = useState(false);

  const tasks = [
    {
      title: 'Connect to Light Sensor',
      description: 'Read data from a light sensor using Phidgets',
      instruction: 'Write code to read the light sensor value and display it',
      starterCode: 'from Phidget22 import *\n\n# Connect to light sensor\nlight_sensor = LightSensor()\nlight_sensor.openWaitForAttachment(1000)\n\n# Read sensor value\nlight_value = light_sensor.getIlluminance()\nprint("Light level:", light_value)',
      expected: 'light_sensor.getIlluminance()'
    },
    {
      title: 'Control LED Output',
      description: 'Turn an LED on and off based on sensor input',
      instruction: 'If light level is below 30, turn LED on; otherwise turn it off',
      starterCode: 'from Phidget22 import *\n\n# Setup devices\nlight_sensor = LightSensor()\nled = DigitalOutput()\n\n# Read light and control LED\nlight_value = light_sensor.getIlluminance()\nif light_value < 30:\n    led.setState(True)  # Turn on LED\nelse:\n    led.setState(False)  # Turn off LED',
      expected: 'led.setState'
    },
    {
      title: 'Temperature Monitor',
      description: 'Create a temperature monitoring system',
      instruction: 'Read temperature and display warnings for extreme values',
      starterCode: 'from Phidget22 import *\n\n# Setup temperature sensor\ntemp_sensor = TemperatureSensor()\ntemp = temp_sensor.getTemperature()\n\n# Check temperature ranges\nif temp > 30:\n    print("Warning: Too hot!")\nelif temp < 10:\n    print("Warning: Too cold!")\nelse:\n    print("Temperature normal:", temp)',
      expected: 'temp_sensor.getTemperature()'
    }
  ];

  const runPhidgetCode = () => {
    const task = tasks[currentTask];
    if (userCode.includes(task.expected)) {
      setDeviceConnected(true);
      setScore(score + 1);
      
      // Simulate sensor data changes
      if (currentTask === 0) {
        setSensorValues(prev => ({ ...prev, light: Math.random() * 100 }));
      } else if (currentTask === 1) {
        setSensorValues(prev => ({ ...prev, led: prev.light < 30 }));
      } else if (currentTask === 2) {
        setSensorValues(prev => ({ ...prev, temperature: Math.random() * 40 }));
      }
      
      setTimeout(() => {
        if (currentTask + 1 >= tasks.length) {
          onComplete(score * 33.33);
        } else {
          setCurrentTask(currentTask + 1);
          setUserCode(tasks[currentTask + 1].starterCode);
          setDeviceConnected(false);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    setUserCode(tasks[currentTask].starterCode);
  }, [currentTask]);

  const currentTaskData = tasks[currentTask];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🔌 Phidget Hardware Lab
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Task Instructions */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-2">
            Task {currentTask + 1}: {currentTaskData.title}
          </h4>
          <p className="text-white/90 mb-4">{currentTaskData.description}</p>
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <p className="text-white text-sm">{currentTaskData.instruction}</p>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
            <p className="text-yellow-200 text-sm">
              💡 <strong>Tip:</strong> Phidgets connect your code to real hardware sensors and outputs!
            </p>
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-bold">Python Code</h4>
            <button
              onClick={runPhidgetCode}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Run
            </button>
          </div>
          
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded resize-none"
            placeholder="Write your Phidget code..."
          />
        </div>
        
        {/* Hardware Simulation */}
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-gray-800 font-bold mb-3">Hardware Devices</h4>
          <div className="space-y-4">
            {/* Light Sensor */}
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700">Light Sensor</span>
                <span className={`text-sm ${deviceConnected ? 'text-green-600' : 'text-gray-400'}`}>
                  {deviceConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </span>
              </div>
              <div className="bg-yellow-200 rounded h-4 mb-2">
                <div 
                  className="bg-yellow-500 h-4 rounded transition-all duration-500"
                  style={{ width: `${sensorValues.light}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm">Level: {Math.round(sensorValues.light)}</p>
            </div>
            
            {/* LED Output */}
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700">LED Output</span>
                <div className={`w-4 h-4 rounded-full ${sensorValues.led ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              </div>
              <p className="text-gray-600 text-sm">Status: {sensorValues.led ? 'ON' : 'OFF'}</p>
            </div>
            
            {/* Temperature Sensor */}
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700">Temperature</span>
                <span className="text-2xl">{sensorValues.temperature > 25 ? '🌡️' : '❄️'}</span>
              </div>
              <p className="text-gray-600 text-sm">{Math.round(sensorValues.temperature)}°C</p>
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
          Task {currentTask + 1} of {tasks.length} | Score: {score}
        </div>
      </div>
    </motion.div>
  );
};
