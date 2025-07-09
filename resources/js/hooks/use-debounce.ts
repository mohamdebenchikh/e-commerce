"use client"

import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Only set a new timeout if the value changes
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clear timeout on cleanup
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
