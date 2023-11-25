import React from "react"
import Song from "../../models/Song"
import LevelPill from "../LevelPill"

interface SongLevelPillsProps {
  pillClassName?: string
  song: Song
  pillStyle: "full" | "compact"
  labelStyle: "full" | "compact"
}

/**
 * Convenience "macro" component for displaying all of a song's levels.
 */
export default function SongLevelPills({
  pillClassName,
  song,
  pillStyle,
  labelStyle,
}: SongLevelPillsProps) {
  return (
    <>
      {song.easyLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="e"
          level={song.easyLevel}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
      {song.normalLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="n"
          level={song.normalLevel}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
      {song.hyperLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="h"
          level={song.hyperLevel}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
      {song.exLevel && (
        <LevelPill
          className={pillClassName}
          difficulty="ex"
          level={song.exLevel}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
    </>
  )
}
