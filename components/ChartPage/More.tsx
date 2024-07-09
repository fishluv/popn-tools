import cx from "classnames"
import styles from "./More.module.scss"
import { BsGithub } from "react-icons/bs"
import { MdRefresh } from "react-icons/md"
import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc"
import useLocalStorage from "../../lib/useLocalStorage"
import { useState } from "react"
import { StringParam, useQueryParams } from "use-query-params"
import Measure, { makeLaneTransform } from "./Measure"
import MeasureData from "../../models/MeasureData"

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
  const [storedTransform, storeTransform] = useLocalStorage(
    "chart.transform",
    "nonran",
  )
  const [transform, setTransform] = useState<ChartTransform>(
    storedTransform as ChartTransform,
  )

  const [storedRandom, storeRandom] = useLocalStorage("chart.random", "")
  const [random, setRandom] = useState<string>(storedRandom)

  const [storedRran, storeRran] = useLocalStorage("chart.rran", "r1")
  const [rranNum, setRranNum] = useState<number>(
    Number(storedRran.match(/\d/)![0]),
  )
  const [rranMir, setRranMir] = useState<boolean>(storedRran.endsWith("m"))

  const [_, setQueryParams] = useQueryParams({
    r: StringParam,
  })

  function onTransformChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { id } = event.target
    if (id === "nonranRadio") {
      setTransform("nonran")
    } else if (id === "mirrorRadio") {
      setTransform("mirror")
    } else if (id === "randomRadio") {
      setTransform("random")
    } else if (id === "rranRadio") {
      setTransform("rran")
    } else {
      console.warn(`More: Unknown id ${id}`)
    }
  }

  function onRandomChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    setRandom(value.replace(/[^1-9]/g, ""))
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

  function onSaveClick() {
    const transformStr = makeTransformStr()
    if (transform === "random") {
      storeRandom(transformStr!)
    } else if (transform === "rran") {
      storeRran(transformStr!)
    }
    storeTransform(transform)
    setQueryParams({ r: transformStr })
  }

  return (
    <div className={styles.More}>
      <button
        className={styles.text}
        onClick={onSaveClick}
        disabled={transform === "random" && !isRandomValid()}
      >
        Apply and save
      </button>

      <h6>Transform options</h6>

      <div className={styles.transformOptions}>
        <div className={styles.nonran}>
          <input
            id="nonranRadio"
            type="radio"
            checked={transform === "nonran"}
            onChange={onTransformChange}
          />
          <label htmlFor="nonranRadio">Nonran</label>
        </div>

        <div className={styles.mirror}>
          <input
            id="mirrorRadio"
            type="radio"
            checked={transform === "mirror"}
            onChange={onTransformChange}
          />
          <label htmlFor="mirrorRadio">Mirror</label>
        </div>

        <div className={styles.random}>
          <div>
            <input
              id="randomRadio"
              type="radio"
              checked={transform === "random"}
              onChange={onTransformChange}
            />
            <label htmlFor="randomRadio">Random</label>
          </div>

          <div className={styles.subControl}>
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
              onChange={onRandomChange}
              value={random}
            />
            <button
              className={styles.icon}
              onClick={() =>
                setRandom(
                  random
                    .split("")
                    .sort(() => Math.random() - 0.5)
                    .join(""),
                )
              }
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
              onChange={onTransformChange}
            />
            <label htmlFor="rranRadio">R-ran</label>
          </div>

          <div className={styles.subControl}>
            <button
              className={styles.icon}
              onClick={() => setRranNum((rranNum + 8) % 9)}
            >
              <VscTriangleLeft />
            </button>
            <div className={styles.description}>
              <span>{`Right ${rranNum}`}</span>
              <span>{`(Left ${(9 - rranNum) % 9})`}</span>
            </div>
            <button
              className={styles.icon}
              onClick={() => setRranNum((rranNum + 1) % 9)}
            >
              <VscTriangleRight />
            </button>
          </div>

          <div className={styles.subControl}>
            <input
              id="rranMirCheckbox"
              type="checkbox"
              checked={rranMir}
              onChange={() => setRranMir(!rranMir)}
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

      <h6>Display options</h6>

      <h6>What is this?</h6>
      <p>This is a tool for viewing pop&apos;n music chart data.</p>

      <div className={styles.github}>
        <span className={styles.sha}>{process.env.GIT_SHA}</span>
        <a href="https://github.com/fishluv/popn-tools" target="_blank">
          <BsGithub />
        </a>
      </div>
    </div>
  )
}
