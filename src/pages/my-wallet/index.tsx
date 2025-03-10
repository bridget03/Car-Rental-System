import styles from "./styles.module.css";
import BreadCrumb from "@/components/breadcrumb";
import { useState } from "react";
import { Tomorrow } from "next/font/google";
import { PiHandDepositBold } from "react-icons/pi";
import { PiHandWithdrawBold } from "react-icons/pi";
import Overlay from "@/components/Overlay/Overlay";
import Modal from "@/components/Modals/Modal";
import useSWR from "swr";
import { formatCurrencyForFrontend, currencySymbol } from "@/utils/Currency";

const tomorrowFont = Tomorrow({
    subsets: ["latin"],
    display: "swap",
    weight: "500",
});

type ModalType = "withdraw" | "topup" | "alert" | "";

export default function Page() {
    const [currentWithdrawAmount, setCurrentWithdrawAmount] = useState<number | string>(0);
    const [currentTopupAmount, setCurrentTopupAmount] = useState<number>(0);
    const [activeModal, setActiveModal] = useState<ModalType>("");
    const [isOpen, setOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then((res) => res.json());
    const { data, error, isLoading, mutate } = useSWR("/api/users", fetcher);

    const handleUpdateWithdrawAmount = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentWithdrawAmount(e.target.value);
    };
    const handleUpdateTopupAmount = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentTopupAmount(parseInt(e.target.value));
    };

    const handleConfirmWithdraw = () => {
        if (currentWithdrawAmount === 0) {
            setTimeout(() => {
                setAlertMessage("Please select an amount to withdraw");
                handleOpenModal("alert");
            }, 1);
            return;
        }

        fetch("/api/wallet/withdraw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: currentWithdrawAmount + "" }),
        })
            .then((res) => res.json())
            .then((data) => {
                mutate();
                setCurrentWithdrawAmount(0);
                setAlertMessage(data.success);
                handleOpenModal("alert");
            })
            .catch((error) => alert(error));
    };

    const handleConfirmTopup = () => {
        if (!currentTopupAmount) {
            setTimeout(() => {
                setAlertMessage("Please select an amount to top-up");
                handleOpenModal("alert");
            }, 1);
            return;
        }
        fetch("/api/wallet/topup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: currentTopupAmount + "" }),
        })
            .then((res) => res.json())
            .then((data) => {
                mutate();
                setCurrentTopupAmount(0);
                setAlertMessage(data.success);
                handleOpenModal("alert");
            })
            .catch((error) => alert(error));
    };

    const handleCloseModal = () => {
        setOpen(false);
    };
    const handleOpenModal = (type: ModalType) => {
        setOpen(true);
        setActiveModal(type);
    };

    if (error) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;

    return (
        <div
            style={{
                maxWidth: "var(--max-width)",
                margin: "auto",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <BreadCrumb />
            <Overlay isOpen={isOpen} handleCloseModal={handleCloseModal}>
                {activeModal === "withdraw" && (
                    <WithdrawModal
                        handleConfirmWithdraw={handleConfirmWithdraw}
                        handleCloseModal={handleCloseModal}
                        handleUpdateWithdrawAmount={handleUpdateWithdrawAmount}
                        currentBalance={data.wallet}
                    />
                )}
                {activeModal === "topup" && (
                    <TopupModal
                        handleConfirmTopup={handleConfirmTopup}
                        handleCloseModal={handleCloseModal}
                        handleUpdateTopupAmount={handleUpdateTopupAmount}
                        currentBalance={data.wallet}
                    />
                )}
                {activeModal === "alert" && (
                    <Modal type="alert" handleCloseModal={handleCloseModal}>
                        <p className={styles.modalMessage}>{alertMessage}</p>
                    </Modal>
                )}
            </Overlay>
            <div className={styles["balance"]}>
                <div className={styles["balance-card"]} style={{ backgroundImage: `url(/bg-pattern.png)` }}>
                    <p className={styles["section-title"]}>Your Current Balance</p>
                    <div className={`${styles["balance-display"]} ${tomorrowFont.className}`}>
                        <p>
                            {formatCurrencyForFrontend(data.wallet)}

                            <sup className={styles["currency-symbol"]}>{currencySymbol}</sup>
                        </p>
                        <hr className={styles.underline} />
                    </div>
                </div>
                <div className={styles["card-btn-container"]}>
                    <button
                        className={`${styles["card-btn"]} ${styles["card-btn-primary"]} `}
                        onClick={() => handleOpenModal("withdraw")}
                    >
                        <PiHandWithdrawBold />
                        Withdraw
                    </button>
                    <button
                        className={`${styles["card-btn"]} ${styles["card-btn-secondary"]} `}
                        onClick={() => handleOpenModal("topup")}
                    >
                        <PiHandDepositBold />
                        Top Up
                    </button>
                </div>
            </div>
        </div>
    );
}

function WithdrawModal({
    handleConfirmWithdraw,
    handleCloseModal,
    handleUpdateWithdrawAmount,
    currentBalance,
}: {
    handleConfirmWithdraw: () => void;
    handleCloseModal: () => void;
    handleUpdateWithdrawAmount: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    currentBalance: number;
}) {
    return (
        <Modal type="confirm" title="Withdraw" onConfirm={handleConfirmWithdraw} handleCloseModal={handleCloseModal}>
            <p className={styles.modalMessage}>
                <span>
                    Your current balance is{" "}
                    <strong>
                        {formatCurrencyForFrontend(currentBalance)}
                        <sup>{currencySymbol}</sup>
                    </strong>
                </span>
                <label>Please select the amount to withdraw from your wallet</label>
            </p>
            <select className={styles.selectBox} onChange={handleUpdateWithdrawAmount} defaultValue={""} required>
                {currentBalance > 0 && (
                    <option value="" selected disabled>
                        --Select an amount--
                    </option>
                )}
                {currentBalance >= 2000000 && <option value="2000000">2.000.000</option>}
                {currentBalance >= 5000000 && <option value="5000000">5.000.000</option>}
                {currentBalance >= 10000000 && <option value="10000000">10.000.000</option>}
                {currentBalance > 0 && <option value="all">All balance</option>}
                {currentBalance === 0 && (
                    <option value="" disabled>
                        You do not have enough fund
                    </option>
                )}
            </select>
        </Modal>
    );
}

function TopupModal({
    handleConfirmTopup,
    handleCloseModal,
    handleUpdateTopupAmount,
    currentBalance,
}: {
    handleConfirmTopup: () => void;
    handleCloseModal: () => void;
    handleUpdateTopupAmount: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    currentBalance: number;
}) {
    return (
        <Modal type="confirm" title="Top Up" onConfirm={handleConfirmTopup} handleCloseModal={handleCloseModal}>
            <p className={styles.modalMessage}>
                <span>
                    Your current balance is{" "}
                    <strong>
                        {formatCurrencyForFrontend(currentBalance)}
                        <sup>{currencySymbol}</sup>
                    </strong>
                </span>
                <label>Please select the amount to top-up to your wallet</label>
            </p>
            <select className={styles.selectBox} onChange={handleUpdateTopupAmount} required>
                <option value="" selected disabled>
                    --Select an amount--
                </option>
                <option value="2000000">2.000.000</option>
                <option value="5000000">5.000.000</option>
                <option value="10000000">10.000.000</option>
            </select>
        </Modal>
    );
}
