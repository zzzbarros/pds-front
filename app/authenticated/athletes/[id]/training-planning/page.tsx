'use client'

import type { ChangeEvent } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import useSWR from 'swr'
import { clientFetcher } from '@/services'
import {
  Button,
  Input,
  Skeleton,
  Spinner,
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
import { TrainingCard } from './components'
import { useDrawerContext } from '@/contexts'

export interface BaseTrainingProps {
  id: string
  date: Date
  trainingType: {
    id: string
    name: string
  }
  duration: number
  pse: number
  description?: string
  load: number
}

interface TrainingPlanningProps {
  trainingPlanning: BaseTrainingProps[]
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
  const { drawer } = useDrawerContext()

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

  function onSuccessPlanningTraining(date: Date) {
    drawer.current?.close()
    const createdInWeek = getWeekNumberFromDate(date)
    if (createdInWeek === week) return mutate()
    router.replace(pathname.concat(`?week=${createdInWeek}`))
  }

  return (
    <section className='w-full h-full'>
      <div className='flex flex-col lg:flex-row gap-4 items-center mb-2 w-full justify-between'>
        <div className='flex gap-4 items-center w-ful flex-col lg:flex-row w-full'>
          <Input type='week' className='w-full lg:max-w-44' onChange={handleWeekInput} value={week} />
          <div className='w-full lg:w-fit flex items-center gap-4 bg-gray-100 py-1 px-2 rounded-full h-fit text-sm'>
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

          {isLoading && <Spinner />}
        </div>
        <Button
          className='px-10 w-full lg:w-fit'
          onClick={() => {
            drawer.current?.open(<PlanningForm onSuccess={onSuccessPlanningTraining} />)
          }}
        >
          <Plus />
          Planejar Treino
        </Button>
      </div>
      <section
        tabIndex={0}
        className='grid grid-rows-7 lg:grid-rows-1 lg:grid-cols-7 min-h-[38vh] rounded-md border border-gray-200'
      >
        {weekDates.map((date) => {
          const isCurrentDay = compareDates(date, currentDay)
          const day = date.toLocaleDateString('pt-BR').split('/')[0]
          const textDay = capitalizeFirstLetter(Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date))
          const plannedTrainings = findPlannedTrainings(date)
          return (
            <li
              key={day}
              className={cn(
                'py-4 border-t lg:border-r border-gray-200 flex flex-col items-center rounded-t-sm',
                isCurrentDay && 'bg-gray-100'
              )}
            >
              <p className='text-xl text-slate-950 font-semibold'>{day}</p>
              <p className='font-medium'>{textDay}</p>

              <ul className='w-full mt-6 flex flex-col gap-1 px-1'>
                {plannedTrainings.map((plannedTraining) => (
                  <li key={plannedTraining.id}>
                    <TrainingCard
                      {...plannedTraining}
                      onSuccessUpdate={onSuccessPlanningTraining}
                      onSuccessDelete={mutate}
                    />
                  </li>
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


