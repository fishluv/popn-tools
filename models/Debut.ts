export const DEBUTS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "cs1",
  "cs2",
  "cs3",
  "cs4",
  "cs5",
  "cs6",
  "cs7",
  "cs8",
  "cs9",
  "cs10",
  "cs11",
  "cs12",
  "cs13",
  "cs14",
  "csbest",
  "cspmp",
  "cspmp2",
  "csutacchi",
  "cslively",
  "eemall",
] as const

type Debut = (typeof DEBUTS)[number]
export default Debut

export function parseDebut(s: string | undefined | null): Debut | null {
  switch (s) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "10":
    case "11":
    case "12":
    case "13":
    case "14":
    case "15":
    case "16":
    case "17":
    case "18":
    case "19":
    case "20":
    case "21":
    case "22":
    case "23":
    case "24":
    case "25":
    case "26":
    case "27":
    case "cs1":
    case "cs2":
    case "cs3":
    case "cs4":
    case "cs5":
    case "cs6":
    case "cs7":
    case "cs8":
    case "cs9":
    case "cs10":
    case "cs11":
    case "cs12":
    case "cs13":
    case "cs14":
    case "csbest":
    case "cspmp":
    case "cspmp2":
    case "csutacchi":
    case "cslively":
    case "eemall":
      return s
    default:
      return null
  }
}
