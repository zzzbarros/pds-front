import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  TableCaption,
  TableCell,
} from '@/components/ui'
import { serverFetcher } from '@/services'
import { PackageOpen } from 'lucide-react'

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

  const athleteDetailsRoute = (id: string) => `/dashboard/athletes/${id}`

  return (
    <>
      <div className='rounded-md border mt-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do atleta</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!athletes?.length &&
              athletes.map(({ id, name, email, isEnabled }) => (
                <TableRow key={id}>
                  <TableCell href={athleteDetailsRoute(id)}>{name}</TableCell>
                  <TableCell href={athleteDetailsRoute(id)}>{email}</TableCell>
                  <TableCell href={athleteDetailsRoute(id)}>{isEnabled ? 'Ativo' : 'Inativo'}</TableCell>
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
