import { SearchApiSongResult } from "../lib/search"
import Character from "./Character"
import Chart from "./Chart"
import Debut, { parseDebut } from "./Debut"
import OtherFolder, { parseOtherFolder } from "./OtherFolder"
import VersionFolder, { parseVersionFolder } from "./VersionFolder"

export interface SongCharts {
  easy: Chart | null
  normal: Chart | null
  hyper: Chart | null
  ex: Chart | null
}

interface SongContructorProps {
  id: number
  title: string
  sortTitle: string
  genre: string
  sortGenre: string
  artist: string
  character1: Character | null
  character2: Character | null
  debut: Debut | null
  folder: VersionFolder | OtherFolder | null
  slug: string
  remywikiUrlPath: string
  remywikiTitle: string
  remywikiChara: string
  genreRomanTrans: string
  labels: string[]
  // Included in /songs response but not in /charts response.
  charts: SongCharts | null
}

export default class Song {
  static fromSearchApiSongResult({
    id,
    title,
    sort_title,
    genre,
    sort_genre,
    artist,
    character1,
    character2,
    debut,
    folder,
    slug,
    remywiki_url_path,
    remywiki_title,
    remywiki_chara,
    genre_romantrans,
    labels,
    charts,
  }: SearchApiSongResult): Song {
    return new Song({
      id,
      title,
      sortTitle: sort_title,
      genre,
      sortGenre: sort_genre,
      artist,
      character1: character1
        ? Character.fromSearchApiCharacterResult(character1)
        : null,
      character2: character2
        ? Character.fromSearchApiCharacterResult(character2)
        : null,
      debut: parseDebut(debut),
      folder: parseVersionFolder(folder) || parseOtherFolder(folder),
      slug,
      remywikiUrlPath: remywiki_url_path,
      remywikiTitle: remywiki_title,
      remywikiChara: remywiki_chara,
      genreRomanTrans: genre_romantrans,
      labels,
      charts: charts
        ? {
            easy: charts.e ? Chart.fromSearchApiChartResult(charts.e) : null,
            normal: charts.n ? Chart.fromSearchApiChartResult(charts.n) : null,
            hyper: charts.h ? Chart.fromSearchApiChartResult(charts.h) : null,
            ex: charts.ex ? Chart.fromSearchApiChartResult(charts.ex) : null,
          }
        : null,
    })
  }

  static CHAR_FIXES = {
    圄: "à",
    鵤: "Ä",
    圉: "ä",
    圈: "é",
    鵐: "ê", // 571 La Peche du Pierrot
    鵙: "ə", // 1110 uen
    鶉: "ó",
    鶇: "ö",
    圖: "ţ",
    鵺: "Ü",
    鶫: "²",
    鵝: "7",
    圍: "@", // 88 ANIME HEROINE
    囎: "ː", // Artist Fuuuːka - Note, not a colon
    釁: "★", // 1637 Kemono no ouja Meumeu TODO: Change to 🐾?
    囿: "♥", // 187 CANDY, 205 Prism Heart, and many others
    囂: "♡", // 1659 Strawberry Chu Chu - Note, not full heart
    佰: "你", // 31 Woneijatheizau, 1454 Zijiu jau
    鶚: "㊙",
    鵑: "", // Artist Akko's
    炙: "焱", // 1954 Hikage
    罕: "έ", // 2087 Telos
    罔: "ς", // 2087 Telos
  }

  static fixKonamiChars(s: string) {
    let fixed = s
    Object.entries(this.CHAR_FIXES).forEach(([weirdChar, fixChar]) => {
      fixed = fixed.replaceAll(weirdChar, fixChar)
    })
    return fixed
  }

  readonly id: number
  readonly title: string
  readonly sortTitle: string
  readonly genre: string
  readonly sortGenre: string
  readonly artist: string
  readonly character1: Character | null
  readonly character2: Character | null
  readonly debut: Debut | null
  readonly folder: VersionFolder | OtherFolder | null
  readonly slug: string
  readonly remywikiUrlPath: string
  readonly remywikiTitle: string
  readonly remywikiChara: string
  readonly genreRomanTrans: string
  readonly labels: string[]
  readonly charts: SongCharts | null

  constructor({
    id,
    title,
    sortTitle,
    genre,
    sortGenre,
    artist,
    character1,
    character2,
    debut,
    folder,
    slug,
    remywikiUrlPath,
    remywikiTitle,
    remywikiChara,
    genreRomanTrans,
    labels,
    charts,
  }: SongContructorProps) {
    this.id = id
    this.title = Song.fixKonamiChars(title)
    this.sortTitle = sortTitle
    this.genre = Song.fixKonamiChars(genre)
    this.sortGenre = sortGenre
    this.artist = Song.fixKonamiChars(artist)
    this.character1 = character1
    this.character2 = character2
    this.debut = debut
    this.folder = folder
    this.slug = slug
    this.remywikiUrlPath = remywikiUrlPath
    this.remywikiTitle = remywikiTitle
    this.remywikiChara = remywikiChara
    this.genreRomanTrans = genreRomanTrans
    this.labels = labels
    this.charts = charts
  }
}
