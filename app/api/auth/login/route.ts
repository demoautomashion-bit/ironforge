import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    const settings = await gymDB.getSettings()

    const validEmail = settings.adminEmail || process.env.ADMIN_EMAIL || 'admin@ironforge.pk'
    const validPassword = settings.adminPassword || process.env.ADMIN_PASSWORD || 'admin_ironforge_2026'

    if (email === validEmail && password === validPassword) {
      const response = NextResponse.json({
        success: true,
        user: {
          name: 'Super Admin',
          email: validEmail,
          role: 'SUPER_ADMIN',
        },
      })

      // Set HttpOnly, SameSite Session Cookie (Omit maxAge so it clears when browser/tab closes)
      response.cookies.set({
        name: 'iron_session',
        value: 'iron_admin_session_valid_' + Date.now(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Bad request' },
      { status: 400 }
    )
  }
}

