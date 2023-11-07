import FolderPill from "../FolderPill"
import styles from "./ChartResultCard.module.scss"
import Chart from "../../models/Chart"
import SongBanner from "../SongBanner"
import LevelPill from "../LevelPill"

export default function ChartResultCard({
  chart,
  onClick,
}: {
  chart: Chart
  onClick(chart: Chart): void
}) {
  return (
    <button className={styles.ChartResultCard} onClick={() => onClick(chart)}>
      <div className={styles.title}>{chart.song.title}</div>
      <SongBanner className={styles.banner} songId={chart.song.id} />
      <div className={styles.folderLevels}>
        <div className={styles.folder}>
          <FolderPill folder={chart.song.folder} style="compact" />
        </div>
        <div className={styles.levels}>
          <LevelPill
            difficulty={chart.difficulty}
            level={chart.level}
            style="compact"
          />
        </div>
      </div>
      <div className={styles.overlay} />
    </button>
  )
}
