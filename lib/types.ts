export type Gender = 'Male' | 'Female'
export type Status = 'Active' | 'Due Soon' | 'Overdue'
export type PlanTier = 'Basic Gym' | 'Cardio + Gym' | 'VIP Personal Training' | 'Crossfit Special'

export interface Member {
  id: string
  name: string
  initials: string
  phone: string
  gender: Gender
  plan: PlanTier
  monthlyFee: number // in PKR
  joinDate: string
  paymentDate: string
  status: Status
  color: 'lime' | 'blue' | 'violet' | 'orange' | 'pink' | 'cyan'
}

export interface MetricData {
  label: string
  value: string
  subValue?: string
  change: string
  positive?: boolean
  color: 'lime' | 'yellow' | 'red' | 'sky'
}
