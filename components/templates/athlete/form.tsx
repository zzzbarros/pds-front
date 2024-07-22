'use client'

import { z } from 'zod'
import { useFormContext } from 'react-hook-form'
import { DatePicker, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components/ui'
import { mask } from '@/lib/mask'

interface Props {
  onSubmit: (data: IAthleteFormProps) => Promise<void>
}

export type IAthleteFormProps = z.input<typeof athleteSchema>

export const athleteSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: 'Nome é obrigatório',
      })
      .default(''),
    email: z
      .string()
      .trim()
      .min(1, {
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

export function AthleteForm({ onSubmit }: Props) {
  const form = useFormContext<IAthleteFormProps>()
  return (
    <form
      id='athlete'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-6 text-left py-4 min-h-full sm:w-2/3 md:w-2/5 h-full'
    >
      <div className='flex flex-col gap-2.5'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Atleta</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Digite o nome do completo...'
                  onChange={(e) =>
                    form.setValue('name', mask.name(e.target?.value), {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                />
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
                <Input {...field} placeholder='Adicione a altura do atleta...' type='number' step='0.01' max={5} />
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
                <Input {...field} placeholder='Adicione o peso do atleta...' type='number' step='1' max={1000} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  )
}
