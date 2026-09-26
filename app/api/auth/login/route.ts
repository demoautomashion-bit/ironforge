import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    const validEmail = process.env.ADMIN_EMAIL || 'admin@ironforge.pk'
    const validPassword = process.env.ADMIN_PASSWORD || 'admin_ironforge_2026'

    if (email === validEmail && password === validPassword) {
      const response = NextResponse.json({
        success: true,
        user: {
          name: 'Super Admin',
          email: validEmail,
          role: 'SUPER_ADMIN',
        },
      })

      // Set HttpOnly, SameSite cookie to defend against XSS & Session Hijacking
      response.cookies.set({
        name: 'iron_session',
        value: 'iron_admin_session_valid_' + Date.now(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days session
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

