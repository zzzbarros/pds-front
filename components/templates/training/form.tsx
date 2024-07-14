'use client'

import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { useSWR } from '@/lib/swr'
import { clientFetcher } from '@/services'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  DatePicker,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Slider,
  PseScalePopover,
  PsrScalePopover,
} from '@/components/ui'

interface Props {
  onSubmit(date: ITrainingFormProps): void
}

export type ITrainingFormProps = z.input<typeof trainingSchema>

export const trainingSchema = z
  .object({
    date: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Data do Treino é obrigatório' : defaultError,
      }),
    }),
    trainingTypeUuid: z
      .string()
      .min(1, {
        message: 'Tipo de Treino é obrigatório',
      })
      .default(''),
    description: z.string().optional().default(''),
    duration: z.coerce
      .number()
      .min(1, {
        message: 'Duração do Treino é obrigatório',
      })
      .default(0),
    pse: z.coerce.number({ message: 'PSE é obrigatório' }),
    psr: z.coerce.number({ message: 'PSR é obrigatório' }),
    serverError: z.string().default('').optional(),
  })
  .transform(({ date, trainingTypeUuid, description, duration, pse, psr }) => ({
    date,
    trainingTypeUuid,
    duration,
    pse,
    psr,
    description,
  }))

export function TrainingForm({ onSubmit }: Props) {
  const form = useFormContext<ITrainingFormProps>()

  const { data: trainingTypes = [], isLoading: isLoadingTrainingTypes } = useSWR('training-types/all', async () => {
    const response = await clientFetcher('training-types/all')
    if (!response.ok) return []
    return response.data.trainingTypes as { label: string; value: string }[]
  })

  return (
    <form
      id='training'
      onSubmit={form.handleSubmit(onSubmit)}
      className='text-left min-h-[340px] w-full md:w-4/5 xl:w-2/5'
    >
      <div className='flex flex-col gap-4 md:gap-3'>
        <DatePicker control={form.control} name='date' label='Data do Treino' disabled={(date) => date > new Date()} />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Descrição'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Descreva o treinamento...' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='trainingTypeUuid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Treino</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTrainingTypes}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo de treino' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainingTypes.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {!trainingTypes.length && (
                      <span className='px-2  text-lg md:text-sm '>Nenhuma opção encontrada...</span>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='duration'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Duração do treino (minutos)'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Insira o tempo de treino planejado...' type='number' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='pse'
            render={({ field }) => (
              <FormItem>
                <FormLabel>PSE</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Insira a percepção subjetiva de esforço...' type='number' max={10} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='pse'
            render={({ field: { value = 0, onChange } }) => (
              <FormItem>
                <FormControl>
                  <Slider min={0} max={10} value={[value]} onValueChange={onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PseScalePopover />
        </div>
        <div className='flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='psr'
            render={({ field }) => (
              <FormItem>
                <FormLabel>PSR</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Insira a percepção subjetiva de esforço...' type='number' max={10} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='psr'
            render={({ field: { value = 0, onChange } }) => (
              <FormItem>
                <FormControl>
                  <Slider min={0} max={10} value={[value]} onValueChange={onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PsrScalePopover />
        </div>
      </div>
    </form>
  )
}
