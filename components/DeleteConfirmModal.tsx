'use client'

import { AlertTriangle, Trash2, X } from 'lucide-react'
import { Member } from '@/lib/types'

interface DeleteConfirmModalProps {
  member: Member | null
  onClose: () => void
  onConfirmDelete: (id: string) => void
  gymName?: string
}

export function DeleteConfirmModal({
  member,
  onClose,
  onConfirmDelete,
  gymName = 'Iron Forge',
}: DeleteConfirmModalProps) {
  if (!member) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm member removal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/30 bg-[#120f10] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Remove Athlete Roster</h3>
              <p className="text-xs text-white/40">Confirm member removal</p>
            </div>
          </div>
          <button
            aria-label="Close dialog"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-5 space-y-3 text-xs text-white/70">
          <p>
            Are you sure you want to remove <strong className="text-white font-extrabold">{member.name}</strong> from the {gymName} roster?
          </p>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Plan Tier:</span>
              <span className="font-bold text-white">{member.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Contact Phone:</span>
              <span className="font-mono text-white/80">{member.phone || 'N/A'}</span>
            </div>
          </div>
          <p className="text-[11px] text-white/40 italic">
            This action will soft-delete the record and archive their payment history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-white/10 text-xs font-bold text-white/70 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmDelete(member.id)
              onClose()
            }}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 text-xs font-black text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] transition hover:bg-rose-600 active:scale-95"
          >
            <Trash2 className="size-4" />
            <span>Confirm Removal</span>
          </button>
        </div>
      </div>
    </div>
  )
}
