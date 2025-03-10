import BreadCrumb from "@/components/breadcrumb";
import styles from "./styles.module.css";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { getSession, useSession } from "next-auth/react";
import { Formik } from "formik";
import { IoPersonSharp } from "react-icons/io5";

import { User, CityType } from "@type/User";
import { TextInput, SelectInput, ImageInput, ToggleInput } from "@/components/FormInput/InputComponent";
import StepDisplay from "@/components/StepDisplay/StepDisplay";
import { formatPhoneForBackend, formatPhoneForFrontend } from "@/utils/Phone";
import { formatCurrencyForFrontend, currencySymbol } from "@/utils/Currency";
import { Tomorrow } from "next/font/google";
import { MdError } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";
import Link from "next/link";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { userValidationSchema } from "@/components/FormInput/FormValidation";

import useAddress from "@/utils/hooks/useAddress";
import { useRouter } from "next/router";
import CarDetailsCard from "@/components/CarDetailsCard/CarDetailsCard";

import { CarBase } from "@/utils/types/Car";
import { getRentDuration, getRentTotalPayment, scrollToTop } from "@/utils/utils";
import { Booking } from "@/utils/types/Booking";

import Overlay from "@/components/Overlay/Overlay";
import Modal from "@/components/Modals/Modal";

const tomorrowFont = Tomorrow({
    subsets: ["latin"],
    display: "swap",
    weight: "500",
});

type BookingInformationTypes = {
    renter: User;
    driver: User | null;
    isDriver: boolean;
};

type PageProps = {
    address: CityType[];
    carData: CarBase;
    start: { date: string | string[]; time: string | string[] };
    end: { date: string | string[]; time: string | string[] };
};

type PaymentTypes = { payment: "cash" | "wallet" | "transfer" };

type BookingResponse = {
    success: boolean;
    bookingNumber?: string;
    error?: string;
};

const ModalContext = React.createContext<any>(null);

