import { useState } from "react";
import { CarDetails } from "@/utils/types/Car";
import styles from "./styles.module.css";
import { FaCheck } from "react-icons/fa";
import { ErrorMessage, Field, Form, Formik, FormikErrors } from "formik";
import CustomImageInput from "@/components/singularImageUpload";

interface DetailedInfoProps {
  car: CarDetails;
  editMode?: boolean;
  mutate: () => void;
}

export const DetailedInfo: React.FC<DetailedInfoProps> = ({
  car,
  editMode = false,
  mutate,
}) => {
  const [carData, setCarData] = useState(car);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleFeatureToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const feature = e.target.name as keyof CarDetails["features"];
    setCarData({
      ...carData,
      features: {
        ...carData?.features,
        [feature]: e.target.checked,
      },
    });
  };

  const handleImageChange = async (
    position: "front" | "back" | "left" | "right",
    url: string
  ): Promise<void | FormikErrors<any>> => {
    setCarData({
      ...carData,
      images: {
        ...carData.images,
        [position]: url,
      },
    });
    return Promise.resolve();
  };
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cars/${carData?.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(carData),
        }
      );

      if (response.ok) {
        alert("Car details updated successfully!");
        mutate();
      } else {
        console.error("Failed to update car details");
        alert("Failed to update car details");
      }
    } catch (error) {
      console.error("Error updating car details:", error);
      alert("Error updating car details");
    }
  };

  const createFormikMock = (position: string) => ({
    setFieldValue: async (_, value: any) =>
      handleImageChange(position as "front" | "back" | "left" | "right", value),
    setFieldError: () => Promise.resolve(),
    setFieldTouched: () => Promise.resolve(),
    validateField: () => Promise.resolve(),
  });
  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Mileage:</span>
          {editMode ? (
            <div className={styles.inputWrapper}>
              <input
                type="number"
                name="mileage"
                value={carData?.mileage}
                onChange={handleChange}
              />
            </div>
          ) : (
            <span className={styles.value}>{carData?.mileage} km</span>
          )}
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Fuel consumption:</span>
          {editMode ? (
            <div className={styles.inputWrapper}>
              <input
                type="number"
                name="fuelConsumption"
                value={carData?.fuelConsumption}
                onChange={handleChange}
              />
              <label>liter/100 km</label>
            </div>
          ) : (
            <span className={styles.value}>
              {carData?.fuelConsumption} liter/100 km
            </span>
          )}
        </div>
      </div>

      <div className={styles.address}>
        <h3>Address:</h3>
        {editMode ? (
          <input
            type="text"
            name="location"
            value={carData?.location}
            onChange={handleChange}
          />
        ) : (
          <p className={styles.note}>{carData?.location}</p>
        )}
      </div>

      <div className={styles.features}>
        <h3>Additional functions:</h3>
        <div className={styles.featureGrid}>
          {Object.keys(carData?.features).map((key) => (
            <div key={key} className={styles.feature}>
              {editMode ? (
                <label className={styles.featureLabel}>
                  <input
                    type="checkbox"
                    name={key}
                    checked={
                      carData?.features[key as keyof CarDetails["features"]]
                    }
                    onChange={handleFeatureToggle}
                  />
                  {key}
                </label>
              ) : (
                <>
                  {carData?.features[key as keyof CarDetails["features"]] && (
                    <FaCheck size={16} />
                  )}
                  <span className={styles.featureText}>{key}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
     {/* Image Upload  */}
     {editMode && (
        <div className={styles.imageGrid}>
          {(['front', 'back', 'left', 'right'] as const).map(position => (
            <div key={position} className={styles.imageUpload}>
              <h4>{position.charAt(0).toUpperCase() + position.slice(1)} </h4>
              <CustomImageInput
                field={{
                  name: position,
                  value: carData.images?.[position] || '',
                  onChange: () => {},
                  onBlur: () => {}
                }}
                form={createFormikMock(position)}
                cloudinaryFolder="rentcar/all"
              />
            </div>
          ))}
        </div>
      )}

      {/* Display Images in View Mode */}
      {/* {!editMode && carData.images && (
        <div className={styles.imageGrid}>
          {Object.entries(carData.images).map(([position, url]) => (
            <div key={position} className={styles.imageDisplay}>
              <h4>{position.charAt(0).toUpperCase() + position.slice(1)} View</h4>
              <img src={url} alt={`${position} view`} className={styles.carImage} />
            </div>
          ))}
        </div>
      )} */}
      <div className={styles.buttons}>
        {editMode ? (
          <>
            <button className={styles.cancelButton}>Discard</button>
            <button onClick={handleSave} className={styles.saveButton}>
              Save
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
