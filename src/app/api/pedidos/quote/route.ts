import { NextRequest, NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/validations/pedido';
import { calculateFlete, getOrigen } from '@/lib/helpers/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = quoteSchema.parse(body);
    const { bolsas, precioUnitario, location } = validatedData;

    // Calcular subtotal
    const subtotal = bolsas * precioUnitario;

    let flete = 0;
    let distanceKm = 0;

    // Si hay ubicación, calcular distancia y flete
    if (location) {
      try {
        // Obtener ubicación de origen
        const origen = await getOrigen();
        
        // Calcular distancia usando Google Maps Distance Matrix API
        const distance = await calculateDistance(origen, location);
        distanceKm = distance;
        
        // Calcular flete basado en la distancia
        flete = await calculateFlete(distance);
      } catch (error) {
        console.error('Error calculando distancia/flete:', error);
        // Usar flete mínimo si hay error
        const { getPricing } = await import('@/lib/helpers/pricing');
        const pricing = await getPricing();
        flete = pricing.fleteMinimo;
      }
    } else {
      // Si no hay ubicación, usar flete mínimo
      const { getPricing } = await import('@/lib/helpers/pricing');
      const pricing = await getPricing();
      flete = pricing.fleteMinimo;
    }

    // Calcular total final
    const totalFinal = subtotal + flete;

    return NextResponse.json({
      success: true,
      data: {
        subtotal,
        flete,
        totalFinal,
        distanceKm,
        bolsas,
        precioUnitario,
        location
      }
    });

  } catch (error) {
    console.error('Error en /api/pedidos/quote:', error);

    // Manejar errores de validación de Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Datos inválidos',
          errors: JSON.parse(error.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al calcular la cotización' 
      },
      { status: 500 }
    );
  }
}

async function calculateDistance(origen: { lat: number; lng: number }, destino: { lat: number; lng: number }): Promise<number> {
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key no configurada');
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&key=${GOOGLE_MAPS_API_KEY}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Error de Google Maps API: ${data.status}`);
  }

  if (!data.rows[0]?.elements[0]?.distance) {
    throw new Error('No se pudo calcular la distancia');
  }

  // Retornar distancia en kilómetros
  return data.rows[0].elements[0].distance.value / 1000;
}
