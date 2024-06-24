import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  TableCaption,
} from '@/components/ui'
import { serverFetcher } from '@/services'
import { PackageOpen } from 'lucide-react'

interface TrainingTypesProps {
  id: string
  name: string
  isEnabled: boolean
}

interface Props {
  page: string
  search: string
}

export default async function List({ page, search }: Props) {
  const response = await serverFetcher(`training-types?page=${page}&search=${search}`, {
    method: 'GET',
    next: { tags: ['training-types'] },
  })

  const trainingTypes: TrainingTypesProps[] = response?.data?.data ?? []

  return (
    <>
      <div className='rounded-md border mt-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo do Treino</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!trainingTypes?.length &&
              trainingTypes.map(({ id, name, isEnabled }) => (
                <TableRow key={id}>
                  <TableCell href={`/authenticated/training-types/${id}`}>{name}</TableCell>
                  <TableCell href={`/authenticated/training-types/${id}`}>{isEnabled ? 'Ativo' : 'Inativo'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          {!trainingTypes?.length && (
            <TableCaption className='py-2 pb-6 text-primary-medium font-medium'>
              <PackageOpen size={64} strokeWidth={1} />
              {search ? 'Não encontramos nenhum Tipo de Treino com esse filtro...' : 'A lista está vazia...'}
              <br />
              {!search && 'Experimente cadastrar um novo Tipo de Treino!'}
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
