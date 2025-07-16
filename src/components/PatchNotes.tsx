'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gamepad2, Shield, Zap, Star, Bug, Heart } from 'lucide-react'

interface PatchNote {
  version: string
  date: string
  type: 'feature' | 'improvement' | 'bugfix' | 'security'
  title: string
  description: string
  icon: string
}

const PATCH_NOTES: PatchNote[] = [
  {
    version: "v1.3.0",
    date: "July 16, 2025",
    type: "feature",
    title: "🎮 Cookie Clicker-Style Persistence",
    description: "Your progress now persists across browser sessions! Every click, every achievement, every game completion is remembered. Just like Cookie Clicker, your cyber journey continues exactly where you left off.",
    icon: "🍪"
  },
  {
    version: "v1.3.0", 
    date: "July 16, 2025",
    type: "improvement",
    title: "🚀 Next.js 15 Compatibility",
    description: "Upgraded to the latest Next.js 15 with improved performance and better mobile experience. Pages load faster and the site works better on all devices.",
    icon: "⚡"
  },
  {
    version: "v1.3.0",
    date: "July 16, 2025", 
    type: "security",
    title: "🔒 Enhanced Security Systems",
    description: "Implemented enterprise-grade security with encrypted data storage and COPPA compliance for educational environments. Your data is safer than ever!",
    icon: "🛡️"
  },
  {
    version: "v1.3.0",
    date: "July 16, 2025",
    type: "bugfix", 
    title: "🐛 Infrastructure Fixes",
    description: "Fixed various server-side rendering issues and improved build reliability. The site should now load consistently for all users.",
    icon: "🔧"
  }
]

interface PatchNotesProps {
  isOpen: boolean
  onClose: () => void
}

export default function PatchNotes({ isOpen, onClose }: PatchNotesProps) {
  const getTypeIcon = (type: PatchNote['type']) => {
    switch (type) {
      case 'feature': return <Star className="w-4 h-4 text-yellow-400" />
      case 'improvement': return <Zap className="w-4 h-4 text-blue-400" />
      case 'security': return <Shield className="w-4 h-4 text-green-400" />
      case 'bugfix': return <Bug className="w-4 h-4 text-red-400" />
      default: return <Gamepad2 className="w-4 h-4 text-purple-400" />
    }
  }

  const getTypeColor = (type: PatchNote['type']) => {
    switch (type) {
      case 'feature': return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
      case 'improvement': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30'
      case 'security': return 'from-green-500/20 to-emerald-500/20 border-green-400/30'
      case 'bugfix': return 'from-red-500/20 to-pink-500/20 border-red-400/30'
      default: return 'from-purple-500/20 to-pink-500/20 border-purple-400/30'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-cyan-400/30 max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Patch Notes</h2>
                    <p className="text-slate-400 text-sm">What's New in Cyber Games Portal</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {PATCH_NOTES.map((note, index) => (
                  <motion.div
                    key={`${note.version}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl bg-gradient-to-r ${getTypeColor(note.type)} border`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center">
                        {getTypeIcon(note.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{note.icon}</span>
                          <h3 className="font-semibold text-white">{note.title}</h3>
                          <span className="text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded-full">
                            {note.version}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{note.description}</p>
                        <p className="text-xs text-slate-500">{note.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <div>
                    <h3 className="font-semibold text-white">Enjoying the updates?</h3>
                    <p className="text-slate-300 text-sm">
                      Your feedback helps us make the portal even better! Let your instructors know what you think.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
