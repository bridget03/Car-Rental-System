import styles from "./step4.module.css";
import { CarImageSlider } from "@components/CarInfomation/CarImageSlider/CarImageSlider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Step4({ state, prevStep }) {
  const { data: session } = useSession();
  const statePosts = {
    id: "",
    name: `${state.step1.brandName} ${state.step1.model} ${state.step1.productionYear}`,
    location: `${state.step2.district}, ${state.step2.city}`,
    status: "Available",
    ownerId: session?.user?.id,
    brand: `${state.step1.brandName}`,
    model: `${state.step1.model}`,
    color: `${state.step1.color}`,
    license: `${state.step1.license}`,
    numberOfSeats: `${state.step1.noOfSeats}`,
    productionYear: `${state.step1.productionYear}`,
    transmissionType: `${state.step1.transmission}`,
    fuelType: `${state.step1.fuel}`,
    mileage: `${state.step2.mileage}`,
    fuelConsumption: `${state.step2.fuel}`,
    basePrice: `${state.step3.basePrice}`,
    deposit: `${state.step3.deposit}`,
    ratings: 0,
    rides: 0,
    features: {
      bluetooth: state.step2.bluetooth,
      gps: state.step2.gps,
      camera: state.step2.camera,
      sunRoof: state.step2.sunRoof,
      childLock: state.step2.childLock,
      childSeat: state.step2.childSeat,
      dvd: state.step2.dvd,
      usb: state.step2.usb,
    },
    images: {
      front: state.step2.front,
      back: state.step2.back,
      left: state.step2.left,
      right: state.step2.right,
    },
    rules: {
      noSmoking: state.step3.noSmoking,
      noPet: state.step3.noPet,
      noFood: state.step3.noFood,
      other: state.step3.other,
      otherConditions: state.step3.otherConditions || "",
    },
    document: [
      state.step1.registrationCertificate,
      state.step1.certificateOfInspection,
      state.step1.insurance,
    ],
  };

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statePosts),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Car data submitted successfully!");
      router.push("/cars");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  return (
    <>
      <h2 className={styles.title}>Preview</h2>
      <div className={styles.container}>
        <div className={styles.carContainer}>
          <div className={styles.carImage}>
            <CarImageSlider
              default={false}
              images={[
                state.step2.front,
                state.step2.back,
                state.step2.left,
                state.step2.right,
              ]}
            />
          </div>
          <div className={styles.carInfo}>
            <h1>
              {state.step1.brandName} {state.step1.model}{" "}
              {state.step1.productionYear}
            </h1>

            <p>
              <strong>Price: </strong>
              {state.step3.basePrice} VND/day
            </p>
            <p>
              <strong>Location:</strong> {state.step2.ward},{" "}
              {state.step2.district},{state.step2.city}
            </p>
            <p>
              <strong>Fuel Consumption:</strong> {state.step2.fuel || "N/A"}{" "}
              L/100km
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "green", fontWeight: "bold" }}>
                Available
              </span>
            </p>
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <button
            type="button"
            onClick={prevStep}
            style={{ backgroundColor: "#888" }}
          >
            Back
          </button>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
