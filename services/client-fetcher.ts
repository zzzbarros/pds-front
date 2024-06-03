'use client'

import { getCookie } from 'cookies-next'
import { redirect } from 'next/navigation'

const baseUrl = process.env.api ?? ''

export async function clientFetcher<T = any>(url: string, props: RequestInit | undefined) {
  const user = getCookie('user')
  const response = await fetch(baseUrl.concat(url), {
    ...props,
    headers: {
      ...props?.headers,
      ...(user && { Authorization: 'Bearer '.concat(JSON.parse(user).token) }),
      ...((props?.method === 'POST' || props?.method === 'PUT') && { 'Content-Type': 'application/json' }),
    },
  })

  if (response.status === 401) return redirect('/auth/login')

  return { ok: response.ok, data: (await response.json()) as T, status: response.status }
}
