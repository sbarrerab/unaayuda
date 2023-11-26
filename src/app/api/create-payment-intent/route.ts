import Stripe from 'stripe';
import { Cart,Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CartItem } from '@prisma/client';
import { prisma } from "@/app/lib/db/prisma";
import { get } from 'http';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export type CartWithServices = Prisma.CartGetPayload<{
    include: { items: { include: { service: true } } };
}>;



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16',
});

const calculateOrderAmount = async (items: CartWithServices[]) => {


    const cart = items[0];
    const totalPrice = cart.items.reduce((acc, item) => {
        const itemTotal = item.quantity * item.service.price;
        return acc + itemTotal;
    }, 0);

    return totalPrice;
};

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return NextResponse.redirect('/auth/signin');
    }

    const body = await request.json();
    const { items, payment_intent_id } = body;
    const total = await calculateOrderAmount(items) * 100;

    const orderData = {
        user : { connect: { id: session.user.id } },
        amount: total,
        currency: 'usd',
        status: 'pending',
        deliveryStatus: 'pending',
        paymentIntentId: payment_intent_id,
        service: items
    }

    if(payment_intent_id){
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if(current_intent){
            const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {amount: total});
            //update payment intent
            const [existing_order,update_order] = await Promise.all([  
                prisma.order.findFirst({
                    where: {
                        paymentIntentId: payment_intent_id
                    }
                }),
                prisma.order.update({
                    where: {
                        paymentIntentId: payment_intent_id
                    },
                    data: {
                        amount: total,
                        service: items
                    }
                })
            ]);
            if(!existing_order){
                return NextResponse.json(
                    {error: 'Invalid payment intent'},
                    {status: 400}
                );
            }
            return NextResponse.json({paymentIntent: updated_intent});
        }

    }else{
        //create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            automatic_payment_methods: {enabled: true},
        });
        //create order
        orderData.paymentIntentId = paymentIntent.id;

        await prisma.order.create({
            data: orderData
        });

        return NextResponse.json({paymentIntent})


    }
}

