import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Deal = {
  id: string
  name: string
  company: string
  contact: string
  position: string
  profitCenter: string
  source: string
  createdAt: Date
}

export type ProposalStatus = "in_development" | "ready_for_review" | "adjustment_pending" | "completed"
export type BudgetStatus = "not_assigned" | "in_review" | "ready" // Este podría eliminarse o adaptarse si ya no se usa directamente

export type Proposal = {
  id: string
  dealId: string
  dealName: string
  status: ProposalStatus
  budgetStatus: BudgetStatus // Mantener por ahora, podría ser útil o eliminarse después
  createdAt: Date
  estimatedDeliveryDate?: Date
  lastAction?: {
    action: string
    date: Date
    by?: string
    comments?: string
  }
  context: {
    businessContext: string
    clientNeeds: string
    expectedResults: string
  }
  ideas: {
    // "ideas" se refiere a los servicios seleccionados
    selectedIdeas: string[]
    additionalIdeas: string
    implementationIdeas: string
  }
  pAndP: {
    // Nueva sección P & P
    potential: "high" | "medium" | "low"
    estimatedValue: number | null
    probability: number | null // Probabilidad de 0 a 100
    optimalDeliveryDate: string | null // Formato YYYY-MM-DD
  }
}

type State = {
  isAuthenticated: boolean
  deals: Deal[]
  proposals: Proposal[]
  login: () => void
  logout: () => void
  addDeal: (deal: Omit<Deal, "id" | "createdAt">) => Promise<Deal>
  addProposal: (
    proposal: Omit<Proposal, "id" | "createdAt" | "budgetStatus"> & { budgetStatus?: BudgetStatus },
  ) => Promise<Proposal>
  updateProposalStatus: (
    id: string,
    status: ProposalStatus,
    budgetStatus: BudgetStatus,
    comments?: string,
  ) => Promise<void>
}

const getRandomFutureDate = () => {
  const today = new Date()
  const daysToAdd = Math.floor(Math.random() * 14) + 1
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + daysToAdd)
  return futureDate
}

const mockDeals: Deal[] = [
  {
    id: "deal-1",
    name: "Transformación digital para Banco Nacional",
    company: "Banco Nacional",
    contact: "Carlos Méndez",
    position: "CIO",
    profitCenter: "Gestión Tecnológica",
    source: "Recomendado",
    createdAt: new Date(2023, 10, 15),
  },
  {
    id: "deal-2",
    name: "Programa de innovación corporativa",
    company: "Seguros Pacífico",
    contact: "María González",
    position: "Directora de Innovación",
    profitCenter: "Estrategia, Innovación y Cultura",
    source: "Evento de relacionamiento",
    createdAt: new Date(2023, 11, 3),
  },
]

