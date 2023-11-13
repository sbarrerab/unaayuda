import Image from 'next/image';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import { prisma } from './lib/db/prisma';
import PaginationBar from '@/components/PaginationBar';

/*
export default async function Home() {
  const services = await prisma.service.findMany({
    orderBy: {id: 'desc'}
  });
  */

interface HomeProps {
    searchParams: { page: string };
}
export default async function Home({
  searchParams: { page = "1" }, 
}: HomeProps) {
  const currentPage = parseInt(page);

  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = await prisma.service.count();

  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const services = await prisma.service.findMany({
    orderBy: { id: "desc" },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });

  return (
    <div className='flex flex-col items-center'>
      {currentPage === 1 && (
        <div className='hero rounded-xl bg-base-200'>
          <div className='hero-content flex-col lg:flex-row'>
            <Image
              src={services[0].imageURL}
              alt={services[0].name}
              width={400}
              height={800}
              className='w-full max-w-sm rounded-lg shadow-2xl'
              priority
            />
            <div>
              <h1 className='text-5xl font-bold'>{services[0].name}</h1>
              <p className='py-6'>{services[0].description}</p>
              <Link
              href={'/services/' + services[0].id}
              className='btn btn-primary'>
                Más
              </Link>
            </div>
          </div>
        </div>
      )}
        <div className='my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {(currentPage === 1 ? services.slice(1) : services).map((service) => (
            <ServiceCard service={service} key={service.id} />
          ))}
        </div>

          {totalPages > 1 && (
            <PaginationBar currentPage={currentPage} totalPages={totalPages} />
          )}
    </div>
  );
}
