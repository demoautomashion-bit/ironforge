'use client'

import { Search, X, Filter } from 'lucide-react'
import { Gender, Status } from '@/lib/types'

interface MemberFiltersProps {
  query: string
  setQuery: (q: string) => void
  gender: 'All' | Gender
  setGender: (g: 'All' | Gender) => void
  status: 'All' | Status
  setStatus: (s: 'All' | Status) => void
  totalCount: number
  filteredCount: number
}

export function MemberFilters({
  query,
  setQuery,
  gender,
  setGender,
  status,
  setStatus,
  totalCount,
  filteredCount,
}: MemberFiltersProps) {
  const statusOptions: ('All' | Status)[] = ['All', 'Active', 'Due Soon', 'Overdue']

  return (
    <div className="space-y-3.5">
      {/* Search & Gender Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Member Roster</h2>
          <p className="mt-0.5 text-xs text-white/40">
            Showing <span className="font-semibold text-white">{filteredCount}</span> of {totalCount} gym athletes
          </p>
        </div>

        {/* Gender Segmented Control */}
        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1 text-xs font-bold">
          {(['All', 'Male', 'Female'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setGender(item)}
              className={`flex-1 rounded-lg px-3 py-2 text-center transition-all ${
                gender === item
                  ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/10'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {item === 'All' ? 'All Genders' : item}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input & Status Pill Row */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone..."
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-9 text-sm text-white placeholder-white/30 transition outline-none focus:border-[#ccff00]/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#ccff00]/30"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1 text-xs font-semibold scrollbar-none">
          <span className="flex items-center gap-1 px-2.5 text-white/30 text-[11px]">
            <Filter className="size-3" /> Status:
          </span>
          {statusOptions.map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 transition-all ${
                status === item
                  ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
