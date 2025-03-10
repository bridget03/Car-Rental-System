import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { CiCircleCheck } from "react-icons/ci";
import { CiCircleAlert } from "react-icons/ci";
import { MdOutlineClose } from "react-icons/md";

import { useContext } from "react";
import { ToastContext } from "./ToastContextProvider";
import { ToastContextType, ToastType } from "@/utils/types/Car";

export default function Toast({ type, duration, title, message }: ToastType) {
  const waitTime = duration! + 500;
  const [isActive, setActive] = useState<boolean>(true);
  const { addDoneCount } = useContext(ToastContext) as ToastContextType;

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleCloseToast();
      addDoneCount();
    }, waitTime);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleCloseToast = () => {
    setActive(false);
  };

  if (!isActive) return null;
  return (
    <div
      className={`${styles.toastItem} ${type === "success" ? styles.success : ""} ${
        type === "error" ? styles.error : ""
      }`}
      style={{ "--duration": `${duration! / 1000}s` } as React.CSSProperties}
    >
      <div className={styles.iconContainer}>
        {type === "success" && <CiCircleCheck size={24} />}
        {type === "error" && <CiCircleAlert size={24} />}
      </div>
      <div className={styles.toastContent}>
        <div className={styles.toastHeader}>
          <p className={styles.toastTitle}>{title}</p>
          <button className={styles.closeBtn} onClick={handleCloseToast}>
            <MdOutlineClose />
          </button>
        </div>
        <p className={styles.toastMessage}>{message}</p>
      </div>
      <div className={styles.toastProgressBar}></div>
    </div>
  );
}
