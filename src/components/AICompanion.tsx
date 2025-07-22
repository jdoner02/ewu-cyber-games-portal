'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Lightbulb, Heart, Zap } from 'lucide-react'
import useGameStore from '@/stores/gameStore'

const SWOOP_RESPONSES = {
  greeting: [
    "Hey there, cyber hero! I'm Swoop Bot, your AI companion. Ready to learn some cybersecurity? 🤖",
    "Welcome to the cyber world! I'm here to help you become a security expert. What would you like to explore?",
    "Greetings, future cybersecurity champion! Swoop Bot at your service. Let's hack some knowledge! 💫"
  ],
  encouragement: [
    "You're doing great! Every security expert started where you are now. Keep it up! 🌟",
    "Nice work! Remember, cybersecurity is all about thinking like both a defender AND an attacker.",
    "Awesome progress! You're building skills that will protect the digital world. How cool is that? 🛡️",
    "Fantastic! The cybersecurity community needs more heroes like you! 🦸‍♀️"
  ],
  gameSpecificHelp: {
    'phishing-detective': [
      "�️ Phishing Detective tips: Look for urgency tactics, spelling errors, and suspicious sender addresses!",
      "🔍 Pro detective move: Hover over links to see where they REALLY lead before clicking!",
      "📧 Remember: Legitimate companies never ask for passwords via email!"
    ],
    'network-defense': [
      "🏰 Network Defense strategy: Layer your defenses! Different attacks need different countermeasures.",
      "⚡ Tower Defense tip: Firewalls are your first line of defense, but don't forget about intrusion detection!",
      "�️ Smart defenders know: Monitor your network traffic patterns to spot anomalies early!"
    ],
    'encryption-escape': [
      "🔐 Encryption insight: Strong ciphers use mathematical complexity that even computers can't easily break!",
      "🔑 Cipher tip: The key is often more important than the algorithm itself - protect it!",
      "🧮 Fun fact: Modern encryption would take longer to crack than the age of the universe!"
    ],
    'password-fortress': [
      "🏰 Password power: Length beats complexity! A long passphrase is stronger than a short complex password.",
      "🎯 Security tip: Use unique passwords for every account - password managers make this easy!",
      "⚡ Pro move: Enable two-factor authentication whenever possible for extra protection!"
    ]
  },
  cybersecurityEducation: {
    concepts: [
      "🎯 The CIA Triad: Confidentiality, Integrity, and Availability - the foundation of all cybersecurity!",
      "🔍 Defense in Depth: Like an onion, security has layers. Multiple defenses protect better than one!",
      "🧠 Human Factor: People are often the weakest link in security. Education is the best defense!",
      "⚡ Zero Trust: Never trust, always verify. Even internal network traffic should be authenticated!"
    ],
    threats: [
      "🦠 Malware comes in many forms: viruses, worms, trojans, ransomware, and spyware. Each has different goals!",
      "🎭 Social Engineering exploits human psychology, not technical vulnerabilities. Stay skeptical!",
      "🌐 DDoS attacks overwhelm systems with traffic. It's like blocking a highway with too many cars!",
      "🔑 Password attacks use brute force, dictionaries, or stolen data. Strong, unique passwords defend against all!"
    ],
    careers: [
      "� Cybersecurity careers: Ethical hacker, Security analyst, Incident responder, Forensics investigator!",
      "💼 Skills needed: Technical knowledge + critical thinking + communication + continuous learning!",
      "🌟 The field is growing fast - cybersecurity jobs are projected to grow 35% by 2031!",
      "🎓 Many paths to success: College degrees, certifications, bootcamps, or self-taught learning!"
    ]
  },
  progressAdaptive: {
    beginner: [
      "🌱 You're just starting your cybersecurity journey - every expert was once a beginner!",
      "📚 Focus on fundamentals first: passwords, phishing, and basic network security concepts.",
      "� Games are a great way to learn! Try starting with Password Fortress for the basics."
    ],
    intermediate: [
      "🚀 Great progress! You're building real cybersecurity skills that professionals use every day.",
      "🔍 Ready for a challenge? Try the Phishing Detective game to sharpen your threat detection skills!",
      "🏰 Your foundation is strong - time to explore advanced concepts like encryption and network defense!"
    ],
    advanced: [
      "🎖️ Impressive skills! You're thinking like a true cybersecurity professional now.",
      "🔬 Consider diving deep into our professional security tools - they're used by real SOC teams!",
      "🌟 You could mentor other students - teaching others reinforces your own learning!"
    ]
  },
  conversationStarters: [
    "What cybersecurity topic interests you most? I can explain anything from passwords to quantum encryption!",
    "Want to hear about a real-world cyber attack and how it was stopped?",
    "Curious about what it's like to work in cybersecurity? I can share career insights!",
    "Need help with any of our games? I've got strategies for all of them!",
    "Want to test your knowledge? I can quiz you on any cybersecurity concept!"
  ]
}

