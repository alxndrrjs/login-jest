/* eslint-disable */
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mockNavigate
    mockNavigate.mockReset();
  });

  it('redirects to login when not authenticated', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows loading spinner while checking authentication', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays user information when authenticated', async () => {
    // Set up mock user data
    const mockUser = {
      name: 'Test User',
      email: 'test@test.com'
    };

    // Mock the fetchUserProfile function
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUser),
        ok: true
      })
    );

    // Set token in localStorage
    localStorage.setItem('token', 'fake-token');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for user data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Bienvenido, Test User')).toBeInTheDocument();
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
    });

    // Clean up
    global.fetch.mockRestore();
  });

  it('handles logout correctly', async () => {
    // Set up mock user data
    const mockUser = {
      name: 'Test User',
      email: 'test@test.com'
    };

    // Mock the fetchUserProfile function
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUser),
        ok: true
      })
    );

    // Set token in localStorage
    localStorage.setItem('token', 'fake-token');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for the logout button to appear
    const logoutButton = await screen.findByText('Cerrar sesión');
    
    // Click the logout button
    logoutButton.click();

    // Verify token is removed and user is redirected
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    // Clean up
    global.fetch.mockRestore();
  });
});
