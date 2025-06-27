import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { term, organization_id } = await request.json()
    const apiKey = process.env.NEXT_PUBLIC_PIPEDRIVE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Pipedrive API key not set' }, { status: 500 })
    }
    let url = `https://brinca3.pipedrive.com/api/v2/persons/search?api_token=${apiKey}&term=${encodeURIComponent(term)}`
    if (organization_id) {
      url += `&organization_id=${organization_id}`
    }
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
} 