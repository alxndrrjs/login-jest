import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import { useAuth } from '../../context/AuthContext'

// 1) Mockeamos el módulo de AuthContext
jest.mock('../../context/AuthContext')

describe('Dashboard', () => {
  const mockUser = { name: 'Usuario Test', email: 'test@test.com' }

  beforeEach(() => {
    // 2) Para cada test devolvemos un contexto autenticado
    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
      logout: jest.fn(),
    })

    // 3) Mockeamos sólo la llamada a /api/users/count
    global.fetch = jest.fn(url => {
      if (url.endsWith('/api/users/count')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 3 }),
        })
      }
      return Promise.reject('Not handled')
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('muestra la info del usuario y el userCount', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    // Ya no hace falta simular login aquí
    expect(screen.getByText(`Bienvenido, ${mockUser.name}`)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    // Espera al número de usuarios
    expect(await screen.findByText('3')).toBeInTheDocument()
  })

  it('llama a logout al hacer click', async () => {
    const logoutMock = jest.fn()
    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
      logout: logoutMock,
    })

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    fireEvent.click(await screen.findByText('Cerrar sesión'))
    expect(logoutMock).toHaveBeenCalled()
  })
})