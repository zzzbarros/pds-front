'use client'

import Link from 'next/link'
import { startTransition } from 'react'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next-nprogress-bar'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientFetcher } from '@/services'
import {
  Form,
  useToast,
  Button,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui'
import revalidateTag from '@/lib/revalidateAction'
import { RouteEnum } from '@/enums'
import { AthleteTemplate, type IAthleteFormProps } from '@/components/templates'

export default function AthleteForm() {
  const router = useRouter()
  const { toast } = useToast()
  const actionTitle = 'Cadastrar'

  const form = useForm<IAthleteFormProps>({
    resolver: zodResolver(AthleteTemplate.schema),
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: IAthleteFormProps) {
    const res = await clientFetcher('athletes', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (res.ok) {
      revalidateTag('athletes')
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
      router.push(RouteEnum.ATHLETES, { scroll: true })
    } else {
      startTransition(() => {
        toast({
          title: res.data?.title || 'Ops parece que ocorreu um erro!',
          description: res.data?.message || 'Tente novamente em instantes...',
          variant: 'destructive',
        })
        if (res.status === 409) {
          form.setError('email', { message: res.data.title })
          form.setFocus('email')
        } else {
          form.setError('serverError', {})
        }
      })
    }
  }

  return (
    <div className='flex flex-col justify-center w-full gap-1 relative h-full py-6 px-6 md:px-8'>
      <header className='flex flex-col gap-0.5 px-6 md:px-8'>
        <h1 className='text-xl font-semibold'>{actionTitle} atleta</h1>
        <Breadcrumb>
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
              <BreadcrumbPage>Criar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className='mt-4'>Preencha os campos a seguir para {actionTitle.toLowerCase()} o seu atleta na plataforma.</p>
      </header>
      <div className='px-6 md:px-8'>
        <Form {...form}>
          <AthleteTemplate.Form onSubmit={onSubmit} />
        </Form>
        <footer className='flex flex-row justify-between mb-4 py-4 w-full sm:w-2/3 md:max-w-[40%]'>
          <Link href={RouteEnum.ATHLETES} className='w-fit' tabIndex={-1}>
            <Button variant='outline'>Cancelar</Button>
          </Link>
          <Button form='athlete' className='w-fit' type='submit' isLoading={isSubmitting}>
            {!isSubmitting && <Save size={20} />}
            {actionTitle}
          </Button>
        </footer>
      </div>
    </div>
  )
}
