import Head from "next/head"
import { useSearchParams } from "next/navigation"
import ListPage from "../../components/ListPage/ListPage"
import { parseDebut } from "../../models/Debut"
import { parseVersionFolder } from "../../models/VersionFolder"
import { parseBemaniFolder } from "../../models/BemaniFolder"
import { ListParams, Sort, parseIncludeOption, parseSort } from "../../lib/list"

export default function Search() {
  const searchParams = useSearchParams()
  const debut = searchParams.get("debut")
  const folder = searchParams.get("folder")
  const omnimix = searchParams.get("omni")
  const sorts = searchParams.get("sort")
  const params: ListParams = {
    debut: parseDebut(debut),
    folder: parseVersionFolder(folder) || parseBemaniFolder(folder),
    level: searchParams.get("level"),
    query: searchParams.get("q"),
    omnimix: parseIncludeOption(omnimix),
    sorts: sorts
      ? (sorts.split(",").map(parseSort).filter(Boolean) as Sort[])
      : null,
    page: searchParams.get("page") || "1",
  }

  return (
    <>
      <Head>
        <title>{"Browse Songs • Pop'n Tools"}</title>
      </Head>
      <ListPage mode="song" params={params} />
    </>
  )
}
