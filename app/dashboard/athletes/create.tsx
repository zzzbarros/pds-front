'use client'

import { startTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
} from '@/components/ui'
import revalidateTag from '@/lib/revalidateAction'
import { Plus } from 'lucide-react'

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
    height: z.coerce.number().optional(),
    weight: z.coerce.number().optional(),
    serverError: z.string().default('').optional(),
  })
  .transform(({ email, name, birthday, height, weight }) => ({ email, name, birthday, height, weight }))

export function Create() {
  const { toast } = useToast()
  const [openDrawer, setOpenDrawer] = useState(false)

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormProps) {
    const res = await clientFetcher('athletes', {
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
          form.setError('email', { message: res.data.title })
          form.setFocus('email')
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
          Cadastrar atleta
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='flex flex-col justify-center w-1/3 h-full mx-auto gap-2'>
          <DrawerHeader className='text-center'>
            <DrawerTitle>Cadastro de atleta</DrawerTitle>
            <DrawerDescription>
              Preencha os campos a seguir para cadastrar o seu atleta na plataforma.
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              id='athlete'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-6 text-left px-4 min-h-[480px]'
            >
              <div className='flex flex-col gap-3'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Atleta</FormLabel>
                      <FormControl>
                        <Input {...field} autoFocus placeholder='Digite o nome do completo...' />
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
                <DatePicker control={form.control} name='birthday' label='Data de nascimento' />
                <FormField
                  control={form.control}
                  name='height'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Adicione a altura do atleta...' type='number' step='0.1' />
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
                        <Input {...field} placeholder='Adicione o peso do atleta...' type='number' step='0.1' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DrawerFooter className='flex flex-row justify-between mb-4'>
            <DrawerClose className='w-fit'>
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
