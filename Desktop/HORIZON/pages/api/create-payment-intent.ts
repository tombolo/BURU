import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-07-30.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { amount } = req.body;

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "usd", // or your actual currency
                automatic_payment_methods: { enabled: true },
            });

            res.json({ clientSecret: paymentIntent.client_secret });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).end("Method Not Allowed");
    }
}
