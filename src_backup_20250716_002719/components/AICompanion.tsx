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
    "Awesome progress! You're building skills that will protect the digital world. How cool is that? 🛡️"
  ],
  hints: [
    "💡 Pro tip: Strong passwords are like good locks - they keep the bad guys out!",
    "🔍 Remember: Hackers often try the obvious passwords first. Be creative!",
    "⚡ Fun fact: Adding just one more character to your password makes it exponentially harder to crack!"
  ],
  cybersecurity_facts: [
    "🎯 Did you know? 95% of successful cyber attacks are due to human error. That's why education matters!",
    "🔐 Cool fact: The first computer password was created in 1961 at MIT. We've come a long way!",
    "🌐 Amazing stat: There are over 2,200 cyber attacks every day. Good thing we have heroes like you learning to stop them!"
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

    // Generate bot response
    let botResponse = ''
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('help') || lowerMessage.includes('hint')) {
      botResponse = SWOOP_RESPONSES.hints[Math.floor(Math.random() * SWOOP_RESPONSES.hints.length)]
    } else if (lowerMessage.includes('password') || lowerMessage.includes('security')) {
      botResponse = SWOOP_RESPONSES.cybersecurity_facts[Math.floor(Math.random() * SWOOP_RESPONSES.cybersecurity_facts.length)]
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('good') || lowerMessage.includes('awesome')) {
      botResponse = SWOOP_RESPONSES.encouragement[Math.floor(Math.random() * SWOOP_RESPONSES.encouragement.length)]
    } else {
      // Default educational response
      botResponse = "That's a great question! Cybersecurity is all about protecting data and systems. Want to learn more about a specific topic like passwords, phishing, or network security? 🤔"
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
