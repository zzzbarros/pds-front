'use client'

import useSWR from 'swr'
import { ChangeEvent } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { clientFetcher } from '@/services'
import {
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
  getCurrentWeekDates,
  getNextWeek,
  getPreviousWeek,
  getWeekDatesFromInput,
  getWeekNumberFromDate,
} from '@/lib/utils'
import { PlanningForm } from './form'

interface TrainingProps {
  trainings: {
    id: string
    date: Date
    trainingType: string
    duration: number
    pse: number
    description?: string
  }[]
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

interface TrainingPlanningProps extends Omit<TrainingProps, 'training'> {
  trainingPlanning: TrainingProps['trainings']
}

export default function PlanningPage() {
  const { id = '' } = useParams()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const pathname = usePathname()
  const router = useRouter()
  const currentDay = new Date()
  const week = searchParams.get('week') ?? getWeekNumberFromDate(currentDay)
  const weekDates = week ? getWeekDatesFromInput(week) : getCurrentWeekDates()
  const showPlannedTrainings = (searchParams.get('showPlannedTrainings') || 'true') === 'true'

  const firstDayOfWeek = weekDates[0]
  const lastDayOfWeek = weekDates[6]

  const { data: trainingData, isLoading: isLoadingTraining } = useSWR(
    ['training', firstDayOfWeek, lastDayOfWeek, id],
    async () => {
      const response = await clientFetcher(
        `trainings?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
      )
      if (!response.ok) return { trainings: [] as TrainingProps['trainings'] } as TrainingProps
      return response.data as TrainingProps
    }
  )

  const { data: plannedData, isLoading: isLoadingPlanning } = useSWR(
    ['training-planning', firstDayOfWeek, lastDayOfWeek, id, showPlannedTrainings],
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
  const plannedTrainings = plannedData?.trainingPlanning ?? []

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

  function findTrainings(date: Date) {
    return weekTrainings.filter((training) => compareDates(new Date(training.date), date))
  }

  function findPlannedTrainings(date: Date) {
    return plannedTrainings.filter((plannedTraining) => compareDates(new Date(plannedTraining.date), date))
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
        <PlanningForm
          onSuccess={(date) => {
            router.push(pathname.concat(`?week=${getWeekNumberFromDate(date)}`))
          }}
        />
      </div>
      <section className='grid grid-cols-7 min-h-[25vh] rounded-md border border-gray-200'>
        {weekDates.map((date) => {
          const isCurrentDay = compareDates(date, currentDay)
          const day = date.toLocaleDateString('pt-BR').split('/')[0]
          const textDay = capitalizeFirstLetter(Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date))
          const trainings = findTrainings(date)
          const plannedTrainings = findPlannedTrainings(date)
          return (
            <li
              key={day}
              className={cn(
                'py-4 border-r border-gray-200 flex flex-col items-center rounded-t-sm',
                isCurrentDay && 'bg-gray-100'
              )}
            >
              <p className='text-xl text-slate-950 font-semibold'>{day}</p>
              <p className='font-medium'>{textDay}</p>

              <ul className='w-full mt-6 flex flex-col gap-1 px-1'>
                {plannedTrainings.map((plannedTraining) => (
                  <TrainingCard key={plannedTraining.id} {...plannedTraining} planned={true} />
                ))}
                {trainings.map((training) => (
                  <TrainingCard key={training.id} {...training} />
                ))}
              </ul>
            </li>
          )
        })}
      </section>
      <div className='w-full rounded-md mt-6  border border-gray-200 '>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              {showPlannedTrainings && <TableHead>{'Carga planejada (Unidades arbitrárias)'}</TableHead>}
              <TableHead>Carga realizada (Unidades arbitrárias)</TableHead>
              {showPlannedTrainings && <TableHead>Treinos planejados</TableHead>}
              <TableHead>Treinos realizados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableTd>Semana anterior</TableTd>
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? (
                    <Skeleton className='w-10 h-4 rounded-none' />
                  ) : (
                    plannedData?.charge?.previousWeek ?? 0
                  )}
                </TableTd>
              )}
              <TableTd>
                {isLoadingTraining ? (
                  <Skeleton className='w-10 h-4 rounded-none' />
                ) : (
                  trainingData?.charge?.previousWeek ?? 0
                )}
              </TableTd>
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? (
                    <Skeleton className='w-10 h-4 rounded-none' />
                  ) : (
                    plannedData?.trainingTotals?.previousWeek ?? 0
                  )}
                </TableTd>
              )}
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
              {showPlannedTrainings && (
                <TableTd>
                  {isLoadingTraining ? (
                    <Skeleton className='w-10 h-4 rounded-none' />
                  ) : (
                    plannedData?.trainingTotals?.week ?? 0
                  )}
                </TableTd>
              )}
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

function TrainingCard({
  trainingType,
  description,
  duration,
  pse,
  psr,
  planned = false,
}: {
  id: string
  date: Date
  trainingType: string
  duration: number
  pse: number
  description?: string
  psr?: number
  planned?: boolean
}) {
  return (
    <div
      className={cn(
        'animate-[enter_0.8s] flex flex-col gap-0.5 bg-primary-medium w-full rounded-md p-2',
        planned && 'bg-primary-night'
      )}
    >
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        Tipo: <strong>{trainingType}</strong>
      </p>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        Duração: <strong>{duration} minutos</strong>
      </p>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        PSE: <strong>{pse}</strong>
      </p>
      {psr && (
        <p className='text-xs text-white text-ellipsis line-clamp-2'>
          PSR: <strong>{psr}</strong>
        </p>
      )}
      {description && (
        <p className='text-xs text-white text-ellipsis line-clamp-2'>
          Descrição: <strong>{description}</strong>
        </p>
      )}
    </div>
  )
}
