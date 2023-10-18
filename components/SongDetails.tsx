import React from "react"
import styles from "./SongDetails.module.scss"
import FolderPill from "./FolderPill"
import Song from "../models/Song"
import SongBanner from "./SongBanner"
import SongLevelPills from "./SongLevelPills"

export default function SongDetails({ song }: { song: Song }) {
  return (
    <div className={styles.SongDetails}>
      <SongBanner className={styles.banner} songId={song.id} />
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
