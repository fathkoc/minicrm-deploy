// tests/CustomerList.test.jsx
import { render, screen } from '@testing-library/react'
import CustomerList from '../components/CustomerList'

describe('CustomerList Component', () => {
  it('müşteri isimleri listelenmeli', () => {
    const customers = [
      { id: 1, name: 'Fatih Koç', email: 'fatih@example.com' },
      { id: 2, name: 'Ayşe Yılmaz', email: 'ayse@example.com' },
    ]

    render(<CustomerList customers={customers} />)

    expect(screen.getByText('Fatih Koç')).toBeInTheDocument()
    expect(screen.getByText('Ayşe Yılmaz')).toBeInTheDocument()
  })

  it('müşteri yoksa uygun mesaj gösterilmeli', () => {
    render(<CustomerList customers={[]} />)

    expect(screen.getByText(/müşteri bulunamadı/i)).toBeInTheDocument()
  })
})
