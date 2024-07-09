import cx from "classnames"
import styles from "./More.module.scss"
import { BsGithub } from "react-icons/bs"
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

  const [storedRran, storeRran] = useLocalStorage("chart.rran", "r1")
  const [rranNum, setRranNum] = useState<number>(
    Number(storedRran.match(/\d/)![0]),
  )
  const [rranMir, setRranMir] = useState<boolean>(storedRran.endsWith("m"))

  const [_, setQueryParams] = useQueryParams({
    hs: StringParam, // Hi-speed
    normalize: BooleanParam,
    t: StringParam, // Transform
  })

  function onHiSpeedChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { id } = event.target
    if (id === "verySlowRadio") {
      setHiSpeed("veryslow")
    } else if (id === "slowRadio") {
      setHiSpeed("slow")
    } else if (id === "defaultRadio") {
      setHiSpeed("default")
    } else if (id === "fastRadio") {
      setHiSpeed("fast")
    } else if (id === "veryFastRadio") {
      setHiSpeed("veryfast")
    } else {
      console.warn(`More: Unknown id ${id}`)
    }
  }

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
    storeHiSpeed(hiSpeed)
    storeNormalize(normalize ? "1" : "0")

    const transformStr = makeTransformStr()
    if (transform === "random") {
      storeRandom(transformStr!)
    } else if (transform === "rran") {
      storeRran(transformStr!)
    }
    storeTransform(transform)

    setQueryParams({ hs: hiSpeed, normalize: normalize, t: transformStr })
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

      <h6>Hi-speed</h6>

      <div className={styles.hiSpeed}>
        <div className={styles.line} />

        <div className={styles.subControl}>
          <input
            id="verySlowRadio"
            type="radio"
            checked={hiSpeed === "veryslow"}
            onChange={onHiSpeedChange}
          />
          <label htmlFor="verySlowRadio">Very slow</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="slowRadio"
            type="radio"
            checked={hiSpeed === "slow"}
            onChange={onHiSpeedChange}
          />
          <label htmlFor="slowRadio">Slow</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="defaultRadio"
            type="radio"
            checked={hiSpeed === "default"}
            onChange={onHiSpeedChange}
          />
          <label htmlFor="defaultRadio">Default</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="fastRadio"
            type="radio"
            checked={hiSpeed === "fast"}
            onChange={onHiSpeedChange}
          />
          <label htmlFor="fastRadio">Fast</label>
        </div>

        <div className={styles.subControl}>
          <input
            id="veryFastRadio"
            type="radio"
            checked={hiSpeed === "veryfast"}
            onChange={onHiSpeedChange}
          />
          <label htmlFor="veryFastRadio">Very fast</label>
        </div>
      </div>

      <div className={styles.normalizeBpm}>
        <input
          id="normalizeBpmRadio"
          type="checkbox"
          checked={normalize}
          onChange={() => setNormalize(!normalize)}
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

          <div className={cx(styles.subControl, styles.withButton)}>
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

      <h6>Tips</h6>
      <ul>
        <li>
          For now, to view another chart, go back to{" "}
          <Link href="/search?m=chart" target="_blank">
            the chart search page
          </Link>
          .
        </li>
      </ul>

      <div className={styles.github}>
        <span className={styles.sha}>{process.env.GIT_SHA}</span>
        <a href="https://github.com/fishluv/popn-tools" target="_blank">
          <BsGithub />
        </a>
      </div>
    </div>
  )
}
