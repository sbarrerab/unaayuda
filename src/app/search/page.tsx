import ServiceCard from "@/components/ServiceCard"
import { prisma } from "../lib/db/prisma"
import { Metadata } from "next";

interface SearchPageProps {
    searchParams: { query: string };
}

export function generateMetaData({
    searchParams: {query}, 
} : SearchPageProps) : Metadata {
    return {
        title: 'Buscar: ${query} - UNa Ayuda',
    };
}

export default async function SearchPage({
    searchParams : {query},
 }: SearchPageProps) {
    const services = await prisma.service.findMany({
        where: {
            OR: [
                { name: { contains : query, mode: "insensitive" } },
                { description: { contains : query, mode: "insensitive" } },
            ],
        },
        orderBy: {id: "desc"}
    });

    if (services.length === 0) {
        return <div className="text-center"></div>
    }

    return (
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl: grid-cols-3 gap-4">
            {services.map(service => (
                <ServiceCard service={service} key={service.id} />
            ))}
        </div>
    )
}
