import FolderPill from "../common/FolderPill"
import styles from "./ChartResultCard.module.scss"
import Chart from "../../models/Chart"
import SongBanner from "../common/SongBanner"
import LevelPill from "../common/LevelPill"
import cx from "classnames"

export default function ChartResultCard({
  className,
  chart,
  style,
  onClick,
}: {
  className?: string
  chart: Chart
  style: "full" | "compact"
  onClick(chart: Chart): void
}) {
  return (
    <button
      className={cx(className, styles.ChartResultCard, styles[style])}
      onClick={() => onClick(chart)}
    >
      <SongBanner className={styles.banner} song={chart.song} />
      <div className={styles.bannerOverlay} />

      <div className={cx(styles.diffStripe, styles[chart.difficulty])} />

      <LevelPill
        className={styles.LevelPill}
        difficulty={chart.difficulty}
        level={chart.level}
        pillStyle="compact"
        labelStyle="full"
      />

      {style === "full" && (
        <FolderPill
          className={styles.FolderPill}
          folder={chart.song.folder}
          pillStyle="compact"
          labelStyle="full"
        />
      )}

      <div className={styles.overlay} />
    </button>
  )
}
