import { useRef } from "react"

const useDebounce = (fn: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFunction = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  return debouncedFunction
}

export default useDebounce
