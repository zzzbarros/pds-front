'use client'

import { useParams } from 'next/navigation'
import { startTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import useSWR from 'swr'
import { clientFetcher } from '@/services'
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
  onSuccess(date: Date): void
}

type FormProps = z.input<typeof schema>

const schema = z
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
    description: z.string().default(''),
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
    description,
    duration,
    pse,
    psr,
  }))

export function PlanningForm({ onSuccess }: Props) {
  const params = useParams()
  const { toast } = useToast()
  const [openDrawer, setOpenDrawer] = useState(false)

  const { data: trainingTypes = [], isLoading: isLoadingTrainingTypes } = useSWR('training-types/all', async () => {
    const response = await clientFetcher('training-types/all')
    if (!response.ok) return []
    return response.data.trainingTypes as { label: string; value: string }[]
  })

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormProps) {
    const res = await clientFetcher('trainings', {
      method: 'POST',
      body: JSON.stringify({ ...data, athleteUuid: params.id }),
    })
    if (!res.ok) {
      startTransition(() => {
        toast({
          title: res.data?.title || 'Ops parece que ocorreu um erro!',
          description: res.data?.message || 'Tente novamente em instantes...',
          variant: 'destructive',
        })
        form.setError('serverError', {})
      })
    } else {
      form.reset({})
      onSuccess(data.date)
      startTransition(() => {
        setOpenDrawer(false)
        toast({
          title: res.data.title,
          description: res.data.message,
        })
      })
    }
  }

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerTrigger asChild>
        <Button className='px-10'>
          <Plus />
          Cadastrar Treino
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='flex flex-col justify-center w-2/3 h-full mx-auto gap-1'>
          <DrawerHeader className='text-center'>
            <DrawerTitle>Cadastrar de Treino</DrawerTitle>
            <DrawerDescription>
              Preencha os campos a seguir para cadastrar o treino do atleta na plataforma.
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form id='athlete' onSubmit={form.handleSubmit(onSubmit)} className='text-left px-4 min-h-[340px] '>
              <div className='grid grid-cols-2 gap-2'>
                <DatePicker
                  control={form.control}
                  name='date'
                  label='Data do Treino'
                  disabled={(date) => date > new Date()}
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
                  name='trainingTypeUuid'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Treino</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingTrainingTypes}
                        >
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
                          <Input
                            {...field}
                            placeholder='Insira a percepção subjetiva de esforço...'
                            type='number'
                            max={10}
                          />
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
                          <Input
                            {...field}
                            placeholder='Insira a percepção subjetiva de esforço...'
                            type='number'
                            max={10}
                          />
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
          </Form>
          <DrawerFooter className='flex flex-row justify-between'>
            <DrawerClose className='w-fit' tabIndex={-1}>
              <Button variant='outline'>Cancelar</Button>
            </DrawerClose>
            <Button form='athlete' className='w-fit' type='submit' isLoading={form.formState.isSubmitting}>
              Cadastrar
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
