"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store/store"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return null
}
