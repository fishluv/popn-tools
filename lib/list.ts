/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import Song from "../models/Song"
import Chart from "../models/Chart"
import HttpError from "./HttpError"
import Debut from "../models/Debut"
import VersionFolder from "../models/VersionFolder"
import OtherFolder from "../models/OtherFolder"
import { SearchApiChartResult, SearchApiSongResult } from "./search"
import { getSearchApiUrl } from "./urls"

type SortField =
  | "title"
  | "genre"
  | "rtitle"
  | "rgenre"
  | "debut"
  | "folder"
  | "id"
  | "level"
export type Sort = SortField | `-${SortField}`

export function parseSongOrdering(s: string | undefined | null): Sort | null {
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
    case "folder":
    case "-folder":
    case "id":
    case "-id":
    case "level":
    case "-level":
      return s
    default:
      return null
  }
}

export interface ListSongsParams {
  debut?: Debut | null
  folder?: VersionFolder | OtherFolder | null
  level?: string | null
  sorts?: Sort[] | null
  page?: string | null
}

export interface ListSongsRawResult {
  data: SearchApiSongResult[]
  pagy: PagyMetadata
}

export interface ListSongsResult {
  songs: Song[]
  pagy: PagyMetadata
}

export interface ListChartsParams {
  debut?: Debut | null
  folder?: VersionFolder | OtherFolder | null
  level?: number | null
  diff?: ("e" | "n" | "h" | "ex")[] | null
  sorts?: Sort[] | null
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
  sorts,
  page,
}: ListSongsParams) {
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
  diff,
  sorts,
}: ListChartsParams) {
  const diffParam = diff?.map((o) => `&diff[]=${o}`)?.join("") ?? ""
  const sortParam = sorts?.map((o) => `&sort[]=${o}`)?.join("") ?? ""
  return useSWR<ListChartsResult>(
    getSearchApiUrl(
      "/list/charts",
      `?debut=${debut}&folder=${folder}&level=${level}${diffParam}${sortParam}`,
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
