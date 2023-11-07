import React, { useState } from "react"
import styles from "./SearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../../lib/debounce"
import Song from "../../models/Song"
import SongDetails from "./SongDetails"
import { FiArrowLeft, FiMoreHorizontal } from "react-icons/fi"
import CommonModal from "../CommonModal"
import ReactModal from "react-modal"
import Link from "next/link"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { CgNotes } from "react-icons/cg"
import cx from "classnames"
import Chart from "../../models/Chart"
import ChartSearchResultsList from "./ChartSearchResultsList"

type SearchMode = "song" | "chart"

export default function SearchPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("song")
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)
  const [isSongDetailModalOpen, setIsSongDetailModalOpen] = useState(false)
  const [openedSong, setOpenedSong] = useState<Song | undefined>(undefined)
  const [pendingQuery, setPendingQuery] = useState("")
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 125)

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    // Remove leading whitespace. Only one trailing space allowed.
    const sanitized = value.replace(/^\s+/, "").replace(/\s+$/, " ")
    if (sanitized !== pendingQuery) {
      setPendingQuery(sanitized)
      if (sanitized.length >= 3) {
        setQuery(sanitized)
      }
    }
  }

  return (
    <div id="app" className={styles.SearchPage}>
      <div className={styles.top}>
        {searchMode === "song" ? (
          <button
            className={cx(
              styles.button,
              styles.searchModeSwitcher,
              styles[searchMode],
            )}
            onClick={() => {
              setSearchMode("chart")
            }}
          >
            <BsMusicNoteBeamed />
          </button>
        ) : (
          <button
            className={cx(
              styles.button,
              styles.searchModeSwitcher,
              styles[searchMode],
            )}
            onClick={() => {
              setSearchMode("song")
            }}
          >
            <CgNotes />
          </button>
        )}

        <input
          className={styles.input}
          type="text"
          placeholder={
            searchMode === "song" ? "Search for songs" : "Search for charts"
          }
          value={pendingQuery}
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

      {searchMode === "song" ? (
        <SongSearchResultsList
          query={debouncedQuery}
          onSongClick={(song: Song) => {
            ReactModal.setAppElement("#app")
            setOpenedSong(song)
            setIsSongDetailModalOpen(true)
          }}
        />
      ) : (
        <ChartSearchResultsList
          query={debouncedQuery}
          onChartClick={(chart: Chart) => {
            // ReactModal.setAppElement("#app")
            // setOpenedSong(song)
            // setIsSongDetailModalOpen(true)
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
        {openedSong && <SongDetails song={openedSong} />}
      </CommonModal>
    </div>
  )
}