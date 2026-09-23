'use client'

import { useMemo, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { Member, Gender, Status } from '@/lib/types'
import { MemberFilters } from '@/components/MemberFilters'
import { MemberTable } from '@/components/MemberTable'
import { MemberCardList } from '@/components/MemberCardList'

interface MembersViewProps {
  members: Member[]
  onMarkPaid: (id: string) => void
  onOpenActionSheet: (member: Member) => void
  onOpenAddMember: () => void
  onOpenDeleteModal?: (member: Member) => void
}

export function MembersView({
  members,
  onMarkPaid,
  onOpenActionSheet,
  onOpenAddMember,
  onOpenDeleteModal,
}: MembersViewProps) {
  const [query, setQuery] = useState('')
  const [gender, setGender] = useState<'All' | Gender>('All')
  const [status, setStatus] = useState<'All' | Status>('All')

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesGender = gender === 'All' || member.gender === gender
      const matchesStatus = status === 'All' || member.status === status
      const matchesQuery =
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        (member.phone && member.phone.includes(query)) ||
        member.plan.toLowerCase().includes(query.toLowerCase())
      return matchesGender && matchesStatus && matchesQuery
    })
  }, [gender, members, query, status])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-5 text-theme-accent" />
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Athlete Roster
            </h1>
          </div>
          <p className="mt-1 text-xs text-white/50 sm:text-sm">
            Manage all registered gym members, filter by status or gender, and register new athletes.
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="flex h-10 items-center gap-2 rounded-xl bg-theme-accent px-4 text-xs font-extrabold text-theme-btn shadow-[0_0_20px_rgba(var(--brand-accent-rgb),0.25)] transition-all hover:bg-theme-accent-hover active:scale-95"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filters */}
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

      {/* Mobile Card List */}
      <MemberCardList
        members={filteredMembers}
        onMarkPaid={onMarkPaid}
        onOpenActionSheet={onOpenActionSheet}
        onOpenDeleteModal={onOpenDeleteModal}
      />

      {/* Desktop Table */}
      <MemberTable
        members={filteredMembers}
        onMarkPaid={onMarkPaid}
        onOpenActionSheet={onOpenActionSheet}
        onOpenDeleteModal={onOpenDeleteModal}
      />
    </div>
  )
}
