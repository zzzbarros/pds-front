'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface Props {
  href: string
  label: string
  icon: React.ReactNode
}

export function MenuButton({ href, label, icon }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link href={href}>
      <li
        className={twMerge(
          'text-gray-600 hover:text-gray-800 text-nowrap flex items-center gap-2 hover:underline',
          isActive && 'text-primary-medium font-bold underline'
        )}
      >
        {icon}
        {label}
      </li>
    </Link>
  )
}
