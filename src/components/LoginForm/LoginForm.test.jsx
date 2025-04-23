import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// 1) Mockeamos el hook de AuthContext
jest.mock('../../context/AuthContext');

describe('LoginForm', () => {
  const loginMock = jest.fn();

  beforeEach(() => {
    // 2) Siempre devolvemos un login vacío (no se usa en validación)
    useAuth.mockReturnValue({ login: loginMock });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render form fields', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  it('should show error if fields are empty', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // 4) Verificamos los mensajes de error
    expect(
      screen.getByText(/El email es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/La contraseña es obligatoria/i)
    ).toBeInTheDocument();
  });
});
