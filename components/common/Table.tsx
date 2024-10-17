import cx from "classnames"
import styles from "./Table.module.scss"
import { ReactNode } from "react"

export interface ColumnInfo {
  id: string
  label?: string
  /**
   * Property of record to display. Omit to use `markup` instead.
   */
  prop?: string
  /**
   * Function returning display markup for non-property columns.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markup?(rec: any): ReactNode
}

interface TableProps {
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  records: any[]
  columns: ColumnInfo[]
}

export default function Table({ className, records, columns }: TableProps) {
  return (
    <table className={cx(styles.Table, className)}>
      <colgroup>
        {columns.map((c) => (
          <col key={c.id} className={styles[c.id]} />
        ))}
      </colgroup>

      <thead>
        <tr>
          {columns.map(({ id, label }, i) => (
            <th key={i} className={styles[id]}>
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {records.map((rec) => (
          <tr key={rec.id}>
            {columns.map(({ id, prop, markup }, i) => {
              return (
                <td key={i} className={styles[id]}>
                  {(prop && rec[prop]) || (markup && markup(rec)) || ""}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
