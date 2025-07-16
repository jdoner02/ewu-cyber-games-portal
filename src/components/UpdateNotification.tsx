'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'

interface UpdateNotificationProps {
  version: string
  features: string[]
}

export default function UpdateNotification({ version, features }: UpdateNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if this version was already dismissed
    if (typeof window !== 'undefined') {
      const dismissedVersion = localStorage.getItem('dismissed_update_version')
      if (dismissedVersion === version) {
        return
      }
    }

    // Show notification after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [version])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dismissed_update_version', version)
    }
  }

  if (isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <motion.div
            className="bg-gradient-to-r from-cyan-500 to-purple-600 p-1 rounded-xl shadow-2xl"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(6, 182, 212, 0.5)",
                "0 0 30px rgba(147, 51, 234, 0.5)",
                "0 0 20px rgba(6, 182, 212, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-slate-900 rounded-lg p-6 text-white relative">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <h3 className="font-bold text-lg">New Update v{version}!</h3>
              </div>

              <div className="space-y-2 mb-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="text-sm text-slate-300"
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={handleDismiss}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Awesome! Let&apos;s Play
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}