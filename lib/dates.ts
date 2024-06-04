export function getCurrentWeekDates(): Date[] {
  const currentDate = new Date()
  const currentDayOfWeek = currentDate.getDay() // 0 (Sunday) to 6 (Saturday)

  // Start from Sunday
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek)

  const weekDates: Date[] = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDates.push(date)
  }

  return weekDates
}

export function getWeekDatesFromInput(weekString: string): Date[] {
  const [year, week] = weekString.split('-W').map(Number)

  // Cria um objeto Date para o primeiro dia do ano
  const firstDayOfYear = new Date(year, 0, 1)

  // Calcula o dia da semana do primeiro dia do ano (0 = domingo, 1 = segunda-feira, etc.)
  const dayOfWeekFirstDayOfYear = firstDayOfYear.getDay()

  // Calcula a data do primeiro domingo do ano
  const startOfFirstWeek = new Date(firstDayOfYear)
  startOfFirstWeek.setDate(firstDayOfYear.getDate() - dayOfWeekFirstDayOfYear)

  // Calcula o início da semana fornecida
  const startOfWeek = new Date(startOfFirstWeek)
  startOfWeek.setDate(startOfFirstWeek.getDate() + (week - 1) * 7)

  // Gera as datas da semana (de domingo a sábado)
  const weekDates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDates.push(date)
  }

  return weekDates
}

export function getWeekNumberFromDate(date: Date): string {
  const currentDate = new Date(date.getTime())

  // Define que a semana começa na segunda-feira e o primeiro dia do ano é 4 de janeiro (ISO-8601)
  currentDate.setHours(0, 0, 0, 0)
  currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7))

  // Calcula o início do ano
  const startOfYear = new Date(currentDate.getFullYear(), 0, 4)

  // Calcula o número da semana
  const weekNumber = Math.ceil(((currentDate.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7)

  // Formata o número da semana para o formato "YYYY-Www"
  const year = currentDate.getFullYear()
  const week = weekNumber < 10 ? '0' + weekNumber : weekNumber.toString()

  return `${year}-W${week}`
}

export function compareDates(date1: Date, date2: Date): boolean {
  const year1 = date1.getFullYear()
  const month1 = date1.getMonth()
  const day1 = date1.getDate()

  const year2 = date2.getFullYear()
  const month2 = date2.getMonth()
  const day2 = date2.getDate()

  return year1 === year2 && month1 === month2 && day1 === day2
}

export function getPreviousWeek(weekString: string): string {
  const [year, week] = weekString.split('-W').map(Number)

  // Se a semana for a primeira do ano, retorna a última semana do ano anterior
  if (week === 1) {
    const previousYear = year - 1
    return `${previousYear}-W${getWeeksInYear(previousYear)}`
  }

  // Caso contrário, retorna a semana anterior no mesmo ano
  const previousWeek = week - 1
  return `${year}-W${previousWeek < 10 ? '0' + previousWeek : previousWeek}`
}

export function getNextWeek(weekString: string): string {
  const [year, week] = weekString.split('-W').map(Number)
  const weeksInYear = getWeeksInYear(year)

  // Se a semana for a última do ano, retorna a primeira semana do próximo ano
  if (week === weeksInYear) {
    const nextYear = year + 1
    return `${nextYear}-W01`
  }

  // Caso contrário, retorna a próxima semana no mesmo ano
  const nextWeek = week + 1
  return `${year}-W${nextWeek < 10 ? '0' + nextWeek : nextWeek}`
}

function getWeeksInYear(year: number): number {
  // Calcula o número de semanas em um ano
  const januaryFirst = new Date(year, 0, 1)
  const decemberThirtyFirst = new Date(year, 11, 31)
  const daysDifference = (decemberThirtyFirst.getTime() - januaryFirst.getTime()) / (1000 * 60 * 60 * 24)
  return Math.ceil((daysDifference + januaryFirst.getDay() + 1) / 7)
}
