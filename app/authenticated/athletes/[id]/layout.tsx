import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Skeleton,
} from '@/components/ui'
import { Suspense } from 'react'
import { TabsComponents } from './components'
import { Details } from './components/details'
import { RouteEnum } from '@/enums'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='w-full h-full p-4 px-6 lg:px-10'>
      <div className='flex flex-col gap-0.5'>
        <div className='flex gap-1 items-center'>
          <h1 className='text-xl font-semibold'>Atleta - </h1>
          <Details />
        </div>
        <Breadcrumb className='print:hidden'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.AUTHENTICATED}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.ATHLETES}>Atletas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detalhes do atleta</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='w-full h-full pt-6 flex'>
        <TabsComponents>
          <Suspense
            fallback={
              <div className='mt-6 w-full h-full flex justify-center items-center'>
                <Skeleton className='w-full h-[200px] sm:h-[400px] rounded-md' />
              </div>
            }
          >
            {children}
          </Suspense>
        </TabsComponents>
      </div>
    </section>
  )
}
