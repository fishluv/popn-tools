/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr"
import urlJoin from "url-join"

function getSearchApiUrl(...parts: string[]) {
  return urlJoin(process.env.NEXT_PUBLIC_SEARCH_API_URL!, ...parts)
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

async function urlFetcher(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    const data = await res.json()
    throw new HttpError(data, res.status)
  }

  return res.json()
}

export function useSearchSong(query: string, limit: number) {
  return useSWR(
    getSearchApiUrl("/songs", `?q=${query}&limit=${limit}`),
    urlFetcher,
  )
}
