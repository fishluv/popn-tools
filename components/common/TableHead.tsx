import { ColumnInfo } from "./Table"

export default function TableHead({ columns }: { columns: ColumnInfo[] }) {
  return (
    <thead>
      <tr>
        {columns.map(({ label }, i) => (
          <th key={i}>{label}</th>
        ))}
      </tr>
    </thead>
  )
}
