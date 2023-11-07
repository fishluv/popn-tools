import { FiX } from "react-icons/fi"
import ReactModal from "react-modal"
import styles from "./CommonModal.module.scss"

interface CommonModalProps {
  isOpen: boolean
  onClose(): void
  children: React.ReactNode
}

export default function CommonModal({
  isOpen,
  onClose,
  children,
}: CommonModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Song info modal"
      onRequestClose={onClose}
      style={{
        overlay: { zIndex: 10 },
        content: {
          width: "320px",
          minHeight: "fit-content",
          left: "calc(50% - 160px)",
          top: "10%",
          padding: "0",
          overflow: "visible",
        },
      }}
    >
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        {children}
      </div>
    </ReactModal>
  )
}
