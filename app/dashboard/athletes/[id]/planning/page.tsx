'use client'

import { Button, Input } from '@/components/ui'
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
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent } from 'react'
import { PlanningForm } from './form'

export default function PlanningPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentDay = new Date()
  const week = searchParams.get('week') ?? getWeekNumberFromDate(currentDay)
  const weekDates = week ? getWeekDatesFromInput(week) : getCurrentWeekDates()

  const firstDayOfWeek = weekDates[0]
  const lastDayOfWeek = weekDates[6]

  function handleWeekInput(e: ChangeEvent<HTMLInputElement>) {
    const week = e.target.value
    if (!week) router.push(pathname)
    router.push(pathname.concat(`?week=${week}`))
  }

  function handlePreviousWeek() {
    router.push(pathname.concat(`?week=${getPreviousWeek(week)}`))
  }

  function handleNextWeek() {
    router.push(pathname.concat(`?week=${getNextWeek(week)}`))
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
        </div>
        <PlanningForm />
      </div>
      <section className='grid grid-cols-7 min-h-[25vh] rounded-md border border-gray-200'>
        {weekDates.map((date, index) => {
          const isCurrentDay = compareDates(date, currentDay)
          const day = date.toLocaleDateString('pt-BR').split('/')[0]
          const textDay = capitalizeFirstLetter(Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date))
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

              <ul className='mt-6 flex flex-col gap-1 px-1'>
                {index === 1 && [1, 2, 3].map((v) => <TrainingCard key={v} />)}
              </ul>
            </li>
          )
        })}
      </section>
    </section>
  )
}

function TrainingCard() {
  return (
    <div className='flex flex-col gap-0.5 bg-primary-medium w-full rounded-md p-2'>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        Tipo: <strong>Corrida</strong>
      </p>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        Descrição: <strong>Uma corrida de 5km com subida, descida e uma morte lenta</strong>
      </p>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        Duração: <strong>60 minutos</strong>
      </p>
      <p className='text-xs text-white text-ellipsis line-clamp-2'>
        PSE: <strong>7</strong>
      </p>
    </div>
  )
}
