import Stripe from 'stripe';
import { prisma } from '../../config/prisma.js';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export class PaymentService {

    async createPayment(orderId: string, total: number) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'usd',
            metadata: { orderId },
        });

        return {
            clientSecret: paymentIntent.client_secret!,
            paymentIntentId: paymentIntent.id,
        };
    }

    async processWebhook(payload: Buffer, sig: string) {
        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);

        const orderId = event.data.object?.metadata?.orderId;
        if (!orderId) return;

        switch (event.type) {
            case 'payment_intent.succeeded':
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'PAID', stripePaymentIntentId: event.data.object.id },
                });
                break;

            case 'payment_intent.payment_failed':
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'CANCELLED' },
                });
                break;
        }
    }

}