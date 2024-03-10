const NORMALIZED_SRAN_VALUES = [
  "01a",
  "01b",
  "02a",
  "02b",
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
] as const

export default class SranLevel {
  readonly norm: (typeof NORMALIZED_SRAN_VALUES)[number]

  constructor(val: string) {
    const valNorm = val.toLowerCase().padStart(2, "0")
    switch (valNorm) {
      case "01a":
      case "01b":
      case "02a":
      case "02b":
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
        this.norm = valNorm
        break
      default:
        throw new Error(`Invalid sran level ${val}`)
    }
  }

  display(): string {
    switch (this.norm) {
      case "01a":
        return "1-"
      case "01b":
        return "1+"
      case "02a":
        return "2-"
      case "02b":
        return "2+"
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
        return this.norm.replace(/^0/, "")
    }
  }
}
