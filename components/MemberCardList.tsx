'use client'

import { Check, Ellipsis, PhoneCall, Calendar, Trash2 } from 'lucide-react'
import { Member } from '@/lib/types'
import { avatarColors, formatPKR } from '@/lib/mock-data'

interface MemberCardListProps {
  members: Member[]
  onMarkPaid: (id: string) => void
  onOpenActionSheet: (member: Member) => void
  onOpenDeleteModal?: (member: Member) => void
}

export function MemberCardList({ members, onMarkPaid, onOpenActionSheet, onOpenDeleteModal }: MemberCardListProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-12 px-4 text-center">
        <p className="text-sm font-semibold text-white/60">No members match your criteria.</p>
        <p className="mt-1 text-xs text-white/35">Try adjusting your search or filter options.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {members.map((member) => (
        <div
          key={member.id}
          className="group relative rounded-2xl border border-white/[0.08] bg-[#0d100f] p-4 transition-all duration-200 hover:border-white/20 active:scale-[0.99]"
        >
          {/* Top Row: Avatar, Name, Plan, and Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex size-11 items-center justify-center rounded-2xl text-xs font-black shadow-inner transition-transform duration-200 group-hover:scale-105 overflow-hidden ${member.photoUrl ? 'border border-white/20 bg-black' : avatarColors[member.color]}`}>
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="size-full object-cover" />
                ) : (
                  member.initials
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{member.name}</h3>
                <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                  member.plan === 'Treadmill Pro'
                    ? 'bg-theme-accent/15 text-theme-accent border border-theme-accent/30'
                    : 'bg-white/[0.06] text-white/60'
                }`}>
                  {member.plan}
                </span>
              </div>
            </div>

            <StatusBadge status={member.status} />
          </div>

          {/* Details Grid */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/35">Monthly Fee</span>
              <p className="font-extrabold text-theme-accent">{formatPKR(member.monthlyFee)}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/35">Last Paid</span>
              <p className="font-semibold text-white/70">{member.paymentDate}</p>
            </div>
            <div className="col-span-2 flex items-center justify-between border-t border-white/[0.05] pt-2 mt-1">
              <span className="flex items-center gap-1.5 text-white/50 text-[11px]">
                <PhoneCall className="size-3 text-theme-accent" />
                {member.phone ? member.phone : <span className="italic text-white/30">No Contact</span>}
              </span>
              <span className="flex items-center gap-1 text-white/40 text-[10px]">
                <Calendar className="size-3" /> Joined {member.joinDate}
              </span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
            {/* Mark Fee Paid Toggle */}
            <button
              onClick={() => onMarkPaid(member.id)}
              disabled={member.status === 'Active'}
              className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-all duration-200 active:scale-95 ${
                member.status === 'Active'
                  ? 'border-white/10 bg-white/[0.04] text-white/30 cursor-not-allowed'
                  : 'border-theme-accent/40 bg-theme-accent/10 text-theme-accent hover:bg-theme-accent/20 shadow-[0_0_15px_rgba(var(--brand-accent-rgb),0.15)]'
              }`}
            >
              <Check className="size-3.5" />
              <span>{member.status === 'Active' ? 'Fee Paid' : 'Mark Paid'}</span>
            </button>

            {/* Direct Delete Icon Button */}
            {onOpenDeleteModal && (
              <button
                aria-label={`Delete ${member.name}`}
                onClick={() => onOpenDeleteModal(member)}
                className="flex size-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 transition hover:bg-rose-500/20 active:scale-95"
                title="Remove member from roster"
              >
                <Trash2 className="size-4" />
              </button>
            )}

            {/* Ellipsis Details Button */}
            <button
              aria-label={`Options for ${member.name}`}
              onClick={() => onOpenActionSheet(member)}
              className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              <Ellipsis className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Active: 'border-theme-accent/30 bg-theme-accent/10 text-theme-accent',
    'Due Soon': 'border-amber-300/30 bg-amber-300/10 text-amber-300',
    Overdue: 'border-rose-400/30 bg-rose-400/10 text-rose-400',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
        styles[status as keyof typeof styles]
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
