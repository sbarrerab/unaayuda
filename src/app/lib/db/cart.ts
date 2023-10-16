// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";

export type CartWithServices = Prisma.CartGetPayload<{
    include: { items: { include: { service: true } } }
}>

export type ShoppingCart = CartWithServices & {
    size: number,
    subtotal: number,
}

export async function getCart(): Promise<ShoppingCart | null>  {
    const localCartId = cookies().get("localCartId")?.value
    const cart = localCartId ?
    await prisma.cart.findUnique({
        where: {id: localCartId},
        include: { items: { include: { service: true } } },
    })
    : null;

    if (!cart) {
        return null;
    }

    return{
        ...cart,
        size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: cart.items.reduce(
            (acc, item) => acc + item.service.price * item.quantity, 0
        ),
    };
}

export async function createCart(): Promise<ShoppingCart> {
    const newCart = await prisma.cart.create({
        data: {}
    })

    // Nota: Se necesita enciptación + configuraciones de seguridad en producción
    cookies().set("localCartId", newCart.id);

    return {
        ...newCart,
        items: [],
        size: 0,
        subtotal: 0,
    }
}