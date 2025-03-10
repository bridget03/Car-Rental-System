import styles from "./styles.module.css";
import { Link } from "next/link";
import { redirect } from "next/navigation";
export default function index() {
  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.discount}>
        <h1>Book a car with 15% discount for 2 days</h1>
      </div>
    </div>
  );
}
