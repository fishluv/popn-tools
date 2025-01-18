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
  romanTitle: string
  genre: string
  sortGenre: string
  romanGenre: string
  artist: string
  character1: Character | null
  character2: Character | null
  romanCharas: string
  debut: Debut | null
  folders: (VersionFolder | BemaniFolder)[]
  slug: string
  remywikiUrlPath: string
  labels: string[]
  // Included in /songs response but not in /charts response.
  charts: SongCharts | null
}

export default class Song {
  static fromSearchApiSongResult({
    id,
    title,
    fw_title,
    r_title,
    genre,
    fw_genre,
    r_genre,
    artist,
    character1,
    character2,
    r_chara,
    debut,
    folders,
    slug,
    remywiki_url_path,
    labels,
    charts,
  }: SearchApiSongResult): Song {
    return new Song({
      id,
      title,
      sortTitle: fw_title,
      romanTitle: r_title,
      genre,
      sortGenre: fw_genre,
      romanGenre: r_genre,
      artist,
      character1: character1
        ? Character.fromSearchApiCharacterResult(character1)
        : null,
      character2: character2
        ? Character.fromSearchApiCharacterResult(character2)
        : null,
      romanCharas: r_chara,
      debut: parseDebut(debut),
      folders: folders
        .map((f) => parseVersionFolder(f) || parseBemaniFolder(f))
        .filter(Boolean) as (VersionFolder | BemaniFolder)[],
      slug,
      remywikiUrlPath: remywiki_url_path,
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
  readonly romanTitle: string
  readonly genre: string
  readonly sortGenre: string
  readonly romanGenre: string
  readonly artist: string
  readonly character1: Character | null
  readonly character2: Character | null
  readonly romanCharas: string
  readonly debut: Debut | null
  readonly folders: (VersionFolder | BemaniFolder)[]
  readonly slug: string
  readonly remywikiUrlPath: string
  readonly labels: string[]
  readonly charts: SongCharts | null

  constructor({
    id,
    title,
    sortTitle,
    romanTitle,
    genre,
    sortGenre,
    romanGenre,
    artist,
    character1,
    character2,
    romanCharas,
    debut,
    folders,
    slug,
    remywikiUrlPath,
    labels,
    charts,
  }: SongContructorProps) {
    this.id = id
    this.title = title
    this.sortTitle = sortTitle
    this.romanTitle = romanTitle
    this.genre = genre
    this.sortGenre = sortGenre
    this.romanGenre = romanGenre
    this.artist = artist
    this.character1 = character1
    this.character2 = character2
    this.romanCharas = romanCharas
    this.debut = debut
    this.folders = folders
    this.slug = slug
    this.remywikiUrlPath = remywikiUrlPath
    this.labels = labels
    this.charts = charts
  }
}
