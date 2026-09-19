import React from "react"
import {
  Chart,
  Unilab0731,
  JamFizz0924,
  HighCheers2609,
  VersionFolder,
  BemaniFolder,
} from "popn-db-js"
import ControlPanel, { ControlPanelState } from "./ControlPanel"
import SetList from "./SetList"
import {
  ChartDisplayOptions,
  parseChartDisplayStyle,
} from "../../lib/randomizer/ChartDisplay"
import styles from "./RandomizerApp.module.scss"
import {
  getStorageBoolean,
  getStorageNumber,
  getStorageString,
  setStorageItem,
  setStorageItemIfNull,
} from "../../lib/randomizer/storage"
import {
  ChartDrawOptions,
  parseIncludeOption,
} from "../../lib/randomizer/ChartDrawOptions"

type RandomizerAppProps = Record<string, never>

export interface ChartDataSet {
  charts: Chart[]
  // TODO: Temporarily nullable until we implement better parsing
  drawnAt: number | null
  gameVersion: string | null
}

interface RandomizerAppState {
  isDoneLoading: boolean
  chartDataSets: ChartDataSet[] // Newest first.
  chartDrawOptions: Partial<ChartDrawOptions>
  chartDisplayOptions: ChartDisplayOptions
}

export interface ChartQuerySampleOptions {
  count: number
  query: string
  gameVersion: string
  levelDistribution?: [number, number][]
}

const MAX_DRAWN_CHARTS = 1000

function deserializeChartSets(chartSetsJson: string): ChartDataSet[] {
  try {
    const parsed = JSON.parse(chartSetsJson)
    if (!Array.isArray(parsed)) {
      return []
    }

    // Cull for max drawn charts. Keep newest chart sets.
    const deserializedChartSets: ChartDataSet[] = []
    let deserializedChartCount = 0
    for (const nextItem of parsed) {
      if (
        nextItem === undefined ||
        nextItem === null ||
        !Array.isArray(nextItem.charts)
      ) {
        break
      }

      let chartIds: string[]
      let drawnAt: number | null
      let gameVersion: string | null

      // TODO: Better typing of nextItem
      chartIds = nextItem.charts
      // TODO: Better parsing
      drawnAt = nextItem.drawnAt
      gameVersion = nextItem.gameVersion

      if (deserializedChartCount + chartIds.length > MAX_DRAWN_CHARTS) {
        break
      }

      const database = getDatabase(gameVersion || "jamfizz_0924")
      const charts = database
        .findCharts(...chartIds)
        .filter((c) => c !== null) as Chart[]

      deserializedChartSets.push({
        charts,
        drawnAt,
        gameVersion,
      })
      deserializedChartCount += chartIds.length
    }

    return deserializedChartSets
  } catch (e) {
    console.error(`Error deserializing chart sets: ${e}`)
    // Comment out for now. If an error happens, we want to be able to repro.
    // setStorageItem("drawnChartSets", "[]")
    // console.info("Reset chart sets.")
    return []
  }
}

function serializeChartSets(chartSets: ChartDataSet[]): string {
  const convertedSets = chartSets.map(({ charts, drawnAt, gameVersion }) => ({
    charts: charts.map((chart) => chart.id),
    drawnAt,
    gameVersion,
  }))
  return JSON.stringify(convertedSets)
}

export function getDatabase(gameVersion: string) {
  switch (gameVersion) {
    // versions with extras
    case "unilab_0913":
    case "unilab_1220":
    case "unilab_0905":
    case "unilab_1218":
    case "jamfizz_0925":
    case "jamfizz_0603":
    case "jamfizz_0924":
      return JamFizz0924
    // versions without extras
    case "highcheers_2605":
    case "highcheers_2607":
    case "highcheers_2609":
      return HighCheers2609
    case "kaimei_0613":
    case "unilab_0411":
    case "unilab_0731":
      return Unilab0731
    default:
      console.error(`Unknown game version ${gameVersion}`)
      return Unilab0731
  }
}

export default class RandomizerApp extends React.Component<
  RandomizerAppProps,
  RandomizerAppState
