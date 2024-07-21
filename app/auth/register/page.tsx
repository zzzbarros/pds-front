'use client'

import Link from 'next/link'
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
import { services } from '@/services/api'
import { RouteEnum } from '@/enums'
import { validator } from '@/lib/validator'
import { mask } from '@/lib/mask'

type FormProps = z.input<typeof schema>

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: 'Nome é obrigatório',
      })
      .min(4, {
        message: 'Nome deve ter no mínimo 4 caracteres.',
      })
      .refine(validator.name, { message: 'Nome completo inválido' }),
    email: z
      .string()
      .trim()
      .min(1, {
        message: 'E-mail é obrigatório',
      })
      .email('E-mail inválido'),
    serverError: z.string().default('').optional(),
    acceptedTerms: z.boolean().default(false),
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
    {
      name: 'name',
      label: 'Seu nome',
      placeholder: 'Digite o seu nome completo...',
      minLength: 4,
      maxLength: 128,
      validator: mask.name,
    },
    { name: 'email', label: 'E-mail', placeholder: 'Digite o seu e-mail...' },
  ]

  const acceptedTerms = form.watch('acceptedTerms')

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
      <div className='w-full text-center text-lg md:text-base'>
        <h1 className='text-3xl md:text-2xl text-primary-medium font-bold'>Verifique seu E-mail</h1>
        <p className='text-xl md:text-lg mt-[6px] mb-6 text-zinc-600 font-medium text-balance'>
          Enviamos para seu e-mail a confirmação dos próximos passos...
        </p>
        <p className='text-xl md:text-lg mt-[6px] mb-6 text-zinc-600 font-medium flex-wrap'>
          E-mail: <span className='font-bold text-xl md:text-lg whitespace-nowrap'>{form.watch('email')}</span>.
        </p>
      </div>
    )

  return (
    <section className='w-full text-center text-lg md:text-base'>
      <h1 className='text-3xl md:text-2xl text-primary-medium font-bold'>Crie sua conta</h1>
      <p className='text-xl md:text-lg mt-[6px] mb-6 text-zinc-600 font-medium text-balance'>
        Insira os dados abaixo para se cadastrar como usuário na plataforma.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col max-w-xs md:max-w-sm mx-auto gap-6 text-left'
        >
          <div className='flex flex-col gap-4 md:gap-3'>
            {fields.map(({ label, name, placeholder, minLength, maxLength, validator }, index) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof Omit<FormProps, 'acceptedTerms'>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        {...(!index && { autoFocus: true, tabIndex: 0 })}
                        placeholder={placeholder}
                        {...field}
                        {...{ minLength, maxLength }}
                        {...(validator && {
                          onChange: (e) =>
                            form.setValue(name as keyof FormProps, mask.name(e.target?.value), {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            }),
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <fieldset className='flex items-start space-x-2'>
            <Checkbox
              id='acceptedTerms'
              checked={acceptedTerms}
              onCheckedChange={(checked) => form.setValue('acceptedTerms', checked as boolean)}
              className='mt-1'
            />
            <Label className='text-zinc-700' htmlFor='acceptedTerms'>
              Eu estou ciente e aceitos os{' '}
              <Link
                href={RouteEnum.TERMS_OF_USE}
                className='text-primary font-bold underline hover:text-primary-medium'
                target='_blank'
              >
                Termos de Uso
              </Link>
              {' e '}
              <Link
                href={RouteEnum.PRIVACY_POLICY}
                className='text-primary font-bold underline hover:text-primary-medium'
                target='_blank'
              >
                Políticas de Privacidade
              </Link>
              .
            </Label>
          </fieldset>
          <Button
            type='submit'
            disabled={form.formState.isSubmitting || !acceptedTerms}
            isLoading={form.formState.isSubmitting}
          >
            Cadastrar
          </Button>
        </form>
      </Form>
    </section>
  )
}
