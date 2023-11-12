// Entrada a la pg de servicio (Agregar servicio)

import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";
import FormSumitButton from "@/components/FormSubmitButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
    title: 'Agregar Servicio - UNa Ayuda',
}

// Indica a next.js que es una acción del servidor de lo contrario no serviria

async function addService(formData: FormData) {
    "use server";

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/add-service");
    }

    // inicializar variables
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const imageURL = formData.get('imageURL')?.toString();
    const price = Number(formData.get('price') || 0);

    //throw Error ("Bazinga!")
    if (!name || !description || !imageURL || !price){
        throw Error("Campos faltantes requeridos");
    }


    // Para crear el mismo item varias veces
    for (let i = 0; i < 50; i++){
        // permitir realizar a prisma una operación dentro de la bd
        await prisma.service.create({
            data: {name, description, imageURL, price},
        });
    }


  /*  await prisma.service.create({
        data: {name, description, imageURL, price},
    });*/
    
    // Redireccionar a la pg principal depues de ingresar el servcio
    redirect("/");
}

export default async function AddServicePage(){
    const session = await getServerSession(authOptions);

    if (!session){
        redirect("/api/auth/signin?callbackUrl=/add-service");
    }

    return(
        <div>
            <h1 className="text-lg mb-3 font-bold">Agregar Servicio</h1>
            <form action={addService}>
                <input 
                    required 
                    name="name"
                    placeholder="Nombre"
                    className="mb-3 w-full input input-bordered"
                />
                <textarea
                    required
                    name="description"
                    placeholder="Descripción"
                    className="textarea textarea-bordered mb-3 w-full"
                />
                <input 
                    required 
                    name="imageURL"
                    placeholder="URL de la imágen"
                    type="url"
                    className="mb-3 w-full input input-bordered"
                />
                <input
                    required
                    name="price"
                    placeholder="Precio"
                    type="number"
                    className="textarea textarea-bordered mb-3 w-full"
                />
                <FormSumitButton className='btn-block'>
                    Agregar Servicio
                </FormSumitButton>
            </form>
        </div>
    )
}