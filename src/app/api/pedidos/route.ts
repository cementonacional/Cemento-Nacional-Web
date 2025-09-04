import { NextRequest, NextResponse } from 'next/server';
import { pedidoSchema } from '@/lib/validations/pedido';
import dbConnect from '@/lib/mongodb';
import Pedido from '@/lib/models/Pedido';
import { calculateFlete, getOrigen } from '@/lib/helpers/pricing';

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnect();

    const body = await request.json();

    // Validar datos con Zod
    const validatedData = pedidoSchema.parse(body);
    const { 
      nombre, 
      correo, 
      telefono, 
      compania, 
      bolsas, 
      precioUnitario, 
      address, 
      location, 
      notas 
    } = validatedData;

    // Calcular subtotal
    const subtotal = bolsas * precioUnitario;

    let flete = 0;
    let distanceKm = 0;

    // Calcular flete y distancia si hay ubicación
    if (location) {
      try {
        const origen = await getOrigen();
        const distance = await calculateDistance(origen, location);
        distanceKm = distance;
        flete = await calculateFlete(distance);
      } catch (error) {
        console.error('Error calculando distancia/flete:', error);
        const { getPricing } = await import('@/lib/helpers/pricing');
        const pricing = await getPricing();
        flete = pricing.fleteMinimo;
      }
    } else {
      // Usar flete mínimo si no hay ubicación
      const { getPricing } = await import('@/lib/helpers/pricing');
      const pricing = await getPricing();
      flete = pricing.fleteMinimo;
    }

    // Calcular total final
    const totalFinal = subtotal + flete;

    // Crear el pedido en la base de datos
    const pedido = await Pedido.create({
      nombre,
      correo,
      telefono,
      compania,
      bolsas,
      precioUnitario,
      subtotal,
      flete,
      totalFinal,
      address,
      location,
      distanceKm,
      notas,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Pedido guardado correctamente',
        data: {
          id: pedido._id,
          nombre: pedido.nombre,
          correo: pedido.correo,
          totalFinal: pedido.totalFinal,
          createdAt: pedido.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en /api/pedidos:', error);

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
        message: 'Error al guardar el pedido' 
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
