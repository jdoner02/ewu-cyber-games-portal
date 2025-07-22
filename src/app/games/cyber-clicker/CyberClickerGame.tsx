// CareerClickerGame.tsx
// An educational idle/clicker game for teaching cybersecurity careers to curious middle schoolers.
// Players build a virtual cybersecurity company, hire and promote roles, and learn career pathways.
// The code is heavily commented to explain both what each piece does and why it matters!

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // for smooth animations

// ----------------------------------------
// --- DATA TYPES AND CONFIGURATION ---
// ----------------------------------------

// Define a Role in the company with properties for game logic and educational content
interface CareerRole {
  id: string               // unique key for this role
  name: string             // display name of the role (e.g. "SOC Analyst I")
  tier: number             // career tier (1=entry, 2=mid, 3=advanced)
  baseCost: number         // SP cost to hire one of these
  baseProd: number         // SP/sec production per hired unit
  description: string      // brief tooltip description of the real-world job
  nextRoleId?: string      // id of the role this can be promoted to
}

// Define a NewsItem for the ticker
interface NewsItem {
  id: string               // unique key
  text: string             // headline text
}

// Static list of career roles derived from real cyber career pathways
const ROLE_DEFINITIONS: CareerRole[] = [
  { id: 'soc1', name: 'SOC Analyst I',     tier: 1, baseCost:  50, baseProd:   1, description: 'Monitors security alerts and investigates basic incidents.', nextRoleId: 'soc2' },
  { id: 'sup_spec', name: 'Support Specialist', tier: 1, baseCost:  30, baseProd:   0.5, description: 'Handles helpdesk tickets and basic troubleshooting.', nextRoleId: 'forensics' },
  { id: 'vuln1',   name: 'Vulnerability Analyst', tier: 1, baseCost:  80, baseProd:   1.2, description: 'Runs scans to find security weaknesses.', nextRoleId: 'pentest' },
  { id: 'auditor', name: 'IT Auditor',        tier: 1, baseCost:  70, baseProd:   0.8, description: 'Assesses systems for compliance and controls.', nextRoleId: 'risk_ana' },

  { id: 'soc2',    name: 'SOC Analyst II',    tier: 2, baseCost: 300, baseProd:   5, description: 'Handles complex incidents and fine-tunes defenses.', nextRoleId: 'threat_hunter' },
  { id: 'forensics', name: 'Digital Forensics Analyst', tier: 2, baseCost: 250, baseProd:   4, description: 'Investigates breaches by analyzing evidence.' , nextRoleId: 'ir_lead' },
  { id: 'pentest', name: 'Penetration Tester', tier: 2, baseCost: 400, baseProd:   6, description: 'Simulates attacks to find vulnerabilities.' , nextRoleId: 'redteam' },
  { id: 'risk_ana', name: 'Risk Analyst',      tier: 2, baseCost: 200, baseProd:   3, description: 'Analyzes and mitigates organizational risks.' , nextRoleId: 'sec_mgr' },

  { id: 'threat_hunter', name: 'Threat Hunter',   tier: 3, baseCost:2000, baseProd:  20, description: 'Proactively searches for hidden threats.' , nextRoleId: 'ciso' },
  { id: 'ir_lead', name: 'Incident Response Lead', tier: 3, baseCost:1800, baseProd:  18, description: 'Leads response to major security incidents.' },
  { id: 'redteam', name: 'Red Team Lead',    tier: 3, baseCost:2200, baseProd:  22, description: 'Leads adversary simulation exercises.' },
  { id: 'sec_mgr', name: 'Security Manager', tier: 3, baseCost:1500, baseProd:  15, description: 'Coordinates teams and security programs.' },

  { id: 'ciso',    name: 'CISO',              tier: 4, baseCost: 0,    baseProd:   0, description: 'Chief Information Security Officer: sets strategy and policies.' }
]

// Simple news headlines for the ticker (learn terms casually)
const NEWS_HEADLINES: NewsItem[] = [
  { id: 'n1', text: 'New zero-day exploit discovered – companies rush to patch!' },
  { id: 'n2', text: 'SOC Analysts detect unusual traffic spike.' },
  { id: 'n3', text: 'Pen Testers break into test network – fun exercise!' },
  { id: 'n4', text: 'Risk Analyst identifies critical compliance gap.' },
  { id: 'n5', text: 'Threat Hunter uncovers hidden malware in logs.' },
  { id: 'n6', text: 'Major breach averted by rapid IR team response.' }
]

