import Toast from "@/components/Toast/Toast";
import styles from "./styles.module.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ToastContext } from "@/components/Toast/ToastContextProvider";
import { ToastContextType } from "@/utils/types/Car";

export default function ToastContainer() {
    const { toast } = useContext(ToastContext) as ToastContextType;
    const [currentToastLength, setCurrentToastLength] = useState(toast.length);
    const [playAnimation, setPlayAnimation] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const shakeDuration = 200;

    useEffect(() => {
        if (currentToastLength < toast.length) {
            setPlayAnimation(false);
            setTimeout(() => {
                setPlayAnimation(true);
            }, 1);
            setTimeout(() => {
                setPlayAnimation(false);
            }, shakeDuration);
        }
        setCurrentToastLength(toast.length);
    }, [toast]);

    useEffect(() => {
        console.log(`${Date.now()}: ${playAnimation}`);
    }, [playAnimation]);

    return (
        <div
            className={`${styles.toastContainer} ${playAnimation ? styles.shakeAnimation : ""}`}
            ref={containerRef}
            style={{ "--shakeDuration": `${shakeDuration! / 1000}s` } as React.CSSProperties}
        >
            <div className={styles.toastList}>
                {toast &&
                    toast.map((item, index) => (
                        <Toast
                            type={item.type}
                            key={index}
                            title={item.title}
                            message={item.message}
                            duration={item.duration}
                        />
                    ))}
            </div>
        </div>
    );
}
