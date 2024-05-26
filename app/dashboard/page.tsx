import { getUser } from '../auth/get-user'

export default function AuthPage() {
  const { token } = getUser()

  return (
    <section className='p-4'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>Inicio</h1>
        <h2 className='text-lg'>Seja bem vindo a Plataforma!</h2>
        <h3>Token de autenticação: {token}</h3>
      </div>
    </section>
  )
}
