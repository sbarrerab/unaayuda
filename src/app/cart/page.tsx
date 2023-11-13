import mercadopago from "mercadopago";
import { getCart } from "../lib/db/cart";
import { formatPrice } from "../lib/format";
import CartEntry from "./CartEntry";
import { setServiceQuantity } from "./actions";
//import { Metadata } from 'next'




export const metadata = {
    title: "Tu Carrito de Compras - UNa Ayuda",
};

export default async function CartPage() {
    const cart = await getCart();
    
    return(
        <div>
            <h1 className="text-3xl mb-6 font-bold">Carrito de Compras</h1>
            {cart?.items.map((cartItem) => (
                <CartEntry 
                    cartItem={cartItem} 
                    key={cartItem.id} 
                    setServiceQuantity={setServiceQuantity}
                />
            ))}
            {!cart?.items.length && <p>Tú carrito de compras está vacío.</p>}
            <div className="flex flex-col items-end sm:items-center">
                <p className="mb-3 font-bold">
                    Total: {formatPrice(cart?.subtotal || 0)}
                </p>
                <button className="btn btn-primary sm:w-[200px]">Proceder a pago</button>
                
            </div>
        </div>
    );
}