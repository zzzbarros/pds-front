'use client'

import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'

interface Props {
  children: React.ReactNode
}

enum TabsEnum {
  PLANNING = 'planning',
  MONITORING = 'monitoring',
  TRAINING = 'training',
}

const defaultTabByRoute = {
  [TabsEnum.PLANNING]: TabsEnum.PLANNING,
  [TabsEnum.MONITORING]: TabsEnum.MONITORING,
  [TabsEnum.TRAINING]: TabsEnum.TRAINING,
} as Record<string, TabsEnum>

export function TabsComponents({ children }: Props) {
  const route = usePathname().split('/')[4]

  return (
    <Tabs defaultValue={defaultTabByRoute[route]} className='w-full flex flex-col gap-6'>
      <TabsList className='w-fit'>
        <TabsTrigger value={TabsEnum.MONITORING}>Monitoramento</TabsTrigger>
        <TabsTrigger value={TabsEnum.PLANNING}>Planejamento</TabsTrigger>
        <TabsTrigger value={TabsEnum.TRAINING}>Treinos</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
