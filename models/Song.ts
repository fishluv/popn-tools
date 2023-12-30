import { SearchApiSongResult } from "../lib/fetch"
import Character from "./Character"
import Folder from "./Folder"

interface SongContructorProps {
  id: number
  title: string
  titleSortChar: string
  genre: string
  genreSortChar: string
  artist: string
  character: Character
  easyLevel?: number
  normalLevel?: number
  hyperLevel?: number
  exLevel?: number
  folder: Folder
  slug: string
  remywikiUrlPath: string
  remywikiTitle: string
  remywikiChara: string
  genreRomanTrans: string
  labels: string[]
}

export default class Song {
  static fromSearchApiSongResult({
    id,
    title,
    title_sort_char,
    genre,
    genre_sort_char,
    artist,
    character,
    easy_diff,
    normal_diff,
    hyper_diff,
    ex_diff,
    folder,
    slug,
    remywiki_url_path,
    remywiki_title,
    remywiki_chara,
    genre_romantrans,
    labels,
  }: SearchApiSongResult) {
    return new Song({
      id,
      title,
      titleSortChar: title_sort_char,
      genre,
      genreSortChar: genre_sort_char,
      artist,
      character: Character.fromSearchApiCharacterResult(character),
      easyLevel: easy_diff,
      normalLevel: normal_diff,
      hyperLevel: hyper_diff,
      exLevel: ex_diff,
      folder: new Folder(folder),
      slug,
      remywikiUrlPath: remywiki_url_path,
      remywikiTitle: remywiki_title,
      remywikiChara: remywiki_chara,
      genreRomanTrans: genre_romantrans,
      labels,
    })
  }

  readonly id: number
  readonly title: string
  readonly titleSortChar: string
  readonly genre: string
  readonly genreSortChar: string
  readonly artist: string
  readonly character: Character
  readonly easyLevel?: number
  readonly normalLevel?: number
  readonly hyperLevel?: number
  readonly exLevel?: number
  readonly folder: Folder
  readonly slug: string
  readonly remywikiUrlPath: string
  readonly remywikiTitle: string
  readonly remywikiChara: string
  readonly genreRomanTrans: string
  readonly labels: string[]

  constructor({
    id,
    title,
    titleSortChar,
    genre,
    genreSortChar,
    artist,
    character,
    easyLevel,
    normalLevel,
    hyperLevel,
    exLevel,
    folder,
    slug,
    remywikiUrlPath,
    remywikiTitle,
    remywikiChara,
    genreRomanTrans,
    labels,
  }: SongContructorProps) {
    this.id = id
    this.title = title
    this.titleSortChar = titleSortChar
    this.genre = genre
    this.genreSortChar = genreSortChar
    this.artist = artist
    this.character = character
    this.easyLevel = easyLevel
    this.normalLevel = normalLevel
    this.hyperLevel = hyperLevel
    this.exLevel = exLevel
    this.folder = folder
    this.slug = slug
    this.remywikiUrlPath = remywikiUrlPath
    this.remywikiTitle = remywikiTitle
    this.remywikiChara = remywikiChara
    this.genreRomanTrans = genreRomanTrans
    this.labels = labels
  }
}
