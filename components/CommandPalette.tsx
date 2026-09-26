'use client'

import { useEffect, useState } from 'react'
import { Search, X, Users, CreditCard, LayoutDashboard, Settings, ArrowRight, Dumbbell } from 'lucide-react'
import { Member } from '@/lib/types'
import { formatPKR } from '@/lib/mock-data'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  members: Member[]
  onSelectMember: (member: Member) => void
  onNavigate: (tab: string) => void
}

export function CommandPalette({
  open,
  onClose,
  members,
  onSelectMember,
  onNavigate,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) {
          onClose()
        } else {
          // Open trigger handled outside if needed, or toggle callback
        }
      }
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const filteredMembers = query.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          (m.phone && m.phone.includes(query)) ||
          m.plan.toLowerCase().includes(query.toLowerCase())
      )
    : members.slice(0, 4)

  const pages = [
    { id: 'overview', name: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'members', name: 'Athlete Roster', icon: Users },
    { id: 'payments', name: 'Payments & PKR Dues', icon: CreditCard },
    { id: 'settings', name: 'Portal & Gym Settings', icon: Settings },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette search"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-16 sm:pt-24 animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#111513] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3">
          <Search className="size-5 text-white/40" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search athletes by name, plan, or navigate pages... (Esc to close)"
            className="h-10 w-full bg-transparent pl-3 pr-8 text-sm font-medium text-white outline-none placeholder:text-white/35"
          />
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1 text-white/40 hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Page Navigation */}
          {!query && (
            <div>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                Navigation Shortcuts
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pages.map((p) => {
                  const Icon = p.icon
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onNavigate(p.id)
                        onClose()
                      }}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-left transition hover:border-theme-accent/40 hover:bg-theme-accent/10"
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-white">
                        <Icon className="size-4 text-theme-accent" />
                        <span>{p.name}</span>
                      </div>
                      <ArrowRight className="size-3.5 text-white/40" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Athletes List */}
          <div>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {query ? `Search Results (${filteredMembers.length})` : 'Recent Athletes'}
            </p>
            <div className="space-y-1">
              {filteredMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectMember(m)
                    onClose()
                  }}
                  className="flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-theme-accent/10 text-theme-accent text-xs font-bold overflow-hidden">
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.name} className="size-full object-cover" />
                      ) : (
                        m.initials
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{m.name}</p>
                      <p className="text-[11px] text-white/40">
                        {m.plan} • {m.phone || 'No Phone'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-theme-accent">{formatPKR(m.monthlyFee)}</span>
                    <p className="text-[10px] text-white/40">{m.status}</p>
                  </div>
                </button>
              ))}

              {filteredMembers.length === 0 && (
                <div className="py-8 text-center text-xs text-white/40">
                  No athletes found matching &quot;{query}&quot;.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[11px] text-white/40">
          <span>Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">Esc</kbd> to exit</span>
          <span className="flex items-center gap-1 text-theme-accent"><Dumbbell className="size-3" /> Iron Forge</span>
        </div>
      </div>
    </div>
  )
}
