'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QRCodeDisplay from '@/components/QRCodeDisplay';

interface PedidoData {
  _id: string;
  nombre: string;
  correo: string;
  totalFinal: number;
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export default function PedidoQRPage() {
  const params = useParams();
  const [pedido, setPedido] = useState<PedidoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchPedidoData();
    }
  }, [params.id]);

  const fetchPedidoData = async () => {
    try {
      const response = await fetch(`/api/admin/pedidos?id=${params.id}`);
      const result = await response.json();
      
      if (result.success && result.data.pedidos.length > 0) {
        setPedido(result.data.pedidos[0]);
      } else {
        setError('Pedido no encontrado');
      }
    } catch (error) {
      setError('Error al cargar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-brand-black">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Pedido no encontrado'}</p>
        </div>
      </div>
    );
  }

  const qrData = {
    pedidoId: pedido._id,
    nombre: pedido.nombre,
    total: pedido.totalFinal,
    fecha: new Date(pedido.createdAt).toISOString(),
    adminUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/admin`,
    mapsUrl: pedido.location ? `https://www.google.com/maps?q=${pedido.location.lat},${pedido.location.lng}` : null
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-4">
          QR Code del Pedido
        </h1>
        <p className="text-brand-black">
          ID: {pedido._id}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Información del pedido */}
        <div className="bg-brand-beige p-6 rounded-lg border-2 border-brand-black">
          <h2 className="text-2xl font-bold text-brand-black mb-4">
            Información del Pedido
          </h2>
          
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-brand-black">Cliente:</span>
              <p className="text-brand-black">{pedido.nombre}</p>
            </div>
            
            <div>
              <span className="font-semibold text-brand-black">Email:</span>
              <p className="text-brand-black">{pedido.correo}</p>
            </div>
            
            <div>
              <span className="font-semibold text-brand-black">Total:</span>
              <p className="text-brand-black text-xl">
                ${pedido.totalFinal.toFixed(2)} MXN
              </p>
            </div>
            
            <div>
              <span className="font-semibold text-brand-black">Fecha:</span>
              <p className="text-brand-black">
                {new Date(pedido.createdAt).toLocaleString('es-MX')}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-lg border-2 border-brand-black">
          <h2 className="text-2xl font-bold text-brand-black mb-4 text-center">
            Código QR
          </h2>
          
          <QRCodeDisplay 
            data={qrData} 
            size={250}
            className="flex justify-center"
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <p className="text-center">
              Escanea este código para:
            </p>
            <ul className="mt-2 space-y-1">
              <li>• Ver detalles en el admin</li>
              <li>• Acceder a la ubicación en Maps</li>
              <li>• Ver información del pedido</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Volver
        </button>
        
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700"
        >
          Imprimir
        </button>
      </div>
    </div>
  );
}
