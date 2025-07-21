'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import NetworkDefenseTower from './NetworkDefenseTower-v2-educational'

/**
 * 🏰 Network Defense Tower - Route Page
 * 
 * Educational tower defense game teaching network security concepts
 * through strategic defense placement and real-time threat analysis.
 * 
 * Learning Objectives:
 * - Understand network security architecture and layered defenses
 * - Learn about different types of cyber attacks and countermeasures
 * - Practice strategic thinking for security infrastructure design
 * - Develop understanding of firewall rules and network monitoring
 * 
 * Game Features:
 * - Interactive tower defense with cybersecurity themes
 * - Progressive waves representing different attack methodologies
 * - Educational tooltips explaining real security technologies
 * - Achievement system for mastering various defense strategies
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
          className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">🏰 Building Defense Systems...</h2>
          <p className="text-slate-400">Initializing network security protocols</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function NetworkDefensePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NetworkDefenseTower />
    </Suspense>
  )
}
