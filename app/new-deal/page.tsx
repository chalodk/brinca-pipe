"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { LoadingSuccess } from "@/components/loading-success"
import { useStore } from "@/store/store"

export default function NewDealPage() {
  const router = useRouter()
  const { addDeal } = useStore()

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contact: "",
    position: "",
    profitCenter: "",
    source: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await addDeal(formData)
      setIsSuccess(true)

      // Redireccionar después de éxito
      setTimeout(() => {
        router.push("/home")
      }, 2000)
    } catch (error) {
      console.error("Error al crear trato:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const profitCenters = [
    "Estrategia, Innovación y Cultura",
    "Sostenibilidad",
    "Gestión Tecnológica",
    "IA e hiperproductividad",
  ]

  const sources = [
    "Recomendado",
    "Hunting",
    "Campaña outbound",
    "Evento de relacionamiento",
    "Cliente antiguo",
    "Cross-selling de Grupo MMC",
  ]

  return (
    <ProtectedRoute>
      <div className="py-6">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Trato</CardTitle>
            <CardDescription>Registra una nueva oportunidad en el CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del trato</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej: Implementación CRM para Empresa XYZ"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Nombre de la empresa"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contacto</Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="Nombre del contacto"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Cargo del contacto"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profitCenter">Profit Center</Label>
                <Select
                  value={formData.profitCenter}
                  onValueChange={(value) => handleSelectChange("profitCenter", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un profit center" />
                  </SelectTrigger>
                  <SelectContent>
                    {profitCenters.map((center) => (
                      <SelectItem key={center} value={center}>
                        {center}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Fuente</Label>
                <Select value={formData.source} onValueChange={(value) => handleSelectChange("source", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
                Agregar a mi Pipedrive
              </Button>

              <LoadingSuccess
                isLoading={isLoading}
                isSuccess={isSuccess}
                loadingText="Agregando trato..."
                successText="¡Trato agregado con éxito!"
                className="mt-4"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
