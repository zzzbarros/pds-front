'use client'

import type { ChangeEvent } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, CircleCheckBig, Edit, Plus, Trash } from 'lucide-react'
import useSWR from 'swr'
import { clientFetcher } from '@/services'
import {
  BaseTrainingCard,
  Button,
  Input,
  Label,
  Skeleton,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableTd,
} from '@/components/ui'
import {
  compareDates,
  capitalizeFirstLetter,
  cn,
  getNextWeek,
  getPreviousWeek,
  getWeekDatesFromInput,
  getWeekNumberFromDate,
} from '@/lib/utils'
import { PlanningForm } from './form'
import { useDialogContext, useDrawerContext } from '@/contexts'
import { ConfirmDeleteDialog } from '@/components/compositions'

interface TrainingProps {
  id: string
  date: Date
  trainingType: string | { id: string; name: string }
  duration: number
  pse: number
  load: number
  psr?: number
  description?: string
}

interface TrainingsProps {
  trainings: TrainingProps[]
  charge: {
    week: number
    previousWeek: number
    nextWeek: number
  }
  trainingTotals: {
    week: number
    previousWeek: number
    nextWeek: number
  }
}

interface TrainingPlanningProps extends Omit<TrainingsProps, 'training'> {
  trainingPlanning: TrainingProps[]
}

function fillTrainingsByDay(date: Date, currentTrainings: TrainingProps[]): TrainingProps[] {
  return currentTrainings?.filter((training) => compareDates(new Date(training.date), date))
}

