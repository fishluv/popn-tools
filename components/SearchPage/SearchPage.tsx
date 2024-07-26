import React, { useEffect, useState } from "react"
import styles from "./SearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../../lib/debounce"
import Song from "../../models/Song"
import SongChartDetails from "./SongChartDetails"
import { FiMoreHorizontal } from "react-icons/fi"
import CommonModal from "../common/CommonModal"
import ReactModal from "react-modal"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { CgNotes } from "react-icons/cg"
import cx from "classnames"
import Chart from "../../models/Chart"
import ChartSearchResultsList from "./ChartSearchResultsList"
import { StringParam, useQueryParams } from "use-query-params"
import More from "./More"

export default function SearchPage({ mode }: { mode: "song" | "chart" }) {
  const isSongMode = mode === "song"

  const [currentOpenModal, setCurrentOpenModal] = useState<
    "more" | "loading" | "songDetails" | "chartDetails" | null
  >(null)
  const [openedSong, setOpenedSong] = useState<Song | undefined>(undefined)
  const [openedChart, setOpenedChart] = useState<Chart | undefined>(undefined)

  const [queryParams, setQueryParams] = useQueryParams({
    m: StringParam,
    q: StringParam,
  })
  const { q: query } = queryParams
  const debouncedQuery = useDebounce(query, 125)

  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (currentOpenModal !== null) {
        return
      }

      const searchInput = document.getElementById("searchInput")
      if (searchInput && document.activeElement === searchInput) {
        return
      }

      const { key, repeat } = event
      if (repeat) {
        return
      }

      if (key === "s") {
        ReactModal.setAppElement("#app")
        setCurrentOpenModal("more")
      }
      if (key === "/") {
        // requestAnimationFrame is needed to delay the focus
        // so the slash doesn't get typed.
        window.requestAnimationFrame(
          () => document.getElementById("searchInput")?.focus(),
        )
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentOpenModal])

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    // Remove leading whitespace. Only one trailing space allowed.
    const sanitized = value.replace(/^\s+/, "").replace(/\s+$/, " ")
    setQueryParams({ m: mode, q: sanitized }, "replaceIn")
    setSearchValue(sanitized)
  }

  return (
    <div id="app" className={styles.SearchPage}>
      <div className={styles.top}>
        <button
          className={cx(styles.button, styles.searchModeSwitcher, styles[mode])}
          onClick={() => {
            setQueryParams({ m: isSongMode ? "chart" : "song" }, "replaceIn")
          }}
        >
          {isSongMode ? <BsMusicNoteBeamed /> : <CgNotes />}
        </button>

        <input
          id="searchInput"
          className={styles.search}
          type="text"
          placeholder={isSongMode ? "Search for songs" : "Search for charts"}
          value={searchValue || (query ?? "")}
          onChange={onInputChange}
          autoFocus
          size={1}
        />
        {/* https://stackoverflow.com/a/29990524
        size=1 is for super narrow browsers */}

        <button
          className={styles.button}
          onClick={() => {
            ReactModal.setAppElement("#app")
            setCurrentOpenModal("more")
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
            setCurrentOpenModal("songDetails")
          }}
        />
      ) : (
        <ChartSearchResultsList
          query={debouncedQuery ?? ""}
          onChartClick={(chart: Chart) => {
            ReactModal.setAppElement("#app")
            setOpenedChart(chart)
            setCurrentOpenModal("chartDetails")
          }}
        />
      )}

      <CommonModal
        isOpen={currentOpenModal !== null}
        onClose={() => setCurrentOpenModal(null)}
        showGithub={currentOpenModal === "more"}
      >
        {currentOpenModal === "more" && <More />}

        {currentOpenModal === "loading" && <span>Loading...</span>}

        {currentOpenModal === "songDetails" && openedSong && (
          <SongChartDetails
            song={openedSong}
            showHeader={true}
            showActions={true}
          />
        )}

        {currentOpenModal === "chartDetails" && openedChart && (
          <SongChartDetails
            chartToOpen={openedChart}
            showHeader={true}
            showActions={true}
          />
        )}
      </CommonModal>
    </div>
  )
}
