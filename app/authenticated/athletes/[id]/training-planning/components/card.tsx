'use client'

import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { clientFetcher } from '@/services'
import { useDialogContext } from '@/contexts'
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@/components/ui'
import { PlanningForm } from '../form'
import type { BaseTrainingProps } from '../page'
import { BaseTrainingCard } from '@/components/features'

export function TrainingCard({
  onSuccessUpdate,
  onSuccessDelete,
  ...rest
}: BaseTrainingProps & { onSuccessUpdate(date: Date): void; onSuccessDelete(): void }) {
  const { id, date, trainingType, description, duration, pse, load } = rest
  const { dialog } = useDialogContext()

  return (
    <BaseTrainingCard {...rest}>
      <div className='flex gap-1 justify-end'>
        <PlanningForm
          onSuccess={onSuccessUpdate}
          defaultValues={{
            date,
            duration,
            pse,
            description: description ?? '',
            trainingTypeUuid: trainingType.id,
            trainingId: id,
          }}
        >
          <Button
            tabIndex={1}
            className='mt-2 w-full border border-gray-200 hidden group-hover:flex group-focus:flex animate-[enter_0.8s] group/button p-3 hover:brightness-125'
          >
            <Edit size={20} />
            <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Editar</span>
          </Button>
        </PlanningForm>
        <Button
          tabIndex={1}
          className='mt-2 w-full border border-gray-200 hidden group-hover:flex group-focus:flex animate-[enter_0.8s] group/button p-3 hover:brightness-125'
          onClick={() => {
            dialog.current?.open(
              <ConfirmDeleteDialog id={id} onClose={dialog?.current.close} onSuccess={onSuccessDelete} />
            )
          }}
        >
          <Trash size={20} />
          <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Excluir</span>
        </Button>
      </div>
    </BaseTrainingCard>
  )
}

function ConfirmDeleteDialog({ id, onClose, onSuccess }: { id: string; onClose(): void; onSuccess(): void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      const response = await clientFetcher<{ title: string; message: string }>('training-planning/'.concat(id), {
        method: 'delete',
      })
      toast({
        title: response.data.title,
        description: response.data.message,
        ...(!response.ok && { variant: 'destructive' }),
      })
      onSuccess()
    } catch {
      toast({
        title: 'Desculpe, não foi possível remover o planejamento de treino.',
        description: 'Verifique e tente novamente em instantes...',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='flex flex-col gap-1'>
          Você tem certeza que deseja remover o planejamento de treino?
        </DialogTitle>
        <DialogDescription>Essa ação não poderá ser desfeita depois.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button variant='destructive' onClick={handleDelete} isLoading={isDeleting}>
          Excluir
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
