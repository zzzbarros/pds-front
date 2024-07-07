'use client'

import { useRouter } from 'next-nprogress-bar'
import { setCookie } from 'cookies-next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  useToast,
} from '@/components/ui'
import { services } from '@/services'

type FormProps = z.input<typeof schema>
type OutputFormProps = z.output<typeof schema>

const schema = z
  .object({
    email: z
      .string()
      .min(2, {
        message: 'E-mail é obrigatório',
      })
      .email('E-mail inválido')
      .default(''),
    password: z
      .string()
      .min(2, {
        message: 'Senha é obrigatório',
      })
      .default(''),
    keepLogin: z.boolean().default(false),
    serverError: z.string().default('').optional(),
  })
  .transform(({ email, password }) => ({ email, password }))

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  const fields = [
    { name: 'email', label: 'E-mail', placeholder: 'Digite o seu e-mail...' },
    {
      name: 'password',
      label: 'Senha',
      placeholder: 'Digite o sua senha...',
      type: 'password',
      autoComplete: 'current-password',
    },
  ]

  async function onSubmit(data: FormProps) {
    const res = await services.auth.login(data as OutputFormProps)

    if (res.ok) {
      setCookie('user', JSON.stringify(res.data))
      router.push('/authenticated')
      router.refresh()
    } else {
      form.setError('serverError', {})
      if (res?.data?.title && res?.data?.message) {
        toast({
          title: res.data.title,
          description: res.data.message,
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <section className='w-full text-center' tabIndex={-1}>
      <h1 className='text-2xl text-primary-medium font-bold'>Acesse sua conta</h1>
      <p className='mt-[6px] mb-6 text-zinc-600 font-medium text-balance'>
        Insira seu e-mail para acessar o painel do usuário.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col max-w-xs md:max-w-sm mx-auto gap-6 text-left'
        >
          <div className='flex flex-col gap-3'>
            {fields.map(({ label, name, placeholder, type, autoComplete }, index) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof Omit<FormProps, 'keepLogin'>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        {...(!index && { autoFocus: true })}
                        {...{ type, autoComplete }}
                        placeholder={placeholder}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <fieldset className='flex items-center space-x-2 mt-1'>
              <Checkbox
                id='keepLogin'
                checked={form.watch('keepLogin')}
                onCheckedChange={(checked) => form.setValue('keepLogin', checked as boolean)}
              />
              <Label className='text-zinc-700' htmlFor='keepLogin'>
                Manter-se conectado
              </Label>
            </fieldset>
          </div>
          <Button isLoading={form.formState.isSubmitting} type='submit'>
            Continuar
          </Button>
        </form>
      </Form>
    </section>
  )
}
