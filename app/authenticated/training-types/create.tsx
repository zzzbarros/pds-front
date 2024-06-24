'use client'

import { startTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
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
  DrawerTrigger,
} from '@/components/ui'
import revalidateTag from '@/lib/revalidateAction'

type FormProps = z.input<typeof schema>
type OutputFormProps = z.output<typeof schema>

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

export function Create() {
  const { toast } = useToast()
  const [openDrawer, setOpenDrawer] = useState(false)

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormProps) {
    const res = await clientFetcher('training-types', {
      method: 'POST',
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
          Cadastrar Tipo de Treino
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='flex flex-col justify-center w-1/3 h-full mx-auto gap-2'>
          <DrawerHeader className='text-center'>
            <DrawerTitle>Cadastro de Tipo de Treino</DrawerTitle>
            <DrawerDescription>Preencha os campos a seguir para cadastrar o tipo na plataforma.</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              id='training-type'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-6 text-left px-4 min-h-[100px]'
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
              Cadastrar
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
