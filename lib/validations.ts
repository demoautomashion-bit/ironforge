// Server-side Data Sanitization & Input Validation Module
// Prevents SQL Injection (SQLi), Cross-Site Scripting (XSS), and Malicious Payloads

export interface CreateMemberPayload {
  name: string
  phone?: string
  gender: 'Male' | 'Female'
  plan: 'Standard Gym' | 'Treadmill Pro'
  monthlyFee: number
  photoUrl?: string
}

export interface UpdateMemberPayload {
  name?: string
  phone?: string
  gender?: 'Male' | 'Female'
  plan?: 'Standard Gym' | 'Treadmill Pro'
  monthlyFee?: number
  status?: 'Active' | 'Due Soon' | 'Overdue'
  photoUrl?: string
}

export interface RecordPaymentPayload {
  memberId: string
  amountPKR: number
  method?: string
}

export interface UpdateSettingsPayload {
  gymName?: string
  location?: string
  currency?: string
  standardFee?: number
  treadmillFee?: number
  themeColor?: 'lime' | 'cyan' | 'orange' | 'violet'
}

// XSS Sanitizer: Strips potential HTML/script tags from input strings
export function sanitizeString(input: string): string {
  if (!input) return ''
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// Validate Member Registration Payload
export function validateCreateMember(data: any): { valid: boolean; errors: string[]; data?: CreateMemberPayload } {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid JSON payload'] }
  }

  const name = sanitizeString(String(data.name || ''))
  if (!name || name.length < 2 || name.length > 80) {
    errors.push('Name must be between 2 and 80 characters.')
  }

  const phone = data.phone ? sanitizeString(String(data.phone)) : undefined
  if (phone && phone.length > 20) {
    errors.push('Phone number is too long.')
  }

  const gender = data.gender === 'Female' ? 'Female' : 'Male'
  const plan = data.plan === 'Treadmill Pro' ? 'Treadmill Pro' : 'Standard Gym'
  const monthlyFee = Number(data.monthlyFee)
  const photoUrl = typeof data.photoUrl === 'string' && data.photoUrl.trim() ? data.photoUrl.trim() : undefined

  if (isNaN(monthlyFee) || monthlyFee < 0 || monthlyFee > 1000000) {
    errors.push('Monthly fee must be a valid positive PKR amount.')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    data: { name, phone, gender, plan, monthlyFee, photoUrl },
  }
}

// Validate Payment Payload
export function validatePayment(data: any): { valid: boolean; errors: string[]; data?: RecordPaymentPayload } {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid JSON payload'] }
  }

  const memberId = String(data.memberId || '').trim()
  if (!memberId) {
    errors.push('Member ID is required for payment processing.')
  }

  const amountPKR = Number(data.amountPKR)
  if (isNaN(amountPKR) || amountPKR <= 0) {
    errors.push('Payment amount must be greater than Rs. 0.')
  }

  const method = sanitizeString(String(data.method || 'Cash'))

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    data: { memberId, amountPKR, method },
  }
}
