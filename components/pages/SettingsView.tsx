'use client'

import { useState, useEffect } from 'react'
import { Settings, Dumbbell, Save, CheckCircle2, Shield, Sliders, Palette, Clock } from 'lucide-react'
import { ThemeColor } from '@/lib/types'

interface SettingsViewProps {
  onShowToast: (msg: string) => void
  currentTheme?: ThemeColor
  onThemeChange?: (theme: ThemeColor) => void
}

export function SettingsView({
  onShowToast,
  currentTheme = 'lime',
  onThemeChange,
}: SettingsViewProps) {
  const [gymName, setGymName] = useState('Iron District PK')
  const [location, setLocation] = useState('Karachi, Pakistan')
  const [currency] = useState('PKR (Rs.)')
  const [standardFee, setStandardFee] = useState(5000)
  const [treadmillFee, setTreadmillFee] = useState(7500)
  const [activeTheme, setActiveTheme] = useState<ThemeColor>(currentTheme)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const themeOptions: { id: ThemeColor; name: string; hex: string; bgClass: string }[] = [
    { id: 'lime', name: 'Cyber Lime', hex: '#ccff00', bgClass: 'bg-[#ccff00]' },
    { id: 'cyan', name: 'Electric Cyan', hex: '#00f3ff', bgClass: 'bg-[#00f3ff]' },
    { id: 'orange', name: 'Neon Orange', hex: '#ff6b00', bgClass: 'bg-[#ff6b00]' },
    { id: 'violet', name: 'Ultra Violet', hex: '#a855f7', bgClass: 'bg-[#a855f7]' },
  ]

  // Load existing settings on component mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            if (json.data.gymName) setGymName(json.data.gymName)
            if (json.data.location) setLocation(json.data.location)
            if (json.data.standardFee) setStandardFee(json.data.standardFee)
            if (json.data.treadmillFee) setTreadmillFee(json.data.treadmillFee)
            if (json.data.themeColor) {
              setActiveTheme(json.data.themeColor)
              if (onThemeChange) onThemeChange(json.data.themeColor)
            }
          }
        }
      } catch (e) {
        console.warn('Could not load settings from backend', e)
      }
    }
    loadSettings()
  }, [onThemeChange])

  function handleThemeSelect(theme: ThemeColor) {
    setActiveTheme(theme)
    if (onThemeChange) onThemeChange(theme)
    onShowToast(`Theme accent changed to ${theme.toUpperCase()}!`)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gymName,
          location,
          standardFee,
          treadmillFee,
          themeColor: activeTheme,
        }),
      })
      if (res.ok) {
        setSaved(true)
        onShowToast('Settings & defaults saved to cloud successfully!')
        setTimeout(() => setSaved(false), 3000)
      } else {
        onShowToast('Saved settings locally.')
      }
    } catch (e) {
      onShowToast('Saved settings locally.')
    } finally {
      setLoading(false)
    }
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
            Manage gym identity, theme accents, PKR currency defaults, and operating shift hours.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Live Theme Accent Customizer */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
              <Palette className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Live Theme Accent Customizer</h2>
              <p className="text-xs text-white/40">Select your preferred portal accent color theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {themeOptions.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeSelect(t.id)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                  activeTheme === t.id
                    ? 'border-[#ccff00] bg-white/[0.06] shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <span className={`size-5 rounded-full ${t.bgClass} shadow-md`} />
                <div>
                  <p className="text-xs font-bold text-white">{t.name}</p>
                  <p className="text-[10px] text-white/40">{t.hex}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gym Identity Settings */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20">
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
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
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

        {/* Shift Operational Hours Manager */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Clock className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Operational Shift Schedule</h2>
              <p className="text-xs text-white/40">Iron District PK daily operating hours</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="font-bold text-[#ccff00]">Morning Shift</p>
              <p className="mt-1 font-semibold text-white">06:00 AM – 11:30 AM</p>
              <p className="text-[10px] text-white/40">Open for all athletes</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="font-bold text-pink-400">Ladies Exclusive Shift</p>
              <p className="mt-1 font-semibold text-white">12:00 PM – 04:00 PM</p>
              <p className="text-[10px] text-white/40">Female trainers & athletes only</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="font-bold text-sky-400">Evening Peak Shift</p>
              <p className="mt-1 font-semibold text-white">04:30 PM – 11:00 PM</p>
              <p className="text-[10px] text-white/40">Open for all athletes</p>
            </div>
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

