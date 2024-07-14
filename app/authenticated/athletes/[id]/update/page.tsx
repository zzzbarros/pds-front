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

type AthleteFormProps = z.input<typeof schema>
type AthleteProps = z.output<typeof schema>

const schema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: 'Nome é obrigatório',
      })
      .default(''),
    email: z
      .string()
      .min(2, {
        message: 'E-mail é obrigatório',
      })
      .email('E-mail inválido')
      .default(''),
    birthday: z.date({
      message: 'Data de nascimento é obrigatória',
    }),
    height: z.coerce.number().optional(),
    weight: z.coerce.number().optional(),
    serverError: z.string().default('').optional(),
  })
  .transform(({ email, name, birthday, height, weight }) => ({ email, name, birthday, height, weight }))

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

  const form = useForm<AthleteFormProps>({
    resolver: zodResolver(schema),
    defaultValues: data,
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: AthleteFormProps) {
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
      router.push(buildingRouteWithId(RouteEnum.MONITORY, id))
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
        <form
          id='athlete'
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-6 text-left py-4 sm:w-2/3 md:w-2/5 h-full'
        >
          <div className='flex flex-col gap-2.5'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Atleta</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Digite o nome do completo...' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Digite o e-mail...' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DatePicker
              control={form.control}
              name='birthday'
              label='Data de nascimento'
              disabled={(date) => date > new Date()}
            />
            <FormField
              control={form.control}
              name='height'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Adicione a altura do atleta...' type='number' step='0.01' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='weight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Adicione o peso do atleta...' type='number' step='1' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
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
