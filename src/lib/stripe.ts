import Stripe from 'stripe';

// Inicializar Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Producto de cemento con Price ID fijo
export const CEMENTO_PRODUCT = {
  name: 'Cemento Portland Gris CPC30',
  description: 'Cemento Portland Gris CPC30 - Contenido Neto 25kg',
  priceId: process.env.STRIPE_PRICE_ID || 'price_1ABC123DEF456GHI789JKL', // Reemplaza con tu Price ID real
  currency: 'mxn',
  unit_label: 'bolsa'
};

// Crear sesión de checkout
export async function createCheckoutSession(quantity: number = 1) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: CEMENTO_PRODUCT.priceId, // Usar Price ID fijo
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/comprar?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/comprar?canceled=true`,
      metadata: {
        product: 'cemento-cpc30',
        quantity: quantity.toString(),
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Error al crear sesión de pago');
  }
}

// Verificar sesión de checkout
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw new Error('Error al obtener sesión de pago');
  }
}

// Verificar firma del webhook
export function constructEventFromBody(
  body: string | Buffer,
  signature: string
) {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw new Error('Error al verificar firma del webhook');
  }
}

// Obtener información del pago
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw new Error('Error al obtener información del pago');
  }
}
