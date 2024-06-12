import { SearchApiChartResult } from "../lib/search"
import Song from "./Song"
import SranLevel from "./SranLevel"

interface ChartContructorProps {
  id: string
  difficulty: "e" | "n" | "h" | "ex"
  level: number
  song: Song
  category: string | null
  bpm: string | null
  bpmSteps: string[] | null
  duration: number | null
  notes: number | null
  holdNotes: number | null
  timing: string | null
  timingSteps: string[][] | null
  jkwikiPagePath: string | null
  jpRating: string | null
  sranLevel: SranLevel | null
  labels: string[]
}

export default class Chart {
  static fromSearchApiChartResult({
    id,
    difficulty,
    level,
    song,
    category,
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
  }: SearchApiChartResult) {
    return new Chart({
      id,
      difficulty,
      level,
      song: Song.fromSearchApiSongResult(song),
      category,
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
    })
  }

  readonly id: string
  readonly difficulty: "e" | "n" | "h" | "ex"
  readonly level: number
  readonly song: Song
  readonly category: string | null
  readonly bpm: string | null
  readonly bpmSteps: string[] | null
  readonly duration: number | null
  readonly notes: number | null
  readonly holdNotes: number | null
  readonly timing: string | null
  readonly timingSteps: string[][] | null
  readonly jkwikiPagePath: string | null
  readonly jpRating: string | null
  readonly sranLevel: SranLevel | null
  readonly labels: string[]

  constructor({
    id,
    difficulty,
    level,
    song,
    category,
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
  }: ChartContructorProps) {
    this.id = id
    this.difficulty = difficulty
    this.level = level
    this.song = song
    this.category = category
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
  }
}
