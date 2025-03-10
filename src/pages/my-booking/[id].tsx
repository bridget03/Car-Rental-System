/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "./styles.module.css";
import BreadCrumb from "@/components/breadcrumb";
import BookingInfo from "@/components/EditBookingDetails/BookingInfo";
import CarInfo from "@/components/EditBookingDetails/CarInfo";
import PaymentInfo from "@/components/EditBookingDetails/PaymentInfo";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { BookingListItem } from "@/components/Bookings/BookingListItem";
import { ToggleInput } from "@/components/FormInput/InputComponent";
import { Formik } from "formik";
import { Booking } from "@/utils/types/Booking";
import { CarBase } from "@/utils/types/Car";
import { CityType, User } from "@/utils/types/User";
import { DefaultSession, DefaultUser } from "next-auth";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import { calculatePrice, calculateRentalDays } from "@/utils/helperFunctions";

interface PageProps {
    address: CityType[];
}

interface BookingDetailsData extends Booking {
    car: CarBase;
    user: User;
}

interface Session extends DefaultSession {
    user: User & DefaultUser;
}

export default function EditBookingDetails({ address }: PageProps) {
    const router = useRouter();
    const { id } = router.query;
    const [activeTab, setActiveTab] = useState<"booking" | "car" | "payment" | "loading">("booking");
    const fetcher = (...args: [string]) => fetch(...args).then((res) => res.json());

    const { data: bookingData, error: fetchError, isLoading, mutate } = useSWR(`/api/bookings/${id}`, fetcher);
    const [isUpdating, setUpdating] = useState(false);
    const tabRef = useRef(activeTab);

    useEffect(() => {
        if (isUpdating) {
            tabRef.current = activeTab;
            setActiveTab("loading");
        } else {
            setActiveTab(tabRef.current);
        }
    }, [isUpdating]);

    const handleMutate = async () => {
        await mutate();
        setUpdating(false);
    };
    const handleUpdate = () => {
        setUpdating(true);
    };

    if (fetchError) {
        return <div>Error:{fetchError}</div>;
    }
    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (bookingData) {
        const isDisabled = bookingData.status !== "pendingDeposit" && bookingData.status !== "confirmed";
        const rentalDays = calculateRentalDays(bookingData.pickupDate, bookingData.dropOffDate);
        const totalBasePrice = calculatePrice(Number(rentalDays), Number(bookingData.car.basePrice));

        return (
            <div className={styles.container}>
                <BreadCrumb />
                <BookingListItem
                    key={bookingData.id}
                    booking={bookingData}
                    car={bookingData.car}
                    handleUpdate={handleUpdate}
                    handleMutate={handleMutate}
                    forPage="details"
                />

                <div className={styles.tabContainer}>
                    <Formik
                        initialValues={{
                            tab: "booking",
                        }}
                        onSubmit={() => {}}
                    >
                        {({ values }) => (
                            <form className={styles.formContainer}>
                                <ToggleInput
                                    options={[
                                        {
                                            name: "tab",
                                            value: "booking",
                                            label: "Booking Information",
                                            onClick: () => setActiveTab("booking"),

                                            checked: values.tab === "booking",
                                        },

                                        {
                                            name: "tab",
                                            value: "car",
                                            label: "Car Information",
                                            onClick: () => setActiveTab("car"),
                                            checked: values.tab === "car",
                                        },
                                        {
                                            name: "tab",
                                            value: "payment",
                                            label: "Payment Information",
                                            onClick: () => setActiveTab("payment"),
                                            checked: values.tab === "payment",
                                        },
                                    ]}
                                ></ToggleInput>
                            </form>
                        )}
                    </Formik>
                </div>

                {activeTab === "booking" && (
                    <BookingInfo
                        address={address}
                        renterInformation={bookingData.renterInformation}
                        driverInformation={bookingData.driverInformation}
                        bookingId={id as string | string[]}
                        bookingStatus={bookingData.status}
                        handleUpdate={handleUpdate}
                        handleMutate={handleMutate}
                        disabled={isDisabled}
                    />
                )}
                {activeTab === "car" && <CarInfo carData={bookingData.car} />}
                {activeTab === "payment" && bookingData && (
                    <PaymentInfo
                        paymentMethod={bookingData.paymentMethod}
                        totalPayment={rentalDays * bookingData.car.basePrice}
                        deposited={bookingData.car.deposit}
                        bookingStatus={bookingData.status}
                        userBalance={bookingData.user.wallet!}
                    />
                )}
                {activeTab === "loading" && <div>Loading...</div>}
            </div>
        );
    }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PageProps>> => {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.VERCEL_URL || "localhost:3000";

    const session = (await getSession(context)) as Session | null;

    if (!session || (session.user && session.user.role !== "customer")) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const addressData = await fetch(`${protocol}://${host}/api/address`)
        .then((res) => res.json())
        .catch(() => {
            return null;
        });

    return {
        props: {
            address: addressData,
        },
    };
};
