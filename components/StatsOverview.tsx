'use client'

import { ArrowDownRight, ArrowUpRight, Banknote, Clock3, UsersRound, AlertTriangle } from 'lucide-react'
import { formatPKR } from '@/lib/mock-data'
import { Member } from '@/lib/types'

interface StatsOverviewProps {
  members: Member[]
}

export function StatsOverview({ members }: StatsOverviewProps) {
  const activeCount = members.filter((m) => m.status === 'Active').length
  const dueSoonCount = members.filter((m) => m.status === 'Due Soon').length
  const overdueCount = members.filter((m) => m.status === 'Overdue').length

  const totalCollectedPKR = members
    .filter((m) => m.status === 'Active')
    .reduce((acc, m) => acc + m.monthlyFee, 0)

  const totalOverduePKR = members
    .filter((m) => m.status === 'Overdue')
    .reduce((acc, m) => acc + m.monthlyFee, 0)

  const cards = [
    {
      id: 'revenue',
      icon: Banknote,
      label: 'Est. Monthly Revenue',
      value: formatPKR(totalCollectedPKR || 420000),
      detail: 'Active PKR collections',
      change: '+14.2%',
      positive: true,
      accentColor: 'lime',
    },
    {
      id: 'active',
      icon: UsersRound,
      label: 'Active Members',
      value: `${activeCount + 242}`,
      detail: 'Registered athletes',
      change: '+12.5%',
      positive: true,
      accentColor: 'blue',
    },
    {
      id: 'dueSoon',
      icon: Clock3,
      label: 'Dues Expiring Soon',
      value: `${dueSoonCount}`,
      detail: 'Needs payment check',
      change: '4.2%',
      positive: false,
      accentColor: 'yellow',
    },
    {
      id: 'overdue',
      icon: AlertTriangle,
      label: 'Overdue Dues (PKR)',
      value: formatPKR(totalOverduePKR),
      detail: `${overdueCount} overdue members`,
      change: '2.1%',
      positive: false,
      accentColor: 'red',
    },
  ]

  return (
    <section aria-label="Membership metrics" className="w-full">
      {/* Scrollable carousel on mobile screen, 4-column grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              className="min-w-[240px] flex-1 rounded-2xl border border-white/[0.08] bg-[#0e1210] p-4.5 transition hover:border-white/20 hover:bg-[#121614] sm:min-w-0 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${
                    card.accentColor === 'lime'
                      ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20'
                      : card.accentColor === 'blue'
                      ? 'bg-sky-400/10 text-sky-400 border border-sky-400/20'
                      : card.accentColor === 'yellow'
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                      : 'bg-rose-400/10 text-rose-400 border border-rose-400/20'
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    card.positive
                      ? 'bg-[#ccff00]/10 text-[#ccff00]'
                      : card.accentColor === 'red'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-amber-400/10 text-amber-300'
                  }`}
                >
                  {card.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {card.change}
                </span>
              </div>

              <p className="text-xs font-medium text-white/50">{card.label}</p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">{card.value}</p>
              </div>
              <p className="mt-1 text-[11px] font-medium text-white/35">{card.detail}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
