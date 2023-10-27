"use server";

import { revalidatePath } from "next/cache";
import { createCart, getCart } from "../../lib/db/cart";
import { prisma } from "../../lib/db/prisma";

export async function incrementServiceQuantity(serviceId: string, quantity: number) {
    //await new Promise(r => setTimeout(r, 3000));
    const cart = (await getCart()) ?? (await createCart());

    const articleInCart = cart.items.find((item) => item.serviceId === serviceId);

    if(articleInCart){
        await prisma.cart.update({
            where:{id: cart.id},
            data: {
                items: {
                    update: {
                        where: {id: articleInCart.id},
                        data: { quantity: {increment: 1} },
                    },
                },
            },
        });

    } else {
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: {
                    create: {
                        serviceId,
                        quantity: 1,
                    },
                },
            },
        });
    }

    revalidatePath("/cart");
}