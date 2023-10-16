import React, { useState } from "react"
import styles from "./SongSearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"

export default function SongSearchPage() {
  const [pendingQuery, setPendingQuery] = useState("")
  const [query, setQuery] = useState("")

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
    <div className={styles.SongSearchPage}>
      <input
        className={styles.input}
        type="text"
        placeholder="🎵 Search for songs"
        value={pendingQuery}
        onChange={onInputChange}
      />
      <SongSearchResultsList query={query} />
    </div>
  )
}
