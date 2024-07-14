import Link from 'next/link'
import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  SearchInput,
  Skeleton,
} from '@/components/ui'
import List from './list'
import { RouteEnum } from '@/enums'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AthleteList({ searchParams }: Props) {
  const { page = '1', search = '' } = searchParams

  return (
    <section className='w-full h-full p-4 px-6 md:px-10'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>Lista de Atletas</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.AUTHENTICATED}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Atletas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='pt-6 flex justify-between flex-wrap sm:flex-nowrap gap-4'>
        <SearchInput placeholder='Procure pelo nome do atleta ou e-mail...' value={search as string} />
        <Link href={RouteEnum.CREATE_ATHLETE} className='w-full md:w-fit'>
          <Button className='w-full md:w-fit px-6 md:px-10'>
            <Plus />
            Cadastrar atleta
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className='mt-6 w-full h-full flex justify-center items-center'>
            <Skeleton className='w-full h-[200px] sm:h-[400px] rounded-md' />
          </div>
        }
      >
        <List page={page as string} search={search as string} />
      </Suspense>
    </section>
  )
}
