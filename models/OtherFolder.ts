export const OTHER_FOLDERS = ["bemani", "ddr", "gitadora", "iidx"] as const

type OtherFolder = typeof OTHER_FOLDERS[number]
export default OtherFolder

export function parseOtherFolder(
  s: string | undefined | null,
): OtherFolder | null {
  const snorm = s?.toLowerCase()
  switch (snorm) {
    case "bemani":
    case "ddr":
    case "gitadora":
    case "iidx":
      return snorm
    default:
      return null
  }
}
