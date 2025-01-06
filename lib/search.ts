/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import Song from "../models/Song"
import Chart from "../models/Chart"
import HttpError from "./HttpError"
import { getSearchApiUrl } from "./urls"
import Difficulty from "../models/Difficulty"

export function useSearchSong({
  query,
  limit,
}: {
  query: string
  limit: number
}) {
  return useSWR<Song[]>(
    getSearchApiUrl("/search/songs", `?q=${query}&limit=${limit}`),
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
    getSearchApiUrl("/search/charts", `?q=${query}&limit=${limit}`),
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

export interface SearchApiSongResult {
  id: number
  title: string
  sort_title: string
  genre: string
  sort_genre: string
  artist: string
  character1: SearchApiCharacterResult | null
  character2: SearchApiCharacterResult | null
  debut: string
  folders: string[]
  slug: string
  remywiki_url_path: string
  remywiki_title: string
  remywiki_chara: string
  genre_romantrans: string
  labels: string[]
  // Included in /songs response but not in /charts response.
  charts?: SongCharts
}

export interface SearchApiCharacterResult {
  id: number
  chara_id: string
  icon1: string
  disp_name: string
  sort_name: string
}

interface SongCharts {
  e?: SearchApiChartResult
  n?: SearchApiChartResult
  h?: SearchApiChartResult
  ex?: SearchApiChartResult
}

export interface SearchApiChartResult {
  id: string
  difficulty: Difficulty
  level: number
  bpm: string | null
  bpm_steps: number[] | null
  bpm_main: number | null
  bpm_main_type: string | null
  duration: number | null
  notes: number | null
  hold_notes: number | null
  timing: string | null
  timing_steps: number[][] | null
  jkwiki_page_path: string | null
  rating: string | null
  sran_level: number | null
  labels: string[]
  // Included in /search/charts response and /fetch/charts response.
  song?: SearchApiSongResult
  // Included in /fetch/charts response.
  other_charts?: OtherCharts
}

interface OtherCharts {
  e?: number
  n?: number
  h?: number
  ex?: number
}
