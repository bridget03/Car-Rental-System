import styles from "./styles.module.css";
import { FaCheck } from "react-icons/fa";
import React from "react";

type Props = {
    currentStep: number;
    steps: { value: any; name: string }[];
};

export default function StepDisplay({ currentStep, steps }: Props) {
    return (
        <div className={styles.stepContainer}>
            <div className={styles.stepWrapper}>
                {steps.map((step, index) => {
                    return (
                        <React.Fragment key={index}>
                            {index !== 0 && <hr className={styles.throughLine} />}
                            <div
                                className={`${styles.stepGroup} ${currentStep === step.value ? styles.active : ""} ${
                                    currentStep > step.value ? styles.completed : ""
                                }`}
                            >
                                <button className={styles.stepIndicator}>
                                    {currentStep > step.value ? <FaCheck /> : step.value}
                                </button>
                                <span className={styles.stepLabel}>{step.name}</span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
