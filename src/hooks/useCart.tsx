import { CartWithServices } from "@/app/lib/db/cart";
import { createContext, use, useCallback, useContext, useState } from "react";

type CartContextType = {
    cartTotalQty : number;
    cartService: CartWithServices[] | null;
    handleAddServiceToCart: (service: CartWithServices) => void
}

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
    [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartService, setCartService] = useState<CartWithServices[] | null>(null);


    const handleAddServiceToCart = useCallback((service: CartWithServices) => {
        setCartService((prevState) => {
            let updatedCart;

            if(prevState){
                updatedCart = [...prevState, service];
            }else{
                updatedCart = [service];
            }

            return updatedCart;
        });
    }, []);
    const value = {
        cartTotalQty,
        cartService,
        handleAddServiceToCart,
    };

    return <CartContext.Provider value={value} {...props} />;

};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error(`useCart must be used within a CartContextProvider`);
    }
    return context;
}


