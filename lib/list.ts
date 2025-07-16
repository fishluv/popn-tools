/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import Song from "../models/Song"
import Chart from "../models/Chart"
import HttpError from "./HttpError"
import Debut from "../models/Debut"
import VersionFolder from "../models/VersionFolder"
import BemaniFolder from "../models/BemaniFolder"
import { SearchApiChartResult, SearchApiSongResult } from "./search"
import { getSearchApiUrl } from "./urls"
import Difficulty from "../models/Difficulty"

export type SortField =
  | "title"
  | "genre"
  | "rtitle"
  | "rgenre"
  | "debut"
  | "id"
  | "level"
  | "bpm"
  | "duration"
  | "hnotes"
  | "notes"
  | "jrating"
  | "srlevel"
export type Sort = SortField | `-${SortField}`

export function parseSort(s: string | undefined | null): Sort | null {
  switch (s) {
    case "title":
    case "-title":
    case "genre":
    case "-genre":
    case "rtitle":
    case "-rtitle":
    case "rgenre":
    case "-rgenre":
    case "debut":
    case "-debut":
    case "id":
    case "-id":
    case "level":
    case "-level":
    case "bpm":
    case "-bpm":
    case "duration":
    case "-duration":
    case "hnotes":
    case "-hnotes":
    case "notes":
    case "-notes":
    case "jrating":
    case "-jrating":
    case "srlevel":
    case "-srlevel":
      return s
    default:
      return null
  }
}

export type IncludeOption = "include" | "exclude" | "only"

export function parseIncludeOption(
  s: string | undefined | null,
): IncludeOption | null {
  const snorm = s?.toLowerCase()
  switch (snorm) {
    case "include":
    case "exclude":
    case "only":
      return snorm
    default:
      return null
  }
}

export interface ListParams {
  // Common
  folder?: VersionFolder | BemaniFolder | null
  level?: string | null
  debut?: Debut | null
  query?: string | null
  omnimix?: IncludeOption | null
  sorts?: Sort[] | null
  page?: string | null

  // Charts-only
  diffs?: Difficulty[] | null
  onlyHardest?: boolean | null
  bpm?: string | null
  bpmType?: string | null
  duration?: string | null
  notes?: string | null
  holdNotes?: string | null
  sranLevel?: string | null
  timing?: string | null
}

export interface ListSongsRawResult {
  data: SearchApiSongResult[]
  pagy: PagyMetadata
}

export interface ListSongsResult {
  songs: Song[]
  pagy: PagyMetadata
}

export interface ListChartsRawResult {
  data: SearchApiChartResult[]
  pagy: PagyMetadata
}

export interface ListChartsResult {
  charts: Chart[]
  pagy: PagyMetadata
}

export interface PagyMetadata {
  scaffold_url: string
  count: number
  page: number
  in: number
  series: (number | string)[]
}

export function useListSongs({
  debut,
  folder,
  level,
  query,
  omnimix,
  sorts,
  page,
}: ListParams) {
  const params: string[][] = []
  if (debut) {
    params.push(["debut", debut])
  }
  if (folder) {
    params.push(["folder", folder])
  }
  if (level) {
    params.push(["level", level])
  }
  if (query) {
    params.push(["q", query])
  }
  if (omnimix && ["exclude", "only"].includes(omnimix)) {
    params.push(["omni", omnimix])
  }
  if (sorts) {
    sorts.forEach((o) => params.push(["sort[]", o]))
  }
  if (page) {
    params.push(["page", page])
  }

  return useSWR<ListSongsResult>(
    getSearchApiUrl(
      "/list/songs",
      `?${new URLSearchParams(params).toString()}`,
    ),
    async (url: string) => {
      const response = await fetch(url)
      const result = (await response.json()) as ListSongsRawResult

      if (!response.ok) {
        throw new HttpError(result, response.status)
      }

      return {
        songs: result.data.map(Song.fromSearchApiSongResult),
        pagy: result.pagy,
      }
    },
  )
}

export function useListCharts({
  debut,
  folder,
  level,
  query,
  omnimix,
  sorts,
  page,
  diffs,
  onlyHardest,
  bpm,
  bpmType,
  duration,
  notes,
  holdNotes,
  sranLevel,
  timing,
}: ListParams) {
  const params: string[][] = []
  if (debut) {
    params.push(["debut", debut])
  }
  if (folder) {
    params.push(["folder", folder])
  }
  if (level) {
    params.push(["level", level])
  }
  if (query) {
    params.push(["q", query])
  }
  if (omnimix && ["exclude", "only"].includes(omnimix)) {
    params.push(["omni", omnimix])
  }
  if (sorts) {
    sorts.forEach((o) => params.push(["sort[]", o]))
  }
  if (page) {
    params.push(["page", page])
  }
  if (diffs) {
    diffs.forEach((d) => params.push(["diff[]", d]))
  }
  if (onlyHardest) {
    params.push(["hardest", "1"])
  }
  if (bpm) {
    params.push(["bpm", bpm])
  }
  if (bpmType) {
    params.push(["bpmtype", bpmType])
  }
  if (duration) {
    params.push(["duration", duration])
  }
  if (notes) {
    params.push(["notes", notes])
  }
  if (holdNotes) {
    params.push(["hnotes", holdNotes])
  }
  if (sranLevel) {
    params.push(["srlevel", sranLevel])
  }
  if (timing) {
    params.push(["timing", timing])
  }
  return useSWR<ListChartsResult>(
    getSearchApiUrl(
      "/list/charts",
      `?${new URLSearchParams(params).toString()}`,
    ),
    async (url: string) => {
      const response = await fetch(url)
      const result = (await response.json()) as ListChartsRawResult

      if (!response.ok) {
        throw new HttpError(result, response.status)
      }

      return {
        charts: result.data.map(Chart.fromSearchApiChartResult),
        pagy: result.pagy,
      }
    },
  )
}
