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
        'w-full h-full border border-gray-200 rounded-md py-4 print:border-none min-h-[100vh] min-w-[80vw] relative [&_canvas]:h-full [&_canvas]:w-full print:max-h-[80px] print:max-w-[120px] [&_canvas]:min-h-[80vh] [&_canvas]:min-w-[60vw] print:[&_canvas]:max-h-[80px] print:[&_canvas]:max-w-[120px]',
        className
      )}
      {...props}
    >
      <h2 className='text-xl md:text-lg font-semibold print:mb-4 px-6 pb-4'>{title}</h2>
      <div className='w-full px-6 border-t border-gray-200 py-8 print:py-0 print:pb-2'>{children}</div>
    </div>
  )
}
