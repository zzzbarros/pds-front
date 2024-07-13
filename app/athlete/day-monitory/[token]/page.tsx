'use client'

import { startTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Angry, Frown, Annoyed, Smile, Laugh, CircleCheck, Send } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Logo, toast } from '@/components/ui'
import { BaseTemplate } from '@/components/templates'
import { clientFetcher } from '@/services'
import type { PageProps } from '@/types'

const questionsSchema = z.coerce
  .number()
  .or(z.null().default(null))
  .refine((value) => value !== null, { message: 'Pergunta obrigatória' })

const schema = z
  .object({
    sleep: questionsSchema,
    disposition: questionsSchema,
    musclePain: questionsSchema,
    stress: questionsSchema,
    humor: questionsSchema,
    accordion: z.string(),
  })
  .transform(({ accordion, ...data }) => data)

type FormProps = z.input<typeof schema>

const options = [
  { icon: <Angry />, value: 1, label: 'Péssima' },
  { icon: <Frown />, value: 2, label: 'Ruim' },
  { icon: <Annoyed />, value: 3, label: 'Normal' },
  { icon: <Smile />, value: 4, label: 'Boa' },
  { icon: <Laugh />, value: 5, label: 'Ótima' },
]

const questions = [
  { value: 'sleep', label: 'Como foi sua noite de sono?' },
  { value: 'disposition', label: 'Como está a sua disposição?' },
  { value: 'musclePain', label: 'Como está a sua dor muscular?' },
  { value: 'stress', label: 'Como está o seu nível de stress?' },
  { value: 'humor', label: 'Como está seu humor?' },
]

export default function AthleteDayMonitoryPage({ params, searchParams }: PageProps) {
  const { token } = params
  const { name = 'atleta' } = searchParams

  const {
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      accordion: questions[0].value,
      disposition: null,
      humor: null,
      musclePain: null,
      sleep: null,
      stress: null,
    },
  })

  const accordion = watch('accordion')

  const completedAnswers = Object.values(getValues()).every((value) => value !== null)

  function setAnswer(key: string, value: number) {
    const currentAnswerIndex = questions.findIndex(({ value }) => value === key)
    const nextAnswerIndex = currentAnswerIndex < questions.length - 1 ? currentAnswerIndex + 1 : null
    startTransition(() => {
      setValue(key as keyof FormProps, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      !!nextAnswerIndex && setValue('accordion', questions[nextAnswerIndex].value)
    })
  }

  async function submit(data: FormProps) {
    const response = await clientFetcher('monitoring/well-being', {
      method: 'POST',
      body: JSON.stringify({ ...data, token }),
    })
    toast({
      title: response?.data?.title,
      description: response?.data?.message,
      variant: response.ok ? 'success' : 'destructive',
    })
    if (!response.ok) throw response
  }

  if (isSubmitSuccessful) {
    return (
      <BaseTemplate>
        <section className='w-full flex justify-center items-center p-3'>
          <div
            onSubmit={handleSubmit(submit)}
            className='w-fit border border-zinc-300 rounded-md p-8 flex flex-col items-center gap-4 md:gap-3 h-fit text-center text-balance'
          >
            <span className='hidden xl:inline'>
              <Logo />
            </span>
            <span className='text-primary-night text-xl md:text-2xl font-semibold'>
              Bem-estar enviado com sucesso, {name}!
            </span>
            <h1 className='text-primary-night text-lg md:text-xl font-medium'>
              Obrigado nos informar como você está se sentindo hoje,
              <br /> as informações serão importantes para o planejamento dos próximos treinos.
            </h1>
            <CircleCheck size={80} className='text-primary-medium' />
          </div>
        </section>
      </BaseTemplate>
    )
  }

  return (
    <BaseTemplate>
      <section className='w-full flex justify-center p-3'>
        <form
          onSubmit={handleSubmit(submit)}
          className='w-fit border border-zinc-300 rounded-md p-8 flex flex-col items-center gap-4 md:gap-4'
        >
          <span className='hidden xl:inline'>
            <Logo />
          </span>
          <span className='text-primary-night text-xl md:text-2xl font-semibold'>Olá {name}, bom dia!</span>
          <h1 className='text-primary-night text-lg md:text-xl font-medium text-center text-balance'>
            Conte-nos como se sente hoje...
            <br /> Saber como você está é importante para o planejamento dos treinos.
          </h1>
          <Accordion
            type='single'
            value={accordion}
            onValueChange={(key) => setValue('accordion', key)}
            className='w-full'
          >
            {questions.map((question) => (
              <AccordionItem value={question.value} key={question.value}>
                <AccordionTrigger>{question.label}</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-2'>
                  <ul className='w-full flex flex-col md:flex-row gap-2 justify-between'>
                    {options.map(({ icon, label, value }) => (
                      <li className='w-full' key={value}>
                        <button
                          type='button'
                          data-active={watch(question.value as keyof FormProps) === value}
                          className='w-full flex md:justify-center gap-1 items-center border border-primary-night rounded-md py-3 md:py-1.5 px-4 md:px-2.5 font-medium text-primary-night text-lg md:text-sm data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:border-primary hover:bg-primary-medium data-[active=true]:hover:bg-primary-medium hover:border-primary-medium hover:text-white'
                          onClick={() => setAnswer(question.value, value)}
                        >
                          {icon}
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button isLoading={isSubmitting} type='submit' className='mt-4' disabled={!completedAnswers}>
            {!isSubmitting && <Send />}
            Enviar Respostas
          </Button>
        </form>
      </section>
    </BaseTemplate>
  )
}
