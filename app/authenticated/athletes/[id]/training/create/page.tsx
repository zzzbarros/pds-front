'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'
import { startTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { RouteEnum } from '@/enums'
import { clientFetcher } from '@/services'
import { Button, Form, useToast } from '@/components/ui'
import { buildingRouteWithId, getWeekNumberFromDate } from '@/lib/utils'
import { TrainingTemplate, type ITrainingFormProps } from '@/components/templates'

export default function CreateTraining() {
  const router = useRouter()
  const params = useParams()
  const query = useSearchParams()
  const { toast } = useToast()

  const actionText = 'Cadastrar'

  const defaultValues = buildingDefaultValues()

  const form = useForm<ITrainingFormProps>({
    resolver: zodResolver(TrainingTemplate.schema),
    defaultValues,
  })

  async function onSubmit(data: ITrainingFormProps) {
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
      const finishedPlanning = await finishTrainingPlanning()
      form.reset({})
      const week = getWeekNumberFromDate(data.date)
      router.replace(buildingRouteWithId(RouteEnum.TRAININGS, params.id as string).concat(`?week=${week}`), {
        scroll: true,
      })
      if (!finishedPlanning)
        toast({
          title: res.data.title,
          description: res.data.message,
          variant: 'success',
        })
    }
  }

  async function finishTrainingPlanning() {
    const planningId = query.get('planningId')
    if (!planningId) return false
    const res = await clientFetcher(`training-planning/${planningId}/finish`, {
      method: 'PATCH',
    })
    if (res.ok) {
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }
    return res.ok
  }

  function buildingDefaultValues() {
    const defaultDate = query.get('date')
    const defaultDescription = query.get('description')
    const defaultType = query.get('trainingTypeUuid')
    const defaultDuration = query.get('duration')
    return {
      date: defaultDate ? new Date(defaultDate) : undefined,
      description: defaultDescription ? defaultDescription : undefined,
      trainingTypeUuid: defaultType ? defaultType : undefined,
      duration: defaultDuration ? Number(defaultDuration) : undefined,
    }
  }

  return (
    <div className='flex flex-col justify-center h-full gap-5'>
      <header>
        <h1 className='text-xl md:text-lg font-semibold'>{actionText} Treino Concluído.</h1>
        <p className='text-lg md:text-base text-balance'>
          Preencha os campos a seguir para {actionText.toLowerCase()} o treino do atleta na plataforma.
        </p>
      </header>
      <Form {...form}>
        <TrainingTemplate.Form onSubmit={onSubmit} />
      </Form>
      <footer className='flex flex-row justify-between py-4 w-full md:w-4/5 xl:w-2/5'>
        <Link href={buildingRouteWithId(RouteEnum.TRAININGS, params.id as string)} scroll={true}>
          <Button variant='outline'>Cancelar</Button>
        </Link>
        <Button
          title={actionText}
          form='training'
          className='w-fit'
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting && <Save size={20} />}
          {actionText}
        </Button>
      </footer>
    </div>
  )
}