export default function Page({ address, start, end, carData }: PageProps) {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [bookingData, setBookingData] = useState<Booking>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<any>();
    const { data: session } = useSession();
    const [userData, setUserData] = useState<User>();
    const [bookingResponse, setBookingResponse] = useState<BookingResponse | undefined>();

    const steps = [
        { value: 1, name: "booking information" },
        { value: 2, name: "payment" },
        { value: 3, name: "finish" },
    ];

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleUpdateRenterData = (data: BookingInformationTypes) => {
        const submitData = {
            ...bookingData,
            renterInformation: { ...data.renter, phone: formatPhoneForBackend(data.renter.phone!) },
            driverInformation: data.isDriver
                ? { ...data.driver, phone: formatPhoneForBackend(data.driver?.phone!) }
                : null,
        };
        setBookingData(submitData);
        handleNextStep();
    };

    const handleCreateBooking = async (data: PaymentTypes) => {
        handleNextStep();

        const body = {
            carId: carData.id,
            pickupDate: `${start.date}T${start.time}`,
            dropOffDate: `${end.date}T${end.time}`,
            driverInformation: bookingData?.driverInformation,
            renterInformation: bookingData?.renterInformation,
            paymentMethod: data.payment,
        };
        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.status === 200) {
                setBookingResponse({
                    success: true,
                    bookingNumber: data.bookingNumber,
                });
            } else {
                setBookingResponse({
                    success: false,
                    error: data.error,
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => (prev === 3 ? 3 : prev + 1));
    };

    useEffect(() => {
        try {
            const fetchUserData = async () => {
                const response = await fetch(`/api/users?email=${session?.user?.email}`);
                const data = await response.json();
                setUserData(data);
            };
            fetchUserData();
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    }, []);

    useEffect(() => {
        scrollToTop();
    }, [currentStep]);

    useEffect(() => {
        if (bookingResponse) {
            setCurrentStep(4);
        }
    }, [bookingResponse]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <BreadCrumb />
            <Overlay isOpen={showModal} handleCloseModal={handleCloseModal}>
                {modalContent}
            </Overlay>

            <ModalContext.Provider value={{ handleOpenModal, handleCloseModal, setModalContent }}>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <StepDisplay currentStep={currentStep} steps={steps} />

                        {currentStep === 1 && (
                            <BookingInformation
                                handleUpdateRenterData={handleUpdateRenterData}
                                address={address}
                                userData={userData}
                                start={start}
                                end={end}
                                carData={carData}
                            />
                        )}
                        {currentStep === 2 && (
                            <Payment
                                handleCreateBooking={handleCreateBooking}
                                userData={userData}
                                carData={carData}
                                start={start}
                                end={end}
                            />
                        )}
                        {currentStep >= 3 && (
                            <Finish carData={carData} start={start} end={end} bookingResponse={bookingResponse} />
                        )}
                    </div>

                    {currentStep < 3 && (
                        <>
                            <hr className={styles.verticalDivider} />
                            <div className={styles.right}>
                                <CarDetailsCard car={carData} />
                            </div>
                        </>
                    )}
                </div>
            </ModalContext.Provider>
        </div>
    );
}

function NavButtons({ handleSubmit }: { handleSubmit: () => void }) {
    const router = useRouter();

    const { setModalContent, handleOpenModal, handleCloseModal } = useContext(ModalContext);

    const handleCancel = () => {
        setModalContent(() => {
            return (
                <Modal
                    type="confirm"
                    onConfirm={() => router.push("/")}
                    handleCloseModal={handleCloseModal}
                    confirmText="Yes"
                    cancelText="No"
                >
                    <p>Are you sure you want to cancel booking?</p>
                </Modal>
            );
        });
        handleOpenModal();
    };

    return (
        <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={handleCancel}>
                <FaChevronLeft />
                Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSubmit}>
                Next
                <FaChevronRight />
            </button>
        </div>
    );
}

function BookingInformation({
    handleUpdateRenterData,
    address,
    userData,
    carData,
    start,
    end,
}: {
    handleUpdateRenterData: (data: BookingInformationTypes) => void;
    address: CityType[];
    userData: User;
    carData: CarBase;
    start: { date: string | string[]; time: string | string[] };
    end: { date: string | string[]; time: string | string[] };
}) {
    const renterAddress = useAddress(address, userData);
    const driverAddress = useAddress(address);
    const initialValues: BookingInformationTypes = {
        renter: {
            name: userData?.name || "",
            phone: userData ? formatPhoneForFrontend(userData.phone!) : "",
            nationalID: userData?.nationalID || "",
            dateOfBirth: userData?.dateOfBirth || "",
            email: userData?.email || "",
            drivingLicense: userData?.drivingLicense || "",
            address: {
                city: userData?.address?.city || "",
                district: userData?.address?.district || "",
                ward: userData?.address?.ward || "",
                houseNumberStreet: userData?.address?.houseNumberStreet || "",
            },
        },
        driver: {
            name: "",
            phone: "",
            nationalID: "",
            dateOfBirth: "",
            email: "",
            drivingLicense: "",
            address: {
                city: "",
                district: "",
                ward: "",
                houseNumberStreet: "",
            },
        },
        isDriver: false,
    };
    const validationSchema: Yup.ObjectSchema<BookingInformationTypes> = Yup.object().shape({
        isDriver: Yup.boolean().required(),
        renter: userValidationSchema,
        driver: Yup.object().when("isDriver", {
            is: (val: any) => {
                return !!val;
            },
            then: () => userValidationSchema,
            otherwise: () => Yup.object(),
        }),
    });

    return (
        <>
            <div className={styles.bookingInfo}>
                <div className={`${styles.formGroupHeader}`}>
                    <p>
                        <IoPersonSharp className={styles.iconStyle} />
                        <span>Booking Details</span>
                    </p>

                    <hr className={styles.horizontalDivider} />
                </div>
                <div className={styles.bookingDetail}>
                    <div className={styles.bookingDetailItem}>
                        <span className={styles.bookingDetailTitle}>Pick-up location: </span>
                        <span className={styles.bookingDetailValue}>{carData.location}</span>
                    </div>

                    <div className={styles.bookingDetailItem}>
                        <span className={styles.bookingDetailTitle}>Pick-up date and time: </span>
                        <span className={styles.bookingDetailValue}>
                            {start.time} - {start.date}
                        </span>
                    </div>
                    <div className={styles.bookingDetailItem}>
                        <span className={styles.bookingDetailTitle}>Return date and time: </span>
                        <span className={styles.bookingDetailValue}>
                            {end.time} - {end.date}
                        </span>
                    </div>
                </div>
            </div>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleUpdateRenterData}>
                {({ handleSubmit, setFieldValue, values, resetForm }) => (
                    <form className={styles.formContainer}>
                        <ToggleInput
                            options={[
                                {
                                    name: "isDriver",
                                    value: false,
                                    label: "I'm the driver",
                                    checked: values.isDriver == false,
                                    onClick: () => {
                                        resetForm({
                                            values: { ...values, driver: initialValues.driver, isDriver: false },
                                        });
                                        setFieldValue("isDriver", false);
                                    },
                                },
                                {
                                    name: "isDriver",
                                    value: true,
                                    label: "Someone else is the driver",
                                    checked: values.isDriver == true,
                                    onClick: () => {
                                        setFieldValue("isDriver", true);
                                    },
                                },
                            ]}
                        />
                        <div className={`${styles.formGroup}`}>
                            <div className={`${styles.formGroupHeader}`}>
                                <p>
                                    <IoPersonSharp className={styles.iconStyle} /> Renter Information
                                </p>

                                <hr className={styles.horizontalDivider} />
                            </div>

                            <div className={`${styles.formGrid} ${styles.formGridOdd}`}>
                                <TextInput name="renter.name" label="Full Name" />
                                <TextInput name="renter.phone" label="Phone Number" type="phone" />
                                <TextInput name="renter.dateOfBirth" label="Date of birth" type="date" />
                                <TextInput name="renter.email" label="Email address" type="email" />
                                <TextInput name="renter.nationalID" label="National ID No" />
                            </div>
                            <ImageInput label="Driver License" name="renter.drivingLicense" />
                            <div className={styles.formGrid}>
                                <SelectInput
                                    name="renter.address.city"
                                    label="City"
                                    value={values?.renter?.address?.city}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        renterAddress.handleUpdateLocation(e, setFieldValue, "renter.address.city");
                                    }}
                                    placeholder="-- Select City --"
                                    options={renterAddress.citiesList}
                                />
                                <SelectInput
                                    name="renter.address.district"
                                    label="District"
                                    value={values?.renter?.address?.district}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        renterAddress.handleUpdateLocation(e, setFieldValue, "renter.address.district");
                                    }}
                                    placeholder="-- Select District --"
                                    options={renterAddress.districtsList}
                                />
                                <SelectInput
                                    name="renter.address.ward"
                                    label="Ward"
                                    value={values?.renter?.address?.ward}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                        renterAddress.handleUpdateLocation(e, setFieldValue, "renter.address.ward");
                                    }}
                                    placeholder="-- Select Ward --"
                                    options={renterAddress.wardsList}
                                />
                                <TextInput name="renter.address.houseNumberStreet" label="House number, Street" />
                            </div>
                            <button
                                className={`${styles.button} ${styles.buttonSecondary}`}
                                type="button"
                                onClick={() => {
                                    renterAddress.reset();
                                    resetForm({
                                        values: {
                                            ...values,
                                            renter: initialValues.renter,
                                            isDriver: values.isDriver,
                                        },
                                    });
                                }}
                            >
                                Discard
                            </button>
                        </div>

                        {values.isDriver && (
                            <div className={`${styles.formGroup}`}>
                                <div className={`${styles.formGroupHeader}`}>
                                    <p>
                                        <IoPersonSharp className={styles.iconStyle} /> Driver Information
                                    </p>

                                    <hr className={styles.horizontalDivider} />
                                </div>

                                <div className={`${styles.formGrid} ${styles.formGridOdd}`}>
                                    <TextInput name="driver.name" label="Full Name" />
                                    <TextInput name="driver.phone" label="Phone Number" type="phone" />
                                    <TextInput name="driver.dateOfBirth" label="Date of birth" type="date" />
                                    <TextInput name="driver.email" label="Email address" type="email" />
                                    <TextInput name="driver.nationalID" label="National ID No" />
                                </div>
                                <ImageInput label="Driver License" name="driver.drivingLicense" />
                                <div className={styles.formGrid}>
                                    <SelectInput
                                        name="driver.address.city"
                                        label="City"
                                        value={values?.driver?.address?.city}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            driverAddress.handleUpdateLocation(e, setFieldValue, "driver.address.city")
                                        }
                                        placeholder="-- Select City --"
                                        options={driverAddress.citiesList}
                                    />
                                    <SelectInput
                                        name="driver.address.district"
                                        label="District"
                                        value={values?.driver?.address?.district}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            driverAddress.handleUpdateLocation(
                                                e,
                                                setFieldValue,
                                                "driver.address.district"
                                            )
                                        }
                                        placeholder="-- Select District --"
                                        options={driverAddress.districtsList}
                                    />
                                    <SelectInput
                                        name="driver.address.ward"
                                        label="Ward"
                                        value={values?.driver?.address?.ward}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            driverAddress.handleUpdateLocation(e, setFieldValue, "driver.address.ward")
                                        }
                                        placeholder="-- Select Ward --"
                                        options={driverAddress.wardsList}
                                    />
                                    <TextInput name="driver.address.houseNumberStreet" label="House number, Street" />
                                </div>
                                <button
                                    className={`${styles.button} ${styles.buttonSecondary}`}
                                    type="button"
                                    onClick={() => {
                                        driverAddress.reset();
                                        resetForm({
                                            values: {
                                                ...values,
                                                driver: initialValues.driver,
                                                isDriver: values.isDriver,
                                            },
                                        });
                                    }}
                                >
                                    Discard
                                </button>
                            </div>
                        )}
                        <NavButtons handleSubmit={handleSubmit} />
                    </form>
                )}
            </Formik>
        </>
    );
}

