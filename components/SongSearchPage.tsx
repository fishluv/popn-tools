import React, { useState } from "react"
import Modal from "react-modal"
import styles from "./SongSearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../lib/debounce"
import { SongResult } from "../lib/fetch"
import FolderPill from "./FolderPill"

Modal.setAppElement("#app")

export default function SongSearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openedSong, setOpenedSong] = useState<SongResult | undefined>(
    undefined,
  )
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
        onSongClick={(song: SongResult) => {
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
          },
        }}
      >
        <button onClick={() => setIsModalOpen(false)}>Close</button>
        {openedSong && (
          <div className={styles.songInfo}>
            <FolderPill songFolder={openedSong.folder} />
            <a
              href={`https://remywiki.com/${openedSong.remywiki_url_path}`}
              target="_blank"
            >
              {openedSong.remywiki_title}
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}
