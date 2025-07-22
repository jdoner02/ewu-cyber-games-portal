'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Users, Shield, BookOpen } from 'lucide-react'

export default function ParentGuidePage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/student-resources/PARENT-GUIDE.md')
        const text = await response.text()
        setContent(text)
      } catch (error) {
        console.error('Failed to load parent guide:', error)
        setContent('# Error Loading Content\n\nPlease try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  // Simple markdown to HTML conversion for basic formatting
  const formatMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-white mb-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-blue-300 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-blue-200 mb-3 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium text-slate-200 mb-2 mt-4">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-blue-200 italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-800 text-green-300 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="text-slate-300 mb-1 ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="text-slate-300 mb-1 ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-slate-300 mb-4 leading-relaxed">')
      .replace(/^(?!<[h|l])/gm, '<p class="text-slate-300 mb-4 leading-relaxed">')
      .replace(/---/g, '<hr class="border-slate-600 my-8">')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Parent Guide...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-blue-400/30">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-blue-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Games</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-white font-semibold">Parent Guide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-8 shadow-2xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              👪 Parent Guide
            </h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Supporting your child's cybersecurity learning journey with research-backed educational games
            </p>
          </div>

          {/* Content */}
          <div 
            className="prose prose-invert prose-blue max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdown(content.replace(/^# 👪 Parent Guide.*?\n\n/, ''))
            }}
          />

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-slate-600">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/student-resources/WELCOME-STUDENTS"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 text-center"
              >
                📚 Student Resources
              </Link>
              <Link 
                href="/docs/LEARNING-SCIENCE"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-center"
              >
                🧠 Learning Science
              </Link>
              <Link 
                href="/"
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 text-center"
              >
                🎮 Start Playing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
