import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    // Convert File to Buffer for OpenAI API
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())

    // Create a File object for the OpenAI SDK
    const file = new File([audioBuffer], 'audio.webm', { type: audioFile.type || 'audio/webm' })

    // Call OpenAI Whisper API using the SDK
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'es',
    })

    return NextResponse.json({
      text: transcription.text,
    })

  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || error },
      { status: 500 }
    )
  }
} 