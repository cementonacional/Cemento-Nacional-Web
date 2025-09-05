import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Purchase } from '@/lib/models';
import { constructEventFromBody, stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

// Manejar evento de sesión de checkout completada
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    await dbConnect();
    
    // Buscar la compra por sessionId
    const purchase = await Purchase.findOne({ 
      stripeSessionId: session.id 
    });
    
    if (!purchase) {
      console.log(`No se encontró compra para sessionId: ${session.id}`);
      return;
    }
    
    // Actualizar estado de pago
    await Purchase.findByIdAndUpdate(purchase._id, {
      paymentStatus: 'paid',
      stripePaymentIntentId: session.payment_intent as string,
      paymentMethod: session.payment_method_types?.[0] || 'card',
      updatedAt: new Date()
    });
    
    console.log(`Compra ${purchase._id} marcada como pagada`);
    
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

// Manejar evento de pago exitoso
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    await dbConnect();
    
    // Obtener el PaymentIntent con charges expandidos
    const expandedPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntent.id,
      { expand: ['charges.data.balance_transaction'] }
    );
    
    // Buscar la compra por paymentIntentId
    const purchase = await Purchase.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });
    
    if (!purchase) {
      console.log(`No se encontró compra para paymentIntentId: ${paymentIntent.id}`);
      return;
    }
    
    // Actualizar estado de pago y calcular comisiones
    const stripeFee = (expandedPaymentIntent as unknown as { charges?: { data?: Array<{ balance_transaction?: { fee?: number } }> } }).charges?.data?.[0]?.balance_transaction?.fee || 0;
    
    await Purchase.findByIdAndUpdate(purchase._id, {
      paymentStatus: 'paid',
      stripeFee: stripeFee / 100, // Convertir de centavos a pesos
      updatedAt: new Date()
    });
    
    console.log(`Compra ${purchase._id} confirmada como pagada`);
    
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

// Manejar evento de pago fallido
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    await dbConnect();
    
    // Buscar la compra por paymentIntentId
    const purchase = await Purchase.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });
    
    if (!purchase) {
      console.log(`No se encontró compra para paymentIntentId: ${paymentIntent.id}`);
      return;
    }
    
    // Actualizar estado de pago
    await Purchase.findByIdAndUpdate(purchase._id, {
      paymentStatus: 'failed',
      updatedAt: new Date()
    });
    
    console.log(`Compra ${purchase._id} marcada como fallida`);
    
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

// POST /api/stripe/purchase-webhook - Webhook de Stripe para compras
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json({
        error: 'Falta la firma de Stripe'
      }, { status: 400 });
    }
    
    // Construir evento de Stripe
    const event = constructEventFromBody(body, signature);
    
    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
        
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }
    
    return NextResponse.json({
      received: true
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return NextResponse.json({
      error: 'Error procesando webhook'
    }, { status: 400 });
  }
}
