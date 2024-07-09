import { BsGithub } from "react-icons/bs"
import { FiX } from "react-icons/fi"
import ReactModal from "react-modal"
import styles from "./CommonModal.module.scss"

interface CommonModalProps {
  isOpen: boolean
  onClose(): void
  children: React.ReactNode
  showGithub: boolean
}

export default function CommonModal({
  isOpen,
  onClose,
  children,
  showGithub,
}: CommonModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Song info modal"
      onRequestClose={onClose}
      style={{
        overlay: { zIndex: 100 },
        content: {
          width: "320px",
          left: "calc(50% - 160px)",
          top: "10vh",
          padding: "0",
          overflowX: "hidden",
          overflowY: "scroll",
        },
      }}
    >
      <button className={styles.closeButton} onClick={onClose}>
        <FiX />
      </button>

      <div className={styles.modal}>{children}</div>

      {showGithub && (
        <div className={styles.github}>
          <span className={styles.sha}>{process.env.GIT_SHA}</span>
          <a href="https://github.com/fishluv/popn-tools" target="_blank">
            <BsGithub />
          </a>
        </div>
      )}
    </ReactModal>
  )
}
