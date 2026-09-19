export type ChartDisplayStyle = "normal" | "compact"

export function parseChartDisplayStyle(s: string): ChartDisplayStyle {
  switch (s) {
    case "normal":
    case "compact":
      return s
    default:
      throw new Error(`Invalid chart display style: [${s}]`)
  }
}

export interface ChartDisplayOptions {
  preferGenre: boolean
  displayStyle: ChartDisplayStyle
  showDrawnAt: boolean
  notepadContents: string
  assetsUrl: string
}
