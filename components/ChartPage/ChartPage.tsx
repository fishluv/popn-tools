import { useEffect, useState } from "react"
import { ChartCsvRow, fetchChart } from "../../lib/fetchChart"

export default function ChartPage(
  songSlug: string | undefined,
  difficulty: "e" | "n" | "h" | "ex",
) {
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  )
  const [chartCsvRows, setChartCsvRows] = useState<ChartCsvRow[]>([])

  useEffect(() => {
    if (!songSlug) {
      // songSlug is undefined on first render. Do not attempt fetch.
      // Note: This is why we can't use SWR. (SWR fetcher function can't no-op.)
      return
    }

    fetchChart({
      songSlug: String(songSlug),
      difficulty,
    })
      .then((data) => {
        setChartCsvRows(data)
        setStatus("success")
      })
      .catch((error) => {
        console.error(`Error fetching chart data: ${JSON.stringify(error)}`)
        setStatus("error")
      })
  }, [songSlug, difficulty])

  switch (status) {
    case "loading":
      return <div>Loading...</div>
    case "error":
      return <div>Uh oh! Something went wrong.</div>
    case "success":
      return (
        <div>
          {chartCsvRows &&
            chartCsvRows.map((row, index) => (
              <div key={index}>{JSON.stringify(row)}</div>
            ))}
        </div>
      )
  }
}
