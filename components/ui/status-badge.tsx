import { SquareCheck, SquareX } from 'lucide-react'

export function StatusBadge({ isEnabled }: { isEnabled: boolean }) {
  return (
    <span className='flex gap-2 items-center min-w-24'>
      {isEnabled ? <SquareCheck className='stroke-2 size-4' /> : <SquareX className='stroke-2 size-4' />}
      {isEnabled ? 'Ativo' : 'Inativo'}
    </span>
  )
}
