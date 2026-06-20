import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return readStorage(key, initialValue)
  })

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
