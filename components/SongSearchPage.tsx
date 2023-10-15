import React, { useState } from "react"
import styles from "./SongSearchPage.module.scss"

export default function SongSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [songSearchResults, setSongSearchResults] = useState([])

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    // Remove leading whitespace. Only one trailing space allowed.
    const sanitized = value.replace(/^\s+/, "").replace(/\s+$/, " ")
    if (sanitized !== searchQuery) {
      setSearchQuery(value)
      // call search api
    }
  }

  return (
    <div className={styles.SongSearchPage}>
      <input
        className={styles.input}
        type="text"
        placeholder="🎵 Search for songs"
        value={searchQuery}
        onChange={onInputChange}
      />
      {songSearchResults.map((song, index) => (
        <p key={index}>{song}</p>
      ))}
    </div>
  )
}
