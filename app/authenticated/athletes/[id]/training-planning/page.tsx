'use client'

import type { ChangeEvent } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, CircleCheckBig, Info, Plus } from 'lucide-react'
import useSWR from 'swr'
import { clientFetcher } from '@/services'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  finished?: boolean
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
                'py-4 border-t lg:border-r border-gray-200 flex flex-col items-center rounded-t-sm group',
                isCurrentDay && 'bg-gray-100'
              )}
            >
              <div className='flex gap-1 items-center w-full justify-center relative'>
                <p className='text-2xl md:text-xl text-slate-950 font-semibold relative'>{day}</p>
                <button
                  data-current-day={isCurrentDay}
                  className='hidden group-hover:flex p-1 bg-zinc-100 data-[current-day=true]:bg-background hover:brightness-90 rounded-full absolute right-1/3 sm:right-[40vw] md:right-1/4 animate-in'
                  onClick={() => {
                    drawer.current?.open(
                      <PlanningForm method='POST' defaultValues={{ date }} onSuccess={drawer.current?.close} />
                    )
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className='text-lg md:text-base font-medium'>{textDay}</p>
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
      <ul className='flex flex-col md:flex-row md:items-center gap-1 md:gap-3 pt-4 text-sm'>
        <li className='font-semibold'>Legenda: </li>
        <li className='flex gap-1 items-center'>
          <div className='size-5 bg-primary-night rounded-sm' />= Treino planejado;
        </li>
        <li className='flex gap-1 items-center'>
          <CircleCheckBig className='size-5' />= Treino planejado e concluído.
        </li>
      </ul>
      <div className='w-full rounded-md mt-6  border border-gray-200 '>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead>
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
              <TableHead>Total de treinos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableTd>Semana anterior</TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.charge?.previousWeek ?? '-'}
              </TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.trainingTotals?.previousWeek ?? '-'}
              </TableTd>
            </TableRow>
            <TableRow className='font-semibold'>
              <TableTd>Semana atual</TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.charge?.week ?? '-'}
              </TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none ' /> : data?.trainingTotals?.week ?? '-'}
              </TableTd>
            </TableRow>
            <TableRow>
              <TableTd>Próxima semana</TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.charge?.nextWeek ?? '-'}
              </TableTd>
              <TableTd>
                {isLoading ? <Skeleton className='w-10 h-4 rounded-none' /> : data?.trainingTotals?.nextWeek ?? '-'}
              </TableTd>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}


