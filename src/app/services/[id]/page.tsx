// Consultar información del servicio

import { prisma } from "@/app/lib/db/prisma";
import PriceTag from "@/components/PriceTag";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import { incrementServiceQuantity } from "./actions";


// SDK de Mercado Pago
import MercadoPago from "mercadopago";
// Agrega credenciales
const client = new MercadoPago({ accessToken: 'TEST-920519261779570-111215-43aa33295fa61f13698240ad5c6ec8ce-1545328699' });

let preference = ({
    items: [{

    }]
});

 

interface ServicePageProps{
    params: {
        id: string,
    }
}

// Guardar el servicio em cache - Obtenerlo de la bd y luego retornarlo
const getService = cache(async (id: string) => {
    const service = await prisma.service.findUnique({where: {id}})
    if (!service) notFound();
    return service;

    
})

export async function generateMetadata(
    {params: {id}} : ServicePageProps
): Promise<Metadata> {
    const service = await getService(id);

    return {
        title: service.name + ' - UNa Ayuda',
        description: service.description,
        openGraph:{
            images: [{ url: service.imageURL}],
        },
    };
}

export default async function ServicePage (
    {params: {id}} : ServicePageProps
){  
    const service = await getService(id);

    return(
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <Image
                src={service.imageURL}
                alt={service.name}
                width={500}
                height={500}
                className='rounded-lg'
                priority
            />

            <div>
                <h1 className="text-5xl font-bold">{service.name}</h1>
                <PriceTag price={service.price} className="mt-4"/>
                <p className="py-6">{service.description}</p>
                <AddToCartButton 
                    serviceId={service.id} 
                    incrementServiceQuantity={incrementServiceQuantity}
                />
            </div>
        </div>
    );

    preference.items.push({
        name: service.name,
        price: service.price,
        quantity: 1,
    });




}