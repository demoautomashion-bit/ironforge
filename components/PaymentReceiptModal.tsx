'use client'

import { X, Printer, CheckCircle2, Dumbbell, ShieldCheck } from 'lucide-react'
import { Member } from '@/lib/types'
import { formatPKR } from '@/lib/mock-data'

interface PaymentReceiptModalProps {
  member: Member | null
  onClose: () => void
  gymName?: string
}

export function PaymentReceiptModal({ member, onClose, gymName = 'Iron Forge' }: PaymentReceiptModalProps) {
  if (!member) return null

  const receiptId = `IDP-${member.id.padStart(5, '0')}`
  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Digital payment receipt"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#0e1210] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Top Watermark Stamp */}
        <div className="absolute -right-6 -top-6 rotate-12 select-none rounded-full border-4 border-theme-accent/20 p-4 text-[10px] font-black uppercase tracking-widest text-theme-accent/15 pointer-events-none">
          VERIFIED PKR PAYMENT
        </div>

        {/* Modal Close Button */}
        <button
          aria-label="Close receipt"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>

        {/* Header Branding */}
        <div className="mb-6 flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-theme-accent text-theme-btn font-black">
            <Dumbbell className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-white uppercase">{gymName}</h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-theme-accent">Official Payment Receipt</p>
          </div>
        </div>

        {/* Receipt Printable Container */}
        <div className="space-y-4 text-xs">
          {/* Metadata */}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-white/40">Receipt Number</span>
              <p className="font-mono font-bold text-white text-sm">{receiptId}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-white/40">Date Issued</span>
              <p className="font-bold text-white">{todayStr}</p>
            </div>
          </div>

          {/* Athlete Info */}
          <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-white/50">Athlete Name</span>
              <span className="font-bold text-white">{member.name}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-white/50">Contact Phone</span>
              <span className="font-mono text-white/80">{member.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-white/50">Membership Tier</span>
              <span className="font-bold text-theme-accent">{member.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Payment Status</span>
              <span className="flex items-center gap-1 font-bold text-theme-accent">
                <CheckCircle2 className="size-3.5" /> PAID IN FULL
              </span>
            </div>
          </div>

          {/* Total PKR Box */}
          <div className="flex items-center justify-between rounded-2xl border border-theme-accent/30 bg-theme-accent/10 p-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-white/60">Total Paid (PKR)</p>
              <p className="text-2xl font-black text-theme-accent">{formatPKR(member.monthlyFee)}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-theme-accent/20 px-3 py-1 text-[11px] font-bold text-theme-accent">
              <ShieldCheck className="size-3.5" /> Verified
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-white/10 text-xs font-bold text-white/70 transition hover:bg-white/5"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-theme-accent text-xs font-black text-theme-btn shadow-[0_0_20px_rgba(var(--brand-accent-rgb),0.25)] transition hover:bg-theme-accent-hover active:scale-95"
          >
            <Printer className="size-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  )
}
