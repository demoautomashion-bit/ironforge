'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dumbbell, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Image as ImageIcon } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        // Successful login, redirect to admin portal dashboard
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
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#00f2fe]/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card Container */}
        <div className="bg-[#11151c]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/80">
          
          {/* ========================================================================= */}
          {/* MOCKED LOGO SECTION (Replace the image or container once asset is ready)  */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative group cursor-pointer mb-4">
              {/* Logo Outer Glow Container */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#ccff00]/20 to-[#18202c] border-2 border-dashed border-[#ccff00]/40 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-[#ccff00] group-hover:scale-105 shadow-lg shadow-[#ccff00]/5">
                
                {/* Visual indicator tag for logo slot */}
                <span className="absolute top-1 text-[9px] font-mono tracking-widest text-[#ccff00] uppercase opacity-80 px-1 bg-black/40 rounded">
                  LOGO SLOT
                </span>

                {/* LOGO IMAGE PLACEHOLDER ICON (Replace with <img> when logo file is provided) */}
                <div className="flex flex-col items-center justify-center mt-2 text-[#ccff00]">
                  <Dumbbell className="size-8 transform -rotate-12 group-hover:scale-110 transition-transform" />
                </div>

                <div className="absolute bottom-1 text-[8px] text-slate-400 font-mono flex items-center gap-0.5">
                  <ImageIcon className="size-2.5 text-[#ccff00]" />
                  <span>Your Logo Here</span>
                </div>
              </div>
            </div>

            {/* Gym Title & Portal Name */}
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 justify-center">
              <span>IRON FORGE</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold flex items-center gap-1">
              <ShieldCheck className="size-3 text-[#ccff00]" /> Admin Portal Access Only
            </p>
          </div>
          {/* ========================================================================= */}

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
                  className="w-full bg-[#18202c]/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
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
                  className="w-full bg-[#18202c]/90 border border-slate-700/80 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
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
              className="w-full mt-2 bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.99] text-black font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-[#ccff00]/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
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
