'use client'

import { X, Dumbbell, Calendar, Phone, Check, ShieldAlert, Trash2, Award, Clock } from 'lucide-react'
import { Member } from '@/lib/types'
import { avatarColors, formatPKR } from '@/lib/mock-data'
import { calculatePaymentStatus } from '@/lib/date-utils'

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

  const { status, daysRemaining, nextDueDate } = calculatePaymentStatus(member.paymentDate)
  const progressPercent = Math.min(100, Math.max(5, Math.round((daysRemaining / 30) * 100)))

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
            <div className={`flex size-14 items-center justify-center rounded-2xl text-base font-black shadow-lg overflow-hidden ${member.photoUrl ? 'border border-white/20 bg-black' : avatarColors[member.color]}`}>
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="size-full object-cover" />
              ) : (
                member.initials
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{member.name}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    status === 'Active'
                      ? 'bg-theme-accent/15 text-theme-accent border border-theme-accent/30'
                      : status === 'Due Soon'
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-rose-400/15 text-rose-400 border border-rose-400/30'
                  }`}
                >
                  {status}
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
        <div className="mb-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1.5 text-white/70">
              <Clock className="size-3.5 text-theme-accent" /> 30-Day Billing Cycle
            </span>
            <span className={status === 'Active' ? 'text-theme-accent' : status === 'Due Soon' ? 'text-amber-300' : 'text-rose-400'}>
              {status === 'Active' ? `${daysRemaining} Days Left` : status === 'Due Soon' ? `Expires in ${daysRemaining} days` : 'Payment Overdue'}
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === 'Active'
                  ? 'bg-gradient-to-r from-theme-accent to-emerald-400 shadow-[0_0_8px_rgba(var(--brand-accent-rgb),0.5)]'
                  : status === 'Due Soon'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-white/40 pt-1">
            <span>Paid: {member.paymentDate}</span>
            <span className="font-bold text-white/70">Next Due: {nextDueDate}</span>
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
            <p className="mt-1 font-extrabold text-theme-accent text-sm">{formatPKR(member.monthlyFee)}</p>
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

        {/* Actions List */}
        <div className="space-y-2">

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
                : 'border-theme-accent/40 bg-theme-accent/10 text-theme-accent hover:bg-theme-accent/20 shadow-[0_0_15px_rgba(var(--brand-accent-rgb),0.15)]'
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
