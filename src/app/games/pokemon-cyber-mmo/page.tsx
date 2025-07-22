'use client';

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const PokemonCyberMMO = dynamic(
  () => import('./PokemonCyberMMO'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Cyber Region...</h2>
          <p className="text-blue-200">Preparing your Pokemon adventure!</p>
        </div>
      </div>
    )
  }
)

export default function PokemonCyberMMOPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Entering the Cyber Region...</h2>
            <p className="text-blue-200">Get ready to become a Cyber Trainer!</p>
          </div>
        </div>
      }>
        <PokemonCyberMMO />
      </Suspense>
    </div>
  )
}
