'use client'

import { Activity, Dumbbell, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react'
import { StatsOverview } from '@/components/StatsOverview'
import { Member } from '@/lib/types'
import { formatPKR } from '@/lib/mock-data'

interface OverviewViewProps {
  members: Member[]
  onNavigateToMembers: () => void
  onOpenAddMember: () => void
  gymName?: string
  standardFee?: number
  treadmillFee?: number
}

export function OverviewView({
  members,
  onNavigateToMembers,
  onOpenAddMember,
  gymName = 'Iron District PK',
  standardFee = 5000,
  treadmillFee = 7500,
}: OverviewViewProps) {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })

  const standardCount = members.filter((m) => m.plan === 'Standard Gym').length
  const treadmillCount = members.filter((m) => m.plan === 'Treadmill Pro').length

  const activeRevenue = members
    .filter((m) => m.status === 'Active')
    .reduce((acc, m) => acc + m.monthlyFee, 0)

  const overdueRevenue = members
    .filter((m) => m.status === 'Overdue')
    .reduce((acc, m) => acc + m.monthlyFee, 0)

  const totalExpected = members.reduce((acc, m) => acc + m.monthlyFee, 0)
  const collectionRate = totalExpected > 0 ? Math.round((activeRevenue / totalExpected) * 100) : 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-theme-accent shadow-[0_0_8px_var(--brand-accent)] animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-accent">
              {currentDateFormatted}
            </p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
            Overview Dashboard 👋
          </h1>
          <p className="mt-1 text-xs text-white/50 sm:text-sm">
            Real-time metric breakdown for {gymName} gym revenue & athlete activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddMember}
            className="flex items-center gap-2 rounded-xl bg-theme-accent px-4 py-2.5 text-xs font-bold text-theme-btn shadow-[0_0_20px_rgba(var(--brand-accent-rgb),0.25)] transition-all hover:bg-theme-accent-hover active:scale-95"
          >
            <Zap className="size-4 fill-current" />
            <span>Quick Add Athlete</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <StatsOverview members={members} />

      {/* Grid Section: Collection Rate & Plan Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* PKR Dues Collection Health Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-5 shadow-xl transition hover:border-white/20">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-theme-accent/10 text-theme-accent border border-theme-accent/20">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Monthly Collection Rate</h3>
                <p className="text-xs text-white/40">PKR Dues collected vs pending</p>
              </div>
            </div>
            <span className="text-2xl font-black text-theme-accent">{collectionRate}%</span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 p-0.5">
              <div
                className="h-full rounded-full bg-theme-accent shadow-[0_0_12px_var(--brand-accent)] transition-all duration-500"
                style={{ width: `${collectionRate}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase font-bold text-white/40">Collected PKR</p>
                <p className="mt-1 font-extrabold text-theme-accent text-sm">{formatPKR(activeRevenue)}</p>
              </div>
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase font-bold text-white/40">Overdue PKR</p>
                <p className="mt-1 font-extrabold text-rose-400 text-sm">{formatPKR(overdueRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Breakdown Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d100f] p-5 shadow-xl transition hover:border-white/20">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20">
                <Dumbbell className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Membership Plan Share</h3>
                <p className="text-xs text-white/40">2 Active Gym Tiers</p>
              </div>
            </div>
            <button
              onClick={onNavigateToMembers}
              className="text-xs font-bold text-theme-accent hover:underline"
            >
              View Roster &rarr;
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {/* Standard Gym Option */}
            <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                <div>
                  <p className="text-xs font-bold text-white">Standard Gym</p>
                  <p className="text-[11px] text-white/40">Weights & Machines Access</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-white">{standardCount} Athletes</p>
                <p className="text-[10px] text-white/40">{formatPKR(standardFee)} / mo</p>
              </div>
            </div>

            {/* Treadmill Pro Option */}
            <div className="flex items-center justify-between rounded-xl border border-theme-accent/20 bg-theme-accent/[0.03] p-3.5">
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-theme-accent shadow-[0_0_8px_var(--brand-accent)]" />
                <div>
                  <p className="text-xs font-bold text-theme-accent">Treadmill Pro</p>
                  <p className="text-[11px] text-white/40">Standard Gym + Treadmill Zone</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-theme-accent">{treadmillCount} Athletes</p>
                <p className="text-[10px] text-white/40">{formatPKR(treadmillFee)} / mo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Activity & System Info Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0a0d0b] p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white/60">
            <ShieldCheck className="size-5 text-theme-accent" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{gymName} Portal Active</p>
            <p className="text-[11px] text-white/40">All member records & PKR fee registers synced.</p>
          </div>
        </div>
        <button
          onClick={onNavigateToMembers}
          className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-bold text-white transition hover:bg-white/10 active:scale-95"
        >
          <Users className="size-4 text-theme-accent" />
          <span>Manage All Roster Members</span>
        </button>
      </div>
    </div>
  )
}
