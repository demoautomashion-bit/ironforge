'use client'

import { useState } from 'react'
import { initialMembers } from '@/lib/mock-data'
import { Member } from '@/lib/types'
import { Header } from '@/components/Header'
import { OverviewView } from '@/components/pages/OverviewView'
import { MembersView } from '@/components/pages/MembersView'
import { PaymentsView } from '@/components/pages/PaymentsView'
import { SettingsView } from '@/components/pages/SettingsView'
import { AddMemberDrawer } from '@/components/AddMemberDrawer'
import { MemberActionSheet } from '@/components/MemberActionSheet'

export default function Page() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

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

  return (
    <main className="min-h-screen bg-[#080a09] text-white pb-20 md:pb-12 font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#ccff00]/40 bg-[#0d120f] px-5 py-2.5 text-xs font-bold text-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.25)] animate-in slide-in-from-top duration-300">
          ✨ {toastMessage}
        </div>
      )}

      {/* Navigation Header */}
      <Header
        onOpenAddMember={() => setAddModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <OverviewView
            members={members}
            onNavigateToMembers={() => setActiveTab('members')}
            onOpenAddMember={() => setAddModalOpen(true)}
          />
        )}

        {activeTab === 'members' && (
          <MembersView
            members={members}
            onMarkPaid={handleMarkPaid}
            onOpenActionSheet={(member) => setSelectedMember(member)}
            onOpenAddMember={() => setAddModalOpen(true)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsView
            members={members}
            onMarkPaid={handleMarkPaid}
            onOpenActionSheet={(member) => setSelectedMember(member)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView onShowToast={showToast} />
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberDrawer
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddMember={handleAddMember}
      />

      {/* Member Action Details Sheet */}
      <MemberActionSheet
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onMarkPaid={handleMarkPaid}
        onDeleteMember={handleDeleteMember}
      />
    </main>
  )
}
