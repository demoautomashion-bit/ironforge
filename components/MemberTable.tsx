'use client'

import { Check, Ellipsis, MessageSquare } from 'lucide-react'
import { Member } from '@/lib/types'
import { avatarColors, formatPKR } from '@/lib/mock-data'

interface MemberTableProps {
  members: Member[]
  onMarkPaid: (id: string) => void
  onOpenActionSheet: (member: Member) => void
}

export function MemberTable({ members, onMarkPaid, onOpenActionSheet }: MemberTableProps) {
  function openWhatsApp(phone: string, name: string, fee: number) {
    const formattedPhone = phone.replace(/[^0-9]/g, '')
    const internationalPhone = formattedPhone.startsWith('0') ? '92' + formattedPhone.slice(1) : formattedPhone
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${name}, this is a friendly reminder from Iron District Gym regarding your monthly dues of ${formatPKR(
        fee
      )}. Please complete your payment at your earliest convenience. Thank you!`
    )
    window.open(`https://wa.me/${internationalPhone}?text=${text}`, '_blank')
  }

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d100f] shadow-2xl md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.07] bg-white/[0.025] text-[10px] uppercase tracking-[0.18em] text-white/35">
            <tr>
              <th className="px-6 py-4 font-bold">Athlete</th>
              <th className="px-4 py-4 font-bold">Plan Tier</th>
              <th className="px-4 py-4 font-bold">Monthly Fee</th>
              <th className="px-4 py-4 font-bold">Phone</th>
              <th className="px-4 py-4 font-bold">Last Payment</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {members.map((member) => (
              <tr key={member.id} className="group transition hover:bg-white/[0.025]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-2xl text-xs font-black ${avatarColors[member.color]}`}>
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-extrabold text-white">{member.name}</p>
                      <p className="text-[11px] text-white/40">Joined {member.joinDate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-white/70">
                    {member.plan}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-extrabold text-[#ccff00]">{formatPKR(member.monthlyFee)}</span>
                </td>
                <td className="px-4 py-4 text-white/60 font-mono text-xs">{member.phone}</td>
                <td className="px-4 py-4 text-white/50">{member.paymentDate}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={member.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* WhatsApp Action */}
                    <button
                      title="Send WhatsApp Payment Reminder"
                      onClick={() => openWhatsApp(member.phone, member.name, member.monthlyFee)}
                      className="flex size-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20"
                    >
                      <MessageSquare className="size-3.5" />
                    </button>

                    {/* Mark Paid Toggle */}
                    <button
                      onClick={() => onMarkPaid(member.id)}
                      disabled={member.status === 'Active'}
                      className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition ${
                        member.status === 'Active'
                          ? 'border-transparent text-white/30 cursor-default'
                          : 'border-[#ccff00]/40 bg-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00]/20'
                      }`}
                    >
                      <Check className="size-3.5" />
                      <span>{member.status === 'Active' ? 'Paid' : 'Mark Paid'}</span>
                    </button>

                    {/* Options */}
                    <button
                      aria-label={`More options for ${member.name}`}
                      onClick={() => onOpenActionSheet(member)}
                      className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/40 transition hover:bg-white/10 hover:text-white"
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

      {members.length === 0 && (
        <div className="px-6 py-14 text-center text-sm text-white/40">
          No members match the active filters.
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/[0.07] px-6 py-3.5 text-xs text-white/40">
        <span>Displaying {members.length} members</span>
        <span>PKR Currency Standard Enabled</span>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Active: 'border-[#ccff00]/30 bg-[#ccff00]/10 text-[#ccff00]',
    'Due Soon': 'border-amber-300/30 bg-amber-300/10 text-amber-300',
    Overdue: 'border-rose-400/30 bg-rose-400/10 text-rose-400',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        styles[status as keyof typeof styles]
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
