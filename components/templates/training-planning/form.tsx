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
} from '@/components/ui'

interface Props {
  onSubmit(date: ITrainingPlanningFormProps): void
}

export type ITrainingPlanningFormProps = z.input<typeof trainingPlanningSchema>

export const trainingPlanningSchema = z
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
    description: z.string().optional(),
    duration: z.coerce
      .number()
      .min(1, {
        message: 'Duração do Treino é obrigatório',
      })
      .default(0),
    pse: z.coerce
      .number()
      .min(0, {
        message: 'PSE Planejado é obrigatório',
      })
      .default(0),
    serverError: z.string().default('').optional(),
  })
  .transform(({ date, trainingTypeUuid, description, duration, pse }) => ({
    date,
    trainingTypeUuid,
    description,
    duration,
    pse,
  }))

export function TrainingPlanningForm({ onSubmit }: Props) {
  const form = useFormContext<ITrainingPlanningFormProps>()

  const { data: trainingTypes = [], isLoading: isLoadingTrainingTypes } = useSWR('training-types/all', async () => {
    const response = await clientFetcher('training-types/all')
    if (!response.ok) return []
    return response.data.trainingTypes as { label: string; value: string }[]
  })

  return (
    <form
      id='training-planning'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-6 text-left h-full w-full sm:w-2/3 md:w-2/5 max-w-xl'
    >
      <div className='flex flex-col gap-4 md:gap-3 h-full'>
        <DatePicker control={form.control} name='date' label='Data do Treino' />
        <FormField
          control={form.control}
          name='trainingTypeUuid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Treino</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingTrainingTypes}>
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
                    {!trainingTypes.length && <span className='px-2 text-sm'>Nenhuma opção encontrada...</span>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name='pse'
          render={({ field }) => (
            <FormItem>
              <FormLabel>PSE Planejado</FormLabel>
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
    </form>
  )
}
