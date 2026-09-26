'use client'

import { FormEvent, useState, useRef } from 'react'
import { X, Dumbbell, Camera, Upload, Trash2, User } from 'lucide-react'
import { Gender, Member, PlanTier } from '@/lib/types'
import { compressImageToWebP } from '@/lib/image-utils'

interface AddMemberDrawerProps {
  open: boolean
  onClose: () => void
  onAddMember: (newMember: Omit<Member, 'id'>) => void
  standardFee?: number
  treadmillFee?: number
}

export function AddMemberDrawer({
  open,
  onClose,
  onAddMember,
  standardFee = 5000,
  treadmillFee = 7500,
}: AddMemberDrawerProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('Standard Gym')
  const [fee, setFee] = useState<number>(standardFee)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  function handlePlanChange(newPlan: PlanTier) {
    setSelectedPlan(newPlan)
    if (newPlan === 'Standard Gym') {
      setFee(standardFee)
    } else {
      setFee(treadmillFee)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setCompressing(true)
      const webpDataUrl = await compressImageToWebP(file, 250, 0.8)
      setPhotoUrl(webpDataUrl)
    } catch (err) {
      console.error('Image compression failed', err)
    } finally {
      setCompressing(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const name = String(form.get('name') || 'New Athlete').trim()
    const phoneInput = String(form.get('phone') || '').trim()
    const gender = String(form.get('gender') || 'Male') as Gender
    const plan = selectedPlan
    const monthlyFee = Number(form.get('fee')) || (plan === 'Standard Gym' ? standardFee : treadmillFee)

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'NA'

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })

    const colors: Member['color'][] = ['lime', 'blue', 'violet', 'orange', 'pink', 'cyan']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    onAddMember({
      name,
      initials,
      phone: phoneInput || undefined,
      gender,
      plan,
      monthlyFee,
      joinDate: todayStr,
      paymentDate: todayStr,
      status: 'Active',
      color: randomColor,
      photoUrl: photoUrl || undefined,
    })

    // Reset photo state
    setPhotoUrl(null)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add new gym member"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-all sm:items-center p-0 sm:p-4 animate-in fade-in duration-300 ease-out"
    >
      {/* Container: Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="w-full max-w-lg rounded-t-3xl border-t border-white/15 bg-[#111513] p-6 shadow-2xl sm:rounded-3xl sm:border border-white/10 animate-in slide-in-from-bottom duration-300 ease-out will-change-transform max-h-[90vh] overflow-y-auto">
        {/* Top Handle bar for mobile drag feeling */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-theme-accent/15 text-theme-accent border border-theme-accent/30">
              <Dumbbell className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Add New Member</h2>
              <p className="text-xs text-white/40">Register athlete profile & set PKR fee plan.</p>
            </div>
          </div>
          <button
            aria-label="Close dialog"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {/* Member Photo Avatar Picker */}
          <div className="sm:col-span-2 flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="size-20 rounded-full border-2 border-theme-accent/40 bg-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-theme-accent transition shadow-lg relative"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/40 group-hover:text-theme-accent transition">
                    <User className="size-8" />
                  </div>
                )}
                
                {compressing && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="size-5 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 size-7 rounded-full bg-theme-accent text-theme-btn flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
                title="Upload Photo"
              >
                <Camera className="size-4" />
              </button>
            </div>

            <div className="mt-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-theme-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="size-3" />
                  <span>{photoUrl ? 'Change Photo' : 'Upload Member Photo'}</span>
                </button>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-white/40 mt-1">Auto-compressed WebP avatar (~15 KB)</p>
            </div>
          </div>

          {/* Full Name */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70 sm:col-span-2">
            Full Name *
            <input
              name="name"
              required
              placeholder="e.g. Shahzaib Khan"
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-theme-accent/60 focus:bg-white/[0.06] transition"
            />
          </label>

          {/* Gender */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Gender
            <select
              name="gender"
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-theme-accent/60 focus:bg-[#111513] transition"
            >
              <option className="bg-[#111513]">Male</option>
              <option className="bg-[#111513]">Female</option>
            </select>
          </label>

          {/* Phone (Optional) */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Phone Number <span className="text-white/40 font-normal">(Optional)</span>
            <input
              name="phone"
              placeholder="0300-1234567"
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-theme-accent/60 focus:bg-white/[0.06] transition"
            />
          </label>

          {/* Membership Plan (2 options) */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Membership Plan
            <select
              name="plan"
              value={selectedPlan}
              onChange={(e) => handlePlanChange(e.target.value as PlanTier)}
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-theme-accent/60 focus:bg-[#111513] transition"
            >
              <option value="Standard Gym" className="bg-[#111513]">Standard Gym</option>
              <option value="Treadmill Pro" className="bg-[#111513]">Treadmill Pro</option>
            </select>
          </label>

          {/* Monthly Fee in PKR */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Monthly Fee (PKR)
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-theme-accent text-sm">
                Rs.
              </span>
              <input
                name="fee"
                type="number"
                required
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                placeholder={String(standardFee)}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-3.5 text-sm font-extrabold text-white outline-none focus:border-theme-accent/60 focus:bg-white/[0.06] transition"
              />
            </div>
          </label>

          {/* Buttons */}
          <div className="mt-4 flex gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-white/10 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white active:scale-98"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-xl bg-theme-accent text-sm font-black text-theme-btn shadow-[0_0_20px_rgba(var(--brand-accent-rgb),0.2)] transition hover:bg-theme-accent-hover active:scale-95"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
