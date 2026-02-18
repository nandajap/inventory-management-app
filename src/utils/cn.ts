/**
 * cn - Class Name Utility
 * 
 * Combines multiple class names into a single string
 * Handles conditional classes cleanly
 * 
 * Examples:
 * cn('px-4', 'py-2') → 'px-4 py-2'
 * cn('px-4', isActive && 'bg-blue-500') → 'px-4 bg-blue-500' (if isActive is true)
 * cn('px-4', isActive ? 'bg-blue-500' : 'bg-gray-200') → conditional classes
 */

type ClassValue = string | number | boolean | undefined | null

/**
 * Combines class names, filtering out falsy values
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .filter(Boolean) // Remove false, null, undefined
    .join(' ')       // Join with spaces
}