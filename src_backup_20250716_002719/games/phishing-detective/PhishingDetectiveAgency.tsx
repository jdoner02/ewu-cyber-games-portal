/**
 * 🕵️ PHISHING DETECTIVE AGENCY - Educational Phishing Detection Game
 * 
 * Welcome to the most important cybersecurity skill: spotting fake emails!
 * 
 * WHAT YOU'LL LEARN:
 * - How to identify suspicious email patterns
 * - Real techniques scammers use to trick people
 * - Detective skills for analyzing digital evidence
 * - Why phishing is such a common attack method
 * 
 * GAME MECHANICS (CrazyGames-style fun!):
 * - Examine emails in your detective inbox
 * - Use magnifying glass tools to inspect details
 * - Earn detective badges for spotting different scam types
 * - Build your reputation as a cyber-detective
 * 
 * FOR STUDENT DEVELOPERS:
 * This component teaches pattern recognition, critical thinking,
 * and the psychology behind social engineering attacks.
 * Every email scenario is based on real phishing attempts!
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Shield,
  Eye,
  ExternalLink,
  Clock,
  Star,
  Award,
  Zap,
  Target,
  Brain,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * 📧 PHISHING EMAIL DATA TYPES
 * 
 * These interfaces define the structure of our educational email scenarios.
 * Each email teaches different phishing detection techniques!
 */

interface PhishingEmail {
  id: string
  sender: string
  subject: string
  content: string
  timestamp: string
  isPhishing: boolean
  phishingType: 'urgent_threat' | 'fake_reward' | 'credential_harvest' | 'malicious_link' | 'impersonation'
  redFlags: string[]          // What makes this email suspicious
  educationalNotes: string[]  // Teaching points for students
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
}

interface DetectiveStats {
  emailsAnalyzed: number
  correctDetections: number
  falsePositives: number      // Marked safe emails as phishing
  falseNegatives: number      // Marked phishing emails as safe
  accuracy: number
  streak: number              // Current correct streak
  longestStreak: number
  badgesEarned: BadgeId[]
}

interface DetectionChoice {
  isPhishing: boolean
  confidence: 'low' | 'medium' | 'high'
  reasoning: string
}

/**
 * 🎮 EDUCATIONAL EMAIL DATABASE
 * 
 * Real phishing scenarios adapted for middle school learning.
 * Each email teaches specific detection skills!
 */
