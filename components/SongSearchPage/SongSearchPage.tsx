import React, { useState } from "react"
import styles from "./SongSearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../../lib/debounce"
import Song from "../../models/Song"
import SongDetails from "./SongDetails"
import { FiMoreHorizontal } from "react-icons/fi"
import CommonModal from "../CommonModal"
import ReactModal from "react-modal"

export default function SongSearchPage() {
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
        {/* <button className={styles.button} onClick={() => router.push("..")}>
          ↩️
        </button> */}

        <input
          className={styles.input}
          type="text"
          placeholder="Search for songs"
          value={pendingQuery}
          onChange={onInputChange}
          autoFocus
        />

        <span className={styles.musicalNote}>🎵</span>

        <button className={styles.button}>
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
        isOpen={isSongDetailModalOpen}
        onClose={() => setIsSongDetailModalOpen(false)}
      >
        {openedSong && <SongDetails song={openedSong} />}
      </CommonModal>
    </div>
  )
}
