import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,

} from '@/components/ui'
import { Create } from './create'

export default function AthleteList() {
  return (
    <section className='p-4 px-10'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>Lista de Atletas</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/auth'>Iniciar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Atletas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex flex-row-reverse'>
        <Create />
      </div>
    </section>
  )
}
