import { Member } from './types'

export const initialMembers: Member[] = []

export const avatarColors: Record<string, string> = {
  lime: 'bg-lime-400/20 text-lime-400 border border-lime-500/30',
  blue: 'bg-sky-400/20 text-sky-400 border border-sky-500/30',
  violet: 'bg-violet-400/20 text-violet-400 border border-violet-500/30',
  orange: 'bg-orange-400/20 text-orange-400 border border-orange-500/30',
  pink: 'bg-pink-400/20 text-pink-400 border border-pink-500/30',
  cyan: 'bg-cyan-400/20 text-cyan-400 border border-cyan-500/30',
}

export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount).replace('PKR', 'Rs.')
}
