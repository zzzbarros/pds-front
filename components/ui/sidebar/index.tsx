'use client'

import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next-nprogress-bar'
import { Bolt, Home, LogOut, Menu, Users } from 'lucide-react'
import { MenuButton } from './menu'
import { Button } from '../button'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../sheet'
import { RouteEnum } from '@/enums'

const menus = [
  { href: [RouteEnum.AUTHENTICATED], label: 'Inicio', icon: <Home /> },
  {
    href: [
      RouteEnum.ATHLETES,
      RouteEnum.CREATE_ATHLETE,
      RouteEnum.UPDATE_ATHLETE,
      RouteEnum.MONITORY,
      RouteEnum.TRAININGS,
      RouteEnum.CREATE_TRAINING,
      RouteEnum.UPDATE_TRAINING,
      RouteEnum.TRAINING_PLANNING,
      RouteEnum.CREATE_TRAINING_PLANNING,
      RouteEnum.UPDATE_TRAINING_PLANNING,
    ],
    label: 'Atletas',
    icon: <Users />,
  },
  { href: [RouteEnum.TRAINING_TYPES], label: 'Tipos de Treino', icon: <Bolt /> },
]

interface Props {
  isMobile?: boolean
}

export function Sidebar({ isMobile = false }: Props) {
  const router = useRouter()

  function handleSignOut() {
    deleteCookie('user')
    router.refresh()
    router.replace(RouteEnum.LOGIN)
  }

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger>
          <Menu />
          <span className='sr-only'>Abrir menu</span>
        </SheetTrigger>
        <SheetContent side='right' className='w-fit flex flex-col gap-4'>
          <div className='flex flex-col justify-between h-full relative'>
            <menu className='flex flex-col gap-2 w-full'>
              {menus.map((props) => (
                <SheetClose asChild key={props.label}>
                  <MenuButton {...props} />
                </SheetClose>
              ))}
            </menu>
            <Button variant='outline' className='w-full absolute bottom-0' onClick={handleSignOut}>
              <LogOut size={20} /> <span className='font-semibold'>Sair</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <div className='hidden xl:inline pt-5 pb-8 px-8 border-r print:hidden relative min-w-60 mt-20'>
      <menu className='flex flex-col gap-2 fixed '>
        {menus.map((props) => (
          <MenuButton key={props.label} {...props} />
        ))}
      </menu>
    </div>
  )
}
