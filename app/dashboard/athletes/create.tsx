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
  DatePicker,
} from '@/components/ui'
import { services } from '@/services'
import { useRouter } from 'next/navigation'
import { useCookies } from 'next-client-cookies'

type FormProps = z.input<typeof schema>
type OutputFormProps = z.output<typeof schema>

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
    height: z.number().optional(),
    weight: z.number().optional(),
    serverError: z.string().default('').optional(),
  })
  .transform(({ email, name, birthday, height, weight }) => ({ email, name, birthday, height, weight }))

export function Create() {
  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormProps) {
    // TODO: Integrar com API
  }

  return (
    <Form {...form}>
      <form id='athlete' onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 text-left px-4'>
        <div className='flex flex-col gap-3'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Atleta</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus placeholder='Digite o nome do completo...' className='max-w-80' />
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
                  <Input {...field} placeholder='Digite o e-mail...' className='max-w-80' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DatePicker control={form.control} name='birthday' label='Data de nascimento' />
          <FormField
            control={form.control}
            name='height'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Adicione a altura do atleta...' className='max-w-80' type='number' />
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
                  <Input {...field} placeholder='Adicione o peso do atleta...' className='max-w-80' type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
