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
          'text-gray-600 hover:text-white hover:bg-primary-night text-nowrap flex items-center gap-2 py-2 px-4 rounded-md w-full',
          isActive && 'text-white bg-primary-medium font-semibold'
        )}
      >
        {icon}
        {label}
      </li>
    </Link>
  )
}
