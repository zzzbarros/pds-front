import { AthleteForm, athleteSchema, type IAthleteFormProps } from './form'

export const AthleteTemplate = Object.assign({}, { Form: AthleteForm, schema: athleteSchema })

export type { IAthleteFormProps }
