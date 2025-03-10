import { CarDetails } from "@/utils/types/Car";
import styles from "./BasicInfo.module.css";
import DocumentTable from "../../DocumentTable";

interface BasicInfoProps {
  car: CarDetails;
  editMode?: boolean;
}
export const BasicInfo: React.FC<BasicInfoProps> = ({
  car,
  editMode = false,
}) => {
  const formattedDocuments = [
    {
      id: 1,
      name: "Registration Certificate",
      link: car.document?.[0] || "",
      status: car.document?.[0]
        ? ("Verified" as const)
        : ("Not available" as const),
    },
    {
      id: 2,
      name: "Certificate of Inspection",
      link: car.document?.[1] || "",
      status: car.document?.[1]
        ? ("Verified" as const)
        : ("Not available" as const),
    },
    {
      id: 3,
      name: "Insurance",
      link: car.document?.[2] || "",
      status: car.document?.[2]
        ? ("Verified" as const)
        : ("Not available" as const),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.license}>
        <span className={styles.label}>License:</span>
        <span className={styles.value}>{car?.license}</span>
      </div>
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.label}>Brand:</span>
          <span className={styles.value}>{car.brand}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Model:</span>
          <span className={styles.value}>{car.model}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Color:</span>
          <span className={styles.value}>{car.color}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Production year:</span>
          <span className={styles.value}>{car.productionYear}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Number of seats:</span>
          <span className={styles.value}>{car.numberOfSeats}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Transmission:</span>
          <span className={styles.value}>{car.transmissionType}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Fuel type:</span>
          <span className={styles.value}>{car.fuelType}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Mileage:</span>
          <span className={styles.value}>{car.mileage} km</span>
        </div>
      </div>
      <div className={styles.document}>
        <p className={styles.textDoc}>Documents:</p>
        <DocumentTable documents={formattedDocuments} editMode={editMode} />
      </div>
    </div>
  );
};
