// context/AuthContext.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  user: any    // decoded token veya null
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | undefined>(undefined)  //  ← undefined başlangıç
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      return
    }
    try {
      const decoded = jwtDecode(token)
      setUser(decoded)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [])

  const login = async (token: string) => {
    localStorage.setItem('token', token)
    const decoded = jwtDecode(token)
    setUser(decoded)
    await router.push('/dashboard')
  }

  const logout = async () => {
    localStorage.removeItem('token')
    setUser(null)
    await router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthContext must be used within AuthProvider')
  return ctx
}
