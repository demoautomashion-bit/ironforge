import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { currentPassword, newEmail, newPassword } = body || {}

    if (!currentPassword || !newEmail || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      )
    }

    const settings = await gymDB.getSettings()
    const activePassword = settings.adminPassword || process.env.ADMIN_PASSWORD || 'admin_ironforge_2026'

    // Verify current password
    if (currentPassword !== activePassword) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.' },
        { status: 401 }
      )
    }

    // Update credentials in database
    await gymDB.updateSettings({
      adminEmail: newEmail.trim(),
      adminPassword: newPassword.trim(),
    })

    await gymDB.logAudit('ADMIN_CREDENTIALS_CHANGED', `Admin updated login email to ${newEmail.trim()}`)

    return NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully.',
      data: {
        adminEmail: newEmail.trim(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update credentials.' },
      { status: 500 }
    )
  }
}
