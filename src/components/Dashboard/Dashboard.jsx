import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch('/api/users/count');
        const data = await res.json();
        setUserCount(data.count);
      } catch (error) {
        console.error('Error al obtener la cantidad de usuarios: ', error);
      }
    }

    fetchUserCount();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }


  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <nav className="bg-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center ">
              <h1 className="text-xl font-bold text-green-500">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-4">Bienvenido, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 pb-2 pt-1.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-zinc-800 shadow rounded-lg p-6">
            <section className='flex'>
              <div className='w-1/2'>
                <h2 className="text-2xl font-bold mb-4">Información del Usuario</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Nombre</h3>
                    <p className="text-white">{user?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-white">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className='w-1/2'>
                <h2 className='text-2xl font-bold mb-4'>Estadísticas</h2>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-white'>Cantidad de usuarios registrados</h3>
                  <p className='text-white'>
                    {userCount !== null ? userCount : '...'}
                  </p>
                </div>
              </div>
            </section>
            <section className='mt-8'>
              <h2 className='text-2xl font-bold mb-4'>Enlaces de interés</h2>
              <ul>
                <li className='list-disc list-inside mb-2'>
                  <a
                    className='hover:text-green-500 transition-all duration-200 ease-in-out'
                    href="https://github.com/alxndrrjs"
                    target='_blank'>
                    Github
                  </a>
                </li>
                <li className='list-disc list-inside mb-2'>
                  <a
                    className='hover:text-green-500 transition-all duration-200 ease-in-out'
                    href="https://mswjs.io/docs/getting-started"
                    target='_blank'>
                    Mock Service Worker
                  </a>
                </li>
                <li className='list-disc list-inside mb-2'>
                  <a
                    className='hover:text-green-500 transition-all duration-200 ease-in-out'
                    href="https://jestjs.io/es-ES/docs/getting-started"
                    target='_blank'>
                    Jest Testing
                  </a>
                </li>
                <li className='list-disc list-inside mb-2'>
                  <a
                    className='hover:text-green-500 transition-all duration-200 ease-in-out'
                    href="https://tailwindcss.com/docs/installation/using-vite"
                    target='_blank'>
                    TailwindCSS
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
