'use client'

import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ChartWrapper } from './wrapper'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  musclePain: number[]
  fatigue: number[]
  humor: number[]
  stress: number[]
  nightOfSleep: number[]
}

export function WellBeingChart(props: Props) {
  const { labels, musclePain, fatigue, humor, nightOfSleep, stress } = props

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Dor Muscular',
        data: musclePain,
        backgroundColor: '#121316',
        borderRadius: 8,
        stack: 'Stack 0',
      },
      {
        label: 'Noite de Sono',
        data: nightOfSleep,
        backgroundColor: '#313B56',
        borderRadius: 8,
        stack: 'Stack 0',
      },
      {
        label: 'Humor',
        data: humor,
        backgroundColor: '#624F96',
        borderRadius: 8,
        stack: 'Stack 0',
      },
      {
        label: 'Fadiga',
        data: fatigue,
        backgroundColor: '#8B6DD7',
        borderRadius: 8,
        stack: 'Stack 0',
      },
      {
        label: 'Stress',
        data: stress,
        backgroundColor: '#DEDFE3',
        borderRadius: 8,
        stack: 'Stack 0',
      },
    ],
  }

  return (
    <ChartWrapper title='Monitoramento de Bem-Estar' className='print:mt-16'>
      <Bar options={options} data={data} />
    </ChartWrapper>
  )
}
