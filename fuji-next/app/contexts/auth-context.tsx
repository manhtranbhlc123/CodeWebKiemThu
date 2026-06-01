"use client"

import { createContext, useContext } from "react"

// Auth Context
type AuthContextType = {
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  userEmail: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

