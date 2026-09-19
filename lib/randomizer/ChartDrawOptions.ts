import { BemaniFolder, VersionFolder } from "popn-db-js"

export type IncludeOption = "include" | "exclude" | "only"

export function parseIncludeOption(s: string): IncludeOption {
  const sl = s?.toLowerCase()
  switch (sl) {
    case "only":
      return "only"
    case "exclude":
      return "exclude"
    default:
      return "include"
  }
}

export interface ChartDrawOptions {
  count?: number
  levelAdv?: string
  sranLevelAdv?: string
  includeDiffsRadio?: "all" | "choose"
  includeDiffs?: string
  hardestDiff?: IncludeOption
  folder?: VersionFolder | BemaniFolder | ""
  eemall?: IncludeOption
  floorInfection?: IncludeOption
  buggedBpms?: IncludeOption
  holdNotes?: IncludeOption
  omnimix?: IncludeOption
  lively?: IncludeOption
  unlocks?: IncludeOption
  naRemovals?: IncludeOption
  weightedDistInput?: string
  levelMode?: "normal" | "weighted" | "sran"
  gameVersion?: string
}
