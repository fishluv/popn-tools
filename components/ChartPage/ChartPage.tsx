import { useEffect, useState } from "react"
import ReactModal from "react-modal"
import { BooleanParam, StringParam, useQueryParams } from "use-query-params"
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
  parseNoteSpacing,
} from "./Measure"
import CommonModal from "../common/CommonModal"
import More from "./More"
import { FiMoreHorizontal } from "react-icons/fi"

export default function ChartPage({
  songSlug,
  difficulty,
}: {
  songSlug: string | undefined
  difficulty: "e" | "n" | "h" | "ex"
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
  })
  const [currentOpenModal, setCurrentOpenModal] = useState<
    "more" | "chartDetails" | null
  >(null)
  const [openedChart, setOpenedChart] = useState<Chart | undefined>(undefined)

  const chartOptions: ChartOptions = {
    laneTransform: makeLaneTransform(queryParams.t),
  }
  const displayOptions: DisplayOptions = {
    noteSpacing: parseNoteSpacing(queryParams.hs),
    bpmAgnostic: !!queryParams.normalize,
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
  // cause a rerender of the whole app, which resets the document title to the one in _app.tsx.
  // This is a hacky workaround to set the title after that happens.
  setTimeout(() => {
    if (chart) {
      // Use the romanized title we get from the song's RemyWiki page.
      // Sometimes multiple songs share a single page so we need to disambiguate.
      // (This is the same logic we use to generate song slugs.)
      let songTitle = chart.song.remywikiTitle
      if (chart.song.genreRomanTrans.endsWith(" LIVE")) {
        songTitle = `${songTitle} LIVE`
      }
      if (chart.song.genreRomanTrans.endsWith(" LONG")) {
        songTitle = `${songTitle} LONG`
      }
      if (chart.song.labels.includes("ura")) {
        songTitle = `URA ${songTitle}`
      }
      if (chart.song.labels.includes("upper")) {
        songTitle = `${songTitle} UPPER`
      }
      // Knock Out Regrets jp version
      if (chart.song.id === 3055) {
        songTitle = `${songTitle} JP`
      }

      document.title = `${songTitle} [${chart.difficulty.toUpperCase()}] • Pop'n Tools`
    }
  }, 300) // Whole app rerender can take like 150 ms to set the document title so to be safe...

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
  }, [chartCsvRows]) // Only after initial load.

  useEffect(() => {
    const { t, hs, normalize } = queryParams

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

      if (key === "s") {
        ReactModal.setAppElement("#app")
        setCurrentOpenModal("more")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentOpenModal])

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
            showGithub={currentOpenModal === "more"}
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
