import { Bolt, Home, Users } from 'lucide-react'
import { MenuButton } from './menu'

const menus = [
  { href: ['/dashboard'], label: 'Inicio', icon: <Home /> },
  { href: ['/dashboard/athletes', '/dashboard/athletes/[id]/training-planning'], label: 'Atletas', icon: <Users /> },
  { href: ['/dashboard/training-types'], label: 'Tipos de Treino', icon: <Bolt /> },
]

export function Sidebar() {
  return (
    <div className='pt-5 pb-8 px-12 border-r'>
      <menu className='flex flex-col gap-4'>
        {menus.map((props) => (
          <MenuButton key={props.label} {...props} />
        ))}
      </menu>
    </div>
  )
}
