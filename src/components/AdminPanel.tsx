'use client';

import React, { useState, useEffect } from 'react';
import PurchaseAdmin from './PurchaseAdmin';

interface Message {
  _id: string;
  nombre: string;
  correo: string;
  telefono?: string;
  compania?: string;
  mensaje: string;
  createdAt: string;
}

interface Order {
  _id: string;
  stripeSessionId: string;
  status: string;
  amountTotal: number;
  currency: string;
  customerEmail: string;
  createdAt: string;
}

interface Pedido {
  _id: string;
  nombre: string;
  correo: string;
  telefono?: string;
  compania?: string;
  bolsas: number;
  precioUnitario: number;
  subtotal: number;
  flete: number;
  totalFinal: number;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  notas?: string;
  createdAt: string;
}

interface AdminData {
  messages: Message[];
  orders: Order[];
  pedidos: Pedido[];
  settings: Record<string, unknown>;
}

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('messages');
  const [data, setData] = useState<AdminData>({
    messages: [],
    orders: [],
    pedidos: [],
    settings: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/admin/${endpoint}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [messagesData, ordersData, pedidosData] = await Promise.all([
        fetchData('messages'),
        fetchData('orders'),
        fetchData('pedidos')
      ]);

      setData({
        messages: messagesData.messages || [],
        orders: ordersData.orders || [],
        pedidos: pedidosData.pedidos || [],
        settings: {}
      });
    } catch (error) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX');
  };

  const formatCurrency = (amount: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-black">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={loadData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'messages', label: 'Mensajes', count: data.messages.length },
            { id: 'orders', label: 'Órdenes Stripe', count: data.orders.length },
            { id: 'pedidos', label: 'Pedidos', count: data.pedidos.length },
            { id: 'purchases', label: 'Compras', count: 0 },
            { id: 'settings', label: 'Ajustes', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-brand-red text-white text-xs rounded-full px-2 py-1">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las tabs */}
      <div className="mt-6">
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-black">Mensajes de Contacto</h3>
            {data.messages.length === 0 ? (
              <p className="text-gray-500">No hay mensajes</p>
            ) : (
              <div className="space-y-4">
                {data.messages.map((message: Message) => (
                  <div key={message._id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-brand-black">{message.nombre}</h4>
                      <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{message.correo}</p>
                    {message.telefono && (
                      <p className="text-sm text-gray-600 mb-2">Tel: {message.telefono}</p>
                    )}
                    {message.compania && (
                      <p className="text-sm text-gray-600 mb-2">Compañía: {message.compania}</p>
                    )}
                    <p className="text-brand-black">{message.mensaje}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-black">Órdenes de Stripe</h3>
            {data.orders.length === 0 ? (
              <p className="text-gray-500">No hay órdenes</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.orders.map((order: Order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {order.stripeSessionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.amountTotal / 100)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-black">Pedidos de Cemento</h3>
            {data.pedidos.length === 0 ? (
              <p className="text-gray-500">No hay pedidos</p>
            ) : (
              <div className="space-y-4">
                {data.pedidos.map((pedido: Pedido) => (
                  <div key={pedido._id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-brand-black">{pedido.nombre}</h4>
                      <span className="text-sm text-gray-500">{formatDate(pedido.createdAt)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Email: {pedido.correo}</p>
                        <p className="text-gray-600">Tel: {pedido.telefono || 'No especificado'}</p>
                        <p className="text-gray-600">Compañía: {pedido.compania || 'No especificada'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bolsas: {pedido.bolsas}</p>
                        <p className="text-gray-600">Subtotal: {formatCurrency(pedido.subtotal)}</p>
                        <p className="text-gray-600">Flete: {formatCurrency(pedido.flete)}</p>
                        <p className="font-semibold text-brand-black">Total: {formatCurrency(pedido.totalFinal)}</p>
                      </div>
                    </div>
                    {pedido.location && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Ubicación: {pedido.address}</p>
                        <p>Distancia: {pedido.distanceKm?.toFixed(1)} km</p>
                        <p>Coordenadas: {pedido.location.lat.toFixed(6)}, {pedido.location.lng.toFixed(6)}</p>
                      </div>
                    )}
                    {pedido.notas && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Notas:</strong> {pedido.notas}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/admin/pedidos/${pedido._id}/qr`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Ver QR Code
                      </a>
                      
                      <a
                        href={`/api/pedidos/${pedido._id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Descargar PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-black">Ajustes de Flete</h3>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>Esta funcionalidad estará disponible en la siguiente versión.</p>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <PurchaseAdmin isAuthenticated={true} />
        )}
      </div>

      {/* Botón de logout */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
