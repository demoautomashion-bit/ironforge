'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Dumbbell,
  Ellipsis,
  Mail,
  Menu,
  Phone,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'

const initialMembers = [
  { name: 'Olivia Martin', initials: 'OM', phone: '+1 555 014 8821', joinDate: 'Jan 12, 2024', paymentDate: 'Mar 01, 2024', status: 'Active', gender: 'Female', color: 'lime' },
  { name: 'Ethan Williams', initials: 'EW', phone: '+1 555 019 2234', joinDate: 'Feb 08, 2024', paymentDate: 'Feb 28, 2024', status: 'Due Soon', gender: 'Male', color: 'blue' },
  { name: 'Sophia Brown', initials: 'SB', phone: '+1 555 012 7789', joinDate: 'Dec 19, 2023', paymentDate: 'Feb 04, 2024', status: 'Overdue', gender: 'Female', color: 'violet' },
  { name: 'Noah Davis', initials: 'ND', phone: '+1 555 017 4462', joinDate: 'Mar 03, 2024', paymentDate: 'Mar 03, 2024', status: 'Active', gender: 'Male', color: 'orange' },
  { name: 'Ava Wilson', initials: 'AW', phone: '+1 555 010 3390', joinDate: 'Jan 26, 2024', paymentDate: 'Feb 25, 2024', status: 'Due Soon', gender: 'Female', color: 'pink' },
  { name: 'Liam Taylor', initials: 'LT', phone: '+1 555 016 9087', joinDate: 'Nov 14, 2023', paymentDate: 'Jan 30, 2024', status: 'Overdue', gender: 'Male', color: 'cyan' },
]

const avatarColors: Record<string, string> = { lime: 'bg-lime-200 text-lime-950', blue: 'bg-sky-200 text-sky-950', violet: 'bg-violet-200 text-violet-950', orange: 'bg-orange-200 text-orange-950', pink: 'bg-pink-200 text-pink-950', cyan: 'bg-cyan-200 text-cyan-950' }

