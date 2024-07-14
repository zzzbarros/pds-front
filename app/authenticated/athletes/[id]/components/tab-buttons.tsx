'use client'

import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'

interface Props {
  children: React.ReactNode
}

enum TabsEnum {
  TRAINING_PLANNING = 'training-planning',
  MONITORING = 'monitoring',
  TRAINING = 'training',
  UPDATE = 'update',
}

const defaultTabByRoute = {
  [TabsEnum.TRAINING_PLANNING]: TabsEnum.TRAINING_PLANNING,
  [TabsEnum.MONITORING]: TabsEnum.MONITORING,
  [TabsEnum.TRAINING]: TabsEnum.TRAINING,
  [TabsEnum.UPDATE]: TabsEnum.UPDATE,
} as Record<string, TabsEnum>

export function TabsComponents({ children }: Props) {
  const route = usePathname().split('/')[4]

  return (
    <Tabs value={defaultTabByRoute[route]} className='w-full flex flex-col gap-6'>
      <TabsList className='w-full md:w-fit print:hidden'>
        <TabsTrigger value={TabsEnum.MONITORING}>Monitoramento</TabsTrigger>
        <TabsTrigger value={TabsEnum.TRAINING_PLANNING}>Treinos Planejados</TabsTrigger>
        <TabsTrigger value={TabsEnum.TRAINING}>Treinos Executados</TabsTrigger>
        <TabsTrigger value={TabsEnum.UPDATE}>Informações</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
