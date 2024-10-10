import cx from "classnames"
import React, { useEffect, useState } from "react"
import styles from "./ListPage.module.scss"
import { ListParams } from "../../lib/list"
import Link from "next/link"
import RadioList from "../common/RadioList"
import { useRouter } from "next/navigation"
import Select from "../common/Select"
import BemaniFolder from "../../models/BemaniFolder"
import Debut from "../../models/Debut"
import Song from "../../models/Song"
import VersionFolder from "../../models/VersionFolder"
import CommonModal from "../common/CommonModal"
import SongChartDetails from "../common/SongChartDetails"
import ReactModal from "react-modal"
import { CgNotes } from "react-icons/cg"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { FiMoreHorizontal } from "react-icons/fi"
import More from "../common/More"
import SongResults from "./SongResults"
import ChartResults from "./ChartResults"
import Chart from "../../models/Chart"

const SORT_BY_OPTIONS = [
  { id: "title", label: "Title" },
  { id: "genre", label: "Genre" },
  { id: "rtitle", label: "Title (romanized)" },
  { id: "rgenre", label: "Genre (romanized)" },
  { id: "debut", label: "Debut version" },
]

const SORT_DIRECTION_OPTIONS = [
  { id: "asc", label: "🔼 Ascending" },
  { id: "desc", label: "🔽 Descending" },
]

const FOLDER_OPTIONS: {
  id: VersionFolder | BemaniFolder | "dummy1" | "dummy2"
  label?: string
  disabled?: boolean
}[] = [
  { id: "dummy1", label: "-- Version folders --", disabled: true },
  { id: "28", label: "jam&fizz" },
  { id: "27", label: "unilab" },
  { id: "26", label: "kaimei riddles" },
  { id: "25", label: "peace" },
  { id: "24", label: "usaneko" },
  { id: "23", label: "eclale" },
  { id: "22", label: "lapistoria" },
  { id: "21", label: "sunny park" },
  { id: "20", label: "fantasia" },
  { id: "19", label: "tune street" },
  { id: "18", label: "sengoku retsuden" },
  { id: "17", label: "the movie" },
  { id: "16", label: "party" },
  { id: "15", label: "adventure" },
  { id: "14", label: "fever" },
  { id: "13", label: "carnival" },
  { id: "12", label: "iroha" },
  { id: "11" },
  { id: "10" },
  { id: "9" },
  { id: "8" },
  { id: "7" },
  { id: "6" },
  { id: "5" },
  { id: "4" },
  { id: "3" },
  { id: "2" },
  { id: "1" },
  { id: "cs" },
  { id: "dummy2", label: "-- Bemani folders --", disabled: true },
  { id: "iidx" },
  { id: "ddr" },
  { id: "gitadora" },
  { id: "jubeat" },
  { id: "reflec" },
  { id: "sdvx" },
  { id: "beatstream" },
  { id: "museca" },
  { id: "nostalgia" },
  { id: "bemani" },
]

const DEBUT_OPTIONS: {
  id: Debut | "dummy1" | "dummy2"
  label?: string
  disabled?: boolean
}[] = [
  { id: "dummy1", label: "-- AC --", disabled: true },
  { id: "28", label: "jam&fizz" },
  { id: "27", label: "unilab" },
  { id: "26", label: "kaimei riddles" },
  { id: "25", label: "peace" },
  { id: "24", label: "usaneko" },
  { id: "23", label: "eclale" },
  { id: "22", label: "lapistoria" },
  { id: "21", label: "sunny park" },
  { id: "20", label: "fantasia" },
  { id: "19", label: "tune street" },
  { id: "18", label: "sengoku retsuden" },
  { id: "17", label: "the movie" },
  { id: "16", label: "party" },
  { id: "15", label: "adventure" },
  { id: "14", label: "fever" },
  { id: "13", label: "carnival" },
  { id: "12", label: "iroha" },
  { id: "11" },
  { id: "10" },
  { id: "eemall" },
  { id: "9" },
  { id: "8" },
  { id: "7" },
  { id: "6" },
  { id: "5" },
  { id: "4" },
  { id: "3" },
  { id: "2" },
  { id: "1" },
  { id: "dummy2", label: "-- CS --", disabled: true },
  { id: "cslively", label: "lively" },
  { id: "cspmp2", label: "portable 2" },
  { id: "csutacchi", label: "utacchi" },
  { id: "cspmp", label: "portable" },
  { id: "cs14", label: "fever CS" },
  { id: "cs13", label: "carnival CS" },
  { id: "cs12", label: "iroha CS" },
  { id: "cs11", label: "11 CS" },
  { id: "cs10", label: "10 CS" },
  { id: "cs9", label: "9 CS" },
  { id: "cs8", label: "8 CS" },
  { id: "csbest", label: "best hits" },
  { id: "cs7", label: "7 CS" },
  { id: "cs6", label: "6 CS" },
  { id: "cs5", label: "5 CS" },
  { id: "cs4", label: "4 CS" },
  { id: "cs3", label: "3 CS" },
  { id: "cs2", label: "2 CS" },
  { id: "cs1", label: "1 CS" },
]

