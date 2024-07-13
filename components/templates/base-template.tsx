import type { ReactNode } from 'react'
import { Logo } from '../ui'

export function BaseTemplate({ children }: { children: ReactNode }) {
  return (
    <main className='flex flex-col xl:flex-row min-h-screen max-w-screen w-full h-full pb-10 md:pb-0'>
      <div className='w-full xl:w-[30%] xl:min-h-screen bg-primary-medium flex justify-center xl:justify-start xl:items-end p-6 md:p-10'>
        <Logo />
      </div>
      {children}
    </main>
  )
}
