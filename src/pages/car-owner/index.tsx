import CarOwner from "@/components/CarOwner";
import styles from "./styles.module.css";
type Props = {};

const CarOwnerPage = (props: Props) => {
  return (
    <div
      style={{
        backgroundColor: "var(--background)",
      }}
    >
      <main className={styles.container}>
        <CarOwner />
      </main>
    </div>
  );
};

export default CarOwnerPage;

