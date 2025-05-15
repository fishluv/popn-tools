import { useState } from "react"
import styles from "./ChartCsvEditor.module.scss"
import { ChartCsvRow } from "../../lib/fetchChartScore"
import { keyNumToOrds } from "./Measure"

function keyToLaneOrdString(key: number) {
  return keyNumToOrds(key)
    .map((noteOrd) => noteOrd + 1)
    .join("")
}

function rowsToWorkingText(rows: ChartCsvRow[]) {
  return [...rows]
    .map(({ timestamp, key, measurebeatend, bpm }) => {
      const laneOrdStr = key !== null ? keyToLaneOrdString(key) : null
      return [timestamp, laneOrdStr, measurebeatend, bpm]
        .map((s) => s ?? "")
        .join(", ")
    })
    .toReversed()
    .join("\n")
}

function laneOrdStringToKey(laneOrdStr: string): number {
  let key = 0
  laneOrdStr.split("").forEach((ord) => (key |= 1 << (Number(ord) - 1)))
  return key
}

function workingTextToRows(workingText: string): ChartCsvRow[] {
  return workingText
    .split("\n")
    .filter((rowStr) => Boolean(rowStr.trim()))
    .map((rowStr) => {
      const tokens = rowStr.split(/\s*,\s*/)
      if (tokens.length !== 4) {
        throw new Error(`invalid row string: ${rowStr}`)
      }

      return {
        timestamp: Number(tokens[0]),
        key: tokens[1] !== "" ? laneOrdStringToKey(tokens[1]) : null,
        keyon: null,
        keyoff: null,
        measurebeatend: (tokens[2] || null) as "m" | "b" | "e" | null,
        bpm: tokens[3] !== "" ? Number(tokens[3]) : null,
      }
    })
    .toReversed()
}

export default function ChartCsvEditor({
  rows,
  onApply,
}: {
  rows: ChartCsvRow[]
  onApply(newRows: ChartCsvRow[]): void
}) {
  const [workingText, setWorkingText] = useState<string>(
    rowsToWorkingText(rows),
  )

  function highlightChartBasedOnTextareaPosition(event: {
    currentTarget: HTMLTextAreaElement
  }) {
    const textarea = event.currentTarget
    const cursor = textarea.selectionStart
    const prevNewline = textarea.value.lastIndexOf("\n", cursor - 1)
    const timestamp = textarea.value
      .substring(prevNewline)
      .split(/\s*,\s*/)[0]
      ?.trim()
    if (timestamp) {
      const lineElement = document.getElementById(`line${timestamp}`)
      if (lineElement) {
        const lineY = lineElement.getBoundingClientRect().y
        // Only scroll to it if not visible.
        if (lineY < 0 || lineY >= window.innerHeight) {
          lineElement.scrollIntoView({ block: "center" })
        }
        lineElement.classList.add(styles.highlight)
        window.setTimeout(
          () => lineElement.classList.remove(styles.highlight),
          1000,
        )
      }
    }
  }

  return (
    <div className={styles.ChartCsvEditor}>
      <textarea
        id="chartEditorTextarea"
        className={styles.textarea}
        value={workingText}
        onChange={(event) => setWorkingText(event.target.value)}
        onClick={highlightChartBasedOnTextareaPosition}
        onKeyDown={(event) => {
          if (event.metaKey && event.key === "Enter") {
            onApply(workingTextToRows(workingText))
          }
        }}
        onKeyUp={highlightChartBasedOnTextareaPosition}
      />

      <div className={styles.buttons}>
        <button onClick={() => onApply(workingTextToRows(workingText))}>
          Apply
        </button>

        <button
          onClick={() => {
            const rows = workingTextToRows(workingText)
            const text =
              "timestamp,key,keyon,keyoff,measurebeatend,bpm\n" +
              rows
                .map(
                  ({ timestamp, key, keyon, keyoff, measurebeatend, bpm }) =>
                    `${timestamp},${key ?? ""},${keyon ?? ""},${keyoff ?? ""},${
                      measurebeatend ?? ""
                    },${bpm ?? ""}`,
                )
                .join("\n")
            const blob = new Blob([text], { type: "text/plain" })
            window.open(URL.createObjectURL(blob), "_blank")
          }}
        >
          Export
        </button>
      </div>
    </div>
  )
}
