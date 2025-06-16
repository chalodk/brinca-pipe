"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VoiceTextArea } from "@/components/voice-text-area"
import { LoadingSuccess } from "@/components/loading-success"
import { useStore } from "@/store/store"
import type { Proposal } from "@/store/store"

interface ReviewProposalModalProps {
  proposal: Proposal
  isOpen: boolean
  onClose: () => void
}

export function ReviewProposalModal({ proposal, isOpen, onClose }: ReviewProposalModalProps) {
  const { updateProposalStatus } = useStore()
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "feedback" | null>(null)

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() && actionType === "feedback") {
      return
    }

    setIsLoading(true)
    setActionType(actionType)

    try {
      if (actionType === "approve") {
        await updateProposalStatus(proposal.id, "completed", proposal.budgetStatus, "Propuesta aprobada")
      } else {
        await updateProposalStatus(proposal.id, "adjustment_pending", proposal.budgetStatus, feedback)
      }

      setIsSuccess(true)

      // Cerrar el modal después de un tiempo
      setTimeout(() => {
        onClose()
        setFeedback("")
        setIsLoading(false)
        setIsSuccess(false)
        setActionType(null)
      }, 2000)
    } catch (error) {
      console.error("Error al actualizar propuesta:", error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revisar propuesta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <h3 className="font-medium">{proposal.dealName}</h3>
          <p className="text-sm text-muted-foreground">
            Esta propuesta está lista para tu revisión. Puedes aprobarla o enviar feedback para ajustes.
          </p>

          <VoiceTextArea
            id="feedback"
            label="Feedback (requerido para solicitar ajustes)"
            placeholder="Escribe tu feedback para el equipo de propuestas..."
            value={feedback}
            onChange={setFeedback}
          />

          <LoadingSuccess
            isLoading={isLoading}
            isSuccess={isSuccess}
            loadingText={actionType === "approve" ? "Aprobando propuesta..." : "Enviando feedback..."}
            successText={actionType === "approve" ? "¡Propuesta aprobada con éxito!" : "¡Feedback enviado con éxito!"}
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setActionType("feedback")
              handleSubmitFeedback()
            }}
            disabled={isLoading || isSuccess || !feedback.trim()}
            className="w-full sm:w-auto"
          >
            Enviar feedback para ajuste
          </Button>
          <Button
            type="button"
            onClick={() => {
              setActionType("approve")
              handleSubmitFeedback()
            }}
            disabled={isLoading || isSuccess}
            className="w-full sm:w-auto"
          >
            Está lista
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
