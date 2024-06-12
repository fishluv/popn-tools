import Papa from "papaparse"
import HttpError from "./HttpError"

export type ChartCsvRow = {
  timestamp: number
  key: number | null
  keyon: number | null
  keyoff: number | null
  measurebeatend: "m" | "b" | "e"
  bpm: number | null
}

export async function fetchChart({
  songSlug,
  difficulty,
}: {
  songSlug: string
  difficulty: "e" | "n" | "h" | "ex"
}) {
  const url = `https://popn-assets.pages.dev/sd/${songSlug}/${difficulty}.csv`
  const res = await fetch(url)
  const text = (await res.text()).trimEnd() // Ending newline will introduce parsing error

  if (!res.ok) {
    throw new HttpError(text, res.status)
  }

  const parseResult = Papa.parse<ChartCsvRow>(text, {
    header: true,
    dynamicTyping: true,
  })

  if (parseResult.errors.length) {
    throw new HttpError(parseResult.errors, res.status)
  }

  return parseResult.data
}
