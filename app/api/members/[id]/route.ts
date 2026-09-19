import { NextResponse } from 'next/server'
import { gymDB } from '@/lib/db-store'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/members/[id]
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const member = await gymDB.getMemberById(id)
  if (!member) {
    return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: member })
}

// PUT /api/members/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params
  try {
    const body = await request.json()
    const updated = await gymDB.updateMember(id, body)
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 })
  }
}

// DELETE /api/members/[id] (Soft Delete Safeguard)
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params
  const deleted = await gymDB.softDeleteMember(id)
  if (!deleted) {
    return NextResponse.json({ success: false, message: 'Member not found or already archived' }, { status: 404 })
  }
  return NextResponse.json({ success: true, message: 'Member archived successfully' })
}

