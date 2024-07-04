import cx from "classnames"
import styles from "./More.module.scss"
import { BsGithub } from "react-icons/bs"
import { MdRefresh } from "react-icons/md"
import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc"
import useLocalStorage from "../../lib/useLocalStorage"
import { useState } from "react"
import { StringParam, useQueryParams } from "use-query-params"

type ChartTransform = "nonran" | "mirror" | "random" | "rran"

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

  function onSaveClick() {
    if (transform === "nonran") {
      setQueryParams({ r: undefined })
    } else if (transform === "mirror") {
      setQueryParams({ r: "mirror" })
    } else if (transform === "random") {
      storeRandom(random)
      setQueryParams({ r: random })
    } else if (transform === "rran") {
      const rranStr = `r${rranNum}${rranMir ? "m" : ""}`
      storeRran(rranStr)
      setQueryParams({ r: rranStr })
    }
    storeTransform(transform)
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

      <div>
        <input
          id="nonranRadio"
          type="radio"
          checked={transform === "nonran"}
          onChange={onTransformChange}
        />
        <label htmlFor="nonranRadio">Nonran</label>
      </div>

      <div>
        <input
          id="mirrorRadio"
          type="radio"
          checked={transform === "mirror"}
          onChange={onTransformChange}
        />
        <label htmlFor="mirrorRadio">Mirror</label>
      </div>

      <div className={styles.random}>
        <input
          id="randomRadio"
          type="radio"
          checked={transform === "random"}
          onChange={onTransformChange}
        />
        <label htmlFor="randomRadio">Random</label>

        {transform === "random" && (
          <div className={styles.controls}>
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
        )}
      </div>

      <div className={styles.rran}>
        <input
          id="rranRadio"
          type="radio"
          checked={transform === "rran"}
          onChange={onTransformChange}
        />
        <label htmlFor="rranRadio">R-ran</label>

        {transform === "rran" && (
          <div className={styles.controls}>
            <div className={styles.rightLeft}>
              <button
                className={styles.icon}
                onClick={() => setRranNum(((rranNum + 6) % 8) + 1)}
              >
                <VscTriangleLeft />
              </button>
              <div className={styles.description}>
                <span>{`Right ${rranNum}`}</span>
                <span>{`(Left ${9 - rranNum})`}</span>
              </div>
              <button
                className={styles.icon}
                onClick={() => setRranNum((rranNum % 8) + 1)}
              >
                <VscTriangleRight />
              </button>
            </div>
            <div>
              <input
                id="rranMirCheckbox"
                type="checkbox"
                checked={rranMir}
                onChange={() => setRranMir(!rranMir)}
              />
              <label htmlFor="rranMirCheckbox">Mirror</label>
            </div>
          </div>
        )}
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
