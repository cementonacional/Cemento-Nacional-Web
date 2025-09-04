'use client';

import React, { useState } from 'react';
import GoogleMapComponent from '@/components/GoogleMap';
import { useGeocoding } from '@/hooks/useGeocoding';

interface Location {
  lat: number;
  lng: number;
}

interface QuoteResult {
  subtotal: number;
  flete: number;
  totalFinal: number;
  distanceKm: number;
}

export default function PedidosPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    compania: '',
    bolsas: 1,
    precioUnitario: 150,
    address: '',
    notas: ''
  });

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [message, setMessage] = useState('');
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const { geocodeAddress, isLoading: isGeocoding, error: geocodingError } = useGeocoding();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bolsas' || name === 'precioUnitario' ? Number(value) : value
    }));
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setMessage('Ubicación seleccionada en el mapa');
  };

  const handleAddressGeocode = async () => {
    if (!formData.address.trim()) {
      setMessage('Por favor ingresa una dirección');
      return;
    }

    const result = await geocodeAddress(formData.address);
    if (result) {
      setSelectedLocation(result.location);
      setFormData(prev => ({ ...prev, address: result.formattedAddress }));
      setMessage('Dirección geocodificada correctamente');
    } else {
      setMessage('Error al geocodificar la dirección');
    }
  };

  const calculateQuote = async () => {
    if (formData.bolsas < 1) {
      setMessage('Debe pedir al menos 1 bolsa');
      return;
    }

    setIsCalculating(true);
    setMessage('Calculando cotización...');

    try {
      const response = await fetch('/api/pedidos/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bolsas: formData.bolsas,
          precioUnitario: formData.precioUnitario,
          location: selectedLocation
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuoteResult(data.data);
        setMessage('Cotización calculada correctamente');
      } else {
        setMessage(data.message || 'Error al calcular la cotización');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Enviando pedido...');

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          location: selectedLocation
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPedidoId(data.data.id);
        setMessage('Pedido enviado correctamente. ID: ' + data.data.id);
        // Reset form
        setFormData({
          nombre: '',
          correo: '',
          telefono: '',
          compania: '',
          bolsas: 1,
          precioUnitario: 150,
          address: '',
          notas: ''
        });
        setSelectedLocation(null);
        setQuoteResult(null);
      } else {
        setMessage(data.message || 'Error al enviar el pedido');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPDF = async () => {
    if (!pedidoId) return;

    setIsGeneratingPDF(true);
    setMessage('Generando PDF...');

    try {
      const response = await fetch(`/api/pedidos/${pedidoId}/pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedido-${pedidoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage('PDF descargado correctamente');
      } else {
        setMessage('Error al generar el PDF');
      }
    } catch (error) {
      setMessage('Error al descargar el PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
          Realizar Pedido
        </h1>
        <p className="text-xl text-brand-black">
          Cemento Portland Gris CPC30 - 25kg
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-brand-black font-semibold mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="block text-brand-black font-semibold mb-2">
                  Correo *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-brand-black font-semibold mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="block text-brand-black font-semibold mb-2">
                  Compañía
                </label>
                <input
                  type="text"
                  name="compania"
                  value={formData.compania}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-brand-black font-semibold mb-2">
                  Número de Bolsas *
                </label>
                <input
                  type="number"
                  name="bolsas"
                  value={formData.bolsas}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                  required
                  className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="block text-brand-black font-semibold mb-2">
                  Precio Unitario (MXN) *
                </label>
                <input
                  type="number"
                  name="precioUnitario"
                  value={formData.precioUnitario}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-black font-semibold mb-2">
                Dirección
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu dirección"
                  className="flex-1 px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
                <button
                  type="button"
                  onClick={handleAddressGeocode}
                  disabled={isGeocoding}
                  className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isGeocoding ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-brand-black font-semibold mb-2">
                Notas Adicionales
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={calculateQuote}
                disabled={isCalculating}
                className="flex-1 px-6 py-3 bg-brand-gold text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
              >
                {isCalculating ? 'Calculando...' : 'Calcular Total'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('correctamente') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {geocodingError && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">
              Error de geocodificación: {geocodingError}
            </div>
          )}
        </div>

        {/* Mapa y Cotización */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-brand-black mb-4">
              Selecciona tu ubicación
            </h3>
            <GoogleMapComponent
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
              height="400px"
            />
          </div>

          {quoteResult && (
            <div className="bg-brand-beige p-6 rounded-lg border-2 border-brand-black">
              <h3 className="text-xl font-bold text-brand-black mb-4">
                Cotización
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-brand-black">Subtotal:</span>
                  <span className="text-brand-black font-semibold">
                    ${quoteResult.subtotal.toFixed(2)} MXN
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-black">Flete:</span>
                  <span className="text-brand-black font-semibold">
                    ${quoteResult.flete.toFixed(2)} MXN
                  </span>
                </div>
                {quoteResult.distanceKm > 0 && (
                  <div className="flex justify-between">
                    <span className="text-brand-black">Distancia:</span>
                    <span className="text-brand-black font-semibold">
                      {quoteResult.distanceKm.toFixed(1)} km
                    </span>
                  </div>
                )}
                <hr className="border-brand-black" />
                <div className="flex justify-between">
                  <span className="text-brand-black font-bold">Total Final:</span>
                  <span className="text-brand-black font-bold text-xl">
                    ${quoteResult.totalFinal.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Sección de Pedido Completado */}
          {pedidoId && (
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-500">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                ✅ Pedido Completado
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-semibold">ID del Pedido:</span>
                  <span className="text-green-800 font-mono text-lg">
                    {pedidoId}
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={downloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isGeneratingPDF ? 'Generando...' : '📄 Descargar PDF'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setPedidoId(null);
                      setMessage('');
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Nuevo Pedido
                  </button>
                </div>
                
                <div className="text-sm text-green-700">
                  <p>• El PDF contiene todos los detalles del pedido</p>
                  <p>• Guarda el ID para futuras consultas</p>
                  <p>• Recibirás confirmación por correo electrónico</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
