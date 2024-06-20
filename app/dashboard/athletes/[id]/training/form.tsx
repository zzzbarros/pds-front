'use client'

import { startTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui'
import { Info, Plus } from 'lucide-react'
import { useParams } from 'next/navigation'

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
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className='w-fit flex gap-1 items-center text-sm underline mt-1 hover:font-semibold'>
                        <Info size={18} />
                        <p>Ver escala</p>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className='w-fit'>
                      <p className='font-semibold'>Escala de Percepção Subjetiva de Esforço</p>
                      <ul className='flex flex-col gap-2 mt-2 p-2'>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold border border-gray-200'>0</div> •
                          Absolutamente nada
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#B6D5F1] text-white'>1</div> •
                          Extremamente fraco
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#89CED3] text-white'>2</div> •
                          Muito fraco
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#30D187] text-white'>3</div> •
                          Moderado
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#4EDF42] text-gray-900'>4</div> •
                          Pouco forte
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#BBF31A] text-gray-900'>5</div> •
                          Forte
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#FFFF00] text-gray-900'>6</div>
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#FFE700] text-gray-900'>7</div> •
                          Muito forte
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#FF8900] text-white'>8</div>
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#FF2F00] text-white'>9</div>
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#E60000] text-white'>10</div> •
                          Máximo
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className='w-fit flex gap-1 items-center text-sm underline mt-1 hover:font-semibold'>
                        <Info size={18} />
                        <p>Ver escala</p>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className='w-fit'>
                      <p className='font-semibold'>Escala de Percepção Subjetiva de Recuperação</p>
                      <ul className='flex flex-col gap-2 mt-2 p-2'>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold border border-gray-200'>0</div> •
                          Nenhuma recuperação
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#f0f3fa] text-gray-900'>1</div> •
                          Muito pouco recuperado
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#E1EAF7] text-gray-900'>2</div> •
                          Pouco recuperado
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#E2EAF7] text-gray-900'>3</div> •
                          Recuperação moderada
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#D0DEF3] text-gray-900'>4</div> •
                          Boa recuperação
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#C8D9F1] text-gray-900'>5</div> •
                          Recuperação muito boa
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#B0CAEC] text-white'>6</div>
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#98BBE7] text-white'>7</div> •
                          Recuperação extremamente boa
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#81AFE4] text-white'>8</div>
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#6BA5E1] text-white'>9</div>
                        </li>
                        <li className='flex gap-2'>
                          <div className='size-6 text-center rounded-md font-bold bg-[#5C9FDF] text-white'>10</div> •
                          Recuperado
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
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