export default function Page() {
  const [members, setMembers] = useState(initialMembers)
  const [gender, setGender] = useState<'All' | 'Male' | 'Female'>('All')
  const [status, setStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const filteredMembers = useMemo(() => members.filter((member) => {
    const matchesGender = gender === 'All' || member.gender === gender
    const matchesStatus = status === 'All' || member.status === status
    return matchesGender && matchesStatus && member.name.toLowerCase().includes(query.toLowerCase())
  }), [gender, members, query, status])

  function markPaid(name: string) {
    setMembers((current) => current.map((member) => member.name === name ? { ...member, status: 'Active', paymentDate: 'Mar 07, 2024' } : member))
  }

  function addMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || 'New Member')
    const genderValue = String(form.get('gender') || 'Female') as 'Male' | 'Female'
    setMembers((current) => [{ name, initials: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), phone: String(form.get('phone') || '—'), joinDate: 'Mar 07, 2024', paymentDate: 'Mar 07, 2024', status: 'Active', gender: genderValue, color: 'lime' }, ...current])
    setOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#080a09] text-white">
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#080a09]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.16)]"><Dumbbell className="size-5" /></div>
            <div><p className="text-[15px] font-bold tracking-tight">IRON DISTRICT</p><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">Member management</p></div>
          </div>
          <div className="hidden items-center gap-7 text-sm text-white/45 md:flex"><span className="flex items-center gap-2 text-white"><Activity className="size-4 text-[#ccff00]" />Overview</span><span>Members</span><span>Payments</span><span>Settings</span></div>
          <div className="flex items-center gap-3"><button onClick={() => setOpen(true)} className="hidden h-10 items-center gap-2 rounded-lg bg-[#ccff00] px-4 text-xs font-bold text-black transition hover:bg-[#dcff63] sm:flex"><Plus className="size-4" /> Add new member</button><button aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)} className="rounded-lg border border-white/10 p-2 text-white/60 md:hidden"><Menu className="size-5" /></button><div className="hidden size-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold sm:flex">JD</div></div>
        </div>
        {mobileMenu && <nav className="flex flex-col gap-4 border-t border-white/[0.07] px-5 py-4 text-sm text-white/60 md:hidden"><span className="text-white">Overview</span><span>Members</span><span>Payments</span><button onClick={() => { setOpen(true); setMobileMenu(false) }} className="flex items-center gap-2 font-bold text-[#ccff00]"><Plus className="size-4" /> Add new member</button></nav>}
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#ccff00]">Friday, March 07, 2024</p><h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Good morning, James.</h1><p className="mt-2 text-sm text-white/45">Here&apos;s what&apos;s happening at Iron District today.</p></div><div className="flex items-center gap-2 text-xs text-white/45"><span className="size-2 rounded-full bg-[#ccff00] shadow-[0_0_9px_#ccff00]" /> Live dashboard <ChevronDown className="size-3" /></div></div>

        <section aria-label="Membership metrics" className="grid gap-4 md:grid-cols-3">
          <MetricCard icon={<UsersRound />} label="Total active members" value="248" change="12.5%" detail="vs. last month" positive color="lime" />
          <MetricCard icon={<Clock3 />} label="Dues expiring soon" value="18" change="4.2%" detail="vs. last month" color="yellow" />
          <MetricCard icon={<CircleDollarSign />} label="Overdue payments" value="07" change="2.1%" detail="vs. last month" color="red" />
        </section>

        <section className="mt-10"><div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-bold tracking-tight">Members</h2><p className="mt-1 text-xs text-white/40">Manage and keep track of your gym members.</p></div><div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-1 text-xs font-semibold"><button onClick={() => setGender('All')} className={`rounded-md px-3 py-2 transition ${gender === 'All' ? 'bg-[#ccff00] text-black' : 'text-white/45 hover:text-white'}`}>All members</button><button onClick={() => setGender('Male')} className={`rounded-md px-3 py-2 transition ${gender === 'Male' ? 'bg-[#ccff00] text-black' : 'text-white/45 hover:text-white'}`}>Male</button><button onClick={() => setGender('Female')} className={`rounded-md px-3 py-2 transition ${gender === 'Female' ? 'bg-[#ccff00] text-black' : 'text-white/45 hover:text-white'}`}>Female</button></div></div>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="relative flex-1 lg:max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" /><input aria-label="Search members" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by member name..." className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#ccff00]/50" /></div><div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-1 text-xs font-semibold"><span className="px-2 text-white/30">Status:</span>{['All', 'Active', 'Due Soon', 'Overdue'].map((item) => <button key={item} onClick={() => setStatus(item)} className={`whitespace-nowrap rounded-md px-3 py-2 transition ${status === item ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>{item}</button>)}</div></div>
          <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#0d100f]"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/[0.07] bg-white/[0.025] text-[10px] uppercase tracking-[0.16em] text-white/35"><tr><th className="px-5 py-4 font-medium">Member</th><th className="px-4 py-4 font-medium">Phone</th><th className="px-4 py-4 font-medium">Join date</th><th className="px-4 py-4 font-medium">Last payment</th><th className="px-4 py-4 font-medium">Status</th><th className="px-5 py-4 text-right font-medium">Action</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{filteredMembers.map((member) => <tr key={member.name} className="group transition hover:bg-white/[0.025]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className={`flex size-9 items-center justify-center rounded-full text-[11px] font-bold ${avatarColors[member.color]}`}>{member.initials}</div><span className="font-semibold text-white/90">{member.name}</span></div></td><td className="px-4 py-4 text-white/50">{member.phone}</td><td className="px-4 py-4 text-white/50">{member.joinDate}</td><td className="px-4 py-4 text-white/50">{member.paymentDate}</td><td className="px-4 py-4"><StatusBadge status={member.status} /></td><td className="px-5 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => markPaid(member.name)} disabled={member.status === 'Active'} className="rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white/65 transition hover:border-[#ccff00]/50 hover:text-[#ccff00] disabled:cursor-default disabled:border-transparent disabled:text-white/25">{member.status === 'Active' ? 'Paid' : 'Mark fee paid'}</button><button aria-label={`More actions for ${member.name}`} className="rounded-md p-1.5 text-white/30 hover:bg-white/10 hover:text-white"><Ellipsis className="size-4" /></button></div></td></tr>)}</tbody></table></div>{filteredMembers.length === 0 && <div className="px-5 py-14 text-center text-sm text-white/40">No members match these filters.</div>}<div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3 text-xs text-white/35"><span>Showing {filteredMembers.length} of {members.length} members</span><span>Updated just now</span></div></div>
        </section>
      </div>

      {open && <div role="dialog" aria-modal="true" aria-label="Add new member" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#121513] p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-xl font-bold">Add new member</h2><p className="mt-1 text-sm text-white/40">Create a membership profile for your gym.</p></div><button aria-label="Close dialog" onClick={() => setOpen(false)} className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white"><X className="size-5" /></button></div><form onSubmit={addMember} className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold text-white/60 sm:col-span-2">Full name<input name="name" required placeholder="e.g. Alex Johnson" className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60" /></label><label className="grid gap-2 text-xs font-semibold text-white/60">Gender<select name="gender" className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60"><option className="bg-[#121513]">Female</option><option className="bg-[#121513]">Male</option></select></label><label className="grid gap-2 text-xs font-semibold text-white/60">Phone<input name="phone" required placeholder="+1 555 000 0000" className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60" /></label><label className="grid gap-2 text-xs font-semibold text-white/60">Emergency contact<input name="emergency" placeholder="Name & phone" className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60" /></label><label className="grid gap-2 text-xs font-semibold text-white/60">Fee amount<input name="fee" type="number" placeholder="$ 0.00" className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60" /></label><label className="grid gap-2 text-xs font-semibold text-white/60 sm:col-span-2">Payment date<input name="payment" type="date" className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-normal text-white outline-none focus:border-[#ccff00]/60" /></label><div className="mt-2 flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/60 hover:text-white">Cancel</button><button type="submit" className="rounded-lg bg-[#ccff00] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#dcff63]">Add member</button></div></form></div></div>}
    </main>
  )
}