const EDUCATIONAL_EMAILS: PhishingEmail[] = [
  {
    id: 'netflix_fake',
    sender: 'noreply@netflix-security.com', // Suspicious domain!
    subject: '⚠️ URGENT: Your Netflix account will be suspended!',
    content: `
Dear Valued Customer,

We have detected unusual activity on your Netflix account. Your subscription will be CANCELLED in 24 hours unless you verify your payment information immediately.

Click here to update your account: http://netflix-verify.security-update.net/login

If you do not take action, you will lose access to all your shows and movies!

Thank you,
Netflix Security Team

---
This email was sent from netflix-security.com. If you did not request this, please ignore.
    `,
    timestamp: '2 minutes ago',
    isPhishing: true,
    phishingType: 'urgent_threat',
    redFlags: [
      'Creates false urgency ("24 hours")',
      'Suspicious sender domain (netflix-security.com vs real netflix.com)',
      'Threatening language about losing access',
      'Suspicious link domain (security-update.net)',
      'Generic greeting ("Valued Customer")',
      'Poor grammar and excessive urgency'
    ],
    educationalNotes: [
      'Real Netflix never threatens to cancel your account via email',
      'Always check sender domains carefully - look for extra words',
      'Legitimate companies never ask you to click links to "verify" accounts',
      'When in doubt, go directly to the company\'s website yourself'
    ],
    difficultyLevel: 'beginner'
  },
  {
    id: 'amazon_gift',
    sender: 'support@amazon.com', // Looks legitimate!
    subject: 'Congratulations! You\'ve won a $500 Amazon Gift Card!',
    content: `
Hi there!

You've been randomly selected to receive a $500 Amazon Gift Card as part of our customer appreciation program!

To claim your prize, simply:
1. Click the link below
2. Complete a short survey (2 minutes)
3. Enter your email to receive the gift card code

Claim your gift card here: https://amazon-rewards.customer-survey.org/claim

This offer expires in 6 hours, so don't miss out!

Best regards,
Amazon Customer Service
    `,
    timestamp: '1 hour ago',
    isPhishing: true,
    phishingType: 'fake_reward',
    redFlags: [
      'Unsolicited gift card offer',
      'Creates false urgency ("6 hours")',
      'Suspicious redirect domain (customer-survey.org)',
      'No personalization (no account details)',
      'Too good to be true offer',
      'Requires clicking external link'
    ],
    educationalNotes: [
      'Amazon doesn\'t randomly give away gift cards via email',
      'Free money offers are classic phishing bait',
      'Even if the sender looks real, check the link destination',
      'Real companies send rewards through their official app/website'
    ],
    difficultyLevel: 'intermediate'
  },
  {
    id: 'bank_legitimate',
    sender: 'alerts@bankofamerica.com',
    subject: 'Account Alert: Login from new device',
    content: `
Hello,

We noticed a login to your Bank of America account from a new device:

Device: iPhone 12
Location: Seattle, WA
Time: Today at 3:45 PM

If this was you, no action is needed. If you don't recognize this activity, please:

1. Log into your account directly at bankofamerica.com
2. Change your password
3. Call us at 1-800-432-1000 (the number on your debit card)

For security tips, visit our Security Center at bankofamerica.com/security

Thank you,
Bank of America Security Team

This message was sent to the email address associated with your account.
    `,
    timestamp: '3 hours ago',
    isPhishing: false,
    phishingType: 'impersonation', // Not actually phishing, but good to test!
    redFlags: [], // No red flags - this is legitimate!
    educationalNotes: [
      'This is a legitimate security alert',
      'Notice: No links asking you to click and login',
      'Provides specific details (device, location, time)',
      'Directs you to go to the website directly',
      'Gives phone number to verify independently'
    ],
    difficultyLevel: 'intermediate'
  },
  {
    id: 'school_principal',
    sender: 'principal.johnson@eastviewmiddle.edu', // Looks like school email
    subject: 'URGENT: Student Suspension Notice - Immediate Parent Contact Required',
    content: `
Dear Parent/Guardian,

This is Principal Johnson from Eastview Middle School. Your child has been involved in a serious incident requiring immediate suspension.

Due to the sensitive nature of this matter, please click the secure link below to access the full incident report:

🔒 SECURE PARENT PORTAL: https://eastview-parent-portal.school-alerts.net/incident-report

You must review this report within 2 hours or your child may face additional disciplinary action.

If you have questions, please call our main office at (555) 123-4567.

Sincerely,
Principal Johnson
Eastview Middle School
    `,
    timestamp: '30 minutes ago',
    isPhishing: true,
    phishingType: 'impersonation',
    redFlags: [
      'Creates panic about child being in trouble',
      'Suspicious domain (school-alerts.net, not school\'s real domain)',
      'Urgent time pressure ("2 hours")',
      'Schools don\'t handle serious incidents via email links',
      'Emotional manipulation targeting parents',
      'Generic phone number format'
    ],
    educationalNotes: [
      'Schools use official communication channels for serious matters',
      'Real schools call parents directly for urgent issues',
      'Always verify school emails by calling the school directly',
      'Scammers know how to create emotional urgency'
    ],
    difficultyLevel: 'advanced'
  },
  {
    id: 'steam_security',
    sender: 'noreply@steampowered.com',
    subject: 'Steam Guard: New login attempt',
    content: `
Hello,

Someone attempted to log into your Steam account from:

IP Address: 192.168.1.45
Location: Portland, OR, United States
Device: Windows PC
Browser: Chrome
Time: January 15, 2024 at 4:22 PM PST

If this was you, you can safely ignore this email.

If this wasn't you:
• Change your Steam password immediately
• Enable Steam Guard Mobile Authenticator
• Check your account for unauthorized purchases
• Log into Steam directly to review account activity

Visit our Security help page: help.steampowered.com/security

The Steam Team

This automated message was sent to the email address associated with your Steam account.
    `,
    timestamp: '15 minutes ago',
    isPhishing: false,
    phishingType: 'credential_harvest',
    redFlags: [], // This is actually legitimate!
    educationalNotes: [
      'This is a real Steam security notification',
      'Provides specific technical details (IP, browser, exact time)',
      'Doesn\'t ask you to click any links to "verify"',
      'Gives security advice for if it wasn\'t you',
      'References help pages you can access independently'
    ],
    difficultyLevel: 'advanced'
  }
]

