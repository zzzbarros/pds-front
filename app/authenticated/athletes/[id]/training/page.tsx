'use client'

import { useMemo, type ChangeEvent } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, CircleCheckBig, Edit, Info, Plus, Route, Trash } from 'lucide-react'
import { useSWR } from '@/lib/swr'
import { clientFetcher } from '@/services'
import {
  BaseTrainingCard,
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  buildingRouteWithId,
} from '@/lib/utils'
import { useDialogContext, useDrawerContext } from '@/contexts'
import { ConfirmDeleteDialog } from '@/components/compositions'
import Link from 'next/link'
import { RouteEnum } from '@/enums'

interface TrainingProps {
  id: string
  date: Date
  trainingType: string | { id: string; name: string }
  duration: number
  pse: number
  load: number
  psr?: number
  description?: string
  finished?: boolean
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

interface TrainingPlanningProps extends Omit<TrainingsProps, 'trainings'> {
  trainingPlanning: TrainingProps[]
}

function fillTrainingsByDay<T>(date: Date, currentTrainings: T[]): T[] {
  return currentTrainings?.filter((training) => compareDates(new Date((training as { date: Date }).date), date))
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

  const {
    data: plannedData,
    isLoading: isLoadingPlanning,
    mutate: mutatePlanning,
  } = useSWR(['planned-training', firstDayOfWeek, lastDayOfWeek, id, showPlannedTrainings], async () => {
    if (!showPlannedTrainings) {
      return { trainingPlanning: [] as TrainingPlanningProps['trainingPlanning'] } as TrainingPlanningProps
    }
    const response = await clientFetcher(
      `training-planning?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
    )
    if (!response.ok) {
      return { trainingPlanning: [] as TrainingPlanningProps['trainingPlanning'] } as TrainingPlanningProps
    }
    return response.data as TrainingPlanningProps
  })

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

  async function finishTrainingPlanned(id: string) {
    const res = await clientFetcher('training-planning/'.concat(id), {
      method: 'PATCH',
    })
    if (res.ok) {
      mutatePlanning(
        {
          ...plannedData!!,
          trainingPlanning: weekPlannedTrainings?.map((t) => {
            if (t.id !== id) return t
            return { ...t, finished: true }
          }),
        },
        { revalidate: false }
      )
    }
  }

  const cards = useMemo(
    () =>
      weekDates?.map((date) => {
        const isCurrentDay = compareDates(date, currentDay)
        const day = date.toLocaleDateString('pt-BR').split('/')[0]
        const textDay = capitalizeFirstLetter(Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date))
        const trainings = fillTrainingsByDay(date, weekTrainings)
        const plannedTrainings = fillTrainingsByDay(date, weekPlannedTrainings)
        return (
          <li
            key={day}
            className={cn(
              'py-4 border-t md:border-r border-gray-200 flex flex-col items-center rounded-t-sm group',
              isCurrentDay && 'bg-gray-100'
            )}
          >
            <div className='flex gap-2 items-center w-full justify-center relative'>
              <p className='text-2xl md:text-xl text-slate-950 font-semibold relative'>{day}</p>
              <Link
                data-current-day={isCurrentDay}
                href={buildingRouteWithId(RouteEnum.CREATE_TRAINING, id as string).concat(`?date=${date}`)}
                className='hidden group-hover:flex p-1 bg-zinc-100 data-[current-day=true]:bg-background hover:brightness-90 rounded-full absolute right-1/3 sm:right-[40vw] md:right-1/4 animate-in'
              >
                <Plus size={14} />
              </Link>
            </div>
            <p className='text-lg md:text-base font-medium'>{textDay}</p>
            <ul className='w-full mt-6 flex flex-col gap-1 px-1'>
              {plannedTrainings?.map((plannedTraining) => (
                <li key={plannedTraining.id}>
                  <BaseTrainingCard {...plannedTraining} isPlanned>
                    {!plannedTraining?.finished && (
                      <Link
                        href={buildingRouteWithId(RouteEnum.CREATE_TRAINING, id as string).concat(
                          `?date=${plannedTraining.date}&duration=${plannedTraining.duration}&trainingTypeUuid=${
                            typeof plannedTraining.trainingType === 'string'
                              ? plannedTraining.trainingType
                              : plannedTraining.trainingType.id
                          }${!!plannedTraining.description ? `&description=${plannedTraining.description}` : ''}`
                        )}
                      >
                        <Button className='mt-2 w-full bg-primary-night border border-gray-200 hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'>
                          <CircleCheckBig size={20} />
                          <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Finalizar</span>
                        </Button>
                      </Link>
                    )}
                  </BaseTrainingCard>
                </li>
              ))}
              {trainings?.map((training) => (
                <li key={training.id}>
                  <BaseTrainingCard {...training}>
                    <div className='flex gap-1 justify-end'>
                      <Link
                        className='w-full'
                        href={buildingRouteWithId(RouteEnum.UPDATE_TRAINING, id as string, training.id)}
                      >
                        <Button className='mt-2 w-full border border-gray-200 hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'>
                          <Edit size={20} />
                          <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Editar</span>
                        </Button>
                      </Link>
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
      }),
    [weekDates, weekTrainings, weekPlannedTrainings]
  )

  return (
    <section className='w-full h-full '>
      <div className='flex flex-col lg:flex-row gap-4 items-center mb-2 w-full justify-between'>
        <div className='flex gap-4 items-center w-ful flex-col lg:flex-row w-full'>
          <Input type='week' className='w-full lg:max-w-44' onChange={handleWeekInput} value={week} />
          <div className='w-full lg:w-fit flex items-center gap-4 bg-gray-100 py-1 px-2 rounded-full h-fit text-base md:text-sm'>
            <button className='p-1 rounded-full bg-white hover:brightness-90' onClick={handlePreviousWeek}>
              <ArrowLeft size={16} />
            </button>
            <span className='w-full text-center'>
              {firstDayOfWeek.toLocaleDateString('pt-BR')} - {lastDayOfWeek.toLocaleDateString('pt-BR')}
            </span>
            <button className='p-1 rounded-full bg-white hover:brightness-90' onClick={handleNextWeek}>
              <ArrowRight size={16} />
            </button>
          </div>
          <div className='flex items-center w-full lg:w-fit space-x-2'>
            <Switch
              onCheckedChange={handlePlannedSwitch}
              checked={showPlannedTrainings}
              className='data-[state=checked]:bg-primary-night'
            />
            <Label htmlFor='airplane-mode'>Exibir treinos planejados</Label>
          </div>
          {(isLoadingTraining || isLoadingPlanning) && <Spinner />}
        </div>
        <Link
          className='w- w-full lg:w-fit'
          href={buildingRouteWithId(RouteEnum.CREATE_TRAINING, id as string)}
          scroll={true}
        >
          <Button className='px-10 w-full lg:w-fit'>
            <Plus />
            Cadastrar Treino
          </Button>
        </Link>
      </div>
      <ul className='grid grid-rows-7 lg:grid-rows-1 lg:grid-cols-7 min-h-[25vh] rounded-md border border-gray-200'>
        {cards}
      </ul>
      <ul className='flex flex-col md:flex-row md:items-center gap-1 md:gap-3 pt-4 text-sm'>
        <li className='font-semibold'>Legenda: </li>
        <li className='flex gap-1 items-center'>
          <div className='size-5 bg-primary rounded-sm' />= Treino concluído;
        </li>
        <li className='flex gap-1 items-center'>
          <div className='size-5 bg-primary-night rounded-sm' />= Treino planejado;
        </li>
        <li className='flex gap-1 items-center'>
          <CircleCheckBig className='size-5' />= Treino planejado e concluído.
        </li>
      </ul>
      <div className='w-full rounded-md mt-6  border border-gray-200'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                <span className='hidden md:inline'>Carga Planejada</span>
                <span className='visible md:hidden flex gap-1 items-center'>
                  C.P.
                  <Popover>
                    <PopoverTrigger className='flex items-center gap-1.5 pb-0.5'>
                      <Info size={16} />
                    </PopoverTrigger>
                    <PopoverContent className='w-fit'>
                      Carga Planejada <br /> <span className='text-zinc-600'>Unidade Arbitrárias (U.A.)</span>
                    </PopoverContent>
                  </Popover>
                </span>
              </TableHead>
              <TableHead>
                <span className='hidden md:inline'>Carga Realizada</span>
                <span className='visible md:hidden flex gap-1 items-center'>
                  C.R.
                  <Popover>
                    <PopoverTrigger className='flex items-center gap-1.5 pb-0.5'>
                      <Info size={16} />
                    </PopoverTrigger>
                    <PopoverContent className='w-fit'>
                      Carga Realizada <br /> <span className='text-zinc-600'>Unidade Arbitrárias (U.A.)</span>
                    </PopoverContent>
                  </Popover>
                </span>
              </TableHead>
              <TableHead data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                <span className='hidden md:inline'>Treinos Planejados</span>
                <span className='visible md:hidden flex gap-1 items-center'>
                  T.P.
                  <Popover>
                    <PopoverTrigger className='flex items-center gap-1.5 pb-0.5'>
                      <Info size={16} />
                    </PopoverTrigger>
                    <PopoverContent className='w-fit'>Treinos Planejados</PopoverContent>
                  </Popover>
                </span>
              </TableHead>
              <TableHead>
                <span className='hidden md:inline'>Treinos Realizados</span>
                <span className='visible md:hidden flex gap-1 items-center'>
                  T.R.
                  <Popover>
                    <PopoverTrigger className='flex items-center gap-1.5 pb-0.5'>
                      <Info size={16} />
                    </PopoverTrigger>
                    <PopoverContent className='w-fit'>Treinos Realizados</PopoverContent>
                  </Popover>
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableTd>Semana anterior</TableTd>
              <TableTd data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  plannedData?.charge?.previousWeek ?? '-'
                )}
              </TableTd>
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.charge?.previousWeek ?? '-'
                )}
              </TableTd>
              <TableTd data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  plannedData?.trainingTotals?.previousWeek ?? '-'
                )}
              </TableTd>
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.trainingTotals?.previousWeek ?? '-'
                )}
              </TableTd>
            </TableRow>
            <TableRow className='font-semibold'>
              <TableTd>Semana atual</TableTd>
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? (
                    <Skeleton className='w-10 h-4 rounded-none' />
                  ) : (
                    plannedData?.charge?.week ?? '-'
                  )}
                </TableTd>
              )}
              <TableTd>
                {isLoadingTraining ? <Skeleton className='w-10 h-4 rounded-none' /> : trainingData?.charge?.week ?? '-'}
              </TableTd>
              <TableTd data-visible={showPlannedTrainings} className='hidden data-[visible=true]:table-cell'>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  plannedData?.trainingTotals?.week ?? '-'
                )}
              </TableTd>
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.trainingTotals?.week ?? '-'
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
                    plannedData?.charge?.nextWeek ?? '-'
                  )}
                </TableTd>
              )}
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.charge?.nextWeek ?? '-'
                )}
              </TableTd>
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? (
                    <Skeleton className='w-10 h-4 rounded-none' />
                  ) : (
                    plannedData?.trainingTotals?.nextWeek ?? '-'
                  )}
                </TableTd>
              )}
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.trainingTotals?.nextWeek ?? '-'
                )}
              </TableTd>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}


