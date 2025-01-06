import { SearchApiChartResult } from "../lib/search"
import Difficulty from "./Difficulty"
import Song from "./Song"

interface OtherCharts {
  // Right now all we care about is chart level.
  e?: number
  n?: number
  h?: number
  ex?: number
}

interface ChartContructorProps {
  id: string
  difficulty: Difficulty
  level: number
  bpm: string | null
  bpmSteps: number[] | null
  mainBpm: number | null
  mainBpmType: "constant" | "majority" | "nonmajority" | null
  duration: number | null
  notes: number | null
  holdNotes: number | null
  timing: string | null
  timingSteps: number[][] | null
  jkwikiPagePath: string | null
  jpRating: string | null
  sranLevel: number | null
  labels: string[]
  // Included in /search/charts response and /fetch/charts response.
  song: Song | null
  // Included in /fetch/charts response.
  otherCharts: OtherCharts | null
}

function parseMainBpmType(
  s: string | null,
): "constant" | "majority" | "nonmajority" | null {
  switch (s) {
    case "constant":
    case "majority":
    case "nonmajority":
      return s
    default:
      return null
  }
}

export default class Chart {
  static fromSearchApiChartResult({
    id,
    difficulty,
    level,
    bpm,
    bpm_steps,
    bpm_main,
    bpm_main_type,
    duration,
    notes,
    hold_notes,
    timing,
    timing_steps,
    jkwiki_page_path,
    rating,
    sran_level,
    labels,
    song,
    other_charts,
  }: SearchApiChartResult): Chart {
    return new Chart({
      id,
      difficulty,
      level,
      bpm,
      bpmSteps: bpm_steps,
      mainBpm: bpm_main,
      mainBpmType: parseMainBpmType(bpm_main_type),
      duration,
      notes,
      holdNotes: hold_notes,
      timing,
      timingSteps: timing_steps,
      jkwikiPagePath: jkwiki_page_path,
      jpRating: rating,
      sranLevel: sran_level,
      labels,
      song: song ? Song.fromSearchApiSongResult(song) : null,
      otherCharts: other_charts ?? null,
    })
  }

  readonly id: string
  readonly difficulty: Difficulty
  readonly level: number
  readonly bpm: string | null
  readonly bpmSteps: number[] | null
  readonly mainBpm: number | null
  readonly mainBpmType: "constant" | "majority" | "nonmajority" | null
  readonly duration: number | null
  readonly notes: number | null
  readonly holdNotes: number | null
  readonly timing: string | null
  readonly timingSteps: number[][] | null
  readonly jkwikiPagePath: string | null
  readonly jpRating: string | null
  readonly sranLevel: number | null
  readonly labels: string[]
  readonly song: Song | null
  readonly otherCharts: OtherCharts | null

  constructor({
    id,
    difficulty,
    level,
    bpm,
    bpmSteps,
    mainBpm,
    mainBpmType,
    duration,
    notes,
    holdNotes,
    timing,
    timingSteps,
    jkwikiPagePath,
    jpRating,
    sranLevel,
    labels,
    song,
    otherCharts,
  }: ChartContructorProps) {
    this.id = id
    this.difficulty = difficulty
    this.level = level
    this.bpm = bpm
    this.bpmSteps = bpmSteps
    this.mainBpm = mainBpm
    this.mainBpmType = mainBpmType
    this.duration = duration
    this.notes = notes
    this.holdNotes = holdNotes
    this.timing = timing
    this.timingSteps = timingSteps
    this.jkwikiPagePath = jkwikiPagePath
    this.jpRating = jpRating
    this.sranLevel = sranLevel
    this.labels = labels
    this.song = song
    this.otherCharts = otherCharts
  }
}
