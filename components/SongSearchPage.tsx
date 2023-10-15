import React, { useState } from "react"
import styles from "./SongSearchPage.module.scss"
import { useSearchSong } from "../lib/fetch"
import SongResult from "./SongResult"

function SongSearchResults({ query }: { query: string }) {
  const { data: results, error, isLoading } = useSearchSong(query, 10)

  if (error) {
    console.error(`Error searching for songs: ${JSON.stringify(error.data)}`)
    return <div>Uh oh! Something went wrong.</div>
  }
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {results.map((song, index) => (
        <SongResult key={index} song={song} />
      ))}
    </>
  )
}

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
      <SongSearchResults query={query} />
    </div>
  )
}