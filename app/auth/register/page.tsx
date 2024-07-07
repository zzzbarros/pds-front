'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@/components/ui'
import { services } from '@/services/api'

type FormProps = z.input<typeof schema>

const schema = z
  .object({
    name: z.string().min(2, {
      message: 'Nome é obrigatório',
    }),
    email: z
      .string()
      .min(2, {
        message: 'E-mail é obrigatório',
      })
      .email('E-mail inválido'),
    serverError: z.string().default('').optional(),
  })
  .transform(({ email, name }) => ({ email, name }))

export default function RegisterPage() {
  const { toast } = useToast()
  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      name: '',
    },
  })

  const fields = [
    { name: 'name', label: 'Nome', placeholder: 'Digite o seu nome completo...' },
    { name: 'email', label: 'E-mail', placeholder: 'Digite o seu e-mail...' },
  ]

  async function onSubmit(data: FormProps) {
    const res = await services.users.coach.create(data)
    if (!res.ok) {
      toast({
        title: res.title,
        description: res.message,
        variant: 'destructive',
      })
      if (res?.conflict) {
        form.setError('email', { message: res.message })
        form.setFocus('email')
      } else {
        form.setError('serverError', {})
      }
    }
  }

  if (form.formState.isSubmitSuccessful)
    return (
      <div className='w-full text-center'>
        <h1 className='text-2xl text-primary-medium font-bold'>Verifique seu E-mail</h1>
        <p className='mt-[6px] mb-6 text-zinc-600 font-medium text-balance'>
          Enviamos para seu e-mail a confirmação dos próximos passos...
        </p>
        <p className='mt-[6px] mb-6 text-zinc-600 font-medium'>
          E-mail: <span className='font-bold text-lg'>{form.watch('email')}</span>.
        </p>
      </div>
    )

  return (
    <section className='w-full text-center' tabIndex={-1}>
      <h1 className='text-2xl text-primary-medium font-bold'>Crie sua conta</h1>
      <p className='mt-[6px] mb-6 text-zinc-600 font-medium text-balance'>
        Insira seu e-mail para continuar com a criação do usuário.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col max-w-xs md:max-w-sm mx-auto gap-6 text-left'
        >
          <div className='flex flex-col gap-3'>
            {fields.map(({ label, name, placeholder }, index) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof FormProps}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...(!index && { autoFocus: true })} placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button type='submit' disabled={form.formState.isSubmitting} isLoading={form.formState.isSubmitting}>
            Continuar
          </Button>
        </form>
      </Form>
    </section>
  )
}
