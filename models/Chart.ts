import { SearchApiChartResult } from "../lib/fetch"
import Song from "./Song"
import SranLevel from "./SranLevel"

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
    has_holds,
    category,
    bpm,
    duration,
    notes,
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
      hasHolds: has_holds,
      category,
      bpm,
      duration,
      notes,
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
  readonly hasHolds: boolean
  readonly category: string | null
  readonly bpm: string | null
  readonly duration: string | null
  readonly notes: number | null
  readonly jkwikiPagePath: string | null
  readonly jpRating: string | null
  readonly sranLevel: SranLevel | null
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
    jkwikiPagePath,
    jpRating,
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
    this.jkwikiPagePath = jkwikiPagePath
    this.jpRating = jpRating
    this.sranLevel = sranLevel
    this.labels = labels
  }
}
