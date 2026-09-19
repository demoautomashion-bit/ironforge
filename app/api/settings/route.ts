import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'

export async function GET() {
  const settings = await gymDB.getSettings()
  return NextResponse.json({ success: true, data: settings })
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const updated = await gymDB.updateSettings(body)
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid settings payload' }, { status: 400 })
  }
}

