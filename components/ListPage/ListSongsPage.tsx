import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import styles from "./ListSongsPage.module.scss"
import { ListSongsParams, PagyMetadata, useListSongs } from "../../lib/list"
import Link from "next/link"
import SongList from "./SongList"
import RadioList from "../common/RadioList"
import { useRouter } from "next/navigation"
import Select from "../common/Select"
import VersionFolder from "../../models/VersionFolder"
import OtherFolder from "../../models/OtherFolder"
import CommonModal from "../common/CommonModal"
import SongChartDetails from "../common/SongChartDetails"
import Song from "../../models/Song"
import ReactModal from "react-modal"
import { CgNotes } from "react-icons/cg"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { FiMoreHorizontal } from "react-icons/fi"
import Debut from "../../models/Debut"
import More from "../common/More"
import useExtraOptions from "../../lib/useExtraOptions"

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
  id: VersionFolder | OtherFolder
  label?: string
  disabled?: boolean
}[] = [
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
  { id: "bemani" },
  { id: "ddr" },
  { id: "gitadora" },
  { id: "iidx" },
]

const DEBUT_OPTIONS: {
  id: Debut | "dummy1" | "dummy2"
  label?: string
  disabled?: boolean
}[] = [
  { id: "dummy1", label: "-- AC --", disabled: true },
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

function SongOptions({ initialOptions }: { initialOptions: ListSongsParams }) {
  const {
    folder: initialFolder,
    level: initialLevel,
    debut: initialDebut,
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

  const extraOptions = useExtraOptions()

  const router = useRouter()

  function clickFilterButton() {
    const folderParam = folder ? `folder=${folder}` : ""
    const levelParam = levelAdv || level ? `level=${levelAdv || level}` : ""
    const debutParam = debut ? `debut=${debut}` : ""
    const sortParam = `sort=${sortDirection === "desc" ? "-" : ""}${sortBy}`
    const params = [folderParam, levelParam, debutParam, sortParam].filter(
      Boolean,
    )
    router.push(`${window.location.pathname}?${params.join("&")}`)
  }

  function clickResetButton() {
    setFolder(null)
    setLevel(null)
    setLevelAdv(null)
    setDebut(null)
    setSortBy("title")
    setSortDirection("asc")
    router.push(window.location.pathname)
  }

  return (
    <div className={styles.SongOptions}>
      <div className={styles.filter}>
        <p className={styles.header}>
          <span>Filter</span>
        </p>

        <Select
          className={styles.filterSelect}
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

        <div className={styles.level}>
          <Select
            className={styles.filterSelect}
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
            type="text"
            value={levelAdv || ""}
            onChange={(event) => {
              setLevelAdv(event.target.value)
            }}
          />
        </div>

        <Select
          className={styles.filterSelect}
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
      </div>

      <div className={styles.sort}>
        <p className={styles.header}>
          <span>Sort</span>
        </p>
        <div className={styles.leftright}>
          <RadioList
            className={styles.sortByRadios}
            name="sortBy"
            options={[
              ...(extraOptions["songid"] ? [{ id: "id", label: "Id" }] : []),
              ...SORT_BY_OPTIONS,
            ]}
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

function PageLinks({ page, series }: PagyMetadata) {
  return (
    <div className={styles.PageLinks}>
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

export default function ListSongsPage(params: ListSongsParams) {
  const [currentOpenModal, setCurrentOpenModal] = useState<
    "more" | "songDetails" | null
  >(null)
  const [openedSong, setOpenedSong] = useState<Song | null>(null)

  const { data, error, isLoading } = useListSongs(params)

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
      `Error filtering songs: ${JSON.stringify(error.data) || error}`,
    )
    return <div>Uh oh! Something went wrong.</div>
  }
  if (!data || isLoading) {
    return <div>Loading...</div>
  }

  const { songs, pagy } = data

  return (
    <div id="app" className={styles.ListSongsPage}>
      <div className={styles.PageHeader}>
        <div className={styles.songs}>
          <BsMusicNoteBeamed />
          Songs
        </div>

        <div className={styles.spacer} />

        <div className={styles.charts}>
          <Link href="javascript:void(0)" onClick={() => toast("Coming soon!")}>
            <CgNotes />
            Charts
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

      <SongOptions initialOptions={params} />
      <PageLinks {...pagy} />
      <SongList
        songs={songs}
        romanize={!!params.sorts?.[0]?.match(/^-?r/)}
        onSongClick={(song: Song) => {
          ReactModal.setAppElement("#app")
          setOpenedSong(song)
          setCurrentOpenModal("songDetails")
        }}
      />
      <PageLinks {...pagy} />

      <CommonModal
        isOpen={currentOpenModal !== null}
        onClose={() => setCurrentOpenModal(null)}
        showGithub={currentOpenModal === "more"}
      >
        {currentOpenModal === "more" && <More />}

        {currentOpenModal === "songDetails" && openedSong && (
          <SongChartDetails
            song={openedSong}
            showHeader={true}
            showActions={true}
          />
        )}
      </CommonModal>
    </div>
  )
}
