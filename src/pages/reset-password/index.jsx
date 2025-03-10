import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import styles from "./styles.module.css";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaFingerprint } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image";
import { FaUnlock } from "react-icons/fa";
import Modal from "@components/Modals/Modal.tsx";
import Overlay from "@components/Overlay/Overlay.tsx";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
// import InputField from "@components/InputField";
import { ToastContext } from "@/components/Toast/ToastContextProvider";
import { ToastContextType } from "@/utils/types/Car";
import { useContext } from "react";
import messages from "@/utils/messageList";
import Link from "next/link";

const ResetPassword = () => {
  const { createToast } = useContext(ToastContext);
  const router = useRouter();
  const { token, email } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  // const handleAlertModal = () => {
  //   setModalType("alert");
  //   setIsModalOpen(true);
  // };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // const handleSubmit = () => {
  //   // setModalType("alert");
  //   setIsModalOpen(true);
  // };
  useEffect(() => {
    if (!token || !email) {
      // router.push("/");
      return;
    } // Wait for query params

    const validateToken = async () => {
      try {
        const res = await fetch(
          `/api/auth/reset-password?token=${token}&email=${email}`,
          {
            method: "GET",
          }
        );
        if (res.status === 400) {
          // Nếu token không hợp lệ, trả về lỗi và chuyển hướng về trang chủ
          setError(data.error || "Invalid or expired token");
          // createToast({
          //   type: "error",
          //   title: "Error",
          //   message: "Invalid or expired token. Go to HomePage",
          // });
          // router.push("/"); // Chuyển hướng về trang chủ
        } else {
          // Nếu token hợp lệ, cho phép người dùng reset mật khẩu
          // setSuccess(true);
          // createToast({
          //   type: "success",
          //   title: "Success",
          //   message: "Password has been reset successfully",
          // });
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        createToast({
          type: "error",
          title: "Error",
          message: "Invalid or expired token. Go to HomePage",
        });
        router.push("/");
      }
    };

    validateToken();
  }, [token, email, router]);
  const handleResetPassword = async (values) => {
    console.log("values", newPassword, confirmPassword);

    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/reset-password?token=${token}&email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            email,
            newPassword: values.newPassword,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsTokenValid(true);
        setSuccess(true);
        createToast({
          type: "success",
          title: "Success",
          message: "Password has been reset successfully",
        });
      } else {
        // setIsTokenValid(false);
        setError(data.error || "An error occurred.");
        createToast({
          type: "error",
          title: "Error",
          message: messages.ME006,
        });

        router.push("/");
      }
    } catch (err) {
      setIsTokenValid(false);
      router.push("/");

      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.logoContainer} ${styles.logoDark}`}>
          <Image
            src={"/logo-full-light.png"}
            layout="intrinsic"
            width={250}
            height={250}
            alt="Page Logo"
          ></Image>
        </div>
        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            newPassword: Yup.string()
              .required("Password is required")
              .matches(
                /^(?=.*[0-9])/,
                "Password must contain at least one number"
              )
              .matches(
                /^(?=.*[a-zA-Z])/,
                "Password must contain at least one letter"
              )
              .min(7, "Password must be at least 7 characters long"),
            confirmPassword: Yup.string()
              .required("Confirm password is required")
              .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
          })}
          onSubmit={handleResetPassword}
        >
          {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.wrapIcon}>
                <FaFingerprint className={styles.icon} />
              </div>
              <h2 className={styles.textForgot}>Reset Password?</h2>
              <p>Please set you new password</p>

              <label htmlFor="newPassword" className={styles.label}>
                Your email address<sup>*</sup>
              </label>
              <div className={styles.inputItem}>
                <Field
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="Pick a newPassword"
                  className={styles.input}
                />
                <div className={styles.iconGroup}>
                  <MdOutlineMail className={styles.icon} />
                </div>
              </div>
              <ErrorMessage
                name="newPassword"
                component="div"
                className={styles.error}
              />
              <p>Use at least one letter, one number, and seven characters</p>

              <label htmlFor="confirmPassword" className={styles.label}>
                Your email address<sup>*</sup>
              </label>
              <div className={styles.inputItem}>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className={styles.input}
                />
                <div className={styles.iconGroup}>
                  <MdOutlineMail className={styles.icon} />
                </div>
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className={styles.error}
              />
              <button
                // onClick={handleAlertModal}
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
              >
                <FaUnlock />
                SUBMIT
              </button>
              <div className={styles.back}>
                <IoMdArrowBack />
                <Link href="/"> Back to login</Link>
              </div>
            </form>
          )}
        </Formik>
      </div>

      {/* title,
    children,
    type,
    cancelText = "Cancel",
    confirmText = "Ok",
    onConfirm,
    handleCloseModal, */}

      <Overlay isOpen={isModalOpen} handleCloseModal={handleCloseModal}>
        <Modal
          title="Email snfiwe"
          type={"alert"}
          handleCloseModal={handleCloseModal}
        >
          hello
        </Modal>
      </Overlay>
    </>
  );
};
export default ResetPassword;
