'use client'

import { Edit, Trash } from 'lucide-react'
import { useDialogContext } from '@/contexts'
import { ConfirmDeleteDialog } from '@/components/compositions'
import { BaseTrainingCard } from '@/components/features'
import { Button } from '@/components/ui'
import { PlanningForm } from '../form'
import type { BaseTrainingProps } from '../page'

export function TrainingCard({
  onSuccessUpdate,
  onSuccessDelete,
  ...rest
}: BaseTrainingProps & { onSuccessUpdate(date: Date): void; onSuccessDelete(): void }) {
  const { id, date, trainingType, description, duration, pse } = rest
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
          <Button className='mt-2 w-full border border-gray-200 focus:flex animate-[enter_0.8s] group/button p-3 hover:brightness-125'>
            <Edit size={20} />
            <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Editar</span>
          </Button>
        </PlanningForm>
        <Button
          className='mt-2 w-full border border-gray-200 animate-[enter_0.8s] group/button p-3 hover:brightness-125'
          onClick={() => {
            dialog.current?.open(
              <ConfirmDeleteDialog
                title='Você tem certeza que deseja remover o planejamento de treino?'
                route={'training-planning/'.concat(id)}
                onClose={dialog?.current.close}
                onSuccess={onSuccessDelete}
              />
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