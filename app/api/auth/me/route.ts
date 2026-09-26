import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('iron_session')?.value

  if (sessionToken && sessionToken.startsWith('iron_admin_session_valid_')) {
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL || 'admin@ironforge.pk',
        role: 'SUPER_ADMIN',
      },
    })
  }

  return NextResponse.json(
    { success: false, authenticated: false, message: 'Not authenticated' },
    { status: 401 }
  )
}
