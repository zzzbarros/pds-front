'use client'

import { startTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui'
import revalidateTag from '@/lib/revalidateAction'

interface Props {
  closeDrawer(): void
  defaultValues?: TrainingTypeProps & { id: string }
}

type FormProps = z.input<typeof schema>
type TrainingTypeProps = z.output<typeof schema>

const schema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: 'Nome do Tipo de Treino é obrigatório',
      })
      .default(''),
    serverError: z.string().default('').optional(),
  })
  .transform(({ name }) => ({ name }))

export function TrainingTypeForm({ closeDrawer, defaultValues }: Props) {
  const { toast } = useToast()

  const actionLabel = defaultValues ? 'Editar' : 'Cadastrar'

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  async function onSubmit(data: FormProps) {
    const route = defaultValues ? 'training-types/'.concat(defaultValues.id) : 'training-types'
    const res = await clientFetcher(route, {
      method: defaultValues ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      startTransition(() => {
        toast({
          title: res.data?.title || 'Ops parece que ocorreu um erro!',
          description: res.data?.message || 'Tente novamente em instantes...',
          variant: 'destructive',
        })
        if (res.status === 409) {
          form.setError('name', { message: res.data.title })
          form.setFocus('name')
        } else {
          form.setError('serverError', {})
        }
      })
    } else {
      form.reset({})
      revalidateTag('athletes')
      startTransition(() => {
        closeDrawer()
        toast({
          title: res.data.title,
          description: res.data.message,
          variant: 'success',
        })
      })
    }
  }

  return (
    <DrawerContent>
      <div className='flex flex-col justify-center w-full sm:w-2/3 md:w-3/5 lg:w-2/5  h-full mx-auto gap-2'>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{actionLabel} Tipo de Treino</DrawerTitle>
          <DrawerDescription>
            Preencha os campos a seguir para {actionLabel.toLowerCase()} o tipo na plataforma.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            id='training-type'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-6 text-left px-6 min-h-[100px]'
          >
            <div className='flex flex-col gap-3'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Tipo de Treino</FormLabel>
                    <FormControl>
                      <Input {...field} autoFocus placeholder='Digite o nome...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DrawerFooter className='flex flex-row justify-between mb-4'>
          <DrawerClose className='w-fit' tabIndex={-1}>
            <Button variant='outline'>Cancelar</Button>
          </DrawerClose>
          <Button form='training-type' className='w-fit' type='submit' isLoading={form.formState.isSubmitting}>
            {!form.formState.isSubmitting && <Save />}
            {actionLabel}
          </Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  )
}
