import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'

export async function GET() {
  const logs = await gymDB.getAuditLogs()
  return NextResponse.json({ success: true, data: logs })
}
