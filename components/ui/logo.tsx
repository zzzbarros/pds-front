import Image from 'next/image'
import Link from 'next/link'

interface Props {
  width?: number
  height?: number
  href?: string
}

export function Logo({ width = 135, height = 48, href = '/' }: Props) {
  return (
    <Link href={href}>
      <Image src='/logo.svg' alt='Training Track Logo' width={width} height={height} priority />
    </Link>
  )
}
