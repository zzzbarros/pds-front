import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
        <Drawer>
          <DrawerTrigger asChild>
            <Button className='px-10'>Cadastrar atleta</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className='flex flex-col justify-center w-1/3 mx-auto gap-2'>
              <DrawerHeader className='text-center'>
                <DrawerTitle>Cadastro de atleta</DrawerTitle>
                <DrawerDescription>
                  Preencha os campos a seguir para cadastrar o seu atleta na plataforma.
                </DrawerDescription>
              </DrawerHeader>
              <Create />
              <DrawerFooter className='flex flex-row justify-between'>
                <DrawerClose className='w-fit'>
                  <Button variant='outline'>Cancelar</Button>
                </DrawerClose>
                <Button form='athlete' className='w-fit' type='submit'>
                  Cadastrar
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div></div>
    </section>
  )
}
