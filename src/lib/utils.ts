import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDataFromLocalStorage = <T>(key: string): T | null => {
  const data = localStorage.getItem(key)
  try {
    return data ? (JSON.parse(data) as T) : null
  } catch (e) {
    console.error("Failed to parse data from localStorage", e)
    return null
  }
}

export const saveDataToLocalStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error("Failed to save data to localStorage", e)
  }
}
