/* General utility functions (exposes cn) */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDisplayStatus(status: string | null | undefined): string {
  if (!status) return 'Pending'
  const s = status.toLowerCase()
  if (s.includes('reject')) return 'Rejected'
  if (s.includes('process') || s.includes('paid') || s.includes('complete')) return 'Completed'
  if (s.includes('approve')) return 'Approved'
  return 'Pending'
}
