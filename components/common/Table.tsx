import cx from "classnames"
import styles from "./Table.module.scss"
import TableHead from "./TableHead"
import TableBody from "./TableBody"
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
      <TableHead columns={columns} />
      <TableBody columns={columns} records={records} />
    </table>
  )
}
