'use client'

import { deleteCookie } from 'cookies-next'
import { DropdownMenuItem } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  function logout() {
    deleteCookie('user')
    router.push('/auth/login')
  }

  return (
    <DropdownMenuItem className='flex gap-1 cursor-pointer' onClick={logout}>
      <LogOut size={20} />
      Sair
    </DropdownMenuItem>
  )
}
