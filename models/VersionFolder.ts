/**
 * Version folders in ascending order.
 */
export const VERSION_FOLDERS = [
  "cs",
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
  "28",
] as const

type VersionFolder = (typeof VERSION_FOLDERS)[number]
export default VersionFolder

export function parseVersionFolder(
  s: string | undefined | null,
): VersionFolder | null {
  switch (s) {
    case "cs":
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
    case "28":
      return s
    default:
      return null
  }
}
