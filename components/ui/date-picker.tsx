'use client'

import { Control } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import 'react-day-picker/dist/style.css'

interface Props {
  label: string
  name: string
  control: Control<any, any>
  description?: string
}

export function DatePicker({ control, label, name, description }: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col '>
          <FormLabel className='mb-1'>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  className={cn('w-72 md:w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Selecione a data</span>}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                locale={ptBR}
                defaultMonth={field.value}
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
                fromYear={1910}
                toYear={2100}
                captionLayout='dropdown-buttons'
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
