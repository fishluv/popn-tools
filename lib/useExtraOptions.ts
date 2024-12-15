import useLocalStorage from "./useLocalStorage"

export function parseExtraOptions(extraOptionsStr: string) {
  const extraOptions: Record<string, boolean> = {}

  extraOptionsStr.split(",").forEach((opt) => {
    if (opt.trim()) {
      extraOptions[opt.trim()] = true
    }
  })

  return extraOptions
}

export default function useExtraOptions() {
  const [extraOptionsStr] = useLocalStorage("extraOptions", "")
  return parseExtraOptions(extraOptionsStr)
}
