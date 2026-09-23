'use client'

import { useEffect, useState, useCallback } from 'react'
import { initialMembers } from '@/lib/mock-data'
import { Member, ThemeColor } from '@/lib/types'
import { Header } from '@/components/Header'
import { OverviewView } from '@/components/pages/OverviewView'
import { MembersView } from '@/components/pages/MembersView'
import { PaymentsView } from '@/components/pages/PaymentsView'
import { SettingsView } from '@/components/pages/SettingsView'
import { AddMemberDrawer } from '@/components/AddMemberDrawer'
import { AthleteProfileDrawer } from '@/components/AthleteProfileDrawer'
import { PaymentReceiptModal } from '@/components/PaymentReceiptModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { CommandPalette } from '@/components/CommandPalette'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { AuditLogDrawer } from '@/components/AuditLogDrawer'

export default function Page() {
  const [members, setMembers] = useState<Member[]>([])
  const [settings, setSettings] = useState({
    gymName: 'Iron District PK',
    location: 'Karachi, Pakistan',
    standardFee: 5000,
    treadmillFee: 7500,
    themeColor: 'lime' as ThemeColor,
  })
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [receiptMember, setReceiptMember] = useState<Member | null>(null)
  const [deleteModalMember, setDeleteModalMember] = useState<Member | null>(null)
  const [auditLogsOpen, setAuditLogsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [themeColor, setThemeColor] = useState<ThemeColor>('lime')

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Fetch settings from backend API
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setSettings(json.data)
          if (json.data.themeColor) setThemeColor(json.data.themeColor)
          try {
            localStorage.setItem('ironforge_settings', JSON.stringify(json.data))
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('Settings fetch fallback', e)
    }
  }, [])

  // Hydrate settings immediately from local cache on mount to prevent layout flash
  useEffect(() => {
    try {
      const cached = localStorage.getItem('ironforge_settings')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.gymName) {
          setSettings(parsed)
          if (parsed.themeColor) setThemeColor(parsed.themeColor)
        }
      }
    } catch (e) {}
  }, [])

  // Keep document theme attribute updated
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor)
  }, [themeColor])

  // Fetch roster from backend API
  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/members')
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setMembers(json.data)
        }
      }
    } catch (e) {
      console.warn('API fetch fallback to local state', e)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
    fetchMembers()
  }, [fetchSettings, fetchMembers])

  // Execute ACID payment transaction via API
  async function handleMarkPaid(id: string) {
    const target = members.find((m) => m.id === id)
    if (!target) return

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: id,
          amountPKR: target.monthlyFee,
          method: 'Cash',
        }),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          fetchMembers()
          showToast(`Fee marked as paid for ${target.name}!`)
          return
        }
      }
    } catch (e) {
      console.warn('Fallback local state payment update')
    }

    // Local fallback update
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
    showToast(`Fee marked as paid for ${target.name}!`)
  }

  // Register new member via API
  async function handleAddMember(newMemberData: Omit<Member, 'id'>) {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemberData),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          fetchMembers()
          showToast(`New member ${json.data.name} added successfully!`)
          return
        }
      }
    } catch (e) {
      console.warn('Fallback local state member addition')
    }

    const newMember: Member = {
      ...newMemberData,
      id: Date.now().toString(),
    }
    setMembers((prev) => [newMember, ...prev])
    showToast(`New member ${newMember.name} added successfully!`)
  }

  // Soft-delete member via API
  async function handleDeleteMember(id: string) {
    const target = members.find((m) => m.id === id)
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchMembers()
        showToast(`Removed ${target?.name || 'member'} from roster.`)
        return
      }
    } catch (e) {
      console.warn('Fallback local state member deletion')
    }

    setMembers((prev) => prev.filter((m) => m.id !== id))
    showToast(`Removed ${target?.name || 'member'} from roster.`)
  }

  return (
    <main data-theme={themeColor} className="min-h-screen bg-[#080a09] text-white pb-20 md:pb-12 font-sans selection:bg-theme-accent selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-theme-accent/40 bg-[#0d120f] px-5 py-2.5 text-xs font-bold text-theme-accent shadow-[0_0_30px_rgba(var(--brand-accent-rgb),0.25)] animate-in slide-in-from-top duration-300">
          ✨ {toastMessage}
        </div>
      )}

      {/* Navigation Header */}
      <div className="relative">
        <Header
          onOpenAddMember={() => setAddModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          unreadCount={members.filter((m) => m.status === 'Overdue').length}
          gymName={settings.gymName}
          location={settings.location}
        />

        {/* Notification Dropdown Popover */}
        <NotificationDropdown
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          members={members}
          onNavigateToPayments={() => setActiveTab('payments')}
        />
      </div>

      {/* Main View Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <OverviewView
            members={members}
            onNavigateToMembers={() => setActiveTab('members')}
            onOpenAddMember={() => setAddModalOpen(true)}
            gymName={settings.gymName}
            standardFee={settings.standardFee}
            treadmillFee={settings.treadmillFee}
          />
        )}

        {activeTab === 'members' && (
          <MembersView
            members={members}
            onMarkPaid={handleMarkPaid}
            onOpenActionSheet={(member) => setSelectedMember(member)}
            onOpenAddMember={() => setAddModalOpen(true)}
            onOpenDeleteModal={(member) => setDeleteModalMember(member)}
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
          <SettingsView
            onShowToast={showToast}
            currentTheme={themeColor}
            onThemeChange={(t) => setThemeColor(t)}
            onOpenAuditLogs={() => setAuditLogsOpen(true)}
            onSettingsSaved={(newSettings) => {
              setSettings(newSettings)
              setThemeColor(newSettings.themeColor)
              try {
                localStorage.setItem('ironforge_settings', JSON.stringify(newSettings))
              } catch (e) {}
            }}
          />
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberDrawer
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddMember={handleAddMember}
        standardFee={settings.standardFee}
        treadmillFee={settings.treadmillFee}
      />

      {/* Athlete Profile & Action Drawer */}
      <AthleteProfileDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onMarkPaid={handleMarkPaid}
        onDeleteMember={handleDeleteMember}
        onOpenReceipt={(member) => setReceiptMember(member)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        member={deleteModalMember}
        onClose={() => setDeleteModalMember(null)}
        onConfirmDelete={handleDeleteMember}
        gymName={settings.gymName}
      />

      {/* Digital Receipt Modal */}
      <PaymentReceiptModal
        member={receiptMember}
        onClose={() => setReceiptMember(null)}
        gymName={settings.gymName}
      />

      {/* System Audit Activity Log Drawer */}
      <AuditLogDrawer
        open={auditLogsOpen}
        onClose={() => setAuditLogsOpen(false)}
      />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        members={members}
        onSelectMember={(m) => setSelectedMember(m)}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    </main>
  )
}

