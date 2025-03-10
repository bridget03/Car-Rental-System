import React, { ChangeEvent, useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./styles.module.css";

import { useSession } from "next-auth/react";
import CustomImageInput from "@/components/singularImageUpload";
import Overlay from "@/components/Overlay/Overlay";
import Loading from "@/components/Loading/Loading";
import { IoPersonSharp } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaIdCard } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import BreadCrumb from "@/components/breadcrumb";
import { ToastContext } from "@/components/Toast/ToastContextProvider";
import { ToastContextType } from "@type/Car";
import { useContext } from "react";
import { useRouter } from "next/router";
import { User } from "@type/User";
import { TextInput, SelectInput } from "@/components/FormInput/InputComponent";
import { formatPhoneForBackend, formatPhoneForFrontend } from "@/utils/Phone";

type SecurityDataType = {
    newPassword: string;
    confirmPassword: string;
};

type CityType = {
    name: string;
    districts: DistrictType[];
};
type DistrictType = {
    name: string;
    wards: WardType[];
};
type WardType = {
    name: string;
};

const EditProfile = () => {
    const { data: session } = useSession();

    const [userData, setUserData] = useState<User>();
    const [pageLoaded, setPageLoaded] = useState<boolean>(false);
    const [cities, setCities] = useState<CityType[]>([]);
    const [districts, setDistricts] = useState<DistrictType[]>([]);
    const [wards, setWards] = useState<WardType[]>([]);
    const [activeTab, setActiveTab] = useState<"personalInfo" | "security">("personalInfo");

    const router = useRouter();
    const { createToast } = useContext(ToastContext) as ToastContextType;

    const userInitialData: User = {
        name: userData ? userData.name : "",
        phone: userData ? formatPhoneForFrontend(userData.phone!) : "",
        nationalID: userData ? userData.nationalID : "",
        dateOfBirth: userData ? userData.dateOfBirth : "",
        email: userData ? userData.email : "",
        drivingLicense: userData ? userData.drivingLicense : "",
        address: {
            city: userData ? userData.address?.city : "",
            district: userData ? userData.address?.district : "",
            ward: userData ? userData.address?.ward : "",
            houseNumberStreet: userData ? userData.address?.houseNumberStreet : "",
        },
    };
    const userValidation = Yup.object({
        name: Yup.string().required("This field is required"),
        phone: Yup.string()
            .matches(/^\+?[0-9]{10,11}$/, "Please enter a valid phone number (10-11 digits, can start with '+')")
            .required("This field is required"),

        nationalID: Yup.string().required("This field is required"),
        dateOfBirth: Yup.string().required("This field is required"),
        email: Yup.string().email("Please enter a valid email address").required("This field is required"),
        drivingLicense: Yup.string().required("This field is required"),
        address: Yup.object({
            city: Yup.string().required("This field is required"),
            district: Yup.string().required("This field is required"),
            ward: Yup.string().required("This field is required"),
            houseNumberStreet: Yup.string().required("This field is required"),
        }),
    });
    const securityInitialData: SecurityDataType = {
        newPassword: "",
        confirmPassword: "",
    };
    const securityValidation: Yup.ObjectSchema<SecurityDataType> = Yup.object({
        newPassword: Yup.string()
            .required("Password is required")
            .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
            .matches(/^(?=.*[a-zA-Z])/, "Password must contain at least one letter")
            .min(7, "Password must be at least 7 characters long"),
        confirmPassword: Yup.string()
            .required("Confirm password is required")
            .oneOf([Yup.ref("newPassword"), ""], "Passwords must match"),
    });

    useEffect(() => {
        setPageLoaded(true);
        fetch("/api/address")
            .then((res) => res.json())
            .then((data) => setCities(data))
            .catch((error) => console.log("Lỗi khi fetch dữ liệu", error));
    }, []);

    useEffect(() => {
        if (userData?.address?.city) {
            const selectedCity = cities.find((city) => city.name === userData.address?.city);
            setDistricts(selectedCity ? selectedCity.districts : []);
            if (userData?.address?.district) {
                const selectedDistrict = selectedCity?.districts.find(
                    (district) => district.name === userData.address?.district
                );
                setWards(selectedDistrict ? selectedDistrict.wards : []);
            }
        }
    }, [userData, cities]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return; // Kiểm tra nếu user chưa đăng nhập thì không gọi API

            try {
                const res = await fetch(`/api/users?email=${session.user.email}`);
                const data = await res.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        fetchUserData();
    }, [session]);

    const handleSubmitPersonalInfo = async (values: any, { setSubmitting, setErrors }: any) => {
        try {
            const submitData = {
                ...values,
                phone: formatPhoneForBackend(values.phone),
            };
            const response = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();
            console.log("API response", data);
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
                message: "Profile updated successfully!",
            });
            router.push("/");
        } catch (error) {
            console.error("Error updating profile:", error);
            createToast({
                type: "error",
                title: "Error",
                message: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };
    const handleSubmitSecurity = async (values: any, { setSubmitting, setErrors }: any) => {
        try {
            console.log("values", values);
            const response = await fetch("/api/users/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            console.log("API response", data);
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
                message: "Password updated successfully!",
            });
            router.push("/");
        } catch (error) {
            console.error("Error updating profile:", error);
            createToast({
                type: "error",
                title: "Error",
                message: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };
    const handleChangeCity = (
        e: ChangeEvent<HTMLSelectElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const cityName: string = e.target.value;
        setFieldValue("address.city", cityName);
        setFieldValue("address.district", "");
        setFieldValue("address.ward", "");
        //Tìm province
        const selectedCity: CityType | undefined = cities.find((city) => city.name === cityName);

        setDistricts(selectedCity ? selectedCity.districts : []);
    };
    const handleChangeDistrict = (
        e: ChangeEvent<HTMLSelectElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const districtName = e.target.value;

        setFieldValue("address.district", districtName);
        setFieldValue("address.ward", "");
        //Tìm province
        const selectedDistrict = districts.find((district) => district.name === districtName);
        setWards(selectedDistrict ? selectedDistrict.wards : []);
    };
    const handleChangeWard = (
        e: ChangeEvent<HTMLSelectElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const wardName = e.target.value;
        setFieldValue("address.ward", wardName);
    };

    if (!userData) {
        return (
            <Overlay isOpen={!userData && pageLoaded} handleCloseModal={() => {}}>
                <Loading />
            </Overlay>
        );
    }

    return (
        <div className={styles.container}>
            <BreadCrumb />

            <h1>Edit Profile</h1>

            {/* tabs  */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabHeader}>
                    <div
                        className={`${styles.tab} ${activeTab === "personalInfo" ? styles.active : ""}`}
                        onClick={() => {
                            setActiveTab("personalInfo");
                        }}
                    >
                        Personal information
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === "security" ? styles.active : ""}`}
                        onClick={() => {
                            setActiveTab("security");
                        }}
                    >
                        Security
                    </div>
                </div>
            </div>
            {/* form  */}
            {activeTab === "personalInfo" && (
                <Formik
                    enableReinitialize={true}
                    initialValues={userInitialData}
                    validationSchema={userValidation}
                    onSubmit={handleSubmitPersonalInfo}
                >
                    {({ handleSubmit, isSubmitting, setFieldValue, values, resetForm, setErrors }) => (
                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            <div className={styles.formGroup}>
                                <div className={`${styles.formGroupHeader}`}>
                                    <p>
                                        <IoPersonSharp className={styles.iconStyle} /> General Information
                                    </p>
                                    <hr className={styles.divider} />
                                </div>

                                <div className={styles.formGrid}>
                                    <TextInput name="name" label="Full Name" />
                                    <TextInput name="phone" label="Phone Number" type="phone" />
                                    <TextInput name="dateOfBirth" label="Date of Birth" type="date" />
                                    <TextInput name="email" label="Email Address" type="email" />
                                    <TextInput name="nationalID" label="National ID No" />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={`${styles.formGroupHeader}`}>
                                    <p>
                                        <IoLocationSharp className={styles.iconStyle} /> Address
                                    </p>
                                    <hr className={styles.divider} />
                                </div>
                                <div className={styles.formGrid}>
                                    <SelectInput
                                        name="address.city"
                                        label="City"
                                        value={values?.address?.city}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                            handleChangeCity(e, setFieldValue)
                                        }
                                        placeholder="-- Select City --"
                                        options={cities}
                                    />

                                    <SelectInput
                                        name="address.district"
                                        label="District"
                                        value={values?.address?.district}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            handleChangeDistrict(e, setFieldValue);
                                        }}
                                        placeholder="-- Select District --"
                                        options={districts}
                                    />

                                    <SelectInput
                                        name="address.ward"
                                        label="Ward"
                                        value={values?.address?.ward}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            handleChangeWard(e, setFieldValue);
                                        }}
                                        placeholder="-- Select Ward --"
                                        options={wards}
                                    />

                                    {/* house number */}
                                    <TextInput
                                        name="address.houseNumberStreet"
                                        label="House number, Street"
                                    ></TextInput>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={`${styles.formGroupHeader}`}>
                                    <p>
                                        <FaIdCard className={styles.iconStyle} /> Driving License
                                    </p>
                                    <hr className={styles.divider} />
                                </div>
                                <Field
                                    name="drivingLicense"
                                    component={CustomImageInput}
                                    className={styles.drivingLicense}
                                />
                                <ErrorMessage name="drivingLicense" component="div" className={styles.error} />
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setErrors({});
                                    }}
                                >
                                    Discard
                                </button>
                                <button type="submit" disabled={isSubmitting} className={styles.button}>
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            )}
            {activeTab === "security" && (
                <Formik
                    initialValues={securityInitialData}
                    validationSchema={securityValidation}
                    onSubmit={handleSubmitSecurity}
                >
                    {({ handleSubmit, isSubmitting, resetForm }) => (
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <div className={`${styles.formGroupHeader}`}>
                                    <p>
                                        <TbLockPassword className={styles.iconStyle} /> Change Password
                                    </p>
                                    <hr className={styles.divider} />
                                </div>

                                <TextInput name="newPassword" label="New Password" />
                                <TextInput name="confirmPassword" label="Confirm Password" />

                                <div className={styles.buttonGroup}>
                                    <button
                                        type="button"
                                        className={styles.button}
                                        onClick={() => {
                                            resetForm();
                                        }}
                                    >
                                        Discard
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className={styles.button}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default EditProfile;
