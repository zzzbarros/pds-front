type Position = 'center' | 'left' | 'right' | 'bottom' | 'top' | 'chartArea'
type Align = 'end' | 'start' | 'center' | 'bottom' | 'left' | 'right'
type Anchor = 'center' | 'start' | 'end'

export const options = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
    },
  },
  plugins: {
    datalabels: {
      display: true,
      color: 'black',
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.2)',
      formatter: Math.round,
      anchor: 'center' as Anchor,
      offset: -22,
      align: 'start' as Align,
    },
  },
}
