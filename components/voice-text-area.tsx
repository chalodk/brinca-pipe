"use client"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { VoiceRecorder } from "./voice-recorder"

interface VoiceTextAreaProps {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function VoiceTextArea({ id, label, placeholder, value, onChange, className }: VoiceTextAreaProps) {
  const handleTranscriptionComplete = (text: string) => {
    onChange(value ? `${value}\n${text}` : text)
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor={id}>{label}</Label>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      </div>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
      />
    </div>
  )
}
