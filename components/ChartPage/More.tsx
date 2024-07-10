import cx from "classnames"
import styles from "./More.module.scss"
import { MdRefresh } from "react-icons/md"
import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc"
import useLocalStorage from "../../lib/useLocalStorage"
import { useState } from "react"
import { BooleanParam, StringParam, useQueryParams } from "use-query-params"
import Measure, { NoteSpacing, makeLaneTransform } from "./Measure"
import MeasureData from "../../models/MeasureData"
import Link from "next/link"

type ChartTransform = "nonran" | "mirror" | "random" | "rran"

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
      timestamp: 50,
      key: 2,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 100,
      key: 4,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 150,
      key: 8,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 200,
      key: 16,
      keyon: null,
      keyoff: null,
      measurebeatend: "b",
      bpm: null,
    },
    {
      timestamp: 250,
      key: 32,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 300,
      key: 64,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 350,
      key: 128,
      keyon: null,
      keyoff: null,
      measurebeatend: null,
      bpm: null,
    },
    {
      timestamp: 400,
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
  duration: 400,
})

export default function More() {
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

  const [extraOptions, setExtraOptions] = useLocalStorage("extraOptions", "")

  const [_, setQueryParams] = useQueryParams({
    hs: StringParam, // Hi-speed
    normalize: BooleanParam,
    t: StringParam, // Transform
  })

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

  function isRandomValid() {
    return random.split("").sort().join("") === "123456789"
  }

  function makeTransformStr() {
    if (transform === "nonran") {
      return undefined
    } else if (transform === "mirror") {
      return "mirror"
    } else if (transform === "random") {
      return random
    } else if (transform === "rran") {
      return `r${rranNum}${rranMir ? "m" : ""}`
    }
    return undefined
  }

  function onApplyClick() {
    setQueryParams({ hs: hiSpeed, normalize: normalize, t: makeTransformStr() })
  }

  function onResetClick() {
    if (
      window.confirm(
        'Reset options to default values? Options will not be applied until you click "Apply and save".',
      )
    ) {
      changeHiSpeed("default")
      changeNormalize(false)
      changeTransform("nonran")
      changeRandom("")
      changeRranNum(1)
      changeRranMir(false)
    }
  }

  return (
    <div className={styles.More}>
      <div className={styles.topButtons}>
        <button
          onClick={onApplyClick}
          disabled={transform === "random" && !isRandomValid()}
        >
          Apply
        </button>

        <button onClick={onResetClick}>Reset</button>
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

      <div className={styles.transformPreview}>
        <Measure
          className={styles.Measure}
          measureData={PREVIEW_MEASURE_DATA}
          chartOptions={{
            laneTransform: makeLaneTransform(makeTransformStr()),
          }}
          displayOptions={{
            noteSpacing: "default",
            bpmAgnostic: false,
          }}
        />
      </div>

      <h6>Tips</h6>
      <ul>
        <li>
          For now, to view another chart, go back to{" "}
          <Link href="/search?m=chart" target="_blank">
            the chart search page
          </Link>
          .
        </li>
        <li>
          <code>s</code> and <code>esc</code> open and close this modal.
        </li>
      </ul>

      <h6>Extra options</h6>
      <input
        className={styles.extraOptionsInput}
        type="text"
        value={extraOptions}
        onChange={(event) => {
          setExtraOptions(event.target.value)
        }}
      />
    </div>
  )
}
