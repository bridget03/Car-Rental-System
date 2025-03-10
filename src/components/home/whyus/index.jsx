import styles from "./styles.module.css";
import { BsCash } from "react-icons/bs";
import { PiMapPinArea, PiHeadsetDuotone, PiGavel } from "react-icons/pi";

export default function WhyUs() {
  return (
    <section id="about-us" className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.heading}>
          <span>Why</span> us?
        </h1>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.box}>
              <div className={styles.boxIcon}>
                <BsCash />
              </div>
              <h3 className={styles.boxTitle}>Save money</h3>
              <p>
                We have no setup or registration fees. You are only charged when
                you rent a car. So get started for FREE!
              </p>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.box}>
              <div className={styles.boxIcon}>
                <PiMapPinArea />
              </div>
              <h3 className={styles.boxTitle}>Convenient</h3>
              <p>
                We have a large selection of privately owned cars to suit your
                needs throughout the country.
              </p>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.box}>
              <div className={styles.boxIcon}>
                <PiGavel />
              </div>
              <h3 className={styles.boxTitle}>Legal and insurance</h3>
              <p>
                We fully cover all rentals and even provide roadside assistance.
                Our rating system and extended member profile checks provide
                safety.
              </p>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.box}>
              <div className={styles.boxIcon}>
                <PiHeadsetDuotone />
              </div>
              <h3 className={styles.boxTitle}>24/7 support</h3>
              <p>
                Our team is ready to support you every step of the way with our
                hotline and 24/7 service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
