import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";


import { useSession } from "next-auth/react";

export default function Footer({ onLoginClick }) {
  const { data: session } = useSession();
  const loginState = session?.user ? true : false;
  const userRole = session?.user.role;
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.topSection}>
          <div className={styles.logo}>
            <div>
              <div className={`${styles.logoContainer} ${styles.logoLight}`}>
                <Image
                  src={"/logo-color-light.svg"}
                  width={50}
                  height={50}
                  alt="Page Logo"
                ></Image>
              </div>
              <div className={`${styles.logoContainer} ${styles.logoDark}`}>
                <Image
                  src={"/logo-color-dark.svg"}
                  width={50}
                  height={50}
                  alt="Page Logo"
                ></Image>
              </div>
            </div>

            <p className={styles.logoText}>
              <span className={styles.logoTextHl}>AUTO</span> RENTALS
            </p>
          </div>

          <div className={styles.contactBox}>
            <div className={styles.contactItem}>
              <div className={`${styles.iconWrapper} ${styles.phoneWrapper}`}>
                <Image
                  className={styles.phoneIcon}
                  src={"/phone.svg"}
                  alt="Phone"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textWrapper}>
                <div className={styles.textSmall}>Phone</div>
                <div className={styles.contactText}>0123456789</div>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={`${styles.iconWrapper} ${styles.locateWrapper}`}>
                <Image
                  className={styles.locateIcon}
                  src={"/location.svg"}
                  alt="Address"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textWrapper}>
                <div className={styles.textSmall}>Address</div>
                <div className={styles.contactText}>
                  FVille 1 - Hoa Lac Town
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.sectionBox}>
            <h3 className={styles.sectionTitle}>Faucibus faucibus</h3>
            <p className={styles.textSmall}>
              pellentesque dictum turpis. Id pellentesque turpis massa a id
              iaculis lorem t...
            </p>
          </div>

          <div className={styles.sectionBox}>
            <h3 className={styles.sectionTitle}>Customer Access</h3>
            {!loginState ? (
              <ul className={styles.links}>
                <li className={styles.linkItem}>
                  <Link href="#" className={styles.link} onClick={onLoginClick}>
                    My Bookings
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="#" className={styles.link} onClick={onLoginClick}>
                    My Wallet
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="#" className={styles.link} onClick={onLoginClick}>
                    My Car
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="#" className={styles.link} onClick={onLoginClick}>
                    Login
                  </Link>
                </li>
              </ul>
            ) : userRole === "customer" ? (
              <ul className={styles.links}>
                <li className={styles.linkItem}>
                  <Link href="/my-booking" className={styles.link}>
                    My Bookings
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="/my-wallet" className={styles.link}>
                    My Wallet
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="#" className={styles.link}>
                    My Car
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className={styles.links}>
                <li className={styles.linkItem}>
                  <Link href="#" className={styles.link}>
                    My Bookings
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="/my-wallet" className={styles.link}>
                    My Wallet
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="/my-car" className={styles.link}>
                    My Car
                  </Link>
                </li>
                <li className={styles.linkItem}>
                  <Link href="/edit-profile" className={styles.link}>
                    Edit Profile
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className={styles.sectionBox}>
            <h3 className={styles.sectionTitle}>Join Us</h3>
            <div>
              <Link href="#" className={styles.link} onClick={onLoginClick}>
                New User Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          © Copyright Car Rental 2025 by Moc 2
        </div>
      </div>
    </footer>
  );
}
