import Image from 'next/image'
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
} from '@/components/ui'
import { LogoutButton } from './components/logoutButton'
import { getUser } from '../auth/get-user'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = getUser()

  const userName = getUserName()

  function getUserName() {
    const name = user.name
    const [first, last] = name.split(' ')
    return { name, fallback: first[0]?.concat(last[0]) }
  }

  return (
    <div className='w-full min-h-screen relative'>
      <header className='px-9 py-4 flex justify-between items-center border-b border-[#DEDFE3] fixed w-full bg-white z-20'>
        <Image src='/logo.svg' alt='Training Track Logo' width={135} height={48} priority />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='rounded-[6px] flex items-center gap-2 p-0.5 px-3'>
            <p>{userName.name}</p>
            <Avatar>
              <AvatarFallback>{userName.fallback}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mr-2'>
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Perfil</DropdownMenuItem>
            <DropdownMenuItem disabled>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className='w-full h-full flex relative z-10' style={{ minHeight: 'calc(100vh - 80.8px)' }}>
        <Sidebar />
        <div className='w-full h-full mt-20'>{children}</div>
      </div>
    </div>
  )
}
