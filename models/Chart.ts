import { SearchApiChartResult } from "../lib/fetch"
import Song from "./Song"

interface ChartContructorProps {
  id: string
  difficulty: "e" | "n" | "h" | "ex"
  level: number
  song: Song
  hasHolds: boolean
  category: string | null
  bpm: string | null
  duration: string | null
  notes: number | null
  rating: string | null
  sranLevel: string | null
  labels: string[]
}

export default class Chart {
  static fromSearchApiChartResult({
    id,
    difficulty,
    level,
    song,
    has_holds,
    category,
    bpm,
    duration,
    notes,
    rating,
    sran_level,
    labels,
  }: SearchApiChartResult) {
    return new Chart({
      id,
      difficulty,
      level,
      song: Song.fromSearchApiSongResult(song),
      hasHolds: has_holds,
      category,
      bpm,
      duration,
      notes,
      rating,
      sranLevel: sran_level,
      labels,
    })
  }

  readonly id: string
  readonly difficulty: "e" | "n" | "h" | "ex"
  readonly level: number
  readonly song: Song
  readonly hasHolds: boolean
  readonly category: string | null
  readonly bpm: string | null
  readonly duration: string | null
  readonly notes: number | null
  readonly rating: string | null
  readonly sranLevel: string | null
  readonly labels: string[]

  constructor({
    id,
    difficulty,
    level,
    song,
    hasHolds,
    category,
    bpm,
    duration,
    notes,
    rating,
    sranLevel,
    labels,
  }: ChartContructorProps) {
    this.id = id
    this.difficulty = difficulty
    this.level = level
    this.song = song
    this.hasHolds = hasHolds
    this.category = category
    this.bpm = bpm
    this.duration = duration
    this.notes = notes
    this.rating = rating
    this.sranLevel = sranLevel
    this.labels = labels
  }
}
