import { cn } from '@/lib/utils'
import type { SVGProps } from 'react'

export function Spinner({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('animate-spin lucide lucide-loader-circle stroke-primary', className)}
      {...props}
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  )
}
