'use client'

import React from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { options } from './options'

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
)

interface Props {
  labels: string[]
  plannedPse: number[]
  pse: number[]
  duration: number[]
  plannedDuration: number[]
}

export function DailyDurationChart(props: Props) {
  const { labels, pse, plannedPse, duration, plannedDuration } = props

  const data = {
    title: 'Carga Diária da Semana',
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'PSE Planejada',
        backgroundColor: '#624F96',
        borderColor: '#624F96',
        lineTension: 0.5,
        fill: false,
        data: plannedPse,
        yAxisID: 'y1',
      },
      {
        type: 'line' as const,
        label: 'PSE',
        borderColor: '#E60000',
        backgroundColor: '#E60000',
        lineTension: 0.5,
        fill: false,
        data: pse,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'Tempo de treino planejado (minutos)',
        backgroundColor: '#8B6DD7',
        borderColor: '#8B6DD7',
        borderRadius: 8,
        data: plannedDuration,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Tempo de treino executado (minutos)',
        backgroundColor: '#313B56',
        borderColor: '#313B56',
        borderRadius: 8,
        data: duration,
        yAxisID: 'y',
      },
    ],
  }

  return (
    <div className='w-full h-full border border-gray-200 rounded-md p-6'>
      <h2 className='font-semibold'>{'Duração Total - (Minutos) x PSE'}</h2>
      <Chart type='bar' data={data} options={options} />
    </div>
  )
}
