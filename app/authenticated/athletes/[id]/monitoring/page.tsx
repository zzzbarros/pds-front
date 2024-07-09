'use client'

import useSWR from 'swr'
import { ChangeEvent, useMemo } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { clientFetcher } from '@/services'
import {
  Button,
  DailyLoadChart,
  WeekLoadChart,
  WellBeingChart,
  DailyDurationChart,
  Input,
  Spinner,
} from '@/components/ui'
import {
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

interface GetWellBeingMonitoringResponseDto {
  days: Date[]
  sleep: number[]
  disposition: number[]
  musclePain: number[]
  stress: number[]
  humor: number[]
}

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

  const {
    data: wellBeingMonitoring = {} as GetWellBeingMonitoringResponseDto,
    isLoading: isLoadingWellBeingMonitoring,
  } = useSWR(['well-being-week-monitory', firstDayOfWeek, lastDayOfWeek, id], async () => {
    const response = await clientFetcher(
      `monitoring/well-being?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
    )
    if (response.ok) return response.data as GetWellBeingMonitoringResponseDto
    return {
      days: [] as Date[],
      disposition: [],
      stress: [],
      sleep: [],
      humor: [],
      musclePain: [],
    } as GetWellBeingMonitoringResponseDto
  })

  const isLoading = isLoadingWellBeingMonitoring || isLoadingMonotony || isLoadingWeekMonitoring

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
    <section className=' w-full h-full flex flex-col gap-6 print:gap-4'>
      <div className='flex flex-col lg:flex-row gap-4 items-center mb-2 w-full justify-between'>
        <div className='flex gap-4 items-center w-ful flex-col lg:flex-row w-full'>
          <Input type='week' className='print:hidden w-full lg:max-w-44' onChange={handleWeekInput} value={week} />
          <div className='w-full lg:w-fit flex items-center gap-4 bg-gray-100 py-1 px-2 rounded-full h-fit text-sm'>
            <button className='print:hidden p-1 rounded-full bg-white hover:brightness-90' onClick={handlePreviousWeek}>
              <ArrowLeft size={16} />
            </button>
            <span className='w-full text-center'>
              {firstDayOfWeek.toLocaleDateString('pt-BR')} - {lastDayOfWeek.toLocaleDateString('pt-BR')}
            </span>
            <button className='print:hidden p-1 rounded-full bg-white hover:brightness-90' onClick={handleNextWeek}>
              <ArrowRight size={16} />
            </button>
          </div>
          {isLoading && <Spinner />}
        </div>
        <Button
          className='px-10 w-full lg:w-fit print:hidden'
          onClick={() => {
            if (window) window.print()
          }}
        >
          Imprimir
        </Button>
      </div>
      <WeekLoadChart {...monotonyMonitoring} />
      <DailyLoadChart {...{ labels, psr, pse, plannedTraining, performedTraining }} />
      <DailyDurationChart {...{ labels, pse, plannedPse, duration, plannedDuration }} />
      <WellBeingChart
        {...{ labels }}
        fatigue={wellBeingMonitoring.disposition}
        humor={wellBeingMonitoring.humor}
        musclePain={wellBeingMonitoring.musclePain}
        nightOfSleep={wellBeingMonitoring.sleep}
        stress={wellBeingMonitoring.stress}
      />
    </section>
  )
}
