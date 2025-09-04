import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updatePricing } from '@/lib/helpers/pricing';

// Esquema de validación para actualizar precios
const updatePricingSchema = z.object({
  tarifaPorKm: z.number()
    .min(0, 'La tarifa por kilómetro no puede ser negativa')
    .max(1000, 'La tarifa por kilómetro no puede ser mayor a 1000')
    .optional(),
  fleteMinimo: z.number()
    .min(0, 'El flete mínimo no puede ser negativo')
    .max(10000, 'El flete mínimo no puede ser mayor a 10000')
    .optional(),
  origen: z.object({
    lat: z.number()
      .min(-90, 'La latitud debe estar entre -90 y 90')
      .max(90, 'La latitud debe estar entre -90 y 90'),
    lng: z.number()
      .min(-180, 'La longitud debe estar entre -180 y 180')
      .max(180, 'La longitud debe estar entre -180 y 180'),
  }).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = updatePricingSchema.parse(body);

    // Actualizar configuración de precios
    const updatedPricing = await updatePricing(validatedData);

    return NextResponse.json({
      success: true,
      message: 'Configuración de precios actualizada correctamente',
      data: updatedPricing
    });

  } catch (error) {
    console.error('Error en /api/settings/pricing:', error);

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
        message: 'Error al actualizar la configuración de precios' 
      },
      { status: 500 }
    );
  }
}

// Endpoint para obtener la configuración actual
export async function GET() {
  try {
    const { getPricing } = await import('@/lib/helpers/pricing');
    const pricing = await getPricing();

    return NextResponse.json({
      success: true,
      data: pricing
    });

  } catch (error) {
    console.error('Error obteniendo configuración de precios:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener la configuración de precios' 
      },
      { status: 500 }
    );
  }
}
