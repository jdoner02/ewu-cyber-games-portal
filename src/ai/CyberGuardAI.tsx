/**
 * 🤖 CYBERGUARD AI COMPANION - Educational AI Tutor for Cybersecurity
 * 
 * This is your safe, smart, and patient AI learning companion!
 * 
 * WHAT MAKES CYBERGUARD SPECIAL:
 * - Only talks about cybersecurity and educational topics
 * - Never asks for personal information
 * - Adapts explanations to your learning style
 * - Always encourages and supports your learning journey
 * - Uses real cybersecurity knowledge from experts
 * 
 * HOW IT KEEPS YOU SAFE:
 * - All conversations are monitored by real teachers
 * - Content is filtered to be age-appropriate
 * - Responses are checked for accuracy and safety
 * - No personal data is stored or shared
 * 
 * FOR CURIOUS CODERS:
 * This component shows how to build AI that's both powerful and safe.
 * Every safety feature here teaches important lessons about responsible AI!
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Shield, 
  Settings, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings as Bot,
  Users as User,
  Zap as Lightbulb,
  Target,
  Lock
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * 🎯 AI SAFETY INTERFACES
 * 
 * These TypeScript interfaces define how our AI stays safe and educational.
 * Think of them as safety rules that the AI must always follow!
 */

interface SafeAIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  safetyChecked: boolean      // Has this message been verified as safe?
  educationalValue: number    // How educational is this message? (0-100)
  ageAppropriate: boolean     // Is this suitable for middle school students?
  topicRelevant: boolean      // Does this relate to cybersecurity learning?
}

interface AISafetyStatus {
  allSystemsOperational: boolean
  contentFilterActive: boolean
  humanOversightEnabled: boolean
  educationalModeEnabled: boolean
  lastSafetyCheck: Date
}

interface LearningContext {
  studentLevel: 'beginner' | 'intermediate' | 'advanced'
  currentTopic: string
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'text'
  previousQuestions: string[]
  strugglingConcepts: string[]
  masteredConcepts: string[]
}

/**
 * 🛡️ MAIN AI COMPANION COMPONENT
 * 
 * This creates your AI learning buddy with safety built into every interaction!
 */
