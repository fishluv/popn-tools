import styles from "./ChartSearchResultsList.module.scss"
import { useSearchChart } from "../../lib/fetch"
import Chart from "../../models/Chart"
import ChartResultCard from "./ChartResultCard"

export default function ChartSearchResultsList({
  query,
  onChartClick,
}: {
  query: string
  onChartClick(chart: Chart): void
}) {
  const {
    data: chartResults,
    error,
    isLoading,
  } = useSearchChart({ query, limit: 15 })

  if (error) {
    console.error(`Error searching for charts: ${JSON.stringify(error.data)}`)
    return <div>Uh oh! Something went wrong.</div>
  }
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.ChartSearchResultsList}>
      {chartResults &&
        chartResults.map((chartResult: Chart, index: number) => {
          let style: "full" | "compact"
          if (index === 0) {
            style = "full"
          } else if (chartResult.song.id === chartResults[index - 1].song.id) {
            style = "compact"
          } else {
            style = "full"
          }

          return (
            <ChartResultCard
              className={styles[style]}
              key={index}
              chart={chartResult}
              style={style}
              onClick={onChartClick}
            />
          )
        })}
    </div>
  )
}
