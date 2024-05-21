'use client'

import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { AuthTabEnum } from '../enums'

interface Props {
  children: React.ReactNode
}

export function TabsComponents({ children }: Props) {
  const route = usePathname().split('/')[2]

  const defaultTabByRoute = {
    login: AuthTabEnum.LOGIN,
    register: AuthTabEnum.REGISTER,
    ['create-password']: AuthTabEnum.REGISTER,
  } as Record<string, AuthTabEnum>

  return (
    <div className='w-full h-screen flex flex-col p-6 md:p-10 justify-between items-center '>
      <Tabs defaultValue={defaultTabByRoute[route]} className='w-full flex flex-col gap-20'>
        <TabsList className='mx-auto'>
          <TabsTrigger value={AuthTabEnum.REGISTER}>Criar Conta</TabsTrigger>
          <TabsTrigger value={AuthTabEnum.LOGIN}>Entrar</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
