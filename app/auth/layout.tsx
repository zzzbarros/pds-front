import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BaseTemplate, AuthTemplate } from '@/components/templates'
import { RouteEnum } from '@/enums'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const authCookie = cookies().get('user')

  if (authCookie?.value) {
    const authData = JSON.parse(authCookie.value)
    if (!!authData?.token) {
      return redirect(RouteEnum.AUTHENTICATED)
    }
  }

  return (
    <BaseTemplate>
      <AuthTemplate.TabComponent>{children}</AuthTemplate.TabComponent>
    </BaseTemplate>
  )
}
