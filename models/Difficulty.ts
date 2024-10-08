type Difficulty = "e" | "n" | "h" | "ex"
export default Difficulty

export function parseDifficulty(
  s: string | undefined | null,
): Difficulty | null {
  const snorm = s?.toLowerCase()
  switch (snorm) {
    case "e":
    case "n":
    case "h":
    case "ex":
      return snorm
    default:
      return null
  }
}
