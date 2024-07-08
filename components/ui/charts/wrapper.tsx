import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string
  children: ReactNode
}

export function ChartWrapper({ title, children, className, ...props }: Props) {
  return (
    <div
      tabIndex={0}
      className={cn('w-full h-full border border-gray-200 rounded-md py-6 print:border-none', className)}
      {...props}
    >
      <h2 className='font-semibold print:mb-4 px-6 pb-6'>{title}</h2>
      <div className='w-full px-6 border-t border-gray-200 py-8 print:py-0 print:pb-2'>{children}</div>
    </div>
  )
}
