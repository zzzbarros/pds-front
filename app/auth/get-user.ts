import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export function getUser() {
  const authCookie = cookies().get('user')

  if (!authCookie?.value) redirect('/auth/login')

  const authData = JSON.parse(authCookie?.value)

  if (!authData?.token) redirect('/auth/login')

  return {
    token: authData.token,
    user: authData.user,
  }
}
