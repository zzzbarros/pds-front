'use server'

import { setCookie } from 'cookies-next'
import { redirect } from 'next/navigation'
import { getUser } from '@/app/auth/get-user'

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

let refreshTokenController: AbortController | null = null

export async function serverFetcher<T = any>(url: string, props: RequestInit | undefined) {
  const { token, user, refreshToken, keepLogin } = getUser()

  const response = await fetcher(url, props, token)

  if (response.status === 401) {
    if (!keepLogin || !refreshToken) return redirect('/auth/login')

    if (refreshTokenController) {
      await new Promise((resolve) => {
        refreshTokenController!.signal.addEventListener('abort', resolve)
      })
    } else {
      refreshTokenController = new AbortController()
      const refreshedToken = await generateRefreshTokens(refreshToken, refreshTokenController)

      if (refreshedToken) {
        setCookie(
          'user',
          JSON.stringify({
            user,
            token: refreshedToken,
          })
        )
        refreshTokenController.abort()
        refreshTokenController = null
        const tryResponse = await fetcher(url, props, refreshedToken)
        return { ok: tryResponse.ok, data: (await tryResponse.json()) as T, status: tryResponse.status }
      } else {
        refreshTokenController.abort()
        refreshTokenController = null
        return redirect('/auth/login')
      }
    }
  }

  return { ok: response.ok, data: (await response.json()) as T, status: response.status }
}

async function fetcher(url: string, props?: RequestInit, token?: string): Promise<Response> {
  return await fetch(baseUrl.concat(url), {
    ...props,
    headers: {
      ...props?.headers,
      ...(token && { Authorization: 'Bearer '.concat(token) }),
      ...((props?.method === 'POST' || props?.method === 'PUT') && { 'Content-Type': 'application/json' }),
    },
  })
}

async function generateRefreshTokens(refreshToken: string, controller: AbortController): Promise<string | null> {
  const response = await fetch(baseUrl.concat('auth/refresh-token'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    signal: controller.signal,
  })
  return response.ok ? ((await response.json()) as { token: string }).token : null
}

