import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'

export async function GET() {
  const stats = await gymDB.getStats()
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: stats,
  })
}

