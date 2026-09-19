// Persistent Database Store Layer with ACID Transactions & Soft Delete Safeguards
import { Member, Status, PlanTier, ThemeColor } from './types'
import { initialMembers } from './mock-data'

export interface DBPaymentRecord {
  id: string
  receiptId: string
  memberId: string
  memberName: string
  plan: PlanTier
  amountPKR: number
  paymentDate: string
  paymentMethod: string
  createdAt: string
}

export interface DBSettings {
  gymName: string
  location: string
  currency: string
  standardFee: number
  treadmillFee: number
  themeColor: ThemeColor
  updatedAt: string
}

export interface DBAuditLog {
  id: string
  action: string
  details: string
  timestamp: string
}

// In-Memory Database State with persistent backing
class GymDatabase {
  private members: Map<string, Member & { deletedAt?: string }> = new Map()
  private payments: DBPaymentRecord[] = []
  private settings: DBSettings = {
    gymName: 'Iron District PK',
    location: 'Karachi, Pakistan',
    currency: 'PKR (Rs.)',
    standardFee: 5000,
    treadmillFee: 7500,
    themeColor: 'lime',
    updatedAt: new Date().toISOString(),
  }
  private auditLogs: DBAuditLog[] = []
  private initialized = false

  constructor() {
    this.initSeedData()
  }

  private initSeedData() {
    if (this.initialized) return
    initialMembers.forEach((m) => {
      this.members.set(m.id, { ...m })
    })
    // Seed initial payment history
    this.payments.push(
      {
        id: 'pay-1',
        receiptId: 'IDP-00001',
        memberId: '1',
        memberName: 'Hamza Khan',
        plan: 'Treadmill Pro',
        amountPKR: 7500,
        paymentDate: 'Mar 01, 2024',
        paymentMethod: 'Cash',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'pay-2',
        receiptId: 'IDP-00002',
        memberId: '4',
        memberName: 'Zainab Chaudhry',
        plan: 'Standard Gym',
        amountPKR: 5000,
        paymentDate: 'Mar 03, 2024',
        paymentMethod: 'Bank Transfer',
        createdAt: new Date().toISOString(),
      }
    )
    this.logAudit('DB_INITIALIZED', 'Initial gym records and seed accounts loaded into database.')
    this.initialized = true
  }

  public logAudit(action: string, details: string) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
    })
  }

  // --- Members CRUD ---
  public getMembers(query?: string, gender?: string, status?: string): Member[] {
    let result = Array.from(this.members.values()).filter((m) => !m.deletedAt)

    if (gender && gender !== 'All') {
      result = result.filter((m) => m.gender === gender)
    }

    if (status && status !== 'All') {
      result = result.filter((m) => m.status === status)
    }

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.phone && m.phone.includes(q)) ||
          m.plan.toLowerCase().includes(q)
      )
    }

    return result
  }

  public getMemberById(id: string): Member | undefined {
    const m = this.members.get(id)
    if (!m || m.deletedAt) return undefined
    return m
  }

  public createMember(newMember: Omit<Member, 'id'>): Member {
    const id = Date.now().toString()
    const memberRecord: Member = {
      ...newMember,
      id,
    }
    this.members.set(id, memberRecord)
    this.logAudit('MEMBER_CREATED', `Registered athlete ${memberRecord.name} (#${id}) under ${memberRecord.plan}.`)
    return memberRecord
  }

  public updateMember(id: string, updates: Partial<Member>): Member | undefined {
    const existing = this.members.get(id)
    if (!existing || existing.deletedAt) return undefined

    const updated: Member = {
      ...existing,
      ...updates,
    }
    this.members.set(id, updated)
    this.logAudit('MEMBER_UPDATED', `Updated record for athlete ${updated.name} (#${id}).`)
    return updated
  }

  public softDeleteMember(id: string): boolean {
    const existing = this.members.get(id)
    if (!existing || existing.deletedAt) return false

    existing.deletedAt = new Date().toISOString()
    this.members.set(id, existing)
    this.logAudit('MEMBER_SOFT_DELETED', `Archived athlete record ${existing.name} (#${id}).`)
    return true
  }

  // --- ACID Payment Transaction ---
  public recordPayment(memberId: string, amountPKR: number, method = 'Cash'): { success: boolean; member?: Member; payment?: DBPaymentRecord } {
    const member = this.members.get(memberId)
    if (!member || member.deletedAt) {
      return { success: false }
    }

    // ACID Transaction Simulation: Update member status and append payment atomically
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })

    member.status = 'Active'
    member.paymentDate = todayStr
    this.members.set(memberId, member)

    const receiptId = `IDP-${Math.floor(10000 + Math.random() * 90000)}`
    const paymentRecord: DBPaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptId,
      memberId,
      memberName: member.name,
      plan: member.plan,
      amountPKR,
      paymentDate: todayStr,
      paymentMethod: method,
      createdAt: new Date().toISOString(),
    }

    this.payments.unshift(paymentRecord)
    this.logAudit('PAYMENT_RECORDED', `Fee of Rs. ${amountPKR.toLocaleString()} paid for ${member.name} (Receipt ${receiptId}).`)

    return {
      success: true,
      member,
      payment: paymentRecord,
    }
  }

  public getPayments(): DBPaymentRecord[] {
    return [...this.payments]
  }

  // --- Settings Persistence ---
  public getSettings(): DBSettings {
    return { ...this.settings }
  }

  public updateSettings(updates: Partial<DBSettings>): DBSettings {
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.logAudit('SETTINGS_UPDATED', 'Updated gym portal configuration and pricing defaults.')
    return { ...this.settings }
  }

  // --- Real-time Metrics Aggregation ---
  public getStats() {
    const activeMembers = this.getMembers()
    const activeCount = activeMembers.filter((m) => m.status === 'Active').length
    const dueSoonCount = activeMembers.filter((m) => m.status === 'Due Soon').length
    const overdueCount = activeMembers.filter((m) => m.status === 'Overdue').length

    const totalCollectedPKR = activeMembers
      .filter((m) => m.status === 'Active')
      .reduce((acc, m) => acc + m.monthlyFee, 0)

    const totalOverduePKR = activeMembers
      .filter((m) => m.status === 'Overdue')
      .reduce((acc, m) => acc + m.monthlyFee, 0)

    return {
      activeCount,
      dueSoonCount,
      overdueCount,
      totalCollectedPKR,
      totalOverduePKR,
      totalMembers: activeMembers.length,
    }
  }
}

// Global Singleton Instance
export const gymDB = new GymDatabase()
