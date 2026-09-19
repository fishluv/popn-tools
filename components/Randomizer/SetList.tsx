import cx from "classnames"
import React from "react"
import toast from "react-hot-toast"
import ReactModal from "react-modal"
import ChartSet from "./ChartSet"
import styles from "./SetList.module.scss"
import { ChartDisplayOptions } from "../../lib/randomizer/ChartDisplay"
import { ChartDataSet } from "./RandomizerApp"
import { FaArrowDown, FaRegCopy, FaTrash } from "react-icons/fa"
import { FiMoreVertical } from "react-icons/fi"
import ChartCard from "./ChartCard"

interface SetListProps {
  extraClass?: string
  chartDataSets: ChartDataSet[]
  chartDisplayOptions: ChartDisplayOptions
  showSranLevel: boolean
  onDeleteChartSet(deleteIndex: number): void
  onDeleteChartSetsAfter(deleteAfterIndex: number): void
}

interface SetListState {
  openedChartSetIndex: number
}

export default class SetList extends React.Component<
  SetListProps,
  SetListState
> {
  constructor(props: SetListProps) {
    super(props)

    this.state = {
      openedChartSetIndex: -1,
    }
  }

  onCopyClick = async () => {
    const { chartDataSets } = this.props
    const { openedChartSetIndex } = this.state
    const { charts } = chartDataSets[openedChartSetIndex]

    const chartsDump =
      charts
        .map(({ title, genre, difficulty, level }) => {
          let parts: string[]
          if (title === genre) {
            parts = [title, difficulty.toUpperCase(), level.toString()]
          } else {
            parts = [
              title,
              `(${genre})`,
              difficulty.toUpperCase(),
              level.toString(),
            ]
          }
          return parts.join(" ")
        })
        .join("\n") + "\n"
    await navigator.clipboard.writeText(chartsDump)
    toast(`Copied chart set:\n\n${chartsDump}`)
  }

  onDeleteClick = () => {
    const { chartDataSets, onDeleteChartSet } = this.props
    const { openedChartSetIndex } = this.state

    if (
      openedChartSetIndex < 0 ||
      openedChartSetIndex >= chartDataSets.length
    ) {
      return
    }

    if (
      window.confirm(
        `Delete this chart set? (${chartDataSets[openedChartSetIndex].charts.length} charts)`,
      )
    ) {
      onDeleteChartSet(openedChartSetIndex)
      this.setState({ openedChartSetIndex: -1 })
    }
  }

  onDeleteFollowingClick = () => {
    const { chartDataSets, onDeleteChartSetsAfter } = this.props
    const { openedChartSetIndex } = this.state

    // Note the length-1. Last chart set doesn't have any following chart sets.
    if (
      openedChartSetIndex < 0 ||
      openedChartSetIndex >= chartDataSets.length - 1
    ) {
      return
    }

    if (
      window.confirm(
        `Delete all following chart sets? (${
          chartDataSets.length - 1 - openedChartSetIndex
        } chart sets)`,
      )
    ) {
      onDeleteChartSetsAfter(openedChartSetIndex)
      this.setState({ openedChartSetIndex: -1 })
    }
  }

  render() {
    const { extraClass, chartDataSets, chartDisplayOptions, showSranLevel } = this.props
    const { openedChartSetIndex } = this.state
    const openedCharts = chartDataSets[openedChartSetIndex]?.charts ?? []
    const openedChartSetDrawnAt = chartDataSets[openedChartSetIndex]?.drawnAt

    return (
      <section className={cx(extraClass, styles.SetList)}>
        {chartDataSets.map((chartDataSet, index) => (
          // Use drawnAt for key. Fall back to index for old data.
          <div
            key={chartDataSet.drawnAt || index}
            className={styles.chartSetAndButton}
          >
            <ChartSet
              extraClass={styles.borderBetween}
              chartDataSet={chartDataSet}
              // Colors should be reverse order so they don't change as new chart sets are drawn.
              colorIndex={chartDataSets.length - 1 - index}
              chartDisplayOptions={chartDisplayOptions}
              showSranLevel={showSranLevel}
            />

            <button
              className={styles.moreButton}
              title="More chart set actions"
              onClick={() => {
                ReactModal.setAppElement("#app")
                this.setState({ openedChartSetIndex: index })
              }}
            >
              <FiMoreVertical strokeWidth="2" />
            </button>
          </div>
        ))}

        <ReactModal
          id="chartSetModal" // Used to suppress keyboard shortcuts in ControlPanel.
          isOpen={openedChartSetIndex >= 0}
          contentLabel="Chart set controls modal"
          onRequestClose={() => this.setState({ openedChartSetIndex: -1 })}
          style={{
            overlay: { zIndex: 20 },
            content: {
              position: "absolute",
              top: "30%",

              margin: "0 auto",
              padding: "1rem",
              minWidth: "220px",
              maxWidth: "320px",
              height: "fit-content",

              background: "#fdfdfd",

              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            },
          }}
        >
          <div className={styles.chartSetModal}>
            <div className={styles.firstChart}>
              {openedCharts.length ? (
                <>
                  <ChartCard
                    chartData={openedCharts[0]}
                    chartDisplayOptions={{
                      ...chartDisplayOptions,
                      displayStyle: "compact",
                    }}
                    showSranLevel={showSranLevel}
                  />
                  {openedCharts.length > 1 && (
                    <span className={styles.plusMore}>
                      {`+ ${openedCharts.length - 1} more`}
                    </span>
                  )}
                </>
              ) : (
                "No charts drawn"
              )}
            </div>

            {chartDisplayOptions.showDrawnAt && openedChartSetDrawnAt && (
              <span className={styles.drawnAt}>
                {new Date(openedChartSetDrawnAt).toLocaleString()}
              </span>
            )}

            <button
              title="Copy chart set to clipboard"
              onClick={this.onCopyClick}
            >
              <FaRegCopy /> Copy to clipboard
            </button>

            <button
              className={styles.delete}
              title="Delete chart set"
              onClick={this.onDeleteClick}
            >
              <FaTrash /> Delete
            </button>

            <button
              className={styles.delete}
              title="Delete all following chart sets"
              onClick={this.onDeleteFollowingClick}
              disabled={openedChartSetIndex >= chartDataSets.length - 1}
            >
              <FaTrash />
              <FaArrowDown className={styles.downArrow} /> Delete following
            </button>
          </div>
        </ReactModal>
      </section>
    )
  }
}
