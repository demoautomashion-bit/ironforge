'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { ThemeColor } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [themeColor, setThemeColor] = useState<ThemeColor>('lime')

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data?.themeColor) {
            setThemeColor(json.data.themeColor)
            document.documentElement.setAttribute('data-theme', json.data.themeColor)
          }
        }
      } catch (e) {}
    }
    loadTheme()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push('/')
        router.refresh()
      } else {
        setError(data.message || 'Invalid admin credentials')
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-theme={themeColor} className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-theme-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-theme-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card Container */}
        <div className="bg-[#11151c]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/80">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative group cursor-pointer mb-4">
              {/* Logo Outer Glow Container */}
              <div className="w-24 h-24 rounded-2xl border-2 border-theme-accent/60 bg-black flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-theme-accent group-hover:scale-105 shadow-[0_0_30px_rgba(var(--brand-accent-rgb),0.25)]">
                <img 
                  src="/ironforge.jpeg" 
                  alt="Iron Forge Logo" 
                  className="size-full object-contain p-2 transition-transform duration-300 group-hover:scale-110" 
                  onError={(e) => {
                    // Fallback to stylized SVG dumbbell icon if image fails
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>

            {/* Gym Title & Portal Name */}
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 justify-center">
              <span>IRON FORGE</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold flex items-center gap-1">
              <ShieldCheck className="size-3 text-theme-accent" /> Admin Portal Access Only
            </p>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="size-2 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="size-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ironforge.pk"
                  className="w-full bg-[#18202c]/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="size-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#18202c]/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-theme-accent hover:bg-theme-accent-hover text-theme-btn font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-[rgba(var(--brand-accent-rgb),0.2)] flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Admin...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Info Tip */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-500 font-mono">
              Iron Forge • Restricted Authorized Access
            </p>
          </div>

        </div>

        {/* Footer Credit */}
        <p className="text-center text-xs text-slate-600 mt-6 font-mono">
          Iron Forge Gym Management System v1.0
        </p>
      </div>
    </div>
  )
}
