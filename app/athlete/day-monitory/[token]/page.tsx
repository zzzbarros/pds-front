'use client'

import Image from 'next/image'
import { startTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Angry, Frown, Annoyed, Smile, Laugh } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, toast } from '@/components/ui'
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

  const form = useForm<FormProps>({
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

  const accordion = form.watch('accordion')

  const completedAnswers = Object.values(form.getValues()).every((value) => value !== null)

  function setAnswer(key: string, value: number) {
    const currentAnswerIndex = questions.findIndex(({ value }) => value === key)
    const nextAnswerIndex = currentAnswerIndex < questions.length - 1 ? currentAnswerIndex + 1 : null
    startTransition(() => {
      form.setValue(key as keyof FormProps, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      !!nextAnswerIndex && form.setValue('accordion', questions[nextAnswerIndex].value)
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
  }

  return (
    <BaseTemplate>
      <section className='w-full flex justify-center p-3'>
        <form
          onSubmit={form.handleSubmit(submit)}
          className='w-fit border border-zinc-300 rounded-md p-8 flex flex-col items-center gap-3 md:gap-4'
        >
          <Image src='/logo.svg' alt='Training Track Logo' width={135} height={48} priority />
          <span className='text-primary-night text-xl md:text-2xl font-semibold'>Olá {name}, bom dia!</span>
          <h1 className='text-primary-night text-lg md:text-xl font-medium text-center text-balance'>
            Conte-nos como se sente hoje...
            <br /> Saber como você está é importante para o planejamento dos treinos.
          </h1>
          <Accordion
            type='single'
            value={accordion}
            onValueChange={(key) => form.setValue('accordion', key)}
            className='w-full'
          >
            {questions.map((question) => (
              <AccordionItem value={question.value} key={question.value}>
                <AccordionTrigger>{question.label}</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-2'>
                  <ul className='w-full flex gap-2 justify-between'>
                    {options.map(({ icon, label, value }) => (
                      <li className='w-full' key={value}>
                        <button
                          type='button'
                          data-active={form.watch(question.value as keyof FormProps) === value}
                          className='w-full flex justify-center gap-1 items-center border border-primary-night rounded-md py-1.5 px-2.5 font-medium text-primary-night text-sm data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:border-primary hover:bg-primary-medium data-[active=true]:hover:bg-primary-medium hover:border-primary-medium hover:text-white'
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
          <Button type='submit' className='mt-4' disabled={!completedAnswers}>
            Enviar Respostas
          </Button>
        </form>
      </section>
    </BaseTemplate>
  )
}
