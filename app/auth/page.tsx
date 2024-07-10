import { redirect } from 'next/navigation'
import { getUser } from './get-user'

export default function AuthPage() {
  const { user } = getUser()
  if (user) redirect('/authenticated/')
  redirect('/auth/register')
}
