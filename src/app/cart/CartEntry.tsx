"use client"

import Image from "next/image";
import { CartItemWithService } from "../lib/db/cart";
import Link from "next/dist/client/link";
//import { format } from "path";
import { formatPrice } from "../lib/format";
import { useTransition } from "react";

interface CartEntryProps{
    cartItem:CartItemWithService;
    setServiceQuantity: (serviceId: string, quantity: number) => Promise<void>;
}
export default function CartEntry({
    cartItem : {service, quantity}, 
    setServiceQuantity, 
} : CartEntryProps){

    const [isPending, startTransition] = useTransition();

    const quantityOptions: JSX.Element[] = [];
    for (let i = 1; i <= 99; i++) {
        quantityOptions.push(
            <option value={i} key={i}>
            {i}
            </option>
        );
    }

    return(
        <div>
            <div className="flex flex-wrap items-center gap-3">
                <Image
                    src={service.imageURL}
                    alt={service.name}
                    width={200}
                    height={200}
                    className="rounded-lg"
                />
                <div>
                    <Link href={"/services/" + service.id} className="font-bold">
                        {service.name}
                    </Link>
                    <div>Precio: { formatPrice(service.price) } </div>
                    <div className="my-1 flex items-center gap-2">
                        Cantidad:
                        <select
                        className="select select-bordered w-full max-w-[80px]"
                        defaultValue={quantity}
                        onChange={(e) => {
                            const newQuantity = parseInt(e.currentTarget.value);
                            startTransition(async () => {
                                await setServiceQuantity(service.id, newQuantity);
                            });
                        }}
                        >
                            <option value={0}>0 (Eliminar)</option>
                            {quantityOptions}
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        Total: {formatPrice(service.price * quantity)}
                        {isPending && (
                            <span className="loading loading-spinner loading-sm"/>
                        )}
                    </div>
                </div>
            </div>
            <div className="divider"/>
        </div>
    );

}