'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface UserProfile {
  id: string
  name: string
  email: string
  type: 'individual' | 'vendor'
  avatarUrl?: string
  bio?: string
  location?: string
  ecoScore?: number
  totalImpact?: {
    wasteSaved: number
    co2Reduced: number
    treesPlanted: number
  }
}

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated: !!user 
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)