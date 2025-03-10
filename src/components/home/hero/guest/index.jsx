import styles from "./styles.module.css";
import { useSession } from "next-auth/react";

export default function HeroGuest({ onLoginClick }) {
  const { data: session } = useSession();
  const loginState = session?.user ? true : false;

  return (
    <section
      id="hero"
      className={styles.hero}
      style={{
        backgroundImage: `url(background-image.jpg)`,
        borderRadius: "35px",
      }}
    >
      <div className={styles.container}>
        <div className={styles.heroRow}>
          <div className={styles.heroColumn}>
            <h1 className={styles.heroTitle}>
              Looking for a vehicle?
              <br />
              You're at the right place.
            </h1>
            <p className={styles.heroText}>
              Choose between 100's of private cars for rent at really low
              prices!
            </p>
            <div className={styles.heroButtonContainer}>
              <button className={styles.btnHero} onClick={onLoginClick}>
                Find a Rental Car Near You
              </button>
            </div>
          </div>

          <div className={styles.heroColumn}>
            <h1 className={styles.heroTitle}>Are you a car owner?</h1>
            <p className={styles.heroText}>
              List your car and make money from your asset today!
            </p>
            <div className={styles.heroButtonContainer}>
              <button className={styles.btnHero} onClick={onLoginClick}>
                List Your Car Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
