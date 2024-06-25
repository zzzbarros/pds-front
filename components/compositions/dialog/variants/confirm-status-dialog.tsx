import { useState } from 'react'
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@/components/ui'
import { clientFetcher } from '@/services'

interface Props {
  route: string
  onClose(): void
  onSuccess(): void
  title: string
  description?: string
  currentStatus: boolean
}

export function ConfirmStatusDialog({
  onClose,
  onSuccess,
  route,
  title,
  currentStatus,
  description = 'Essa ação poderá ser desfeita depois.',
}: Props) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleDelete() {
    try {
      setIsUpdating(true)
      const response = await clientFetcher<{ title: string; message: string }>(route, {
        method: 'PATCH',
      })
      toast({
        title: response.data.title,
        description: response.data.message,
        ...(!response.ok && { variant: 'destructive' }),
      })
      onSuccess()
    } catch {
      toast({
        title: 'Desculpe, não foi possível concluir a ação!',
        description: 'Verifique e tente novamente em instantes...',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
      onClose()
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='flex flex-col gap-1 mt-3'>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className='mt-1'>
        <Button variant='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button variant={currentStatus ? 'destructive' : 'default'} onClick={handleDelete} isLoading={isUpdating}>
          {currentStatus ? 'Inativar' : 'Ativar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
