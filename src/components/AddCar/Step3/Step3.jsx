import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./step3.module.css";

export default function Step3({ state, dispatch, nextStep, prevStep }) {
  const validationSchema = Yup.object({
    basePrice: Yup.number()
      .required("Base price is required")
      .min(0, "Base price must be positive"),
    deposit: Yup.number()
      .required("Deposit is required")
      .min(0, "Deposit must be positive"),
    termsOfUse: Yup.string().when("otherChecked", {
      is: true,
      then: Yup.string().required("Please specify additional terms"),
    }),
  });

  return (
    <Formik
      initialValues={{
        basePrice: state.basePrice || "",
        deposit: state.deposit || "",
        noSmoking: state.noSmoking || false,
        noPet: state.noPet || false,
        noFood: state.noFood || false,
        other: state.other || false,
        termsOfUse: state.termsOfUse || "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        dispatch({ type: "UPDATE_STEP3", payload: values });
        nextStep();
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className={styles.formContainer}>
          <div className={styles.formGroup}>
            <h2>Set the base price for your car:</h2>
            <div className={styles.inputRow}>
              <Field
                type="number"
                name="basePrice"
                className={styles.inputField}
              />
              <span>VND/day</span>
            </div>
            <ErrorMessage
              name="basePrice"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <h2>Required deposit:</h2>
            <div className={styles.inputRow}>
              <Field
                type="number"
                name="deposit"
                className={styles.inputField}
              />
              <span>VND</span>
            </div>
            <ErrorMessage
              name="deposit"
              component="span"
              className={styles.error}
            />
          </div>

          <h2>Terms of use:</h2>
          <div className={styles.termsContainer}>
            <label className={styles.checkboxLabel}>
              <Field
                type="checkbox"
                name="noSmoking"
                checked={values.noSmoking}
                onChange={(e) => setFieldValue("noSmoking", e.target.checked)}
              />
              No smoking
            </label>

            <label className={styles.checkboxLabel}>
              <Field
                type="checkbox"
                name="noPet"
                checked={values.noPet}
                onChange={(e) => setFieldValue("noPet", e.target.checked)}
              />
              No pet
            </label>

            <label className={styles.checkboxLabel}>
              <Field
                type="checkbox"
                name="noFood"
                checked={values.noFood}
                onChange={(e) => setFieldValue("noFood", e.target.checked)}
              />
              No food in car
            </label>

            <label className={styles.checkboxLabel}>
              <Field
                type="checkbox"
                name="other"
                checked={values.other}
                onChange={(e) => {
                  setFieldValue("other", e.target.checked);
                  if (!e.target.checked) setFieldValue("termsOfUse", "");
                }}
              />
              Other
            </label>
          </div>

          {values.other && (
            <div className={styles.textAreaContainer}>
              <p>Please specify:</p>
              <Field
                as="textarea"
                name="termsOfUse"
                rows="4"
                className={styles.textArea}
              />
              <ErrorMessage
                name="termsOfUse"
                component="span"
                className={styles.error}
              />
            </div>
          )}

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
  );
}
