"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSuccessProps {
  isLoading: boolean
  isSuccess: boolean
  loadingText?: string
  successText?: string
  className?: string
}

export function LoadingSuccess({
  isLoading,
  isSuccess,
  loadingText = "Cargando...",
  successText = "¡Operación exitosa!",
  className,
}: LoadingSuccessProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  if (!isLoading && !showSuccess) return null

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-md transition-all",
        isLoading ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700",
        className,
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-5 w-5" />
          <span>{successText}</span>
        </>
      )}
    </div>
  )
}
