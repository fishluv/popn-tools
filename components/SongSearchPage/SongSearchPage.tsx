import React, { useState } from "react"
import styles from "./SongSearchPage.module.scss"
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

type SearchMode = "song" | "chart"

export default function SongSearchPage() {
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
    <div id="app" className={styles.SongSearchPage}>
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
          placeholder="Search for songs"
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

      <SongSearchResultsList
        query={debouncedQuery}
        onSongClick={(song: Song) => {
          ReactModal.setAppElement("#app")
          setOpenedSong(song)
          setIsSongDetailModalOpen(true)
        }}
      />

      <CommonModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
      >
        <Link href="..">
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
