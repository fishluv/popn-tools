import cx from "classnames"
import { ListParams, useListCharts } from "../../lib/list"
import Chart from "../../models/Chart"
import SongBanner from "../common/SongBanner"
import Table from "../common/Table"
import PageInfo from "./PageInfo"
import styles from "./ChartResults.module.scss"
import LevelPill from "../common/LevelPill"
import FolderPill from "../common/FolderPill"

function ChartBanner({
  chart,
  onChartClick,
}: {
  chart: Chart
  onChartClick(chart: Chart): void
}) {
  return (
    <button className={styles.ChartBanner} onClick={() => onChartClick(chart)}>
      <SongBanner
        songId={chart.song!.id}
        songTitle={chart.song!.romanTitle}
        width={120}
        height={30}
      />

      <div className={cx(styles.diffStripe, styles[chart.difficulty])} />

      <div className={styles.debut}>
        <FolderPill
          folder={chart.song!.debut}
          pillStyle="compact"
          labelStyle="compact"
        />
      </div>

      <div className={styles.level}>
        <LevelPill
          className={styles[chart.difficulty]}
          difficulty={chart.difficulty}
          level={chart.level}
          pillStyle="compact"
          labelStyle="compact"
        />
      </div>
    </button>
  )
}

function formatDuration(duration: number) {
  const min = Math.floor(duration / 60)
  const sec = duration % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

export default function ChartResults({
  className,
  params,
  onChartClick,
  romanize,
  preferGenre,
}: {
  className?: string
  params: ListParams
  onChartClick(chart: Chart): void
  romanize: boolean
  preferGenre: boolean
}) {
  const { data, error, isLoading } = useListCharts(params)

  if (error) {
    console.error(
      `Error filtering charts: ${JSON.stringify(error.data) || error}`,
    )
    return <div>Uh oh! Something went wrong.</div>
  }
  if (!data || isLoading) {
    return <div>Loading...</div>
  }

  const { charts, pagy } = data

  return (
    <div className={cx(className, styles.ChartResults)}>
      <PageInfo {...pagy} />

      <div className={styles.tableContainer}>
        <Table
          className={styles.Table}
          records={charts}
          columns={[
            {
              id: "banner",
              markup: (chart: Chart) => (
                <ChartBanner chart={chart} onChartClick={onChartClick} />
              ),
            },
            {
              id: "titlegenre",
              markup: (chart: Chart) => {
                const { title, romanTitle, genre, romanGenre } = chart.song!
                if (preferGenre && title !== genre) {
                  return (
                    <span className={styles.genre}>
                      {romanize ? romanGenre : genre}
                    </span>
                  )
                } else {
                  return (
                    <span className={styles.title}>
                      {romanize ? romanTitle : title}
                    </span>
                  )
                }
              },
            },
            {
              id: "bpm",
              label: "Bpm",
              markup: (chart: Chart) => chart.mainBpm ?? "?",
            },
            {
              id: "bpmtype",
              label: "",
              markup: (chart: Chart) =>
                chart.mainBpmType === "majority"
                  ? "?"
                  : chart.mainBpmType === "nonmajority"
                  ? "*"
                  : "",
            },
            {
              id: "duration",
              label: "Dur.",
              markup: (chart: Chart) =>
                chart.duration ? formatDuration(chart.duration) : "?",
            },
            {
              id: "notes",
              label: "Notes",
              markup: (chart: Chart) => chart.notes ?? "?",
            },
            {
              id: "holdnotes",
              markup: (chart: Chart) =>
                chart.holdNotes && `(${chart.holdNotes})`,
            },
            {
              id: "rating",
              label: "Rating",
              prop: "jpRating",
            },
            {
              id: "sran",
              label: "S乱",
              markup: (chart: Chart) => chart.sranLevel,
            },
            {
              id: "timing",
              label: "Timing",
              markup: (chart: Chart) =>
                chart.timing ? (
                  <span className={styles[chart.timing]}>{chart.timing}</span>
                ) : (
                  <>{"?"}</>
                ),
            },
          ]}
        />
      </div>

      <PageInfo {...pagy} />
    </div>
  )
}
