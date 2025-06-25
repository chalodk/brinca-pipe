"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { ReviewProposalModal } from "@/components/review-proposal-modal" // Lo mantenemos por si se usa en otro flujo
import { useStore } from "@/store/store"
import type { Proposal, Deal } from "@/store/store"

export default function ProposalStatusPage() {
  const router = useRouter()
  const { proposals, deals } = useStore()
  const [activeTab, setActiveTab] = useState("in_development_tab") // Cambiado para evitar colisión con estado
  const [selectedProposalForReview, setSelectedProposalForReview] = useState<Proposal | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  // --- New: Deals from API ---
  const [apiDeals, setApiDeals] = useState<any[]>([])
  const [dealsLoading, setDealsLoading] = useState(false)
  const [dealsError, setDealsError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const dealsPerPage = 5

  const fetchDeals = async () => {
    setDealsLoading(true)
    setDealsError(null)
    try {
      const res = await fetch(
        `https://brinca3.pipedrive.com/api/v2/deals?api_token=${process.env.NEXT_PUBLIC_PIPEDRIVE_API_KEY}&sort_by=add_time&sort_direction=desc`
      )
      if (!res.ok) throw new Error("No se pudieron obtener los tratos")
      const data = await res.json()
      setApiDeals(data.data || [])
      setCurrentPage(1)
    } catch (err: any) {
      setDealsError(err.message)
    } finally {
      setDealsLoading(false)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(apiDeals.length / dealsPerPage)
  const paginatedDeals = apiDeals.slice((currentPage - 1) * dealsPerPage, currentPage * dealsPerPage)

  // Filtrar propuestas para cada pestaña
  const inDevelopmentProposals = proposals.filter(
    (p) => p.status === "in_development" || p.status === "adjustment_pending",
  )
  const inReviewProposals = proposals.filter((p) => p.status === "ready_for_review")

  const getDealById = (dealId: string): Deal | undefined => {
    return deals.find((deal) => deal.id === dealId)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleGoToDeal = (dealId: string) => {
    // Aquí puedes definir a dónde navegar, por ejemplo, a una vista de detalle del trato.
    // Por ahora, solo un console.log o una ruta placeholder.
    console.log(`Navegar al trato con ID: ${dealId}`)
    // router.push(`/deals/${dealId}`); // Descomentar si tienes una ruta de detalle de trato
  }

  // Esta función podría ser necesaria si el botón "Revisar propuesta" se reintroduce o se usa en otro lugar.
  const handleReviewClick = (proposal: Proposal) => {
    setSelectedProposalForReview(proposal)
    setIsReviewModalOpen(true)
  }

  const ProposalCard = ({ proposal, showRequestedDate }: { proposal: Proposal; showRequestedDate?: boolean }) => {
    const deal = getDealById(proposal.dealId)
    const clientName = deal ? deal.company : "Cliente Desconocido"

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-3">
            <h3 className="font-medium text-lg">{proposal.dealName}</h3>
            <p className="text-sm text-muted-foreground">Cliente: {clientName}</p>

            {showRequestedDate && (
              <p className="text-sm text-muted-foreground">Solicitada: {formatDate(proposal.createdAt)}</p>
            )}

            <Button
              onClick={() => window.open(`https://brinca3.pipedrive.com/deal/${proposal.dealId}`, "_blank")}
              className="mt-2 w-full sm:w-auto self-start"
            >
              Ir al trato
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedRoute>
      <div className="py-6">
        <Card>
          <CardHeader>
            <CardTitle>Estados de Propuestas</CardTitle>
            <CardDescription>Revisa el estado de tus propuestas solicitadas</CardDescription>
          </CardHeader>
          <CardContent>
            {/* --- New: Fetch Deals Button and Pagination --- */}
            <div className="mb-6">
              <Button onClick={fetchDeals} disabled={dealsLoading}>
                {dealsLoading ? "Cargando tratos..." : "Obtener tratos de Pipedrive"}
              </Button>
              {dealsError && <p className="text-red-600 mt-2">{dealsError}</p>}
              {apiDeals.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Tratos (paginados de 5):</h4>
                  {paginatedDeals.map((deal) => (
                    <div key={deal.id} className="border rounded p-3 mb-2 flex items-center justify-between">
                      <span>{deal.title}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://brinca3.pipedrive.com/deal/${deal.id}`, "_blank")}
                      >
                        Ir al trato
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    <span className="self-center">Página {currentPage} de {totalPages}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/* --- End New --- */}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="in_development_tab">En Desarrollo</TabsTrigger>
                <TabsTrigger value="in_review_tab">En Revisión</TabsTrigger>
              </TabsList>

              <TabsContent value="in_development_tab">
                {inDevelopmentProposals.length > 0 ? (
                  inDevelopmentProposals.map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} showRequestedDate />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No hay propuestas en desarrollo.</div>
                )}
              </TabsContent>

              <TabsContent value="in_review_tab">
                {inReviewProposals.length > 0 ? (
                  inReviewProposals.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No hay propuestas en revisión.</div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedProposalForReview && (
        <ReviewProposalModal
          proposal={selectedProposalForReview}
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false)
            setSelectedProposalForReview(null)
          }}
        />
      )}
    </ProtectedRoute>
  )
}
