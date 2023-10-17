import React, { useState } from "react"
import Modal from "react-modal"
import styles from "./SongSearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../lib/debounce"
import FolderPill from "./FolderPill"
import Song from "../models/Song"

Modal.setAppElement("#app")

export default function SongSearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      <input
        className={styles.input}
        type="text"
        placeholder="🎵 Search for songs"
        value={pendingQuery}
        onChange={onInputChange}
      />

      <SongSearchResultsList
        query={debouncedQuery}
        onSongClick={(song: Song) => {
          setOpenedSong(song)
          setIsModalOpen(true)
        }}
      />

      <Modal
        isOpen={isModalOpen}
        contentLabel="Song info modal"
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: { zIndex: 10 },
          content: {
            width: "320px",
            height: "480px",
            left: "calc(50% - 160px)",
            top: "10%",
            padding: "1rem",
            overflow: "visible",
          },
        }}
      >
        <button
          className={styles.modalCloseButton}
          onClick={() => setIsModalOpen(false)}
        >
          ❌
        </button>
        {openedSong && (
          <div className={styles.songInfo}>
            <FolderPill folder={openedSong.folder} style="full" />
            <a
              href={`https://remywiki.com/${openedSong.remywikiUrlPath}`}
              target="_blank"
            >
              {openedSong.title}
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}
