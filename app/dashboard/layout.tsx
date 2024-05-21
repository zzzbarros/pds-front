import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCookies } from 'next-client-cookies/server'
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { LogoutButton } from './components/logoutButton'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookies = getCookies()
  const rawUser = cookies.get('user')

  if (!rawUser) redirect('/auth/login')

  const userCookie = JSON.parse(rawUser)

  const token = userCookie?.token

  if (!token) redirect('/auth/login')

  const userName = getUserName()

  function getUserName() {
    const { user } = userCookie
    const name = user.name
    const [first, last] = name.split(' ')
    return { name, fallback: first[0]?.concat(last[0]) }
  }

  return (
    <div className='w-screen min-h-screen'>
      <header className='px-9 py-4 flex justify-between items-center border-b border-[#DEDFE3]'>
        <Image src='/logo.svg' alt='Training Track Logo' width={135} height={48} priority />
        <DropdownMenu>
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
      {children}
    </div>
  )
}
