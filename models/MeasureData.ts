import { ChartCsvRow } from "../lib/fetchChartScore"

export default class MeasureData {
  static fromCsvRows(chartCsvRows: ChartCsvRow[]) {
    let currRowTs = 0
    let currRows: ChartCsvRow[] = []
    let currIndex = 1
    let currStartKeyOn = 0
    let currKeyOn = 0
    let currStartBpm: number | null = null
    let currBpm: number | null = null
    const measures: MeasureData[] = []

    chartCsvRows.forEach((row) => {
      const { timestamp, keyon, keyoff, measurebeatend, bpm } = row

      currRowTs = timestamp

      // If start of new measure, flush first.
      if (["m", "e"].includes(measurebeatend) && currRows.length) {
        measures.push(
          new MeasureData({
            rows: currRows,
            index: currIndex,
            startKeyOn: currStartKeyOn,
            startBpm: currStartBpm || currBpm || 0, // currStartBpm is null for the very first measure.
            duration: currRowTs - currRows[0].timestamp,
          }),
        )

        currRows = []
        currIndex += 1
        currStartKeyOn = currKeyOn
        currStartBpm = currBpm
      }

      // Ignore empty "end" measure.
      if (measurebeatend !== "e") {
        currRows.push(row)
      }

      if (bpm !== null) {
        currBpm = bpm
      }
      if (keyon !== null) {
        currKeyOn |= keyon
      }
      if (keyoff !== null) {
        currKeyOn ^= keyoff
      }
    })

    if (currRows.length) {
      measures.push(
        new MeasureData({
          rows: currRows,
          index: currIndex,
          startKeyOn: currStartKeyOn,
          startBpm: currStartBpm || 0,
          duration: currRowTs - currRows[0].timestamp,
        }),
      )
    }

    return measures
  }

  readonly rows: ChartCsvRow[]
  readonly index: number
  readonly startTimestamp: number
  readonly startKeyOn: number
  readonly startBpm: number
  readonly duration: number

  constructor({
    rows,
    index,
    startKeyOn,
    startBpm,
    duration,
  }: {
    rows: ChartCsvRow[]
    index: number
    startKeyOn: number
    startBpm: number
    duration: number
  }) {
    this.rows = rows
    this.index = index
    this.startTimestamp = rows[0].timestamp
    this.startKeyOn = startKeyOn
    this.startBpm = startBpm
    this.duration = duration
  }
}
