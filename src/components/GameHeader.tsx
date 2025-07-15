'use client'

import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface GameHeaderProps {
  gameTitle: string
  showBackButton?: boolean
}

export default function GameHeader({ gameTitle, showBackButton = true }: GameHeaderProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-cyan-400/20"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Portal</span>
                </motion.button>
              </Link>
            )}
            <h1 className="text-xl font-bold text-white">{gameTitle}</h1>
          </div>
          
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 hover:border-cyan-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