function SongOptions({
  mode,
  initialOptions,
}: {
  mode: "song" | "chart"
  initialOptions: ListParams
}) {
  const {
    folder: initialFolder,
    level: initialLevel,
    debut: initialDebut,
    query: initialQuery,
    sorts,
  } = initialOptions

  const [folder, setFolder] = useState<string | undefined | null>(initialFolder)

  // If initialLevel is a single number, use `level`. Otherwise use `levelAdv`.
  const singleNumber = !!initialLevel?.match(/^\d{1,2}$/)
  const [level, setLevel] = useState<string | undefined | null>(
    singleNumber ? initialLevel : null,
  )
  const [levelAdv, setLevelAdv] = useState<string | undefined | null>(
    singleNumber ? null : initialLevel,
  )

  const [debut, setDebut] = useState<string | undefined | null>(initialDebut)

  const [query, setQuery] = useState<string | undefined | null>(initialQuery)

  // Can't use useExtraOptions because this component is rendered server side.
  const [sortByOptions, setSortByOptions] =
    useState<{ id: string; label: string }[]>(SORT_BY_OPTIONS)
  useEffect(() => {
    const songIdSet = localStorage
      .getItem("extraOptions")
      ?.split(",")
      .some((opt) => opt.trim() === "songid")
    setSortByOptions([
      ...(songIdSet ? [{ id: "id", label: "Id" }] : []),
      ...SORT_BY_OPTIONS,
    ])
  }, [])

  let initialSortBy
  let initialSortDirection
  if (sorts?.length) {
    initialSortBy = sorts[0].replace(/^-/, "")
    initialSortDirection = sorts[0].startsWith("-") ? "desc" : "asc"
  } else {
    initialSortBy = "title"
    initialSortDirection = "asc"
  }
  const [sortBy, setSortBy] = useState<string>(initialSortBy)
  const [sortDirection, setSortDirection] =
    useState<string>(initialSortDirection)

  const router = useRouter()

  function clickFilterButton() {
    const folderParam = folder ? `folder=${folder}` : ""
    const levelParam = levelAdv || level ? `level=${levelAdv || level}` : ""
    const debutParam = debut ? `debut=${debut}` : ""
    const queryParam = query ? `q=${query}` : ""
    const sortParam = `sort=${sortDirection === "desc" ? "-" : ""}${sortBy}`
    const params = [
      folderParam,
      levelParam,
      debutParam,
      queryParam,
      sortParam,
    ].filter(Boolean)
    router.push(`${window.location.pathname}?${params.join("&")}`)
  }

  function clickResetButton() {
    setFolder(null)
    setLevel(null)
    setLevelAdv(null)
    setDebut(null)
    setQuery(null)
    setSortBy("title")
    setSortDirection("asc")
    router.push(window.location.pathname)
  }

  return (
    <div className={cx(styles.SongOptions, styles[mode])}>
      <div className={styles.filter}>
        <p className={styles.header}>
          <span>Filter</span>
        </p>

        <Select
          className={styles.filterControl}
          id="folderSelect"
          label="Folder"
          options={FOLDER_OPTIONS}
          dummyOption="(any)"
          selectedOption={folder || ""}
          setOption={(id) => {
            setFolder(id)
            if (id) {
              setDebut(null)
            }
          }}
        />

        <div className={cx(styles.filterControl, styles.level)}>
          <Select
            id="levelSelect"
            label="Level"
            options={Array(50)
              .fill(0)
              .map((_, i) => {
                const level = String(50 - i)
                return {
                  id: level,
                  label: level,
                }
              })}
            dummyOption="(any)"
            selectedOption={level || ""}
            setOption={(id) => setLevel(id)}
            disabled={!!levelAdv}
          />
          {" or "}
          <input
            id="levelInput"
            type="text"
            value={levelAdv || ""}
            onChange={(event) => {
              setLevelAdv(event.target.value)
            }}
          />
        </div>

        <Select
          className={styles.filterControl}
          id="debutSelect"
          label="Debut"
          options={DEBUT_OPTIONS}
          dummyOption="(any)"
          selectedOption={debut || ""}
          setOption={(id) => {
            setDebut(id)
            if (id) {
              setFolder(null)
            }
          }}
        />

        <div className={cx(styles.filterControl, styles.query)}>
          <label htmlFor="queryInput">Search</label>
          <input
            id="queryInput"
            type="text"
            value={query ?? ""}
            onChange={(event) => {
              setQuery(event.target.value)
            }}
          />
        </div>
      </div>

      <div className={styles.sort}>
        <p className={styles.header}>
          <span>Sort</span>
        </p>
        <div className={styles.leftright}>
          <RadioList
            className={styles.sortByRadios}
            name="sortBy"
            options={sortByOptions}
            selectedOption={sortBy}
            setOption={(id) => setSortBy(id)}
          />
          <RadioList
            name="sortDirection"
            options={SORT_DIRECTION_OPTIONS}
            selectedOption={sortDirection}
            setOption={(id) => setSortDirection(id)}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        <button onClick={clickFilterButton}>Go!</button>
        <button onClick={clickResetButton}>Reset</button>
      </div>
    </div>
  )
}

