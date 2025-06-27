"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/store/store"
import { LoadingSuccess } from "@/components/loading-success"

export default function LoginPage() {
  const router = useRouter()
  const { login, setUserId } = useStore()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/pipedrive/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (Array.isArray(data.data) && data.data.length > 0 && data.data[0].id) {
        setIsLoading(false)
        setIsSuccess(true)
        setUserId(data.data[0].id)
        login()
        setTimeout(() => {
          router.push("/home")
        }, 1000)
      } else {
        setIsLoading(false)
        setError("Usuario no encontrado")
      }
    } catch (err) {
      setIsLoading(false)
      setError("Error de conexión. Intenta de nuevo.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">CRM móvil Brinca</CardTitle>
          <CardDescription>inicia sesión para solicitar y revisar status de propuestas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isSuccess}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isSuccess || !email}>
              Ingresar
            </Button>
            {error && (
              <div className="text-red-500 text-center text-sm mt-2">{error}</div>
            )}
            <LoadingSuccess
              isLoading={isLoading}
              isSuccess={isSuccess}
              loadingText="Autenticando..."
              successText="¡Autenticación exitosa!"
              className="mt-4"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
