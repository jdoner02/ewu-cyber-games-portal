'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import EncryptionEscapeRoom from './EncryptionEscapeRoom-v2-educational'

/**
 * 🔐 Encryption Escape Room - Route Page
 * 
 * Educational cryptography game where students escape digital puzzles
 * by mastering encryption and decryption techniques.
 * 
 * Learning Objectives:
 * - Understand fundamental cryptography concepts and terminology
 * - Learn about different cipher types from historical to modern
 * - Practice mathematical thinking required for encryption algorithms
 * - Develop appreciation for data protection and privacy technologies
 * 
 * Game Features:
 * - Progressive escape room puzzles with increasing complexity
 * - Hands-on experience with various cipher techniques
 * - Interactive cryptography tools and educational explanations
 * - Achievement system for mastering different encryption methods
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
          className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">🔐 Initializing Escape Room...</h2>
          <p className="text-slate-400">Generating cryptographic puzzles and ciphers</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function EncryptionEscapePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EncryptionEscapeRoom />
    </Suspense>
  )
}
