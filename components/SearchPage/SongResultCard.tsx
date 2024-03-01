import FolderPill from "../common/FolderPill"
import styles from "./SongResultCard.module.scss"
import Song from "../../models/Song"
import SongBanner from "../common/SongBanner"
import SongLevelPills from "../common/SongLevelPills"

export default function SongResultCard({
  song,
  onClick,
}: {
  song: Song
  onClick(song: Song): void
}) {
  return (
    <button className={styles.SongResultCard} onClick={() => onClick(song)}>
      <SongBanner
        className={styles.banner}
        song={song}
        width={240}
        height={60}
      />

      <div className={styles.folderLevels}>
        <div className={styles.folder}>
          <FolderPill
            folder={song.folder}
            pillStyle="compact"
            labelStyle="compact"
          />
        </div>
        <div className={styles.levels}>
          <SongLevelPills
            song={song}
            pillStyle="compact"
            labelStyle="compact"
          />
        </div>
      </div>

      <div className={styles.overlay} />
    </button>
  )
}
