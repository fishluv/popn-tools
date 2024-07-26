import React from "react"
import { SongCharts } from "../../models/Song"
import LevelPill from "./LevelPill"

interface SongLevelPillsProps {
  pillClassName?: string
  songCharts: SongCharts
  pillStyle: "full" | "compact"
  labelStyle: "full" | "compact"
}

/**
 * Convenience "macro" component for displaying all of a song's levels.
 */
export default function SongLevelPills({
  pillClassName,
  songCharts: { easy, normal, hyper, ex },
  pillStyle,
  labelStyle,
}: SongLevelPillsProps) {
  return (
    <>
      {easy && (
        <LevelPill
          className={pillClassName}
          difficulty="e"
          level={easy.level}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
      {normal && (
        <LevelPill
          className={pillClassName}
          difficulty="n"
          level={normal.level}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
      {hyper && (
        <LevelPill
          className={pillClassName}
          difficulty="h"
          level={hyper.level}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
      {ex && (
        <LevelPill
          className={pillClassName}
          difficulty="ex"
          level={ex.level}
          pillStyle={pillStyle}
          labelStyle={labelStyle}
        />
      )}
    </>
  )
}
