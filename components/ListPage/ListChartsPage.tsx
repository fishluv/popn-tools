import cx from "classnames"
import React, { useEffect, useState } from "react"
import styles from "./ListChartsPage.module.scss"
import { ListChartsParams, PagyMetadata, useListCharts } from "../../lib/list"
import Link from "next/link"
import CommonModal from "../common/CommonModal"
import SongChartDetails from "../common/SongChartDetails"
import ReactModal from "react-modal"
import { CgNotes } from "react-icons/cg"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { FiMoreHorizontal } from "react-icons/fi"
import More from "../common/More"
import Chart from "../../models/Chart"
import Table from "../common/Table"

function PageInfo({ count, page, series }: PagyMetadata) {
  return (
    <div className={styles.PageInfo}>
      <span>{count} total</span>
      {"•"}
      <span>Page</span>
      {series.map((pageOrGap, index) => {
        if (pageOrGap === "gap") {
          return <span key={index}>...</span>
        }
        if (Number(pageOrGap) === page) {
          return <span key={index}>{page}</span>
        }

        const newParams = new URLSearchParams(window.location.search)
        newParams.set("page", String(pageOrGap))
        return (
          <span key={index}>
            <Link href={`${window.location.pathname}?${newParams}`}>
              {pageOrGap}
            </Link>
          </span>
        )
      })}
    </div>
  )
}

export default function ListChartsPage(params: ListChartsParams) {
  const [currentOpenModal, setCurrentOpenModal] = useState<
    "more" | "chartDetails" | null
  >(null)
  const [openedChart, setOpenedChart] = useState<Chart | null>(null)

  const { data, error, isLoading } = useListCharts(params)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const { key, repeat } = event
      if (repeat) {
        return
      }

      // If modal is open, it should handle its own keyboard shortcuts.
      if (currentOpenModal !== null) {
        return
      }

      // Make sure no text inputs on the main page are active!
      if (
        document.activeElement &&
        ["levelInput", "queryInput"].includes(document.activeElement.id)
      ) {
        return
      }

      if (key === "s") {
        ReactModal.setAppElement("#app")
        setCurrentOpenModal("more")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentOpenModal])

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
    <div id="app" className={styles.ListChartsPage}>
      <div className={styles.PageHeader}>
        <div className={styles.charts}>
          <CgNotes />
          Charts
        </div>

        <div className={styles.spacer} />

        <div className={styles.songs}>
          <Link href="/songs">
            <BsMusicNoteBeamed />
            Songs
          </Link>
        </div>

        <button
          className={styles.moreButton}
          onClick={() => {
            ReactModal.setAppElement("#app")
            setCurrentOpenModal("more")
          }}
        >
          <FiMoreHorizontal />
        </button>
      </div>

      <PageInfo {...pagy} />

      <Table
        records={charts}
        columns={[
          {
            label: "",
            markup: (rec: Chart) => `${rec.difficulty} ${rec.level}`,
          },
          { label: "Title", markup: (rec: Chart) => rec.song?.remywikiTitle },
        ]}
      />

      <PageInfo {...pagy} />

      <CommonModal
        isOpen={currentOpenModal !== null}
        onClose={() => setCurrentOpenModal(null)}
        showGithub={currentOpenModal === "more"}
      >
        {currentOpenModal === "more" && (
          <More className={styles.More}>
            <h6>What is this?</h6>
            <p>{`This is a tool for browsing pop'n music songs and charts.`}</p>
            <h6>Tips</h6>
            <ul>
              <li>
                You can use <code>and</code> and <code>,</code> to specify a
                combination of levels and level ranges.
                <br />(<code>and</code> takes precedence over <code>,</code>.)
                <br />
                Examples:
                <ul>
                  <li>
                    <code>30-32</code>
                    <br />
                    Songs with a chart level 30-32.
                  </li>
                  <li>
                    <code>30-32, 34</code>
                    <br /> Songs with a chart level 30-32 or 34.
                  </li>
                  <li>
                    <code>34 and 38</code>
                    <br />
                    Songs with one chart level 34 and <em> another </em> chart
                    level 38.
                  </li>
                  <li>
                    <code>30-32, 34 and 38</code>
                    <br />
                    Songs that either:
                    <ul>
                      <li>
                        have a chart level 30-32, <em>or</em>
                      </li>
                      <li>
                        have one chart level 34 and another chart level 38.
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li>
                The <code>Search</code> field works the same way as on the{" "}
                <Link href="/search" target="_blank">
                  Quick Search page
                </Link>
                .
              </li>

              <li>
                <code>s</code> and <code>esc</code> open and close this modal.
              </li>
            </ul>
          </More>
        )}

        {currentOpenModal === "chartDetails" && openedChart && (
          <SongChartDetails
            chartToOpen={openedChart}
            showHeader={true}
            showActions={true}
          />
        )}
      </CommonModal>
    </div>
  )
}
