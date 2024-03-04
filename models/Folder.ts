/**
 * Folders in ascending order.
 */
const NORMALIZED_FOLDER_VALUES = [
  "cs",
  "lively",
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

/**
 * Song's in-game folder
 * TODO: Get Lively out of here...
 */
export default class Folder {
  readonly norm: (typeof NORMALIZED_FOLDER_VALUES)[number]

  constructor(val: string | number) {
    const valNorm = val.toString().toLowerCase().padStart(2, "0")
    switch (valNorm) {
      case "cs":
      case "lively":
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
        this.norm = valNorm
        break
      default:
        throw new Error(`Invalid folder ${val}`)
    }
  }

  short(): string {
    switch (this.norm) {
      case "cs":
        return "cs"
      case "lively":
        return "liv"
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
        return this.norm.replace(/^0/, "")
      case "12":
        return "iro"
      case "13":
        return "car"
      case "14":
        return "fev"
      case "15":
        return "adv"
      case "16":
        return "par"
      case "17":
        return "mov"
      case "18":
        return "sr"
      case "19":
        return "ts"
      case "20":
        return "fan"
      case "21":
        return "sp"
      case "22":
        return "lap"
      case "23":
        return "ecl"
      case "24":
        return "usa"
      case "25":
        return "pe"
      case "26":
        return "kr"
      case "27":
        return "ul"
    }
  }

  long(): string {
    switch (this.norm) {
      case "cs":
      case "lively":
        return this.norm
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
        return this.norm.replace(/^0/, "")
      case "12":
        return "iroha"
      case "13":
        return "carnival"
      case "14":
        return "fever"
      case "15":
        return "adventure"
      case "16":
        return "party"
      case "17":
        return "the movie"
      case "18":
        return "sengoku retsuden"
      case "19":
        return "tune street"
      case "20":
        return "fantasia"
      case "21":
        return "sunny park"
      case "22":
        return "lapistoria"
      case "23":
        return "eclale"
      case "24":
        return "usaneko"
      case "25":
        return "peace"
      case "26":
        return "kaimei riddles"
      case "27":
        return "unilab"
    }
  }
}
