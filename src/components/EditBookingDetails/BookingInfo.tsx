import styles from "./BookingInfo.module.css";
import React, { ChangeEvent, useContext } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { User, CityType } from "@type/User";
import { formatPhoneForBackend, formatPhoneForFrontend } from "@/utils/Phone";
import { userValidationSchema } from "@/components/FormInput/FormValidation";

import { ToastContext } from "../Toast/ToastContextProvider";
import UserForm from "../Bookings/BookingUserForm";
import { Booking } from "@/utils/types/Booking";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

type BookingInformationFormsTypes = {
    renterInformation: User;
    driverInformation: User | null;
    hasAnotherDriver: boolean;
};

export default function BookingInfo({
    address,
    renterInformation: initRenterInfo,
    driverInformation: initDriverInfo,
    bookingId,
    bookingStatus,
    handleUpdate,
    handleMutate,
    disabled,
}: {
    address: CityType[];
    renterInformation: Booking["renterInformation"];
    driverInformation: Booking["driverInformation"];
    bookingId: string | string[];
    handleUpdate: () => void;
    handleMutate: () => void;
    bookingStatus: Booking["status"];
    disabled: boolean;
}) {
    const toastContext = useContext(ToastContext);
    const createToast = toastContext ? toastContext.createToast : () => {};

    const initialValues: BookingInformationFormsTypes = {
        hasAnotherDriver: !!initDriverInfo,
        renterInformation: {
            name: initRenterInfo?.name,
            phone: formatPhoneForFrontend(initRenterInfo?.phone || ""),
            nationalID: initRenterInfo?.nationalID,
            dateOfBirth: initRenterInfo?.dateOfBirth,
            email: initRenterInfo?.email,
            drivingLicense: initRenterInfo?.drivingLicense,
            address: {
                city: initRenterInfo?.address?.city,
                district: initRenterInfo?.address?.district,
                ward: initRenterInfo?.address?.ward,
                houseNumberStreet: initRenterInfo?.address?.houseNumberStreet,
            },
        },
        driverInformation: {
            name: initDriverInfo ? initDriverInfo.name : "",
            phone: initDriverInfo ? formatPhoneForFrontend(initDriverInfo.phone || "") : "",
            nationalID: initDriverInfo ? initDriverInfo.nationalID : "",
            dateOfBirth: initDriverInfo ? initDriverInfo.dateOfBirth : "",
            email: initDriverInfo ? initDriverInfo.email : "",
            drivingLicense: initDriverInfo ? initDriverInfo.drivingLicense : "",
            address: {
                city: initDriverInfo ? initDriverInfo.address?.city : "",
                district: initDriverInfo ? initDriverInfo.address?.district : "",
                ward: initDriverInfo ? initDriverInfo.address?.ward : "",
                houseNumberStreet: initDriverInfo ? initDriverInfo.address?.houseNumberStreet : "",
            },
        },
    };
    const validationSchema: Yup.ObjectSchema<BookingInformationFormsTypes> = Yup.object().shape({
        hasAnotherDriver: Yup.boolean().required(),
        renterInformation: userValidationSchema,
        driverInformation: Yup.object().when("hasAnotherDriver", {
            is: (val: boolean) => {
                return !!val;
            },
            then: () => userValidationSchema,
            otherwise: () => Yup.object(),
        }),
    });

    const handleSubmitBookingInfo = async (values: BookingInformationFormsTypes, { setErrors }: any) => {
        try {
            handleUpdate();
            const submitData = {
                renterInformation: {
                    ...values.renterInformation,
                    phone: formatPhoneForBackend(values.renterInformation.phone!),
                },

                driverInformation: values.hasAnotherDriver
                    ? {
                          ...values.driverInformation,
                          phone: formatPhoneForBackend(values.driverInformation?.phone || ""),
                      }
                    : null,
            };
            console.log(submitData);
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors({ api: data.errors.join(", ") });
                } else {
                    createToast({
                        type: "error",
                        title: "Update failed",
                        message: `${data.error || "Unknown error"}`,
                    });
                }
                return;
            }
            createToast({
                type: "success",
                title: "Success",
                message: "Booking information dated successfully!",
            });
        } catch (error) {
            console.error("Error updating booking information:", error);
            createToast({
                type: "error",
                title: "Error",
                message: "An unexpected error occurred. Please try again.",
            });
        } finally {
            handleMutate();
        }
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmitBookingInfo}>
            {({ setFieldValue, values, resetForm, handleSubmit, dirty }) => (
                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    <UserForm
                        values={values.renterInformation}
                        setFieldValue={setFieldValue}
                        username="renterInformation"
                        address={address}
                        disabled={disabled}
                    />

                    {values.hasAnotherDriver && (
                        <UserForm
                            values={values.driverInformation}
                            setFieldValue={setFieldValue}
                            username="driverInformation"
                            address={address}
                            onDelete={
                                !disabled
                                    ? () => {
                                          setFieldValue("hasAnotherDriver", false);
                                      }
                                    : false
                            }
                            disabled={disabled}
                        />
                    )}

                    {!disabled && (
                        <div className={styles.btnContainer}>
                            {!values.hasAnotherDriver && (
                                <button
                                    onClick={() => {
                                        setFieldValue("hasAnotherDriver", true);
                                    }}
                                    className={`${styles.button} ${styles.buttonSecondary}`}
                                >
                                    <FaRegPlusSquare />
                                    Add A Different Driver
                                </button>
                            )}

                            {values.hasAnotherDriver && (
                                <button
                                    type="button"
                                    className={`${styles.button} ${styles.buttonSecondary}`}
                                    onClick={() => setFieldValue("hasAnotherDriver", false)}
                                >
                                    <FaRegTrashAlt />
                                    Remove Driver
                                </button>
                            )}

                            {
                                <div className={styles.btnGroup}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log(values);

                                            resetForm();
                                            console.log(values);
                                        }}
                                        className={`${styles.button} ${
                                            dirty ? styles.buttonSecondary : styles.buttonDisabled
                                        }`}
                                    >
                                        Cancel Changes
                                    </button>
                                    <button
                                        type="submit"
                                        className={`${styles.button} ${
                                            dirty ? styles.buttonPrimary : styles.buttonDisabled
                                        }`}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            }
                        </div>
                    )}
                </form>
            )}
        </Formik>
    );
}
