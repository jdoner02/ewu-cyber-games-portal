'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Brain, BookOpen, Lightbulb, Target } from 'lucide-react'

export default function LearningSciencePage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/docs/LEARNING-SCIENCE.md')
        const text = await response.text()
        setContent(text)
      } catch (error) {
        console.error('Failed to load learning science content:', error)
        setContent('# Error Loading Content\n\nPlease try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  // Enhanced markdown to HTML conversion for educational content
  const formatMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-white mb-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-green-300 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-green-200 mb-3 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium text-slate-200 mb-2 mt-4">$1</h4>')
      .replace(/\*\*The Problem:\*\* (.*?)(?=\n)/g, '<div class="bg-red-900/30 border border-red-400/30 rounded-lg p-4 mb-4"><strong class="text-red-300">🚨 The Problem:</strong> <span class="text-slate-200">$1</span></div>')
      .replace(/\*\*Our Solution:\*\* (.*?)(?=\n)/g, '<div class="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 mb-4"><strong class="text-blue-300">💡 Our Solution:</strong> <span class="text-slate-200">$1</span></div>')
      .replace(/\*\*Why This Works:\*\*/g, '<div class="bg-green-900/30 border border-green-400/30 rounded-lg p-4 mb-4"><strong class="text-green-300">✅ Why This Works:</strong>')
      .replace(/\*\*The Principle:\*\* (.*?)(?=\n)/g, '<div class="bg-purple-900/30 border border-purple-400/30 rounded-lg p-4 mb-4"><strong class="text-purple-300">📚 The Principle:</strong> <span class="text-slate-200">$1</span></div>')
      .replace(/```typescript([\s\S]*?)```/g, '<div class="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-4 overflow-x-auto"><pre class="text-green-300 text-sm"><code>$1</code></pre></div>')
      .replace(/```([\s\S]*?)```/g, '<div class="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-4 overflow-x-auto"><pre class="text-blue-300 text-sm"><code>$1</code></pre></div>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-green-200 italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-800 text-cyan-300 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^- \*\*(.*?):\*\* (.*$)/gm, '<li class="text-slate-300 mb-2 ml-4"><strong class="text-green-300">$1:</strong> $2</li>')
      .replace(/^- (.*$)/gm, '<li class="text-slate-300 mb-1 ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="text-slate-300 mb-1 ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-slate-300 mb-4 leading-relaxed">')
      .replace(/^(?!<[h|l|d])/gm, '<p class="text-slate-300 mb-4 leading-relaxed">')
      .replace(/---/g, '<hr class="border-slate-600 my-8">')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Learning Science Documentation...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-green-400/30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-green-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Games</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Learning Science</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-green-400/30 p-8 shadow-2xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              🧠 Learning Science Behind the Code
            </h1>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              Research-backed design principles that make cybersecurity education effective and engaging
            </p>
          </div>

          {/* Educational Value Notice */}
          <div className="bg-green-900/20 border border-green-400/30 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <BookOpen className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-300 mb-2">🎓 For Educators & Researchers</h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  This documentation explains the pedagogical foundations behind our cybersecurity games. 
                  Each design decision is grounded in peer-reviewed educational research and learning science.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-invert prose-green max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdown(content.replace(/^# 🧠 Learning Science Behind the Code.*?\n\n/, ''))
            }}
          />

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-slate-600">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/student-resources/PARENT-GUIDE"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-center"
              >
                👪 Parent Guide
              </Link>
              <Link 
                href="/educator-resources"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 text-center"
              >
                📚 Educator Resources
              </Link>
              <Link 
                href="/"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-center"
              >
                🎮 Try the Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
