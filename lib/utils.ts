import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { RouteEnum } from '@/enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(word: string): string {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function generateRandomNumber(min: number = 0, max: number = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateRandomNumbersArray(count: number = 7, min: number = 0, max: number = 1000): number[] {
  const randomNumbers: number[] = []
  for (let i = 0; i < count; i++) {
    randomNumbers.push(generateRandomNumber(min, max))
  }
  return randomNumbers
}

export function buildingRouteWithId(route: RouteEnum, id: string, childId = '') {
  return route.replace(':ID', id).replace(':CHILD_ID', childId)
}

export * from './dates'