function Payment({
    userData,
    carData,
    start,
    end,

    handleCreateBooking,
}: {
    userData: User;
    carData: CarBase;
    start: { date: string | string[]; time: string | string[] };
    end: { date: string | string[]; time: string | string[] };
    handleCreateBooking: (data: PaymentTypes) => any;
}) {
    const { setModalContent, handleOpenModal, handleCloseModal } = useContext(ModalContext);
    const router = useRouter();
    const initialValues: PaymentTypes = {
        payment: "wallet",
    };
    const validationSchema = Yup.object().shape({
        payment: Yup.string().required("This field is required"),
    });

    const handleSubmit = async (values: PaymentTypes) => {
        if (userData.wallet! < Number(carData.deposit)) {
            setModalContent(() => {
                return (
                    <Modal
                        type="confirm"
                        confirmText="Yes"
                        cancelText="No"
                        handleCloseModal={handleCloseModal}
                        onConfirm={() => router.push("/my-wallet")}
                    >
                        <p>Your current balance is insufficient. Do you want to top-up your wallet?</p>
                    </Modal>
                );
            });
            handleOpenModal();
            return;
        } else {
            handleCreateBooking(values);
        }
    };

    const isSufficient = userData.wallet! >= parseInt(carData.deposit + "");

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ handleSubmit, values }) => (
                <div className={styles.formContainer}>
                    <div className={styles.bookingInfo}>
                        <div className={`${styles.formGroupHeader}`}>
                            <p>
                                <IoPersonSharp className={styles.iconStyle} />
                                <span>Booking Summary</span>
                            </p>

                            <hr className={styles.horizontalDivider} />
                        </div>

                        <div className={styles.bookingDetail}>
                            <div className={styles.bookingDetailItem}>
                                <span className={styles.bookingDetailTitle}>Number of days </span>
                                <span className={styles.bookingDetailValue}>{getRentDuration(start, end)} days</span>
                            </div>

                            <hr className={styles.horizontalDivider} />

                            <div className={styles.bookingDetailItem}>
                                <h2 className={styles.bookingDetailTitle}>Total </h2>
                                <h3 className={styles.bookingDetailValue}>
                                    {formatCurrencyForFrontend(
                                        getRentTotalPayment(carData.basePrice, getRentDuration(start, end))
                                    )}
                                    <sup>{currencySymbol}</sup>
                                </h3>
                            </div>

                            <div className={styles.bookingDetailItem}>
                                <h3 className={styles.bookingDetailTitle}>Deposit </h3>
                                <h4 className={styles.bookingDetailValue}>
                                    {formatCurrencyForFrontend(carData.deposit)}
                                    <sup>{currencySymbol}</sup>
                                </h4>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={`${styles.formGroup} `}>
                        <div className={`${styles.formGroupHeader}`}>
                            <p>
                                <MdOutlinePayment className={styles.iconStyle} /> Payment Method
                            </p>
                            <hr className={styles.horizontalDivider} />
                        </div>
                        <ToggleInput
                            options={[
                                {
                                    name: "payment",
                                    value: "wallet",
                                    label: "My Wallet",
                                    checked: values.payment === "wallet",
                                },
                                { name: "payment", value: "cash", label: "Cash", checked: values.payment === "cash" },
                                {
                                    name: "payment",
                                    value: "transfer",
                                    label: "Bank Transfer",
                                    checked: values.payment === "transfer",
                                },
                            ]}
                        ></ToggleInput>
                        {values.payment === "wallet" && (
                            <div className={styles.paymentDescription}>
                                <div className={styles.walletContainer}>
                                    <h3 className={styles.walletHeading}>Current Balance:</h3>
                                    <p className={`${styles.walletBalance} ${tomorrowFont.className}`}>
                                        {formatCurrencyForFrontend(userData.wallet!)} <sup>{currencySymbol}</sup>
                                    </p>
                                </div>
                                {!isSufficient && (
                                    <p className={styles.walletAlert}>
                                        <MdError />
                                        Your current balance is insuficient. Please go to{" "}
                                        <Link href={"my-wallet"}>My Wallet</Link> to Top-up and try again
                                    </p>
                                )}

                                {isSufficient && (
                                    <p className={styles.walletConfirm}>Your current balance is suficient.</p>
                                )}
                            </div>
                        )}
                        {values.payment === "cash" && (
                            <div className={styles.paymentDescription}>
                                <p className={styles.walletAlert}>
                                    Our operator will contact you for further instruction
                                </p>
                            </div>
                        )}
                        {values.payment === "transfer" && (
                            <div className={styles.paymentDescription}>
                                <p className={styles.walletAlert}>
                                    Our operator will contact you for further instruction
                                </p>
                            </div>
                        )}
                    </form>
                    <NavButtons handleSubmit={handleSubmit} />
                </div>
            )}
        </Formik>
    );
}

