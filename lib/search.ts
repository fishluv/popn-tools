/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import urlJoin from "url-join"
import Song from "../models/Song"
import Chart from "../models/Chart"
import HttpError from "./HttpError"

export function useSearchSong({
  query,
  limit,
}: {
  query: string
  limit: number
}) {
  return useSWR<Song[]>(
    getSearchApiUrl("/songs", `?q=${query}&limit=${limit}`),
    async (url: string) => {
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        throw new HttpError(data, res.status)
      }

      return (data as SearchApiSongResult[]).map(Song.fromSearchApiSongResult)
    },
  )
}

export function useSearchChart({
  query,
  limit,
}: {
  query: string
  limit: number
}) {
  return useSWR<Chart[]>(
    getSearchApiUrl("/charts", `?q=${query}&limit=${limit}`),
    async (url: string) => {
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        throw new HttpError(data, res.status)
      }

      return (data as SearchApiChartResult[]).map(
        Chart.fromSearchApiChartResult,
      )
    },
  )
}

function getSearchApiUrl(...parts: string[]) {
  return urlJoin(process.env.NEXT_PUBLIC_SEARCH_API_URL!, ...parts)
}

export interface SearchApiSongResult {
  id: number
  title: string
  title_sort_char: string
  genre: string
  genre_sort_char: string
  artist: string
  character1?: SearchApiCharacterResult
  character2?: SearchApiCharacterResult
  easy_diff?: number
  normal_diff?: number
  hyper_diff?: number
  ex_diff?: number
  debut: string
  folder?: string
  slug: string
  remywiki_url_path: string
  remywiki_title: string
  remywiki_chara: string
  genre_romantrans: string
  labels: string[]
}

export interface SearchApiChartResult {
  id: string
  difficulty: "e" | "n" | "h" | "ex"
  level: number
  song: SearchApiSongResult
  category: string | null
  bpm: string | null
  bpm_steps: string[] | null
  duration: number | null
  notes: number | null
  hold_notes: number | null
  timing: string | null
  timing_steps: string[][] | null
  jkwiki_page_path: string | null
  rating: string | null
  sran_level: string | null
  labels: string[]
}

export interface SearchApiCharacterResult {
  id: number
  chara_id: string
  icon1: string
  disp_name: string
  sort_name: string
}
