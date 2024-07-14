'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Edit, Trash } from 'lucide-react'
import { useDialogContext } from '@/contexts'
import { ConfirmDeleteDialog } from '@/components/compositions'
import { BaseTrainingCard, Button } from '@/components/ui'
import { buildingRouteWithId } from '@/lib/utils'
import { RouteEnum } from '@/enums'
import type { BaseTrainingProps } from '../page'

interface Props extends BaseTrainingProps {
  onSuccessUpdate(date: Date): void
  onSuccessDelete(): void
}

export function TrainingCard({ onSuccessUpdate, onSuccessDelete, ...rest }: Props) {
  const { id, date, trainingType, description, duration, pse, finished } = rest
  const { dialog } = useDialogContext()
  const { id: athleteId = '' } = useParams()

  return (
    <BaseTrainingCard {...rest} isPlanned>
      <div className='flex gap-1 justify-end'>
        {!finished && (
          <Link
            className='w-full'
            href={buildingRouteWithId(RouteEnum.UPDATE_TRAINING_PLANNING, athleteId as string, id)}
          >
            <Button className='mt-2 w-full border border-gray-200 bg-primary-night hidden group-hover/card:flex group-focus/card:flex focus:flex animate-[enter_0.2s] group/button p-3 hover:brightness-125'>
              <Edit size={20} />
              <span className='hidden group-hover/button:inline animate-shadow-drop-center'>Editar</span>
            </Button>
          </Link>
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