// ----------------------------------------
// --- MAIN GAME COMPONENT ---
// ----------------------------------------

export default function CareerClickerGame() {
  // --- GAME STATE HOOKS ---
  // Security Points currency
  const [sp, setSp] = useState<number>(0)
  // SP generated per click (base=1)
  const [clickValue, setClickValue] = useState<number>(1)
  // SP per second from employees
  const [spPerSec, setSpPerSec] = useState<number>(0)
  // Hired counts of each role { roleId: count }
  const [hired, setHired] = useState<Record<string, number>>(() => loadState().hired)
  // Current news index for ticker rotation
  const [newsIndex, setNewsIndex] = useState<number>(0)
  // Notification messages (purchase, promotion, events)
  const [notifications, setNotifications] = useState<string[]>([])
  // Codex entries unlocked (roleId => unlocked?)
  const [codex, setCodex] = useState<Record<string, boolean>>(() => loadState().codex)

  // ----------------------------------------
  // --- PERSISTENCE: LOAD & SAVE STATE ---
  // ----------------------------------------
  
  // Define shape of saved state in localStorage
  interface SaveState { sp: number, hired: Record<string, number>, codex: Record<string, boolean> }
  const STORAGE_KEY = 'CareerClickerSave'

  // Load saved state or use defaults
  function loadState(): SaveState {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (json) return JSON.parse(json)
    } catch {
      /* ignore errors */
    }
    // default state: no SP, no hires, codex unlocked for tier1 maybe
    const defaultHired: Record<string, number> = {}
    ROLE_DEFINITIONS.forEach(r => defaultHired[r.id] = 0)
    const defaultCodex: Record<string, boolean> = {}
    ROLE_DEFINITIONS.forEach(r => defaultCodex[r.id] = r.tier === 1)
    return { sp: 0, hired: defaultHired, codex: defaultCodex }
  }

  // Save key parts of state to localStorage whenever sp, hired, or codex change
  useEffect(() => {
    const save: SaveState = { sp, hired, codex }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
  }, [sp, hired, codex])

  // ----------------------------------------
  // --- SP PRODUCTION LOOP (AUTO IDLE) ---
  // ----------------------------------------
  useEffect(() => {
    // calculate total SP/sec whenever hired counts change
    let total = 0
    ROLE_DEFINITIONS.forEach(role => {
      const count = hired[role.id] || 0
      total += role.baseProd * count
    })
    setSpPerSec(total)

    // set up interval to add auto SP
    const interval = setInterval(() => {
      setSp(prev => prev + total)
    }, 1000) // each second
    return () => clearInterval(interval)
  }, [hired])

  // ----------------------------------------
  // --- CLICK HANDLER ---
  // ----------------------------------------
  const handleClick = useCallback(() => {
    // when user clicks the main button, add clickValue SP
    setSp(prev => prev + clickValue)
    // show a quick notification (+1) or animation if desired
    // (omitted for brevity)
  }, [clickValue])

  // ----------------------------------------
  // --- HIRING AND PROMOTION LOGIC ---
  // ----------------------------------------
  
  // hireRole: buy one unit of an entry-level role
  function hireRole(role: CareerRole) {
    const cost = Math.floor(role.baseCost * Math.pow(1.15, hired[role.id]))
    if (sp < cost) return // not enough SP
    setSp(prev => prev - cost)
    setHired(prev => ({ ...prev, [role.id]: prev[role.id] + 1 }))
    showNotification(`Hired 1 ${role.name}!`)
    unlockCodex(role.id)
  }

  // promoteRole: convert one unit of role into next tier
  function promoteRole(role: CareerRole) {
    if (!role.nextRoleId) return // can't promote further
    if (hired[role.id] < 1) return // none to promote
    const cost = Math.floor(role.baseCost * 2 * role.tier) // promotion cost heuristic
    if (sp < cost) return
    setSp(prev => prev - cost)
    // decrement old and increment new
    setHired(prev => ({
      ...prev,
      [role.id]: prev[role.id] - 1,
      [role.nextRoleId!]: prev[role.nextRoleId!] + 1
    }))
    showNotification(`Promoted 1 ${role.name} → ${getRole(role.nextRoleId!).name}!`)
    unlockCodex(role.nextRoleId!)
  }

  // unlockCodex: mark a role's codex entry as unlocked
  function unlockCodex(roleId: string) {
    setCodex(prev => ({ ...prev, [roleId]: true }))
  }

  // getRole helper by id
  function getRole(id: string) {
    return ROLE_DEFINITIONS.find(r => r.id === id)!
  }

  // ----------------------------------------
  // --- NEWS TICKER LOGIC ---
  // ----------------------------------------
  useEffect(() => {
    // rotate headline every 5 seconds
    const timeout = setTimeout(() => {
      setNewsIndex((i) => (i + 1) % NEWS_HEADLINES.length)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [newsIndex])

  // ----------------------------------------
  // --- NOTIFICATIONS (TOASTS) ---
  // ----------------------------------------
  function showNotification(msg: string) {
    setNotifications(prev => [...prev, msg])
    // remove after 3s
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 3000)
  }

  // ----------------------------------------
  // --- RENDERING UI SECTIONS ---
  // ----------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with game title */}
      <header className="p-4 bg-blue-800 text-center">
        <h1 className="text-3xl font-bold">Cybersecurity Career Clicker</h1>
        <p className="text-sm">Build your cyber firm and explore career paths!</p>
      </header>

      {/* Notifications (simple stack) */}
      <div className="fixed top-4 right-4 space-y-2">
        <AnimatePresence>
          {notifications.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className="bg-green-500 text-black px-4 py-2 rounded shadow"
            >{msg}</motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Left: Clicker Button and Stats */}
        <div className="col-span-2 space-y-4">
          {/* Stats panel */}
          <div className="bg-gray-800 p-4 rounded grid grid-cols-2 gap-4">
            {/* SP display */}
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.floor(sp)}</div>
              <div className="text-sm">Security Points (SP)</div>
            </div>
            {/* SP/sec display */}
            <div className="text-center">
              <div className="text-2xl font-bold">{spPerSec.toFixed(1)}</div>
              <div className="text-sm">SP per sec</div>
            </div>
          </div>

          {/* Clicker button */}
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-8 rounded text-2xl font-bold shadow-lg"
          >
            DEFEND (+{clickValue} SP)
          </button>

          {/* News ticker */}
          <div className="bg-gray-800 p-2 rounded">
            <span className="font-semibold">News:</span> {NEWS_HEADLINES[newsIndex].text}
          </div>
        </div>

        {/* Right: Roles and Codex Tabs */}
        <div className="space-y-4">
          {/* Hire / Promote Panel */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="font-bold mb-2">Hire & Promote</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ROLE_DEFINITIONS.map(role => {
                // only show entry roles or unlocked by codex
                if (role.tier > 1 && !codex[role.id]) return null
                const count = hired[role.id] || 0
                const cost = Math.floor(role.baseCost * Math.pow(1.15, count))
                return (
                  <div key={role.id} className="flex justify-between items-center">
                    {/* Role info */}
                    <div>
                      <div className="font-semibold">{role.name} (x{count})</div>
                      <div className="text-xs">{role.description}</div>
                    </div>
                    {/* Hire vs Promote */}
                    <div className="space-x-2">
                      {/* Hire button for tier1 */}
                      {role.tier === 1 && (
                        <button
                          onClick={() => hireRole(role)}
                          disabled={sp < cost}
                          className="px-2 py-1 bg-green-600 rounded disabled:opacity-50"
                        >Hire {cost} SP</button>
                      )}
                      {/* Promote button if nextRole exists */}
                      {role.nextRoleId && count > 0 && (
                        <button
                          onClick={() => promoteRole(role)}
                          className="px-2 py-1 bg-yellow-600 rounded"
                        >Promote</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Codex / Career Library */}
          <div className="bg-gray-800 p-4 rounded max-h-64 overflow-y-auto">
            <h2 className="font-bold mb-2">Career Codex</h2>
            {ROLE_DEFINITIONS.map(role => codex[role.id] && (
              <div key={role.id} className="mb-2 border-b border-gray-600 pb-1">
                <div className="font-semibold">{role.name}</div>
                <div className="text-xs">Level {role.tier} career</div>
                <div className="text-xs italic">{role.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
