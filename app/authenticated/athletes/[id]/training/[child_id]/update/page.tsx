'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'
import { startTransition, useLayoutEffect } from 'react'
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import { useSWR } from '@/lib/swr'
import { buildingRouteWithId, getWeekNumberFromDate } from '@/lib/utils'
import { Button, Form, useToast, Spinner } from '@/components/ui'
import { TrainingTemplate, type ITrainingFormProps } from '@/components/templates'

export default function UpdateTraining() {
  const router = useRouter()
  const { id: athleteId = '', child_id: trainingId = '' } = useParams()
  const { toast } = useToast()

  const { data, isLoading: isLoading } = useSWR(['training', trainingId], async () => {
    if (!trainingId) return
    const response = await clientFetcher<
      Omit<ITrainingFormProps, 'trainingTypeUuid'> & { trainingType: { id: string; name: string } }
    >('trainings/'.concat(trainingId as string))
    if (response.ok) return response.data
  })

  const form = useForm<ITrainingFormProps>({
    resolver: zodResolver(TrainingTemplate.schema),
    defaultValues: { ...data, trainingTypeUuid: data?.trainingType.id },
  })

  async function onSubmit(data: ITrainingFormProps) {
    const res = await clientFetcher('trainings', {
      method: 'PUT',
      body: JSON.stringify({ ...data, athleteUuid: athleteId, id: trainingId }),
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
      const week = getWeekNumberFromDate(data.date)
      router.replace(buildingRouteWithId(RouteEnum.TRAININGS, athleteId as string).concat(`?week=${week}`), {
        scroll: true,
      })
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }
  }

  useLayoutEffect(() => {
    !!data && form.reset({ ...data, trainingTypeUuid: data.trainingType.id })
    return () => {
      form.reset({})
    }
  }, [data])

  const actionText = 'Editar'

  return (
    <div className='flex flex-col justify-center h-full gap-5'>
      <header>
        <span className='flex gap-4'>
          <h1 className='text-xl md:text-lg font-semibold'>{actionText} Treino</h1>
          {isLoading && <Spinner />}
        </span>
        <p className='text-lg md:text-base text-balance'>
          Preencha os campos a seguir para {actionText.toLowerCase()} o treino do atleta na plataforma.
        </p>
      </header>
      <Form {...form}>
        <TrainingTemplate.Form onSubmit={onSubmit} />
      </Form>
      <footer className='flex flex-row justify-between py-4  w-full md:w-4/5 xl:w-2/5 '>
        <Link href={buildingRouteWithId(RouteEnum.TRAININGS, athleteId as string)} scroll={true}>
          <Button variant='outline'>Cancelar</Button>
        </Link>
        <Button
          title={actionText}
          form='athlete'
          className='w-fit'
          type='submit'
          isLoading={form.formState.isSubmitting}
          disabled={!form.formState.isDirty}
        >
          {!form.formState.isSubmitting && <Edit size={20} />}
          {actionText}
        </Button>
      </footer>
    </div>
  )
}
