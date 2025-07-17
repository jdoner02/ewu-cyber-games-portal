'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  Star, 
  Book, 
  Code, 
  Shield, 
  Zap,
  ExternalLink,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

/**
 * 🚀 PLATFORM UPDATE NOTIFICATION COMPONENT
 * 
 * 🎯 PURPOSE: Inform students about exciting new features and improvements
 * 
 * 🧠 EDUCATIONAL DESIGN:
 * - Growth mindset language: Emphasizes learning and exploration
 * - Confidence building: "Made for you" messaging throughout
 * - Clear benefits: Shows how updates help student learning
 * - Curiosity-driven: Encourages exploration of new features
 */

interface UpdateFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  studentBenefit: string;
  color: string;
}

const platformUpdates: UpdateFeature[] = [
  {
    icon: <Book className="w-6 h-6" />,
    title: "Student Explorer Guide",
    description: "New confidence-building roadmap for exploring the codebase",
    studentBenefit: "Navigate complex code without feeling overwhelmed",
    color: "text-blue-500"
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Learning Science Documentation", 
    description: "See the research behind every game and learning feature",
    studentBenefit: "Understand WHY things were designed the way they were",
    color: "text-purple-500"
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Enhanced Code Comments",
    description: "Educational explanations in every major component",
    studentBenefit: "Learn professional techniques while exploring",
    color: "text-green-500"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Real Security Techniques",
    description: "See actual methods used by cybersecurity professionals",
    studentBenefit: "Connect learning to real-world career skills",
    color: "text-red-500"
  }
];

export default function PlatformUpdateNotification() {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 right-4 z-50 max-w-md"
      >
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl shadow-xl p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Platform Update v2.1.0</h3>
                <p className="text-sm text-gray-600">Enhanced for student exploration!</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>

          {/* Quick highlights */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">New Student Explorer Guide added</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Research explanations for every feature</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Enhanced educational code comments</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {showDetails ? 'Hide Details' : 'What\'s New?'}
            </button>
            <a
              href="/docs/STUDENT-EXPLORER-GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Detailed view */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-blue-200"
              >
                <h4 className="font-semibold text-gray-900 mb-3">🎯 What This Means for You</h4>
                <div className="space-y-3">
                  {platformUpdates.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`${feature.color} mt-1`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{feature.title}</h5>
                        <p className="text-xs text-gray-600 mb-1">{feature.description}</p>
                        <p className="text-xs font-medium text-blue-600">✨ {feature.studentBenefit}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">🎪 Remember:</p>
                  <p className="text-sm text-gray-700">
                    This entire platform was built FOR curious students like you. 
                    Every update makes it easier to explore, learn, and build confidence in cybersecurity!
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <a
                    href="/public/PLATFORM-UPDATE-v2.1.0.md"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Full Release Notes
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
