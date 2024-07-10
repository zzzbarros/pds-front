import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ChartWrapper } from './wrapper'
import { options as BASE_OPTIONS } from './options'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

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

  const { plugins, interaction, responsive } = BASE_OPTIONS

  const options = {
    plugins,
    interaction,
    responsive,
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
        label: 'Stress',
        data: stress,
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
        label: 'Noite de Sono',
        data: nightOfSleep,
        backgroundColor: '#DEDFE3',
        borderRadius: 8,
        stack: 'Stack 0',
      },
    ],
  }

  return (
    <ChartWrapper title='Monitoramento de Bem-Estar' className='print:mt-16'>
      <Bar options={options} data={data} width={100} height={50} />
    </ChartWrapper>
  )
}
