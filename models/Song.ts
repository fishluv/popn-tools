import { SearchApiSongResult } from "../lib/search"
import Character from "./Character"
import Chart from "./Chart"
import Debut, { parseDebut } from "./Debut"
import BemaniFolder, { parseBemaniFolder } from "./BemaniFolder"
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
  folders: (VersionFolder | BemaniFolder)[]
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
    folders,
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
      folders: folders
        .map((f) => parseVersionFolder(f) || parseBemaniFolder(f))
        .filter(Boolean) as (VersionFolder | BemaniFolder)[],
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

  readonly id: number
  readonly title: string
  readonly sortTitle: string
  readonly genre: string
  readonly sortGenre: string
  readonly artist: string
  readonly character1: Character | null
  readonly character2: Character | null
  readonly debut: Debut | null
  readonly folders: (VersionFolder | BemaniFolder)[]
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
    folders,
    slug,
    remywikiUrlPath,
    remywikiTitle,
    remywikiChara,
    genreRomanTrans,
    labels,
    charts,
  }: SongContructorProps) {
    this.id = id
    this.title = title
    this.sortTitle = sortTitle
    this.genre = genre
    this.sortGenre = sortGenre
    this.artist = artist
    this.character1 = character1
    this.character2 = character2
    this.debut = debut
    this.folders = folders
    this.slug = slug
    this.remywikiUrlPath = remywikiUrlPath
    this.remywikiTitle = remywikiTitle
    this.remywikiChara = remywikiChara
    this.genreRomanTrans = genreRomanTrans
    this.labels = labels
    this.charts = charts
  }
}
