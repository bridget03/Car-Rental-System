import { createPortal } from "react-dom";
import React from "react";
import styles from "./styles.module.css";

interface Props {
    isOpen: boolean;
    handleCloseModal: () => void;
    children: React.ReactNode;
}

export default function Overlay({ isOpen, handleCloseModal, children }: Props) {
    if (isOpen)
        return createPortal(
            <div className={styles.container}>
                <div className={styles.overlay} onClick={handleCloseModal}></div>
                {children}
            </div>,
            document.body
        );
}
