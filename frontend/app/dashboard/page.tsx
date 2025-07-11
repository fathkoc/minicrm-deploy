'use client'

import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user, logout } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.replace('/login')
    }
  }, [user, router])

  if (user === undefined) return <p>Yükleniyor...</p>
  if (user === null) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hoş geldin, {user.email}</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => router.push('/dashboard/customers')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          👥 Müşteriler
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          🚪 Çıkış Yap
        </button>
      </div>
    </div>
  )
}
