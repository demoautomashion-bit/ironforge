'use client'

import { useEffect, useState } from 'react'
import { X, ShieldCheck, Activity, RefreshCw } from 'lucide-react'

interface AuditLog {
  id: string
  action: string
  details: string
  timestamp: string
}

interface AuditLogDrawerProps {
  open: boolean
  onClose: () => void
}

export function AuditLogDrawer({ open, onClose }: AuditLogDrawerProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchLogs() {
    setLoading(true)
    try {
      const res = await fetch('/api/audit')
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setLogs(json.data)
        }
      }
    } catch (e) {
      console.warn('Audit fetch error', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchLogs()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="System Audit Activity Logs"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md transition-all p-0 sm:p-4 sm:items-center animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl rounded-t-3xl border-t border-white/15 bg-[#111513] p-6 shadow-2xl sm:rounded-3xl sm:border border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Mobile handle indicator */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        {/* Top Header */}
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-theme-accent/15 text-theme-accent border border-theme-accent/30">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Database Audit Logs</h2>
              <p className="text-xs text-white/40">Real-time system security & ACID audit records</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              title="Refresh logs"
              className="rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              aria-label="Close drawer"
              onClick={onClose}
              className="rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Audit Log Content List */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/40">
              No audit logs recorded yet. System activities will appear here in real time.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs transition hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-theme-accent/30 bg-theme-accent/10 px-2 py-0.5 text-[10px] font-mono font-bold text-theme-accent uppercase">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-medium text-white/40 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-white/90">{log.details}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
