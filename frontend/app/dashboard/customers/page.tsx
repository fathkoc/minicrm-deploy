'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Customer = {
  _id: string
  name: string
  email: string
  phone: string
  tags: string[]
}

type Note = {
  _id: string
  text: string
  date: string
}

const API_BASE = 'http://crmapi.duddy.tr/'

export default function CustomersPage() {
  const router = useRouter()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [tags, setTags] = useState('')

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [noteText, setNoteText] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const getToken = () => localStorage.getItem('token') || ''

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE}/customers`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
      setError('Müşteriler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setName('')
    setEmail('')
    setPhone('')
    setTags('')
    setEditCustomer(null)
    setFormErrors({})
    setError('')
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Ad en az 2 karakter olmalı.'
    }

    if (!email.trim()) {
      errors.email = 'Email zorunludur.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Geçerli bir email giriniz.'
      }
    }

    if (phone.trim()) {
      const phoneRegex = /^[0-9]{10,15}$/
      if (!phoneRegex.test(phone.trim())) {
        errors.phone = 'Telefon 10-15 rakam arasında olmalı ve sadece rakam içermeli.'
      }
    }

    const tagsArray = tags.split(',').map(t => t.trim())
    if (tagsArray.some(t => t.length === 0)) {
      errors.tags = 'Boş etiket olamaz.'
    }

    setFormErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      await axios.post(`${API_BASE}/customers`, {
        name,
        email,
        phone,
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      clearForm()
      fetchCustomers()
    } catch (err) {
      console.error(err)
      setError('Müşteri eklenemedi.')
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!editCustomer) return
    if (!validateForm()) return

    try {
      await axios.put(`${API_BASE}/customers/${editCustomer._id}`, {
        name,
        email,
        phone,
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      clearForm()
      fetchCustomers()
    } catch (err) {
      console.error(err)
      setError('Müşteri güncellenemedi.')
    }
  }

  const handleDelete = async (id: string) => {
    setError('')
    try {
      await axios.delete(`${API_BASE}/customers/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      fetchCustomers()
    } catch (err) {
      console.error(err)
      setError('Müşteri silinemedi.')
    }
  }

  // Not işlemleri

  const openNotes = async (customer: Customer) => {
    setSelectedCustomer(customer)
    setError('')
    try {
      const res = await axios.get(`${API_BASE}/customers/${customer._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      setNotes(res.data.notes || [])
    } catch (err) {
      console.error(err)
      setNotes([])
      setError('Notlar yüklenemedi.')
    }
  }

  const handleAddNote = async () => {
    if (!selectedCustomer || !noteText.trim()) return
    setError('')
    try {
      await axios.post(`${API_BASE}/customers/${selectedCustomer._id}/notes`, {
        text: noteText.trim()
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      setNoteText('')
      openNotes(selectedCustomer)
    } catch (err) {
      console.error(err)
      setError('Not eklenemedi.')
    }
  }

  const handleUpdateNote = async (noteId: string) => {
    if (!selectedCustomer) return
    setError('')
    try {
      await axios.put(`${API_BASE}/customers/${selectedCustomer._id}/notes/${noteId}`, {
        text: editingText.trim()
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      setEditingNoteId(null)
      setEditingText('')
      openNotes(selectedCustomer)
    } catch (err) {
      console.error(err)
      setError('Not güncellenemedi.')
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedCustomer) return
    setError('')
    try {
      await axios.delete(`${API_BASE}/customers/${selectedCustomer._id}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      openNotes(selectedCustomer)
    } catch (err) {
      console.error(err)
      setError('Not silinemedi.')
    }
  }

  const closeNotes = () => {
    setSelectedCustomer(null)
    setNotes([])
    setNoteText('')
    setEditingNoteId(null)
    setEditingText('')
    setError('')
  }

  const startEdit = (customer: Customer) => {
    setEditCustomer(customer)
    setName(customer.name)
    setEmail(customer.email)
    setPhone(customer.phone)
    setTags(customer.tags.join(', '))
    setFormErrors({})
    setError('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          ← Dashboard'a Dön
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="İsim veya etiket ara..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">📋 Müşteri Listesi</h1>

      <form onSubmit={editCustomer ? handleUpdate : handleAdd} className="mb-6 space-y-2 border p-4 rounded">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              className="border p-2 w-full"
              placeholder="Ad"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <input
              className="border p-2 w-full"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              required
            />
            {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <input
              className="border p-2 w-full"
              placeholder="Telefon"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
          </div>
          <div>
            <input
              className="border p-2 w-full"
              placeholder="Etiketler (virgülle)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
            {formErrors.tags && <p className="text-red-600 text-sm mt-1">{formErrors.tags}</p>}
          </div>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${editCustomer ? 'bg-yellow-500' : 'bg-blue-600'}`}
        >
          {editCustomer ? '📝 Güncelle' : '➕ Müşteri Ekle'}
        </button>
        {editCustomer && (
          <button type="button" onClick={clearForm} className="ml-2 px-4 py-2 rounded bg-gray-300">
            Vazgeç
          </button>
        )}
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Yükleniyor...</p>
      ) : customers.length === 0 ? (
        <p>Henüz müşteri yok.</p>
      ) : (
        <ul className="space-y-4">
          {customers
            .filter(c => {
              const term = searchTerm.toLowerCase()
              return c.name.toLowerCase().includes(term) || c.tags.some(tag => tag.toLowerCase().includes(term))
            })
            .map(c => (
              <li key={c._id} className="border p-4 rounded shadow">
                <p>
                  <strong>{c.name}</strong> - {c.email} - {c.phone}
                </p>
                <p>
                  Etiketler: <span className="text-sm text-gray-600">{c.tags.join(', ')}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => openNotes(c)} className="text-blue-600 underline">
                    🗒 Notlar
                  </button>
                  <button onClick={() => startEdit(c)} className="text-yellow-600 underline">
                    📝 Düzenle
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-600 underline">
                    🗑 Sil
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            <button onClick={closeNotes} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Notlar - {selectedCustomer.name}</h2>
            <ul className="mb-4 max-h-60 overflow-y-auto space-y-2">
              {notes.length === 0 && <p>Not yok.</p>}
              {notes.map(note => (
                <li key={note._id} className="border-b pb-1">
                  {editingNoteId === note._id ? (
                    <div className="flex gap-2">
                      <input
                        className="border p-1 flex-grow"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                      />
                      <button onClick={() => handleUpdateNote(note._id)} className="text-green-600">
                        Kaydet
                      </button>
                      <button
                        onClick={() => {
                          setEditingNoteId(null)
                          setEditingText('')
                        }}
                        className="text-gray-500"
                      >
                        Vazgeç
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>
                        {new Date(note.date).toLocaleDateString()} - {note.text}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingNoteId(note._id)
                            setEditingText(note.text)
                          }}
                          className="text-blue-600 text-sm"
                        >
                          Düzenle
                        </button>
                        <button onClick={() => handleDeleteNote(note._id)} className="text-red-600 text-sm">
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Yeni not..."
                className="border p-2 flex-grow"
              />
              <button onClick={handleAddNote} className="bg-blue-600 text-white px-4 py-2 rounded">
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
