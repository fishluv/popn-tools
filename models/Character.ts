import { SearchApiCharacterResult } from "../lib/search"

interface CharacterContructorProps {
  id: number
  charaId: string
  icon1: string
  displayName: string
  sortName: string
}

export default class Character {
  static fromSearchApiCharacterResult({
    id,
    chara_id,
    icon1,
    disp_name,
    sort_name,
  }: SearchApiCharacterResult) {
    return new Character({
      id,
      charaId: chara_id,
      icon1,
      displayName: disp_name,
      sortName: sort_name,
    })
  }

  readonly id: number
  readonly charaId: string
  readonly icon1: string
  readonly displayName: string
  readonly sortName: string

  constructor({
    id,
    charaId,
    icon1,
    displayName,
    sortName,
  }: CharacterContructorProps) {
    this.id = id
    this.charaId = charaId
    this.icon1 = icon1
    this.displayName = displayName
    this.sortName = sortName
  }
}
