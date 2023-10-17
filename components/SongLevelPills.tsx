import React from "react"
import Song from "../models/Song"
import LevelPill from "./LevelPill"

interface SongLevelPillsProps {
  song: Song
  style: "full" | "compact"
}

/**
 * Convenience "macro" component for displaying all of a song's levels.
 */
export default function SongLevelPills({ song, style }: SongLevelPillsProps) {
  return (
    <>
      {song.easyLevel && (
        <LevelPill difficulty="e" level={song.easyLevel} style={style} />
      )}
      {song.normalLevel && (
        <LevelPill difficulty="n" level={song.normalLevel} style={style} />
      )}
      {song.hyperLevel && (
        <LevelPill difficulty="h" level={song.hyperLevel} style={style} />
      )}
      {song.exLevel && (
        <LevelPill difficulty="ex" level={song.exLevel} style={style} />
      )}
    </>
  )
}
