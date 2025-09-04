'use client';

import { useState, useEffect } from 'react';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Verificar sesión existente al cargar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      const data = await response.json();
      
      if (data.success && data.authenticated) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-black">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-4 text-center">
            Panel de Administración
          </h1>
          <p className="text-center text-brand-black">
            Cemento Nacional - La Fuerza del Presente
          </p>
        </div>
        
        <AdminPanel onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-4">
          Admin Login
        </h1>
        <p className="text-brand-black">
          Acceso al Panel de Administración
        </p>
      </div>
      
      <div className="bg-brand-beige rounded-lg border-2 border-brand-black p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-brand-black font-semibold mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="Ingresa tu usuario"
            />
          </div>
          
          <div>
            <label className="block text-brand-black font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-brand-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}