import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'
import { validateCreateMember } from '@/lib/validations'

// GET /api/members?query=...&gender=...&status=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || undefined
    const gender = searchParams.get('gender') || undefined
    const status = searchParams.get('status') || undefined

    const members = await gymDB.getMembers(query, gender, status)
    return NextResponse.json({ success: true, count: members.length, data: members })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch members' }, { status: 500 })
  }
}

// POST /api/members (Create new athlete with XSS & SQLi validation)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = validateCreateMember(body)

    if (!validation.valid || !validation.data) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const { name, phone, gender, plan, monthlyFee } = validation.data

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'NA'

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })

    const colors = ['lime', 'blue', 'violet', 'orange', 'pink', 'cyan'] as const
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newMember = await gymDB.createMember({
      name,
      initials,
      phone,
      gender,
      plan,
      monthlyFee,
      joinDate: todayStr,
      paymentDate: todayStr,
      status: 'Active',
      color: randomColor,
    })

    return NextResponse.json({ success: true, data: newMember }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
