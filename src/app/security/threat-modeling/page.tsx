'use client'

import STRIDEThreatModeler from '@/security/threat-modeling/STRIDEThreatModeler'

export default function ThreatModelingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <STRIDEThreatModeler />
    </div>
  )
}
