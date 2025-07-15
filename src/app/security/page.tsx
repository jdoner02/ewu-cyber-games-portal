import SecurityDashboard from '@/components/SecurityDashboard'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto">
        <SecurityDashboard className="w-full" />
      </div>
    </div>
  )
}
