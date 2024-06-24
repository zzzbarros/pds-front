import { Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export function PsrScalePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='w-fit flex gap-1 items-center text-sm underline mt-1 hover:font-semibold'>
          <Info size={18} />
          <p>Ver escala</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-fit'>
        <p className='font-semibold'>Escala de Percepção Subjetiva de Recuperação</p>
        <ul className='flex flex-col gap-2 mt-2 p-2'>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold border border-gray-200'>0</div> • Nenhuma
            recuperação
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#f0f3fa] text-gray-900'>1</div> • Muito pouco
            recuperado
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#E1EAF7] text-gray-900'>2</div> • Pouco
            recuperado
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#E2EAF7] text-gray-900'>3</div> • Recuperação
            moderada
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#D0DEF3] text-gray-900'>4</div> • Boa
            recuperação
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#C8D9F1] text-gray-900'>5</div> • Recuperação
            muito boa
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#B0CAEC] text-white'>6</div>
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#98BBE7] text-white'>7</div> • Recuperação
            extremamente boa
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#81AFE4] text-white'>8</div>
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#6BA5E1] text-white'>9</div>
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#5C9FDF] text-white'>10</div> • Recuperado
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
