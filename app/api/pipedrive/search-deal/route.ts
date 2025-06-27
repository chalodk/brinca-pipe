import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { owner_id, status = 'open', sort_by = 'add_time', sort_direction = 'desc', stage_id } = await request.json()
    const apiKey = process.env.NEXT_PUBLIC_PIPEDRIVE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Pipedrive API key not set' }, { status: 500 })
    }
    let url = `https://brinca3.pipedrive.com/api/v2/deals?api_token=${apiKey}`
    if (owner_id) url += `&owner_id=${owner_id}`
    if (status) url += `&status=${status}`
    if (sort_by) url += `&sort_by=${sort_by}`
    if (sort_direction) url += `&sort_direction=${sort_direction}`
    if (stage_id) url += `&stage_id=${stage_id}`
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
} 