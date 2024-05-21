import { getCookies } from 'next-client-cookies/server'

export default function AuthPage() {
  const cookies = getCookies()
  const user = cookies.get('user')!
  const token = JSON.parse(user).token

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
