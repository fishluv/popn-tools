const BEMANI_FOLDERS = [
  "iidx",
  "ddr",
  "gitadora",
  "jubeat",
  "reflec",
  "sdvx",
  "beatstream",
  "museca",
  "nostalgia",
  "bemani",
] as const

type BemaniFolder = (typeof BEMANI_FOLDERS)[number]
export default BemaniFolder

export function parseBemaniFolder(
  s: string | undefined | null,
): BemaniFolder | null {
  const snorm = s?.toLowerCase()
  switch (snorm) {
    case "iidx":
    case "ddr":
    case "gitadora":
    case "jubeat":
    case "reflec":
    case "sdvx":
    case "beatstream":
    case "museca":
    case "nostalgia":
    case "bemani":
      return snorm
    default:
      return null
  }
}
