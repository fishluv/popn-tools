import cx from "classnames"
import React, { useEffect, useState } from "react"
import styles from "./ListPage.module.scss"
import { IncludeOption, ListParams, Sort, SortField } from "../../lib/list"
import Link from "next/link"
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
import { FaTrash } from "react-icons/fa"
import { FiMoreHorizontal } from "react-icons/fi"
import { ImArrowDownLeft2, ImArrowUpLeft2 } from "react-icons/im"
import { LuToggleLeft, LuToggleRight } from "react-icons/lu"
import More from "../common/More"
import SongResults from "./SongResults"
import ChartResults from "./ChartResults"
import Chart from "../../models/Chart"
import Difficulty from "../../models/Difficulty"
import { parseExtraOptions } from "../../lib/useExtraOptions"

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

function SortMultiSelect({
  className,
  availableSortFieldsAndLabels,
  selectedSorts,
  setSorts,
}: {
  className?: string
  availableSortFieldsAndLabels: { field: SortField; label: string }[]
  selectedSorts: Sort[]
  setSorts(sorts: Sort[]): void
}) {
  const selectedFieldsAndLabels: {
    field: SortField
    direction: "asc" | "desc"
    label: string
  }[] = selectedSorts.map((sort) => {
    const isThisDesc = sort.startsWith("-")
    const thisField = (isThisDesc ? sort.slice(1) : sort) as SortField
    const sortFieldAndLabel = availableSortFieldsAndLabels.find(
      ({ field }) => field === thisField,
    )!
    return {
      field: sortFieldAndLabel.field,
      direction: isThisDesc ? "desc" : "asc",
      label: sortFieldAndLabel.label,
    }
  })
  const unselectedFieldsAndLabels = availableSortFieldsAndLabels.filter(
    ({ field }) =>
      !selectedSorts.includes(field) && !selectedSorts.includes(`-${field}`),
  )

  return (
    <div className={cx(className, styles.SortMultiSelect)}>
      <Select
        id="addSortSelect"
        label=""
        options={unselectedFieldsAndLabels.map(({ field, label }) => ({
          id: field,
          label,
        }))}
        dummyOption="Add a sort field"
        selectedOption=""
        setOption={(id) => setSorts([...selectedSorts, id as Sort])}
      />

      <div className={styles.selectedSorts}>
        {selectedFieldsAndLabels.map(({ field, direction, label }, index) => {
          function switchToAsc() {
            const newSorts = [...selectedSorts]
            newSorts[index] = field
            setSorts(newSorts)
          }
          function switchToDesc() {
            const newSorts = [...selectedSorts]
            newSorts[index] = `-${field}`
            setSorts(newSorts)
          }

          return (
            <div
              key={field}
              className={cx(
                styles.sortOption,
                styles.selected,
                direction === "desc" ? styles.desc : styles.asc,
              )}
            >
              <button
                className={styles.removeButton}
                disabled={selectedSorts.length === 1}
                onClick={() => {
                  const newSorts = [...selectedSorts]
                  newSorts.splice(index, 1)
                  setSorts(newSorts)
                }}
              >
                <FaTrash size="1rem" />
              </button>

              <span className={styles.sortField}>{label}</span>

              <div className={cx(styles.ascDesc, styles[direction])}>
                <label className={styles.asc} onClick={switchToAsc}>
                  Asc
                </label>

                <button
                  onClick={direction === "asc" ? switchToDesc : switchToAsc}
                >
                  {direction === "asc" ? (
                    <LuToggleLeft size="1.5rem" />
                  ) : (
                    <LuToggleRight size="1.5rem" />
                  )}
                </button>

                <label className={styles.desc} onClick={switchToDesc}>
                  Desc
                </label>
              </div>

              {index >= 1 && (
                <div className={styles.swapContainer}>
                  <button
                    className={styles.swapButton}
                    onClick={() => {
                      const newSorts = [...selectedSorts]
                      const temp = newSorts[index - 1]
                      newSorts[index - 1] = newSorts[index]
                      newSorts[index] = temp
                      setSorts(newSorts)
                    }}
                  >
                    <div className={styles.upleft}>
                      <ImArrowUpLeft2 />
                    </div>
                    <div className={styles.downleft}>
                      <ImArrowDownLeft2 />
                    </div>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Options({
  className,
  mode,
  initialOptions,
}: {
  className?: string
  mode: "song" | "chart"
  initialOptions: ListParams
}) {
  // We want to initialize from initialOptions but it takes some time to
  // hydrate from url params, so we do the real init below in a useEffect.
  const [folder, setFolder] = useState<string | undefined | null>(null)
  const [level, setLevel] = useState<string | undefined | null>(null)
  const [levelAdv, setLevelAdv] = useState<string | undefined | null>(null)
  const [debut, setDebut] = useState<string | undefined | null>(null)
  const [query, setQuery] = useState<string | undefined | null>(null)
  const [omnimix, setOmnimix] = useState<IncludeOption | undefined | null>(null)
  const [diffs, setDiffs] = useState<Difficulty[]>(["e", "n", "h", "ex"])
  const [onlyHardest, setOnlyHardest] = useState<boolean | undefined | null>(
    false,
  )
  const [bpm, setBpm] = useState<string | undefined | null>(null)
  const [bpmType, setBpmType] = useState<string | undefined | null>(null)
  const [duration, setDuration] = useState<string | undefined | null>(null)
  const [notes, setNotes] = useState<string | undefined | null>(null)
  const [holdNotes, setHoldNotes] = useState<string | undefined | null>(null)
  const [sranLevel, setSranLevel] = useState<string | undefined | null>(null)
  const [sranLevelAdv, setSranLevelAdv] = useState<string | undefined | null>(
    null,
  )
  const [timing, setTiming] = useState<string | undefined | null>(null)
  const [sorts, setSorts] = useState<Sort[] | undefined | null>(null)

  useEffect(() => {
    // For level props, if initial is single number, use normal version.
    // Otherwise use advanced version.
    const { level: initialLevel, sranLevel: initialSranLevel } = initialOptions
    const useLevel = !!initialLevel?.match(/^\d{1,2}$/)
    const useSranLevel =
      initialSranLevel === "1-19" || !!initialSranLevel?.match(/^\d{1,2}[ab]?$/)

    setFolder(initialOptions.folder)
    setLevel(useLevel ? initialLevel : null)
    setLevelAdv(useLevel ? null : initialLevel)
    setDebut(initialOptions.debut)
    setQuery(initialOptions.query)
    setOmnimix(initialOptions.omnimix || "include")
    setDiffs(initialOptions.diffs || ["e", "n", "h", "ex"])
    setOnlyHardest(initialOptions.onlyHardest)
    setBpm(initialOptions.bpm)
    setBpmType(initialOptions.bpmType)
    setDuration(initialOptions.duration)
    setNotes(initialOptions.notes)
    setHoldNotes(initialOptions.holdNotes)
    setSranLevel(useSranLevel ? initialSranLevel : null)
    setSranLevelAdv(useSranLevel ? null : initialSranLevel)
    setTiming(initialOptions.timing)
    setSorts(initialOptions.sorts?.length ? initialOptions.sorts : ["title"])
  }, [initialOptions])

  const [availableSortFields, setAvailableSortFields] = useState<
    { field: SortField; label: string }[]
  >(() => {
    if (mode === "song") {
      return [
        { field: "title", label: "Title" },
        { field: "rtitle", label: "Title (rom)" },
        { field: "genre", label: "Genre" },
        { field: "rgenre", label: "Genre (rom)" },
        { field: "debut", label: "Debut" },
      ]
    } else {
      return [
        { field: "title", label: "Title" },
        { field: "rtitle", label: "Title (rom)" },
        { field: "genre", label: "Genre" },
        { field: "rgenre", label: "Genre (rom)" },
        { field: "debut", label: "Debut" },
        { field: "level", label: "Level" },
        { field: "bpm", label: "Bpm" },
        { field: "duration", label: "Duration" },
        { field: "notes", label: "Notes" },
        { field: "hnotes", label: "Holds" },
        { field: "jrating", label: "Rating" },
        { field: "srlevel", label: "S乱 level" },
      ]
    }
  })

  // Need this workaround because page components are generated server-side.
  const [extraOptions, setExtraOptions] = useState<Record<string, boolean>>({})
  useEffect(() => {
    setExtraOptions(
      parseExtraOptions(localStorage.getItem("extraOptions") || ""),
    )
  }, [])

  useEffect(() => {
    if (mode === "song" && extraOptions["songid"]) {
      setAvailableSortFields((old) => [{ field: "id", label: "Id" }, ...old])
    }
  }, [mode, extraOptions])

  const [chartOptionsExpanded, setChartOptionsExpanded] =
    useState<boolean>(false)
  useEffect(() => {
    const storedChartOptionsExpanded = localStorage.getItem(
      "list.chartOptionsExpanded",
    )
    setChartOptionsExpanded(storedChartOptionsExpanded === "true")
  }, [])

  const router = useRouter()

  function clickFilterButton() {
    const durSec = duration?.replaceAll(/(\d):(\d{2})/g, (_match, min, sec) => {
      return String(Number(min) * 60 + Number(sec))
    })
    const params = [
      folder ? `folder=${folder}` : "",
      levelAdv || level ? `level=${levelAdv || level}` : "",
      sranLevelAdv || sranLevel ? `srlevel=${sranLevelAdv || sranLevel}` : "",
      debut ? `debut=${debut}` : "",
      query ? `q=${query}` : "",
      omnimix && ["exclude", "only"].includes(omnimix) ? `omni=${omnimix}` : "",
      diffs.length === 4 ? "" : `diff=${diffs.join(",")}`,
      onlyHardest ? "hardest=1" : "",
      bpm ? `bpm=${bpm}` : "",
      bpmType ? `bpmtype=${bpmType}` : "",
      durSec ? `duration=${durSec}` : "",
      notes ? `notes=${notes}` : "",
      holdNotes ? `hnotes=${holdNotes}` : "",
      timing ? `timing=${timing}` : "",
      sorts ? `sort=${sorts.join(",")}` : "",
    ].filter(Boolean)
    router.push(`${window.location.pathname}?${params.join("&")}`)
  }

  function clickResetButton() {
    setFolder(null)
    setLevel(null)
    setLevelAdv(null)
    setSranLevel(null)
    setSranLevelAdv(null)
    setDebut(null)
    setQuery(null)
    setOmnimix("include")
    setDiffs(["e", "n", "h", "ex"])
    setBpm(null)
    setBpmType(null)
    setDuration(null)
    setNotes(null)
    setHoldNotes(null)
    setTiming(null)
    setSorts(["title"])
    router.push(window.location.pathname)
  }

  function handleDiffChange(
    event: React.ChangeEvent<HTMLInputElement>,
    selectedDiff: Difficulty,
  ) {
    if (event.target.checked) {
      // Shouldn't already be there but check just in case.
      if (!diffs.includes(selectedDiff)) {
        setDiffs([...diffs, selectedDiff])
      }
    } else {
      setDiffs(diffs.filter((d) => d !== selectedDiff))
    }
  }

  return (
    <div className={cx(className, styles.Options, styles[mode])}>
      <div className={styles.filter}>
        <p className={styles.header}>
          <span>Filter</span>
        </p>

        <div className={styles.controls}>
          <Select
            className={cx(styles.filterControl, folder ? styles.changed : "")}
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
              className={cx(
                styles.filterControl,
                level && !levelAdv ? styles.changed : "",
              )}
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
              className={levelAdv ? styles.changed : ""}
              id="levelInput"
              type="text"
              value={levelAdv || ""}
              onChange={(event) => {
                setLevelAdv(event.target.value)
              }}
            />
          </div>

          <Select
            className={cx(styles.filterControl, debut ? styles.changed : "")}
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
              className={query ? styles.changed : ""}
              id="queryInput"
              type="text"
              value={query ?? ""}
              onChange={(event) => {
                setQuery(event.target.value)
              }}
            />
          </div>

          <Select
            className={cx(
              styles.filterControl,
              styles.omnimix,
              omnimix !== "include" ? styles.changed : "",
            )}
            id="omnimixSelect"
            label="Omni"
            options={[
              { id: "include", label: "Include" },
              { id: "exclude", label: "Exclude" },
              { id: "only", label: "Only" },
            ]}
            selectedOption={omnimix || "include"}
            setOption={(id: IncludeOption) => {
              setOmnimix(id)
            }}
          />

          {mode === "chart" && (
            <>
              <div className={styles.filterControl}>
                <label className={diffs.length !== 4 ? styles.changed : ""}>
                  Diff.
                </label>

                <div className={styles.diffCheckboxes}>
                  <div className={styles.filterControl}>
                    <input
                      id="easyInput"
                      type="checkbox"
                      checked={diffs.includes("e")}
                      disabled={diffs.length === 1 && diffs[0] === "e"}
                      onChange={(event) => handleDiffChange(event, "e")}
                    />
                    <label
                      htmlFor="easyInput"
                      className={cx(styles.e, styles.compact)}
                    >
                      easy
                    </label>
                  </div>

                  <div className={styles.filterControl}>
                    <input
                      id="normalInput"
                      type="checkbox"
                      checked={diffs.includes("n")}
                      disabled={diffs.length === 1 && diffs[0] === "n"}
                      onChange={(event) => handleDiffChange(event, "n")}
                    />
                    <label
                      htmlFor="normalInput"
                      className={cx(styles.n, styles.compact)}
                    >
                      normal
                    </label>
                  </div>

                  <div className={styles.filterControl}>
                    <input
                      id="hyperInput"
                      type="checkbox"
                      checked={diffs.includes("h")}
                      disabled={diffs.length === 1 && diffs[0] === "h"}
                      onChange={(event) => handleDiffChange(event, "h")}
                    />
                    <label
                      htmlFor="hyperInput"
                      className={cx(styles.h, styles.compact)}
                    >
                      hyper
                    </label>
                  </div>

                  <div className={styles.filterControl}>
                    <input
                      id="exInput"
                      type="checkbox"
                      checked={diffs.includes("ex")}
                      disabled={diffs.length === 1 && diffs[0] === "ex"}
                      onChange={(event) => handleDiffChange(event, "ex")}
                    />
                    <label
                      htmlFor="exInput"
                      className={cx(styles.ex, styles.compact)}
                    >
                      ex
                    </label>
                  </div>
                </div>
              </div>

              <div className={cx(styles.filterControl, styles.onlyHardest)}>
                <input
                  id="hardestInput"
                  type="checkbox"
                  checked={!!onlyHardest}
                  onChange={(event) => setOnlyHardest(event.target.checked)}
                />
                <label
                  htmlFor="hardestInput"
                  className={onlyHardest ? styles.changed : ""}
                >{`Only song's hardest`}</label>
              </div>

              {chartOptionsExpanded ? (
                <>
                  <div className={cx(styles.filterControl, styles.bpm)}>
                    <label htmlFor="bpmInput">Bpm</label>
                    <input
                      className={bpm ? styles.changed : ""}
                      id="bpmInput"
                      type="text"
                      value={bpm ?? ""}
                      onChange={(event) => {
                        setBpm(event.target.value)
                      }}
                    />
                  </div>

                  <Select
                    className={cx(
                      styles.filterControl,
                      styles.bpmType,
                      bpmType ? styles.changed : "",
                    )}
                    id="bpmTypeSelect"
                    label=""
                    options={[
                      { id: "constant", label: "Constant bpm" },
                      { id: "majority", label: "Main bpm = majority" },
                      { id: "nonmajority", label: "Main bpm = nonmajority" },
                    ]}
                    dummyOption="(any bpm type)"
                    selectedOption={bpmType || ""}
                    setOption={(id) => {
                      setBpmType(id)
                    }}
                  />

                  <div className={cx(styles.filterControl, styles.duration)}>
                    <label htmlFor="durationInput">Durat.</label>
                    <input
                      className={duration ? styles.changed : ""}
                      id="durationInput"
                      type="text"
                      value={duration ?? ""}
                      onChange={(event) => {
                        setDuration(event.target.value)
                      }}
                    />
                  </div>

                  <div className={cx(styles.filterControl, styles.notes)}>
                    <label htmlFor="notesInput">Notes</label>
                    <input
                      className={notes ? styles.changed : ""}
                      id="notesInput"
                      type="text"
                      value={notes ?? ""}
                      onChange={(event) => {
                        setNotes(event.target.value)
                      }}
                    />
                  </div>

                  <div className={cx(styles.filterControl, styles.holdNotes)}>
                    <label htmlFor="holdNotesInput">Holds</label>
                    <input
                      className={holdNotes ? styles.changed : ""}
                      id="holdNotesInput"
                      type="text"
                      value={holdNotes ?? ""}
                      onChange={(event) => {
                        setHoldNotes(event.target.value)
                      }}
                    />
                  </div>

                  <div className={cx(styles.filterControl, styles.sranLevel)}>
                    <Select
                      className={cx(
                        styles.filterControl,
                        sranLevel && !sranLevelAdv ? styles.changed : "",
                      )}
                      id="sranLevelSelect"
                      label="S乱"
                      options={[
                        { id: "1-19", label: "1–19" },
                        ...Array(19)
                          .fill(0)
                          .map((_, i) => {
                            const sranLevel = String(19 - i)
                            return {
                              id: sranLevel,
                              label: sranLevel,
                            }
                          }),
                      ]}
                      dummyOption="(n/a)"
                      selectedOption={sranLevel || ""}
                      setOption={(id) => setSranLevel(id)}
                      disabled={!!sranLevelAdv}
                    />
                    {" or "}
                    <input
                      className={sranLevelAdv ? styles.changed : ""}
                      id="sranLevelInput"
                      type="text"
                      value={sranLevelAdv || ""}
                      onChange={(event) => {
                        setSranLevelAdv(event.target.value)
                      }}
                    />
                  </div>

                  <Select
                    className={cx(
                      styles.filterControl,
                      styles.timing,
                      timing ? styles.changed : "",
                    )}
                    id="timingSelect"
                    label="Timing"
                    options={[
                      { id: "standard", label: "Standard" },
                      { id: "nonstandard", label: "Nonstandard" },
                      { id: "variable", label: "Variable" },
                    ]}
                    dummyOption="(any)"
                    selectedOption={timing || ""}
                    setOption={(id) => {
                      setTiming(id)
                    }}
                  />

                  <button
                    className={styles.collapseButton}
                    id="collapseChartOptionsButton"
                    onClick={() => {
                      setChartOptionsExpanded(false)
                      localStorage.setItem("list.chartOptionsExpanded", "false")
                      window.requestAnimationFrame(
                        () =>
                          document
                            .getElementById("expandChartOptionsButton")
                            ?.focus(),
                      )
                    }}
                  >
                    Less
                  </button>
                </>
              ) : (
                <button
                  className={styles.expandButton}
                  id="expandChartOptionsButton"
                  onClick={() => {
                    setChartOptionsExpanded(true)
                    localStorage.setItem("list.chartOptionsExpanded", "true")
                    window.requestAnimationFrame(
                      () =>
                        document
                          .getElementById("collapseChartOptionsButton")
                          ?.focus(),
                    )
                  }}
                >
                  More
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.sort}>
        <p className={styles.header}>
          <span>Sort</span>
        </p>

        {mode === "song" && (
          <SortMultiSelect
            availableSortFieldsAndLabels={availableSortFields}
            selectedSorts={sorts ?? []}
            setSorts={setSorts}
          />
        )}

        {mode === "chart" && (
          <SortMultiSelect
            availableSortFieldsAndLabels={availableSortFields}
            selectedSorts={sorts ?? []}
            setSorts={setSorts}
          />
        )}
      </div>

      <div className={styles.buttons}>
        <button onClick={clickFilterButton}>Go!</button>
        <button onClick={clickResetButton}>Reset</button>
      </div>
    </div>
  )
}

type WhenOption = "default" | "always" | "never"
const WHEN_SELECT_OPTIONS: { id: WhenOption; label: string }[] = [
  {
    id: "default",
    label: "Default",
  },
  {
    id: "always",
    label: "Always",
  },
  {
    id: "never",
    label: "Never",
  },
]

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

  const [romanizeOpt, setRomanizeOpt] = useState<WhenOption>("default")
  const [genreOpt, setGenreOpt] = useState<WhenOption>("default")

  // Can't useLocalStorage because this component is rendered server-side.
  useEffect(() => {
    const storedRomanize = localStorage.getItem("list.romanize") || "default"
    setRomanizeOpt(storedRomanize as WhenOption)

    const storedGenre = localStorage.getItem("list.genre") || "default"
    setGenreOpt(storedGenre as WhenOption)
  }, [])

  const romanize =
    romanizeOpt === "default"
      ? !!params.sorts?.some((sort) => sort.match(/^-?r/))
      : romanizeOpt === "always"
  const preferGenre =
    genreOpt === "default"
      ? !!params.sorts?.some((sort) => sort.match(/genre/))
      : genreOpt === "always"

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
      <div className={cx(styles.main, styles.PageHeader)}>
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

      <Options className={styles.main} mode={mode} initialOptions={params} />

      {mode === "song" ? (
        <SongResults
          className={styles.main}
          params={params}
          onSongClick={(song: Song) => {
            ReactModal.setAppElement("#app")
            setOpenedSong(song)
            setCurrentOpenModal("songDetails")
          }}
          romanize={romanize}
        />
      ) : (
        <ChartResults
          params={params}
          onChartClick={(chart: Chart) => {
            ReactModal.setAppElement("#app")
            setOpenedChart(chart)
            setCurrentOpenModal("chartDetails")
          }}
          romanize={romanize}
          preferGenre={preferGenre}
        />
      )}

      <CommonModal
        isOpen={currentOpenModal !== null}
        onClose={() => setCurrentOpenModal(null)}
        showGithub={currentOpenModal === "more"}
      >
        {currentOpenModal === "more" && (
          <More className={styles.More}>
            <h6>Display options</h6>

            <Select
              className={styles.romanizeSelect}
              id="romanizeSelect"
              label="Romanize title/genre"
              options={WHEN_SELECT_OPTIONS}
              selectedOption={romanizeOpt}
              setOption={(opt: WhenOption) => {
                setRomanizeOpt(opt)
                localStorage.setItem("list.romanize", opt)
              }}
            />

            {mode === "chart" && (
              <Select
                className={styles.genreSelect}
                id="genreSelect"
                label="Prefer genre"
                options={WHEN_SELECT_OPTIONS}
                selectedOption={genreOpt}
                setOption={(opt: WhenOption) => {
                  setGenreOpt(opt)
                  localStorage.setItem("list.genre", opt)
                }}
              />
            )}

            <h6>What is this?</h6>
            <p>{`This is a tool for browsing pop'n music songs and charts.`}</p>

            <h6>Tips</h6>
            <ul>
              {mode === "song" && (
                <li>
                  For <code>Level</code>, you can use <code>-</code> to specify
                  a range, <code>and</code> to add additional requirements, and{" "}
                  <code>,</code> to include multiple different requirements.
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
              )}

              {mode === "chart" && (
                <li>
                  For <code>Level</code>, <code>Bpm</code>, <code>Dur</code>,{" "}
                  <code>Notes</code>, <code>Holds</code>, and <code>S乱</code>,
                  you can use <code>-</code> to specify a range and{" "}
                  <code>,</code> to specify multiple values or ranges.
                </li>
              )}

              <li>
                <code>Search</code> works the same way as on the{" "}
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
