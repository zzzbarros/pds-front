import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(word: string): string {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export * from './dates'
