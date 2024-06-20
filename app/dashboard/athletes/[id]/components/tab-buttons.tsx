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
}

const defaultTabByRoute = {
  [TabsEnum.TRAINING_PLANNING]: TabsEnum.TRAINING_PLANNING,
  [TabsEnum.MONITORING]: TabsEnum.MONITORING,
  [TabsEnum.TRAINING]: TabsEnum.TRAINING,
} as Record<string, TabsEnum>

export function TabsComponents({ children }: Props) {
  const route = usePathname().split('/')[4]

  return (
    <Tabs value={defaultTabByRoute[route]} className='w-full flex flex-col gap-6'>
      <TabsList className='w-fit print:hidden'>
        <TabsTrigger value={TabsEnum.MONITORING}>Monitoramento</TabsTrigger>
        <TabsTrigger value={TabsEnum.TRAINING_PLANNING}>Planejamento</TabsTrigger>
        <TabsTrigger value={TabsEnum.TRAINING}>Treinos</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