export default function PlanningPage() {
  const { id = '' } = useParams()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const pathname = usePathname()
  const router = useRouter()
  const currentDay = new Date()
  const week = searchParams.get('week') ?? getWeekNumberFromDate(currentDay)
  const weekDates = getWeekDatesFromInput(week)
  const showPlannedTrainings = (searchParams.get('showPlannedTrainings') || 'true') === 'true'
  const { drawer } = useDrawerContext()
  const { dialog } = useDialogContext()

  const firstDayOfWeek = weekDates[0]
  const lastDayOfWeek = weekDates[6]

  const {
    data: trainingData,
    isLoading: isLoadingTraining,
    mutate: mutateTrainings,
  } = useSWR(['performed-training', firstDayOfWeek, lastDayOfWeek, id], async () => {
    const response = await clientFetcher(
      `trainings?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
    )
    if (!response.ok) return { trainings: [] as TrainingsProps['trainings'] } as TrainingsProps
    return response.data as TrainingsProps
  })

  const { data: plannedData, isLoading: isLoadingPlanning } = useSWR(
    ['planned-training', firstDayOfWeek, lastDayOfWeek, id, showPlannedTrainings],
    async () => {
      if (!showPlannedTrainings)
        return { trainingPlanning: [] as TrainingPlanningProps['trainingPlanning'] } as TrainingPlanningProps
      const response = await clientFetcher(
        `training-planning?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
      )
      if (!response.ok)
        return { trainingPlanning: [] as TrainingPlanningProps['trainingPlanning'] } as TrainingPlanningProps
      return response.data as TrainingPlanningProps
    }
  )

  const weekTrainings = trainingData?.trainings ?? []
  const weekPlannedTrainings = plannedData?.trainingPlanning ?? []

  function setWeek(week: string) {
    if (week) params.set('week', week)
    else params.delete('week')
    router.push(pathname.concat('?').concat(params.toString()))
  }

  function handlePreviousWeek() {
    setWeek(getPreviousWeek(week))
  }

  function handleNextWeek() {
    setWeek(getNextWeek(week))
  }

  function handleWeekInput(e: ChangeEvent<HTMLInputElement>) {
    const week = e.target.value
    setWeek(week)
  }

  function handlePlannedSwitch(checked: boolean) {
    if (checked) params.set('showPlannedTrainings', 'true')
    else params.set('showPlannedTrainings', 'false')
    router.push(pathname.concat('?').concat(params.toString()))
  }

  return (
    <section className='w-full h-full'>
      <div className='flex items-center mb-2 w-ful justify-between'>
        <div className='flex gap-4 items-center w-ful'>
          <Input type='week' className='max-w-44' onChange={handleWeekInput} value={week} />
          <div className='flex items-center gap-4 bg-gray-100 py-1 px-2 rounded-full h-fit text-sm'>
            <button className='p-1 rounded-full bg-white hover:brightness-90' onClick={handlePreviousWeek}>
              <ArrowLeft size={16} />
            </button>
            <span>
              {firstDayOfWeek.toLocaleDateString('pt-BR')} - {lastDayOfWeek.toLocaleDateString('pt-BR')}
            </span>
            <button className='p-1 rounded-full bg-white hover:brightness-90' onClick={handleNextWeek}>
              <ArrowRight size={16} />
            </button>
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              onCheckedChange={handlePlannedSwitch}
              checked={showPlannedTrainings}
              className='data-[state=checked]:bg-primary-night'
            />
            <Label htmlFor='airplane-mode'>Exibir treinos planejados</Label>
          </div>
          {(isLoadingTraining || isLoadingPlanning) && <Spinner />}
        </div>
        <Button
          className='px-10'
          onClick={() => {
            drawer.current?.open(
              <PlanningForm
                onSuccess={(date) => {
                  drawer.current?.close()
                  const createdInWeek = getWeekNumberFromDate(date)
                  if (createdInWeek === week) return mutateTrainings()
                  router.replace(pathname.concat(`?week=${createdInWeek}`))
                }}
              />
            )
          }}
        >
          <Plus />
          Cadastrar Treino
        </Button>
      </div>
      <ul className='grid grid-cols-7 min-h-[25vh] rounded-md border border-gray-200'>
        {weekDates?.map((date) => {
          const isCurrentDay = compareDates(date, currentDay)
          const day = date.toLocaleDateString('pt-BR').split('/')[0]
          const textDay = capitalizeFirstLetter(Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date))
          const trainings = fillTrainingsByDay(date, weekTrainings)
          const plannedTrainings = fillTrainingsByDay(date, weekPlannedTrainings)
          return (
            <li
              key={day}
              className={cn(
                'py-4 border-r border-gray-200 flex flex-col items-center rounded-t-sm group',
                isCurrentDay && 'bg-gray-100'
              )}
            >
              <div className='flex gap-2 items-center w-full justify-center relative'>
                <p className='text-xl text-slate-950 font-semibold relative'>{day}</p>
                <button
                  data-current-day={isCurrentDay}
                  className='hidden group-hover:flex p-1 bg-zinc-100 data-[current-day=true]:bg-background hover:brightness-90 rounded-full absolute right-1/4 animate-in'
                  onClick={() => {
                    drawer.current?.open(
                      <PlanningForm method='POST' defaultValues={{ date }} onSuccess={drawer.current?.close} />
                    )
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className='font-medium'>{textDay}</p>

              <ul className='w-full mt-6 flex flex-col gap-1 px-1'>
                {plannedTrainings?.map((plannedTraining) => (
                  <li key={plannedTraining.id}>
                    <BaseTrainingCard {...plannedTraining} isPlanned>
                      <Button
                        className='mt-2 w-full bg-primary-night border border-gray-200 hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'
                        onClick={() => {
                          drawer.current?.open(
                            <PlanningForm
                              method='POST'
                              defaultValues={{
                                date: plannedTraining.date,
                                duration: plannedTraining.duration,
                                description: plannedTraining.description ?? '',
                                trainingTypeUuid:
                                  typeof plannedTraining.trainingType === 'string'
                                    ? plannedTraining.trainingType
                                    : plannedTraining.trainingType.id,
                              }}
                              onSuccess={(date) => {
                                drawer.current?.close()
                                const createdInWeek = getWeekNumberFromDate(date)
                                if (createdInWeek === week) return mutateTrainings()
                                router.replace(pathname.concat(`?week=${createdInWeek}`))
                              }}
                            />
                          )
                        }}
                      >
                        <CircleCheckBig size={20} />
                        <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Finalizar</span>
                      </Button>
                    </BaseTrainingCard>
                  </li>
                ))}
                {trainings?.map((training) => (
                  <li key={training.id}>
                    <BaseTrainingCard {...training}>
                      <div className='flex gap-1 justify-end'>
                        <Button
                          className='mt-2 w-full border border-gray-200 hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'
                          onClick={() => {
                            drawer.current?.open(
                              <PlanningForm
                                method='PUT'
                                defaultValues={{
                                  id: training.id,
                                  date: training.date,
                                  duration: training.duration,
                                  pse: training.pse,
                                  description: training.description ?? '',
                                  psr: training.psr as number,
                                  trainingTypeUuid:
                                    typeof training.trainingType === 'string'
                                      ? training.trainingType
                                      : training.trainingType.id,
                                }}
                                onSuccess={(date) => {
                                  drawer.current?.close()
                                  const createdInWeek = getWeekNumberFromDate(date)
                                  if (createdInWeek === week) return mutateTrainings()
                                  router.replace(pathname.concat(`?week=${createdInWeek}`))
                                }}
                              />
                            )
                          }}
                        >
                          <Edit size={20} />
                          <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Editar</span>
                        </Button>
                        <Button
                          className='mt-2 w-full border border-gray-200 hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'
                          onClick={() => {
                            dialog.current?.open(
                              <ConfirmDeleteDialog
                                route={'trainings/'.concat(training.id)}
                                onClose={dialog.current.close}
                                onSuccess={mutateTrainings}
                                title='Você tem certeza que deseja remover esse treino?'
                              />
                            )
                          }}
                        >
                          <Trash size={20} />
                          <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Excluir</span>
                        </Button>
                      </div>
                    </BaseTrainingCard>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
      <div className='w-full rounded-md mt-6  border border-gray-200'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                {'Carga planejada (Unidades arbitrárias)'}
              </TableHead>
              <TableHead>Carga realizada (Unidades arbitrárias)</TableHead>
              <TableHead data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                Treinos planejados
              </TableHead>
              <TableHead>Treinos realizados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableTd>Semana anterior</TableTd>
              <TableTd data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  plannedData?.charge?.previousWeek ?? 0
                )}
              </TableTd>
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.charge?.previousWeek ?? 0
                )}
              </TableTd>
              <TableTd data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  plannedData?.trainingTotals?.previousWeek ?? 0
                )}
              </TableTd>
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.trainingTotals?.previousWeek ?? 0
                )}
              </TableTd>
            </TableRow>
            <TableRow className='font-semibold'>
              <TableTd>Semana atual</TableTd>
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? <Skeleton className='w-10 h-4 rounded-none' /> : plannedData?.charge?.week ?? 0}
                </TableTd>
              )}
              <TableTd>
                {isLoadingTraining ? <Skeleton className='w-10 h-4 rounded-none' /> : trainingData?.charge?.week ?? 0}
              </TableTd>
              <TableTd data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  plannedData?.trainingTotals?.week ?? 0
                )}
              </TableTd>
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.trainingTotals?.week ?? 0
                )}
              </TableTd>
            </TableRow>
            <TableRow>
              <TableTd>Próxima semana</TableTd>
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? (
                    <Skeleton className='w-10 h-4 rounded-none' />
                  ) : (
                    plannedData?.charge?.nextWeek ?? 0
                  )}
                </TableTd>
              )}
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.charge?.nextWeek ?? 0
                )}
              </TableTd>
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? (
                    <Skeleton className='w-10 h-4 rounded-none' />
                  ) : (
                    plannedData?.trainingTotals?.nextWeek ?? 0
                  )}
                </TableTd>
              )}
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.trainingTotals?.nextWeek ?? 0
                )}
              </TableTd>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}


