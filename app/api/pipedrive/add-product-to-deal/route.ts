import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { dealId, ...body } = await request.json()
    console.log("PIPEDRIVE_API_KEY:", process.env.PIPEDRIVE_API_KEY);
    const apiKey = process.env.PIPEDRIVE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Pipedrive API key not set' }, { status: 500 })
    }
    if (!dealId) {
      return NextResponse.json({ error: 'dealId is required' }, { status: 400 })
    }
    const res = await fetch(`https://brinca3.pipedrive.com/api/v2/deals/${dealId}/products?api_token=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
} 