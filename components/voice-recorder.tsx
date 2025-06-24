"use client"

import { useState, useRef, useCallback } from "react"
import { Mic, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void
  className?: string
}

export function VoiceRecorder({ onTranscriptionComplete, className }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      const id = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)

      setIntervalId(id)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('No se pudo acceder al micrófono. Verifica los permisos.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    
    setIsRecording(false)
  }, [isRecording, intervalId])

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error en la transcripción')
      }

      const data = await response.json()
      
      if (data.text) {
        onTranscriptionComplete(data.text)
      } else {
        throw new Error('No se pudo transcribir el audio')
      }
    } catch (err) {
      console.error('Transcription error:', err)
      setError('Error al transcribir el audio. Intenta de nuevo.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        size="icon"
        onClick={toggleRecording}
        disabled={isTranscribing}
        className={cn(
          "transition-all relative",
          isRecording && "animate-pulse ring-2 ring-red-500 ring-opacity-50"
        )}
      >
        {isTranscribing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRecording ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {isRecording && (
        <span className="text-sm font-medium text-red-500">
          Grabando... {formatDuration(duration)}
        </span>
      )}

      {!isRecording && duration > 0 && !isTranscribing && (
        <span className="text-sm text-muted-foreground">
          Duración: {formatDuration(duration)}
        </span>
      )}

      {isTranscribing && (
        <span className="text-sm font-medium text-blue-500">
          Transcribiendo...
        </span>
      )}

      {error && (
        <span className="text-sm font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  )
}
