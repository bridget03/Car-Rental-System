import styles from "./styles.module.css";
import { useState } from "react";

import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function HeroCustomer({ onSearch }) {
  const [searchValues, setSearchValues] = useState(null);
  const router = useRouter();
  const validateDateTime = (values) => {
    const errors = {};
    const { sD, sT, eD, eT } = values;

    if (!sD || !sT) {
      errors.sD = "Pick-up Date and Time are required!";
    } else {
      const pickUpDateTime = new Date(`${sD}T${sT}`);
      if (pickUpDateTime < new Date()) {
        errors.sD = "Pick-up Date and Time must be in the future!";
      }
    }

    if (!eD || !eT) {
      errors.eD = "Drop-off Date and Time are required!";
    } else {
      const pickUpDateTime = new Date(`${sD}T${sT}`);
      const dropOffDateTime = new Date(`${eD}T${eT}`);

      if (dropOffDateTime <= pickUpDateTime) {
        errors.eD =
          "Drop-off Date and Time must be after Pick-up Date and Time!";
      }
    }

    return errors;
  };

  const handleSearch = (values) => {
    setSearchValues(values);
    router.push({
      pathname: "/search-results",
      query: values,
    });
  };

  return (
    <section
      id="hero"
      className={styles.hero}
      style={{
        backgroundImage: `url(background-image.jpg)`,
        borderRadius: "35px",
      }}
    >
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.textBlock}>
            <h1 className={styles.title}>
              Looking for a vehicle?
              <br />
              You're at the right place.
            </h1>
            <p className={styles.description}>
              We have a large selection of locally owned cars available for you
              to choose from. Rental plans are customized to suit your needs.
            </p>
            <p className={styles.description}>
              With over 300 cars located nationwide, we will have something for
              you.
            </p>
          </div>
          <div className={styles.formBlock}>
            <Formik
              initialValues={{
                carBrand: "",
                location: "",
                sD: "",
                sT: "",
                eD: "",
                eT: "",
              }}
              validationSchema={Yup.object({
                carBrand: Yup.string().required("Please provide a car brand!"),
                location: Yup.string().required(
                  "Please provide a pick-up location!"
                ),
              })}
              validate={validateDateTime}
              onSubmit={(values) => {
                handleSearch(values);
              }}
            >
              {() => (
                <Form className={styles.searchForm}>
                  <h2 className={styles.formTitle}>
                    Find the ideal car rental for your trip
                  </h2>
                  <div className={styles.formGroup}>
                    <label htmlFor="carBrand" className={styles.label}>
                      CAR BRAND
                    </label>
                    <Field
                      type="text"
                      className={styles.input}
                      id="carBrand"
                      name="carBrand"
                    />
                    <ErrorMessage
                      name="carBrand"
                      component="span"
                      className={styles.error}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="pickUpLocation" className={styles.label}>
                      PICK-UP LOCATION
                    </label>
                    <Field
                      type="text"
                      className={styles.input}
                      id="pickUpLocation"
                      name="location"
                    />
                    <ErrorMessage
                      name="location"
                      component="span"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      PICK-UP DATE AND TIME
                    </label>
                    <div className={styles.flexRow}>
                      <Field
                        type="date"
                        className={styles.input}
                        id="pickUpDate"
                        name="sD"
                      />
                      <Field
                        type="time"
                        className={styles.input}
                        id="pickUpTime"
                        name="sT"
                      />
                    </div>
                    <ErrorMessage
                      name="sD"
                      component="span"
                      className={styles.error}
                    />
                    <ErrorMessage
                      name="sT"
                      component="span"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      DROP-OFF DATE AND TIME
                    </label>
                    <div className={styles.flexRow}>
                      <Field
                        type="date"
                        className={styles.input}
                        id="dropOffDate"
                        name="eD"
                      />
                      <Field
                        type="time"
                        className={styles.input}
                        id="dropOffTime"
                        name="eT"
                      />
                    </div>
                    <ErrorMessage
                      name="eD"
                      component="span"
                      className={styles.error}
                    />
                    <ErrorMessage
                      name="eT"
                      component="span"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.buttonWrapper}>
                    <button type="submit" className={styles.button}>
                      SEARCH
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}
