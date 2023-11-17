import { SearchApiCharacterResult } from "../lib/fetch"

interface CharacterContructorProps {
  id: number
  charaId: string
  icon1: string
  displayName: string
  sortChar: string
  romanTransName: string | null
}

export default class Character {
  static fromSearchApiCharacterResult({
    id,
    chara_id,
    icon1,
    disp_name,
    sort_char,
    romantrans_name,
  }: SearchApiCharacterResult) {
    return new Character({
      id,
      charaId: chara_id,
      icon1,
      displayName: disp_name,
      sortChar: sort_char,
      romanTransName: romantrans_name,
    })
  }

  readonly id: number
  readonly charaId: string
  readonly icon1: string
  readonly displayName: string
  readonly sortChar: string
  readonly romanTransName: string | null

  constructor({
    id,
    charaId,
    icon1,
    displayName,
    sortChar,
    romanTransName,
  }: CharacterContructorProps) {
    this.id = id
    this.charaId = charaId
    this.icon1 = icon1
    this.displayName = displayName
    this.sortChar = sortChar
    this.romanTransName = romanTransName
  }
}
