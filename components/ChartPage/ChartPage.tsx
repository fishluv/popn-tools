import { useEffect, useState } from "react"
import ReactModal from "react-modal"
import { StringParam, useQueryParams } from "use-query-params"
import { ChartCsvRow, fetchChartScore } from "../../lib/fetchChartScore"
import MeasureData from "../../models/MeasureData"
import MeasureList from "./MeasureList"
import styles from "./ChartPage.module.scss"
import Chart from "../../models/Chart"
import { fetchChartInfo } from "../../lib/fetchChartInfo"
import SongChartDetails from "../SearchPage/SongChartDetails"
import ChartResultCard from "../SearchPage/ChartResultCard"
import {
  ChartOptions,
  DisplayOptions,
  isValidTransformStr,
  makeLaneTransform,
} from "./Measure"
import CommonModal from "../common/CommonModal"
import More from "./More"
import { FiMoreHorizontal } from "react-icons/fi"

export default function ChartPage(
  songSlug: string | undefined,
  difficulty: "e" | "n" | "h" | "ex",
) {
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  )
  const [chartCsvRows, setChartCsvRows] = useState<ChartCsvRow[]>([])
  const [chart, setChart] = useState<Chart | undefined>(undefined)
  const [queryParams, setQueryParams] = useQueryParams({
    r: StringParam,
  })
  const [currentOpenModal, setCurrentOpenModal] = useState<
    "more" | "chartDetails" | null
  >(null)
  const [openedChart, setOpenedChart] = useState<Chart | undefined>(undefined)

  const chartOptions: ChartOptions = {
    laneTransform: makeLaneTransform(queryParams.r),
  }
  const displayOptions: DisplayOptions = {
    noteSpacing: "default",
    bpmAgnostic: false,
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
  }, [chartCsvRows]) // Only after initial load.

  useEffect(() => {
    const r = queryParams.r

    if (r === undefined || r === null) {
      return
    }

    if (["", "r0", "r9", "l0", "l9"].includes(r.toLowerCase())) {
      setQueryParams({ r: undefined })
    }

    if (["r0m", "r9m", "l0m", "l9m"].includes(r.toLowerCase())) {
      setQueryParams({ r: "mirror" })
    }

    if (!isValidTransformStr(r)) {
      setQueryParams({ r: undefined })
    }
  }, [queryParams, setQueryParams])

  switch (status) {
    case "loading":
      return <div>Loading...</div>
    case "error":
      return <div>Uh oh! Something went wrong.</div>
    case "success":
      return (
        <div id="app" className={styles.ChartPage}>
          <style>{"body { background-image: none; }"}</style>

          {chart && (
            <div className={styles.mobileOnlyHeader}>
              <ChartResultCard
                chart={chart}
                style="full"
                onClick={() => {
                  ReactModal.setAppElement("#app")
                  setOpenedChart(chart)
                  setCurrentOpenModal("chartDetails")
                }}
              />
            </div>
          )}

          <button
            className={styles.moreButton}
            onClick={() => {
              ReactModal.setAppElement("#app")
              setCurrentOpenModal("more")
            }}
          >
            <FiMoreHorizontal />
          </button>

          <div className={styles.body}>
            <MeasureList
              className={styles.MeasureList}
              measureDatas={MeasureData.fromCsvRows(chartCsvRows)}
              chartOptions={chartOptions}
              displayOptions={displayOptions}
            />

            {chart && (
              <SongChartDetails
                className={styles.desktopOnlyDetails}
                chart={chart}
                showHeader={false}
                showViewChartLink={false}
              />
            )}
          </div>

          <CommonModal
            isOpen={currentOpenModal !== null}
            onClose={() => setCurrentOpenModal(null)}
          >
            {currentOpenModal === "more" && <More />}

            {currentOpenModal === "chartDetails" && openedChart && (
              <SongChartDetails
                chart={openedChart}
                showHeader={true}
                showViewChartLink={false}
              />
            )}
          </CommonModal>
        </div>
      )
  }
}
