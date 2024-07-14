'use client'

import { Edit, Trash } from 'lucide-react'
import { useDialogContext, useDrawerContext } from '@/contexts'
import { ConfirmDeleteDialog } from '@/components/compositions'
import { BaseTrainingCard, Button } from '@/components/ui'
import { PlanningForm } from '../form'
import type { BaseTrainingProps } from '../page'

interface Props extends BaseTrainingProps {
  onSuccessUpdate(date: Date): void
  onSuccessDelete(): void
}

export function TrainingCard({ onSuccessUpdate, onSuccessDelete, ...rest }: Props) {
  const { id, date, trainingType, description, duration, pse, finished } = rest
  const { dialog } = useDialogContext()
  const { drawer } = useDrawerContext()

  return (
    <BaseTrainingCard {...rest} isPlanned>
      <div className='flex gap-1 justify-end'>
        {!finished && (
          <Button
            className='mt-2 w-full bg-primary-night border border-gray-200 hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'
            onClick={() => {
              drawer.current?.open(
                <PlanningForm
                  method='PUT'
                  onSuccess={onSuccessUpdate}
                  defaultValues={{
                    date,
                    duration,
                    pse,
                    description: description ?? '',
                    trainingTypeUuid: trainingType.id,
                    trainingId: id,
                  }}
                />
              )
            }}
          >
            <Edit size={20} />
            <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Editar</span>
          </Button>
        )}
        <Button
          className='mt-2 w-full bg-primary-night border border-gray-200 hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'
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