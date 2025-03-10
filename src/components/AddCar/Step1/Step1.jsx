import styles from "./step1.module.css";

import CustomImageInput from "@/components/singularImageUpload";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Step1({ state, dispatch, nextStep }) {
  return (
    <>
      <Formik
        initialValues={state}
        validationSchema={Yup.object({
          license: Yup.string().required("License plate is required"),
          brandName: Yup.string().required("Brand name is required"),
          productionYear: Yup.string().required("Production year is required"),
          color: Yup.string().required("Color is required"),
          model: Yup.string().required("Model is required"),
          noOfSeats: Yup.number()
            .required("Number of seats is required")
            .min(1, "Must have at least 1 seat"),
          transmission: Yup.string().required(
            "Please select transmission type"
          ),
          fuel: Yup.string().required("Please select fuel type"),
          registrationCertificate: Yup.mixed().required(
            "Registration certificate is required"
          ),
          certificateOfInspection: Yup.mixed().required(
            "Certificate of inspection is required"
          ),
          insurance: Yup.mixed().required("Insurance document is required"),
        })}
        onSubmit={(values) => {
          dispatch({ type: "UPDATE_STEP1", payload: values });
          nextStep();
        }}
      >
        {({ setFieldValue }) => (
          <Form className={styles.addForm}>
            <div className={styles.inputField}>
              {/* Left */}
              <div>
                <div className={styles.formGroup}>
                  <label>License plate:</label>
                  <Field
                    type="text"
                    name="license"
                    placeholder="Enter license plate"
                  />
                  <ErrorMessage
                    name="license"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Brand name:</label>
                  <Field type="text" name="brandName" placeholder="Audi" />
                  <ErrorMessage
                    name="brandName"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Production year:</label>
                  <Field
                    as="select"
                    name="productionYear"
                    className={styles.yearSelect}
                  >
                    <option value="">Select year</option>
                    {[...Array(30).keys()].map((year) => (
                      <option key={year} value={2025 - year}>
                        {2025 - year}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="productionYear"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Transmission:</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <Field
                        type="radio"
                        name="transmission"
                        value="Automatic"
                      />
                      Automatic
                    </label>
                    <label className={styles.radioLabel}>
                      <Field type="radio" name="transmission" value="Manual" />
                      Manual
                    </label>
                  </div>
                  <ErrorMessage
                    name="transmission"
                    component="span"
                    className={styles.error}
                  />
                </div>
              </div>
              {/* Right */}
              <div>
                <div className={styles.formGroup}>
                  <label>Color:</label>
                  <Field type="text" name="color" placeholder="Black" />
                  <ErrorMessage
                    name="color"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Model:</label>
                  <Field type="text" name="model" placeholder="A3" />
                  <ErrorMessage
                    name="model"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Number of seats:</label>
                  <Field type="number" name="noOfSeats" placeholder="5" />
                  <ErrorMessage
                    name="noOfSeats"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Fuel:</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <Field type="radio" name="fuel" value="Gasoline" />
                      Gasoline
                    </label>
                    <label className={styles.radioLabel}>
                      <Field type="radio" name="fuel" value="Diesel" />
                      Diesel
                    </label>
                  </div>
                  <ErrorMessage
                    name="fuel"
                    component="span"
                    className={styles.error}
                  />
                </div>
              </div>
            </div>

            <h2 className={styles.title}>Documents</h2>
            <div className={styles.upload}>
              <div className={styles.formGroup}>
                <label>Registration certificate:</label>
                <Field
                  name="registrationCertificate"
                  component={CustomImageInput}
                  className={styles.uploadField}
                />
                <ErrorMessage
                  name="registrationCertificate"
                  component="span"
                  className={styles.error}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Certificate of inspection:</label>
                <Field
                  name="certificateOfInspection"
                  component={CustomImageInput}
                  className={styles.uploadField}
                />
                <ErrorMessage
                  name="certificateOfInspection"
                  component="span"
                  className={styles.error}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Insurance:</label>
                <Field
                  name="insurance"
                  component={CustomImageInput}
                  className={styles.uploadField}
                />
                <ErrorMessage
                  name="insurance"
                  component="span"
                  className={styles.error}
                />
              </div>
            </div>
            <p>File type: .doc, .docx, .pdf, .jpg, .jpeg, .png</p>
            <div className={styles.buttonWrapper}>
              <button type="submit">Next</button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
