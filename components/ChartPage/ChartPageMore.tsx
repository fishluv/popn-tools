import cx from "classnames"
import toast from "react-hot-toast"
import styles from "./ChartPageMore.module.scss"
import { MdRefresh } from "react-icons/md"
import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc"
import useLocalStorage from "../../lib/useLocalStorage"
import { useCallback, useEffect, useState } from "react"
import { BooleanParam, StringParam, useQueryParams } from "use-query-params"
import Measure, {
  NoteColoring,
  NoteSpacing,
  makeLaneTransform,
  parseNoteColoring,
  parseNoteSpacing,
} from "./Measure"
import MeasureData from "../../models/MeasureData"
import More from "../common/More"

type ChartTransform = "nonran" | "mirror" | "cross" | "random" | "rran"

const PREVIEW_MEASURE_DATA = new MeasureData({
  rows: [
    {
      timestamp: 0,
      key: 1,
      keyon: null,
      keyoff: null,
      measurebeatend: "m",
      bpm: 150,
    },
    {
      timestamp: 100,
      key: 2,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 200,
      key: 4,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 300,
      key: 8,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 400,
      key: 16,
      keyon: null,
      keyoff: null,
      measurebeatend: "b",
      bpm: null,
    },
    {
      timestamp: 500,
      key: 32,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 600,
      key: 64,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 700,
      key: 128,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 800,
      key: 256,
      keyon: null,
      keyoff: null,
      measurebeatend: "b",
      bpm: null,
    },
  ],
  index: 1,
  startKeyOn: 0,
  startBpm: 150,
  startNoteCount: 0,
  duration: 800,
})

