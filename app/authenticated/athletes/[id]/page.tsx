import { redirect } from 'next/navigation'

interface Props {
  params: Record<string, string>
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AthleteDetails({ params }: Props) {
  redirect(`/authenticated/athletes/${params.id}/monitoring`)
}
