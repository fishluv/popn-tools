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
  children,
}: {
  className?: string
  field: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cx(className, styles.Detail)}>
      <span className={styles.field}>{field}</span>
      <span className={styles.value}>
        {value}
        {children}
      </span>
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
  const { title, genre, genreRomanTrans, remywikiTitle, artist, labels } = song
  const maybeUpperSuffix = labels.includes("upper") ? " (UPPER)" : ""

  return (
    <div className={styles.SongDetails}>
      <SongBanner className={styles.banner} songId={song.id} />

      {areEquivalent(title, genre) ? (
        <>
          <Detail
            className={styles.title}
            field="title/genre"
            value={`${title}${maybeUpperSuffix}`}
          />
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
          <Detail
            className={styles.title}
            field="title"
            value={`${title}${maybeUpperSuffix}`}
          />
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

      <Detail field="artist" value={artist} />

      <Detail field="from">
        <FolderPill folder={song.folder} style="full" />
      </Detail>

      <Detail field="charts">
        <SongLevelPills song={song} style="full" />
      </Detail>

      <Detail field="links">
        <a
          href={`https://remywiki.com/${song.remywikiUrlPath}`}
          target="_blank"
        >
          RemyWiki
        </a>
      </Detail>
    </div>
  )
}
