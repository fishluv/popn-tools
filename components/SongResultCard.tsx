import FolderPill from "./FolderPill"
import styles from "./SongResultCard.module.scss"
import Song from "../models/Song"
import SongBanner from "./SongBanner"
import SongLevelPills from "./SongLevelPills"

export default function SongResultCard({
  song,
  onClick,
}: {
  song: Song
  onClick(song: Song): void
}) {
  return (
    <button className={styles.SongResultCard} onClick={() => onClick(song)}>
      <div className={styles.title}>{song.title}</div>
      <SongBanner className={styles.banner} songId={song.id} />
      <div className={styles.folderLevels}>
        <div className={styles.folder}>
          <FolderPill folder={song.folder} style="compact" />
        </div>
        <div className={styles.levels}>
          <SongLevelPills song={song} style="compact" />
        </div>
      </div>
      <div className={styles.overlay} />
    </button>
  )
}
