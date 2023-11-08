import React, { useState } from "react"
import styles from "./SearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../../lib/debounce"
import Song from "../../models/Song"
import SongChartDetails from "./SongChartDetails"
import { FiArrowLeft, FiMoreHorizontal } from "react-icons/fi"
import CommonModal from "../CommonModal"
import ReactModal from "react-modal"
import Link from "next/link"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { CgNotes } from "react-icons/cg"
import cx from "classnames"
import Chart from "../../models/Chart"
import ChartSearchResultsList from "./ChartSearchResultsList"
import { StringParam, useQueryParams } from "use-query-params"

export default function SearchPage({ mode }: { mode: "songs" | "charts" }) {
  const isSongMode = mode === "songs"

  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)
  const [isSongDetailModalOpen, setIsSongDetailModalOpen] = useState(false)
  const [openedSong, setOpenedSong] = useState<Song | undefined>(undefined)
  const [isChartDetailModalOpen, setIsChartDetailModalOpen] = useState(false)
  const [openedChart, setOpenedChart] = useState<Chart | undefined>(undefined)

  const [queryParams, setQueryParams] = useQueryParams({
    m: StringParam,
    q: StringParam,
  })
  const { q: query } = queryParams
  const debouncedQuery = useDebounce(query, 125)

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    // Remove leading whitespace. Only one trailing space allowed.
    const sanitized = value.replace(/^\s+/, "").replace(/\s+$/, " ")
    setQueryParams({ q: sanitized }, "replaceIn")
  }

  return (
    <div id="app" className={styles.SearchPage}>
      <div className={styles.top}>
        {isSongMode ? (
          <button
            className={cx(styles.button, styles.searchModeSwitcher)}
            onClick={() => {
              setQueryParams({ m: "charts" }, "replaceIn")
            }}
          >
            <BsMusicNoteBeamed />
          </button>
        ) : (
          <button
            className={cx(styles.button, styles.searchModeSwitcher)}
            onClick={() => {
              setQueryParams({ m: "songs" }, "replaceIn")
            }}
          >
            <CgNotes />
          </button>
        )}

        <input
          className={styles.input}
          type="text"
          placeholder={isSongMode ? "Search for songs" : "Search for charts"}
          value={query ?? ""}
          onChange={onInputChange}
          autoFocus
        />

        <button
          className={styles.button}
          onClick={() => {
            ReactModal.setAppElement("#app")
            setIsOptionsModalOpen(true)
          }}
        >
          <FiMoreHorizontal />
        </button>
      </div>

      {isSongMode ? (
        <SongSearchResultsList
          query={debouncedQuery ?? ""}
          onSongClick={(song: Song) => {
            ReactModal.setAppElement("#app")
            setOpenedSong(song)
            setIsSongDetailModalOpen(true)
          }}
        />
      ) : (
        <ChartSearchResultsList
          query={debouncedQuery ?? ""}
          onChartClick={(chart: Chart) => {
            ReactModal.setAppElement("#app")
            setOpenedChart(chart)
            setIsChartDetailModalOpen(true)
          }}
        />
      )}

      <CommonModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
      >
        <Link href="/">
          <FiArrowLeft /> {"Back to Pop'n Tools"}
        </Link>
      </CommonModal>

      <CommonModal
        isOpen={isSongDetailModalOpen}
        onClose={() => setIsSongDetailModalOpen(false)}
      >
        {openedSong && <SongChartDetails song={openedSong} />}
      </CommonModal>

      <CommonModal
        isOpen={isChartDetailModalOpen}
        onClose={() => setIsChartDetailModalOpen(false)}
      >
        {openedChart && <SongChartDetails chart={openedChart} />}
      </CommonModal>
    </div>
  )
}
