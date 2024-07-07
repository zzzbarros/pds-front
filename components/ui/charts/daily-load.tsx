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
import { ChartWrapper } from './wrapper'

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
  psr: number[]
  pse: number[]
  plannedTraining: number[]
  performedTraining: number[]
}

export function DailyLoadChart(props: Props) {
  const { labels = [], pse = [], psr = [], plannedTraining = [], performedTraining = [] } = props

  const data = {
    title: 'Carga Diária da Semana',
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'PSR',
        backgroundColor: '#FFA908',
        borderColor: '#FFA908',
        lineTension: 0.3,
        fill: false,
        data: psr,
        yAxisID: 'y1',
      },
      {
        type: 'line' as const,
        label: 'PSE',
        borderColor: '#E60000',
        backgroundColor: '#E60000',
        lineTension: 0.3,
        fill: false,
        data: pse,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'Carga Planejada',
        backgroundColor: '#313B56',
        borderRadius: 8,
        data: plannedTraining,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Carga Realizada',
        backgroundColor: '#8B6DD7',
        borderColor: 'white',
        borderRadius: 8,
        data: performedTraining,
        yAxisID: 'y',
      },
    ],
  }

  return (
    <ChartWrapper title='Carga diária' className='page-break print:mt-16'>
      <Chart type='bar' data={data} options={options} />
    </ChartWrapper>
  )
}
