import Image from 'next/image'
import type { ReactNode } from 'react'

export function BaseTemplate({ children }: { children: ReactNode }) {
  return (
    <main className='flex flex-col xl:flex-row min-h-screen max-w-screen w-full h-full'>
      <div className='w-full xl:w-[30%] xl:min-h-screen bg-primary-medium flex justify-center xl:justify-start xl:items-end p-6 md:p-10 '>
        <Image src='/logo.svg' alt='Training Track Logo' width={135} height={48} priority />
      </div>
      {children}
    </main>
  )
}
