import { Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export function PseScalePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='w-fit flex gap-1 items-center text-sm underline mt-1 hover:font-semibold'>
          <Info size={18} />
          <p>Ver escala</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-fit'>
        <p className='font-semibold'>Escala de Percepção Subjetiva de Esforço</p>
        <ul className='flex flex-col gap-2 mt-2 p-2'>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold border border-gray-200'>0</div> • Absolutamente nada
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#B6D5F1] text-white'>1</div> • Extremamente
            fraco
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#89CED3] text-white'>2</div> • Muito fraco
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#30D187] text-white'>3</div> • Moderado
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#4EDF42] text-gray-900'>4</div> • Pouco forte
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#BBF31A] text-gray-900'>5</div> • Forte
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#FFFF00] text-gray-900'>6</div>
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#FFE700] text-gray-900'>7</div> • Muito forte
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#FF8900] text-white'>8</div>
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#FF2F00] text-white'>9</div>
          </li>
          <li className='flex gap-2'>
            <div className='size-6 text-center rounded-md font-bold bg-[#E60000] text-white'>10</div> • Máximo
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}
