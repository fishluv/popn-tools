import cx from "classnames"
import { ListParams, useListCharts } from "../../lib/list"
import Chart from "../../models/Chart"
import SongBanner from "../common/SongBanner"
import Table from "../common/Table"
import PageInfo from "./PageInfo"
import styles from "./ChartResults.module.scss"
import LevelPill from "../common/LevelPill"

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
        songTitle={chart.song!.remywikiTitle}
        width={120}
        height={30}
      />

      <div className={cx(styles.diffStripe, styles[chart.difficulty])} />

      <div className={styles.level}>
        <LevelPill
          className={cx(styles.levelPill, styles[chart.difficulty])}
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
  params,
  onChartClick,
}: {
  params: ListParams
  onChartClick(chart: Chart): void
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
    <>
      <PageInfo {...pagy} />
      <Table
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
            markup: (chart: Chart) => chart.song?.remywikiTitle,
          },
          {
            id: "bpm",
            label: "Bpm",
            markup: (chart: Chart) => chart.primaryBpm ?? "?",
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
            markup: (chart: Chart) =>
              chart.notes ? (
                <>
                  {chart.notes}
                  {!!chart.holdNotes && ` (${chart.holdNotes})`}
                </>
              ) : (
                "?"
              ),
          },
          {
            id: "rating",
            label: "Rating",
            prop: "jpRating",
          },
          {
            id: "sran",
            label: "S乱",
            markup: (chart: Chart) => chart.sranLevel?.display(),
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
      <PageInfo {...pagy} />
    </>
  )
}
