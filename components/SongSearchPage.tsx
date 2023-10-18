import React, { useState } from "react"
import Modal from "react-modal"
import styles from "./SongSearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../lib/debounce"
import FolderPill from "./FolderPill"
import Song from "../models/Song"
import SongBanner from "./SongBanner"
import SongLevelPills from "./SongLevelPills"

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
            padding: "0",
            overflow: "visible",
          },
        }}
      >
        <div className={styles.modal}>
          <button
            className={styles.closeButton}
            onClick={() => setIsModalOpen(false)}
          >
            ❌
          </button>
          {openedSong && (
            <div className={styles.songInfo}>
              <SongBanner className={styles.banner} songId={openedSong.id} />
              <div className={styles.folder}>
                <FolderPill folder={openedSong.folder} style="full" />
              </div>
              <div className={styles.levels}>
                <SongLevelPills song={openedSong} style="compact" />
              </div>
              <a
                href={`https://remywiki.com/${openedSong.remywikiUrlPath}`}
                target="_blank"
              >
                {openedSong.title}
              </a>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
