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
import { makeLaneTransform } from "./Measure"

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
    laneTransform: makeLaneTransform(queryParams.r),
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
