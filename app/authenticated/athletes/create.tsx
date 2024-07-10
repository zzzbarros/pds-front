'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { useDrawerContext } from '@/contexts'
import { AthleteForm } from './components'

export function Create() {
  const { drawer } = useDrawerContext()
  return (
    <Button
      className='w-full md:w-fit px-6 md:px-10'
      onClick={() => {
        drawer.current?.open(<AthleteForm closeDrawer={drawer.current.close} />)
      }}
    >
      <Plus />
      Cadastrar atleta
    </Button>
  )
}
