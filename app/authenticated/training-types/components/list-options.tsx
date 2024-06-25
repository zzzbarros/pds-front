'use client'

import { EllipsisVertical, Pencil, SquareCheck, SquareX } from 'lucide-react'
import { useDialogContext, useDrawerContext } from '@/contexts'
import { clientFetcher } from '@/services'
import revalidateAction from '@/lib/revalidateAction'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { ConfirmStatusDialog } from '@/components/compositions'
import { TrainingTypeForm } from './form'

export function TrainingTypeListOptions({ isEnabled, id }: { id: string; isEnabled: boolean }) {
  const { dialog } = useDialogContext()
  const { drawer } = useDrawerContext()

  async function openEdit() {
    const response = await clientFetcher('training-types/'.concat(id))
    if (response.ok)
      drawer.current?.open(<TrainingTypeForm closeDrawer={drawer.current?.close} defaultValues={response.data} />)
  }

  const statusLabel = isEnabled ? 'Inativar' : 'Ativar'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='py-1 px-1 hover:brightness-95 bg-white rounded-md'>
          <EllipsisVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-fit'>
        <DropdownMenuItem asChild>
          <button className='w-full text-left flex gap-2 items-center' onClick={openEdit}>
            <Pencil className='stroke-2 size-4' />
            Editar
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className='w-full text-left flex gap-2 items-center'
            onClick={() => {
              dialog.current?.open(
                <ConfirmStatusDialog
                  title={`Você tem certeza que deseja ${statusLabel.toLowerCase()} esse tipo de treino?`}
                  route={`training-types/${id}/update-status`}
                  onSuccess={() => revalidateAction('training-types')}
                  onClose={dialog.current.close}
                  currentStatus={isEnabled}
                />
              )
            }}
          >
            {isEnabled ? <SquareX className='stroke-2 size-4' /> : <SquareCheck className='stroke-2 size-4' />}
            {statusLabel}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
