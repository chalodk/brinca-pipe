import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    const apiKey = process.env.PIPEDRIVE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Pipedrive API key not set' }, { status: 500 })
    }
    const res = await fetch(`https://brinca3.pipedrive.com/v1/users/${id}?api_token=${apiKey}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    console.log("Pipedrive API response for user:", id, "Status:", res.status)
    console.log("User data:", data)
    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
