"use client"

import { usePathname, useRouter } from "next/navigation"
import { PlusCircle, BookOpen, FileEdit, ListTree, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/store"

export function NavMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useStore()

  const menuItems = [
    {
      icon: PlusCircle,
      label: "Nuevo Trato",
      path: "/new-deal",
      badge: false,
    },
    {
      icon: BookOpen,
      label: "Buenas Prácticas",
      path: "/best-practices",
      badge: false,
    },
    {
      icon: FileEdit,
      label: "Solicitar Propuesta",
      path: "/request-proposal",
      badge: false,
    },
    {
      icon: ListTree,
      label: "Estados Propuestas",
      path: "/proposal-status",
      badge: false,
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="flex items-center justify-between p-2 overflow-x-auto">
        <div className="flex space-x-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={pathname === item.path ? "default" : "ghost"}
              size="sm"
              className="flex flex-col items-center py-2 h-auto relative"
              onClick={() => router.push(item.path)}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {/* unreadNotifications */}
                </span>
              )}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center py-2 h-auto"
          onClick={handleLogout}
          title="Salir"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
