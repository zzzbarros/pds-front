import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Footer,
  Logo,
  Sidebar,
} from '@/components/ui'
import { getUser } from '../auth/get-user'
import { AuthTemplate } from '@/components/templates'
import { RouteEnum } from '@/enums'

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
      <header className='px-5 lg:px-9 py-4 flex justify-between items-center border-b border-[#DEDFE3] fixed w-full bg-white z-20'>
        <Logo href={RouteEnum.AUTHENTICATED} />
        <span className='inline xl:hidden'>
          <Sidebar isMobile />
        </span>
        <span className='hidden xl:inline'>
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
              <AuthTemplate.LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </header>
      <div className='w-full h-full min-h-screen flex relative z-10'>
        <Sidebar />
        <div className='w-full h-full mt-20'>{children}</div>
      </div>
      <Footer />
    </div>
  )
}