const mockProposals: Proposal[] = [
  {
    id: "proposal-1",
    dealId: "deal-1",
    dealName: "Transformación digital para Banco Nacional",
    status: "in_development",
    budgetStatus: "in_review",
    createdAt: new Date(2023, 10, 18),
    estimatedDeliveryDate: getRandomFutureDate(),
    lastAction: {
      action: "Propuesta iniciada",
      date: new Date(2023, 10, 18),
      by: "Ana Martínez",
    },
    context: {
      businessContext:
        "El banco busca modernizar sus sistemas para mejorar la experiencia del cliente y optimizar procesos internos.",
      clientNeeds:
        "Necesitan una estrategia clara de transformación digital que incluya roadmap y priorización de iniciativas.",
      expectedResults: "Esperan reducir costos operativos en un 20% y mejorar la satisfacción del cliente en un 30%.",
    },
    ideas: {
      selectedIdeas: [
        "I - Diagnóstico C3: Full",
        "I - Potenciamiento de proyectos",
        "I - Gestión del cambio para proyectos estratégicos",
      ],
      additionalIdeas: "Consideración especial para la integración con sistemas legacy.",
      implementationIdeas: "Enfoque por fases, comenzando con áreas de mayor impacto al cliente.",
    },
    pAndP: {
      potential: "high",
      estimatedValue: 175000,
      probability: 70,
      optimalDeliveryDate: "2024-07-15",
    },
  },
  {
    id: "proposal-2",
    dealId: "deal-2",
    dealName: "Programa de innovación corporativa",
    status: "ready_for_review",
    budgetStatus: "ready",
    createdAt: new Date(2023, 11, 10),
    lastAction: {
      action: "Lista para revisión",
      date: new Date(2024, 0, 20),
      by: "Pedro Sánchez",
    },
    context: {
      businessContext: "La aseguradora busca desarrollar nuevos productos y servicios para mantenerse competitiva.",
      clientNeeds: "Necesitan un programa estructurado de innovación que involucre a toda la organización.",
      expectedResults: "Buscan lanzar al menos 3 nuevos productos/servicios en los próximos 12 meses.",
    },
    ideas: {
      selectedIdeas: [
        "I - Campañas de ideas: Nivel Compañía",
        "CI - Talleres culturales",
        "CI - Programas de Embajadores de innovación",
        "CI - Capacitación en Innovación",
      ],
      additionalIdeas: "Incluir un sistema de reconocimiento para los colaboradores más innovadores.",
      implementationIdeas: "Comenzar con un piloto en el área de productos y luego expandir.",
    },
    pAndP: {
      potential: "medium",
      estimatedValue: 90000,
      probability: 85,
      optimalDeliveryDate: "2024-06-30",
    },
  },
]

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      deals: mockDeals,
      proposals: mockProposals,

      login: () => set({ isAuthenticated: true }),

      logout: () => set({ isAuthenticated: false }),

      addDeal: async (dealData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const newDeal: Deal = {
              id: `deal-${Date.now()}`,
              ...dealData,
              createdAt: new Date(),
            }

            set((state) => ({
              deals: [...state.deals, newDeal],
            }))

            resolve(newDeal)
          }, 2000)
        })
      },

      addProposal: async (proposalData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const now = new Date()
            const estimatedDate = new Date()
            estimatedDate.setDate(now.getDate() + 7)

            const newProposal: Proposal = {
              id: `proposal-${Date.now()}`,
              ...proposalData,
              budgetStatus: proposalData.budgetStatus || "not_assigned", // Default budgetStatus
              status: "in_development",
              createdAt: now,
              estimatedDeliveryDate: estimatedDate,
              lastAction: {
                action: "Propuesta iniciada",
                date: now,
                by: "Usuario",
              },
            }

            set((state) => ({
              proposals: [...state.proposals, newProposal],
            }))

            resolve(newProposal)
          }, 2000)
        })
      },

      updateProposalStatus: async (id, status, budgetStatus, comments) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const now = new Date()
            let estimatedDate = undefined

            if (status === "in_development" || status === "adjustment_pending") {
              estimatedDate = new Date()
              estimatedDate.setDate(now.getDate() + 5)
            }

            set((state) => {
              const updatedProposals = state.proposals.map((proposal) => {
                if (proposal.id === id) {
                  let actionText = ""
                  switch (status) {
                    case "in_development":
                      actionText = "Propuesta en desarrollo"
                      break
                    case "ready_for_review":
                      actionText = "Lista para revisión"
                      break
                    case "adjustment_pending":
                      actionText = "Feedback enviado"
                      break
                    case "completed":
                      actionText = "Propuesta completada"
                      break
                  }

                  return {
                    ...proposal,
                    status,
                    budgetStatus,
                    estimatedDeliveryDate: estimatedDate,
                    lastAction: {
                      action: actionText,
                      date: now,
                      by: "Usuario",
                      comments: comments || undefined,
                    },
                  }
                }
                return proposal
              })

              return {
                proposals: updatedProposals,
              }
            })

            resolve()
          }, 1000)
        })
      },
    }),
    {
      name: "crm-mobile-storage",
    },
  ),
)
