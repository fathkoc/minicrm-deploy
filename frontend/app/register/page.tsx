'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import axios from 'axios'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { user } = useAuthContext()

  //  Giriş yapmışsa register sayfasına girişi engelle
  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  //  user henüz kontrol edilmediyse ekranda yükleniyor göster
  if (user === undefined) return <p>Yükleniyor...</p>
  if (user) return null // yönlendirme olacak

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post('http://crmapi.duddy.tr/api/register', { email, password })
      setMessage(' Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      setMessage(err.response?.data?.msg || '❌ Kayıt başarısız.')
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Kayıt Ol</h1>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="w-full mb-2 p-2 border"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-2 p-2 border"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white p-2" type="submit">
          Kayıt Ol
        </button>
      </form>
      <p className="mt-2">
        Zaten bir hesabın var mı?{' '}
        <a href="/login" className="text-blue-600 underline">
          Giriş Yap
        </a>
      </p>
    </div>
  )
}
