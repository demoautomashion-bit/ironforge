'use client'

import { FormEvent } from 'react'
import { X, Dumbbell } from 'lucide-react'
import { Gender, Member, PlanTier } from '@/lib/types'

interface AddMemberDrawerProps {
  open: boolean
  onClose: () => void
  onAddMember: (newMember: Omit<Member, 'id'>) => void
}

export function AddMemberDrawer({ open, onClose, onAddMember }: AddMemberDrawerProps) {
  if (!open) return null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const name = String(form.get('name') || 'New Athlete')
    const phone = String(form.get('phone') || '0300-0000000')
    const gender = String(form.get('gender') || 'Male') as Gender
    const plan = String(form.get('plan') || 'Cardio + Gym') as PlanTier
    const monthlyFee = Number(form.get('fee')) || 6500

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

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
      phone,
      gender,
      plan,
      monthlyFee,
      joinDate: todayStr,
      paymentDate: todayStr,
      status: 'Active',
      color: randomColor,
    })

    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add new gym member"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-all sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Container: Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="w-full max-w-lg rounded-t-3xl border-t border-white/15 bg-[#111513] p-6 shadow-2xl sm:rounded-3xl sm:border border-white/10 animate-in slide-in-from-bottom duration-300">
        {/* Top Handle bar for mobile drag feeling */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
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
          {/* Full Name */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70 sm:col-span-2">
            Full Name
            <input
              name="name"
              required
              placeholder="e.g. Shahzaib Khan"
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60 focus:bg-white/[0.06]"
            />
          </label>

          {/* Gender */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Gender
            <select
              name="gender"
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60 focus:bg-[#111513]"
            >
              <option className="bg-[#111513]">Male</option>
              <option className="bg-[#111513]">Female</option>
            </select>
          </label>

          {/* Phone (Pakistani format) */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Phone Number (PK)
            <input
              name="phone"
              required
              placeholder="0300-1234567"
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60 focus:bg-white/[0.06]"
            />
          </label>

          {/* Membership Plan */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Membership Plan
            <select
              name="plan"
              className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60 focus:bg-[#111513]"
            >
              <option className="bg-[#111513]">Cardio + Gym</option>
              <option className="bg-[#111513]">Basic Gym</option>
              <option className="bg-[#111513]">VIP Personal Training</option>
              <option className="bg-[#111513]">Crossfit Special</option>
            </select>
          </label>

          {/* Monthly Fee in PKR */}
          <label className="grid gap-1.5 text-xs font-bold text-white/70">
            Monthly Fee (PKR)
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#ccff00] text-sm">
                Rs.
              </span>
              <input
                name="fee"
                type="number"
                required
                defaultValue={6500}
                placeholder="6500"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-3.5 text-sm font-extrabold text-white outline-none focus:border-[#ccff00]/60 focus:bg-white/[0.06]"
              />
            </div>
          </label>

          {/* Buttons */}
          <div className="mt-4 flex gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-white/10 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-xl bg-[#ccff00] text-sm font-black text-black shadow-[0_0_20px_rgba(204,255,0,0.2)] transition hover:bg-[#dcff63] active:scale-95"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