export default function ListPage({
  mode,
  params,
}: {
  mode: "song" | "chart"
  params: ListParams
}) {
  const [currentOpenModal, setCurrentOpenModal] = useState<
    "more" | "songDetails" | "chartDetails" | null
  >(null)
  const [openedSong, setOpenedSong] = useState<Song | null>(null)
  const [openedChart, setOpenedChart] = useState<Chart | undefined>(undefined)

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

  return (
    <div id="app" className={styles.ListPage}>
      <div className={styles.PageHeader}>
        {mode === "song" ? (
          <>
            <div className={cx(styles.thisPage, styles.songs)}>
              <BsMusicNoteBeamed />
              Songs
            </div>

            <div className={styles.spacer} />

            <div className={cx(styles.otherPage, styles.charts)}>
              <Link href="/charts">
                <CgNotes />
                Charts
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={cx(styles.thisPage, styles.charts)}>
              <CgNotes />
              Charts
            </div>
            <div className={styles.spacer} />

            <div className={cx(styles.otherPage, styles.songs)}>
              <Link href="/songs">
                <BsMusicNoteBeamed />
                Songs
              </Link>
            </div>
          </>
        )}

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

      <SongOptions mode={mode} initialOptions={params} />

      {mode === "song" ? (
        <SongResults
          params={params}
          onSongClick={(song: Song) => {
            ReactModal.setAppElement("#app")
            setOpenedSong(song)
            setCurrentOpenModal("songDetails")
          }}
        />
      ) : (
        <ChartResults
          params={params}
          onChartClick={(chart: Chart) => {
            ReactModal.setAppElement("#app")
            setOpenedChart(chart)
            setCurrentOpenModal("chartDetails")
          }}
        />
      )}

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

        {currentOpenModal === "songDetails" && openedSong && (
          <SongChartDetails
            song={openedSong}
            showHeader={true}
            showActions={true}
          />
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
