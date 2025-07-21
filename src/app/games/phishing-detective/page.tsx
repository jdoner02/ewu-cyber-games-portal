'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import PhishingDetectiveAgency from './PhishingDetectiveAgency-v2-educational'

/**
 * 🕵️ Phishing Detective Agency - Route Page
 * 
 * Educational phishing detection game that teaches students to identify
 * social engineering attacks and suspicious communications.
 * 
 * Learning Objectives:
 * - Identify suspicious email patterns and red flags
 * - Understand social engineering psychology and tactics
 * - Develop critical thinking for digital communications
 * - Practice safe verification habits for online requests
 * 
 * Game Features:
 * - Interactive email examination with detective tools
 * - Progressive difficulty from obvious to sophisticated attacks
 * - Real-world phishing scenarios based on actual incidents
 * - Achievement system for mastering different scam types
 */

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">🕵️ Loading Detective Agency...</h2>
          <p className="text-slate-400">Preparing your cybersecurity investigation tools</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function PhishingDetectivePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PhishingDetectiveAgency />
    </Suspense>
  )
}
