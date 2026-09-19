'use client'

import { useState } from 'react'
import { Settings, Dumbbell, Save, CheckCircle2, Shield, Sliders } from 'lucide-react'

interface SettingsViewProps {
  onShowToast: (msg: string) => void
}

export function SettingsView({ onShowToast }: SettingsViewProps) {
  const [gymName, setGymName] = useState('Iron District PK')
  const [location, setLocation] = useState('Karachi, Pakistan')
  const [currency, setCurrency] = useState('PKR (Rs.)')
  const [standardFee, setStandardFee] = useState(5000)
  const [treadmillFee, setTreadmillFee] = useState(7500)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    onShowToast('Settings saved successfully!')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-[#ccff00]" />
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Portal & Gym Settings
            </h1>
          </div>
          <p className="mt-1 text-xs text-white/50 sm:text-sm">
            Manage gym identity, PKR currency defaults, membership plan rates, and admin profile.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gym Identity Settings */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
              <Dumbbell className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Gym Branding & Identity</h2>
              <p className="text-xs text-white/40">Portal header display details</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold text-white/70">
              Gym Name
              <input
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60 transition"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-bold text-white/70">
              City / Location
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60 transition"
              />
            </label>
          </div>
        </div>

        {/* Plan Pricing Configuration */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20">
              <Sliders className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Default Plan Pricing (PKR)</h2>
              <p className="text-xs text-white/40">Default rates auto-assigned when adding new members</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold text-white/70">
              Standard Gym Monthly Fee
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#ccff00] text-sm">
                  Rs.
                </span>
                <input
                  type="number"
                  value={standardFee}
                  onChange={(e) => setStandardFee(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-3.5 text-sm font-extrabold text-white outline-none focus:border-[#ccff00]/60 transition"
                />
              </div>
            </label>

            <label className="grid gap-1.5 text-xs font-bold text-white/70">
              Treadmill Pro Monthly Fee
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#ccff00] text-sm">
                  Rs.
                </span>
                <input
                  type="number"
                  value={treadmillFee}
                  onChange={(e) => setTreadmillFee(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-3.5 text-sm font-extrabold text-white outline-none focus:border-[#ccff00]/60 transition"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Currency & Security */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400 border border-violet-400/20">
              <Shield className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">System Defaults</h2>
              <p className="text-xs text-white/40">Regional currency & access</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold text-white/70">
              System Currency
              <input
                type="text"
                disabled
                value={currency}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 text-sm font-normal text-white/50 cursor-not-allowed"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-bold text-white/70">
              Admin Access Level
              <input
                type="text"
                disabled
                value="Super Admin (Full Access)"
                className="h-11 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 text-sm font-normal text-white/50 cursor-not-allowed"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex h-11 items-center gap-2 rounded-xl bg-[#ccff00] px-6 text-sm font-black text-black shadow-[0_0_20px_rgba(204,255,0,0.2)] transition hover:bg-[#dcff63] active:scale-95"
          >
            {saved ? <CheckCircle2 className="size-4 stroke-[3]" /> : <Save className="size-4 stroke-[3]" />}
            <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
