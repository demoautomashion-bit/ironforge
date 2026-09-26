'use client'

import { X, Check, Trash2, Phone, Calendar, Dumbbell, ShieldAlert } from 'lucide-react'
import { Member } from '@/lib/types'
import { avatarColors, formatPKR } from '@/lib/mock-data'

interface MemberActionSheetProps {
  member: Member | null
  onClose: () => void
  onMarkPaid: (id: string) => void
  onDeleteMember: (id: string) => void
}

export function MemberActionSheet({
  member,
  onClose,
  onMarkPaid,
  onDeleteMember,
}: MemberActionSheetProps) {
  if (!member) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Member details and actions"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-all p-0 sm:p-4 sm:items-center animate-in fade-in duration-250 ease-out"
    >
      <div className="w-full max-w-md rounded-t-3xl border-t border-white/15 bg-[#111513] p-6 shadow-2xl sm:rounded-3xl sm:border border-white/10 animate-in slide-in-from-bottom duration-300 ease-out will-change-transform">
        {/* Mobile handle indicator */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        {/* Top Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex size-12 items-center justify-center rounded-2xl text-sm font-black overflow-hidden ${member.photoUrl ? 'border border-white/20 bg-black' : avatarColors[member.color]}`}>
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="size-full object-cover" />
              ) : (
                member.initials
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{member.name}</h3>
              <p className="text-xs text-white/50">{member.plan}</p>
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

        {/* Info Grid */}
        <div className="mb-5 space-y-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-xs">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <span className="flex items-center gap-2 text-white/50">
              <Dumbbell className="size-3.5 text-[#ccff00]" /> Monthly Dues
            </span>
            <span className="font-extrabold text-[#ccff00] text-sm">{formatPKR(member.monthlyFee)}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <span className="flex items-center gap-2 text-white/50">
              <Phone className="size-3.5 text-white/60" /> Phone Number
            </span>
            <span className="font-semibold text-white font-mono">
              {member.phone ? member.phone : <span className="text-white/30 italic font-sans">N/A (No contact)</span>}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <span className="flex items-center gap-2 text-white/50">
              <Calendar className="size-3.5 text-white/60" /> Member Since
            </span>
            <span className="font-semibold text-white">{member.joinDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-white/50">
              <ShieldAlert className="size-3.5 text-white/60" /> Payment Status
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                member.status === 'Active'
                  ? 'bg-[#ccff00]/15 text-[#ccff00]'
                  : member.status === 'Due Soon'
                  ? 'bg-amber-400/15 text-amber-300'
                  : 'bg-rose-400/15 text-rose-400'
              }`}
            >
              {member.status}
            </span>
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
