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
import { ToastContextType } from "@/utils/types/Car";
import { useContext } from "react";
import { useRouter } from "next/router";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
const EditProfile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [activeTab, setActiveTab] = useState("personalInfo");
  const { data: session } = useSession();
  const router = useRouter();

  const { createToast } = useContext(ToastContext) as ToastContextType;

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    fetch("/api/address")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((error) => console.log("Lỗi khi fetch dữ liệu", error));
  }, []);

  useEffect(() => {
    console.log("Updated userData:", userData);
  }, [userData]);

  useEffect(() => {
    if (userData?.address?.city) {
      const selectedCity = cities.find((city) => city.name === userData.address.city);
      setDistricts(selectedCity ? selectedCity.districts : []);
      if (userData?.address?.district) {
        const selectedDistrict = selectedCity?.districts.find(
          (district) => district.name === userData.address.district
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
      console.log("values", values);
      const response = await fetch("/api/users", {
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
        message: "Profile updated successfully!",
      });
      // router.push("/");
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

      {/* form  */}

      <Formik
        enableReinitialize={true}
        initialValues={{
          name: userData.name || "",
          phone: userData.phone || "",
          nationalID: userData.nationalID || "",
          dateOfBirth: userData.dateOfBirth || "",
          email: userData.email || "",
          drivingLicense: userData.drivingLicense || "",
          address: {
            city: userData?.address?.city || "",
            district: userData?.address?.district || "",
            ward: userData?.address?.ward || "",
            houseNumberStreet: userData?.address?.houseNumberStreet || "",
          },
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("This field is required"),
          phone: Yup.string()
            .matches(
              /^\+?[0-9]{10,11}$/,
              "Please enter a valid phone number (10-11 digits, can start with '+')"
            )
            .required("This field is required"),

          nationalID: Yup.string().required("This field is required"),
          dateOfBirth: Yup.date().required("This field is required"),
          email: Yup.string()
            .email("Please enter a valid email address")
            .required("This field is required"),
          drivingLicense: Yup.string().required("This field is required"),
          address: Yup.object({
            city: Yup.string().required("This field is required"),
            district: Yup.string().required("This field is required"),
            ward: Yup.string().required("This field is required"),
            houseNumberStreet: Yup.string().required("This field is required"),
          }),
        })}
        onSubmit={handleSubmitPersonalInfo}
      >
        {({ handleSubmit, isSubmitting, setFieldValue, values, resetForm, setErrors }) => (
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={`${styles.formGroup}`}>
              <div className={`${styles.formGroupHeader}`}>
                <p>
                  <IoPersonSharp className={styles.iconStyle} /> General Information
                </p>

                <hr className={styles.divider} />
              </div>

              <div className={styles.formGrid}>
                {/* <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name</label>
                  <Field name="name" className={styles.input} />
                  <ErrorMessage name="name" component="div" className={styles.error} />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <Field name="phone" type="tel" className={styles.input} />
                  <ErrorMessage name="phone" component="div" className={styles.error} />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}> Date of birth</label>
                  <Field type="date" name="dateOfBirth" className={styles.input} />
                  <ErrorMessage name="dateOfBirth" component="div" className={styles.error} />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email address</label>
                  <Field type="email" name="email" className={styles.input} readOnly={true} />
                  {/* <ErrorMessage name="email" component="div" className={styles.error} /> }
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>National ID No</label>
                  <Field name="nationalID" className={styles.input} />
                  <ErrorMessage name="nationalID" component="div" className={styles.error} />
                </div> */}
                <InputField name="name" label="Full Name" />
                <InputField name="phone" label="Phone Number" type="tel" />
                <InputField name="dateOfBirth" label="Date of Birth" type="date" />
                <InputField name="email" label="Email Address" readOnly={true} />
                <InputField name="nationalID" label="National ID No" />
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
                <div className={styles.inputGroup}>
                  <label className={styles.label}>City</label>
                  <Field
                    className={styles.input}
                    as="select"
                    name="address.city"
                    value={values.address.city}
                    onChange={(e) => {
                      const cityName = e.target.value;
                      setFieldValue("address.city", cityName);
                      setFieldValue("address.district", "");
                      setFieldValue("address.ward", "");
                      //Tìm province
                      const selectedCity = cities.find((city) => city.name === cityName);
                      setDistricts(selectedCity ? selectedCity.districts : []);
                    }}
                  >
                    <option value="">City/Province</option>
                    {cities.map((city) => {
                      return <option key={city.name}>{city.name}</option>;
                    })}
                  </Field>
                  <ErrorMessage name="address.city" component="div" className={styles.error} />
                </div>

                {/* district  */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>District</label>
                  <Field
                    className={styles.input}
                    as="select"
                    name="address.district"
                    value={values.address.district}
                    disabled={!districts.length}
                    onChange={(e) => {
                      const districtName = e.target.value;

                      setFieldValue("address.district", districtName);
                      setFieldValue("address.ward", "");
                      //Tìm province
                      const selectedDistrict = districts.find(
                        (district) => district.name === districtName
                      );
                      setWards(selectedDistrict ? selectedDistrict.wards : []);
                    }}
                  >
                    <option value="">District</option>
                    {districts.map((district) => {
                      return <option key={district.name}>{district.name}</option>;
                    })}
                  </Field>
                  <ErrorMessage name="address.district" component="div" className={styles.error} />
                </div>

                {/* wards  */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Ward</label>
                  <Field
                    className={styles.input}
                    as="select"
                    name="address.ward"
                    value={values.address.ward}
                    disabled={!wards.length}
                    onChange={(e) => {
                      const wardName = e.target.value;
                      setFieldValue("address.ward", wardName);
                    }}
                  >
                    <option value="">Ward</option>
                    {wards.map((ward) => {
                      return <option key={ward.name}>{ward.name}</option>;
                    })}
                  </Field>
                  <ErrorMessage name="address.ward" component="div" className={styles.error} />
                </div>

                {/* house number */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>House number, Street</label>
                  <Field name="address.houseNumberStreet" className={styles.input} />
                  <ErrorMessage
                    name="address.houseNumberStreet"
                    component="div"
                    className={styles.error}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputGroup}>
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
    </div>
  );
};

export default EditProfile;
