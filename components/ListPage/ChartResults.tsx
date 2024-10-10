import { ListParams, useListCharts } from "../../lib/list"
import Chart from "../../models/Chart"
import Table from "../common/Table"
import PageInfo from "./PageInfo"

export default function ChartResults({
  params,
  onChartClick,
}: {
  params: ListParams
  onChartClick(chart: Chart): void
}) {
  const { data, error, isLoading } = useListCharts(params)

  if (error) {
    console.error(
      `Error filtering charts: ${JSON.stringify(error.data) || error}`,
    )
    return <div>Uh oh! Something went wrong.</div>
  }
  if (!data || isLoading) {
    return <div>Loading...</div>
  }

  const { charts, pagy } = data

  return (
    <>
      <PageInfo {...pagy} />
      <Table
        records={charts}
        columns={[
          {
            label: "",
            markup: (rec: Chart) => (
              <button onClick={() => onChartClick(rec)}>
                {rec.difficulty} {rec.level}
              </button>
            ),
          },
          { label: "Title", markup: (rec: Chart) => rec.song?.remywikiTitle },
        ]}
      />
      <PageInfo {...pagy} />
    </>
  )
}
