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
  userId: string | null
  deals: Deal[]
  proposals: Proposal[]
  login: () => void
  logout: () => void
  setUserId: (id: string) => void
  clearUserId: () => void
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

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userId: null,
      deals: [],
      proposals: [],

      login: () => set({ isAuthenticated: true }),

      logout: () => set({ isAuthenticated: false, userId: null }),

      setUserId: (id: string) => set({ userId: id }),

      clearUserId: () => set({ userId: null }),

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
