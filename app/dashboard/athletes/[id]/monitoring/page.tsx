'use client'

import useSWR from 'swr'
import { ChangeEvent, useMemo } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { clientFetcher } from '@/services'
import { Button, Input, Spinner } from '@/components/ui'
import { DailyLoadChart, WeekLoadChart, WellBeingChart, DailyDurationChart } from '@/components/charts'
import {
  compareDates,
  getCurrentWeekDates,
  getNextWeek,
  getPreviousWeek,
  getWeekDatesFromInput,
  getWeekNumberFromDate,
} from '@/lib/utils'

interface WeekMonitoringResponseDto {
  days: Date[]
  PSRs: number[]
  durations: {
    planned: number[]
    performed: number[]
  }
  trainings: {
    planned: number[]
    performed: number[]
  }
  PSEs: {
    planned: number[]
    performed: number[]
  }
}

interface MonotonyMonitoringResponseDto {
  week: string[]
  monotony: number[]
  strain: number[]
  acuteChronicLoadRatio: number[]
  load: {
    planned: number[]
    performed: number[]
  }
}

const wellBeing = [5, 4, 5, 3, 5, 3, 4]

export default function Monitoring() {
  const { id = '' } = useParams()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const pathname = usePathname()
  const router = useRouter()
  const currentDay = new Date()
  const week = searchParams.get('week') ?? getWeekNumberFromDate(currentDay)
  const weekDates = week ? getWeekDatesFromInput(week) : getCurrentWeekDates()

  const firstDayOfWeek = weekDates[0]
  const lastDayOfWeek = weekDates[6]

  const { data: weekMonitoring, isLoading: isLoadingWeekMonitoring } = useSWR(
    ['monitoring-week', firstDayOfWeek, lastDayOfWeek, id],
    async () => {
      const response = await clientFetcher(
        `monitoring/week?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
      )
      if (!response.ok) {
        const defaultValue: number[] = []
        return {
          days: [] as Date[],
          PSRs: defaultValue,
          durations: { performed: defaultValue, planned: defaultValue },
          PSEs: { performed: defaultValue, planned: defaultValue },
          trainings: { performed: defaultValue, planned: defaultValue },
        } as WeekMonitoringResponseDto
      }
      return response.data as WeekMonitoringResponseDto
    }
  )

  const { data: monotonyMonitoring = {} as MonotonyMonitoringResponseDto, isLoading: isLoadingMonotony } = useSWR(
    ['monitoring-monotony', firstDayOfWeek, lastDayOfWeek, id],
    async () => {
      const response = await clientFetcher(
        `monitoring/monotony?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
      )
      if (!response.ok) {
        const defaultValue: number[] = []
        return {
          week: [],
          monotony: defaultValue,
          strain: defaultValue,
          acuteChronicLoadRatio: defaultValue,
          load: {
            planned: defaultValue,
            performed: defaultValue,
          },
        }
      }
      return response.data as MonotonyMonitoringResponseDto
    }
  )

  const { labels, pse, psr, duration, performedTraining, plannedDuration, plannedPse, plannedTraining } =
    useMemo(() => {
      if (!weekMonitoring) {
        return {
          labels: [],
          pse: [],
          plannedPse: [],
          psr: [],
          performedTraining: [],
          plannedTraining: [],
          duration: [],
          plannedDuration: [],
        }
      }

      const labels = weekMonitoring.days.map((day) => new Date(day).toLocaleDateString())

      return {
        labels,
        pse: weekMonitoring.PSEs.performed,
        plannedPse: weekMonitoring.PSEs.planned,
        psr: weekMonitoring.PSRs,
        performedTraining: weekMonitoring.trainings.performed,
        plannedTraining: weekMonitoring.trainings.planned,
        duration: weekMonitoring.durations.performed,
        plannedDuration: weekMonitoring.durations.planned,
      }
    }, [weekMonitoring])

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

  return (
    <section className=' w-full h-full flex flex-col gap-6 print:gap-20'>
      <div className='flex justify-between w-full'>
        <div className='flex gap-4 items-center w-full'>
          <Input type='week' className='max-w-44 print:hidden' onChange={handleWeekInput} value={week} />
          <div className='flex items-center gap-4 bg-gray-100 py-1 px-2 rounded-full h-fit text-sm'>
            <button className='p-1 rounded-full bg-white hover:brightness-90 print:hidden' onClick={handlePreviousWeek}>
              <ArrowLeft size={16} />
            </button>
            <span>
              {firstDayOfWeek.toLocaleDateString()} - {lastDayOfWeek.toLocaleDateString()}
            </span>
            <button className='p-1 rounded-full bg-white hover:brightness-90 print:hidden' onClick={handleNextWeek}>
              <ArrowRight size={16} />
            </button>
          </div>
          {isLoadingWeekMonitoring && <Spinner />}
        </div>
        <Button
          className='px-10 print:hidden'
          onClick={() => {
            if (window) window.print()
          }}
        >
          Imprimir
        </Button>
      </div>
      <DailyLoadChart {...{ labels, psr, pse, plannedTraining, performedTraining }} />
      <DailyDurationChart {...{ labels, pse, plannedPse, duration, plannedDuration }} />
      <WeekLoadChart {...monotonyMonitoring} />
      {/* TODO: Integrar com API / REMOVER MOCK  */}
      <WellBeingChart
        {...{ labels }}
        fatigue={wellBeing}
        humor={wellBeing}
        musclePain={wellBeing}
        nightOfSleep={wellBeing}
        stress={wellBeing}
      />
    </section>
  )
}
