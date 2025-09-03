"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { LoadingSuccess } from "@/components/loading-success"
import { useStore } from "@/store/store"
import { sendDealWebhook } from "@/lib/webhook"

// Type for search results based on the API response structure
type CompanySearchResult = {
  result_score: number
  item: {
    id: number
    type: string
    name: string
    address: string | null
    visible_to: number
    owner: {
      id: number
    }
    custom_fields: any[]
    notes: any[]
  }
}

// Type for contact search results
type ContactSearchResult = {
  result_score: number
  item: {
    id: number
    type: string
    name: string
    email?: string[]
    phone?: string[]
    visible_to: number
    owner: {
      id: number
    }
    custom_fields: any[]
    notes: any[]
  }
}

export default function NewDealPage() {
  const router = useRouter()
  const { addDeal } = useStore()
  const userId = useStore((state) => state.userId)

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contact: "",
    email: "",
    position: "",
    profitCenter: "",
    source: "",
  })

  // Store the selected company ID separately
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  // Store the selected contact ID separately
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingContact, setIsSearchingContact] = useState(false)
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([])
  const [contactSearchResults, setContactSearchResults] = useState<ContactSearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showContactResults, setShowContactResults] = useState(false)
  const [isCreatingContact, setIsCreatingContact] = useState(false)

  const [sourceOptions, setSourceOptions] = useState<{ id: number; label: string }[]>([])
  const [isLoadingSources, setIsLoadingSources] = useState(false)

  useEffect(() => {
    const fetchSources = async () => {
      setIsLoadingSources(true)
      try {
        const res = await fetch("/api/pipedrive/deal-fields")
        const data = await res.json()
        if (data.success && data.data && data.data.options) {
          setSourceOptions(data.data.options)
        }
      } catch (err) {
        setSourceOptions([])
      } finally {
        setIsLoadingSources(false)
      }
    }
    fetchSources()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Hide results when user starts typing again
    if (name === "company") {
      setShowResults(false)
      setSelectedCompanyId(null) // Clear selected ID when user types
    }
    if (name === "contact") {
      setShowContactResults(false)
      setSelectedContactId(null) // Clear selected ID when user types
      setIsCreatingContact(false) // Reset create mode
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Function to search for company information
  const handleCompanySearch = async () => {
    if (!formData.company.trim()) {
      alert("Por favor ingresa el nombre de la empresa para buscar")
      return
    }
    setIsSearching(true)
    setShowResults(false)
    try {
      const response = await fetch("/api/pipedrive/search-organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: formData.company.trim() }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success && data.data && data.data.items) {
        setSearchResults(data.data.items)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(true)
      }
    } catch (error) {
      console.error("Error searching for company:", error)
      alert("Error al buscar la empresa. Por favor intenta de nuevo.")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Function to search for contact information
  const handleContactSearch = async () => {
    if (!formData.contact.trim()) {
      alert("Por favor ingresa el nombre del contacto para buscar")
      return
    }
    setIsSearchingContact(true)
    setShowContactResults(false)
    try {
      const response = await fetch("/api/pipedrive/search-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: formData.contact.trim(), organization_id: selectedCompanyId }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success && data.data && data.data.items && data.data.items.length > 0) {
        setContactSearchResults(data.data.items)
        setShowContactResults(true)
        setIsCreatingContact(false)
      } else {
        setContactSearchResults([])
        setShowContactResults(true)
        setIsCreatingContact(true)
      }
    } catch (error) {
      console.error("Error searching for contact:", error)
      alert("Error al buscar el contacto. Por favor intenta de nuevo.")
      setContactSearchResults([])
      setIsCreatingContact(true)
    } finally {
      setIsSearchingContact(false)
    }
  }

  // Function to manually enable create mode
  const handleEnableCreateMode = () => {
    setIsCreatingContact(true)
    setShowContactResults(false)
    setContactSearchResults([])
  }

  // Function to create a new contact
  const handleCreateContact = async () => {
    if (!formData.contact.trim()) {
      alert("Por favor ingresa el nombre del contacto")
      return
    }
    setIsSearchingContact(true)
    try {
      const body = {
        name: formData.contact.trim(),
        ...(selectedCompanyId ? { org_id: selectedCompanyId } : {}),
      }
      const response = await fetch("/api/pipedrive/create-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success && data.data) {
        setSelectedContactId(data.data.id)
        alert(`Contacto "${formData.contact}" creado exitosamente`)
        setIsCreatingContact(false)
      }
    } catch (error) {
      console.error("Error creating contact:", error)
      alert("Error al crear el contacto. Por favor intenta de nuevo.")
    } finally {
      setIsSearchingContact(false)
    }
  }

  // Function to select a company from search results
  const handleSelectCompany = (company: CompanySearchResult) => {
    setFormData((prev) => ({ ...prev, company: company.item.name }))
    setSelectedCompanyId(company.item.id)
    setShowResults(false)
    setSearchResults([])
  }

  // Function to select a contact from search results
  const handleSelectContact = (contact: ContactSearchResult) => {
    setFormData((prev) => ({ ...prev, contact: contact.item.name }))
    setSelectedContactId(contact.item.id)
    setShowContactResults(false)
    setContactSearchResults([])
    setIsCreatingContact(false)
  }

  // Function to handle clicking outside to close results
  const handleClickOutside = () => {
    setShowResults(false)
    setShowContactResults(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      alert("No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.")
      return
    }
    setIsLoading(true)
    try {
      const dealPayload = {
        title: formData.name,
        org_id: selectedCompanyId,
        owner_id: userId,
        person_id: selectedContactId,
        channel: formData.source ? Number(formData.source) : undefined,
        custom_fields: {
          "87b9669f62217dd75a5b8258da696fc3f76a9488": formData.profitCenter ? [Number(formData.profitCenter)] : [],
        },
      }
      const dealRes = await fetch("/api/pipedrive/create-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealPayload),
      })
      if (!dealRes.ok) {
        throw new Error("Error al crear el trato en Pipedrive")
      }
      const dealData = await dealRes.json()
      if (!dealData.success) {
        throw new Error("La API de Pipedrive no devolvió éxito al crear el trato")
      }

      // Send webhook notification after successful deal creation
      const profitCenterName = profitCenters.find(center => center.id === Number(formData.profitCenter))?.label || ""
      if (dealData.data?.id && profitCenterName) {
        await sendDealWebhook(profitCenterName, dealData.data.id)
      }
      if (selectedContactId && formData.position) {
        const patchPayload = {
          custom_fields: {
            "ecd931671516f7fc647c532935109b7968d22c5f": formData.position,
          },
          ...(formData.email ? { emails: [{ value: formData.email }] } : {}),
        }
        const patchRes = await fetch(`/api/pipedrive/update-contact?id=${selectedContactId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchPayload),
        })
        if (!patchRes.ok) {
          throw new Error("Error al actualizar el cargo del contacto en Pipedrive")
        }
      }
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/home")
      }, 2000)
    } catch (error) {
      console.error("Error al crear trato o actualizar contacto:", error)
      alert("Ocurrió un error al crear el trato o actualizar el contacto. Por favor, revisa los datos e intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Profit centers with id and label
  const profitCenters = [
    { id: 9, label: "Estrategia, Innovación y Cultura" },
    { id: 11, label: "Gestión Tecnológica e I+D" },
    { id: 12, label: "Sostenibilidad" },
    { id: 272, label: "Productividad e IA" },
    { id: 10, label: "Innk" },
    { id: 44, label: "Upskill" },
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
                <div className="relative">
                  <div className="flex gap-2">
                    <Input
                      id="company"
                      name="company"
                      placeholder="Nombre de la empresa"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleCompanySearch}
                      disabled={isSearching || !formData.company.trim()}
                      className="px-4"
                    >
                      {isSearching ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {searchResults.map((company) => (
                        <div
                          key={company.item.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSelectCompany(company)}
                        >
                          <div className="font-medium">{company.item.name}</div>
                          <div className="text-xs text-gray-500">
                            ID: {company.item.id} • Tipo: {company.item.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No Results Message */}
                  {showResults && searchResults.length === 0 && !isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="px-4 py-2 text-gray-500">
                        No se encontraron resultados para "{formData.company}"
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contacto</Label>
                <div className="relative">
                  <div className="flex gap-2">
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="Nombre del contacto"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={isCreatingContact ? handleCreateContact : handleContactSearch}
                      disabled={isSearchingContact || !formData.contact.trim()}
                      className="px-4"
                      variant={isCreatingContact ? "destructive" : "default"}
                    >
                      {isSearchingContact 
                        ? (isCreatingContact ? "Creando..." : "Buscando...") 
                        : (isCreatingContact ? "Crear contacto" : "Buscar")
                      }
                    </Button>
                    {/* Show "Crear nuevo" button when search results exist but user wants to create */}
                    {showContactResults && contactSearchResults.length > 0 && !isCreatingContact && (
                      <Button
                        type="button"
                        onClick={handleEnableCreateMode}
                        disabled={isSearchingContact}
                        className="px-3"
                        variant="outline"
                        size="sm"
                      >
                        Crear nuevo
                      </Button>
                    )}
                  </div>
                  
                  {/* Contact Search Results Dropdown */}
                  {showContactResults && contactSearchResults.length > 0 && !isCreatingContact && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {contactSearchResults.map((contact) => (
                        <div
                          key={contact.item.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSelectContact(contact)}
                        >
                          <div className="font-medium">{contact.item.name}</div>
                          <div className="text-xs text-gray-500">
                            ID: {contact.item.id} • Tipo: {contact.item.type}
                            {contact.item.email && contact.item.email.length > 0 && (
                              <span> • Email: {contact.item.email[0]}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No Contact Results Message */}
                  {showContactResults && contactSearchResults.length === 0 && !isSearchingContact && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="px-4 py-2 text-gray-500">
                        No se encontraron contactos para "{formData.contact}". 
                        Haz clic en "Crear contacto" para agregar uno nuevo.
                      </div>
                    </div>
                  )}

                  {/* Create Mode Message */}
                  {isCreatingContact && !isSearchingContact && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-blue-50 border border-blue-200 rounded-md shadow-lg z-10">
                      <div className="px-4 py-2 text-blue-700">
                        Modo creación: Se creará un nuevo contacto con el nombre "{formData.contact}"
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  autoComplete="email"
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
                      <SelectItem key={center.id} value={String(center.id)}>
                        {center.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Fuente</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => handleSelectChange("source", value)}
                  required
                  disabled={isLoadingSources}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingSources ? "Cargando fuentes..." : "Selecciona una fuente"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>
                        {option.label}
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
