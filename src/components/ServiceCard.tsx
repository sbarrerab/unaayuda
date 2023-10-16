import {Service} from '@prisma/client'
import Link from 'next/link';
import PriceTag from './PriceTag';
import Image from "next/image";

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({service}: ServiceCardProps) {
    const isNew = Date.now() - new Date(service.createdAt).getTime() < 
    1000 * 60 * 60 * 24 * 7;

    return(
        <Link
        href={'/services/' + service.id}
        className='card w-full bg-base-100 hover: shadow-xl transition-shadow'
        >
            <figure>
                <Image
                    src={service.imageURL}
                    alt={service.name}
                    width={800}
                    height={400}
                    className='h-48 object-cover'
                />
            </figure>
            <div className='card-body'>
                <h2 className='card-title'>
                    {service.name}
                    {isNew && <div className='badge badge-secondary'>NUEVO</div>}
                </h2>
                <p>{service.description}</p>
                <PriceTag price={service.price} />
            </div>
        </Link>
    )
}