import { StarRating } from "@/components/CarInfomation/CarDetails/StarRating/StarRating";
import { CarImageSlider } from "@/components/CarInfomation/CarImageSlider/CarImageSlider";
import { BsSpeedometer2 } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";
import { StatusBadge } from "../StatusBadge";
import styles from "./CarCard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BookingModal } from "@/components/BookingModal";
import Overlay from "@/components/Overlay/Overlay";
export const CarCard = ({
  car,
  hasPendingDeposit,
  hasConfirm = false,
  onConfirmDeposit,
  hasPendingPayment,
  onConfirmPayment,
}: any) => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const carImages: string[] = Object.values(car.images);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookingSubmit = (values: any) => {
    console.log("Booking Info:", values);
    setIsModalOpen(false);
  };
  console.log("Car ID:", car.id);
  console.log("User Role:", userRole);
  console.log("Has Pending Deposit:", hasPendingDeposit);

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        {/* Ảnh */}
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <CarImageSlider images={carImages} />

            <div className={styles.statusBadge}>
              <StatusBadge status={car.status} />
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.title}>{car.name}</h3>
              <p className={styles.brandModel}>
                {car.brand} - {car.model} ({car.productionYear})
              </p>
              <div className={styles.location}>
                <FaMapMarkerAlt className={styles.locationIcon} />
                <span className={styles.locationText}>{car.location}</span>
              </div>
            </div>
            <div className={styles.price}>
              <div className={styles.priceAmount}>
                {Number(car.basePrice).toLocaleString("vi-VN")}
                <sup>₫</sup>
                <span> /Day</span>
              </div>
              <div className={styles.priceLabel}>
                Deposit: {Number(car.deposit).toLocaleString("vi-VN")}
                <sup>₫</sup>
              </div>
            </div>
          </div>

          {/* Thông tin xe */}
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <MdLocalGasStation className={styles.detailIcon} />
              <span>
                {car.fuelType} ({car.fuelConsumption}L/100km)
              </span>
            </div>
            <div className={styles.detailItem}>
              <BsSpeedometer2 className={styles.detailIcon} />
              <span>{car.mileage} km</span>
            </div>
            <div className={styles.detailItem}>
              <span>⚙️ {car.transmissionType}</span>
            </div>
            <div className={styles.detailItem}>
              <span>🎨 {car.color}</span>
            </div>
            <div className={styles.detailItem}>
              <span>🪑 {car.numberOfSeats} Seats</span>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <StarRating rating={car.ratings} />
          </div>

          <div className={styles.btns}>
            <button
              className={styles.book}
              onClick={() => router.push(`/cars/${car.id}`)}
            >
              <span>View details</span>
            </button>

            {userRole !== "carOwner" && (
              <button
                className={styles.book}
                onClick={() => setIsModalOpen(true)}
              >
                <span>Book Now →</span>
              </button>
            )}
            <Overlay
              isOpen={isModalOpen}
              handleCloseModal={() => setIsModalOpen(false)}
            >
              <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleBookingSubmit}
                car={car}
              />
            </Overlay>
            {userRole === "carOwner" && hasPendingDeposit && (
              <button
                className={styles.book}
                onClick={() => onConfirmDeposit(car.id)}
              >
                <span>Confirm Deposit</span>
              </button>
            )}

            {userRole === "carOwner" && hasPendingPayment && (
              <button
                className={styles.book}
                onClick={() => onConfirmPayment(car.id)}
              >
                <span>Confirm Payment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
