import React, { useState } from "react"
import styles from "./SongSearchPage.module.scss"
import SongSearchResultsList from "./SongSearchResultsList"
import { useDebounce } from "../lib/debounce"

export default function SongSearchPage() {
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
    <div className={styles.SongSearchPage}>
      <input
        className={styles.input}
        type="text"
        placeholder="🎵 Search for songs"
        value={pendingQuery}
        onChange={onInputChange}
      />
      <SongSearchResultsList query={debouncedQuery} />
    </div>
  )
}
