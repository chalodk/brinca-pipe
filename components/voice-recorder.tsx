"use client"

import { useState } from "react"
import { Mic, Square } from "lucide-react"
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

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }

      setIsRecording(false)

      // Simulate transcription
      if (duration > 0) {
        setIsTranscribing(true)

        setTimeout(() => {
          setIsTranscribing(false)

          // Generate mock transcription based on duration
          const mockTranscriptions = [
            "Necesitamos una propuesta para mejorar el proceso de ventas.",
            "El cliente busca optimizar su plataforma de e-commerce y aumentar conversiones.",
            "Requieren una solución integral que incluya análisis de datos y automatización.",
            "La empresa está interesada en implementar un CRM personalizado para su equipo comercial.",
          ]

          const transcriptionIndex = Math.floor(Math.random() * mockTranscriptions.length)
          onTranscriptionComplete(mockTranscriptions[transcriptionIndex])
        }, 2000)
      }
    } else {
      // Start recording
      setIsRecording(true)
      setDuration(0)

      const id = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)

      setIntervalId(id)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        size="icon"
        onClick={toggleRecording}
        disabled={isTranscribing}
        className={cn("transition-all", isRecording && "animate-pulse")}
      >
        {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      {isRecording && <span className="text-sm font-medium text-red-500">Grabando... {formatDuration(duration)}</span>}

      {!isRecording && duration > 0 && !isTranscribing && (
        <span className="text-sm text-muted-foreground">Duración: {formatDuration(duration)}</span>
      )}

      {isTranscribing && <span className="text-sm font-medium text-blue-500">Transcribiendo...</span>}
    </div>
  )
}
