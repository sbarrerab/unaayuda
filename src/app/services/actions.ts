"use server";

import { revalidatePath } from "next/cache";
import { createCart, getCart } from "../lib/db/cart";
import { prisma } from "../lib/db/prisma";

export async function incrementServiceQuantity(serviceId: string, quantity: number) {
    //await new Promise(r => setTimeout(r, 3000));
    const cart = (await getCart()) ?? (await createCart());

    const articleInCart = cart.items.find((item) => item.serviceId === serviceId);

    if(articleInCart){
        await prisma.cartItem.update({
            where: {id: articleInCart.id},
            data: { quantity },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                serviceId,
                quantity: 1,
            },
        });
    }

    revalidatePath("/cart");
}