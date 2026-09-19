'use client'

import { X, Dumbbell, Calendar, Phone, Check, ShieldAlert, Trash2, Award, Clock } from 'lucide-react'
import { Member } from '@/lib/types'
import { avatarColors, formatPKR } from '@/lib/mock-data'

interface AthleteProfileDrawerProps {
  member: Member | null
  onClose: () => void
  onMarkPaid: (id: string) => void
  onDeleteMember: (id: string) => void
  onOpenReceipt: (member: Member) => void
}

export function AthleteProfileDrawer({
  member,
  onClose,
  onMarkPaid,
  onDeleteMember,
  onOpenReceipt,
}: AthleteProfileDrawerProps) {
  if (!member) return null

  const planPerks =
    member.plan === 'Treadmill Pro'
      ? ['Full Weight Room & Machines', 'Unlimited Treadmill Zone Access', 'Locker & Shower Access', 'Free Fitness Assessment']
      : ['Full Weight Room & Machines', 'Dumbbell & Resistance Area', 'Locker Room Access']

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Athlete profile detail view"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-all p-0 sm:p-4 sm:items-center animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-t-3xl border-t border-white/15 bg-[#111513] p-6 shadow-2xl sm:rounded-3xl sm:border border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        {/* Mobile handle indicator */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        {/* Top Header */}
        <div className="mb-6 flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3.5">
            <div className={`flex size-14 items-center justify-center rounded-2xl text-base font-black shadow-lg ${avatarColors[member.color]}`}>
              {member.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{member.name}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    member.status === 'Active'
                      ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30'
                      : member.status === 'Due Soon'
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-rose-400/15 text-rose-400 border border-rose-400/30'
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-white/50">{member.gender} Athlete • Member ID #{member.id}</p>
            </div>
          </div>
          <button
            aria-label="Close sheet"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Expiry Progress Bar Widget */}
        <div className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
          <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span className="flex items-center gap-1.5 text-white/70">
              <Clock className="size-3.5 text-[#ccff00]" /> Membership Expiry Cycle
            </span>
            <span className={member.status === 'Active' ? 'text-[#ccff00]' : member.status === 'Due Soon' ? 'text-amber-300' : 'text-rose-400'}>
              {member.status === 'Active' ? 'Active Membership' : member.status === 'Due Soon' ? 'Expires in 4 days' : 'Overdue Dues'}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                member.status === 'Active'
                  ? 'bg-gradient-to-r from-[#ccff00] to-emerald-400 shadow-[0_0_8px_#ccff00]'
                  : member.status === 'Due Soon'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: member.status === 'Active' ? '85%' : member.status === 'Due Soon' ? '25%' : '5%' }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-5 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-[10px] uppercase font-bold text-white/40">Membership Plan</span>
            <p className="mt-1 font-extrabold text-white">{member.plan}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-[10px] uppercase font-bold text-white/40">Monthly Dues (PKR)</span>
            <p className="mt-1 font-extrabold text-[#ccff00] text-sm">{formatPKR(member.monthlyFee)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-[10px] uppercase font-bold text-white/40">Phone Number</span>
            <p className="mt-1 font-semibold text-white font-mono text-xs">
              {member.phone ? member.phone : <span className="text-white/30 italic font-sans">N/A</span>}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-[10px] uppercase font-bold text-white/40">Join Date</span>
            <p className="mt-1 font-semibold text-white">{member.joinDate}</p>
          </div>
        </div>

        {/* Plan Perks Included */}
        <div className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="mb-2.5 flex items-center gap-2 text-xs font-bold text-white">
            <Award className="size-4 text-[#ccff00]" /> Included Tier Benefits
          </p>
          <div className="space-y-1.5 text-xs text-white/70">
            {planPerks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="size-3.5 text-[#ccff00]" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions List */}
        <div className="space-y-2">
          {/* Digital Receipt Trigger */}
          <button
            onClick={() => {
              onOpenReceipt(member)
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 py-3 text-xs font-bold text-sky-400 transition hover:bg-sky-400/20 active:scale-95"
          >
            <Dumbbell className="size-4" />
            <span>Generate Digital PKR Receipt</span>
          </button>

          {/* Mark Fee Paid */}
          <button
            onClick={() => {
              onMarkPaid(member.id)
              onClose()
            }}
            disabled={member.status === 'Active'}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition active:scale-95 ${
              member.status === 'Active'
                ? 'border-white/10 bg-white/[0.04] text-white/30 cursor-not-allowed'
                : 'border-[#ccff00]/40 bg-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00]/20 shadow-[0_0_15px_rgba(204,255,0,0.15)]'
            }`}
          >
            <Check className="size-4" />
            <span>{member.status === 'Active' ? 'Fee Already Paid' : 'Mark PKR Fee Paid'}</span>
          </button>

          {/* Delete Member */}
          <button
            onClick={() => {
              onDeleteMember(member.id)
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/15 active:scale-95"
          >
            <Trash2 className="size-4" />
            <span>Remove Athlete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
