import cx from "classnames"
import markdownit from "markdown-it"
import React from "react"
import ReactModal from "react-modal"
import toast from "react-hot-toast"
import { VersionFolder, BemaniFolder } from "popn-db-js"
import styles from "./ControlPanel.module.scss"
import { ChartDisplayOptions } from "../../lib/randomizer/ChartDisplay"
import { ChartQuerySampleOptions, getDatabase } from "./RandomizerApp"
import { ChartDrawOptions, parseIncludeOption } from "../../lib/randomizer/ChartDrawOptions"
import { BsGithub } from "react-icons/bs"
import { FaCalculator, FaTrash } from "react-icons/fa"
import { RiSettings3Fill } from "react-icons/ri"
import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc"

const md = markdownit({ html: false, breaks: true, linkify: true })

const FOLDER_OPTIONS: {
  id: VersionFolder | BemaniFolder | "dummy1" | "dummy2"
  label?: string
  disabled?: boolean
}[] = [
  { id: "dummy1", label: "-- Version folders --", disabled: true },
  { id: "29", label: "high cheers" },
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

function Select({
  className,
  id,
  label,
  options,
  dummyOption,
  selectedOption,
  setOption,
  disabled,
}: {
  className?: string
  id: string
  label: string
  options: { id: string; label?: string; disabled?: boolean }[]
  dummyOption?: string
  selectedOption: string
  setOption(id: string): void
  disabled?: boolean
}) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={selectedOption}
        onChange={(event) => setOption(event.target.value)}
        disabled={disabled}
      >
        {dummyOption && <option value="">{dummyOption}</option>}
        {options.map(({ id, label, disabled }) => {
          return (
            <option key={id} value={id} disabled={disabled}>
              {label || id}
            </option>
          )
        })}
      </select>
    </div>
  )
}

function between(num: string | number, min: number, max: number) {
  return Number(num) >= min && Number(num) <= max
}

// TODO: bring back emh
function isLevelAdvValid(levelAdv: string) {
  const tokens = levelAdv
    .trim()
    .split(/\b/)
    .map((s) => s.trim())

  function numInRange(s: string) {
    return between(s, 1, 50)
  }

  if (tokens.length === 1) {
    return numInRange(tokens[0])
  }

  if (tokens.length === 2) {
    if (tokens[0] === "-") {
      return numInRange(tokens[1])
    } else if (tokens[1] === "-") {
      return numInRange(tokens[0])
    } else {
      return false
    }
  }

  if (tokens.length === 3) {
    return (
      numInRange(tokens[0]) &&
      tokens[1] === "-" &&
      numInRange(tokens[2]) &&
      Number(tokens[2]) >= Number(tokens[0])
    )
  }

  return false
}

function isSranLevelAdvValid(sranLevelAdv: string) {
  const tokens = sranLevelAdv
    .trim()
    .split(/\b/)
    .map((s) => s.trim())

  function numInRange(s: string) {
    return between(s, 1, 19)
  }

  if (tokens.length === 1) {
    return numInRange(tokens[0])
  }

  if (tokens.length === 2) {
    if (tokens[0] === "-") {
      return numInRange(tokens[1])
    } else if (tokens[1] === "-") {
      return numInRange(tokens[0])
    } else {
      return false
    }
  }

  if (tokens.length === 3) {
    return (
      numInRange(tokens[0]) &&
      tokens[1] === "-" &&
      numInRange(tokens[2]) &&
      Number(tokens[2]) >= Number(tokens[0])
    )
  }

  return false
}

function parseWeightedDistInput(input: string | undefined): [number, number][] | null {
  if (input === undefined) return null
  const entries = input.split(",").map((s) => s.trim()).filter(Boolean)
  if (entries.length === 0) return null
  const result: [number, number][] = []
  const seenLevels = new Set<number>()
  for (const entry of entries) {
    const parts = entry.split(":").map((s) => s.trim())
    if (parts.length !== 2) return null
    const level = Number(parts[0])
    const weight = Number(parts[1])
    if (!Number.isInteger(level) || level < 1 || level > 50) return null
    if (isNaN(weight) || weight <= 0) return null
    if (seenLevels.has(level)) return null
    seenLevels.add(level)
    result.push([level, weight])
  }
  return result
}

function weightStyle(weight: number, distinctWeights: number[]): React.CSSProperties {
  const n = distinctWeights.length
  if (n <= 1) return {}
  if (n === 2) return weight === distinctWeights[1] ? { fontWeight: "bolder" } : {}
  if (n === 3) {
    if (weight === distinctWeights[2]) return { fontWeight: "bolder" }
    if (weight === distinctWeights[0]) return { fontWeight: "lighter" }
    return {}
  }
  const bucketSize = Math.floor(n / 3)
  if (weight >= distinctWeights[n - bucketSize]) return { fontWeight: "bolder" }
  if (weight <= distinctWeights[bucketSize - 1]) return { fontWeight: "lighter" }
  return {}
}

const DRAW_COUNTS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
]

interface ControlPanelOptions {
  isMoreControlsOpen: boolean
}

type ControlPanelProps = Partial<ControlPanelOptions> & {
  extraClass?: string
  initialDrawOptions: Partial<ChartDrawOptions>
  initialDisplayOptions: Partial<ChartDisplayOptions>
  onChange: (newState: Partial<ControlPanelState>) => void
  onDraw: (options: ChartQuerySampleOptions) => void
  onClear: () => void
}

