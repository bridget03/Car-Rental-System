import React, { useEffect, useState } from "react";
import styles from "./PaymentInfo.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { Booking } from "@/utils/types/Booking";
import { IoDocumentSharp, IoPersonSharp } from "react-icons/io5";
import { ToggleInput } from "../FormInput/InputComponent";
import { MdError, MdOutlinePayment } from "react-icons/md";
import { currencySymbol, formatCurrencyForFrontend } from "@/utils/Currency";
import { Tomorrow } from "next/font/google";

const PaymentInfo = ({
    paymentMethod,
    totalPayment,
    deposited,
    bookingStatus,
    userBalance,
}: {
    paymentMethod: string;
    totalPayment: number | string;
    deposited: number | string;
    userBalance: number;
    bookingStatus: Booking["status"];
}) => {
    return (
        <div className={styles.formGroup}>
            <div className={styles.formGroupHeader}>
                <h2>
                    Your selected method of payment is{" "}
                    <span className={`${styles.highlightText}`}>{paymentMethod}</span>
                </h2>
            </div>
            {paymentMethod === "wallet" && (
                <>
                    <div className={styles.paymentDescription}>
                        {(bookingStatus === "confirmed" || bookingStatus === "inProgress") && (
                            <div className={styles.walletContainer}>
                                <p className={styles.walletHeading}>Current Balance:</p>
                                <p className={`${styles.walletBalance} ${styles.highlightText}`}>
                                    {formatCurrencyForFrontend(userBalance)} <sup>{currencySymbol}</sup>
                                </p>
                            </div>
                        )}
                        <div className={styles.walletContainer}>
                            <p className={styles.walletHeading}>Total Payment:</p>
                            <p className={`${styles.walletBalance} `}>
                                {formatCurrencyForFrontend(totalPayment)} <sup>{currencySymbol}</sup>
                            </p>
                        </div>
                        <div className={styles.walletContainer}>
                            <p className={styles.walletHeading}>Deposited</p>
                            <p className={`${styles.walletBalance} `}>
                                {formatCurrencyForFrontend(deposited)} <sup>{currencySymbol}</sup>
                            </p>
                        </div>
                        <hr className={styles.horizontalDivider} />

                        {(bookingStatus === "confirmed" || bookingStatus === "inProgress") && (
                            <div className={styles.walletContainer}>
                                <p className={styles.walletHeading}>Remaining Amount:</p>
                                <p className={`${styles.walletBalance} `}>
                                    {formatCurrencyForFrontend(Number(totalPayment) - Number(deposited))}{" "}
                                    <sup>{currencySymbol}</sup>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={styles.paymentDescription}>
                        {(bookingStatus === "confirmed" || bookingStatus === "inProgress") && (
                            <p className={styles.walletAlert}>
                                <MdError />
                                Please make sure to have sufficient balance when you return the car.{" "}
                                <span>
                                    Go to <Link href={"my-wallet"}>My Wallet</Link> to Top-up
                                </span>
                            </p>
                        )}
                        {bookingStatus === "cancelled" && (
                            <p className={styles.walletAlert}>Your deposit has been refunded</p>
                        )}
                        {bookingStatus === "completed" && (
                            <p className={styles.walletConfirm}>Your transaction has been completed</p>
                        )}
                    </div>
                </>
            )}

            {paymentMethod !== "wallet" && (
                <>
                    <div className={styles.paymentDescription}>
                        {(bookingStatus === "pendingDeposit" ||
                            bookingStatus === "pendingPayment" ||
                            bookingStatus === "inProgress") && (
                            <p className={styles.walletAlert}>Our operator will contact you for further instructions</p>
                        )}
                        {(bookingStatus === "confirmed" || bookingStatus === "completed") && (
                            <p className={styles.walletAlert}>Payment fulfiled</p>
                        )}
                        {bookingStatus === "cancelled" && (
                            <p className={styles.walletAlert}>This transaction has been cancelled</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentInfo;
