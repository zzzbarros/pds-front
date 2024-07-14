'use client'

import { useState } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { Button, toast } from '@/components/ui'
import { BaseTemplate } from '@/components/templates'
import { clientFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import type { IPageProps } from '@/types'

export default function Unsubscribe(props: IPageProps) {
  const { token = '' } = props.params
  const { email } = props.searchParams
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit() {
    if (!token) return
    setIsLoading(true)
    const res = await clientFetcher<{ title: string; message: string }>('unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ token, email }),
    })
    if (!res.ok) {
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'destructive',
      })
      setIsLoading(false)
    } else {
      router.push(RouteEnum.HOME)
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }
  }

  return (
    <BaseTemplate>
      <section className='w-full h-full text-center p-8 my-auto'>
        <h1 className='text-3xl md:text-2xl text-primary-medium font-bold'>Deseja cancelar a inscrição?</h1>
        <div className='w-full flex justify-center'>
          <p className='text-xl md:text-lg mt-[6px] mb-6 text-zinc-600 font-medium w-full md:w-2/4 text-balance'>
            Caso cancele a inscrição você passará a não receber mais e-mails de monitoramento. Para prosseguir clique no
            botão abaixo,
            <strong> essa ação não poderá ser desfeita!</strong>
          </p>
        </div>
        <p className='mb-8 text-lg'>
          Email:<strong> {email}</strong>
        </p>
        <Button isLoading={isLoading} className='font-semibold' onClick={onSubmit}>
          Cancelar Inscrição
        </Button>
      </section>
    </BaseTemplate>
  )
}
