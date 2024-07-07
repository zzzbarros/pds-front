import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string
  children: ReactNode
}

export function ChartWrapper({ title, children, className, ...props }: Props) {
  return (
    <div className={cn('w-full h-full border border-gray-200 rounded-md p-6 print:border-none', className)} {...props}>
      <h2 className='font-semibold print:mb-4'>{title}</h2>
      {children}
    </div>
  )
}
