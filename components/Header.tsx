'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Dumbbell, Menu, Plus, X, Users, CreditCard, LayoutDashboard, Settings, Search, Bell, LogOut } from 'lucide-react'

interface HeaderProps {
  onOpenAddMember: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenCommandPalette: () => void
  onToggleNotifications: () => void
  unreadCount?: number
  gymName?: string
  location?: string
}

export function Header({
  onOpenAddMember,
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  onToggleNotifications,
  unreadCount = 0,
  gymName = 'Iron Forge',
  location = 'Karachi, PK',
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (e) {
      console.error('Logout error', e)
    } finally {
      setLoggingOut(false)
    }
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'payments', label: 'Payments (PKR)', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#080a09]/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Gym Title */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-theme-accent text-theme-btn shadow-[0_0_25px_rgba(var(--brand-accent-rgb),0.25)] transition hover:scale-105">
              <Dumbbell className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-black tracking-tight text-white sm:text-lg uppercase">{gymName}</p>
                <span className="hidden rounded-full border border-theme-accent/30 bg-theme-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-theme-accent sm:inline-block">
                  {location}
                </span>
              </div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Gym Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-theme-accent text-theme-btn shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="relative flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Shortcut */}
            <button
              onClick={onOpenCommandPalette}
              title="Search athletes or navigate (Ctrl + K)"
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Search className="size-4 text-theme-accent" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/50 lg:inline">
                Ctrl K
              </kbd>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              title="Notifications & Dues Warnings"
              className="relative flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-theme-accent text-[9px] font-black text-theme-btn shadow-[0_0_8px_var(--brand-accent)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Add Member Button */}
            <button
              onClick={onOpenAddMember}
              className="flex h-10 items-center gap-2 rounded-xl bg-theme-accent px-3 text-xs font-bold text-theme-btn shadow-[0_0_20px_rgba(var(--brand-accent-rgb),0.25)] transition-all hover:bg-theme-accent-hover active:scale-95 sm:px-4"
            >
              <Plus className="size-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign Out of Admin Portal"
              className="flex size-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
            >
              <LogOut className="size-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>


        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.08] bg-[#0c0f0d] px-4 py-4 md:hidden animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-theme-accent/15 text-theme-accent border border-theme-accent/30'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/40 px-2">
              <span className="flex items-center gap-1.5 text-white/60">
                <Activity className="size-3.5 text-theme-accent" /> Live System Active
              </span>
              <span>{location}</span>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Navigation Bar for easy thumb access */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-white/10 bg-[#080a09]/95 px-2 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
                isActive ? 'text-theme-accent' : 'text-white/45 hover:text-white'
              }`}
            >
              <Icon className={`size-5 ${isActive ? 'scale-110 text-theme-accent' : ''}`} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
