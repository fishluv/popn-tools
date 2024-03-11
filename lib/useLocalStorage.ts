import { useState, useEffect, Dispatch, SetStateAction } from "react"

// https://designcode.io/react-hooks-handbook-uselocalstorage-hook
export default function useLocalStorage(
  key: string,
  defaultValue: string,
): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState<string>(
    () => localStorage.getItem(key) || defaultValue,
  )

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}
