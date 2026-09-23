'use client'

import { Bell, Check, Clock3, AlertTriangle, UserPlus, X } from 'lucide-react'
import { Member } from '@/lib/types'

interface NotificationDropdownProps {
  open: boolean
  onClose: () => void
  members: Member[]
  onNavigateToPayments: () => void
}

export function NotificationDropdown({
  open,
  onClose,
  members,
  onNavigateToPayments,
}: NotificationDropdownProps) {
  if (!open) return null

  const overdueMembers = members.filter((m) => m.status === 'Overdue')
  const dueSoonMembers = members.filter((m) => m.status === 'Due Soon')

  const notifications = [
    ...overdueMembers.map((m) => ({
      id: `overdue-${m.id}`,
      title: `${m.name} PKR fee is Overdue`,
      desc: `${m.plan} • Rs. ${m.monthlyFee.toLocaleString()}`,
      time: 'Immediate Attention',
      type: 'overdue' as const,
    })),
    ...dueSoonMembers.map((m) => ({
      id: `due-${m.id}`,
      title: `${m.name} dues expiring soon`,
      desc: `Payment expected by ${m.paymentDate}`,
      time: 'Within 7 Days',
      type: 'dueSoon' as const,
    })),
  ]

  return (
    <div
      className="absolute right-0 top-14 z-50 w-80 sm:w-96 rounded-2xl border border-white/15 bg-[#111513] p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-theme-accent" />
          <h3 className="text-sm font-extrabold text-white">System Notifications</h3>
          <span className="rounded-full bg-theme-accent/20 px-2 py-0.5 text-[10px] font-bold text-theme-accent">
            {notifications.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* List */}
      <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-white/40">
            No active payment warnings or overdue notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onNavigateToPayments()
                onClose()
              }}
              className={`flex items-start gap-3 rounded-xl border p-3 transition cursor-pointer hover:border-white/20 ${
                n.type === 'overdue'
                  ? 'border-rose-500/20 bg-rose-500/5'
                  : 'border-amber-400/20 bg-amber-400/5'
              }`}
            >
              <div className="mt-0.5">
                {n.type === 'overdue' ? (
                  <AlertTriangle className="size-4 text-rose-400" />
                ) : (
                  <Clock3 className="size-4 text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">{n.title}</p>
                <p className="mt-0.5 text-[11px] text-white/50">{n.desc}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/35">
                  {n.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 border-t border-white/10 pt-2 text-center">
        <button
          onClick={() => {
            onNavigateToPayments()
            onClose()
          }}
          className="text-xs font-bold text-theme-accent hover:underline"
        >
          View All Dues in Payments &rarr;
        </button>
      </div>
    </div>
  )
}
