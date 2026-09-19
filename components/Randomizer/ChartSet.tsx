import React from "react"
import cx from "classnames"
import ChartCard from "./ChartCard"
import styles from "./ChartSet.module.scss"
import { ChartDisplayOptions } from "../../lib/randomizer/ChartDisplay"
import { ChartDataSet } from "./RandomizerApp"

interface ChartSetProps {
  extraClass?: string
  colorIndex: number
  chartDataSet: ChartDataSet
  chartDisplayOptions: ChartDisplayOptions
  showSranLevel: boolean
}

export default function ChartSet({
  extraClass,
  colorIndex,
  chartDataSet: { charts, drawnAt },
  chartDisplayOptions,
  showSranLevel,
}: ChartSetProps) {
  const cycleClassname = styles[`cycle${colorIndex % 4}`]
  const rootClassname = cx(extraClass, styles.ChartSet, cycleClassname)

  const noCharts = <span>No charts</span>

  const chartCardsMarkup = charts.map((chartData) => (
    <ChartCard
      key={`${chartData.id}_helper`}
      extraClass={styles.card}
      chartData={chartData}
      chartDisplayOptions={chartDisplayOptions}
      showSranLevel={showSranLevel}
    />
  ))

  return (
    <section className={rootClassname}>
      <div className={styles.triangle}></div>

      <div className={styles.cardsContainer}>
        {chartCardsMarkup.length ? chartCardsMarkup : noCharts}
      </div>

      {chartDisplayOptions.showDrawnAt && drawnAt && (
        <div className={styles.info}>{new Date(drawnAt).toLocaleString()}</div>
      )}
    </section>
  )
}