export default function ChartPageMore() {
  const [storedHiSpeed, storeHiSpeed] = useLocalStorage(
    "chart.hispeed",
    "default",
  )
  const [hiSpeed, setHiSpeed] = useState<NoteSpacing>(
    storedHiSpeed as NoteSpacing,
  )

  const [storedNormalize, storeNormalize] = useLocalStorage(
    "chart.normalize",
    "0",
  )
  const [normalize, setNormalize] = useState<boolean>(storedNormalize === "1")

  const [storedTransform, storeTransform] = useLocalStorage(
    "chart.transform",
    "nonran",
  )
  const [transform, setTransform] = useState<ChartTransform>(
    storedTransform as ChartTransform,
  )

  const [storedRandom, storeRandom] = useLocalStorage("chart.random", "")
  const [random, setRandom] = useState<string>(storedRandom)

  const [storedRranNum, storeRranNum] = useLocalStorage("chart.rranNum", "1")
  const [rranNum, setRranNum] = useState<number>(Number(storedRranNum))
  const [storedRranMir, storeRranMir] = useLocalStorage("chart.rranMir", "0")
  const [rranMir, setRranMir] = useState<boolean>(storedRranMir === "1")

  const [storedNoteColoring, storeNoteColoring] = useLocalStorage(
    "chart.noteColoring",
    "normal",
  )
  const [noteColoring, setNoteColoring] = useState<NoteColoring>(
    storedNoteColoring as NoteColoring,
  )

  const [queryParams, setQueryParams] = useQueryParams({
    hs: StringParam, // Hi-speed
    normalize: BooleanParam,
    t: StringParam, // Transform
    color: StringParam, // Note coloring
  })

  const transformToTransformStr = useCallback(
    function () {
      if (transform === "nonran") {
        return undefined
      } else if (transform === "mirror") {
        return "mirror"
      } else if (transform === "cross") {
        return "cross"
      } else if (transform === "random") {
        return random
      } else if (transform === "rran") {
        return `r${rranNum}${rranMir ? "m" : ""}`
      }
      return undefined
    },
    [transform, random, rranNum, rranMir],
  )

  const onApplyClick = useCallback(
    function () {
      setQueryParams({
        hs: hiSpeed,
        normalize,
        t: transformToTransformStr(),
        color: noteColoring,
      })
      toast("✔️ Changes applied")
    },
    [setQueryParams, hiSpeed, normalize, transformToTransformStr, noteColoring],
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Make sure no text inputs are active!
      if (
        document.activeElement?.tagName?.toLowerCase() === "input" &&
        document.activeElement?.getAttribute("type") === "text"
      ) {
        return
      }

      const { key, repeat } = event
      if (repeat) {
        return
      }

      if (key === "a") {
        onApplyClick()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onApplyClick])

  function changeHiSpeed(newHiSpeed: NoteSpacing) {
    setHiSpeed(newHiSpeed)
    storeHiSpeed(newHiSpeed)
  }

  function changeNormalize(newNormalize: boolean) {
    setNormalize(newNormalize)
    storeNormalize(newNormalize ? "1" : "0")
  }

  function changeTransform(newTransform: ChartTransform) {
    setTransform(newTransform)
    storeTransform(newTransform)
  }

  function changeRandom(newRandom: string) {
    const norm = newRandom.replace(/[^1-9]/g, "")
    setRandom(norm)
    storeRandom(norm)
  }

  function changeRranNum(newRranNum: number) {
    setRranNum(newRranNum)
    storeRranNum(String(newRranNum))
  }

  function changeRranMir(newRranMir: boolean) {
    setRranMir(newRranMir)
    storeRranMir(newRranMir ? "1" : "0")
  }

  function changeNoteColoring(newNoteColor: NoteColoring) {
    setNoteColoring(newNoteColor)
    storeNoteColoring(newNoteColor)
  }

  function isRandomValid() {
    return random.split("").sort().join("") === "123456789"
  }

  function onSyncClick() {
    const { hs, normalize, t, color } = queryParams
    changeHiSpeed(parseNoteSpacing(hs))
    changeNormalize(!!normalize)
    changeNoteColoring(parseNoteColoring(color))

    let match
    if (t === null || t === undefined || t === "nonran") {
      changeTransform("nonran")
    } else if (t === "mirror") {
      changeTransform("mirror")
    } else if (t === "cross") {
      changeTransform("cross")
      // eslint-disable-next-line no-cond-assign
    } else if ((match = t.match(/^\d+$/))) {
      changeTransform("random")
      changeRandom(match[0])
      // eslint-disable-next-line no-cond-assign
    } else if ((match = t.match(/^r(\d)(m?)$/))) {
      changeTransform("rran")
      changeRranNum(Number(match[1]))
      changeRranMir(!!match[2])
    }
  }

  function onDefaultsClick() {
    changeHiSpeed("default")
    changeNormalize(false)
    changeTransform("nonran")
    changeRandom("")
    changeRranNum(1)
    changeRranMir(false)
    changeNoteColoring("normal")
  }

  return (
    <More className={styles.ChartPageMore}>
      <div className={styles.topButtons}>
        <button
          className={styles.apply}
          onClick={onApplyClick}
          disabled={transform === "random" && !isRandomValid()}
        >
          Apply
        </button>

        <button onClick={onSyncClick}>Sync</button>
        <button onClick={onDefaultsClick}>Defaults</button>
      </div>

      <h6>Hi-speed</h6>

      <div className={styles.hiSpeed}>
        <div className={styles.line} />

        <div className={styles.subControl}>
          <input
            id="verySlowRadio"
            type="radio"
            checked={hiSpeed === "veryslow"}
            onChange={() => changeHiSpeed("veryslow")}
          />
          <label htmlFor="verySlowRadio">Very slow</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="slowRadio"
            type="radio"
            checked={hiSpeed === "slow"}
            onChange={() => changeHiSpeed("slow")}
          />
          <label htmlFor="slowRadio">Slow</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="defaultRadio"
            type="radio"
            checked={hiSpeed === "default"}
            onChange={() => changeHiSpeed("default")}
          />
          <label htmlFor="defaultRadio">Default</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="fastRadio"
            type="radio"
            checked={hiSpeed === "fast"}
            onChange={() => changeHiSpeed("fast")}
          />
          <label htmlFor="fastRadio">Fast</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="veryFastRadio"
            type="radio"
            checked={hiSpeed === "veryfast"}
            onChange={() => changeHiSpeed("veryfast")}
          />
          <label htmlFor="veryFastRadio">Very fast</label>
        </div>
      </div>

      <div className={styles.normalizeBpm}>
        <input
          id="normalizeBpmRadio"
          type="checkbox"
          checked={normalize}
          onChange={() => changeNormalize(!normalize)}
        />
        <label htmlFor="normalizeBpmRadio">
          Normalize (Ignore bpm changes)
        </label>
      </div>

      <h6>Transform</h6>

      <div className={styles.transformOptions}>
        <div className={styles.firstCol}>
          <div className={styles.nonran}>
            <input
              id="nonranRadio"
              type="radio"
              checked={transform === "nonran"}
              onChange={() => changeTransform("nonran")}
            />
            <label htmlFor="nonranRadio">Nonran</label>
          </div>

          <div className={styles.mirror}>
            <input
              id="mirrorRadio"
              type="radio"
              checked={transform === "mirror"}
              onChange={() => changeTransform("mirror")}
            />
            <label htmlFor="mirrorRadio">Mirror</label>
          </div>

          <div className={styles.random}>
            <div>
              <input
                id="randomRadio"
                type="radio"
                checked={transform === "random"}
                onChange={() => changeTransform("random")}
              />
              <label htmlFor="randomRadio">Random</label>
            </div>

            <div className={cx(styles.subControl, styles.withButton)}>
              <input
                id="randomInput"
                className={cx(
                  styles.randomInput,
                  isRandomValid() ? styles.valid : styles.invalid,
                )}
                type="text"
                inputMode="numeric"
                placeholder="123456789"
                maxLength={9}
                size={9}
                onChange={(event) => changeRandom(event.target.value)}
                value={random}
                disabled={transform !== "random"}
              />
              <button
                className={styles.icon}
                onClick={() =>
                  changeRandom(
                    "123456789"
                      .split("")
                      .sort(() => Math.random() - 0.5)
                      .join(""),
                  )
                }
                disabled={transform !== "random"}
              >
                <MdRefresh />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.secondCol}>
          <div className={styles.cross}>
            <input
              id="crossRadio"
              type="radio"
              checked={transform === "cross"}
              onChange={() => changeTransform("cross")}
            />
            <label htmlFor="crossRadio">Cross (クロス)</label>
          </div>

          <div className={styles.rran}>
            <div>
              <input
                id="rranRadio"
                type="radio"
                checked={transform === "rran"}
                onChange={() => changeTransform("rran")}
              />
              <label htmlFor="rranRadio">R-ran</label>
            </div>

            <div className={cx(styles.subControl, styles.withButton)}>
              <button
                className={styles.icon}
                onClick={() => changeRranNum((rranNum + 8) % 9)}
                disabled={transform !== "rran"}
              >
                <VscTriangleLeft />
              </button>
              <div className={styles.description}>
                <span>{`Right ${rranNum}`}</span>
                <span>{`(Left ${(9 - rranNum) % 9})`}</span>
              </div>
              <button
                className={styles.icon}
                onClick={() => changeRranNum((rranNum + 1) % 9)}
                disabled={transform !== "rran"}
              >
                <VscTriangleRight />
              </button>
            </div>

            <div className={styles.subControl}>
              <input
                id="rranMirCheckbox"
                type="checkbox"
                checked={rranMir}
                onChange={() => changeRranMir(!rranMir)}
                disabled={transform !== "rran"}
              />
              <label htmlFor="rranMirCheckbox">Mirror</label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.transformPreview}>
        <Measure
          className={styles.Measure}
          measureData={PREVIEW_MEASURE_DATA}
          chartOptions={{
            laneTransform: makeLaneTransform(transformToTransformStr()),
          }}
          displayOptions={{
            noteSpacing: "veryslow",
            bpmAgnostic: false,
            noteColoring,
            chartEditingMode: false,
          }}
        />
      </div>

      <h6>Note color</h6>
      <div className={styles.noteColor}>
        <div className={styles.normal}>
          <input
            id="normalColorRadio"
            type="radio"
            checked={noteColoring === "normal"}
            onChange={() => changeNoteColoring("normal")}
          />
          <label htmlFor="normalColorRadio">Normal</label>
        </div>

        <div className={styles.rhythm}>
          <input
            id="rhythmRadio"
            type="radio"
            checked={noteColoring === "rhythm"}
            onChange={() => changeNoteColoring("rhythm")}
          />
          <label htmlFor="rhythmRadio">Rhythm</label>
        </div>
      </div>

      <h6>Tips</h6>
      <ul>
        <li>
          Changes will not take effect until <span>Apply</span> is clicked.
        </li>
        <li>
          Use <span>Sync</span> to sync this modal with what the chart currently
          looks like.
          <br />
          You can use this to discard your pending changes, or to get in sync
          with options set in the url.
        </li>
        <li>
          <code>s</code> opens this modal. <code>q</code> opens the search
          modal. <code>a</code> clicks <span>Apply</span>.
        </li>
      </ul>
    </More>
  )
}
