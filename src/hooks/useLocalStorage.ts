"use client"

import { useEffect, useState } from "react"

const useLocalStorage = <T>({
  key,
  initialValue,
  storageObject = "localStorage",
}: {
  key: string
  initialValue: T
  storageObject?: "localStorage" | "sessionStorage"
}): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    setStoredValue(() => {
      try {
        const item = window[storageObject].getItem(key)
        return item ? JSON.parse(item) : initialValue
      } catch (error) {
        console.error(error)
        return initialValue
      }
    })
  }, [])

  const setValue = (newValue: T | ((newValue: T) => T)) => {
    try {
      const valueToStore =
        newValue instanceof Function ? newValue(storedValue) : newValue

      setStoredValue(valueToStore)

      window[storageObject].setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export { useLocalStorage }
