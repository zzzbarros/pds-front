import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BaseTemplate } from '@/components/templates'
import { TabsComponents } from './components'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const authCookie = cookies().get('user')

  if (authCookie?.value) {
    const authData = JSON.parse(authCookie.value)
    if (!!authData?.token) {
      return redirect('/authenticated')
    }
  }

  return (
    <BaseTemplate>
      <TabsComponents>{children}</TabsComponents>
    </BaseTemplate>
  )
}
