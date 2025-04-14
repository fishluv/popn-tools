import { useEffect, useState } from "react"
import ReactModal from "react-modal"
import { BooleanParam, StringParam, useQueryParams } from "use-query-params"
import { ChartCsvRow, fetchChartScore } from "../../lib/fetchChartScore"
import MeasureData from "../../models/MeasureData"
import MeasureList from "./MeasureList"
import styles from "./ChartPage.module.scss"
import Chart from "../../models/Chart"
import { fetchChartInfo } from "../../lib/fetchChartInfo"
import SongChartDetails from "../common/SongChartDetails"
import ChartResultCard from "../common/ChartResultCard"
import {
  ChartOptions,
  DisplayOptions,
  isValidTransformStr,
  makeLaneTransform,
  parseNoteColoring,
  parseNoteSpacing,
} from "./Measure"
import CommonModal from "../common/CommonModal"
import ChartPageMore from "./ChartPageMore"
import { CgSearch } from "react-icons/cg"
import { FiMoreHorizontal } from "react-icons/fi"
import Difficulty from "../../models/Difficulty"
import { ChartPageSearch } from "./ChartPageSearch"
import { parseExtraOptions } from "../../lib/useExtraOptions"
import ChartCsvEditor from "./ChartCsvEditor"

export default function ChartPage({
  songSlug,
  difficulty,
}: {
  songSlug: string | undefined
  difficulty: Difficulty
}) {
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  )
  const [chartCsvRows, setChartCsvRows] = useState<ChartCsvRow[]>([])
  const [chart, setChart] = useState<Chart | undefined>(undefined)
  const [queryParams, setQueryParams] = useQueryParams({
    hs: StringParam, // Hi-speed
    normalize: BooleanParam,
    t: StringParam, // Transform
    color: StringParam, // Note coloring
  })
  const [currentOpenModal, setCurrentOpenModal] = useState<
    "search" | "more" | "chartDetails" | null
  >(null)
  const [openedChart, setOpenedChart] = useState<Chart | undefined>(undefined)

  // Need this workaround because page components are generated server-side.
  const [extraOptions, setExtraOptions] = useState<Record<string, boolean>>({})
  useEffect(() => {
    setExtraOptions(
      parseExtraOptions(localStorage.getItem("extraOptions") || ""),
    )
  }, [])

  const chartOptions: ChartOptions = {
    laneTransform: makeLaneTransform(queryParams.t),
  }
  const displayOptions: DisplayOptions = {
    noteSpacing: parseNoteSpacing(queryParams.hs),
    bpmAgnostic: !!queryParams.normalize,
    noteColoring: parseNoteColoring(queryParams.color),
    chartEditingMode: !!extraOptions["charteditor"],
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

  // https://github.com/vercel/next.js/issues/34729
  // This SHOULD be a useEffect, but hash changes (caused by applying new options)
  // cause a rerender of the whole app, which resets the document title
  // to the generic one in pages/chart/[songSlug]/index.tsx.
  // This is a hacky workaround to set the title after that happens.
  setTimeout(() => {
    if (chart && document.title.startsWith("Chart Viewer")) {
      document.title = `${
        chart.song!.romanTitle
      } [${chart.difficulty.toUpperCase()}] • Pop'n Tools`
    }
  }, 500) // Whole app rerender can take like 300 ms to set the document title so to be safe...

  useEffect(() => {
    function scrollToMeasure() {
      const measureIndex = window.location.hash.replace("#", "") || "1"
      document
        .getElementById(`measure${measureIndex}`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" })
    }
    // Use requestAnimationFrame to try to prevent race condition.
    // ...Doesn't always work though.
    window.requestAnimationFrame(scrollToMeasure)

    window.addEventListener("hashchange", scrollToMeasure)
    return () => window.removeEventListener("hashchange", scrollToMeasure)
  }, [status]) // Only after initial load.

  useEffect(() => {
    const { t, hs, normalize, color } = queryParams

    if (t !== undefined && t !== null) {
      if (["", "r0", "r9", "l0", "l9"].includes(t.toLowerCase())) {
        setQueryParams({ t: undefined })
      }

      if (["r0m", "r9m", "l0m", "l9m"].includes(t.toLowerCase())) {
        setQueryParams({ t: "mirror" })
      }

      if (!isValidTransformStr(t)) {
        setQueryParams({ t: undefined })
      }
    }

    const hsNorm = parseNoteSpacing(hs)
    if (hsNorm === "default") {
      setQueryParams({ hs: undefined })
    }

    if (!normalize) {
      setQueryParams({ normalize: undefined })
    }

    if (color === "normal") {
      setQueryParams({ color: undefined })
    }
  }, [queryParams, setQueryParams])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const { key, repeat } = event
      if (repeat) {
        return
      }

      // If modal is open, it should handle its own keyboard shortcuts.
      if (currentOpenModal !== null) {
        return
      }

      if (key === "q") {
        ReactModal.setAppElement("#app")
        // Delay open to prevent `q` from getting into autofocused search input.
        window.requestAnimationFrame(() => {
          setCurrentOpenModal("search")
        })
        return false
      }

      if (key === "s") {
        ReactModal.setAppElement("#app")
        setCurrentOpenModal("more")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentOpenModal])

  useEffect(() => {
    function handleUnload(event: BeforeUnloadEvent) {
      if (extraOptions["charteditor"]) {
        event.preventDefault()
      }
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [extraOptions])

  switch (status) {
    case "loading":
      return <div>Loading...</div>
    case "error":
      return <div>Uh oh! Something went wrong.</div>
    case "success":
      return (
        <div id="app" className={styles.ChartPage}>
          <style>{"body { background-image: none; }"}</style>

          <button
            className={styles.searchButton}
            onClick={() => {
              ReactModal.setAppElement("#app")
              setCurrentOpenModal("search")
            }}
          >
            <CgSearch />
          </button>

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
                chartToOpen={chart}
                showHeader={false}
                showActions={false}
                showOtherCharts={true}
              />
            )}

            {extraOptions["charteditor"] && chartCsvRows.length && (
              <ChartCsvEditor
                rows={chartCsvRows}
                setRows={(newRows: ChartCsvRow[]) => setChartCsvRows(newRows)}
                scrollToMeasure={(measureIndex) => {
                  document
                    .getElementById(`measure${measureIndex}`)
                    ?.scrollIntoView({ block: "start", behavior: "smooth" })
                }}
              />
            )}
          </div>

          <CommonModal
            isOpen={currentOpenModal !== null}
            onClose={() => setCurrentOpenModal(null)}
            showGithub={currentOpenModal === "more"}
          >
            {currentOpenModal === "search" && <ChartPageSearch />}

            {currentOpenModal === "more" && <ChartPageMore />}

            {currentOpenModal === "chartDetails" && openedChart && (
              <SongChartDetails
                chartToOpen={openedChart}
                showHeader={true}
                showActions={false}
                showOtherCharts={true}
              />
            )}
          </CommonModal>
        </div>
      )
  }
}
