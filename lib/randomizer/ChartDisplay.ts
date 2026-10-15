export type ChartDisplayStyle = "normal" | "compact"

export function parseChartDisplayStyle(s: string): ChartDisplayStyle {
  const sl = s?.toLowerCase()
  switch (sl) {
    case "compact":
      return "compact"
    default:
      return "normal"
  }
}

export interface ChartDisplayOptions {
  preferGenre: boolean
  displayStyle: ChartDisplayStyle
  showDrawnAt: boolean
  notepadContents: string
  assetsUrl: string
}
