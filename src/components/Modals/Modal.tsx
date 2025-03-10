import styles from "./styles.module.css";
import { MouseEvent } from "react";
import { MdOutlineClose } from "react-icons/md";

type Props = {
    title?: string;
    children: React.ReactNode;
    handleCloseModal: () => void;
    confirmText?: string;
    cancelText?: string;
} & (
    | {
          type: "confirm";
          onConfirm: () => void;
      }
    | {
          type: "alert";
          onConfirm?: never;
      }
);

export default function Modal({
    title,
    children,
    type,
    cancelText = "Cancel",
    confirmText = "Ok",
    onConfirm,
    handleCloseModal,
}: Props) {
    const handleConfirm = (e: MouseEvent) => {
        if (onConfirm) onConfirm();
        handleCloseModal();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.header}>
                <p className={styles.title}>{title}</p>
                {title && (
                    <button className={styles.closeBtn} onClick={handleCloseModal}>
                        <MdOutlineClose />
                    </button>
                )}
            </div>
            <div className={styles.content}>{children}</div>
            {type === "confirm" && (
                <div className={styles.btnContainer}>
                    <button className={`${styles.btn} ${styles.btnSecondary} `} onClick={handleCloseModal}>
                        {cancelText}
                    </button>
                    <button className={`${styles.btn} ${styles.btnPrimary} `} onClick={handleConfirm}>
                        {confirmText}
                    </button>
                </div>
            )}

            {type === "alert" && (
                <div className={styles.btnContainer}>
                    <button className={`${styles.btn} ${styles.btnPrimary} `} onClick={handleCloseModal}>
                        {confirmText}
                    </button>
                </div>
            )}
        </div>
    );
}
