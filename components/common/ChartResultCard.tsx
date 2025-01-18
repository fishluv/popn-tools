import FolderPill from "./FolderPill"
import styles from "./ChartResultCard.module.scss"
import Chart from "../../models/Chart"
import SongBanner from "./SongBanner"
import LevelPill from "./LevelPill"
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
      <SongBanner
        songId={chart.song?.id ?? 0}
        songTitle={chart.song?.romanTitle || "unknown"}
        width={style === "full" ? 240 : 224}
        height={style === "full" ? 60 : 32}
      />
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
          folder={chart.song?.debut || null}
          pillStyle="compact"
          labelStyle="full"
        />
      )}
    </button>
  )
}
