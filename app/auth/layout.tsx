import Image from 'next/image'
import { TabsComponents } from './components'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <main className='flex flex-col xl:flex-row min-h-screen max-w-screen '>
      <div className='w-full xl:w-[30%] xl:h-screen bg-primary-medium flex justify-center xl:justify-start xl:items-end p-6 md:p-10 '>
        <Image src='/logo.svg' alt='Training Track Logo' width={135} height={48} priority />
      </div>
      <TabsComponents>{children}</TabsComponents>
    </main>
  )
}
