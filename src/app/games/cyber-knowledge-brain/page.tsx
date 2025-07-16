import { Metadata } from 'next'
import CyberKnowledgeBrainGame from './CyberKnowledgeBrainGame'

export const metadata: Metadata = {
  title: 'Cyber Knowledge Brain | EWU Cyber Games',
  description: 'Collect knowledge creatures, build skill trees, and level up your cybersecurity expertise! A Pokemon-style learning adventure for Cyber Scouts.',
  keywords: [
    'cybersecurity education',
    'GenCyber curriculum',
    'educational games', 
    'skill trees',
    'badges',
    'gamification',
    'knowledge collection',
    'cyber scouts',
    'middle school',
    'twice exceptional'
  ],
}

export default function CyberKnowledgeBrainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <CyberKnowledgeBrainGame />
    </div>
  )
}