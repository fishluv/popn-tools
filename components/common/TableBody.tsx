import { ColumnInfo } from "./Table"

interface TableBodyProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  records: any[]
  columns: ColumnInfo[]
}

export default function TableBody({ columns, records }: TableBodyProps) {
  return (
    <tbody>
      {records.map((rec) => (
        <tr key={rec.id}>
          {columns.map(({ prop, markup }, i) => {
            return (
              <td key={i}>
                {(prop && rec[prop]) || (markup && markup(rec)) || ""}
              </td>
            )
          })}
        </tr>
      ))}
    </tbody>
  )
}
