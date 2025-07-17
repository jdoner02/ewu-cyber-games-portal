'use client';

import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const QuantumEscapeRoom = dynamic(
  () => import('@/games/quantum-mystery-room/QuantumEscapeRoom'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing Quantum Laboratory...</h2>
          <p className="text-violet-200">Preparing temporal stabilization protocols...</p>
        </div>
      </div>
    )
  }
)

export default function QuantumMysteryRoomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Entering Dr. Quantum's Laboratory...</h2>
            <p className="text-violet-200">Prepare for a temporal escape room adventure!</p>
          </div>
        </div>
      }>
        <QuantumEscapeRoom />
      </Suspense>
    </div>
  )
}
