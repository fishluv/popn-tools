/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import urlJoin from "url-join"
import Song from "../models/Song"

export function useSearchSong({
  query,
  limit,
}: {
  query: string
  limit: number
}) {
  return useSWR<Song[]>(
    getSearchApiUrl("/songs", `?q=${query}&limit=${limit}`),
    urlFetcher,
  )
}

function getSearchApiUrl(...parts: string[]) {
  return urlJoin(process.env.NEXT_PUBLIC_SEARCH_API_URL!, ...parts)
}

async function urlFetcher(url: string) {
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) {
    throw new HttpError(data, res.status)
  }

  return (data as SearchApiSongResult[]).map(Song.fromSearchApiSongResult)
}

class HttpError extends Error {
  data: any
  status: number

  constructor(data: any, status: number) {
    super("Error")
    this.data = data
    this.status = status
  }
}

export interface SearchApiSongResult {
  id: number
  title: string
  title_sort_char: string
  genre: string
  genre_sort_char: string
  artist: string
  easy_diff?: number
  normal_diff?: number
  hyper_diff?: number
  ex_diff?: number
  folder: string
  slug: string
  remywiki_url_path: string
  remywiki_title: string
  genre_romantrans: string
  labels: string[]
}
