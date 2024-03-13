/**
 * Version folders in ascending order.
 */
export const VERSION_FOLDERS = [
  "cs",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
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
] as const

type VersionFolder = typeof VERSION_FOLDERS[number]
export default VersionFolder

export function parseVersionFolder(
  s: string | undefined | null,
): VersionFolder | null {
  const snorm = s?.toLowerCase()?.padStart(2, "0")
  switch (snorm) {
    case "cs":
    case "01":
    case "02":
    case "03":
    case "04":
    case "05":
    case "06":
    case "07":
    case "08":
    case "09":
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
      return snorm
    case "00":
      return "cs"
    default:
      return null
  }
}
