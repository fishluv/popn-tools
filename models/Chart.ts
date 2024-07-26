import { SearchApiChartResult } from "../lib/search"
import Song from "./Song"
import SranLevel from "./SranLevel"

interface ChartContructorProps {
  id: string
  difficulty: "e" | "n" | "h" | "ex"
  level: number
  bpm: string | null
  bpmSteps: number[] | null
  duration: number | null
  notes: number | null
  holdNotes: number | null
  timing: string | null
  timingSteps: number[][] | null
  jkwikiPagePath: string | null
  jpRating: string | null
  sranLevel: SranLevel | null
  labels: string[]
  // Included in /charts response but not in /songs response.
  song: Song | null
}

export default class Chart {
  static fromSearchApiChartResult({
    id,
    difficulty,
    level,
    bpm,
    bpm_steps,
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
  }: SearchApiChartResult): Chart {
    return new Chart({
      id,
      difficulty,
      level,
      bpm,
      bpmSteps: bpm_steps,
      duration,
      notes,
      holdNotes: hold_notes,
      timing,
      timingSteps: timing_steps,
      jkwikiPagePath: jkwiki_page_path,
      jpRating: rating,
      sranLevel: sran_level ? new SranLevel(sran_level) : null,
      labels,
      song: song ? Song.fromSearchApiSongResult(song) : null,
    })
  }

  readonly id: string
  readonly difficulty: "e" | "n" | "h" | "ex"
  readonly level: number
  readonly bpm: string | null
  readonly bpmSteps: number[] | null
  readonly duration: number | null
  readonly notes: number | null
  readonly holdNotes: number | null
  readonly timing: string | null
  readonly timingSteps: number[][] | null
  readonly jkwikiPagePath: string | null
  readonly jpRating: string | null
  readonly sranLevel: SranLevel | null
  readonly labels: string[]
  readonly song: Song | null

  constructor({
    id,
    difficulty,
    level,
    bpm,
    bpmSteps,
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
  }: ChartContructorProps) {
    this.id = id
    this.difficulty = difficulty
    this.level = level
    this.bpm = bpm
    this.bpmSteps = bpmSteps
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
  }
}
