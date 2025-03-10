import styles from "./step2.module.css";
import { useState, useEffect } from "react";

import CustomImageInput from "@/components/singularImageUpload";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Step2({ state, dispatch, nextStep, prevStep }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    fetch("/api/address")
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch((err) => console.error("Error fetching address data:", err));
  }, []);

  const handleCityChange = (event, setFieldValue) => {
    const cityName = event.target.value;
    const city = addresses.find((c) => c.name === cityName);
    setSelectedCity(city || null);
    setSelectedDistrict(null);
    setFieldValue("city", cityName);
    setFieldValue("district", "");
    setFieldValue("ward", "");
  };

  const handleDistrictChange = (event, setFieldValue) => {
    const districtName = event.target.value;
    const district = selectedCity?.districts.find(
      (d) => d.name === districtName
    );
    setSelectedDistrict(district || null);
    setFieldValue("district", districtName);
    setFieldValue("ward", "");
  };

  return (
    <>
      <Formik
        initialValues={{
          mileage: state.mileage,
          fuel: state.fuel,
          city: state.city,
          district: state.district,
          ward: state.ward,
          street: state.street,

          bluetooth: state.bluetooth || false,
          gps: state.gps || false,
          camera: state.camera || false,
          sunRoof: state.sunRoof || false,
          childLock: state.childLock || false,
          childSeat: state.childSeat || false,
          dvd: state.dvd || false,
          usb: state.usb || false,

          images: {
            front: state.front,
            back: state.back,
            left: state.left,
            right: state.right,
          },
        }}
        validationSchema={Yup.object({
          mileage: Yup.string().required("Mileage is required"),
          fuel: Yup.string().required("Fuel consumption is required"),
          city: Yup.string().required("Please select a city"),
          district: Yup.string().required("Please select a district"),
          ward: Yup.string().required("Please select a ward"),
          street: Yup.string().required("Street address is required"),
        })}
        onSubmit={(values) => {
          console.log("step2", values);
          dispatch({ type: "UPDATE_STEP2", payload: values });
          nextStep();
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className={styles.addForm}>
            <div className={styles.inputField}>
              {/* Left */}
              <div>
                <div className={styles.formGroup}>
                  <label>Mileage:</label>
                  <Field type="text" name="mileage" />
                  <ErrorMessage
                    name="mileage"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Address:</label>
                  <Field
                    type="text"
                    name="address"
                    placeholder="Search for an address"
                  />
                  <div className={styles.formGroup}>
                    <label>City:</label>
                    <Field
                      as="select"
                      name="city"
                      onChange={(e) => handleCityChange(e, setFieldValue)}
                      className={styles.addressSelect}
                    >
                      <option value="">Select city</option>
                      {addresses.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="city"
                      component="span"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>District:</label>
                    <Field
                      as="select"
                      name="district"
                      onChange={(e) => handleDistrictChange(e, setFieldValue)}
                      disabled={!selectedCity}
                      className={styles.addressSelect}
                    >
                      <option value="">Select district</option>
                      {selectedCity?.districts.map((district) => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="district"
                      component="span"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ward:</label>

                    <Field
                      as="select"
                      name="ward"
                      disabled={!selectedDistrict}
                      className={styles.addressSelect}
                    >
                      <option value="">Select ward</option>
                      {selectedDistrict?.wards.map((ward) => (
                        <option key={ward.name} value={ward.name}>
                          {ward.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="ward"
                      component="span"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Street (House number, Street name):</label>
                    <Field
                      type="text"
                      name="street"
                      placeholder="e.g. 123 Main St"
                      className={styles.addressSelect}
                    />
                    <ErrorMessage
                      name="street"
                      component="span"
                      className={styles.error}
                    />
                  </div>
                </div>
              </div>
              {/* Right */}
              <div>
                <div className={styles.formGroup}>
                  <label>Fuel consumption:</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                    }}
                  >
                    <Field type="text" name="fuel" style={{ width: "5rem" }} />
                    <span style={{ lineHeight: "2rem" }}>liter/100 km</span>
                  </div>
                  <ErrorMessage
                    name="fuel"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Description:</label>
                  <Field
                    type="textArea"
                    name="description"
                    placeholder="Description of your vehicle"
                    className={styles.description}
                  />
                  <ErrorMessage
                    name="description"
                    component="span"
                    className={styles.error}
                  />
                </div>
              </div>
            </div>

            <h2 className={styles.title}>Additional Functions</h2>
            <div className={styles.checkboxGrid}>
              <div className={styles.col}>
                <label>
                  <Field
                    type="checkbox"
                    name="bluetooth"
                    checked={values.bluetooth}
                    onChange={(e) =>
                      setFieldValue("bluetooth", e.target.checked)
                    }
                  />
                  Bluetooth
                </label>
                <label>
                  <Field
                    type="checkbox"
                    name="gps"
                    checked={values.gps}
                    onChange={(e) => setFieldValue("gps", e.target.checked)}
                  />
                  GPS
                </label>
                <label>
                  <Field
                    type="checkbox"
                    name="camera"
                    checked={values.camera}
                    onChange={(e) => setFieldValue("camera", e.target.checked)}
                  />
                  Camera
                </label>
              </div>
              <div className={styles.col}>
                <label>
                  <Field
                    type="checkbox"
                    name="sunRoof"
                    checked={values.sunRoof}
                    onChange={(e) => setFieldValue("sunRoof", e.target.checked)}
                  />
                  Sun Roof
                </label>
                <label>
                  <Field
                    type="checkbox"
                    name="childLock"
                    checked={values.childLock}
                    onChange={(e) =>
                      setFieldValue("childLock", e.target.checked)
                    }
                  />
                  Child Lock
                </label>
                <label>
                  <Field
                    type="checkbox"
                    name="childSeat"
                    checked={values.childSeat}
                    onChange={(e) =>
                      setFieldValue("childSeat", e.target.checked)
                    }
                  />
                  Child Seat
                </label>
              </div>
              <div className={styles.col}>
                <label>
                  <Field
                    type="checkbox"
                    name="dvd"
                    checked={values.dvd}
                    onChange={(e) => setFieldValue("dvd", e.target.checked)}
                  />
                  DVD
                </label>
                <label>
                  <Field
                    type="checkbox"
                    name="usb"
                    checked={values.usb}
                    onChange={(e) => setFieldValue("usb", e.target.checked)}
                  />
                  USB
                </label>
              </div>
            </div>

            <h2 className={styles.title}>Images</h2>
            <div className={styles.upload}>
              <div>
                <div className={styles.formGroup}>
                  <label>Front:</label>
                  <Field
                    name="front"
                    component={CustomImageInput}
                    className={styles.uploadField}
                  />

                  <ErrorMessage
                    name="front"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Back:</label>
                  <Field
                    name="back"
                    component={CustomImageInput}
                    className={styles.uploadField}
                  />
                  <ErrorMessage
                    name="back"
                    component="span"
                    className={styles.error}
                  />
                </div>
              </div>
              <div>
                <div className={styles.formGroup}>
                  <label>Right:</label>
                  <Field
                    name="right"
                    component={CustomImageInput}
                    className={styles.uploadField}
                  />
                  <ErrorMessage
                    name="right"
                    component="span"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Left:</label>
                  <Field
                    name="left"
                    component={CustomImageInput}
                    className={styles.uploadField}
                  />
                  <ErrorMessage
                    name="left"
                    component="span"
                    className={styles.error}
                  />
                </div>
              </div>
            </div>
            <p>
              Please include full 4 images of your vehicle <br /> File type:
              .jpg, .jpeg, .png, .gif
            </p>
            <div className={styles.buttonWrapper}>
              <button
                type="button"
                onClick={prevStep}
                style={{ backgroundColor: "#888" }}
              >
                Back
              </button>
              <button type="submit">Next</button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
