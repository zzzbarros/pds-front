import { PackageOpen, SquareCheck, SquareX } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  TableCaption,
  TableCell,
  TableTd,
} from '@/components/ui'
import { serverFetcher } from '@/services'
import { AthleteListOptions } from './components'

interface AthleteProps {
  id: string
  name: string
  email: string
  isEnabled: boolean
}

interface Props {
  page: string
  search: string
}

export default async function List({ page, search }: Props) {
  const response = await serverFetcher(`athletes?page=${page}&search=${search}`, {
    method: 'GET',
    next: { tags: ['athletes'] },
  })

  const athletes: AthleteProps[] = response?.data?.data ?? []

  const athleteDetailsRoute = (id: string) => `/authenticated/athletes/${id}/monitoring`

  return (
    <>
      <div className='rounded-md border mt-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do atleta</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-full flex justify-end items-center'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!athletes?.length &&
              athletes.map(({ id, name, email, isEnabled }) => (
                <TableRow key={id}>
                  <TableCell href={athleteDetailsRoute(id)}>{name}</TableCell>
                  <TableCell href={athleteDetailsRoute(id)}>{email}</TableCell>
                  <TableCell href={athleteDetailsRoute(id)}>
                    <div className='flex gap-2 items-center min-w-24'>
                      {isEnabled ? (
                        <SquareCheck className='stroke-2 size-4' />
                      ) : (
                        <SquareX className='stroke-2 size-4' />
                      )}
                      {isEnabled ? 'Ativo' : 'Inativo'}
                    </div>
                  </TableCell>
                  <TableTd className='flex justify-end w-full'>
                    <AthleteListOptions {...{ isEnabled, id }} />
                  </TableTd>
                </TableRow>
              ))}
          </TableBody>
          {!athletes?.length && (
            <TableCaption className='py-2 pb-6 text-primary-medium font-medium'>
              <PackageOpen size={64} strokeWidth={1} />
              {search ? 'Não encontramos nenhum atleta com esse filtro...' : 'A lista está vazia...'}
              <br />
              {!search && 'Experimente cadastrar um novo atleta!'}
            </TableCaption>
          )}
        </Table>
      </div>
      <Pagination
        page={Number(page)}
        lastPage={response?.data?.lastPage}
        total={response?.data?.total}
        className='mt-6 justify-end'
      />
    </>
  )
}
