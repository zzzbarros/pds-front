import Image from 'next/image'

export function Footer() {
  return (
    <footer className='w-full bg-primary-medium brightness-95 h-full py-5 px-8 flex gap-2 items-center justify-center print:hidden'>
      <Image src='/logo.svg' alt='Training Track Logo' width={135} height={48} priority />
      <p className='font-medium text-center w-fit text-primary-dark py-2 border-l-2 border-primary-dark px-4'>
        Copyright @ 2024
      </p>
    </footer>
  )
}
