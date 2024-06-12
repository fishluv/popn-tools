import { useRouter } from "next/router"
import { ChartCsvRow, fetchChart } from "../../../lib/fetchChart"
import { useEffect, useState } from "react"

export default function ExHandler() {
  const {
    query: { songSlug },
    isReady,
  } = useRouter()

  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  )
  const [chartCsvRows, setChartCsvRows] = useState<ChartCsvRow[]>([])

  useEffect(() => {
    if (!isReady) {
      // songSlug is undefined on first render. Do not attempt fetch.
      // Note: This is why we can't use SWR. (SWR fetcher function can't no-op.)
      return
    }

    fetchChart({
      songSlug: String(songSlug),
      difficulty: "ex",
    })
      .then((data) => {
        setChartCsvRows(data)
        setStatus("success")
      })
      .catch((error) => {
        console.error(`Error fetching chart data: ${JSON.stringify(error)}`)
        setStatus("error")
      })
  }, [isReady, songSlug])

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
