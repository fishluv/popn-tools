import urlJoin from "url-join"

export function getSearchApiUrl(...parts: string[]) {
  return urlJoin(process.env.NEXT_PUBLIC_SEARCH_API_URL!, ...parts)
}
