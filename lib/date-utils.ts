import { Status } from './types'

export interface PaymentStatusInfo {
  status: Status
  daysElapsed: number
  daysRemaining: number
  nextDueDate: string
}

export function parsePaymentDate(dateStr: string): Date {
  if (!dateStr) return new Date()
  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) return parsed
  return new Date()
}

export function calculatePaymentStatus(paymentDateStr: string, cycleDays = 30): PaymentStatusInfo {
  const paymentDate = parsePaymentDate(paymentDateStr)
  const now = new Date()

  // Clear time portions for accurate calendar day difference
  const start = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const diffMs = today.getTime() - start.getTime()
  const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const dueDateObj = new Date(start.getTime() + cycleDays * 24 * 60 * 60 * 1000)
  const nextDueDate = dueDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  const daysRemaining = cycleDays - daysElapsed

  let status: Status = 'Active'
  if (daysElapsed > cycleDays) {
    status = 'Overdue'
  } else if (daysRemaining <= 7) {
    status = 'Due Soon'
  } else {
    status = 'Active'
  }

  return {
    status,
    daysElapsed,
    daysRemaining: daysRemaining < 0 ? 0 : daysRemaining,
    nextDueDate,
  }
}
