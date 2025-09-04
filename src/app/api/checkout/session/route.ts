import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { z } from 'zod';

// Schema de validación
const checkoutSchema = z.object({
  quantity: z.number().min(1).max(100).default(1),
});

export async function POST(request: NextRequest) {
  try {
    // Validar request body
    const body = await request.json();
    const { quantity } = checkoutSchema.parse(body);

    // Crear sesión de checkout
    const session = await createCheckoutSession(quantity);

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
        amount: session.amount_total,
        currency: session.currency,
      },
    });

  } catch (error) {
    console.error('Checkout session error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Datos inválidos',
          errors: error.issues 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al crear sesión de pago' 
      },
      { status: 500 }
    );
  }
}
