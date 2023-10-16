import React, { useState } from "react"
import Modal from "react-modal"
import styles from "./SongSearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../lib/debounce"

Modal.setAppElement("#app")

export default function SongSearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
        onSongClick={() => setIsModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        contentLabel="Song info modal"
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: { zIndex: 10 },
          content: { inset: "6rem 2rem", padding: "1rem" },
        }}
      >
        {/* <button
          className={styles.closeMoreControlsButton}
          type="button"
          onClick={closeModal}
        >
          Close
        </button> */}
        hello
      </Modal>
    </div>
  )
}
