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
  week: string[]
  monotony: number[]
  strain: number[]
  acuteChronicLoadRatio: number[]
  load: {
    planned: number[]
    performed: number[]
  }
}

export function WeekLoadChart(props: Props) {
  const { week, strain, monotony, load, acuteChronicLoadRatio } = props

  const data = {
    title: 'Carga da Semana',
    labels: week,
    datasets: [
      {
        type: 'line' as const,
        label: 'Risco Agudo:Crônico',
        borderColor: '#E60000',
        backgroundColor: '#E60000',
        lineTension: 0.3,
        fill: false,
        data: acuteChronicLoadRatio,
        yAxisID: 'y1',
      },
      {
        type: 'line' as const,
        label: 'Monotonia',
        borderColor: '#624F96',
        backgroundColor: '#624F96',
        lineTension: 0.3,
        fill: false,
        data: monotony,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'Carga Planejada',
        backgroundColor: '#313B56',
        borderColor: '#313B56',
        borderRadius: 8,
        data: load?.planned ?? [],
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Carga Realizada',
        backgroundColor: '#8B6DD7',
        borderColor: '#8B6DD7',
        borderRadius: 8,
        data: load?.performed ?? [],
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Tensão',
        backgroundColor: '#FFA908',
        borderColor: '#FFA908',
        borderRadius: 8,
        data: strain,
        yAxisID: 'y',
      },
    ],
  }

  return (
    <div className='w-full h-full border border-gray-200 rounded-md p-6'>
      <h2 className='font-semibold'>Carga semanal</h2>
      <Chart type='bar' data={data} options={options} />
    </div>
  )
}
