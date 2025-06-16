"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, BookOpen, FileEdit, ListTree } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  const router = useRouter()
  // const { notifications } = useStore() // Eliminar
  // const unreadNotifications = notifications.filter((n) => !n.read).length // Eliminar

  const menuItems = [
    {
      icon: PlusCircle,
      label: "Nuevo Trato",
      description: "Registra una nueva oportunidad en el CRM",
      path: "/new-deal",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: BookOpen,
      label: "Buenas Prácticas",
      description: "Consulta las mejores prácticas del proceso comercial",
      path: "/best-practices",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: FileEdit,
      label: "Solicitar Propuesta",
      description: "Solicita el desarrollo de una propuesta comercial",
      path: "/request-proposal",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: ListTree,
      label: "Estados Propuestas",
      description: "Revisa el estado de tus propuestas solicitadas",
      path: "/proposal-status",
      color: "bg-amber-100 text-amber-700",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bienvenido</h1>
          <p className="text-muted-foreground">¿Qué deseas hacer hoy?</p>
        </div>

        <div className="grid gap-4">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(item.path)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-full ${item.color} relative`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
