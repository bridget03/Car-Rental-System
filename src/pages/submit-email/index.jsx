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
import { useState } from "react";
import { ToastContext } from "@/components/Toast/ToastContextProvider";
// import { ToastContextType } from "@/components/Toast/Car";
import { useContext } from "react";
import messages from "@/utils/messageList";
// import InputField from "@components/InputField";
import Link from "next/link";
const SubmitEmail = () => {
  const router = useRouter();
  // const { token, email } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { createToast } = useContext(ToastContext);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(true);
        setSuccess("Password reset link sent to your email.");
      } else {
        setError(data.error || "An error occurred.");
        createToast({ type: "error", title: "Error", message: messages.ME015 });
        // return res.status(404).json({ error: `${messages.ME015}` });
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setSubmitting(false);
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
            email: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Please enter a valid email address")
              .required("This field is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.wrapIcon}>
                <FaFingerprint className={styles.icon} />
              </div>
              <h2 className={styles.textForgot}>Forgot Password?</h2>
              <p>
                No worries, Enter the email address associated with your
                account, and we'll email you with the link to reset your
                password.
              </p>
              <label htmlFor="email" className={styles.label}>
                Your email address<sup>*</sup>
              </label>
              <div className={styles.inputItem}>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="abc@gmail.com"
                  className={styles.input}
                  // value={values.email}
                  // onChange={(e) => {
                  //   setFieldValue("email", e.target.value);
                  // }}
                />
                <div className={styles.iconGroup}>
                  <MdOutlineMail className={styles.icon} />
                </div>
              </div>
              <ErrorMessage
                name="email"
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
          title="Email notification"
          type={"alert"}
          handleCloseModal={handleCloseModal}
        >
          If this email address exists, we'll send an email with the link to
          reset your password
        </Modal>
      </Overlay>
    </>
  );
};
export default SubmitEmail;
