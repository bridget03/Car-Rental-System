import { CarImageSlider } from "@/components/CarInfomation/CarImageSlider/CarImageSlider";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { Booking } from "@/utils/types/Booking";
import { CarBase } from "@/utils/types/Car";
import { useContext, useEffect, useState } from "react";

import { currencySymbol, formatCurrencyForFrontend } from "@/utils/Currency";
import { ToastContext } from "@/components/Toast/ToastContextProvider";
import Overlay from "@/components/Overlay/Overlay";
import Modal from "@/components/Modals/Modal";
import { CiCalendar } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import {
  calculatePrice,
  calculateRentalDays,
  formatDate,
} from "@/utils/helperFunctions";

interface Props {
    booking: Booking;
    car: CarBase;
    forPage?: "list" | "details" | undefined;
    handleUpdate?: () => void;
    handleMutate?: () => void;
}

export const BookingListItem: React.FC<Props> = ({ booking, car, forPage, handleMutate, handleUpdate }) => {
    if (!forPage) forPage = "details";

    const [bookingIdToCancel, setBookingIdToCancel] = useState<string>("");
    const [idToConfirmPickup, setIdToConfirmPickup] = useState<string>("");
    const [idToReturn, setIdToReturn] = useState<string>("");

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const [message, setMessage] = useState<string>("");

    const toastContext = useContext(ToastContext);
    const createToast = toastContext ? toastContext.createToast : () => {};

    const router = useRouter();
    const carImages: string[] = Object.values(car.images);

    const rentalDays = calculateRentalDays(booking.pickupDate, booking.dropOffDate);
    const totalBasePrice = calculatePrice(rentalDays, car.basePrice);

    const handleCloseModalCancel = () => {
        setIsCancelModalOpen(false);
    };
    const handelCloseModalPickup = () => {
        setIsPickupModalOpen(false);
    };
    const handleCloseModalReturn = () => {
        setIsReturnModalOpen(false);
    };

    const handleViewDetails = (bookingId: string) => {
        router.push(`/my-booking/${bookingId}`);
    };
    const handleViewCarDetails = (carId: string) => {
        router.push(`/cars/${carId}`);
    };

    const fetchApi = async (id: string, action: string) => {
        try {
            const response = await fetch(`/api/bookings/${action}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (handleMutate) {
                    handleMutate();
                }

                createToast({
                    type: "success",
                    title: "Success",
                    message: data.message,
                });
            } else if (response.status === 400) {
                const data = await response.json();
                createToast({
                    type: "error",
                    title: "Error",
                    message: data.error,
                });
            } else if (response.status === 200) {
                const data = await response.json();
                setMessage(data.message);
                console.log(message);
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData.error);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const handleConfirmPickup = () => {
        fetchApi(idToConfirmPickup, "confirmpickup");
    };
    const handleCancelled = () => {
        fetchApi(bookingIdToCancel, "cancel");
    };
    const handleReturn = () => {
        fetchApi(idToReturn, "returncar");
    };

    const fetchReturnMessage = async (bookingId: string) => {
        try {
            const response = await fetch(`/api/bookings/returncar/${bookingId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setMessage(data.message);
                console.log(message);
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData.error);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    return (
        <div className={styles.card}>
            {forPage === "details" && (
                <div className={`${styles.container} ${styles.tall}`}>
                    {/* Ảnh */}
                    <div className={styles.imageContainer}>
                        <CarImageSlider images={carImages} />
                    </div>

                    {/* Nội dung */}
                    <div className={`${styles.content} `}>
                        {/* Car Details */}
                        <div className={styles.header}>
                            <h1 className={styles.title}>{car.name}</h1>
                            <p className={styles.brandModel}>
                                {car.brand} - {car.model} ({car.productionYear})
                            </p>
                        </div>
                        <hr className={styles.horizontalDivider} />
                        {/* Booking Info */}
                        <div className={styles.detailGroup}>
                            <div className={styles.detailRow}>
                                <p className={styles.subTitle}>Booking No: </p>
                                <span className={styles.highlightText}>{booking.id}</span>
                            </div>

                            <div className={styles.detailRow}>
                                <p className={styles.subTitle}>Booking status: </p>
                                <span className={styles.highlightText}>{booking.status}</span>
                            </div>
                        </div>
                        {/* Time */}
                        <div className={styles.detailGroup}>
                            <div className={styles.detailItem}>
                                <span className={styles.subTitle}>Pickup Time</span>
                                <p className={styles.iconText}>
                                    <CiCalendar />
                                    {formatDate(booking.pickupDate!)}
                                </p>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.subTitle}>Drop off Time</span>
                                <p className={styles.iconText}>
                                    <CiCalendar />
                                    {formatDate(booking.dropOffDate!)}
                                </p>
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.subTitle}>Number of days</span>
                                <p className={styles.iconText}>
                                    <IoMdTime /> {calculateRentalDays(booking.pickupDate, booking.dropOffDate)} days
                                </p>
                            </div>
                        </div>
                        {/* Payment */}
                        <div className={styles.detailGroup}>
                            <div className={styles.detailRow}>
                                <p className={styles.subTitle}>Total Payment</p>
                                <p className={styles.priceTotal}>
                                    {totalBasePrice}
                                    <sup>{currencySymbol}</sup>
                                </p>
                            </div>

                            <div className={styles.detailRow}>
                                <p className={styles.subTitle}>Base Price</p>
                                <p className={styles.priceDeposit}>
                                    {formatCurrencyForFrontend(car.basePrice)}
                                    <sup>{currencySymbol}</sup>
                                </p>
                            </div>
                            <div className={styles.detailRow}>
                                <p className={styles.subTitle}>Deposited</p>
                                <p className={styles.priceDeposit}>
                                    {formatCurrencyForFrontend(car.deposit)}
                                    <sup>{currencySymbol}</sup>
                                </p>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className={styles.btns}>
                            <button className={styles.book}>
                                <span onClick={() => handleViewCarDetails(car.id)}>View Car</span>
                            </button>
                            {booking.status === "confirmed" && (
                                <button className={styles.book}>
                                    <span
                                        onClick={() => {
                                            setIsPickupModalOpen(true);
                                            setIdToConfirmPickup(booking.id!);
                                        }}
                                    >
                                        Confirm Pickup
                                    </span>
                                </button>
                            )}

                            {(booking.status === "confirmed" ||
                                booking.status === "pendingDeposit" ||
                                booking.status === "stopped") && (
                                <button className={styles.book}>
                                    <span
                                        onClick={() => {
                                            setIsCancelModalOpen(true);
                                            setBookingIdToCancel(booking.id!);
                                        }}
                                    >
                                        Cancel Booking
                                    </span>
                                </button>
                            )}

                            {booking.status === "inProgress" && (
                                <button className={styles.book}>
                                    <span
                                        onClick={() => {
                                            setIsReturnModalOpen(true);
                                            setIdToReturn(booking.id!);
                                            fetchReturnMessage(booking.id!);
                                        }}
                                    >
                                        Return a car
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {forPage === "list" && (
                <div className={`${styles.container} ${styles.long}`}>
                    {/* Ảnh */}
                    <div className={styles.imageContainer}>
                        <CarImageSlider images={carImages} />
                    </div>

                    {/* Nội dung */}
                    <div className={`${styles.content} `}>
                        {/* Header */}

                        <div className={styles.header}>
                            {/* Car Details */}
                            <div className={styles.detailGroup}>
                                <h1 className={styles.title}>{car.name}</h1>
                                <p className={styles.brandModel}>
                                    {car.brand} - {car.model} ({car.productionYear})
                                </p>
                                <div className={styles.responsiveRow}>
                                    <div className={styles.detailLine}>
                                        <p className={styles.subTitle}>Booking No: </p>
                                        <span className={styles.highlightText}>{booking.id}</span>
                                    </div>

                                    <div className={styles.detailLine}>
                                        <p className={styles.subTitle}>Booking status: </p>
                                        <span className={styles.highlightText}>{booking.status}</span>
                                    </div>
                                </div>
                            </div>
                            <hr className={styles.horizontalDivider} />
                            <div className={styles.detailRow}>
                                <div className={`${styles.gridCol} ${styles.gridColLeft}`}>
                                    {/* Time */}
                                    <div className={styles.detailGroup}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.subTitle}> Pickup Time</span>
                                            <p className={styles.iconText}>{formatDate(booking.pickupDate!)}</p>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.subTitle}> Drop off Time</span>
                                            <p className={styles.iconText}>{formatDate(booking.dropOffDate!)}</p>
                                        </div>

                                        <div className={styles.detailItem}>
                                            <span className={styles.subTitle}>Number of days</span>
                                            <p className={styles.iconText}>
                                                {calculateRentalDays(booking.pickupDate, booking.dropOffDate)} days
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${styles.gridCol} ${styles.gridColRight}`}>
                                    {/* Payment */}
                                    <div className={styles.detailGroup}>
                                        <div className={styles.responsiveRow}>
                                            <div className={styles.detailItem}>
                                                <p className={styles.subTitle}>Base Price</p>
                                                <p className={styles.priceDeposit}>
                                                    {formatCurrencyForFrontend(car.basePrice)}
                                                    <sup>{currencySymbol}</sup>
                                                </p>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <p className={styles.subTitle}>Deposited</p>
                                                <p className={styles.priceDeposit}>
                                                    {formatCurrencyForFrontend(car.deposit)}
                                                    <sup>{currencySymbol}</sup>
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <p className={styles.subTitle}>Total Payment</p>
                                            <p className={styles.priceTotal}>
                                                {totalBasePrice}
                                                <sup>{currencySymbol}</sup>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className={styles.btns}>
                            <button className={styles.book}>
                                <span
                                    onClick={() => {
                                        handleViewDetails(booking.id!);
                                    }}
                                >
                                    View Details
                                </span>
                            </button>

                            {booking.status === "confirmed" && (
                                <button className={styles.book}>
                                    <span
                                        onClick={() => {
                                            setIsPickupModalOpen(true);
                                            setIdToConfirmPickup(booking.id!);
                                        }}
                                    >
                                        Confirm Pickup
                                    </span>
                                </button>
                            )}

                            {(booking.status === "confirmed" ||
                                booking.status === "pendingDeposit" ||
                                booking.status === "stopped") && (
                                <button className={styles.book}>
                                    <span
                                        onClick={() => {
                                            setIsCancelModalOpen(true);
                                            setBookingIdToCancel(booking.id!);
                                        }}
                                    >
                                        Cancel Booking
                                    </span>
                                </button>
                            )}

                            {booking.status === "inProgress" && (
                                <button className={styles.book}>
                                    <span
                                        onClick={() => {
                                            setIsReturnModalOpen(true);
                                            setIdToReturn(booking.id!);
                                            fetchReturnMessage(booking.id!);
                                        }}
                                    >
                                        Return a car
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Overlay isOpen={isCancelModalOpen} handleCloseModal={handleCloseModalCancel}>
                <Modal
                    title="Cancel"
                    type="confirm"
                    cancelText="Cancel"
                    confirmText="Yes"
                    handleCloseModal={handleCloseModalCancel}
                    onConfirm={handleCancelled}
                >
                    Are you sure you want to cancel this booking?
                </Modal>
            </Overlay>
            <Overlay isOpen={isPickupModalOpen} handleCloseModal={handelCloseModalPickup}>
                <Modal
                    title="Confirm Pick-up"
                    type="confirm"
                    cancelText="Cancel"
                    confirmText="Yes"
                    handleCloseModal={handelCloseModalPickup}
                    onConfirm={handleConfirmPickup}
                >
                    Are you sure you want to confirm pick-up ?
                </Modal>
            </Overlay>
            <Overlay isOpen={isReturnModalOpen} handleCloseModal={handleCloseModalReturn}>
                <Modal
                    title="Return a car"
                    type="confirm"
                    cancelText="Cancel"
                    confirmText="Yes"
                    handleCloseModal={handleCloseModalReturn}
                    onConfirm={handleReturn}
                >
                    {message}
                </Modal>
            </Overlay>
        </div>
    );
};
