import { Bolt, Home, Users } from 'lucide-react'
import { MenuButton } from './menu'

const menus = [
  { href: ['/dashboard'], label: 'Inicio', icon: <Home /> },
  {
    href: [
      '/dashboard/athletes',
      '/dashboard/athletes/[id]/monitoring',
      '/dashboard/athletes/[id]/training-planning',
      '/dashboard/athletes/[id]/training',
    ],
    label: 'Atletas',
    icon: <Users />,
  },
  { href: ['/dashboard/training-types'], label: 'Tipos de Treino', icon: <Bolt /> },
]

export function Sidebar() {
  return (
    <div className='pt-5 pb-8 px-8 border-r print:hidden relative min-w-60 mt-20'>
      <menu className='flex flex-col gap-2 fixed '>
        {menus.map((props) => (
          <MenuButton key={props.label} {...props} />
        ))}
      </menu>
    </div>
  )
}
