export type Gender = 'Male' | 'Female'
export type Status = 'Active' | 'Due Soon' | 'Overdue'
export type PlanTier = 'Standard Gym' | 'Treadmill Pro'
export type ThemeColor = 'lime' | 'cyan' | 'orange' | 'violet'

export interface Member {
  id: string
  name: string
  initials: string
  phone?: string
  gender: Gender
  plan: PlanTier
  monthlyFee: number // in PKR
  joinDate: string
  paymentDate: string
  status: Status
  color: 'lime' | 'blue' | 'violet' | 'orange' | 'pink' | 'cyan'
  photoUrl?: string
}

export interface MetricData {
  label: string
  value: string
  subValue?: string
  change: string
  positive?: boolean
  color: 'lime' | 'yellow' | 'red' | 'sky'
}

export interface ActivityItem {
  id: string
  title: string
  subtitle: string
  timestamp: string
  type: 'payment' | 'join' | 'warning' | 'plan'
}

export interface Receipt {
  receiptId: string
  memberName: string
  plan: PlanTier
  monthlyFee: number
  paymentDate: string
  status: Status
  paymentMethod: string
}