/**
 * 🏆 DETECTIVE BADGES SYSTEM
 * 
 * Students earn badges for mastering different phishing detection skills!
 */
type BadgeId = 'first_catch' | 'eagle_eye' | 'urgent_spotter' | 'link_inspector' | 'social_engineer_buster'

const DETECTIVE_BADGES: Record<BadgeId, {
  name: string
  description: string
  icon: string
  requirement: string
}> = {
  'first_catch': {
    name: 'First Catch',
    description: 'Detected your first phishing email!',
    icon: '🎣',
    requirement: 'Detect 1 phishing email'
  },
  'eagle_eye': {
    name: 'Eagle Eye',
    description: 'Perfect accuracy on 5 emails in a row',
    icon: '👁️',
    requirement: '100% accuracy streak of 5'
  },
  'urgent_spotter': {
    name: 'Urgency Spotter',
    description: 'Master at detecting false urgency tactics',
    icon: '⚡',
    requirement: 'Detect 3 urgent threat phishing emails'
  },
  'link_inspector': {
    name: 'Link Inspector',
    description: 'Expert at identifying suspicious URLs',
    icon: '🔗',
    requirement: 'Detect 3 malicious link emails'
  },
  'social_engineer_buster': {
    name: 'Social Engineer Buster',
    description: 'Can\'t be fooled by emotional manipulation',
    icon: '🧠',
    requirement: 'Detect 5 social engineering attempts'
  }
}

/**
 * 🕵️ MAIN PHISHING DETECTIVE COMPONENT
 * 
 * This creates the interactive email analysis interface!
 */
