'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'

export default function Home() {
  const { user } = useAuthContext()
  const router = useRouter()

  if (user === undefined) {
    return <p>Yükleniyor...</p>
  }

  useEffect(() => {
    if (user === null) router.replace('/login')
    else router.replace('/dashboard')
  }, [user, router])

  return null
}
