'use client'

import { startTransition, useLayoutEffect } from 'react'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientFetcher } from '@/services'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
  DatePicker,
  Button,
  Spinner,
} from '@/components/ui'
import revalidateTag from '@/lib/revalidateAction'
import Link from 'next/link'
import { RouteEnum } from '@/enums'
import { useRouter } from 'next-nprogress-bar'
import { IPageProps } from '@/types'
import { useSWR } from '@/lib/swr'
import { buildingRouteWithId } from '@/lib/utils'
import { AthleteTemplate, type IAthleteFormProps } from '@/components/templates'

type AthleteProps = z.output<typeof AthleteTemplate.schema>

export default function UpdateAthlete({ params }: IPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const actionTitle = 'Editar'
  const athleteURL = 'athletes/'.concat(id)

  const { data, isLoading } = useSWR(['athlete', id], async () => {
    if (!id) return
    const res = await clientFetcher<AthleteProps>(athleteURL)
    if (res.ok) {
      return res.data
    }
  })

  const form = useForm<IAthleteFormProps>({
    resolver: zodResolver(AthleteTemplate.schema),
    defaultValues: data,
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: IAthleteFormProps) {
    const res = await clientFetcher(athleteURL, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    if (res.ok) {
      revalidateTag('athletes')
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
      router.push(buildingRouteWithId(RouteEnum.MONITORY, id), { scroll: true })
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

  useLayoutEffect(() => {
    !!data && form.reset({ ...data, birthday: new Date(data.birthday) })
    return () => {
      form.reset({})
    }
  }, [data])

  return (
    <div className='flex flex-col justify-center w-full gap-1 relative h-full py-4'>
      <header className='flex flex-col gap-0.5'>
        <span className='flex gap-4'>
          <h1 className='text-xl md:text-lg font-semibold'>{actionTitle} atleta</h1>
          {isLoading && <Spinner />}
        </span>
        <p className='text-lg md:text-base text-balance'>
          Preencha os campos a seguir para {actionTitle.toLowerCase()} o seu atleta na plataforma.
        </p>
      </header>
      <Form {...form}>
        <div>
          <AthleteTemplate.Form onSubmit={onSubmit} />
        </div>
      </Form>
      <footer className='flex flex-row justify-between mb-4 w-full gap-8 sm:w-2/3 md:w-2/5'>
        <Link href={RouteEnum.ATHLETES} className='w-fit' tabIndex={-1}>
          <Button type='button' variant='outline'>
            Cancelar
          </Button>
        </Link>
        <Button
          form='athlete'
          className='w-fit'
          type='submit'
          isLoading={isSubmitting}
          disabled={!form.formState.isDirty}
        >
          {!isSubmitting && <Save size={20} />}
          {actionTitle}
        </Button>
      </footer>
    </div>
  )
}
