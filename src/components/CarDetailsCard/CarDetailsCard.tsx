import styles from "./styles.module.css";
import { StarRating } from "../CarInfomation/CarDetails/StarRating/StarRating";
import { CarImageSlider } from "../CarInfomation/CarImageSlider/CarImageSlider";
import { formatCurrencyForFrontend, currencySymbol } from "@/utils/Currency";

export default function CarDetailsCard({ car }: { car: any }) {
    return (
        <div className={styles.mainContent}>
            {car.images && <CarImageSlider images={Object.values(car.images)} />}

            <div className={styles.basicStats}>
                <StarRating rating={car.ratings} />

                <div className={styles.stat}>
                    <span className={styles.statTitle}>No. of rides:</span>
                    <span className={styles.statContent}>{car.rides}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statTitle}>Price:</span>
                    <span className={styles.statContent}>
                        {formatCurrencyForFrontend(car.basePrice)}
                        <sup>{currencySymbol}</sup> / day
                    </span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statTitle}>Location:</span>
                    <span className={styles.statContent}>{car.location}</span>
                </div>
                <div
                    className={`${styles.status} ${car.status === "Available" ? styles.available : styles.unavailable}`}
                >
                    {car.status}
                </div>
            </div>
        </div>
    );
}
