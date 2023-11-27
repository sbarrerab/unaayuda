
/*
import ServiceCard from "@/components/ServiceCard";
import { prisma } from "../lib/db/prisma";
import { Metadata } from "next";

interface SearchPageProps {
    searchParams: { query: string };
}

 --------
export function generateMetaData({
    searchParams: {query}, 
} : SearchPageProps) : Metadata {
    return {
        title: 'Buscar: ${query} - UNa Ayuda',
    };
}
------
export function generateMetaData({
    searchParams: { query }, 
}: SearchPageProps): Metadata {
    return {
        title: `Buscar: ${query} - UNa Ayuda`,
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
        orderBy: {id: "desc"},
    });

    if (services.length === 0) {
        return <div className="text-center"></div>;
    }

    return (
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl: grid-cols-3 gap-4">
            {services.map((service) => (
                <ServiceCard service={service} key={service.id} />
            ))}
        </div>
    );
}
*/


// Import necessary modules
import Head from 'next/head';
import ServiceCard from "@/components/ServiceCard";
import { prisma } from "../lib/db/prisma";

// Define the SearchPageProps interface
interface SearchPageProps {
    searchParams: { query: string };
}

// Define the SearchPage component
export default async function SearchPage({
    searchParams: { query },
}: SearchPageProps) {
    // Fetch data from the API or database
    const services = await prisma.service.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: { id: "desc" },
    });

    // Render the page content
    if (services.length === 0) {
        return <div className="text-center"></div>;
    }

    return (
        <div>
            {/* Set page metadata using the Head component */}
            <Head>
                <title>{`Buscar: ${query} - UNa Ayuda`}</title>
                {/* Add other meta tags, styles, etc. as needed */}
            </Head>
            
            {/* Render the page content */}
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {services.map((service) => (
                    <ServiceCard service={service} key={service.id} />
                ))}
            </div>
        </div>
    );
}