function Finish({
    bookingResponse,
    carData,
    start,
    end,
}: {
    bookingResponse: BookingResponse | undefined;
    carData: CarBase;
    start: { date: string | string[]; time: string | string[] };
    end: { date: string | string[]; time: string | string[] };
}) {
    if (!bookingResponse) {
        return <div>Loading...</div>;
    }

    const router = useRouter();

    return (
        <div className={styles.endContainer}>
            {bookingResponse.success && (
                <>
                    <h1>
                        You've successfully booked <span className={styles.highlightText}>{carData.name}</span>
                    </h1>
                    <h3>
                        From{" "}
                        <span className={styles.highlightText}>
                            {start.time} - {start.date}
                        </span>{" "}
                        to{" "}
                        <span className={styles.highlightText}>
                            {end.time} - {end.date}
                        </span>
                    </h3>
                    <h3>
                        Your booking number is{" "}
                        <span className={styles.highlightText}>{bookingResponse.bookingNumber}</span>
                    </h3>
                    <p className={styles.walletAlert}>
                        Our operator will contact you with further guidance about pickup.
                    </p>

                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            type="button"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            <FaChevronLeft />
                            Go to Homepage
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.buttonPrimary}`}
                            onClick={() => {
                                router.push("/my-booking");
                            }}
                        >
                            View Booking
                            <FaChevronRight />
                        </button>
                    </div>
                </>
            )}
            {bookingResponse.error && (
                <>
                    <h1>Booking Unsuccessful</h1>
                    <h3>{bookingResponse.error}</h3>
                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            type="button"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            <FaChevronLeft />
                            Go to Homepage
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageProps>> => {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.VERCEL_URL || "localhost:3000";
    const session = await getSession(context);

    if (!session || (session.user && "role" in session.user && session.user.role !== "customer")) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const { carId, sD, sT, eD, eT } = context.query;

    if (!carId || !sD || !sT || !eD || !eT) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const addressData = await fetch(`${protocol}://${host}/api/address`)
        .then((res) => res.json())
        .catch((error) => {
            return null;
        });

    const carData = await fetch(`${protocol}://${host}/api/cars/${carId}`)
        .then((res) => res.json())
        .catch((error) => {
            return null;
        });

    if (carData.error || addressData.error) {
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        };
    }

    return {
        props: {
            address: addressData,
            carData: carData,
            start: { date: sD, time: sT },
            end: { date: eD, time: eT },
        },
    };
};
