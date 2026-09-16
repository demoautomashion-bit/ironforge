'use client'

import { useMemo, useState } from 'react'
import { Activity, ChevronDown, Sparkles } from 'lucide-react'
import { initialMembers } from '@/lib/mock-data'
import { Gender, Member, Status } from '@/lib/types'
import { Header } from '@/components/Header'
import { StatsOverview } from '@/components/StatsOverview'
import { MemberFilters } from '@/components/MemberFilters'
import { MemberCardList } from '@/components/MemberCardList'
import { MemberTable } from '@/components/MemberTable'
import { AddMemberDrawer } from '@/components/AddMemberDrawer'
import { MemberActionSheet } from '@/components/MemberActionSheet'

export default function Page() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [gender, setGender] = useState<'All' | Gender>('All')
  const [status, setStatus] = useState<'All' | Status>('All')
  const [query, setQuery] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [activeTab, setActiveTab] = useState('members')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesGender = gender === 'All' || member.gender === gender
      const matchesStatus = status === 'All' || member.status === status
      const matchesQuery =
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.phone.includes(query) ||
        member.plan.toLowerCase().includes(query.toLowerCase())
      return matchesGender && matchesStatus && matchesQuery
    })
  }, [gender, members, query, status])

  function handleMarkPaid(id: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'Active',
              paymentDate: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              }),
            }
          : m
      )
    )
    const target = members.find((m) => m.id === id)
    showToast(`Fee marked as paid for ${target?.name || 'member'}!`)
  }

  function handleAddMember(newMemberData: Omit<Member, 'id'>) {
    const newMember: Member = {
      ...newMemberData,
      id: Date.now().toString(),
    }
    setMembers((prev) => [newMember, ...prev])
    showToast(`New member ${newMember.name} added successfully!`)
  }

  function handleDeleteMember(id: string) {
    const target = members.find((m) => m.id === id)
    setMembers((prev) => prev.filter((m) => m.id !== id))
    showToast(`Removed ${target?.name || 'member'} from roster.`)
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-[#080a09] text-white pb-20 md:pb-12 font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#ccff00]/40 bg-[#0d120f] px-5 py-2.5 text-xs font-bold text-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.25)] animate-in slide-in-from-top duration-300">
          ✨ {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        onOpenAddMember={() => setAddModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Dashboard Banner */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.06] pb-6">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ccff00]">
                {currentDateFormatted}
              </p>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
              Good morning, Admin 👋
            </h1>
            <p className="mt-1 text-xs text-white/50 sm:text-sm">
              Manage Iron District PK gym members, PKR dues, and instant WhatsApp reminders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/70">
              <Activity className="size-3.5 text-[#ccff00]" /> Live Dashboard
            </span>
          </div>
        </div>

        {/* Stats Metrics (PKR standard) */}
        <StatsOverview members={members} />

        {/* Member Roster Section */}
        <section className="space-y-5 pt-2">
          {/* Search and Filters */}
          <MemberFilters
            query={query}
            setQuery={setQuery}
            gender={gender}
            setGender={setGender}
            status={status}
            setStatus={setStatus}
            totalCount={members.length}
            filteredCount={filteredMembers.length}
          />

          {/* Mobile Member Cards (visible on phones) */}
          <MemberCardList
            members={filteredMembers}
            onMarkPaid={handleMarkPaid}
            onOpenActionSheet={(member) => setSelectedMember(member)}
          />

          {/* Desktop Member Table (visible on md+) */}
          <MemberTable
            members={filteredMembers}
            onMarkPaid={handleMarkPaid}
            onOpenActionSheet={(member) => setSelectedMember(member)}
          />
        </section>
      </div>

      {/* Add Member Drawer/Modal */}
      <AddMemberDrawer
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddMember={handleAddMember}
      />

      {/* Member Action Sheet (Mobile Ellipsis Details) */}
      <MemberActionSheet
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onMarkPaid={handleMarkPaid}
        onDeleteMember={handleDeleteMember}
      />
    </main>
  )
}
