import React from "react"
import Song from "../models/Song"
import LevelPill from "./LevelPill"

interface SongLevelPillsProps {
  pillClassName?: string
  song: Song
  style: "full" | "comfortable" | "compact"
}

/**
 * Convenience "macro" component for displaying all of a song's levels.
 */
export default function SongLevelPills({
  pillClassName,
  song,
  style,
}: SongLevelPillsProps) {
  return (
    <>
      {song.easyLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="e"
          level={song.easyLevel}
          style={style}
        />
      )}
      {song.normalLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="n"
          level={song.normalLevel}
          style={style}
        />
      )}
      {song.hyperLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="h"
          level={song.hyperLevel}
          style={style}
        />
      )}
      {song.exLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="ex"
          level={song.exLevel}
          style={style}
        />
      )}
    </>
  )
}
