import React, { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./styles.module.css";
import { FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { ToastContext } from "@/components/Toast/ToastContextProvider";
import { ToastContextType } from "@/utils/types/Car";
import { useContext } from "react";
import messages from "@/utils/messageList";
import Overlay from "../Overlay/Overlay";
import Modal from "../Modals/Modal";
import { formatPhoneForBackend, formatPhoneForFrontend } from "@/utils/Phone";
import { TextInput } from "../FormInput/InputComponent";

type LoginProps = {
    onClose: () => void;
    setLoginState: (state: boolean) => void;
};

type LoginDataType = {
    userEmail: string;
    userPassword: string;
};

type UserRegisterDataType = {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: "customer" | "carOwner" | string;
    termsAndConditions?: true | false;
};

type FormActionType = {
    setSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
};

const Login = ({ onClose, setLoginState }: LoginProps) => {
    const { createToast } = useContext(ToastContext) as ToastContextType;
    const router = useRouter();
    const [modalState, setModalState] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        content: "",
    });

    const handleSubmitLogin = async (values: LoginDataType, { setSubmitting, resetForm }: FormActionType) => {
        const res = await signIn("credentials", {
            redirect: false,
            email: values.userEmail,
            password: values.userPassword,
        });

        if (res?.error) {
            setModalState(true);
            setModalContent({
                title: "Login Unsuccessful",
                content: messages.ME001,
            });
        } else {
            createToast({ type: "success", title: "Success", message: "Login successfully" });
            resetForm();
            onClose();
            setLoginState(true);
            router.push("/");
        }
        setSubmitting(false);
    };
    const handleSubmitRegister = async (
        values: UserRegisterDataType,
        { setSubmitting, resetForm, setFieldError }: any
    ) => {
        const registerData = {
            name: values.name,
            email: values.email,
            phone: formatPhoneForBackend(values.phone),
            password: values.password,
            confirmPassword: values.confirmPassword,
            role: values.role,
        };

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        });

        const data = await res.json();

        if (res.ok) {
            resetForm();
            setModalContent({
                title: "Congratulations",
                content: "Register successfully. Please Login",
            });
            setModalState(true);
        } else if (res.status === 400) {
            setModalContent({
                title: "Register Unsuccessful",
                content: data.message,
            });
            setFieldError("email", data.message);
            setModalState(true);
        }

        setSubmitting(false);
    };

    const loginInitialValues: LoginDataType = {
        userEmail: "",
        userPassword: "",
    };
    const loginValidation: Yup.ObjectSchema<LoginDataType> = Yup.object({
        userEmail: Yup.string().email("Please enter a valid email address").required("This field is required"),
        userPassword: Yup.string().required("Password is required"),
        // .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
        // .matches(/^(?=.*[a-zA-Z])/, "Password must contain at least one letter")
        // .min(7, "Password must be at least 7 characters long"),
    });
    const registerInitialValues: UserRegisterDataType = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "customer",
        termsAndConditions: false,
    };
    const registerValidation: Yup.ObjectSchema<UserRegisterDataType> = Yup.object({
        name: Yup.string().required("This field is required"),
        email: Yup.string().email("Please enter a valid email address").required("This field is required"),
        phone: Yup.string()
            .matches(/^\+?[0-9]{10,11}$/, "Please enter a valid phone number (10-11 digits)")
            .required("This field is required"),
        password: Yup.string()
            .required("Password is required")
            .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
            .matches(/^(?=.*[a-zA-Z])/, "Password must contain at least one letter")
            .min(7, "Password must be at least 7 characters long"),
        confirmPassword: Yup.string()
            .required("Confirm password is required")
            .oneOf([Yup.ref("password"), ""], "Passwords must match"),
        role: Yup.string().required("This field is required"),
        termsAndConditions: Yup.bool().oneOf([true], "You need to accept the terms and conditions"),
    });

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <MdOutlineClose />
                </button>
            </nav>

            <div className={styles.main}>
                <Formik
                    enableReinitialize={true}
                    initialValues={loginInitialValues}
                    validationSchema={loginValidation}
                    onSubmit={handleSubmitLogin}
                >
                    {({ handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit} className={`${styles.formContainer}`}>
                            <div className={styles.loginForm}>
                                <h2 className={styles.formTitle}>LOG IN USING YOUR ACCOUNT</h2>
                                <div>
                                    <div className={`${styles.logoContainer} ${styles.logoLight}`}>
                                        <Image
                                            src={"/logo-full-light.png"}
                                            width={150}
                                            height={150}
                                            alt="Page Logo"
                                        ></Image>
                                    </div>
                                    <div className={`${styles.logoContainer} ${styles.logoDark}`}>
                                        <Image
                                            src={"/logo-full-dark.png"}
                                            width={150}
                                            height={150}
                                            alt="Page Logo"
                                        ></Image>
                                    </div>
                                </div>
                                <div className={styles.formWrapper}>
                                    <TextInput
                                        label="Your email address"
                                        name="userEmail"
                                        type="email"
                                        placeholder="abc@gmail.com"
                                    >
                                        <MdOutlineMail />
                                    </TextInput>

                                    <TextInput
                                        label="Password"
                                        name="userPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                    >
                                        <RiLockPasswordLine />
                                    </TextInput>

                                    <Link
                                        className={styles.forgotPw}
                                        href="submit-email"
                                        onClick={() => {
                                            onClose();
                                        }}
                                    >
                                        Forgot your password
                                    </Link>

                                    <button type="submit" disabled={isSubmitting} className={styles.button}>
                                        <FaUser />
                                        log in
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>

                <div className={`${styles.dividerContainer}`}>
                    <span className={styles.dividerText}>OR</span>
                    <div className={`${styles.dividerY} `}></div>
                </div>

                <Formik
                    initialValues={registerInitialValues}
                    validationSchema={registerValidation}
                    onSubmit={handleSubmitRegister}
                >
                    {({ handleSubmit, isSubmitting, values }) => (
                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            <div className={styles.signupForm}>
                                <h2 className={styles.formTitle}>NOT A MEMBER YET?</h2>

                                <TextInput label="Your name" name="name">
                                    <FaRegUser />
                                </TextInput>

                                <TextInput label="Your email address" name="email">
                                    <MdOutlineMail />
                                </TextInput>

                                <TextInput label="Your phone number" name="phone" type="phone">
                                    <FiPhone />
                                </TextInput>

                                <TextInput label="Pick a password" name="password" type="password">
                                    <FiPhone />
                                </TextInput>

                                <TextInput label="Confirm Password" name="confirmPassword" type="password">
                                    <FiPhone />
                                </TextInput>

                                <span className={styles.passwordRequirements}>
                                    Use at least one letter, one number, and seven characters
                                </span>

                                <div role="group" aria-labelledby="my-radio-group" className={`${styles.toggleGroup}`}>
                                    <label className={styles.toggleInput}>
                                        <Field
                                            type="radio"
                                            name="role"
                                            value="customer"
                                            checked={values.role == "customer"}
                                        />
                                        I want to rent a car
                                    </label>
                                    <label className={styles.toggleInput}>
                                        <Field
                                            type="radio"
                                            name="role"
                                            value="carOwner"
                                            checked={values.role == "carOwner"}
                                        />
                                        I am a car owner
                                    </label>
                                </div>

                                <hr className={`${styles.dividerX} `} />

                                <div role="group" aria-labelledby="checkbox-group" className={styles.checkboxGroup}>
                                    <label className={styles.checkboxLabel}>
                                        <Field type="checkbox" name="termsAndConditions" />
                                        <span>
                                            I have read and agree with the{" "}
                                            <Link
                                                href="/about-us"
                                                className={styles.terms}
                                                onClick={() => {
                                                    onClose();
                                                }}
                                            >
                                                Terms and Conditions
                                            </Link>
                                        </span>
                                    </label>
                                    <ErrorMessage name="termsAndConditions" component="div" className={styles.error} />
                                </div>

                                <button type="submit" disabled={isSubmitting} className={styles.button}>
                                    <FaUserPlus />
                                    sign up
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>

            <Overlay
                isOpen={modalState}
                handleCloseModal={() => {
                    setModalState(false);
                }}
            >
                <Modal
                    type="alert"
                    title={modalContent.title}
                    handleCloseModal={() => {
                        setModalState(false);
                    }}
                >
                    <span>{modalContent.content}</span>
                </Modal>
            </Overlay>
        </div>
    );
};

export default Login;
