import { useState } from "react";
import { CarDetails } from "@/utils/types/Car";
import styles from "./styles.module.css";
import { FaCheck } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";

interface TermsOfUseProps {
  car: CarDetails;
  editMode?: boolean;
  mutate: () => void;
}

export const TermsOfUse: React.FC<TermsOfUseProps> = ({
  car,
  editMode = false,
  mutate,
}) => {
  const [carData, setCarData] = useState(car);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleRuleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rule = e.target.name as keyof CarDetails["rules"];
    setCarData({
      ...carData,
      rules: {
        ...carData.rules,
        [rule]: e.target.checked,
      },
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cars/${carData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(carData),
        }
      );

      if (response.ok) {
        alert("Terms updated successfully!");
        mutate();
      } else {
        console.error("Failed to update terms");
        alert("Failed to update terms");
      }
    } catch (error) {
      console.error("Error updating terms:", error);
      alert("Error updating terms");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pricing}>
        <div className={styles.priceItem}>
          <span className={styles.label}>Base price (VND/Day):</span>
          {editMode ? (
            <input
              type="number"
              name="basePrice"
              value={carData.basePrice}
              onChange={handleChange}
            />
          ) : (
            <span className={styles.value}>
              {Number(carData.basePrice).toLocaleString("vi-VN")}
            </span>
          )}
        </div>
        <div className={styles.priceItem}>
          <span className={styles.label}>Required deposit (VND):</span>
          {editMode ? (
            <input
              type="number"
              name="deposit"
              value={carData.deposit}
              onChange={handleChange}
            />
          ) : (
            <span className={styles.value}>
              {Number(carData.deposit).toLocaleString("vi-VN")}
            </span>
          )}
        </div>
      </div>

      <div className={styles.rules}>
        <h3>Terms of use</h3>
        <div className={styles.rulesList}>
          {Object.keys(carData.rules).map((key) => (
            <div key={key} className={styles.rule}>
              <div className={styles.ruleHeader}>
                {editMode ? (
                  <input
                    type="checkbox"
                    name={key}
                    checked={carData.rules[key as keyof CarDetails["rules"]]}
                    onChange={handleRuleToggle}
                  />
                ) : carData.rules[key as keyof CarDetails["rules"]] ? (
                  <FaCheck className={styles.checkIcon} size={20} />
                ) : (
                  <TiDeleteOutline className={styles.xIcon} size={20} />
                )}
              </div>
              <div className={styles.ruleText}>
                <p className={styles.ruleTitle}>
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editMode && (
        <div className={styles.buttons}>
          <button className={styles.cancelButton}>Discard</button>
          <button onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};
