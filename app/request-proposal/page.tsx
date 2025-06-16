"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { VoiceTextArea } from "@/components/voice-text-area"
import { LoadingSuccess } from "@/components/loading-success"
import { ProtectedRoute } from "@/components/protected-route"
import { useStore } from "@/store/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RequestProposalPage() {
  const router = useRouter()
  const { deals, addProposal } = useStore()

  const [activeTab, setActiveTab] = useState("context")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)

  const [formData, setFormData] = useState({
    dealId: "",
    dealName: "",
    context: {
      businessContext: "",
      clientNeeds: "",
      expectedResults: "",
    },
    ideas: {
      // "ideas" se refiere a los servicios seleccionados
      selectedIdeas: [] as string[],
      additionalIdeas: "",
      implementationIdeas: "",
    },
    pAndP: {
      potential: "medium" as "high" | "medium" | "low",
      estimatedValue: null as number | null,
      probability: null as number | null,
      optimalDeliveryDate: null as string | null,
    },
  })

  const handleTextChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handlePAndPChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({
      ...prev,
      pAndP: {
        ...prev.pAndP,
        [field]: value,
      },
    }))
  }

  const handleDealChange = (dealId: string) => {
    const selectedDeal = deals.find((deal) => deal.id === dealId)

    if (selectedDeal) {
      setFormData((prev) => ({
        ...prev,
        dealId: selectedDeal.id,
        dealName: selectedDeal.name,
      }))
    }
  }

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const currentServices = prev.ideas.selectedIdeas

      return {
        ...prev,
        ideas: {
          ...prev.ideas,
          selectedIdeas: currentServices.includes(service)
            ? currentServices.filter((s) => s !== service)
            : [...currentServices, service],
        },
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await addProposal({
        ...formData,
        // budgetStatus se puede manejar internamente o eliminar si ya no es relevante
      })

      setIsSuccess(true)

      setTimeout(() => {
        router.push("/proposal-status")
      }, 2000)
    } catch (error) {
      console.error("Error al solicitar propuesta:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "context") setActiveTab("services")
    else if (activeTab === "services") setActiveTab("p&p")
  }

  const prevTab = () => {
    if (activeTab === "services") setActiveTab("context")
    else if (activeTab === "p&p") setActiveTab("services")
  }

  const possibleServices = [
    "E - Planificación Estratégica",
    "E - Pensamiento integrativo para líderes",
    "E - Acompañamiento para decisiones estratégicas",
    "E - Research: Estudios B2B",
    "E - Research: Estudio de tendencias",
    "E - Research: Estudios CX",
    "I - Diagnóstico C3: Full",
    "I - Diagnóstico C3: Gestión de innovación",
    "I - Diagnóstico C3: C-Level",
    "I - Campañas de ideas: Nivel Compañía",
    "I - Campañas de ideas: Focalizada en áreas / talentos",
    "I - Campañas de ideas: Hackatones",
    "I - Asesorías de Portafolio",
    "I - Potenciamiento de proyectos",
    "I - Gestión del cambio para proyectos estratégicos",
    "I - Innovación abierta: Scouting rápido",
    "I - Innovación abierta: Venture client",
    "I - Innovación 360°",
    "I - Deep Needfinding y ODI",
    "CI - Evaluación de cultura de innovación C3",
    "CI - Campañas de ideas (Cultura)",
    "CI - Hackatones (Cultura)",
    "CI - Talleres culturales",
    "CI - Encuestas culturales",
    "CI - Experiencias in-situ",
    "CI - Programas de Embajadores de innovación",
    "CI - Capacitación en Innovación",
    "CI - Capacitación en Agilidad",
    "CI - Capacitación en Metodologías",
    "C - Programas a medida de transformación cultural",
    "C - Diseño ad-hoc de modelos de cultura corporativa",
  ]

  return (
    <ProtectedRoute>
      <div className="py-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Propuesta</CardTitle>
            <CardDescription>
              Proporciona la información necesaria para el desarrollo de una propuesta comercial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <Label htmlFor="dealId">Selecciona un trato</Label>
                <Select value={formData.dealId} onValueChange={handleDealChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un trato" />
                  </SelectTrigger>
                  <SelectContent>
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <SelectItem key={deal.id} value={deal.id}>
                          {deal.name} - {deal.company}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-deals" disabled>
                        No hay tratos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {deals.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    Primero debes crear un trato en la sección "Nuevo Trato"
                  </p>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="context">Contexto</TabsTrigger>
                  <TabsTrigger value="services">Servicios</TabsTrigger>
                  <TabsTrigger value="p&p">P & P</TabsTrigger>
                </TabsList>

                <TabsContent value="context" className="space-y-4">
                  <VoiceTextArea
                    id="businessContext"
                    label="Contexto del negocio"
                    placeholder="Describe el contexto actual del negocio del cliente"
                    value={formData.context.businessContext}
                    onChange={(value) => handleTextChange("context", "businessContext", value)}
                  />

                  <VoiceTextArea
                    id="clientNeeds"
                    label="Necesidades del cliente"
                    placeholder="¿Cuáles son las principales necesidades o problemas del cliente?"
                    value={formData.context.clientNeeds}
                    onChange={(value) => handleTextChange("context", "clientNeeds", value)}
                  />

                  <VoiceTextArea
                    id="expectedResults"
                    label="Resultados esperados"
                    placeholder="¿Qué resultados espera obtener el cliente?"
                    value={formData.context.expectedResults}
                    onChange={(value) => handleTextChange("context", "expectedResults", value)}
                  />

                  <div className="flex justify-end mt-4">
                    <Button type="button" onClick={nextTab}>
                      Siguiente
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selecciona los servicios que aplican</Label>

                    <div className="border rounded-md p-3 mb-2">
                      {formData.ideas.selectedIdeas.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.ideas.selectedIdeas.map((service) => (
                            <div
                              key={service}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              {service}
                              <button
                                type="button"
                                onClick={() => handleCheckboxChange(service)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-x"
                                >
                                  <path d="M18 6 6 18"></path>
                                  <path d="m6 6 12 12"></path>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay servicios seleccionados</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex justify-between items-center"
                      onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                    >
                      <span>Seleccionar servicios</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${showServicesDropdown ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </Button>

                    {showServicesDropdown && (
                      <div className="border rounded-md p-4 max-h-60 overflow-y-auto shadow-md">
                        <p className="text-xs text-muted-foreground mb-2">Desplázate para ver todas las opciones</p>
                        {possibleServices.map((service) => (
                          <div key={service} className="flex items-start space-x-2 py-2">
                            <Checkbox
                              id={service}
                              checked={formData.ideas.selectedIdeas.includes(service)}
                              onCheckedChange={() => handleCheckboxChange(service)}
                            />
                            <Label htmlFor={service} className="font-normal">
                              {service}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <VoiceTextArea
                    id="additionalIdeas"
                    label="Servicios adicionales"
                    placeholder="¿Tienes alguna idea adicional que no esté en la lista?"
                    value={formData.ideas.additionalIdeas}
                    onChange={(value) => handleTextChange("ideas", "additionalIdeas", value)}
                  />

                  <VoiceTextArea
                    id="implementationIdeas"
                    label="Ideas de implementación de servicios"
                    placeholder="¿Cómo crees que se deberían implementar estas ideas?"
                    value={formData.ideas.implementationIdeas}
                    onChange={(value) => handleTextChange("ideas", "implementationIdeas", value)}
                  />

                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Anterior
                    </Button>
                    <Button type="button" onClick={nextTab}>
                      Siguiente
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="p&p" className="space-y-6">
                  <div className="space-y-2">
                    <Label>¿Este es un cliente de alto potencial?</Label>
                    <RadioGroup
                      value={formData.pAndP.potential}
                      onValueChange={(value) => handlePAndPChange("potential", value as "high" | "medium" | "low")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="potential-high" />
                        <Label htmlFor="potential-high" className="font-normal">
                          Alto
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="potential-medium" />
                        <Label htmlFor="potential-medium" className="font-normal">
                          Medio
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="potential-low" />
                        <Label htmlFor="potential-low" className="font-normal">
                          Bajo
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedValue">¿Cuánto es el valor que estimas de este trato?</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      placeholder="Ej: 50000"
                      value={formData.pAndP.estimatedValue === null ? "" : formData.pAndP.estimatedValue}
                      onChange={(e) =>
                        handlePAndPChange(
                          "estimatedValue",
                          e.target.value === "" ? null : Number.parseFloat(e.target.value),
                        )
                      }
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probability">¿Cuál es la probabilidad que estimas de este trato? (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      placeholder="Ej: 75"
                      value={formData.pAndP.probability === null ? "" : formData.pAndP.probability}
                      onChange={(e) =>
                        handlePAndPChange(
                          "probability",
                          e.target.value === "" ? null : Number.parseInt(e.target.value, 10),
                        )
                      }
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optimalDeliveryDate">¿Cuál es la fecha óptima de entrega de propuesta?</Label>
                    <Input
                      id="optimalDeliveryDate"
                      type="date"
                      value={formData.pAndP.optimalDeliveryDate || ""}
                      onChange={(e) => handlePAndPChange("optimalDeliveryDate", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Anterior
                    </Button>
                    <Button type="submit" disabled={isLoading || isSuccess || !formData.dealId}>
                      Pedir propuesta
                    </Button>
                  </div>

                  <LoadingSuccess
                    isLoading={isLoading}
                    isSuccess={isSuccess}
                    loadingText="Enviando solicitud..."
                    successText="¡Propuesta solicitada con éxito!"
                    className="mt-4"
                  />
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
