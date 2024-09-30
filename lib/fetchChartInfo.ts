import HttpError from "./HttpError"
import Chart from "../models/Chart"
import { getSearchApiUrl } from "./urls"

export async function fetchChartInfo({
  songSlug,
  difficulty,
}: {
  songSlug: string
  difficulty: "e" | "n" | "h" | "ex"
}) {
  const url = getSearchApiUrl("/charts", songSlug, difficulty)
  const res = await fetch(url)
  const json = await res.json()

  if (!res.ok) {
    throw new HttpError(json, res.status)
  }

  return Chart.fromSearchApiChartResult(json)
}