export type ControlPanelState = ChartDrawOptions &
  Partial<ChartDisplayOptions> &
  ControlPanelOptions

export default class ControlPanel extends React.Component<
  ControlPanelProps,
  ControlPanelState
> {
  constructor(props: ControlPanelProps) {
    super(props)

    const {
      initialDrawOptions: {
        count,
        levelAdv,
        sranLevelAdv,
        includeDiffsRadio,
        includeDiffs,
        hardestDiff,
        folder,
        eemall,
        floorInfection,
        buggedBpms,
        holdNotes,
        omnimix,
        lively,
        unlocks,
        naRemovals,
        weightedDistInput,
        levelMode,
        gameVersion,
      },
      initialDisplayOptions: {
        preferGenre,
        displayStyle,
        showDrawnAt,
        notepadContents,
        assetsUrl, // Currently not configurable in UI.
      },
      isMoreControlsOpen,
    } = props

    this.state = {
      // Draw options
      count: count || 4,
      levelAdv: levelAdv ?? "",
      sranLevelAdv: sranLevelAdv ?? "",
      includeDiffsRadio: includeDiffsRadio ?? "all",
      includeDiffs: includeDiffs ?? "enhx",
      hardestDiff: hardestDiff ?? "include",
      folder: folder ?? "",
      eemall: eemall ?? "include",
      floorInfection: floorInfection ?? "include",
      buggedBpms: buggedBpms ?? "include",
      holdNotes: holdNotes ?? "include",
      omnimix: omnimix ?? "exclude",
      lively: lively ?? "exclude",
      unlocks: unlocks ?? "include",
      naRemovals: naRemovals ?? "include",
      weightedDistInput: weightedDistInput ?? "",
      levelMode: levelMode ?? "normal",
      gameVersion: gameVersion || "highcheers_2609",
      // Display options
      preferGenre: preferGenre ?? false,
      displayStyle: displayStyle ?? "normal",
      showDrawnAt: showDrawnAt ?? false,
      notepadContents: notepadContents ?? "",
      assetsUrl: assetsUrl || "https://popn-assets.pages.dev/assets",
      // Control panel state
      isMoreControlsOpen: isMoreControlsOpen ?? false,
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress)
  }

  handleKeyPress = (event: KeyboardEvent) => {
    const { isMoreControlsOpen } = this.state
    if (isMoreControlsOpen || document.getElementById("chartSetModal")) return

    const { key, repeat } = event
    if (repeat) return

    if (key === "s") {
      this.openMoreControls()
    } else if (key === "d") {
      this.onDrawClick()
    }
  }

  onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target
    let newState

    // TODO: Probably shouldn't assume `type`
    // If new lower > prev upper, raise upper. If new upper < prev lower, decrease lower.
    // Ensures lower <= upper at all times.
    if (id === "drawCountSelect") {
      newState = {
        count: Number(value),
      }
    } else if (id === "gameVersionSelect") {
      newState = {
        gameVersion: value,
      }
    } else if (id === "holdNotesSelect") {
      newState = {
        holdNotes: parseIncludeOption(value),
      }
    } else if (id === "buggedBpmsSelect") {
      newState = {
        buggedBpms: parseIncludeOption(value),
      }
    } else if (id === "eemallSelect") {
      newState = {
        eemall: parseIncludeOption(value),
      }
    } else if (id === "floorInfectionSelect") {
      newState = {
        floorInfection: parseIncludeOption(value),
      }
    } else if (id === "omnimixSelect") {
      newState = {
        omnimix: parseIncludeOption(value),
      }
    } else if (id === "livelySelect") {
      newState = {
        lively: parseIncludeOption(value),
      }
    } else if (id === "unlockSelect") {
      newState = {
        unlocks: parseIncludeOption(value),
      }
    } else if (id === "naRemovalsSelect") {
      newState = {
        naRemovals: parseIncludeOption(value),
      }
    } else {
      console.warn(`ControlPanel: Unknown id ${id}`)
      return
    }

    this.setState(newState)
    this.props.onChange(newState)
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { includeDiffs } = this.state
    const { id, checked } = event.target
    let newState

    // TODO: Probably shouldn't assume `type`
    if (id === "displayGenreInput") {
      newState = { preferGenre: checked }
      this.setState(newState) // For type safety, can't put this outside the if block.
    } else if (id === "showDrawnAtInput") {
      newState = { showDrawnAt: checked }
      this.setState(newState)
    } else if (id === "levelModeNormalInput" && checked) {
      newState = { levelMode: "normal" as const }
      this.setState(newState)
    } else if (id === "levelModeWeightedInput" && checked) {
      const { levelAdv, weightedDistInput } = this.state
      let autoInput: string | undefined

      if (!weightedDistInput) {
        const levelToUse = levelAdv && isLevelAdvValid(levelAdv) ? levelAdv : "1-50"
        const tokens = levelToUse.trim().split(/\b/).map((s) => s.trim())
        let levels: number[]
        if (tokens.length === 1) {
          levels = [Number(tokens[0])]
        } else {
          let min: number, max: number
          if (tokens[0] === "-") {
            min = 1
            max = Number(tokens[1])
          } else if (tokens[1] === "-" && tokens.length === 2) {
            min = Number(tokens[0])
            max = 50
          } else {
            min = Number(tokens[0])
            max = Number(tokens[2])
          }
          const rangeSize = max - min + 1
          if (rangeSize <= 3) {
            levels = Array.from({ length: rangeSize }, (_, i) => min + i)
          } else {
            levels = Array.from({ length: 3 }, (_, i) => max - 2 + i)
          }
        }
        autoInput = levels.map((l, i) => `${l}:${i === 1 ? "3" : "1"}`).join(", ")
      }

      newState = {
        levelMode: "weighted" as const,
        ...(autoInput !== undefined ? { weightedDistInput: autoInput } : {}),
      }
      this.setState(newState)
    } else if (id === "levelModeSranInput" && checked) {
      newState = { levelMode: "sran" as const }
      this.setState(newState)
    } else if (id === "includeAllDiffsInput" && checked) {
      newState = {
        includeDiffsRadio: "all" as const,
        includeDiffs: "enhx",
        hardestDiff: "include" as const,
      }
      this.setState(newState)
    } else if (id === "includeChooseDiffsInput" && checked) {
      newState = {
        includeDiffsRadio: "choose" as const,
      }
      this.setState(newState)
    } else if (id === "includeEasyInput") {
      newState = {
        includeDiffs: checked
          ? `${includeDiffs}e`
          : includeDiffs!.replace("e", ""),
      }
      this.setState(newState)
    } else if (id === "includeNormalInput") {
      newState = {
        includeDiffs: checked
          ? `${includeDiffs}n`
          : includeDiffs!.replace("n", ""),
      }
      this.setState(newState)
    } else if (id === "includeHyperInput") {
      newState = {
        includeDiffs: checked
          ? `${includeDiffs}h`
          : includeDiffs!.replace("h", ""),
      }
      this.setState(newState)
    } else if (id === "includeExInput") {
      newState = {
        includeDiffs: checked
          ? `${includeDiffs}x`
          : includeDiffs!.replace("x", ""),
      }
      this.setState(newState)
    } else if (id === "onlyIncludeHardestInput") {
      newState = {
        hardestDiff: checked
          ? parseIncludeOption("only")
          : parseIncludeOption("include"),
      }
      this.setState(newState)
    } else if (id === "displayStyleNormalInput") {
      newState = { displayStyle: "normal" as const }
      this.setState(newState)
    } else if (id === "displayStyleCompactInput") {
      newState = { displayStyle: "compact" as const }
      this.setState(newState)
    } else {
      console.warn(`ControlPanel: Unknown id ${id}`)
      return
    }

    this.props.onChange(newState)
  }

  onDrawCountButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { count: prevCount } = this.state
    const prevCountIdx = DRAW_COUNTS.indexOf(prevCount!)
    let newCountIdx

    switch (event.currentTarget.id) {
      case "drawCountDownButton":
        newCountIdx = Math.max(0, prevCountIdx - 1)
        break
      case "drawCountUpButton":
        newCountIdx = Math.min(DRAW_COUNTS.length - 1, prevCountIdx + 1)
        break
      default:
        console.warn(
          `onDrawCountButtonClick unknown id ${event.currentTarget.id}`,
        )
        return
    }

    const newState = { count: DRAW_COUNTS[newCountIdx] }
    this.setState(newState)
    this.props.onChange(newState)
  }

  onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newState = {
      notepadContents: event.currentTarget.value,
    }
    this.setState(newState)
    this.props.onChange(newState)
  }

  buildQuery = (): string => {
    const {
      levelMode,
      levelAdv,
      sranLevelAdv,
      weightedDistInput,
      includeDiffs,
      hardestDiff,
      folder,
      eemall,
      floorInfection,
      buggedBpms,
      holdNotes,
      omnimix,
      lively,
      unlocks,
      naRemovals,
      gameVersion,
    } = this.state

    const querySegments = []

    if (levelMode === "sran") {
      if (sranLevelAdv) {
        if (isSranLevelAdvValid(sranLevelAdv)) {
          if (sranLevelAdv.includes("-")) {
            const [min, max] = sranLevelAdv.split("-").map((s) => s.trim())
            querySegments.push(`srlv >= ${min || "1"}`)
            querySegments.push(`srlv <= ${max || "19"}`)
          } else {
            querySegments.push(`srlv = ${sranLevelAdv}`)
          }
        } else {
          console.error(`S乱 level input ${sranLevelAdv} is invalid. Ignoring.`)
        }
      } else {
        querySegments.push("srlv >= 1")
      }
    } else if (levelMode === "weighted" && parseWeightedDistInput(weightedDistInput ?? "")) {
      // level filtering handled by levelDistribution in sampleQueriedCharts
    } else {
      if (levelAdv) {
        if (isLevelAdvValid(levelAdv)) {
          if (levelAdv.includes("-")) {
            const [min, max] = levelAdv.split("-").map((s) => s.trim())
            querySegments.push(`lv >= ${min || 1}`)
            querySegments.push(`lv <= ${max || 50}`)
          } else {
            querySegments.push(`lv = ${levelAdv}`)
          }
        } else {
          console.error(`Level input ${levelAdv} is invalid. Ignoring.`)
        }
      } else {
        querySegments.push("lv >= 1")
      }
    }

    if (includeDiffs!.split("").sort().join("") !== "ehnx") {
      // TODO: api doesn't support none
      querySegments.push(`diff = ${includeDiffs}`)
    }

    if (buggedBpms === "only") {
      querySegments.push("buggedbpm")
    }
    if (buggedBpms === "exclude") {
      querySegments.push("-buggedbpm")
    }

    if (holdNotes === "only") {
      querySegments.push("holds")
    }
    if (holdNotes === "exclude") {
      querySegments.push("-holds")
    }

    if (eemall === "only") {
      querySegments.push("eemall")
    }
    if (eemall === "exclude") {
      querySegments.push("-eemall")
    }

    if (floorInfection === "only") {
      querySegments.push("floorinfection")
    }
    if (floorInfection === "exclude") {
      querySegments.push("-floorinfection")
    }

    if (gameVersion === "jamfizz_0924") {
      // These are only supported for newest non-Eagle datecodes.

      if (omnimix === "only") {
        querySegments.push("omnimix")
      }
      if (omnimix === "exclude") {
        querySegments.push("-omnimix")
      }

      if (lively === "only") {
        querySegments.push("lively")
      }
      if (lively === "exclude") {
        querySegments.push("-lively")
      }
    }

    if (gameVersion === "highcheers_2609") {
      if (unlocks === "only") {
        querySegments.push("unlock")
      }
      if (unlocks === "exclude") {
        querySegments.push("-unlock")
      }

      if (naRemovals === "only") {
        querySegments.push("naremoval")
      }
      if (naRemovals === "exclude") {
        querySegments.push("-naremoval")
      }
    }

    if (folder) {
      querySegments.push(`folder = ${folder}`)
    }

    // Put this last because it's the most expensive condition to evaluate.
    if (hardestDiff === "only") {
      querySegments.push("hardest")
    }

    return querySegments.join(", ")
  }

  onCalculateClick = () => {
    const { levelMode, weightedDistInput, gameVersion } = this.state
    const query = this.buildQuery()
    const db = getDatabase(gameVersion!)

    if (levelMode === "weighted") {
      const dist = parseWeightedDistInput(weightedDistInput ?? "")
      if (dist) {
        const totalChartCount = dist.reduce((sum, [level]) => {
          // In practice, query should never be empty. But theoretically it could be.
          const levelQuery = query ? `${query}, lv = ${level}` : `lv = ${level}`
          return sum + db.queryCharts(levelQuery).length
        }, 0)
        toast(`Drawing from ${totalChartCount} charts total`, { position: "top-center" })
        return
      }
    }

    toast(`Drawing from ${db.queryCharts(query).length} charts total`, {
      position: "top-center",
    })
  }

  onDrawClick = () => {
    const { onDraw } = this.props
    const { count, levelMode, weightedDistInput, gameVersion } = this.state

    const levelDistribution =
      levelMode === "weighted"
        ? parseWeightedDistInput(weightedDistInput ?? "") ?? undefined
        : undefined

    onDraw({
      count: count!,
      query: this.buildQuery(),
      gameVersion: gameVersion!,
      ...(levelDistribution ? { levelDistribution } : {}),
    })
  }

  onClearClick = () => {
    const { onClear } = this.props

    if (window.confirm("Clear all drawn charts?")) {
      onClear()
    }
  }

  getLevel = (level: number) => {
    return (
      <span
        className={cx(
          styles.levelString,
          styles[`level${Math.floor(level / 10)}x`],
        )}
      >
        {level}
      </span>
    )
  }

  getEmh = (emh: "e" | "m" | "h") => {
    const longName = {
      e: "easy",
      m: "med",
      h: "hard",
    }
    return (
      <span className={cx(styles.emhString, styles[longName[emh]])}>
        {longName[emh]}
      </span>
    )
  }

  getSummaryContents = () => {
    const { count, levelAdv, levelMode, sranLevelAdv, weightedDistInput } = this.state

    if (levelMode === "sran") {
      if (sranLevelAdv) {
        if (isSranLevelAdvValid(sranLevelAdv)) {
          if (sranLevelAdv.includes("-")) {
            let [min, max] = sranLevelAdv.split("-").map((s) => s.trim())
            min ||= "1"
            max ||= "19"

            if (min === max) {
              return (
                <>
                  {count}
                  {" charts: S乱 "}
                  {min.startsWith("0") ? min.slice(1) : min}
                </>
              )
            } else {
              return (
                <>
                  {count}
                  {" charts: S乱 "}
                  {min.startsWith("0") ? min.slice(1) : min}
                  {"-"}
                  {max.startsWith("0") ? max.slice(1) : max}
                </>
              )
            }
          } else {
            return (
              <>
                {count}
                {" charts: S乱 "}
                {sranLevelAdv}
              </>
            )
          }
        } else {
          return "S乱 level is invalid, fix settings"
        }
      } else {
        return (
          <>
            {count}
            {" charts: any S乱 level"}
          </>
        )
      }
    }

    if (levelMode === "weighted") {
      const dist = parseWeightedDistInput(weightedDistInput)
      if (dist) {
        const sorted = [...dist].sort(([level1], [level2]) => level1 - level2)
        const distinctWeights = Array.from(new Set(sorted.map(([, weight]) => weight))).sort((a, b) => a - b)

        return (
          <>
            {count}
            {" charts: lv "}
            {sorted.map(([level, weight], i) => (
              <React.Fragment key={level}>
                {i > 0 && ", "}
                <span style={weightStyle(weight, distinctWeights)}>
                  {`${level}[${weight}]`}
                </span>
              </React.Fragment>
            ))}
          </>
        )
      } else {
        return "Weighted distribution is invalid, fix settings"
      }
    }

    if (levelAdv) {
      if (isLevelAdvValid(levelAdv)) {
        if (levelAdv.includes("-")) {
          let [min, max] = levelAdv.split("-").map((s) => s.trim())
          min ||= "1"
          max ||= "50"

          if (min === max) {
            return (
              <>
                {count}
                {" charts: lv "}
                {min}
              </>
            )
          } else {
            return (
              <>
                {count}
                {" charts: lv "}
                {min}
                {"-"}
                {max}
              </>
            )
          }
        } else {
          return (
            <>
              {count}
              {" charts: lv "}
              {levelAdv}
            </>
          )
        }
      } else {
        return "Level is invalid, fix settings"
      }
    } else {
      return (
        <>
          {count}
          {" charts: "}
          {"any level"}
        </>
      )
    }
  }

  openMoreControls = () => {
    ReactModal.setAppElement("#app")
    this.setState({
      isMoreControlsOpen: true,
    })
  }

  closeMoreControls = () => {
    this.setState({
      isMoreControlsOpen: false,
    })
  }

  resetControls = () => {
    if (
      window.confirm(
        "Reset options to default values? Display options will not be affected.",
      )
    ) {
      const newState: ChartDrawOptions & Partial<ChartDisplayOptions> = {
        // Draw options
        count: 4,
        levelAdv: "",
        sranLevelAdv: "",
        includeDiffsRadio: "all",
        includeDiffs: "enhx",
        hardestDiff: "include",
        folder: "",
        eemall: "include",
        floorInfection: "include",
        buggedBpms: "include",
        holdNotes: "include",
        omnimix: "exclude",
        lively: "exclude",
        unlocks: "include",
        naRemovals: "include",
        levelMode: "normal",
        weightedDistInput: "",
        // Don't reset game version or display options.
      }
      this.setState(newState)
      this.props.onChange(newState)
    }
  }

  render() {
    const { extraClass } = this.props
    const {
      levelMode,
      count,
      levelAdv,
      sranLevelAdv,
      includeDiffsRadio,
      includeDiffs,
      hardestDiff,
      folder,
      eemall,
      floorInfection,
      buggedBpms,
      holdNotes,
      omnimix,
      lively,
      unlocks,
      naRemovals,
      weightedDistInput,
      gameVersion,
      preferGenre,
      displayStyle,
      showDrawnAt,
      notepadContents,
      isMoreControlsOpen,
    } = this.state

    const rootClassName = cx(extraClass, styles.ControlPanel)
    const settingsInvalid =
      (levelMode === "normal" && !!levelAdv && !isLevelAdvValid(levelAdv)) ||
      (levelMode === "weighted" && !parseWeightedDistInput(weightedDistInput)) ||
      (levelMode === "sran" && !!sranLevelAdv && !isSranLevelAdvValid(sranLevelAdv))

    function includeOptions() {
      return (
        <>
          <option value="include">OK</option>
          <option value="exclude">Exclude</option>
          <option value="only">Require</option>
        </>
      )
    }

    return (
      <section className={rootClassName}>
        <section className={styles.buttonsAndSummary}>
          <section className={styles.left}>
            <button
              type="button"
              title="(shortcut: d)"
              disabled={settingsInvalid}
              onClick={this.onDrawClick}
            >
              Draw
            </button>

            <span className={styles.summary}>{this.getSummaryContents()}</span>
          </section>

          <section className={styles.right}>
            <button
              type="button"
              title="Settings (shortcut: s)"
              className={styles.iconButton}
              onClick={this.openMoreControls}
            >
              <RiSettings3Fill />
            </button>
          </section>
        </section>

        {notepadContents?.trim() && (
          <section
            className={styles.notepadContents}
            dangerouslySetInnerHTML={{
              __html: md.render(notepadContents),
            }}
          ></section>
        )}

        <ReactModal
          isOpen={isMoreControlsOpen}
          contentLabel="Randomizer controls modal"
          onRequestClose={this.closeMoreControls}
          style={{
            overlay: { zIndex: 20 },
            content: {
              background: "#fdfdfd",
              border: "none",
              boxShadow: "0 0 50px 50px #fdfdfd",
              inset: "0",
              margin: "0 auto",
              maxWidth: "400px",
              padding: "1rem",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            },
          }}
        >
          <section className={styles.topRow}>
            <section>
              <button
                className={styles.closeMoreControlsButton}
                type="button"
                onClick={this.closeMoreControls}
              >
                Close
              </button>
            </section>

            <section className={styles.right}>
              <button
                className={cx(styles.iconButton, styles.clearButton)}
                type="button"
                title="Clear all drawn charts"
                onClick={this.onClearClick}
              >
                <FaTrash />
              </button>

              <button
                className={styles.resetButton}
                type="button"
                onClick={this.resetControls}
              >
                Reset to defaults
              </button>
            </section>
          </section>

          <h5 className={styles.header}>
            Draw options
            <button
              className={styles.iconButton}
              title="Calculate draw pool size"
              disabled={settingsInvalid}
              onClick={this.onCalculateClick}
            >
              <FaCalculator />
            </button>
          </h5>

          <section className={cx(styles.control, styles.draw)}>
            <label htmlFor="drawCountSelect">Draw</label>

            <section className={cx(styles.flex, styles.selectWithIncDec)}>
              <button
                id="drawCountDownButton"
                type="button"
                onClick={this.onDrawCountButtonClick}
              >
                <VscTriangleLeft />
              </button>

              <select
                id="drawCountSelect"
                value={count}
                onChange={this.onSelectChange}
              >
                {DRAW_COUNTS.map((count) => (
                  <option value={count} key={count}>
                    {count}
                  </option>
                ))}
              </select>

              <button
                id="drawCountUpButton"
                type="button"
                onClick={this.onDrawCountButtonClick}
              >
                <VscTriangleRight />
              </button>
            </section>
          </section>

          <section className={styles.control}>
            <span>Level</span>
            <section className={styles.flex}>
              <input
                id="levelModeNormalInput"
                type="radio"
                checked={levelMode === "normal"}
                onChange={this.onInputChange}
              />
              <label htmlFor="levelModeNormalInput">Normal</label>
            </section>
            <section className={styles.flex}>
              <input
                id="levelModeWeightedInput"
                type="radio"
                checked={levelMode === "weighted"}
                onChange={this.onInputChange}
              />
              <label
                htmlFor="levelModeWeightedInput"
                className={levelMode === "weighted" ? styles.changed : ""}
              >
                Weighted
              </label>
            </section>
            <section className={styles.flex}>
              <input
                id="levelModeSranInput"
                type="radio"
                checked={levelMode === "sran"}
                onChange={this.onInputChange}
              />
              <label
                htmlFor="levelModeSranInput"
                className={levelMode === "sran" ? styles.changed : ""}
              >
                S乱
              </label>
            </section>
          </section>

          {levelMode === "normal" ? (
            <div className={cx(styles.control, styles.subcontrol, styles.level)}>
              <div className={cx(styles.flex, styles.selectWithIncDec)}>
                <button
                  onClick={() => {
                    if (!levelAdv || !isLevelAdvValid(levelAdv)) return
                    let newLevelAdv
                    const parts = levelAdv!.split("-").map((s) => s.trim())
                    if (parts.length === 1) {
                      newLevelAdv = String(Math.max(1, Number(parts[0]) - 1))
                    } else {
                      if (parts[0] !== "") parts[0] = String(Math.max(1, Number(parts[0]) - 1))
                      if (parts[1] !== "") parts[1] = String(Math.max(1, Number(parts[1]) - 1))
                      newLevelAdv = parts.join("-")
                    }
                    const newState = { levelAdv: newLevelAdv }
                    this.setState(newState)
                    this.props.onChange(newState)
                  }}
                >
                  <VscTriangleLeft />
                </button>
                <input
                  className={
                    levelAdv
                      ? isLevelAdvValid(levelAdv)
                        ? styles.changed
                        : styles.invalid
                      : ""
                  }
                  type="text"
                  placeholder="1-50"
                  value={levelAdv || ""}
                  onChange={(event) => {
                    const newState = { levelAdv: event.target.value }
                    this.setState(newState)
                    this.props.onChange(newState)
                  }}
                />
                <button
                  onClick={() => {
                    if (!levelAdv || !isLevelAdvValid(levelAdv)) return
                    let newLevelAdv
                    const parts = levelAdv!.split("-").map((s) => s.trim())
                    if (parts.length === 1) {
                      newLevelAdv = String(Math.min(50, Number(parts[0]) + 1))
                    } else {
                      if (parts[0] !== "") parts[0] = String(Math.min(50, Number(parts[0]) + 1))
                      if (parts[1] !== "") parts[1] = String(Math.min(50, Number(parts[1]) + 1))
                      newLevelAdv = parts.join("-")
                    }
                    const newState = { levelAdv: newLevelAdv }
                    this.setState(newState)
                    this.props.onChange(newState)
                  }}
                >
                  <VscTriangleRight />
                </button>
              </div>
            </div>
          ) : levelMode === "sran" ? (
            <div className={cx(styles.control, styles.subcontrol, styles.level)}>
              <div className={cx(styles.flex, styles.selectWithIncDec)}>
                <button
                  onClick={() => {
                    if (!sranLevelAdv || !isSranLevelAdvValid(sranLevelAdv)) return
                    let newSranLevelAdv
                    const parts = sranLevelAdv!.split("-").map((s) => s.trim())
                    if (parts.length === 1) {
                      newSranLevelAdv = String(Math.max(1, Number(parts[0]) - 1))
                    } else {
                      if (parts[0] !== "") parts[0] = String(Math.max(1, Number(parts[0]) - 1))
                      if (parts[1] !== "") parts[1] = String(Math.max(1, Number(parts[1]) - 1))
                      newSranLevelAdv = parts.join("-")
                    }
                    const newState = { sranLevelAdv: newSranLevelAdv }
                    this.setState(newState)
                    this.props.onChange(newState)
                  }}
                >
                  <VscTriangleLeft />
                </button>
                <input
                  className={
                    sranLevelAdv
                      ? isSranLevelAdvValid(sranLevelAdv)
                        ? styles.changed
                        : styles.invalid
                      : ""
                  }
                  type="text"
                  placeholder="1-19"
                  value={sranLevelAdv || ""}
                  onChange={(event) => {
                    const newState = { sranLevelAdv: event.target.value }
                    this.setState(newState)
                    this.props.onChange(newState)
                  }}
                />
                <button
                  onClick={() => {
                    if (!sranLevelAdv || !isSranLevelAdvValid(sranLevelAdv)) return
                    let newSranLevelAdv
                    const parts = sranLevelAdv!.split("-").map((s) => s.trim())
                    if (parts.length === 1) {
                      newSranLevelAdv = String(Math.min(19, Number(parts[0]) + 1))
                    } else {
                      if (parts[0] !== "") parts[0] = String(Math.min(19, Number(parts[0]) + 1))
                      if (parts[1] !== "") parts[1] = String(Math.min(19, Number(parts[1]) + 1))
                      newSranLevelAdv = parts.join("-")
                    }
                    const newState = { sranLevelAdv: newSranLevelAdv }
                    this.setState(newState)
                    this.props.onChange(newState)
                  }}
                >
                  <VscTriangleRight />
                </button>
              </div>
            </div>
          ) : (
            <>
              <section className={cx(styles.control, styles.subcontrol)}>
                <input
                  id="weightedDistInput"
                  className={
                       parseWeightedDistInput(weightedDistInput)
                        ? styles.changed
                        : styles.invalid
                  }
                  type="text"
                  style={{ width: "14rem" }}
                  value={weightedDistInput}
                  onChange={(event) => {
                    const newState = { weightedDistInput: event.target.value }
                    this.setState(newState)
                    this.props.onChange(newState)
                  }}
                />
              </section>
              <section className={cx(styles.control, styles.info)}>
                Comma separated list of <code>level:weight</code> pairs.
              </section>
              <section className={cx(styles.control, styles.info)}>
                <code>level</code> cannot be repeated.
              </section>
              <section className={cx(styles.control, styles.info)}>
                <code>weight</code> can be any positive integer.
              </section>
            </>
          )}

          <section className={cx(styles.control, styles.includeDiffs)}>
            <span>Difficulties</span>

            <section className={styles.flex}>
              <input
                id="includeAllDiffsInput"
                type="radio"
                checked={includeDiffsRadio === "all"}
                onChange={this.onInputChange}
              />
              <label htmlFor="includeAllDiffsInput">All</label>
            </section>

            <section className={styles.flex}>
              <input
                id="includeChooseDiffsInput"
                type="radio"
                checked={includeDiffsRadio === "choose"}
                onChange={this.onInputChange}
              />
              <label
                htmlFor="includeChooseDiffsInput"
                className={includeDiffsRadio === "choose" ? styles.changed : ""}
              >
                Choose
              </label>
            </section>
          </section>

          {includeDiffsRadio === "choose" && (
            <>
              <section className={cx(styles.control, styles.diffsChoose)}>
                <div className={styles.diffContainer}>
                  <input
                    id="includeEasyInput"
                    type="checkbox"
                    checked={includeDiffs!.includes("e")}
                    onChange={this.onInputChange}
                  />
                  <label
                    htmlFor="includeEasyInput"
                    className={!includeDiffs!.includes("e") ? styles.changed : ""}
                  >
                    easy
                  </label>
                </div>

                <div className={styles.diffContainer}>
                  <input
                    id="includeNormalInput"
                    type="checkbox"
                    checked={includeDiffs!.includes("n")}
                    onChange={this.onInputChange}
                  />
                  <label
                    htmlFor="includeNormalInput"
                    className={!includeDiffs!.includes("n") ? styles.changed : ""}
                  >
                    normal
                  </label>
                </div>

                <div className={styles.diffContainer}>
                  <input
                    id="includeHyperInput"
                    type="checkbox"
                    checked={includeDiffs!.includes("h")}
                    onChange={this.onInputChange}
                  />
                  <label
                    htmlFor="includeHyperInput"
                    className={!includeDiffs!.includes("h") ? styles.changed : ""}
                  >
                    hyper
                  </label>
                </div>

                <div className={styles.diffContainer}>
                  <input
                    id="includeExInput"
                    type="checkbox"
                    checked={includeDiffs!.includes("x")}
                    onChange={this.onInputChange}
                  />
                  <label
                    htmlFor="includeExInput"
                    className={!includeDiffs!.includes("x") ? styles.changed : ""}
                  >
                    ex
                  </label>
                </div>
              </section>
              <section className={cx(styles.control, styles.hardestDiff)}>
                <input
                  id="onlyIncludeHardestInput"
                  type="checkbox"
                  checked={hardestDiff === "only"}
                  onChange={this.onInputChange}
                />
                <label
                  htmlFor="onlyIncludeHardestInput"
                  className={hardestDiff === "only" ? styles.changed : ""}
                >
                  Only song&apos;s hardest
                </label>
              </section>
            </>
          )}

          <Select
            className={cx(
              styles.control,
              styles.folder,
              folder ? styles.changed : "",
            )}
            id="folderSelect"
            label="Folder"
            options={FOLDER_OPTIONS}
            dummyOption="(any)"
            selectedOption={folder || ""}
            setOption={(id: VersionFolder | BemaniFolder) => {
              const newState = { folder: id }
              this.setState(newState)
              this.props.onChange(newState)
            }}
          />

          <section className={styles.control}>
            <select
              id="holdNotesSelect"
              className={
                holdNotes === "exclude"
                  ? styles.changed
                  : holdNotes === "only"
                  ? styles.changed2
                  : ""
              }
              value={holdNotes}
              onChange={this.onSelectChange}
            >
              {includeOptions()}
            </select>
            <label htmlFor="holdNotesSelect">Hold notes</label>
          </section>

          <section className={styles.control}>
            <select
              id="buggedBpmsSelect"
              className={
                buggedBpms === "exclude"
                  ? styles.changed
                  : buggedBpms === "only"
                  ? styles.changed2
                  : ""
              }
              value={buggedBpms}
              onChange={this.onSelectChange}
            >
              {includeOptions()}
            </select>
            <label htmlFor="excludeBuggedBpmsInput">Bugged bpms</label>
          </section>

          <section className={styles.control}>
            <select
              id="eemallSelect"
              className={
                eemall === "exclude"
                  ? styles.changed
                  : eemall === "only"
                  ? styles.changed2
                  : ""
              }
              value={eemall}
              onChange={this.onSelectChange}
            >
              {includeOptions()}
            </select>
            <label htmlFor="eemallSelect">ee&apos;MALL</label>
          </section>

          <section className={styles.control}>
            <select
              id="floorInfectionSelect"
              className={
                floorInfection === "exclude"
                  ? styles.changed
                  : floorInfection === "only"
                  ? styles.changed2
                  : ""
              }
              value={floorInfection}
              onChange={this.onSelectChange}
            >
              {includeOptions()}
            </select>
            <label htmlFor="floorInfectionSelect">FLOOR INFECTION</label>
          </section>

          <section className={styles.control}>
            <label htmlFor="gameVersionSelect">Game data</label>
            <select
              id="gameVersionSelect"
              className={gameVersion ? styles[gameVersion] : ""}
              value={gameVersion}
              onChange={this.onSelectChange}
            >
              <option value="highcheers_2609">High☆Cheers!!</option>
              <option value="jamfizz_0924">Jam&Fizz 0924 + extras</option>
              <option value="unilab_0731">UniLab 0731</option>
            </select>
          </section>

          {gameVersion === "jamfizz_0924" && (
            <>
              <section className={styles.control}>
                <select
                  id="omnimixSelect"
                  className={
                    omnimix === "include"
                      ? styles.changed
                      : omnimix === "only"
                      ? styles.changed2
                      : ""
                  }
                  value={omnimix}
                  onChange={this.onSelectChange}
                >
                  {includeOptions()}
                </select>
                <label htmlFor="omnimixSelect">Omnimix</label>
              </section>

              <section className={styles.control}>
                <select
                  id="livelySelect"
                  className={
                    lively === "include"
                      ? styles.changed
                      : lively === "only"
                      ? styles.changed2
                      : ""
                  }
                  value={lively}
                  onChange={this.onSelectChange}
                >
                  {includeOptions()}
                </select>
                <label htmlFor="livelySelect">Lively exclusives</label>
              </section>
            </>
          )}

          {gameVersion === "highcheers_2609" && (
            <>
              <section className={styles.control}>
                <select
                  id="unlockSelect"
                  className={
                    unlocks === "exclude"
                      ? styles.changed
                      : unlocks === "only"
                      ? styles.changed2
                      : ""
                  }
                  value={unlocks}
                  onChange={this.onSelectChange}
                >
                  {includeOptions()}
                </select>
                <label htmlFor="unlockSelect">Unlocks</label>
              </section>

              <section className={styles.control}>
                <select
                  id="naRemovalsSelect"
                  className={
                    naRemovals === "exclude"
                      ? styles.changed
                      : naRemovals === "only"
                      ? styles.changed2
                      : ""
                  }
                  value={naRemovals}
                  onChange={this.onSelectChange}
                >
                  {includeOptions()}
                </select>
                <label htmlFor="naRemovalsSelect">NA removals</label>
              </section>
            </>
          )}

          <h5 className={styles.header}>Display options</h5>

          <section className={styles.control}>
            <input
              id="displayGenreInput"
              type="checkbox"
              checked={preferGenre}
              onChange={this.onInputChange}
            />
            <label htmlFor="displayGenreInput">Prefer genre</label>
          </section>

          <section className={styles.control}>
            <label>Chart appearance</label>

            <section className={styles.flex}>
              <input
                id="displayStyleNormalInput"
                type="radio"
                checked={displayStyle === "normal"}
                onChange={this.onInputChange}
              />
              <label htmlFor="displayStyleNormalInput">Normal</label>
            </section>

            <section className={styles.flex}>
              <input
                id="displayStyleCompactInput"
                type="radio"
                checked={displayStyle === "compact"}
                onChange={this.onInputChange}
              />
              <label htmlFor="displayStyleCompactInput">Compact</label>
            </section>
          </section>

          {displayStyle === "compact" && (
            <section className={cx(styles.control, styles.info)}>
              When compact, tap on charts to reveal their{" "}
              {preferGenre ? "genre" : "title"}
            </section>
          )}

          <section className={styles.control}>
            <input
              id="showDrawnAtInput"
              type="checkbox"
              checked={showDrawnAt}
              onChange={this.onInputChange}
            />
            <label htmlFor="showDrawnAtInput">Show draw timestamp</label>
          </section>

          <section className={cx(styles.control, styles.notepad)}>
            <label>
              <section className={styles.left}>
                Notepad
                <span className={styles.info}>Markdown supported</span>
              </section>

              <section className={styles.right}>
                <span className={cx(styles.info, styles.charCount)}>
                  {notepadContents!.length}/1000
                </span>
              </section>
            </label>

            <textarea
              id="notepadTextarea"
              rows={10}
              maxLength={1000}
              value={notepadContents}
              onChange={this.onTextareaChange}
            />
          </section>

          <div className={styles.github}>
            <span className={styles.sha}>{process.env.GIT_SHA}</span>
            <a
              href="https://github.com/fishluv/popn-tools"
              target="_blank"
              rel="noreferrer"
            >
              <BsGithub />
            </a>
          </div>
        </ReactModal>
      </section>
    )
  }
}
