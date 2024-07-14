'use client'

import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui'
import { clientFetcher } from '@/services'
import { useSWR } from '@/lib/swr'

export function Details() {
  const { id = '' } = useParams()
  const { data, isLoading } = useSWR(['athlete', id], async () => {
    if (!id) return null
    const response = await clientFetcher(`athletes/${id}`)
    if (!response.ok) return null
    return response.data
  })

  if (isLoading) return <Skeleton className='w-32 h-5' />
  if (!data) return null

  return <h1 className='text-xl font-semibold text-primary-medium'>{data.name}</h1>
}
