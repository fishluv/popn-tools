import { useEffect, useState } from "react"
import { StringParam, useQueryParams } from "use-query-params"
import { ChartCsvRow, fetchChartScore } from "../../lib/fetchChartScore"
import MeasureData from "../../models/MeasureData"
import MeasureList from "./MeasureList"
import styles from "./ChartPage.module.scss"
import Chart from "../../models/Chart"
import { fetchChartInfo } from "../../lib/fetchChartInfo"
import SongChartDetails from "../SearchPage/SongChartDetails"
import ChartResultCard from "../SearchPage/ChartResultCard"

function parseRanOption(r: string | null | undefined) {
  if (r === undefined || r === null) {
    return "nonran"
  }

  const rNorm = r.trim().toLowerCase()
  switch (rNorm) {
    case "":
    case "n":
    case "nonran":
    case "r0":
    case "r9":
    case "l0":
    case "l9":
      return "nonran"

    case "m":
    case "mirror":
    case "r0m":
    case "r9m":
    case "l0m":
    case "l9m":
      return "mirror"

    case "r1":
    case "r2":
    case "r3":
    case "r4":
    case "r5":
    case "r6":
    case "r7":
    case "r8":
    case "r1m":
    case "r2m":
    case "r3m":
    case "r4m":
    case "r5m":
    case "r6m":
    case "r7m":
    case "r8m":
    case "l1":
    case "l2":
    case "l3":
    case "l4":
    case "l5":
    case "l6":
    case "l7":
    case "l8":
    case "l1m":
    case "l2m":
    case "l3m":
    case "l4m":
    case "l5m":
    case "l6m":
    case "l7m":
    case "l8m":
      return rNorm

    default:
      if (
        rNorm.length === 9 &&
        rNorm.split("").sort().join("") === "123456789"
      ) {
        return rNorm
      }

      console.warn(`Found invalid ran transform: ${r}. Defaulting to nonran.`)
      return "nonran"
  }
}

export default function ChartPage(
  songSlug: string | undefined,
  difficulty: "e" | "n" | "h" | "ex",
) {
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  )
  const [chartCsvRows, setChartCsvRows] = useState<ChartCsvRow[]>([])
  const [chart, setChart] = useState<Chart | undefined>(undefined)
  const [queryParams] = useQueryParams({
    r: StringParam,
  })

  const chartOptions = {
    ran: parseRanOption(queryParams.r),
  }

  useEffect(() => {
    if (!songSlug) {
      // songSlug is undefined on first render. Do not attempt fetch.
      // Note: This is why we can't use SWR. (SWR fetcher function can't no-op.)
      return
    }

    fetchChartScore({
      songSlug: String(songSlug),
      difficulty,
    })
      .then((data) => {
        setChartCsvRows(data)
        setStatus("success")
      })
      .catch((error) => {
        console.error(`Error fetching chart score: ${JSON.stringify(error)}`)
        setStatus("error")
      })

    fetchChartInfo({
      songSlug: String(songSlug),
      difficulty,
    })
      .then((chartRes) => {
        setChart(chartRes)
      })
      .catch((error) => {
        console.error(`Error fetching chart info: ${JSON.stringify(error)}`)
      })
  }, [songSlug, difficulty])

  useEffect(() => {
    const measureIndex = window.location.hash.replace("#", "") || "1"
    document
      .getElementById(`measure${measureIndex}`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" })
  })

  switch (status) {
    case "loading":
      return <div>Loading...</div>
    case "error":
      return <div>Uh oh! Something went wrong.</div>
    case "success":
      return (
        <div className={styles.ChartPage}>
          <style>{"body { background-image: none; }"}</style>

          {chart && (
            <div className={styles.header}>
              {/* TODO: open modal */}
              <ChartResultCard chart={chart} style="full" onClick={() => {}} />
            </div>
          )}

          <div className={styles.body}>
            <MeasureList
              className={styles.MeasureList}
              measureDatas={MeasureData.fromCsvRows(chartCsvRows)}
              chartOptions={chartOptions}
            />

            {chart && (
              <SongChartDetails
                className={styles.SongChartDetails}
                chart={chart}
              />
            )}
          </div>
        </div>
      )
  }
}
