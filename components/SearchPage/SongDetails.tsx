import cx from "classnames"
import React from "react"
import styles from "./SongDetails.module.scss"
import FolderPill from "../FolderPill"
import Song from "../../models/Song"
import SongBanner from "../SongBanner"
import SongLevelPills from "../SongLevelPills"

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
  return norm(a).includes(norm(b)) || norm(b).includes(norm(a))
}

function getMinorTitleDisplay({ remywikiTitle, titleSortChar }: Song) {
  return (
    <Detail
      className={styles.minor}
      field=""
      value={`${maybeDisplaySortChar(
        titleSortChar,
        remywikiTitle,
      )}${remywikiTitle}`}
    />
  )
}

function getMinorGenreDisplay({ genre, genreSortChar }: Song) {
  return (
    <Detail
      className={styles.minor}
      field=""
      value={`${maybeDisplaySortChar(genreSortChar, genre)}${genre}`}
    />
  )
}

// https://stackoverflow.com/a/20488304
function toAscii(fw: string) {
  return fw.replace(/[！-～]/g, (ch: string) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  )
}

function maybeDisplaySortChar(
  titleOrGenreSortChar: string,
  titleOrGenre: string,
) {
  if (
    toAscii(titleOrGenreSortChar).toLowerCase() ===
    titleOrGenre.charAt(0).toLowerCase()
  ) {
    return ""
  } else {
    return `[${titleOrGenreSortChar}] `
  }
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
          {!areEquivalent(title, remywikiTitle) && getMinorTitleDisplay(song)}
        </>
      ) : (
        <>
          <Detail
            className={styles.title}
            field="title"
            value={`${title}${maybeUpperSuffix}`}
          />
          {!areEquivalent(title, remywikiTitle) && getMinorTitleDisplay(song)}
          <Detail
            className={styles.genre}
            field="genre"
            value={genreRomanTrans}
          />
          {getMinorGenreDisplay(song)}
        </>
      )}

      <Detail field="artist" value={artist} />

      <Detail field="from">
        <FolderPill folder={song.folder} style="full" />
      </Detail>

      <Detail field="charts">
        <SongLevelPills
          pillClassName={styles.levelPill}
          song={song}
          style="full"
        />
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
