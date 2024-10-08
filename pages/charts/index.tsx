import Head from "next/head"
import { useSearchParams } from "next/navigation"
import ListChartsPage from "../../components/ListPage/ListChartsPage"
import { parseDebut } from "../../models/Debut"
import { parseVersionFolder } from "../../models/VersionFolder"
import { parseBemaniFolder } from "../../models/BemaniFolder"
import { ListChartsParams, Sort, parseSort } from "../../lib/list"
import Difficulty, { parseDifficulty } from "../../models/Difficulty"

export default function Search() {
  const searchParams = useSearchParams()
  const debut = searchParams.get("debut")
  const folder = searchParams.get("folder")
  const sorts = searchParams.getAll("sort")
  const diffs = searchParams.getAll("diff")
  const params: ListChartsParams = {
    debut: parseDebut(debut),
    folder: parseVersionFolder(folder) || parseBemaniFolder(folder),
    level: searchParams.get("level"),
    query: searchParams.get("q"),
    sorts: sorts.map(parseSort).filter(Boolean) as Sort[],
    page: searchParams.get("page") || "1",
    diff: diffs.map(parseDifficulty).filter(Boolean) as Difficulty[],
    bpm: searchParams.get("bpm"),
    bpmtype: searchParams.get("bpmtype"),
    notes: searchParams.get("notes"),
    srlevel: searchParams.get("srlevel"),
    timing: searchParams.get("timing"),
  }

  return (
    <>
      <Head>
        <title>{"Browse Charts • Pop'n Tools"}</title>
      </Head>
      <ListChartsPage {...params} />
    </>
  )
}
