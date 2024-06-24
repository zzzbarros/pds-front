import { Suspense } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Skeleton,
} from '@/components/ui'
import List from './list'
import { Create } from './create'
import { SearchInput } from '@/components/ui/search-input'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AthleteList({ searchParams }: Props) {
  const { page = '1', search = '' } = searchParams

  return (
    <section className='w-full h-full p-4 px-10'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>Lista de Atletas</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/authenticated'>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Atletas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='pt-6 flex justify-between'>
        <SearchInput placeholder='Procure pelo nome do atleta ou e-mail...' value={search as string} />
        <Create />
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
