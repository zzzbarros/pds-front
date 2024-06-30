'use server'

import { getUser } from '@/app/auth/get-user'
import { redirect } from 'next/navigation'

const baseUrl = process.env.API_URL ?? ''

export async function serverFetcher<T = any>(url: string, props: RequestInit | undefined) {
  const { token } = getUser()
  const response = await fetch(baseUrl.concat(url), {
    ...props,
    headers: {
      ...props?.headers,
      ...(token && { Authorization: 'Bearer '.concat(token) }),
      ...((props?.method === 'POST' || props?.method === 'PUT') && { 'Content-Type': 'application/json' }),
    },
  })

  if (response.status === 401) return redirect('/auth/login')

  return { ok: response.ok, data: (await response.json()) as T, status: response.status }
}
