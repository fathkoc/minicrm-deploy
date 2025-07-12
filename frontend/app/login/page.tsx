'use client'

import { useAuthContext } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const { user, login } = useAuthContext()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  //  Giriş yapılmışsa login sayfasına erişimi engelle
  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  //  user yükleniyorsa ekran boş dursun
  if (user === undefined) return <p>Yükleniyor...</p>
  if (user) return null // yönlendirme yapılacak

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://crmapi.duddy.tr/api/login', { email, password })
      login(res.data.token)
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Hata oluştu')
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Giriş Yap</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="w-full mb-2 p-2 border" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full mb-2 p-2 border" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-500 text-white p-2" type="submit">Giriş</button>
      </form>
      <p className="mt-2">Hesabın yok mu? <a href="/register" className="text-blue-600 underline">Kayıt ol</a></p>
    </div>
  )
}