> {
  constructor(props: RandomizerAppProps) {
    super(props)

    this.state = {
      isDoneLoading: false,
      chartDataSets: [],
      chartDisplayOptions: {
        preferGenre: false,
        displayStyle: "normal",
        showDrawnAt: false,
        notepadContents: "",
        assetsUrl: "",
      },
      chartDrawOptions: {},
    }
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.handleUnload)

    // Draw options
    setStorageItemIfNull("count", 5)
    setStorageItemIfNull("levelAdv", "")
    setStorageItemIfNull("sranLevelAdv", "")
    setStorageItemIfNull("includeDiffsRadio", "all")
    setStorageItemIfNull("includeDiffs", "enhx")
    setStorageItemIfNull("folder", "")
    setStorageItemIfNull("onlyIncludeHardest", false)
    setStorageItemIfNull("holdNotes", "include")
    setStorageItemIfNull("buggedBpms", "include")
    setStorageItemIfNull("eemall", "include")
    setStorageItemIfNull("floorInfection", "include")
    setStorageItemIfNull("omnimix", "exclude")
    setStorageItemIfNull("lively", "exclude")
    setStorageItemIfNull("unlocks", "include")
    setStorageItemIfNull("naRemovals", "include")
    setStorageItemIfNull("weightedDistInput", "")
    setStorageItemIfNull("levelMode", "normal")

    if (!["highcheers_2609", "jamfizz_0924", "unilab_0731"].includes(getStorageString("gameVersion"))) {
      setStorageItem("gameVersion", "highcheers_2609")
    }

    // Display options
    setStorageItemIfNull("preferGenre", false)
    setStorageItemIfNull("showChartDetails", false)
    setStorageItemIfNull("displayStyle", "normal")
    setStorageItemIfNull("notepadContents", "")
    // State
    setStorageItemIfNull("drawnChartSets", "[]")

    const gameVersion = getStorageString("gameVersion")

    this.setState({
      isDoneLoading: true,
      chartDataSets: deserializeChartSets(getStorageString("drawnChartSets")),
      chartDisplayOptions: {
        preferGenre: getStorageBoolean("preferGenre"),
        displayStyle: parseChartDisplayStyle(getStorageString("displayStyle")),
        showDrawnAt: getStorageBoolean("showDrawnAt"),
        notepadContents: getStorageString("notepadContents").trim(),
        // Currently not configurable in the UI.
        assetsUrl: "https://popn-assets.pages.dev/assets",
      },
      chartDrawOptions: {
        count: getStorageNumber("count"),
        levelAdv: getStorageString("levelAdv") || "",
        sranLevelAdv: getStorageString("sranLevelAdv") || "",
        includeDiffsRadio: getStorageString("includeDiffsRadio", "all") as
          | "all"
          | "choose",
        includeDiffs: getStorageString("includeDiffs"),
        hardestDiff: parseIncludeOption(getStorageString("hardestDiff")),
        folder:
          (getStorageString("folder") as VersionFolder | BemaniFolder) || "",
        eemall: parseIncludeOption(getStorageString("eemall")),
        floorInfection: parseIncludeOption(getStorageString("floorInfection")),
        buggedBpms: parseIncludeOption(getStorageString("buggedBpms")),
        holdNotes: parseIncludeOption(getStorageString("holdNotes")),
        omnimix: parseIncludeOption(getStorageString("omnimix")),
        lively: parseIncludeOption(getStorageString("lively")),
        unlocks: parseIncludeOption(getStorageString("unlocks")),
        naRemovals: parseIncludeOption(getStorageString("naRemovals")),
        weightedDistInput: getStorageString("weightedDistInput"),
        levelMode: getStorageString("levelMode") as "normal" | "weighted" | "sran",
        gameVersion,
      },
    })
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleUnload)
  }

  handleUnload = (event: BeforeUnloadEvent) => {
    const { chartDataSets } = this.state
    const drawnChartCount = chartDataSets.reduce(
      (currCount, nextSet) => currCount + nextSet.charts.length,
      0,
    )
    if (drawnChartCount > MAX_DRAWN_CHARTS) {
      event.preventDefault()
    }
  }

  onControlPanelDraw = (querySampleOptions: ChartQuerySampleOptions) => {
    console.log(querySampleOptions)
    const newChartDataSet = {
      charts: getDatabase(querySampleOptions.gameVersion).sampleQueriedCharts(
        querySampleOptions,
      ),
      drawnAt: Date.now(),
      gameVersion: querySampleOptions.gameVersion,
    }

    this.setState((prevState) => {
      const newChartDataSets = [newChartDataSet, ...prevState.chartDataSets]

      setStorageItem("drawnChartSets", serializeChartSets(newChartDataSets))
      return {
        chartDataSets: newChartDataSets,
      }
    })
  }

  onControlPanelClear = () => {
    setStorageItem("drawnChartSets", "[]")
    this.setState({
      chartDataSets: [],
    })
  }

  onControlPanelChange = (newControlPanelState: Partial<ControlPanelState>) => {
    this.setState((prevState) => ({
      chartDisplayOptions: {
        ...prevState.chartDisplayOptions,
        ...newControlPanelState,
      },
      chartDrawOptions: {
        ...prevState.chartDrawOptions,
        ...newControlPanelState,
      },
    }))
    Object.entries(newControlPanelState).forEach(([key, value]) => {
      setStorageItem(key, value)
    })
  }

  onDeleteChartSet = (deleteIndex: number) => {
    this.setState(({ chartDataSets }) => {
      const newChartDataSets = [
        ...chartDataSets.slice(0, deleteIndex),
        ...chartDataSets.slice(deleteIndex + 1),
      ]

      setStorageItem("drawnChartSets", serializeChartSets(newChartDataSets))
      return {
        chartDataSets: newChartDataSets,
      }
    })
  }

  onDeleteChartSetsAfter = (deleteAfterIndex: number) => {
    this.setState(({ chartDataSets }) => {
      const newChartDataSets = chartDataSets.slice(0, deleteAfterIndex + 1)

      setStorageItem("drawnChartSets", serializeChartSets(newChartDataSets))
      return {
        chartDataSets: newChartDataSets,
      }
    })
  }

  render() {
    const {
      isDoneLoading,
      chartDataSets,
      chartDrawOptions,
      chartDisplayOptions,
    } = this.state

    return (
      <section id="app" className={styles.App}>
        {isDoneLoading && (
          <section className={styles.body}>
            <ControlPanel
              extraClass={styles.controlPanel}
              initialDrawOptions={chartDrawOptions}
              initialDisplayOptions={chartDisplayOptions}
              onDraw={this.onControlPanelDraw}
              onClear={this.onControlPanelClear}
              onChange={this.onControlPanelChange}
            />
            <SetList
              extraClass={styles.setList}
              chartDataSets={chartDataSets}
              chartDisplayOptions={chartDisplayOptions}
              showSranLevel={chartDrawOptions.levelMode === "sran"}
              onDeleteChartSet={this.onDeleteChartSet}
              onDeleteChartSetsAfter={this.onDeleteChartSetsAfter}
            />
          </section>
        )}
      </section>
    )
  }
}
