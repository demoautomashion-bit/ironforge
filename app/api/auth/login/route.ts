import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    // Simulated secure credential verification
    if (email === 'admin@irondistrict.pk' && password === 'admin123') {
      const response = NextResponse.json({
        success: true,
        user: {
          name: 'Super Admin',
          email: 'admin@irondistrict.pk',
          role: 'SUPER_ADMIN',
        },
      })

      // Set HttpOnly, SameSite cookie to defend against XSS & Session Hijacking
      response.cookies.set({
        name: 'iron_session',
        value: 'session_token_sec_' + Date.now(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
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
