'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StripeBuyButton from '@/components/StripeBuyButton';

interface CheckoutResponse {
  success: boolean;
  data?: {
    sessionId: string;
    url: string;
    amount: number;
    currency: string;
  };
  message?: string;
}

function ComprarContent() {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();

  // Verificar parámetros de URL para mostrar mensajes
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      setMessage('¡Pago exitoso! Tu orden ha sido procesada correctamente.');
    } else if (canceled === 'true') {
      setMessage('Pago cancelado. Puedes intentar nuevamente cuando lo desees.');
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    if (quantity < 1) {
      setMessage('Debe seleccionar al menos 1 bolsa');
      return;
    }

    setIsLoading(true);
    setMessage('Redirigiendo a Stripe...');

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data: CheckoutResponse = await response.json();

      if (data.success && data.data?.url) {
        // Redirigir a Stripe Checkout
        window.location.href = data.data.url;
      } else {
        setMessage(data.message || 'Error al crear sesión de pago');
      }
    } catch (error) {
      setMessage('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return quantity * 150; // $150 MXN por bolsa
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
          Comprar Cemento
        </h1>
        <p className="text-xl text-brand-black">
          Cemento Portland Gris CPC30 - La Fuerza del Presente
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Información del producto */}
        <div className="space-y-6">
          <div className="bg-brand-beige p-8 rounded-lg border-2 border-brand-black">
            <h2 className="text-2xl font-bold text-brand-black mb-4">
              Cemento Portland Gris CPC30
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-black font-semibold">Contenido Neto:</span>
                <span className="text-brand-black">25 kg</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-brand-black font-semibold">Precio Unitario:</span>
                <span className="text-brand-black text-xl font-bold">$150.00 MXN</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-brand-black font-semibold">Disponibilidad:</span>
                <span className="text-green-600 font-semibold">En Stock</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-brand-black">
              <h3 className="text-lg font-bold text-brand-black mb-2">
                Especificaciones Técnicas
              </h3>
              <ul className="text-sm text-brand-black space-y-1">
                <li>• Resistencia a la compresión: 30 MPa</li>
                <li>• Tiempo de fraguado inicial: 45-75 minutos</li>
                <li>• Tiempo de fraguado final: 375 minutos máximo</li>
                <li>• Cumple con la norma NMX-C-414-ONNCCE</li>
              </ul>
            </div>
          </div>

          <div className="bg-brand-beige p-6 rounded-lg border-2 border-brand-black">
            <h3 className="text-lg font-bold text-brand-black mb-4">
              Información de Envío
            </h3>
            <div className="space-y-2 text-sm text-brand-black">
              <p>• Envío disponible en toda la República Mexicana</p>
              <p>• Tiempo de entrega: 2-5 días hábiles</p>
              <p>• Costo de envío calculado según ubicación</p>
              <p>• Pago seguro con tarjeta de crédito/débito</p>
            </div>
          </div>
        </div>

        {/* Formulario de compra */}
        <div className="space-y-6">
          <div className="bg-brand-beige p-8 rounded-lg border-2 border-brand-black">
            <h2 className="text-2xl font-bold text-brand-black mb-6">
              Realizar Compra
            </h2>

            <div className="space-y-6">
              {/* Selector de cantidad */}
              <div>
                <label className="block text-brand-black font-semibold mb-3">
                  Cantidad de Bolsas
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  
                  <span className="text-2xl font-bold text-brand-black min-w-[60px] text-center">
                    {quantity}
                  </span>
                  
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 100}
                    className="w-10 h-10 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-brand-black mt-2">
                  Máximo 100 bolsas por pedido
                </p>
              </div>

              {/* Resumen de compra */}
              <div className="bg-white p-4 rounded-lg border border-brand-black">
                <h3 className="text-lg font-bold text-brand-black mb-3">
                  Resumen de Compra
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brand-black">Subtotal:</span>
                    <span className="text-brand-black font-semibold">
                      ${calculateTotal().toFixed(2)} MXN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-black">Envío:</span>
                    <span className="text-brand-black font-semibold">
                      Calculado al finalizar
                    </span>
                  </div>
                  <hr className="border-brand-black" />
                  <div className="flex justify-between">
                    <span className="text-brand-black font-bold text-lg">Total:</span>
                    <span className="text-brand-black font-bold text-xl">
                      ${calculateTotal().toFixed(2)} MXN
                    </span>
                  </div>
                </div>
              </div>

                             {/* Botón de compra personalizado */}
               <button
                 onClick={handleCheckout}
                 disabled={isLoading}
                 className="w-full py-4 bg-brand-red text-white text-xl font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
               >
                 {isLoading ? 'Procesando...' : 'Comprar Ahora'}
               </button>

               {/* O usar el botón de Stripe directamente */}
               <div className="text-center">
                 <p className="text-sm text-brand-black mb-2">O compra directamente con:</p>
                 <StripeBuyButton
                   buyButtonId="buy_btn_1S3THEDsNXfLCcFrs4o635kK"
                   publishableKey="pk_test_51S3T09DsNXfLCcFrsfaCHMzA2m3JjdRcWpy0PWpgfug7M1UwLvxS3EExtimLw8bniNDQNZlh7T1La0OhAMGjPTWy00EFlYlOzX"
                 />
               </div>

              {/* Mensajes */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('exitoso') 
                    ? 'bg-green-100 text-green-800' 
                    : message.includes('cancelado')
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              {/* Información de seguridad */}
              <div className="text-center">
                <p className="text-sm text-brand-black">
                  🔒 Pago seguro procesado por Stripe
                </p>
                <p className="text-xs text-brand-black mt-1">
                  Tus datos están protegidos y encriptados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComprarPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
        <p className="text-brand-black">Cargando...</p>
      </div>
    </div>}>
      <ComprarContent />
    </Suspense>
  );
}
