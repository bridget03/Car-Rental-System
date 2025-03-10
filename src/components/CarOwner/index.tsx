import { useRouter } from "next/router";
import {
  FaCarSide,
  FaClock,
  FaCreditCard,
  FaShieldAlt,
  FaTags,
  FaWallet
} from "react-icons/fa";
import TestimonialSlider from "../TestimonialSlider/TestimonialSlider";
import styles from "./CarOwner.module.css";
import RentalProcess from "./ViewListCars/RentalProcess/RentalProcess";

type Props = {};

const CarOwner = (props: Props) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <RentalProcess />
      {/* money */}
      <main className={styles.money}>
        <section className={styles.section}>
          <h2 className={styles.titleMoney}>Make Money with Your Car</h2>
          <div className={styles.gridContainer}>
            <div className={`${styles.featureCard} ${styles.blue}`}>
              <FaShieldAlt
                className={`${styles.iconMoney} ${styles.blueIcon}`}
              />
              <div>
                <h3 className={styles.featureTitle}>Fully Insured</h3>
                <p className={styles.featureText}>
                  Your car is protected from the moment it's rented
                </p>
              </div>
            </div>
            <div className={`${styles.featureCard} ${styles.green}`}>
              <FaTags className={`${styles.iconMoney} ${styles.greenIcon}`} />
              <div>
                <h3 className={styles.featureTitle}>Set Your Price</h3>
                <p className={styles.featureText}>
                  Complete control over your rental rates
                </p>
              </div>
            </div>
            <div className={`${styles.featureCard} ${styles.purple}`}>
              <FaWallet
                className={`${styles.iconMoney} ${styles.purpleIcon}`}
              />
              <div>
                <h3 className={styles.featureTitle}>Monthly Payouts</h3>
                <p className={styles.featureText}>
                  Get paid directly to your account
                </p>
              </div>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={styles.ctaButton}
              onClick={() => router.push("/cars")}
            >
              <FaCarSide className={styles.buttonIcon} /> List Your Car Today
            </button>
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>How It Works</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <FaClock className={styles.listIcon} />
                <span>Choose your rental dates and terms</span>
              </li>
              <li className={styles.listItem}>
                <FaShieldAlt className={styles.listIcon} />
                <span>We pre-screen all renters for safety</span>
              </li>
              <li className={styles.listItem}>
                <FaCreditCard className={styles.listIcon} />
                <span>Get paid monthly, hassle-free</span>
              </li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Quick Links</h3>
            <div className={styles.linkGrid}>
              <a href="#" className={styles.linkItem}>
                Manage Bookings
              </a>
              <a href="#" className={styles.linkItem}>
                My Wallet
              </a>
              <a href="#" className={styles.linkItem}>
                My Car
              </a>
              <a href="#" className={styles.linkItem}>
                Profile
              </a>
            </div>
          </div>
        </section>
      </main>
      <TestimonialSlider />      
    </div>
  );
};

export default CarOwner;
