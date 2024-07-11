import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

enum UserRoleEnum {
  COACH = 'coach',
  ATHLETE = 'athlete',
}

interface UserProps {
  uuid: string
  name: string
  type: UserRoleEnum
}

export function getUser() {
  const authCookie = cookies().get('user')

  if (!authCookie?.value) redirect('/auth/login')

  const authData = JSON.parse(authCookie?.value)

  if (!authData?.token || !authData?.user) redirect('/auth/login')

  return {
    token: authData.token as string,
    user: authData.user as UserProps,
    refreshToken: authData.refreshToken as string,
    keepLogin: authData.keepLogin as boolean,
  }
}
