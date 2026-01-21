import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
  : null;

export async function testStripe(action: string) {
  if (!stripe) {
    return {
      success: false,
      message: 'Stripe secret key not configured',
      metadata: { error: 'Set STRIPE_SECRET_KEY environment variable' },
    };
  }

  switch (action) {
    case 'create-customer':
      try {
        const customer = await stripe.customers.create({
          email: `test-${Date.now()}@example.com`,
          name: 'Test Customer',
          metadata: { test: 'true', timestamp: new Date().toISOString() },
        });
        return {
          success: true,
          message: `Customer created: ${customer.id}`,
          metadata: { customerId: customer.id, email: customer.email },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Stripe create customer failed: ${error.message}`,
        };
      }

    case 'list-products':
      try {
        const products = await stripe.products.list({ limit: 10 });
        return {
          success: true,
          message: `Found ${products.data.length} products`,
          metadata: {
            products: products.data.map(p => ({ id: p.id, name: p.name })),
            count: products.data.length,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Stripe list products failed: ${error.message}`,
        };
      }

    case 'create-payment':
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 1000,
          currency: 'usd',
          metadata: { test: 'true', timestamp: new Date().toISOString() },
        });
        return {
          success: true,
          message: `Payment intent created: ${paymentIntent.id}`,
          metadata: {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Stripe create payment failed: ${error.message}`,
        };
      }

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }
}
