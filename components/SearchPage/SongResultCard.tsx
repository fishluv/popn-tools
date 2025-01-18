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
        songId={song.id}
        songTitle={song.romanTitle}
        width={240}
        height={60}
      />

      <div className={styles.debutLevels}>
        <div>
          <SongLevelPills
            songCharts={song.charts!}
            pillStyle="compact"
            labelStyle="compact"
          />
        </div>

        <div>
          <FolderPill
            folder={song.debut || null}
            pillStyle="compact"
            labelStyle="compact"
          />
        </div>
      </div>
    </button>
  )
}
