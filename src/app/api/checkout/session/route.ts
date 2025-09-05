import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import { Purchase } from '@/lib/models';

// Schema de validación
const checkoutSchema = z.object({
  quantity: z.number().min(1).max(100).default(1),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  customerCompany: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Validar request body
    const body = await request.json();
    const { quantity, customerName, customerEmail, customerPhone, customerCompany } = checkoutSchema.parse(body);

    // Crear sesión de checkout
    const session = await createCheckoutSession(quantity);

    // Registrar la compra en la base de datos
    await dbConnect();
    
    const unitPrice = 150; // Precio unitario del cemento
    const subtotal = quantity * unitPrice;
    const totalAmount = session.amount_total ? session.amount_total / 100 : subtotal; // Convertir de centavos a pesos

    const purchase = new Purchase({
      customerName: customerName || 'Cliente',
      customerEmail: customerEmail || 'cliente@email.com',
      customerPhone: customerPhone,
      customerCompany: customerCompany,
      productName: 'Cemento Nacional - Bolsa 50kg',
      productDescription: 'Cemento de alta calidad para construcción',
      quantity: quantity,
      unitPrice: unitPrice,
      subtotal: subtotal,
      stripeSessionId: session.id,
      totalAmount: totalAmount,
      currency: session.currency || 'MXN',
      paymentStatus: 'pending'
    });

    await purchase.save();

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
        amount: session.amount_total,
        currency: session.currency,
        purchaseId: purchase._id
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
