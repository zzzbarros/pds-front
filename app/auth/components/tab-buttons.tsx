'use client'

import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { AUTH_TAB_ENUM } from '../enums'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

export function TabsComponents({ children }: Props) {
  const route = usePathname().split('/')[2]

  const defaultTabByRoute = {
    login: AUTH_TAB_ENUM.LOGIN,
    register: AUTH_TAB_ENUM.REGISTER,
  } as Record<string, AUTH_TAB_ENUM>

  return (
    <div className='w-full h-screen flex flex-col p-6 md:p-10 justify-between items-center '>
      <Tabs defaultValue={defaultTabByRoute[route]} className='w-full flex flex-col gap-20'>
        <TabsList className='mx-auto'>
          <Link href='register'>
            <TabsTrigger value={AUTH_TAB_ENUM.REGISTER}>Criar Conta</TabsTrigger>
          </Link>
          <Link href='login'>
            <TabsTrigger value={AUTH_TAB_ENUM.LOGIN}>Entrar</TabsTrigger>
          </Link>
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
