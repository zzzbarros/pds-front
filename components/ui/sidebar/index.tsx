'use client'

import { Bolt, Home, LogOut, Menu, Users } from 'lucide-react'
import { MenuButton } from './menu'
import { Close } from '@radix-ui/react-dialog'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../sheet'
import { Button } from '../button'
import { useRouter } from 'next-nprogress-bar'
import { deleteCookie } from 'cookies-next'

const menus = [
  { href: ['/authenticated'], label: 'Inicio', icon: <Home /> },
  {
    href: [
      '/authenticated/athletes',
      '/authenticated/athletes/[id]/monitoring',
      '/authenticated/athletes/[id]/training-planning',
      '/authenticated/athletes/[id]/training',
    ],
    label: 'Atletas',
    icon: <Users />,
  },
  { href: ['/authenticated/training-types'], label: 'Tipos de Treino', icon: <Bolt /> },
]

interface Props {
  isMobile?: boolean
}

export function Sidebar({ isMobile = false }: Props) {
  const router = useRouter()

  function handleSignOut() {
    deleteCookie('user')
    router.replace('/auth/login')
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
                <Close asChild key={props.label}>
                  <MenuButton {...props} />
                </Close>
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
