'use client'

import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { buildingRouteWithId } from '@/lib/utils'
import { RouteEnum } from '@/enums'

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
  const paths = usePathname().split('/')
  const route = paths[4]
  const athleteId = paths[3]

  return (
    <Tabs value={defaultTabByRoute[route]} className='w-full flex flex-col gap-6'>
      <TabsList className='w-full md:w-fit print:hidden'>
        <TabsTrigger value={TabsEnum.MONITORING}>Monitoramento</TabsTrigger>
        <TabsTrigger
          href={buildingRouteWithId(RouteEnum.TRAINING_PLANNING, athleteId)}
          value={TabsEnum.TRAINING_PLANNING}
        >
          Treinos Planejados
        </TabsTrigger>
        <TabsTrigger href={buildingRouteWithId(RouteEnum.TRAININGS, athleteId)} value={TabsEnum.TRAINING}>
          Treinos Concluídos
        </TabsTrigger>
        <TabsTrigger href={buildingRouteWithId(RouteEnum.UPDATE_ATHLETE, athleteId)} value={TabsEnum.UPDATE}>
          Informações
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
