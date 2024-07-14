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
      className={cn(
        'w-full h-full border border-gray-200 rounded-md py-4 print:border-none min-w-[60vw] relative [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:min-h-[600px] [&_canvas]:min-w-[60vw]',
        className
      )}
      {...props}
    >
      <h2 className='text-xl md:text-lg font-semibold print:mb-4 py-2 px-6 pb-6'>{title}</h2>
      <div className='w-full px-6 border-t border-gray-200 py-8 print:py-0 print:pb-2'>{children}</div>
    </div>
  )
}
