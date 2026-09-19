import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'
import { validatePayment } from '@/lib/validations'

// GET /api/payments
export async function GET() {
  const payments = await gymDB.getPayments()
  return NextResponse.json({ success: true, count: payments.length, data: payments })
}

// POST /api/payments (ACID Transaction Payment Handler)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = validatePayment(body)

    if (!validation.valid || !validation.data) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const { memberId, amountPKR, method } = validation.data

    const result = await gymDB.recordPayment(memberId, amountPKR, method)

    if (!result.success || !result.payment) {
      return NextResponse.json(
        { success: false, message: 'Member not found or payment execution failed.' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment executed atomically and receipt issued.',
        payment: result.payment,
        member: result.member,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

