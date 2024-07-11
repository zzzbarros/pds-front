'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props {
  id: string
  date: Date
  trainingType: string | { id: string; name: string }
  duration: number
  pse: number
  load: number
  psr?: number
  description?: string
  isPlanned?: boolean
  children?: ReactNode
}

export function BaseTrainingCard({ trainingType, description, duration, pse, psr, load, isPlanned, children }: Props) {
  return (
    <div
      tabIndex={0}
      className={cn(
        'animate-[enter_0.8s] flex flex-col gap-0.5 bg-primary-medium w-full rounded-md p-2 group/card',
        isPlanned && 'bg-primary-night'
      )}
    >
      <p className='text-base md:text-xs text-white text-ellipsis line-clamp-1'>
        Tipo: <strong>{typeof trainingType === 'string' ? trainingType : trainingType.name}</strong>.
      </p>
      <p className='text-base md:text-xs text-white text-ellipsis line-clamp-1'>
        Duração: <strong>{duration} minutos</strong>.
      </p>
      <p className='text-base md:text-xs text-white text-ellipsis line-clamp-1'>
        PSE: <strong>{pse}</strong>.
      </p>
      <p className='text-base md:text-xs text-white text-ellipsis line-clamp-1'>
        Carga: <strong>{load} U.A.</strong>
      </p>
      {psr && (
        <p className='text-base md:text-xs text-white text-ellipsis line-clamp-1'>
          PSR: <strong>{psr}</strong>
        </p>
      )}
      {description && (
        <p className='text-base md:text-xs text-white text-ellipsis line-clamp-2'>
          Descrição: <strong>{description}</strong>.
        </p>
      )}
      {children}
    </div>
  )
}
