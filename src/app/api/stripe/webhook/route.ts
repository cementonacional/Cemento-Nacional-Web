import { NextRequest, NextResponse } from 'next/server';
import { constructEventFromBody } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/lib/models';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    // Obtener el body y signature
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Firma de webhook faltante' },
        { status: 400 }
      );
    }

    // Verificar la firma del webhook
    const event = constructEventFromBody(body, signature);

    // Conectar a la base de datos
    await dbConnect();

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Error en webhook' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Verificar si ya existe la orden
    const existingOrder = await Order.findOne({ 
      stripeSessionId: session.id 
    });

    if (existingOrder) {
      console.log('Orden ya existe:', session.id);
      return;
    }

    // Crear nueva orden
    const order = new Order({
      stripeSessionId: session.id,
      status: 'completed',
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
    });

    await order.save();
    console.log('Orden creada:', order._id);

  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Actualizar orden si existe
    const order = await Order.findOne({ 
      stripeSessionId: paymentIntent.metadata?.session_id 
    });

    if (order) {
      order.status = 'completed';
      order.updatedAt = new Date();
      await order.save();
      console.log('Orden actualizada:', order._id);
    }

  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Actualizar orden si existe
    const order = await Order.findOne({ 
      stripeSessionId: paymentIntent.metadata?.session_id 
    });

    if (order) {
      order.status = 'failed';
      order.updatedAt = new Date();
      await order.save();
      console.log('Orden marcada como fallida:', order._id);
    }

  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error);
  }
}
