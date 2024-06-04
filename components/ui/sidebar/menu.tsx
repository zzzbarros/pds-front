'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface Props {
  href: string[]
  label: string
  icon: React.ReactNode
}

export function MenuButton({ href, label, icon }: Props) {
  const pathname = usePathname()
  const { id = '' } = useParams()
  const isActive = href.map((route) => route.replace('[id]', id as string)).includes(pathname)

  return (
    <Link href={href[0]}>
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
