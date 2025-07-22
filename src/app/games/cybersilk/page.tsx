import { Metadata } from 'next'
import CyberSilkGame from './CyberSilkGame'

export const metadata: Metadata = {
  title: 'CyberSilk - Network Art Visualization | EWU Cyber Games',
  description: 'Learn network security through interactive art and data visualization. A creative approach to understanding network patterns and data flow.',
  keywords: [
    'network visualization',
    'data art',
    'cybersecurity education',
    'interactive visualization',
    'network patterns',
    'creative learning',
    'data flow analysis',
    'network security',
    'visual education'
  ],
}

export default function CyberSilkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <CyberSilkGame />
    </div>
  )
}
