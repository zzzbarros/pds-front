'use client'

import { startTransition } from 'react'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientFetcher } from '@/services'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
  DatePicker,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Button,
} from '@/components/ui'
import revalidateTag from '@/lib/revalidateAction'

type AthleteFormProps = z.input<typeof schema>
type AthleteProps = z.output<typeof schema>

interface Props {
  closeDrawer(): void
  defaultValues?: AthleteProps & { id: string }
}

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

export function AthleteForm({ closeDrawer, defaultValues }: Props) {
  const { toast } = useToast()
  const actionTitle = defaultValues ? 'Editar' : 'Cadastrar'

  const form = useForm<AthleteFormProps>({
    resolver: zodResolver(schema),
    ...(defaultValues && {
      defaultValues: { ...defaultValues, birthday: new Date(defaultValues.birthday) },
    }),
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: AthleteFormProps) {
    const res = await clientFetcher(defaultValues ? `athletes/${defaultValues.id}` : 'athletes', {
      method: defaultValues ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    })

    if (res.ok) {
      revalidateTag('athletes')
      startTransition(() => {
        closeDrawer()
        toast({
          title: res.data.title,
          description: res.data.message,
          variant: 'success',
        })
      })
    } else {
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
    }
  }

  return (
    <DrawerContent>
      <div className='flex flex-col justify-center w-full sm:w-2/3 md:w-2/5 h-full mx-auto gap-1'>
        <DrawerHeader>
          <DrawerTitle>{actionTitle} atleta</DrawerTitle>
          <DrawerDescription>
            Preencha os campos a seguir para {actionTitle.toLowerCase()} o seu atleta na plataforma.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            id='athlete'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-6 text-left px-4 min-h-fit'
          >
            <div className='flex flex-col gap-2.5'>
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
                      <Input {...field} placeholder='Adicione a altura do atleta...' type='number' step='0.01' />
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
                      <Input {...field} placeholder='Adicione o peso do atleta...' type='number' step='1' />
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
          <Button form='athlete' className='w-fit' type='submit' isLoading={isSubmitting}>
            {!isSubmitting && <Save size={20} />}
            {actionTitle}
          </Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  )
}
