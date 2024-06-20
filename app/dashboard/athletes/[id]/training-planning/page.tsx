'use client'

import useSWR from 'swr'
import { ChangeEvent } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { clientFetcher } from '@/services'
import { Input, Skeleton, Spinner, Table, TableBody, TableHead, TableHeader, TableRow, TableTd } from '@/components/ui'
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

interface TrainingPlanningProps {
  trainingPlanning: {
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

export default function PlanningPage() {
  const { id = '' } = useParams()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentDay = new Date()
  const week = searchParams.get('week') ?? getWeekNumberFromDate(currentDay)
  const weekDates = week ? getWeekDatesFromInput(week) : getCurrentWeekDates()

  const firstDayOfWeek = weekDates[0]
  const lastDayOfWeek = weekDates[6]

  const { data, isLoading, mutate } = useSWR(['training-planning', firstDayOfWeek, lastDayOfWeek, id], async () => {
    const response = await clientFetcher(
      `training-planning?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
    )
    if (!response.ok) return { trainingPlanning: [] } as unknown as TrainingPlanningProps
    return response.data as TrainingPlanningProps
  })

  const trainingPlannings = data?.trainingPlanning ?? []

  function setWeek(week: string) {
    router.push(pathname.concat(`?week=${week}`))
  }

  function handlePreviousWeek() {
    setWeek(getPreviousWeek(week))
  }

  function handleNextWeek() {
    setWeek(getNextWeek(week))
  }

  function handleWeekInput(e: ChangeEvent<HTMLInputElement>) {
    const week = e.target.value
    if (!week) router.push(pathname)
    setWeek(week)
  }

  function findPlannedTrainings(date: Date) {
    const plannings = trainingPlannings.filter((plannedTraining) => compareDates(new Date(plannedTraining.date), date))
    return plannings
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
          {isLoading && <Spinner />}
        </div>
        <PlanningForm
          onSuccess={(date) => {
            const createdInWeek = getWeekNumberFromDate(date)
            if (createdInWeek === week) return mutate()
            router.replace(pathname.concat(`?week=${createdInWeek}`))
          }}
        />
      </div>
      <section className='grid grid-cols-7 min-h-[25vh] rounded-md border border-gray-200'>
        {weekDates.map((date) => {
          const isCurrentDay = compareDates(date, currentDay)
          const day = date.toLocaleDateString('pt-BR').split('/')[0]
          const textDay = capitalizeFirstLetter(Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date))
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
                  <TrainingCard key={plannedTraining.id} {...plannedTraining} />
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
              <TableHead>{'Carga planejada (Unidades arbitrárias)'}</TableHead>
              <TableHead>Total de treinos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableTd>Semana anterior</TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.charge?.previousWeek ?? 0}
              </TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.trainingTotals?.previousWeek ?? 0}
              </TableTd>
            </TableRow>
            <TableRow className='font-semibold'>
              <TableTd>Semana atual</TableTd>
              <TableTd>{isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.charge?.week ?? 0}</TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none ' /> : data?.trainingTotals?.week ?? 0}
              </TableTd>
            </TableRow>
            <TableRow>
              <TableTd>Próxima semana</TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.charge?.nextWeek ?? 0}
              </TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.trainingTotals?.nextWeek ?? 0}
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
}: {
  id: string
  date: Date
  trainingType: string
  duration: number
  pse: number
  description?: string
}) {
  return (
    <div className='animate-[enter_0.8s] flex flex-col gap-0.5 bg-primary-medium w-full rounded-md p-2'>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        Tipo: <strong>{trainingType}</strong>
      </p>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        Duração: <strong>{duration} minutos</strong>
      </p>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        PSE: <strong>{pse}</strong>
      </p>
      {description && (
        <p className='text-xs text-white text-ellipsis line-clamp-2'>
          Descrição: <strong>{description}</strong>
        </p>
      )}
    </div>
  )
}