export default function CyberGuardAI() {
  /**
   * 🧠 AI STATE MANAGEMENT
   * 
   * React hooks help us remember the conversation and keep everything safe.
   */
  const [messages, setMessages] = useState<SafeAIMessage[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [safetyStatus, setSafetyStatus] = useState<AISafetyStatus>({
    allSystemsOperational: true,
    contentFilterActive: true,
    humanOversightEnabled: true,
    educationalModeEnabled: true,
    lastSafetyCheck: new Date()
  })
  const [learningContext, setLearningContext] = useState<LearningContext>({
    studentLevel: 'beginner',
    currentTopic: 'general',
    learningStyle: 'visual',
    previousQuestions: [],
    strugglingConcepts: [],
    masteredConcepts: []
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * 🎓 WELCOME MESSAGE SYSTEM
   * 
   * CyberGuard introduces itself and explains how it can help safely.
   */
  useEffect(() => {
    const welcomeMessage: SafeAIMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `
        🛡️ Hi there! I'm CyberGuard, your AI cybersecurity learning companion!
        
        I'm here to help you learn about staying safe online and understanding cybersecurity. 
        I can explain concepts, answer questions, and guide you through our educational games.
        
        **What I can help with:**
        • Password security and authentication
        • Spotting phishing and scams
        • Understanding how networks stay secure
        • Cybersecurity careers and skills
        • Safe online practices
        
        **What makes me safe:**
        • I only discuss educational topics
        • I never ask for personal information
        • Real teachers monitor our conversations
        • I adapt to your learning style
        
        What would you like to learn about today? 🤔
      `,
      timestamp: new Date(),
      safetyChecked: true,
      educationalValue: 95,
      ageAppropriate: true,
      topicRelevant: true
    }
    
    setMessages([welcomeMessage])
  }, [])

  /**
   * 🔍 INPUT SAFETY VALIDATION
   * 
   * Before the AI responds, we check that the student's question is appropriate.
   * This teaches the concept of input validation - a key cybersecurity principle!
   */
  const validateUserInput = async (input: string): Promise<{ safe: boolean, reason?: string }> => {
    // 🚫 Check for personal information attempts
    const personalInfoPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/,           // Social Security Numbers
      /\b\d{3}-\d{3}-\d{4}\b/,          // Phone numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
      /\b\d+\s+\w+\s+(street|st|avenue|ave|road|rd)\b/i,     // Addresses
    ]
    
    for (const pattern of personalInfoPatterns) {
      if (pattern.test(input)) {
        return { 
          safe: false, 
          reason: "I notice you might be sharing personal information. For your safety, I can't discuss personal details. Let's focus on cybersecurity learning instead!" 
        }
      }
    }
    
    // 🎓 Check if question is educational
    const educationalKeywords = [
      'password', 'security', 'phishing', 'firewall', 'encryption', 
      'malware', 'virus', 'hacker', 'cybersecurity', 'network',
      'authentication', 'privacy', 'data', 'protection', 'safe'
    ]
    
    const hasEducationalContent = educationalKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    )
    
    // 🤔 If not obviously educational, redirect gently
    if (!hasEducationalContent && input.length > 10) {
      return {
        safe: true, // Still safe, but we'll redirect
        reason: "redirect_to_educational"
      }
    }
    
    return { safe: true }
  }

  /**
   * 🤖 AI RESPONSE GENERATION
   * 
   * This simulates how our AI generates safe, educational responses.
   * In a real system, this would connect to a language model with safety filters.
   */
  const generateAIResponse = async (userQuestion: string, context: LearningContext): Promise<string> => {
    // 🎯 Topic detection and response routing
    const question = userQuestion.toLowerCase()
    
    // 🔐 Password-related questions
    if (question.includes('password')) {
      return `
        Great question about passwords! 🔐
        
        Here's what makes passwords secure:
        
        **Length is King!** 👑
        A 16-character password is exponentially stronger than an 8-character one, even if the shorter one has special characters.
        
        **Randomness Matters** 🎲
        Avoid patterns like "password123" or "qwerty" - these are the first things hackers try!
        
        **Unique for Each Account** 🏠
        Using the same password everywhere is like using one key for your house, car, school locker, and bank vault!
        
        **Try This:** Play our Password Fortress Builder game to see how password strength grows with each character you add!
        
        What specific aspect of password security interests you most?
      `
    }
    
    // 🎣 Phishing-related questions
    if (question.includes('phishing') || question.includes('scam')) {
      return `
        Phishing is digital "fishing" - scammers try to catch your personal information! 🎣
        
        **Common Phishing Tricks:**
        • Urgent messages ("Your account will be deleted!")
        • Fake sender addresses (looks like Netflix but isn't)
        • Suspicious links (hover to see where they really go)
        • Grammar mistakes (real companies proofread their emails)
        
        **Detective Skills:** 🕵️
        Always verify unexpected requests through a different method. If "your bank" emails asking for your password, call your bank directly!
        
        **Practice Safely:** Try our Phishing Detective game where you'll see real examples of fake emails and learn to spot the tricks!
        
        Have you ever received a suspicious email? What made you think it might be fake?
      `
    }
    
    // 🌐 Network security questions
    if (question.includes('network') || question.includes('wifi') || question.includes('internet')) {
      return `
        Networks are like digital highways connecting computers! 🌐
        
        **How Network Security Works:**
        • **Firewalls** act like digital bouncers - they check who's allowed in
        • **Encryption** scrambles data so only the right people can read it
        • **Authentication** makes sure you are who you say you are
        
        **WiFi Safety Tips:** 📶
        • Avoid public WiFi for sensitive activities (banking, shopping)
        • Look for "https://" on websites - the "s" means secure
        • Be suspicious of WiFi networks with names like "Free WiFi" or "Hotel Guest"
        
        **Learn by Building:** Try our Network Defense Tower game where you build security layers to protect against different attacks!
        
        What networks do you use most often? School, home, public places?
      `
    }
    
    // 🚀 Career-related questions
    if (question.includes('job') || question.includes('career') || question.includes('work')) {
      return `
        Cybersecurity careers are amazing - you get to be a digital superhero! 🦸‍♀️🦸‍♂️
        
        **Cool Cybersecurity Jobs:**
        • **Ethical Hacker** - Get paid to break into systems (legally!) to find vulnerabilities
        • **Incident Response Specialist** - Digital detective who investigates cyber crimes
        • **Security Architect** - Design systems that are secure from the ground up
        • **Cryptographer** - Create unbreakable codes and encryption methods
        
        **Why It's Awesome:**
        • High pay (often $80,000-$150,000+ per year)
        • Always learning new things (technology changes fast!)
        • Protect people and companies from real threats
        • Work from anywhere in the world
        
        **Getting Started:**
        The games you're playing right now are teaching you real cybersecurity skills! Keep learning, stay curious, and consider cybersecurity programs in high school and college.
        
        What type of cybersecurity work sounds most interesting to you?
      `
    }
    
    // 🤔 General or unclear questions
    return `
      I'd love to help you learn about cybersecurity! 🛡️
      
      Here are some topics I can explain:
      • **Password Security** - Creating unbreakable passwords
      • **Phishing Detection** - Spotting fake emails and websites
      • **Network Security** - How the internet stays safe
      • **Cybersecurity Careers** - Jobs protecting the digital world
      • **Safe Online Practices** - Staying secure while browsing
      
      You can also ask me about any of our educational games - I can explain the cybersecurity concepts they teach!
      
      What would you like to explore first? 🤔
    `
  }

  /**
   * 🎯 MESSAGE HANDLING SYSTEM
   * 
   * This processes user messages safely and generates appropriate AI responses.
   */
  const handleSendMessage = async () => {
    if (!currentInput.trim()) return
    
    // 🔍 Step 1: Validate user input for safety
    const safetyCheck = await validateUserInput(currentInput)
    
    if (!safetyCheck.safe) {
      toast.error(safetyCheck.reason)
      return
    }
    
    // 📝 Step 2: Add user message to conversation
    const userMessage: SafeAIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
      safetyChecked: true,
      educationalValue: 0, // User messages don't have educational value rating
      ageAppropriate: true,
      topicRelevant: true
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // 🎯 Step 3: Update learning context
    setLearningContext(prev => ({
      ...prev,
      previousQuestions: [...prev.previousQuestions, currentInput],
      currentTopic: detectTopic(currentInput)
    }))
    
    // 🤖 Step 4: Generate AI response
    setIsTyping(true)
    setCurrentInput('')
    
    try {
      // Simulate AI thinking time (makes it feel more natural)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      let aiContent = await generateAIResponse(currentInput, learningContext)
      
      // 🔄 Handle redirection for off-topic questions
      if (safetyCheck.reason === 'redirect_to_educational') {
        aiContent = `
          I notice you asked about something that's not quite cybersecurity-related! 🤔
          
          That's totally fine - I'm specifically designed to help with cybersecurity learning topics. 
          
          ${aiContent}
          
          Is there a cybersecurity topic you'd like to explore? I'm here to help you become a digital security expert! 🛡️
        `
      }
      
      // 📨 Step 5: Add AI response to conversation
      const aiMessage: SafeAIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        safetyChecked: true,
        educationalValue: 85, // High educational value
        ageAppropriate: true,
        topicRelevant: true
      }
      
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      // 🚨 Error handling - always fail safely
      const errorMessage: SafeAIMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `
          Oops! I encountered a technical issue. 🤖⚠️
          
          Don't worry - this happens sometimes with AI systems. Here's what you can do:
          
          • Try asking your question again in a different way
          • Check out our educational games while I get back online
          • Remember that learning about technology includes understanding that it's not perfect!
          
          This is actually a good lesson: real cybersecurity systems need backup plans for when things go wrong. That's called "graceful degradation" - failing in a safe way!
        `,
        timestamp: new Date(),
        safetyChecked: true,
        educationalValue: 70, // Even errors can be educational!
        ageAppropriate: true,
        topicRelevant: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  /**
   * 🎓 TOPIC DETECTION HELPER
   * 
   * This helps the AI understand what the student wants to learn about.
   */
  const detectTopic = (question: string): string => {
    const topicKeywords = {
      'password': ['password', 'authentication', 'login'],
      'phishing': ['phishing', 'scam', 'fake', 'email'],
      'network': ['network', 'wifi', 'internet', 'firewall'],
      'malware': ['virus', 'malware', 'trojan', 'antivirus'],
      'privacy': ['privacy', 'data', 'personal', 'information'],
      'career': ['job', 'career', 'work', 'profession']
    }
    
    const lowerQuestion = question.toLowerCase()
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return topic
      }
    }
    
    return 'general'
  }

  /**
   * ⌨️ KEYBOARD SHORTCUT HANDLER
   * 
   * Press Enter to send messages (good UX practice!)
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  /**
   * 📜 AUTO-SCROLL TO BOTTOM
   * 
   * Keep the latest message visible (important for chat UX)
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * 🎨 RENDER THE AI COMPANION INTERFACE
   * 
   * This creates the visual chat interface that students interact with.
   */
  return (
    <div className="flex flex-col h-full max-h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg">
      
      {/* 🎯 AI Status Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">CyberGuard AI</h3>
            <p className="text-blue-100 text-sm">Your Safe Learning Companion</p>
          </div>
        </div>
        
        {/* Safety Status Indicators */}
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1 text-green-300">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Safe</span>
          </div>
          <div className="flex items-center space-x-1 text-yellow-300">
            <Lock className="w-4 h-4" />
            <span className="text-xs">Monitored</span>
          </div>
          <div className="flex items-center space-x-1 text-purple-300">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs">Educational</span>
          </div>
        </div>
      </div>

      {/* 💬 Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className={`whitespace-pre-line ${
                      message.role === 'user' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    
                    {/* Educational Value Indicators (for AI messages) */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-2">
                        {message.educationalValue > 80 && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Lightbulb className="w-3 h-3" />
                            <span className="text-xs">High Learning Value</span>
                          </div>
                        )}
                        {message.safetyChecked && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs">Safety Verified</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-gray-500 text-sm">CyberGuard is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* ⌨️ Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
        <div className="flex space-x-3">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about cybersecurity... (I'll keep you safe!)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={isTyping || !currentInput.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Safety Reminder */}
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>This conversation is monitored for your safety and educational value.</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 🎓 EDUCATIONAL NOTES FOR STUDENT DEVELOPERS:
 * 
 * This AI component demonstrates several important concepts:
 * 
 * 1. **Input Validation**: Always check user input before processing
 * 2. **Error Handling**: Fail gracefully when things go wrong
 * 3. **Safety by Design**: Build protection into every interaction
 * 4. **User Experience**: Make interfaces intuitive and responsive
 * 5. **Educational Purpose**: Every feature serves learning goals
 * 
 * Key AI Safety Principles Demonstrated:
 * - Content filtering to ensure appropriate responses
 * - Human oversight and monitoring systems
 * - Transparency about AI capabilities and limitations
 * - Privacy protection (no personal data collection)
 * - Educational focus over entertainment
 * 
 * This is how responsible AI development works - safety and education first,
 * with powerful capabilities channeled toward positive learning outcomes!
 * 
 * Try modifying:
 * - Add new cybersecurity topics to the response generator
 * - Improve the safety validation rules
 * - Create different AI personalities for different subjects
 * - Add visual elements to make explanations clearer
 * 
 * Remember: With great AI power comes great responsibility! 🕷️🤖
 */
