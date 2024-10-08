import Head from "next/head"
import { useSearchParams } from "next/navigation"
import ListSongsPage from "../../components/ListPage/ListSongsPage"
import { parseDebut } from "../../models/Debut"
import { parseVersionFolder } from "../../models/VersionFolder"
import { parseBemaniFolder } from "../../models/BemaniFolder"
import { ListSongsParams, Sort, parseSongOrdering } from "../../lib/list"

export default function Search() {
  const searchParams = useSearchParams()
  const debut = searchParams.get("debut")
  const folder = searchParams.get("folder")
  const sorts = searchParams.getAll("sort")
  const params: ListSongsParams = {
    debut: parseDebut(debut),
    folder: parseVersionFolder(folder) || parseBemaniFolder(folder),
    level: searchParams.get("level"),
    query: searchParams.get("q"),
    sorts: sorts.map(parseSongOrdering).filter(Boolean) as Sort[],
    page: searchParams.get("page") || "1",
  }

  return (
    <>
      <Head>
        <title>{"Browse Songs • Pop'n Tools"}</title>
      </Head>
      <ListSongsPage {...params} />
    </>
  )
}
