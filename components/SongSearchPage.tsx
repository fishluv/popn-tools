import React from "react"
import styles from "./SongSearchPage.module.scss"

export default function SongSearchPage() {
  return (
    <div className={styles.SongSearchPage}>
      <input
        className={styles.input}
        type="text"
        placeholder="🎵 Search for songs"
      />
    </div>
  )
}
