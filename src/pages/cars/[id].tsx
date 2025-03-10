import BreadCrumb from "@/components/breadcrumb";
import { BasicInfo } from "@/components/CarInfomation/CarDetails/BasicInfo/BasicInfo";
import { DetailedInfo } from "@/components/CarInfomation/CarDetails/DetailInfo";
import { StarRating } from "@/components/CarInfomation/CarDetails/StarRating/StarRating";
import { Tab } from "@/components/CarInfomation/CarDetails/Tab/Tab";
import { CarImageSlider } from "@/components/CarInfomation/CarImageSlider/CarImageSlider";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import styles from "./CarDetails.module.css";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modals/Modal";
import Overlay from "@/components/Overlay/Overlay";
import { TermsOfUse } from "@/components/CarInfomation/CarDetails/TermUser";
import Link from "next/link";

const fetcher = (url: any) =>
  fetch(url, {
    headers: { "Cache-Control": "no-cache" },
  }).then((res) => res.json());
export default function CarDetail() {
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "terms">(
    "basic"
  );
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const router = useRouter();
  const { id } = router.query;
  const carId = typeof id === "string" ? id : undefined;

  const { data: session } = useSession();
  const {
    data: car,
    error: carError,
    mutate: mutateCar,
  } = useSWR(carId ? `http://localhost:3000/api/cars/${carId}` : null, fetcher);

  const handleStatusChange = (newStatus: string) => {
    if (car.status === "Booked" && newStatus === "Stopped") {
      alert(
        "Your car has been booked. Please contact our administrator if your car is no longer available for rent."
      );
      return;
    }

    if (
      (car.status === "Available" && newStatus === "Stopped") ||
      (car.status === "Stopped" && newStatus === "Available")
    ) {
      setPendingStatus(newStatus);
      setIsModalOpen(true);
    } else {
      confirmStatusChange(newStatus);
    }
  };

  const confirmDeposit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cars/${carId}/confirmDeposit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        await mutate(`/api/cars/${carId}/confirmDeposit`);
        setIsDepositModalOpen(false);
        alert("Deposit confirmed successfully!");
      } else {
        const errorData = await response.json();
        alert(
          errorData.error || "Failed to confirm deposit. Please try again."
        );
      }
    } catch (error) {
      console.error("Error confirming deposit:", error);
      alert("An error occurred while confirming deposit.");
    }
  };
  const confirmStatusChange = async (statusToUpdate?: string) => {
    const status = statusToUpdate || pendingStatus;
    if (!status) return;

    try {
      const response = await fetch(`http://localhost:3000/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await mutateCar();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsModalOpen(false);
      setPendingStatus(null);
    }
  };

  if (router.isFallback || !car) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <BreadCrumb />
      <div className={styles.header}>
        <h1>{car.name}</h1>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          {car.images && <CarImageSlider images={Object.values(car.images)} />}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.basicStats}>
            <StarRating rating={car.ratings} />
            <div className={styles.stat}>
              <span>No. of rides:</span>
              <span>{car.rides}</span>
            </div>
            <div className={styles.stat}>
              <span>Price:</span>

              <span>
                {Number(car.basePrice).toLocaleString("vi-VN")}
                <sup>đ</sup> /day
              </span>
            </div>
            <div className={styles.stat}>
              <span>Location:</span>
              <span>{car.location}</span>
            </div>

            <div className={styles.status}>
              {session?.user?.role === "carOwner" ? (
                <div className={styles.customDropdown} ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`${styles.dropdownToggle} ${
                      car.status === "Available" || car.status === "Booked"
                        ? styles.available
                        : styles.stopped
                    }`}
                  >
                    {car.status === "Stopped" ? "Stopped" : "Available"} ▼
                  </button>
                  {showDropdown && (
                    <div className={styles.dropdownMenu}>
                      <div
                        onClick={() => {
                          handleStatusChange("Available");
                          setShowDropdown(false);
                        }}
                        className={styles.dropdownItem}
                      >
                        <span className={styles.available}>Available</span>
                      </div>
                      <div
                        onClick={() => {
                          handleStatusChange("Stopped");
                          setShowDropdown(false);
                        }}
                        className={styles.dropdownItem}
                      >
                        <span className={styles.stopped}>Stopped</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <span
                  className={
                    car.status === "Available"
                      ? styles.available
                      : car.status === "Stopped"
                      ? styles.stopped
                      : styles.booked
                  }
                >
                  {car.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <Tab
          active={activeTab === "basic"}
          onClick={() => setActiveTab("basic")}
        >
          Basic Information
        </Tab>
        <Tab
          active={activeTab === "details"}
          onClick={() => setActiveTab("details")}
        >
          Details
        </Tab>
        <Tab
          active={activeTab === "terms"}
          onClick={() => setActiveTab("terms")}
        >
          Terms of use
        </Tab>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "basic" && <BasicInfo car={car} />}
        {activeTab === "details" && car && (
          <DetailedInfo
            car={car}
            editMode={session?.user?.role === "carOwner"}
            mutate={mutateCar}
          />
        )}

        {activeTab === "terms" && car && (
          <TermsOfUse
            car={car}
            editMode={session?.user?.role === "carOwner"}
            mutate={mutateCar}
          />
        )}
      </div>

      <Overlay
        isOpen={isModalOpen}
        handleCloseModal={() => {
          setIsModalOpen(false);
          setPendingStatus(null);
        }}
      >
        <Modal
          type="confirm"
          title="Confirm Status Change"
          handleCloseModal={() => {
            setIsModalOpen(false);
            setPendingStatus(null);
          }}
          onConfirm={confirmStatusChange}
          confirmText="Yes"
          cancelText="Cancel"
        >
          <p>
            {pendingStatus === "Stopped"
              ? "Are you sure you want to stop renting this car?"
              : "Are you sure you want to start renting this car?"}
          </p>{" "}
        </Modal>
      </Overlay>

      <Overlay
        isOpen={isDepositModalOpen}
        handleCloseModal={() => setIsDepositModalOpen(false)}
      >
        <Modal
          type="confirm"
          title="Confirm Deposit"
          handleCloseModal={() => setIsDepositModalOpen(false)}
          onConfirm={confirmDeposit}
          confirmText="Yes"
          cancelText="Cancel"
        >
          <p>
            Please confirm that you have receive the deposit this booking.
            <br />
            This will allow the customer to pick-up the car at the agreed date
            and time
          </p>
        </Modal>
      </Overlay>
    </div>
  );
}
