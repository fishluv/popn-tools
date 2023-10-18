import cx from "classnames"
import React from "react"
import styles from "./SongDetails.module.scss"
import FolderPill from "./FolderPill"
import Song from "../models/Song"
import SongBanner from "./SongBanner"
import SongLevelPills from "./SongLevelPills"

function Detail({
  className,
  field,
  value,
}: {
  className?: string
  field: string
  value: string
}) {
  return (
    <div className={cx(className, styles.Detail)}>
      <span className={styles.field}>{field}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}

function areEquivalent(a: string, b: string) {
  function norm(s: string) {
    return s.toLowerCase().replaceAll("？", "?").replaceAll("！", "!")
  }
  return norm(a) === norm(b)
}

export default function SongDetails({ song }: { song: Song }) {
  const { title, genre, genreRomanTrans, remywikiTitle } = song
  return (
    <div className={styles.SongDetails}>
      <SongBanner className={styles.banner} songId={song.id} />

      {areEquivalent(title, genre) ? (
        <>
          <Detail className={styles.title} field="title/genre" value={title} />
          {!areEquivalent(title, remywikiTitle) && (
            <Detail
              className={styles.romanized}
              field=""
              value={remywikiTitle}
            />
          )}
        </>
      ) : (
        <>
          <Detail className={styles.title} field="title" value={title} />
          {!areEquivalent(title, remywikiTitle) && (
            <Detail
              className={styles.romanized}
              field=""
              value={remywikiTitle}
            />
          )}
          <Detail
            className={styles.genre}
            field="genre"
            value={genreRomanTrans}
          />
        </>
      )}

      <div className={styles.folder}>
        <FolderPill folder={song.folder} style="full" />
      </div>
      <div className={styles.levels}>
        <SongLevelPills song={song} style="compact" />
      </div>

      <a href={`https://remywiki.com/${song.remywikiUrlPath}`} target="_blank">
        {song.title}
      </a>
    </div>
  )
}
