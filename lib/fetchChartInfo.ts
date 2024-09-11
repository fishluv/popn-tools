import urlJoin from "url-join"
import HttpError from "./HttpError"
import Chart from "../models/Chart"

function getSearchApiUrl(...parts: string[]) {
  return urlJoin(process.env.NEXT_PUBLIC_SEARCH_API_URL!, ...parts)
}

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
