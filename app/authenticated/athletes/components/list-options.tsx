'use client'

import Link from 'next/link'
import { EllipsisVertical, Pencil, SquareCheck, SquareX } from 'lucide-react'
import { useDialogContext, useDrawerContext } from '@/contexts'
import revalidateAction from '@/lib/revalidateAction'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { ConfirmStatusDialog } from '@/components/compositions'
import { buildingRouteWithId } from '@/lib/utils'
import { RouteEnum } from '@/enums'

export function AthleteListOptions({ isEnabled, id }: { id: string; isEnabled: boolean }) {
  const { dialog } = useDialogContext()
  const { drawer } = useDrawerContext()

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
          <Link href={buildingRouteWithId(RouteEnum.UPDATE_ATHLETE, id)}>
            <button className='w-full text-left flex gap-2 items-center cursor-pointer'>
              <Pencil className='stroke-2 size-4' />
              Editar
            </button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className='w-full text-left flex gap-2 items-center cursor-pointer'
            onClick={() => {
              dialog.current?.open(
                <ConfirmStatusDialog
                  title={`Você tem certeza que deseja ${statusLabel.toLowerCase()} esse atleta?`}
                  route={`athletes/${id}/update-status`}
                  onSuccess={() => revalidateAction('athletes')}
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