export default function PhishingDetectiveAgency() {
  /**
   * 🎯 GAME STATE MANAGEMENT
   */
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)
  const [currentEmail, setCurrentEmail] = useState(EDUCATIONAL_EMAILS[0])
  const [showingAnalysis, setShowingAnalysis] = useState(false)
  const [detectionChoice, setDetectionChoice] = useState<DetectionChoice | null>(null)
  const [stats, setStats] = useState<DetectiveStats>({
    emailsAnalyzed: 0,
    correctDetections: 0,
    falsePositives: 0,
    falseNegatives: 0,
    accuracy: 0,
    streak: 0,
    longestStreak: 0,
    badgesEarned: []
  })
  const [magnifyingGlass, setMagnifyingGlass] = useState({ x: 0, y: 0, active: false })

  /**
   * 🎓 EDUCATIONAL HINT SYSTEM
   * 
   * Progressive hints help students learn detection techniques.
   */
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showingHints, setShowingHints] = useState(false)

  /**
   * 🔍 EMAIL ANALYSIS TOOLS
   * 
   * These help students examine emails like real cybersecurity professionals!
   */
  const analyzeEmailHeader = () => {
    return {
      senderLegitimacy: checkSenderDomain(currentEmail.sender),
      urgencyTactics: checkUrgencyTactics(currentEmail.subject, currentEmail.content),
      linkSafety: checkLinkSafety(currentEmail.content),
      personalization: checkPersonalization(currentEmail.content)
    }
  }

  /**
   * 🌐 DOMAIN CHECKING HELPER
   * 
   * Teaches students to verify sender domains against known legitimate ones.
   */
  const checkSenderDomain = (sender: string): { isLegitimate: boolean, explanation: string } => {
    const legitimateDomains = [
      'netflix.com',
      'amazon.com', 
      'bankofamerica.com',
      'steampowered.com',
      '.edu' // Educational institutions
    ]
    
    const domain = sender.split('@')[1]
    
    for (const legitDomain of legitimateDomains) {
      if (domain === legitDomain || domain.endsWith(legitDomain)) {
        return {
          isLegitimate: true,
          explanation: `✅ ${domain} matches known legitimate domain ${legitDomain}`
        }
      }
    }
    
    // Check for suspicious patterns
    if (domain.includes('netflix') && domain !== 'netflix.com') {
      return {
        isLegitimate: false,
        explanation: `⚠️ ${domain} looks like Netflix but isn't the real netflix.com domain`
      }
    }
    
    if (domain.includes('amazon') && domain !== 'amazon.com') {
      return {
        isLegitimate: false,
        explanation: `⚠️ ${domain} looks like Amazon but isn't the real amazon.com domain`
      }
    }
    
    return {
      isLegitimate: false,
      explanation: `❓ ${domain} is not a recognized legitimate domain for this type of email`
    }
  }

  /**
   * ⚡ URGENCY TACTICS DETECTOR
   * 
   * Identifies psychological pressure techniques used in phishing.
   */
  const checkUrgencyTactics = (subject: string, content: string): { hasUrgency: boolean, tactics: string[] } => {
    const urgencyWords = [
      'urgent', 'immediate', 'expires', 'suspended', 'cancelled', 
      'limited time', '24 hours', 'act now', 'verify now', 'click now'
    ]
    
    const foundTactics: string[] = []
    const text = (subject + ' ' + content).toLowerCase()
    
    urgencyWords.forEach(word => {
      if (text.includes(word)) {
        foundTactics.push(`"${word}" creates false time pressure`)
      }
    })
    
    // Check for excessive punctuation (another urgency tactic)
    if (subject.includes('!!!') || subject.includes('⚠️')) {
      foundTactics.push('Excessive warning symbols create panic')
    }
    
    return {
      hasUrgency: foundTactics.length > 0,
      tactics: foundTactics
    }
  }

  /**
   * 🔗 LINK SAFETY ANALYZER
   * 
   * Teaches students to identify suspicious URLs and domains.
   */
  const checkLinkSafety = (content: string): { suspiciousLinks: string[], explanation: string[] } => {
    const linkPattern = /https?:\/\/[^\s]+/g
    const links = content.match(linkPattern) || []
    
    const suspiciousLinks: string[] = []
    const explanations: string[] = []
    
    links.forEach(link => {
      const domain = new URL(link).hostname
      
      // Check for suspicious patterns
      if (domain.includes('security-update') || domain.includes('customer-survey')) {
        suspiciousLinks.push(link)
        explanations.push(`${domain} uses suspicious keywords to appear official`)
      }
      
      if (domain.includes('netflix') && !domain.includes('netflix.com')) {
        suspiciousLinks.push(link)
        explanations.push(`${domain} impersonates Netflix but isn't the real site`)
      }
      
      if (domain.includes('school-alerts')) {
        suspiciousLinks.push(link)
        explanations.push(`${domain} creates fake urgency around school communications`)
      }
    })
    
    return { suspiciousLinks, explanation: explanations }
  }

  /**
   * 👤 PERSONALIZATION CHECKER
   * 
   * Real companies usually personalize emails with your actual information.
   */
  const checkPersonalization = (content: string): { isPersonalized: boolean, note: string } => {
    const genericGreetings = [
      'dear customer', 'dear valued customer', 'hello', 'hi there',
      'dear parent', 'dear guardian'
    ]
    
    const lowerContent = content.toLowerCase()
    
    for (const greeting of genericGreetings) {
      if (lowerContent.includes(greeting)) {
        return {
          isPersonalized: false,
          note: `Uses generic greeting "${greeting}" instead of your actual name`
        }
      }
    }
    
    return {
      isPersonalized: true,
      note: 'Email appears to have appropriate personalization'
    }
  }

  /**
   * 🎯 SUBMIT DETECTION CHOICE
   * 
   * Processes student's phishing detection decision and provides educational feedback.
   */
  const submitDetection = (choice: DetectionChoice) => {
    setDetectionChoice(choice)
    
    const correct = choice.isPhishing === currentEmail.isPhishing
    
    // Update statistics
    setStats(prev => {
      const newStats = {
        ...prev,
        emailsAnalyzed: prev.emailsAnalyzed + 1,
        correctDetections: correct ? prev.correctDetections + 1 : prev.correctDetections,
        falsePositives: (!currentEmail.isPhishing && choice.isPhishing) ? prev.falsePositives + 1 : prev.falsePositives,
        falseNegatives: (currentEmail.isPhishing && !choice.isPhishing) ? prev.falseNegatives + 1 : prev.falseNegatives,
        streak: correct ? prev.streak + 1 : 0,
        longestStreak: correct ? Math.max(prev.longestStreak, prev.streak + 1) : prev.longestStreak
      }
      
      newStats.accuracy = (newStats.correctDetections / newStats.emailsAnalyzed) * 100
      
      return newStats
    })
    
    // Show analysis
    setShowingAnalysis(true)
    
    // Check for badge awards
    checkBadgeProgress(correct)
    
    // Provide feedback
    if (correct) {
      toast.success(`🎉 Correct! ${choice.isPhishing ? 'That was indeed phishing!' : 'That email was legitimate!'}`)
    } else {
      toast.error(`🤔 Not quite right. Let's learn from this example!`)
    }
  }

  /**
   * 🏆 BADGE PROGRESS CHECKER
   * 
   * Awards badges based on student performance and learning milestones.
   */
  const checkBadgeProgress = (correct: boolean) => {
    const newBadges: BadgeId[] = []
    
    // First Catch badge
    if (stats.correctDetections === 0 && correct && currentEmail.isPhishing) {
      newBadges.push('first_catch')
    }
    
    // Eagle Eye badge (5 correct in a row)
    if (stats.streak === 4 && correct) {
      newBadges.push('eagle_eye')
    }
    
    // Update badges
    if (newBadges.length > 0) {
      setStats(prev => ({
        ...prev,
        badgesEarned: [...prev.badgesEarned, ...newBadges]
      }))
      
      newBadges.forEach(badge => {
        toast.success(`🏆 Badge Earned: ${DETECTIVE_BADGES[badge].name}!`)
      })
    }
  }

  /**
   * ➡️ NEXT EMAIL HANDLER
   * 
   * Moves to the next email in the detective training sequence.
   */
  const nextEmail = () => {
    const nextIndex = (currentEmailIndex + 1) % EDUCATIONAL_EMAILS.length
    setCurrentEmailIndex(nextIndex)
    setCurrentEmail(EDUCATIONAL_EMAILS[nextIndex])
    setShowingAnalysis(false)
    setDetectionChoice(null)
    setHintsRevealed(0)
    setShowingHints(false)
  }

  /**
   * 💡 HINT SYSTEM
   * 
   * Progressive hints help students learn without giving away answers.
   */
  const revealNextHint = () => {
    if (hintsRevealed < 3) {
      setHintsRevealed(prev => prev + 1)
      setShowingHints(true)
    }
  }

  /**
   * 🎨 RENDER THE PHISHING DETECTIVE INTERFACE
   * 
   * Creates an engaging email client interface for learning!
   */
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      
      {/* 🏢 Detective Agency Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🕵️ Phishing Detective Agency 🕵️
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Train your cyber-detective skills by analyzing suspicious emails!
        </p>
        
        {/* Detective Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-lg p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.emailsAnalyzed}</div>
            <div className="text-sm text-gray-600">Cases Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.accuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.badgesEarned.length}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📧 EMAIL VIEWER */}
        <div className="lg:col-span-2">
          <motion.div 
            key={currentEmail.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            
            {/* Email Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email #{currentEmailIndex + 1} of {EDUCATIONAL_EMAILS.length}
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentEmail.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                  currentEmail.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentEmail.difficultyLevel}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium text-gray-600 w-16">From:</span>
                  <span className="text-gray-800">{currentEmail.sender}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-600 w-16">Time:</span>
                  <span className="text-gray-800">{currentEmail.timestamp}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-600 w-16">Subject:</span>
                  <span className="text-gray-800 font-medium">{currentEmail.subject}</span>
                </div>
              </div>
            </div>
            
            {/* Email Content */}
            <div className="p-6">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {currentEmail.content}
              </div>
            </div>
            
            {/* Detection Interface */}
            {!showingAnalysis && (
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">🤔 What's your detective conclusion?</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <motion.button
                    onClick={() => submitDetection({ isPhishing: true, confidence: 'high', reasoning: 'Detected as phishing' })}
                    className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>🎣 This is PHISHING!</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => submitDetection({ isPhishing: false, confidence: 'high', reasoning: 'Appears legitimate' })}
                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>✅ This is LEGITIMATE</span>
                  </motion.button>
                </div>
                
                {/* Hint System */}
                <div className="text-center">
                  <button
                    onClick={revealNextHint}
                    disabled={hintsRevealed >= 3}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    💡 Need a hint? ({hintsRevealed}/3 used)
                  </button>
                </div>
              </div>
            )}
            
            {/* Analysis Results */}
            {showingAnalysis && detectionChoice && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-6 border-t border-gray-200"
              >
                <div className={`p-4 rounded-lg mb-4 ${
                  (detectionChoice.isPhishing === currentEmail.isPhishing) 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-red-100 border border-red-300'
                }`}>
                  <h3 className="font-semibold text-lg mb-2">
                    {(detectionChoice.isPhishing === currentEmail.isPhishing) 
                      ? '🎉 Correct Detective Work!' 
                      : '🤔 Learning Opportunity!'}
                  </h3>
                  <p className="text-gray-700">
                    This email was {currentEmail.isPhishing ? 'PHISHING' : 'LEGITIMATE'}.
                    {detectionChoice.isPhishing !== currentEmail.isPhishing && 
                      ` Here's what to look for next time:`
                    }
                  </p>
                </div>
                
                {/* Educational Analysis */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">🎓 Learning Points:</h4>
                  
                  {currentEmail.redFlags.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-600 mb-2">🚩 Red Flags Detected:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {currentEmail.redFlags.map((flag, index) => (
                          <li key={index}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h5 className="font-medium text-blue-600 mb-2">📚 Educational Notes:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {currentEmail.educationalNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <motion.button
                    onClick={nextEmail}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next Case 🕵️
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 🔧 DETECTIVE TOOLS PANEL */}
        <div className="space-y-6">
          
          {/* Analysis Tools */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              🔍 Detective Tools
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowingHints(!showingHints)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200"
              >
                Email Analysis Report
              </button>
              
              {showingHints && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 p-4 rounded-lg text-sm"
                >
                  <div className="space-y-2">
                    <div>
                      <strong>Sender Domain:</strong> {checkSenderDomain(currentEmail.sender).explanation}
                    </div>
                    <div>
                      <strong>Urgency Check:</strong> {
                        checkUrgencyTactics(currentEmail.subject, currentEmail.content).hasUrgency 
                          ? '⚠️ Uses urgency tactics' 
                          : '✅ No urgency manipulation'
                      }
                    </div>
                    <div>
                      <strong>Personalization:</strong> {checkPersonalization(currentEmail.content).note}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Progressive Hints */}
          {hintsRevealed > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 rounded-xl shadow-lg p-6 border border-yellow-200"
            >
              <h3 className="text-lg font-semibold mb-4 text-yellow-800">
                💡 Detective Hints
              </h3>
              
              <div className="space-y-3 text-sm">
                {hintsRevealed >= 1 && (
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <strong>Hint 1:</strong> Look carefully at the sender's email address. 
                    Is it from the real company domain?
                  </div>
                )}
                {hintsRevealed >= 2 && (
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <strong>Hint 2:</strong> Check the language in the email. 
                    Does it create urgency or pressure you to act quickly?
                  </div>
                )}
                {hintsRevealed >= 3 && (
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <strong>Hint 3:</strong> Examine any links or requests for action. 
                    Would a legitimate company ask for this information this way?
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Badge Collection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              🏆 Detective Badges
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(DETECTIVE_BADGES) as [BadgeId, typeof DETECTIVE_BADGES[BadgeId]][]).map(([badgeId, badge]) => (
                <div 
                  key={badgeId}
                  className={`p-3 rounded-lg text-center text-sm ${
                    stats.badgesEarned.includes(badgeId)
                      ? 'bg-yellow-100 border-2 border-yellow-400'
                      : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="font-medium">{badge.name}</div>
                  <div className="text-xs text-gray-600">{badge.requirement}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 🎓 EDUCATIONAL NOTES FOR STUDENT DEVELOPERS:
 * 
 * This Phishing Detective game teaches critical cybersecurity skills:
 * 
 * 1. **Pattern Recognition**: Identifying common phishing tactics
 * 2. **Critical Thinking**: Analyzing suspicious elements systematically  
 * 3. **Domain Analysis**: Understanding legitimate vs. malicious URLs
 * 4. **Social Engineering Awareness**: Recognizing emotional manipulation
 * 5. **Verification Habits**: Learning to verify independently
 * 
 * Key Educational Features:
 * - Real phishing examples adapted for learning
 * - Progressive difficulty from beginner to advanced
 * - Immediate feedback with explanations
 * - Badge system for motivation and skill tracking
 * - Analysis tools that mirror real security practices
 * 
 * Try extending this game:
 * - Add more email scenarios from current threats
 * - Create different difficulty modes
 * - Add multiplayer competitions between classrooms
 * - Integrate with real email security tools
 * - Track learning analytics for teachers
 * 
 * Remember: The best defense against phishing is education and awareness! 🛡️🎓
 */
