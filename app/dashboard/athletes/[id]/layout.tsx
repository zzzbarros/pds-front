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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='w-full h-full p-4 px-10'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>Detalhes do Atleta</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard'>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard/athletes'>Atletas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detalhes</BreadcrumbPage>
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
