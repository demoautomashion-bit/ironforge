'use client'

import { useState, useMemo } from 'react'
import { CreditCard, AlertTriangle, Clock3, CheckCircle2, Check, Ellipsis } from 'lucide-react'
import { Member } from '@/lib/types'
import { formatPKR, avatarColors } from '@/lib/mock-data'

interface PaymentsViewProps {
  members: Member[]
  onMarkPaid: (id: string) => void
  onOpenActionSheet: (member: Member) => void
}

export function PaymentsView({ members, onMarkPaid, onOpenActionSheet }: PaymentsViewProps) {
  const [filter, setFilter] = useState<'All' | 'Overdue' | 'Due Soon' | 'Active'>('All')

  const totalCollected = members
    .filter((m) => m.status === 'Active')
    .reduce((acc, m) => acc + m.monthlyFee, 0)

  const totalOverdue = members
    .filter((m) => m.status === 'Overdue')
    .reduce((acc, m) => acc + m.monthlyFee, 0)

  const totalDueSoon = members
    .filter((m) => m.status === 'Due Soon')
    .reduce((acc, m) => acc + m.monthlyFee, 0)

  const filteredMembers = useMemo(() => {
    if (filter === 'All') return members
    return members.filter((m) => m.status === filter)
  }, [filter, members])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-theme-accent" />
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Payments & Dues (PKR)
            </h1>
          </div>
          <p className="mt-1 text-xs text-white/50 sm:text-sm">
            Track PKR fee collections, overdue athlete accounts, and update monthly payment registers.
          </p>
        </div>
      </div>

      {/* 3 Metric Cards for Payments */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Active Collections */}
        <div className="rounded-2xl border border-theme-accent/20 bg-theme-accent/[0.03] p-5">
          <div className="flex items-center justify-between text-theme-accent">
            <span className="text-xs font-bold uppercase tracking-wider">Collected Dues</span>
            <CheckCircle2 className="size-5" />
          </div>
          <p className="mt-3 text-2xl font-black text-white">{formatPKR(totalCollected)}</p>
          <p className="mt-1 text-[11px] text-white/40">
            {members.filter((m) => m.status === 'Active').length} Active paid members
          </p>
        </div>

        {/* Due Soon */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-5">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Expiring Soon</span>
            <Clock3 className="size-5" />
          </div>
          <p className="mt-3 text-2xl font-black text-white">{formatPKR(totalDueSoon)}</p>
          <p className="mt-1 text-[11px] text-white/40">
            {members.filter((m) => m.status === 'Due Soon').length} Members due within 7 days
          </p>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-5">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Dues</span>
            <AlertTriangle className="size-5" />
          </div>
          <p className="mt-3 text-2xl font-black text-rose-400">{formatPKR(totalOverdue)}</p>
          <p className="mt-1 text-[11px] text-white/40">
            {members.filter((m) => m.status === 'Overdue').length} Pending overdue payments
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(['All', 'Overdue', 'Due Soon', 'Active'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-theme-accent text-theme-btn shadow-lg'
                : 'border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab === 'All' ? 'All Payments' : tab}
          </button>
        ))}
      </div>

      {/* Payments Roster Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d100f] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.07] bg-white/[0.025] text-[10px] uppercase tracking-[0.18em] text-white/35">
              <tr>
                <th className="px-6 py-4 font-bold">Athlete</th>
                <th className="px-4 py-4 font-bold">Plan</th>
                <th className="px-4 py-4 font-bold">Monthly Fee</th>
                <th className="px-4 py-4 font-bold">Last Payment</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-6 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="group transition hover:bg-white/[0.03]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-9 items-center justify-center rounded-xl text-xs font-black overflow-hidden ${member.photoUrl ? 'border border-white/20 bg-black' : avatarColors[member.color]}`}>
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="size-full object-cover" />
                        ) : (
                          member.initials
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-white">{member.name}</p>
                        <p className="text-[10px] text-white/40">{member.phone || 'No Contact'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-white/70">{member.plan}</td>
                  <td className="px-4 py-4 font-black text-theme-accent">{formatPKR(member.monthlyFee)}</td>
                  <td className="px-4 py-4 text-white/50 text-xs">{member.paymentDate}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                        member.status === 'Active'
                          ? 'border-theme-accent/30 bg-theme-accent/10 text-theme-accent'
                          : member.status === 'Due Soon'
                          ? 'border-amber-300/30 bg-amber-300/10 text-amber-300'
                          : 'border-rose-400/30 bg-rose-400/10 text-rose-400'
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onMarkPaid(member.id)}
                        disabled={member.status === 'Active'}
                        className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition active:scale-95 ${
                          member.status === 'Active'
                            ? 'border-transparent text-white/30 cursor-default'
                            : 'border-theme-accent/40 bg-theme-accent/10 text-theme-accent hover:bg-theme-accent/20'
                        }`}
                      >
                        <Check className="size-3.5" />
                        <span>{member.status === 'Active' ? 'Paid' : 'Mark Paid'}</span>
                      </button>

                      <button
                        onClick={() => onOpenActionSheet(member)}
                        className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                      >
                        <Ellipsis className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-white/40">
            No payments match the selected filter.
          </div>
        )}
      </div>
    </div>
  )
}