function MetricCard({ icon, label, value, change, detail, positive, color }: { icon: React.ReactNode; label: string; value: string; change: string; detail: string; positive?: boolean; color: 'lime' | 'yellow' | 'red' }) {
  const colors = { lime: 'text-[#ccff00] bg-[#ccff00]/10', yellow: 'text-amber-300 bg-amber-300/10', red: 'text-red-400 bg-red-400/10' }
  return <div className="rounded-xl border border-white/[0.09] bg-[#0d100f] p-5"><div className="mb-7 flex items-center justify-between"><div className={`flex size-9 items-center justify-center rounded-lg ${colors[color]}`}>{icon}</div><span className={`flex items-center gap-1 text-[11px] font-semibold ${positive ? 'text-[#ccff00]' : color === 'red' ? 'text-red-400' : 'text-amber-300'}`}>{positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{change}</span></div><p className="text-xs font-medium text-white/45">{label}</p><div className="mt-1 flex items-end gap-3"><p className="text-3xl font-bold tracking-tight">{value}</p><p className="mb-1 text-[11px] text-white/30">{detail}</p></div></div>
}

function StatusBadge({ status }: { status: string }) {
  const styles = { Active: 'border-[#ccff00]/25 bg-[#ccff00]/10 text-[#ccff00]', 'Due Soon': 'border-amber-300/25 bg-amber-300/10 text-amber-300', Overdue: 'border-red-400/25 bg-red-400/10 text-red-400' }
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[status as keyof typeof styles]}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>
}
