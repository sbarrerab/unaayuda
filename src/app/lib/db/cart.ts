// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithServices = Prisma.CartGetPayload<{
    include: { items: { include: { service: true } } };
}>;

export type CartItemWithService = Prisma.CartItemGetPayload<{
    include: {service: true};
}>;

export type ShoppingCart = CartWithServices & {
    size: number,
    subtotal: number,
}

export async function getCart(): Promise<ShoppingCart | null>  {
    const session = await getServerSession(authOptions);

    let cart: CartWithServices | null = null;

    if (session) {
        cart = await prisma.cart.findFirst({
            where: { userId : session.user.id },
            include: { items: { include: { service: true } } },
        })
    } else {
        const localCartId = cookies().get("localCartId")?.value;
        cart = localCartId ?
            await prisma.cart.findUnique({
                where: {id: localCartId},
                include: { items: { include: { service: true } } },
            })
        : null;
    }

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
    const session = await getServerSession(authOptions);

    let newCart: Cart;

    if (session) {
        newCart = await prisma.cart.create({
            data: {userId: session.user.id},
        });
    } else {
        newCart = await prisma.cart.create({
            data: {},
        });

    // Nota: Se necesita enciptación + configuraciones de seguridad en producción
    cookies().set("localCartId", newCart.id);
    }

    return {
        ...newCart,
        items: [],
        size: 0,
        subtotal: 0,
    };
}

export async function mergeAnonymousCartIntoUserCart(userId:string) {
    const localCartId = cookies().get("localCartId")?.value;

    const localCart = localCartId ?
    await prisma.cart.findUnique({
            where: {id: localCartId},
            include: { items: true },
        })
    : null;

    if (!localCart) return;

    const userCart = await prisma.cart.findFirst({
        where: {userId},
        include: { items: true },
    })

    await prisma.$transaction(async tx => {
        if (userCart) {
            const mergedCartItems = mergeCartItems(localCart.items, userCart.items)

            await tx.cartItem.deleteMany({
                where: { cartId: userCart.id }
            })

            await tx.cartItem.createMany({
                data: mergedCartItems.map(item => ({
                    cartId: userCart.id,
                    serviceId: item.serviceId,
                    quantity: item.quantity,
                }))
            })
        } else {
            await tx.cart.create({
                data: {
                    userId,
                    items: {
                        createMany: {
                            data: localCart.items.map(item => ({
                                serviceId: item.serviceId,
                                quantity: item.quantity,
                            })),
                        },
                    },
                },
            });
        }

        await tx.cart.delete({
            where: {id: localCart.id},
        });
        // throw Error("test");
        cookies().set("localCartId", "");
    });
}

function mergeCartItems(...cartItems: CartItem[][]) {
    return cartItems.reduce((acc, items) => {
        items.forEach((item) => {
            const existingItem = acc.find((i) => i.serviceId === item.serviceId);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                acc.push(item);
            }
        });
        return acc;
    }, [] as CartItem[]);
}