export default function AICompanion() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', message: SWOOP_RESPONSES.greeting[0], timestamp: new Date() }
  ])
  const { aiCompanion, updateAICompanion } = useGameStore()

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage = { type: 'user', message: message.trim(), timestamp: new Date() }
    setChatHistory(prev => [...prev, userMessage])

    // Generate intelligent bot response
    let botResponse = ''
    const lowerMessage = message.toLowerCase()

    // Game-specific help
    if (lowerMessage.includes('phishing') || lowerMessage.includes('detective')) {
      botResponse = SWOOP_RESPONSES.gameSpecificHelp['phishing-detective'][Math.floor(Math.random() * SWOOP_RESPONSES.gameSpecificHelp['phishing-detective'].length)]
    } else if (lowerMessage.includes('network') || lowerMessage.includes('defense') || lowerMessage.includes('tower')) {
      botResponse = SWOOP_RESPONSES.gameSpecificHelp['network-defense'][Math.floor(Math.random() * SWOOP_RESPONSES.gameSpecificHelp['network-defense'].length)]
    } else if (lowerMessage.includes('encryption') || lowerMessage.includes('cipher') || lowerMessage.includes('escape')) {
      botResponse = SWOOP_RESPONSES.gameSpecificHelp['encryption-escape'][Math.floor(Math.random() * SWOOP_RESPONSES.gameSpecificHelp['encryption-escape'].length)]
    } else if (lowerMessage.includes('password') || lowerMessage.includes('fortress')) {
      botResponse = SWOOP_RESPONSES.gameSpecificHelp['password-fortress'][Math.floor(Math.random() * SWOOP_RESPONSES.gameSpecificHelp['password-fortress'].length)]
    }
    // Educational content
    else if (lowerMessage.includes('concept') || lowerMessage.includes('fundamental') || lowerMessage.includes('basic')) {
      botResponse = SWOOP_RESPONSES.cybersecurityEducation.concepts[Math.floor(Math.random() * SWOOP_RESPONSES.cybersecurityEducation.concepts.length)]
    } else if (lowerMessage.includes('threat') || lowerMessage.includes('attack') || lowerMessage.includes('malware')) {
      botResponse = SWOOP_RESPONSES.cybersecurityEducation.threats[Math.floor(Math.random() * SWOOP_RESPONSES.cybersecurityEducation.threats.length)]
    } else if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
      botResponse = SWOOP_RESPONSES.cybersecurityEducation.careers[Math.floor(Math.random() * SWOOP_RESPONSES.cybersecurityEducation.careers.length)]
    }
    // Encouragement and help
    else if (lowerMessage.includes('help') || lowerMessage.includes('hint') || lowerMessage.includes('stuck')) {
      // Provide adaptive help based on user progress
      const playerLevel = aiCompanion.messagesCount
      if (playerLevel < 5) {
        botResponse = SWOOP_RESPONSES.progressAdaptive.beginner[Math.floor(Math.random() * SWOOP_RESPONSES.progressAdaptive.beginner.length)]
      } else if (playerLevel < 15) {
        botResponse = SWOOP_RESPONSES.progressAdaptive.intermediate[Math.floor(Math.random() * SWOOP_RESPONSES.progressAdaptive.intermediate.length)]
      } else {
        botResponse = SWOOP_RESPONSES.progressAdaptive.advanced[Math.floor(Math.random() * SWOOP_RESPONSES.progressAdaptive.advanced.length)]
      }
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('good') || lowerMessage.includes('awesome') || lowerMessage.includes('great')) {
      botResponse = SWOOP_RESPONSES.encouragement[Math.floor(Math.random() * SWOOP_RESPONSES.encouragement.length)]
    } else {
      // Default conversation starter
      botResponse = SWOOP_RESPONSES.conversationStarters[Math.floor(Math.random() * SWOOP_RESPONSES.conversationStarters.length)]
    }

    setTimeout(() => {
      const botMessage = { type: 'bot', message: botResponse, timestamp: new Date() }
      setChatHistory(prev => [...prev, botMessage])
      updateAICompanion({ messagesCount: aiCompanion.messagesCount + 1, lastInteraction: new Date().toISOString() })
    }, 1000)

    setMessage('')
  }

  const getMoodIcon = () => {
    switch (aiCompanion.mood) {
      case 'excited': return <Zap className="w-5 h-5 text-yellow-400" />
      case 'encouraging': return <Heart className="w-5 h-5 text-pink-400" />
      case 'thinking': return <Lightbulb className="w-5 h-5 text-purple-400" />
      default: return <Bot className="w-5 h-5 text-cyan-400" />
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full p-4 shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        animate={{ 
          y: [0, -5, 0],
          boxShadow: [
            '0 10px 25px rgba(6, 182, 212, 0.3)',
            '0 15px 35px rgba(147, 51, 234, 0.4)',
            '0 10px 25px rgba(6, 182, 212, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center gap-2">
          {getMoodIcon()}
          <MessageCircle className="w-6 h-6" />
        </div>
        
        {/* Notification badge */}
        {aiCompanion.messagesCount < 3 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            !
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-80 h-96 bg-slate-800 rounded-xl shadow-2xl border border-cyan-400/30 z-50 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMoodIcon()}
                <div>
                  <h3 className="text-white font-bold">Swoop Bot</h3>
                  <p className="text-cyan-100 text-xs">Your Cyber Companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-cyan-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    chat.type === 'user' 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-slate-700 text-slate-200'
                  }`}>
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about cybersecurity..."
                  className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-cyan-400 focus:outline-none"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Ask me for hints, cybersecurity facts, or just say hi! 🤖
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
